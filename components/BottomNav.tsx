"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide navigation on auth pages and creation wizard
  const isAuthPage = 
    pathname?.startsWith("/sign-in") || 
    pathname?.startsWith("/sign-up") || 
    pathname === "/" ||
    pathname === "/assessor/create-assessment";
  if (isAuthPage) return null;

  const navItems = [
    {
      label: "Profile",
      href: "/employee/profile",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: "Visit Eval",
      href: "/assessor/visit-assessment",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      label: "Create Assessment",
      href: "/assessor/create-assessment",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-6 py-2.5 flex items-center justify-around shadow-lg md:max-w-md md:mx-auto md:rounded-t-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
              isActive ? "text-red-600" : "text-slate-400 hover:text-red-500"
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? "bg-red-50" : ""}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
