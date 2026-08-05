import re

with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

new_search = """import React from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { DemoAvatar } from './demo-avatar';
import { Icon } from './icons';
import { MapVisual } from './map-visual';
import { demoOfficials, GovernmentLevel } from '../lib/demo-data';

const filters: Array<'All' | GovernmentLevel> = ['All', 'Federal', 'State', 'Local', 'School Board'];

export function SearchExperience({ directory = false }: { directory?: boolean }) {
  const [params] = useSearchParams();
  const incomingAddress = params.get('address') ?? '';
  const [search, setSearch] = useState(incomingAddress);
  const [level, setLevel] = useState<'All' | GovernmentLevel>('All');
  const [submitted, setSubmitted] = useState(true);
  const result = useMemo(() => demoOfficials.filter((official) => level === 'All' || official.level === level), [level]);

  return (
    <section className="search-page pb-20">
      <div className="site-width">
        <div className="search-topbar">
          <Link to="/" className="back-link"><Icon name="arrow-left" size={16} /> Back</Link>
          <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="search-master-input"><Icon name="search" size={18} /><input aria-label="Search by address, official, or location" placeholder="Search officials by name, address, or zip..." value={search} onChange={(event) => setSearch(event.target.value)} /><button type="submit" aria-label="Search"><Icon name="arrow-right" size={18} /></button></form>
          <button className="round-action" type="button" aria-label="Saved address"><Icon name="check" size={18} /></button>
        </div>
        
        {directory ? (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">OFFICIAL DIRECTORY</span>
                <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Explore public profiles</h1>
                <p className="text-slate-600 mt-2 text-sm max-w-2xl">Browse our live database of validated elected officials. All data is continuously synchronized with federal and state repositories.</p>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm">{result.length.toLocaleString()} Officials Indexed</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {filters.map((filter) => <button key={filter} type="button" className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === level ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`} onClick={() => setLevel(filter)}>{filter}</button>)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {submitted && result.map((official) => (
                <Link to={`/officials/${official.slug}/`} key={official.slug} className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all hover:border-slate-300">
                  <div className="h-24 bg-slate-100 flex items-end justify-center relative overflow-hidden">
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <div className="px-5 pb-5 relative flex-1 flex flex-col items-center text-center -mt-12">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(official.name)}&background=random&size=128`} alt={official.name} className="w-20 h-20 rounded-full border-4 border-white shadow-sm mb-3 bg-white" />
                    <span className="text-3xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">{official.level}</span>
                    <h2 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{official.name}</h2>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{official.title}</p>
                    <div className="mt-auto pt-4 w-full flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded">{official.party}</span>
                      <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">Full Profile <Icon name="arrow-right" size={14} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="search-main-grid">
            <section className="official-results-panel">
              <div className="section-panel-heading"><div><span className="small-label">YOUR ELECTED OFFICIALS</span><h1>Your elected officials</h1></div><span className="result-total">{result.length} Officials Found</span></div>
              <div className="filter-tabs" role="tablist">{filters.map((filter) => <button key={filter} type="button" className={filter === level ? 'active' : ''} onClick={() => setLevel(filter)}>{filter}</button>)}</div>
              <div className="official-result-list">
                {submitted && result.map((official) => <article className="official-result" key={official.slug}><DemoAvatar official={official} size="md" /><div className="official-result-copy"><span>{official.level}</span><h2>{official.name}</h2><p>{official.title}</p><small>{official.party}</small></div><Link to={`/officials/${official.slug}/`} className="profile-arrow" aria-label={`View ${official.name} profile`}><Icon name="chevron-right" size={20} /></Link></article>)}
              </div>
              <Link to="/officials/" className="view-all-link">Explore all matching officials <Icon name="arrow-right" size={17} /></Link>
            </section>
            <aside className="representation-panel"><div className="section-panel-heading"><div><span className="small-label">WHERE THEY REPRESENT YOU</span><h2>Representation map</h2></div><Icon name="map" size={21} /></div><MapVisual /><div className="representation-address"><Icon name="pin" size={16} /><span>{search || "Miami, FL"}</span></div></aside>
          </div>
        )}
      </div>
    </section>
  );
}
"""

with open("src/components/search-experience.tsx", "w") as f:
    f.write(new_search)
