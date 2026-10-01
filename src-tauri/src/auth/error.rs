use std::collections::HashMap;

use serde::Serialize;

/// Errors surfaced to the frontend as `{ kind, message, details? }`.
#[derive(Debug, thiserror::Error, Serialize)]
#[serde(tag = "kind", rename_all = "snake_case")]
pub enum AuthError {
    #[error("{message}")]
    InvalidCredentials { message: String },

    #[error("{message}")]
    Validation {
        message: String,
        details: HashMap<String, Vec<String>>,
    },

    #[error("{message}")]
    Unauthorized { message: String },

    #[error("{message}")]
    RateLimited { message: String },

    #[error("{message}")]
    Network { message: String },

    #[error("{message}")]
    Server { message: String },

    #[error("{message}")]
    Storage { message: String },
}

impl AuthError {
    pub fn invalid_credentials() -> Self {
        Self::InvalidCredentials {
            message: "Incorrect email or password.".into(),
        }
    }

    pub fn validation(details: HashMap<String, Vec<String>>) -> Self {
        Self::Validation {
            message: "Please fix the highlighted fields.".into(),
            details,
        }
    }

    pub fn unauthorized() -> Self {
        Self::Unauthorized {
            message: "Your session has expired. Please log in again.".into(),
        }
    }

    pub fn rate_limited() -> Self {
        Self::RateLimited {
            message: "Too many attempts. Please wait a moment and try again.".into(),
        }
    }

    pub fn server(status: reqwest::StatusCode) -> Self {
        Self::Server {
            message: format!("The server returned an unexpected response ({status})."),
        }
    }

    pub fn storage(err: impl std::fmt::Display) -> Self {
        Self::Storage {
            message: format!("Couldn't access secure storage: {err}"),
        }
    }
}

impl From<reqwest::Error> for AuthError {
    fn from(err: reqwest::Error) -> Self {
        if err.is_decode() {
            Self::Server {
                message: "The server returned an unexpected response.".into(),
            }
        } else {
            Self::Network {
                message: "Couldn't reach the MindBoop server.".into(),
            }
        }
    }
}
