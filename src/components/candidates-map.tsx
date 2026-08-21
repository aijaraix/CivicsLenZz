import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from './icons';
import { southFloridaRaces, RaceRecord, CandidateRecord } from '../lib/elections-database';
import { ElectionsSubNav } from './elections-nav';
import { OfficialAvatar } from './official-avatar';

export function CandidatesMapPage() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Federal' | 'State' | 'Local' | 'School Board'>('All');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Qualified' | 'Challengers' | 'Incumbents'>('All');
  const [activeRaceId, setActiveRaceId] = useState<string>(southFloridaRaces[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [monitoredCandidateIds, setMonitoredCandidateIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('civiclenz_monitored_candidates');
      return saved ? JSON.parse(saved) : ['cand-richard-cruz', 'cand-debbie-mucarsel-powell'];
    } catch {
      return ['cand-richard-cruz'];
    }
  });

  const toggleCandidateMonitor = (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMonitoredCandidateIds(prev => {
      const updated = prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId];
      localStorage.setItem('civiclenz_monitored_candidates', JSON.stringify(updated));
      return updated;
    });
  };

  const activeRace = southFloridaRaces.find(r => r.id === activeRaceId) || southFloridaRaces[0];

  // Filter races based on level and search
  const filteredRaces = southFloridaRaces.filter((race) => {
    const matchesLevel = selectedLevel === 'All' || race.governmentLevel === selectedLevel;
    const matchesQuery = searchQuery === '' ||
      race.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.officeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      race.candidates.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesQuery;
  });

  // Filter candidates in active race based on candidate status filter
  const filteredCandidates = activeRace.candidates.filter(c => {
    if (selectedFilter === 'Qualified') return c.status === 'Qualified';
    if (selectedFilter === 'Challengers') return !c.isIncumbent;
    if (selectedFilter === 'Incumbents') return c.isIncumbent;
    return true;
  });

  return (
    <div className="bg-[#070b15] text-slate-100 min-h-screen pb-24 font-sans selection:bg-amber-500 selection:text-slate-950">
      <ElectionsSubNav />
      {/* 1. Header & Map Mode Selector */}
      <header className="bg-[#0a1020] border-b border-slate-800/80 sticky top-0 z-30 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold hover:scale-105 transition-transform shrink-0">
              <Icon name="landmark" size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  UPCOMING CANDIDATES MAP
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  HERMES Ingestion Active
                </span>
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">Candidate Intelligence & Seat Map</h1>
            </div>
          </div>

          {/* Map Switcher (Officials Map vs Candidates Map) */}
          <div className="flex items-center gap-2 bg-[#10182b] p-1.5 rounded-2xl border border-slate-800">
            <Link
              to="/officials"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              <Icon name="users" size={14} />
              <span>Officials Map</span>
              <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">Current</span>
            </Link>
            <div className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 shadow-md flex items-center gap-1.5">
              <Icon name="shield" size={14} />
              <span>Candidates Map</span>
              <span className="text-[9px] bg-slate-950/20 px-1.5 py-0.2 rounded text-slate-950 font-black">2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Top Info & Personalization Notice */}
      <div className="bg-[#0c1428] border-b border-slate-800/80 px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Icon name="info" size={14} className="text-amber-400 shrink-0" />
          <span>
            Mapping <strong>candidates seeking election</strong> for upcoming seats. Trace over federal, state, county, and school board territories.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-amber-400 font-bold">Monitored Candidates: {monitoredCandidateIds.length}</span>
          <Link to="/watchlist" className="text-sky-400 hover:text-sky-300 underline font-bold">
            View Candidates Watchlist →
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Filter Controls Bar */}
        <section className="bg-[#0e172e] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
          {/* Level Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider font-mono">Government Level:</span>
            {(['All', 'Federal', 'State', 'Local', 'School Board'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedLevel === level
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-[#15213d] text-slate-300 hover:bg-[#1f2f54] hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Candidate Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider font-mono">Candidates:</span>
            {(['All', 'Qualified', 'Challengers', 'Incumbents'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedFilter === filter
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-[#15213d] text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* 3. Main Geospatial Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Candidates Territory Stage */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0b1224] border border-slate-800 rounded-3xl p-6 relative min-h-[540px] flex flex-col justify-between overflow-hidden shadow-2xl">
              {/* Map Radial Grid Pattern Background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

              {/* Map Stage Header */}
              <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#111a33]/90 p-4 rounded-2xl border border-slate-800/90 backdrop-blur-md">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">SOUTH FLORIDA TERRITORY</span>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Icon name="map" size={16} className="text-amber-400" />
                    Interactive Seat Contests ({filteredRaces.length})
                  </h2>
                </div>

                {/* Quick Search */}
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="Search candidate or seat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Icon name="search" size={14} className="absolute right-3 top-2.5 text-slate-400" />
                </div>
              </div>

              {/* Interactive District Cards Grid */}
              <div className="relative z-10 my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredRaces.map((race) => {
                  const isSelected = activeRaceId === race.id;
                  const candidateCount = race.candidates.length;
                  return (
                    <button
                      key={race.id}
                      onClick={() => setActiveRaceId(race.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 relative group overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-[#16254a] to-[#0d162d] border-amber-400 text-white shadow-xl ring-2 ring-amber-400/20 scale-[1.02]'
                          : 'bg-[#10182c]/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-[#14203a]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {race.district}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {candidateCount} Candidates
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-white mb-1 group-hover:text-amber-300 transition-colors">
                        {race.officeName}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">{race.jurisdiction}</p>

                      {/* Candidate Avatar Stack Preview */}
                      <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5">
                        <div className="flex -space-x-2 overflow-hidden">
                          {race.candidates.map((cand) => (
                            <OfficialAvatar
                              key={cand.id}
                              official={{
                                name: cand.name,
                                slug: cand.slug,
                                photoUrl: cand.photoUrl,
                                color: '#2563eb'
                              }}
                              size="sm"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-sky-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                          View Candidates →
                        </span>
                      </div>
                    </button>
                  );
                })}

                {filteredRaces.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 space-y-2">
                    <Icon name="search" size={28} className="mx-auto text-slate-600" />
                    <p className="text-sm font-semibold">No candidate filings match your search filter.</p>
                    <button
                      onClick={() => { setSelectedLevel('All'); setSelectedFilter('All'); setSearchQuery(''); }}
                      className="text-xs text-amber-400 hover:underline font-bold"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Map Footer Pipeline Status */}
              <div className="relative z-10 bg-[#10182c]/90 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>HERMES Data Engine: Ingesting 67 Supervisors of Elections candidate records</span>
                </div>
                <span className="text-amber-400 font-mono font-bold text-[11px]">100% Ingestion Fidelity</span>
              </div>
            </div>
          </div>

          {/* Right Column: Candidates Roster & Profile Inspector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0b1224] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
                    {activeRace.governmentLevel} LEVEL RACE
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono font-bold px-2 py-0.5 rounded">
                    {activeRace.status}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white">{activeRace.officeName}</h2>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">{activeRace.description}</p>
              </div>

              {/* Candidates Running for this seat */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    Candidates Seeking Seat ({filteredCandidates.length})
                  </span>
                  <span className="text-[10px] text-slate-400">Election: {activeRace.electionDate}</span>
                </div>

                <div className="space-y-3">
                  {filteredCandidates.map((cand) => {
                    const isMonitored = monitoredCandidateIds.includes(cand.id);
                    return (
                      <div
                        key={cand.id}
                        className="p-4 rounded-2xl bg-[#10182c] border border-slate-800 hover:border-amber-400/80 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <OfficialAvatar
                              official={{
                                name: cand.name,
                                slug: cand.slug,
                                photoUrl: cand.photoUrl,
                                color: '#2563eb'
                              }}
                              size="lg"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-sm font-extrabold text-white">{cand.name}</h4>
                                {cand.isIncumbent && (
                                  <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded">
                                    Incumbent Running
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400 block mt-0.5 font-medium">
                                {cand.party} • {cand.qualificationStatus}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => toggleCandidateMonitor(cand.id, e)}
                            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                              isMonitored
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'bg-[#182442] text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                            title={isMonitored ? "Currently monitoring candidate" : "Add to candidate monitoring list"}
                          >
                            <Icon name="shield" size={14} />
                            <span>{isMonitored ? 'Monitored' : 'Monitor'}</span>
                          </button>
                        </div>

                        {/* Financials & Filing snippet */}
                        <div className="grid grid-cols-2 gap-2 bg-[#090f1d] p-2.5 rounded-xl text-xs border border-slate-800/80">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase">Total Campaign Raised</span>
                            <span className="font-extrabold text-emerald-400 font-mono">
                              ${cand.finance.totalRaised.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase">Cash On Hand</span>
                            <span className="font-extrabold text-sky-400 font-mono">
                              ${cand.finance.cashOnHand.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <Link
                            to={`/elections/candidate/${cand.slug}`}
                            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl text-center transition shadow-sm flex items-center justify-center gap-1"
                          >
                            <span>Open Candidate Profile</span>
                            <Icon name="chevron-right" size={14} />
                          </Link>
                          {cand.campaignWebsite && (
                            <a
                              href={cand.campaignWebsite}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2.5 rounded-xl bg-[#182442] hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                              title="Official Campaign Website"
                            >
                              <Icon name="external-link" size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredCandidates.length === 0 && (
                    <div className="p-6 bg-[#10182c] rounded-2xl text-center text-slate-400 text-xs">
                      No candidates match the selected candidate status filter.
                    </div>
                  )}
                </div>
              </div>

              {/* View Full Race Page CTA */}
              <div className="pt-2 border-t border-slate-800">
                <Link
                  to={`/elections/race/${activeRace.id}`}
                  className="w-full inline-block bg-[#162343] hover:bg-[#1d2d57] text-white font-bold text-xs py-3 rounded-xl text-center transition border border-slate-700"
                >
                  View Full Seat Contenders & Polling Breakdown →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
