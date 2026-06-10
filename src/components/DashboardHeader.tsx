import { Search, Bell, MessageSquare } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center gap-4 px-6 lg:px-8 py-5 sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="flex-1 max-w-2xl relative mx-auto">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search anything..."
          className="w-full pl-11 pr-14 py-3 rounded-2xl bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 shadow-[var(--shadow-card)]"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">⌘K</kbd>
      </div>

      <button className="relative w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center shadow-[var(--shadow-card)] hover:bg-secondary transition">
        <Bell className="w-[18px] h-[18px] text-muted-foreground" />
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-gradient-to-br from-[oklch(0.7_0.22_15)] to-[oklch(0.72_0.2_350)] text-white text-[10px] font-bold flex items-center justify-center">3</span>
      </button>
      <button className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center shadow-[var(--shadow-card)] hover:bg-secondary transition">
        <MessageSquare className="w-[18px] h-[18px] text-muted-foreground" />
      </button>
      <div className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center text-white font-semibold shadow-[var(--shadow-glow)]">W</div>
    </header>
  );
}
