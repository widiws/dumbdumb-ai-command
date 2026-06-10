import heroRobot from "@/assets/hero-robot.png";
import {
  Bot, ClipboardList, FileText, Zap, Plus, Send, Terminal, FileBarChart, BarChart3,
  Network, ChevronRight, Server, Database, Cpu, Wifi, Rocket, CheckCircle2,
} from "lucide-react";

const kpis = [
  { label: "Active Agents", value: "12", delta: "+2 hari ini", gradient: "var(--gradient-blue)", icon: Bot, stroke: "oklch(0.7 0.16 240)" },
  { label: "Running Tasks", value: "48", delta: "+15 hari ini", gradient: "var(--gradient-purple)", icon: ClipboardList, stroke: "oklch(0.7 0.18 290)" },
  { label: "Today Reports", value: "19", delta: "+7 hari ini", gradient: "var(--gradient-green)", icon: FileText, stroke: "oklch(0.7 0.15 165)" },
  { label: "System Health", value: "98%", delta: "Stabil & Optimal", gradient: "var(--gradient-orange)", icon: Zap, stroke: "oklch(0.75 0.16 55)" },
];

const agents = [
  { name: "DumbDumb", role: "Secretary AI", status: "Online", color: "var(--gradient-blue)", initial: "D", d1: "Memory Active", d2: "Voice Standby", dot: "var(--success)" },
  { name: "Momot", role: "Task Dispatcher", status: "Running", color: "var(--gradient-purple)", initial: "M", d1: "Queue 7 Tasks", d2: "Auto Chain On", dot: "var(--purple-soft)" },
  { name: "Gentho", role: "PC Executor", status: "Connected", color: "var(--gradient-green)", initial: "G", d1: "Screen Control", d2: "Chrome Attach", dot: "var(--success)" },
  { name: "Bot CEO", role: "Strategic Planner", status: "Planning", color: "var(--gradient-orange)", initial: "B", d1: "Mode", d2: "Approval Req.", dot: "var(--orange-soft)" },
  { name: "Tubang", role: "Data Collector", status: "Active", color: "var(--gradient-pink)", initial: "T", d1: "Web Monitor", d2: "Real-time", dot: "var(--success)" },
  { name: "Trading Bot", role: "Market Analyst", status: "Active", color: "var(--gradient-primary)", initial: "₿", d1: "Market Scan", d2: "24/7 Running", dot: "var(--success)" },
];

const quickCommands = [
  { title: "Buat Task Baru", desc: "Tambah pekerjaan untuk AI", icon: Send, grad: "var(--gradient-blue)" },
  { title: "Jalankan Script", desc: "Eksekusi perintah otomatis", icon: Terminal, grad: "var(--gradient-purple)" },
  { title: "Lihat Laporan", desc: "Cek semua laporan hari ini", icon: FileBarChart, grad: "var(--gradient-pink)" },
  { title: "Analisis Data", desc: "AI analisis & insight cepat", icon: BarChart3, grad: "var(--gradient-green)" },
];

const activities = [
  { time: "09:42", who: "Gentho", action: "completed browser task", sub: "Mencari data kompetitor selesai", color: "var(--green-soft)" },
  { time: "09:15", who: "Momot", action: "queued new command", sub: "7 task baru ditambahkan", color: "var(--purple-soft)" },
  { time: "08:50", who: "DumbDumb", action: "generated report", sub: "Laporan harian sudah siap", color: "var(--blue-soft)" },
  { time: "08:30", who: "Trading Bot", action: "market scan", sub: "Analisis market crypto selesai", color: "var(--orange-soft)" },
  { time: "08:05", who: "Tubang", action: "collected dataset", sub: "1.2k entri data tersimpan", color: "var(--pink-soft)" },
];

const systemStatus = [
  { label: "AI Core Server", val: "Online", icon: Server, ok: true },
  { label: "Database", val: "Online", icon: Database, ok: true },
  { label: "Memory System", val: "Optimal", icon: Cpu, ok: true },
  { label: "API Connection", val: "Stable", icon: Wifi, ok: true },
];

function Sparkline({ stroke }: { stroke: string }) {
  return (
    <svg viewBox="0 0 120 32" className="w-full h-8 mt-3">
      <defs>
        <linearGradient id={`f-${stroke}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 24 Q15 18 25 20 T50 14 T75 18 T100 10 T120 14 L120 32 L0 32 Z" fill={`url(#f-${stroke})`} />
      <path d="M0 24 Q15 18 25 20 T50 14 T75 18 T100 10 T120 14" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Donut() {
  const total = 48;
  const segs = [
    { label: "Selesai", value: 28, color: "oklch(0.7 0.16 165)" },
    { label: "Running", value: 12, color: "oklch(0.7 0.18 265)" },
    { label: "Pending", value: 5, color: "oklch(0.78 0.15 75)" },
    { label: "Failed", value: 3, color: "oklch(0.7 0.2 25)" },
  ];
  let offset = 0;
  const C = 2 * Math.PI * 36;
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
          <circle cx="50" cy="50" r="36" fill="none" stroke="oklch(0.95 0.01 260)" strokeWidth="14" />
          {segs.map((s) => {
            const len = (s.value / total) * C;
            const el = (
              <circle key={s.label} cx="50" cy="50" r="36" fill="none" stroke={s.color}
                strokeWidth="14" strokeDasharray={`${len} ${C}`} strokeDashoffset={-offset} strokeLinecap="butt" />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{total}</span>
          <span className="text-[11px] text-muted-foreground">Total Tasks</span>
        </div>
      </div>
      <ul className="flex-1 space-y-2.5 text-sm">
        {segs.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
            <span className="flex-1">{s.label}</span>
            <span className="font-semibold">{s.value} ({Math.round((s.value / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PerfChart() {
  return (
    <svg viewBox="0 0 400 140" className="w-full h-40">
      <defs>
        <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.7 0.18 265)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="oklch(0.7 0.18 265)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 35, 70, 105, 140].map((y, i) => (
        <line key={i} x1="30" x2="390" y1={y + 5} y2={y + 5} stroke="oklch(0.94 0.01 260)" strokeWidth="1" />
      ))}
      {["100%", "75%", "50%", "25%", "0%"].map((t, i) => (
        <text key={t} x="0" y={i * 35 + 10} fontSize="10" fill="oklch(0.55 0.04 260)">{t}</text>
      ))}
      {["00:00", "06:00", "12:00", "18:00", "24:00"].map((t, i) => (
        <text key={t} x={30 + i * 90} y="138" fontSize="10" fill="oklch(0.55 0.04 260)" textAnchor="middle">{t}</text>
      ))}
      <path d="M30 90 Q70 60 110 70 T190 50 T270 65 T350 35 T390 55 L390 125 L30 125 Z" fill="url(#pf)" />
      <path d="M30 90 Q70 60 110 70 T190 50 T270 65 T350 35 T390 55" fill="none"
        stroke="oklch(0.65 0.2 270)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardContent() {
  return (
    <main className="px-6 lg:px-8 py-6 space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero border border-border p-6 lg:p-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border text-xs font-medium mb-5">
              <Sparkle /> AI Corporation Command Center
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Welcome back, <span className="text-gradient">Widi</span> <span>👋</span>
            </h1>
            <p className="text-xl lg:text-2xl mt-2 font-semibold text-foreground/80">Build. Monitor. Automate.</p>
            <p className="mt-4 text-muted-foreground max-w-2xl text-[15px] leading-relaxed">
              Kelola semua agent AI, task otomatis, bot trading, laporan bisnis, dan workflow kerja dalam satu dashboard terintegrasi.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <button className="px-6 py-3 rounded-2xl gradient-primary text-white font-semibold text-sm shadow-[var(--shadow-glow)] hover:scale-[1.03] transition-transform inline-flex items-center gap-2">
                <Rocket className="w-4 h-4" /> Mulai Command
              </button>
              <button className="px-6 py-3 rounded-2xl bg-card border border-border font-semibold text-sm hover:bg-secondary transition inline-flex items-center gap-2">
                <Bot className="w-4 h-4" /> Lihat Agents
              </button>
            </div>
          </div>
          <div className="relative h-64 lg:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.85_0.1_280)]/30 to-transparent blur-3xl" />
            <img src={heroRobot} alt="AI Robot Assistant" className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              style={{ animation: "float 6s ease-in-out infinite" }} />
          </div>
        </div>
        <style>{`@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }`}</style>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="card-soft card-soft-hover p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0"
                style={{ background: k.gradient }}>
                <k.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium">{k.label}</p>
                <p className="text-3xl font-bold mt-1">{k.value}</p>
                <p className="text-[11px] text-[var(--success)] font-semibold mt-1 flex items-center gap-1">
                  <span>↗</span> {k.delta}
                </p>
              </div>
            </div>
            <Sparkline stroke={k.stroke} />
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6 min-w-0">
          {/* Agent Network */}
          <section className="card-soft p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="flex items-center gap-2 font-bold text-lg">
                <span className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                  <Network className="w-4 h-4 text-white" />
                </span>
                AI Agent Network
              </h2>
              <button className="text-xs font-medium px-3 py-2 rounded-xl border border-border hover:bg-secondary transition inline-flex items-center gap-1">
                Lihat Semua Agent <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
              {agents.map((a) => (
                <div key={a.name} className="rounded-2xl border border-border bg-gradient-to-b from-card to-[oklch(0.98_0.015_260)] p-4 hover:shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-all">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
                      style={{ background: a.color }}>{a.initial}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{a.name}</h3>
                      <p className="text-[11px] text-muted-foreground truncate">{a.role}</p>
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: a.dot }} />
                        {a.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-0.5 mb-3">
                    <p className="font-medium text-foreground/80">{a.d1}</p>
                    <p>{a.d2}</p>
                  </div>
                  <button className="w-full text-xs font-semibold py-2 rounded-xl bg-secondary hover:gradient-primary hover:text-white transition-all flex items-center justify-center gap-1 group">
                    Open Panel <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity / Task Progress / Perf */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card-soft p-6 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2"><Sparkle /> Aktivitas Hari Ini</h2>
                <select className="text-xs bg-secondary rounded-lg px-2 py-1 border-none focus:outline-none">
                  <option>Hari Ini</option>
                </select>
              </div>
              <ul className="space-y-3.5">
                {activities.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-[11px] font-mono text-muted-foreground w-10 pt-0.5">{a.time}</span>
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in oklab, ${a.color} 20%, white)` }}>
                      <Bot className="w-3.5 h-3.5" style={{ color: a.color }} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px]"><b>{a.who}</b> <span className="text-muted-foreground">{a.action}</span></p>
                      <p className="text-[11px] text-muted-foreground truncate">{a.sub}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Task Progress</h2>
                <select className="text-xs bg-secondary rounded-lg px-2 py-1 border-none focus:outline-none">
                  <option>Semua Agent</option>
                </select>
              </div>
              <Donut />
            </div>

            <div className="card-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold">Performance Overview</h2>
                <select className="text-xs bg-secondary rounded-lg px-2 py-1 border-none focus:outline-none">
                  <option>24 Jam</option>
                </select>
              </div>
              <PerfChart />
            </div>
          </section>

          {/* Banner */}
          <section className="rounded-3xl p-6 lg:p-8 relative overflow-hidden text-center"
            style={{ background: "linear-gradient(135deg, oklch(0.85 0.1 280), oklch(0.88 0.08 220), oklch(0.86 0.1 320))" }}>
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_30%,white,transparent_50%),radial-gradient(circle_at_80%_70%,white,transparent_50%)]" />
            <p className="relative text-lg lg:text-2xl font-bold text-white drop-shadow">
              "Satu pusat kendali untuk seluruh pasukan AI-mu."
            </p>
            <p className="relative text-white/90 mt-1 font-medium">Build. Monitor. Automate. Scale.</p>
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <section className="card-soft p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Quick Command</h2>
              <button className="w-7 h-7 rounded-lg gradient-primary text-white flex items-center justify-center hover:scale-110 transition">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2.5">
              {quickCommands.map((q) => (
                <li key={q.title}>
                  <button className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition text-left">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: q.grad }}>
                      <q.icon className="w-4 h-4 text-white" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold truncate">{q.title}</span>
                      <span className="block text-[11px] text-muted-foreground truncate">{q.desc}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-soft p-5">
            <h2 className="font-bold mb-4">System Status</h2>
            <div className="rounded-2xl p-4 mb-4 bg-gradient-to-br from-[oklch(0.95_0.04_240)] to-[oklch(0.96_0.05_280)] flex items-center justify-center h-24">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)] rotate-3 hover:rotate-0 transition">
                <Server className="w-7 h-7 text-white" />
              </div>
            </div>
            <ul className="space-y-3">
              {systemStatus.map((s) => (
                <li key={s.label} className="flex items-center gap-3 text-sm">
                  <s.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1">{s.label}</span>
                  <span className="text-xs font-semibold text-[var(--success)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                    {s.val}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card-soft p-5">
            <h2 className="font-bold mb-3">Task Queue</h2>
            <div className="space-y-3 text-sm">
              {[
                { name: "Sync CRM Data", agent: "Tubang", pct: 78 },
                { name: "Generate Q3 Report", agent: "DumbDumb", pct: 45 },
                { name: "Crypto Market Scan", agent: "Trading Bot", pct: 92 },
              ].map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-[13px] truncate">{t.name}</span>
                    <span className="text-[11px] text-muted-foreground">{t.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full gradient-primary rounded-full" style={{ width: `${t.pct}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">by {t.agent}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

function Sparkle() {
  return (
    <span className="w-5 h-5 rounded-md gradient-primary flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="currentColor">
        <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
      </svg>
    </span>
  );
}
