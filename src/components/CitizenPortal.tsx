import React, { useState, useMemo, useEffect } from 'react';
import { SportsFacility, WardData, LanguageCode, SearchConstraints } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { parseIndicVoiceQuery, ParsedIndicQuery, getMicroMovementRoutine } from '../services/aiEngine';
import { InteractiveMap } from './InteractiveMap';
import { 
  Search, 
  Mic, 
  MicOff, 
  Filter, 
  Sparkles, 
  Navigation, 
  CheckCircle2, 
  Flame, 
  Clock, 
  IndianRupee, 
  AlertCircle, 
  Zap,
  Users,
  Compass,
  Check,
  Home,
  Dumbbell,
  Footprints
} from 'lucide-react';

interface CitizenPortalProps {
  facilities: SportsFacility[];
  wards: WardData[];
  language: LanguageCode;
  onOpenDamageReport: (facility?: SportsFacility) => void;
  selectedFacility: SportsFacility | null;
  onSelectFacility: (facility: SportsFacility | null) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  facilities,
  wards,
  language,
  onOpenDamageReport,
  selectedFacility,
  onSelectFacility
}) => {
  const t = TRANSLATIONS[language];

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [durationFilter, setDurationFilter] = useState<number>(30);
  const [spaceFilter, setSpaceFilter] = useState<'all' | 'Indoor' | 'Outdoor' | 'Covered Turf' | 'Open Gym' | 'Home / Balcony'>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<'all' | 'None' | 'Basic' | 'Full' | 'Racquet/Ball' | 'Fitness Wear'>('all');
  const [freeOnlyFilter, setFreeOnlyFilter] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [parsedNLP, setParsedNLP] = useState<ParsedIndicQuery | null>(null);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState<boolean>(true);
  const [showHomeRoutine, setShowHomeRoutine] = useState<boolean>(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: 28.6250, lng: 77.2150 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {}
      );
    }
  }, []);

  // Quick Indic voice presets for instant SIH testing
  const sampleIndicPrompts = [
    { text: 'Mujhe pass mein free badminton ya running track chahiye 30 min ke liye', label: 'Hindi: 30m Free Badminton/Track' },
    { text: 'Near me open gym and jogging track without any equipment for 15 mins', label: 'English: 15m Open Gym' },
    { text: 'कम्युनिटी पार्क में योग और रनिंग ट्रैक 60 मिनट के लिए', label: 'Devanagari: 60m Yoga Park' },
    { text: 'இலவச நடைப்பயிற்சி மற்றும் உடற்பயிற்சி மைதானம் 30 நிமிடம்', label: 'Tamil: 30m Free Trail' }
  ];

  // Voice Query Simulator / Handler
  const handleVoiceSearch = (presetText?: string) => {
    const textToProcess = presetText || searchQuery;
    if (!textToProcess && !presetText) {
      setIsListening(true);
      // Simulate speech recognition
      setTimeout(() => {
        setIsListening(false);
        const demoSpeech = 'Mujhe pass mein free badminton ya running track chahiye 30 min ke liye';
        setSearchQuery(demoSpeech);
        const parsed = parseIndicVoiceQuery(demoSpeech);
        setParsedNLP(parsed);
        applyNLPConstraints(parsed);
      }, 1800);
      return;
    }

    const query = presetText || searchQuery;
    setSearchQuery(query);
    const parsed = parseIndicVoiceQuery(query);
    setParsedNLP(parsed);
    applyNLPConstraints(parsed);
  };

  const applyNLPConstraints = (parsed: ParsedIndicQuery) => {
    if (parsed.budget === 0) setFreeOnlyFilter(true);
    if (parsed.duration) setDurationFilter(parsed.duration);
    if (parsed.spaceType !== 'all') setSpaceFilter(parsed.spaceType);
    if (parsed.equipment !== 'all') setEquipmentFilter(parsed.equipment);
  };

  // Distance calculation from simulated/actual user location
  const getDistanceMetrics = (lat: number, lng: number) => {
    const dLat = (lat - userCoords.lat) * 111;
    const dLng = (lng - userCoords.lng) * 111 * Math.cos((userCoords.lat * Math.PI) / 180);
    const distKm = Math.hypot(dLat, dLng);
    const walkMins = Math.max(4, Math.round((distKm / 4.5) * 60));
    return {
      distKm: distKm.toFixed(1),
      walkMins
    };
  };

  // Micro-Movement Routine for constrained spaces (Home / Balcony or quick workouts)
  const microRoutine = useMemo(() => {
    return getMicroMovementRoutine(durationFilter, equipmentFilter, spaceFilter);
  }, [durationFilter, equipmentFilter, spaceFilter]);

  // Filter facilities based on constraints
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      // Free only constraint
      if (freeOnlyFilter && !fac.isFree) return false;

      // Space preference
      if (spaceFilter !== 'all' && spaceFilter !== 'Home / Balcony') {
        if (spaceFilter === 'Open Gym') {
          if (fac.category !== 'Open Gym & Park' && fac.spaceType !== 'Outdoor') return false;
        } else if (fac.spaceType !== spaceFilter) {
          return false;
        }
      }

      // Equipment constraint
      if (equipmentFilter === 'None') {
        if (fac.equipmentRequired !== 'None') return false;
      } else if (equipmentFilter === 'Basic') {
        if (fac.equipmentRequired === 'Full' || fac.equipmentRequired === 'Specialized Gear') return false;
      }

      // Text query match (name, sports, ward, address)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = fac.name.toLowerCase().includes(q) || (fac.nameHindi && fac.nameHindi.includes(q));
        const matchesSport = fac.sports.some(s => s.toLowerCase().includes(q));
        const matchesWard = fac.wardName.toLowerCase().includes(q);

        // Also check if NLP detected specific activity
        const matchesActivity = parsedNLP?.activity && parsedNLP.activity !== 'all'
          ? fac.sports.some(s => s.toLowerCase().includes(parsedNLP.activity))
          : false;

        if (!matchesName && !matchesSport && !matchesWard && !matchesActivity) {
          return false;
        }
      }

      return true;
    });
  }, [facilities, freeOnlyFilter, spaceFilter, equipmentFilter, searchQuery, parsedNLP]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Search & Indic Voice Matching Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVoiceSearch()}
              placeholder={t.voiceSearchPlaceholder}
              className="w-full pl-11 pr-24 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all outline-hidden"
            />

            {/* Mic / Voice Search Action */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={() => handleVoiceSearch()}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
                }`}
                title="Indic Voice AI Search"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5 animate-spin" /> : <Mic className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isListening ? t.listening : t.speakButton}</span>
              </button>
            </div>
          </div>

          {/* Quick Filters Toggle Button */}
          <button
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all w-full md:w-auto ${
              showFiltersDrawer || freeOnlyFilter || spaceFilter !== 'all' || equipmentFilter !== 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>{t.filterTitle}</span>
            {(freeOnlyFilter || spaceFilter !== 'all' || equipmentFilter !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            )}
          </button>
        </div>

        {/* Indic Speech NLP Preset Prompts for SIH Judges */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] font-bold text-slate-500 flex items-center shrink-0">
            <Sparkles className="w-3 h-3 text-amber-500 mr-1" />
            Try Indic Voice Queries:
          </span>
          {sampleIndicPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleVoiceSearch(p.text)}
              className="bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-medium transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Live Indic NLP Extraction Output Card */}
        {parsedNLP && (
          <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 text-xs">
            <div className="flex items-center justify-between font-bold text-orange-900 mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                AI Indic NLP Intent Extracted ({parsedNLP.detectedLanguage})
              </span>
              <button
                onClick={() => {
                  setParsedNLP(null);
                  setSearchQuery('');
                }}
                className="text-orange-700 hover:text-orange-900 text-[11px] underline"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700 mt-2 text-[11px]">
              <div className="bg-white/80 p-2 rounded-lg border border-orange-100">
                <span className="text-slate-400 block font-medium">Activity</span>
                <span className="font-bold text-slate-900 capitalize">{parsedNLP.activity}</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-orange-100">
                <span className="text-slate-400 block font-medium">Budget</span>
                <span className="font-bold text-slate-900">{parsedNLP.budget === 0 ? '₹0 (Free Public)' : 'Any'}</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-orange-100">
                <span className="text-slate-400 block font-medium">Target Time</span>
                <span className="font-bold text-slate-900">{parsedNLP.duration} Minutes</span>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-orange-100">
                <span className="text-slate-400 block font-medium">Space Archetype</span>
                <span className="font-bold text-slate-900">{parsedNLP.spaceType}</span>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Constraint Questionnaire */}
        {showFiltersDrawer && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            {/* 1. Time Available (15, 30, 45, 60+ mins) */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {t.duration}
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDurationFilter(mins)}
                    className={`py-1.5 px-1 rounded-lg text-xs font-semibold border transition-all text-center ${
                      durationFilter === mins
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mins === 60 ? '60m+' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Space constraint */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                {t.spaceType}
              </label>
              <select
                value={spaceFilter}
                onChange={(e) => setSpaceFilter(e.target.value as any)}
                className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-hidden"
              >
                <option value="all">{t.allSpaces}</option>
                <option value="Home / Balcony">{t.homeBalcony}</option>
                <option value="Outdoor">{t.outdoor}</option>
                <option value="Open Gym">{t.openGymSpace}</option>
                <option value="Covered Turf">{t.coveredTurf}</option>
                <option value="Indoor">{t.indoor}</option>
              </select>
            </div>

            {/* 3. Equipment constraint */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                {t.equipment}
              </label>
              <select
                value={equipmentFilter}
                onChange={(e) => setEquipmentFilter(e.target.value as any)}
                className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500 outline-hidden"
              >
                <option value="all">All Equipment Levels</option>
                <option value="None">{t.noEquipment}</option>
                <option value="Basic">{t.basicEquipment}</option>
                <option value="Full">{t.fullEquipment}</option>
              </select>
            </div>

            {/* 4. Budget Constraint: 100% Free Public vs Subsidized */}
            <div className="flex flex-col justify-end">
              <button
                onClick={() => setFreeOnlyFilter(!freeOnlyFilter)}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                  freeOnlyFilter
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {t.freeOnly}
                </span>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center ${freeOnlyFilter ? 'bg-white text-emerald-700' : 'border border-slate-300'}`}>
                  {freeOnlyFilter && <Check className="w-3 h-3" />}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* In-Home / Balcony Micro-Movement Routine Card (Displayed when Home/Balcony is picked or toggled) */}
      {(spaceFilter === 'Home / Balcony' || showHomeRoutine) && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-5 shadow-md border border-orange-400 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Fit India In-Situ Movement Generator
                </span>
                <h3 className="font-extrabold text-base text-white">
                  {microRoutine.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              <span className="bg-black/20 px-2.5 py-1 rounded-lg">
                ⏱ <b>{microRoutine.durationMin} mins</b>
              </span>
              <span className="bg-black/20 px-2.5 py-1 rounded-lg">
                🔥 <b>~{microRoutine.caloriesBurn} kcal</b>
              </span>
              <span className="bg-black/20 px-2.5 py-1 rounded-lg">
                📦 <b>{microRoutine.equipment}</b>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            {microRoutine.exercises.map((ex, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-200 font-bold block mb-1">
                    Movement 0{idx + 1}
                  </span>
                  <h4 className="font-bold text-white text-xs leading-snug">
                    {ex.name}
                  </h4>
                  <p className="text-[11px] text-orange-100 font-mono mt-1">
                    {ex.repsOrTime}
                  </p>
                </div>
                <p className="text-[10px] text-white/80 mt-2 italic bg-black/10 p-1.5 rounded-md">
                  💡 {ex.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Split Interface: Map & Facility Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Top: Interactive Map (7 columns on large screens) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-600" />
              Live Sports & Park Map (Delhi NCR Prototype)
            </h2>
            <span className="text-xs text-slate-500">
              Showing <b>{filteredFacilities.length}</b> verified facilities
            </span>
          </div>

          <div className="h-[440px] sm:h-[500px] w-full">
            <InteractiveMap
              facilities={filteredFacilities}
              wards={wards}
              selectedFacility={selectedFacility}
              onSelectFacility={onSelectFacility}
              onOpenReportForFacility={onOpenDamageReport}
              showWardsChoropleth={false}
            />
          </div>

          {/* Quick Stats banner */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">100% Free Public</span>
              <span className="text-base font-extrabold text-slate-900">
                {filteredFacilities.filter(f => f.isFree).length} Facilities
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Fit India Certified</span>
              <span className="text-base font-extrabold text-emerald-700">
                {filteredFacilities.filter(f => f.fitIndiaCertified).length} Centers
              </span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Condition</span>
              <span className="text-base font-extrabold text-blue-700">
                {Math.round(filteredFacilities.reduce((acc, f) => acc + f.conditionScore, 0) / (filteredFacilities.length || 1))}%
              </span>
            </div>
          </div>
        </div>

        {/* Right: Facility Cards List (5 columns on large screens) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              {t.facilitiesFound}
            </h2>
            {selectedFacility && (
              <button
                onClick={() => onSelectFacility(null)}
                className="text-xs text-orange-600 hover:underline font-semibold"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Facility Cards Scroll Container */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredFacilities.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No Facilities Match Filters</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try broadening your budget or space criteria.
                </p>
                <button
                  onClick={() => {
                    setFreeOnlyFilter(false);
                    setSpaceFilter('all');
                    setEquipmentFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredFacilities.map((facility) => {
                const isSelected = selectedFacility?.id === facility.id;
                const isCritical = facility.conditionStatus === 'Critical Repair Needed';
                const metrics = getDistanceMetrics(facility.lat, facility.lng);

                return (
                  <div
                    key={facility.id}
                    onClick={() => onSelectFacility(facility)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer hover:shadow-md ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                            {facility.wardName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                            <Footprints className="w-3 h-3 text-slate-500" />
                            {metrics.distKm} km • {metrics.walkMins}m walk
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 leading-snug mt-0.5">
                          {facility.name}
                        </h3>
                        {facility.nameHindi && (
                          <p className="text-xs text-slate-500 font-medium">
                            {facility.nameHindi}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          facility.isFree ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {facility.isFree ? t.freeBadge : t.paidBadge}
                        </span>
                      </div>
                    </div>

                    {/* Sports Tags */}
                    <div className="flex flex-wrap gap-1.5 my-2.5">
                      {facility.sports.map((sp, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md"
                        >
                          {sp}
                        </span>
                      ))}
                      <span className="bg-orange-50 text-orange-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                        {facility.spaceType}
                      </span>
                    </div>

                    {/* AI Condition Bar & Telemetry */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 text-[11px] flex items-center gap-1 font-medium">
                          {t.conditionScore}:
                          <b className={isCritical ? 'text-red-600' : 'text-slate-800'}>
                            {facility.conditionScore}%
                          </b>
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          <b>{facility.activeUsersNow}</b> active now
                        </span>
                      </div>

                      {/* Score Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            facility.conditionScore >= 85
                              ? 'bg-emerald-500'
                              : facility.conditionScore >= 60
                              ? 'bg-blue-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${facility.conditionScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Pricing Note */}
                    {facility.pricingNote && (
                      <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-1.5 rounded-lg">
                        ℹ️ {facility.pricingNote}
                      </p>
                    )}

                    {/* Badges & Actions */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center space-x-2">
                        {facility.fitIndiaCertified && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-sm font-bold">
                            Fit India
                          </span>
                        )}
                        {facility.kheloIndiaPartner && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-sm font-bold">
                            Khelo India
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDamageReport(facility);
                          }}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
                        >
                          Report Defect
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>{t.navigate}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
