import React from "react";
import { getRatingConfig, ScoreRing } from "./types";

interface SubmittedViewProps {
  setViewMode: (mode: "portal" | "history" | "form" | "submitted") => void;
  formAvg: number;
}

export default function SubmittedView({
  setViewMode,
  formAvg,
}: SubmittedViewProps) {
  const avg = formAvg;
  const { label, bg } = getRatingConfig(avg);

  return (
    <div className="auth-bg min-h-screen flex flex-col pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
        <div>
          <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Assessment Logged
          </h1>
          <p className="text-[10px] text-slate-400">Official HR Record Submission</p>
        </div>
        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
          SUCCESS
        </span>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-850">Evaluation Upload Complete</h3>
            <p className="text-[10px] text-slate-400 mt-1">Visit records have been committed to the central LMS repository</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4">
          <ScoreRing score={avg} size={110} />
          <div className="text-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold border ${bg}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {label}
            </span>
          </div>
        </div>

        <button
          onClick={() => setViewMode("portal")}
          className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs transition-colors rounded-xl shadow cursor-pointer uppercase tracking-wider border-0"
        >
          Return to Hub Dashboard
        </button>
      </main>
    </div>
  );
}
