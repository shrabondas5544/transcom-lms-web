"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SCOPE_METADATA, AUDIENCE_METADATA, MOCK_TARGET_EMPLOYEES, assessmentApiService } from "../../../lib/api";
import { IAssessment, IQuestion, QuestionType, IAnswerOption } from "../../../types/assessment";

interface IEmployeeSkillRank {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  showroom: string;
  division: string;
  assessmentName: string;
  device: string;
  brand: string;
  score: number;
  date: string;
}

const SKILL_ASSESSMENT_RANKINGS: IEmployeeSkillRank[] = [
  { id: "SAR-101", employeeId: "EMP-2084", employeeName: "Sayed Mahmud", designation: "Senior Sales Executive", showroom: "Gulshan Outlet", division: "Dhaka Division", assessmentName: "Smart TV Product Line Q2", device: "Smart TV", brand: "Samsung", score: 9.4, date: "03 July 2026" },
  { id: "SAR-102", employeeId: "EMP-2085", employeeName: "Anisur Rahman", designation: "Sales Executive", showroom: "Gulshan Outlet", division: "Dhaka Division", assessmentName: "Home Appliances Sales Drill", device: "Home Appliances", brand: "LG", score: 8.8, date: "02 July 2026" },
  { id: "SAR-103", employeeId: "EMP-2086", employeeName: "Taskeen Ahmed", designation: "Assistant Branch Manager", showroom: "Gulshan Outlet", division: "Dhaka Division", assessmentName: "Operational Leadership Quiz", device: "Smart TV", brand: "Sony", score: 9.1, date: "01 July 2026" },
  { id: "SAR-104", employeeId: "EMP-2087", employeeName: "Fahim Shahriar", designation: "Sales Executive", showroom: "Dhanmondi Outlet", division: "Dhaka Division", assessmentName: "Mobile Phones Tech Drill", device: "Mobile Phones", brand: "Samsung", score: 7.5, date: "30 June 2026" },
  { id: "SAR-105", employeeId: "EMP-2088", employeeName: "Mehrab Hossain", designation: "Senior Sales Executive", showroom: "Dhanmondi Outlet", division: "Dhaka Division", assessmentName: "Premium AC Inverter Training", device: "Air Conditioners", brand: "Gree", score: 7.0, date: "29 June 2026" },
  { id: "SAR-106", employeeId: "EMP-2089", employeeName: "Sadia Afrin", designation: "Sales Executive", showroom: "Uttara Outlet", division: "Dhaka Division", assessmentName: "Customer Grievance Competency", device: "Smart TV", brand: "LG", score: 8.2, date: "28 June 2026" },
  { id: "SAR-107", employeeId: "EMP-2090", employeeName: "Kamrul Hasan", designation: "Assistant Branch Manager", showroom: "Uttara Outlet", division: "Dhaka Division", assessmentName: "Floor Management Principles", device: "Home Appliances", brand: "Whirlpool", score: 8.5, date: "27 June 2026" },
  { id: "SAR-108", employeeId: "EMP-3011", employeeName: "Imran Khan", designation: "Sales Executive", showroom: "Agrabad Outlet", division: "Chittagong Division", assessmentName: "Singer Prime LED Spec Drill", device: "Smart TV", brand: "Singer", score: 8.3, date: "26 June 2026" },
  { id: "SAR-109", employeeId: "EMP-3012", employeeName: "Arifur Rahman", designation: "Senior Sales Executive", showroom: "Agrabad Outlet", division: "Chittagong Division", assessmentName: "LG OLED C4 Comparative Specs", device: "Smart TV", brand: "LG", score: 8.9, date: "25 June 2026" },
  { id: "SAR-110", employeeId: "EMP-3013", employeeName: "Nayeem Uddin", designation: "Sales Executive", showroom: "GEC Circle Outlet", division: "Chittagong Division", assessmentName: "WindFree AC Selling Script", device: "Air Conditioners", brand: "LG", score: 5.2, date: "24 June 2026" },
  { id: "SAR-111", employeeId: "EMP-4011", employeeName: "Hafizur Rahman", designation: "Senior Sales Executive", showroom: "Zindabazar Outlet", division: "Sylhet Division", assessmentName: "Samsung Galaxy S24 Promos", device: "Mobile Phones", brand: "Apple", score: 9.6, date: "23 June 2026" },
  { id: "SAR-112", employeeId: "EMP-4012", employeeName: "Zamil Ahmed", designation: "Assistant Branch Manager", showroom: "Uposhahar Outlet", division: "Sylhet Division", assessmentName: "Retail Store Compliance Standards", device: "Home Appliances", brand: "Bosch", score: 6.8, date: "22 June 2026" },
  { id: "SAR-113", employeeId: "EMP-5011", employeeName: "Sujon Ali", designation: "Sales Executive", showroom: "Saheb Bazar Outlet", division: "Rajshahi Division", assessmentName: "Xiaomi 14 Ultra Feature Matrix", device: "Mobile Phones", brand: "Xiaomi", score: 7.9, date: "21 June 2026" },
];

function getRatingConfig(score: number) {
  if (score >= 9.0) return { label: "Excellent Performance", color: "text-emerald-600", bar: "#10b981", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
  if (score >= 7.5) return { label: "Good Competency", color: "text-blue-600", bar: "#3b82f6", bg: "bg-blue-50 text-blue-800 border-blue-200" };
  if (score >= 5.0) return { label: "Satisfactory Level", color: "text-amber-600", bar: "#f59e0b", bg: "bg-amber-50 text-amber-800 border-amber-200" };
  if (score >= 3.0) return { label: "Below Standard", color: "text-orange-600", bar: "#f97316", bg: "bg-orange-50 text-orange-800 border-orange-200" };
  return { label: "Needs Critical Focus", color: "text-red-600", bar: "#ef4444", bg: "bg-red-50 text-red-800 border-red-200" };
}

export default function CreateAssessmentPage() {
  const [viewMode, setViewMode] = useState<"list" | "wizard" | "history">("list");
  const [referrerMode, setReferrerMode] = useState<"list" | "history">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createdAssessments, setCreatedAssessments] = useState<IAssessment[]>([]);
  
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Leaderboard parameters
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const PAGE_SIZE = 10;

  // ── Step 1 States (Metadata) ──────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(15);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(0);

  // ── Step 2 States (Targeting Scope) ───────────────────────────────────
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // ── Step 2 States (Audience Targeting) ────────────────────────────────
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [selectedShowrooms, setSelectedShowrooms] = useState<string[]>([]);
  const [selectedDesignations, setSelectedDesignations] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // ── Step 3 States (Question Builder) ──────────────────────────────────
  const [questions, setQuestions] = useState<IQuestion[]>([
    {
      id: "Q1",
      title: "",
      mediaUrl: null,
      type: "MCQ",
      options: [
        { id: "O1", text: "", isCorrect: false },
        { id: "O2", text: "", isCorrect: false },
      ],
      correctAnswer: "",
      points: 10,
    },
  ]);
  const [shufflingLogic, setShufflingLogic] = useState<"ServeAll" | "ServeSubset">("ServeAll");
  const [subsetSize, setSubsetSize] = useState<number>(1);

  // ── FILTER SIDE NAVBAR STATES ─────────────────────────────────────────
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDevice, setFilterDevice] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterModels, setFilterModels] = useState<string[]>([]);
  const [filterBrandsList, setFilterBrandsList] = useState<string[]>([]);
  const [filterModelsList, setFilterModelsList] = useState<string[]>([]);

  // Active filters applied to the list
  const [appliedDevice, setAppliedDevice] = useState("");
  const [appliedBrand, setAppliedBrand] = useState("");
  const [appliedModels, setAppliedModels] = useState<string[]>([]);

  // Load created assessments
  const loadAssessments = async () => {
    try {
      const data = await assessmentApiService.getAll();
      setCreatedAssessments(data);
    } catch (err) {
      console.error("Failed to load assessments", err);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, [viewMode]);

  // Update brand list when device changes (Wizard)
  useEffect(() => {
    if (selectedDevice) {
      setAvailableBrands(SCOPE_METADATA.brands[selectedDevice] || []);
    } else {
      setAvailableBrands([]);
    }
    if (!editingId) {
      setSelectedBrand("");
      setSelectedModels([]);
    }
  }, [selectedDevice]);

  // Update model list when brand changes (Wizard)
  useEffect(() => {
    if (selectedDevice && selectedBrand && selectedBrand !== "ALL") {
      const brandData = SCOPE_METADATA.models[selectedBrand];
      const modelData = brandData ? brandData[selectedDevice as keyof typeof brandData] : [];
      setAvailableModels(modelData || []);
    } else {
      setAvailableModels([]);
    }
    if (!editingId) {
      setSelectedModels([]);
    }
  }, [selectedBrand, selectedDevice]);

  // Toggle model selection (Wizard)
  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  // ── Audience Cascading & Filter Logic ─────────────────────────────────
  const availableShowrooms = selectedDivisions.reduce<string[]>((acc, div) => {
    return [...acc, ...(AUDIENCE_METADATA.showrooms[div] || [])];
  }, []);

  const filteredEmployees = MOCK_TARGET_EMPLOYEES.filter((emp) => {
    if (selectedDivisions.length > 0 && !selectedDivisions.includes(emp.division)) {
      return false;
    }
    if (selectedShowrooms.length > 0 && !selectedShowrooms.includes(emp.showroom)) {
      return false;
    }
    if (selectedDesignations.length > 0 && !selectedDesignations.includes(emp.designation)) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    setSelectedShowrooms((prev) =>
      prev.filter((showroom) => {
        const div = Object.keys(AUDIENCE_METADATA.showrooms).find((d) =>
          AUDIENCE_METADATA.showrooms[d].includes(showroom)
        );
        return div && selectedDivisions.includes(div);
      })
    );
  }, [selectedDivisions]);

  const toggleDivision = (div: string) => {
    setSelectedDivisions((prev) =>
      prev.includes(div) ? prev.filter((d) => d !== div) : [...prev, div]
    );
  };

  const toggleShowroom = (sr: string) => {
    setSelectedShowrooms((prev) =>
      prev.includes(sr) ? prev.filter((s) => s !== sr) : [...prev, sr]
    );
  };

  const toggleDesignation = (des: string) => {
    setSelectedDesignations((prev) =>
      prev.includes(des) ? prev.filter((d) => d !== des) : [...prev, des]
    );
  };

  const toggleEmployee = (empId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  const selectAllFilteredEmployees = () => {
    const allSelected = filteredEmployees.every(emp => selectedEmployees.includes(emp.id));
    if (allSelected) {
      setSelectedEmployees(prev => prev.filter(id => !filteredEmployees.some(emp => emp.id === id)));
    } else {
      setSelectedEmployees(prev => {
        const toAdd = filteredEmployees.filter(emp => !prev.includes(emp.id)).map(emp => emp.id);
        return [...prev, ...toAdd];
      });
    }
  };

  // ── FILTER CASCADING LOGIC ──────────────────────────────────────────
  useEffect(() => {
    if (filterDevice) {
      setFilterBrandsList(SCOPE_METADATA.brands[filterDevice] || []);
    } else {
      setFilterBrandsList([]);
    }
    setFilterBrand("");
    setFilterModels([]);
  }, [filterDevice]);

  useEffect(() => {
    if (filterDevice && filterBrand && filterBrand !== "ALL") {
      const brandData = SCOPE_METADATA.models[filterBrand];
      const modelData = brandData ? brandData[filterDevice as keyof typeof brandData] : [];
      setFilterModelsList(modelData || []);
    } else {
      setFilterModelsList([]);
    }
    setFilterModels([]);
  }, [filterBrand, filterDevice]);

  const toggleFilterModel = (model: string) => {
    setFilterModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const applyFilters = () => {
    setAppliedDevice(filterDevice);
    setAppliedBrand(filterBrand);
    setAppliedModels(filterModels);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilterDevice("");
    setFilterBrand("");
    setFilterModels([]);
    setAppliedDevice("");
    setAppliedBrand("");
    setAppliedModels([]);
    setIsFilterOpen(false);
  };

  // Derived rankings with search, filter, and sort
  const filteredAndSortedRankings = useMemo(() => {
    let result = [...SKILL_ASSESSMENT_RANKINGS];

    // Filter by target device category
    if (appliedDevice) {
      result = result.filter((r) => r.device === appliedDevice);
    }
    // Filter by target brand
    if (appliedBrand) {
      result = result.filter((r) => r.brand === appliedBrand);
    }

    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(q) ||
          r.showroom.toLowerCase().includes(q) ||
          r.division.toLowerCase().includes(q) ||
          r.designation.toLowerCase().includes(q) ||
          r.assessmentName.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortDirection === "desc") {
      result.sort((a, b) => b.score - a.score);
    } else {
      result.sort((a, b) => a.score - b.score);
    }

    return result;
  }, [appliedDevice, appliedBrand, searchQuery, sortDirection]);

  // Paginated Rankings (10 per page)
  const totalPages = Math.ceil(filteredAndSortedRankings.length / PAGE_SIZE) || 1;
  const paginatedRankings = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedRankings.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedRankings, currentPage]);

  // Reset page number on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortDirection, appliedDevice, appliedBrand]);

  // Question handlers (Wizard)
  const addQuestion = () => {
    const newId = `Q${questions.length + 1}`;
    setQuestions([
      ...questions,
      {
        id: newId,
        title: "",
        mediaUrl: null,
        type: "MCQ",
        options: [
          { id: `${newId}-O1`, text: "", isCorrect: false },
          { id: `${newId}-O2`, text: "", isCorrect: false },
        ],
        correctAnswer: "",
        points: 10,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updated: Partial<IQuestion>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updated } : q))
    );
  };

  const addOption = (qIdx: number) => {
    const q = questions[qIdx];
    const optId = `${q.id}-O${q.options.length + 1}`;
    updateQuestion(qIdx, {
      options: [...q.options, { id: optId, text: "", isCorrect: false }],
    });
  };

  const updateOptionText = (qIdx: number, oIdx: number, text: string) => {
    const q = questions[qIdx];
    const updatedOptions = q.options.map((opt, idx) =>
      idx === oIdx ? { ...opt, text } : opt
    );
    updateQuestion(qIdx, { options: updatedOptions });
  };

  const toggleOptionCorrect = (qIdx: number, oIdx: number) => {
    const q = questions[qIdx];
    const updatedOptions = q.options.map((opt, idx) =>
      idx === oIdx ? { ...opt, isCorrect: true } : { ...opt, isCorrect: false }
    );
    updateQuestion(qIdx, { options: updatedOptions });
  };

  const handleMediaUpload = (qIdx: number, fileName: string) => {
    updateQuestion(qIdx, { mediaUrl: fileName });
  };

  const validateStep = (): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!title.trim()) {
        setErrorMsg("Please enter an assessment title.");
        return false;
      }
      if (!deadline) {
        setErrorMsg("Please specify a deadline date/time.");
        return false;
      }
    } else if (step === 2) {
      if (!selectedDevice) {
        setErrorMsg("Target Category / Device is required.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setErrorMsg(null);

    // Validate Questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.title.trim()) {
        setErrorMsg(`Question #${i + 1} title cannot be blank.`);
        return;
      }
      if (q.type === "MCQ") {
        const hasCorrect = q.options.some((o) => o.isCorrect);
        const allFilled = q.options.every((o) => o.text.trim());
        if (!allFilled) {
          setErrorMsg(`Please fill out all answer options for Question #${i + 1}.`);
          return;
        }
        if (!hasCorrect) {
          setErrorMsg(`Please mark at least one correct answer option for Question #${i + 1}.`);
          return;
        }
      } else if (q.type === "TrueFalse") {
        if (q.correctAnswer !== "true" && q.correctAnswer !== "false") {
          setErrorMsg(`Please select the correct value (True/False) for Question #${i + 1}.`);
          return;
        }
      } else if (q.type === "FillInBlanks") {
        if (!q.correctAnswer.trim()) {
          setErrorMsg(`Please input the required blank answer phrase for Question #${i + 1}.`);
          return;
        }
      } else if (q.type === "ShortAnswer") {
        if (!q.correctAnswer.trim()) {
          setErrorMsg(`Please input reference key phrases for Question #${i + 1}.`);
          return;
        }
      }
    }

    if (shufflingLogic === "ServeSubset" && (subsetSize < 1 || subsetSize > questions.length)) {
      setErrorMsg(`Subset size must be between 1 and the total number of questions (${questions.length}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      const finalAssessment: IAssessment = {
        title,
        deadline,
        hasTimeLimit,
        timeLimitMinutes,
        timeLimitSeconds,
        scope: {
          device: selectedDevice,
          brand: selectedBrand || "ALL",
          models: selectedBrand === "ALL" || !selectedBrand ? [] : selectedModels,
        },
        questions,
        pool: {
          shufflingLogic,
          subsetSize: shufflingLogic === "ServeSubset" ? subsetSize : questions.length,
        },
        divisions: selectedDivisions,
        showrooms: selectedShowrooms,
        designations: selectedDesignations,
        employees: selectedEmployees,
      };

      if (editingId) {
        finalAssessment.id = editingId;
        const stored = localStorage.getItem("transcom_mock_assessments");
        const items: IAssessment[] = stored ? JSON.parse(stored) : [];
        const index = items.findIndex((x) => x.id === editingId);
        if (index !== -1) {
          items[index] = { ...items[index], ...finalAssessment };
          localStorage.setItem("transcom_mock_assessments", JSON.stringify(items));
        }
      } else {
        await assessmentApiService.create(finalAssessment);
      }
      
      setViewMode(referrerMode);
      handleResetStates();
    } catch (err) {
      setErrorMsg("Failed to save assessment. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetStates = () => {
    setTitle("");
    setDeadline("");
    setHasTimeLimit(false);
    setTimeLimitMinutes(15);
    setTimeLimitSeconds(0);
    setSelectedDevice("");
    setSelectedBrand("");
    setSelectedModels([]);
    setSelectedDivisions([]);
    setSelectedShowrooms([]);
    setSelectedDesignations([]);
    setSelectedEmployees([]);
    setQuestions([
      {
        id: "Q1",
        title: "",
        mediaUrl: null,
        type: "MCQ",
        options: [
          { id: "O1", text: "", isCorrect: false },
          { id: "O2", text: "", isCorrect: false },
        ],
        correctAnswer: "",
        points: 10,
      },
    ]);
    setShufflingLogic("ServeAll");
    setSubsetSize(1);
    setEditingId(null);
    setStep(1);
  };

  const handleEdit = (asm: IAssessment) => {
    setEditingId(asm.id || null);
    setTitle(asm.title);
    setDeadline(asm.deadline);
    setHasTimeLimit(asm.hasTimeLimit);
    setTimeLimitMinutes(asm.timeLimitMinutes);
    setTimeLimitSeconds(asm.timeLimitSeconds);
    setSelectedDevice(asm.scope.device);
    setSelectedBrand(asm.scope.brand);
    
    const brandData = SCOPE_METADATA.models[asm.scope.brand];
    const modelData = brandData ? brandData[asm.scope.device as keyof typeof brandData] : [];
    setAvailableModels(modelData || []);
    setSelectedModels(asm.scope.models || []);
    
    setSelectedDivisions(asm.divisions || []);
    setSelectedShowrooms(asm.showrooms || []);
    setSelectedDesignations(asm.designations || []);
    setSelectedEmployees(asm.employees || []);
    
    setQuestions(asm.questions);
    setShufflingLogic(asm.pool.shufflingLogic);
    setSubsetSize(asm.pool.subsetSize);
    
    setViewMode("wizard");
    setStep(1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assessment?")) {
      await assessmentApiService.delete(id);
      loadAssessments();
    }
  };

  // ── 1. PORTAL MAIN VIEW ────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div className="auth-bg min-h-screen flex flex-col pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Assessment Portal
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Showroom Management Control</p>
          </div>
          
          {/* Top Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center gap-1.5 text-xs font-bold ${
              appliedDevice
                ? "bg-red-50 border-red-200 text-red-655"
                : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {appliedDevice ? "Filtered" : "Filter"}
          </button>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-5">
          
          {/* RED ACTION CARD: COMBINED ASSESSMENT TEMPLATES STATUS */}
          <div className="bg-[#c21e25] text-white rounded-2xl border border-red-700 shadow-md overflow-hidden">
            <div className="flex divide-x divide-white/10">
              {/* Left Side: Click to view history & edit */}
              <div 
                onClick={() => setViewMode("history")}
                className="flex-1 p-5 hover:bg-black/10 active:bg-black/20 cursor-pointer transition-colors text-left"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-extrabold text-red-100 uppercase tracking-widest block">Assessments Created</span>
                    <span className="text-2xl font-extrabold block mt-1.5 leading-none">
                      {createdAssessments.length}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-extrabold text-red-100 uppercase tracking-widest block">Creation History</span>
                    <span className="text-[10px] font-extrabold block mt-1.5 leading-none text-red-100/90">
                      {createdAssessments.length} Active
                    </span>
                  </div>
                </div>
                <span className="text-[8.5px] font-bold text-red-200 block mt-3.5 hover:underline">
                  View & Edit History →
                </span>
              </div>
              
              {/* Right Side: Create New Option */}
              <div 
                onClick={() => {
                  handleResetStates();
                  setReferrerMode("list");
                  setViewMode("wizard");
                }}
                className="p-5 flex flex-col items-center justify-center hover:bg-black/10 active:bg-black/20 cursor-pointer transition-colors px-6"
              >
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white mb-1.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-100">Create New</span>
              </div>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {appliedDevice && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <div className="text-slate-600 font-semibold truncate text-left">
                Active Filter: <span className="font-extrabold text-slate-850">{appliedDevice}</span>
                {appliedBrand && ` → ${appliedBrand}`}
              </div>
              <button
                onClick={clearFilters}
                className="text-[#c21e25] hover:underline font-bold text-[10px] flex-shrink-0 ml-2"
              >
                Clear
              </button>
            </div>
          )}

          {/* Employee Assessment Rankings Leaderboard */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block text-left">Employee Assessment Rankings</h4>
                <p className="text-[8px] text-slate-400 font-medium text-left">Scores on skills tests and active training quizzes</p>
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
                placeholder="Search by Employee, District, Showroom, Test..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white placeholder-slate-350 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
            
            {/* Rankings Cards */}
            <div className="space-y-2.5">
              {paginatedRankings.map((r, index) => {
                const rank = (currentPage - 1) * PAGE_SIZE + index + 1;
                
                // Get rating config based on score out of 10
                const config = getRatingConfig(r.score);

                // Ranking colors
                let rankStyle = "bg-slate-100 text-slate-600 border-slate-200";
                if (rank === 1) rankStyle = "bg-amber-500/10 text-amber-650 border-amber-500/20";
                else if (rank === 2) rankStyle = "bg-slate-400/10 text-slate-650 border-slate-400/20";
                else if (rank === 3) rankStyle = "bg-orange-500/10 text-orange-650 border-orange-500/20";

                return (
                  <div 
                    key={r.id} 
                    className="auth-card p-3 bg-white flex justify-between items-center gap-3 border border-slate-105"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Indicator Badge */}
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 ${rankStyle}`}>
                        {rank}
                      </div>

                      <div className="min-w-0 text-left">
                        <h5 className="text-xs font-bold text-slate-900 truncate leading-tight">{r.employeeName}</h5>
                        <span className="text-[9px] text-slate-450 font-semibold block truncate mt-0.5">
                          {r.designation}
                        </span>
                        <p className="text-[9px] text-red-655 font-bold block truncate mt-0.5">
                          {r.showroom} • <span className="text-slate-450 font-semibold">{r.division.replace(" Division", "")}</span>
                        </p>
                        <p className="text-[8.5px] text-slate-400 font-semibold block truncate mt-1">
                          Test: {r.assessmentName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex items-baseline leading-none">
                        <span className={`text-sm font-mono font-extrabold ${config.color}`}>{r.score.toFixed(1)}</span>
                        <span className="text-[8px] text-slate-400 font-bold">/10</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${config.bg}`}>
                        {config.label.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                );
              })}

              {paginatedRankings.length === 0 && (
                <div className="py-10 text-center text-xs text-slate-400 italic bg-white/40 rounded-2xl border border-dashed border-slate-200">
                  No matching rankings found.
                </div>
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

        {/* ── SLIDING FILTER SIDE BAR ────────────────────────────────────── */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
            <div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setIsFilterOpen(false)}
            ></div>
            
            <div className="relative w-80 max-w-xs bg-white h-full shadow-2xl flex flex-col p-5 space-y-5 animate-slide-in-right">
              <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                <div className="text-left">
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Search Filters</h3>
                  <p className="text-[9px] text-slate-400">Refine target scope list</p>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                <div>
                  <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1 text-left">Category / Device</label>
                  <select
                    value={filterDevice}
                    onChange={(e) => setFilterDevice(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {SCOPE_METADATA.devices.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {filterDevice && (
                  <div className="animate-fade-in">
                    <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1 text-left">Target Brand</label>
                    <select
                      value={filterBrand}
                      onChange={(e) => setFilterBrand(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                    >
                      <option value="">All Brands</option>
                      {filterBrandsList.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t border-slate-150 pt-4 flex-shrink-0">
                <button
                  onClick={applyFilters}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm border-0 uppercase tracking-wider"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer border border-slate-200 uppercase tracking-wider"
                >
                  Reset / Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── 2. DEDICATED HISTORY VIEW (EDITABLE) ────────────────────────────
  if (viewMode === "history") {
    return (
      <div className="auth-bg min-h-screen flex flex-col pb-24">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setViewMode("list")}
              className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors cursor-pointer border-0 bg-transparent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            </button>
            <div className="text-left">
              <h1 className="text-sm font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Assessment History
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Edit or Delete Training Templates</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-red-655 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
            MANAGE
          </span>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-4">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 text-[10px] text-slate-500 font-medium leading-relaxed text-left">
            💡 **Tip**: Click on any of the assessments below to edit its questions, time limits, or target showroom agents.
          </div>

          <div className="space-y-3.5">
            {createdAssessments.map((asm) => {
              const scopeText = asm.scope.brand === "ALL" || !asm.scope.brand
                ? `${asm.scope.device} — All Brands`
                : `${asm.scope.device} — ${asm.scope.brand} (${asm.scope.models?.length || 0} Models)`;
              return (
                <div key={asm.id} className="auth-card p-5 bg-white space-y-4 border border-slate-105 relative overflow-hidden shadow-sm hover:border-red-200 transition-colors group cursor-pointer" onClick={() => { setReferrerMode("history"); handleEdit(asm); }}>
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-600 group-hover:bg-red-700"></div>
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5 pr-6 text-left">
                      <span className="text-[8px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded inline-block uppercase tracking-wider">
                        {scopeText}
                      </span>
                      <h3 className="text-xs font-extrabold text-slate-900 leading-snug group-hover:text-red-655 transition-colors" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                        {asm.title}
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 flex-shrink-0">
                      {asm.id}
                    </span>
                  </div>

                  {/* Created By & Metadata details */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 text-[10px] text-slate-500 font-medium text-left">
                    <div className="flex justify-between items-center">
                      <span>Questions: <span className="font-extrabold text-slate-800">{asm.questions.length}</span></span>
                      <span>Time Limit: <span className="font-extrabold text-slate-800">{asm.hasTimeLimit ? `${asm.timeLimitMinutes} min` : "None"}</span></span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200/50 pt-1.5">
                      <div>
                        <span className="text-[7px] text-slate-400 block uppercase font-bold tracking-wider">Created By</span>
                        <span className="text-slate-700 font-extrabold">Mustafizur Rahman</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[7px] text-slate-400 block uppercase font-bold tracking-wider">Deadline</span>
                        <span className="font-extrabold text-slate-700">{new Date(asm.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setReferrerMode("history"); handleEdit(asm); }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-[10px] font-bold cursor-pointer transition-colors text-slate-655"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(asm.id!)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-655 hover:bg-red-50 text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {createdAssessments.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400 italic bg-white/40 rounded-2xl border border-dashed border-slate-200">
                No active assessment templates found. Tap "Create New" on the dashboard to start.
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ── WIZARD FORM VIEW ───────────────────────────────────────────────────
  return (
    <div className="auth-bg min-h-screen flex flex-col pb-28">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Any unsaved work will be lost. Return to dashboard?")) {
                setViewMode(referrerMode);
              }
            }}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all cursor-pointer border-0 bg-transparent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="text-left">
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              {editingId ? "Edit Assessment" : "Assessment Creator"}
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Wizard Step {step} of 3</p>
          </div>
        </div>
        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-650 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-5">
        
        {/* Step Progress Indicator circles (1/3, 2/3, 3/3) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between text-[10px] font-bold text-slate-400">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${step >= 1 ? "bg-red-600 text-white" : "bg-slate-100 text-slate-400"}`}>1</span>
            <span className={`${step === 1 ? "text-slate-800 font-extrabold" : ""}`}>Metadata</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-100"></div>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${step >= 2 ? "bg-red-600 text-white" : "bg-slate-100 text-slate-400"}`}>2</span>
            <span className={`${step === 2 ? "text-slate-800 font-extrabold" : ""}`}>Scope Target</span>
          </div>
          <div className="w-6 h-0.5 bg-slate-100"></div>
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${step >= 3 ? "bg-red-600 text-white" : "bg-slate-100 text-slate-400"}`}>3</span>
            <span className={`${step === 3 ? "text-slate-800 font-extrabold" : ""}`}>Questions</span>
          </div>
        </div>

        {/* Error message alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold leading-normal flex items-start gap-2.5 text-left">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── STEP 1: METADATA ────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="auth-card p-5 bg-white space-y-4 text-left">
              <div>
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Assessment Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Samsung OLED TV Setup and Demo Rules"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">Target Deadline</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Time limit card */}
            <div className="auth-card p-5 bg-white space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Evaluation Time Limit</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Enforce a countdown timer during the exam.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasTimeLimit(!hasTimeLimit)}
                  className="w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer bg-slate-200"
                  style={{ backgroundColor: hasTimeLimit ? "#c21e25" : "#e2e8f0" }}
                >
                  <span
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all shadow-sm ${
                      hasTimeLimit ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {hasTimeLimit && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 animate-fade-in">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Minutes</label>
                    <select
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                    >
                      {Array.from({ length: 120 }).map((_, i) => (
                        <option key={i} value={i}>{i} Min</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seconds</label>
                    <select
                      value={timeLimitSeconds}
                      onChange={(e) => setTimeLimitSeconds(parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                    >
                      {[0, 15, 30, 45].map((s) => (
                        <option key={s} value={s}>{s} Sec</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* RED Continue button below cards */}
            <div className="pt-2">
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md uppercase tracking-wider border-0"
              >
                Continue to Targeting
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: SCOPE TARGETING ────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="auth-card p-5 bg-white space-y-4 text-left">
              <div>
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">1. Target Device Category</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {SCOPE_METADATA.devices.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {selectedDevice && (
                <div className="animate-fade-in">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">2. Target Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                  >
                    <option value="ALL">All Brands (General Category Assessment)</option>
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedDevice && selectedBrand && selectedBrand !== "ALL" && availableModels.length > 0 && (
                <div className="animate-fade-in space-y-2">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">3. Specific Models (Optional)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableModels.map((m) => {
                      const isSel = selectedModels.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleModel(m)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSel
                              ? "bg-slate-850 border-slate-850 text-white shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100"
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Target Audience (Showrooms / Employees) Card */}
            <div className="auth-card p-5 bg-white space-y-4 text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-850">Target Audits Audience</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Restrict this assessment to specific locations or divisions.</p>
              </div>

              {/* Division Filters */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Division</span>
                <div className="flex flex-wrap gap-1.5">
                  {AUDIENCE_METADATA.divisions.map((div) => {
                    const isSel = selectedDivisions.includes(div);
                    return (
                      <button
                        key={div}
                        type="button"
                        onClick={() => toggleDivision(div)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                          isSel
                            ? "bg-red-50 border-red-200 text-red-655"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {div.replace(" Division", "")}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Showroom filter based on selected divisions */}
              {selectedDivisions.length > 0 && availableShowrooms.length > 0 && (
                <div className="animate-fade-in space-y-1.5 pt-2 border-t border-slate-50">
                  <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Outlet Showrooms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableShowrooms.map((sr) => {
                      const isSel = selectedShowrooms.includes(sr);
                      return (
                        <button
                          key={sr}
                          type="button"
                          onClick={() => toggleShowroom(sr)}
                          className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                            isSel
                              ? "bg-red-50 border-red-200 text-red-655"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {sr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Specific Designation Selectors */}
              <div className="space-y-1.5 pt-2 border-t border-slate-50">
                <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Employee Designation</span>
                <div className="flex flex-wrap gap-1.5">
                  {AUDIENCE_METADATA.designations.map((des) => {
                    const isSel = selectedDesignations.includes(des);
                    return (
                      <button
                        key={des}
                        type="button"
                        onClick={() => toggleDesignation(des)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                          isSel
                            ? "bg-red-50 border-red-200 text-red-655"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {des}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Employee Targeting Box */}
              <div className="space-y-2 pt-3 border-t border-slate-50">
                <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-400 uppercase">
                  <span>Matched Agents ({filteredEmployees.length})</span>
                  {filteredEmployees.length > 0 && (
                    <button
                      type="button"
                      onClick={selectAllFilteredEmployees}
                      className="text-red-650 hover:underline"
                    >
                      {filteredEmployees.every(emp => selectedEmployees.includes(emp.id)) ? "Deselect All" : "Select All"}
                    </button>
                  )}
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                  {filteredEmployees.map((emp) => {
                    const isSel = selectedEmployees.includes(emp.id);
                    return (
                      <div
                        key={emp.id}
                        onClick={() => toggleEmployee(emp.id)}
                        className={`flex items-center justify-between p-2 rounded-lg text-[10px] font-semibold cursor-pointer transition-colors ${
                          isSel ? "bg-red-50 text-red-655" : "bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div>
                          <span className="font-extrabold block leading-tight">{emp.name}</span>
                          <span className="text-[8px] text-slate-450 block mt-0.5">{emp.designation} • {emp.showroom}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 accent-red-655"
                        />
                      </div>
                    );
                  })}

                  {filteredEmployees.length === 0 && (
                    <span className="text-[10px] text-slate-400 italic block py-4 text-center">
                      No active agents match the selected parameters.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stepper controls */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                onClick={handleBack}
                className="py-4 rounded-xl border-2 border-slate-250 bg-white text-slate-700 font-extrabold text-xs cursor-pointer hover:bg-slate-50 shadow-sm transition-all focus:outline-none"
              >
                Back to Title
              </button>
              <button
                onClick={handleNext}
                className="py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider border-0"
              >
                Continue to Builder
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: QUESTION BUILDER ───────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in-up">
            
            {/* Shuffling and distribution card */}
            <div className="auth-card p-5 bg-white space-y-4 text-left">
              <div>
                <h4 className="text-xs font-bold text-slate-850">Distribution Strategy</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Determine how questions are served to target agents.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShufflingLogic("ServeAll")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    shufflingLogic === "ServeAll"
                      ? "bg-red-50 border-red-200 text-red-655"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-[10px] font-extrabold block">Serve All</span>
                  <span className="text-[8px] text-slate-400 font-semibold block leading-tight pt-1">All compiled questions in default order.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShufflingLogic("ServeSubset")}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between h-20 ${
                    shufflingLogic === "ServeSubset"
                      ? "bg-red-50 border-red-200 text-red-655"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-[10px] font-extrabold block">Random Subset</span>
                  <span className="text-[8px] text-slate-400 font-semibold block leading-tight pt-1">Serve random subset from pool.</span>
                </button>
              </div>

              {shufflingLogic === "ServeSubset" && (
                <div className="animate-fade-in pt-2 border-t border-slate-50">
                  <label className="text-[9px] font-bold text-slate-400 block mb-1">Random Subset Size (Questions)</label>
                  <input
                    type="number"
                    min={1}
                    max={questions.length}
                    value={subsetSize}
                    onChange={(e) => setSubsetSize(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Questions Container List */}
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div key={q.id} className="auth-card p-5 bg-white space-y-4 border border-slate-150 relative">
                  
                  {/* Remove button at top corner */}
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(qIdx)}
                      className="absolute top-4 right-4 p-1 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 cursor-pointer border-0 bg-transparent"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}

                  <div className="text-left pr-6">
                    <span className="text-[9px] font-extrabold text-red-655 uppercase tracking-widest block">Question #{qIdx + 1}</span>
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => updateQuestion(qIdx, { title: e.target.value })}
                      placeholder="Input skills competency question title..."
                      className="w-full mt-1 pb-1 text-xs font-extrabold text-slate-850 border-b border-slate-200 focus:outline-none focus:border-red-400 bg-transparent placeholder-slate-300"
                    />
                  </div>

                  {/* Question Type Choice (MCQ, True/False, Blanks) */}
                  <div className="grid grid-cols-4 gap-1 text-[8.5px] font-extrabold">
                    {([
                      { type: "MCQ", label: "MCQ" },
                      { type: "TrueFalse", label: "T/F" },
                      { type: "FillInBlanks", label: "Blanks" },
                      { type: "ShortAnswer", label: "Short" },
                    ] as const).map((choice) => (
                      <button
                        key={choice.type}
                        type="button"
                        onClick={() => {
                          const updatedOpts = choice.type === "MCQ"
                            ? [
                                { id: `${q.id}-O1`, text: "", isCorrect: false },
                                { id: `${q.id}-O2`, text: "", isCorrect: false },
                              ]
                            : [];
                          updateQuestion(qIdx, {
                            type: choice.type,
                            options: updatedOpts,
                            correctAnswer: "",
                          });
                        }}
                        className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                          q.type === choice.type
                            ? "bg-slate-850 border-slate-850 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic inputs based on selected Answer type */}
                  {q.type === "MCQ" && (
                    <div className="space-y-2 pt-2 border-t border-slate-50 text-left">
                      <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
                        <span>Answer Choices</span>
                        <span>Is Correct</span>
                      </div>
                      
                      {q.options.map((opt, oIdx) => (
                        <div key={opt.id} className="flex items-center gap-3">
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => updateOptionText(qIdx, oIdx, e.target.value)}
                            placeholder={`Option #${oIdx + 1}`}
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/20 focus:outline-none"
                          />
                          <input
                            type="radio"
                            name={`correct-radio-${q.id}`}
                            checked={opt.isCorrect}
                            onChange={() => toggleOptionCorrect(qIdx, oIdx)}
                            className="w-4 h-4 cursor-pointer accent-red-650"
                          />
                        </div>
                      ))}

                      <button
                        onClick={() => addOption(qIdx)}
                        className="text-[10px] text-red-655 font-bold hover:underline cursor-pointer border-0 bg-transparent"
                      >
                        + Add Choice Option
                      </button>
                    </div>
                  )}

                  {q.type === "TrueFalse" && (
                    <div className="flex gap-3 pt-2 border-t border-slate-50">
                      {(["true", "false"] as const).map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => updateQuestion(qIdx, { correctAnswer: val })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            q.correctAnswer === val
                              ? "bg-red-50 border-red-200 text-red-655"
                              : "bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100"
                          }`}
                        >
                          {val === "true" ? "True" : "False"}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === "FillInBlanks" && (
                    <div className="pt-2 border-t border-slate-50 text-left">
                      <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Correct Missing Text Word</label>
                      <input
                        type="text"
                        value={q.correctAnswer}
                        onChange={(e) => updateQuestion(qIdx, { correctAnswer: e.target.value })}
                        placeholder="Type exact match answer word"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/20 focus:outline-none"
                      />
                    </div>
                  )}

                  {q.type === "ShortAnswer" && (
                    <div className="pt-2 border-t border-slate-50 text-left">
                      <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Correct Answer Guidelines / Key Phrases</label>
                      <textarea
                        rows={2}
                        value={q.correctAnswer}
                        onChange={(e) => updateQuestion(qIdx, { correctAnswer: e.target.value })}
                        placeholder="Input reference metrics/keywords for grading guidelines"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/20 focus:outline-none resize-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addQuestion}
              className="w-full py-3.5 border-2 border-dashed border-slate-200 hover:border-red-300 rounded-2xl text-xs font-bold text-slate-600 hover:text-red-655 bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              + Add Next Question Card
            </button>

            {/* Inline Navigation Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                onClick={handleBack}
                className="py-4 rounded-xl border-2 border-slate-250 bg-white text-slate-700 font-extrabold text-xs cursor-pointer hover:bg-slate-50 shadow-sm transition-all focus:outline-none block w-full text-center"
              >
                Back to Scope
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md uppercase tracking-wider block w-full text-center border-0"
              >
                {isSubmitting ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Publish Assessment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
