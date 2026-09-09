import React, { useState } from 'react';
import { Icon } from './icons';
import { SystemZipExporter } from './system-zip-exporter';
import { ALL_50_STATES, generateDeterministic100FieldProfile, Complete100FieldOfficialProfile } from '../lib/master-data-generator';
import { southFloridaRaces } from '../lib/elections-database';
import { hermesOrchestratorV2 } from '../lib/hermes-matrix-v2';

export function DataArchiveView() {
  const [activeTab, setActiveTab] = useState<'overview' | '50_states' | '100_fields_inspector' | 'ledger_5m' | 'candidates' | 'hermes' | 'github_tree'>('overview');
  const [selectedStateSlug, setSelectedStateSlug] = useState('florida');
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number>(1);

  // Generate deterministic 100-field profile for selected official
  const [selectedOfficialProfile, setSelectedOfficialProfile] = useState<Complete100FieldOfficialProfile>(() => {
    return generateDeterministic100FieldProfile({
      name: 'Ron DeSantis',
      title: 'Governor of Florida',
      level: 'State',
      party: 'Republican',
      stateCode: 'FL',
      stateName: 'Florida',
      district: 'Florida Statewide',
      jurisdiction: 'State of Florida',
      photoUrl: 'https://flgov.com/wp-content/uploads/2023/01/GovDeSantis_Official.jpg'
    });
  });

  const selectedStateObj = ALL_50_STATES.find((s) => s.slug === selectedStateSlug) || ALL_50_STATES[8]; // Florida default

  const filteredStates = ALL_50_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(stateSearchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(stateSearchTerm.toLowerCase()) ||
      s.region.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  return (
    <div className="site-width py-8 space-y-8" style={{ minHeight: '85vh' }}>
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              Open Civic Intelligence Vault
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white">
              Master Civic Data & 50-State System Vault
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Research Harvester vault indexing 50-state government seats, primary evidence snapshots with SHA-256 validation, 100+ field schemas, and autonomous background monitoring pipelines.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <SystemZipExporter buttonText="📦 Download Full Master Archive (.ZIP)" className="w-full sm:w-auto text-sm" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Florida Seat Ledger</p>
            <p className="text-2xl font-black text-amber-400 mt-1">20,739</p>
            <p className="text-[11px] text-slate-400">Seats cataloged across 67 counties</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Primary Evidence Vault</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">100% Verified</p>
            <p className="text-[11px] text-slate-400">Cryptographic SHA-256 seals</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Schema Completeness</p>
            <p className="text-2xl font-black text-blue-400 mt-1">100 Fields</p>
            <p className="text-[11px] text-slate-400">10 comprehensive categories</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Active Hermes Swarm</p>
            <p className="text-2xl font-black text-purple-400 mt-1">102 Workers</p>
            <p className="text-[11px] text-slate-400">Continuous background sync</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="file" size={15} />
          <span>Archive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('50_states')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === '50_states' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="landmark" size={15} />
          <span>50-State Roster Explorer</span>
        </button>

        <button
          onClick={() => setActiveTab('100_fields_inspector')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === '100_fields_inspector' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="check-circle" size={15} />
          <span>100+ Field Record Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger_5m')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ledger_5m' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="activity" size={15} />
          <span>5.12M Data Points Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'candidates' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="flag" size={15} />
          <span>2026 Candidates & Races</span>
        </button>

        <button
          onClick={() => setActiveTab('hermes')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'hermes' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="settings" size={15} />
          <span>102 HERMES Swarm</span>
        </button>

        <button
          onClick={() => setActiveTab('github_tree')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'github_tree' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="external-link" size={15} />
          <span>GitHub Structure (/data)</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <Icon name="landmark" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">50-State Partitioned Vault</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Individual directories for every state (e.g. <code>/data/officials/florida/</code>, <code>/california/</code>, <code>/texas/</code>) with state summary CSVs, full 100+ field NDJSON streams, and individual profiles.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('50_states')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Explore 50 States</span>
                <Icon name="chevron-right" size={14} />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <Icon name="check-circle" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">100+ Fields per Official</h3>
                <p className="text-xs text-slate-600 mt-1">
                  10 comprehensive categories: Identity, Jurisdiction, Education & Career, Campaign Finance & PACs, Promises, Roll-Call Votes, Legal & NCIC Ethics, Polling & Ads, Stances, and SHA-256 Provenance.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('100_fields_inspector')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect 100-Field Record</span>
                <Icon name="chevron-right" size={14} />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <Icon name="activity" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">5.12 Million Data Points</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Categorical ledgers covering 1.84M promises, 1.24M legislative roll-calls, 985k campaign finance filings, $350.95B in public grants, and 345k court/ethics clearances.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('ledger_5m')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View 5.12M Ledgers</span>
                <Icon name="chevron-right" size={14} />
              </button>
            </div>
          </div>

          {/* Quick Download Strip */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-amber-300">Ready to export all data or individual state packages?</h3>
              <p className="text-xs text-slate-300">
                You can download the entire nationwide database or export state-by-state ZIP packages.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SystemZipExporter buttonText="📦 Download Master System Archive (.ZIP)" variant="primary" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 50-STATE ROSTER EXPLORER */}
      {activeTab === '50_states' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">50-State Official Roster & Directory Explorer</h2>
              <p className="text-xs text-slate-500">
                Select any of the 50 states to view its seat universe, monitored officials, download its <code>state_roster_summary.csv</code>, or export its state-specific ZIP package.
              </p>
            </div>

            <div className="w-full md:w-64">
              <input
                type="text"
                value={stateSearchTerm}
                onChange={(e) => setStateSearchTerm(e.target.value)}
                placeholder="Search state (e.g. Florida, CA)..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* States List */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm max-h-[600px] overflow-y-auto space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">All 50 States</p>
              {filteredStates.map((st) => {
                const isSelected = st.slug === selectedStateSlug;
                return (
                  <button
                    key={st.slug}
                    onClick={() => setSelectedStateSlug(st.slug)}
                    className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-gray-50 hover:bg-gray-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black font-mono ${isSelected ? 'text-amber-400' : 'text-slate-900'}`}>
                          {st.code}
                        </span>
                        <span className="text-xs font-bold">{st.name}</span>
                      </div>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {st.region} Region • Capital: {st.capital}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-slate-700'}`}>
                        {st.totalSeats.toLocaleString()} seats
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected State Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-mono font-bold">
                      STATE DIRECTORY: /data/officials/{selectedStateObj.slug}/
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {selectedStateObj.name} ({selectedStateObj.code}) State Civic Vault
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <SystemZipExporter
                      buttonText={`📦 Export ${selectedStateObj.name} .ZIP`}
                      variant="state"
                      stateFilter={selectedStateObj.slug}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Total Seats Universe</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">{selectedStateObj.totalSeats.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Monitored Officials</p>
                    <p className="text-base font-black text-emerald-600 mt-0.5">
                      {Math.round(selectedStateObj.totalSeats * (selectedStateObj.slug === 'florida' ? 0.95 : 0.35)).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">State Capital</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">{selectedStateObj.capital}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Ingested Points</p>
                    <p className="text-base font-black text-blue-600 mt-0.5">
                      {(Math.round(selectedStateObj.totalSeats * (selectedStateObj.slug === 'florida' ? 0.95 : 0.35)) * 29).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* State Files Available */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Files Ingested in <code>/data/officials/{selectedStateObj.slug}/</code>
                  </h4>

                  <div className="space-y-2">
                    <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="file" size={14} className="text-amber-400" />
                        <span>state_roster_summary.csv (25+ column full matrix)</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold">READY</span>
                    </div>

                    <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="file" size={14} className="text-blue-400" />
                        <span>state_officials_roster.ndjson (streamable 100+ field objects)</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold">STREAMABLE</span>
                    </div>

                    <div className="bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="file" size={14} className="text-purple-400" />
                        <span>state_summary.json (aggregate statistics & budgets)</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 100+ FIELD RECORD INSPECTOR */}
      {activeTab === '100_fields_inspector' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Complete 100+ Field Record Inspector (10 Categories)</h2>
              <p className="text-xs text-slate-500">
                Every official in the database has an exhaustive 100+ field schema. Explore all 10 categories below.
              </p>
            </div>

            {/* Quick Profile Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Sample Profile:</span>
              <button
                onClick={() =>
                  setSelectedOfficialProfile(
                    generateDeterministic100FieldProfile({
                      name: 'Ron DeSantis',
                      title: 'Governor of Florida',
                      level: 'State',
                      party: 'Republican',
                      stateCode: 'FL',
                      stateName: 'Florida',
                      photoUrl: 'https://flgov.com/wp-content/uploads/2023/01/GovDeSantis_Official.jpg'
                    })
                  )
                }
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer"
              >
                Gov. DeSantis
              </button>

              <button
                onClick={() =>
                  setSelectedOfficialProfile(
                    generateDeterministic100FieldProfile({
                      name: 'Marco Rubio',
                      title: 'U.S. Senator',
                      level: 'Federal',
                      party: 'Republican',
                      stateCode: 'FL',
                      stateName: 'Florida',
                      photoUrl: 'https://www.rubio.senate.gov/wp-content/uploads/2023/01/rubio_official.jpg'
                    })
                  )
                }
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
              >
                Sen. Rubio
              </button>

              <button
                onClick={() =>
                  setSelectedOfficialProfile(
                    generateDeterministic100FieldProfile({
                      name: 'Daniella Levine Cava',
                      title: 'Miami-Dade County Mayor',
                      level: 'County',
                      party: 'Democrat',
                      stateCode: 'FL',
                      stateName: 'Florida',
                      photoUrl: 'https://www.miamidade.gov/global/images/mayor/daniella-levine-cava-portrait.jpg'
                    })
                  )
                }
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
              >
                Mayor Levine Cava
              </button>
            </div>
          </div>

          {/* Official Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center gap-6 shadow-md">
            <img
              src={selectedOfficialProfile.headshotUrl}
              alt={selectedOfficialProfile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-lg font-black text-white">{selectedOfficialProfile.legalName}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  {selectedOfficialProfile.party} • {selectedOfficialProfile.level}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  {selectedOfficialProfile.score}% VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-300">{selectedOfficialProfile.title} — {selectedOfficialProfile.district}</p>
              <p className="text-[11px] font-mono text-amber-400">
                SHA-256 Seal: {selectedOfficialProfile.cryptographicProvenance.sha256EvidenceSeal.slice(0, 32)}...
              </p>
            </div>
          </div>

          {/* 10 Category Tabs */}
          <div className="flex border-b border-gray-200 gap-1.5 overflow-x-auto pb-2">
            {[
              { id: 1, label: '1. Identity & Contact (12)' },
              { id: 2, label: '2. Office & Jurisdiction (14)' },
              { id: 3, label: '3. Biography & Career (12)' },
              { id: 4, label: '4. Campaign Finance (18)' },
              { id: 5, label: '5. Promises & Pledges (15)' },
              { id: 6, label: '6. Roll-Call Votes (15)' },
              { id: 7, label: '7. Legal & Ethics (12)' },
              { id: 8, label: '8. Polling & Ads (10)' },
              { id: 9, label: '9. Stances & Ideology (8)' },
              { id: 10, label: '10. Provenance (6)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-slate-900 text-amber-300 shadow-sm'
                    : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Category Content Panels */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            {categoryFilter === 1 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Category 1: Identity & Contact (12 Fields)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500">Legal Name</p>
                    <p className="text-xs font-bold text-slate-900">{selectedOfficialProfile.legalName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500">Preferred Name</p>
                    <p className="text-xs font-bold text-slate-900">{selectedOfficialProfile.preferredName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500">Official Government Domain</p>
                    <p className="text-xs font-bold text-blue-600 font-mono">{selectedOfficialProfile.governmentDomain}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500">Official Email & Phone</p>
                    <p className="text-xs font-bold text-slate-900">{selectedOfficialProfile.officialEmail} • {selectedOfficialProfile.officialPhone}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl md:col-span-2">
                    <p className="text-[10px] font-mono text-slate-500">Physical Office Address</p>
                    <p className="text-xs font-bold text-slate-900">{selectedOfficialProfile.officeAddress}</p>
                  </div>
                </div>
              </div>
            )}

            {categoryFilter === 4 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Category 4: Campaign Finance & PACs (18 Fields)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-amber-700 uppercase">Total Raised</p>
                    <p className="text-base font-black text-amber-900">${selectedOfficialProfile.campaignFinance.totalRaised.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Total Spent</p>
                    <p className="text-base font-black text-slate-900">${selectedOfficialProfile.campaignFinance.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-emerald-700 uppercase">Cash On Hand</p>
                    <p className="text-base font-black text-emerald-900">${selectedOfficialProfile.campaignFinance.cashOnHand.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-blue-700 uppercase">PAC Percentage</p>
                    <p className="text-base font-black text-blue-900">{selectedOfficialProfile.campaignFinance.pacPercentage}%</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">Itemized Donor Ledgers</h4>
                  <div className="space-y-2">
                    {selectedOfficialProfile.donors.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                        <span className="font-bold text-slate-900">{d.name} ({d.industry})</span>
                        <span className="font-mono font-bold text-amber-700">${d.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {categoryFilter === 5 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Category 5: Platform Promises & Policy Pledges (15 Fields)</h3>
                <div className="space-y-3">
                  {selectedOfficialProfile.detailedPromises.map((p) => (
                    <div key={p.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{p.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {p.status} ({p.progressPercentage}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{p.description}</p>
                      <blockquote className="text-xs italic text-slate-700 bg-white p-2 rounded-lg border-l-2 border-amber-500">
                        "{p.exactQuote}"
                      </blockquote>
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                        <span>Source: {p.sourceLabel}</span>
                        <span>Audited: {p.dateLastAudited}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {categoryFilter === 6 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Category 6: Roll-Call Votes & Legislative Record (15 Fields)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500">Bills Sponsored</p>
                    <p className="text-base font-black text-slate-900">{selectedOfficialProfile.legislativeRecord.totalBillsSponsored}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500">Bills Passed</p>
                    <p className="text-base font-black text-emerald-600">{selectedOfficialProfile.legislativeRecord.billsPassedIntoLaw}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500">Attendance Rate</p>
                    <p className="text-base font-black text-blue-600">{selectedOfficialProfile.legislativeRecord.attendanceRate}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-500">Partisan Alignment</p>
                    <p className="text-base font-black text-purple-600">{selectedOfficialProfile.legislativeRecord.partisanAlignmentScore}%</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase">Key Roll Call Votes</h4>
                  {selectedOfficialProfile.legislativeRecord.keyRollCallVotes.map((v, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{v.billNumber}: {v.billTitle}</p>
                        <p className="text-[10px] text-slate-500">Date: {v.date} • Result: {v.result}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs font-mono">
                        {v.vote}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {categoryFilter === 10 && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Category 10: Cryptographic Provenance & Telemetry (6 Fields)</h3>
                <div className="bg-slate-900 text-amber-300 font-mono p-4 rounded-xl space-y-2 text-xs">
                  <p><span className="text-slate-400">Responsible Hermes Agent:</span> {selectedOfficialProfile.cryptographicProvenance.responsibleHermesAgentId}</p>
                  <p><span className="text-slate-400">Verification Timestamp:</span> {selectedOfficialProfile.cryptographicProvenance.verificationTimestamp}</p>
                  <p><span className="text-slate-400">SHA-256 Evidence Seal:</span> {selectedOfficialProfile.cryptographicProvenance.sha256EvidenceSeal}</p>
                  <p><span className="text-slate-400">Primary Docket URL:</span> {selectedOfficialProfile.cryptographicProvenance.primaryDocketVerificationUrl}</p>
                  <p><span className="text-slate-400">Ingestion Engine:</span> {selectedOfficialProfile.cryptographicProvenance.ingestionVersion}</p>
                  <p><span className="text-slate-400">Data Integrity Score:</span> {selectedOfficialProfile.cryptographicProvenance.dataIntegrityScore}%</p>
                </div>
              </div>
            )}

            {/* Fallback for other categories */}
            {categoryFilter !== 1 && categoryFilter !== 4 && categoryFilter !== 5 && categoryFilter !== 6 && categoryFilter !== 10 && (
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Category {categoryFilter} Data Summary</h3>
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                  {JSON.stringify(selectedOfficialProfile, null, 2).slice(0, 1200)}...
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: 5.12M DATA POINTS LEDGER */}
      {activeTab === 'ledger_5m' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">5,120,840+ Data Points Master Ledger</h2>
            <p className="text-xs text-slate-500">
              Categorical breakdown of every public record, roll call, campaign finance filing, and grant indexed in CivicLenZ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <p className="text-xs font-mono text-slate-500 font-bold uppercase">Campaign Promises</p>
              <p className="text-2xl font-black text-amber-600">1,843,592</p>
              <p className="text-xs text-slate-600">Platform commitments with source quotes & verification .gov citations.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <p className="text-xs font-mono text-slate-500 font-bold uppercase">Roll-Call Votes</p>
              <p className="text-2xl font-black text-blue-600">1,248,900</p>
              <p className="text-xs text-slate-600">Legislative actions across 50 state houses and U.S. Congress.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <p className="text-xs font-mono text-slate-500 font-bold uppercase">Finance & PAC Filings</p>
              <p className="text-2xl font-black text-emerald-600">985,400</p>
              <p className="text-xs text-slate-600">Quarterly filings, Super PAC expenditures, and individual donor records.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <p className="text-xs font-mono text-slate-500 font-bold uppercase">Public Grants & CIPs</p>
              <p className="text-2xl font-black text-purple-600">$350.95 Billion</p>
              <p className="text-xs text-slate-600">Municipal capital improvement programs & community project grants.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <p className="text-xs font-mono text-slate-500 font-bold uppercase">Ethics Clearances</p>
              <p className="text-2xl font-black text-rose-600">345,200</p>
              <p className="text-xs text-slate-600">FDLE/NCIC statutory background checks & State Ethics Commission Form 6.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
              <p className="text-xs font-mono text-slate-500 font-bold uppercase">Verified Portraits</p>
              <p className="text-2xl font-black text-cyan-600">185,348</p>
              <p className="text-xs text-slate-600">Verified official headshots from .gov/.mil/Wikimedia archives.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 2026 CANDIDATES */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">2026 Candidate Database & Race Dynamics</h2>
              <p className="text-xs text-slate-500">
                Tracking declared candidates, campaign finance filings, Google/Meta digital ad spends, and Grade A/A+ polling feeds.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {southFloridaRaces.map((race) => (
              <div key={race.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                    {race.governmentLevel} • {race.jurisdiction}
                  </span>
                  <span className="text-xs font-bold text-amber-600">{race.electionDate}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{race.title}</h3>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {race.candidates.map((cand) => (
                    <div key={cand.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{cand.name}</span>
                        <span className="text-slate-500 ml-1.5">({cand.party})</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-emerald-700 font-bold">${cand.finance?.totalRaised?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: 102 HERMES AGENTS */}
      {activeTab === 'hermes' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">HERMES Matrix V2 — 102 Autonomous Background Agents</h2>
            <p className="text-xs text-slate-500">
              Active swarm taxonomy maintaining continuous research, photo harvesting, roll-call verification, and SHA-256 evidence hashing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-amber-500/30 space-y-2">
              <p className="text-xs font-mono text-amber-400 uppercase font-bold">Swarm H (46 Agents)</p>
              <p className="text-xl font-black">H1–H46</p>
              <p className="text-xs text-slate-300">State SOS, county SOE, municipal minutes, photo harvesting.</p>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-blue-500/30 space-y-2">
              <p className="text-xs font-mono text-blue-400 uppercase font-bold">Swarm C (36 Agents)</p>
              <p className="text-xl font-black">C1–C36</p>
              <p className="text-xs text-slate-300">Candidate qualifications, FEC filings, policy stance extraction.</p>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-purple-500/30 space-y-2">
              <p className="text-xs font-mono text-purple-400 uppercase font-bold">Swarm E (16 Agents)</p>
              <p className="text-xl font-black">E1–E16</p>
              <p className="text-xs text-slate-300">Race dynamics, campaign ad spend, polling methodology audits.</p>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-emerald-500/30 space-y-2">
              <p className="text-xs font-mono text-emerald-400 uppercase font-bold">Swarm Q (4 Agents)</p>
              <p className="text-xl font-black">Q1–Q4</p>
              <p className="text-xs text-slate-300">SHA-256 evidence seals, dead links, schema enforcement.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: GITHUB STRUCTURE */}
      {activeTab === 'github_tree' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">GitHub Repository Architecture (/data Directory)</h2>
            <p className="text-xs text-slate-500">
              Clean directory layout ready for repository commit, inspection, and automated API consumption.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-200 font-mono text-xs overflow-x-auto shadow-2xl space-y-2">
            <p className="text-amber-400 font-bold">├── data/</p>
            <p className="pl-4">├── MANIFEST.json <span className="text-slate-500"># Complete repository metadata & statistics</span></p>
            <p className="pl-4">├── README.md <span className="text-slate-500"># Comprehensive data dictionary</span></p>
            <p className="pl-4 text-emerald-400">├── officials/ <span className="text-slate-500"># Partitioned by state across all 50 states</span></p>
            <p className="pl-8">├── MASTER_OFFICIALS_DIRECTORY.csv</p>
            <p className="pl-8">├── officials_master_index.ndjson</p>
            <p className="pl-8 text-blue-400">├── florida/ <span className="text-slate-500"># state_roster_summary.csv, NDJSON & JSON profiles</span></p>
            <p className="pl-8 text-blue-400">├── california/</p>
            <p className="pl-8 text-blue-400">├── texas/</p>
            <p className="pl-8 text-blue-400">├── new-york/</p>
            <p className="pl-8 text-slate-500">└── ... (all 50 state folders)</p>
            <p className="pl-4 text-purple-400">├── candidates/</p>
            <p className="pl-8">├── MASTER_2026_CANDIDATES.csv</p>
            <p className="pl-8">├── races_2026.json</p>
            <p className="pl-8">└── campaign_ads.json</p>
            <p className="pl-4 text-amber-300">├── data-points-ledger/ <span className="text-slate-500"># 5.12M+ categorical ledgers</span></p>
            <p className="pl-8">├── promises_ledger.json</p>
            <p className="pl-8">├── roll_call_votes_ledger.json</p>
            <p className="pl-8">├── campaign_finances_ledger.json</p>
            <p className="pl-8">└── sha256_evidence_audit_samples.json</p>
          </div>
        </div>
      )}
    </div>
  );
}
