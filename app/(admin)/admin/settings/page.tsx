"use client";

import { useState } from "react";

const TABS = ["Company", "Admin Users", "Notifications", "Security", "Integrations"] as const;
type Tab = typeof TABS[number];

const ADMIN_USERS = [
  { name: "Khalid Al-Rashid",  email: "khalid.rashid@transcom.com.bd", role: "Super Admin", status: "Active",   last: "Today" },
  { name: "Farida Hossain",    email: "farida.hossain@transcom.com.bd", role: "HR Manager",  status: "Active",   last: "Yesterday" },
  { name: "Mustafizur Rahman", email: "mustaf.rahman@transcom.com.bd",  role: "Assessor",    status: "Active",   last: "2026-07-05" },
  { name: "Tariqul Islam",     email: "tariq.islam@transcom.com.bd",    role: "Assessor",    status: "Active",   last: "2026-07-04" },
  { name: "Nadia Sultana",     email: "nadia.sultana@transcom.com.bd",  role: "HR Manager",  status: "Inactive", last: "2026-06-20" },
];

const ROLES = ["Super Admin", "HR Manager", "Assessor", "Viewer"];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 focus:outline-none ${enabled ? "bg-red-600" : "bg-slate-300"}`}
      style={{ height: "22px" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
        style={{ transform: enabled ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Company");

  // Company form
  const [company, setCompany] = useState({
    name: "Transcom Electronics Ltd.",
    shortName: "Transcom",
    email: "hr@transcom.com.bd",
    phone: "+880 2 9887890",
    address: "Transcom Tower, 108 Gulshan Ave, Dhaka 1212, Bangladesh",
    website: "https://www.transcombd.com",
    timezone: "Asia/Dhaka",
  });

  // Notification toggles
  const [notifs, setNotifs] = useState({
    auditAlerts: true,
    assessmentDeadline: true,
    newEmployee: true,
    lowScoreAlert: true,
    weeklyReport: false,
    monthlyReport: true,
    systemUpdates: false,
  });
  const toggleNotif = (key: keyof typeof notifs) => setNotifs(n => ({ ...n, [key]: !n[key] }));

  // Security
  const [security, setSecurity] = useState({
    sessionTimeout: "60",
    minPasswordLen: "8",
    require2FA: false,
    ipWhitelist: false,
  });

  // Saved state
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const InputField = ({ label, value, onChange, type="text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
    <div>
      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 bg-white transition-all" />
    </div>
  );

  return (
    <div className="p-5 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Tab Nav */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-shrink-0 px-5 py-3.5 text-xs font-extrabold border-b-2 transition-all ${
                activeTab === t
                  ? "border-red-600 text-red-700 bg-red-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Company ── */}
        {activeTab === "Company" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Company Information</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Update your organization details and branding.</p>
            </div>
            <div className="p-6 space-y-5">
              {/* Logo area */}
              <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-md flex-shrink-0">T</div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">Company Logo</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Recommended: 200×200 px, PNG or SVG</p>
                  <button className="mt-2 px-3 py-1.5 text-[10px] font-extrabold border border-slate-200 rounded-lg hover:bg-white text-slate-600 transition-colors">Upload Logo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Company Name"       value={company.name}      onChange={v => setCompany(c => ({ ...c, name: v }))} />
                <InputField label="Short Name / Brand" value={company.shortName} onChange={v => setCompany(c => ({ ...c, shortName: v }))} />
                <InputField label="HR Email"           value={company.email}     onChange={v => setCompany(c => ({ ...c, email: v }))}   type="email" />
                <InputField label="Phone"              value={company.phone}     onChange={v => setCompany(c => ({ ...c, phone: v }))} />
                <div className="sm:col-span-2">
                  <InputField label="Address"          value={company.address}   onChange={v => setCompany(c => ({ ...c, address: v }))} />
                </div>
                <InputField label="Website"            value={company.website}   onChange={v => setCompany(c => ({ ...c, website: v }))} />
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Timezone</label>
                  <select value={company.timezone} onChange={e => setCompany(c => ({ ...c, timezone: e.target.value }))} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 bg-white">
                    <option>Asia/Dhaka</option>
                    <option>UTC</option>
                    <option>Asia/Kolkata</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Admin Users ── */}
        {activeTab === "Admin Users" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Admin Users & Roles</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Manage who has access to this admin portal.</p>
              </div>
              <button className="px-4 py-2 text-xs font-extrabold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm hover:from-red-700 transition-all flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Invite User
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {ADMIN_USERS.map(u => (
                <div key={u.email} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-[11px] font-extrabold flex-shrink-0">
                      {u.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <select defaultValue={u.role} className="text-[11px] font-bold border border-slate-200 rounded-lg bg-slate-50 text-slate-700 px-2.5 py-1.5 focus:outline-none hidden sm:block">
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${u.status==="Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>{u.status}</span>
                    <span className="text-[10px] text-slate-400 font-medium hidden lg:block">Last: {u.last}</span>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Notifications ── */}
        {activeTab === "Notifications" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900">Notification Preferences</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Control which alerts and summaries you receive by email.</p>
            </div>
            <div className="divide-y divide-slate-50">
              {([
                { key: "auditAlerts",          label: "Audit Alerts",              desc: "Immediate email when an audit score falls below threshold." },
                { key: "assessmentDeadline",   label: "Assessment Deadlines",      desc: "48-hour reminder before any active assessment expires." },
                { key: "newEmployee",          label: "New Employee Added",        desc: "Notify when HR adds a new employee to the system." },
                { key: "lowScoreAlert",        label: "Low Score Flagging",        desc: "Alert when an employee's combined score drops below 6.0." },
                { key: "weeklyReport",         label: "Weekly Summary Email",      desc: "Automated digest every Monday at 9:00 AM BST." },
                { key: "monthlyReport",        label: "Monthly Report Delivery",   desc: "Full performance report on the 1st of every month." },
                { key: "systemUpdates",        label: "System Update Notices",     desc: "Platform maintenance windows and version update notices." },
              ] as const).map(n => (
                <div key={n.key} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{n.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{n.desc}</p>
                  </div>
                  <Toggle enabled={notifs[n.key]} onChange={() => toggleNotif(n.key)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Security ── */}
        {activeTab === "Security" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900">Security Settings</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Configure session timeouts, password policies, and access controls.</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Session Timeout (minutes)</label>
                    <input type="number" value={security.sessionTimeout} onChange={e => setSecurity(s=>({...s,sessionTimeout:e.target.value}))} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 bg-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Min. Password Length</label>
                    <input type="number" value={security.minPasswordLen} onChange={e => setSecurity(s=>({...s,minPasswordLen:e.target.value}))} className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 bg-white" />
                  </div>
                </div>
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {([
                    { key: "require2FA", label: "Require Two-Factor Authentication (2FA)", desc: "All admin users must verify via TOTP app or SMS on login." },
                    { key: "ipWhitelist", label: "IP Whitelist Enforcement", desc: "Restrict admin portal access to approved IP address ranges only." },
                  ] as const).map(s => (
                    <div key={s.key} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{s.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.desc}</p>
                      </div>
                      <Toggle enabled={security[s.key]} onChange={() => setSecurity(sec => ({...sec, [s.key]: !sec[s.key]}))} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div>
                <p className="text-xs font-extrabold text-red-800">Danger Zone</p>
                <p className="text-[10px] text-red-600 font-medium mt-0.5 mb-3">The following actions are irreversible. Proceed with caution.</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-[10px] font-extrabold border border-red-300 rounded-lg text-red-700 hover:bg-red-100 transition-colors">Clear All Sessions</button>
                  <button className="px-3 py-1.5 text-[10px] font-extrabold border border-red-300 rounded-lg text-red-700 hover:bg-red-100 transition-colors">Reset All Passwords</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Integrations ── */}
        {activeTab === "Integrations" && (
          <div className="space-y-4">
            {[
              { name: "REST API",    key: "LMS_API_KEY_••••••••••••••••ab3f",  desc: "Used by mobile apps and third-party reporting tools.",  enabled: true },
              { name: "Webhook",     key: "https://erp.transcombd.com/webhook", desc: "POST notifications to ERP on assessment completion.",   enabled: false },
              { name: "SMTP Email",  key: "smtp.transcombd.com:587",           desc: "Outgoing mail server for automated notifications.",      enabled: true },
            ].map(i => (
              <div key={i.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-extrabold text-slate-900">{i.name}</p>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${i.enabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>{i.enabled ? "Connected" : "Disabled"}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">{i.desc}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <code className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200">{i.key}</code>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 text-[10px] font-extrabold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">Configure</button>
                    <button className="px-3 py-1.5 text-[10px] font-extrabold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">Regenerate Key</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Save Button (shown on form tabs) */}
        {(activeTab === "Company" || activeTab === "Security" || activeTab === "Notifications") && (
          <div className="flex items-center justify-end gap-3">
            {saved && (
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Saved successfully
              </span>
            )}
            <button onClick={handleSave} className="px-6 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm hover:from-red-700 transition-all">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
