"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SCOPE_METADATA, AUDIENCE_METADATA, MOCK_TARGET_EMPLOYEES, assessmentApiService } from "../../../lib/api";
import { IAssessment, IQuestion, QuestionType, IAnswerOption } from "../../../types/assessment";

export default function CreateAssessmentPage() {
  const [viewMode, setViewMode] = useState<"list" | "wizard">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createdAssessments, setCreatedAssessments] = useState<IAssessment[]>([]);
  
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  // Filtered assessments list
  const filteredAssessments = createdAssessments.filter((asm) => {
    if (appliedDevice && asm.scope.device !== appliedDevice) return false;
    if (appliedBrand && asm.scope.brand !== appliedBrand) return false;
    if (appliedModels.length > 0) {
      const hasMatchingModel = asm.scope.models?.some((m) => appliedModels.includes(m));
      if (!hasMatchingModel) return false;
    }
    return true;
  });

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
      
      setViewMode("list");
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

  // ── DASHBOARD LIST VIEW ────────────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div className="auth-bg min-h-screen flex flex-col pb-24">
        {/* Simple Top Header without Creation button */}
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
                ? "bg-red-50 border-red-200 text-red-650"
                : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {appliedDevice ? "Filtered" : "Filter"}
          </button>
        </header>

        <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-4">
          
          {/* Quick Stats & Creation Trigger card directly on the page body */}
          <div className="auth-card p-5 bg-white space-y-4 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Assessment Status</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">Manage existing active showroom evaluations</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-center">
                <span className="text-xl font-black text-slate-800 block leading-none">{createdAssessments.length}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                handleResetStates();
                setViewMode("wizard");
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create New Assessment
            </button>
          </div>

          {/* Active Filter Indicators */}
          {appliedDevice && (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
              <div className="text-slate-600 font-semibold truncate">
                Active Filter: <span className="font-extrabold text-slate-850">{appliedDevice}</span>
                {appliedBrand && ` → ${appliedBrand}`}
                {appliedModels.length > 0 && ` (${appliedModels.length} Models)`}
              </div>
              <button
                onClick={clearFilters}
                className="text-red-600 hover:underline font-bold text-[10px] flex-shrink-0 ml-2"
              >
                Clear
              </button>
            </div>
          )}

          {/* Filtered Assessment List */}
          <div className="space-y-3.5">
            {filteredAssessments.map((asm) => {
              const scopeText = asm.scope.brand === "ALL" || !asm.scope.brand
                ? `${asm.scope.device} — All Brands`
                : `${asm.scope.device} — ${asm.scope.brand} (${asm.scope.models?.length || 0} Models)`;
              return (
                <div key={asm.id} className="auth-card p-5 bg-white space-y-4 border border-slate-100 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-600"></div>
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5 pr-6">
                      <span className="text-[8px] font-extrabold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded inline-block uppercase tracking-wider">
                        {scopeText}
                      </span>
                      <h3 className="text-xs font-extrabold text-slate-900 leading-snug" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                        {asm.title}
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 flex-shrink-0">
                      {asm.id}
                    </span>
                  </div>

                  {/* Created By & Metadata details */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 text-[10px] text-slate-500 font-medium">
                    <div className="flex justify-between items-center">
                      <span>Questions: <span className="font-extrabold text-slate-800">{asm.questions.length}</span></span>
                      <span>Time Limit: <span className="font-extrabold text-slate-800">{asm.hasTimeLimit ? `${asm.timeLimitMinutes} min` : "None"}</span></span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200/50 pt-1.5">
                      {/* Mocked Creator for Now - Ready for backend integration */}
                      <div>
                        <span className="text-[7px] text-slate-400 block uppercase font-bold tracking-wider">Created By</span>
                        <span className="text-slate-700 font-extrabold">Mustafizur Rahman (Branch Manager)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[7px] text-slate-400 block uppercase font-bold tracking-wider">Deadline</span>
                        <span className="font-extrabold text-slate-700">{new Date(asm.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(asm)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-650 hover:bg-slate-50 text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(asm.id!)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-650 hover:bg-red-50 text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredAssessments.length === 0 && (
              <div className="bg-white border border-slate-150 rounded-3xl p-12 text-center space-y-3">
                <span className="text-4xl block">🔍</span>
                <h3 className="text-sm font-extrabold text-slate-800" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>No Matching Assessments</h3>
                <p className="text-[11px] text-slate-400">
                  {appliedDevice
                    ? "Try resetting the search filters to display all active training parameters."
                    : "Get started by creating a new capability profile evaluation wizard."}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* ── SLIDING FILTER SIDE BAR ────────────────────────────────────── */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setIsFilterOpen(false)}
            ></div>
            
            {/* Slide-out Panel */}
            <div className="relative w-80 max-w-xs bg-white h-full shadow-2xl flex flex-col p-5 space-y-5 animate-slide-in-right">
              <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                <div>
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-wider">Search Filters</h3>
                  <p className="text-[9px] text-slate-400">Refine target scope list</p>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {/* Device Selector */}
                <div>
                  <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Category / Device</label>
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

                {/* Brand Selector (Conditional) */}
                {filterDevice && (
                  <div className="animate-fade-in">
                    <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Target Brand</label>
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

                {/* Models Chip Selector (Conditional) */}
                {filterDevice && filterBrand && filterModelsList.length > 0 && (
                  <div className="animate-fade-in space-y-1.5">
                    <label className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block">Target Models</label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {filterModelsList.map((m) => {
                        const isSel = filterModels.includes(m);
                        return (
                          <button
                            key={m}
                            onClick={() => toggleFilterModel(m)}
                            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                              isSel
                                ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
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

              {/* Sidebar Action Buttons */}
              <div className="space-y-2 border-t border-slate-150 pt-4 flex-shrink-0">
                <button
                  onClick={applyFilters}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
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

  // ── WIZARD FORM VIEW ───────────────────────────────────────────────────
  return (
    <div className="auth-bg min-h-screen flex flex-col pb-28">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm("Any unsaved work will be lost. Return to dashboard?")) {
                setViewMode("list");
              }
            }}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div>
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold leading-normal flex items-start gap-2.5">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── STEP 1: METADATA ────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="auth-card p-5 bg-white space-y-4">
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
            <div className="auth-card p-5 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Evaluation Time Limit</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Enforce a countdown timer during the exam.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasTimeLimit(!hasTimeLimit)}
                  className="w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer bg-slate-200"
                  style={{ backgroundColor: hasTimeLimit ? "#dc2626" : "#e2e8f0" }}
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
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md uppercase tracking-wider"
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
            <div className="auth-card p-5 bg-white space-y-4">
              <div>
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">1. Target Category / Device *</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-100"
                >
                  <option value="">Select Category...</option>
                  {SCOPE_METADATA.devices.map((dev) => (
                    <option key={dev} value={dev}>{dev}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">2. Target Brand (Optional)</label>
                  <span className="text-[8px] text-slate-400 font-bold uppercase bg-slate-50 border px-1.5 py-0.5 rounded">All-Brand Training Override</span>
                </div>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  disabled={!selectedDevice}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50"
                >
                  <option value="ALL">All Brands (General Category Assessment)</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selector chip grid */}
            {selectedBrand && selectedBrand !== "ALL" && selectedDevice && (
              <div className="auth-card p-5 bg-white space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-850 uppercase tracking-wider">3. Target Models (Optional)</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Select specific models, or leave empty to target all models under this brand.</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {availableModels.map((model) => {
                    const isSelected = selectedModels.includes(model);
                    return (
                      <button
                        key={model}
                        onClick={() => toggleModel(model)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                          isSelected
                            ? "bg-red-600 border-red-600 text-white shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {model}
                      </button>
                    );
                  })}
                  {availableModels.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No models configured for this selection.</span>
                  )}
                </div>
              </div>
            )}

            {/* ── Audience Targeting Card ─────────────────────────────── */}
            <div className="auth-card p-5 bg-white space-y-5">
              <div>
                <h4 className="text-xs font-extrabold text-slate-850 uppercase tracking-wider">2. Audience / Employee Targeting</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Filter by division, showroom, and designation to find target employees.</p>
              </div>

              {/* Divisions Multi-Select Chips */}
              <div className="space-y-2">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Select Divisions</label>
                <div className="flex flex-wrap gap-1.5">
                  {AUDIENCE_METADATA.divisions.map((div) => {
                    const isSelected = selectedDivisions.includes(div);
                    return (
                      <button
                        key={div}
                        type="button"
                        onClick={() => toggleDivision(div)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {div}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Showrooms Multi-Select Chips (Cascading) */}
              {selectedDivisions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-50 animate-fade-in">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Select Showrooms</label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {availableShowrooms.map((sr) => {
                      const isSelected = selectedShowrooms.includes(sr);
                      return (
                        <button
                          key={sr}
                          type="button"
                          onClick={() => toggleShowroom(sr)}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-red-50 border-red-200 text-red-700"
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

              {/* Designations Multi-Select Chips */}
              <div className="space-y-2 pt-2 border-t border-slate-50">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Select Designations</label>
                <div className="flex flex-wrap gap-1.5">
                  {AUDIENCE_METADATA.designations.map((des) => {
                    const isSelected = selectedDesignations.includes(des);
                    return (
                      <button
                        key={des}
                        type="button"
                        onClick={() => toggleDesignation(des)}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-800 border-slate-800 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
                        }`}
                      >
                        {des}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtered Employees Table / Checkbox List */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    Target Employees ({selectedEmployees.length} Selected)
                  </label>
                  {filteredEmployees.length > 0 && (
                    <button
                      type="button"
                      onClick={selectAllFilteredEmployees}
                      className="text-[9px] font-extrabold text-red-600 hover:text-red-700 uppercase tracking-wider bg-transparent border-0 cursor-pointer"
                    >
                      {filteredEmployees.every(emp => selectedEmployees.includes(emp.id))
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  )}
                </div>

                <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50/50 max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => {
                    const isChecked = selectedEmployees.includes(emp.id);
                    return (
                      <div
                        key={emp.id}
                        onClick={() => toggleEmployee(emp.id)}
                        className={`p-3 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                          isChecked ? "bg-red-50/20" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Checkbox indicator */}
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${
                            isChecked 
                              ? "bg-red-600 border-red-600 text-white" 
                              : "border-slate-300 bg-white"
                          }`}>
                            {isChecked && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 block truncate">{emp.name}</span>
                            <span className="text-[9px] text-slate-400 font-semibold block truncate mt-0.5">
                              {emp.showroom} • {emp.designation}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-white border border-slate-150 px-2 py-0.5 rounded-lg">
                          {emp.id}
                        </span>
                      </div>
                    );
                  })}
                  {filteredEmployees.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-450 italic">
                      No employees match the selected filters.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inline Navigation Buttons: Back has border & pops out, Next is Red */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                onClick={handleBack}
                className="py-4 rounded-xl border-2 border-slate-250 bg-white text-slate-700 font-extrabold text-xs cursor-pointer hover:bg-slate-50 shadow-sm transition-all focus:outline-none block w-full text-center"
              >
                Back to Details
              </button>
              <button
                onClick={handleNext}
                className="py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md uppercase tracking-wider block w-full text-center"
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
            {/* Shuffling parameters */}
            <div className="auth-card p-5 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-850">Quiz Pool Customization</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Shuffle logic and questions pool scope.</p>
                </div>
                <select
                  value={shufflingLogic}
                  onChange={(e) => setShufflingLogic(e.target.value as "ServeAll" | "ServeSubset")}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
                >
                  <option value="ServeAll">Serve All Questions</option>
                  <option value="ServeSubset">Serve Subset (Shuffled)</option>
                </select>
              </div>

              {shufflingLogic === "ServeSubset" && (
                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-medium animate-fade-in">
                  <span className="text-slate-500">Number of questions to serve:</span>
                  <input
                    type="number"
                    min={1}
                    max={questions.length}
                    value={subsetSize}
                    onChange={(e) => setSubsetSize(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 text-center font-bold text-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Active question list cards */}
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div key={q.id} className="auth-card p-5 bg-white space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-extrabold text-red-650 tracking-wider">Question #{qIdx + 1}</span>
                    {questions.length > 1 && (
                      <button
                        onClick={() => removeQuestion(qIdx)}
                        className="text-[10px] font-bold text-slate-400 hover:text-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Title input */}
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Question Prompt / Title</label>
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => updateQuestion(qIdx, { title: e.target.value })}
                      placeholder="e.g. Which button toggles AI screen optimization?"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-300 bg-slate-50/50"
                    />
                  </div>

                  {/* Media attachment simulator */}
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Supporting Media (optional)</label>
                    <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      {q.mediaUrl ? (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <span>📎 {q.mediaUrl}</span>
                          <button onClick={() => updateQuestion(qIdx, { mediaUrl: null })} className="text-red-500 hover:underline">Clear</button>
                        </div>
                      ) : (
                        <>
                          <span>Standard Media Upload (PDF, JPG)</span>
                          <button
                            onClick={() => handleMediaUpload(qIdx, `Diagram_Q${qIdx + 1}.png`)}
                            className="bg-white px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold"
                          >
                            Attach Mock
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Answer Type selection */}
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase block mb-1">Answer Pattern</label>
                    <select
                      value={q.type}
                      onChange={(e) => {
                        const newType = e.target.value as QuestionType;
                        let defaultOpts: IAnswerOption[] = [];
                        let defaultAns = "";
                        if (newType === "MCQ") {
                          defaultOpts = [
                            { id: `${q.id}-O1`, text: "", isCorrect: false },
                            { id: `${q.id}-O2`, text: "", isCorrect: false },
                          ];
                        } else if (newType === "TrueFalse") {
                          defaultAns = "true";
                        }
                        updateQuestion(qIdx, { type: newType, options: defaultOpts, correctAnswer: defaultAns });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-855 bg-slate-50 focus:outline-none"
                    >
                      <option value="MCQ">Multiple Choice Question (MCQ)</option>
                      <option value="TrueFalse">True / False</option>
                      <option value="FillInBlanks">Fill in Blanks</option>
                      <option value="ShortAnswer">Short Answer Guideline</option>
                    </select>
                  </div>

                  {/* Dynamic inputs based on selected Answer type */}
                  {q.type === "MCQ" && (
                    <div className="space-y-2 pt-2 border-t border-slate-50">
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
                        className="text-[10px] text-red-650 font-bold hover:underline"
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
                          onClick={() => updateQuestion(qIdx, { correctAnswer: val })}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            q.correctAnswer === val
                              ? "bg-red-50 border-red-200 text-red-600"
                              : "bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100"
                          }`}
                        >
                          {val === "true" ? "True" : "False"}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === "FillInBlanks" && (
                    <div className="pt-2 border-t border-slate-50">
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
                    <div className="pt-2 border-t border-slate-50">
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
              className="w-full py-3.5 border-2 border-dashed border-slate-200 hover:border-red-300 rounded-2xl text-xs font-bold text-slate-600 hover:text-red-650 bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              + Add Next Question Card
            </button>

            {/* Inline Navigation Buttons: Back has border & pops out, Publish is Red */}
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
                className="py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md uppercase tracking-wider block w-full text-center"
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
