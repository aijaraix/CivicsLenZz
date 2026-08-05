import React, { useState } from 'react';
import { Icon } from './icons';
import { activityItems, trackedOfficials } from '../lib/civic-database';

export function MonitorExperience({ section = 'AI Monitor' }: { section?: 'AI Monitor' | 'Alerts' | 'My Officials' }) {
  const [filter, setFilter] = useState('All');
  
  const filters = ['All', 'Promises', 'Votes', 'News'];
  const title = section === 'Alerts' ? 'Alerts that matter to you' : section === 'My Officials' ? 'Your civic watchlist' : 'AI monitoring center';

  // For the sake of the prototype, generate more mock activity
  const mockActivities = [
    { title: "Voted Yes on Education Funding Bill (SB123)", date: "2 hours ago", type: "Vote", tone: "positive", officialSlug: "ron-desantis", detail: "The bill increases per-student funding by 5% statewide, matching their campaign promise to support schools.", aiConfidence: 98 },
    { title: "Missed 3 consecutive committee hearings", date: "4 hours ago", type: "Alert", tone: "negative", officialSlug: "marco-rubio", detail: "AI attendance tracker flagged 3 consecutive missed meetings for the Foreign Relations Committee.", aiConfidence: 100 },
    { title: "New campaign promise identified", date: "Yesterday", type: "Promise", tone: "neutral", officialSlug: "daniella-levine-cava", detail: "\"I will ensure the rapid transit system breaks ground by Q3 2024.\" - Extracted from Town Hall transcript.", aiConfidence: 92 },
    { title: "Voted No on Zoning Density Increase", date: "2 days ago", type: "Vote", tone: "negative", officialSlug: "steven-meiner", detail: "Contradicts previous statements supporting affordable housing density. AI flagged as a potential stance shift.", aiConfidence: 85 },
    { title: "Financial Disclosure Flag", date: "3 days ago", type: "Alert", tone: "negative", officialSlug: "rick-scott", detail: "New Form 6 disclosure shows $1.2M stock purchase in sector currently regulated by their sub-committee.", aiConfidence: 99 },
  ];

  const displayActivities = section === 'Alerts' ? mockActivities.filter(a => a.type === 'Alert' || a.tone === 'negative') : mockActivities;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Icon name={section === 'Alerts' ? 'bell' : 'watch'} size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{section.toUpperCase()}</span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            </div>
          </div>
          <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-2">
            <Icon name="settings" size={14} /> Preferences
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-6">
            <div className="flex gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    filter === f 
                      ? 'bg-slate-900 text-white border-slate-900' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {displayActivities.map((item, idx) => {
                const official = trackedOfficials.find(o => o.slug === item.officialSlug);
                const colorClass = item.tone === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                   item.tone === 'negative' ? 'bg-red-50 text-red-600 border-red-100' :
                                   'bg-slate-50 text-slate-600 border-slate-200';
                
                return (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center border ${colorClass}`}>
                          <Icon name={item.type === 'Vote' ? 'check' : item.type === 'Promise' ? 'target' : item.type === 'Alert' ? 'alert-circle' : 'file'} size={14} />
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{item.type}</span>
                          <span className="text-xs text-slate-400 ml-2">{item.date}</span>
                        </div>
                      </div>
                      {official && (
                        <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                           <span className="text-[10px] font-bold text-slate-700">{official.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <h2 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h2>
                    
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Verification Details</span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{item.aiConfidence}% Confidence</span>
                      </div>
                      <p className="text-sm text-slate-700">{item.detail}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">
                        View Source
                      </button>
                      <button className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-100">
                        Follow Updates
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Signal Settings</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Icon name="bell" size={16} className="text-slate-400" />
                    <div>
                      <div className="text-sm font-bold text-slate-700">Alert Frequency</div>
                      <div className="text-xs text-slate-500">Daily Digest</div>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={16} className="text-slate-300" />
                </div>
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Icon name="target" size={16} className="text-slate-400" />
                    <div>
                      <div className="text-sm font-bold text-slate-700">Issues Followed</div>
                      <div className="text-xs text-slate-500">Housing, Schools</div>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={16} className="text-slate-300" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Icon name="users" size={16} className="text-slate-400" />
                    <div>
                      <div className="text-sm font-bold text-slate-700">Officials Watched</div>
                      <div className="text-xs text-slate-500">12 Active Profiles</div>
                    </div>
                  </div>
                  <Icon name="chevron-right" size={16} className="text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
