"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const PAGE_META: Record<string, { title: string; breadcrumb: string }> = {
  "/admin":              { title: "Admin Overview",        breadcrumb: "Transcom LMS · Admin Portal" },
  "/admin/employees":    { title: "Employee Management",   breadcrumb: "Admin · Employees" },
  "/admin/assessments":  { title: "Assessment Management", breadcrumb: "Admin · Assessments" },
  "/admin/audits":       { title: "Showroom Audits",       breadcrumb: "Admin · Field Operations" },
  "/admin/reports":      { title: "Reports & Analytics",   breadcrumb: "Admin · Intelligence" },
  "/admin/settings":     { title: "System Settings",       breadcrumb: "Admin · Configuration" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const meta = PAGE_META[pathname] ?? { title: "Admin Portal", breadcrumb: "Transcom LMS" };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        {/* Sticky header */}
        <div className="sticky top-0 z-20">
          <AdminHeader
            onMenuOpen={() => setSidebarOpen(true)}
            pageTitle={meta.title}
            pageBreadcrumb={meta.breadcrumb}
          />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
