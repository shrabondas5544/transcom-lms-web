"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AssessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const profileId = sessionStorage.getItem("employeeProfileId");
      const isAssessor = sessionStorage.getItem("employeeIsAssessor") === "true";

      if (!profileId || !isAssessor) {
        // Redirect to login if not authenticated or not an assessor
        router.push("/sign-in");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-red-650 animate-spin"></div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Verifying Assessor Session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
