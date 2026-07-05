"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AUDIENCE_METADATA, MOCK_TARGET_EMPLOYEES } from "../../../lib/api";

// Enrich target employees with scores for ranking visualization
const EMPLOYEES_WITH_SCORES = MOCK_TARGET_EMPLOYEES.map((emp, idx) => {
  // Hardcode representative mock scores to keep it stable
  const scores: Record<string, number> = {
    "EMP-2084": 9.2, // Sayed Mahmud
    "EMP-2085": 8.5, // Anisur Rahman
    "EMP-2086": 8.9, // Taskeen Ahmed
    "EMP-2087": 7.2, // Fahim Shahriar
    "EMP-2088": 6.8, // Mehrab Hossain
    "EMP-2089": 5.4, // Sadia Afrin
    "EMP-2090": 7.9, // Kamrul Hasan
    "EMP-3011": 8.1, // Imran Khan
    "EMP-3012": 8.7, // Arifur Rahman
    "EMP-3013": 4.8, // Nayeem Uddin
    "EMP-4011": 9.5, // Hafizur Rahman
    "EMP-4012": 6.2, // Zamil Ahmed
    "EMP-5011": 7.5, // Sujon Ali
  };
  return {
    ...emp,
    score: scores[emp.id] || 7.0,
  };
});

export default function AssessorDashboardPage() {
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [selectedShowroom, setSelectedShowroom] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<"high-to-low" | "low-to-high">("high-to-low");

  // Reset showroom filter when division changes
  useEffect(() => {
    setSelectedShowroom("ALL");
  }, [selectedDivision]);

  // Derived showrooms for dropdown
  const showroomsList = useMemo(() => {
    if (selectedDivision === "ALL") return [];
    return AUDIENCE_METADATA.showrooms[selectedDivision] || [];
  }, [selectedDivision]);

  // Filters & sorting logic
  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...EMPLOYEES_WITH_SCORES];

    if (selectedDivision !== "ALL") {
      result = result.filter(emp => emp.division === selectedDivision);
    }
    if (selectedShowroom !== "ALL") {
      result = result.filter(emp => emp.showroom === selectedShowroom);
    }

    result.sort((a, b) => {
      return sortOrder === "high-to-low" ? b.score - a.score : a.score - b.score;
    });

    return result;
  }, [selectedDivision, selectedShowroom, sortOrder]);

  // Calculate statistics based on current selections
  const stats = useMemo(() => {
    const visits = filteredAndSortedEmployees.length * 3 + 5; // dynamic mock math
    const avgScore = filteredAndSortedEmployees.length > 0
      ? (filteredAndSortedEmployees.reduce((acc, emp) => acc + emp.score, 0) / filteredAndSortedEmployees.length).toFixed(1)
      : "0.0";
    
    return {
      visitsDone: visits,
      assessmentsCreated: Math.ceil(visits / 4) + 2,
      averageRating: avgScore
    };
  }, [filteredAndSortedEmployees]);

  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div>
          <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Assessor Dashboard
          </h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Showroom Visit & Audit Overview</p>
        </div>
        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
          ASSESSOR
        </span>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-5">
        
        {/* ── Key Performance Indicators Grid ─────────────────────────────── */}
        <section className="grid grid-cols-3 gap-2">
          {/* KPI 1 */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Visits Done</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl font-extrabold text-slate-900 leading-none">{stats.visitsDone}</span>
              <span className="text-[9px] text-emerald-500 font-bold">✓</span>
            </div>
          </div>
          {/* KPI 2 */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Assessments</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl font-extrabold text-slate-900 leading-none">{stats.assessmentsCreated}</span>
              <span className="text-[8px] text-slate-400 font-bold">Files</span>
            </div>
          </div>
          {/* KPI 3 */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Avg Rating</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl font-extrabold text-red-650 leading-none">{stats.averageRating}</span>
              <span className="text-[8px] text-slate-400 font-bold">/10</span>
            </div>
          </div>
        </section>

        {/* ── Filters Section ─────────────────────────────────────────────── */}
        <section className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              Filter Hierarchy
            </h3>
            {(selectedDivision !== "ALL" || selectedShowroom !== "ALL") && (
              <button 
                onClick={() => { setSelectedDivision("ALL"); setSelectedShowroom("ALL"); }}
                className="text-[9px] font-bold text-red-600 hover:text-red-700"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Division dropdown */}
            <div>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Division</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none"
              >
                <option value="ALL">All Divisions</option>
                {AUDIENCE_METADATA.divisions.map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            {/* Showroom dropdown */}
            <div>
              <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Showroom</span>
              <select
                value={selectedShowroom}
                onChange={(e) => setSelectedShowroom(e.target.value)}
                disabled={selectedDivision === "ALL"}
                className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none disabled:opacity-50"
              >
                <option value="ALL">All Showrooms</option>
                {showroomsList.map((sr) => (
                  <option key={sr} value={sr}>{sr}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── Employee Ranking Board ──────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Employee Rankings</h3>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Based on visit assessments</p>
            </div>

            {/* Sorting Toggle Buttons */}
            <div className="flex border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setSortOrder("high-to-low")}
                className={`px-2.5 py-1.5 text-[9px] font-bold transition-all cursor-pointer ${
                  sortOrder === "high-to-low"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                High to Low
              </button>
              <button
                onClick={() => setSortOrder("low-to-high")}
                className={`px-2.5 py-1.5 text-[9px] font-bold transition-all cursor-pointer ${
                  sortOrder === "low-to-high"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                Low to High
              </button>
            </div>
          </div>

          {/* Ranking list */}
          <div className="space-y-2.5">
            {filteredAndSortedEmployees.map((emp, index) => {
              // Rank calculation adjustments
              const rank = sortOrder === "high-to-low" ? index + 1 : filteredAndSortedEmployees.length - index;
              
              // Custom badge layouts for top performers
              let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
              if (rank === 1) badgeColor = "bg-amber-500/10 text-amber-650 border-amber-500/20";
              else if (rank === 2) badgeColor = "bg-slate-400/10 text-slate-650 border-slate-400/20";
              else if (rank === 3) badgeColor = "bg-orange-500/10 text-orange-650 border-orange-500/20";

              return (
                <div 
                  key={emp.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-extrabold ${badgeColor}`}>
                      {rank}
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block truncate leading-tight">{emp.name}</span>
                      <span className="text-[9px] text-slate-400 font-semibold block truncate mt-0.5">
                        {emp.showroom} • {emp.designation}
                      </span>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className="flex-shrink-0 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ 
                      backgroundColor: emp.score >= 8.5 ? "#10b981" : emp.score >= 7.0 ? "#3b82f6" : emp.score >= 5.5 ? "#f59e0b" : "#ef4444" 
                    }}></div>
                    <span className="text-xs font-mono font-extrabold text-slate-800 tabular-nums">{emp.score.toFixed(1)}</span>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedEmployees.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 italic">
                No active employee records matching this selection.
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
