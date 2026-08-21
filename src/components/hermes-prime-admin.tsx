// CivicLenZ — H0 HERMES PRIME Master Orchestration Command Center
// Implements Command Center UI for H0 HERMES PRIME, Research Locks, Region Priorities, and Backlog Queue

import React, { useEffect, useState } from 'react';
import { Icon } from './icons';
import { hermesPrime, PersonResearchLock, PrimeLogMessage, RegionZone, RegionalCoverageSummary, SourceHealthItem, ForensicAuditReport } from '../lib/hermes-prime';
import { DrillDownCategory, RecordDrillDownModal } from './record-drilldown-modal';
import { ForensicAuditModal } from './forensic-audit-modal';

interface HermesPrimeAdminProps {
  onClose?: () => void;
}

export function HermesPrimeAdmin({ onClose }: HermesPrimeAdminProps) {
  const [activeRegion, setActiveRegion] = useState<RegionZone>('SOUTH_FLORIDA');
  const [locks, setLocks] = useState<PersonResearchLock[]>([]);
  const [logs, setLogs] = useState<PrimeLogMessage[]>([]);
  const [summaries, setSummaries] = useState<RegionalCoverageSummary[]>([]);
  const [sourceHealth, setSourceHealth] = useState<SourceHealthItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE_RESEARCH' | 'MONITORING' | 'GAP_ANALYSIS'>('ALL');
  const [auditReport, setAuditReport] = useState<ForensicAuditReport | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  
  // Drill-Down Modal state
  const [drillDownTarget, setDrillDownTarget] = useState<{
    officialName: string;
    title: string;
    category: DrillDownCategory;
    totalCount: number;
  } | null>(null);

  useEffect(() => {
    const updateData = () => {
      setLocks(hermesPrime.getActiveLocks());
      setLogs(hermesPrime.getLogs());
      setSummaries(hermesPrime.getRegionalSummaries());
      setSourceHealth(hermesPrime.getSourceHealthItems());
    };

    updateData();
    const interval = setInterval(updateData, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleRunAudit = () => {
    const report = hermesPrime.runForensicAudit();
    setAuditReport(report);
    setShowAuditModal(true);
  };

  const handleRegionChange = (region: RegionZone) => {
    setActiveRegion(region);
    hermesPrime.setFocusRegion(region);
  };

  const handleAuditClick = (personUuid: string) => {
    hermesPrime.triggerProfileAudit(personUuid);
  };

  const handleReopenClick = (personUuid: string) => {
    hermesPrime.reopenProfileResearch(personUuid, 'Manual Administrator Update Trigger');
  };

  const handleSimulateSourceFailure = (sourceId: string) => {
    hermesPrime.reportSourceFailure(sourceId, 'HTTP 503 Service Unavailable / Rate Limit');
  };

  const handleRecoverSource = (sourceId: string) => {
    hermesPrime.recoverSourceHealth(sourceId);
  };

  const handleCertifyWinner = (seatUuid: string, personUuid: string) => {
    hermesPrime.certifyAndTransitionElectionWinner(seatUuid, personUuid);
  };

  const filteredLocks = locks.filter(lock => {
    if (lock.region !== activeRegion) return false;
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE_RESEARCH') return lock.research_state === 'ACTIVE_RESEARCH' || lock.research_state === 'RESEARCH_QUEUED';
    if (activeFilter === 'MONITORING') return lock.research_state === 'MONITORING' || lock.research_state === 'RESEARCH_COMPLETE';
    if (activeFilter === 'GAP_ANALYSIS') return lock.research_state === 'GAP_ANALYSIS' || lock.research_state === 'HUMAN_REVIEW';
    return true;
  });

  const currentSummary = summaries.find(s => s.region === activeRegion) || summaries[0];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-8 font-sans space-y-6">
      {showAuditModal && auditReport && (
        <ForensicAuditModal
          report={auditReport}
          onClose={() => setShowAuditModal(false)}
          onRefreshAudit={handleRunAudit}
        />
      )}

      {drillDownTarget && (
        <RecordDrillDownModal
          officialName={drillDownTarget.officialName}
          title={drillDownTarget.title}
          category={drillDownTarget.category}
          totalCount={drillDownTarget.totalCount}
          onClose={() => setDrillDownTarget(null)}
        />
      )}

      {/* Top Header Control Tower */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-950 border border-purple-500/50 text-purple-300 font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              H0 — HERMES PRIME MASTER CONTROL TOWER
            </span>
            <span className="text-slate-500 text-xs font-mono">/admin/hermes-prime</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Hierarchical Research Orchestrator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing 65 Top-Level Logical Agents across Seats, Officeholders (Swarm A: H1–H32), Candidates (Swarm B: C1–C32), & HERMES PRIME Control Plane.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunAudit}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Icon name="shield" size={15} />
            Run Forensic Audit on All 65 Dual-Swarm Agents
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              ← Exit Orchestrator View
            </button>
          )}
        </div>
      </div>

      {/* Regional Focus Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => handleRegionChange('SOUTH_FLORIDA')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeRegion === 'SOUTH_FLORIDA'
              ? 'bg-purple-900/40 border-purple-500 ring-2 ring-purple-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
              PRIORITY ZONE 1
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              75% WORKLOAD
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-2">🌴 South Florida Zone</h3>
          <p className="text-xs text-slate-400 mt-1">Miami-Dade, Broward, Palm Beach, Monroe, Martin</p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono pt-2 border-t border-purple-500/20">
            <span className="text-slate-300">Monitored Seats: <b>20,739</b></span>
            <span className="text-purple-300 font-bold">100% Active</span>
          </div>
        </button>

        <button
          onClick={() => handleRegionChange('REST_OF_FLORIDA')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeRegion === 'REST_OF_FLORIDA'
              ? 'bg-purple-900/40 border-purple-500 ring-2 ring-purple-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              ZONE 2
            </span>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              STATEWIDE
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-2">☀️ State of Florida</h3>
          <p className="text-xs text-slate-400 mt-1">Tallahassee, Central FL, Tampa, Duval, Panhandle</p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
            <span className="text-slate-300">Monitored Seats: <b>85,000</b></span>
            <span className="text-amber-300 font-bold">Queued</span>
          </div>
        </button>

        <button
          onClick={() => handleRegionChange('NATIONAL_REST_OF_US')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
            activeRegion === 'NATIONAL_REST_OF_US'
              ? 'bg-purple-900/40 border-purple-500 ring-2 ring-purple-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
              ZONE 3
            </span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
              NATIONAL
            </span>
          </div>
          <h3 className="text-base font-bold text-white mt-2">🇺🇸 Rest of United States</h3>
          <p className="text-xs text-slate-400 mt-1">Federal Offices, 49 Other States & Territories</p>
          <div className="mt-3 flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
            <span className="text-slate-300">Monitored Seats: <b>513,420</b></span>
            <span className="text-blue-300 font-bold">Standard Watch</span>
          </div>
        </button>
      </div>

      {/* Regional Metrics Banner */}
      {currentSummary && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">Total Tracked Profiles</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{currentSummary.totalOfficialsTracked}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">100% Completed Profiles</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{currentSummary.completeProfiles}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">Active Research Locks</span>
            <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">{currentSummary.activeResearchMissions}</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block">Avg Regional Coverage</span>
            <span className="text-2xl font-black text-blue-400 font-mono mt-1 block">{currentSummary.coveragePercent}%</span>
          </div>
        </div>
      )}

      {/* Active Locks Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Icon name="check-circle" size={18} className="text-purple-400" />
            <h2 className="text-lg font-bold text-white">
              Person Research Locks ({activeRegion.replace(/_/g, ' ')})
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {(['ALL', 'ACTIVE_RESEARCH', 'GAP_ANALYSIS', 'MONITORING'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-lg transition ${
                  activeFilter === f
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredLocks.map(lock => (
            <div
              key={lock.person_uuid}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/50 transition space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-purple-400 font-bold">{lock.jurisdiction}</span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {lock.office_type}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">{lock.person_name}</h3>
                  <p className="text-xs text-slate-400">{lock.title}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    lock.research_state === 'MONITORING'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : lock.research_state === 'ACTIVE_RESEARCH'
                      ? 'bg-purple-950 text-purple-300 border-purple-500/50 animate-pulse'
                      : lock.research_state === 'GAP_ANALYSIS'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {lock.research_state}
                  </span>
                  <span className="block text-xl font-black font-mono text-white mt-1">
                    {lock.completion_percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      lock.completion_percentage >= 100
                        ? 'bg-emerald-500'
                        : lock.completion_percentage >= 80
                        ? 'bg-purple-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${lock.completion_percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                  <span>Assigned Agents: <b>{lock.assigned_agents.length} Workers</b></span>
                  <span>Missing Checks: <b>{lock.missing_fields_count}</b></span>
                </div>
              </div>

              {/* Assigned Agent Badges */}
              <div className="flex flex-wrap gap-1">
                {lock.assigned_agents.slice(0, 8).map(agentId => (
                  <span key={agentId} className="text-[10px] font-mono bg-slate-800 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                    {agentId}
                  </span>
                ))}
                {lock.assigned_agents.length > 8 && (
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    +{lock.assigned_agents.length - 8} more
                  </span>
                )}
              </div>

              {/* Quick Drill-Down Action Bar (Section XXIV) */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 self-center mr-1">DRILL-DOWN:</span>
                <button
                  onClick={() => setDrillDownTarget({ officialName: lock.person_name, title: lock.title, category: 'VOTES', totalCount: 1247 })}
                  className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 px-2 py-0.5 rounded cursor-pointer transition"
                >
                  Votes (1,247)
                </button>
                <button
                  onClick={() => setDrillDownTarget({ officialName: lock.person_name, title: lock.title, category: 'BILLS', totalCount: 32 })}
                  className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-300 px-2 py-0.5 rounded cursor-pointer transition"
                >
                  Bills (32)
                </button>
                <button
                  onClick={() => setDrillDownTarget({ officialName: lock.person_name, title: lock.title, category: 'PROMISES', totalCount: 18 })}
                  className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 px-2 py-0.5 rounded cursor-pointer transition"
                >
                  Promises (18)
                </button>
                <button
                  onClick={() => setDrillDownTarget({ officialName: lock.person_name, title: lock.title, category: 'DONATIONS', totalCount: 850 })}
                  className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 px-2 py-0.5 rounded cursor-pointer transition"
                >
                  Finance ($350k)
                </button>
                <button
                  onClick={() => setDrillDownTarget({ officialName: lock.person_name, title: lock.title, category: 'BUSINESS_INTERESTS', totalCount: 5 })}
                  className="text-[10px] font-mono bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded cursor-pointer transition"
                >
                  Business (5)
                </button>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
                <span className="text-slate-500 text-[10px]">Mission ID: {lock.mission_uuid.substring(0, 16)}...</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleCertifyWinner(lock.seat_uuid, lock.person_uuid)}
                    className="bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/50 text-emerald-200 text-[10px] px-2 py-1 rounded-lg transition cursor-pointer font-bold"
                  >
                    Certify Election Winner
                  </button>
                  <button
                    onClick={() => handleAuditClick(lock.person_uuid)}
                    className="bg-purple-900/60 hover:bg-purple-800 border border-purple-500/50 text-purple-200 text-[10px] px-2 py-1 rounded-lg transition cursor-pointer"
                  >
                    Re-Audit
                  </button>
                  <button
                    onClick={() => handleReopenClick(lock.person_uuid)}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-lg transition cursor-pointer"
                  >
                    Reopen Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 2.3: H27 Source Health & Fallback Retry Monitor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-base font-bold text-white font-mono">
              H27 — Source Health & Fallback Retry Daemon (Section XXXIII)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Automatic Availability Monitoring & Retry Queue</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sourceHealth.map(src => (
            <div key={src.source_id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-purple-400">{src.assigned_agent} AGENT SOURCE</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{src.source_name}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                  src.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  {src.status}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Failures: <b className={src.fail_count > 0 ? 'text-amber-400' : 'text-slate-300'}>{src.fail_count}</b></span>
                <span className="text-[10px] text-slate-500">Checked: {new Date(src.last_check).toLocaleTimeString()}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                {src.status === 'ONLINE' ? (
                  <button
                    onClick={() => handleSimulateSourceFailure(src.source_id)}
                    className="text-[10px] font-mono bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 px-2 py-1 rounded transition cursor-pointer"
                  >
                    Simulate 503 Failure
                  </button>
                ) : (
                  <button
                    onClick={() => handleRecoverSource(src.source_id)}
                    className="text-[10px] font-mono bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 px-2 py-1 rounded transition cursor-pointer"
                  >
                    Recover Source Online
                  </button>
                )}
                <a
                  href={src.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-slate-400 hover:text-white underline"
                >
                  Portal URL →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live H0 Orchestrator Event Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <h2 className="text-base font-bold text-white font-mono">
              H0 — HERMES PRIME Real-Time Action Log
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Showing last 80 events</span>
        </div>

        <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs max-h-64 overflow-y-auto space-y-2 border border-slate-800">
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-2 border-b border-slate-900/80 pb-1.5">
              <span className="text-slate-500 shrink-0">{log.timestamp}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                log.level === 'SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                log.level === 'WARN' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                log.level === 'ACTION' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                'bg-slate-800 text-slate-300'
              }`}>
                {log.agent || 'H0_PRIME'}
              </span>
              <span className="text-slate-300 flex-1">{log.message}</span>
              {log.region && (
                <span className="text-[10px] text-slate-500 shrink-0">[{log.region.substring(0, 8)}]</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
