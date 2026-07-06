"use client";

import { useState } from "react";

interface AdminHeaderProps {
  onMenuOpen: () => void;
  pageTitle: string;
  pageBreadcrumb?: string;
}

export default function AdminHeader({ onMenuOpen, pageTitle, pageBreadcrumb }: AdminHeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const MOCK_NOTIFS = [
    { id: 1, text: "Nayeem Uddin scored below threshold on GEC Circle audit.", time: "12 min ago", dot: "#ef4444" },
    { id: 2, text: "New assessment 'Samsung OLED Q2' published by Mustafizur Rahman.", time: "1 hr ago", dot: "#f59e0b" },
    { id: 3, text: "Sylhet Division monthly report is ready for review.", time: "3 hr ago", dot: "#3b82f6" },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 lg:px-7 gap-4 flex-shrink-0">
      {/* Left: Hamburger (mobile) + Page title */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Hamburger — only visible on mobile */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors flex-shrink-0"
          aria-label="Open navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="min-w-0">
          {pageBreadcrumb && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              {pageBreadcrumb}
            </p>
          )}
          <h1
            className="text-sm font-extrabold text-slate-900 leading-tight truncate"
            style={{ fontFamily: "var(--font-plus-jakarta), sans-serif" }}
          >
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Search + Notifications + Avatar */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Global Search */}
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search employees, reports…"
            className="pl-9 pr-4 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-xl bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 w-56 placeholder-slate-400 transition-all"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {/* Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Notifications</h4>
                  <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 font-bold px-2 py-0.5 rounded-full">
                    {MOCK_NOTIFS.length} New
                  </span>
                </div>
                <div className="divide-y divide-slate-50">
                  {MOCK_NOTIFS.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.dot }} />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-700 font-medium leading-snug">{n.text}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <button className="text-[11px] font-bold text-red-600 hover:underline">View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Avatar Chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0 shadow-sm">
            HR
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">HR Admin</p>
            <p className="text-[10px] text-slate-400 leading-tight">Transcom Corp</p>
          </div>
        </div>
      </div>
    </header>
  );
}
