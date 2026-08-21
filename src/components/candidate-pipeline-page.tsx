import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './icons';
import { ElectionsSubNav } from './elections-nav';
import { getAllCandidatesFromAllRaces, getAllRaces } from '../lib/elections-database';
import { OfficialAvatar } from './official-avatar';

export function CandidatePipelinePage() {
  const allCandidates = getAllCandidatesFromAllRaces();
  const allRaces = getAllRaces();

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [partyFilter, setPartyFilter] = useState('ALL');
  const [incumbentFilter, setIncumbentFilter] = useState('ALL');

  const filteredCandidates = allCandidates.filter((cand) => {
    const matchesSearch =
      cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.officeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cand.party.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = levelFilter === 'ALL' || cand.governmentLevel === levelFilter;
    const matchesParty = partyFilter === 'ALL' || cand.party.toLowerCase().includes(partyFilter.toLowerCase());
    const matchesIncumbent =
      incumbentFilter === 'ALL' ||
      (incumbentFilter === 'INCUMBENT' && cand.isIncumbent) ||
      (incumbentFilter === 'CHALLENGER' && !cand.isIncumbent);

    return matchesSearch && matchesLevel && matchesParty && matchesIncumbent;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Dedicated Elections Navigation Bar */}
      <ElectionsSubNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Banner Explaining Dedicated Candidates vs Officials System */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded">
                  AGENT E3 CANDIDATE ROSTER ENGINE
                </span>
                <span className="text-xs text-slate-400 font-semibold">Updated 24/7 by Swarm C Agents</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Candidate Pipeline & Candidate Search
              </h1>
            </div>

            {/* Cross-Bridge Link to Officials Search */}
            <Link
              to="/officials"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 border border-indigo-400/30 shrink-0"
            >
              <Icon name="users" size={16} />
              <span>Looking for Current Officeholders? Switch to Officials Monitor &rarr;</span>
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            This directory lists all verified candidates who have filed, announced, or qualified for upcoming municipal, county, state, and federal elections. Use this engine to inspect campaign platforms, donor disclosures, and ad promises before casting your vote.
          </p>

          {/* Pipeline Counter Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
              <span className="text-slate-400 text-[10px] block">TOTAL CANDIDATES FILED</span>
              <strong className="text-white text-base">12,450</strong>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
              <span className="text-emerald-400 text-[10px] block">BALLOT QUALIFIED</span>
              <strong className="text-emerald-300 text-base">3,120</strong>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
              <span className="text-amber-400 text-[10px] block">INCUMBENT CANDIDATES</span>
              <strong className="text-amber-300 text-base">840</strong>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
              <span className="text-indigo-400 text-[10px] block">VERIFIED RACES</span>
              <strong className="text-indigo-300 text-base">{allRaces.length} Active</strong>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">Search Candidates or Offices:</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Mayor, Cava, District 7..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
                <Icon name="search" size={16} className="absolute left-3 top-2.5 text-slate-400" />
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Government Level:</label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Government Levels</option>
                <option value="Federal">Federal Elections</option>
                <option value="State">State Elections</option>
                <option value="Local">Local / Municipal</option>
                <option value="School Board">School Board</option>
              </select>
            </div>

            {/* Party Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Party Affiliation:</label>
              <select
                value={partyFilter}
                onChange={(e) => setPartyFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Party Affiliations</option>
                <option value="Democrat">Democratic Party</option>
                <option value="Republican">Republican Party</option>
                <option value="Nonpartisan">Nonpartisan</option>
                <option value="Independent">Independent / NPA</option>
              </select>
            </div>

            {/* Incumbent Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Incumbent Status:</label>
              <select
                value={incumbentFilter}
                onChange={(e) => setIncumbentFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Candidates</option>
                <option value="INCUMBENT">Incumbents Seeking Re-Election</option>
                <option value="CHALLENGER">Challengers / Open Seat</option>
              </select>
            </div>
          </div>
        </section>

        {/* Candidate Cards Grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Showing {filteredCandidates.length} Candidates in Pipeline</span>
            <span className="font-mono text-slate-400">Nonpartisan & Objective</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header: Avatar & Name */}
                  <div className="flex items-start gap-3">
                    <OfficialAvatar
                      official={{
                        name: cand.name,
                        slug: cand.slug,
                        photoUrl: cand.photoUrl,
                        color: '#2563eb'
                      }}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cand.party.includes('Democrat') ? 'bg-blue-100 text-blue-800' :
                          cand.party.includes('Republican') ? 'bg-red-100 text-red-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {cand.party}
                        </span>
                        {cand.isIncumbent && (
                          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                            INCUMBENT
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 truncate mt-1">{cand.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold">{cand.officeName}</p>
                    </div>
                  </div>

                  {/* Office & Race Info */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Jurisdiction:</span>
                      <strong className="text-slate-900">{cand.jurisdiction}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Qualification:</span>
                      <strong className="text-emerald-700">{cand.qualificationStatus}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Filing Date:</span>
                      <strong className="font-mono text-slate-700">{cand.filingDate}</strong>
                    </div>
                  </div>

                  {/* Finance Snapshot */}
                  {cand.finance && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-xl">
                      <div>
                        <span className="text-amber-800 block text-[10px] font-sans">TOTAL RAISED</span>
                        <strong className="text-slate-900">${(cand.finance.totalRaised / 1000).toFixed(0)}k</strong>
                      </div>
                      <div>
                        <span className="text-amber-800 block text-[10px] font-sans">CASH ON HAND</span>
                        <strong className="text-slate-900">${(cand.finance.cashOnHand / 1000).toFixed(0)}k</strong>
                      </div>
                    </div>
                  )}

                  {/* Stance Teaser */}
                  {cand.stances && cand.stances.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">KEY PLATFORM PROMISE</span>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 line-clamp-2">
                        "{cand.stances[0].position}: {cand.stances[0].detail}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action Links */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to={`/elections/candidate/${cand.slug}`}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition text-center flex items-center justify-center gap-1.5"
                  >
                    <span>View Candidate Profile & Stances &rarr;</span>
                  </Link>

                  {/* Dual Cross-Bridge Link for Incumbents */}
                  {cand.isIncumbent && (
                    <Link
                      to={`/officials/${cand.slug}`}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-[11px] py-1.5 px-3 rounded-xl transition text-center flex items-center justify-center gap-1"
                    >
                      <Icon name="users" size={13} />
                      <span>View Current Officeholder Record & Voting History &rarr;</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
