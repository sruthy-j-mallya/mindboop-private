import { useEffect, type ReactNode } from "react";

import { useRestoreSession } from "@/tanstack/useAuthQueries";
import { useAuthStore } from "@/stores/authStore";

// Restores the saved session once on startup and hands the result to the auth store.
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const setUser = useAuthStore((state) => state.setUser);
  const { data, error, isSuccess, isError } = useRestoreSession();

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    } else if (isError) {
      console.error("Failed to restore session", error);
      setUser(null);
    }
  }, [isSuccess, isError, data, error, setUser]);

  return children;
};

export default AuthProvider;
