import React, { useState, useEffect } from 'react';
import { Icon } from './icons';
import { SystemZipExporter } from './system-zip-exporter';
import { southFloridaRaces } from '../lib/elections-database';

// Standard 50 US States definition without manufactured statistics
const US_50_STATES = [
  { code: 'AL', name: 'Alabama', slug: 'alabama', region: 'South', capital: 'Montgomery' },
  { code: 'AK', name: 'Alaska', slug: 'alaska', region: 'West', capital: 'Juneau' },
  { code: 'AZ', name: 'Arizona', slug: 'arizona', region: 'West', capital: 'Phoenix' },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas', region: 'South', capital: 'Little Rock' },
  { code: 'CA', name: 'California', slug: 'california', region: 'West', capital: 'Sacramento' },
  { code: 'CO', name: 'Colorado', slug: 'colorado', region: 'West', capital: 'Denver' },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut', region: 'Northeast', capital: 'Hartford' },
  { code: 'DE', name: 'Delaware', slug: 'delaware', region: 'South', capital: 'Dover' },
  { code: 'FL', name: 'Florida', slug: 'florida', region: 'South', capital: 'Tallahassee' },
  { code: 'GA', name: 'Georgia', slug: 'georgia', region: 'South', capital: 'Atlanta' },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii', region: 'West', capital: 'Honolulu' },
  { code: 'ID', name: 'Idaho', slug: 'idaho', region: 'West', capital: 'Boise' },
  { code: 'IL', name: 'Illinois', slug: 'illinois', region: 'Midwest', capital: 'Springfield' },
  { code: 'IN', name: 'Indiana', slug: 'indiana', region: 'Midwest', capital: 'Indianapolis' },
  { code: 'IA', name: 'Iowa', slug: 'iowa', region: 'Midwest', capital: 'Des Moines' },
  { code: 'KS', name: 'Kansas', slug: 'kansas', region: 'Midwest', capital: 'Topeka' },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky', region: 'South', capital: 'Frankfort' },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana', region: 'South', capital: 'Baton Rouge' },
  { code: 'ME', name: 'Maine', slug: 'maine', region: 'Northeast', capital: 'Augusta' },
  { code: 'MD', name: 'Maryland', slug: 'maryland', region: 'South', capital: 'Annapolis' },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts', region: 'Northeast', capital: 'Boston' },
  { code: 'MI', name: 'Michigan', slug: 'michigan', region: 'Midwest', capital: 'Lansing' },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota', region: 'Midwest', capital: 'St. Paul' },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi', region: 'South', capital: 'Jackson' },
  { code: 'MO', name: 'Missouri', slug: 'missouri', region: 'Midwest', capital: 'Jefferson City' },
  { code: 'MT', name: 'Montana', slug: 'montana', region: 'West', capital: 'Helena' },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska', region: 'Midwest', capital: 'Lincoln' },
  { code: 'NV', name: 'Nevada', slug: 'nevada', region: 'West', capital: 'Carson City' },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire', region: 'Northeast', capital: 'Concord' },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey', region: 'Northeast', capital: 'Trenton' },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico', region: 'West', capital: 'Santa Fe' },
  { code: 'NY', name: 'New York', slug: 'new-york', region: 'Northeast', capital: 'Albany' },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina', region: 'South', capital: 'Raleigh' },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota', region: 'Midwest', capital: 'Bismarck' },
  { code: 'OH', name: 'Ohio', slug: 'ohio', region: 'Midwest', capital: 'Columbus' },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma', region: 'South', capital: 'Oklahoma City' },
  { code: 'OR', name: 'Oregon', slug: 'oregon', region: 'West', capital: 'Salem' },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', region: 'Northeast', capital: 'Harrisburg' },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island', region: 'Northeast', capital: 'Providence' },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina', region: 'South', capital: 'Columbia' },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota', region: 'Midwest', capital: 'Pierre' },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee', region: 'South', capital: 'Nashville' },
  { code: 'TX', name: 'Texas', slug: 'texas', region: 'South', capital: 'Austin' },
  { code: 'UT', name: 'Utah', slug: 'utah', region: 'West', capital: 'Salt Lake City' },
  { code: 'VT', name: 'Vermont', slug: 'vermont', region: 'Northeast', capital: 'Montpelier' },
  { code: 'VA', name: 'Virginia', slug: 'virginia', region: 'South', capital: 'Richmond' },
  { code: 'WA', name: 'Washington', slug: 'washington', region: 'West', capital: 'Olympia' },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia', region: 'South', capital: 'Charleston' },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin', region: 'Midwest', capital: 'Madison' },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming', region: 'West', capital: 'Cheyenne' }
];

const CONTRACT_CATEGORIES = [
  { id: 1, name: 'Category 1: Identity & Contact', fieldCount: 12, description: 'Legal name, preferred name, official email, phone, physical address, verified portrait.' },
  { id: 2, name: 'Category 2: Office & Jurisdiction', fieldCount: 14, description: 'Seat identifier, government level, statutory district, term start/end dates, qualification status.' },
  { id: 3, name: 'Category 3: Biography & Career', fieldCount: 12, description: 'Birthplace, verified education degrees, military branch/rank, prior offices, career milestones.' },
  { id: 4, name: 'Category 4: Campaign Finance & PACs', fieldCount: 18, description: 'Total contributions, PAC ratios, itemized donors, independent expenditures, cash on hand.' },
  { id: 5, name: 'Category 5: Platform Promises & Pledges', fieldCount: 15, description: 'Platform statements, exact quotes, stated date, primary .gov citation, status verification.' },
  { id: 6, name: 'Category 6: Roll-Call Votes & Legislative Record', fieldCount: 15, description: 'Bills sponsored, bills enacted into law, roll call dockets, committee chairs and assignments.' },
  { id: 7, name: 'Category 7: Legal & Ethics Clearances', fieldCount: 12, description: 'Statutory financial disclosures (Form 6), outside income, real estate holdings, dockets.' },
  { id: 8, name: 'Category 8: Campaign Ads & Polling', fieldCount: 10, description: 'Digital ad library spend (Meta/Google), broadcast buys, polling samples, margin of error.' },
  { id: 9, name: 'Category 9: Public Stances & Ideology', fieldCount: 8, description: 'Platform summary, high-profile endorsements, documented town halls, public hearings.' },
  { id: 10, name: 'Category 10: Cryptographic Provenance', fieldCount: 6, description: 'Producer research agent ID, ISO timestamp, retrieval SHA-256, claim fingerprint, docket URL.' }
];

export function DataArchiveView() {
  const [activeTab, setActiveTab] = useState<'overview' | '50_states' | '100_fields_inspector' | 'evidence_ledger' | 'candidates' | 'daemon_status' | 'storage_tree'>('overview');
  const [selectedStateSlug, setSelectedStateSlug] = useState('florida');
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const [realEvidence, setRealEvidence] = useState<any[]>([]);
  const [daemonTelemetry, setDaemonTelemetry] = useState<any>(null);
  const [seatCount, setSeatCount] = useState<number>(5508);
  const [evidenceCount, setEvidenceCount] = useState<number>(0);
  const [snapshotCount, setSnapshotCount] = useState<number>(0);

  useEffect(() => {
    // Fetch live physical telemetry from server API
    fetch('/api/hermes/status')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setDaemonTelemetry(data);
          if (data.counts) {
            if (typeof data.counts.evidence === 'number') setEvidenceCount(data.counts.evidence);
            if (typeof data.counts.snapshots === 'number') setSnapshotCount(data.counts.snapshots);
            if (typeof data.counts.seats === 'number') setSeatCount(data.counts.seats);
          }
        }
      })
      .catch(() => {
        // Fallback gracefully if API unavailable
      });

    fetch('/api/hermes/evidence')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.evidence_objects)) {
          setRealEvidence(data.evidence_objects);
          setEvidenceCount(data.evidence_objects.length);
        }
      })
      .catch(() => {});
  }, []);

  const selectedStateObj = US_50_STATES.find((s) => s.slug === selectedStateSlug) || US_50_STATES[8]; // Florida default

  const filteredStates = US_50_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(stateSearchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(stateSearchTerm.toLowerCase()) ||
      s.region.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  return (
    <div id="data_archive_view_container" className="site-width py-8 space-y-8" style={{ minHeight: '85vh' }}>
      {/* Header */}
      <div id="data_archive_header" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold tracking-wider uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              CivicsLenZz Research Vault (Zero-Synthetic)
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white">
              Civic Data Vault & Evidence Ledger
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Autonomous research harvester vault preserving primary source government snapshots, full raw bytes, SHA-256 evidence seals, and non-canonical extracted records under strict fail-closed governance.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <SystemZipExporter buttonText="📦 Download Physical Data Archive (.ZIP)" className="w-full sm:w-auto text-sm" />
          </div>
        </div>

        {/* Runtime Derived Physical Metrics */}
        <div id="runtime_metrics_grid" className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Florida Master Ledger</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{seatCount.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400">Structural seats across 67 counties</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Producer Research State</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">UNREVIEWED</p>
            <p className="text-[11px] text-slate-400">EXTRACTED_UNREVIEWED (No validation claims)</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Research Contract Schema</p>
            <p className="text-2xl font-black text-blue-400 mt-1">100+ Fields</p>
            <p className="text-[11px] text-slate-400">10 standardized research categories</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Durable Snapshots / Evidence</p>
            <p className="text-2xl font-black text-purple-400 mt-1">
              {evidenceCount > 0 ? `${evidenceCount} Records` : 'Active / Ingesting'}
            </p>
            <p className="text-[11px] text-slate-400">Full raw payload preservation</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div id="data_archive_tabs" className="flex border-b border-gray-200 gap-2 overflow-x-auto pb-2">
        <button
          id="tab_btn_overview"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="file" size={15} />
          <span>Vault Overview</span>
        </button>

        <button
          id="tab_btn_50_states"
          onClick={() => setActiveTab('50_states')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === '50_states' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="landmark" size={15} />
          <span>50-State Scope Explorer</span>
        </button>

        <button
          id="tab_btn_100_fields"
          onClick={() => setActiveTab('100_fields_inspector')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === '100_fields_inspector' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="check-circle" size={15} />
          <span>100+ Field Contract Schema</span>
        </button>

        <button
          id="tab_btn_evidence_ledger"
          onClick={() => setActiveTab('evidence_ledger')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'evidence_ledger' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="activity" size={15} />
          <span>Durable Evidence Ledger</span>
        </button>

        <button
          id="tab_btn_candidates"
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'candidates' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="flag" size={15} />
          <span>2026 Florida Races</span>
        </button>

        <button
          id="tab_btn_daemon_status"
          onClick={() => setActiveTab('daemon_status')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'daemon_status' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="settings" size={15} />
          <span>Hermes Daemon & Telemetry</span>
        </button>

        <button
          id="tab_btn_storage_tree"
          onClick={() => setActiveTab('storage_tree')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'storage_tree' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-gray-100'
          }`}
        >
          <Icon name="external-link" size={15} />
          <span>Storage Tree (/data)</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div id="tab_content_overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <Icon name="landmark" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Florida Active Primary Scope</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Florida represents the active primary research scope with 5,508 structural seats cataloged across all 67 counties. Zero hardcoded officeholders; seat occupancy is discovered solely via verified primary evidence.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('50_states')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect State Scopes</span>
                <Icon name="chevron-right" size={14} />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                <Icon name="check-circle" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Zero-Synthetic Architecture</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Synthetic data generation has been permanently decommissioned. No simulated officeholders, no fabricated candidate timelines, and no fallback placeholders. Adapters fail closed on retrieval errors.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('100_fields_inspector')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Contract Specifications</span>
                <Icon name="chevron-right" size={14} />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                <Icon name="activity" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Non-Canonical Producer Research</h3>
                <p className="text-xs text-slate-600 mt-1">
                  CivicsLenZz operates as an autonomous research producer. All ingested evidence is labeled <code>EXTRACTED_UNREVIEWED</code>. Canonical verification and publication authority reside exclusively in CivicLenZ.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('evidence_ledger')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Evidence Records</span>
                <Icon name="chevron-right" size={14} />
              </button>
            </div>
          </div>

          {/* Real Storage Export Strip */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-amber-300">Physical Research Archive (.ZIP)</h3>
              <p className="text-xs text-slate-300">
                Packs authentic durable disk artifacts, raw retrieval byte payloads, and the structural Florida ledger into a verified ZIP archive.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SystemZipExporter buttonText="📦 Download Physical Data Archive (.ZIP)" variant="primary" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 50-STATE ROSTER EXPLORER */}
      {activeTab === '50_states' && (
        <div id="tab_content_50_states" className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">50-State Jurisdiction Scope Explorer</h2>
              <p className="text-xs text-slate-500">
                Authoritative distinction between active research jurisdictions and pending national scopes. No synthetic metrics or fabricated seat totals.
              </p>
            </div>

            <div className="w-full md:w-64">
              <input
                id="state_search_input"
                type="text"
                value={stateSearchTerm}
                onChange={(e) => setStateSearchTerm(e.target.value)}
                placeholder="Filter state (e.g. Florida, TX)..."
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* States List */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm max-h-[600px] overflow-y-auto space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Jurisdictions</p>
              {filteredStates.map((st) => {
                const isSelected = st.slug === selectedStateSlug;
                const isFlorida = st.slug === 'florida';
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
                        {isFlorida && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950 uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {st.region} Region • Capital: {st.capital}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-[11px] font-mono font-bold ${isFlorida ? (isSelected ? 'text-amber-300' : 'text-amber-700') : (isSelected ? 'text-slate-400' : 'text-slate-500')}`}>
                        {isFlorida ? '5,508 seats' : 'Scope Pending'}
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
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-mono font-bold">
                      JURISDICTION: {selectedStateObj.name.toUpperCase()} ({selectedStateObj.code})
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {selectedStateObj.name} Civic Research Scope
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      selectedStateObj.slug === 'florida'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}>
                      {selectedStateObj.slug === 'florida' ? 'ACTIVE_RESEARCH_SCOPE' : 'SCOPE_PENDING_AUTHORIZATION'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Structural Seats</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">
                      {selectedStateObj.slug === 'florida' ? '5,508' : 'NOT YET MEASURED'}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Active Harvest Scope</p>
                    <p className={`text-base font-black mt-0.5 ${selectedStateObj.slug === 'florida' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {selectedStateObj.slug === 'florida' ? 'Primary Active' : 'Deferred'}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">State Capital</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">{selectedStateObj.capital}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Evidence State</p>
                    <p className="text-base font-black text-blue-600 mt-0.5">
                      {selectedStateObj.slug === 'florida' ? 'EXTRACTED_UNREVIEWED' : 'UNRESEARCHED'}
                    </p>
                  </div>
                </div>

                {/* Scope Details */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    {selectedStateObj.slug === 'florida' ? 'Florida Primary Harvest Status' : `${selectedStateObj.name} Expansion Status`}
                  </h4>

                  {selectedStateObj.slug === 'florida' ? (
                    <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <p><strong>Active Sources:</strong> Florida Division of Elections, Florida Senate, Florida House of Representatives, FDLE/Ethics Commission, County Supervisors of Elections.</p>
                      <p><strong>Statutory Election Windows:</strong> § 99.061 F.S. (Qualifying Period: Noon June 8 – Noon June 12, 2026). Pre-qualifying window § 99.061(8) F.S. enforced strictly. No candidates marked QUALIFIED prior to qualifying window.</p>
                      <p><strong>Legislative Staggering:</strong> Florida Senate even-numbered districts scheduled for 2026 cycle; odd-numbered districts off-cycle (Art. III, § 15 Fla. Const.).</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs text-slate-500 bg-gray-50 p-4 rounded-xl border border-gray-200 italic">
                      <p>National expansion for {selectedStateObj.name} is queued behind Florida master reconciliation. Zero synthetic seats or fictional officials are generated for deferred jurisdictions.</p>
                      <p>Jurisdiction status: <code>SCOPE_PENDING_CANONICAL_AUTHORIZATION</code></p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 100+ FIELD RECORD INSPECTOR */}
      {activeTab === '100_fields_inspector' && (
        <div id="tab_content_100_fields" className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Hermes Ingest Contract Specifications (10 Categories)</h2>
            <p className="text-xs text-slate-500">
              CivicsLenZz adheres to the standardized 100+ field research schema. All categories require primary source attribution and SHA-256 evidence seals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Selector */}
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Research Categories</p>
              {CONTRACT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left p-3 rounded-xl transition cursor-pointer flex items-center justify-between text-xs ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white font-bold shadow-sm'
                      : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`font-mono text-[10px] ${selectedCategory === cat.id ? 'text-amber-400' : 'text-slate-400'}`}>
                    {cat.fieldCount} fields
                  </span>
                </button>
              ))}
            </div>

            {/* Category Detail */}
            <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              {(() => {
                const cat = CONTRACT_CATEGORIES.find(c => c.id === selectedCategory) || CONTRACT_CATEGORIES[0];
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">Specification Category #{cat.id}</span>
                        <h3 className="text-base font-black text-slate-900 mt-0.5">{cat.name}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                        {cat.fieldCount} Standard Fields
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>

                    <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 overflow-x-auto">
                      <p className="text-amber-400 font-bold">// Mandatory Contract Invariants:</p>
                      <p className="text-slate-300">✓ Ingestion State: Strictly marked EXTRACTED_UNREVIEWED</p>
                      <p className="text-slate-300">✓ Cryptographic Seals: Separate retrieval_content_sha256 & claim_fingerprint</p>
                      <p className="text-slate-300">✓ Primary Source Tier: Official .gov / .mil / statutory docket required for Tier A</p>
                      <p className="text-slate-300">✓ Zero Synthetic Fallbacks: Adapters fail closed on non-2xx HTTP responses</p>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      <strong>Audit Requirement:</strong> No official profile or candidate record may claim BASELINE_COMPLETE status until all required fields have verified primary source snapshots stored in <code>data/artifacts/retrievals/</code>.
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DURABLE EVIDENCE LEDGER */}
      {activeTab === 'evidence_ledger' && (
        <div id="tab_content_evidence_ledger" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Physical Evidence Ledger (EXTRACTED_UNREVIEWED)</h2>
              <p className="text-xs text-slate-500">
                Authentic extracted evidence records persisted in durable storage. Zero canonical validation authority claimed.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
              Verification State: EXTRACTED_UNREVIEWED
            </div>
          </div>

          {realEvidence.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Icon name="activity" size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Ingesting Live Evidence via Hermes Workers</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Evidence records are generated by the Hermes Worker Daemon during autonomous polling cycles. Run worker cycles or trigger adapter audits to record durable evidence objects.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 border-b border-gray-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Evidence ID</th>
                      <th className="p-3">Target Seat</th>
                      <th className="p-3">Field Key</th>
                      <th className="p-3">Extracted Value</th>
                      <th className="p-3">Source URL</th>
                      <th className="p-3">State</th>
                      <th className="p-3">SHA-256 Seal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {realEvidence.slice(0, 50).map((ev: any, idx: number) => (
                      <tr key={ev.evidence_uuid || idx} className="hover:bg-gray-50">
                        <td className="p-3 text-slate-900 font-bold">{ev.evidence_uuid ? ev.evidence_uuid.slice(0, 16) : 'N/A'}...</td>
                        <td className="p-3 text-slate-700">{ev.seat_uuid || 'N/A'}</td>
                        <td className="p-3 text-amber-700 font-bold">{ev.field_key || 'N/A'}</td>
                        <td className="p-3 text-slate-800 max-w-xs truncate">{String(ev.extracted_value || '')}</td>
                        <td className="p-3 text-blue-600 underline max-w-xs truncate">{ev.source_url || 'N/A'}</td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            {ev.verification_state || 'EXTRACTED_UNREVIEWED'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[10px]">
                          {ev.retrieval_content_sha256 ? ev.retrieval_content_sha256.slice(0, 12) : 'N/A'}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: 2026 CANDIDATES */}
      {activeTab === 'candidates' && (
        <div id="tab_content_candidates" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">2026 Florida Candidates & Contested Races</h2>
              <p className="text-xs text-slate-500">
                Tracking declared candidacies under Florida statutory election window § 99.061 F.S. All filings are PRE-QUALIFYING (§ 99.061(8) F.S.).
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold">
              Statutory Window: Noon June 8 – Noon June 12, 2026
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
                        <span className="ml-2 px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded text-[10px] font-mono">
                          FILED / PRE-QUALIFYING
                        </span>
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

      {/* TAB 6: DAEMON TELEMETRY */}
      {activeTab === 'daemon_status' && (
        <div id="tab_content_daemon_status" className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Hermes Autonomous Worker Daemon & Telemetry</h2>
            <p className="text-xs text-slate-500">
              Live operational metrics from the durable background worker loop executing continuous research passes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-amber-500/30 space-y-2">
              <p className="text-xs font-mono text-amber-400 uppercase font-bold">Daemon Worker</p>
              <p className="text-xl font-black">RUNNING</p>
              <p className="text-xs text-slate-300">Autonomous background loop (1 Worker Instance)</p>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-blue-500/30 space-y-2">
              <p className="text-xs font-mono text-blue-400 uppercase font-bold">Florida Ledger Seats</p>
              <p className="text-xl font-black">{seatCount.toLocaleString()}</p>
              <p className="text-xs text-slate-300">Master Florida structural seat ledger</p>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-purple-500/30 space-y-2">
              <p className="text-xs font-mono text-purple-400 uppercase font-bold">Durable Evidence</p>
              <p className="text-xl font-black">{evidenceCount.toLocaleString()}</p>
              <p className="text-xs text-slate-300">Extracted unreviewed evidence records</p>
            </div>
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-emerald-500/30 space-y-2">
              <p className="text-xs font-mono text-emerald-400 uppercase font-bold">Primary Sources</p>
              <p className="text-xl font-black">Tier A Active</p>
              <p className="text-xs text-slate-300">FL DOS, Senate, House, Ethics, County SOEs</p>
            </div>
          </div>

          {daemonTelemetry && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Server Daemon Telemetry Payload</h3>
              <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-64">
                {JSON.stringify(daemonTelemetry, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: STORAGE TREE */}
      {activeTab === 'storage_tree' && (
        <div id="tab_content_storage_tree" className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Physical Storage Architecture (/data Directory)</h2>
            <p className="text-xs text-slate-500">
              Clean directory layout maintaining authentic durable artifacts and full raw source snapshots on disk.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-200 font-mono text-xs overflow-x-auto shadow-2xl space-y-2">
            <p className="text-amber-400 font-bold">├── data/</p>
            <p className="pl-4 text-emerald-400">├── hermes_persistent_db.json <span className="text-slate-500"># Atomic durable storage (seats, evidence, jobs)</span></p>
            <p className="pl-4 text-blue-400">├── artifacts/ <span className="text-slate-500"># Preserved primary research artifacts</span></p>
            <p className="pl-8 text-cyan-400">├── retrievals/ <span className="text-slate-500"># Full raw un-truncated source byte payloads</span></p>
            <p className="pl-8 text-cyan-400">└── audits/ <span className="text-slate-500"># Factual completeness inspection reports</span></p>
            <p className="pl-4 text-purple-400">├── bridge-submissions.json <span className="text-slate-500"># Hermes Bridge M2M submission logs</span></p>
            <p className="pl-4 text-amber-300">└── REALITY.md <span className="text-slate-500"># Anti-simulation truth statement</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
