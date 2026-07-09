"use client";

import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";

const AUDIT_ALERTS = [
  { id: 1, emp: "Nayeem Uddin",   showroom: "GEC Circle",    score: 4.8, type: "Critical",  time: "12 min ago",  color: "#ef4444" },
  { id: 2, emp: "Zamil Ahmed",    showroom: "Uposhahar",     score: 6.2, type: "Warning",   time: "2 hr ago",    color: "#f59e0b" },
  { id: 3, emp: "Mehrab Hossain", showroom: "Dhanmondi",     score: 6.8, type: "Watch",     time: "5 hr ago",    color: "#f97316" },
];

const CompletionRing = ({ percent }: { percent: number }) => {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const strokeOffset = circ - (percent / 100) * circ;

  let strokeColor = "stroke-red-500";
  if (percent === 100) strokeColor = "stroke-emerald-500";
  else if (percent >= 75) strokeColor = "stroke-blue-500";
  else if (percent >= 40) strokeColor = "stroke-amber-500";

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-9 h-9 flex items-center justify-center">
        <svg className="w-9 h-9 -rotate-90">
          <circle cx="18" cy="18" r={r} className="stroke-slate-100 fill-none" strokeWidth="2.5" />
          <circle 
            cx="18" 
            cy="18" 
            r={r} 
            className={`fill-none ${strokeColor} transition-all duration-500`} 
            strokeWidth="3" 
            strokeDasharray={circ} 
            strokeDashoffset={strokeOffset} 
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-[8px] font-extrabold text-slate-800">{percent}%</span>
      </div>
    </div>
  );
};

export default function AdminDashboardPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  
  const PAGE_SIZE = 10;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet);

        if (rawData.length === 0) {
          alert("The uploaded sheet is empty.");
          return;
        }

        const parsed = rawData.map((row: any) => {
          const findVal = (prefixes: string[]) => {
            const key = Object.keys(row).find(k => 
              prefixes.some(p => k.toLowerCase().replace(/[^a-z0-9]/g, "").includes(p.toLowerCase().replace(/[^a-z0-9]/g, "")))
            );
            return key ? String(row[key]).trim() : "";
          };

          const code = findVal(["id", "code", "empid"]);
          const name = findVal(["name", "empname"]);
          const department = findVal(["department", "departement", "dept"]);
          const empStat = findVal(["empstat", "status", "employmentstatus"]);
          const doj = findVal(["doj", "dateofjoining", "joiningdate"]);
          const gradeGroup = findVal(["gradegroup", "gradegroup", "group"]);
          const designation = findVal(["designation", "desig", "role"]);
          const jobGrade = findVal(["jobgrade", "grade"]);
          const dob = findVal(["dob", "dateofbirth", "birthdate"]);
          const eqGrade = findVal(["eqgrade", "eqgrade"]);
          const locationOutlet = findVal(["locationoutlet", "location", "outlet", "showroom"]);
          const confirmDate = findVal(["confirmdate", "confirmationdate"]);

          // Calculate profile completion consistently based on name hash
          let completion = 0;
          if (name) {
            const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const percentages = [0, 25, 45, 75, 100];
            completion = percentages[hash % percentages.length];
          }

          return {
            code: code || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: name || "Unknown Employee",
            department: department || "N/A",
            empStat: empStat || "N/A",
            doj: doj || "N/A",
            gradeGroup: gradeGroup || "N/A",
            designation: designation || "N/A",
            jobGrade: jobGrade || "N/A",
            dob: dob || "N/A",
            eqGrade: eqGrade || "N/A",
            locationOutlet: locationOutlet || "N/A",
            confirmDate: confirmDate || "N/A",
            completion
          };
        });

        setEmployees(parsed);
        setSelectedEmployee(null); // Clear selected employee on new file upload
        setPage(1);
      } catch (err) {
        console.error("Error parsing Excel:", err);
        alert("Failed to parse the file. Please ensure it is a valid Excel or CSV file.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return employees;
    const q = search.toLowerCase();
    return employees.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.locationOutlet.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
    );
  }, [employees, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const avgCompletion = useMemo(() => {
    if (employees.length === 0) return 0;
    const sum = employees.reduce((acc, e) => acc + e.completion, 0);
    return Math.round(sum / employees.length);
  }, [employees]);

  return (
    <div className="p-5 lg:p-8 space-y-7 animate-fade-in-up">
      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Records */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Employees</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2 leading-none">{employees.length}</p>
              <p className="text-[10px] text-slate-400 font-medium mt-2">Active in registry</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-emerald-600">Updated client-side</span>
          </div>
        </div>

        {/* Card 2: Active Assessments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Active Assessments</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-2 leading-none">7</p>
              <p className="text-[10px] text-slate-400 font-medium mt-2">Open & accepting responses</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-amber-600">3 expire this week</span>
          </div>
        </div>

        {/* Card 3: Avg Account Completion */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Avg Completion</p>
              <div className="flex items-baseline gap-1 mt-2">
                <p className="text-3xl font-extrabold text-slate-900 leading-none">{avgCompletion}%</p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-2">Account progress average</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-emerald-600">↑ Tracked via Profile Completion</span>
          </div>
        </div>

        {/* Card 4: Audit Alerts */}
        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest">Audit Alerts</p>
              <p className="text-3xl font-extrabold text-red-600 mt-2 leading-none">3</p>
              <p className="text-[10px] text-slate-400 font-medium mt-2">Pending HR review</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-red-100">
            <span className="text-[10px] font-bold text-red-600">1 critical, requires action</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Left Side: Upload Zone & Employee Table */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Header Action Section */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Import Employee Records
              </h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Upload a stylesheet to view employee information and registration completions.
              </p>
            </div>

            <div className="relative border border-dashed border-red-200 hover:border-red-600 bg-red-50/20 hover:bg-red-50/50 rounded-xl px-4 py-3 transition-colors flex items-center gap-2.5 cursor-pointer max-w-xs text-xs">
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileUpload} 
              />
              <svg className="text-red-600 animate-pulse shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div>
                <span className="font-bold text-slate-800">Upload Excel File</span>
                <span className="block text-[9px] text-slate-450 font-medium">Drag or click to choose sheet</span>
              </div>
            </div>
          </div>

          {/* Filtering Row */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="relative max-w-sm w-full">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </span>
              <input 
                type="text" 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, ID, outlet, role..." 
                className="pl-8 pr-3 py-1.5 text-[11px] font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-300 w-full placeholder-slate-455"
              />
            </div>
            <p className="text-[10px] text-slate-455 font-semibold">
              {filtered.length} records found
            </p>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Employee Name</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Designation</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Outlet / Location</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Account Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.map((emp) => (
                  <tr key={emp.code} className={`hover:bg-slate-50/30 transition-colors group ${selectedEmployee?.code === emp.code ? "bg-red-50/10" : ""}`}>
                    <td className="px-5 py-3.5 flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedEmployee(emp)} 
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${selectedEmployee?.code === emp.code ? "bg-red-100 text-red-650" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
                        title="Show Details in Side Panel"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </button>
                      <span className="text-xs font-mono font-bold text-slate-800">{emp.code}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-slate-900">{emp.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 font-medium">
                      {emp.designation}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 font-medium">
                      {emp.locationOutlet}
                    </td>
                    <td className="px-5 py-3.5 flex items-center justify-center">
                      <CompletionRing percent={emp.completion} />
                    </td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-24">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 mb-4 shadow-inner">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                          </svg>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800">No Employee Records Loaded</h4>
                        <p className="text-[10px] text-slate-400 font-medium text-center mt-1">
                          The registry is currently empty. Please import an employee spreadsheet file (.xlsx or .csv) to view the account statuses.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
                {employees.length > 0 && pageRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-xs text-slate-400 italic">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {employees.length > 0 && (
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
              <p className="text-[11px] text-slate-500 font-medium">
                Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of <span className="font-bold text-slate-700">{filtered.length}</span> employees
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-2.5 py-1.5 text-[10px] font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <span className="text-[11px] font-bold text-slate-500 px-1">
                  {page} / {totalPages}
                </span>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-2.5 py-1.5 text-[10px] font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Dynamic Sidebar panel */}
        <div className="xl:w-80 flex-shrink-0 space-y-4">
          
          {/* Employee Detail Sidebar display on overview page */}
          {selectedEmployee ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900">Employee Details</h3>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Spreadsheet Record</p>
                </div>
                <button 
                  onClick={() => setSelectedEmployee(null)} 
                  className="text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline transition-all cursor-pointer"
                >
                  Clear Details
                </button>
              </div>

              {/* Avatar Header */}
              <div className="flex items-center gap-3 bg-red-50/10 p-3 rounded-xl border border-red-100/50">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-650 font-extrabold flex items-center justify-center text-xs">
                  {selectedEmployee.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-slate-900 truncate">{selectedEmployee.name}</p>
                  <p className="text-[9px] text-slate-450 font-bold mt-0.5">{selectedEmployee.code} · {selectedEmployee.empStat}</p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2.5 text-[11px] font-medium">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Designation</span>
                  <span className="text-slate-800 font-bold text-right truncate max-w-[170px]" title={selectedEmployee.designation}>{selectedEmployee.designation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-800 font-bold text-right truncate max-w-[170px]" title={selectedEmployee.department}>{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Grade Group</span>
                  <span className="text-slate-800 font-bold">{selectedEmployee.gradeGroup}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Job Grade</span>
                  <span className="text-slate-800 font-bold">{selectedEmployee.jobGrade}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">EQ Grade</span>
                  <span className="text-slate-800 font-bold">{selectedEmployee.eqGrade}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">DOJ</span>
                  <span className="text-slate-800 font-bold">{selectedEmployee.doj}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">DOB</span>
                  <span className="text-slate-800 font-bold">{selectedEmployee.dob}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Location/Outlet</span>
                  <span className="text-slate-800 font-bold text-right truncate max-w-[160px]" title={selectedEmployee.locationOutlet}>{selectedEmployee.locationOutlet}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Confirm Date</span>
                  <span className="text-slate-800 font-bold">{selectedEmployee.confirmDate}</span>
                </div>
              </div>

              {/* Progress Ring chart inside card */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Account Created</span>
                  <span className="text-[9px] text-slate-450 font-bold mt-0.5">Profile Completion Progress</span>
                </div>
                <CompletionRing percent={selectedEmployee.completion} />
              </div>
            </div>
          ) : (
            // Default sidebar displays when no employee is selected
            <>
              {/* Audit Alerts */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">Audit Alerts</h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Require immediate review</p>
                  </div>
                  <span className="text-[9px] font-extrabold bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full">
                    {AUDIT_ALERTS.length} OPEN
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {AUDIT_ALERTS.map(alert => (
                    <div key={alert.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: alert.color }} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{alert.emp}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{alert.showroom} · Score: <span className="font-extrabold text-red-600">{alert.score}</span></p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border" style={{ color: alert.color, borderColor: `${alert.color}40`, backgroundColor: `${alert.color}0d` }}>
                              {alert.type}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">{alert.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                  <button className="text-[11px] font-bold text-red-600 hover:underline w-full text-center">
                    View All Alerts →
                  </button>
                </div>
              </div>

              {/* Showroom Visit Stats */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3.5">
                <h3 className="text-xs font-extrabold text-slate-900">Showroom Visit Stats</h3>
                {[
                  { label: "Visits This Month", value: "48", sub: "Across all divisions" },
                  { label: "Top Division",      value: "Dhaka",   sub: "6 showrooms · 7 assessors" },
                  { label: "Compliance Rate",   value: "87%",     sub: "Grooming & compliance rate" },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-t border-slate-50 first:border-t-0 first:pt-0">
                    <div>
                      <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{stat.sub}</p>
                    </div>
                    <span className="text-lg font-extrabold text-slate-800">{stat.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
