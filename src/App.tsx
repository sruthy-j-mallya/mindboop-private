import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import ThemeToggle from "@common/ThemeToggle";

import AuthScreen from "@/components/auth/AuthScreen";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { getSession, signOut, type AuthUser } from "@/lib/auth";

const brandTokens = [
  { name: "Coral", className: "bg-brand-coral" },
  { name: "Purple", className: "bg-brand-purple" },
  { name: "Yellow", className: "bg-brand-yellow" },
  { name: "Beige", className: "bg-brand-beige" },
] as const;

const semanticTokens = [
  { name: "Primary", className: "bg-primary" },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Accent", className: "bg-accent" },
  { name: "Muted", className: "bg-muted" },
] as const;

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => getSession());
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  if (!user) {
    return <AuthScreen onAuthenticated={setUser} />;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Badge variant="secondary">MindBoop</Badge>
          <h1>Design system</h1>
          <p className="text-muted-foreground">
            Signed in as {user.email}. Coral, purple, and warm neutrals from the
            MindBoop logo, wired into shadcn semantic tokens.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              signOut();
              setUser(null);
            }}
          >
            Sign out
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <section className="flex flex-col gap-3">
        <h2>Brand</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brandTokens.map((token) => (
            <div key={token.name} className="flex flex-col gap-2">
              <div className={`h-16 rounded-lg ${token.className}`} />
              <span className="text-sm text-muted-foreground">{token.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2>Semantic</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {semanticTokens.map((token) => (
            <div key={token.name} className="flex flex-col gap-2">
              <div className={`h-16 rounded-lg ring-1 ring-border ${token.className}`} />
              <span className="text-sm text-muted-foreground">{token.name}</span>
            </div>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Try it</CardTitle>
          <CardDescription>
            Buttons and inputs pick up primary, secondary, and surface tokens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={(event) => {
              event.preventDefault();
              void greet();
            }}
          >
            <Input
              id="greet-input"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="Enter a name..."
            />
            <Button type="submit">Greet</Button>
            <Button type="button" variant="secondary">
              Secondary
            </Button>
            <Button type="button" variant="outline">
              Outline
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground">{greetMsg || "Waiting for a name."}</p>
        </CardFooter>
      </Card>
    </main>
  );
}

export default App;
