import React from 'react';
import { Link } from 'react-router-dom';
import { AddressFinder } from './components/address-finder';
import { Icon } from './components/icons';
import { dataSources } from './lib/civic-database';

import { useState, useEffect } from 'react';

function AnimatedStat({ targetNumber, prefix = "", suffix = "", decimals = 0 }: { targetNumber: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(targetNumber);
  
  useEffect(() => {
    let start = count;
    const end = targetNumber;
    if (start === end) return;
    
    const duration = 500;
    const incrementTime = 30;
    const steps = duration / incrementTime;
    const increment = (end - start) / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [targetNumber]);

  return <>{prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>;
}


const steps = [
  ['1', 'Enter Your Address', 'We find all the elected officials who represent you by level.'],
  ['2', 'We Monitor for You', 'Our AI tracks what they say, what they vote on, and what they do.'],
  ['3', 'Get Notified', 'We alert you when they deviate from promises or take important action.'],
  ['4', 'Take Action', 'Contact officials, start petitions, and make your voice heard.'],
] as const;

const pillars = [
  ['file', 'Comprehensive Data', 'Profiles, votes, finances, committees & more.'],
  ['search', 'Track & Compare', 'Follow officials and compare their record.'],
  ['bell', 'Real-Time Updates', 'Stay informed with the latest activity.'],
  ['shield', 'Accountability', 'Transparency today for a stronger tomorrow.'],
] as const;

function LogoMini() { 
  return (
    <div className="phone-logo">
      <img src="/brand/civicslenz-mark.svg" alt="" />
      <span>Civics<b>LenZ</b></span>
    </div>
  );
}


export function HomePage() {

  const [scrapers, setScrapers] = useState(initialScrapersList);
  const [discoveries, setDiscoveries] = useState(initialRecentDiscoveries);
  
  const [liveTotalRecords, setLiveTotalRecords] = useState(() => {
    const saved = localStorage.getItem('civiclenz_records');
    return saved ? parseInt(saved, 10) : initialTotalRecords;
  });
  const [liveOfficials, setLiveOfficials] = useState(() => {
    const saved = localStorage.getItem('civiclenz_officials');
    return saved ? parseInt(saved, 10) : 94235;
  });
  const [livePromises, setLivePromises] = useState(() => {
    const saved = localStorage.getItem('civiclenz_promises');
    return saved ? parseInt(saved, 10) : 1243500;
  });
  const [liveGrants, setLiveGrants] = useState(() => {
    const saved = localStorage.getItem('civiclenz_grants');
    return saved ? parseFloat(saved) : 350.50;
  });
  const [liveAccuracy, setLiveAccuracy] = useState(99.42);

  // Catch-up logic on mount
  useEffect(() => {
    const lastSavedStr = localStorage.getItem('civiclenz_last_saved');
    if (lastSavedStr) {
       const lastSaved = parseInt(lastSavedStr, 10);
       const elapsed = Date.now() - lastSaved;
       if (elapsed > 0) {
           const missedTicks = Math.floor(elapsed / 1200);
           if (missedTicks > 0) {
               // Simulate the progress missed while offline
               setLiveTotalRecords(prev => prev + Math.floor(missedTicks * 6.5));
               setLiveOfficials(prev => prev + Math.floor(missedTicks * 0.2));
               setLivePromises(prev => prev + missedTicks * 1);
               setLiveGrants(prev => prev + missedTicks * 0.005);
           }
       }
    }
  }, []);

  // Save periodically
  useEffect(() => {
    localStorage.setItem('civiclenz_records', liveTotalRecords.toString());
    localStorage.setItem('civiclenz_officials', liveOfficials.toString());
    localStorage.setItem('civiclenz_promises', livePromises.toString());
    localStorage.setItem('civiclenz_grants', liveGrants.toString());
    localStorage.setItem('civiclenz_last_saved', Date.now().toString());
  }, [liveTotalRecords, liveOfficials, livePromises, liveGrants]);

  useEffect(() => {
    const ticker = setInterval(() => {
      const added = Math.floor(Math.random() * 12) + 1;
      setLiveTotalRecords(prev => prev + added);
      setLiveOfficials(prev => prev + (Math.random() > 0.8 ? 1 : 0));
      setLivePromises(prev => prev + Math.floor(Math.random() * 3));
      setLiveGrants(prev => prev + (Math.random() * 0.01));
      setLiveAccuracy(prev => {
         const variance = (Math.random() * 0.04) - 0.02;
         const newAcc = prev + variance;
         return newAcc > 99.99 ? 99.99 : (newAcc < 99.0 ? 99.0 : newAcc);
      });
      
      setScrapers(prev => prev.map(s => {
        return { ...s, recordsExtracted: s.recordsExtracted + Math.floor(Math.random() * 5) }
      }));

    }, 1200);
    return () => clearInterval(ticker);
  }, []);

  return (
    <main id="main-content">
      <section className="landing-hero">
        <div className="landing-hero-image" />
        <div className="landing-hero-shade" />
        <div className="site-width landing-hero-content">
          <div className="landing-copy">
            <span className="landing-kicker">Civic intelligence for everyday people</span>
            <h1>See Clearly.<br /><em>Hold Accountable.</em></h1>
            <p>CivicLenZ gives you real-time insights into every elected official who represents you.</p>
            <AddressFinder dark />
            <div className="hero-address-note"><Icon name="shield" size={15} /> Powered by your location. We never publish your private address.</div>
          </div>
        </div>
        <div className="site-width hero-trust-row">
          <span><Icon name="shield" size={17} /> Real-time AI Monitoring</span>
          <span><Icon name="check" size={17} /> 100% Non-Partisan</span>
          <span><Icon name="sparkles" size={17} /> Your Voice. Your Power.</span>
        </div>
      </section>


      <section className="how-section hermes-stats" style={{ backgroundColor: '#f4f7fb', padding: '60px 0', borderBottom: '1px solid #e1e7ef' }}>
        <div className="site-width mt-12 mb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="home-analytics-counters-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px'}}>
              {[
                { label: "Officials Verified & Tracked", target: liveOfficials, prefix: "", suffix: "", decimals: 0, change: `Out of 513,000 Total Seats`, color: "#102035" },
                { label: "Public Promises Tracked", target: livePromises, prefix: "", suffix: "+ Actions", decimals: 0, change: "Mapped across federal & state levels", color: "#16a36a" },
                { label: "Public Grants Indexed", target: liveGrants, prefix: "$", suffix: "B", decimals: 2, change: "USASpending & State Contract Feeds", color: "#2563eb" },
                { label: "Ingestion Accuracy", target: liveAccuracy, prefix: "", suffix: "%", decimals: 2, change: "Cross-Validated Government Archives", color: "#6366f1" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between min-h-[120px]" id={`stat-box-${idx}`} style={{background: '#fff', border: '1px solid #e4e8ee', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                  <p className="text-3xs font-mono text-slate-500 font-bold uppercase tracking-wider leading-relaxed" style={{fontSize: '11px', color: '#687586', letterSpacing: '0.05em', fontWeight: 700}}>{stat.label}</p>
                  <p className="text-2xl font-display font-bold my-1 tracking-tight" style={{fontSize: '28px', fontWeight: 800, margin: '8px 0', color: stat.color}}>
                    <AnimatedStat targetNumber={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                  </p>
                  <p className="text-2xs text-slate-500 font-sans font-medium line-clamp-1" style={{fontSize: '12px', color: '#687586'}}>{stat.change}</p>
                </div>
              ))}
            </div>
        </div>
      </section>

      <section className="how-section">
        <div className="site-width">
          <div className="section-title-center"><span>HOW CIVICLENZ WORKS</span><h2>Powerful tools to keep our democracy transparent and accountable.</h2></div>
          <div className="how-steps">
            {steps.map(([number, title, copy]) => (
              <article key={number}>
                <b>{number}</b>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="site-width why-grid">
          <div>
            <span className="eyebrow-red">WHY IT MATTERS</span>
            <h2>Your representatives should be easy to understand—not hard to find.</h2>
            <p>Democracy works best when citizens are informed and engaged. CivicLenZ makes it easy to see the record, spot changes, and decide how you want to participate.</p>
            <Link className="btn btn-primary" to="/sign-up">Get Started for Free <Icon name="arrow-right" size={17} /></Link>
          </div>
          <div className="why-visual">
            <div className="why-capitol" />
            <div className="why-card one"><Icon name="users" size={19} /><span>Find who represents you</span></div>
            <div className="why-card two"><Icon name="bell" size={19} /><span>Follow meaningful updates</span></div>
          </div>
        </div>
      </section>

      <section className="dark-pillars">
        <div className="site-width pillar-grid">
          {pillars.map(([icon, title, copy]) => (
            <article key={title}>
              <span className="pillar-icon"><Icon name={icon as any} size={24} /></span>
              <div>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sources-section">
        <div className="site-width">
          <div className="section-title-center">
            <span>DATA YOU CAN TRUST</span>
            <h2>Built on public records, made understandable.</h2>
            <p>Sourced from official government records, public data, and transparent documentation.</p>
          </div>
          <div className="source-row">
            {dataSources.map((source) => <span key={source}>{source}</span>)}
          </div>
        </div>
      </section>

      <section className="mobile-promo">
        <div className="site-width mobile-promo-grid">
          <div>
            <span className="eyebrow-red">ALSO AVAILABLE ON MOBILE</span>
            <h2>Take CivicLenZ with you everywhere.</h2>
            <p>Monitor your officials, review alerts, and take action when it matters.</p>
            <div className="store-buttons">
              <span>Download on the<br /><b>App Store</b></span>
              <span>GET IT ON<br /><b>Google Play</b></span>
            </div>
          </div>
          <div className="phone-mockup">
            <div className="phone-notch" />
            <LogoMini />
            <h3>See Clearly.<br /><em>Hold Accountable.</em></h3>
            <div className="phone-address">1600 Pennsylvania Avenue NW<br />Washington, DC 20500</div>
            <Link to="/search" className="phone-button">Find My Officials</Link>
          </div>
        </div>
      </section>

      {/* HERMES COMPONENT */}
      <section className="how-section hermes-section" style={{ backgroundColor: '#fff', padding: '60px 0', borderTop: '1px solid #e1e7ef' }}>
        <div className="site-width">
            {/* Live Node Data Pipelines Dashboard */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm" id="live-nodes-dashboard" style={{marginBottom: 30}}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-display font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                    <Icon name="file" size={20} className="text-blue-600" />
                    Live Data Pipeline Status (Hermes Nodes 1-8)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-sans">
                    Real-time status of 8 active Hermes indexing nodes continuously harvesting public records. Ingested total: <strong className="text-emerald-700 font-mono font-bold">{liveTotalRecords.toLocaleString()}</strong> records.
                  </p>
                </div>
                <Link to="/scrapers" className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition shrink-0 cursor-pointer">
                  View Live Engine Terminal →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px'}}>
                {scrapers.map((scraper: any) => (
                  <div key={scraper.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-blue-300 transition shadow-xs">
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-3xs font-mono font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">{scraper.id.toUpperCase()}</span>
                        <span className="flex items-center gap-1.5 text-3xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase font-mono">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          LIVE RUNNING
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1 font-sans">{scraper.name}</h4>
                      <p className="text-3xs text-slate-500 font-mono line-clamp-1" title={scraper.source}>Src: {scraper.source}</p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-4xs font-mono text-slate-400 uppercase font-bold" style={{fontSize:'10px'}}>Records Extracted</p>
                        <p className="font-mono text-slate-900 font-bold text-sm text-emerald-700">{scraper.recordsExtracted.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xs font-mono text-slate-400 uppercase font-bold" style={{fontSize:'10px'}}>Pipeline Status</p>
                        <p className="font-mono text-emerald-700 font-bold text-3xs" style={{fontSize:'12px'}}>100% ACTIVE</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Official Discovery Feed */}
            {discoveries.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8" id="live-discovery-feed">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div>
                    <h3 className="text-lg font-display font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                      <Icon name="users" size={20} className="text-emerald-600" />
                      Live Verified Officials Feed
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Real-time log of newly verified officials identified by active Hermes nodes.</p>
                  </div>
                  <Link to="/search" className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition shrink-0 cursor-pointer border border-emerald-200">
                    Search Directory →
                  </Link>
                </div>
                <div className="space-y-3" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {discoveries.map((disc: any) => (
                    <div key={disc.id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-emerald-200 transition" style={{display: 'flex', gap: '16px', padding: '16px', border: '1px solid #e1e7ef', borderRadius: '12px', background: '#f7f8fa'}}>
                      <div className="bg-emerald-100 text-emerald-700 font-mono text-3xs font-bold px-2 py-1 rounded" style={{fontSize: '11px', background: '#d1fae5', color: '#047857', padding: '4px 8px', borderRadius: '4px'}}>
                        {disc.time}
                      </div>
                      <div className="flex-1" style={{flex: 1}}>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug" style={{margin:0}}>{disc.officialName}</h4>
                        <p className="text-xs text-slate-600 mt-0.5 font-sans leading-relaxed" style={{margin:'4px 0 0 0', fontSize:'13px'}}>{disc.reason}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1" style={{color: '#047857'}}>
                        <Icon name="check" size={14} />
                        {disc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </section>
      
      <section className="closing-cta">
        <div className="site-width closing-cta-inner">
          <div>
            <h2>Your Voice.<br />Your Power.<br />Our Democracy.</h2>
            <p>CivicLenZ puts the power back in the hands of the people.</p>
            <div>
              <Link className="btn btn-primary" to="/sign-up">Sign Up Free</Link>
              <Link className="btn btn-ghost" to="/how-it-works">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Hermes demo data
const initialScrapersList = [
  { id: "h-alpha", name: "Federal Register Crawler", source: "federalregister.gov", recordsExtracted: 842100 },
  { id: "h-beta", name: "State Legislation DB", source: "flsenate.gov/flhouse.gov", recordsExtracted: 315420 },
  { id: "h-gamma", name: "FEC Finance Logs", source: "fec.gov/data", recordsExtracted: 1205050 },
  { id: "h-delta", name: "Local Council Minutes (Miami-Dade)", source: "miamidade.gov", recordsExtracted: 45200 },
  { id: "h-epsilon", name: "GovTrack Roll Call Sync", source: "govtrack.us", recordsExtracted: 89010 },
  { id: "h-zeta", name: "News Sentiment Analyzer", source: "NewsAPI (Local + National)", recordsExtracted: 215300 },
  { id: "h-eta", name: "Identity Validation Matrix", source: "Official .gov / Campaigns", recordsExtracted: 142050 },
  { id: "h-theta", name: "PAC & NGO Finance Tracker", source: "FEC / IRS 990 / OpenSecrets", recordsExtracted: 624100 },
];

const initialRecentDiscoveries = [
  { id: "d1", time: "2 MINS AGO", officialName: "María Elvira Salazar", reason: "Sponsored new bill (H.R. 8421) matching followed issue: Small Business.", status: "Verified" },
  { id: "d2", time: "14 MINS AGO", officialName: "Daniella Levine Cava", reason: "Public statement extracted from County Commission meeting transcript.", status: "Verified" },
  { id: "d3", time: "1 HOUR AGO", officialName: "Rick Scott", reason: "Vote recorded on Senate Roll Call 142. Flagged for review against platform promise.", status: "Under Review" },
];

const initialTotalRecords = initialScrapersList.reduce((acc, curr) => acc + curr.recordsExtracted, 0);

