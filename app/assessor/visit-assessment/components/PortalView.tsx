import React from "react";
import { useRouter } from "next/navigation";
import { IPastAssessment, getRatingConfig } from "./types";

interface PortalViewProps {
  pastAssessments: IPastAssessment[];
  setViewMode: (mode: "portal" | "history" | "form" | "submitted") => void;
  setIsScannerOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortDirection: "desc" | "asc";
  setSortDirection: React.Dispatch<React.SetStateAction<"desc" | "asc">>;
  isLoading: boolean;
  paginatedLeaderboard: IPastAssessment[];
  myAuditIds: string[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  PAGE_SIZE: number;
}

export default function PortalView({
  pastAssessments,
  setViewMode,
  setIsScannerOpen,
  searchQuery,
  setSearchQuery,
  sortDirection,
  setSortDirection,
  isLoading,
  paginatedLeaderboard,
  myAuditIds,
  currentPage,
  setCurrentPage,
  totalPages,
  PAGE_SIZE,
}: PortalViewProps) {
  const router = useRouter();

  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/assessor/dashboard")}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-650 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="text-left">
            <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Showroom Audit Hub
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Field Evaluation Protocol</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-5">
        {/* COMBINED ACTION CARD (Solid Red) */}
        <div className="bg-[#c21e25] text-white rounded-2xl border border-red-700 shadow-md overflow-hidden">
          <div className="flex divide-x divide-white/10">
            {/* Left Side: Click to view history & edit */}
            <div 
              onClick={() => setViewMode("history")}
              className="flex-1 p-5 hover:bg-black/10 active:bg-black/20 cursor-pointer transition-colors text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-extrabold text-red-100 uppercase tracking-widest block">Showrooms Audited</span>
                  <span className="text-2xl font-extrabold block mt-1.5 leading-none">
                    {pastAssessments.length}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-extrabold text-red-100 uppercase tracking-widest block">Assessor Log History</span>
                  <span className="text-[10px] font-extrabold block mt-1.5 leading-none text-red-100/90">
                    {pastAssessments.length} Logs
                  </span>
                </div>
              </div>
              <span className="text-[8.5px] font-bold text-red-200 block mt-3.5 hover:underline">
                View & Edit History →
              </span>
            </div>
            
            {/* Right Side: QR Scanner Option */}
            <div 
              onClick={() => setIsScannerOpen(true)}
              className="p-5 flex flex-col items-center justify-center hover:bg-black/10 active:bg-black/20 cursor-pointer transition-colors px-6"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white mb-1.5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                  <rect x="7" y="7" width="10" height="10" rx="1" />
                </svg>
              </div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-100">Scan QR</span>
            </div>
          </div>
        </div>

        {/* Global rankings header, sort and search */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Global Audit Rankings</h4>
              <p className="text-[8px] text-slate-400 font-medium">All showroom visit scores across assessors</p>
            </div>
            
            {/* Toggle Sort Button */}
            <button
              onClick={() => setSortDirection(prev => prev === "desc" ? "asc" : "desc")}
              className="text-[9px] font-extrabold uppercase tracking-wider bg-white border border-slate-200 hover:bg-slate-50 transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-700 cursor-pointer"
            >
              Sort: {sortDirection === "desc" ? "High to Low" : "Low to High"}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                {sortDirection === "desc" ? (
                  <path d="M19 9l-7 7-7-7" />
                ) : (
                  <path d="M5 15l7-7 7 7" />
                )}
              </svg>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by District, Showroom, Designation..."
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white placeholder-slate-350 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
          
          {/* Leaderboard Cards */}
          <div className="space-y-2.5">
            {isLoading ? (
              <div className="space-y-2.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="auth-card p-3 bg-white flex justify-between items-center gap-3 border border-slate-100 animate-pulse"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
                      {/* Rank index skeleton */}
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        {/* Name skeleton */}
                        <div className="h-3.5 bg-slate-100 rounded w-1/2" />
                        {/* Designation skeleton */}
                        <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                        {/* Showroom skeleton */}
                        <div className="h-2.5 bg-slate-100 rounded w-3/4" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {/* Score skeleton */}
                      <div className="h-4 bg-slate-100 rounded w-10" />
                      {/* Rating label skeleton */}
                      <div className="h-3.5 bg-slate-100 rounded w-14" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {paginatedLeaderboard.map((a, index) => {
                  const rank = (currentPage - 1) * PAGE_SIZE + index + 1;
                  const config = getRatingConfig(a.score);
                  const isOwnAudit = myAuditIds.includes(a.id);

                  // Ranking colors
                  let rankStyle = "bg-slate-100 text-slate-600 border-slate-200";
                  if (rank === 1) rankStyle = "bg-amber-500/10 text-amber-650 border-amber-500/20";
                  else if (rank === 2) rankStyle = "bg-slate-400/10 text-slate-650 border-slate-400/20";
                  else if (rank === 3) rankStyle = "bg-orange-500/10 text-orange-650 border-orange-500/20";

                  return (
                    <div 
                      key={a.id} 
                      onClick={() => router.push(`/assessor/visit-assessment/${a.employeeProfileId}`)}
                      className="auth-card p-3 bg-white flex justify-between items-center gap-3 border border-slate-100 cursor-pointer hover:border-red-100 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0 text-left">
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${rankStyle}`}>
                          {rank}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="text-xs font-bold text-slate-900 truncate leading-tight">{a.employeeName}</h5>
                            {isOwnAudit && (
                              <span className="px-1.5 py-0.2 bg-red-50 text-red-655 border border-red-100 text-[7px] font-extrabold rounded-md uppercase">
                                My Audit
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-450 font-semibold block truncate mt-0.5">
                            {a.designation}
                          </span>
                          <p className="text-[9px] text-slate-500 font-medium block truncate mt-0.5">
                            {a.showroom} • <span className="text-slate-400 font-semibold">{a.division.replace(" Division", "")}</span>
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

                {paginatedLeaderboard.length === 0 && (
                  <div className="py-10 text-center text-xs text-slate-400 italic bg-white/40 rounded-2xl border border-dashed border-slate-200">
                    No matching rankings found.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Previous
              </button>
              <span className="text-[10px] font-bold text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
