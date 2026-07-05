"use client";

import Link from "next/link";

export default function EmployeeAssessmentPage() {
  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/employee/profile" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              My Assessments
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Evaluation & Quizzes</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
          EMPLOYEE
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            No Active Quizzes
          </h2>
          <p className="text-xs text-slate-400 px-6 leading-relaxed">
            Your manager or trainer has not assigned any active quizzes or product assessments to your account yet.
          </p>
        </div>
        <Link 
          href="/employee/profile"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          Return to Profile
        </Link>
      </main>
    </div>
  );
}
