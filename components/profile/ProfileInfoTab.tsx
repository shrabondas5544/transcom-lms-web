"use client";

import { useState } from "react";

interface PersonalInfo {
  name: string;
  fatherName: string;
  motherName: string;
  presentAddress: string;
  permanentAddress: string;
  dob: string;
  phone: string;
  email: string;
  nationality: string;
  maritalStatus: string;
  marriageDate: string;
  religion: string;
  sex: string;
  bloodType: string;
  nid: string;
  passport: string;
  hobbies: string;
  facebook: string;
  instagram: string;
  xLink: string;
  linkedin: string;
}

interface ProfileInfoTabProps {
  personalInfo: PersonalInfo;
  setPersonalInfo: (info: PersonalInfo) => void;
  mockEmployee: {
    department: string;
    category: string;
    reportingManager: string;
    designation: string;
  };
}

export default function ProfileInfoTab({ personalInfo, setPersonalInfo, mockEmployee }: ProfileInfoTabProps) {
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
  const [tempInfo, setTempInfo] = useState<PersonalInfo>({ ...personalInfo });

  return (
    <div className="space-y-4">
      {/* Employee Master Data */}
      <div className="auth-card p-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5 mb-4">
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
                <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.name} onChange={(e) => setTempInfo({...tempInfo, name: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Father's Name</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.fatherName} onChange={(e) => setTempInfo({...tempInfo, fatherName: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Mother's Name</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.motherName} onChange={(e) => setTempInfo({...tempInfo, motherName: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="block text-slate-650 font-medium mb-1">Present Address</label>
                <textarea className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none h-14 resize-none" value={tempInfo.presentAddress} onChange={(e) => setTempInfo({...tempInfo, presentAddress: e.target.value})} required />
              </div>

              <div>
                <label className="block text-slate-650 font-medium mb-1">Permanent Address</label>
                <textarea className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none h-14 resize-none" value={tempInfo.permanentAddress} onChange={(e) => setTempInfo({...tempInfo, permanentAddress: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Date of Birth</label>
                  <input type="date" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.dob} onChange={(e) => setTempInfo({...tempInfo, dob: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Phone Number</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.phone} onChange={(e) => setTempInfo({...tempInfo, phone: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Email Address</label>
                  <input type="email" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.email} onChange={(e) => setTempInfo({...tempInfo, email: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Nationality</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.nationality} onChange={(e) => setTempInfo({...tempInfo, nationality: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Marital Status</label>
                  <select className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-2" value={tempInfo.maritalStatus} onChange={(e) => setTempInfo({...tempInfo, maritalStatus: e.target.value})}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>
                {tempInfo.maritalStatus === "Married" && (
                  <div>
                    <label className="block text-slate-650 font-medium mb-1">Marriage Date</label>
                    <input type="date" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.marriageDate} onChange={(e) => setTempInfo({...tempInfo, marriageDate: e.target.value})} required />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Religion</label>
                  <select className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-2" value={tempInfo.religion} onChange={(e) => setTempInfo({...tempInfo, religion: e.target.value})}>
                    <option value="Muslim">Muslim</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Christian">Christian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Sex</label>
                  <select className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-2" value={tempInfo.sex} onChange={(e) => setTempInfo({...tempInfo, sex: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Blood Type</label>
                  <select className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-2" value={tempInfo.bloodType} onChange={(e) => setTempInfo({...tempInfo, bloodType: e.target.value})}>
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
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.nid} onChange={(e) => setTempInfo({...tempInfo, nid: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-slate-650 font-medium mb-1">Passport Num</label>
                  <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.passport} onChange={(e) => setTempInfo({...tempInfo, passport: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-slate-650 font-medium mb-1">Hobbies</label>
                <input type="text" className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none" value={tempInfo.hobbies} onChange={(e) => setTempInfo({...tempInfo, hobbies: e.target.value})} />
              </div>

              {/* Social Links Inputs */}
              <div className="border-t border-slate-100 pt-3.5 space-y-3">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Social Links</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-0.5">Facebook</label>
                    <input type="url" placeholder="https://facebook.com/..." className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-[11px]" value={tempInfo.facebook} onChange={(e) => setTempInfo({...tempInfo, facebook: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">Instagram</label>
                    <input type="url" placeholder="https://instagram.com/..." className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-[11px]" value={tempInfo.instagram} onChange={(e) => setTempInfo({...tempInfo, instagram: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-0.5">X (Twitter)</label>
                    <input type="url" placeholder="https://x.com/..." className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-[11px]" value={tempInfo.xLink} onChange={(e) => setTempInfo({...tempInfo, xLink: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-0.5">LinkedIn</label>
                    <input type="url" placeholder="https://linkedin.com/..." className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none py-1 text-[11px]" value={tempInfo.linkedin} onChange={(e) => setTempInfo({...tempInfo, linkedin: e.target.value})} />
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
    </div>
  );
}
