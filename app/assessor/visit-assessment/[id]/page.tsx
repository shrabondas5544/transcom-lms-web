"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CRITERIA = [
  { key: "customerDealing", label: "Customer Dealing", short: "Cust. Dealing" },
  { key: "productKnowledge", label: "Product Knowledge", short: "Prod. Knowledge" },
  { key: "grooming", label: "Grooming & Posture", short: "Grooming" },
  { key: "demonstrationSkill", label: "Demonstration Skill", short: "Demo Skill" },
  { key: "discipline", label: "Floor Discipline", short: "Discipline" },
];

const ALL_AUDIT_HISTORY: Record<string, { date: string; score: number; scores: Record<string, number>; showroom: string }[]> = {
  "EMP-5011": [ // Sujon Ali
    { date: "Jan 2026", score: 6.2, scores: { customerDealing: 6, productKnowledge: 6, grooming: 7, demonstrationSkill: 6, discipline: 6 }, showroom: "Saheb Bazar Outlet" },
    { date: "Feb 2026", score: 7.0, scores: { customerDealing: 7, productKnowledge: 7, grooming: 7, demonstrationSkill: 7, discipline: 7 }, showroom: "Saheb Bazar Outlet" },
    { date: "Mar 2026", score: 7.4, scores: { customerDealing: 7, productKnowledge: 7, grooming: 8, demonstrationSkill: 8, discipline: 7 }, showroom: "Saheb Bazar Outlet" },
    { date: "Apr 2026", score: 8.2, scores: { customerDealing: 8, productKnowledge: 8, grooming: 9, demonstrationSkill: 8, discipline: 8 }, showroom: "Saheb Bazar Outlet" },
    { date: "May 2026", score: 8.8, scores: { customerDealing: 9, productKnowledge: 8, grooming: 9, demonstrationSkill: 9, discipline: 9 }, showroom: "Saheb Bazar Outlet" },
    { date: "Jun 2026", score: 9.5, scores: { customerDealing: 10, productKnowledge: 9, grooming: 9, demonstrationSkill: 10, discipline: 9 }, showroom: "Saheb Bazar Outlet" },
  ],
  "EMP-2084": [ // Sayed Mahmud
    { date: "Jan 2026", score: 7.5, scores: { customerDealing: 7, productKnowledge: 8, grooming: 7, demonstrationSkill: 8, discipline: 8 }, showroom: "Gulshan Outlet" },
    { date: "Feb 2026", score: 7.8, scores: { customerDealing: 8, productKnowledge: 8, grooming: 8, demonstrationSkill: 7, discipline: 8 }, showroom: "Gulshan Outlet" },
    { date: "Mar 2026", score: 8.2, scores: { customerDealing: 8, productKnowledge: 8, grooming: 9, demonstrationSkill: 8, discipline: 8 }, showroom: "Gulshan Outlet" },
    { date: "Apr 2026", score: 8.6, scores: { customerDealing: 9, productKnowledge: 9, grooming: 8, demonstrationSkill: 9, discipline: 8 }, showroom: "Gulshan Outlet" },
    { date: "May 2026", score: 9.0, scores: { customerDealing: 9, productKnowledge: 9, grooming: 9, demonstrationSkill: 9, discipline: 9 }, showroom: "Gulshan Outlet" },
    { date: "Jun 2026", score: 9.2, scores: { customerDealing: 9, productKnowledge: 9, grooming: 10, demonstrationSkill: 9, discipline: 9 }, showroom: "Gulshan Outlet" },
  ],
  "EMP-2085": [ // Anisur Rahman
    { date: "Feb 2026", score: 6.8, scores: { customerDealing: 7, productKnowledge: 6, grooming: 7, demonstrationSkill: 7, discipline: 7 }, showroom: "Gulshan Outlet" },
    { date: "Apr 2026", score: 7.5, scores: { customerDealing: 8, productKnowledge: 7, grooming: 8, demonstrationSkill: 7, discipline: 7 }, showroom: "Gulshan Outlet" },
    { date: "Jun 2026", score: 8.5, scores: { customerDealing: 9, productKnowledge: 8, grooming: 9, demonstrationSkill: 8, discipline: 9 }, showroom: "Gulshan Outlet" },
  ],
  "EMP-2088": [ // Mehrab Hossain
    { date: "Jan 2026", score: 5.5, scores: { customerDealing: 6, productKnowledge: 5, grooming: 6, demonstrationSkill: 5, discipline: 5 }, showroom: "Dhanmondi Outlet" },
    { date: "Mar 2026", score: 6.0, scores: { customerDealing: 6, productKnowledge: 6, grooming: 6, demonstrationSkill: 6, discipline: 6 }, showroom: "Dhanmondi Outlet" },
    { date: "Jun 2026", score: 6.8, scores: { customerDealing: 7, productKnowledge: 6, grooming: 8, demonstrationSkill: 7, discipline: 6 }, showroom: "Dhanmondi Outlet" },
  ],
  "EMP-3011": [ // Imran Khan
    { date: "Feb 2026", score: 7.2, scores: { customerDealing: 7, productKnowledge: 7, grooming: 8, demonstrationSkill: 7, discipline: 7 }, showroom: "Agrabad Outlet" },
    { date: "Apr 2026", score: 7.8, scores: { customerDealing: 8, productKnowledge: 8, grooming: 8, demonstrationSkill: 8, discipline: 7 }, showroom: "Agrabad Outlet" },
    { date: "Jun 2026", score: 8.1, scores: { customerDealing: 8, productKnowledge: 8, grooming: 9, demonstrationSkill: 8, discipline: 8 }, showroom: "Agrabad Outlet" },
  ],
  "EMP-3013": [ // Nayeem Uddin
    { date: "Mar 2026", score: 6.0, scores: { customerDealing: 6, productKnowledge: 6, grooming: 7, demonstrationSkill: 6, discipline: 5 }, showroom: "GEC Circle Outlet" },
    { date: "Jun 2026", score: 7.2, scores: { customerDealing: 7, productKnowledge: 7, grooming: 8, demonstrationSkill: 7, discipline: 7 }, showroom: "GEC Circle Outlet" },
  ],
};

const EMPLOYEE_INFO: Record<string, { name: string; designation: string; showroom: string; division: string }> = {
  "EMP-5011": { name: "Sujon Ali", designation: "Sales Executive", showroom: "Saheb Bazar Outlet", division: "Rajshahi Division" },
  "EMP-2084": { name: "Sayed Mahmud", designation: "Senior Sales Executive", showroom: "Gulshan Outlet", division: "Dhaka Division" },
  "EMP-2085": { name: "Anisur Rahman", designation: "Sales Executive", showroom: "Gulshan Outlet", division: "Dhaka Division" },
  "EMP-2086": { name: "Taskeen Ahmed", designation: "Assistant Branch Manager", showroom: "Gulshan Outlet", division: "Dhaka Division" },
  "EMP-2088": { name: "Mehrab Hossain", designation: "Senior Sales Executive", showroom: "Dhanmondi Outlet", division: "Dhaka Division" },
  "EMP-3011": { name: "Imran Khan", designation: "Sales Executive", showroom: "Agrabad Outlet", division: "Chittagong Division" },
  "EMP-3013": { name: "Nayeem Uddin", designation: "Sales Executive", showroom: "GEC Circle Outlet", division: "Chittagong Division" },
};

function getRatingConfig(score: number) {
  if (score >= 9.0) return { label: "Excellent", color: "#10b981", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 7.5) return { label: "Good", color: "#3b82f6", bg: "bg-blue-50 text-blue-700 border-blue-200" };
  if (score >= 5.0) return { label: "Average", color: "#f59e0b", bg: "bg-amber-50 text-amber-700 border-amber-200" };
  if (score >= 3.0) return { label: "Below Avg", color: "#f97316", bg: "bg-orange-50 text-orange-700 border-orange-200" };
  return { label: "Critical", color: "#ef4444", bg: "bg-red-50 text-red-700 border-red-200" };
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function LineChart({ data }: { data: { date: string; score: number }[] }) {
  if (data.length < 2) return (
    <div className="h-40 flex items-center justify-center text-xs text-slate-400">
      Not enough data points for trend chart.
    </div>
  );

  const W = 320, H = 140;
  const PL = 28, PR = 16, PT = 12, PB = 28;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  const minScore = Math.max(0, Math.min(...data.map(d => d.score)) - 1);
  const maxScore = Math.min(10, Math.max(...data.map(d => d.score)) + 0.5);
  const range = maxScore - minScore || 1;

  const toX = (i: number) => PL + (i / (data.length - 1)) * chartW;
  const toY = (s: number) => PT + chartH - ((s - minScore) / range) * chartH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.score).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${toX(data.length - 1).toFixed(1)},${(PT + chartH).toFixed(1)} L${toX(0).toFixed(1)},${(PT + chartH).toFixed(1)} Z`;

  const latestColor = getRatingConfig(data[data.length - 1].score).color;

  // Y-axis ticks
  const yTicks = [minScore, (minScore + maxScore) / 2, maxScore].map(v => parseFloat(v.toFixed(1)));

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={latestColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={latestColor} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={PL} y1={toY(tick).toFixed(1)}
            x2={W - PR} y2={toY(tick).toFixed(1)}
            stroke="#f1f5f9" strokeWidth="1"
          />
          <text x={PL - 4} y={toY(tick) + 3} textAnchor="end" fontSize="7" fill="#94a3b8" fontWeight="600">
            {tick.toFixed(0)}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke={latestColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points & x-labels */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.score)} r="3.5" fill="white" stroke={latestColor} strokeWidth="2" />
          <text
            x={toX(i)} y={H - 4}
            textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="600"
          >
            {d.date.replace(" 2026", "")}
          </text>
          {/* Score label on point */}
          <text
            x={toX(i)} y={toY(d.score) - 7}
            textAnchor="middle" fontSize="7" fill={latestColor} fontWeight="800"
          >
            {d.score.toFixed(1)}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─── SVG Horizontal Bar Chart ─────────────────────────────────────────────────
function HorizontalBarChart({ avgScores }: { avgScores: Record<string, number> }) {
  return (
    <div className="space-y-3">
      {CRITERIA.map((c) => {
        const val = avgScores[c.key] ?? 0;
        const pct = (val / 10) * 100;
        const cfg = getRatingConfig(val);
        return (
          <div key={c.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-700">{c.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold tabular-nums" style={{ color: cfg.color }}>{val.toFixed(1)}</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${cfg.bg}`}>{cfg.label}</span>
              </div>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: cfg.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SVG Radar Chart ─────────────────────────────────────────────────────────
function RadarChart({ avgScores }: { avgScores: Record<string, number> }) {
  const N = CRITERIA.length;
  const CX = 130, CY = 120, R = 90;
  const levels = [2, 4, 6, 8, 10];
  const color = "#dc2626";

  const angleFor = (i: number) => (2 * Math.PI * i) / N - Math.PI / 2;

  const pointOnLevel = (i: number, level: number) => {
    const angle = angleFor(i);
    const r = (level / 10) * R;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  };

  const dataPoints = CRITERIA.map((c, i) => {
    const val = Math.min(10, avgScores[c.key] ?? 0);
    const angle = angleFor(i);
    const r = (val / 10) * R;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle), val };
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  return (
    <svg width="100%" viewBox="0 0 260 240" style={{ display: "block" }}>
      <defs>
        <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Background level polygons */}
      {levels.map(level => {
        const pts = CRITERIA.map((_, i) => {
          const p = pointOnLevel(i, level);
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {CRITERIA.map((_, i) => {
        const outer = pointOnLevel(i, 10);
        return (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)}
            stroke="#e2e8f0" strokeWidth="1"
          />
        );
      })}

      {/* Data fill */}
      <path d={dataPath} fill="url(#radarGrad)" stroke={color} strokeWidth="2" strokeLinejoin="round" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="white" stroke={color} strokeWidth="2" />
      ))}

      {/* Labels */}
      {CRITERIA.map((c, i) => {
        const angle = angleFor(i);
        const labelR = R + 20;
        const lx = CX + labelR * Math.cos(angle);
        const ly = CY + labelR * Math.sin(angle);
        const anchor = Math.cos(angle) > 0.3 ? "start" : Math.cos(angle) < -0.3 ? "end" : "middle";

        return (
          <text
            key={i}
            x={lx.toFixed(1)}
            y={ly.toFixed(1)}
            textAnchor={anchor}
            fontSize="7.5"
            fontWeight="700"
            fill="#64748b"
            dominantBaseline="middle"
          >
            {c.short}
          </text>
        );
      })}

      {/* Level labels */}
      {[2, 6, 10].map(level => {
        const p = pointOnLevel(0, level);
        return (
          <text key={level} x={p.x + 3} y={p.y - 3} fontSize="6.5" fill="#94a3b8" fontWeight="600">
            {level}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeAuditDetailPage() {
  const params = useParams();
  const router = useRouter();
  const empId = params.id as string;

  const [activeChart, setActiveChart] = useState<"line" | "bar" | "radar">("line");

  const info = EMPLOYEE_INFO[empId];
  const history = ALL_AUDIT_HISTORY[empId];

  if (!info || !history || history.length === 0) {
    return (
      <div className="auth-bg min-h-screen flex flex-col pb-24">
        <header className="sticky top-0 z-10 flex items-center gap-3 px-4 py-4 bg-white border-b border-slate-100 shadow-sm">
          <button onClick={() => router.back()} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h1 className="text-sm font-extrabold text-slate-900">Audit Detail</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-700">No audit records found</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">This employee does not have any showroom visit assessment history yet.</p>
          <button onClick={() => router.back()} className="mt-5 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl cursor-pointer">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Calculate averages per criterion
  const avgScores: Record<string, number> = {};
  CRITERIA.forEach(c => {
    const vals = history.map(h => h.scores[c.key] ?? 0);
    avgScores[c.key] = vals.reduce((s, v) => s + v, 0) / vals.length;
  });

  const latestEntry = history[history.length - 1];
  const firstEntry = history[0];
  const latestCfg = getRatingConfig(latestEntry.score);
  const trendDiff = (latestEntry.score - firstEntry.score).toFixed(1);
  const trendUp = latestEntry.score >= firstEntry.score;
  const overallAvg = history.reduce((s, h) => s + h.score, 0) / history.length;

  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Audit Progress
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Showroom Visit Assessment</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
          ASSESSOR
        </span>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-4">

        {/* Employee Info Card */}
        <div className="auth-card p-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar initial */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-base flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}>
              {info.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                {info.name}
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{info.designation}</p>
              <div className="flex items-center gap-1 mt-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-[9px] text-slate-400 font-medium">{info.showroom} · {info.division}</p>
              </div>
            </div>
            {/* Score ring mini */}
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-xl font-extrabold tabular-nums" style={{ color: latestCfg.color }}>
                {latestEntry.score.toFixed(1)}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Latest</span>
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
            <div className="text-center">
              <span className="text-base font-extrabold text-slate-900">{history.length}</span>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Visits</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <span className="text-base font-extrabold text-slate-900">{overallAvg.toFixed(1)}</span>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Avg Score</p>
            </div>
            <div className="text-center">
              <span className="text-base font-extrabold" style={{ color: trendUp ? "#10b981" : "#ef4444" }}>
                {trendUp ? "+" : ""}{trendDiff}
              </span>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Trend</p>
            </div>
          </div>

          {/* Rating badge */}
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg border ${latestCfg.bg}`}>
              {latestCfg.label} Performance
            </span>
            <span className="text-[9px] text-slate-400 font-medium">
              Based on {history.length} assessment{history.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Chart Selector */}
        <div className="auth-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Performance Analytics
              </h3>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                {activeChart === "line" ? "Score trend over visits" : activeChart === "bar" ? "Average per criterion" : "Criterion balance overview"}
              </p>
            </div>
            {/* Tab switcher */}
            <div className="flex bg-slate-100 rounded-xl p-0.5 gap-0.5">
              {([
                { key: "line", icon: "M3 12l4-8 4 8 4-5 4 5", label: "Trend" },
                { key: "bar", icon: "M3 20v-8h4v8H3zm6 0V8h4v12H9zm6 0V4h4v16h-4z", label: "Bar" },
                { key: "radar", icon: "M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z", label: "Radar" },
              ] as const).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveChart(tab.key as any)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                    activeChart === tab.key
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            {activeChart === "line" && <LineChart data={history.map(h => ({ date: h.date, score: h.score }))} />}
            {activeChart === "bar" && <HorizontalBarChart avgScores={avgScores} />}
            {activeChart === "radar" && <RadarChart avgScores={avgScores} />}
          </div>
        </div>

        {/* Latest Assessment Breakdown */}
        <div className="auth-card p-4 space-y-3">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Latest Visit Breakdown
            </h3>
            <p className="text-[9px] text-slate-400 font-medium mt-0.5">{latestEntry.date} · {latestEntry.showroom}</p>
          </div>

          <div className="space-y-2.5">
            {CRITERIA.map(c => {
              const val = latestEntry.scores[c.key] ?? 0;
              const cfg = getRatingConfig(val);
              return (
                <div key={c.key} className="flex items-center gap-3">
                  <div className="w-20 flex-shrink-0">
                    <span className="text-[9px] text-slate-600 font-semibold leading-tight block">{c.label}</span>
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(val / 10) * 100}%`, backgroundColor: cfg.color }}
                    />
                  </div>
                  <span className="w-6 text-right text-[10px] font-extrabold tabular-nums flex-shrink-0" style={{ color: cfg.color }}>
                    {val}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold">Total Average</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tabular-nums" style={{ color: latestCfg.color }}>
                {latestEntry.score.toFixed(1)}/10
              </span>
              <span className={`text-[8px] font-bold px-2 py-0.5 rounded-lg border ${latestCfg.bg}`}>
                {latestCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Visit History Timeline */}
        <div className="auth-card p-4 space-y-3">
          <h3 className="text-xs font-extrabold text-slate-800" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Visit History
          </h3>

          <div className="space-y-2">
            {[...history].reverse().map((h, idx) => {
              const cfg = getRatingConfig(h.score);
              return (
                <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50/40">
                  {/* Timeline dot */}
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-700">{h.date}</span>
                    <span className="text-[9px] text-slate-400 font-medium block">{h.showroom}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs font-extrabold tabular-nums" style={{ color: cfg.color }}>{h.score.toFixed(1)}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${cfg.bg}`}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Nav Footer */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-around shadow-lg md:max-w-md md:mx-auto md:rounded-t-2xl">
        <Link href="/assessor/dashboard" className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          <span className="text-[9px] font-semibold">Home</span>
        </Link>
        <Link href="/assessor/create-assessment" className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
          <span className="text-[9px] font-semibold">New Audit</span>
        </Link>
        <Link href="/assessor/visit-assessment" className="flex flex-col items-center gap-0.5 text-red-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          <span className="text-[9px] font-bold">Visit</span>
        </Link>
      </nav>
    </div>
  );
}
