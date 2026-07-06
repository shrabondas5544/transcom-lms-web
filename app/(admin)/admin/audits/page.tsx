"use client";

import { useState, useMemo } from "react";

const AUDIT_VISITS = [
  { id: "AV-2048", emp: "Anisur Rahman",   showroom: "Gulshan Outlet",     division: "Dhaka",      assessor: "Mustafizur Rahman", date: "2026-07-05", customer: 8.5, product: 8.8, grooming: 8.2, overall: 8.5, status: "Pass" },
  { id: "AV-2047", emp: "Sadia Afrin",     showroom: "Uttara Outlet",      division: "Dhaka",      assessor: "Mustafizur Rahman", date: "2026-07-04", customer: 7.2, product: 5.0, grooming: 5.0, overall: 5.7, status: "Review" },
  { id: "AV-2046", emp: "Hafizur Rahman",  showroom: "Zindabazar Outlet",  division: "Sylhet",     assessor: "Tariqul Islam",     date: "2026-07-03", customer: 9.5, product: 9.6, grooming: 9.3, overall: 9.5, status: "Pass" },
  { id: "AV-2045", emp: "Arifur Rahman",   showroom: "Agrabad Outlet",     division: "Chittagong", assessor: "Shakil Ahmed",      date: "2026-07-03", customer: 8.8, product: 8.7, grooming: 8.5, overall: 8.7, status: "Pass" },
  { id: "AV-2044", emp: "Nayeem Uddin",    showroom: "GEC Circle Outlet",  division: "Chittagong", assessor: "Shakil Ahmed",      date: "2026-07-02", customer: 4.5, product: 4.8, grooming: 5.2, overall: 4.8, status: "Critical" },
  { id: "AV-2043", emp: "Sujon Ali",       showroom: "Saheb Bazar Outlet", division: "Rajshahi",   assessor: "Rafiqul Hossain",   date: "2026-07-01", customer: 7.5, product: 7.8, grooming: 7.2, overall: 7.5, status: "Pass" },
  { id: "AV-2042", emp: "Zamil Ahmed",     showroom: "Uposhahar Outlet",   division: "Sylhet",     assessor: "Tariqul Islam",     date: "2026-06-30", customer: 6.0, product: 6.3, grooming: 6.2, overall: 6.2, status: "Review" },
  { id: "AV-2041", emp: "Kamrul Hasan",    showroom: "Uttara Outlet",      division: "Dhaka",      assessor: "Mustafizur Rahman", date: "2026-06-29", customer: 7.9, product: 8.0, grooming: 7.7, overall: 7.9, status: "Pass" },
  { id: "AV-2040", emp: "Imran Khan",      showroom: "Agrabad Outlet",     division: "Chittagong", assessor: "Shakil Ahmed",      date: "2026-06-28", customer: 8.2, product: 8.1, grooming: 8.0, overall: 8.1, status: "Pass" },
  { id: "AV-2039", emp: "Fahim Shahriar",  showroom: "Dhanmondi Outlet",   division: "Dhaka",      assessor: "Mustafizur Rahman", date: "2026-06-27", customer: 7.3, product: 7.1, grooming: 7.2, overall: 7.2, status: "Pass" },
  { id: "AV-2038", emp: "Mehrab Hossain",  showroom: "Dhanmondi Outlet",   division: "Dhaka",      assessor: "Mustafizur Rahman", date: "2026-06-26", customer: 6.8, product: 6.7, grooming: 6.9, overall: 6.8, status: "Pass" },
  { id: "AV-2037", emp: "Sayed Mahmud",    showroom: "Gulshan Outlet",     division: "Dhaka",      assessor: "Mustafizur Rahman", date: "2026-06-25", customer: 9.2, product: 9.4, grooming: 9.0, overall: 9.2, status: "Pass" },
];

const DIVISIONS  = ["All Divisions", "Dhaka", "Chittagong", "Sylhet", "Rajshahi"];
const ASSESSORS  = ["All Assessors", "Mustafizur Rahman", "Tariqul Islam", "Shakil Ahmed", "Rafiqul Hossain"];
const STATUS_OPT = ["All Status", "Pass", "Review", "Critical"];

function getStatusBadge(s: string) {
  if (s === "Pass")     return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "Review")   return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
}
function getScoreColor(s: number) { return s >= 8.5 ? "#10b981" : s >= 7 ? "#3b82f6" : s >= 5.5 ? "#f59e0b" : "#ef4444"; }
function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
        <div className="h-full rounded-full" style={{ width: `${score*10}%`, backgroundColor: getScoreColor(score) }} />
      </div>
      <span className="text-[11px] font-mono font-bold tabular-nums" style={{ color: getScoreColor(score) }}>{score.toFixed(1)}</span>
    </div>
  );
}

export default function AdminAuditsPage() {
  const [division, setDiv]     = useState("All Divisions");
  const [assessor, setAssessor]= useState("All Assessors");
  const [status, setStatus]    = useState("All Status");
  const [search, setSearch]    = useState("");
  const [expanded, setExpanded]= useState<string | null>(null);
  const [page, setPage]        = useState(1);
  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    let d = [...AUDIT_VISITS];
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(v => v.emp.toLowerCase().includes(q) || v.showroom.toLowerCase().includes(q) || v.id.toLowerCase().includes(q)); }
    if (division !== "All Divisions") d = d.filter(v => v.division === division);
    if (assessor !== "All Assessors") d = d.filter(v => v.assessor === assessor);
    if (status   !== "All Status")    d = d.filter(v => v.status   === status);
    return d;
  }, [search, division, assessor, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const kpis = [
    { label: "Total Visits",    value: AUDIT_VISITS.length,                                          sub: "All time",           color: "text-slate-900" },
    { label: "This Month",      value: AUDIT_VISITS.filter(v => v.date.startsWith("2026-07")).length, sub: "July 2026",          color: "text-blue-600" },
    { label: "Avg Audit Score", value: (AUDIT_VISITS.reduce((s,v)=>s+v.overall,0)/AUDIT_VISITS.length).toFixed(1), sub: "Overall", color: "text-emerald-600" },
    { label: "Critical Alerts", value: AUDIT_VISITS.filter(v => v.status === "Critical").length,     sub: "Need HR review",     color: "text-red-600" },
  ];

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{k.label}</p>
            <p className={`text-2xl font-extrabold mt-1.5 ${k.color}`}>{k.value}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search employee, showroom, ID…" className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 w-52 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-200" />
            </div>
            {[
              { value: division, set: setDiv,      opts: DIVISIONS },
              { value: assessor, set: setAssessor, opts: ASSESSORS },
              { value: status,   set: setStatus,   opts: STATUS_OPT },
            ].map((f, i) => (
              <select key={i} value={f.value} onChange={e => { f.set(e.target.value); setPage(1); }} className="text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 px-3 py-1.5 focus:outline-none">
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 font-medium flex-shrink-0">{filtered.length} records</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Visit ID</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Employee / Showroom</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Assessor</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Customer</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Product</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Grooming</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Overall</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map(v => (
                <>
                  <tr
                    key={v.id}
                    className={`hover:bg-slate-50/60 transition-colors cursor-pointer ${expanded === v.id ? "bg-red-50/30" : ""}`}
                    onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                  >
                    <td className="px-4 py-3.5 text-[11px] font-mono font-bold text-slate-500">{v.id}</td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-bold text-slate-900">{v.emp}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{v.showroom} · <span className="font-bold">{v.division}</span></p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-slate-600 font-medium">{v.assessor}</td>
                    <td className="px-4 py-3.5 hidden xl:table-cell"><ScoreBar score={v.customer} /></td>
                    <td className="px-4 py-3.5 hidden xl:table-cell"><ScoreBar score={v.product} /></td>
                    <td className="px-4 py-3.5 hidden xl:table-cell"><ScoreBar score={v.grooming} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-mono font-extrabold" style={{ color: getScoreColor(v.overall) }}>{v.overall.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusBadge(v.status)}`}>{v.status}</span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-[11px] text-slate-400 font-medium">{v.date}</td>
                    <td className="px-4 py-3.5 text-slate-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${expanded===v.id?"rotate-180":""}`}><polyline points="6 9 12 15 18 9"/></svg>
                    </td>
                  </tr>
                  {expanded === v.id && (
                    <tr key={`${v.id}-exp`} className="bg-red-50/20">
                      <td colSpan={10} className="px-8 py-4">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                          {[
                            { label: "Customer Dealing", score: v.customer },
                            { label: "Product Knowledge", score: v.product },
                            { label: "Grooming & Posture", score: v.grooming },
                            { label: "Overall Score", score: v.overall },
                          ].map(m => (
                            <div key={m.label} className="bg-white rounded-xl p-3 border border-slate-200 col-span-1 sm:col-span-1">
                              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">{m.label}</p>
                              <p className="text-xl font-extrabold mt-1" style={{ color: getScoreColor(m.score) }}>{m.score.toFixed(1)}</p>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5">
                                <div className="h-full rounded-full" style={{ width: `${m.score*10}%`, backgroundColor: getScoreColor(m.score) }} />
                              </div>
                            </div>
                          ))}
                          <div className="col-span-2 sm:col-span-2 flex gap-2 items-center">
                            <button className="px-3 py-2 text-[11px] font-extrabold rounded-xl bg-slate-900 text-white hover:bg-slate-700 transition-colors">View Full Report</button>
                            <button className="px-3 py-2 text-[11px] font-extrabold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">Edit Assessment</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={10} className="text-center py-12 text-sm text-slate-400 italic">No audit records match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-[11px] text-slate-500 font-medium">
            {filtered.length === 0 ? 0 : (page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of <strong className="text-slate-700">{filtered.length}</strong> visits
          </p>
          <div className="flex items-center gap-2">
            <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 transition-colors">← Prev</button>
            <span className="text-[11px] font-bold text-slate-500 px-1">{page} / {totalPages}</span>
            <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 transition-colors">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
