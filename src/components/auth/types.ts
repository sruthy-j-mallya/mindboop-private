import type { AuthUser } from "@/lib/auth";

export type AuthFormProps = {
  onSuccess: (user: AuthUser) => void;
  onSwitch: () => void;
};
