import re

content = """import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from './icons';
import { OfficialAvatar } from './official-avatar';
import { getTrackedOfficial, TrackedOfficial, activityItems, ActivityItem } from '../lib/civic-database';

function AccordionItem({ title, subtitle, icon, rightElement, children }: { title: string, subtitle?: string, icon?: string, rightElement?: React.ReactNode, children: React.ReactNode }) {
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
            <div className="profile-identity-copy">
              <h1>{official.name} <Icon name="check-circle" size={24} className="text-blue-600 ml-1" /></h1>
              <p>{official.title}</p>
              <small>{official.party}</small>
            </div>
            <div className="profile-actions hidden sm:flex">
              <button className="btn-primary"><Icon name="message" size={18} /> Contact Official</button>
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
            <OverviewPanel official={official} />
            <MonitorPanel official={official} />
            <IdentityPanel official={official} />
            <FinancialsPanel official={official} />
            <BioPanel official={official} />
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
              <div className="bg-slate-100 rounded-xl aspect-[4/3] flex items-center justify-center relative overflow-hidden border border-slate-200">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
                <Icon name="map" size={48} className="text-slate-300 relative z-10" />
                <div className="absolute inset-4 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center animate-pulse">
                   <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">{official.district}</div>
                </div>
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

function ScorePanel({ official }: { official: TrackedOfficial }) {
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
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
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
      <Link to={`/officials/${official.slug}/promises`} className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors mt-auto">See all promises <Icon name="arrow-right" size={14} /></Link>
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
"""
with open("src/components/profile-experience.tsx", "w") as f:
    f.write(content)
