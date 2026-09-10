import { useState } from "react";

import type { AuthUser } from "@/lib/auth";

import SignIn from "./SignIn";
import SignUp from "./SignUp";

type AuthScreenProps = {
  onAuthenticated: (user: AuthUser) => void;
};

const AuthScreen = ({ onAuthenticated }: AuthScreenProps) => {
  const [mode, setMode] = useState<"signin" | "signup">("signup");

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6 py-10">
      <div className="flex flex-1 flex-col items-center justify-center">
        {mode === "signup" ? (
          <SignUp
            onSuccess={onAuthenticated}
            onSwitch={() => setMode("signin")}
          />
        ) : (
          <SignIn
            onSuccess={onAuthenticated}
            onSwitch={() => setMode("signup")}
          />
        )}
      </div>
    </main>
  );
};

export default AuthScreen;
