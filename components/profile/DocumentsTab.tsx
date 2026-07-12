"use client";

import { useState } from "react";

interface DocumentsTabProps {
  docResume: string | null;
  setDocResume: (val: string | null) => void;
  docNidEmpFront: string | null;
  setDocNidEmpFront: (val: string | null) => void;
  docNidEmpBack: string | null;
  setDocNidEmpBack: (val: string | null) => void;
  docNidNomFront: string | null;
  setDocNidNomFront: (val: string | null) => void;
  docNidNomBack: string | null;
  setDocNidNomBack: (val: string | null) => void;
  docCovid: string | null;
  setDocCovid: (val: string | null) => void;
  docRelease: string | null;
  setDocRelease: (val: string | null) => void;
  docPayslip: string | null;
  setDocPayslip: (val: string | null) => void;
  docTax: string | null;
  setDocTax: (val: string | null) => void;
  onSave: (updatedData: any) => Promise<boolean>;
  readOnly?: boolean;
}

export default function DocumentsTab({
  docResume,
  setDocResume,
  docNidEmpFront,
  setDocNidEmpFront,
  docNidEmpBack,
  setDocNidEmpBack,
  docNidNomFront,
  setDocNidNomFront,
  docNidNomBack,
  setDocNidNomBack,
  docCovid,
  setDocCovid,
  docRelease,
  setDocRelease,
  docPayslip,
  setDocPayslip,
  docTax,
  setDocTax,
  onSave,
  readOnly,
}: DocumentsTabProps) {

  const handleLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const payloadDocs = {
        resume: key === "resume" ? file.name : docResume,
        nidEmpFront: key === "nidEmpFront" ? file.name : docNidEmpFront,
        nidEmpBack: key === "nidEmpBack" ? file.name : docNidEmpBack,
        nidNomFront: key === "nidNomFront" ? file.name : docNidNomFront,
        nidNomBack: key === "nidNomBack" ? file.name : docNidNomBack,
        covid: key === "covid" ? file.name : docCovid,
        release: key === "release" ? file.name : docRelease,
        payslip: key === "payslip" ? file.name : docPayslip,
        tax: key === "tax" ? file.name : docTax
      };

      const success = await onSave({ documents: payloadDocs });
      if (success) {
        if (key === "resume") setDocResume(file.name);
        else if (key === "nidEmpFront") setDocNidEmpFront(file.name);
        else if (key === "nidEmpBack") setDocNidEmpBack(file.name);
        else if (key === "nidNomFront") setDocNidNomFront(file.name);
        else if (key === "nidNomBack") setDocNidNomBack(file.name);
        else if (key === "covid") setDocCovid(file.name);
        else if (key === "release") setDocRelease(file.name);
        else if (key === "payslip") setDocPayslip(file.name);
        else if (key === "tax") setDocTax(file.name);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs for Document Tab */}
      <input type="file" id="file-resume" accept="application/pdf" className="hidden" onChange={(e) => handleLocalUpload(e, "resume")} />
      <input type="file" id="file-nid-emp-front" accept="image/*" className="hidden" onChange={(e) => handleLocalUpload(e, "nidEmpFront")} />
      <input type="file" id="file-nid-emp-back" accept="image/*" className="hidden" onChange={(e) => handleLocalUpload(e, "nidEmpBack")} />
      <input type="file" id="file-nid-nom-front" accept="image/*" className="hidden" onChange={(e) => handleLocalUpload(e, "nidNomFront")} />
      <input type="file" id="file-nid-nom-back" accept="image/*" className="hidden" onChange={(e) => handleLocalUpload(e, "nidNomBack")} />
      <input type="file" id="file-covid" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleLocalUpload(e, "covid")} />
      <input type="file" id="file-release" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleLocalUpload(e, "release")} />
      <input type="file" id="file-payslip" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleLocalUpload(e, "payslip")} />
      <input type="file" id="file-tax" accept="application/pdf" className="hidden" onChange={(e) => handleLocalUpload(e, "tax")} />

      {/* Required Documents List */}
      <div className="auth-card p-5 space-y-5">
        <div className="border-b border-slate-100 pb-2.5">
          <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
            Required Documents
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Please upload required files. PDF/image rules apply.</p>
        </div>

        <div className="space-y-4">
          
          {/* 1. Resume/CV */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                docResume ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              }`}>
                {docResume ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Resume / CV</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                  {docResume ? docResume : "Format: PDF only"}
                </div>
              </div>
            </div>
            {!readOnly ? (
              <button
                onClick={() => document.getElementById("file-resume")?.click()}
                className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  docResume ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                }`}
              >
                {docResume ? "Change" : "Upload PDF"}
              </button>
            ) : (
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded border ${
                docResume ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
              }`}>
                {docResume ? "Uploaded" : "Not Uploaded"}
              </span>
            )}
          </div>

          {/* 2. Employee NID */}
          <div className="border-b border-slate-50 pb-3.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                docNidEmpFront && docNidEmpBack ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              }`}>
                {docNidEmpFront && docNidEmpBack ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="M14 13h4M14 17h4" />
                  </svg>
                )}
              </div>
              <div className="text-xs font-bold text-slate-850">Employee NID Card</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pl-9">
              <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Front Side</span>
                <span className="text-[9px] text-slate-400 block truncate mb-1">
                  {docNidEmpFront ? docNidEmpFront : "Image required"}
                </span>
                {!readOnly ? (
                  <button
                    onClick={() => document.getElementById("file-nid-emp-front")?.click()}
                    className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-650 hover:bg-slate-100 cursor-pointer"
                  >
                    {docNidEmpFront ? "Replace" : "Upload"}
                  </button>
                ) : (
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                    docNidEmpFront ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
                  }`}>
                    {docNidEmpFront ? "Uploaded" : "Not Uploaded"}
                  </span>
                )}
              </div>
              <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Back Side</span>
                <span className="text-[9px] text-slate-400 block truncate mb-1">
                  {docNidEmpBack ? docNidEmpBack : "Image required"}
                </span>
                {!readOnly ? (
                  <button
                    onClick={() => document.getElementById("file-nid-emp-back")?.click()}
                    className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-650 hover:bg-slate-100 cursor-pointer"
                  >
                    {docNidEmpBack ? "Replace" : "Upload"}
                  </button>
                ) : (
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                    docNidEmpBack ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
                  }`}>
                    {docNidEmpBack ? "Uploaded" : "Not Uploaded"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3. Nominee NID */}
          <div className="border-b border-slate-50 pb-3.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                docNidNomFront && docNidNomBack ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              }`}>
                {docNidNomFront && docNidNomBack ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )}
              </div>
              <div className="text-xs font-bold text-slate-850">Nominee NID Card</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pl-9">
              <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Front Side</span>
                <span className="text-[9px] text-slate-400 block truncate mb-1">
                  {docNidNomFront ? docNidNomFront : "Image required"}
                </span>
                {!readOnly ? (
                  <button
                    onClick={() => document.getElementById("file-nid-nom-front")?.click()}
                    className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-650 hover:bg-slate-100 cursor-pointer"
                  >
                    {docNidNomFront ? "Replace" : "Upload"}
                  </button>
                ) : (
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                    docNidNomFront ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
                  }`}>
                    {docNidNomFront ? "Uploaded" : "Not Uploaded"}
                  </span>
                )}
              </div>
              <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-600 block mb-1">Back Side</span>
                <span className="text-[9px] text-slate-400 block truncate mb-1">
                  {docNidNomBack ? docNidNomBack : "Image required"}
                </span>
                {!readOnly ? (
                  <button
                    onClick={() => document.getElementById("file-nid-nom-back")?.click()}
                    className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-650 hover:bg-slate-100 cursor-pointer"
                  >
                    {docNidNomBack ? "Replace" : "Upload"}
                  </button>
                ) : (
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                    docNidNomBack ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
                  }`}>
                    {docNidNomBack ? "Uploaded" : "Not Uploaded"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 4. Covid Vaccination Certificate */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                docCovid ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              }`}>
                {docCovid ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Covid-19 Certificate</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                  {docCovid ? docCovid : "PDF or Image"}
                </div>
              </div>
            </div>
            {!readOnly ? (
              <button
                onClick={() => document.getElementById("file-covid")?.click()}
                className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  docCovid ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                }`}
              >
                {docCovid ? "Change" : "Upload File"}
              </button>
            ) : (
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded border ${
                docCovid ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
              }`}>
                {docCovid ? "Uploaded" : "Not Uploaded"}
              </span>
            )}
          </div>

          {/* 5. Release Letter */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                docRelease ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              }`}>
                {docRelease ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Release Letter (if any)</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                  {docRelease ? docRelease : "Previous employer release PDF/pic"}
                </div>
              </div>
            </div>
            {!readOnly ? (
              <button
                onClick={() => document.getElementById("file-release")?.click()}
                className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  docRelease ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                }`}
              >
                {docRelease ? "Change" : "Upload File"}
              </button>
            ) : (
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded border ${
                docRelease ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
              }`}>
                {docRelease ? "Uploaded" : "Not Uploaded"}
              </span>
            )}
          </div>

          {/* 6. Payslip / Salary Certificate */}
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                docPayslip ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              }`}>
                {docPayslip ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Payslip / Salary Certificate</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                  {docPayslip ? docPayslip : "PDF or Image file"}
                </div>
              </div>
            </div>
            {!readOnly ? (
              <button
                onClick={() => document.getElementById("file-payslip")?.click()}
                className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  docPayslip ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                }`}
              >
                {docPayslip ? "Change" : "Upload File"}
              </button>
            ) : (
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded border ${
                docPayslip ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
              }`}>
                {docPayslip ? "Uploaded" : "Not Uploaded"}
              </span>
            )}
          </div>

          {/* 7. E-TIN & Tax Return */}
          <div className="flex items-center justify-between border-slate-50 pb-1">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                docTax ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"
              }`}>
                {docTax ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">E-TIN & Tax Return Copy</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                  {docTax ? docTax : "Format: PDF only"}
                </div>
              </div>
            </div>
            {!readOnly ? (
              <button
                onClick={() => document.getElementById("file-tax")?.click()}
                className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  docTax ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                }`}
              >
                {docTax ? "Change" : "Upload PDF"}
              </button>
            ) : (
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded border ${
                docTax ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-200"
              }`}>
                {docTax ? "Uploaded" : "Not Uploaded"}
              </span>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
