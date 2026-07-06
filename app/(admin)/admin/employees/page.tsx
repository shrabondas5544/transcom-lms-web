"use client";

import { useState, useMemo } from "react";

const EMPLOYEES = [
  { code: "EMP-4011", name: "Hafizur Rahman",  designation: "Senior Sales Executive",   showroom: "Zindabazar Outlet",  division: "Sylhet Division",     joinDate: "2020-03-12", combined: 9.56, status: "Active" },
  { code: "EMP-2084", name: "Sayed Mahmud",    designation: "Senior Sales Executive",   showroom: "Gulshan Outlet",     division: "Dhaka Division",      joinDate: "2019-07-01", combined: 9.32, status: "Active" },
  { code: "EMP-2086", name: "Taskeen Ahmed",   designation: "Assistant Branch Manager", showroom: "Gulshan Outlet",     division: "Dhaka Division",      joinDate: "2018-01-15", combined: 9.02, status: "Active" },
  { code: "EMP-3012", name: "Arifur Rahman",   designation: "Senior Sales Executive",   showroom: "Agrabad Outlet",     division: "Chittagong Division", joinDate: "2021-05-20", combined: 8.82, status: "Active" },
  { code: "EMP-2085", name: "Anisur Rahman",   designation: "Sales Executive",          showroom: "Gulshan Outlet",     division: "Dhaka Division",      joinDate: "2022-01-15", combined: 8.68, status: "Active" },
  { code: "EMP-2090", name: "Kamrul Hasan",    designation: "Assistant Branch Manager", showroom: "Uttara Outlet",      division: "Dhaka Division",      joinDate: "2019-11-08", combined: 8.26, status: "Active" },
  { code: "EMP-3011", name: "Imran Khan",      designation: "Sales Executive",          showroom: "Agrabad Outlet",     division: "Chittagong Division", joinDate: "2021-09-01", combined: 8.22, status: "Active" },
  { code: "EMP-2089", name: "Sadia Afrin",     designation: "Sales Executive",          showroom: "Uttara Outlet",      division: "Dhaka Division",      joinDate: "2023-02-28", combined: 7.08, status: "Active" },
  { code: "EMP-5011", name: "Sujon Ali",       designation: "Sales Executive",          showroom: "Saheb Bazar Outlet", division: "Rajshahi Division",   joinDate: "2022-06-10", combined: 7.74, status: "Active" },
  { code: "EMP-2087", name: "Fahim Shahriar",  designation: "Sales Executive",          showroom: "Dhanmondi Outlet",   division: "Dhaka Division",      joinDate: "2022-04-05", combined: 7.38, status: "On Leave" },
  { code: "EMP-2088", name: "Mehrab Hossain",  designation: "Senior Sales Executive",   showroom: "Dhanmondi Outlet",   division: "Dhaka Division",      joinDate: "2020-08-22", combined: 6.92, status: "Active" },
  { code: "EMP-4012", name: "Zamil Ahmed",     designation: "Assistant Branch Manager", showroom: "Uposhahar Outlet",   division: "Sylhet Division",     joinDate: "2019-03-17", combined: 6.56, status: "Active" },
  { code: "EMP-3013", name: "Nayeem Uddin",    designation: "Sales Executive",          showroom: "GEC Circle Outlet",  division: "Chittagong Division", joinDate: "2023-07-01", combined: 5.04, status: "Active" },
];

const DIVISIONS    = ["All Divisions",    "Dhaka Division", "Chittagong Division", "Sylhet Division", "Rajshahi Division"];
const DESIGNATIONS = ["All Designations", "Senior Sales Executive", "Sales Executive", "Assistant Branch Manager"];
const STATUSES     = ["All Status", "Active", "On Leave", "Inactive"];

function getInitialsBg(name: string) {
  const palette = ["bg-blue-500","bg-violet-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-cyan-500","bg-indigo-500","bg-teal-500"];
  return palette[name.charCodeAt(0) % palette.length];
}
function getInitials(name: string) { return name.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase(); }
function getScoreColor(s: number) { return s >= 8.5 ? "text-emerald-600" : s >= 7 ? "text-blue-600" : s >= 5.5 ? "text-amber-600" : "text-red-600"; }
function getStatusBadge(s: string) {
  if (s === "Active")   return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s === "On Leave") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-500 border-slate-200";
}

export default function AdminEmployeesPage() {
  const [search, setSearch]     = useState("");
  const [division, setDiv]      = useState("All Divisions");
  const [desig, setDesig]       = useState("All Designations");
  const [status, setStatus]     = useState("All Status");
  const [page, setPage]         = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    let d = [...EMPLOYEES];
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(e => e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) || e.showroom.toLowerCase().includes(q)); }
    if (division !== "All Divisions")    d = d.filter(e => e.division === division);
    if (desig !== "All Designations")    d = d.filter(e => e.designation === desig);
    if (status !== "All Status")         d = d.filter(e => e.status === status);
    return d;
  }, [search, division, desig, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allSelected = rows.length > 0 && rows.every(r => selected.includes(r.code));
  const toggleAll   = () => setSelected(allSelected ? selected.filter(s => !rows.find(r => r.code === s)) : [...new Set([...selected, ...rows.map(r => r.code)])]);
  const toggleOne   = (code: string) => setSelected(s => s.includes(code) ? s.filter(x => x !== code) : [...s, code]);

  const stats = [
    { label: "Total Employees",  value: EMPLOYEES.length,                                   color: "text-slate-900", sub: "All divisions" },
    { label: "Active",           value: EMPLOYEES.filter(e => e.status === "Active").length, color: "text-emerald-600", sub: "Currently working" },
    { label: "On Leave",         value: EMPLOYEES.filter(e => e.status === "On Leave").length, color: "text-amber-600", sub: "Temporary absence" },
    { label: "New This Month",   value: 2,                                                   color: "text-blue-600",  sub: "Added in July 2026" },
  ];

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-extrabold mt-1.5 ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search name, code, showroom…" className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-100 w-52 text-slate-700 placeholder-slate-400" />
            </div>
            <select value={division} onChange={e => { setDiv(e.target.value); setPage(1); }} className="text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 px-3 py-2 focus:outline-none">
              {DIVISIONS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={desig} onChange={e => { setDesig(e.target.value); setPage(1); }} className="text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 px-3 py-2 focus:outline-none">
              {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 text-slate-700 px-3 py-2 focus:outline-none">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {selected.length > 0 && (
              <span className="text-[11px] font-bold text-slate-500 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">{selected.length} selected</span>
            )}
            <button className="px-4 py-2 text-xs font-extrabold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm hover:from-red-700 hover:to-rose-700 transition-all flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Employee
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-3.5 h-3.5 rounded accent-red-600 cursor-pointer" /></th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Showroom / Division</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Join Date</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map(emp => (
                <tr key={emp.code} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-4 py-3.5">
                    <input type="checkbox" checked={selected.includes(emp.code)} onChange={() => toggleOne(emp.code)} className="w-3.5 h-3.5 rounded accent-red-600 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${getInitialsBg(emp.name)} flex items-center justify-center text-white text-[10px] font-extrabold flex-shrink-0`}>
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{emp.designation} · <span className="font-mono">{emp.code}</span></p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <p className="text-xs text-slate-700 font-medium">{emp.showroom}</p>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">{emp.division.replace(" Division","")}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden xl:table-cell text-xs text-slate-500 font-medium">{emp.joinDate}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-mono font-extrabold ${getScoreColor(emp.combined)}`}>{emp.combined.toFixed(2)}</span>
                      <div className="w-10 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full rounded-full" style={{ width: `${(emp.combined/10)*100}%`, backgroundColor: emp.combined>=8.5?"#10b981":emp.combined>=7?"#3b82f6":emp.combined>=5.5?"#f59e0b":"#ef4444" }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusBadge(emp.status)}`}>{emp.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">View</button>
                      <button className="px-2.5 py-1 text-[10px] font-bold border border-red-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7} className="text-center py-14 text-sm text-slate-400 italic">No employees match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-[11px] text-slate-500 font-medium">
            Showing {filtered.length === 0 ? 0 : (page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of <strong className="text-slate-700">{filtered.length}</strong> employees
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
