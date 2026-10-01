//! JWT authentication against the MindBoop Rails API.
//!
//! Tokens never reach the webview: the access token lives in memory here and
//! the refresh token in the OS credential store. The frontend only sees the
//! signed-in user.

mod error;
mod store;

use std::collections::HashMap;
use std::time::{Duration, Instant};

use reqwest::{Method, RequestBuilder, StatusCode};
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::sync::Mutex;

pub use error::AuthError;
use store::TokenStore;

/// Override at build time, e.g. `MINDBOOP_API_URL=https://api.mindboop.app pnpm tauri build`.
const API_URL: &str = match option_env!("MINDBOOP_API_URL") {
    Some(url) => url,
    None => "http://localhost:3000",
};

/// Refresh a little early so a token doesn't expire mid-request.
const EXPIRY_LEEWAY: Duration = Duration::from_secs(30);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: String,
}

#[derive(Deserialize)]
struct TokenResponse {
    access_token: String,
    expires_in: u64,
    refresh_token: String,
    user: User,
}

#[derive(Deserialize)]
struct ErrorResponse {
    error: String,
    #[serde(default)]
    details: HashMap<String, Vec<String>>,
}

#[derive(Deserialize)]
struct MeResponse {
    user: User,
}

#[derive(Clone)]
struct AccessToken {
    value: String,
    expires_at: Instant,
}

#[derive(Default)]
struct Session {
    access_token: Option<AccessToken>,
    user: Option<User>,
}

pub struct AuthState {
    http: reqwest::Client,
    store: TokenStore,
    // Held across refreshes so concurrent callers never present the same
    // refresh token twice; the server treats a replay as theft.
    session: Mutex<Session>,
}

impl Default for AuthState {
    fn default() -> Self {
        Self {
            http: reqwest::Client::builder()
                .timeout(Duration::from_secs(15))
                .build()
                .expect("failed to build HTTP client"),
            #[allow(clippy::default_constructed_unit_structs)] // not a unit struct on mobile
            store: TokenStore::default(),
            session: Mutex::default(),
        }
    }
}

impl AuthState {
    fn url(path: &str) -> String {
        format!("{API_URL}/api/v1{path}")
    }

    pub async fn signup(
        &self,
        name: &str,
        email: &str,
        password: &str,
    ) -> Result<User, AuthError> {
        let body = json!({ "name": name, "email": email, "password": password });
        let tokens = self.request_tokens("/auth/signup", &body).await?;
        self.start_session(tokens).await
    }

    pub async fn login(&self, email: &str, password: &str) -> Result<User, AuthError> {
        let body = json!({ "email": email, "password": password });
        let tokens = self.request_tokens("/auth/login", &body).await?;
        self.start_session(tokens).await
    }

    pub async fn logout(&self) -> Result<(), AuthError> {
        let mut session = self.session.lock().await;
        *session = Session::default();

        if let Some(refresh_token) = self.store.load()? {
            // Best effort: the local session ends even if the server is unreachable.
            let _ = self
                .http
                .post(Self::url("/auth/logout"))
                .json(&json!({ "refresh_token": refresh_token }))
                .send()
                .await;
        }
        self.store.clear()
    }

    /// Resumes a session from a stored refresh token on launch. Returns
    /// `Ok(None)` when there is nothing to restore or the token was rejected.
    pub async fn restore_session(&self) -> Result<Option<User>, AuthError> {
        let mut session = self.session.lock().await;
        if session.user.is_some() {
            return Ok(session.user.clone());
        }
        if self.store.load()?.is_none() {
            return Ok(None);
        }
        match self.refresh_locked(&mut session).await {
            Ok(()) => Ok(session.user.clone()),
            Err(AuthError::Unauthorized { .. }) => Ok(None),
            Err(err) => Err(err),
        }
    }

    pub async fn current_user(&self) -> Result<User, AuthError> {
        let me: MeResponse = self
            .authorized_json(Method::GET, "/auth/me", |req| req)
            .await?;
        self.session.lock().await.user = Some(me.user.clone());
        Ok(me.user)
    }

    /// Sends an authenticated request, refreshing the access token when it is
    /// about to expire or the server rejects it.
    pub async fn authorized_json<T: DeserializeOwned>(
        &self,
        method: Method,
        path: &str,
        build: impl Fn(RequestBuilder) -> RequestBuilder,
    ) -> Result<T, AuthError> {
        let token = self.valid_access_token().await?;
        let send = |token: &str| {
            build(
                self.http
                    .request(method.clone(), Self::url(path))
                    .bearer_auth(token),
            )
            .send()
        };

        let mut response = send(&token).await?;
        if response.status() == StatusCode::UNAUTHORIZED {
            let token = self.force_refresh(&token).await?;
            response = send(&token).await?;
        }
        if response.status() == StatusCode::UNAUTHORIZED {
            return Err(AuthError::unauthorized());
        }
        if !response.status().is_success() {
            return Err(AuthError::server(response.status()));
        }
        Ok(response.json().await?)
    }

    async fn valid_access_token(&self) -> Result<String, AuthError> {
        let mut session = self.session.lock().await;
        match &session.access_token {
            Some(token) if token.expires_at > Instant::now() + EXPIRY_LEEWAY => {
                Ok(token.value.clone())
            }
            _ => {
                self.refresh_locked(&mut session).await?;
                Ok(session
                    .access_token
                    .as_ref()
                    .map(|t| t.value.clone())
                    .unwrap_or_default())
            }
        }
    }

    /// Refreshes after a 401, unless another caller already did so.
    async fn force_refresh(&self, rejected: &str) -> Result<String, AuthError> {
        let mut session = self.session.lock().await;
        if let Some(token) = &session.access_token {
            if token.value != rejected {
                return Ok(token.value.clone());
            }
        }
        self.refresh_locked(&mut session).await?;
        Ok(session
            .access_token
            .as_ref()
            .map(|t| t.value.clone())
            .unwrap_or_default())
    }

    async fn refresh_locked(&self, session: &mut Session) -> Result<(), AuthError> {
        let Some(refresh_token) = self.store.load()? else {
            *session = Session::default();
            return Err(AuthError::unauthorized());
        };

        match self
            .request_tokens("/auth/refresh", &json!({ "refresh_token": refresh_token }))
            .await
        {
            Ok(tokens) => self.apply_tokens(session, tokens).map(|_| ()),
            Err(AuthError::InvalidCredentials { .. } | AuthError::Unauthorized { .. }) => {
                *session = Session::default();
                self.store.clear()?;
                Err(AuthError::unauthorized())
            }
            Err(err) => Err(err),
        }
    }

    async fn start_session(&self, tokens: TokenResponse) -> Result<User, AuthError> {
        let mut session = self.session.lock().await;
        self.apply_tokens(&mut session, tokens)
    }

    fn apply_tokens(
        &self,
        session: &mut Session,
        tokens: TokenResponse,
    ) -> Result<User, AuthError> {
        self.store.save(&tokens.refresh_token)?;
        session.access_token = Some(AccessToken {
            value: tokens.access_token,
            expires_at: Instant::now() + Duration::from_secs(tokens.expires_in),
        });
        session.user = Some(tokens.user.clone());
        Ok(tokens.user)
    }

    async fn request_tokens(
        &self,
        path: &str,
        body: &serde_json::Value,
    ) -> Result<TokenResponse, AuthError> {
        let response = self.http.post(Self::url(path)).json(body).send().await?;
        let status = response.status();
        if status.is_success() {
            return Ok(response.json().await?);
        }

        let error = response.json::<ErrorResponse>().await.ok();
        Err(match (status, error) {
            (StatusCode::UNPROCESSABLE_ENTITY, Some(err)) => AuthError::validation(err.details),
            (StatusCode::UNAUTHORIZED, Some(err)) if err.error == "invalid_credentials" => {
                AuthError::invalid_credentials()
            }
            (StatusCode::UNAUTHORIZED, _) => AuthError::unauthorized(),
            (StatusCode::TOO_MANY_REQUESTS, _) => AuthError::rate_limited(),
            _ => AuthError::server(status),
        })
    }
}

#[tauri::command]
pub async fn auth_signup(
    state: tauri::State<'_, AuthState>,
    name: String,
    email: String,
    password: String,
) -> Result<User, AuthError> {
    state.signup(&name, &email, &password).await
}

#[tauri::command]
pub async fn auth_login(
    state: tauri::State<'_, AuthState>,
    email: String,
    password: String,
) -> Result<User, AuthError> {
    state.login(&email, &password).await
}

#[tauri::command]
pub async fn auth_logout(state: tauri::State<'_, AuthState>) -> Result<(), AuthError> {
    state.logout().await
}

#[tauri::command]
pub async fn auth_restore_session(
    state: tauri::State<'_, AuthState>,
) -> Result<Option<User>, AuthError> {
    state.restore_session().await
}

#[tauri::command]
pub async fn auth_current_user(state: tauri::State<'_, AuthState>) -> Result<User, AuthError> {
    state.current_user().await
}
