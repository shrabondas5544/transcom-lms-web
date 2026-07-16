"use client";

import { useState, useEffect, useRef } from "react";

interface Geofence {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
  allowedRadiusMeters: number;
}

export default function AdminAttendancePage() {
  const [geofenceList, setGeofenceList] = useState<Geofence[]>([]);
  const [distinctLocations, setDistinctLocations] = useState<string[]>([]);
  const [geofenceForm, setGeofenceForm] = useState({
    locationName: "",
    latitude: "23.8103",
    longitude: "90.4125",
    allowedRadiusMeters: "200"
  });
  const [geofenceSaving, setGeofenceSaving] = useState(false);
  const [geofenceSaveMsg, setGeofenceSaveMsg] = useState<string | null>(null);
  const [editingGeofenceId, setEditingGeofenceId] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Leaflet references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    fetchGeofences();
    fetchDistinctLocations();
    loadLeafletAssets();
  }, []);

  const loadLeafletAssets = () => {
    if (typeof window === "undefined") return;
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Load CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);
  };

  const fetchGeofences = async () => {
    try {
      const res = await fetch("http://localhost:5276/api/LocationGeofence");
      if (res.ok) setGeofenceList(await res.json());
    } catch (err) {
      console.error("Error fetching geofences:", err);
    }
  };

  const fetchDistinctLocations = async () => {
    try {
      const res = await fetch("http://localhost:5276/api/LocationGeofence/locations");
      if (res.ok) setDistinctLocations(await res.json());
    } catch (err) {
      console.error("Error fetching distinct locations:", err);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapRef.current) return;

    const L = (window as any).L;
    const initialLat = parseFloat(geofenceForm.latitude) || 23.8103;
    const initialLng = parseFloat(geofenceForm.longitude) || 90.4125;

    // Create Map
    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 15);
    mapRef.current = map;

    // Add Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add Marker
    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Add Circle
    const radius = parseFloat(geofenceForm.allowedRadiusMeters) || 200;
    const circle = L.circle([initialLat, initialLng], {
      color: "#ef4444",
      fillColor: "#ef4444",
      fillOpacity: 0.15,
      radius: radius
    }).addTo(map);
    circleRef.current = circle;

    // Handle marker drag end to update inputs
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      setGeofenceForm(prev => ({
        ...prev,
        latitude: position.lat.toFixed(6),
        longitude: position.lng.toFixed(6)
      }));
      circle.setLatLng(position);
    });

  }, [leafletLoaded]);

  // Update Map Position & Radius circle in real-time
  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const lat = parseFloat(geofenceForm.latitude);
    const lng = parseFloat(geofenceForm.longitude);
    const rad = parseFloat(geofenceForm.allowedRadiusMeters) || 200;

    if (!isNaN(lat) && !isNaN(lng)) {
      const newPos = [lat, lng];
      if (markerRef.current) {
        markerRef.current.setLatLng(newPos);
      }
      if (circleRef.current) {
        circleRef.current.setLatLng(newPos);
        circleRef.current.setRadius(rad);
      }
      mapRef.current.panTo(newPos);
    }
  }, [geofenceForm.latitude, geofenceForm.longitude, geofenceForm.allowedRadiusMeters]);

  const handleSaveGeofence = async () => {
    if (!geofenceForm.locationName || !geofenceForm.latitude || !geofenceForm.longitude) {
      setGeofenceSaveMsg("⚠ Please select location and provide coordinates.");
      return;
    }
    setGeofenceSaving(true);
    setGeofenceSaveMsg(null);
    try {
      const payload = {
        id: editingGeofenceId ?? 0,
        locationName: geofenceForm.locationName,
        latitude: parseFloat(geofenceForm.latitude),
        longitude: parseFloat(geofenceForm.longitude),
        allowedRadiusMeters: parseInt(geofenceForm.allowedRadiusMeters) || 200
      };
      const method = editingGeofenceId ? "PUT" : "POST";
      const url = editingGeofenceId
        ? `http://localhost:5276/api/LocationGeofence/${editingGeofenceId}`
        : "http://localhost:5276/api/LocationGeofence";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setGeofenceSaveMsg("✓ Geofence saved successfully.");
        setGeofenceForm({ locationName: "", latitude: "23.8103", longitude: "90.4125", allowedRadiusMeters: "200" });
        setEditingGeofenceId(null);
        fetchGeofences();
      } else {
        setGeofenceSaveMsg("✕ Save failed. Please try again.");
      }
    } catch {
      setGeofenceSaveMsg("✕ Network error.");
    } finally {
      setGeofenceSaving(false);
    }
  };

  const handleDeleteGeofence = async (id: number) => {
    if (!confirm("Are you sure you want to remove this geofence?")) return;
    try {
      const res = await fetch(`http://localhost:5276/api/LocationGeofence/${id}`, { method: "DELETE" });
      if (res.ok) fetchGeofences();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleConfigureOutlet = (locName: string) => {
    const existing = geofenceList.find(g => g.locationName === locName);
    if (existing) {
      setEditingGeofenceId(existing.id);
      setGeofenceForm({
        locationName: existing.locationName,
        latitude: String(existing.latitude),
        longitude: String(existing.longitude),
        allowedRadiusMeters: String(existing.allowedRadiusMeters)
      });
    } else {
      setEditingGeofenceId(null);
      setGeofenceForm({
        locationName: locName,
        latitude: "23.8103",
        longitude: "90.4125",
        allowedRadiusMeters: "200"
      });
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(distinctLocations.length / PAGE_SIZE) || 1;
  const pageRows = distinctLocations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="p-6 lg:p-8 animate-fade-in-up">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Showroom config table (Shows 10 rows per page, starts directly below header) */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">Showroom / Office Geofence Configs</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">List of all imported showroom registry items and their status.</p>
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, distinctLocations.length)} of {distinctLocations.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Showroom Name</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Latitude</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Longitude</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Allowed Radius</th>
                  <th className="px-5 py-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageRows.map((locName) => {
                  const geo = geofenceList.find(g => g.locationName === locName);
                  return (
                    <tr key={locName} className={`hover:bg-slate-50/30 transition-colors ${geofenceForm.locationName === locName ? "bg-red-50/10" : ""}`}>
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-900">{locName}</td>
                      <td className="px-5 py-3.5 text-xs font-mono text-slate-600 font-medium">
                        {geo ? geo.latitude.toFixed(6) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-mono text-slate-600 font-medium">
                        {geo ? geo.longitude.toFixed(6) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {geo ? (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-250">
                            {geo.allowedRadiusMeters} meters
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-200">
                            Not Configured
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleConfigureOutlet(locName)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                              geo 
                                ? "bg-white text-slate-600 border-slate-200 hover:border-red-300"
                                : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                            }`}
                          >
                            {geo ? "Edit" : "Configure"}
                          </button>
                          {geo && (
                            <button
                              onClick={() => handleDeleteGeofence(geo.id)}
                              className="text-[10px] font-bold text-slate-400 hover:text-red-755 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-red-300 transition-colors cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {distinctLocations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-xs text-slate-400 italic font-medium">
                      No showrooms registry loaded in database yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination Controls */}
          {distinctLocations.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
              <span className="text-xs text-slate-500 font-medium">
                Page <span className="font-bold text-slate-700">{currentPage}</span> of <span className="font-bold text-slate-700">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 text-[10px] font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  ← Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1.5 text-[10px] font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Stacked Map and Configure Boundary Form (Matching widths) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Pure Leaflet Map (Rounded, clean, matches width of form) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div 
              ref={mapContainerRef} 
              className="w-full h-72 bg-slate-100 relative z-0"
              style={{ minHeight: "280px" }}
            >
              {!leafletLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-bold bg-slate-900 rounded-2xl animate-pulse">
                  Initializing GIS Map Layers...
                </div>
              )}
            </div>
          </div>

          {/* Configure Boundary Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Configure Boundary</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Manage coordinates and geofence radius checks.</p>
            </div>

            <div className="space-y-3.5">
              {/* Showroom name dropdown */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Outlet Location</label>
                <select
                  value={geofenceForm.locationName}
                  onChange={(e) => setGeofenceForm({ ...geofenceForm, locationName: e.target.value })}
                  className="w-full text-[11px] font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 bg-white text-slate-855 focus:outline-none focus:ring-1 focus:ring-red-300"
                >
                  <option value="">— Select Outlet from imported list —</option>
                  {distinctLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Latitude and Longitude */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={geofenceForm.latitude}
                    onChange={(e) => setGeofenceForm({ ...geofenceForm, latitude: e.target.value })}
                    placeholder="e.g. 23.8103"
                    className="w-full text-[11px] font-medium border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={geofenceForm.longitude}
                    onChange={(e) => setGeofenceForm({ ...geofenceForm, longitude: e.target.value })}
                    placeholder="e.g. 90.4125"
                    className="w-full text-[11px] font-medium border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-300"
                  />
                </div>
              </div>

              {/* Allowed Radius selector */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Allowed Range Radius</label>
                <div className="flex gap-1.5 flex-wrap mt-1">
                  {[50, 100, 150, 200, 300, 500].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setGeofenceForm({ ...geofenceForm, allowedRadiusMeters: String(r) })}
                      className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        geofenceForm.allowedRadiusMeters === String(r)
                          ? "bg-red-600 text-white border-red-650"
                          : "bg-white text-slate-600 border-slate-200 hover:border-red-300"
                      }`}
                    >
                      {r}m
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom range radius (meters)"
                  value={geofenceForm.allowedRadiusMeters}
                  onChange={(e) => setGeofenceForm({ ...geofenceForm, allowedRadiusMeters: e.target.value })}
                  className="w-full mt-2 text-[11px] font-medium border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-300"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {editingGeofenceId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGeofenceId(null);
                      setGeofenceForm({ locationName: "", latitude: "23.8103", longitude: "90.4125", allowedRadiusMeters: "200" });
                    }}
                    className="flex-1 py-2 text-[11px] font-bold border border-slate-200 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  disabled={geofenceSaving}
                  onClick={handleSaveGeofence}
                  className={`flex-1 py-2 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                    geofenceSaving ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-red-600 text-white hover:bg-red-700 shadow-sm"
                  }`}
                >
                  {geofenceSaving ? "Saving..." : editingGeofenceId ? "Update Settings" : "Create Geofence"}
                </button>
              </div>

              {geofenceSaveMsg && (
                <p className={`text-[10px] font-bold mt-2 ${geofenceSaveMsg.startsWith("✓") ? "text-emerald-600" : "text-red-600"}`}>
                  {geofenceSaveMsg}
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
