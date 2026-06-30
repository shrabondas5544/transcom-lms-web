"use client";

import Link from "next/link";
import { useState } from "react";

const mockEmployee = {
  id: "EMP-2084",
  designation: "Senior Sales Executive",
  department: "Showroom Operations",
  category: "TV & Home Appliances",
  showroom: "Transcom Digital - Gulshan Outlet",
  joiningDate: "15-Jan-2024",
  experience: "2 Years 5 Months",
  reportingManager: "Mustafizur Rahman (Branch Manager)",
  performance: {
    overallScore: 7.8,
    visitScore: 7.5,
    quizScore: 8.1,
    rating: "Good",
    strengths: ["Grooming", "Discipline", "Demonstration Skill"],
    developmentAreas: ["Product Knowledge (AC & Washing Machine)"],
    recommendedTraining: [
      "Advanced TV Product Training 2026",
      "LG AI Washing Machine Features Masterclass",
    ],
  },
  visitDetails: [
    { criteria: "Customer Dealing", score: 8, max: 10, remarks: "Communicates well, listens carefully, and builds trust quickly." },
    { criteria: "Product Knowledge", score: 7, max: 10, remarks: "Strong on TV lineups; needs minor revision on new AC financing rules." },
    { criteria: "Grooming", score: 9, max: 10, remarks: "Impeccable corporate uniform, badge, and overall professional posture." },
    { criteria: "Demonstration Skill", score: 8, max: 10, remarks: "Confidently highlights core premium features of Samsung OLED line." },
    { criteria: "Discipline", score: 8, max: 10, remarks: "Punctual, keeps floor shelves neat, and follows showroom checklists." },
  ]
};

function getRatingConfig(score: number) {
  if (score >= 9.0) return { label: "Best", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", color: "#10b981" };
  if (score >= 7.5) return { label: "Good", bg: "bg-rose-50 text-rose-700 border-rose-200", color: "#dc2626" };
  if (score >= 5.0) return { label: "Average", bg: "bg-amber-50 text-amber-700 border-amber-200", color: "#f59e0b" };
  if (score >= 3.0) return { label: "Need Improvement", bg: "bg-orange-50 text-orange-700 border-orange-200", color: "#f97316" };
  return { label: "Bad", bg: "bg-red-150 text-red-800 border-red-300", color: "#ef4444" };
}

export default function EmployeeProfilePage() {
  const [activeTab, setActiveTab] = useState<"profileInfo" | "documents" | "education" | "skill">("profileInfo");
  
  // Profile Picture States
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [imageScale, setImageScale] = useState<number>(1);
  const [imageX, setImageX] = useState<number>(0);
  const [imageY, setImageY] = useState<number>(0);
  
  // Modal Picture Editing States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [tempScale, setTempScale] = useState<number>(1);
  const [tempX, setTempX] = useState<number>(0);
  const [tempY, setTempY] = useState<number>(0);

  // Profile Information States (with Social Links)
  const [personalInfo, setPersonalInfo] = useState({
    name: "Sayed Mahmud",
    fatherName: "Sayed Ali",
    motherName: "Mahmuda Begum",
    presentAddress: "House 12, Road 5, Gulshan 1, Dhaka",
    permanentAddress: "Vill: Puran Bazar, P.O: Chandpur, Dist: Chandpur",
    dob: "1997-04-05",
    phone: "+880 1712-345678",
    email: "sayed.mahmud@transcom.com",
    nationality: "Bangladeshi",
    maritalStatus: "Single",
    marriageDate: "",
    religion: "Muslim",
    sex: "Male",
    bloodType: "B+",
    nid: "19972628491823",
    passport: "EG0948271",
    hobbies: "Reading books, playing cricket",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    xLink: "https://x.com",
    linkedin: "https://linkedin.com"
  });

  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [tempInfo, setTempInfo] = useState({ ...personalInfo });

  // 5 Education Sections States (with added Group parameter)
  const [educationSSC, setEducationSSC] = useState({
    institution: "Dhaka Collegiate School",
    division: "Dhaka", // Dropdown: Barishal, Chattogram, Dhaka, Khulna, Mymensingh, Rajshahi, Rangpur, Sylhet
    group: "Science", // Science, Commerce, Arts
    yearPassed: "2013",
    gpa: "5.00"
  });
  const [educationHSC, setEducationHSC] = useState({
    institution: "Dhaka City College",
    division: "Dhaka", // Dropdown: Barishal, Chattogram, Dhaka, Khulna, Mymensingh, Rajshahi, Rangpur, Sylhet
    group: "Science", // Science, Commerce, Arts
    yearPassed: "2015",
    gpa: "5.00"
  });
  const [educationDiploma, setEducationDiploma] = useState({
    institution: "",
    yearPassed: "",
    cgpa: ""
  });
  const [educationGraduate, setEducationGraduate] = useState({
    institution: "Dhaka University",
    passedYear: "2019",
    degree: "BBA",
    result: "CGPA 3.65",
    achievement: "Dean's Honor List for Academic Excellence",
    achievementFile: "Dean_Award_BBA.pdf" as string | null
  });
  const [educationPostGraduate, setEducationPostGraduate] = useState({
    institution: "",
    passedYear: "",
    degree: "",
    result: "",
    achievement: "",
    achievementFile: null as string | null
  });

  // Temp states for education editing modal
  const [isEduEditModalOpen, setIsEduEditModalOpen] = useState(false);
  const [tempSSC, setTempSSC] = useState({ ...educationSSC });
  const [tempHSC, setTempHSC] = useState({ ...educationHSC });
  const [tempDiploma, setTempDiploma] = useState({ ...educationDiploma });
  const [tempGraduate, setTempGraduate] = useState({ ...educationGraduate });
  const [tempPostGraduate, setTempPostGraduate] = useState({ ...educationPostGraduate });

  // Document Upload States
  const [docResume, setDocResume] = useState<string | null>(null);
  const [docNidEmpFront, setDocNidEmpFront] = useState<string | null>(null);
  const [docNidEmpBack, setDocNidEmpBack] = useState<string | null>(null);
  const [docNidNomFront, setDocNidNomFront] = useState<string | null>(null);
  const [docNidNomBack, setDocNidNomBack] = useState<string | null>(null);
  const [docCovid, setDocCovid] = useState<string | null>(null);
  const [docRelease, setDocRelease] = useState<string | null>(null);
  const [docPayslip, setDocPayslip] = useState<string | null>(null);
  const [docTax, setDocTax] = useState<string | null>(null);

  // Dynamically calculate profile completion percentage
  const getProfileCompletion = () => {
    let total = 0;
    if (avatarImage) total += 10;
    const personalFields = [
      personalInfo.name, personalInfo.fatherName, personalInfo.motherName, 
      personalInfo.presentAddress, personalInfo.permanentAddress, personalInfo.dob, 
      personalInfo.phone, personalInfo.email, personalInfo.nationality, 
      personalInfo.religion, personalInfo.sex, personalInfo.bloodType, personalInfo.nid
    ];
    const filledPersonal = personalFields.filter(Boolean).length;
    total += Math.round((filledPersonal / personalFields.length) * 40);
    if (educationSSC.institution) total += 8;
    if (educationHSC.institution || educationDiploma.institution) total += 8;
    if (educationGraduate.institution) total += 9;
    if (docResume) total += 5;
    if (docNidEmpFront) total += 5;
    if (docNidEmpBack) total += 5;
    if (docNidNomFront) total += 2.5;
    if (docNidNomBack) total += 2.5;
    if (docCovid) total += 5;
    return Math.min(100, Math.round(total));
  };

  const completionPercent = getProfileCompletion();

  const ratingConfig = getRatingConfig(mockEmployee.performance.overallScore);

  // SVG Progress Stroke computation
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (mockEmployee.performance.overallScore / 10) * circumference;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target?.result as string);
        setTempScale(1);
        setTempX(0);
        setTempY(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSingleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (key === "resume") setDocResume(file.name);
      else if (key === "nidEmpFront") setDocNidEmpFront(file.name);
      else if (key === "nidEmpBack") setDocNidEmpBack(file.name);
      else if (key === "nidNomFront") setDocNidNomFront(file.name);
      else if (key === "nidNomBack") setDocNidNomBack(file.name);
      else if (key === "covid") setDocCovid(file.name);
      else if (key === "release") setDocRelease(file.name);
      else if (key === "payslip") setDocPayslip(file.name);
      else if (key === "tax") setDocTax(file.name);
      else if (key === "gradAchievement") setTempGraduate({ ...tempGraduate, achievementFile: file.name });
      else if (key === "postGradAchievement") setTempPostGraduate({ ...tempPostGraduate, achievementFile: file.name });
    }
  };

  return (
    <div className="auth-bg flex flex-col min-h-screen pb-20">
      
      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        id="avatar-file-input"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Hidden File Inputs for Document Tab */}
      <input type="file" id="file-resume" accept="application/pdf" className="hidden" onChange={(e) => handleSingleDocUpload(e, "resume")} />
      <input type="file" id="file-nid-emp-front" accept="image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "nidEmpFront")} />
      <input type="file" id="file-nid-emp-back" accept="image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "nidEmpBack")} />
      <input type="file" id="file-nid-nom-front" accept="image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "nidNomFront")} />
      <input type="file" id="file-nid-nom-back" accept="image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "nidNomBack")} />
      <input type="file" id="file-covid" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "covid")} />
      <input type="file" id="file-release" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "release")} />
      <input type="file" id="file-payslip" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "payslip")} />
      <input type="file" id="file-tax" accept="application/pdf" className="hidden" onChange={(e) => handleSingleDocUpload(e, "tax")} />

      {/* Hidden File Inputs for Achievements */}
      <input type="file" id="file-grad-ach" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "gradAchievement")} />
      <input type="file" id="file-postgrad-ach" accept="application/pdf, image/*" className="hidden" onChange={(e) => handleSingleDocUpload(e, "postGradAchievement")} />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>My Skill Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 hover:bg-slate-50 rounded-full text-slate-600 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-5 space-y-6">

        {/* Hero Section Card */}
        <section className="auth-card p-5 relative overflow-hidden animate-fade-in-up">
          <div className="flex items-start gap-4">
            
            {/* Avatar with Ring & Edit Action */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-700 p-0.5 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-slate-50 flex items-center justify-center overflow-hidden relative">
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt="Employee Avatar"
                      className="w-full h-full object-cover transition-transform"
                      style={{
                        transform: `scale(${imageScale}) translate(${imageX}px, ${imageY}px)`,
                      }}
                    />
                  ) : (
                    <svg className="w-12 h-12 text-slate-355" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setTempImage(avatarImage);
                  setTempScale(imageScale);
                  setTempX(imageX);
                  setTempY(imageY);
                  setIsEditModalOpen(true);
                }}
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 ring-2 ring-white text-white shadow-md transition-all cursor-pointer animate-pulse"
                title="Edit profile picture"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </button>
            </div>

            {/* Info details */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-900 truncate" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                {personalInfo.name}
              </h2>
              <p className="text-xs font-semibold text-red-600 mb-1">{mockEmployee.designation}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {mockEmployee.showroom.replace("Transcom Digital - ", "")}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">ID: {mockEmployee.id}</p>
            </div>
          </div>

          {/* Profile Completion Progress Bar */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-slate-500 font-bold uppercase tracking-wider">Profile Completion</span>
              <span className="text-red-650 font-extrabold">{completionPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-rose-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between">
            {/* Score Display */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r={radius} stroke="#f1f5f9" strokeWidth="7" fill="transparent" />
                  <circle
                    cx="45"
                    cy="45"
                    r={radius}
                    stroke={ratingConfig.color}
                    strokeWidth="7"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-extrabold text-slate-900">{mockEmployee.performance.overallScore}</span>
                  <span className="text-[8px] text-slate-400 font-medium uppercase">Score</span>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Performance Rating</div>
                <div className={`mt-0.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ratingConfig.bg}`}>
                  {ratingConfig.label}
                </div>
              </div>
            </div>

            {/* Score info */}
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase">Quiz Avg</div>
              <div className="text-sm font-bold text-slate-800">{mockEmployee.performance.quizScore}/10</div>
              <div className="text-[10px] text-slate-400 uppercase mt-1">Visit Avg</div>
              <div className="text-sm font-bold text-slate-800">{mockEmployee.performance.visitScore}/10</div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="flex bg-white/70 backdrop-blur-md p-1 rounded-xl border border-slate-100 shadow-sm animate-fade-in-up animate-delay-100 overflow-x-auto scrollbar-none whitespace-nowrap gap-1">
          <button
            onClick={() => setActiveTab("profileInfo")}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "profileInfo"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "documents"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("education")}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "education"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Education
          </button>
          <button
            onClick={() => setActiveTab("skill")}
            className={`py-2 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "skill"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Skill
          </button>
        </nav>

        {/* Tab Content Areas */}
        <section className="space-y-4 animate-fade-in-up animate-delay-200">
          
          {/* TAB 1: PROFILE INFO */}
          {activeTab === "profileInfo" && (
            <div className="space-y-4">
              
              {/* Employee Master Data */}
              <div className="auth-card p-5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5 mb-4">
                  {/* Left Side Edit Icon Button */}
                  <button
                    onClick={() => {
                      setTempInfo({ ...personalInfo });
                      setIsProfileEditModalOpen(true);
                    }}
                    className="p-1 hover:bg-slate-100 rounded text-red-600 transition-all cursor-pointer"
                    title="Edit personal information"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                    Profile Information
                  </h3>
                </div>
                
                <dl className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Name</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.name}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Father's Name</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.fatherName}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Mother's Name</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.motherName}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Present Address</dt>
                    <dd className="text-slate-800 font-semibold leading-relaxed">{personalInfo.presentAddress}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Permanent Address</dt>
                    <dd className="text-slate-800 font-semibold leading-relaxed">{personalInfo.permanentAddress}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Date of Birth</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.dob}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Phone Number</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.phone}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Email Address</dt>
                    <dd className="text-slate-800 font-semibold truncate">{personalInfo.email}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Nationality</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.nationality}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Marital Status</dt>
                    <dd className="text-slate-800 font-semibold">
                      {personalInfo.maritalStatus}
                      {personalInfo.maritalStatus === "Married" && personalInfo.marriageDate && (
                        <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                          Marriage Date: {personalInfo.marriageDate}
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Religion</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.religion}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Sex</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.sex}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Blood Type</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.bloodType}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">National NID Num</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.nid}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Passport Num</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.passport || "N/A"}</dd>
                  </div>
                  <div className="grid grid-cols-2 border-b border-slate-50 pb-2">
                    <dt className="text-slate-400 font-medium">Hobbies</dt>
                    <dd className="text-slate-800 font-semibold">{personalInfo.hobbies}</dd>
                  </div>
                  <div className="grid grid-cols-2 pt-1">
                    <dt className="text-slate-400 font-medium">Social Links</dt>
                    <dd className="space-y-1.5">
                      {personalInfo.facebook && (
                        <a href={personalInfo.facebook} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-red-600 font-bold hover:underline">
                          <span>Facebook</span>
                        </a>
                      )}
                      {personalInfo.instagram && (
                        <a href={personalInfo.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-red-600 font-bold hover:underline">
                          <span>Instagram</span>
                        </a>
                      )}
                      {personalInfo.xLink && (
                        <a href={personalInfo.xLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-red-600 font-bold hover:underline">
                          <span>X (Twitter)</span>
                        </a>
                      )}
                      {personalInfo.linkedin && (
                        <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-red-600 font-bold hover:underline">
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Company Info Card */}
              <div className="auth-card p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3 border-b border-slate-50 pb-2">
                  Company Info Summary
                </h3>
                <dl className="grid grid-cols-2 gap-y-3.5 text-xs">
                  <div>
                    <dt className="text-slate-400 font-medium">Department</dt>
                    <dd className="text-slate-855 font-bold mt-0.5">{mockEmployee.department}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Category Focus</dt>
                    <dd className="text-slate-855 font-bold mt-0.5">{mockEmployee.category}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Reporting Manager</dt>
                    <dd className="text-slate-855 font-bold mt-0.5 truncate">{mockEmployee.reportingManager.split(" (")[0]}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-medium">Showroom Role</dt>
                    <dd className="text-slate-855 font-bold mt-0.5">{mockEmployee.designation}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              
              {/* Document Checklists */}
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
                    <button
                      onClick={() => document.getElementById("file-resume")?.click()}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        docResume ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {docResume ? "Change" : "Upload PDF"}
                    </button>
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
                        <button
                          onClick={() => document.getElementById("file-nid-emp-front")?.click()}
                          className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-650 hover:bg-slate-100 cursor-pointer"
                        >
                          {docNidEmpFront ? "Replace" : "Upload"}
                        </button>
                      </div>
                      <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 text-center">
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">Back Side</span>
                        <span className="text-[9px] text-slate-400 block truncate mb-1">
                          {docNidEmpBack ? docNidEmpBack : "Image required"}
                        </span>
                        <button
                          onClick={() => document.getElementById("file-nid-emp-back")?.click()}
                          className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-650 hover:bg-slate-100 cursor-pointer"
                        >
                          {docNidEmpBack ? "Replace" : "Upload"}
                        </button>
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
                        <button
                          onClick={() => document.getElementById("file-nid-nom-front")?.click()}
                          className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-650 hover:bg-slate-100 cursor-pointer"
                        >
                          {docNidNomFront ? "Replace" : "Upload"}
                        </button>
                      </div>
                      <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100 text-center">
                        <span className="text-[10px] font-bold text-slate-600 block mb-1">Back Side</span>
                        <span className="text-[9px] text-slate-400 block truncate mb-1">
                          {docNidNomBack ? docNidNomBack : "Image required"}
                        </span>
                        <button
                          onClick={() => document.getElementById("file-nid-nom-back")?.click()}
                          className="text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-650 hover:bg-slate-100 cursor-pointer"
                        >
                          {docNidNomBack ? "Replace" : "Upload"}
                        </button>
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
                    <button
                      onClick={() => document.getElementById("file-covid")?.click()}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        docCovid ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {docCovid ? "Change" : "Upload File"}
                    </button>
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
                    <button
                      onClick={() => document.getElementById("file-release")?.click()}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        docRelease ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {docRelease ? "Change" : "Upload File"}
                    </button>
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
                    <button
                      onClick={() => document.getElementById("file-payslip")?.click()}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        docPayslip ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {docPayslip ? "Change" : "Upload File"}
                    </button>
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
                    <button
                      onClick={() => document.getElementById("file-tax")?.click()}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                        docTax ? "text-slate-500 hover:text-slate-800 bg-slate-100" : "text-white bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {docTax ? "Change" : "Upload PDF"}
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="auth-card p-5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5 mb-4">
                  {/* Left Side Edit Icon Button for Education */}
                  <button
                    onClick={() => {
                      setTempSSC({ ...educationSSC });
                      setTempHSC({ ...educationHSC });
                      setTempDiploma({ ...educationDiploma });
                      setTempGraduate({ ...educationGraduate });
                      setTempPostGraduate({ ...educationPostGraduate });
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
            </div>
          )}

          {/* TAB 4: SKILL */}
          {activeTab === "skill" && (
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
          )}

        </section>
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-slate-100 px-4 py-2.5 flex items-center justify-around shadow-lg">
        <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-[10px] font-semibold">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-[10px] font-semibold">Learning</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-[10px] font-semibold">Visits</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-red-600 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-[10px] font-semibold">Profile</span>
        </Link>
      </nav>

      {/* Edit Avatar Crop/Position Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-slate-100 flex flex-col space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Position & Crop Photo
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Adjust framing and scale to fit profile avatar</p>
            </div>

            {/* Circular Crop Frame Overlay */}
            <div className="relative w-36 h-36 mx-auto rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 rounded-2xl border-4 border-slate-900/10 pointer-events-none z-10"></div>
              {tempImage ? (
                <img
                  src={tempImage}
                  alt="Crop Preview"
                  className="w-full h-full object-cover origin-center"
                  style={{
                    transform: `scale(${tempScale}) translate(${tempX}px, ${tempY}px)`,
                  }}
                />
              ) : (
                <div className="text-center text-slate-400 px-3">
                  <svg className="w-8 h-8 mx-auto mb-1.5 text-slate-355" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] block font-medium">Select a photo</span>
                </div>
              )}
            </div>

            {/* Controls */}
            {tempImage && (
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>Zoom</span>
                    <span>{Math.round(tempScale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={tempScale}
                    onChange={(e) => setTempScale(parseFloat(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>Horizontal Shift</span>
                    <span>{tempX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="1"
                    value={tempX}
                    onChange={(e) => setTempX(parseInt(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                    <span>Vertical Shift</span>
                    <span>{tempY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="1"
                    value={tempY}
                    onChange={(e) => setTempY(parseInt(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => document.getElementById("avatar-file-input")?.click()}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
              >
                {tempImage ? "Change Photo" : "Upload Photo"}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarImage(tempImage);
                    setImageScale(tempScale);
                    setImageX(tempX);
                    setImageY(tempY);
                    setIsEditModalOpen(false);
                  }}
                  disabled={!tempImage}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isProfileEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full my-8 p-5 shadow-2xl border border-slate-100 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto scrollbar-none animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Edit Profile Information
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Update your personal details below.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setPersonalInfo(tempInfo);
              setIsProfileEditModalOpen(false);
            }} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-650 font-medium mb-1">Name</label>
                <input type="text" className="form-input" value={tempInfo.name} onChange={(e) => setTempInfo({...tempInfo, name: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Father's Name</label>
                  <input type="text" className="form-input" value={tempInfo.fatherName} onChange={(e) => setTempInfo({...tempInfo, fatherName: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Mother's Name</label>
                  <input type="text" className="form-input" value={tempInfo.motherName} onChange={(e) => setTempInfo({...tempInfo, motherName: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="block text-slate-650 font-medium mb-1">Present Address</label>
                <textarea className="form-input h-14 resize-none" value={tempInfo.presentAddress} onChange={(e) => setTempInfo({...tempInfo, presentAddress: e.target.value})} required />
              </div>

              <div>
                <label className="block text-slate-650 font-medium mb-1">Permanent Address</label>
                <textarea className="form-input h-14 resize-none" value={tempInfo.permanentAddress} onChange={(e) => setTempInfo({...tempInfo, permanentAddress: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Date of Birth</label>
                  <input type="date" className="form-input" value={tempInfo.dob} onChange={(e) => setTempInfo({...tempInfo, dob: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Phone Number</label>
                  <input type="text" className="form-input" value={tempInfo.phone} onChange={(e) => setTempInfo({...tempInfo, phone: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Email Address</label>
                  <input type="email" className="form-input" value={tempInfo.email} onChange={(e) => setTempInfo({...tempInfo, email: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Nationality</label>
                  <input type="text" className="form-input" value={tempInfo.nationality} onChange={(e) => setTempInfo({...tempInfo, nationality: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Marital Status</label>
                  <select className="form-input py-2" value={tempInfo.maritalStatus} onChange={(e) => setTempInfo({...tempInfo, maritalStatus: e.target.value})}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
                {tempInfo.maritalStatus === "Married" && (
                  <div>
                    <label className="block text-slate-650 font-medium mb-1">Marriage Date</label>
                    <input type="date" className="form-input" value={tempInfo.marriageDate} onChange={(e) => setTempInfo({...tempInfo, marriageDate: e.target.value})} required />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Religion</label>
                  <select className="form-input py-2" value={tempInfo.religion} onChange={(e) => setTempInfo({...tempInfo, religion: e.target.value})}>
                    <option value="Muslim">Muslim</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Christian">Christian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Sex</label>
                  <select className="form-input py-2" value={tempInfo.sex} onChange={(e) => setTempInfo({...tempInfo, sex: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Blood Type</label>
                  <select className="form-input py-2" value={tempInfo.bloodType} onChange={(e) => setTempInfo({...tempInfo, bloodType: e.target.value})}>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">National NID Num</label>
                  <input type="text" className="form-input" value={tempInfo.nid} onChange={(e) => setTempInfo({...tempInfo, nid: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Passport Num</label>
                  <input type="text" className="form-input" value={tempInfo.passport} onChange={(e) => setTempInfo({...tempInfo, passport: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-slate-650 font-medium mb-1">Hobbies</label>
                <input type="text" className="form-input" value={tempInfo.hobbies} onChange={(e) => setTempInfo({...tempInfo, hobbies: e.target.value})} />
              </div>

              {/* Social Links Inputs */}
              <div className="border-t border-slate-100 pt-3.5 space-y-3">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Social Links</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Facebook</label>
                    <input type="url" placeholder="https://facebook.com/..." className="form-input py-1 text-[11px]" value={tempInfo.facebook} onChange={(e) => setTempInfo({...tempInfo, facebook: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Instagram</label>
                    <input type="url" placeholder="https://instagram.com/..." className="form-input py-1 text-[11px]" value={tempInfo.instagram} onChange={(e) => setTempInfo({...tempInfo, instagram: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-0.5">X (Twitter)</label>
                    <input type="url" placeholder="https://x.com/..." className="form-input py-1 text-[11px]" value={tempInfo.xLink} onChange={(e) => setTempInfo({...tempInfo, xLink: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">LinkedIn</label>
                    <input type="url" placeholder="https://linkedin.com/..." className="form-input py-1 text-[11px]" value={tempInfo.linkedin} onChange={(e) => setTempInfo({...tempInfo, linkedin: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProfileEditModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Education Edit Modal */}
      {isEduEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm w-full my-8 p-5 shadow-2xl border border-slate-100 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto scrollbar-none animate-fade-in">
            <div>
              <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Edit Education Background
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Configure your educational details across the 5 standard levels.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setEducationSSC(tempSSC);
              setEducationHSC(tempHSC);
              setEducationDiploma(tempDiploma);
              setEducationGraduate(tempGraduate);
              setEducationPostGraduate(tempPostGraduate);
              setIsEduEditModalOpen(false);
            }} className="space-y-5 text-xs">

              {/* SSC Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Secondary School Certificate (SSC)</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="form-input py-1 text-xs" value={tempSSC.institution} onChange={(e) => setTempSSC({ ...tempSSC, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Board/Division</label>
                    <select
                      className="form-input py-1 text-xs"
                      value={tempSSC.division}
                      onChange={(e) => setTempSSC({ ...tempSSC, division: e.target.value })}
                    >
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
                      className="form-input py-1 text-xs"
                      value={tempSSC.group}
                      onChange={(e) => setTempSSC({ ...tempSSC, group: e.target.value })}
                    >
                      <option value="Science">Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passed Year</label>
                    <input type="text" className="form-input py-1 text-xs" value={tempSSC.yearPassed} onChange={(e) => setTempSSC({ ...tempSSC, yearPassed: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">GPA (Out of 5)</label>
                    <input type="text" className="form-input py-1 text-xs" value={tempSSC.gpa} onChange={(e) => setTempSSC({ ...tempSSC, gpa: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* HSC Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Higher Secondary Certificate (HSC)</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="form-input py-1 text-xs" value={tempHSC.institution} onChange={(e) => setTempHSC({ ...tempHSC, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Board/Division</label>
                    <select
                      className="form-input py-1 text-xs"
                      value={tempHSC.division}
                      onChange={(e) => setTempHSC({ ...tempHSC, division: e.target.value })}
                    >
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
                      className="form-input py-1 text-xs"
                      value={tempHSC.group}
                      onChange={(e) => setTempHSC({ ...tempHSC, group: e.target.value })}
                    >
                      <option value="Science">Science</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Arts">Arts</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passed Year</label>
                    <input type="text" className="form-input py-1 text-xs" value={tempHSC.yearPassed} onChange={(e) => setTempHSC({ ...tempHSC, yearPassed: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">GPA (Out of 5)</label>
                    <input type="text" className="form-input py-1 text-xs" value={tempHSC.gpa} onChange={(e) => setTempHSC({ ...tempHSC, gpa: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Diploma Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Diploma</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="form-input py-1 text-xs" placeholder="e.g. Dhaka Polytechnic Institute" value={tempDiploma.institution} onChange={(e) => setTempDiploma({ ...tempDiploma, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Passed Year</label>
                    <input type="text" className="form-input py-1 text-xs" value={tempDiploma.yearPassed} onChange={(e) => setTempDiploma({ ...tempDiploma, yearPassed: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">CGPA</label>
                    <input type="text" className="form-input py-1 text-xs" value={tempDiploma.cgpa} onChange={(e) => setTempDiploma({ ...tempDiploma, cgpa: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Graduate Section Form */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Graduate</h4>
                <div>
                  <label className="block text-slate-600 mb-0.5">Institution</label>
                  <input type="text" className="form-input py-1 text-xs" value={tempGraduate.institution} onChange={(e) => setTempGraduate({ ...tempGraduate, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-slate-600 mb-0.5">Degree</label>
                    <select
                      className="form-input py-1 text-xs"
                      value={tempGraduate.degree}
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
                    <input type="text" className="form-input py-1 text-xs" value={tempGraduate.passedYear} onChange={(e) => setTempGraduate({ ...tempGraduate, passedYear: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">CGPA / Result</label>
                    <input type="text" className="form-input py-1 text-xs" value={tempGraduate.result} onChange={(e) => setTempGraduate({ ...tempGraduate, result: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Achievement Notes</label>
                  <input type="text" className="form-input py-1 text-xs" placeholder="Awards or special honors" value={tempGraduate.achievement} onChange={(e) => setTempGraduate({ ...tempGraduate, achievement: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Achievement File (PDF/Image)</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById("file-grad-ach")?.click()}
                      className="flex-1 py-1 px-2 bg-white border border-slate-200 rounded text-slate-650 hover:bg-slate-100 text-center font-bold"
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
                  <input type="text" className="form-input py-1 text-xs" placeholder="e.g. North South University" value={tempPostGraduate.institution} onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, institution: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-slate-600 mb-0.5">Degree</label>
                    <select
                      className="form-input py-1 text-xs"
                      value={tempPostGraduate.degree}
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
                    <input type="text" className="form-input py-1 text-xs" value={tempPostGraduate.passedYear} onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, passedYear: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">CGPA / Result</label>
                    <input type="text" className="form-input py-1 text-xs" value={tempPostGraduate.result} onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, result: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Achievement Notes</label>
                  <input type="text" className="form-input py-1 text-xs" placeholder="Thesis awards, honors, etc." value={tempPostGraduate.achievement} onChange={(e) => setTempPostGraduate({ ...tempPostGraduate, achievement: e.target.value })} />
                </div>
                <div>
                  <label className="block text-slate-600 mb-0.5">Achievement File (PDF/Image)</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => document.getElementById("file-postgrad-ach")?.click()}
                      className="flex-1 py-1 px-2 bg-white border border-slate-200 rounded text-slate-650 hover:bg-slate-100 text-center font-bold"
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
        </div>
      )}

    </div>
  );
}
