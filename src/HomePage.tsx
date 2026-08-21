import React from 'react';
import { Link } from 'react-router-dom';
import { AddressFinder } from './components/address-finder';
import { Icon } from './components/icons';
import { dataSources } from './lib/civic-database';
import { HermesLiveDashboard } from './components/hermes-live-dashboard';
import { CompletedOfficialsDirectory } from './components/completed-officials-directory';
import { hermesOrchestratorV2 } from './lib/hermes-matrix-v2';

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
  const [discoveries] = useState(initialRecentDiscoveries);
  const [hermesStats, setHermesStats] = useState(() => hermesOrchestratorV2.getAggregatedStats());

  useEffect(() => {
    const ticker = setInterval(() => {
      setHermesStats(hermesOrchestratorV2.getAggregatedStats());
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
            
            {/* Global Election Indicator Banner */}
            <div className="my-4 bg-amber-500/20 border border-amber-400/40 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest block">2026 ELECTIONS ACTIVE</span>
                  <span className="text-xs font-bold text-white">8 Races & 2 Ballot Questions on your local ballot</span>
                </div>
              </div>
              <Link
                to="/candidates/map"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition shadow-md shrink-0 flex items-center gap-1"
              >
                Monitor Your Candidates →
              </Link>
            </div>

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
                { label: "Officials Verified & Tracked", target: hermesStats.trackedOfficials, prefix: "", suffix: "", decimals: 0, change: `Out of 513,000 Total Seats`, color: "#102035" },
                { label: "Public Promises Tracked", target: hermesStats.trackedPromises, prefix: "", suffix: "+ Actions", decimals: 0, change: "Mapped across federal & state levels", color: "#16a36a" },
                { label: "Public Grants Indexed", target: hermesStats.liveGrants, prefix: "$", suffix: "B", decimals: 2, change: "USASpending & State Contract Feeds", color: "#2563eb" },
                { label: "Ingestion Accuracy", target: hermesStats.overallAccuracy, prefix: "", suffix: "%", decimals: 2, change: "Cross-Validated Government Archives", color: "#6366f1" }
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
      <section className="how-section hermes-section py-12 border-t border-slate-200 bg-slate-900">
        <div className="site-width">
          <HermesLiveDashboard />
        </div>
      </section>

      {/* COMPLETED OFFICIALS DIRECTORY SECTION (AT BOTTOM OF RESEARCH AGENTS) */}
      <CompletedOfficialsDirectory />
      
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

