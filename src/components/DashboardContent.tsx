import {
  Bot, ClipboardList, FileText, Zap, Plus, Send, Terminal, FileBarChart, BarChart3,
  Network, ChevronRight, Server, Database, Cpu, Wifi, Rocket, CheckCircle2, Users, Upload, Loader2,
} from "lucide-react";
import { LazyMotion, domAnimation, m, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import heroRobot from "@/assets/hero-robot.png";

const SETORAN_API = "https://api.sandjayacorp.com";
const CORP_AI_API = "https://corp.sandjayacorp.com";

type Pm2Proc = { name: string; status?: string; pm_id?: number; cpu?: number; memory?: number };

function usePm2Status() {
  const [procs, setProcs] = useState<Pm2Proc[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const endpoints = [
      `${CORP_AI_API}/api/pm2`,
      `${CORP_AI_API}/api/pm2/status`,
      `${CORP_AI_API}/corp-ai-dashboard/api/pm2`,
    ];
    const fetchOnce = async () => {
      for (const url of endpoints) {
        try {
          const ctl = new AbortController();
          const t = setTimeout(() => ctl.abort(), 6000);
          const res = await fetch(url, { signal: ctl.signal });
          clearTimeout(t);
          if (!res.ok) continue;
          const json = await res.json();
          const arr: Pm2Proc[] = Array.isArray(json) ? json
            : Array.isArray(json?.processes) ? json.processes
            : Array.isArray(json?.data) ? json.data : [];
          if (!alive) return;
          if (arr.length) { setProcs(arr); setError(null); return; }
        } catch { /* try next */ }
      }
      if (alive) setError("pm2 unreachable");
    };
    fetchOnce();
    const id = setInterval(fetchOnce, 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return { procs, error };
}

type SetoranState = {
  teams?: Record<string, any> | any[];
  members?: Record<string, any> | any[];
  attendance?: Record<string, any>;
  uploads?: Record<string, any> | any[];
  today?: string;
};

function useSetoranState() {
  const [data, setData] = useState<SetoranState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const fetchOnce = async () => {
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 8000);
        const res = await fetch(`${SETORAN_API}/api/state`, { signal: ctl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!alive) return;
        setData(json);
        setError(null);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "fetch failed");
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchOnce();
    const id = setInterval(fetchOnce, 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return { data, loading, error };
}

// Normalisasi struktur attendance hari ini -> array { name, time }
function getTodayAttendance(state: SetoranState | null): Array<{ name: string; time: string; status?: string }> {
  if (!state) return [];
  const today = state.today ?? new Date().toISOString().slice(0, 10);
  const att = (state.attendance ?? {}) as Record<string, any>;
  const todayAtt = att[today] ?? att[Object.keys(att).pop() ?? ""] ?? {};
  if (!todayAtt || typeof todayAtt !== "object") return [];
  return Object.entries(todayAtt).map(([key, v]: [string, any]) => {
    if (typeof v === "string") return { name: key, time: v };
    return { name: v?.name ?? key, time: v?.time ?? v?.checkin ?? "-", status: v?.status };
  });
}

function getTodayUploadsCount(state: SetoranState | null): number {
  if (!state) return 0;
  const today = state.today ?? new Date().toISOString().slice(0, 10);
  const up = state.uploads as any;
  if (!up) return 0;
  if (Array.isArray(up)) {
    return up.filter((u) => (u?.date ?? u?.time ?? "").toString().startsWith(today)).length;
  }
  const todayUp = up[today];
  if (Array.isArray(todayUp)) return todayUp.length;
  if (todayUp && typeof todayUp === "object") return Object.keys(todayUp).length;
  // sum all teams for today
  let sum = 0;
  for (const v of Object.values(up)) {
    if (Array.isArray(v)) sum += v.length;
    else if (v && typeof v === "object") sum += Object.keys(v).length;
  }
  return sum;
}

function getTeams(state: SetoranState | null): Array<{ name: string; members: number; uploads: number }> {
  if (!state?.teams) return [];
  const today = state.today ?? new Date().toISOString().slice(0, 10);
  const teamsRaw: any = state.teams;
  const uploads: any = state.uploads ?? {};
  const entries = Array.isArray(teamsRaw)
    ? teamsRaw.map((t, i) => [t?.id ?? t?.name ?? String(i), t] as [string, any])
    : Object.entries(teamsRaw);

  return entries.map(([key, t]) => {
    const name = (typeof t === "object" && t?.name) ? t.name : key;
    let membersCount = 0;
    if (Array.isArray(t)) membersCount = t.length;
    else if (Array.isArray(t?.members)) membersCount = t.members.length;
    else if (t?.members && typeof t.members === "object") membersCount = Object.keys(t.members).length;

    let teamUploads = 0;
    const u = uploads[key] ?? uploads[name];
    if (Array.isArray(u)) {
      teamUploads = u.filter((x) => !x?.date || x.date.toString().startsWith(today)).length;
    } else if (u && typeof u === "object") {
      const todayList = u[today];
      teamUploads = Array.isArray(todayList) ? todayList.length : (todayList ? Object.keys(todayList).length : 0);
    }
    return { name, members: membersCount, uploads: teamUploads };
  });
}


const EASE = [0.25, 0.46, 0.45, 0.94] as const;
// Hanya aktifkan will-change saat elemen benar-benar dianimasikan masuk.
// Pada perangkat low-end terlalu banyak layer = boros memori GPU.
const GPU_STYLE = { willChange: "transform" } as const;

const kpis = [
  { label: "Active Agents", value: "12", delta: "+2 hari ini", gradient: "var(--gradient-blue)", icon: Bot, stroke: "oklch(0.7 0.16 240)" },
  { label: "Running Tasks", value: "48", delta: "+15 hari ini", gradient: "var(--gradient-purple)", icon: ClipboardList, stroke: "oklch(0.7 0.18 290)" },
  { label: "Today Reports", value: "19", delta: "+7 hari ini", gradient: "var(--gradient-green)", icon: FileText, stroke: "oklch(0.7 0.15 165)" },
  { label: "System Health", value: "98%", delta: "Stabil & Optimal", gradient: "var(--gradient-orange)", icon: Zap, stroke: "oklch(0.75 0.16 55)" },
];

const agents = [
  { name: "DumbDumb", role: "Secretary AI", status: "Online", color: "var(--gradient-blue)", initial: "D", d1: "Memory Active", d2: "Voice Standby", dot: "var(--success)", highlight: false, url: "https://corp.sandjayacorp.com/dumbdumb-visual" },
  { name: "Momot", role: "Task Dispatcher", status: "Running", color: "var(--gradient-purple)", initial: "M", d1: "Queue 7 Tasks", d2: "Auto Chain On", dot: "var(--purple-soft)", highlight: false, url: "https://corp.sandjayacorp.com/dashboard" },
  { name: "PakCEO", role: "Strategic Planner", status: "Planning", color: "var(--gradient-orange)", initial: "C", d1: "Mode", d2: "Approval Req.", dot: "var(--orange-soft)", highlight: true, url: "https://corp.sandjayacorp.com/pakceo-dashboard" },
  { name: "PakCFO", role: "Finance Analyst", status: "Online", color: "var(--gradient-green)", initial: "F", d1: "Revenue Track", d2: "Daily Report", dot: "var(--success)", highlight: false, url: "https://corp.sandjayacorp.com/pakcfo-dashboard" },
  { name: "Lik Yapto", role: "Trading Bot", status: "Active", color: "var(--gradient-primary)", initial: "₿", d1: "Market Scan", d2: "24/7 Running", dot: "var(--success)", highlight: false, url: "https://corp.sandjayacorp.com/lik-yapto" },
  { name: "Sharly", role: "WA Outreach", status: "Active", color: "var(--gradient-pink)", initial: "S", d1: "WA Outreach", d2: "Lead Follow-up", dot: "var(--success)", highlight: false, url: "https://corp.sandjayacorp.com/sharly-dashboard" },
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

function Sparkline({ stroke, id }: { stroke: string; id: string }) {
  const gid = `spark-${id}`;
  return (
    <svg viewBox="0 0 120 32" className="w-full h-8 mt-3" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 24 Q15 18 25 20 T50 14 T75 18 T100 10 T120 14 L120 32 L0 32 Z" fill={`url(#${gid})`} />
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
  const reduce = useReducedMotion();
  const { data: setoran, loading: setoranLoading, error: setoranError } = useSetoranState();
  const { procs: pm2Procs, error: pm2Error } = usePm2Status();

  const todayAttendance = getTodayAttendance(setoran);
  const presentCount = todayAttendance.length;
  const uploadCount = getTodayUploadsCount(setoran);
  const teams = getTeams(setoran);

  const liveAgents = agents.map((a) => {
    if (!pm2Procs) return a;
    const match = pm2Procs.find((p) => (p.name ?? "").toLowerCase().includes(a.name.toLowerCase()));
    if (!match) return a;
    const online = (match.status ?? "").toLowerCase() === "online";
    return {
      ...a,
      status: online ? "Online" : (match.status ?? a.status),
      dot: online ? "var(--success)" : "oklch(0.7 0.2 25)",
      d1: `CPU ${match.cpu ?? 0}%`,
      d2: `MEM ${match.memory ? Math.round(match.memory / 1024 / 1024) + "MB" : "—"}`,
    };
  });

  const liveKpis = kpis.map((k) => {
    if (k.label === "Active Agents") {
      return { ...k, label: "Karyawan Hadir", value: setoranLoading && !setoran ? "…" : String(presentCount), delta: setoranError ? "offline · data dummy" : `${presentCount} hadir hari ini` };
    }
    if (k.label === "Running Tasks") {
      return { ...k, label: "Upload Hari Ini", value: setoranLoading && !setoran ? "…" : String(uploadCount), delta: setoranError ? "offline · data dummy" : `${uploadCount} file diunggah` };
    }
    return k;
  });

  const fadeUp = (y = 24, duration = 0.55): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : duration, ease: EASE } },
  });
  const fadeUpScale = (): Variants => ({
    hidden: { opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0.2 : 0.5, ease: EASE } },
  });
  const fadeLeft = (): Variants => ({
    hidden: { opacity: 0, x: reduce ? 0 : -12 },
    visible: { opacity: 1, x: 0, transition: { duration: reduce ? 0.2 : 0.4, ease: EASE } },
  });
  const stagger = (children = 0.08): Variants => ({
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : children, delayChildren: reduce ? 0 : 0.05 } },
  });

  return (
    <LazyMotion features={domAnimation} strict>
    <main className="px-6 lg:px-8 py-6 space-y-6">

      {/* Hero + KPIs unified top zone */}
      <section className="relative overflow-hidden rounded-3xl">
        {/* Background AI robot image */}
        <div className="absolute inset-0 -z-10 pointer-events-none select-none">
          <img
            src={heroRobot}
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-auto object-contain object-right opacity-60 md:opacity-70 motion-safe:animate-[float_8s_ease-in-out_infinite]"
            style={{ maskImage: "linear-gradient(to left, black 40%, transparent 95%)", WebkitMaskImage: "linear-gradient(to left, black 40%, transparent 95%)" }}
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        </div>

        <button className="absolute top-0 right-0 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-[oklch(0.85_0.12_165)]/50 text-[oklch(0.42_0.14_165)] font-semibold text-xs shadow-[var(--shadow-card)] hover:scale-105 transition">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" /> Live Mode <ChevronRight className="w-3 h-3" />
        </button>



        <div className="relative z-20 md:max-w-[66%] space-y-5">
          <div className="card-soft px-6 py-5 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[oklch(0.96_0.04_280)] to-[oklch(0.94_0.06_240)] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="url(#sg)">
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.18 265)" />
                    <stop offset="100%" stopColor="oklch(0.72 0.18 295)" />
                  </linearGradient>
                </defs>
                <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl lg:text-[34px] font-bold leading-tight">
                Selamat datang, <span className="text-gradient">Widi</span> <span>👋</span>
              </h1>
              <p className="mt-1.5 text-muted-foreground text-[14px] leading-relaxed">
                Ini adalah pusat kendali semua AI Agent dan operasional corp kamu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {liveKpis.map((k) => (
              <div key={k.label} className="card-soft card-soft-hover p-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md shrink-0"
                    style={{ background: k.gradient }}>
                    <k.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-muted-foreground font-medium">{k.label}</p>
                    <p className="text-2xl font-bold mt-0.5">{k.value}</p>
                    <p className="text-[10px] text-[var(--success)] font-semibold mt-0.5 flex items-center gap-1">
                      <span>↗</span> {k.delta}
                    </p>
                  </div>
                </div>
                <Sparkline stroke={k.stroke} id={String(k.label).replace(/\s+/g, "")} />
              </div>
            ))}
          </div>
        </div>
        
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6 min-w-0">
          {/* Agent Network */}
          <m.section
            className="card-soft p-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px", amount: 0.15 }}
            variants={fadeUp(30, 0.6)}
            style={GPU_STYLE}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="flex items-center gap-2 font-bold text-lg">
                <span className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                  <Network className="w-4 h-4 text-white" />
                </span>
                AI Agent Network
                <span className="ml-2 text-[10px] font-medium inline-flex items-center gap-1 text-muted-foreground">
                  {pm2Procs ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" /> PM2 live · {pm2Procs.length}</>
                  ) : pm2Error ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.2_25)]" /> PM2 offline</>
                  ) : (
                    <><Loader2 className="w-3 h-3 animate-spin" /> PM2…</>
                  )}
                </span>
              </h2>
              <a href="https://corp.sandjayacorp.com/corp-ai-dashboard" target="_blank" className="text-xs font-medium px-3 py-2 rounded-xl border border-border hover:bg-secondary transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] inline-flex items-center gap-1 group">
                Lihat Semua Agent <ChevronRight className="w-3 h-3 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-0.5" />
              </a>
            </div>
            <m.div
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px", amount: 0.1 }}
              variants={stagger(0.07)}
            >
              {liveAgents.map((a) => (
                <m.div
                  key={a.name}
                  variants={fadeUpScale()}
                  whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.3, ease: EASE } }}
                  className={`agent-card rounded-2xl border p-3 cursor-pointer ${
                    a.highlight
                      ? "border-[oklch(0.85_0.12_55)]/50 bg-gradient-to-b from-[oklch(0.97_0.04_60)] to-[oklch(0.95_0.06_30)]"
                      : "border-border bg-gradient-to-b from-card to-[oklch(0.98_0.015_260)]"
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-1.5 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 shadow-md"
                      style={{ background: a.color }}>{a.initial}</div>
                    <h3 className="font-bold text-sm leading-tight">{a.name}</h3>
                    <p className="text-[10px] text-muted-foreground leading-tight">{a.role}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: a.dot }} />
                      {a.status}
                    </span>
                  </div>
                  <div className="rounded-xl bg-card/70 p-2 text-center">
                    <p className="text-[11px] font-semibold text-foreground/90 leading-tight">{a.d1}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{a.d2}</p>
                  </div>
                  <a href={a.url ?? "https://corp.sandjayacorp.com/corp-ai-dashboard"} target="_blank" className="mt-2 w-full h-7 rounded-lg bg-card border border-border flex items-center justify-center hover:gradient-primary hover:text-white hover:border-transparent transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group">
                    <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-0.5" />
                  </a>
                </m.div>
              ))}
            </m.div>

          </m.section>

          {/* Tim Produksi (live dari Setoran API) */}
          <section className="card-soft p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="flex items-center gap-2 font-bold text-lg">
                <span className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </span>
                Tim Produksi
              </h2>
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                {setoranLoading && !setoran ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Memuat…</>
                ) : setoranError ? (
                  <><span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.2_25)]" /> Offline · data dummy</>
                ) : (
                  <><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" /> Live · {setoran?.today ?? "hari ini"}</>
                )}
              </span>
            </div>
            {(() => {
              const display = teams.length > 0 ? teams : [
                { name: "Tim Alpha", members: 5, uploads: 12 },
                { name: "Tim Beta", members: 4, uploads: 8 },
                { name: "Tim Gamma", members: 6, uploads: 15 },
              ];
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {display.map((t) => (
                    <div key={t.name} className="rounded-2xl border border-border p-4 bg-gradient-to-b from-card to-[oklch(0.98_0.015_260)]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{t.name}</p>
                          <p className="text-[11px] text-muted-foreground">Tim Produksi</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="rounded-xl bg-card/70 p-2 flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-muted-foreground leading-none">Anggota</p>
                            <p className="text-sm font-bold leading-tight">{t.members}</p>
                          </div>
                        </div>
                        <div className="rounded-xl bg-card/70 p-2 flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-muted-foreground leading-none">Upload</p>
                            <p className="text-sm font-bold leading-tight">{t.uploads}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </section>



          {/* Recent Activity / Task Progress / Perf */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card-soft p-6 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold flex items-center gap-2"><Sparkle /> Absensi Hari Ini</h2>
                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                  {setoranLoading && !setoran ? <Loader2 className="w-3 h-3 animate-spin" /> :
                    setoranError ? <span className="text-[oklch(0.6_0.18_25)]">offline</span> :
                    <><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" /> live</>}
                </span>
              </div>
              {setoranLoading && !setoran ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Memuat absensi…
                </div>
              ) : (
                <ul className="space-y-3.5">
                  {(todayAttendance.length > 0 ? todayAttendance : activities.map(a => ({ name: a.who, time: a.time, status: a.action }))).slice(0, 6).map((a, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-[11px] font-mono text-muted-foreground w-12 pt-0.5">{a.time}</span>
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-[oklch(0.95_0.04_165)]">
                        <Users className="w-3.5 h-3.5 text-[var(--success)]" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] truncate"><b>{a.name}</b></p>
                        <p className="text-[11px] text-muted-foreground truncate">{a.status ?? "Masuk kerja"}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                    </li>
                  ))}
                  {todayAttendance.length === 0 && !setoranError && (
                    <li className="text-xs text-muted-foreground text-center py-2">Belum ada absensi hari ini</li>
                  )}
                </ul>
              )}
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
              <button className="w-7 h-7 rounded-lg gradient-primary text-white flex items-center justify-center hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-2.5">
              {quickCommands.map((q) => (
                <li key={q.title}>
                  <button className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] text-left group">
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

          <m.section
            className="card-soft p-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px", amount: 0.15 }}
            variants={fadeUp(24, 0.55)}
            style={GPU_STYLE}
          >
            <h2 className="font-bold mb-4">System Status</h2>
            <div className="rounded-2xl p-4 mb-4 bg-gradient-to-br from-[oklch(0.95_0.04_240)] to-[oklch(0.96_0.05_280)] flex items-center justify-center h-24">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)] rotate-3 hover:rotate-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                <Server className="w-7 h-7 text-white" />
              </div>
            </div>
            <m.ul className="space-y-3" variants={stagger(0.08)}>
              {systemStatus.map((s) => (
                <m.li
                  key={s.label}
                  variants={fadeLeft()}
                  className="flex items-center gap-3 text-sm"
                  style={GPU_STYLE}
                >
                  <s.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="flex-1">{s.label}</span>
                  <span className="text-xs font-semibold text-[var(--success)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                    {s.val}
                  </span>
                </m.li>
              ))}
            </m.ul>
          </m.section>

          <m.section
            className="card-soft p-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px", amount: 0.15 }}
            variants={fadeUp(24, 0.55)}
            style={GPU_STYLE}
          >
            <h2 className="font-bold mb-3">Task Queue</h2>
            <m.div className="space-y-3 text-sm" variants={stagger(0.1)}>
              {[
                { name: "Sync CRM Data", agent: "Tubang", pct: 78 },
                { name: "Generate Q3 Report", agent: "DumbDumb", pct: 45 },
                { name: "Crypto Market Scan", agent: "Trading Bot", pct: 92 },
              ].map((t) => (
                <m.div
                  key={t.name}
                  variants={fadeUp(16, 0.45)}
                  style={GPU_STYLE}
                >
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-[13px] truncate">{t.name}</span>
                    <span className="text-[11px] text-muted-foreground">{t.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <m.div
                      className="h-full gradient-primary rounded-full"
                      initial={{ width: reduce ? `${t.pct}%` : 0 }}
                      whileInView={{ width: `${t.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: reduce ? 0 : 0.8, ease: EASE, delay: reduce ? 0 : 0.2 }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">by {t.agent}</p>
                </m.div>
              ))}
            </m.div>
          </m.section>
        </aside>
      </div>
    </main>
    </LazyMotion>
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
