export type AuthUser = {
  email: string;
};

type StoredUser = {
  email: string;
  password: string;
};

export type AuthField = "email" | "password" | "confirmPassword" | "form";

export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; field: AuthField; error: string };

const USERS_KEY = "mindboop-users";
const SESSION_KEY = "mindboop-session";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const writeSession = (user: AuthUser) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AuthUser;
    return parsed?.email ? { email: parsed.email } : null;
  } catch {
    return null;
  }
};

export const signOut = () => {
  localStorage.removeItem(SESSION_KEY);
};

const validateEmail = (email: string): string | null => {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return "Enter your email.";
  }
  if (!emailPattern.test(normalized)) {
    return "Enter a valid email address.";
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Enter a password.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
};

export const signUp = (
  email: string,
  password: string,
  confirmPassword: string
): AuthResult => {
  const emailError = validateEmail(email);
  if (emailError) {
    return { ok: false, field: "email", error: emailError };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { ok: false, field: "password", error: passwordError };
  }

  if (!confirmPassword) {
    return {
      ok: false,
      field: "confirmPassword",
      error: "Confirm your password.",
    };
  }

  if (password !== confirmPassword) {
    return {
      ok: false,
      field: "confirmPassword",
      error: "Passwords do not match.",
    };
  }

  const normalizedEmail = normalizeEmail(email);
  const users = readUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    return {
      ok: false,
      field: "email",
      error: "An account with this email already exists.",
    };
  }

  const user: AuthUser = { email: normalizedEmail };
  writeUsers([...users, { email: normalizedEmail, password }]);
  writeSession(user);
  return { ok: true, user };
};

export const signIn = (email: string, password: string): AuthResult => {
  const emailError = validateEmail(email);
  if (emailError) {
    return { ok: false, field: "email", error: emailError };
  }

  if (!password) {
    return { ok: false, field: "password", error: "Enter your password." };
  }

  const normalizedEmail = normalizeEmail(email);
  const stored = readUsers().find((user) => user.email === normalizedEmail);

  if (!stored || stored.password !== password) {
    return {
      ok: false,
      field: "form",
      error: "Email or password is incorrect.",
    };
  }

  const user: AuthUser = { email: stored.email };
  writeSession(user);
  return { ok: true, user };
};
