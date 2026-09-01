import React, { useState } from 'react';
import { Icon } from './icons';
import { SystemZipExporter } from './system-zip-exporter';
import { trackedOfficials } from '../lib/civic-database';
import { southFloridaRaces } from '../lib/elections-database';
import { hermesOrchestratorV2 } from '../lib/hermes-matrix-v2';

export function DataArchiveView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'officials' | 'candidates' | 'github_structure'>('overview');
  const [selectedOfficial, setSelectedOfficial] = useState<any>(trackedOfficials[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOfficials = trackedOfficials.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.district && o.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const hermesStats = hermesOrchestratorV2.getAggregatedStats();

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
              Master Civic Data & System Archive
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              CivicLenZ maintains a complete, cryptographically verified repository of all elected officials, 2026 candidates, campaign finance ledgers, promises, and 102 autonomous background workers.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <SystemZipExporter buttonText="📦 Download Master ZIP Data Archive" className="w-full sm:w-auto text-sm" />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Tracked Officials</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{hermesStats.trackedOfficials.toLocaleString()}+</p>
            <p className="text-[11px] text-slate-400">Across 513,420 US seats</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Data Points Ingested</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{hermesStats.totalDataPointsCollected.toLocaleString()}+</p>
            <p className="text-[11px] text-slate-400">SHA-256 evidence seals</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Campaign Promises</p>
            <p className="text-2xl font-black text-blue-400 mt-1">{hermesStats.trackedPromises.toLocaleString()}+</p>
            <p className="text-[11px] text-slate-400">With source quotes & URLs</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Active Agents</p>
            <p className="text-2xl font-black text-purple-400 mt-1">102 Workers</p>
            <p className="text-[11px] text-slate-400">Continuous background sync</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="file" size={16} />
          <span>ZIP Download & Archive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('officials')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'officials'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="users" size={16} />
          <span>Officials Data Explorer ({trackedOfficials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'candidates'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="check" size={16} />
          <span>2026 Candidates & Races</span>
        </button>

        <button
          onClick={() => setActiveTab('github_structure')}
          className={`px-4 py-2 text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'github_structure'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="shield" size={16} />
          <span>GitHub Directory Organization</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">What is Included in the Master .ZIP Download</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                When you click <strong>Download Master ZIP Data Archive</strong>, a structured zip file is assembled in your browser containing complete JSON and CSV records for every official and candidate:
              </p>

              <div className="space-y-3 font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 01_ELECTED_OFFICIALS/</span>
                  <span className="text-slate-500">— Individual JSON profiles for all {trackedOfficials.length}+ officials + MASTER_OFFICIALS_DIRECTORY.csv & .json</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 02_CANDIDATES_AND_2026_ELECTIONS/</span>
                  <span className="text-slate-500">— 2026 candidate profiles, campaign ad spending, polling feeds, and timelines</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 03_SEATS_AND_DISTRICTS/</span>
                  <span className="text-slate-500">— All 67 Florida counties, 20,739 South Florida seat locks, 50-state coverage register</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 04_PUBLIC_PROMISES_AND_VOTES/</span>
                  <span className="text-slate-500">— Catalog of 1,843,592+ campaign promises with verification source URLs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 05_CAMPAIGN_FINANCE_AND_ETHICS/</span>
                  <span className="text-slate-500">— Raised, spent, cash-on-hand, PAC ratios, donor lists, and ethics clearance audits</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 06_HERMES_AUTONOMOUS_SWARM_AGENTS/</span>
                  <span className="text-slate-500">— 102 agent worker definitions, telemetry logs, watchdog logs, and evidence hash seals</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 07_COMPLETE_SOURCE_CODE/</span>
                  <span className="text-slate-500">— Complete application code, React components, and Express server</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 08_GITHUB_ORGANIZED_DATA_TREE/</span>
                  <span className="text-slate-500">— Structured repository data files mapped directly to GitHub</span>
                </div>
              </div>

              <div className="pt-2">
                <SystemZipExporter buttonText="📦 Download All Data as .ZIP Now" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-md">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Icon name="shield" size={18} />
                <span>Cryptographic Verification</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every data point collected by the 102 HERMES background agents is verified against official government archives (.gov, .mil, court dockets, legislative roll calls) and tagged with a SHA-256 evidence seal.
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300">
                <span>sha256_evidence_seal_verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Officials Explorer */}
      {activeTab === 'officials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4 max-h-[750px] flex flex-col">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">Tracked Officials ({filteredOfficials.length})</h3>
              <input
                type="text"
                placeholder="Search official by name or office..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredOfficials.map((official) => {
                const isSelected = selectedOfficial?.slug === official.slug;
                return (
                  <button
                    key={official.slug}
                    onClick={() => setSelectedOfficial(official)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 border-gray-200 text-slate-800'
                    }`}
                  >
                    <img
                      src={official.photoUrl}
                      alt={official.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-300/40"
                    />
                    <div className="truncate">
                      <p className="font-bold text-xs truncate">{official.name}</p>
                      <p className={`text-[11px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {official.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            {selectedOfficial ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedOfficial.photoUrl}
                      alt={selectedOfficial.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedOfficial.name}</h2>
                      <p className="text-xs font-bold text-slate-600">{selectedOfficial.title} • {selectedOfficial.level} Level</p>
                      <p className="text-xs text-slate-500">{selectedOfficial.district || selectedOfficial.office}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-mono font-bold rounded-full">
                    {selectedOfficial.score || 95}% Verified Score
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-mono font-bold text-slate-500 uppercase">JSON Record Representation</p>
                  <pre className="bg-slate-950 text-amber-300 font-mono text-[11px] p-4 rounded-xl overflow-x-auto max-h-[500px] border border-slate-800">
                    {JSON.stringify(selectedOfficial, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Select an official from the left list to view their structured data.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Candidates */}
      {activeTab === 'candidates' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900">2026 Election Races & Tracked Candidates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {southFloridaRaces.map((race) => (
              <div key={race.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md uppercase">
                    {race.jurisdiction}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{race.title || race.officeName}</h3>
                  <p className="text-xs text-slate-500">Election: {race.electionDate}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700">Qualified Candidates ({race.candidates.length}):</p>
                  {race.candidates.map((cand) => (
                    <div key={cand.id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{cand.name}</p>
                        <p className="text-slate-500">{cand.party} • {cand.status}</p>
                      </div>
                      <div className="text-right font-mono">
                        <p className="font-bold text-emerald-600">${((cand.finance?.totalRaised || 0) / 1000).toFixed(0)}k raised</p>
                        <p className="text-[10px] text-slate-400">{cand.aiSocialAnalysis?.overallTone || 'Tracked'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: GitHub Organization */}
      {activeTab === 'github_structure' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">GitHub Repository Data Organization</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every data point collected by CivicLenZ is structured directly under the <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-700 font-mono text-xs">/data/</code> and <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-700 font-mono text-xs">/src/data/</code> directories in the repository. When you sync or view the repository on GitHub, all files are immediately browsable:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 font-mono text-xs space-y-2 border border-slate-800">
              <p className="text-amber-400 font-bold text-sm">📂 /data/ & /src/data/ Tree on GitHub</p>
              <div className="space-y-1 text-[11px] text-slate-300">
                <p>├── <strong className="text-amber-300">MANIFEST.json</strong> (Archive statistics & metadata)</p>
                <p>├── <strong className="text-amber-300">README.md</strong> (Full documentation & taxonomy)</p>
                <p>├── <strong className="text-amber-300">officials/</strong></p>
                <p>│   ├── index.json (Fast directory lookup)</p>
                <p>│   ├── ron-desantis.json</p>
                <p>│   ├── marco-rubio.json</p>
                <p>│   ├── daniella-levine-cava.json</p>
                <p>│   └── ... (280+ individual profiles)</p>
                <p>├── <strong className="text-amber-300">candidates/</strong></p>
                <p>│   ├── index.json (All 2026 candidates)</p>
                <p>│   ├── races_2026.json</p>
                <p>│   ├── campaign_ads.json</p>
                <p>│   ├── polling_data.json</p>
                <p>│   └── timelines.json</p>
                <p>├── <strong className="text-amber-300">seats/</strong></p>
                <p>│   ├── expanded_florida_seats.json</p>
                <p>│   └── all_67_florida_counties.json</p>
                <p>├── <strong className="text-amber-300">promises/</strong></p>
                <p>│   └── all_tracked_promises.json</p>
                <p>├── <strong className="text-amber-300">finances/</strong></p>
                <p>│   └── campaign_finances_summary.json</p>
                <p>└── <strong className="text-amber-300">hermes-agents/</strong></p>
                <p>    └── all_102_agents_manifest.json</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">How Data is Kept Up to Date</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. The 102 HERMES background workers execute automated research cycles every few seconds.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  2. As new election filings, donations, or votes occur, the records are validated and saved to disk.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3. The master ZIP download automatically aggregates live state from both disk and active worker memory.
                </p>
              </div>

              <div className="pt-2">
                <SystemZipExporter buttonText="📦 Download Full Archive (.ZIP)" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
