import React from "react";
import { IPastAssessment, getRatingConfig } from "./types";

interface HistoryViewProps {
  setViewMode: (mode: "portal" | "history" | "form" | "submitted") => void;
  pastAssessments: IPastAssessment[];
  handleEditCard: (a: IPastAssessment) => void;
}

export default function HistoryView({
  setViewMode,
  pastAssessments,
  handleEditCard,
}: HistoryViewProps) {
  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode("portal")}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-650 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              My Audit History
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Showroom Audits Completed by You</p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-red-655 bg-red-55 border border-red-100 px-2.5 py-0.5 rounded-full">
          EDITABLE
        </span>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-4">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 text-[10px] text-slate-500 font-medium leading-relaxed text-left">
          💡 **Tip**: Click on any of the cards below to re-evaluate the employee's performance or edit notes.
        </div>

        <div className="space-y-3">
          {pastAssessments.map((a) => {
            const config = getRatingConfig(a.score);
            return (
              <div 
                key={a.id} 
                onClick={() => handleEditCard(a)}
                className="auth-card p-3 bg-white flex justify-between items-center gap-3 hover:bg-red-50/10 hover:border-red-200 transition-all cursor-pointer active:scale-[0.99] border border-slate-100 group"
              >
                <div className="flex items-center gap-3 min-w-0 text-left">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-red-655 transition-colors">
                      {a.employeeName}
                    </h5>
                    <span className="text-[9px] text-slate-450 font-semibold block truncate mt-0.5">
                      {a.designation}
                    </span>
                    <p className="text-[9px] text-red-655 font-bold block truncate mt-0.5">
                      {a.showroom} • <span className="text-slate-450 font-semibold">{a.division.replace(" Division", "")}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-baseline leading-none">
                    <span className={`text-sm font-mono font-extrabold ${config.color}`}>{a.score.toFixed(1)}</span>
                    <span className="text-[8px] text-slate-400 font-bold">/10</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${config.bg}`}>
                    {config.label.split(" ")[0]}
                  </span>
                </div>
              </div>
            );
          })}

          {pastAssessments.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400 italic bg-white/40 rounded-2xl border border-dashed border-slate-200 px-4">
              You haven't completed any showroom audits yet. Tap the red card's "Scan" option on the dashboard to log your first audit.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
