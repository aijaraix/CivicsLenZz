import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './icons';
import { hermesOrchestratorV2, HermesWorkerMeta } from '../lib/hermes-matrix-v2';
import { ElectionsSubNav } from './elections-nav';

interface RegionInfo {
  id: string;
  name: string;
  tagline: string;
  countiesText: string;
  pinCoords: { x: number; y: number };
  popularSearches: string[];
  jurisdictionDefaults: {
    county: string;
    house: string;
    senate: string;
    usHouse: string;
  };
}

const REGIONS: Record<string, RegionInfo> = {
  'south-florida': {
    id: 'south-florida',
    name: 'South Florida',
    tagline: 'Miami-Dade, Broward, Palm Beach & Monroe Counties',
    countiesText: 'Miami-Dade, Broward, Palm Beach & Monroe Counties',
    pinCoords: { x: 74, y: 72 },
    popularSearches: ['Miami, FL', 'Hialeah, FL', 'Fort Lauderdale, FL', 'West Palm Beach, FL', 'Key West, FL'],
    jurisdictionDefaults: {
      county: 'Miami-Dade County',
      house: 'Florida House District 114',
      senate: 'Florida Senate District 38',
      usHouse: 'U.S. House District 26',
    },
  },
  'central-florida': {
    id: 'central-florida',
    name: 'Central Florida',
    tagline: 'Orange, Hillsborough, Pinellas, Seminole & Brevard Counties',
    countiesText: 'Orange, Hillsborough, Pinellas, Seminole & Brevard Counties',
    pinCoords: { x: 62, y: 46 },
    popularSearches: ['Orlando, FL', 'Tampa, FL', 'St. Petersburg, FL', 'Kissimmee, FL', 'Daytona Beach, FL'],
    jurisdictionDefaults: {
      county: 'Orange County',
      house: 'Florida House District 47',
      senate: 'Florida Senate District 15',
      usHouse: 'U.S. House District 10',
    },
  },
  'north-florida': {
    id: 'north-florida',
    name: 'North Florida',
    tagline: 'Duval, Leon, Alachua, Escambia & St. Johns Counties',
    countiesText: 'Duval, Leon, Alachua, Escambia & St. Johns Counties',
    pinCoords: { x: 48, y: 20 },
    popularSearches: ['Jacksonville, FL', 'Tallahassee, FL', 'Gainesville, FL', 'Pensacola, FL', 'St. Augustine, FL'],
    jurisdictionDefaults: {
      county: 'Duval County',
      house: 'Florida House District 12',
      senate: 'Florida Senate District 4',
      usHouse: 'U.S. House District 4',
    },
  },
  'florida-statewide': {
    id: 'florida-statewide',
    name: 'Florida Statewide',
    tagline: 'All 67 Florida Counties Across the Sunshine State',
    countiesText: 'All 67 Florida Counties',
    pinCoords: { x: 62, y: 46 },
    popularSearches: ['Miami, FL', 'Orlando, FL', 'Tampa, FL', 'Jacksonville, FL', 'Tallahassee, FL'],
    jurisdictionDefaults: {
      county: 'State of Florida',
      house: 'Florida House (All Districts)',
      senate: 'Florida Senate (All Districts)',
      usHouse: 'U.S. Congressional Delegation',
    },
  },
};

export function ElectionLiveAgentDashboard() {
  const [workers, setWorkers] = useState<HermesWorkerMeta[]>([]);
  const [selectedSwarm, setSelectedSwarm] = useState<'ALL' | 'SWARM_B' | 'SWARM_A'>('SWARM_B');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('Miami-Dade County');
  const [scanningWorkerId, setScanningWorkerId] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch of workers from HERMES orchestrator
    const allWorkers = hermesOrchestratorV2.getAllWorkers();
    setWorkers(allWorkers);

    // Heartbeat interval refresh
    const interval = setInterval(() => {
      setWorkers(hermesOrchestratorV2.getAllWorkers());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleManualScan = (workerId: string) => {
    setScanningWorkerId(workerId);
    hermesOrchestratorV2.triggerWorkerScan(workerId as any);
    setTimeout(() => {
      setWorkers(hermesOrchestratorV2.getAllWorkers());
      setScanningWorkerId(null);
    }, 1200);
  };

  // Filter workers based on Swarm (B vs A), Category, and Search
  const filteredWorkers = workers.filter(w => {
    const isSwarmB = w.id.startsWith('C');
    const isSwarmA = w.id.startsWith('H');

    if (selectedSwarm === 'SWARM_B' && !isSwarmB) return false;
    if (selectedSwarm === 'SWARM_A' && !isSwarmA) return false;

    if (selectedCategory !== 'ALL' && w.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = w.id.toLowerCase().includes(q);
      const matchName = w.name.toLowerCase().includes(q);
      const matchDesc = w.description.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchDesc) return false;
    }

    return true;
  });

  const swarmBCount = workers.filter(w => w.id.startsWith('C')).length;
  const swarmACount = workers.filter(w => w.id.startsWith('H')).length;

  // Mock Seat <-> Upcoming Election Mappings
  const seatElectionMappings = [
    {
      seat_uuid: 'seat_us_senate_fl_a',
      office_title: 'U.S. Senator (Florida Seat A)',
      jurisdiction: 'State of Florida',
      county: 'Statewide Florida',
      election_date: '2026-11-03',
      election_type: 'General Election',
      incumbent: 'Rick Scott (R)',
      candidates: [
        { name: 'Rick Scott', party: 'REP', status: 'QUALIFIED', raised: 14200000, completeness: 100, isIncumbent: true },
        { name: 'Debbie Mucarsel-Powell', party: 'DEM', status: 'QUALIFIED', raised: 11800000, completeness: 94, isIncumbent: false },
        { name: 'Feena Bonoan', party: 'LPF', status: 'FILED', raised: 210000, completeness: 82, isIncumbent: false }
      ]
    },
    {
      seat_uuid: 'seat_fl_gov_001',
      office_title: 'Governor of Florida',
      jurisdiction: 'State of Florida',
      county: 'Statewide Florida',
      election_date: '2026-11-03',
      election_type: 'General Election',
      incumbent: 'Ron DeSantis (R - Term Limited)',
      candidates: [
        { name: 'Byron Donalds', party: 'REP', status: 'FILED', raised: 8900000, completeness: 91, isIncumbent: false },
        { name: 'Matt Gaetz', party: 'REP', status: 'FILED', raised: 6400000, completeness: 88, isIncumbent: false },
        { name: 'Nikki Fried', party: 'DEM', status: 'FILED', raised: 7100000, completeness: 92, isIncumbent: false },
        { name: 'Shevrin Jones', party: 'DEM', status: 'FILED', raised: 3200000, completeness: 85, isIncumbent: false }
      ]
    },
    {
      seat_uuid: 'seat_miamidade_mayor_001',
      office_title: 'Miami-Dade County Mayor',
      jurisdiction: 'Miami-Dade County',
      county: 'Miami-Dade County',
      election_date: '2028-08-22',
      election_type: 'County Primary / Nonpartisan',
      incumbent: 'Daniella Levine Cava (DEM)',
      candidates: [
        { name: 'Daniella Levine Cava', party: 'NONPARTISAN', status: 'QUALIFIED', raised: 3850000, completeness: 100, isIncumbent: true },
        { name: 'Manny Cid', party: 'NONPARTISAN', status: 'QUALIFIED', raised: 1250000, completeness: 88, isIncumbent: false },
        { name: 'Alexander Otaola', party: 'NONPARTISAN', status: 'QUALIFIED', raised: 890000, completeness: 84, isIncumbent: false }
      ]
    },
    {
      seat_uuid: 'seat_fl_house_114',
      office_title: 'Florida House District 114 Representative',
      jurisdiction: 'Miami-Dade County',
      county: 'Miami-Dade County',
      election_date: '2026-11-03',
      election_type: 'General Election',
      incumbent: 'Demi Busatta Cabrera (R)',
      candidates: [
        { name: 'Demi Busatta Cabrera', party: 'REP', status: 'QUALIFIED', raised: 420000, completeness: 98, isIncumbent: true },
        { name: 'Matthew Bornstein', party: 'DEM', status: 'QUALIFIED', raised: 185000, completeness: 86, isIncumbent: false }
      ]
    },
    {
      seat_uuid: 'seat_broward_commission_01',
      office_title: 'Broward County Commission District 1',
      jurisdiction: 'Broward County',
      county: 'Broward County',
      election_date: '2026-08-18',
      election_type: 'Primary Election',
      incumbent: 'Nan H. Rich (DEM)',
      candidates: [
        { name: 'Nan H. Rich', party: 'DEM', status: 'QUALIFIED', raised: 310000, completeness: 96, isIncumbent: true },
        { name: 'Carlos Morales', party: 'DEM', status: 'FILED', raised: 95000, completeness: 81, isIncumbent: false }
      ]
    },
    {
      seat_uuid: 'seat_orange_mayor_001',
      office_title: 'Orange County Mayor',
      jurisdiction: 'Orange County',
      county: 'Orange County',
      election_date: '2026-08-18',
      election_type: 'Primary Election',
      incumbent: 'Jerry L. Demings (DEM)',
      candidates: [
        { name: 'Jerry L. Demings', party: 'NONPARTISAN', status: 'QUALIFIED', raised: 820000, completeness: 97, isIncumbent: true },
        { name: 'Kelly Semrad', party: 'NONPARTISAN', status: 'FILED', raised: 210000, completeness: 83, isIncumbent: false }
      ]
    }
  ];

  const filteredSeats = seatElectionMappings.filter(s => {
    if (selectedCounty === 'ALL') return true;
    return s.county === selectedCounty || s.county === 'Statewide Florida';
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <ElectionsSubNav />
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-8 space-y-8">
        {/* Dual Swarm Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-indigo-500/20 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                HERMES PRIME (H0) ORCHESTRATION CONTROL PLANE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dual-Swarm Live Election & Candidate Execution Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              65 top-level logical agents continuously discovering upcoming elections, constructing race dockets, ingesting candidate campaign filings, normalizing campaign finance, extracting policy promises, and verifying official photo portraits across all 67 Florida counties and national seats.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-purple-950/80 border border-purple-500/40 px-3.5 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-purple-300 font-mono block">SWARM B (CANDIDATES)</span>
              <strong className="text-base text-purple-200 font-bold font-mono">{swarmBCount} Active Agents</strong>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-2 rounded-2xl text-center">
              <span className="text-[10px] text-emerald-300 font-mono block">SWARM A (OFFICIALS)</span>
              <strong className="text-base text-emerald-200 font-bold font-mono">{swarmACount} Active Agents</strong>
            </div>
          </div>
        </div>

        {/* Throughput & Unattended Estimator Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-900/90 border border-indigo-500/30 p-3.5 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[10px]">Processing Throughput</span>
            <strong className="text-emerald-400 text-sm block font-bold">2,880 Checks / Hour</strong>
            <span className="text-[10px] text-slate-400">32 Parallel Worker Pools</span>
          </div>

          <div className="bg-slate-900/90 border border-indigo-500/30 p-3.5 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[10px]">South FL Ingestion (20,739 seats)</span>
            <strong className="text-teal-300 text-sm block font-bold">~7.2 Hours to 100%</strong>
            <span className="text-[10px] text-slate-400">Miami-Dade, Broward, Palm Beach</span>
          </div>

          <div className="bg-slate-900/90 border border-indigo-500/30 p-3.5 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[10px]">Statewide FL Ingestion (85,000 seats)</span>
            <strong className="text-sky-300 text-sm block font-bold">~29.5 Hours (~1.2 Days)</strong>
            <span className="text-[10px] text-slate-400">All 67 SOEs & Municipalities</span>
          </div>

          <div className="bg-slate-900/90 border border-indigo-500/30 p-3.5 rounded-2xl space-y-1">
            <span className="text-slate-400 text-[10px]">US National Ingestion (513,420 seats)</span>
            <strong className="text-purple-300 text-sm block font-bold">~178 Hours (~7.4 Days)</strong>
            <span className="text-[10px] text-slate-400">30-Day Automated Guarantee</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSwarm('SWARM_B')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
                selectedSwarm === 'SWARM_B'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              SWARM B: CANDIDATES ({swarmBCount})
            </button>
            <button
              onClick={() => setSelectedSwarm('SWARM_A')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
                selectedSwarm === 'SWARM_A'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              SWARM A: OFFICEHOLDERS ({swarmACount})
            </button>
            <button
              onClick={() => setSelectedSwarm('ALL')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
                selectedSwarm === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ALL 65 AGENTS
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
            >
              <option value="ALL">All Categories</option>
              <option value="Ingestion">Ingestion</option>
              <option value="Extraction">Extraction</option>
              <option value="Verification">Verification</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Gatekeeper">Gatekeeper</option>
            </select>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search agent code, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <Icon name="search" size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Scrollable Agent Grid (Scrollable Container) */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 px-1">
            <span>SHOWING {filteredWorkers.length} OF {workers.length} LOGICAL AGENT POOLS</span>
            <span className="text-purple-300">SCROLL DOWN TO INSPECT ALL AGENTS</span>
          </div>

          <div className="max-h-[520px] overflow-y-auto pr-2 space-y-3 custom-scrollbar border border-slate-800/80 rounded-2xl p-2 bg-slate-950/60">
            {filteredWorkers.map((w) => {
              const isCandidateWorker = w.id.startsWith('C');
              const sampleLog = w.sampleCollectedData && w.sampleCollectedData[0];

              return (
                <div
                  key={w.id}
                  className={`bg-slate-900/90 border ${
                    isCandidateWorker ? 'border-purple-500/30 hover:border-purple-400/60' : 'border-emerald-500/30 hover:border-emerald-400/60'
                  } p-4 rounded-2xl transition space-y-3`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isCandidateWorker ? 'bg-purple-950 text-purple-300 border border-purple-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {w.id}
                      </span>
                      <h4 className="text-sm font-bold text-white font-mono">{w.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {w.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${w.status === 'EXECUTING' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                        <span className="text-[10px] font-mono font-bold text-emerald-400">
                          {w.status}
                        </span>
                      </div>

                      <button
                        onClick={() => handleManualScan(w.id)}
                        disabled={scanningWorkerId === w.id}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                      >
                        {scanningWorkerId === w.id ? 'SCANNING...' : 'TRIGGER SCAN'}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-normal">
                    {w.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono bg-slate-950/80 p-2.5 rounded-xl text-slate-300 border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[9px]">TOTAL VERIFIED DATA POINTS</span>
                      <strong className="text-emerald-400 font-bold">{w.verifiedDataPoints.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">ACTIVE DOCKET ENDPOINTS</span>
                      <strong className="text-slate-300 text-[10px] truncate block">{w.docketsMonitored[0] || 'Official Gov Portal'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">CONCURRENCY LIMIT</span>
                      <strong className="text-purple-300 font-bold">{w.concurrencyLimit} Worker Threads</strong>
                    </div>
                  </div>

                  {sampleLog && (
                    <div className="text-[10px] font-mono bg-slate-950 p-2.5 rounded-xl border border-indigo-900/40 space-y-1">
                      <div className="flex items-center justify-between text-indigo-300 font-bold">
                        <span>LATEST DATA HARVEST STREAM: {sampleLog.targetEntity}</span>
                        <span className="text-slate-500">{new Date(sampleLog.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-slate-400">{sampleLog.field}:</strong> {sampleLog.value}
                      </div>
                      <div className="flex items-center justify-between text-slate-500 pt-0.5 text-[9px]">
                        <span className="truncate max-w-[280px]">Source: {sampleLog.sourceUrl}</span>
                        <span className="text-amber-400/90">Proof Hash: {sampleLog.evidenceHash}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Seat <-> Upcoming Election Cycle Mapping Matrix */}
        <div className="space-y-4 pt-4 border-t border-indigo-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 tracking-wider uppercase block">
                SEAT TO ELECTION CYCLE & CANDIDATE CONTENDER MAPPING
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Upcoming Elections & Seat Candidates Overview
              </h3>
            </div>

            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-indigo-500/40 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-indigo-400"
            >
              <option value="ALL">All Counties / Florida Regions</option>
              <option value="Miami-Dade County">Miami-Dade County</option>
              <option value="Broward County">Broward County</option>
              <option value="Palm Beach County">Palm Beach County</option>
              <option value="Orange County">Orange County</option>
              <option value="Statewide Florida">Statewide Florida</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSeats.map((seat) => (
              <div
                key={seat.seat_uuid}
                className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 space-y-4 text-slate-200 shadow-lg hover:border-indigo-400/60 transition"
              >
                <div className="flex justify-between items-start border-b border-indigo-500/20 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      SEAT ID: {seat.seat_uuid}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{seat.office_title}</h4>
                    <p className="text-xs text-slate-400">{seat.jurisdiction}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded block">
                      {seat.election_type}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 mt-1 block font-bold">
                      {seat.election_date}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400 font-mono">Current Officeholder:</span>
                    <strong className="text-emerald-300">{seat.incumbent}</strong>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-mono font-bold text-purple-300 block">
                      FILED ELECTION CONTENDERS ({seat.candidates.length}):
                    </span>

                    {seat.candidates.map((cand, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${cand.party === 'REP' ? 'bg-red-500' : cand.party === 'DEM' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                          <span className="font-bold text-white">{cand.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">({cand.party})</span>
                          {cand.isIncumbent && (
                            <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40">
                              INCUMBENT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-right">
                          <span className="text-[11px] font-mono text-slate-300">
                            ${(cand.raised / 1000).toLocaleString()}K
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded">
                            {cand.completeness}% AUDITED
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Icon name="check" size={12} className="text-emerald-400" />
                    Automatic person_uuid Winner Handoff Active
                  </span>
                  <Link
                    to="/candidates"
                    className="text-indigo-400 hover:text-indigo-300 font-bold underline"
                  >
                    View Race Contenders →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

export function ElectionsLandingPage() {
  const navigate = useNavigate();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('south-florida');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  
  // Location and Personalization state
  const [savedAddress, setSavedAddress] = useState<string | null>(null);
  const [addressInput, setAddressInput] = useState('');
  
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 27, hours: 14, mins: 32, secs: 45 });

  useEffect(() => {
    // Check if user has a stored location/address in localStorage
    const stored = localStorage.getItem('civiclenz_address');
    if (stored) {
      setSavedAddress(stored);
      setAddressInput(stored);
      // Auto-switch region if city matches
      if (stored.toLowerCase().includes('orlando') || stored.toLowerCase().includes('tampa')) {
        setSelectedRegionId('central-florida');
      } else if (stored.toLowerCase().includes('jacksonville') || stored.toLowerCase().includes('tallahassee')) {
        setSelectedRegionId('north-florida');
      } else {
        setSelectedRegionId('south-florida');
      }
    }
  }, []);

  const currentRegion = REGIONS[selectedRegionId] || REGIONS['south-florida'];

  useEffect(() => {
    // Target date: August 20, 2026
    const targetDate = new Date('2026-08-20T07:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, mins, secs });
      } else {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    localStorage.setItem('civiclenz_address', addressInput.trim());
    setSavedAddress(addressInput.trim());
    navigate('/elections/my');
  };

  const handlePopularSearchClick = (city: string) => {
    setAddressInput(city);
    localStorage.setItem('civiclenz_address', city);
    setSavedAddress(city);
    navigate('/elections/my');
  };

  const handleClearAddress = () => {
    localStorage.removeItem('civiclenz_address');
    setSavedAddress(null);
    setAddressInput('');
    setSelectedRegionId('south-florida');
  };

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans selection:bg-sky-500 selection:text-white pb-16">
      <ElectionsSubNav />

      {/* Relevance / Location Status Bar */}
      <div className="bg-[#0b1428] border-b border-slate-800/80 px-4 sm:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        {savedAddress ? (
          <div className="flex items-center gap-2 text-sky-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>Showing personalized election data for: <strong className="text-white">{savedAddress}</strong></span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-300/90 font-medium">
            <Icon name="info" size={14} className="text-amber-400 shrink-0" />
            <span>Location unknown (VPN or initial visit) — Displaying <strong>South Florida</strong> default baseline. Enter your address below for your exact ballot.</span>
          </div>
        )}

        {savedAddress && (
          <button
            onClick={handleClearAddress}
            className="text-[11px] font-bold text-slate-400 hover:text-rose-400 underline transition shrink-0"
          >
            Reset to South Florida Default
          </button>
        )}
      </div>

      {/* 2. Hero Section with Night Skyline & Florida SVG Map Overlay */}
      <section className="relative overflow-hidden min-h-[520px] lg:min-h-[580px] flex items-center px-4 sm:px-8 lg:px-12 py-12">
        {/* Background Skyline Photo with Dark Gradient Overlays */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 pointer-events-none transition-all duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?auto=format&fit=crop&w=2000&q=80')`,
          }}
        />
        {/* Deep navy vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b15] via-[#070b15]/90 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b15] via-transparent to-[#070b15]/80 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                24/7 Election <br />
                <span className="text-sky-400 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                  Monitoring
                </span>{' '}
                System
              </h1>
              <p className="text-xl font-bold text-slate-200 tracking-tight pt-1">
                Real-time election intelligence. <br />
                <span className="text-slate-300 font-semibold">Every seat. Every race. Every voter.</span>
              </p>
            </div>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              CivicLens continuously monitors elections across <strong className="text-slate-200">{currentRegion.name}</strong> and the entire nation—so you never miss what matters most.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/officials"
                className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white p-3.5 rounded-2xl transition shadow-lg shadow-sky-500/20 flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Icon name="users" size={20} />
                </div>
                <div>
                  <span className="block font-bold text-sm">Search Officials</span>
                  <span className="block text-xs text-sky-100">Find your representatives</span>
                </div>
              </Link>

              <Link
                to="/candidates/map"
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 p-3.5 rounded-2xl transition shadow-lg shadow-amber-500/20 flex items-center gap-3 group font-black"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950/20 flex items-center justify-center shrink-0 text-slate-950">
                  <Icon name="shield" size={20} />
                </div>
                <div>
                  <span className="block font-black text-sm">Monitor Your Candidates</span>
                  <span className="block text-xs text-slate-900/80 font-bold">View candidate map & profiles</span>
                </div>
              </Link>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 pt-2 text-xs font-semibold text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="text-slate-300 font-bold">Election monitoring active 24/7</span>
              <span className="text-slate-600">|</span>
              <Link to="/coverage" className="text-sky-400 hover:text-sky-300 transition flex items-center gap-1 font-bold">
                Learn more →
              </Link>
            </div>
          </div>

          {/* Right Vector Map Column */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[360px] sm:min-h-[420px]">
            {/* Opaque SVG Florida Map */}
            <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center">
              <svg viewBox="0 0 500 400" className="w-full h-full filter drop-shadow-[0_0_25px_rgba(56,189,248,0.15)]">
                <defs>
                  <linearGradient id="flGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Base Florida Outline Vector */}
                <g fill="none" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.6">
                  {/* Panhandle */}
                  <path d="M 40 100 L 180 100 L 180 160 L 220 180 L 190 190 L 100 180 L 40 120 Z" fill="#0f172a" fillOpacity="0.5" />
                  {/* North FL */}
                  <path d="M 180 100 L 320 100 L 320 180 L 220 180 L 180 160 Z" fill={selectedRegionId === 'north-florida' || selectedRegionId === 'florida-statewide' ? 'url(#flGradient)' : '#0f172a'} fillOpacity={selectedRegionId === 'north-florida' || selectedRegionId === 'florida-statewide' ? '0.9' : '0.5'} stroke={selectedRegionId === 'north-florida' || selectedRegionId === 'florida-statewide' ? '#38bdf8' : '#334155'} strokeWidth={selectedRegionId === 'north-florida' ? '2.5' : '1.5'} />
                  {/* Central FL */}
                  <path d="M 220 180 L 320 180 L 340 270 L 250 280 L 220 180 Z" fill={selectedRegionId === 'central-florida' || selectedRegionId === 'florida-statewide' ? 'url(#flGradient)' : '#0f172a'} fillOpacity={selectedRegionId === 'central-florida' || selectedRegionId === 'florida-statewide' ? '0.9' : '0.5'} stroke={selectedRegionId === 'central-florida' || selectedRegionId === 'florida-statewide' ? '#38bdf8' : '#334155'} strokeWidth={selectedRegionId === 'central-florida' ? '2.5' : '1.5'} />
                  {/* South FL */}
                  <path d="M 250 280 L 340 270 L 360 350 L 310 380 L 260 340 Z" fill={selectedRegionId === 'south-florida' || selectedRegionId === 'florida-statewide' ? 'url(#flGradient)' : '#0f172a'} fillOpacity={selectedRegionId === 'south-florida' || selectedRegionId === 'florida-statewide' ? '0.9' : '0.5'} stroke={selectedRegionId === 'south-florida' || selectedRegionId === 'florida-statewide' ? '#38bdf8' : '#334155'} strokeWidth={selectedRegionId === 'south-florida' ? '2.5' : '1.5'} />
                  {/* Keys */}
                  <path d="M 310 380 Q 280 395 240 390" stroke={selectedRegionId === 'south-florida' || selectedRegionId === 'florida-statewide' ? '#38bdf8' : '#334155'} strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* County Mesh Lines */}
                <path d="M 180 130 L 320 130 M 250 100 L 250 180 M 270 180 L 270 280 M 300 180 L 300 350 M 220 230 L 330 230 M 250 320 L 350 320" stroke="#38bdf8" strokeOpacity="0.15" strokeDasharray="2 3" />

                {/* Interactive Click Zones on Map */}
                <rect x="180" y="80" width="140" height="90" className="cursor-pointer fill-transparent" onClick={() => setSelectedRegionId('north-florida')} />
                <rect x="220" y="170" width="120" height="100" className="cursor-pointer fill-transparent" onClick={() => setSelectedRegionId('central-florida')} />
                <rect x="240" y="270" width="130" height="120" className="cursor-pointer fill-transparent" onClick={() => setSelectedRegionId('south-florida')} />

                {/* Region Location Pin & Callout Box */}
                {selectedRegionId === 'south-florida' && (
                  <g transform="translate(325, 315)">
                    <circle r="12" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                    <circle r="6" fill="#090e1a" stroke="#38bdf8" strokeWidth="3" />
                  </g>
                )}
                {selectedRegionId === 'central-florida' && (
                  <g transform="translate(285, 225)">
                    <circle r="12" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                    <circle r="6" fill="#090e1a" stroke="#38bdf8" strokeWidth="3" />
                  </g>
                )}
                {selectedRegionId === 'north-florida' && (
                  <g transform="translate(250, 140)">
                    <circle r="12" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                    <circle r="6" fill="#090e1a" stroke="#38bdf8" strokeWidth="3" />
                  </g>
                )}
                {selectedRegionId === 'florida-statewide' && (
                  <g transform="translate(285, 225)">
                    <circle r="16" fill="#38bdf8" fillOpacity="0.3" className="animate-ping" />
                    <circle r="7" fill="#090e1a" stroke="#38bdf8" strokeWidth="3" />
                  </g>
                )}
              </svg>

              {/* Floating Region Callout Card Overlay */}
              <div className="absolute top-1/2 right-0 sm:right-4 transform -translate-y-1/2 bg-[#0c152b]/90 border border-sky-500/40 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-extrabold text-sky-400 tracking-wider uppercase">
                    {currentRegion.name}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-200 leading-snug">
                  {currentRegion.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Middle Search & Explore Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 -mt-4 relative z-20">
        <div className="bg-[#0b1329] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Address Search */}
            <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Find elections that affect you
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Enter your address to see your upcoming elections, officials, and personalized ballot.
                </p>
              </div>

              <form onSubmit={handleAddressSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <div className="relative flex-1">
                  <Icon name="pin" size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Enter your home address"
                    className="w-full bg-[#121c35] text-white border border-slate-700/80 pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md shrink-0 flex items-center justify-center gap-2"
                >
                  View My Elections
                </button>
              </form>

              {/* Popular Searches */}
              <div className="text-xs text-slate-400 pt-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-500">Popular Searches:</span>
                {currentRegion.popularSearches.map((city) => (
                  <button
                    key={city}
                    onClick={() => handlePopularSearchClick(city)}
                    className="text-sky-400 hover:text-sky-300 font-medium hover:underline transition"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Explore By Grid */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-6 lg:pt-0 lg:pl-8 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Or explore by
              </span>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/elections/my"
                  className="bg-[#101932] hover:bg-[#162347] border border-slate-800 p-3.5 rounded-2xl transition group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-slate-950 transition">
                    <Icon name="landmark" size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">State</span>
                    <span className="text-[10px] text-slate-400 block">Browse elections</span>
                  </div>
                </Link>

                <Link
                  to="/elections/my"
                  className="bg-[#101932] hover:bg-[#162347] border border-slate-800 p-3.5 rounded-2xl transition group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-slate-950 transition">
                    <Icon name="shield" size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">County</span>
                    <span className="text-[10px] text-slate-400 block">Browse elections</span>
                  </div>
                </Link>

                <Link
                  to="/elections/my"
                  className="bg-[#101932] hover:bg-[#162347] border border-slate-800 p-3.5 rounded-2xl transition group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-slate-950 transition">
                    <Icon name="building-2" size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">City</span>
                    <span className="text-[10px] text-slate-400 block">Browse elections</span>
                  </div>
                </Link>

                <Link
                  to="/elections/map"
                  className="bg-[#101932] hover:bg-[#162347] border border-slate-800 p-3.5 rounded-2xl transition group flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-slate-950 transition">
                    <Icon name="map" size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Election Map</span>
                    <span className="text-[10px] text-slate-400 block">Visualize races</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom 4 Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Upcoming Election */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              UPCOMING ELECTION
            </span>
            <Icon name="calendar" size={18} className="text-sky-400" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Florida Primary Election</h3>
            <p className="text-xs font-semibold text-sky-400 mt-0.5">August 20, 2026</p>
          </div>

          {/* Countdown Blocks */}
          <div className="grid grid-cols-4 gap-2 text-center py-2">
            <div className="bg-[#121c35] border border-slate-800 rounded-xl p-2">
              <span className="text-lg font-black text-white block">{timeLeft.days}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">DAYS</span>
            </div>
            <div className="bg-[#121c35] border border-slate-800 rounded-xl p-2">
              <span className="text-lg font-black text-white block">{timeLeft.hours}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">HRS</span>
            </div>
            <div className="bg-[#121c35] border border-slate-800 rounded-xl p-2">
              <span className="text-lg font-black text-white block">{timeLeft.mins}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">MINS</span>
            </div>
            <div className="bg-[#121c35] border border-slate-800 rounded-xl p-2">
              <span className="text-lg font-black text-white block">{timeLeft.secs}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">SECS</span>
            </div>
          </div>

          <Link
            to="/elections/my"
            className="w-full bg-[#121c35] hover:bg-[#1a2748] border border-slate-700/80 text-white font-bold text-xs py-2.5 rounded-xl text-center transition"
          >
            View All Upcoming Elections
          </Link>
        </div>

        {/* Card 2: Your Jurisdiction */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
              YOUR JURISDICTION
            </span>
            <p className="text-xs text-slate-400">
              {savedAddress ? 'Personalized for your address' : `Baseline for ${currentRegion.name}`}
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <Icon name="pin" size={14} className="text-sky-400 shrink-0" />
              <span className="font-semibold">{currentRegion.jurisdictionDefaults.county}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Icon name="landmark" size={14} className="text-sky-400 shrink-0" />
              <span className="font-semibold">{currentRegion.jurisdictionDefaults.house}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Icon name="landmark" size={14} className="text-sky-400 shrink-0" />
              <span className="font-semibold">{currentRegion.jurisdictionDefaults.senate}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <Icon name="landmark" size={14} className="text-sky-400 shrink-0" />
              <span className="font-semibold">{currentRegion.jurisdictionDefaults.usHouse}</span>
            </div>
          </div>

          <Link
            to="/officials"
            className="w-full bg-[#121c35] hover:bg-[#1a2748] border border-slate-700/80 text-white font-bold text-xs py-2.5 rounded-xl text-center transition"
          >
            View My Officials
          </Link>
        </div>

        {/* Card 3: Your Upcoming Ballot */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">
              YOUR UPCOMING BALLOT
            </span>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-3xl font-black text-white block">12</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">RACES</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-white block">3</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">BALLOT QUESTIONS</span>
              </div>
            </div>
          </div>

          {/* Icons row */}
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t border-b border-slate-800 py-3">
            <div className="flex flex-col items-center gap-1">
              <Icon name="landmark" size={15} className="text-sky-400" />
              <span>Federal</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name="landmark" size={15} className="text-sky-400" />
              <span>State</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name="shield" size={15} className="text-sky-400" />
              <span>County</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name="building-2" size={15} className="text-sky-400" />
              <span>Municipal</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Icon name="shield" size={15} className="text-sky-400" />
              <span>Special Districts</span>
            </div>
          </div>

          <Link
            to="/elections/my-ballot"
            className="w-full bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 font-bold text-xs py-2.5 rounded-xl text-center transition"
          >
            Preview My Ballot
          </Link>
        </div>

        {/* Card 4: System Status */}
        <div className="bg-[#1c0d13] border border-rose-900/50 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-3">
              SYSTEM STATUS
            </span>

            <div className="space-y-2 text-xs font-semibold text-rose-100">
              <div className="flex items-center gap-2">
                <Icon name="check" size={14} className="text-emerald-400 shrink-0" />
                <span>Election monitoring active</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size={14} className="text-emerald-400 shrink-0" />
                <span>Data sources online</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size={14} className="text-emerald-400 shrink-0" />
                <span>Results tracking active</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size={14} className="text-emerald-400 shrink-0" />
                <span>Boundary data current</span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/elections"
            className="w-full bg-rose-950 hover:bg-rose-900 border border-rose-800/80 text-rose-200 font-bold text-xs py-2.5 rounded-xl text-center transition"
          >
            System Status Center
          </Link>
        </div>
      </section>

      {/* 5. Florida Election Intelligence Engine Specifications Section (Phases 1-32) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-12">
        <div className="bg-gradient-to-b from-[#0b1329] to-[#070d1d] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded">
                  CIVICLENZ ELECTION ENGINE
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs font-semibold text-slate-300">Phase 1–32 Data Pipeline Active</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">Florida Continuous Monitoring & Entity Resolution Matrix</h3>
            </div>
            <Link
              to="/admin/elections"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition shadow-md shrink-0 flex items-center gap-1.5"
            >
              <Icon name="settings" size={15} />
              Open Hermes Data Center →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="bg-[#101932] border border-slate-800/90 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-sky-400 font-bold">
                <span>Phase 1–6: Source Registry</span>
                <Icon name="check" size={16} />
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                67 County Supervisors of Elections, Florida Division of Elections, and incorporated municipal clerks mapped with automated crawlers & DOM hash change detection.
              </p>
            </div>

            <div className="bg-[#101932] border border-slate-800/90 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-sky-400 font-bold">
                <span>Phase 10–13: Candidate Discovery</span>
                <Icon name="check" size={16} />
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Non-hallucinating candidate discovery engine matching filings, campaign finance, and oath documents directly to permanent person entity IDs.
              </p>
            </div>

            <div className="bg-[#101932] border border-slate-800/90 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-sky-400 font-bold">
                <span>Phase 14–21: Financial & Results Pipeline</span>
                <Icon name="check" size={16} />
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Transaction-level campaign finance normalization, contributor aggregation, and official government-certified results tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Interactive Dual-Swarm 65-Agent Live Execution & Seat Cycle Matrix */}
      <ElectionLiveAgentDashboard />

      {/* 6. Bottom 5 Feature Highlights Bar */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-12 pt-8 border-t border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="flex items-start gap-3">
            <Icon name="clock" size={20} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Real-Time Monitoring</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">24/7 election intelligence</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon name="sparkles" size={20} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Verified Sources</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Official data you can trust</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon name="landmark" size={20} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Complete Coverage</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Every seat. Every race.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon name="shield" size={20} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Transparent & Nonpartisan</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Facts first. Always.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Icon name="lock" size={20} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white">Privacy Protected</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Your data stays private</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
