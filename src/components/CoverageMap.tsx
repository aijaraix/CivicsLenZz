import React, { useState } from "react";
import { MapPin, CheckCircle2, ShieldCheck, Activity, Layers, Search, Server, ArrowRight } from "lucide-react";

export interface StateCoverageData {
  id: string;
  name: string;
  abbr: string;
  federalSeats: number;
  stateSeats: number;
  countySeats: number;
  municipalSeats: number;
  totalSeats: number;
  ingestionPercent: number;
  status: "Complete" | "High Density" | "Ingesting" | "Scheduled";
  activeNode: string;
  lastUpdated: string;
  lat: number;
  lng: number;
}

export const STATE_COVERAGE: StateCoverageData[] = [
  { id: "AL", name: "Alabama", abbr: "AL", federalSeats: 9, stateSeats: 140, countySeats: 1027, municipalSeats: 5822, totalSeats: 6998, ingestionPercent: 62, status: "Ingesting", activeNode: "Hermes-2 (AL SOS)", lastUpdated: "4h ago", lat: 32.3182, lng: -86.9023 },
  { id: "AK", name: "Alaska", abbr: "AK", federalSeats: 3, stateSeats: 60, countySeats: 102, municipalSeats: 582, totalSeats: 747, ingestionPercent: 55, status: "Ingesting", activeNode: "Hermes-1 (AK Elections)", lastUpdated: "5h ago", lat: 61.3707, lng: -152.4044 },
  { id: "AZ", name: "Arizona", abbr: "AZ", federalSeats: 11, stateSeats: 90, countySeats: 411, municipalSeats: 2329, totalSeats: 2841, ingestionPercent: 68, status: "Ingesting", activeNode: "Hermes-3 (AZ SOS)", lastUpdated: "3h ago", lat: 33.7298, lng: -111.4312 },
  { id: "AR", name: "Arkansas", abbr: "AR", federalSeats: 6, stateSeats: 135, countySeats: 822, municipalSeats: 4658, totalSeats: 5621, ingestionPercent: 60, status: "Ingesting", activeNode: "Hermes-4 (AR SOS)", lastUpdated: "4h ago", lat: 34.9697, lng: -92.3731 },
  { id: "CA", name: "California", abbr: "CA", federalSeats: 54, stateSeats: 120, countySeats: 5137, municipalSeats: 29112, totalSeats: 34423, ingestionPercent: 82, status: "High Density", activeNode: "Hermes-4 (CalAccess)", lastUpdated: "12m ago", lat: 36.7783, lng: -119.4179 },
  { id: "CO", name: "Colorado", abbr: "CO", federalSeats: 10, stateSeats: 100, countySeats: 1438, municipalSeats: 8151, totalSeats: 9699, ingestionPercent: 70, status: "Ingesting", activeNode: "Hermes-2 (CO SOS)", lastUpdated: "2h ago", lat: 39.0598, lng: -105.3111 },
  { id: "CT", name: "Connecticut", abbr: "CT", federalSeats: 7, stateSeats: 187, countySeats: 1027, municipalSeats: 5822, totalSeats: 7043, ingestionPercent: 75, status: "Ingesting", activeNode: "Hermes-5 (CT SOTS)", lastUpdated: "1h ago", lat: 41.5978, lng: -72.712 },
  { id: "DE", name: "Delaware", abbr: "DE", federalSeats: 3, stateSeats: 62, countySeats: 102, municipalSeats: 582, totalSeats: 749, ingestionPercent: 85, status: "High Density", activeNode: "Hermes-1 (DE Elections)", lastUpdated: "30m ago", lat: 39.3185, lng: -75.5071 },
  { id: "FL", name: "Florida", abbr: "FL", federalSeats: 30, stateSeats: 160, countySeats: 3082, municipalSeats: 17467, totalSeats: 20739, ingestionPercent: 88, status: "High Density", activeNode: "Hermes-2 (FL SOS)", lastUpdated: "Live Sync", lat: 27.6648, lng: -81.5158 },
  { id: "GA", name: "Georgia", abbr: "GA", federalSeats: 16, stateSeats: 236, countySeats: 2466, municipalSeats: 13974, totalSeats: 16692, ingestionPercent: 86, status: "High Density", activeNode: "Hermes-3 (GA SOS)", lastUpdated: "Live Sync", lat: 32.1656, lng: -82.9001 },
  { id: "HI", name: "Hawaii", abbr: "HI", federalSeats: 4, stateSeats: 76, countySeats: 30, municipalSeats: 173, totalSeats: 283, ingestionPercent: 90, status: "High Density", activeNode: "Hermes-6 (HI Elections)", lastUpdated: "15m ago", lat: 21.0943, lng: -157.4983 },
  { id: "ID", name: "Idaho", abbr: "ID", federalSeats: 4, stateSeats: 105, countySeats: 513, municipalSeats: 2911, totalSeats: 3533, ingestionPercent: 65, status: "Ingesting", activeNode: "Hermes-1 (ID SOS)", lastUpdated: "3h ago", lat: 44.2405, lng: -114.4788 },
  { id: "IL", name: "Illinois", abbr: "IL", federalSeats: 19, stateSeats: 177, countySeats: 8220, municipalSeats: 46580, totalSeats: 54996, ingestionPercent: 75, status: "Ingesting", activeNode: "Hermes-6 (IL Elections)", lastUpdated: "40m ago", lat: 40.6331, lng: -89.3985 },
  { id: "IN", name: "Indiana", abbr: "IN", federalSeats: 11, stateSeats: 150, countySeats: 2260, municipalSeats: 12809, totalSeats: 15230, ingestionPercent: 72, status: "Ingesting", activeNode: "Hermes-2 (IN SOS)", lastUpdated: "2h ago", lat: 39.8494, lng: -86.2583 },
  { id: "IA", name: "Iowa", abbr: "IA", federalSeats: 6, stateSeats: 150, countySeats: 1233, municipalSeats: 6987, totalSeats: 8376, ingestionPercent: 70, status: "Ingesting", activeNode: "Hermes-3 (IA SOS)", lastUpdated: "2h ago", lat: 42.0115, lng: -93.2105 },
  { id: "KS", name: "Kansas", abbr: "KS", federalSeats: 6, stateSeats: 165, countySeats: 1027, municipalSeats: 5822, totalSeats: 7020, ingestionPercent: 68, status: "Ingesting", activeNode: "Hermes-4 (KS SOS)", lastUpdated: "3h ago", lat: 39.0119, lng: -98.4842 },
  { id: "KY", name: "Kentucky", abbr: "KY", federalSeats: 8, stateSeats: 138, countySeats: 822, municipalSeats: 4658, totalSeats: 5626, ingestionPercent: 66, status: "Ingesting", activeNode: "Hermes-5 (KY SBE)", lastUpdated: "3h ago", lat: 37.6681, lng: -84.6701 },
  { id: "LA", name: "Louisiana", abbr: "LA", federalSeats: 8, stateSeats: 144, countySeats: 1027, municipalSeats: 5822, totalSeats: 7001, ingestionPercent: 64, status: "Ingesting", activeNode: "Hermes-1 (LA SOS)", lastUpdated: "4h ago", lat: 31.1695, lng: -91.8678 },
  { id: "ME", name: "Maine", abbr: "ME", federalSeats: 4, stateSeats: 186, countySeats: 411, municipalSeats: 2329, totalSeats: 2930, ingestionPercent: 71, status: "Ingesting", activeNode: "Hermes-2 (ME SOS)", lastUpdated: "2h ago", lat: 44.6939, lng: -69.3819 },
  { id: "MD", name: "Maryland", abbr: "MD", federalSeats: 10, stateSeats: 188, countySeats: 616, municipalSeats: 3493, totalSeats: 4307, ingestionPercent: 77, status: "Ingesting", activeNode: "Hermes-3 (MD SBE)", lastUpdated: "1h ago", lat: 39.0639, lng: -76.8021 },
  { id: "MA", name: "Massachusetts", abbr: "MA", federalSeats: 11, stateSeats: 200, countySeats: 1233, municipalSeats: 6987, totalSeats: 8431, ingestionPercent: 79, status: "Ingesting", activeNode: "Hermes-4 (MA Elections)", lastUpdated: "1h ago", lat: 42.2302, lng: -71.5301 },
  { id: "MI", name: "Michigan", abbr: "MI", federalSeats: 15, stateSeats: 148, countySeats: 3288, municipalSeats: 18632, totalSeats: 22083, ingestionPercent: 70, status: "Ingesting", activeNode: "Hermes-4 (MI SOS)", lastUpdated: "2h ago", lat: 44.3148, lng: -85.6024 },
  { id: "MN", name: "Minnesota", abbr: "MN", federalSeats: 10, stateSeats: 201, countySeats: 2055, municipalSeats: 11645, totalSeats: 13911, ingestionPercent: 73, status: "Ingesting", activeNode: "Hermes-5 (MN SOS)", lastUpdated: "2h ago", lat: 45.6945, lng: -93.9002 },
  { id: "MS", name: "Mississippi", abbr: "MS", federalSeats: 6, stateSeats: 174, countySeats: 616, municipalSeats: 3493, totalSeats: 4289, ingestionPercent: 62, status: "Ingesting", activeNode: "Hermes-6 (MS SOS)", lastUpdated: "4h ago", lat: 32.7416, lng: -89.6787 },
  { id: "MO", name: "Missouri", abbr: "MO", federalSeats: 10, stateSeats: 197, countySeats: 2055, municipalSeats: 11645, totalSeats: 13907, ingestionPercent: 68, status: "Ingesting", activeNode: "Hermes-1 (MO SOS)", lastUpdated: "3h ago", lat: 38.4561, lng: -92.2884 },
  { id: "MT", name: "Montana", abbr: "MT", federalSeats: 4, stateSeats: 150, countySeats: 411, municipalSeats: 2329, totalSeats: 2894, ingestionPercent: 60, status: "Ingesting", activeNode: "Hermes-2 (MT SOS)", lastUpdated: "5h ago", lat: 46.9219, lng: -110.4544 },
  { id: "NE", name: "Nebraska", abbr: "NE", federalSeats: 5, stateSeats: 49, countySeats: 616, municipalSeats: 3493, totalSeats: 4163, ingestionPercent: 65, status: "Ingesting", activeNode: "Hermes-3 (NE SOS)", lastUpdated: "3h ago", lat: 41.1254, lng: -98.2681 },
  { id: "NV", name: "Nevada", abbr: "NV", federalSeats: 6, stateSeats: 63, countySeats: 205, municipalSeats: 1164, totalSeats: 1438, ingestionPercent: 81, status: "High Density", activeNode: "Hermes-4 (NV SOS)", lastUpdated: "45m ago", lat: 38.3135, lng: -117.0554 },
  { id: "NH", name: "New Hampshire", abbr: "NH", federalSeats: 4, stateSeats: 424, countySeats: 411, municipalSeats: 2329, totalSeats: 3168, ingestionPercent: 74, status: "Ingesting", activeNode: "Hermes-5 (NH SOS)", lastUpdated: "2h ago", lat: 43.4525, lng: -71.5639 },
  { id: "NJ", name: "New Jersey", abbr: "NJ", federalSeats: 14, stateSeats: 120, countySeats: 1849, municipalSeats: 10480, totalSeats: 12463, ingestionPercent: 78, status: "Ingesting", activeNode: "Hermes-6 (NJ Elections)", lastUpdated: "1h ago", lat: 40.2989, lng: -74.521 },
  { id: "NM", name: "New Mexico", abbr: "NM", federalSeats: 5, stateSeats: 112, countySeats: 411, municipalSeats: 2329, totalSeats: 2857, ingestionPercent: 69, status: "Ingesting", activeNode: "Hermes-1 (NM SOS)", lastUpdated: "3h ago", lat: 34.8405, lng: -106.2485 },
  { id: "NY", name: "New York", abbr: "NY", federalSeats: 28, stateSeats: 213, countySeats: 3699, municipalSeats: 20961, totalSeats: 24901, ingestionPercent: 78, status: "High Density", activeNode: "Hermes-5 (NYS BOE)", lastUpdated: "25m ago", lat: 40.7128, lng: -74.006 },
  { id: "NC", name: "North Carolina", abbr: "NC", federalSeats: 16, stateSeats: 170, countySeats: 1644, municipalSeats: 9316, totalSeats: 11146, ingestionPercent: 68, status: "Ingesting", activeNode: "Hermes-1 (NC SBOE)", lastUpdated: "2h ago", lat: 35.7596, lng: -79.0193 },
  { id: "ND", name: "North Dakota", abbr: "ND", federalSeats: 3, stateSeats: 141, countySeats: 616, municipalSeats: 3493, totalSeats: 4253, ingestionPercent: 63, status: "Ingesting", activeNode: "Hermes-2 (ND SOS)", lastUpdated: "4h ago", lat: 47.5289, lng: -99.784 },
  { id: "OH", name: "Ohio", abbr: "OH", federalSeats: 17, stateSeats: 132, countySeats: 4110, municipalSeats: 23290, totalSeats: 27549, ingestionPercent: 74, status: "Ingesting", activeNode: "Hermes-2 (OH SOS)", lastUpdated: "1h ago", lat: 40.4173, lng: -82.9071 },
  { id: "OK", name: "Oklahoma", abbr: "OK", federalSeats: 7, stateSeats: 149, countySeats: 1027, municipalSeats: 5822, totalSeats: 7005, ingestionPercent: 67, status: "Ingesting", activeNode: "Hermes-3 (OK State Elec)", lastUpdated: "3h ago", lat: 35.5653, lng: -96.9289 },
  { id: "OR", name: "Oregon", abbr: "OR", federalSeats: 8, stateSeats: 90, countySeats: 822, municipalSeats: 4658, totalSeats: 5578, ingestionPercent: 76, status: "Ingesting", activeNode: "Hermes-4 (OR SOS)", lastUpdated: "1h ago", lat: 44.572, lng: -122.0709 },
  { id: "PA", name: "Pennsylvania", abbr: "PA", federalSeats: 19, stateSeats: 253, countySeats: 4521, municipalSeats: 25619, totalSeats: 30412, ingestionPercent: 72, status: "Ingesting", activeNode: "Hermes-3 (PA DOS)", lastUpdated: "1h ago", lat: 41.2033, lng: -77.1945 },
  { id: "RI", name: "Rhode Island", abbr: "RI", federalSeats: 4, stateSeats: 113, countySeats: 164, municipalSeats: 931, totalSeats: 1212, ingestionPercent: 86, status: "High Density", activeNode: "Hermes-5 (RI DOS)", lastUpdated: "20m ago", lat: 41.6809, lng: -71.5118 },
  { id: "SC", name: "South Carolina", abbr: "SC", federalSeats: 9, stateSeats: 170, countySeats: 822, municipalSeats: 4658, totalSeats: 5659, ingestionPercent: 71, status: "Ingesting", activeNode: "Hermes-6 (SC SEC)", lastUpdated: "2h ago", lat: 33.8361, lng: -81.1637 },
  { id: "SD", name: "South Dakota", abbr: "SD", federalSeats: 3, stateSeats: 105, countySeats: 616, municipalSeats: 3493, totalSeats: 4217, ingestionPercent: 61, status: "Ingesting", activeNode: "Hermes-1 (SD SOS)", lastUpdated: "5h ago", lat: 44.2998, lng: -99.4388 },
  { id: "TN", name: "Tennessee", abbr: "TN", federalSeats: 11, stateSeats: 132, countySeats: 1233, municipalSeats: 6987, totalSeats: 8363, ingestionPercent: 69, status: "Ingesting", activeNode: "Hermes-2 (TN SOS)", lastUpdated: "2h ago", lat: 35.7478, lng: -86.6923 },
  { id: "TX", name: "Texas", abbr: "TX", federalSeats: 40, stateSeats: 181, countySeats: 5754, municipalSeats: 32606, totalSeats: 38581, ingestionPercent: 80, status: "High Density", activeNode: "Hermes-1 (TX SOS)", lastUpdated: "18m ago", lat: 31.9686, lng: -99.9018 },
  { id: "UT", name: "Utah", abbr: "UT", federalSeats: 6, stateSeats: 104, countySeats: 411, municipalSeats: 2329, totalSeats: 2850, ingestionPercent: 75, status: "Ingesting", activeNode: "Hermes-3 (UT Elections)", lastUpdated: "1h ago", lat: 39.321, lng: -111.0937 },
  { id: "VT", name: "Vermont", abbr: "VT", federalSeats: 3, stateSeats: 180, countySeats: 205, municipalSeats: 1164, totalSeats: 1552, ingestionPercent: 80, status: "High Density", activeNode: "Hermes-4 (VT SOS)", lastUpdated: "40m ago", lat: 44.0459, lng: -72.7107 },
  { id: "VA", name: "Virginia", abbr: "VA", federalSeats: 13, stateSeats: 140, countySeats: 1233, municipalSeats: 6987, totalSeats: 8373, ingestionPercent: 65, status: "Ingesting", activeNode: "Hermes-5 (VA ELECT)", lastUpdated: "3h ago", lat: 37.4315, lng: -78.6569 },
  { id: "WA", name: "Washington", abbr: "WA", federalSeats: 12, stateSeats: 147, countySeats: 1438, municipalSeats: 8151, totalSeats: 9748, ingestionPercent: 78, status: "Ingesting", activeNode: "Hermes-6 (WA SOS)", lastUpdated: "1h ago", lat: 47.3917, lng: -121.5708 },
  { id: "WV", name: "West Virginia", abbr: "WV", federalSeats: 4, stateSeats: 134, countySeats: 411, municipalSeats: 2329, totalSeats: 2878, ingestionPercent: 64, status: "Ingesting", activeNode: "Hermes-1 (WV SOS)", lastUpdated: "4h ago", lat: 38.4912, lng: -80.9545 },
  { id: "WI", name: "Wisconsin", abbr: "WI", federalSeats: 10, stateSeats: 132, countySeats: 2055, municipalSeats: 11645, totalSeats: 13842, ingestionPercent: 72, status: "Ingesting", activeNode: "Hermes-2 (WI Elections)", lastUpdated: "2h ago", lat: 44.2685, lng: -89.6165 },
  { id: "WY", name: "Wyoming", abbr: "WY", federalSeats: 3, stateSeats: 93, countySeats: 205, municipalSeats: 1164, totalSeats: 1465, ingestionPercent: 66, status: "Ingesting", activeNode: "Hermes-3 (WY SOS)", lastUpdated: "3h ago", lat: 42.756, lng: -107.3025 }
];

interface CoverageMapProps {
  onSelectState?: (stateName: string) => void;
}

export const CoverageMap: React.FC<CoverageMapProps> = ({ onSelectState }) => {
  const [selectedState, setSelectedState] = useState<StateCoverageData>(STATE_COVERAGE[0]);
  const [levelCategory, setLevelCategory] = useState<"All" | "Federal" | "State" | "County" | "Municipal">("All");
  const [mapSearch, setMapSearch] = useState("");

  const filteredStates = STATE_COVERAGE.filter(st => 
    st.name.toLowerCase().includes(mapSearch.toLowerCase()) || 
    st.abbr.toLowerCase().includes(mapSearch.toLowerCase())
  );

  const totalSeatsInCountry = STATE_COVERAGE.reduce((acc, curr) => acc + curr.totalSeats, 0);

  const getMetricValue = (st: StateCoverageData) => {
    switch (levelCategory) {
      case "Federal": return `${st.federalSeats} Federal Seats`;
      case "State": return `${st.stateSeats} Legislative Seats`;
      case "County": return `${st.countySeats} County Seats`;
      case "Municipal": return `${st.municipalSeats} City/Local Seats`;
      default: return `${st.totalSeats.toLocaleString()} Monitored Seats`;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6" id="coverage-map-root">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg shadow-xs">
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="text-lg font-display font-bold text-slate-900 tracking-tight">
              State & Jurisdiction GIS Coverage Matrix
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-3xs font-mono font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase">
              {totalSeatsInCountry.toLocaleString()}+ SEATS INDEXED
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Real-time map tracking monitored elected seats across Federal, State, County, and Municipal boundaries.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2" id="coverage-level-filter-bar">
          {(["All", "Federal", "State", "County", "Municipal"] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setLevelCategory(lvl)}
              className={`text-2xs font-mono font-bold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                levelCategory === lvl
                  ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                  : "bg-slate-50 border-gray-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lvl === "All" ? "ALL LEVELS" : lvl.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map Visualizer + Detailed State Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Center Interactive Map Graphic */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[420px] shadow-lg border border-slate-800" id="us-map-canvas-container">
          
          {/* Top Status Overlay Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 z-10">
            <div className="flex items-center gap-2 text-2xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">HERMES GIS MESH ACTIVE</span>
            </div>
            <div className="text-3xs font-mono text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> 100% Ingested</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500"></span> 80-99% Dense</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Ingesting</span>
            </div>
          </div>

          {/* Interactive State Seat Pins Representation */}
          <div className="relative my-auto py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 z-10" id="state-pins-grid">
            {filteredStates.map((st) => {
              const isSelected = selectedState.id === st.id;
              let badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
              let dotColor = "bg-emerald-400";
              if (st.ingestionPercent < 80) {
                badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                dotColor = "bg-amber-400";
              } else if (st.ingestionPercent < 100) {
                badgeColor = "bg-blue-500/20 text-blue-300 border-blue-500/40";
                dotColor = "bg-blue-400";
              }

              return (
                <div
                  key={st.id}
                  onClick={() => {
                    setSelectedState(st);
                    if (onSelectState) onSelectState(st.name);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? "bg-blue-600/30 border-blue-400 ring-2 ring-blue-400/50 shadow-lg scale-102" 
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-display font-bold text-sm text-slate-100 flex items-center gap-1.5">
                      <MapPin className={`h-3.5 w-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      {st.name}
                    </span>
                    <span className={`text-4xs font-mono font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}>
                      {st.ingestionPercent}%
                    </span>
                  </div>

                  <div className="space-y-1 text-3xs font-mono text-slate-400">
                    <p className="flex justify-between">
                      <span>Seats:</span>
                      <strong className="text-slate-200">{getMetricValue(st)}</strong>
                    </p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${dotColor}`} 
                        style={{ width: `${st.ingestionPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom GIS Telemetry Footer */}
          <div className="border-t border-slate-800 pt-3 mt-4 flex flex-wrap justify-between items-center text-3xs font-mono text-slate-400 z-10 gap-2">
            <span>GIS Seat Matrix Model: <strong className="text-slate-200">2026 Redistricting Certified</strong></span>
            <span>Selected State: <strong className="text-blue-400 font-bold uppercase">{selectedState.name} ({selectedState.abbr})</strong></span>
          </div>
        </div>

        {/* Right Side: Selected State Seat & Jurisdiction Inspector */}
        <div className="lg:col-span-4 bg-slate-50 border border-gray-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs" id="state-jurisdiction-inspector">
          <div>
            <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-4">
              <div>
                <span className="text-3xs font-mono uppercase font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  STATE INSPECTOR
                </span>
                <h4 className="text-xl font-display font-bold text-slate-900 mt-1 flex items-center gap-2">
                  {selectedState.name} ({selectedState.abbr})
                </h4>
              </div>
              <span className={`text-2xs font-mono font-bold px-2.5 py-1 rounded border ${
                selectedState.ingestionPercent === 100
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : "bg-blue-100 text-blue-800 border-blue-300"
              }`}>
                {selectedState.ingestionPercent}% INGESTED
              </span>
            </div>

            {/* Jurisdiction Breakdown Stat Cards */}
            <div className="space-y-2.5">
              <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <div>
                    <strong className="block text-xs text-slate-900 font-sans font-semibold">Federal Congressional Seats</strong>
                    <span className="text-3xs font-mono text-slate-500">US House & Senate Representatives</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900">{selectedState.federalSeats} Seats</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  <div>
                    <strong className="block text-xs text-slate-900 font-sans font-semibold">State Legislative Seats</strong>
                    <span className="text-3xs font-mono text-slate-500">Governor, Senate & Assembly</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900">{selectedState.stateSeats} Seats</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-amber-600" />
                  <div>
                    <strong className="block text-xs text-slate-900 font-sans font-semibold">County & Special Districts</strong>
                    <span className="text-3xs font-mono text-slate-500">Commissioners, Sheriffs, School Boards</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900">{selectedState.countySeats} Seats</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  <div>
                    <strong className="block text-xs text-slate-900 font-sans font-semibold">Municipal & Local Seats</strong>
                    <span className="text-3xs font-mono text-slate-500">Mayors, City Councils, Local Boards</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900">{selectedState.municipalSeats} Seats</span>
              </div>
            </div>

            {/* Active Node Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 font-mono text-xs">
              <div className="flex justify-between items-center text-3xs text-blue-900">
                <span className="font-bold">ASSIGNED HERMES NODE:</span>
                <span className="bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded text-4xs">ONLINE</span>
              </div>
              <p className="font-bold text-slate-900 text-xs">{selectedState.activeNode}</p>
              <p className="text-3xs text-slate-600">Sync Pipeline: {selectedState.lastUpdated}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (onSelectState) onSelectState(selectedState.name);
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Filter Officials Directory by {selectedState.name}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
