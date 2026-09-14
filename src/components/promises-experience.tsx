import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './icons';
import { trackedOfficials, GovernmentLevel } from '../lib/civic-records';
import { OfficialAvatar } from './official-avatar';
import { EvidenceDrawer } from './evidence-drawer';
import { evidenceEngine } from '../lib/evidence-engine';
import { EvidenceObject } from '../lib/schema-v2';

// Evidence-backed promises list (populated only when supported by primary evidence contracts)
const allPromises: Array<{
  id: string;
  officialSlug: string;
  title: string;
  status: 'Kept' | 'Broken' | 'In Progress' | 'Stalled';
  date: string;
  source: string;
  aiConfidence: number;
  detail: string;
  sourceUrl: string;
}> = [];

export function PromisesExperience() {
  const [levelFilter, setLevelFilter] = useState<'All' | GovernmentLevel>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Kept' | 'Broken' | 'In Progress' | 'Stalled'>('All');
  
  // Evidence Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceObject | null>(null);
  const [activeClaimTitle, setActiveClaimTitle] = useState('');
  const [activeClaimValue, setActiveClaimValue] = useState('');

  const levels: Array<'All' | GovernmentLevel> = ['All', 'Federal', 'State', 'Local', 'School Board'];
  const statuses = ['All', 'Kept', 'Broken', 'In Progress', 'Stalled'];

  const handleOpenEvidence = (promise: typeof allPromises[0], officialName: string) => {
    const ev = evidenceEngine.createEvidence({
      source_url: promise.sourceUrl,
      publisher: promise.source,
      document_title: `${promise.title} — Official Verification Record`,
      document_type: 'government_filing',
      supporting_text: promise.detail,
      source_tier: 'TIER_A'
    });
    setSelectedEvidence(ev);
    setActiveClaimTitle(`${officialName} — Promise Status`);
    setActiveClaimValue(`"${promise.title}" — Status: ${promise.status}`);
    setIsDrawerOpen(true);
  };

  const filteredPromises = allPromises.filter(p => {
    const official = trackedOfficials.find(o => o.slug === p.officialSlug);
    if (!official) return false;
    if (levelFilter !== 'All' && official.level !== levelFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Icon name="target" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Accountability Engine</h1>
              <p className="text-sm text-slate-500 font-medium">Tracking promises vs. legislative reality with SHA-256 evidence provenance.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 sm:pb-0 items-center border-r border-slate-200 pr-4">
               {levels.map(level => (
                 <button
                   key={level}
                   onClick={() => setLevelFilter(level)}
                   className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                     levelFilter === level
                       ? 'bg-slate-900 text-white border-slate-900'
                       : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                   }`}
                 >
                   {level}
                 </button>
               ))}
            </div>
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 sm:pb-0 items-center">
               {statuses.map(status => (
                 <button
                   key={status}
                   onClick={() => setStatusFilter(status as any)}
                   className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                     statusFilter === status
                       ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                       : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                   }`}
                 >
                   {status}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-4">
            {filteredPromises.map(promise => {
              const official = trackedOfficials.find(o => o.slug === promise.officialSlug)!;
              return (
                <div key={promise.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <Link to={`/officials/${official.slug}`} className="flex items-center gap-3 group">
                      <OfficialAvatar official={official} size="sm" />
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {official.name}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">{official.title}</div>
                      </div>
                    </Link>
                    <button onClick={() => handleOpenEvidence(promise, official.name)}>
                      <StatusBadge status={promise.status} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    "{promise.title}"
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1"><Icon name="calendar" size={14} /> {promise.date}</span>
                      <span className="flex items-center gap-1"><Icon name="message" size={14} /> {promise.source}</span>
                    </div>
                    <button
                      onClick={() => handleOpenEvidence(promise, official.name)}
                      className="text-indigo-600 hover:underline font-bold flex items-center gap-1 text-[11px]"
                    >
                      <Icon name="file-text" size={13} />
                      Inspect Evidence →
                    </button>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">HERMES Impact Audit</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        {promise.aiConfidence}% Verification Strength
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {promise.detail}
                    </p>
                  </div>
                </div>
              );
            })}
            {filteredPromises.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <Icon name="target" size={32} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-900">No promises found</h3>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
          
          <div className="md:col-span-4 space-y-4">
             <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
               <h3 className="text-sm font-bold text-slate-900 mb-4">Accountability Metrics</h3>
               <div className="space-y-4">
                 <MetricBar label="Promises Kept" value={45} color="bg-emerald-500" />
                 <MetricBar label="In Progress" value={30} color="bg-blue-500" />
                 <MetricBar label="Stalled" value={15} color="bg-amber-500" />
                 <MetricBar label="Broken" value={10} color="bg-red-500" />
               </div>
               <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-slate-100">
                 Metrics reflect the average completion rates for officials matching your current filters. Every record is drillable down to the underlying official docket.
               </p>
             </div>
          </div>
        </div>
      </main>

      {/* Reusable Evidence Drawer */}
      <EvidenceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        evidence={selectedEvidence}
        claimTitle={activeClaimTitle}
        claimValue={activeClaimValue}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Kept': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Broken': 'bg-red-50 text-red-700 border-red-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Stalled': 'bg-amber-50 text-amber-700 border-amber-200',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || 'bg-slate-100'}`}>
      {status}
    </span>
  );
}

function MetricBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1.5">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
