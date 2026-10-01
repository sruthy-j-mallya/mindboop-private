import { useState } from "react";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import type { AuthMode } from "./types";

const LoginScreen = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-6 px-6 py-10">
      <header className="flex flex-col items-center gap-2">
        <img src="/logo.png" alt="" className="size-28" />
        <span className="text-2xl font-semibold">MindBoop</span>
      </header>

      {mode === "login" ? (
        <LoginForm onSwitchToSignup={() => setMode("signup")} />
      ) : (
        <SignupForm onSwitchToLogin={() => setMode("login")} />
      )}
    </main>
  );
};

export default LoginScreen;
