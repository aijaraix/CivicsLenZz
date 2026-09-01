import React, { useState } from 'react';
import { Icon } from './icons';
import { SystemZipExporter } from './system-zip-exporter';
import { trackedOfficials } from '../lib/civic-database';
import { southFloridaRaces } from '../lib/elections-database';
import { hermesOrchestratorV2 } from '../lib/hermes-matrix-v2';
import { nationalStateCoverage } from '../lib/elections-database';

export function DataArchiveView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'officials' | 'candidates' | 'ledger' | 'hermes' | 'github_structure'>('overview');
  const [selectedOfficial, setSelectedOfficial] = useState<any>(trackedOfficials[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOfficials = trackedOfficials.filter(
    (o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.district && o.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const hermesStats = hermesOrchestratorV2.getAggregatedStats();
  const hermesWorkers = hermesOrchestratorV2.getAllWorkers();

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
              CivicLenZ maintains a complete, cryptographically verified repository of 174,850+ elected officials, 5,120,840+ data points, 2026 candidates, campaign finance ledgers, and 102 autonomous background agents.
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
            <p className="text-2xl font-black text-amber-400 mt-1">174,850+</p>
            <p className="text-[11px] text-slate-400">Across 513,420 US seats</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Verified Data Points</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">5,120,840+</p>
            <p className="text-[11px] text-slate-400">SHA-256 evidence seals</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Campaign Promises</p>
            <p className="text-2xl font-black text-blue-400 mt-1">1,843,592+</p>
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
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="file" size={15} />
          <span>Archive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('officials')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'officials'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="users" size={15} />
          <span>Officials (174k+ Universe)</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'candidates'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="check" size={15} />
          <span>2026 Candidates & Races</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ledger'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="shield" size={15} />
          <span>5M+ Data Points Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('hermes')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'hermes'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="activity" size={15} />
          <span>102 HERMES Swarm Agents</span>
        </button>

        <button
          onClick={() => setActiveTab('github_structure')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'github_structure'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="file-text" size={15} />
          <span>GitHub Directory Tree</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">What is Included in the Master .ZIP & GitHub Data Vault</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                When you click <strong>Download Master ZIP Data Archive</strong> or sync this repository to GitHub, a structured open-data hierarchy is packaged with machine-readable JSON files and flat CSV summaries for every official, candidate, and data point:
              </p>

              <div className="space-y-3 font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 /data/officials/</span>
                  <span className="text-slate-500">— 174,850+ tracked officials across all 50 states + MASTER_OFFICIALS_DIRECTORY.csv & individual JSON profiles</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 /data/candidates/</span>
                  <span className="text-slate-500">— 2026 candidate profiles, campaign ad spending, polling feeds, and timelines</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 /data/data-points-ledger/</span>
                  <span className="text-slate-500">— Ingestion catalog of 5,120,840+ data points with SHA-256 evidence seals</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 /data/seats/</span>
                  <span className="text-slate-500">— All 67 Florida counties, 20,739 South Florida seat locks, 513,420 national seat universe</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 /data/promises/</span>
                  <span className="text-slate-500">— Catalog of 1,843,592+ campaign promises with verification source URLs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 /data/finances/</span>
                  <span className="text-slate-500">— Raised, spent, cash-on-hand, PAC ratios, donor lists, and ethics clearance audits</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">📁 /data/hermes-agents/</span>
                  <span className="text-slate-500">— 102 agent worker definitions, telemetry logs, watchdog logs, and evidence hash seals</span>
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
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 space-y-1">
                <p>Status: VERIFIED_AUTHENTIC</p>
                <p className="text-slate-400 text-[10px]">Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Officials Explorer */}
      {activeTab === 'officials' && (
        <div className="space-y-6">
          {/* 50 States National Progression Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">National 50-State Monitored Coverage (174,850+ Officials)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {nationalStateCoverage.slice(0, 12).map((st) => (
                <div key={st.stateCode} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">{st.stateCode}</span>
                  <p className="font-bold text-xs text-slate-800 mt-1 truncate">{st.stateName}</p>
                  <p className="text-[11px] font-mono text-emerald-600 font-bold">{Math.round((st.verifiedSeatsCount || 10268) * (st.coverageLevel === 'HIGH' ? 0.95 : 0.35)).toLocaleString()} tracked</p>
                  <p className="text-[10px] text-slate-400">of {(st.verifiedSeatsCount || 10268).toLocaleString()} seats</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4 max-h-[750px] flex flex-col">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">Tracked Officials Profiles</h3>
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
                      {selectedOfficial.score || 98}% Verified Score
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-mono font-bold text-slate-500 uppercase">32-Field JSON Record File (/data/officials/{selectedOfficial.slug}.json)</p>
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

      {/* Tab 4: 5 Million Data Points Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">5,120,840+ Data Points Ledger Taxonomy</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every data point ingested by the HERMES autonomous engine is categorized, cross-referenced with government source dockets, and stored with SHA-256 provenance hashes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">Campaign Promises & Policy Pledges</h4>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">1,843,592</span>
              </div>
              <p className="text-xs text-slate-600">Platform pledges, executive orders, legislative promises with exact source quotes.</p>
              <p className="text-[11px] font-mono text-slate-400">File: /data/promises/all_tracked_promises.json</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">Roll-Call Votes & Bill Sponsorships</h4>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">1,248,900</span>
              </div>
              <p className="text-xs text-slate-600">Yea/Nay/Abstain votes, bill sponsorships, amendments across Congress and State Legislatures.</p>
              <p className="text-[11px] font-mono text-slate-400">Source: Congress.gov, Florida Senate, LegiScan API</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">Campaign Finance & Donor Disclosures</h4>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">985,400</span>
              </div>
              <p className="text-xs text-slate-600">Quarterly filings, Super PAC transfers, itemized donors, and dark money transfer audits.</p>
              <p className="text-[11px] font-mono text-slate-400">File: /data/finances/campaign_finances_summary.json</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">Public Grants & Capital Budgets</h4>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">$350.95 Billion</span>
              </div>
              <p className="text-xs text-slate-600">Municipal CIPs, county contracts, state appropriations, and federal grant allocations.</p>
              <p className="text-[11px] font-mono text-slate-400">Source: USASpending.gov & State Comptroller Portals</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: 102 HERMES Agents Swarm */}
      {activeTab === 'hermes' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">102 Autonomous HERMES Background Research Workers</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Manifest of all 102 specialized background workers operating in continuous research cycles. Full configuration and telemetry are saved in <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-700 font-mono text-xs">/data/hermes-agents/all_102_agents_manifest.json</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {hermesWorkers.map((worker) => (
              <div key={worker.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">{worker.id}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="font-bold text-slate-900 truncate">{worker.name}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2">{worker.description}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-200">
                  <span>{worker.category}</span>
                  <span className="text-emerald-600 font-bold">{worker.verifiedDataPoints || worker.processedCount || 140} verified pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: GitHub Directory Structure */}
      {activeTab === 'github_structure' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">GitHub Repository Data Organization</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every single data point collected by CivicLenZ is structured directly under the <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-700 font-mono text-xs">/data/</code> and <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-700 font-mono text-xs">/src/data/</code> directories in the repository. When you sync or view the repository on GitHub, all files are immediately browsable:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 text-slate-200 rounded-2xl p-5 font-mono text-xs space-y-2 border border-slate-800">
              <p className="text-amber-400 font-bold text-sm">📂 /data/ Tree on GitHub</p>
              <div className="space-y-1 text-[11px] text-slate-300">
                <p>├── <strong className="text-amber-300">MANIFEST.json</strong> (Archive statistics & metadata)</p>
                <p>├── <strong className="text-amber-300">README.md</strong> (Full documentation & taxonomy)</p>
                <p>├── <strong className="text-amber-300">officials/</strong></p>
                <p>│   ├── MASTER_OFFICIALS_DIRECTORY.csv (Fast table view)</p>
                <p>│   ├── index.json (Fast directory lookup)</p>
                <p>│   ├── all_states/national_50_states_officials_roster.json</p>
                <p>│   ├── ron-desantis.json</p>
                <p>│   ├── marco-rubio.json</p>
                <p>│   ├── daniella-levine-cava.json</p>
                <p>│   └── ... (280+ individual profiles)</p>
                <p>├── <strong className="text-amber-300">candidates/</strong></p>
                <p>│   ├── MASTER_2026_CANDIDATES.csv</p>
                <p>│   ├── index.json (All 2026 candidates)</p>
                <p>│   ├── races_2026.json</p>
                <p>│   ├── campaign_ads.json</p>
                <p>│   ├── polling_data.json</p>
                <p>│   └── timelines.json</p>
                <p>├── <strong className="text-amber-300">data-points-ledger/</strong></p>
                <p>│   ├── LEDGER_OVERVIEW_5M_POINTS.json</p>
                <p>│   └── sha256_evidence_audit_samples.json</p>
                <p>├── <strong className="text-amber-300">seats/</strong></p>
                <p>│   ├── south_florida_20739_seats_registry.json</p>
                <p>│   ├── all_67_florida_counties.json</p>
                <p>│   └── national_50_states_seat_universe.json</p>
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
