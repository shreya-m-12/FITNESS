import React from 'react';
import { UserRole, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  ShieldCheck, 
  MapPin, 
  Flame, 
  Languages, 
  Wifi, 
  AlertTriangle, 
  Building2, 
  Layers3, 
  Award,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  language: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  onOpenDamageReport: () => void;
  pendingGrievanceCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  language,
  onSelectLanguage,
  onOpenDamageReport,
  pendingGrievanceCount
}) => {
  const t = TRANSLATIONS[language];

  const languagesList: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Gov. of India Tricolor Ribbon & Ministry Header */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-amber-600/30">
        <div className="flex items-center space-x-3">
          {/* Indian Tricolor Stripe indicator */}
          <div className="flex h-3 w-4 rounded-xs overflow-hidden shadow-xs border border-white/20">
            <div className="w-full h-1 bg-[#FF671F]"></div>
            <div className="w-full h-1 bg-white flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-[#06038D]"></div>
            </div>
            <div className="w-full h-1 bg-[#046A38]"></div>
          </div>
          <span className="font-semibold tracking-wide text-slate-200 text-[11px] sm:text-xs">
            GOVERNMENT OF INDIA • MYAS & MoHUA • SMART INDIA HACKATHON 2026
          </span>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-slate-300">
          <span className="hidden md:inline-flex items-center text-amber-400 font-medium">
            <Flame className="w-3.5 h-3.5 mr-1" />
            Fit India Movement & Khelo India Integrated
          </span>
          <div className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-medium text-[10px]">PWA Offline Engine Active</span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectRole('citizen')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-black shadow-md shadow-orange-500/20">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  OPEN<span className="text-orange-600">MOVE</span> INDIA
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-sm">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight hidden sm:block">
                National Activity Equity & Sports Infrastructure Platform
              </p>
            </div>
          </div>

          {/* RBAC Role Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onSelectRole('citizen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'citizen'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.citizenPortal}</span>
            </button>

            <button
              onClick={() => onSelectRole('officer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                currentRole === 'officer'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t.officerDashboard}</span>
              {pendingGrievanceCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
                  {pendingGrievanceCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectRole('ministry')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'ministry'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers3 className="w-3.5 h-3.5" />
              <span>{t.ministryPortal}</span>
            </button>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Report Damage CTA */}
            <button
              onClick={onOpenDamageReport}
              className="flex items-center space-x-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-xs active:scale-98"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span className="hidden sm:inline">Report Broken Facility</span>
              <span className="sm:hidden">Report</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border border-slate-200">
                <Languages className="w-3.5 h-3.5 text-slate-600" />
                <span className="font-semibold uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Indic Languages
                </div>
                {languagesList.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onSelectLanguage(lang.code)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50 transition-colors ${
                      language === lang.code ? 'font-bold text-orange-600 bg-orange-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-400 uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Sub-Navigation for Roles */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => onSelectRole('citizen')}
            className={`px-3 py-1 rounded-md font-semibold text-xs ${
              currentRole === 'citizen' ? 'bg-orange-600 text-white' : 'text-slate-600'
            }`}
          >
            Citizen
          </button>
          <button
            onClick={() => onSelectRole('officer')}
            className={`px-3 py-1 rounded-md font-semibold text-xs relative ${
              currentRole === 'officer' ? 'bg-blue-600 text-white' : 'text-slate-600'
            }`}
          >
            Officer SLA ({pendingGrievanceCount})
          </button>
          <button
            onClick={() => onSelectRole('ministry')}
            className={`px-3 py-1 rounded-md font-semibold text-xs ${
              currentRole === 'ministry' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            Ministry AES
          </button>
        </div>

      </div>
    </header>
  );
};
