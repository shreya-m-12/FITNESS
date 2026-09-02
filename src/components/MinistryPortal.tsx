import React, { useState, useMemo } from 'react';
import { WardData, SportsFacility, AIRecommendation } from '../types';
import { InteractiveMap } from './InteractiveMap';
import { runPredictiveBudgetOptimizer, calculateSpatialGini } from '../services/aiEngine';
import { 
  Building2, 
  MapPin, 
  Sliders, 
  Sparkles, 
  Printer, 
  Share2, 
  TrendingUp, 
  AlertOctagon, 
  Flame, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  FileSpreadsheet,
  Layers,
  IndianRupee,
  Navigation
} from 'lucide-react';

interface MinistryPortalProps {
  wards: WardData[];
  facilities: SportsFacility[];
}

export const MinistryPortal: React.FC<MinistryPortalProps> = ({ wards, facilities }) => {
  // Budget in Lakhs (₹10L to ₹150L)
  const [budgetLakhs, setBudgetLakhs] = useState<number>(65);
  const [highlightedCoords, setHighlightedCoords] = useState<[number, number] | null>(null);
  const [selectedWardForBreakdown, setSelectedWardForBreakdown] = useState<WardData>(wards[4]); // Default to Ward 5 (Desert)

  // Compute Spatial Gini
  const spatialGini = useMemo(() => calculateSpatialGini(wards), [wards]);

  // Run AI Recommendation based on budget
  const recommendation: AIRecommendation = useMemo(() => {
    return runPredictiveBudgetOptimizer(budgetLakhs, wards);
  }, [budgetLakhs, wards]);

  const handleFocusRecommendationOnMap = () => {
    setHighlightedCoords([recommendation.recommendedLat, recommendation.recommendedLng]);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Official Apex Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4" />
            <span>Apex Geospatial Analytics • MYAS & MoHUA Smart Cities Mission</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            National Activity Equity Scorecard (AES) & Infrastructure Optimizer
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Mathematical modeling of physical activity deserts across urban wards to direct Khelo India capital allocation.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintReport}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export Executive PDF Summary</span>
          </button>
        </div>
      </div>

      {/* Macro Equity Indicators Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            National Spatial GINI Index
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-red-600">{spatialGini}</span>
            <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
              High Inequality
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Severe skew toward Ward 01 vs East Zone
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Active Deserts Detected
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-600">
              {wards.filter(w => w.isDesert).length} of {wards.length} Wards
            </span>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
              Moran's I &lt; 0.25
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            1.36 Million citizens underserved
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            City-Wide Avg AES Score
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-slate-900">
              {(wards.reduce((acc, w) => acc + w.aesScore, 0) / wards.length).toFixed(1)} / 100
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Baseline
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Target: &gt;75.0 by 2030 (Fit India Vision)
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Free Public Access Ratio
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-700">
              {Math.round(facilities.filter(f => f.isFree).length / facilities.length * 100)}%
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Inclusive
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Free municipal parks & open gyms
          </span>
        </div>
      </div>

      {/* Main Grid: Choropleth Map & Predictive Budget Optimizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Ward Choropleth Map (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              Ward-Level Activity Equity Choropleth Map
            </h2>
            <span className="text-xs text-slate-500">
              Red boundary: <b>Activity Desert</b> | Green: <b>Sufficient</b>
            </span>
          </div>

          <div className="h-[460px] sm:h-[500px] w-full">
            <InteractiveMap
              facilities={facilities}
              wards={wards}
              selectedFacility={null}
              onSelectFacility={() => {}}
              onOpenReportForFacility={() => {}}
              showWardsChoropleth={true}
              highlightedCoordinates={highlightedCoords}
            />
          </div>

          {/* Mathematical Formula Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="font-extrabold text-slate-900 mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              Standardized Ward Activity Equity Score (AES) Equation:
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl font-mono text-[11px] text-slate-800 border border-slate-200 overflow-x-auto">
              AES = (0.35 × Density_capita) + (0.25 × Accessibility_dist) + (0.25 × AI_Condition_Score) + (0.15 × Inclusivity_free)
            </div>
            <div className="text-[11px] text-slate-500 mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>• <b>Density (35%)</b>: Facilities/100k</div>
              <div>• <b>Access (25%)</b>: 15m Walkability</div>
              <div>• <b>Condition (25%)</b>: AI Quality Score</div>
              <div>• <b>Inclusivity (15%)</b>: Free Public %</div>
            </div>
          </div>
        </div>

        {/* Right: Predictive AI Budget Optimizer (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* AI Recommendation Engine Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-lg border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-white">
                  Predictive AI Budget Optimizer
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                MYAS Capex Model
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Adjust capital allocation to mathematically simulate optimal facility placement and city equity score gain.
            </p>

            {/* Budget Slider */}
            <div className="space-y-2 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Proposed Capital Budget:
                </span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  ₹{budgetLakhs} Lakhs (₹{(budgetLakhs * 100000).toLocaleString()})
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={150}
                step={5}
                value={budgetLakhs}
                onChange={(e) => setBudgetLakhs(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹15 Lakhs (Mini Gym)</span>
                <span>₹75 Lakhs (Covered Turf)</span>
                <span>₹1.50 Cr (Complex)</span>
              </div>
            </div>

            {/* AI Optimization Output */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-400 block tracking-wider">
                  Optimal Target Deployment
                </span>
                <h4 className="font-extrabold text-sm text-white mt-0.5">
                  {recommendation.facilityType}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{recommendation.wardName}</span>
                </div>
              </div>

              {/* Projected Gains Metric Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                <div className="bg-black/30 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Projected Ward Gain</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    +{recommendation.projectedAesGain} pts AES
                  </span>
                </div>
                <div className="bg-black/30 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Beneficiary Reach</span>
                  <span className="text-base font-black text-amber-400 font-mono">
                    +{recommendation.projectedBeneficiaries.toLocaleString()} citizens
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <p className="text-[11px] text-slate-300 leading-relaxed bg-black/20 p-2.5 rounded-xl">
                {recommendation.rationale}
              </p>

              {/* Pin on Map button */}
              <button
                onClick={handleFocusRecommendationOnMap}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-98"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Focus Proposed Coordinates on Map</span>
              </button>
            </div>

          </div>

          {/* Ward Equity Breakdown Selector */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-xs text-slate-900 mb-2 flex items-center justify-between">
              <span>Ward Telemetry Detail:</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Select Ward</span>
            </h3>

            <div className="flex gap-1.5 overflow-x-auto pb-2">
              {wards.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWardForBreakdown(w)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedWardForBreakdown.id === w.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {w.id.toUpperCase()} ({w.aesScore})
                </button>
              ))}
            </div>

            <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between font-semibold">
                <span>{selectedWardForBreakdown.name}</span>
                <span className={`font-black ${selectedWardForBreakdown.isDesert ? 'text-red-600' : 'text-emerald-600'}`}>
                  AES: {selectedWardForBreakdown.aesScore}/100
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Population Density:</span>
                <span className="font-mono font-bold text-slate-800">{selectedWardForBreakdown.populationDensity.toLocaleString()} / km²</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Avg Walking Distance to Sports:</span>
                <span className="font-mono font-bold text-slate-800">{selectedWardForBreakdown.avgDistanceKm} km</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Free Public Facilities:</span>
                <span className="font-mono font-bold text-slate-800">{selectedWardForBreakdown.freeFacilityPercentage}%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Printable Executive Government Summary (Triggered during print/PDF) */}
      <div className="hidden print-only bg-white text-black p-8 max-w-4xl mx-auto space-y-6">
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-xl font-black uppercase tracking-wider">
            Government of India • Ministry of Youth Affairs & Sports (MYAS)
          </h1>
          <h2 className="text-lg font-bold">
            OPENMOVE India: National Activity Equity & Spatial Infrastructure Intelligence Report
          </h2>
          <p className="text-xs text-gray-600 mt-1">
            Smart India Hackathon 2026 Executive Summary • Generated {new Date().toLocaleDateString('en-IN')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <b>City / Region:</b> Delhi NCT Urban Local Bodies (SDMC / NDMC / EDMC)<br/>
            <b>Total Wards Analyzed:</b> 5 Key Representative Urban Wards<br/>
            <b>Verified Facilities:</b> 30 Sports Grounds & Parks<br/>
            <b>National Spatial GINI:</b> {spatialGini}
          </div>
          <div>
            <b>Targeted Investment:</b> ₹{budgetLakhs} Lakhs<br/>
            <b>Recommended Action:</b> {recommendation.facilityType}<br/>
            <b>Location Target:</b> {recommendation.wardName}<br/>
            <b>Projected Beneficiaries:</b> {recommendation.projectedBeneficiaries.toLocaleString()} citizens
          </div>
        </div>

        <table className="w-full text-left text-xs border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Ward Name</th>
              <th className="p-2 border">Population</th>
              <th className="p-2 border">Density/km²</th>
              <th className="p-2 border">Avg Dist (km)</th>
              <th className="p-2 border">AES Score</th>
              <th className="p-2 border">Desert Status</th>
            </tr>
          </thead>
          <tbody>
            {wards.map((w) => (
              <tr key={w.id}>
                <td className="p-2 border">{w.name}</td>
                <td className="p-2 border">{w.population.toLocaleString()}</td>
                <td className="p-2 border">{w.populationDensity.toLocaleString()}</td>
                <td className="p-2 border">{w.avgDistanceKm} km</td>
                <td className="p-2 border font-bold">{w.aesScore}</td>
                <td className="p-2 border">{w.isDesert ? 'YES (Desert)' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-8 flex justify-between text-xs font-bold border-t border-gray-300">
          <div>
            Authorized Signatory<br/>
            Director (Sports Infrastructure), MYAS
          </div>
          <div className="text-right">
            Certified By<br/>
            Chief Town Planner & Geospatial Analyst, MoHUA
          </div>
        </div>
      </div>

    </div>
  );
};
