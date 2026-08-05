import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from './icons';
import { OfficialAvatar } from './official-avatar';
import { CoverageMap } from './coverage-map';
import { getTrackedOfficial, TrackedOfficial, activityItems, ActivityItem } from '../lib/civic-database';

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
  
  if (!official) {
    return <section className="profile-page"><div className="site-width"><h2>Official not found.</h2><Link to="/search/">Back to search</Link></div></section>;
  }

  return (
    <section className="profile-page pb-20">
      <div className="profile-header">
        <div className="site-width profile-header-inner">
          <Link to="/search/" className="back-link"><Icon name="arrow-left" size={16} /> Back to results</Link>
          <div className="profile-identity">
            <OfficialAvatar official={official} size="xl" />
            <div className="profile-identity-copy flex-1">
              <h1 className="flex items-center gap-2">{official.name} <Icon name="check-circle" size={24} className="text-blue-600" /></h1>
              <p className="text-lg font-medium text-slate-700">{official.title}</p>
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
              
              {official.socialMedia && official.socialMedia.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {official.socialMedia.map((social, i) => (
                    <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 shadow-sm">
                       <Icon name="external-link" size={14} className="text-slate-400" />
                       {social.platform}
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
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScorePanel official={official} />
              <PromisePanel official={official} />
            </div>
            <AIAnalysisPanel official={official} />
            <OverviewPanel official={official} />
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

function ScorePanel
({ official }: { official: TrackedOfficial }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">AI ACCOUNTABILITY SCORE</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold text-slate-900">{official.score}</span>
            <span className="text-sm font-semibold text-slate-500">/100</span>
          </div>
        </div>
        <span className="text-3xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded uppercase tracking-widest border border-amber-200">Needs Improvement</span>
      </div>
      <p className="text-sm text-slate-600 mb-6">Measured across votes, public commitments, transparency signals, and source coverage.</p>
      <div className="mt-auto">
        <SparkChart />
      </div>
    </section>
  );
}

function PromisePanel({ official }: { official: TrackedOfficial }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">PROMISE TRACKER</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-display font-bold text-slate-900">{official.promises}</span>
            <span className="text-sm font-semibold text-slate-500">tracked</span>
          </div>
        </div>
        <Icon name="target" size={24} className="text-slate-400" />
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-6 text-center">
        <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
          <span className="block text-xl font-bold text-emerald-700">8</span>
          <span className="block text-3xs font-bold text-emerald-600 uppercase tracking-wider">Kept</span>
        </div>
        <div className="bg-red-50 rounded-lg p-2 border border-red-100">
          <span className="block text-xl font-bold text-red-700">5</span>
          <span className="block text-3xs font-bold text-red-600 uppercase tracking-wider">Broken</span>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
          <span className="block text-xl font-bold text-blue-700">11</span>
          <span className="block text-3xs font-bold text-blue-600 uppercase tracking-wider">In Progress</span>
        </div>
      </div>
      
      {official.detailedPromises && official.detailedPromises.length > 0 ? (
        <div className="mt-auto">
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="w-full text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2 px-4 flex items-center justify-between transition-colors"
          >
            <span>See detailed promises</span>
            <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} />
          </button>
          
          {expanded && (
            <div className="mt-4 space-y-3 pt-4 border-t border-slate-100">
              {official.detailedPromises.map((promise) => (
                <div key={promise.id} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-slate-900">{promise.title}</h4>
                    <span className={`text-3xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                      promise.status === 'Kept' ? 'bg-emerald-100 text-emerald-700' :
                      promise.status === 'Broken' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {promise.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{promise.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic text-center mt-auto">Detailed promises not available.</p>
      )}
    </section>
  );
}

function OverviewPanel({ official }: { official: TrackedOfficial }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">ABOUT</span>
            <h2 className="text-xl font-bold text-slate-900">Public profile overview</h2>
          </div>
          <Icon name="user" size={20} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-600 mb-6">{official.detail} This record aggregates verified biography, district context, and professional experience.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
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
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Profile status</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1"><Icon name="check-circle" size={14} /> Verified</span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-200">
        <div><span className="block text-2xl font-bold text-slate-900">{official.votes}</span><span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">Votes Cast</span></div>
        <div><span className="block text-2xl font-bold text-slate-900">{official.bills}</span><span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">Bills Sponsored</span></div>
        <div><span className="block text-2xl font-bold text-slate-900">{official.promises}</span><span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">Promises Tracked</span></div>
        <div><span className="block text-2xl font-bold text-slate-900">3%</span><span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">Missed Votes</span></div>
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

function IdentityPanel({ official }: { official: TrackedOfficial }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">IDENTITY VALIDATION</span>
          <h2 className="text-xl font-bold text-slate-900">AI Verified Photos</h2>
        </div>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-xs flex items-center gap-1.5 font-mono uppercase tracking-tight">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Node H-ETA Active
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-6">Our matrix continuously pulls and validates facial imagery from official dot-gov domains, campaign websites, and registered PAC sites to establish a reliable baseline of identity.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {official.verifiedPhotos && official.verifiedPhotos.map((photo, i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-2 border-2 border-emerald-200 relative">
              <img src={photo} alt={`${official.name} verified ${i}`} className="w-full h-full object-cover" />
              <div className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-1"><Icon name="check" size={10} /></div>
            </div>
            <span className="text-3xs font-mono font-bold text-emerald-700 uppercase tracking-widest">Valid Match</span>
            <small className="text-xs text-slate-500 truncate">Source: verified node</small>
          </div>
        ))}
        {(!official.verifiedPhotos || official.verifiedPhotos.length < 4) && Array.from({length: Math.max(0, 4 - (official.verifiedPhotos?.length || 0))}).map((_, i) => (
           <div key={`empty-${i}`} className="flex flex-col opacity-50">
             <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2 border-2 border-dashed border-slate-200 flex items-center justify-center">
               <Icon name="user" size={32} className="text-slate-300" />
             </div>
             <span className="text-3xs font-mono font-bold text-slate-500 uppercase tracking-widest">Searching...</span>
           </div>
        ))}
      </div>
    </section>
  );
}

function FinancialsPanel({ official }: { official: TrackedOfficial }) {
  const corporateTotal = official.donors?.filter(d => d.isPac).reduce((a,b) => a+b.amount, 0) || 0;
  const individualTotal = official.donors?.filter(d => !d.isPac).reduce((a,b) => a+b.amount, 0) || 0;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
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
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">TAKE ACTION</span>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Make your voice count.</h2>
      <div className="space-y-3">
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
