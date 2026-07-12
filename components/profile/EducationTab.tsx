"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface SSCHSCDetails {
  institution: string;
  division: string;
  group: string;
  yearPassed: string;
  gpa: string;
}

interface DiplomaDetails {
  institution: string;
  yearPassed: string;
  cgpa: string;
}

interface GraduateDetails {
  institution: string;
  passedYear: string;
  degree: string;
  result: string;
  achievement: string;
  achievementFile: string | null;
}

interface PostGraduateDetails {
  institution: string;
  passedYear: string;
  degree: string;
  result: string;
  achievement: string;
  achievementFile: string | null;
}

interface EducationTabProps {
  educationSSC: SSCHSCDetails;
  setEducationSSC: (val: SSCHSCDetails) => void;
  educationHSC: SSCHSCDetails;
  setEducationHSC: (val: SSCHSCDetails) => void;
  educationDiploma: DiplomaDetails;
  setEducationDiploma: (val: DiplomaDetails) => void;
  educationGraduate: GraduateDetails;
  setEducationGraduate: (val: GraduateDetails) => void;
  educationPostGraduate: PostGraduateDetails;
  setEducationPostGraduate: (val: PostGraduateDetails) => void;
  onSave: (updatedData: any) => Promise<boolean>;
  readOnly?: boolean;
}

export default function EducationTab({
  educationSSC,
  setEducationSSC,
  educationHSC,
  setEducationHSC,
  educationDiploma,
  setEducationDiploma,
  educationGraduate,
  setEducationGraduate,
  educationPostGraduate,
  setEducationPostGraduate,
  onSave,
  readOnly,
}: EducationTabProps) {
  const [isEduEditModalOpen, setIsEduEditModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [tempSSC, setTempSSC] = useState<SSCHSCDetails>({ ...educationSSC });
  const [tempHSC, setTempHSC] = useState<SSCHSCDetails>({ ...educationHSC });
  const [tempDiploma, setTempDiploma] = useState<DiplomaDetails>({ ...educationDiploma });
  const [tempGraduate, setTempGraduate] = useState<GraduateDetails>({ ...educationGraduate });
  const [tempPostGraduate, setTempPostGraduate] = useState<PostGraduateDetails>({ ...educationPostGraduate });
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, level: "grad" | "postgrad") => {
    const file = e.target.files?.[0];
    if (file) {
      if (level === "grad") {
        setTempGraduate({ ...tempGraduate, achievementFile: file.name });
      } else {
        setTempPostGraduate({ ...tempPostGraduate, achievementFile: file.name });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden inputs self-contained */}
      <input type="file" id="file-grad-ach" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleFileChange(e, "grad")} />
      <input type="file" id="file-postgrad-ach" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleFileChange(e, "postgrad")} />

      <div className="auth-card p-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5 mb-4">
          {!readOnly && (
            <button
              onClick={() => {
                setTempSSC({ ...educationSSC });
                setTempHSC({ ...educationHSC });
                setTempDiploma({ ...educationDiploma });
                setTempGraduate({ ...educationGraduate });
                setTempPostGraduate({ ...educationPostGraduate });
                setValidationError(null);
                setIsEduEditModalOpen(true);
              }}
              className="p-1.5 hover:bg-slate-100 rounded text-red-600 transition-all cursor-pointer"
              title="Edit education details"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          )}
          <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Education Background
          </h3>
        </div>

        <div className="space-y-6">
          {/* SSC Section */}
          {educationSSC.institution && (
            <div className="relative pl-6 border-l-2 border-red-100 space-y-1">
              <span className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center"></span>
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-850">Secondary School Certificate (SSC)</h4>
                <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold">GPA {educationSSC.gpa}/5.00</span>
              </div>
              <p className="text-[11px] text-slate-655 font-semibold">{educationSSC.institution}</p>
              <p className="text-[10px] text-slate-400">
                Board/Division: {educationSSC.division} • Group: {educationSSC.group} • Passed: {educationSSC.yearPassed}
              </p>
            </div>
          )}

          {/* HSC Section */}
          {educationHSC.institution && (
            <div className="relative pl-6 border-l-2 border-red-100 space-y-1">
              <span className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center"></span>
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-850">Higher Secondary Certificate (HSC)</h4>
                <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold">GPA {educationHSC.gpa}/5.00</span>
              </div>
              <p className="text-[11px] text-slate-655 font-semibold">{educationHSC.institution}</p>
              <p className="text-[10px] text-slate-400">
                Board/Division: {educationHSC.division} • Group: {educationHSC.group} • Passed: {educationHSC.yearPassed}
              </p>
            </div>
          )}

          {/* Diploma Section (Optional) */}
          {educationDiploma.institution && (
            <div className="relative pl-6 border-l-2 border-red-100 space-y-1">
              <span className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center"></span>
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-850">Diploma Education</h4>
                <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold">CGPA {educationDiploma.cgpa}</span>
              </div>
              <p className="text-[11px] text-slate-655 font-semibold">{educationDiploma.institution}</p>
              <p className="text-[10px] text-slate-400">Passed Year: {educationDiploma.yearPassed}</p>
            </div>
          )}

          {/* Graduate Section */}
          {educationGraduate.institution && (
            <div className="relative pl-6 border-l-2 border-red-100 space-y-1.5">
              <span className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center"></span>
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-850">Graduation ({educationGraduate.degree})</h4>
                <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold">{educationGraduate.result}</span>
              </div>
              <p className="text-[11px] text-slate-655 font-semibold">{educationGraduate.institution}</p>
              <p className="text-[10px] text-slate-400">Passed Year: {educationGraduate.passedYear}</p>
              
              {/* Achievements */}
              {educationGraduate.achievement && (
                <div className="mt-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Academic Achievement</span>
                  <p className="text-[10px] text-slate-600 italic leading-relaxed">&ldquo;{educationGraduate.achievement}&rdquo;</p>
                  {educationGraduate.achievementFile && (
                    <div className="flex items-center gap-1.5 text-[9px] text-red-600 font-bold mt-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <span className="underline truncate max-w-[180px]">{educationGraduate.achievementFile}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Post Graduate Section (Optional) */}
          {educationPostGraduate.institution ? (
            <div className="relative pl-6 border-l-2 border-red-100 space-y-1.5">
              <span className="absolute -left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm flex items-center justify-center"></span>
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-extrabold text-slate-850">Post Graduation ({educationPostGraduate.degree})</h4>
                <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-bold">{educationPostGraduate.result}</span>
              </div>
              <p className="text-[11px] text-slate-655 font-semibold">{educationPostGraduate.institution}</p>
              <p className="text-[10px] text-slate-400">Passed Year: {educationPostGraduate.passedYear}</p>
              
              {educationPostGraduate.achievement && (
                <div className="mt-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Academic Achievement</span>
                  <p className="text-[10px] text-slate-600 italic leading-relaxed">&ldquo;{educationPostGraduate.achievement}&rdquo;</p>
                  {educationPostGraduate.achievementFile && (
                    <div className="flex items-center gap-1.5 text-[9px] text-red-600 font-bold mt-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <span className="underline truncate max-w-[180px]">{educationPostGraduate.achievementFile}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs py-4 border border-dashed border-slate-150 rounded-xl">
              Optional post-graduate profile is currently empty.
            </div>
          )}
        </div>
      </div>

      {/* Education Edit Modal */}
      {isMounted && isEduEditModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full my-8 p-5 shadow-2xl border border-slate-100 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto scrollbar-none animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Edit Education Background
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Configure your educational details across the 5 standard levels.</p>
            </div>

            {validationError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-red-800 text-[11px] font-semibold flex items-center gap-2">
                <svg className="text-red-500 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {validationError}
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              setValidationError(null);

              // 1. Completeness Validation
              const sscFields = [tempSSC.institution, tempSSC.division, tempSSC.group, tempSSC.yearPassed, tempSSC.gpa];
              const sscFilledCount = sscFields.filter(f => !!f?.trim()).length;
              const sscIsStarted = sscFilledCount > 0;
              const sscIsComplete = sscFilledCount === sscFields.length;
              if (sscIsStarted && !sscIsComplete) {
                setValidationError("SSC section is incomplete. Please fill Institution, Board, Group, Passed Year, and GPA.");
                return;
              }

              const hscFields = [tempHSC.institution, tempHSC.division, tempHSC.group, tempHSC.yearPassed, tempHSC.gpa];
              const hscFilledCount = hscFields.filter(f => !!f?.trim()).length;
              const hscIsStarted = hscFilledCount > 0;
              const hscIsComplete = hscFilledCount === hscFields.length;
              if (hscIsStarted && !hscIsComplete) {
                setValidationError("HSC section is incomplete. Please fill Institution, Board, Group, Passed Year, and GPA.");
                return;
              }

              const diplomaFields = [tempDiploma.institution, tempDiploma.yearPassed, tempDiploma.cgpa];
              const diplomaIsStarted = diplomaFields.some(f => !!f?.trim());
              const diplomaIsComplete = !!tempDiploma.institution?.trim();
              if (diplomaIsStarted && !diplomaIsComplete) {
                setValidationError("Diploma section requires at least the Institution to be filled.");
                return;
              }

              const gradFields = [tempGraduate.institution, tempGraduate.degree, tempGraduate.passedYear, tempGraduate.result, tempGraduate.achievement, tempGraduate.achievementFile];
              const gradIsStarted = gradFields.some(f => !!f?.trim());
              const gradIsComplete = !!tempGraduate.institution?.trim() && !!tempGraduate.degree?.trim();
              if (gradIsStarted && !gradIsComplete) {
                setValidationError("Graduate section requires at least the Institution and Degree to be filled.");
                return;
              }

              const postGradFields = [tempPostGraduate.institution, tempPostGraduate.degree, tempPostGraduate.passedYear, tempPostGraduate.result, tempPostGraduate.achievement, tempPostGraduate.achievementFile];
              const postGradIsStarted = postGradFields.some(f => !!f?.trim());
              const postGradIsComplete = !!tempPostGraduate.institution?.trim() && !!tempPostGraduate.degree?.trim();
              if (postGradIsStarted && !postGradIsComplete) {
                setValidationError("Post Graduate section requires at least the Institution and Degree to be filled.");
                return;
              }

              // 2. Order/Sequence Validation (SSC < HSC < Diploma <= Graduate < Post Graduate)
              if (hscIsStarted && !sscIsComplete) {
                setValidationError("You must complete the SSC section before filling the HSC section.");
                return;
              }
              if (diplomaIsStarted && !hscIsComplete) {
                setValidationError("You must complete the HSC section before filling the Diploma section.");
                return;
              }
              if (gradIsStarted && !hscIsComplete) {
                setValidationError("You must complete the HSC section before filling the Graduate section.");
                return;
              }
              if (postGradIsStarted && !gradIsComplete) {
                setValidationError("You must complete the Graduate section before filling the Post Graduate section.");
                return;
              }

              // 3. Chronological Passing Year Validation
              const getYear = (y?: string) => {
                if (!y) return null;
                const parsed = parseInt(y.trim(), 10);
                return isNaN(parsed) ? null : parsed;
              };

              const sscYear = getYear(tempSSC.yearPassed);
              const hscYear = getYear(tempHSC.yearPassed);
              const diplomaYear = getYear(tempDiploma.yearPassed);
              const gradYear = getYear(tempGraduate.passedYear);
              const postGradYear = getYear(tempPostGraduate.passedYear);

              if (sscYear !== null && hscYear !== null && hscYear < sscYear) {
                setValidationError(`HSC passing year (${hscYear}) cannot be less than SSC passing year (${sscYear}).`);
                return;
              }
              if (hscYear !== null && diplomaYear !== null && diplomaYear < hscYear) {
                setValidationError(`Diploma passing year (${diplomaYear}) cannot be less than HSC passing year (${hscYear}).`);
                return;
              }
              if (hscYear !== null && gradYear !== null && gradYear < hscYear) {
                setValidationError(`Graduate passing year (${gradYear}) cannot be less than HSC passing year (${hscYear}).`);
                return;
              }
              if (gradYear !== null && postGradYear !== null && postGradYear < gradYear) {
                setValidationError(`Post Graduate passing year (${postGradYear}) cannot be less than Graduate passing year (${gradYear}).`);
                return;
              }

              const success = await onSave({
                educationSSC: tempSSC,
                educationHSC: tempHSC,
                educationDiploma: tempDiploma,
                educationGraduate: tempGraduate,
                educationPostGraduate: tempPostGraduate
              });
              if (success) {
                setIsEduEditModalOpen(false);
              } else {
                alert("Failed to save education details. Please try again.");
              }
            }} className="space-y-5 text-xs">

              {/* SSC Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Secondary School Certificate (SSC)</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempSSC.institution || ""} onChange={(e) => setTempSSC({ ...tempSSC, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Board/Division</label>
                    <select
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs"
                      value={tempSSC.division || ""}
                      onChange={(e) => setTempSSC({ ...tempSSC, division: e.target.value })}
                    >
                      <option value="">Select Division</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Mymensingh">Mymensingh</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Sylhet">Sylhet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Group</label>
                    <select
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs"
                      value={tempSSC.group || ""}
                      onChange={(e) => setTempSSC({ ...tempSSC, group: e.target.value })}
                    >
                      <option value="">Select Group</option>
                      <option value="Science">Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passed Year</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempSSC.yearPassed || ""} onChange={(e) => setTempSSC({ ...tempSSC, yearPassed: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">GPA (Out of 5)</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempSSC.gpa || ""} onChange={(e) => setTempSSC({ ...tempSSC, gpa: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* HSC Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Higher Secondary Certificate (HSC)</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempHSC.institution || ""} onChange={(e) => setTempHSC({ ...tempHSC, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Board/Division</label>
                    <select
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs"
                      value={tempHSC.division || ""}
                      onChange={(e) => setTempHSC({ ...tempHSC, division: e.target.value })}
                    >
                      <option value="">Select Division</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Mymensingh">Mymensingh</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Sylhet">Sylhet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Group</label>
                    <select
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs"
                      value={tempHSC.group || ""}
                      onChange={(e) => setTempHSC({ ...tempHSC, group: e.target.value })}
                    >
                      <option value="">Select Group</option>
                      <option value="Science">Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passed Year</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempHSC.yearPassed || ""} onChange={(e) => setTempHSC({ ...tempHSC, yearPassed: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">GPA (Out of 5)</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempHSC.gpa || ""} onChange={(e) => setTempHSC({ ...tempHSC, gpa: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Diploma Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Diploma</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" placeholder="e.g. Dhaka Polytechnic Institute" value={tempDiploma.institution || ""} onChange={(e) => setTempDiploma({ ...tempDiploma, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passed Year</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempDiploma.yearPassed || ""} onChange={(e) => setTempDiploma({ ...tempDiploma, yearPassed: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">CGPA</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempDiploma.cgpa || ""} onChange={(e) => setTempDiploma({ ...tempDiploma, cgpa: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Graduate Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Graduate</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempGraduate.institution || ""} onChange={(e) => setTempGraduate({ ...tempGraduate, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-slate-600 mb-0.5">Degree</label>
                    <select
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs"
                      value={tempGraduate.degree || ""}
                      onChange={(e) => setTempGraduate({ ...tempGraduate, degree: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="BSc">BSc</option>
                      <option value="BBA">BBA</option>
                      <option value="BA">BA</option>
                      <option value="BSS">BSS</option>
                      <option value="BCom">BCom</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passed Year</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempGraduate.passedYear || ""} onChange={(e) => setTempGraduate({ ...tempGraduate, passedYear: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">CGPA / Result</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempGraduate.result || ""} onChange={(e) => setTempGraduate({ ...tempGraduate, result: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Achievement Notes</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" placeholder="Awards or special honors" value={tempGraduate.achievement || ""} onChange={(e) => setTempGraduate({ ...tempGraduate, achievement: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Achievement File (PDF/Image)</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById("file-grad-ach")?.click()}
                      className="flex-1 py-1 px-2 bg-white border border-slate-200 rounded text-slate-655 hover:bg-slate-100 text-center font-bold"
                    >
                      {tempGraduate.achievementFile ? "Change File" : "Upload File"}
                    </button>
                    {tempGraduate.achievementFile && (
                      <span className="text-[9px] text-slate-400 truncate max-w-[120px] self-center">
                        {tempGraduate.achievementFile}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Graduate Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Post Graduate</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" placeholder="e.g. North South University" value={tempPostGraduate.institution || ""} onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-slate-600 mb-0.5">Degree</label>
                    <select
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs"
                      value={tempPostGraduate.degree || ""}
                      onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, degree: e.target.value })}
                    >
                      <option value="">Select</option>
                      <option value="MSc">MSc</option>
                      <option value="MBA">MBA</option>
                      <option value="MA">MA</option>
                      <option value="MSS">MSS</option>
                      <option value="MCom">MCom</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passed Year</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempPostGraduate.passedYear || ""} onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, passedYear: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">CGPA / Result</label>
                    <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" value={tempPostGraduate.result || ""} onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, result: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Achievement Notes</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-xs" placeholder="Thesis awards, honors, etc." value={tempPostGraduate.achievement || ""} onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, achievement: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Achievement File (PDF/Image)</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById("file-postgrad-ach")?.click()}
                      className="flex-1 py-1 px-2 bg-white border border-slate-200 rounded text-slate-655 hover:bg-slate-100 text-center font-bold"
                    >
                      {tempPostGraduate.achievementFile ? "Change File" : "Upload File"}
                    </button>
                    {tempPostGraduate.achievementFile && (
                      <span className="text-[9px] text-slate-400 truncate max-w-[120px] self-center">
                        {tempPostGraduate.achievementFile}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEduEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                >
                  Save Education
                </button>
              </div>

            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
