import React from "react";
import { ScoreMap, RemarkMap, CRITERIA, getRatingConfig, ScoreRing } from "./types";

interface EvaluationFormProps {
  setViewMode: (mode: "portal" | "history" | "form" | "submitted") => void;
  formReferrer: "portal" | "history";
  editingId: string | null;
  scannedEmployee: any;
  scannedAvatar: { img: string; scale: number; x: number; y: number } | null;
  scores: ScoreMap;
  setScores: React.Dispatch<React.SetStateAction<ScoreMap>>;
  remarks: RemarkMap;
  setRemarks: React.Dispatch<React.SetStateAction<RemarkMap>>;
  skipped: Record<string, boolean>;
  handleToggleSkip: (key: string, val: boolean) => void;
  formAvg: number;
  handleFormSubmit: () => Promise<void>;
}

export default function EvaluationForm({
  setViewMode,
  formReferrer,
  editingId,
  scannedEmployee,
  scannedAvatar,
  scores,
  setScores,
  remarks,
  setRemarks,
  skipped,
  handleToggleSkip,
  formAvg,
  handleFormSubmit,
}: EvaluationFormProps) {
  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode(formReferrer)}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-605 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              {editingId ? "Edit Showroom Audit" : "Showroom Audit"}
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Field Evaluation Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-pulse"></span>
          <span className="text-[9px] text-red-650 font-extrabold tracking-wider">{editingId ? "EDIT MODE" : "ACTIVE FORM"}</span>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-6">
        
        {/* Profile Card (Corporate ID Badge Vibe) */}
        {scannedEmployee && (
          <section className="auth-card p-5 relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100/40 to-transparent rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 p-0.5 shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full rounded-[12px] bg-slate-100 flex items-center justify-center overflow-hidden relative">
                  {scannedAvatar ? (
                    <img
                      src={scannedAvatar.img}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      style={{
                        transform: `scale(${scannedAvatar.scale}) translate(${scannedAvatar.x}px, ${scannedAvatar.y}px)`
                      }}
                    />
                  ) : (
                    <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-extrabold text-red-650 bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase tracking-wider">Showroom Agent</span>
                </div>
                <h2 className="text-base font-extrabold text-slate-900 mt-1 truncate" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  {scannedEmployee.name}
                </h2>
                <p className="text-xs text-slate-500 font-medium truncate">{scannedEmployee.designation}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] text-left">
              <div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Grade Group</span>
                <span className="text-slate-800 font-bold mt-0.5 block">{scannedEmployee.gradeGroup || "—"}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Branch Outlet</span>
                <span className="text-slate-800 font-bold mt-0.5 block truncate">{scannedEmployee.showroom}</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Department</span>
                <span className="text-slate-800 font-bold mt-0.5 block">Showroom Operations</span>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Employee ID</span>
                <span className="text-slate-800 font-bold mt-0.5 block tracking-widest font-mono">{scannedEmployee.code}</span>
              </div>
            </div>
          </section>
        )}

        {/* Criteria Evaluation List */}
        <div className="space-y-5">
          {CRITERIA.map((c, idx) => {
            const isQSkipped = !!skipped[c.key];
            const score = scores[c.key];
            const { label, color, bg } = getRatingConfig(score);
            const remarkLen = remarks[c.key]?.length ?? 0;

            return (
              <section key={c.key} className={`auth-card bg-white relative overflow-hidden transition-all duration-300 ${isQSkipped ? "opacity-60" : ""}`}>
                {/* Top accent bar that changes color with score */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300"
                  style={{ background: isQSkipped ? "#e2e8f0" : getRatingConfig(score).bar }}
                />

                {/* Card Header */}
                <div className="p-5 pb-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isQSkipped ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white"}`}>
                      {c.svg}
                    </div>
                    <div className="text-left">
                      <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-[0.15em] block">
                        Section {idx + 1} of {CRITERIA.length}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-800 leading-tight mt-0.5" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                        {c.label}
                      </h3>
                    </div>
                  </div>

                  {/* Skip toggle — pill style, top-right */}
                  <button
                    type="button"
                    onClick={() => handleToggleSkip(c.key, !isQSkipped)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                      isQSkipped
                        ? "bg-[#c21e25] text-white border-[#c21e25] shadow-md shadow-red-200"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:text-slate-700"
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      {isQSkipped
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      }
                    </svg>
                    {isQSkipped ? "Skipped" : "Skip"}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed px-5 pb-4 text-left">
                  {c.description}
                </p>

                {/* Score & slider section */}
                <div className={`transition-all duration-300 ${isQSkipped ? "pointer-events-none select-none" : ""}`}>
                  {/* Score badge row */}
                  <div className="px-5 flex items-center justify-between mb-3">
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Score</span>
                    <div className="flex items-baseline gap-1">
                      {isQSkipped ? (
                        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Not scored</span>
                      ) : (
                        <>
                          <span className={`text-3xl font-black leading-none tabular-nums transition-all ${color}`}>{score}</span>
                          <span className="text-[10px] text-slate-400 font-bold">/10</span>
                          <span className={`ml-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${bg}`}>{label}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Premium Segmented Score Selector */}
                  <div className="px-5 pb-4">
                    {/* Label row */}
                    <div className="flex justify-between mb-2">
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Deficient</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Standard</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Exemplary</span>
                    </div>

                    {/* Segmented score bar */}
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const val = i + 1;
                        const isSelected = score === val && !isQSkipped;
                        const isFilled = score > val && !isQSkipped;
                        // Color segments based on range
                        const segColor = val <= 3
                          ? { filled: "bg-red-500", selected: "bg-red-600 shadow-red-200", ring: "ring-red-300" }
                          : val <= 5
                          ? { filled: "bg-amber-400", selected: "bg-amber-500 shadow-amber-200", ring: "ring-amber-300" }
                          : val <= 7
                          ? { filled: "bg-blue-400", selected: "bg-blue-500 shadow-blue-200", ring: "ring-blue-300" }
                          : { filled: "bg-emerald-400", selected: "bg-emerald-500 shadow-emerald-200", ring: "ring-emerald-300" };

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isQSkipped}
                            onClick={() => setScores(prev => ({ ...prev, [c.key]: val }))}
                            className={`relative flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg text-[9px] font-black transition-all duration-150 cursor-pointer border focus:outline-none group disabled:cursor-not-allowed ${
                              isSelected
                                ? `${segColor.selected} text-white shadow-lg ring-2 ${segColor.ring} border-transparent scale-105 z-10`
                                : isFilled
                                ? `${segColor.filled} text-white border-transparent opacity-60`
                                : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:border-slate-200 hover:text-slate-600"
                            }`}
                          >
                            <span className={`font-black text-[11px] leading-none ${isSelected ? "text-white" : ""}`}>{val}</span>
                            {/* Mini indicator tick */}
                            <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/60" : isFilled ? "bg-white/40" : "bg-slate-300"}`} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Range color legend */}
                    <div className="flex justify-between mt-2 px-0.5">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-0.5 rounded bg-red-500 inline-block" />
                        <span className="text-[7px] text-slate-400 font-bold">1–3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-0.5 rounded bg-amber-400 inline-block" />
                        <span className="text-[7px] text-slate-400 font-bold">4–5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-0.5 rounded bg-blue-400 inline-block" />
                        <span className="text-[7px] text-slate-400 font-bold">6–7</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-0.5 rounded bg-emerald-400 inline-block" />
                        <span className="text-[7px] text-slate-400 font-bold">8–10</span>
                      </div>
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="border-t border-slate-100 px-5 py-4 text-left">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Observations / Action Items</span>
                      <span className={`text-[8px] font-bold tabular-nums transition-colors ${remarkLen >= 230 ? remarkLen >= 250 ? "text-red-500" : "text-amber-500" : "text-slate-300"}`}>
                        {remarkLen}/250
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={remarks[c.key]}
                      disabled={isQSkipped}
                      maxLength={250}
                      onChange={(e) => {
                        if (e.target.value.length <= 250) {
                          setRemarks(prev => ({ ...prev, [c.key]: e.target.value }));
                        }
                      }}
                      placeholder={isQSkipped ? "Not applicable — question skipped." : `Describe ${c.label.toLowerCase()} observations or corrective actions...`}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 placeholder-slate-350 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition-all bg-slate-50/50 resize-none font-medium leading-relaxed disabled:opacity-40"
                    />
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Live Average Review Card */}
        <div className="auth-card p-5 flex items-center justify-between border-2 border-red-105 bg-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-[#c21e25] to-red-500"></div>
          
          <div className="flex items-center gap-4">
            <ScoreRing score={formAvg} size={76} />
            <div className="text-left">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Weighted Competency</span>
              <h4 className={`text-sm font-extrabold mt-0.5 ${getRatingConfig(formAvg).color}`}>
                {getRatingConfig(formAvg).label}
              </h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {(() => { const active = CRITERIA.filter(c => !skipped[c.key]).length; return active === CRITERIA.length ? `Scored across all ${CRITERIA.length} criteria` : `Scoring ${active} of ${CRITERIA.length} criteria — ${CRITERIA.length - active} skipped`; })()}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <button
          onClick={handleFormSubmit}
          className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-extrabold text-xs transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider border-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-red-500 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {editingId ? "Update Review & Submit Score" : "Record Review & Submit Score"}
        </button>
        
        <p className="text-center text-[9px] text-slate-400 leading-normal">
          By submitting, this evaluation will be instantly logged in the central LMS repository.
        </p>

      </main>
    </div>
  );
}
