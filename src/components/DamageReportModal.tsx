import React, { useState, useEffect } from 'react';
import { SportsFacility, WardData, DamageReport, DamageCategory } from '../types';
import { runCvDamageAssessment, CVInferenceResult } from '../services/aiEngine';
import confetti from 'canvas-confetti';
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Scan, 
  Copy, 
  Check, 
  ShieldAlert,
  Clock,
  ArrowRight
} from 'lucide-react';

interface DamageReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: SportsFacility[];
  wards: WardData[];
  initialFacility?: SportsFacility | null;
  onSubmitReport: (report: DamageReport) => void;
}

export const DamageReportModal: React.FC<DamageReportModalProps> = ({
  isOpen,
  onClose,
  facilities,
  wards,
  initialFacility,
  onSubmitReport
}) => {
  if (!isOpen) return null;

  // Form State
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    initialFacility?.id || facilities[0]?.id || ''
  );
  const [citizenName, setCitizenName] = useState('Vikram Malhotra');
  const [citizenPhone, setCitizenPhone] = useState('+91 98110 44821');
  const [description, setDescription] = useState('');
  const [userLocationStatus, setUserLocationStatus] = useState<string>('Auto-detecting GPS coordinates...');
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Photo & CV AI State
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [cvResult, setCvResult] = useState<CVInferenceResult | null>(null);
  const [categoryHint, setCategoryHint] = useState<DamageCategory>('Damaged Equipment');
  const [submittedReport, setSubmittedReport] = useState<DamageReport | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<boolean>(false);

  // Sample Damaged Photos for rapid demo testing
  const demoDefectPhotos = [
    {
      label: 'Broken Open Gym Axis',
      category: 'Damaged Equipment' as DamageCategory,
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      desc: 'Gym equipment welded pivot joint severed, dangerous exposed jagged steel edges.'
    },
    {
      label: 'Cracked Volleyball Court',
      category: 'Broken Turf/Court' as DamageCategory,
      url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
      desc: 'Severe deep fissure across court center with broken concrete chunks.'
    },
    {
      label: 'Floodlight Driver Fault',
      category: 'Lighting Failure' as DamageCategory,
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      desc: 'North quad floodlight bank dark and exposed wires hanging from junction box.'
    },
    {
      label: 'Sanitation / Trash Overflow',
      category: 'Cleanliness Issue' as DamageCategory,
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
      desc: 'Municipal garbage dump accumulating near track perimeter with stagnant water.'
    }
  ];

  // Geolocation auto-fetch on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoordinates({ lat, lng });
          setUserLocationStatus(`GPS Locked: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);

          // Find closest facility
          if (!initialFacility) {
            let closest = facilities[0];
            let minDist = Infinity;
            facilities.forEach((fac) => {
              const d = Math.hypot(fac.lat - lat, fac.lng - lng);
              if (d < minDist) {
                minDist = d;
                closest = fac;
              }
            });
            if (closest) setSelectedFacilityId(closest.id);
          }
        },
        () => {
          setUserLocationStatus('GPS Default: New Delhi Municipal Ward Cluster');
        }
      );
    } else {
      setUserLocationStatus('GPS Default: New Delhi Municipal Ward Cluster');
    }
  }, [facilities, initialFacility]);

  // Run initial CV scan when modal opens or image changes
  useEffect(() => {
    runScan(selectedImageUrl, categoryHint);
  }, [selectedImageUrl]);

  const runScan = async (imgUrl: string, cat: string) => {
    setIsScanning(true);
    try {
      const result = await runCvDamageAssessment(imgUrl, cat);
      setCvResult(result);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectDemoPhoto = (photo: typeof demoDefectPhotos[0]) => {
    setSelectedImageUrl(photo.url);
    setCategoryHint(photo.category);
    setDescription(photo.desc);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setSelectedImageUrl(url);
    runScan(url, categoryHint);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facility = facilities.find((f) => f.id === selectedFacilityId) || facilities[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingId = `ULB-DEL-2026-${randomSuffix}`;

    const newReport: DamageReport = {
      id: `rep-${Date.now()}`,
      trackingId,
      facilityId: facility.id,
      facilityName: facility.name,
      wardId: facility.wardId,
      wardName: facility.wardName,
      reportedAt: new Date().toISOString(),
      citizenName,
      citizenPhone,
      category: cvResult?.category || categoryHint,
      description: description || 'Citizen uploaded civic damage report with AI CV verification.',
      severityScore: cvResult?.severityScore || 85,
      confidenceScore: cvResult?.confidenceScore || 92.5,
      imageUrl: selectedImageUrl,
      boundingBox: cvResult?.boundingBox,
      status: 'Pending',
      slaDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      estimatedCostInr: cvResult?.estimatedRepairCostInr || 15000,
      notes: `Automated triage: ${cvResult?.detectedDefects.join(', ')}`
    };

    onSubmitReport(newReport);
    setSubmittedReport(newReport);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopyId = () => {
    if (submittedReport) {
      navigator.clipboard.writeText(submittedReport.trackingId);
      setCopiedTrackingId(true);
      setTimeout(() => setCopiedTrackingId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Crowdsourced Facility Condition Report
              </h3>
              <p className="text-xs text-orange-100">
                AI-Verified Photo Inspection & ULB 48-Hour SLA Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedReport ? (
          /* Confirmation State */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                AI Verified & Dispatched to Municipal SLA Queue
              </span>
              <h4 className="text-xl font-extrabold text-slate-900 mt-2">
                Grievance Successfully Registered
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your report for <b>{submittedReport.facilityName}</b> has been queued for Ward Executive Engineer inspection.
              </p>
            </div>

            {/* Tracking ID Badge */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Official ULB Tracking Reference ID
                </span>
                <span className="font-mono font-extrabold text-slate-900 text-base">
                  {submittedReport.trackingId}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className="flex items-center space-x-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
              >
                {copiedTrackingId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTrackingId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* SLA Clock preview */}
            <div className="flex items-center justify-center space-x-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 max-w-md mx-auto">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>
                Mandatory Resolution SLA: <b>48 Hours</b> (Countdown Active)
              </span>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmittedReport(null);
                  onClose();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Done / Return to Map
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* GPS & Facility Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sports Facility
                </label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-orange-500 outline-hidden"
                  required
                >
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name} ({fac.wardName.split('-')[1]?.trim() || fac.wardName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Location Telemetry
                </label>
                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate font-mono text-[11px]">{userLocationStatus}</span>
                </div>
              </div>
            </div>

            {/* Photo Upload & AI Computer Vision Scanning Preview */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                <span>Facility Defect Photo (CV Auto-Triage)</span>
                <span className="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  YOLOv8 / MobileNet Inference
                </span>
              </label>

              {/* Sample Photo selector for quick demo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {demoDefectPhotos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDemoPhoto(p)}
                    className={`relative rounded-xl overflow-hidden border-2 text-left p-1 transition-all ${
                      selectedImageUrl === p.url
                        ? 'border-orange-500 ring-2 ring-orange-500/30'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-12 object-cover rounded-lg" />
                    <span className="text-[10px] font-bold text-slate-800 line-clamp-1 mt-1 block">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Image Preview Container with Bounding Box Overlay & Drag-and-Drop */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative w-full h-52 sm:h-56 bg-slate-900 rounded-2xl overflow-hidden border transition-all flex items-center justify-center ${
                  isDragging ? 'border-orange-500 ring-4 ring-orange-500/40' : 'border-slate-200'
                }`}
              >
                <img
                  src={selectedImageUrl}
                  alt="Defect Preview"
                  className={`w-full h-full object-cover transition-opacity ${isDragging ? 'opacity-30' : 'opacity-100'}`}
                />

                {/* Drag and Drop Active Overlay */}
                {isDragging && (
                  <div className="absolute inset-0 bg-orange-600/60 backdrop-blur-xs flex flex-col items-center justify-center text-white pointer-events-none z-10 animate-in fade-in">
                    <UploadCloud className="w-10 h-10 mb-2 animate-bounce" />
                    <span className="font-extrabold text-sm">Drop facility defect photo here</span>
                    <span className="text-xs text-orange-100">Supports JPG, PNG, WebP</span>
                  </div>
                )}

                {/* AI Radar Scan Line Animation */}
                {isScanning && (
                  <div className="absolute inset-0 bg-orange-500/15 flex flex-col justify-between pointer-events-none">
                    <div className="h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" />
                    <div className="text-center py-2 bg-black/60 text-white text-xs font-bold flex items-center justify-center gap-2">
                      <Scan className="w-4 h-4 animate-spin text-orange-400" />
                      <span>Scanning Defect Coordinates & Severity Matrix...</span>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" />
                  </div>
                )}

                {/* AI Computer Vision Bounding Box Overlay */}
                {!isScanning && cvResult && cvResult.boundingBox && (
                  <div
                    className="absolute border-2 border-red-500 bg-red-500/20 rounded-lg flex flex-col justify-between p-1 text-[10px] font-mono font-bold text-white shadow-lg pointer-events-none transition-all duration-300"
                    style={{
                      left: `${cvResult.boundingBox.x}%`,
                      top: `${cvResult.boundingBox.y}%`,
                      width: `${cvResult.boundingBox.width}%`,
                      height: `${cvResult.boundingBox.height}%`
                    }}
                  >
                    <div className="bg-red-600 text-white px-1.5 py-0.5 rounded-sm inline-block self-start text-[9px] shadow-sm">
                      {cvResult.category} [{cvResult.confidenceScore}% Conf]
                    </div>
                    <div className="text-[9px] bg-black/70 px-1 py-0.5 rounded-xs self-end">
                      Sev: {cvResult.severityScore}%
                    </div>
                  </div>
                )}

                {/* Upload own photo trigger */}
                <label className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer shadow-md flex items-center gap-1.5 border border-slate-200 transition-all">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload / Drop File</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* CV Diagnostics Feedback */}
              {cvResult && (
                <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 mb-1.5">
                    <span className="flex items-center gap-1.5 text-slate-800">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      AI Damage Assessment: <span className="text-red-700">{cvResult.category}</span>
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                      Severity: {cvResult.severityScore}%
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cvResult.detectedDefects.map((def, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-medium">
                        ✓ {def}
                      </span>
                    ))}
                    <span className="bg-orange-50 border border-orange-200 text-orange-800 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Est. Repair: ₹{cvResult.estimatedRepairCostInr.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Contact Details */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Citizen Grievance Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Describe the issue (e.g. Broken bench, sheared cable, tripping hazard)..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-orange-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Citizen Name
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-orange-500 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Contact Mobile (SMS Updates)
                </label>
                <input
                  type="text"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-orange-500 outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isScanning}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Submit Grievance to ULB</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
