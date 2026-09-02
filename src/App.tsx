/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, LanguageCode, SportsFacility, WardData, DamageReport } from './types';
import { WARDS_DATA, FACILITIES_DATA, INITIAL_DAMAGE_REPORTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { CitizenPortal } from './components/CitizenPortal';
import { OfficerDashboard } from './components/OfficerDashboard';
import { MinistryPortal } from './components/MinistryPortal';
import { DamageReportModal } from './components/DamageReportModal';
import { ShieldCheck, Flame, Award, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Current Active Role & Language
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Facilities & Wards State with Offline-First LocalStorage Sync
  const [facilities, setFacilities] = useState<SportsFacility[]>(() => {
    try {
      const cached = localStorage.getItem('openmove_facilities_v1');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return FACILITIES_DATA;
  });

  const [wards, setWards] = useState<WardData[]>(() => {
    try {
      const cached = localStorage.getItem('openmove_wards_v1');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return WARDS_DATA;
  });

  // Grievance Reports
  const [grievances, setGrievances] = useState<DamageReport[]>(() => {
    try {
      const cached = localStorage.getItem('openmove_grievances_v1');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_DAMAGE_REPORTS;
  });

  // Sync to LocalStorage for zero-connectivity offline capability
  useEffect(() => {
    try {
      localStorage.setItem('openmove_facilities_v1', JSON.stringify(facilities));
      localStorage.setItem('openmove_wards_v1', JSON.stringify(wards));
      localStorage.setItem('openmove_grievances_v1', JSON.stringify(grievances));
    } catch (e) {
      console.warn('Failed to cache in LocalStorage:', e);
    }
  }, [facilities, wards, grievances]);

  // Selected Facility for detail inspection or map panning
  const [selectedFacility, setSelectedFacility] = useState<SportsFacility | null>(null);

  // Damage Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [reportModalFacility, setReportModalFacility] = useState<SportsFacility | null>(null);

  // Open damage report modal with optional preselected facility
  const handleOpenDamageReport = (facility?: SportsFacility) => {
    setReportModalFacility(facility || null);
    setIsReportModalOpen(true);
  };

  // Handle new citizen report submission
  const handleAddDamageReport = (newReport: DamageReport) => {
    setGrievances((prev) => [newReport, ...prev]);

    // Lower facility condition score slightly until repaired
    setFacilities((prev) =>
      prev.map((f) => {
        if (f.id === newReport.facilityId) {
          const newScore = Math.max(25, f.conditionScore - 12);
          return {
            ...f,
            conditionScore: newScore,
            conditionStatus: newScore < 60 ? 'Critical Repair Needed' : 'Fair'
          };
        }
        return f;
      })
    );
  };

  // Handle officer status transitions (Dispatched -> In Progress -> Resolved)
  const handleUpdateGrievanceStatus = (
    id: string,
    newStatus: DamageReport['status'],
    contractor?: string,
    workOrder?: string
  ) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return {
            ...g,
            status: newStatus,
            assignedContractor: contractor || g.assignedContractor,
            workOrderNumber: workOrder || g.workOrderNumber
          };
        }
        return g;
      })
    );

    // If resolved, restore facility condition score
    if (newStatus === 'Resolved') {
      const targetGrievance = grievances.find((g) => g.id === id);
      if (targetGrievance) {
        setFacilities((prev) =>
          prev.map((f) => {
            if (f.id === targetGrievance.facilityId) {
              const restoredScore = Math.min(95, f.conditionScore + 18);
              return {
                ...f,
                conditionScore: restoredScore,
                conditionStatus: restoredScore >= 85 ? 'Excellent' : 'Good'
              };
            }
            return f;
          })
        );
      }
    }
  };

  const pendingGrievanceCount = grievances.filter((g) => g.status === 'Pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Sticky Top Navbar with RBAC & Indic Switcher */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        language={language}
        onSelectLanguage={setLanguage}
        onOpenDamageReport={() => handleOpenDamageReport()}
        pendingGrievanceCount={pendingGrievanceCount}
      />

      {/* Main Role-Based View Container */}
      <main className="flex-1">
        {currentRole === 'citizen' && (
          <CitizenPortal
            facilities={facilities}
            wards={wards}
            language={language}
            onOpenDamageReport={handleOpenDamageReport}
            selectedFacility={selectedFacility}
            onSelectFacility={setSelectedFacility}
          />
        )}

        {currentRole === 'officer' && (
          <OfficerDashboard
            grievances={grievances}
            facilities={facilities}
            wards={wards}
            onUpdateGrievanceStatus={handleUpdateGrievanceStatus}
          />
        )}

        {currentRole === 'ministry' && (
          <MinistryPortal
            wards={wards}
            facilities={facilities}
          />
        )}
      </main>

      {/* Crowdsourced Damage Reporting Modal */}
      <DamageReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        facilities={facilities}
        wards={wards}
        initialFacility={reportModalFacility}
        onSubmitReport={handleAddDamageReport}
      />

      {/* Official Government Footer */}
      <footer className="no-print bg-slate-950 text-white border-t border-slate-800 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            
            {/* Gov & Movement Marks */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-md">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-100">
                  OPENMOVE India • National Sports Infrastructure Platform
                </h4>
                <p className="text-[11px] text-slate-400">
                  An initiative for Smart India Hackathon (SIH 2026) • Ministry of Youth Affairs & Sports (MYAS) & MoHUA
                </p>
              </div>
            </div>

            {/* Accreditations */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-amber-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Khelo India Scheme</span>
              </div>
              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fit India Movement</span>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              © 2026 Government of India. Open-Source GovTech Architecture built with Leaflet, PostGIS GeoJSON, and Computer Vision Micro-models.
            </div>
            <div className="flex space-x-4 font-medium">
              <span className="hover:text-slate-400 cursor-pointer">Citizen Charter</span>
              <span className="hover:text-slate-400 cursor-pointer">48-Hour SLA Guidelines</span>
              <span className="hover:text-slate-400 cursor-pointer">Bhuvan ISRO Tile Server</span>
              <span className="hover:text-slate-400 cursor-pointer">Open Data API</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
