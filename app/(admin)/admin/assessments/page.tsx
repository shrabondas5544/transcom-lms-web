"use client";

import { useState, useMemo } from "react";

const ASSESSMENTS = [
  { id: "ASM-001", title: "Samsung OLED TV Product Line Q2",         device: "Smart TV",       brand: "Samsung", questions: 15, timeLimit: 30, deadline: "2026-07-15", employees: 8,  status: "Active",  divisions: ["Dhaka Division", "Chittagong Division"] },
  { id: "ASM-002", title: "LG Home Appliances Sales Drill",           device: "Home Appliances",brand: "LG",      questions: 12, timeLimit: 25, deadline: "2026-07-20", employees: 5,  status: "Active",  divisions: ["Dhaka Division"] },
  { id: "ASM-003", title: "Mobile Phones Retail Engagement Q2",       device: "Mobile Phones",  brand: "ALL",     questions: 20, timeLimit: 40, deadline: "2026-07-31", employees: 13, status: "Active",  divisions: ["All Divisions"] },
  { id: "ASM-004", title: "Carrier AC Inverter Technical Training",   device: "Air Conditioners",brand: "Carrier",questions: 10, timeLimit: 20, deadline: "2026-07-10", employees: 4,  status: "Active",  divisions: ["Sylhet Division"] },
  { id: "ASM-005", title: "Sony Bravia OLED Deep-Dive Q1",            device: "Smart TV",       brand: "Sony",    questions: 18, timeLimit: 35, deadline: "2026-06-30", employees: 6,  status: "Expired", divisions: ["Dhaka Division"] },
  { id: "ASM-006", title: "Samsung Galaxy S24 Feature Matrix",        device: "Mobile Phones",  brand: "Samsung", questions: 14, timeLimit: 25, deadline: "2026-06-15", employees: 9,  status: "Expired", divisions: ["Dhaka Division", "Rajshahi Division"] },
  { id: "ASM-007", title: "Gree Fairy Inverter Specifications Draft",  device: "Air Conditioners",brand: "Gree",   questions: 8,  timeLimit: 0,  deadline: "2026-08-01", employees: 0,  status: "Draft",   divisions: [] },
];

const TABS = ["All", "Active", "Expired", "Draft"] as const;
type Tab = typeof TABS[number];

function getStatusBadge(s: string) {
  if (s === "Active")  return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "#10b981" };
  if (s === "Expired") return { bg: "bg-slate-100 text-slate-500 border-slate-200",      dot: "#94a3b8" };
  return                      { bg: "bg-amber-50 text-amber-700 border-amber-200",       dot: "#f59e0b" };
}

function daysUntil(dateStr: string) {
  const diff = (new Date(dateStr).getTime() - Date.now()) / 86400000;
  return Math.ceil(diff);
}

export default function AdminAssessmentsPage() {
  const [tab, setTab]       = useState<Tab>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let d = [...ASSESSMENTS];
    if (tab !== "All") d = d.filter(a => a.status === tab);
    if (search.trim()) { const q = search.toLowerCase(); d = d.filter(a => a.title.toLowerCase().includes(q) || a.device.toLowerCase().includes(q) || a.brand.toLowerCase().includes(q)); }
    return d;
  }, [tab, search]);

  const counts = useMemo(() => ({
    All: ASSESSMENTS.length,
    Active: ASSESSMENTS.filter(a => a.status === "Active").length,
    Expired: ASSESSMENTS.filter(a => a.status === "Expired").length,
    Draft: ASSESSMENTS.filter(a => a.status === "Draft").length,
  }), []);

  return (
    <div className="p-5 lg:p-8 space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Created", value: counts.All,    color: "text-slate-900",    icon: "📋", sub: "All time" },
          { label: "Active",        value: counts.Active,  color: "text-emerald-600",  icon: "✅", sub: "Currently open" },
          { label: "Expired",       value: counts.Expired, color: "text-slate-500",    icon: "⏱️", sub: "Deadline passed" },
          { label: "Drafts",        value: counts.Draft,   color: "text-amber-600",    icon: "✏️", sub: "Not published" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{k.label}</p>
                <p className={`text-2xl font-extrabold mt-1.5 ${k.color}`}>{k.value}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">{k.sub}</p>
              </div>
              <span className="text-2xl">{k.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 pt-4 border-b border-slate-100">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    tab === t ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {t} <span className="ml-1 text-[10px] opacity-70">{counts[t]}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assessments…" className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-1 focus:ring-red-200 w-44 text-slate-700 placeholder-slate-400" />
              </div>
              <button className="px-4 py-1.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center gap-1.5 hover:from-red-700 hover:to-rose-700 transition-all">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Create New
              </button>
            </div>
          </div>
        </div>

        {/* Assessment Cards Grid */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(asm => {
            const badge = getStatusBadge(asm.status);
            const days  = daysUntil(asm.deadline);
            const deadlineColor = asm.status === "Active" && days <= 3 ? "text-red-600 font-extrabold" : "text-slate-500";
            return (
              <div key={asm.id} className="border border-slate-200 rounded-2xl p-5 hover:border-red-200 hover:shadow-md transition-all group bg-white relative overflow-hidden">
                {/* Left accent */}
                <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {asm.status}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">{asm.id}</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-slate-900 leading-snug group-hover:text-red-700 transition-colors" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                      {asm.title}
                    </h3>
                  </div>
                </div>

                {/* Scope Tag */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">{asm.device}</span>
                  {asm.brand !== "ALL" && (
                    <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-lg">{asm.brand}</span>
                  )}
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Questions</p>
                    <p className="text-sm font-extrabold text-slate-800 mt-0.5">{asm.questions}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Time Limit</p>
                    <p className="text-sm font-extrabold text-slate-800 mt-0.5">{asm.timeLimit > 0 ? `${asm.timeLimit} min` : "None"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Assigned</p>
                    <p className="text-sm font-extrabold text-slate-800 mt-0.5">{asm.employees} emp.</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Deadline</p>
                    <p className={`text-xs font-extrabold mt-0.5 ${deadlineColor}`}>
                      {asm.deadline}
                      {asm.status === "Active" && <span className="block text-[9px] font-bold text-slate-400">{days > 0 ? `${days}d left` : "Today!"}</span>}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button className="flex-1 py-1.5 text-[10px] font-extrabold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">View</button>
                  <button className="flex-1 py-1.5 text-[10px] font-extrabold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">Edit</button>
                  <button className="flex-1 py-1.5 text-[10px] font-extrabold border border-red-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
                    {asm.status === "Draft" ? "Publish" : "Archive"}
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-14 text-center text-sm text-slate-400 italic">No assessments match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
