import React from "react";

interface ScannerModalProps {
  isScannerOpen: boolean;
  setIsScannerOpen: (open: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function ScannerModal({
  isScannerOpen,
  setIsScannerOpen,
  videoRef,
}: ScannerModalProps) {
  if (!isScannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 animate-fade-in">
      <div className="text-center pt-8">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Scanning QR Code</h3>
        <p className="text-xs text-slate-400 mt-1">Hold the employee badge code in front of the lens</p>
      </div>

      {/* Video viewport frame */}
      <div className="relative w-72 h-72 mx-auto rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-900 flex items-center justify-center">
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Scanner Grid Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-red-650 rounded-tl-lg"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-red-650 rounded-tr-lg"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-red-650 rounded-bl-lg"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-red-650 rounded-br-lg"></div>
          <div className="w-full h-0.5 bg-red-600/80 shadow-[0_0_8px_2px_rgba(239,68,68,0.7)] animate-bounce"></div>
        </div>
      </div>

      <div className="pb-10 flex flex-col items-center">
        <span className="text-[10px] text-slate-500 font-medium block mb-4 animate-pulse">
          Connecting front lens...
        </span>
        <button 
          onClick={() => setIsScannerOpen(false)}
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Cancel Scan
        </button>
      </div>
    </div>
  );
}
