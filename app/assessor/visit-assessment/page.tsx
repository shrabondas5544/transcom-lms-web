"use client";

import { useState } from "react";
import Link from "next/link";

const assessedEmployee = {
  id: "EMP-2084",
  name: "Sayed Mahmud",
  designation: "Senior Sales Executive",
  division: "Dhaka Division",
  branch: "Transcom Digital — Gulshan Outlet",
  department: "Showroom Operations",
  profilePic: null, // Can be loaded from API
};

const CRITERIA = [
  {
    key: "customerDealing",
    label: "Customer Dealing",
    description: "Evaluates client engagement, trust-building, communication clarity, and grievance handling on the showroom floor.",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    key: "productKnowledge",
    label: "Product Knowledge",
    description: "Assesses accuracy of technical specs, energy ratings, comparative feature highlights, and active promotional campaigns.",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    key: "grooming",
    label: "Grooming & Posture",
    description: "Evaluates standard corporate dress code adherence, name badge compliance, shoe polish, and active customer posture.",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L9 21zm0 0h3.818M9 21H5.182m13 0l-.813-5.096L15 21zm0 0h3.818M15 21h-3.818m0 0V9a4 4 0 00-8 0v12m8 0V9a4 4 0 008 0v12" />
      </svg>
    )
  },
  {
    key: "demonstrationSkill",
    label: "Demonstration Skill",
    description: "Assesses step-by-step feature demos, digital screen walk-throughs, and persuasive handling of customer cross-questions.",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    key: "discipline",
    label: "Floor Discipline",
    description: "Adherence to duty roster shifts, floor hygiene, tag updating, and active cooperation with senior showroom leaders.",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
];

type ScoreMap = Record<string, number>;
type RemarkMap = Record<string, string>;

function getRatingConfig(score: number) {
  if (score >= 9.0) return { label: "Excellent Performance", color: "text-emerald-600", bar: "#10b981", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
  if (score >= 7.5) return { label: "Good Competency", color: "text-blue-600", bar: "#3b82f6", bg: "bg-blue-50 text-blue-800 border-blue-200" };
  if (score >= 5.0) return { label: "Satisfactory Level", color: "text-amber-600", bar: "#f59e0b", bg: "bg-amber-50 text-amber-800 border-amber-200" };
  if (score >= 3.0) return { label: "Below Standard", color: "text-orange-600", bar: "#f97316", bg: "bg-orange-50 text-orange-800 border-orange-200" };
  return { label: "Needs Critical Focus", color: "text-red-600", bar: "#ef4444", bg: "bg-red-50 text-red-800 border-red-200" };
}

function ScoreRing({ score, size = 100 }: { score: number; size?: number }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 10) * circ;
  const { color, bar } = getRatingConfig(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#f1f5f9" strokeWidth="8" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={bar}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-extrabold ${color} tracking-tight`}>{score.toFixed(1)}</span>
        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
}

export default function VisitAssessmentPage() {
  const [scores, setScores] = useState<ScoreMap>(
    Object.fromEntries(CRITERIA.map((c) => [c.key, 5]))
  );
  const [remarks, setRemarks] = useState<RemarkMap>(
    Object.fromEntries(CRITERIA.map((c) => [c.key, ""]))
  );
  const [submitted, setSubmitted] = useState(false);

  const avg = CRITERIA.reduce((s, c) => s + scores[c.key], 0) / CRITERIA.length;

  const handleReset = () => {
    setSubmitted(false);
    setScores(Object.fromEntries(CRITERIA.map((c) => [c.key, 5])));
    setRemarks(Object.fromEntries(CRITERIA.map((c) => [c.key, ""])));
  };

  // ── POST-SUBMIT SUMMARY REPORT SCREEN ──────────────────────────────────
  if (submitted) {
    const { label, bg } = getRatingConfig(avg);
    return (
      <div className="auth-bg min-h-screen flex flex-col pb-16">
        <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Assessment Report
              </h1>
              <p className="text-[10px] text-slate-400">Official HR Record Submission</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
            SUBMITTED
          </span>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 space-y-6">
          {/* Executive Summary Card */}
          <div className="auth-card p-6 flex flex-col items-center gap-5 text-center bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
            
            <div className="space-y-1">
              <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Employee Capability Report</p>
              <h2 className="text-lg font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                {assessedEmployee.name}
              </h2>
              <p className="text-xs font-bold text-red-600">{assessedEmployee.designation}</p>
            </div>

            <ScoreRing score={avg} size={110} />

            <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold border ${bg}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {label}
            </div>

            <div className="w-full border-t border-slate-100 pt-4 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
              <div className="text-left border-r border-slate-100 pr-2">
                <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-wider">Showroom Outlet</span>
                <span className="text-slate-800 font-bold block mt-0.5 truncate">{assessedEmployee.branch.replace("Transcom Digital — ", "")}</span>
              </div>
              <div className="text-left pl-2">
                <span className="block text-[8px] text-slate-400 uppercase font-bold tracking-wider">Evaluation Period</span>
                <span className="text-slate-800 font-bold block mt-0.5">June 2025 (Visit Assessment)</span>
              </div>
            </div>
          </div>

          {/* Detailed Criteria Grid */}
          <div className="auth-card p-4 space-y-4 bg-white">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Evaluated Criteria Breakdown</h3>
            <div className="space-y-3.5">
              {CRITERIA.map((c) => {
                const s = scores[c.key];
                const { color, bar } = getRatingConfig(s);
                return (
                  <div key={c.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700 flex items-center gap-2">
                        <span className="text-slate-400">{c.svg}</span>
                        {c.label}
                      </span>
                      <span className={`font-extrabold ${color} tabular-nums`}>{s}.0 / 10</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${(s / 10) * 100}%`, background: bar }}
                      />
                    </div>
                    {remarks[c.key] && (
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <p className="text-[10px] text-slate-500 italic leading-relaxed">
                          &ldquo;{remarks[c.key]}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Action */}
          <button
            onClick={handleReset}
            className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 tracking-wider uppercase"
          >
            Start New Field Evaluation
          </button>
        </main>
      </div>
    );
  }

  // ── ASSESSMENT FORM ────────────────────────────────────────────────────
  return (
    <div className="auth-bg min-h-screen flex flex-col pb-16">
      {/* Header bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/employee/profile" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Showroom Visit Assessment
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Field Evaluation Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
          <span className="text-[9px] text-red-600 font-extrabold tracking-wider">ACTIVE PORTAL</span>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-6">
        
        {/* Profile Card (Corporate ID Badge Vibe) */}
        <section className="auth-card p-5 relative overflow-hidden bg-white">
          {/* Subtle design detail */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100/40 to-transparent rounded-bl-full pointer-events-none"></div>
          
          <div className="flex items-center gap-4">
            {/* Styled ID Badge Photo Area */}
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 p-0.5 shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full rounded-[12px] bg-slate-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase tracking-wider">Showroom Agent</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1 truncate" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                {assessedEmployee.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium truncate">{assessedEmployee.designation}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-3 gap-x-2 text-[11px]">
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Division & District</span>
              <span className="text-slate-800 font-bold mt-0.5 block">{assessedEmployee.division}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Branch Outlet</span>
              <span className="text-slate-800 font-bold mt-0.5 block truncate">{assessedEmployee.branch.replace("Transcom Digital — ", "")}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Department</span>
              <span className="text-slate-800 font-bold mt-0.5 block">{assessedEmployee.department}</span>
            </div>
            <div>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Employee ID</span>
              <span className="text-slate-800 font-bold mt-0.5 block tracking-widest font-mono">{assessedEmployee.id}</span>
            </div>
          </div>
        </section>

        {/* Criteria Evaluation List */}
        <div className="space-y-5">
          {CRITERIA.map((c, idx) => {
            const score = scores[c.key];
            const { label, color, bg } = getRatingConfig(score);
            const pct = ((score - 1) / 9) * 100;
            return (
              <section key={c.key} className="auth-card p-5 bg-white space-y-4">
                
                {/* Header Information */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                      {c.svg}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Section {idx + 1}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800 leading-snug mt-0.5" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                        {c.label}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Big Number Score */}
                  <div className="flex-shrink-0 flex items-baseline gap-0.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                    <span className={`text-2xl font-extrabold leading-none tabular-nums ${color}`}>{score}</span>
                    <span className="text-[9px] text-slate-400 font-bold">/10</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed pl-11">
                  {c.description}
                </p>

                {/* Styled Range Slider */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider px-1">
                    <span>1 (Deficient)</span>
                    <span>5 (Standard)</span>
                    <span>10 (Exemplary)</span>
                  </div>
                  
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={score}
                      onChange={(e) => setScores((prev) => ({ ...prev, [c.key]: parseInt(e.target.value) }))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-600 bg-slate-100"
                      style={{
                        background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${pct}%, #f1f5f9 ${pct}%, #f1f5f9 100%)`
                      }}
                    />
                  </div>

                  {/* Dot selectors */}
                  <div className="flex justify-between px-0.5 pt-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setScores((prev) => ({ ...prev, [c.key]: i + 1 }))}
                        className={`w-6 h-6 rounded-full text-[9px] font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                          score === i + 1
                            ? "bg-red-600 text-white scale-110 shadow-md ring-2 ring-red-100"
                            : score > i + 1
                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                            : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Label Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold border ${bg}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {label}
                  </div>
                </div>

                {/* Remarks Field */}
                <div className="pt-2 border-t border-slate-50">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Observations / Action Items</span>
                  <textarea
                    rows={2}
                    value={remarks[c.key]}
                    onChange={(e) => setRemarks((prev) => ({ ...prev, [c.key]: e.target.value }))}
                    placeholder={`Enter details about ${c.label.toLowerCase()} competency...`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[11px] text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all bg-slate-50/50 resize-none font-medium leading-relaxed"
                  />
                </div>
              </section>
            );
          })}
        </div>

        {/* Live Average Review Card */}
        <div className="auth-card p-5 flex items-center justify-between border-2 border-red-105 bg-white shadow-md relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-red-500 to-rose-600"></div>
          
          <div className="flex items-center gap-4">
            <ScoreRing score={avg} size={76} />
            <div>
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Weighted Competency</span>
              <h4 className={`text-sm font-extrabold mt-0.5 ${getRatingConfig(avg).color}`}>
                {getRatingConfig(avg).label}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Calculated across {CRITERIA.length} categories</p>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <button
          onClick={() => {
            setSubmitted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-extrabold text-xs transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-red-500 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Record Visit &amp; Submit Score
        </button>
        
        <p className="text-center text-[9px] text-slate-400 leading-normal">
          By submitting, this evaluation will be instantly logged in the central LMS repository under agent ID: <span className="font-bold text-slate-500">{assessedEmployee.id}</span>
        </p>

      </main>
    </div>
  );
}
