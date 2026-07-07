"use client";

interface VisitDetail {
  criteria: string;
  score: number;
  max: number;
  remarks: string;
}

interface SkillsTabProps {
  mockEmployee: {
    visitDetails: VisitDetail[];
    performance: {
      strengths: string[];
      developmentAreas: string[];
    };
  };
}

export default function SkillsTab({ mockEmployee }: SkillsTabProps) {
  return (
    <div className="space-y-4">
      <div className="auth-card p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
          Technical Skill Index
        </h3>
        <div className="space-y-4">
          {mockEmployee.visitDetails.map((detail, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">{detail.criteria}</span>
                <span className="font-bold text-slate-900">{detail.score}/10</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(detail.score / detail.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="auth-card p-5 bg-gradient-to-br from-red-50/50 to-rose-50/20 border-red-100">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <svg className="text-red-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Insights & Recommendations
        </h3>
        
        <div className="space-y-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Strengths</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {mockEmployee.performance.strengths.map((str, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-md border border-green-100">
                  {str}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Development Areas</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {mockEmployee.performance.developmentAreas.map((dev, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-md border border-amber-100">
                  {dev}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
