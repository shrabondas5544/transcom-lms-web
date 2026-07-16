"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

// Sub-components & Shared configurations
import { CRITERIA, ScoreMap, RemarkMap, IPastAssessment } from "./components/types";
import PortalView from "./components/PortalView";
import HistoryView from "./components/HistoryView";
import EvaluationForm from "./components/EvaluationForm";
import SubmittedView from "./components/SubmittedView";
import ScannerModal from "./components/ScannerModal";

export default function VisitAssessmentPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"portal" | "history" | "form" | "submitted">("portal");
  const [formReferrer, setFormReferrer] = useState<"portal" | "history">("portal");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedEmployee, setScannedEmployee] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Leaderboard parameters
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Form states
  const [scores, setScores] = useState<ScoreMap>(
    Object.fromEntries(CRITERIA.map((c) => [c.key, 5]))
  );
  const [remarks, setRemarks] = useState<RemarkMap>(
    Object.fromEntries(CRITERIA.map((c) => [c.key, ""]))
  );
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});

  const scannedAvatar = useMemo(() => {
    if (!scannedEmployee?.code) return null;
    if (scannedEmployee.avatarImage) {
      return {
        img: scannedEmployee.avatarImage,
        scale: scannedEmployee.avatarScale || 1,
        x: scannedEmployee.avatarX || 0,
        y: scannedEmployee.avatarY || 0
      };
    }
    if (typeof window === "undefined") return null;
    const img = localStorage.getItem(`transcom_avatar_${scannedEmployee.code}`);
    if (!img) return null;
    const scale = parseFloat(localStorage.getItem(`transcom_avatar_scale_${scannedEmployee.code}`) || "1");
    const x = parseFloat(localStorage.getItem(`transcom_avatar_x_${scannedEmployee.code}`) || "0");
    const y = parseFloat(localStorage.getItem(`transcom_avatar_y_${scannedEmployee.code}`) || "0");
    return { img, scale, x, y };
  }, [scannedEmployee]);

  const handleToggleSkip = (key: string, val: boolean) => {
    setSkipped(prev => ({ ...prev, [key]: val }));
    setScores(prev => ({ ...prev, [key]: val ? 0 : 5 }));
  };

  // Camera references for scanning
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Real DB state
  const [leaderboardItems, setLeaderboardItems] = useState<IPastAssessment[]>([]);
  const [historyItems, setHistoryItems] = useState<IPastAssessment[]>([]);
  const [dbEmployees, setDbEmployees] = useState<any[]>([]);
  const [myAuditIds, setMyAuditIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load my logged audit IDs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("transcom_my_audit_ids");
    if (stored) {
      try {
        setMyAuditIds(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Lazy-load employee profiles for scanner simulation only when scanner opens
  const fetchDbEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5276/api/EmployeeProfile?page=1&pageSize=1000");
      if (res.ok) {
        const data = await res.json();
        setDbEmployees(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load employee profiles:", err);
    }
  };

  // Load evaluations leaderboard from DB
  const loadEvaluations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      params.append("sortDirection", sortDirection);
      params.append("page", currentPage.toString());
      params.append("pageSize", PAGE_SIZE.toString());
      
      const res = await fetch(`http://localhost:5276/api/ShowroomVisitEvaluation?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboardItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load global evaluations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoryEvaluations = async () => {
    try {
      const res = await fetch(`http://localhost:5276/api/ShowroomVisitEvaluation?pageSize=10000`);
      if (res.ok) {
        const data = await res.json();
        setHistoryItems(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load history evaluations:", err);
    }
  };

  useEffect(() => {
    loadEvaluations();
  }, [searchQuery, sortDirection, currentPage]);

  useEffect(() => {
    loadHistoryEvaluations();
  }, [myAuditIds]);

  // Derived: assessor audits completed by this session
  const pastAssessments = useMemo(() => {
    return historyItems.filter(a => myAuditIds.includes(a.id));
  }, [historyItems, myAuditIds]);

  const formAvg = useMemo(() => {
    const active = CRITERIA.filter(c => scores[c.key] > 0);
    if (active.length === 0) return 0;
    return active.reduce((s, c) => s + scores[c.key], 0) / active.length;
  }, [scores]);

  // Paginated Leaderboard (paginated directly on server)
  const [totalPages, setTotalPages] = useState(1);
  const paginatedLeaderboard = leaderboardItems;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortDirection]);

  // Camera integration for QR Code scanning simulator
  useEffect(() => {
    if (isScannerOpen) {
      fetchDbEmployees();
      let cancelled = false;
      (async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          if (cancelled) {
            mediaStream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            await videoRef.current.play();
          }
        } catch (err) {
          console.error("Camera access failed", err);
        }
      })();

      const timer = setTimeout(() => {
        if (dbEmployees.length > 0) {
          const targetEmp = dbEmployees.find(emp => emp.code === "5011" || emp.code === "0632") || dbEmployees[0];
          handleScanSuccess({
            id: targetEmp.id,
            code: targetEmp.code,
            name: targetEmp.name,
            designation: targetEmp.designation,
            showroom: targetEmp.locationOutlet,
            division: targetEmp.division || "Dhaka Division",
            gradeGroup: targetEmp.gradeGroup || "",
            avatarImage: targetEmp.avatarImage,
            avatarScale: targetEmp.avatarScale,
            avatarX: targetEmp.avatarX,
            avatarY: targetEmp.avatarY
          });
        } else {
          alert("No employee profiles found in the database. Please import employee records via the Admin panel first.");
          setIsScannerOpen(false);
        }
      }, 2500);

      return () => {
        cancelled = true;
        clearTimeout(timer);
        cleanupCamera();
      };
    }
  }, [isScannerOpen, dbEmployees]);

  const cleanupCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleScanSuccess = (employee: any) => {
    cleanupCamera();
    setIsScannerOpen(false);
    
    // Check if employee already has an assessment record in list
    const existing = pastAssessments.find((a) => a.employeeProfileId === employee.id);
    if (existing) {
      setScannedEmployee(employee);
      setScores(existing.scores);
      setRemarks(existing.remarks);
      setEditingId(existing.id.replace("REP-", ""));
      
      const initialSkipped: Record<string, boolean> = {};
      CRITERIA.forEach((c) => {
        initialSkipped[c.key] = existing.scores[c.key] === 0;
      });
      setSkipped(initialSkipped);
    } else {
      setScannedEmployee(employee);
      setScores(Object.fromEntries(CRITERIA.map((c) => [c.key, 5])));
      setRemarks(Object.fromEntries(CRITERIA.map((c) => [c.key, ""])));
      setEditingId(null);
      setSkipped({});
    }
    setFormReferrer("portal");
    setViewMode("form");
  };

  const handleEditCard = (a: any) => {
    setScannedEmployee({
      id: a.employeeProfileId,
      code: a.employeeId,
      name: a.employeeName,
      designation: a.designation,
      showroom: a.showroom,
      division: a.division,
      gradeGroup: a.gradeGroup || ""
    });
    setScores(a.scores);
    setRemarks(a.remarks);
    setEditingId(a.id.replace("REP-", ""));
    
    const initialSkipped: Record<string, boolean> = {};
    CRITERIA.forEach((c) => {
      initialSkipped[c.key] = a.scores[c.key] === 0;
    });
    setSkipped(initialSkipped);

    setFormReferrer("history");
    setViewMode("form");
  };

  const handleFormSubmit = async () => {
    const payload = {
      employeeProfileId: scannedEmployee.id,
      visitDate: new Date().toISOString(),
      customerDealingScore: scores.customerDealing,
      customerDealingRemarks: remarks.customerDealing || "",
      productKnowledgeScore: scores.productKnowledge,
      productKnowledgeRemarks: remarks.productKnowledge || "",
      groomingScore: scores.grooming,
      groomingRemarks: remarks.grooming || "",
      demonstrationSkillScore: scores.demonstrationSkill,
      demonstrationSkillRemarks: remarks.demonstrationSkill || "",
      disciplineScore: scores.discipline,
      disciplineRemarks: remarks.discipline || ""
    };

    try {
      let res;
      if (editingId) {
        // PUT update
        res = await fetch(`http://localhost:5276/api/ShowroomVisitEvaluation/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // POST create
        res = await fetch("http://localhost:5276/api/ShowroomVisitEvaluation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        if (!editingId) {
          const saved = await res.json();
          const createdId = "REP-" + saved.id;
          const currentMyAudits = [...myAuditIds, createdId];
          setMyAuditIds(currentMyAudits);
          localStorage.setItem("transcom_my_audit_ids", JSON.stringify(currentMyAudits));
        }
        await loadEvaluations();
        setViewMode("submitted");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errMsg = await res.text();
        alert("Failed to submit audit: " + errMsg);
      }
    } catch (err) {
      console.error("Failed to save evaluation:", err);
      alert("A network error occurred while saving evaluation.");
    }
  };

  return (
    <>
      {viewMode === "portal" && (
        <PortalView
          pastAssessments={pastAssessments}
          setViewMode={setViewMode}
          setIsScannerOpen={setIsScannerOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          isLoading={isLoading}
          paginatedLeaderboard={paginatedLeaderboard}
          myAuditIds={myAuditIds}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          PAGE_SIZE={PAGE_SIZE}
        />
      )}

      {viewMode === "history" && (
        <HistoryView
          setViewMode={setViewMode}
          pastAssessments={pastAssessments}
          handleEditCard={handleEditCard}
        />
      )}

      {viewMode === "submitted" && (
        <SubmittedView
          setViewMode={setViewMode}
          formAvg={formAvg}
        />
      )}

      {viewMode === "form" && (
        <EvaluationForm
          setViewMode={setViewMode}
          formReferrer={formReferrer}
          editingId={editingId}
          scannedEmployee={scannedEmployee}
          scannedAvatar={scannedAvatar}
          scores={scores}
          setScores={setScores}
          remarks={remarks}
          setRemarks={setRemarks}
          skipped={skipped}
          handleToggleSkip={handleToggleSkip}
          formAvg={formAvg}
          handleFormSubmit={handleFormSubmit}
        />
      )}

      <ScannerModal
        isScannerOpen={isScannerOpen}
        setIsScannerOpen={setIsScannerOpen}
        videoRef={videoRef}
      />
    </>
  );
}
