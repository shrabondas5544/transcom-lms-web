"use client";

import { useState } from "react";

const REPORT_TYPES = [
  {
    id: "performance",
    title: "Performance Report",
    desc: "Combined skill and audit scores across all employees, ranked by division and showroom.",
    icon: "📊",
    badge: "Most Used",
    badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
    formats: ["PDF", "CSV", "Excel"],
  },
  {
    id: "compliance",
    title: "Audit Compliance Report",
    desc: "Showroom floor compliance metrics — grooming, posture, customer engagement pass rates.",
    icon: "✅",
    badge: "Weekly",
    badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    formats: ["PDF", "CSV"],
  },
  {
    id: "division",
    title: "Division Summary",
    desc: "High-level snapshot per geographic division — total employees, avg scores, audit counts.",
    icon: "🗺️",
    badge: "Monthly",
    badgeColor: "bg-amber-50 text-amber-600 border-amber-100",
    formats: ["PDF", "Excel"],
  },
  {
    id: "trend",
    title: "Trend Analysis",
    desc: "Month-over-month score progression to identify improving and declining performance.",
    icon: "📈",
    badge: "Quarterly",
    badgeColor: "bg-violet-50 text-violet-600 border-violet-100",
    formats: ["PDF", "CSV", "Excel"],
  },
  {
    id: "completion",
    title: "Assessment Completion Rate",
    desc: "Which assessments have been completed, pending, or skipped across all employees.",
    icon: "🎯",
    badge: null,
    badgeColor: "",
    formats: ["CSV", "Excel"],
  },
  {
    id: "showroom",
    title: "Showroom Audit Log",
    desc: "Full historical log of all showroom visits with individual criterion scores.",
    icon: "📍",
    badge: null,
    badgeColor: "",
    formats: ["CSV", "Excel"],
  },
];

const RECENT_REPORTS = [
  { name: "Performance Report — June 2026",      type: "PDF",  size: "2.4 MB", generated: "2026-07-01", by: "HR Admin" },
  { name: "Audit Compliance — W26 2026",          type: "PDF",  size: "1.1 MB", generated: "2026-06-29", by: "HR Admin" },
  { name: "Division Summary — Q2 2026",           type: "Excel",size: "540 KB", generated: "2026-06-28", by: "HR Admin" },
  { name: "Trend Analysis — Q1 vs Q2 2026",       type: "PDF",  size: "3.2 MB", generated: "2026-06-25", by: "HR Admin" },
  { name: "Assessment Completion — May 2026",     type: "CSV",  size: "88 KB",  generated: "2026-06-20", by: "HR Admin" },
];

const DIVISION_STATS = [
  { name: "Dhaka",      employees: 7, avgScore: 7.96, visits: 22, passing: 85 },
  { name: "Chittagong", employees: 3, avgScore: 7.35, visits: 14, passing: 72 },
  { name: "Sylhet",     employees: 2, avgScore: 8.06, visits: 8,  passing: 90 },
  { name: "Rajshahi",   employees: 1, avgScore: 7.74, visits: 4,  passing: 88 },
];

function FileTypeIcon({ type }: { type: string }) {
  const colors: Record<string, string> = { PDF: "bg-red-50 text-red-600", CSV: "bg-emerald-50 text-emerald-600", Excel: "bg-green-50 text-green-700" };
  return <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${colors[type] ?? "bg-slate-100 text-slate-600"}`}>{type}</span>;
}

export default function AdminReportsPage() {
  const [selected, setSelected] = useState("performance");
  const [division, setDivision] = useState("All Divisions");
  const [fromDate, setFrom]     = useState("2026-06-01");
  const [toDate,   setTo]       = useState("2026-07-06");
  const [format,   setFormat]   = useState("PDF");
  const [generating, setGen]    = useState(false);

  const selectedType = REPORT_TYPES.find(r => r.id === selected)!;

  const handleGenerate = () => {
    setGen(true);
    setTimeout(() => setGen(false), 2000);
  };

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Top 2-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: Report type picker */}
        <div className="xl:col-span-2 space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>Select Report Type</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Choose what to generate, then configure options on the right.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REPORT_TYPES.map(r => (
              <button
                key={r.id}
                onClick={() => { setSelected(r.id); setFormat(r.formats[0]); }}
                className={`text-left p-4 rounded-2xl border-2 transition-all ${
                  selected === r.id
                    ? "border-red-500 bg-red-50/50 shadow-md shadow-red-100"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{r.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-xs font-extrabold ${selected === r.id ? "text-red-700" : "text-slate-900"}`}>{r.title}</p>
                      {r.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${r.badgeColor}`}>{r.badge}</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-snug">{r.desc}</p>
                    <div className="flex gap-1 mt-2">
                      {r.formats.map(f => <span key={f} className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{f}</span>)}
                    </div>
                  </div>
                  {selected === r.id && (
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Generate panel */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 sticky top-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Generate Report</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{selectedType.title}</p>
            </div>

            {/* Date range */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 mb-1">From</p>
                  <input type="date" value={fromDate} onChange={e => setFrom(e.target.value)} className="w-full text-[11px] font-medium border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-200" />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 mb-1">To</p>
                  <input type="date" value={toDate} onChange={e => setTo(e.target.value)} className="w-full text-[11px] font-medium border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-200" />
                </div>
              </div>
            </div>

            {/* Division */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Division</label>
              <select value={division} onChange={e => setDivision(e.target.value)} className="w-full mt-1 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-200">
                {["All Divisions","Dhaka Division","Chittagong Division","Sylhet Division","Rajshahi Division"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Format */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Export Format</label>
              <div className="flex gap-2 mt-1">
                {selectedType.formats.map(f => (
                  <button key={f} onClick={() => setFormat(f)} className={`flex-1 py-1.5 text-[11px] font-extrabold rounded-xl border transition-all ${format===f ? "border-red-500 bg-red-50 text-red-600" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>{f}</button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-extrabold shadow-sm hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Generate & Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Division summary charts */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-extrabold text-slate-900 mb-4" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>Division Performance Overview</h3>
        <div className="space-y-4">
          {DIVISION_STATS.map(div => (
            <div key={div.name} className="grid grid-cols-4 lg:grid-cols-7 gap-3 items-center">
              <div className="col-span-1">
                <p className="text-xs font-extrabold text-slate-800">{div.name}</p>
                <p className="text-[9px] text-slate-400 font-medium">{div.employees} emp.</p>
              </div>
              <div className="col-span-2 lg:col-span-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-400" style={{ width: `${div.passing}%` }} />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-600 w-10 text-right">{div.passing}%</span>
                </div>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">Compliance pass rate</p>
              </div>
              <div className="col-span-1 text-right">
                <p className="text-sm font-extrabold text-slate-800">{div.avgScore.toFixed(2)}</p>
                <p className="text-[9px] text-slate-400 font-medium">avg score</p>
              </div>
              <div className="col-span-1 lg:col-span-1 text-right hidden lg:block">
                <p className="text-sm font-extrabold text-slate-600">{div.visits}</p>
                <p className="text-[9px] text-slate-400 font-medium">visits</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900">Recent Generated Reports</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Previously generated reports available for re-download</p>
        </div>
        <div className="divide-y divide-slate-50">
          {RECENT_REPORTS.map((r, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{r.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{r.generated} · {r.size} · by {r.by}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <FileTypeIcon type={r.type} />
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover:opacity-100">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
