"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FilterOptions {
  departments: string[];
  designations: string[];
  locations: string[];
  jobGrades: string[];
  eqGrades: string[];
  employeeStatuses: string[];
}

export default function AssessorDashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [selectedDesignation, setSelectedDesignation] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedJobGrade, setSelectedJobGrade] = useState("ALL");
  const [selectedEqGrade, setSelectedEqGrade] = useState("ALL");
  const [selectedEmployeeStatus, setSelectedEmployeeStatus] = useState("ALL");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"high-to-low" | "low-to-high">("high-to-low");

  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [inlineWarning, setInlineWarning] = useState<string | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    departments: [],
    designations: [],
    locations: [],
    jobGrades: [],
    eqGrades: [],
    employeeStatuses: []
  });

  useEffect(() => {
    async function fetchFilters() {
      try {
        const res = await fetch("http://localhost:5276/api/EmployeeProfile/distinct-filters");
        if (res.ok) {
          const data = await res.json();
          setFilterOptions(data);
        }
      } catch (err) {
        console.error("Failed to load distinct filters:", err);
      }
    }
    fetchFilters();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedDepartment !== "ALL") params.append("department", selectedDepartment);
      if (selectedDesignation !== "ALL") params.append("designation", selectedDesignation);
      if (selectedLocation !== "ALL") params.append("location", selectedLocation);
      if (selectedJobGrade !== "ALL") params.append("jobGrade", selectedJobGrade);
      if (selectedEqGrade !== "ALL") params.append("eqGrade", selectedEqGrade);
      if (selectedEmployeeStatus !== "ALL") params.append("empStatus", selectedEmployeeStatus);
      params.append("page", currentPage.toString());
      params.append("pageSize", "10");

      const res = await fetch(`http://localhost:5276/api/EmployeeProfile?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [search, selectedDepartment, selectedDesignation, selectedLocation, selectedJobGrade, selectedEqGrade, selectedEmployeeStatus, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDepartment, selectedDesignation, selectedLocation, selectedJobGrade, selectedEqGrade, selectedEmployeeStatus]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedDepartment("ALL");
    setSelectedDesignation("ALL");
    setSelectedLocation("ALL");
    setSelectedJobGrade("ALL");
    setSelectedEqGrade("ALL");
    setSelectedEmployeeStatus("ALL");
    setCurrentPage(1);
  };

  const showWarning = (msg: string) => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    setInlineWarning(msg);
    warningTimerRef.current = setTimeout(() => setInlineWarning(null), 4000);
  };

  const handleEmployeeClick = (emp: any) => {
    const profileId = emp.id ?? emp.Id;
    const name = (emp.name || emp.Name || "").toLowerCase();
    const completion = emp.completion ?? emp.Completion ?? 0;

    if (!name || name === "dummy" || !profileId || completion <= 10) {
      showWarning("This employee has not created their profile account information yet.");
      return;
    }
    router.push(`/employee/profile?id=${profileId}`);
  };

  const filteredAndSortedEmployees = useMemo(() => {
    const scores: Record<string, number> = {
      "EMP-2084": 9.2,
      "EMP-2085": 8.5,
      "EMP-2086": 8.9,
      "EMP-2087": 7.2,
      "EMP-2088": 6.8,
      "EMP-2089": 5.4,
      "EMP-2090": 7.9,
      "EMP-3011": 8.1,
      "EMP-3012": 8.7,
      "EMP-3013": 4.8,
      "EMP-4011": 9.5,
      "EMP-4012": 6.2,
      "EMP-5011": 7.5,
    };

    const enriched = employees.map(emp => ({
      ...emp,
      score: scores[emp.code || emp.Code] || 7.0
    }));

    return enriched.sort((a, b) => {
      return sortOrder === "high-to-low" ? b.score - a.score : a.score - b.score;
    });
  }, [employees, sortOrder]);

  const stats = useMemo(() => {
    const visits = filteredAndSortedEmployees.length * 3 + 5;
    const avgScore = filteredAndSortedEmployees.length > 0
      ? (filteredAndSortedEmployees.reduce((acc, emp) => acc + emp.score, 0) / filteredAndSortedEmployees.length).toFixed(1)
      : "0.0";
    return {
      visitsDone: filteredAndSortedEmployees.length > 0 ? visits : 0,
      assessmentsCreated: filteredAndSortedEmployees.length > 0 ? Math.ceil(visits / 4) + 2 : 0,
      averageRating: avgScore
    };
  }, [filteredAndSortedEmployees]);

  const hasActiveFilters =
    selectedDepartment !== "ALL" ||
    selectedDesignation !== "ALL" ||
    selectedLocation !== "ALL" ||
    selectedJobGrade !== "ALL" ||
    selectedEqGrade !== "ALL" ||
    selectedEmployeeStatus !== "ALL" ||
    search !== "";

  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24 relative overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-30">
        <div>
          <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Assessor Dashboard
          </h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Showroom Visit &amp; Audit Overview</p>
        </div>
        <span className="text-[10px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
          ASSESSOR
        </span>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-5">

        {/* Key Performance Indicators Grid */}
        <section className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Visits Done</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl font-extrabold text-slate-900 leading-none">{stats.visitsDone}</span>
              <span className="text-[9px] text-emerald-500 font-bold">✓</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Assessments</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl font-extrabold text-slate-900 leading-none">{stats.assessmentsCreated}</span>
              <span className="text-[8px] text-slate-400 font-bold">Files</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Avg Rating</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl font-extrabold text-red-650 leading-none">{stats.averageRating}</span>
              <span className="text-[8px] text-slate-400 font-bold">/10</span>
            </div>
          </div>
        </section>

        {/* Search and Filter Icon Section */}
        <section className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
              Search &amp; Filters
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[9px] font-bold text-red-600 hover:text-red-700 cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none"
              />
              <span className="absolute left-3 top-3 text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
            </div>
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow cursor-pointer transition-colors flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
          </div>
        </section>

        {/* Employee Ranking Board */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Employee Rankings</h3>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Based on visit assessments</p>
            </div>

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

          {/* Inline warning — inside the rankings box, not a browser popup */}
          {inlineWarning && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-amber-700">Profile Not Created</p>
                <p className="text-[9px] text-amber-600 font-medium leading-relaxed mt-0.5">{inlineWarning}</p>
              </div>
              <button onClick={() => setInlineWarning(null)} className="text-amber-400 hover:text-amber-600 cursor-pointer">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          <div className="space-y-2.5">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Loading employee records...
              </div>
            ) : (
              <>
                {filteredAndSortedEmployees.map((emp, index) => {
                  const rank = sortOrder === "high-to-low" ? index + 1 : filteredAndSortedEmployees.length - index;
                  let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
                  if (rank === 1) badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
                  else if (rank === 2) badgeColor = "bg-slate-400/10 text-slate-600 border-slate-400/20";
                  else if (rank === 3) badgeColor = "bg-orange-500/10 text-orange-600 border-orange-500/20";

                  return (
                    <div
                      key={emp.code || index}
                      onClick={() => handleEmployeeClick(emp)}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center text-[10px] font-extrabold ${badgeColor}`}>
                          {rank}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800 truncate leading-tight">{emp.name || emp.Name}</span>
                            <span className="text-[9px] text-slate-400 font-mono font-semibold">({emp.code || emp.Code})</span>
                            {(emp.isVerified || emp.IsVerified) && (
                              <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm flex-shrink-0" title="Verified Profile">
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400 font-semibold block truncate mt-0.5">
                            {emp.locationOutlet || emp.LocationOutlet || "No Showroom"} • {emp.designation || emp.Designation || "No Designation"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{
                          backgroundColor: emp.score >= 8.5 ? "#10b981" : emp.score >= 7.0 ? "#3b82f6" : emp.score >= 5.5 ? "#f59e0b" : "#ef4444"
                        }} />
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer disabled:cursor-not-allowed transition-colors border border-slate-200"
                    >
                      Previous
                    </button>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer disabled:cursor-not-allowed transition-colors border border-slate-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Sliding Search Filters Drawer overlay */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative bg-white w-80 max-w-full h-full p-6 shadow-2xl border-l border-slate-100 flex flex-col justify-between z-10 animate-slide-in-right">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 tracking-wider uppercase">Search Filters</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Refine target scope list</p>
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1 scrollbar-none text-xs">
              {[
                { label: "Department", value: selectedDepartment, setter: setSelectedDepartment, options: filterOptions.departments, placeholder: "All Departments" },
                { label: "Designation", value: selectedDesignation, setter: setSelectedDesignation, options: filterOptions.designations, placeholder: "All Designations" },
                { label: "Location", value: selectedLocation, setter: setSelectedLocation, options: filterOptions.locations, placeholder: "All Locations" },
                { label: "Job Grade", value: selectedJobGrade, setter: setSelectedJobGrade, options: filterOptions.jobGrades, placeholder: "All Job Grades" },
                { label: "EQ Grade", value: selectedEqGrade, setter: setSelectedEqGrade, options: filterOptions.eqGrades, placeholder: "All EQ Grades" },
                { label: "Employee Status", value: selectedEmployeeStatus, setter: setSelectedEmployeeStatus, options: filterOptions.employeeStatuses, placeholder: "All Statuses" },
              ].map(({ label, value, setter, options, placeholder }) => (
                <div className="space-y-1" key={label}>
                  <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block">{label}</span>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none"
                  >
                    <option value="ALL">{placeholder}</option>
                    {options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow cursor-pointer transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={() => { handleResetFilters(); setIsFilterDrawerOpen(false); }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Reset / Clear All
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Nav footer */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-around shadow-lg md:max-w-md md:mx-auto md:rounded-t-2xl">
        <Link href="/assessor/dashboard" className="flex flex-col items-center gap-0.5 text-red-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          <span className="text-[9px] font-bold">Home</span>
        </Link>
        <Link href="/assessor/create-assessment" className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
          <span className="text-[9px] font-semibold">New Audit</span>
        </Link>
        <Link href="/assessor/visit-assessment" className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-600">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          <span className="text-[9px] font-semibold">Visit</span>
        </Link>
      </nav>
    </div>
  );
}
