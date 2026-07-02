"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SCOPE_METADATA, assessmentApiService } from "../../../lib/api";
import { IAssessment, IQuestion, QuestionType, IAnswerOption } from "../../../types/assessment";

export default function CreateAssessmentPage() {
  const router = useRouter();
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

  // Update brand list when device changes
  useEffect(() => {
    if (selectedDevice) {
      setAvailableBrands(SCOPE_METADATA.brands[selectedDevice] || []);
    } else {
      setAvailableBrands([]);
    }
    setSelectedBrand("");
    setSelectedModels([]);
  }, [selectedDevice]);

  // Update model list when brand changes
  useEffect(() => {
    if (selectedDevice && selectedBrand) {
      const brandData = SCOPE_METADATA.models[selectedBrand];
      const modelData = brandData ? brandData[selectedDevice as keyof typeof brandData] : [];
      setAvailableModels(modelData || []);
    } else {
      setAvailableModels([]);
    }
    setSelectedModels([]);
  }, [selectedBrand, selectedDevice]);

  // Toggle model selection
  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

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

  // Add a new question card
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

  // Delete question card
  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Update question properties
  const updateQuestion = (index: number, updated: Partial<IQuestion>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updated } : q))
    );
  };

  // MCQ specific handlers
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

  // Handle mock file attachment
  const handleMediaUpload = (qIdx: number, fileName: string) => {
    updateQuestion(qIdx, { mediaUrl: fileName });
  };

  // ── Validation & Wizard Progress ──────────────────────────────────────
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
      if (!selectedDevice || !selectedBrand) {
        setErrorMsg("Device and Brand targeting criteria are required.");
        return false;
      }
      if (selectedModels.length === 0) {
        setErrorMsg("Please select at least one Target Model.");
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
          brand: selectedBrand,
          models: selectedModels,
        },
        questions,
        pool: {
          shufflingLogic,
          subsetSize: shufflingLogic === "ServeSubset" ? subsetSize : questions.length,
        },
      };

      await assessmentApiService.create(finalAssessment);
      // Success redirection
      router.push("/employee/profile");
    } catch (err) {
      setErrorMsg("Failed to upload assessment profile. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex flex-col pb-24">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/employee/profile" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
              Assessment Creator
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
        {/* Error message alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-bold leading-normal flex items-start gap-2.5">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ── STEP 1: METADATA DESIGN ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
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
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                    hasTimeLimit ? "bg-red-600" : "bg-slate-200"
                  }`}
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
          </div>
        )}

        {/* ── STEP 2: SCOPE TARGETING DESIGN ──────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="auth-card p-5 bg-white space-y-4">
              <div>
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">1. Target Category / Device</label>
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
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1.5">2. Target Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  disabled={!selectedDevice}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-100 disabled:opacity-50"
                >
                  <option value="">Select Brand...</option>
                  {availableBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selector chip grid */}
            {selectedBrand && selectedDevice && (
              <div className="auth-card p-5 bg-white space-y-3">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-850 uppercase tracking-wider">3. Target Models</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Select models this assessment applies to.</p>
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
          </div>
        )}

        {/* ── STEP 3: QUESTION BUILDER DESIGN ────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-4">
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-850 bg-slate-50 focus:outline-none"
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
                              : "bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100"
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
          </div>
        )}
      </main>

      {/* Step navigation controls bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 px-4 py-3.5 flex items-center justify-between md:max-w-md md:mx-auto md:rounded-t-2xl shadow-xl">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-xs cursor-pointer transition-colors"
          >
            Back Step
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors flex items-center gap-1"
          >
            Continue
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
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
        )}
      </footer>
    </div>
  );
}
