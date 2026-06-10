import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Bot, ListChecks, Workflow, FileBarChart, Wallet,
  Calendar, Store, Settings, Sparkles,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Agents", url: "/agents", icon: Bot },
  { title: "Tasks", url: "/tasks", icon: ListChecks },
  { title: "Workflow", url: "/workflow", icon: Workflow },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "AI Market", url: "/market", icon: Store },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar border-r border-border h-screen sticky top-0 p-5 gap-6">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight">DumbDumb Corp AI</h1>
          <p className="text-[11px] text-muted-foreground">AI Command Center</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {items.map((it) => {
          const active = pathname === it.url;
          return (
            <Link
              key={it.url}
              to={it.url}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "gradient-primary text-white shadow-[var(--shadow-glow)]"
                  : "text-sidebar-foreground hover:bg-secondary"
              }`}
            >
              <it.icon className="w-[18px] h-[18px]" />
              <span>{it.title}</span>
              <span className={`ml-auto text-xs ${active ? "opacity-90" : "opacity-0 group-hover:opacity-60"}`}>›</span>
            </Link>
          );
        })}
      </nav>

      <div className="card-soft p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
          <span className="text-xs font-semibold">Corp Status</span>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">All Systems Online</p>
        <div className="flex items-end gap-3">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="oklch(0.93 0.02 260)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="url(#g1)" strokeWidth="3"
                strokeDasharray={`${(98 / 100) * 94.2} 94.2`} strokeLinecap="round" />
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.18 265)" />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 295)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">98%</div>
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-muted-foreground mb-1">System Health</p>
            <svg viewBox="0 0 80 24" className="w-full h-6">
              <path d="M0 18 Q10 10 20 14 T40 12 T60 8 T80 10" fill="none" stroke="oklch(0.7 0.18 265)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-2">
        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold relative">
          W
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--success)] border-2 border-card" />
        </div>
        <div>
          <p className="text-sm font-semibold">Widi</p>
          <p className="text-[11px] text-muted-foreground">CEO & Founder</p>
        </div>
      </div>
    </aside>
  );
}
