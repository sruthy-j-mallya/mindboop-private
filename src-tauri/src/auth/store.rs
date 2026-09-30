//! Persists the refresh token between launches.
//!
//! Desktop builds use the OS credential store (macOS Keychain, Windows
//! Credential Manager, Secret Service on Linux). Mobile builds keep the token
//! in memory only, so users sign in again after the app is killed.

use super::error::AuthError;

#[cfg(not(any(target_os = "android", target_os = "ios")))]
mod platform {
    use super::AuthError;

    const SERVICE: &str = "com.sruthyjmallya.mindboop";
    const ACCOUNT: &str = "refresh_token";

    #[derive(Default)]
    pub struct TokenStore;

    impl TokenStore {
        fn entry() -> Result<keyring::Entry, AuthError> {
            keyring::Entry::new(SERVICE, ACCOUNT).map_err(AuthError::storage)
        }

        pub fn load(&self) -> Result<Option<String>, AuthError> {
            match Self::entry()?.get_password() {
                Ok(token) => Ok(Some(token)),
                Err(keyring::Error::NoEntry) => Ok(None),
                Err(err) => Err(AuthError::storage(err)),
            }
        }

        pub fn save(&self, token: &str) -> Result<(), AuthError> {
            Self::entry()?
                .set_password(token)
                .map_err(AuthError::storage)
        }

        pub fn clear(&self) -> Result<(), AuthError> {
            match Self::entry()?.delete_credential() {
                Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
                Err(err) => Err(AuthError::storage(err)),
            }
        }
    }
}

#[cfg(any(target_os = "android", target_os = "ios"))]
mod platform {
    use std::sync::Mutex;

    use super::AuthError;

    #[derive(Default)]
    pub struct TokenStore(Mutex<Option<String>>);

    impl TokenStore {
        pub fn load(&self) -> Result<Option<String>, AuthError> {
            Ok(self.0.lock().unwrap().clone())
        }

        pub fn save(&self, token: &str) -> Result<(), AuthError> {
            *self.0.lock().unwrap() = Some(token.to_owned());
            Ok(())
        }

        pub fn clear(&self) -> Result<(), AuthError> {
            *self.0.lock().unwrap() = None;
            Ok(())
        }
    }
}

pub use platform::TokenStore;
