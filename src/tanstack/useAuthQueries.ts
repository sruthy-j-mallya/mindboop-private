import { useMutation, useQuery } from "@tanstack/react-query";

import * as auth from "@/lib/auth";
import type { AuthError, User } from "@/lib/auth";

import { useAuthStore } from "@/stores/authStore";

export const authKeys = {
  session: ["auth", "session"] as const,
};

// Normalise Tauri rejections so `mutation.error` is always an AuthError.
const withAuthError = <T>(promise: Promise<T>) =>
  promise.catch((error: unknown) => {
    throw auth.toAuthError(error);
  });

export const useRestoreSession = () =>
  useQuery({
    queryKey: authKeys.session,
    queryFn: auth.restoreSession,
    staleTime: Infinity,
  });

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation<User, AuthError, { email: string; password: string }>({
    mutationFn: ({ email, password }) => withAuthError(auth.login(email, password)),
    onSuccess: setUser,
  });
};

export const useSignup = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation<User, AuthError, { name: string; email: string; password: string }>({
    mutationFn: ({ name, email, password }) => withAuthError(auth.signup(name, email, password)),
    onSuccess: setUser,
  });
};

export const useLogout = () => {
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: auth.logout,
    // Sign out locally even if the server call fails.
    onSettled: () => setUser(null),
  });
};
