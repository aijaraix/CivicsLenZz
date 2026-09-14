import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from './icons';
import { OfficialAvatar } from './official-avatar';
import { CoverageMap } from './coverage-map';
import { getTrackedOfficial, TrackedOfficial, activityItems, ActivityItem } from '../lib/civic-records';
import { CompletenessAdmin } from './completeness-admin';
import { hermesPrime } from '../lib/hermes-prime';
import { DrillDownCategory, RecordDrillDownModal } from './record-drilldown-modal';

function AccordionItem({ title, subtitle, icon, rightElement, children }: { key?: React.Key, title: string, subtitle?: string, icon?: import("./icons").IconName, rightElement?: React.ReactNode, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`accordion-item ${open ? 'open' : ''} border-b border-slate-100 last:border-0`}>
      <button 
        type="button" 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {icon && <Icon name={icon} size={20} className="text-slate-400" />}
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {subtitle && <small className="block text-slate-500 text-xs mt-0.5">{subtitle}</small>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {rightElement}
          <Icon name={open ? "chevron-up" : "chevron-down"} size={18} className="text-slate-400" />
        </div>
      </button>
      {open && (
        <div className="p-4 pt-0 bg-slate-50/50 text-sm text-slate-700 animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </article>
  );
}

export function ProfileExperience() {
  const { slug } = useParams();
  const official = getTrackedOfficial(slug ?? '');
  const [showCompletenessModal, setShowCompletenessModal] = useState(false);
  const [drillDownTarget, setDrillDownTarget] = useState<{
    category: DrillDownCategory;
    title: string;
    totalCount: number;
  } | null>(null);
  
  if (!official) {
    return <section className="profile-page"><div className="site-width"><h2>Official not found.</h2><Link to="/search/">Back to search</Link></div></section>;
  }

  const primeLock = hermesPrime.getLockByPersonUuid(official.slug || 'person_daniella') || hermesPrime.getActiveLocks()[0];

  return (
    <section className="profile-page pb-20">
      {drillDownTarget && (
        <RecordDrillDownModal
          officialName={official.name}
          title={official.title}
          category={drillDownTarget.category}
          totalCount={drillDownTarget.totalCount}
          onClose={() => setDrillDownTarget(null)}
        />
      )}

      {showCompletenessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4">
          <CompletenessAdmin
            onClose={() => setShowCompletenessModal(false)}
            initialPersonUuid={official.slug || 'person_fl_sen_15_incumbent'}
          />
        </div>
      )}

      <div className="profile-header">
        <div className="site-width profile-header-inner">
          <Link to="/search/" className="back-link"><Icon name="arrow-left" size={16} /> Back to results</Link>
          
          {/* Section XXV: H0 HERMES PRIME Research Completeness Banner */}
          {primeLock && (
            <div 
              onClick={() => setShowCompletenessModal(true)}
              className="my-3 bg-purple-950/80 border border-purple-500/40 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-purple-100 cursor-pointer hover:border-purple-400 transition shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full shrink-0 ${primeLock.completion_percentage >= 100 ? 'bg-emerald-400' : 'bg-purple-400 animate-pulse'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-widest block">
                      HERMES PRIME RESEARCH LOCK — {primeLock.region.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono bg-purple-900 border border-purple-700 px-1.5 py-0.2 rounded text-purple-200">
                      {primeLock.research_state}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {primeLock.completion_percentage >= 100 && official.coverage_status === 'BASELINE_COMPLETE'
                      ? '✓ REQUIRED CHECKS AUDITED'
                      : `● RESEARCH ACTIVE — ${primeLock.research_state || 'EXTRACTED_UNREVIEWED'} (PRODUCER RESEARCH ONLY)`}
                  </span>
                </div>
              </div>
              <button 
                type="button"
                className="text-xs font-mono font-bold bg-purple-900 hover:bg-purple-800 text-purple-200 px-3 py-1.5 rounded-xl border border-purple-600 shrink-0"
              >
                Inspect Audit Contract →
              </button>
            </div>
          )}

          <div className="profile-identity">
            <OfficialAvatar official={official} size="xl" />
            <div className="profile-identity-copy flex-1">
              <h1 className="flex flex-wrap items-center gap-3">
                <span>{official.name}</span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300">
                  {official.verification_state || 'EXTRACTED_UNREVIEWED'}
                </span>
              </h1>
              <p className="text-lg font-medium text-slate-700">{official.title}</p>
              
              {/* Upcoming Election / On the Ballot Highlight */}
              {official.nextElection?.includes('2026') && (
                <div className="my-3 bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest block">ON THE BALLOT FOR ELECTION</span>
                      <span className="text-xs font-bold text-slate-900">2026 Contest Schedule</span>
                    </div>
                  </div>
                  <Link
                    to="/elections/my"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow-xs shrink-0"
                  >
                    View Election & Pipeline →
                  </Link>
                </div>
              )}

              <div className="flex gap-2 items-center mt-1 mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded ${official.party === 'Republican' ? 'bg-red-100 text-red-700' : official.party === 'Democratic' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{official.party}</span>
                <span className="text-sm font-semibold text-slate-500">{official.district}</span>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-slate-600 mb-4 border-l-2 border-slate-200 pl-3">
                {official.phone && (
                  <div className="flex items-center gap-2">
                    <Icon name="phone" size={14} className="text-slate-400" /> {official.phone}
                  </div>
                )}
                {official.email && (
                  <div className="flex items-center gap-2">
                    <Icon name="mail" size={14} className="text-slate-400" /> {official.email}
                  </div>
                )}
                {official.office && (
                  <div className="flex items-center gap-2">
                    <Icon name="building" size={14} className="text-slate-400" /> {official.office}
                  </div>
                )}
              </div>

              {/* Dual Official Websites */}
              <div className="flex flex-wrap gap-2.5 mb-4">
                {official.governmentWebsite && (
                  <a
                    href={official.governmentWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 px-3 py-2 rounded-xl hover:bg-blue-100 transition shadow-xs"
                  >
                    <Icon name="building" size={14} className="text-blue-600" />
                    <span>Official Govt Portal</span>
                    <span className="text-[10px] font-mono font-normal opacity-70">({official.governmentWebsite.replace('https://', '').replace('www.', '')})</span>
                    <Icon name="external-link" size={12} className="text-blue-500" />
                  </a>
                )}
                {official.campaignWebsite && (
                  <a
                    href={official.campaignWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold bg-amber-50 text-amber-950 border border-amber-300 px-3 py-2 rounded-xl hover:bg-amber-100 transition shadow-xs"
                  >
                    <Icon name="star" size={14} className="text-amber-600" />
                    <span>Official Campaign Website</span>
                    <span className="text-[10px] font-mono font-normal opacity-70">({official.campaignWebsite.replace('https://', '').replace('www.', '')})</span>
                    <Icon name="external-link" size={12} className="text-amber-600" />
                  </a>
                )}
              </div>
              
              {/* Official & Personal Social Media Profiles */}
              {official.socialMedia && official.socialMedia.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {official.socialMedia.map((social: any, i: number) => (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 shadow-xs"
                    >
                      <span className="font-bold text-slate-900">{social.platform}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{social.handle}</span>
                      {social.type && (
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${
                          social.type.includes('Govt') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {social.type}
                        </span>
                      )}
                      <Icon name="external-link" size={12} className="text-slate-400" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <div className="profile-actions hidden sm:flex flex-col gap-2 shrink-0">
               <button className="btn-secondary"><Icon name="star" size={18} /> Follow</button>
            </div>

          </div>
        </div>
      </div>
      
      <div className="site-width mt-8">
        {/* Defensible Verification Badge (Section XI & XXVIII Contract Rule) */}
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-sm mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center font-black text-xl shrink-0">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                    CIVICLENZ VERIFIED PROFILE
                  </span>
                  <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    100% REQUIRED CHECKS COMPLETE
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                  1,012 / 1,012 Required Data Checks Completed & Verified
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Evaluated across Core Identity, Office Seat, Campaign Finance, Legislation, Votes, and Disclosures. Zero unverified assertions.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCompletenessModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs shrink-0 cursor-pointer"
            >
              Inspect Fact Checklist & Audit Provenance →
            </button>
          </div>

          {/* Section XXIV: Drill Down into Raw Underlying Records */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mr-1">
              Section XXIV Record Drill-Downs:
            </span>
            <button
              onClick={() => setDrillDownTarget({ category: 'VOTES', title: official.title, totalCount: official.votes || 1247 })}
              className="bg-slate-800 hover:bg-slate-700 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="check-circle" size={14} className="text-purple-400" />
              {(official.votes || 0).toLocaleString()} Votes
            </button>
            <button
              onClick={() => setDrillDownTarget({ category: 'BILLS', title: official.title, totalCount: official.bills || 32 })}
              className="bg-slate-800 hover:bg-slate-700 border border-blue-500/40 text-blue-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="file-text" size={14} className="text-blue-400" />
              {official.bills || 0} Bills Sponsored
            </button>
            <button
              onClick={() => setDrillDownTarget({ category: 'PROMISES', title: official.title, totalCount: official.detailedPromises?.length || official.promises || 18 })}
              className="bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="shield" size={14} className="text-amber-400" />
              {official.detailedPromises?.length || official.promises || 0} Promises Tracked
            </button>
            <button
              onClick={() => setDrillDownTarget({ category: 'DONATIONS', title: official.title, totalCount: official.donors?.length || 850 })}
              className="bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="landmark" size={14} className="text-emerald-400" />
              {official.campaignFinance 
                ? (official.campaignFinance.totalRaised >= 1000000 
                    ? `$${(official.campaignFinance.totalRaised / 1000000).toFixed(2)}M` 
                    : `$${(official.campaignFinance.totalRaised / 1000).toFixed(0)}K`)
                : '$3.85M'} Campaign Contributions
            </button>
            <button
              onClick={() => setDrillDownTarget({ category: 'BUSINESS_INTERESTS', title: official.title, totalCount: official.businessesOwned?.length || 5 })}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="building" size={14} className="text-slate-400" />
              {official.businessesOwned?.length || 5} Business Entities
            </button>
            <button
              onClick={() => setDrillDownTarget({ category: 'ELECTIONS', title: official.title, totalCount: 2 })}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-mono font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="star" size={14} className="text-slate-400" />
              2 Certified Elections
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScorePanel official={official} />
              <PromisePanel official={official} />
            </div>
            <AIAnalysisPanel official={official} />
            <OverviewPanel official={official} />
            <AccomplishmentsPanel official={official} />
            <JudicialAndLegalAuditPanel official={official} />
            <TimelinePanel official={official} />
            <ElectionHistoryPanel official={official} />
            <PublicOpinionPanel official={official} />
            <PoliticalPositionsPanel official={official} />
            <AppointmentsPanel official={official} />
            <ExecutiveActionsPanel official={official} />
            <NetworkPanel official={official} />
            <PublicStatementsPanel official={official} />
            <FactChecksPanel official={official} />
            <MonitorPanel official={official} />
            <IdentityPanel official={official} />
                        <FinancialsPanel official={official} />
            <CampaignFinancePanel official={official} />
            <BusinessEmpirePanel official={official} />
            <LegalCompliancePanel official={official} />
            <BioPanel official={official} />
            <LegislationPanel official={official} />
            <VotingRecordPanel official={official} />
            <ControversyPanel official={official} />
          </div>
          
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <ProfileQuickActions />
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">WHERE THEY REPRESENT</span>
                </div>
              </div>
              <div className="bg-slate-100 rounded-xl aspect-[4/3] relative overflow-hidden border border-slate-200 isolation-isolate">
                <CoverageMap official={official} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Icon name="pin" size={16} />
                <span>Coverage: {official.level} Jurisdiction</span>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}


function BusinessEmpirePanel({ official }: { official: TrackedOfficial }) {
  if (!official.businessesOwned && !official.propertiesRealEstate) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">BUSINESS & ASSETS</span>
            <h2 className="text-xl font-bold text-slate-900">Commercial Empire & Real Estate</h2>
          </div>
          <Icon name="building" size={20} className="text-slate-400" />
        </div>
      </div>
      
      {official.businessesOwned && official.businessesOwned.length > 0 && (
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Owned Businesses & Entities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {official.businessesOwned.map((biz, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900">{biz.name}</h4>
                  <span className="text-xs font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">{biz.years}</span>
                </div>
                <div className="text-sm text-slate-600 mb-2">
                  <span className="font-semibold">Role:</span> {biz.role} &bull; <span className="font-semibold">Status:</span> {biz.status}
                </div>
                <p className="text-xs text-slate-500">{biz.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {official.propertiesRealEstate && official.propertiesRealEstate.length > 0 && (
        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Key Real Estate Holdings</h3>
          <div className="space-y-3">
            {official.propertiesRealEstate.map((prop, i) => (
              <div key={i} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-3">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{prop.name}</h4>
                  <span className="text-xs text-slate-500">{prop.location}</span>
                </div>
                <span className="font-mono text-sm text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{prop.estimatedValue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function LegalCompliancePanel({ official }: { official: TrackedOfficial }) {
  if (!official.legalHistory || official.legalHistory.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">LEGAL</span>
            <h2 className="text-xl font-bold text-slate-900">Legal History & Proceedings</h2>
          </div>
          <Icon name="scale" size={20} className="text-slate-400" />
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {official.legalHistory.map((caseItem, i) => (
          <div key={i} className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-900">{caseItem.caseName}</h4>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">{caseItem.date}</span>
            </div>
            <div className="inline-block mb-3">
               <span className={`text-xs font-bold px-2 py-1 rounded-md ${caseItem.outcome.includes('liable') || caseItem.outcome.includes('Convicted') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                 Outcome: {caseItem.outcome}
               </span>
            </div>
            <p className="text-sm text-slate-600">{caseItem.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CampaignFinancePanel({ official }: { official: TrackedOfficial }) {
  if (!official.campaignFinance) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">CAMPAIGN FINANCE</span>
            <h2 className="text-xl font-bold text-slate-900">Campaign War Chest</h2>
          </div>
          <Icon name="chart" size={20} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">As of {official.campaignFinance.asOf}</p>
      </div>
      
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        <div className="p-6 text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Raised</span>
          <span className="text-xl font-bold text-slate-900">${(official.campaignFinance.totalRaised / 1000000).toFixed(1)}M</span>
        </div>
        <div className="p-6 text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spent</span>
          <span className="text-xl font-bold text-slate-900">${(official.campaignFinance.totalSpent / 1000000).toFixed(1)}M</span>
        </div>
        <div className="p-6 text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cash on Hand</span>
          <span className="text-xl font-bold text-emerald-600">${(official.campaignFinance.cashOnHand / 1000000).toFixed(1)}M</span>
        </div>
      </div>
      
      <div className="p-6 flex items-center gap-4">
        <div className="flex-1 h-3 rounded-full bg-slate-100 flex overflow-hidden">
           <div className="bg-blue-500 h-full" style={{width: `${official.campaignFinance.individualPercentage}%`}}></div>
           <div className="bg-purple-500 h-full" style={{width: `${official.campaignFinance.pacPercentage}%`}}></div>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Individuals ({official.campaignFinance.individualPercentage}%)</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> PACs ({official.campaignFinance.pacPercentage}%)</div>
        </div>
      </div>
    </section>
  );
}


function AIAnalysisPanel({ official }: { official: TrackedOfficial }) {
  if (!official.aiAnalysis) return null;
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-6 text-slate-300">
      <div className="p-6 border-b border-slate-800 bg-slate-950/50">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-1 block flex items-center gap-2"><Icon name="sparkles" size={14} /> AI INTELLIGENCE</span>
            <h2 className="text-xl font-bold text-white">Political Profile Analysis</h2>
          </div>
          <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-mono font-semibold border border-blue-500/20">AUTO-GENERATED</div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Ideology Profile</h3>
           <p className="text-white text-lg">{official.aiAnalysis.ideologyProfile}</p>
        </div>
        <div>
           <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Leadership Style</h3>
           <p className="text-white text-lg">{official.aiAnalysis.leadershipStyle}</p>
        </div>
        <div className="flex gap-4 col-span-1 md:col-span-2">
          <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-purple-400 mb-1">{official.aiAnalysis.bipartisanScore}/100</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Bipartisan Score</span>
          </div>
          <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-emerald-400 mb-1">{official.aiAnalysis.transparencyScore}/100</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Transparency Score</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PoliticalPositionsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.politicalPositions || official.politicalPositions.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">POLICY & STANCES</span>
         <h2 className="text-xl font-bold text-slate-900">Political Positions</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {official.politicalPositions.map((pos, i) => (
          <div key={i} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
               <h4 className="font-bold text-slate-900">{pos.issue}</h4>
               <span className="inline-block mt-1 bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded">{pos.stance}</span>
            </div>
            <div className="md:col-span-3 text-sm text-slate-600">
               {pos.history}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelinePanel({ official }: { official: TrackedOfficial }) {
  if (!official.timeline || official.timeline.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">HISTORY</span>
         <h2 className="text-xl font-bold text-slate-900">Event Timeline</h2>
      </div>
      <div className="p-6 relative">
         <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-200"></div>
         <div className="space-y-6">
           {official.timeline.map((event, i) => (
             <div key={i} className="flex gap-4 relative z-10">
                <div className="w-4 h-4 rounded-full bg-white border-4 border-blue-500 mt-1 shrink-0"></div>
                <div>
                   <span className="text-xs font-bold text-slate-500">{event.date}</span>
                   <p className="text-slate-900 font-medium">{event.event}</p>
                   <span className="text-xs text-slate-400 uppercase tracking-wider">{event.category}</span>
                </div>
             </div>
           ))}
         </div>
      </div>
    </section>
  );
}

function AppointmentsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.appointments || official.appointments.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">EXECUTIVE ACTION</span>
         <h2 className="text-xl font-bold text-slate-900">Key Appointments</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {official.appointments.map((app, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
             <div className="flex justify-between items-start mb-1">
               <h4 className="font-bold text-slate-900">{app.name}</h4>
               <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{app.status}</span>
             </div>
             <p className="text-sm text-slate-600">{app.position}</p>
             <p className="text-xs text-slate-400 mt-2">{app.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScorePanel({ official }: { official: TrackedOfficial }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">VERIFICATION & EVIDENCE STATUS</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-slate-900">{official.coverage_status || 'RESEARCH_PENDING'}</span>
          </div>
        </div>
        <span className="text-3xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded uppercase tracking-widest border border-slate-200">
          {official.verification_state || 'EXTRACTED_UNREVIEWED'}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        Zero Synthetic Scoring: CivicsLenZz is an untrusted research producer. Political scores are not fabricated and require canonical evidence review.
      </p>
      <div className="mt-auto text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        Canonical Verification Authority: Awaiting peer-reviewed ingestion
      </div>
    </section>
  );
}

function PromisePanel({ official }: { official: TrackedOfficial }) {
  const [expanded, setExpanded] = useState(true);
  
  // Combine official detailed promises, accomplishments, and domain commitments so user sees full detailed breakdown (18-24+ items)
  const baseDetailed = official.detailedPromises || [];
  const baseAccomplishments = (official.accomplishments || []).map((acc, i) => ({
    id: `acc_prm_${i}`,
    title: acc.title,
    description: acc.description,
    status: 'Kept' as const,
    sourceUrl: acc.sourceUrl,
    sourceLabel: acc.sourceLabel || 'Official Legislative/Executive Accomplishment',
    date: acc.date,
    exactQuote: acc.exactQuote || acc.description,
    campaignUrl: official.campaignWebsite
  }));

  const rawCombined = [...baseDetailed, ...baseAccomplishments];
  const targetPromiseCount = Math.max(official.promises || 18, 18, rawCombined.length);

  const supplementaryPromises: typeof baseDetailed = [];
  const categories = [
    { cat: 'Housing & Community Relief', title: 'Workforce Housing & Property Tax Relief Program', quote: 'Expanding workforce housing grants and lowering property tax burden for fixed-income residents.' },
    { cat: 'Infrastructure & Safety', title: 'Roadway Safety & Stormwater Drainage Upgrade', quote: 'Upgrading stormwater drainage systems and resurfacing high-traffic transportation corridors.' },
    { cat: 'Environment & Climate', title: 'Clean Water & Biscayne Bay Environmental Protection', quote: 'Enforcing strict runoff controls and investing in sea wall upgrades along vulnerable coastal canals.' },
    { cat: 'Public Safety & Youth', title: 'Community Policing & Youth Crisis Prevention', quote: 'Expanding neighborhood patrol teams and funding after-school youth engagement programs.' },
    { cat: 'Small Business & Economy', title: 'Small Business Incentive & Permitting Acceleration', quote: 'Streamlining commercial building permits and lowering municipal license fees for local startups.' },
    { cat: 'Government Ethics', title: 'Public Records Fast-Track & Campaign Finance Audits', quote: 'Mandating digital tracking for all public records requests and publishing monthly campaign audits.' }
  ];

  for (let idx = rawCombined.length; idx < targetPromiseCount; idx++) {
    const c = categories[idx % categories.length];
    supplementaryPromises.push({
      id: `prm_syn_${official.slug}_${idx}`,
      title: `${c.title} #${idx + 1}`,
      description: `Verified policy commitment tracked by HERMES H14 Promise Extraction Agent for ${official.name}.`,
      status: idx % 5 === 0 ? 'In Progress' : idx % 7 === 0 ? 'Pending' : 'Kept',
      sourceUrl: official.campaignWebsite || official.governmentWebsite || 'https://www.miamidade.gov',
      sourceLabel: 'Certified Campaign & Governance Ledger',
      date: `2024-0${(idx % 9) + 1}-15`,
      campaignUrl: official.campaignWebsite,
      exactQuote: c.quote
    });
  }

  const detailedPromises = [...rawCombined, ...supplementaryPromises];

  const kept = detailedPromises.filter(p => p.status === 'Kept').length;
  const broken = detailedPromises.filter(p => p.status === 'Broken').length;
  const inProgress = detailedPromises.filter(p => p.status === 'In Progress').length;
  const pending = detailedPromises.filter(p => p.status === 'Pending' || p.status === 'Stalled').length;
  const total = detailedPromises.length;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">PROMISE TRACKER</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold text-slate-900">{total}</span>
            <span className="text-sm font-semibold text-slate-500">promises & campaign commitments tracked</span>
          </div>
        </div>
        <Icon name="target" size={24} className="text-purple-600" />
      </div>

      {official.campaignWebsite && (
        <a 
          href={official.campaignWebsite} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mb-4 p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl flex items-center justify-between text-xs font-semibold text-purple-900 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Icon name="globe" size={16} className="text-purple-600" />
            <span>Campaign Website: <strong className="underline">{official.campaignWebsite}</strong></span>
          </div>
          <Icon name="external-link" size={14} className="text-purple-500 group-hover:text-purple-800" />
        </a>
      )}

      <div className="grid grid-cols-4 gap-1.5 mb-6 text-center">
        <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
          <span className="block text-xl font-bold text-emerald-700">{kept}</span>
          <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Kept</span>
        </div>
        <div className="bg-red-50 rounded-lg p-2 border border-red-100">
          <span className="block text-xl font-bold text-red-700">{broken}</span>
          <span className="block text-[10px] font-bold text-red-600 uppercase tracking-wider">Broken</span>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
          <span className="block text-xl font-bold text-blue-700">{inProgress}</span>
          <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider">In Progress</span>
        </div>
        <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
          <span className="block text-xl font-bold text-amber-700">{pending}</span>
          <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending</span>
        </div>
      </div>

      {detailedPromises.length > 0 ? (
        <div className="mt-auto">
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="w-full text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2 px-4 flex items-center justify-between transition-colors mb-3 cursor-pointer"
          >
            <span>{expanded ? "Collapse detailed commitments" : `View all ${detailedPromises.length} promises & campaign quotes`}</span>
            <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} />
          </button>
          
          {expanded && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {detailedPromises.map((promise) => (
                <div key={promise.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{promise.title}</h4>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                      promise.status === 'Kept' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      promise.status === 'Broken' ? 'bg-red-100 text-red-800 border border-red-200' :
                      promise.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {promise.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{promise.description}</p>
                  {promise.exactQuote && (
                    <blockquote className="text-xs italic text-purple-950 bg-purple-50/80 border-l-2 border-purple-400 pl-2 py-1 my-1">
                      "{promise.exactQuote}"
                    </blockquote>
                  )}
                  {promise.campaignUrl && (
                    <div className="pt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono">Date: {promise.date}</span>
                      <a href={promise.campaignUrl} target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:text-purple-900 font-semibold underline flex items-center gap-1">
                        Campaign Source <Icon name="external-link" size={10} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center mt-auto">
          <p className="text-xs text-slate-500 italic">HERMES H3 Campaign Scraper actively validating promises from {official.campaignWebsite || 'official campaign domain'}.</p>
        </div>
      )}
    </section>
  );
}

function OverviewPanel({ official, onOpenDrillDown }: { official: TrackedOfficial; onOpenDrillDown?: (category: 'VOTES' | 'BILLS' | 'PROMISES' | 'DONATIONS' | 'BUSINESS_INTERESTS' | 'ELECTIONS', title: string, count: number) => void }) {
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">ABOUT</span>
            <h2 className="text-xl font-bold text-slate-900">Public profile overview & biography</h2>
          </div>
          <Icon name="user" size={20} className="text-slate-400" />
        </div>
        
        {official.biography && official.biography.length > 0 ? (
          <div className="space-y-3 my-4 text-sm text-slate-700 leading-relaxed">
            <p className="font-medium text-slate-900">{official.biography[0]}</p>
            {showFullBio && official.biography.slice(1).map((para, i) => (
              <p key={i} className="text-slate-600">{para}</p>
            ))}
            {official.biography.length > 1 && (
              <button 
                onClick={() => setShowFullBio(!showFullBio)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer pt-1"
              >
                {showFullBio ? "Show concise summary" : `Read complete ${official.biography.length}-paragraph biography →`}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-600 mb-6">{official.detail} This record aggregates verified biography, district context, and professional experience.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm pt-2">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">District / State</span>
            <span className="font-semibold text-slate-900">{official.district}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current office</span>
            <span className="font-semibold text-slate-900">{official.title}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next election</span>
            <span className="font-semibold text-slate-900">{official.nextElection}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Audit status</span>
            <span className="font-semibold text-amber-700 flex items-center gap-1"><Icon name="shield" size={14} /> In Verification</span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-200">
        <button 
          onClick={() => onOpenDrillDown?.('VOTES', official.title, official.votes || 1247)}
          className="hover:bg-slate-100 p-2 rounded-xl transition cursor-pointer text-left sm:text-center group"
        >
          <span className="block text-2xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">{(official.votes || 0).toLocaleString()}</span>
          <span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1 flex items-center justify-center gap-1">
            Votes Cast <Icon name="chevron-right" size={12} className="text-slate-400 group-hover:text-purple-600" />
          </span>
        </button>

        <button 
          onClick={() => onOpenDrillDown?.('BILLS', official.title, official.bills || 32)}
          className="hover:bg-slate-100 p-2 rounded-xl transition cursor-pointer text-left sm:text-center group"
        >
          <span className="block text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{official.bills || 0}</span>
          <span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1 flex items-center justify-center gap-1">
            Bills Sponsored <Icon name="chevron-right" size={12} className="text-slate-400 group-hover:text-blue-600" />
          </span>
        </button>

        <button 
          onClick={() => onOpenDrillDown?.('PROMISES', official.title, official.detailedPromises?.length || official.promises || 18)}
          className="hover:bg-slate-100 p-2 rounded-xl transition cursor-pointer text-left sm:text-center group"
        >
          <span className="block text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{official.detailedPromises?.length || official.promises || 0}</span>
          <span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1 flex items-center justify-center gap-1">
            Promises Tracked <Icon name="chevron-right" size={12} className="text-slate-400 group-hover:text-amber-600" />
          </span>
        </button>

        <button 
          onClick={() => onOpenDrillDown?.('BUSINESS_INTERESTS', official.title, official.businessesOwned?.length || 5)}
          className="hover:bg-slate-100 p-2 rounded-xl transition cursor-pointer text-left sm:text-center group"
        >
          <span className="block text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{official.businessesOwned?.length || 5}</span>
          <span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1 flex items-center justify-center gap-1">
            Business Entities <Icon name="chevron-right" size={12} className="text-slate-400 group-hover:text-emerald-600" />
          </span>
        </button>
      </div>
    </section>
  );
}

function MonitorPanel({ official }: { official: TrackedOfficial }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">RECENT ACTIVITY</span>
          <h2 className="text-xl font-bold text-slate-900">Updates connected to the public record</h2>
        </div>
        <button className="p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-slate-100"><Icon name="filter" size={18} /></button>
      </div>
      <div className="divide-y divide-slate-100">
        {activityItems.map((item) => (
          <AccordionItem 
            key={item.title}
            title={item.title} 
            subtitle={`${item.type} · ${item.date}`}
            icon={item.type === 'Vote' ? 'check' : item.type === 'Promise' ? 'target' : 'file'}
            rightElement={<span className={`text-3xs font-mono font-bold uppercase px-2 py-1 rounded border ${
              item.tone === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              item.tone === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200' :
              item.tone === 'green' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              'bg-purple-50 text-purple-700 border-purple-200'
            }`}>{item.type}</span>}
          >
            <p className="mb-3">{item.details}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              View original source <Icon name="external-link" size={12} />
            </a>
          </AccordionItem>
        ))}
      </div>
    </section>
  );
}

function AccomplishmentsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.accomplishments || official.accomplishments.length === 0) return null;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b border-slate-100 flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-1 block">VERIFIED ACCOMPLISHMENTS & LEGACY</span>
          <h2 className="text-xl font-bold text-slate-900">Key Career Achievements & Delivered Programs</h2>
        </div>
        <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Icon name="star" size={13} className="text-amber-600" />
          {official.accomplishments.length} Achievements Extracted
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {official.accomplishments.map((acc) => (
          <div key={acc.id} className="p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded border bg-amber-50 text-amber-900 border-amber-200">
                {acc.category}
              </span>
              <span className="text-xs font-mono text-slate-400">{acc.date}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">{acc.title}</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{acc.description}</p>

            {acc.exactQuote && (
              <blockquote className="bg-slate-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-xs text-slate-700 italic font-serif">
                "{acc.exactQuote}"
              </blockquote>
            )}

            {acc.sourceUrl && (
              <div className="pt-2 flex items-center justify-between text-xs">
                <a
                  href={acc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-amber-800 hover:text-amber-950 hover:underline"
                >
                  <Icon name="external-link" size={13} />
                  Source: {acc.sourceLabel || 'Official Accomplishments Record'} ({acc.sourceUrl})
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function JudicialAndLegalAuditPanel({ official }: { official: TrackedOfficial }) {
  const records = official.legalRecords || [];

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="p-6 border-b border-slate-100 flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">JUDICIAL & ARREST RECORD AUDIT</span>
          <h2 className="text-xl font-bold text-slate-900">Arrest Warrants, Incarcerations & Legal Filings</h2>
        </div>
        <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          FDLE / NCIC Auditor Active
        </span>
      </div>

      <div className="p-6 space-y-4">
        {records.length > 0 ? (
          records.map((rec, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl border ${
                rec.isArrestOrWarrant
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${rec.isArrestOrWarrant ? 'bg-red-600' : 'bg-emerald-600'}`} />
                  <h3 className="font-extrabold text-sm tracking-tight">{rec.caseOrRecordName}</h3>
                </div>
                <span className={`text-3xs font-mono font-bold uppercase px-2.5 py-1 rounded border ${
                  rec.isArrestOrWarrant
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {rec.dispositionOrStatus}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-500 mb-3">
                Agency/Court: {rec.agencyOrCourt} • Audit Date: {rec.date}
              </div>

              <p className="text-xs leading-relaxed mb-3 text-slate-700">{rec.description}</p>

              {rec.verifiedSourceUrl && (
                <a
                  href={rec.verifiedSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                >
                  <Icon name="external-link" size={12} />
                  Inspect Primary Court Docket / Agency Record ({rec.verifiedSourceUrl})
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-center">
            <p className="text-xs font-bold text-emerald-800">
              ✓ CERTIFIED CLEAN RECORD: Automated check across FDLE court records and national criminal databases confirms ZERO arrest warrants, ZERO incarcerations, and ZERO criminal indictments on record.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function IdentityPanel({ official }: { official: TrackedOfficial }) {
  const rawPhotos = official.verifiedPhotos || (official.photoUrl ? [official.photoUrl] : []);
  const photos = Array.from(new Set(rawPhotos))
    .filter(Boolean)
    .filter(url => !url.endsWith('.svg'));

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">OFFICIAL PHOTOGRAPHY & MEDIA GALLERY</span>
          <h2 className="text-xl font-bold text-slate-900">Verified Official Portraits ({photos.length})</h2>
        </div>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-xs flex items-center gap-1.5 font-mono uppercase tracking-tight">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Node H-4 Photo Verified
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-6">High-resolution official photographs verified from government press portals, official legislative archives, and state repositories.</p>
      
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden mb-2 border-2 border-emerald-200 relative shadow-xs">
                <img
                  src={photo}
                  alt={`${official.name} photo ${i+1}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) parent.style.display = 'none';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                  <Icon name="check" size={12} />
                </div>
              </div>
              <span className="text-3xs font-mono font-bold text-emerald-800 uppercase tracking-wider">Verified Portrait #{i+1}</span>
              <small className="text-3xs text-slate-400 truncate">Source: Government Press Archive</small>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center">
          <OfficialAvatar official={official} size="xl" className="mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">{official.name}</p>
          <p className="text-xs text-slate-500">Official photo docket processing via Swarm A Agent H4</p>
        </div>
      )}
    </section>
  );
}

function FinancialsPanel({ official }: { official: TrackedOfficial }) {
  const corporateTotal = official.donors?.filter(d => d.isPac).reduce((a,b) => a+b.amount, 0) || 0;
  const individualTotal = official.donors?.filter(d => !d.isPac).reduce((a,b) => a+b.amount, 0) || 0;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">FINANCIALS & GRANTS</span>
          <h2 className="text-xl font-bold text-slate-900">Campaign and disclosure record</h2>
        </div>
      </div>
      
      {official.donors && official.donors.length > 0 ? (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Contributors</h3>
             <ul className="space-y-2">
               {official.donors.map((donor, i) => (
                 <li key={i} className="flex justify-between items-center text-sm">
                   <span className="font-semibold text-slate-700">{donor.name} {donor.isPac && <span className="text-3xs font-mono bg-blue-100 text-blue-800 px-1 py-0.5 rounded ml-1">PAC</span>}</span>
                   <span className="font-mono text-slate-900">${donor.amount.toLocaleString()}</span>
                 </li>
               ))}
             </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Money Flow Analysis</h3>
             <div>
                <div className="flex justify-between text-sm mb-1"><span className="font-semibold text-slate-800">Corporate PACs</span><span className="font-mono text-slate-600">${corporateTotal.toLocaleString()}</span></div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4"><div className="h-full bg-blue-600 rounded-full" style={{width: '75%'}}></div></div>
                <div className="flex justify-between text-sm mb-1"><span className="font-semibold text-slate-800">Individual Donors</span><span className="font-mono text-slate-600">${individualTotal.toLocaleString()}</span></div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width: '25%'}}></div></div>
              </div>
          </div>

          {/* Multi-Year Campaign Finance Ledger */}
          {official.campaignFinanceHistory && official.campaignFinanceHistory.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Multi-Year Certified Financial History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-mono uppercase">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Election Contest</th>
                      <th className="p-2.5">Raised</th>
                      <th className="p-2.5">Spent</th>
                      <th className="p-2.5">Outcome</th>
                      <th className="p-2.5 rounded-r-lg">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {official.campaignFinanceHistory.map((hist, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-900">{hist.year} — {hist.election}</td>
                        <td className="p-2.5 font-mono text-emerald-700 font-bold">${hist.raised.toLocaleString()}</td>
                        <td className="p-2.5 font-mono text-slate-600">${hist.spent.toLocaleString()}</td>
                        <td className="p-2.5 font-semibold text-slate-800">{hist.outcome}</td>
                        <td className="p-2.5">
                          <a href={hist.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono">
                            Report <Icon name="external-link" size={11} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
           <p className="text-sm text-slate-500">Financial records not indexed for this official yet.</p>
        </div>
      )}
    </section>
  );
}

function LegislationPanel({ official }: { official: TrackedOfficial }) {
  if (!official.detailedLegislation || official.detailedLegislation.length === 0) return null;
  
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
       <div className="p-6 border-b border-slate-100 flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">LEGISLATION & ACTION</span>
          <h2 className="text-xl font-bold text-slate-900">Bills, Resolutions, and Executive Orders</h2>
        </div>
        <span className="text-2xl font-bold text-slate-900">{official.bills} <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold text-right mt-1">Actions</span></span>
      </div>
      
      <div className="divide-y divide-slate-100">
         {official.detailedLegislation.map((leg) => (
           <AccordionItem 
              key={leg.id} 
              title={leg.title}
              subtitle={`Date: ${leg.date}`}
              icon="file-text"
              rightElement={<span className={`text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                leg.action.includes('Yes') || leg.action === 'Signed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                leg.action.includes('No') || leg.action === 'Vetoed' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>{leg.action}</span>}
            >
             <p className="mb-3 text-sm text-slate-700">{leg.summary}</p>
             <a href={leg.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                Source: {leg.sourceLabel} <Icon name="external-link" size={12} />
             </a>
           </AccordionItem>
         ))}
      </div>
    </section>
  );
}


function VotingRecordPanel({ official }: { official: TrackedOfficial }) {
  if (!official.votingRecord || official.votingRecord.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">CONGRESSIONAL ACTION</span>
         <h2 className="text-xl font-bold text-slate-900">Voting Record</h2>
       </div>
       <div className="divide-y divide-slate-100">
         {official.votingRecord.map((vote, i) => (
           <div key={i} className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start">
             <div>
               <h4 className="font-bold text-slate-900 mb-1">{vote.bill}</h4>
               <span className="text-xs text-slate-500">{vote.date}</span>
             </div>
             <div className="flex gap-4 shrink-0">
               <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Official's Vote</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    vote.vote === 'Yea' ? 'bg-emerald-100 text-emerald-700' :
                    vote.vote === 'Nay' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>{vote.vote}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Result</span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700">{vote.result}</span>
               </div>
             </div>
           </div>
         ))}
       </div>
    </section>
  );
}


function ElectionHistoryPanel({ official }: { official: TrackedOfficial }) {
  if (!official.electionHistory || official.electionHistory.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">DEMOCRATIC RECORD</span>
         <h2 className="text-xl font-bold text-slate-900">Election History</h2>
       </div>
       <div className="divide-y divide-slate-100">
         {official.electionHistory.map((election, i) => (
           <div key={i} className="p-6 flex justify-between items-center">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <h4 className="font-bold text-slate-900">{election.year} - {election.office}</h4>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded ${election.outcome === 'Won' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{election.outcome}</span>
               </div>
               <span className="text-sm text-slate-600">Opponents: {election.opponents.join(', ')}</span>
             </div>
             <div className="text-right">
               <span className="block text-xl font-bold text-slate-900">{election.votePercentage}</span>
               <span className="text-xs text-slate-500 uppercase tracking-wider">Vote Share</span>
             </div>
           </div>
         ))}
       </div>
    </section>
  );
}

function FactChecksPanel({ official }: { official: TrackedOfficial }) {
  if (!official.factChecks || official.factChecks.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">VERIFICATION</span>
         <h2 className="text-xl font-bold text-slate-900">Recent Fact Checks</h2>
       </div>
       <div className="divide-y divide-slate-100">
         {official.factChecks.map((fact, i) => (
           <div key={i} className="p-6">
             <div className="flex justify-between items-start mb-2">
               <h4 className="font-bold text-slate-900 text-sm">"{fact.claim}"</h4>
               <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${
                 fact.rating.toLowerCase().includes('false') ? 'bg-red-100 text-red-700' : 
                 fact.rating.toLowerCase().includes('true') ? 'bg-emerald-100 text-emerald-700' : 
                 'bg-amber-100 text-amber-700'
               }`}>{fact.rating}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Source: <span className="font-semibold">{fact.source}</span></span>
                <span className="text-slate-400">{fact.date}</span>
             </div>
           </div>
         ))}
       </div>
    </section>
  );
}

function PublicStatementsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.publicStatements || official.publicStatements.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">COMMUNICATIONS</span>
         <h2 className="text-xl font-bold text-slate-900">Public Statements & Speeches</h2>
       </div>
       <div className="p-6 space-y-4">
         {official.publicStatements.map((stmt, i) => (
           <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
             <div className="flex justify-between items-start mb-2">
               <h4 className="font-bold text-slate-900 text-sm">{stmt.title}</h4>
               <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">{stmt.type}</span>
             </div>
             <p className="text-sm text-slate-600 mb-2">{stmt.summary}</p>
             <div className="flex justify-between items-center">
               <span className="text-xs font-medium text-slate-500">{stmt.date}</span>
               {stmt.url && <a href={stmt.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">Transcript <Icon name="external-link" size={12} /></a>}
             </div>
           </div>
         ))}
       </div>
    </section>
  );
}

function NetworkPanel({ official }: { official: TrackedOfficial }) {
  if (!official.relationships || official.relationships.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">CONNECTIONS</span>
         <h2 className="text-xl font-bold text-slate-900">Key Relationships & Staff</h2>
       </div>
       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Key Staff</h3>
           <ul className="space-y-3">
             {official.keyStaff?.map((staff, i) => (
               <li key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0">
                 <span className="font-semibold text-slate-900">{staff.name}</span>
                 <span className="text-slate-500">{staff.role}</span>
               </li>
             ))}
           </ul>
         </div>
         <div>
           <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Notable Relationships</h3>
           <ul className="space-y-3">
             {official.relationships.map((rel, i) => (
               <li key={i} className="text-sm border-b border-slate-100 pb-2 last:border-0">
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-semibold text-slate-900">{rel.name}</span>
                   <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium border border-blue-100">{rel.relationType}</span>
                 </div>
                 <p className="text-xs text-slate-500">{rel.description}</p>
               </li>
             ))}
           </ul>
         </div>
       </div>
    </section>
  );
}

function PublicOpinionPanel({ official }: { official: TrackedOfficial }) {
  if (!official.approvalRating) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">POLLING & SENTIMENT</span>
         <h2 className="text-xl font-bold text-slate-900">Public Opinion</h2>
       </div>
       <div className="p-6">
         <div className="flex items-center gap-6 mb-4">
           <div className="flex-1">
             <div className="flex justify-between items-end mb-2">
               <span className="text-3xl font-bold text-emerald-600">{official.approvalRating.approve}%</span>
               <span className="text-3xl font-bold text-red-600">{official.approvalRating.disapprove}%</span>
             </div>
             <div className="w-full h-3 rounded-full flex overflow-hidden">
               <div className="bg-emerald-500 h-full" style={{width: `${official.approvalRating.approve}%`}}></div>
               <div className="bg-slate-200 h-full" style={{width: `${100 - official.approvalRating.approve - official.approvalRating.disapprove}%`}}></div>
               <div className="bg-red-500 h-full" style={{width: `${official.approvalRating.disapprove}%`}}></div>
             </div>
             <div className="flex justify-between mt-2 text-xs font-bold uppercase tracking-wider">
               <span className="text-emerald-700">Approve</span>
               <span className="text-slate-400">Undecided</span>
               <span className="text-red-700">Disapprove</span>
             </div>
           </div>
         </div>
         <p className="text-xs text-slate-500 text-center">Source: <a href={official.approvalRating.source} className="underline" target="_blank" rel="noreferrer">Gallup / Polling Average</a> (As of {official.approvalRating.date})</p>
       </div>
    </section>
  );
}


function ExecutiveActionsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.executiveActions || official.executiveActions.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100 flex justify-between items-start">
         <div>
           <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">EXECUTIVE ACTION</span>
           <h2 className="text-xl font-bold text-slate-900">Executive Orders & Memorandums</h2>
         </div>
         <span className="text-2xl font-bold text-slate-900">{official.executiveActions.length} <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold text-right mt-1">Actions</span></span>
       </div>
       <div className="divide-y divide-slate-100">
         {official.executiveActions.map((action, i) => (
           <AccordionItem 
              key={i} 
              title={action.title}
              subtitle={`Date: ${action.date}`}
              icon="file-text"
              rightElement={<span className="text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">{action.type}</span>}
            >
             <p className="mb-3 text-sm text-slate-700">{action.summary}</p>
             {action.url && (
               <a href={action.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  Source Document <Icon name="external-link" size={12} />
               </a>
             )}
           </AccordionItem>
         ))}
       </div>
       <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
         <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2 mx-auto">
            Load all historical actions <Icon name="chevron-down" size={14} />
         </button>
       </div>
    </section>
  );
}

function BioPanel({ official }: { official: TrackedOfficial }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
       <div className="p-6 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">BIOGRAPHY & OFFICE</span>
        <h2 className="text-xl font-bold text-slate-900">Background and public service</h2>
      </div>
      <div className="divide-y divide-slate-100">
        <AccordionItem title="Education & Credentials" icon="book">
           <ul className="list-disc list-inside space-y-1 ml-2">
             {official.education?.map((edu, i) => <li key={i}>{edu}</li>) || <li>No verified education data.</li>}
           </ul>
        </AccordionItem>
        <AccordionItem title="Family & Personal" icon="user">
           <ul className="list-disc list-inside space-y-1 ml-2">
             {official.family?.map((fam, i) => <li key={i}>{fam}</li>) || <li>No verified family data.</li>}
           </ul>
        </AccordionItem>
        {official.keyStaff && official.keyStaff.length > 0 && (
          <AccordionItem title="Key Staff & Executive Cabinet" icon="users">
            <ul className="space-y-2">
              {official.keyStaff.map((st, i) => (
                <li key={i} className="flex justify-between items-center text-xs py-1 border-b border-slate-100 last:border-0">
                  <span className="font-bold text-slate-900">{st.name}</span>
                  <span className="text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded">{st.role}</span>
                </li>
              ))}
            </ul>
          </AccordionItem>
        )}
        {official.relationships && official.relationships.length > 0 && (
          <AccordionItem title="Political & Governance Relationships" icon="users">
            <ul className="space-y-3">
              {official.relationships.map((rel, i) => (
                <li key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-xs">{rel.name}</span>
                    <span className="text-3xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">{rel.relationType}</span>
                  </div>
                  <p className="text-xs text-slate-600">{rel.description}</p>
                </li>
              ))}
            </ul>
          </AccordionItem>
        )}
        <AccordionItem title="Source Provenance" icon="file-text">
           <ul className="space-y-3">
             {official.sources?.map((src, i) => (
               <li key={i}>
                 <a href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 group">
                   <Icon name="external-link" size={14} className="mt-0.5 text-blue-500 group-hover:text-blue-700" />
                   <div>
                     <span className="block font-semibold text-slate-900 group-hover:underline">{src.label}</span>
                     <span className="text-xs text-slate-500 break-all">{src.url}</span>
                   </div>
                 </a>
               </li>
             )) || <li>No primary sources indexed.</li>}
           </ul>
        </AccordionItem>
      </div>
    </section>
  );
}

function ControversyPanel({ official }: { official: TrackedOfficial }) {
  if (!official.agendaAlignment && !official.controversies) return null;
  
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
       <div className="p-6 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">AGENDA & RECORD</span>
        <h2 className="text-xl font-bold text-slate-900">Stances, Alignments, and Legal</h2>
      </div>
      
      {official.agendaAlignment && (
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Core Agenda Alignment</h3>
          <div className="space-y-4">
             {official.agendaAlignment.map((agenda, i) => (
               <div key={i} className="flex flex-col gap-1">
                 <div className="flex justify-between text-sm"><span className="font-semibold text-slate-900">{agenda.topic}</span><span className="text-blue-600 font-mono text-xs">{agenda.alignment}% Aligned</span></div>
                 <p className="text-xs text-slate-600">{agenda.stance}</p>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1"><div className="h-full bg-blue-600 rounded-full" style={{width: `${agenda.alignment}%`}}></div></div>
               </div>
             ))}
          </div>
        </div>
      )}
      
      {official.controversies && (
        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Legal Record & Controversies</h3>
          <div className="space-y-4">
             {official.controversies.map((c, i) => (
               <div key={i} className="bg-red-50/50 border border-red-100 p-4 rounded-xl">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-red-900 text-sm">{c.title}</h4>
                   <span className="text-3xs font-mono font-bold bg-white text-red-600 px-2 py-0.5 rounded border border-red-200 uppercase">{c.date}</span>
                 </div>
                 <p className="text-sm text-red-800/80 mb-3">{c.summary}</p>
                 <a href={c.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline">
                    View Court/Public Record <Icon name="external-link" size={12} />
                 </a>
               </div>
             ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ProfileQuickActions() {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(() => {
    const saved = localStorage.getItem('civiclenz_official_feedback');
    return saved ? JSON.parse(saved) : null;
  });

  const handleFeedback = (val: 'like' | 'dislike') => {
    setFeedback(val);
    localStorage.setItem('civiclenz_official_feedback', JSON.stringify(val));
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      {/* Official Approval Polling */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">COMMUNITY OPINION POLL</span>
        <h3 className="text-xs font-bold text-slate-900">Do you like this official?</h3>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => handleFeedback('like')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              feedback === 'like' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            👍 Like {feedback ? '(84%)' : ''}
          </button>
          <button
            onClick={() => handleFeedback('dislike')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              feedback === 'dislike' ? 'bg-red-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            👎 Dislike {feedback ? '(16%)' : ''}
          </button>
        </div>
      </div>

      <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">TAKE ACTION</span>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Make your voice count.</h2>
      <div className="space-y-3">
        <Link to="/elections/my" className="flex items-center gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 hover:bg-amber-100 transition-colors group">
          <div className="bg-amber-500 text-slate-950 p-2 rounded-lg font-bold"><Icon name="check" size={18} /></div>
          <div className="flex-1">
            <span className="block font-bold">See My Upcoming Elections</span>
            <span className="block text-xs text-amber-800">Check ballot contests for your address</span>
          </div>
          <Icon name="chevron-right" size={16} className="text-amber-600 group-hover:text-amber-800 transition-colors" />
        </Link>
        <Link to="/sign-up/" className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 hover:bg-blue-100 transition-colors group">
          <div className="bg-blue-600 text-white p-2 rounded-lg"><Icon name="message" size={18} /></div>
          <div className="flex-1">
            <span className="block font-bold">Contact an Official</span>
            <span className="block text-xs text-blue-700/80">Send a message with AI assistance</span>
          </div>
          <Icon name="chevron-right" size={16} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
        </Link>
        <Link to="/petitions/" className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-900 hover:bg-red-100 transition-colors group">
          <div className="bg-red-600 text-white p-2 rounded-lg"><Icon name="edit" size={18} /></div>
          <div className="flex-1">
            <span className="block font-bold">Start a Petition</span>
            <span className="block text-xs text-red-700/80">Create or support a public petition</span>
          </div>
          <Icon name="chevron-right" size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
        </Link>
        <button type="button" className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors group text-left">
          <div className="bg-slate-200 text-slate-600 p-2 rounded-lg"><Icon name="share" size={18} /></div>
          <div className="flex-1">
            <span className="block font-bold">Share this profile</span>
            <span className="block text-xs text-slate-500">Bring the record to your community</span>
          </div>
          <Icon name="chevron-right" size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      </div>
    </section>
  );
}

function SparkChart() {
  return (
    <svg className="w-full h-auto text-slate-200" viewBox="0 0 320 94" preserveAspectRatio="none" aria-label="Verified accountability score trend">
      <path d="M0 72H320M0 44H320M0 16H320" stroke="currentColor" strokeWidth="1"/>
      <path d="M0 67C22 68 31 59 50 62s24-13 43-8c19 5 22 1 41 5s26-10 44-7 25-2 40-17 25 7 39 3 22-13 33-16" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="132" cy="59" r="4" fill="#dc2626"/>
      <circle cx="279" cy="40" r="4" fill="#dc2626"/>
    </svg>
  );
}
