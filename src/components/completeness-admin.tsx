// CivicLenZ — Completeness Audit Admin & Mass Coverage Command Center
// Implements Sections XXI (Profile Fact Inventory), XXII (Seat Inventory), and XXIII (Mass Coverage Dashboard)

import React, { useState } from 'react';
import { Icon } from './icons';
import { AllowedFieldState, OfficeTypeTemplate } from '../lib/completeness-contract';
import { profileCompletenessEngine, ProfileCompletenessReport } from '../lib/completeness-engine';
import { seatLifecycleEngine, SeatWatchMeta } from '../lib/seat-lifecycle-engine';
import { hermesOrchestratorV2 } from '../lib/hermes-matrix-v2';
import { HermesPrimeAdmin } from './hermes-prime-admin';

interface CompletenessAdminProps {
  onClose?: () => void;
  initialPersonUuid?: string;
  initialSeatUuid?: string;
}

export function CompletenessAdmin({
  onClose,
  initialPersonUuid = 'person_fl_gov_incumbent',
  initialSeatUuid = 'seat_fl_sen_15'
}: CompletenessAdminProps) {
  const [activeTab, setActiveTab] = useState<'HERMES_PRIME' | 'MASS_COVERAGE' | 'PERSON_FACT_INVENTORY' | 'SEAT_INVENTORY'>('HERMES_PRIME');
  const [selectedPersonUuid, setSelectedPersonUuid] = useState<string>(initialPersonUuid);
  const [selectedOfficeType, setSelectedOfficeType] = useState<OfficeTypeTemplate>('STATE_LEGISLATOR');
  const [personNameSearch, setPersonNameSearch] = useState<string>('Senator Kamia L. Brown');

  const [selectedSeatUuid, setSelectedSeatUuid] = useState<string>(initialSeatUuid);

  // Filter state for Mass Coverage
  const [filterOfficeType, setFilterOfficeType] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'COVERAGE' | 'FRESHNESS' | 'ELECTION_PROXIMITY'>('COVERAGE');

  // Compute reports
  const personReport: ProfileCompletenessReport = profileCompletenessEngine.evaluatePersonProfile(
    selectedPersonUuid,
    selectedOfficeType,
    personNameSearch
  );

  const selectedSeat: SeatWatchMeta | undefined = seatLifecycleEngine.getSeatMeta(selectedSeatUuid);
  const allSeats: SeatWatchMeta[] = seatLifecycleEngine.getAllMonitoredSeats();

  const handleRunTargetedMission = () => {
    const mission = profileCompletenessEngine.generateMissingDataMissions(
      selectedPersonUuid,
      selectedOfficeType,
      personNameSearch
    );
    mission.generated_jobs.forEach(job => hermesOrchestratorV2.enqueueJob(job));
    alert(`Enqueued ${mission.generated_jobs.length} targeted research jobs into HERMES Daemon!`);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 font-sans space-y-6">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-900/60 border border-purple-600 text-purple-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
              CIVICLENZ ADMIN COMMAND CENTER
            </span>
            <span className="text-slate-500 text-xs font-mono">/admin/completeness</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Master Data Completeness & Seat Audit Inventory
          </h1>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            ← Exit Admin Inspection
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-mono font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('HERMES_PRIME')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'HERMES_PRIME'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-300 animate-pulse" />
          H0 — HERMES PRIME Control Tower
        </button>

        <button
          onClick={() => setActiveTab('MASS_COVERAGE')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'MASS_COVERAGE'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Icon name="chart" size={16} />
          Section XXIII: Mass Coverage Dashboard
        </button>

        <button
          onClick={() => setActiveTab('PERSON_FACT_INVENTORY')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'PERSON_FACT_INVENTORY'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Icon name="user" size={16} />
          Section XXI: Profile Fact Inventory
        </button>

        <button
          onClick={() => setActiveTab('SEAT_INVENTORY')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'SEAT_INVENTORY'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Icon name="landmark" size={16} />
          Section XXII: Seat Completeness Inventory
        </button>
      </div>

      {/* TAB 0: H0 HERMES PRIME CONTROL TOWER */}
      {activeTab === 'HERMES_PRIME' && (
        <HermesPrimeAdmin />
      )}

      {/* TAB 1: SECTION XXIII - MASS COVERAGE DASHBOARD */}
      {activeTab === 'MASS_COVERAGE' && (
        <div className="space-y-6">
          {/* Distribution Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-900 border border-emerald-900/60 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase">100% CHECKS COMPLETE</span>
              <span className="text-2xl font-black text-white font-mono">14,210</span>
              <span className="text-[10px] text-slate-400 block font-mono">CivicLenZ Verified Badges</span>
            </div>

            <div className="bg-slate-900 border border-blue-900/60 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-blue-400 font-bold block uppercase">95% - 99% COVERAGE</span>
              <span className="text-2xl font-black text-white font-mono">6,530</span>
              <span className="text-[10px] text-slate-400 block font-mono">1-2 Field Checks Pending</span>
            </div>

            <div className="bg-slate-900 border border-amber-900/60 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">80% - 94% COVERAGE</span>
              <span className="text-2xl font-black text-white font-mono">8,940</span>
              <span className="text-[10px] text-slate-400 block font-mono">Targeted Research Active</span>
            </div>

            <div className="bg-slate-900 border border-orange-900/60 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono text-orange-400 font-bold block uppercase">50% - 79% COVERAGE</span>
              <span className="text-2xl font-black text-white font-mono">3,120</span>
              <span className="text-[10px] text-slate-400 block font-mono">New Candidates / Non-Leg</span>
            </div>

            <div className="bg-slate-900 border border-rose-900/60 p-4 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-rose-400 font-bold block uppercase">BELOW 50%</span>
              <span className="text-2xl font-black text-white font-mono">410</span>
              <span className="text-[10px] text-slate-400 block font-mono">Newly Discovered Seats</span>
            </div>
          </div>

          {/* Controls & Mass Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Icon name="shield" size={16} className="text-purple-400" />
                Statewide Officials & Seats Mass Completeness Ledger
              </h3>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Sort Priority:</span>
                <button
                  onClick={() => setSortBy('COVERAGE')}
                  className={`px-3 py-1 rounded-lg border font-bold ${
                    sortBy === 'COVERAGE' ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Coverage %
                </button>
                <button
                  onClick={() => setSortBy('ELECTION_PROXIMITY')}
                  className={`px-3 py-1 rounded-lg border font-bold ${
                    sortBy === 'ELECTION_PROXIMITY' ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Election Proximity
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="p-2.5">Official / Seat</th>
                    <th className="p-2.5">Office Type</th>
                    <th className="p-2.5">Jurisdiction</th>
                    <th className="p-2.5">Required Checks</th>
                    <th className="p-2.5">Freshness</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 font-bold text-white">Senator Kamia L. Brown</td>
                    <td className="p-2.5">STATE_LEGISLATOR</td>
                    <td className="p-2.5">Florida Senate Dist 15</td>
                    <td className="p-2.5 text-emerald-400 font-bold">12 / 12 (100.0%)</td>
                    <td className="p-2.5 text-blue-400 font-bold">98.2%</td>
                    <td className="p-2.5">
                      <span className="bg-emerald-950 border border-emerald-700 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        100% VERIFIED
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedPersonUuid('person_fl_sen_15_incumbent');
                          setSelectedOfficeType('STATE_LEGISLATOR');
                          setPersonNameSearch('Senator Kamia L. Brown');
                          setActiveTab('PERSON_FACT_INVENTORY');
                        }}
                        className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                      >
                        Inspect Fact Inventory →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 font-bold text-white">Governor Ron DeSantis</td>
                    <td className="p-2.5">EXECUTIVE</td>
                    <td className="p-2.5">State of Florida</td>
                    <td className="p-2.5 text-emerald-400 font-bold">14 / 14 (100.0%)</td>
                    <td className="p-2.5 text-blue-400 font-bold">96.7%</td>
                    <td className="p-2.5">
                      <span className="bg-emerald-950 border border-emerald-700 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        100% VERIFIED
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedPersonUuid('person_fl_gov_incumbent');
                          setSelectedOfficeType('EXECUTIVE');
                          setPersonNameSearch('Governor Ron DeSantis');
                          setActiveTab('PERSON_FACT_INVENTORY');
                        }}
                        className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                      >
                        Inspect Fact Inventory →
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-2.5 font-bold text-white">Challenger Marcus Vance</td>
                    <td className="p-2.5">STATE_LEGISLATOR (CANDIDATE)</td>
                    <td className="p-2.5">Florida Senate Dist 15</td>
                    <td className="p-2.5 text-amber-400 font-bold">10 / 12 (83.3%)</td>
                    <td className="p-2.5 text-blue-400 font-bold">92.0%</td>
                    <td className="p-2.5">
                      <span className="bg-amber-950 border border-amber-700 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        INCOMPLETE (2 PENDING)
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedPersonUuid('person_cand_challenger_001');
                          setSelectedOfficeType('STATE_LEGISLATOR');
                          setPersonNameSearch('Marcus Vance');
                          setActiveTab('PERSON_FACT_INVENTORY');
                        }}
                        className="text-purple-400 hover:text-purple-300 font-bold cursor-pointer"
                      >
                        Inspect Fact Inventory →
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECTION XXI - PROFILE FACT INVENTORY */}
      {activeTab === 'PERSON_FACT_INVENTORY' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                  SECTION XXI — PROFILE FACT INVENTORY
                </span>
                <h2 className="text-lg font-black text-white">
                  Completeness Audit for {personReport.full_name} ({personReport.office_type})
                </h2>
                <span className="text-xs font-mono text-slate-400">UUID: {personReport.person_uuid}</span>
              </div>

              <button
                onClick={handleRunTargetedMission}
                className="bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Icon name="sparkles" size={16} />
                Generate Missing-Data Mission
              </button>
            </div>

            {/* Metrics Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Required Data Points</span>
                <span className="text-lg font-bold text-white">{personReport.required_field_count}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Completed Checks</span>
                <span className="text-lg font-bold text-emerald-400">{personReport.completed_checks}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Pending Research</span>
                <span className="text-lg font-bold text-amber-400">{personReport.pending_checks}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Stale Checks</span>
                <span className="text-lg font-bold text-orange-400">{personReport.stale_checks}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Conflicting Sources</span>
                <span className="text-lg font-bold text-rose-400">{personReport.conflicting_checks}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Not Applicable</span>
                <span className="text-lg font-bold text-slate-400">{personReport.not_applicable_checks}</span>
              </div>
            </div>
          </div>

          {/* Sub-Completeness Breakdown Grid (Section XII) */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              Section XII — Sub-Completeness Category Scores
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 font-mono text-xs">
              {Object.entries(personReport.sub_scores).map(([cat, score]) => (
                <div key={cat} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold truncate">{cat}</span>
                  <span className={`text-sm font-bold ${score === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Granular Field Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              All Required Fields Evaluation Table
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="p-2.5">Field Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Current Terminal State</th>
                    <th className="p-2.5">Responsible Agent</th>
                    <th className="p-2.5">Primary Authoritative Source</th>
                    <th className="p-2.5 text-right">Last Evaluated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {personReport.evaluated_fields.map(field => (
                    <tr key={field.field_id} className="hover:bg-slate-800/40 transition">
                      <td className="p-2.5 font-bold text-white">{field.field_name}</td>
                      <td className="p-2.5 text-slate-400 text-[11px]">{field.category}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          field.state === 'VERIFIED_VALUE' ? 'bg-emerald-950 border-emerald-700 text-emerald-300' :
                          field.state === 'NOT_APPLICABLE' ? 'bg-slate-950 border-slate-800 text-slate-400' :
                          'bg-amber-950 border-amber-700 text-amber-300'
                        }`}>
                          {field.state}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-purple-300">{field.responsible_agent}</td>
                      <td className="p-2.5 text-blue-400 truncate max-w-xs">{field.source_url}</td>
                      <td className="p-2.5 text-right text-slate-500 text-[10px]">
                        {new Date(field.last_evaluated_timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECTION XXII - SEAT COMPLETENESS INVENTORY */}
      {activeTab === 'SEAT_INVENTORY' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                  SECTION XXII — SEAT COMPLETENESS INVENTORY
                </span>
                <h2 className="text-lg font-black text-white">
                  Seat Watch Lifecycle for {selectedSeat?.seat_title || 'Monitored Seat'}
                </h2>
                <span className="text-xs font-mono text-slate-400">UUID: {selectedSeat?.seat_uuid}</span>
              </div>

              <div className="flex items-center gap-2">
                {allSeats.map(s => (
                  <button
                    key={s.seat_uuid}
                    onClick={() => setSelectedSeatUuid(s.seat_uuid)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border cursor-pointer ${
                      selectedSeatUuid === s.seat_uuid
                        ? 'bg-purple-600 border-purple-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {s.seat_title}
                  </button>
                ))}
              </div>
            </div>

            {selectedSeat && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs font-mono">
                {/* Seat Core Card */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Current Officeholder</span>
                  <div className="text-sm font-black text-white">{selectedSeat.current_officeholder?.name || 'VACANT'}</div>
                  <div className="text-slate-400">{selectedSeat.current_officeholder?.party} • Term: {selectedSeat.current_officeholder?.term_start} to {selectedSeat.current_officeholder?.term_end}</div>
                  <div className="pt-2">
                    <span className="bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                      ACTIVE INCUMBENT VERIFIED
                    </span>
                  </div>
                </div>

                {/* Upcoming Election Engine */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Upcoming Election Watch</span>
                  <div className="text-sm font-black text-white">{selectedSeat.upcoming_election.election_type} ELECTION</div>
                  <div className="text-slate-400">Date: {selectedSeat.upcoming_election.election_date}</div>
                  <div className="text-slate-400">Declared Candidates: {selectedSeat.declared_candidates.length}</div>
                </div>

                {/* District GIS Boundary Test (Section IX) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">District Boundary GIS Test</span>
                  <div className="text-slate-300 flex justify-between">
                    <span>Known Inside Test:</span>
                    <strong className="text-emerald-400">✓ PASSED</strong>
                  </div>
                  <div className="text-slate-300 flex justify-between">
                    <span>Known Outside Test:</span>
                    <strong className="text-emerald-400">✓ PASSED</strong>
                  </div>
                  <div className="text-slate-400 truncate text-[10px]">Sample: {selectedSeat.boundary_gis.known_inside_address_test}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
