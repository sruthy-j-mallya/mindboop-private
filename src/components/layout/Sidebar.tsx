import { ZapIcon } from "lucide-react";

import ThemeToggle from "@common/ThemeToggle";
import { Button } from "@/components/ui/Button";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { useLogout } from "@/tanstack/useAuthQueries";

import type { AppView, NavItem } from "./types";

const navItems: NavItem[] = [{ view: "quick-start", label: "Quick start", icon: ZapIcon }];

type SidebarProps = {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
};

const Sidebar = ({ activeView, onNavigate }: SidebarProps) => {
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const { setOpenMobile } = useSidebar();

  const navigate = (view: AppView) => {
    onNavigate(view);
    setOpenMobile(false);
  };

  return (
    <SidebarRoot className="border-sidebar-border">
      <SidebarContent className="px-4 pt-6">
        <nav aria-label="Main">
          <SidebarMenu className="gap-1">
            {navItems.map(({ view, label, icon: Icon }) => {
              const isActive = view === activeView;

              return (
                <SidebarMenuItem key={view}>
                  <SidebarMenuButton
                    isActive={isActive}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => navigate(view)}
                    className="h-auto justify-between gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground"
                  >
                    <span>{label}</span>
                    <Icon />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </nav>
      </SidebarContent>

      <SidebarFooter className="mx-4 mb-6 border-t border-sidebar-border p-0 pt-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLogoutPending}
            onClick={() => logout()}
            className="flex-1"
          >
            Log out
          </Button>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </SidebarRoot>
  );
};

export default Sidebar;
