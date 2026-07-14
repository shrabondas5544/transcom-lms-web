"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    description: "Adherence to duty roster shifts, floor hygiene, tag updating, and active cooperation with showroom leadership.",
    svg: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 022-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )
  },
];

type ScoreMap = Record<string, number>;
type RemarkMap = Record<string, string>;

interface IPastAssessment {
  id: string;
  employeeProfileId: number;
  employeeId: string;
  employeeName: string;
  designation: string;
  showroom: string;
  division: string;
  date: string;
  score: number;
  scores: ScoreMap;
  remarks: RemarkMap;
}

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
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"portal" | "history" | "form" | "submitted">("portal");
  const [formReferrer, setFormReferrer] = useState<"portal" | "history">("portal");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedEmployee, setScannedEmployee] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Leaderboard parameters
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Form states
  const [scores, setScores] = useState<ScoreMap>(
    Object.fromEntries(CRITERIA.map((c) => [c.key, 5]))
  );
  const [remarks, setRemarks] = useState<RemarkMap>(
    Object.fromEntries(CRITERIA.map((c) => [c.key, ""]))
  );

  // Camera references for scanning
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Real DB state
  const [globalLeaderboard, setGlobalLeaderboard] = useState<IPastAssessment[]>([]);
  const [dbEmployees, setDbEmployees] = useState<any[]>([]);
  const [myAuditIds, setMyAuditIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load my logged audit IDs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("transcom_my_audit_ids");
    if (stored) {
      try {
        setMyAuditIds(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Load employee profiles from DB
  useEffect(() => {
    async function fetchDbEmployees() {
      try {
        const res = await fetch("http://localhost:5276/api/EmployeeProfile?page=1&pageSize=1000");
        if (res.ok) {
          const data = await res.json();
          setDbEmployees(data.items || []);
        }
      } catch (err) {
        console.error("Failed to load employee profiles:", err);
      }
    }
    fetchDbEmployees();
  }, []);

  // Load evaluations leaderboard from DB
  const loadEvaluations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      params.append("sortDirection", sortDirection);
      
      const res = await fetch(`http://localhost:5276/api/ShowroomVisitEvaluation?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setGlobalLeaderboard(data);
      }
    } catch (err) {
      console.error("Failed to load global evaluations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvaluations();
  }, [searchQuery, sortDirection]);

  // Derived: assessor audits completed by this session
  const pastAssessments = useMemo(() => {
    return globalLeaderboard.filter(a => myAuditIds.includes(a.id));
  }, [globalLeaderboard, myAuditIds]);

  const formAvg = useMemo(() => {
    return CRITERIA.reduce((s, c) => s + scores[c.key], 0) / CRITERIA.length;
  }, [scores]);

  // Paginated Leaderboard (10 items per page)
  const totalPages = Math.ceil(globalLeaderboard.length / PAGE_SIZE) || 1;
  const paginatedLeaderboard = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return globalLeaderboard.slice(startIndex, startIndex + PAGE_SIZE);
  }, [globalLeaderboard, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortDirection]);

  // Camera integration for QR Code scanning simulator
  useEffect(() => {
    if (isScannerOpen) {
      let cancelled = false;
      (async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          if (cancelled) {
            mediaStream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await videoRef.current.play();
          }
        } catch (err) {
          console.error("Camera access failed", err);
        }
      })();

      const timer = setTimeout(() => {
        if (dbEmployees.length > 0) {
          const targetEmp = dbEmployees.find(emp => emp.code === "5011" || emp.code === "0632") || dbEmployees[0];
          handleScanSuccess({
            id: targetEmp.id,
            code: targetEmp.code,
            name: targetEmp.name,
            designation: targetEmp.designation,
            showroom: targetEmp.locationOutlet,
            division: targetEmp.division || "Dhaka Division"
          });
        } else {
          alert("No employee profiles found in the database. Please import employee records via the Admin panel first.");
          setIsScannerOpen(false);
        }
      }, 2500);

      return () => {
        cancelled = true;
        clearTimeout(timer);
        cleanupCamera();
      };
    }
  }, [isScannerOpen, dbEmployees]);

  const cleanupCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleScanSuccess = (employee: any) => {
    cleanupCamera();
    setIsScannerOpen(false);
    
    // Check if employee already has an assessment record in list
    const existing = pastAssessments.find((a) => a.employeeProfileId === employee.id);
    if (existing) {
      setScannedEmployee(employee);
      setScores(existing.scores);
      setRemarks(existing.remarks);
      setEditingId(existing.id.replace("REP-", ""));
    } else {
      setScannedEmployee(employee);
      setScores(Object.fromEntries(CRITERIA.map((c) => [c.key, 5])));
      setRemarks(Object.fromEntries(CRITERIA.map((c) => [c.key, ""])));
      setEditingId(null);
    }
    setFormReferrer("portal");
    setViewMode("form");
  };

  const handleEditCard = (a: any) => {
    setScannedEmployee({
      id: a.employeeProfileId,
      code: a.employeeId,
      name: a.employeeName,
      designation: a.designation,
      showroom: a.showroom,
      division: a.division,
    });
    setScores(a.scores);
    setRemarks(a.remarks);
    setEditingId(a.id.replace("REP-", ""));
    setFormReferrer("history");
    setViewMode("form");
  };

  const handleFormSubmit = async () => {
    const payload = {
      employeeProfileId: scannedEmployee.id,
      visitDate: new Date().toISOString(),
      customerDealingScore: scores.customerDealing,
      customerDealingRemarks: remarks.customerDealing || "",
      productKnowledgeScore: scores.productKnowledge,
      productKnowledgeRemarks: remarks.productKnowledge || "",
      groomingScore: scores.grooming,
      groomingRemarks: remarks.grooming || "",
      demonstrationSkillScore: scores.demonstrationSkill,
      demonstrationSkillRemarks: remarks.demonstrationSkill || "",
      disciplineScore: scores.discipline,
      disciplineRemarks: remarks.discipline || ""
    };

    try {
      let res;
      if (editingId) {
        // PUT update
        res = await fetch(`http://localhost:5276/api/ShowroomVisitEvaluation/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // POST create
        res = await fetch("http://localhost:5276/api/ShowroomVisitEvaluation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        if (!editingId) {
          const saved = await res.json();
          const createdId = "REP-" + saved.id;
          const currentMyAudits = [...myAuditIds, createdId];
          setMyAuditIds(currentMyAudits);
          localStorage.setItem("transcom_my_audit_ids", JSON.stringify(currentMyAudits));
        }
        await loadEvaluations();
        setViewMode("submitted");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errMsg = await res.text();
        alert("Failed to submit audit: " + errMsg);
      }
    } catch (err) {
      console.error("Failed to save evaluation:", err);
      alert("A network error occurred while saving evaluation.");
    }
  };

  // ── 1. PORTAL VIEW (LEADERBOARD HUB) ──────────────────────────────────
  if (viewMode === "portal") {
    return (
      <div className="auth-bg min-h-screen flex flex-col pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
          <div>
            <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Showroom Audit Hub
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Field Evaluation Protocol</p>
          </div>
          <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
            ASSESSOR
          </span>
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
                <div className="py-12 text-center">
                  <div className="w-6 h-6 border-2 border-red-650 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">Loading rankings...</p>
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

        {/* ── QR Scanner Camera Modal Overlay ─────────────────────────────── */}
        {isScannerOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 animate-fade-in">
            <div className="text-center pt-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Scanning QR Code</h3>
              <p className="text-xs text-slate-400 mt-1">Hold the employee badge code in front of the lens</p>
            </div>

            {/* Video viewport frame */}
            <div className="relative w-72 h-72 mx-auto rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 flex items-center justify-center">
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Scanner Grid Overlay */}
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-red-650 rounded-tl-lg"></div>
                <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-red-650 rounded-tr-lg"></div>
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-red-650 rounded-bl-lg"></div>
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-red-650 rounded-br-lg"></div>
                <div className="w-full h-0.5 bg-red-600/80 shadow-[0_0_8px_2px_rgba(239,68,68,0.7)] animate-bounce"></div>
              </div>
            </div>

            <div className="pb-10 flex flex-col items-center">
              <span className="text-[10px] text-slate-500 font-medium block mb-4 animate-pulse">
                Connecting front lens...
              </span>
              <button 
                onClick={() => setIsScannerOpen(false)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel Scan
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── 2. PERSONAL AUDIT HISTORY VIEW (EDITABLE) ───────────────────────
  if (viewMode === "history") {
    return (
      <div className="auth-bg min-h-screen flex flex-col pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode("portal")}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors cursor-pointer border-0 bg-transparent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            </button>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                My Audit History
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Showroom Audits Completed by You</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-red-650 bg-red-55 border border-red-100 px-2.5 py-0.5 rounded-full">
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

  // ── 3. SUBMITTED SUCCESS SCREEN ─────────────────────────────────────
  if (viewMode === "submitted") {
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

  // ── 4. ACTIVE EVALUATION FORM SCREEN ──────────────────────────────────
  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode(formReferrer)}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors cursor-pointer border-0 bg-transparent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              {editingId ? "Edit Showroom Audit" : "Showroom Audit"}
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Field Evaluation Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
          <span className="text-[9px] text-red-600 font-extrabold tracking-wider">{editingId ? "EDIT MODE" : "ACTIVE FORM"}</span>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-6">
        
        {/* Profile Card (Corporate ID Badge Vibe) */}
        {scannedEmployee && (
          <section className="auth-card p-5 relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100/40 to-transparent rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 p-0.5 shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full rounded-[12px] bg-slate-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded uppercase tracking-wider">Showroom Agent</span>
                </div>
                <h2 className="text-base font-extrabold text-slate-900 mt-1 truncate" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                  {scannedEmployee.name}
                </h2>
                <p className="text-xs text-slate-500 font-medium truncate">{scannedEmployee.designation}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] text-left">
              <div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Division & District</span>
                <span className="text-slate-800 font-bold mt-0.5 block">{scannedEmployee.division}</span>
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
            const score = scores[c.key];
            const { label, color, bg } = getRatingConfig(score);
            const pct = ((score - 1) / 9) * 100;
            return (
              <section key={c.key} className="auth-card p-5 bg-white space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                      {c.svg}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Section {idx + 1}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-800 leading-snug mt-0.5" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                        {c.label}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-baseline gap-0.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                    <span className={`text-2xl font-extrabold leading-none tabular-nums ${color}`}>{score}</span>
                    <span className="text-[9px] text-slate-450 font-bold">/10</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed pl-11 text-left">
                  {c.description}
                </p>

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
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#c21e25] bg-slate-100"
                      style={{
                        background: `linear-gradient(to right, #c21e25 0%, #c21e25 ${pct}%, #f1f5f9 ${pct}%, #f1f5f9 100%)`
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between px-0.5 pt-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setScores((prev) => ({ ...prev, [c.key]: i + 1 }))}
                        className={`w-6 h-6 rounded-full text-[9px] font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                          score === i + 1
                            ? "bg-[#c21e25] text-white scale-110 shadow-md ring-2 ring-red-100"
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

                <div className="flex items-center justify-between pt-1">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold border ${bg}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {label}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-50 text-left">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Observations / Action Items</span>
                  <textarea
                    rows={2}
                    value={remarks[c.key]}
                    onChange={(e) => setRemarks((prev) => ({ ...prev, [c.key]: e.target.value }))}
                    placeholder={`Enter details about ${c.label.toLowerCase()} competency...`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-[11px] text-slate-700 placeholder-slate-350 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all bg-slate-50/50 resize-none font-medium leading-relaxed"
                  />
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
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Calculated across {CRITERIA.length} categories</p>
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
          {editingId ? "Update Review & Submit Score" : "Record Visit & Submit Score"}
        </button>
        
        <p className="text-center text-[9px] text-slate-400 leading-normal">
          By submitting, this evaluation will be instantly logged in the central LMS repository.
        </p>

      </main>
    </div>
  );
}
