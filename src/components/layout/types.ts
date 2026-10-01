import type { LucideIcon } from "lucide-react";

export type AppView = "quick-start";

export type NavItem = {
  view: AppView;
  label: string;
  icon: LucideIcon;
};
