import { invoke } from "@tauri-apps/api/core";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthErrorKind =
  | "invalid_credentials"
  | "validation"
  | "unauthorized"
  | "rate_limited"
  | "network"
  | "server"
  | "storage";

export type AuthError = {
  kind: AuthErrorKind;
  message: string;
  details?: Record<string, string[]>;
};

export const isAuthError = (error: unknown): error is AuthError =>
  typeof error === "object" && error !== null && "kind" in error && "message" in error;

export const toAuthError = (error: unknown): AuthError =>
  isAuthError(error) ? error : { kind: "server", message: String(error) };

// Tokens stay in the Rust process; these commands only ever return the user.
export const signup = (name: string, email: string, password: string) =>
  invoke<User>("auth_signup", { name, email, password });

export const login = (email: string, password: string) =>
  invoke<User>("auth_login", { email, password });

export const logout = () => invoke<void>("auth_logout");

export const restoreSession = () => invoke<User | null>("auth_restore_session");

export const fetchCurrentUser = () => invoke<User>("auth_current_user");
