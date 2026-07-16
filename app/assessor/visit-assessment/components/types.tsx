import React from "react";

export const CRITERIA = [
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

export type ScoreMap = Record<string, number>;
export type RemarkMap = Record<string, string>;

export interface IPastAssessment {
  id: string;
  employeeProfileId: number;
  employeeId: string;
  employeeName: string;
  designation: string;
  showroom: string;
  division: string;
  gradeGroup: string;
  date: string;
  score: number;
  scores: ScoreMap;
  remarks: RemarkMap;
}

export function getRatingConfig(score: number) {
  if (score >= 9.0) return { label: "Excellent Performance", color: "text-emerald-600", bar: "#10b981", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
  if (score >= 7.5) return { label: "Good Competency", color: "text-blue-600", bar: "#3b82f6", bg: "bg-blue-50 text-blue-800 border-blue-200" };
  if (score >= 5.0) return { label: "Satisfactory Level", color: "text-amber-600", bar: "#f59e0b", bg: "bg-amber-50 text-amber-800 border-amber-200" };
  if (score >= 3.0) return { label: "Below Standard", color: "text-orange-600", bar: "#f97316", bg: "bg-orange-50 text-orange-800 border-orange-200" };
  return { label: "Needs Critical Focus", color: "text-red-600", bar: "#ef4444", bg: "bg-red-50 text-red-800 border-red-200" };
}

export function ScoreRing({ score, size = 100 }: { score: number; size?: number }) {
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
