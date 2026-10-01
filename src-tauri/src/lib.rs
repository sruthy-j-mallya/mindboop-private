mod auth;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(auth::AuthState::default())
        .invoke_handler(tauri::generate_handler![
            greet,
            auth::auth_signup,
            auth::auth_login,
            auth::auth_logout,
            auth::auth_restore_session,
            auth::auth_current_user,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
