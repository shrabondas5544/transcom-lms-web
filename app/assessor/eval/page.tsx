"use client";

import Link from "next/link";

export default function AssessorEvalPage() {
  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/assessor/dashboard" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Evaluation Hub
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Performance & Audits</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
          ASSESSOR
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Self-Evaluations Pending
          </h2>
          <p className="text-xs text-slate-400 px-6 leading-relaxed">
            There are currently no active self-evaluation forms or peer reviews assigned to you.
          </p>
        </div>
        <Link 
          href="/assessor/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          Go to Dashboard
        </Link>
      </main>
    </div>
  );
}
