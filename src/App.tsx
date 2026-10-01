import { useState, type CSSProperties } from "react";

import { LoginScreen } from "@/components/auth";
import { Sidebar, type AppView } from "@/components/layout";
import QuickStart from "@/components/QuickStart";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { useAuthStore } from "@/stores/authStore";

const App = () => {
  const { status } = useAuthStore();
  const [activeView, setActiveView] = useState<AppView>("quick-start");

  if (status === "loading") {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (status === "signed_out") {
    return <LoginScreen />;
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": "15rem" } as CSSProperties}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <SidebarInset className="min-w-0">
        <header className="flex items-center border-b border-sidebar-border bg-sidebar px-4 py-3 md:hidden">
          <SidebarTrigger />
        </header>
        {activeView === "quick-start" && <QuickStart />}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
