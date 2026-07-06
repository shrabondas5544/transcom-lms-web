"use client";

import { useState, useMemo } from "react";

// ── Mock Data (mirrors the C# AdminAnalyticsController mock dataset) ─────────
const MOCK_EMPLOYEES = [
  { code: "EMP-4011", name: "Hafizur Rahman",  designation: "Senior Sales Executive",   showroom: "Zindabazar Outlet",  division: "Sylhet Division",     skillScore: 9.6, auditScore: 9.5, combined: 9.56 },
  { code: "EMP-2084", name: "Sayed Mahmud",    designation: "Senior Sales Executive",   showroom: "Gulshan Outlet",     division: "Dhaka Division",      skillScore: 9.4, auditScore: 9.2, combined: 9.32 },
  { code: "EMP-2086", name: "Taskeen Ahmed",   designation: "Assistant Branch Manager", showroom: "Gulshan Outlet",     division: "Dhaka Division",      skillScore: 9.1, auditScore: 8.9, combined: 9.02 },
  { code: "EMP-3012", name: "Arifur Rahman",   designation: "Senior Sales Executive",   showroom: "Agrabad Outlet",     division: "Chittagong Division", skillScore: 8.9, auditScore: 8.7, combined: 8.82 },
  { code: "EMP-2085", name: "Anisur Rahman",   designation: "Sales Executive",          showroom: "Gulshan Outlet",     division: "Dhaka Division",      skillScore: 8.8, auditScore: 8.5, combined: 8.68 },
  { code: "EMP-2090", name: "Kamrul Hasan",    designation: "Assistant Branch Manager", showroom: "Uttara Outlet",      division: "Dhaka Division",      skillScore: 8.5, auditScore: 7.9, combined: 8.26 },
  { code: "EMP-3011", name: "Imran Khan",      designation: "Sales Executive",          showroom: "Agrabad Outlet",     division: "Chittagong Division", skillScore: 8.3, auditScore: 8.1, combined: 8.22 },
  { code: "EMP-2089", name: "Sadia Afrin",     designation: "Sales Executive",          showroom: "Uttara Outlet",      division: "Dhaka Division",      skillScore: 8.2, auditScore: 5.4, combined: 7.08 },
  { code: "EMP-5011", name: "Sujon Ali",       designation: "Sales Executive",          showroom: "Saheb Bazar Outlet", division: "Rajshahi Division",   skillScore: 7.9, auditScore: 7.5, combined: 7.74 },
  { code: "EMP-2087", name: "Fahim Shahriar",  designation: "Sales Executive",          showroom: "Dhanmondi Outlet",   division: "Dhaka Division",      skillScore: 7.5, auditScore: 7.2, combined: 7.38 },
  { code: "EMP-2088", name: "Mehrab Hossain",  designation: "Senior Sales Executive",   showroom: "Dhanmondi Outlet",   division: "Dhaka Division",      skillScore: 7.0, auditScore: 6.8, combined: 6.92 },
  { code: "EMP-4012", name: "Zamil Ahmed",     designation: "Assistant Branch Manager", showroom: "Uposhahar Outlet",   division: "Sylhet Division",     skillScore: 6.8, auditScore: 6.2, combined: 6.56 },
  { code: "EMP-3013", name: "Nayeem Uddin",    designation: "Sales Executive",          showroom: "GEC Circle Outlet",  division: "Chittagong Division", skillScore: 5.2, auditScore: 4.8, combined: 5.04 },
];

const AUDIT_ALERTS = [
  { id: 1, emp: "Nayeem Uddin",   showroom: "GEC Circle",    score: 4.8, type: "Critical",  time: "12 min ago",  color: "#ef4444" },
  { id: 2, emp: "Zamil Ahmed",    showroom: "Uposhahar",     score: 6.2, type: "Warning",   time: "2 hr ago",    color: "#f59e0b" },
  { id: 3, emp: "Mehrab Hossain", showroom: "Dhanmondi",     score: 6.8, type: "Watch",     time: "5 hr ago",    color: "#f97316" },
];

const DIVISIONS = ["All Divisions", "Dhaka Division", "Chittagong Division", "Sylhet Division", "Rajshahi Division"];
const DESIGNATIONS = ["All Designations", "Senior Sales Executive", "Sales Executive", "Assistant Branch Manager"];

function getStatus(score: number) {
  if (score >= 8.5) return { label: "Excellent",         bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 7.0) return { label: "Good",              bg: "bg-blue-50   text-blue-700   border-blue-200" };
  if (score >= 5.5) return { label: "Satisfactory",      bg: "bg-amber-50  text-amber-700  border-amber-200" };
  return                   { label: "Needs Improvement", bg: "bg-red-50    text-red-700    border-red-200" };
}

function getScoreColor(score: number) {
  if (score >= 8.5) return "text-emerald-600";
  if (score >= 7.0) return "text-blue-600";
  if (score >= 5.5) return "text-amber-600";
  return "text-red-600";
}

type SortKey = "skillScore" | "auditScore" | "combined";
type SortDir = "asc" | "desc";

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  // Table state
  const [search, setSearch]         = useState("");
  const [division, setDivision]     = useState("All Divisions");
  const [designation, setDesig]     = useState("All Designations");
  const [sortKey, setSortKey]       = useState<SortKey>("combined");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");
  const [page, setPage]             = useState(1);
  const PAGE_SIZE = 10;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`ml-1 inline-flex flex-col gap-0.5 transition-opacity ${sortKey === col ? "opacity-100" : "opacity-30"}`}>
      <svg width="6" height="4" viewBox="0 0 6 4" fill={sortKey === col && sortDir === "asc" ? "#1e293b" : "#94a3b8"}>
        <path d="M3 0L6 4H0L3 0Z" />
      </svg>
      <svg width="6" height="4" viewBox="0 0 6 4" fill={sortKey === col && sortDir === "desc" ? "#1e293b" : "#94a3b8"}>
        <path d="M3 4L0 0H6L3 4Z" />
      </svg>
    </span>
  );

  const filtered = useMemo(() => {
    let d = [...MOCK_EMPLOYEES];
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.showroom.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q)
      );
    }
    if (division !== "All Divisions")     d = d.filter(e => e.division === division);
    if (designation !== "All Designations") d = d.filter(e => e.designation === designation);
    d.sort((a, b) => sortDir === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
    return d;
  }, [search, division, designation, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // KPI values
  const avgScore = (MOCK_EMPLOYEES.reduce((s, e) => s + e.combined, 0) / MOCK_EMPLOYEES.length).toFixed(2);

  return (
    <div className="p-5 lg:p-8 space-y-7 animate-fade-in-up">

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Employees */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Employees</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2 leading-none">{MOCK_EMPLOYEES.length}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-2">Across all divisions</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-emerald-600">+2 this month</span>
          </div>
        </div>

        {/* Card 2: Active Assessments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Assessments</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2 leading-none">7</p>
              <p className="text-[10px] text-slate-400 font-medium mt-2">Open & accepting responses</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-amber-600">3 expire this week</span>
          </div>
        </div>

        {/* Card 3: Avg Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Avg Performance</p>
              <div className="flex items-baseline gap-1 mt-2">
                <p className="text-3xl font-extrabold text-slate-900 leading-none">{avgScore}</p>
                <span className="text-sm text-slate-400 font-bold">/10</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-2">Combined score average</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-emerald-600">↑ +4.2% vs last month</span>
          </div>
        </div>

        {/* Card 4: Audit Alerts */}
        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest">Audit Alerts</p>
              <p className="text-3xl font-extrabold text-red-600 mt-2 leading-none">3</p>
              <p className="text-[10px] text-slate-400 font-medium mt-2">Pending HR review</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-red-100">
            <span className="text-[10px] font-bold text-red-600">1 critical, requires action</span>
          </div>
        </div>
      </div>

      {/* ── Main Content: Table + Alerts Sidebar ─────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* ── Performance Leaderboard Table ──────────────────────────────── */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Employee Performance Leaderboard
              </h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {filtered.length} records · Sorted by {sortKey === "combined" ? "Combined Score" : sortKey === "skillScore" ? "Skill Score" : "Audit Score"} ({sortDir === "desc" ? "High → Low" : "Low → High"})
              </p>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search name, showroom…"
                  className="pl-8 pr-3 py-1.5 text-[11px] font-medium border border-slate-200 rounded-lg bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-200 w-44 placeholder-slate-400"
                />
              </div>
              {/* Division filter */}
              <select
                value={division}
                onChange={e => { setDivision(e.target.value); setPage(1); }}
                className="text-[11px] font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700 px-2.5 py-1.5 focus:outline-none"
              >
                {DIVISIONS.map(d => <option key={d}>{d}</option>)}
              </select>
              {/* Designation filter */}
              <select
                value={designation}
                onChange={e => { setDesig(e.target.value); setPage(1); }}
                className="text-[11px] font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700 px-2.5 py-1.5 focus:outline-none"
              >
                {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider w-10">#</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Showroom</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Division</th>
                  <th
                    className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 select-none"
                    onClick={() => handleSort("skillScore")}
                  >
                    <span className="flex items-center">Skill<SortIcon col="skillScore" /></span>
                  </th>
                  <th
                    className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 select-none"
                    onClick={() => handleSort("auditScore")}
                  >
                    <span className="flex items-center">Audit<SortIcon col="auditScore" /></span>
                  </th>
                  <th
                    className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 select-none"
                    onClick={() => handleSort("combined")}
                  >
                    <span className="flex items-center">Combined<SortIcon col="combined" /></span>
                  </th>
                  <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pageRows.map((emp, idx) => {
                  const rank = (page - 1) * PAGE_SIZE + idx + 1;
                  const status = getStatus(emp.combined);
                  let rankStyle = "bg-slate-100 text-slate-600";
                  if (rank === 1) rankStyle = "bg-amber-100 text-amber-700";
                  else if (rank === 2) rankStyle = "bg-slate-200 text-slate-700";
                  else if (rank === 3) rankStyle = "bg-orange-100 text-orange-700";
                  return (
                    <tr key={emp.code} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-4 py-3.5">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold ${rankStyle}`}>{rank}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{emp.designation} · {emp.code}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden xl:table-cell text-xs text-slate-600 font-medium">{emp.showroom}</td>
                      <td className="px-4 py-3.5 hidden xl:table-cell">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{emp.division.replace(" Division", "")}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-mono font-bold tabular-nums ${getScoreColor(emp.skillScore)}`}>{emp.skillScore.toFixed(1)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-mono font-bold tabular-nums ${getScoreColor(emp.auditScore)}`}>{emp.auditScore.toFixed(1)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-extrabold tabular-nums ${getScoreColor(emp.combined)}`}>{emp.combined.toFixed(2)}</span>
                          {/* Mini score bar */}
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden xl:block">
                            <div className="h-full rounded-full transition-all" style={{ width: `${(emp.combined / 10) * 100}%`, backgroundColor: emp.combined >= 8.5 ? "#10b981" : emp.combined >= 7 ? "#3b82f6" : emp.combined >= 5.5 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${status.bg}`}>{status.label}</span>
                      </td>
                    </tr>
                  );
                })}
                {pageRows.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-sm text-slate-400 italic">No matching employees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (< lg) */}
          <div className="lg:hidden divide-y divide-slate-100">
            {pageRows.map((emp, idx) => {
              const rank = (page - 1) * PAGE_SIZE + idx + 1;
              const status = getStatus(emp.combined);
              return (
                <div key={emp.code} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[9px] font-extrabold flex items-center justify-center">{rank}</span>
                      <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${status.bg}`}>{status.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mb-2">{emp.designation} · {emp.showroom}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[["Skill", emp.skillScore], ["Audit", emp.auditScore], ["Combined", emp.combined]].map(([label, score]) => (
                      <div key={String(label)} className="bg-slate-50 rounded-lg p-2 text-center">
                        <p className="text-[8px] text-slate-400 font-extrabold uppercase">{label}</p>
                        <p className={`text-sm font-mono font-extrabold mt-0.5 ${getScoreColor(Number(score))}`}>{Number(score).toFixed(1)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {pageRows.length === 0 && (
              <p className="text-center py-10 text-sm text-slate-400 italic">No matching employees found.</p>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
            <p className="text-[11px] text-slate-500 font-medium">
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of <span className="font-bold text-slate-700">{filtered.length}</span> employees
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
              >
                ← Prev
              </button>
              <span className="text-[11px] font-bold text-slate-500 px-1">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ── Audit Alerts Panel (right sidebar on xl+) ─────────────────── */}
        <div className="xl:w-72 flex-shrink-0 space-y-4">
          {/* Alerts Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900">Audit Alerts</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Require immediate review</p>
              </div>
              <span className="text-[9px] font-extrabold bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">
                {AUDIT_ALERTS.length} OPEN
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {AUDIT_ALERTS.map(alert => (
                <div key={alert.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: alert.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{alert.emp}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">{alert.showroom} · Score: <span className="font-extrabold text-red-600">{alert.score}</span></p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border" style={{ color: alert.color, borderColor: `${alert.color}40`, backgroundColor: `${alert.color}0d` }}>
                          {alert.type}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <button className="text-[11px] font-bold text-red-600 hover:underline w-full text-center">
                View All Alerts →
              </button>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3.5">
            <h3 className="text-xs font-extrabold text-slate-900">Showroom Visit Stats</h3>
            {[
              { label: "Visits This Month", value: "48", sub: "Across all divisions" },
              { label: "Top Division",      value: "Dhaka",   sub: "6 showrooms · 7 assessors" },
              { label: "Compliance Rate",   value: "87%",     sub: "Grooming & posture checks" },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between py-2 border-t border-slate-50 first:border-t-0 first:pt-0">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{stat.sub}</p>
                </div>
                <span className="text-lg font-extrabold text-slate-800">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
