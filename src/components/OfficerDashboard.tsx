import React, { useState } from 'react';
import { DamageReport, SportsFacility, WardData } from '../types';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Building2, 
  FileText, 
  UserCheck, 
  DollarSign, 
  Sparkles, 
  Filter, 
  Calendar, 
  Phone,
  ShieldAlert,
  ArrowRight,
  Send,
  Eye,
  Check
} from 'lucide-react';

interface OfficerDashboardProps {
  grievances: DamageReport[];
  facilities: SportsFacility[];
  wards: WardData[];
  onUpdateGrievanceStatus: (id: string, newStatus: DamageReport['status'], contractor?: string, workOrder?: string) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  grievances,
  facilities,
  wards,
  onUpdateGrievanceStatus
}) => {
  const [selectedWardId, setSelectedWardId] = useState<string>('all');
  const [selectedGrievance, setSelectedGrievance] = useState<DamageReport | null>(null);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'kanban' | 'assets'>('kanban');

  // Work Order Form State
  const [contractorName, setContractorName] = useState('Delhi Municipal Rapid Repair Cell');
  const [technicianName, setTechnicianName] = useState('Suresh Kumar (Junior Engineer)');
  const [technicianPhone, setTechnicianPhone] = useState('+91 98100 23411');
  const [allocatedBudget, setAllocatedBudget] = useState<number>(18000);

  // Filter grievances by selected ward
  const filteredGrievances = grievances.filter((g) => {
    if (selectedWardId !== 'all' && g.wardId !== selectedWardId) return false;
    return true;
  });

  // Calculate SLA countdown status
  const getSlaStatus = (deadlineStr: string, status: DamageReport['status']) => {
    if (status === 'Resolved') {
      return { text: 'Resolved On Time', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', isBreached: false };
    }

    const remainingMs = new Date(deadlineStr).getTime() - Date.now();
    const remainingHours = Math.round(remainingMs / (1000 * 3600));

    if (remainingHours <= 0) {
      return { 
        text: `SLA BREACHED (${Math.abs(remainingHours)}h overdue)`, 
        color: 'text-red-700 bg-red-100 border-red-300 font-black animate-pulse', 
        isBreached: true 
      };
    } else if (remainingHours <= 12) {
      return { 
        text: `Urgent (${remainingHours}h remaining)`, 
        color: 'text-orange-800 bg-orange-100 border-orange-300 font-bold', 
        isBreached: false 
      };
    } else {
      return { 
        text: `${remainingHours}h remaining on 48h SLA`, 
        color: 'text-blue-700 bg-blue-50 border-blue-200', 
        isBreached: false 
      };
    }
  };

  const handleOpenWorkOrder = (report: DamageReport) => {
    setSelectedGrievance(report);
    setAllocatedBudget(report.estimatedCostInr || 15000);
    setIsWorkOrderModalOpen(true);
  };

  const handleDispatchWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;

    const randomWo = `WO-${selectedGrievance.wardName.substring(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;
    onUpdateGrievanceStatus(selectedGrievance.id, 'Dispatched', contractorName, randomWo);

    setIsWorkOrderModalOpen(false);
    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  const handleMarkResolved = (report: DamageReport) => {
    onUpdateGrievanceStatus(report.id, 'Resolved');
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  // Kanban Columns
  const pendingReports = filteredGrievances
    .filter((g) => g.status === 'Pending')
    .sort((a, b) => b.severityScore - a.severityScore);

  const dispatchedReports = filteredGrievances.filter((g) => g.status === 'Dispatched');
  const inProgressReports = filteredGrievances.filter((g) => g.status === 'In Progress');
  const resolvedReports = filteredGrievances.filter((g) => g.status === 'Resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Officer Controls Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm">
              Zonal Command & Control
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Ward Executive Engineer Portal
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Municipal Infrastructure Grievance & SLA Desk
          </h1>
          <p className="text-xs text-slate-500">
            Real-time triage of AI-verified citizen reports with 48-Hour SLA enforcement.
          </p>
        </div>

        {/* Filters & View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Ward filter dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedWardId}
              onChange={(e) => setSelectedWardId(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 outline-hidden cursor-pointer"
            >
              <option value="all">All Delhi Wards (5 Wards)</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'kanban' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              SLA Kanban
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'assets' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Ward Assets ({facilities.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Pending AI Triage
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">{pendingReports.length}</span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              Highest Sev: {pendingReports[0]?.severityScore || 0}%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Work Orders Dispatched
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-blue-700">
              {dispatchedReports.length + inProgressReports.length}
            </span>
            <span className="text-xs font-medium text-slate-500">Active Field Crews</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            SLA Compliance Rate
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-700">91.4%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              48h Target
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Total Resolved Defects
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-800">{resolvedReports.length}</span>
            <span className="text-xs font-medium text-slate-500">Zero Pending Audits</span>
          </div>
        </div>
      </div>

      {activeTab === 'kanban' ? (
        /* Real-Time Grievance Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Column 1: Pending AI Triage */}
          <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 flex flex-col space-y-3">
            <div className="flex items-center justify-between font-bold text-xs text-slate-800 pb-2 border-b border-slate-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                Pending AI Triage ({pendingReports.length})
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Sorted by AI Severity</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1">
              {pendingReports.length === 0 ? (
                <div className="bg-white p-6 rounded-xl text-center text-xs text-slate-400 font-medium">
                  No pending complaints in this ward.
                </div>
              ) : (
                pendingReports.map((report) => {
                  const sla = getSlaStatus(report.slaDeadline, report.status);

                  return (
                    <div
                      key={report.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5"
                    >
                      {/* Tracking ID & Severity */}
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-slate-400 block">
                            {report.trackingId}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">
                            {report.facilityName}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="bg-red-50 text-red-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-red-200">
                            Sev: {report.severityScore}%
                          </span>
                        </div>
                      </div>

                      {/* Photo Thumbnail + Bounding Box Alert */}
                      <div className="relative h-28 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                        <img src={report.imageUrl} alt="Defect" className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-red-400" />
                          <span>{report.category}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {report.description}
                      </p>

                      {/* SLA Timer Badge */}
                      <div className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center justify-between ${sla.color}`}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {sla.text}
                        </span>
                        <span>Est: ₹{(report.estimatedCostInr || 15000).toLocaleString()}</span>
                      </div>

                      {/* Action: Generate Work Order */}
                      <button
                        onClick={() => handleOpenWorkOrder(report)}
                        className="w-full mt-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-400" />
                        <span>Issue Work Order</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 2: Work Order Dispatched & Repair In Progress */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200/60 flex flex-col space-y-3">
            <div className="flex items-center justify-between font-bold text-xs text-blue-900 pb-2 border-b border-blue-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                Dispatched to Field Crew ({dispatchedReports.length + inProgressReports.length})
              </span>
              <span className="text-[10px] text-blue-600 font-semibold">Active Work Orders</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1">
              {[...dispatchedReports, ...inProgressReports].length === 0 ? (
                <div className="bg-white p-6 rounded-xl text-center text-xs text-slate-400 font-medium border border-blue-100">
                  No active field work orders.
                </div>
              ) : (
                [...dispatchedReports, ...inProgressReports].map((report) => {
                  const sla = getSlaStatus(report.slaDeadline, report.status);

                  return (
                    <div
                      key={report.id}
                      className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-blue-600 block">
                            {report.workOrderNumber || 'WO-PENDING'}
                          </span>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">
                            {report.facilityName}
                          </h4>
                        </div>
                        <span className="bg-blue-100 text-blue-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          Dispatched
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-700 space-y-1">
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{report.assignedContractor || 'Delhi Municipal Rapid Cell'}</span>
                        </div>
                        <div className="text-slate-500">
                          {report.notes || 'Bitumen patch repair team mobilized.'}
                        </div>
                      </div>

                      {/* SLA Timer */}
                      <div className={`text-[10px] font-bold px-2 py-1 rounded-lg border flex items-center justify-between ${sla.color}`}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {sla.text}
                        </span>
                      </div>

                      {/* Action: Mark Resolved */}
                      <button
                        onClick={() => handleMarkResolved(report)}
                        className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Field Repair & Resolve</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Column 3: Resolved & Verified */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/60 flex flex-col space-y-3">
            <div className="flex items-center justify-between font-bold text-xs text-emerald-900 pb-2 border-b border-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Resolved & Verified ({resolvedReports.length})
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Audit Cleared</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[620px] pr-1">
              {resolvedReports.length === 0 ? (
                <div className="bg-white p-6 rounded-xl text-center text-xs text-slate-400 font-medium border border-emerald-100">
                  No resolved reports yet.
                </div>
              ) : (
                resolvedReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-2 opacity-90"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-400 block">
                          {report.trackingId}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">
                          {report.facilityName}
                        </h4>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Resolved
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      {report.description}
                    </p>

                    <div className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium flex items-center justify-between">
                      <span>Certified by Junior Engineer</span>
                      <span>₹{(report.estimatedCostInr || 12000).toLocaleString()} Cleared</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Ward Level Facility Asset Management Table */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Ward-Level Sports Infrastructure Asset Register
            </h3>
            <span className="text-xs text-slate-500">
              Telemetry synchronized with MoHUA National Registry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 text-[10px] uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="py-3 px-4">Facility Name & Ward</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">AI Condition</th>
                  <th className="py-3 px-4">Access Model</th>
                  <th className="py-3 px-4">Active Telemetry</th>
                  <th className="py-3 px-4">Accreditation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {facilities.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{fac.name}</div>
                      <div className="text-[11px] text-slate-400">{fac.wardName}</div>
                    </td>
                    <td className="py-3 px-4">{fac.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold ${
                          fac.conditionScore >= 85 ? 'text-emerald-700' : fac.conditionScore >= 60 ? 'text-blue-700' : 'text-red-600'
                        }`}>
                          {fac.conditionScore}%
                        </span>
                        <span className="text-[10px] text-slate-400">({fac.conditionStatus})</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        fac.isFree ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {fac.isFree ? '100% Free' : 'Subsidized Pass'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-900 font-semibold">{fac.activeUsersNow} citizens</span> active
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {fac.fitIndiaCertified && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            Fit India
                          </span>
                        )}
                        {fac.kheloIndiaPartner && (
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            Khelo India
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Work Order Generation Modal */}
      {isWorkOrderModalOpen && selectedGrievance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Issue Municipal Maintenance Work Order
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Ref: {selectedGrievance.trackingId}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsWorkOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatchWorkOrder} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Facility</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold">
                  {selectedGrievance.facilityName} ({selectedGrievance.wardName})
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Repair Contractor</label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Supervising Engineer</label>
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Engineer Phone</label>
                  <input
                    type="text"
                    value={technicianPhone}
                    onChange={(e) => setTechnicianPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Authorized Budget Sanction (INR)</label>
                <input
                  type="number"
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-hidden"
                  required
                />
              </div>

              <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200 text-[11px]">
                ⚠️ <b>Automated Mandate:</b> Dispatched crew must complete physical repair within the remaining 48-Hour SLA timeline. SMS notification will be dispatched to citizen upon contractor arrival.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWorkOrderModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  Confirm & Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
