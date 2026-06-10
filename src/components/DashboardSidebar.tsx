import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Bot, ListChecks, Workflow, FileBarChart,
  Settings, Sparkles,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Agents", url: "/agents", icon: Bot },
  { title: "Tasks", url: "/tasks", icon: ListChecks },
  { title: "Workflow", url: "/workflow", icon: Workflow },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex flex-col w-[278px] shrink-0 bg-sidebar border-r border-border/70 h-screen sticky top-0 px-5 py-6 gap-6">
      <div className="flex items-center gap-3 px-1">
        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[oklch(0.77_0.13_235)] via-[oklch(0.72_0.18_275)] to-[oklch(0.8_0.12_300)] flex items-center justify-center shadow-[0_14px_34px_-18px_oklch(0.68_0.14_270/0.6)]">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-[17px] font-bold leading-tight tracking-[-0.02em]">DumbDumb Corp AI</h1>
          <p className="text-[12px] text-muted-foreground">AI Corporation Command Center</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5 pt-2">
        {items.map((it) => {
          const active = pathname === it.url;
          return (
            <Link
              key={it.url}
              to={it.url}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-[15px] font-medium transition-all ${
                active
                  ? "gradient-primary text-white shadow-[0_18px_35px_-22px_oklch(0.67_0.16_270/0.9)]"
                  : "text-sidebar-foreground hover:bg-secondary/80"
              }`}
            >
               <it.icon className="w-[17px] h-[17px]" />
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
