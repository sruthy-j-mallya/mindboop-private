import { create } from "zustand";

import type { User } from "@/lib/auth";

import type { AuthStatus } from "./types";

type AuthState = {
  status: AuthStatus;
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  status: "loading",
  user: null,
  setUser: (user) => set({ user, status: user ? "signed_in" : "signed_out" }),
}));
