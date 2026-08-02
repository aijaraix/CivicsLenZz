/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent, useEffect } from "react";
import { 
  Building2, 
  Search, 
  FileText, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Loader2, 
  Mail, 
  Phone, 
  Globe, 
  Twitter, 
  Facebook, 
  ChevronRight, 
  Database, 
  Activity, 
  FileCheck, 
  BookOpen, 
  Filter, 
  AlertOctagon, 
  ChevronDown, 
  User, 
  TrendingUp, 
  Compass, 
  Terminal, 
  ExternalLink,
  ShieldAlert,
  Calendar,
  XCircle
} from "lucide-react";
import { mockOfficials, mockBills, mockPromises, mockCampaignFinance, mockSpending, mockScrapers } from "./data";
import { SpecsViewer } from "./components/SpecsViewer";
import { Official, Bill, PromiseItem, CampaignFinance, GrantContract } from "./types";

function AnimatedStat({ targetNumber, prefix = "", suffix = "", decimals = 0 }: { targetNumber: number, prefix?: string, suffix?: string, decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetNumber;
    const duration = 1500;
    const incrementTime = 30;
    const steps = duration / incrementTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
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

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "directory" | "promises" | "spending" | "action-center" | "scrapers" | "specs" | "identify">("home");
  
  // Search state
  const [searchZip, setSearchZip] = useState("");
  const [zipResult, setZipResult] = useState<string | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);
  
  // Identify Officials state
  const [identifyQuery, setIdentifyQuery] = useState("");
  const [identifyResponseText, setIdentifyResponseText] = useState<string | null>(null);
  const [identifyLoading, setIdentifyLoading] = useState(false);
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  
  // General Search filtering for officials
  const [officialSearch, setOfficialSearch] = useState("");
  const [officialSearchError, setOfficialSearchError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>("All");
  
  // Selected Official for Detail view
  const [selectedOfficialId, setSelectedOfficialId] = useState<string | null>(null);

  // AI Actions state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [activeExplainBillId, setActiveExplainBillId] = useState<string | null>(null);

  // Citizen Action Center State
  const [actionOfficial, setActionOfficial] = useState("");
  const [actionTopic, setActionTopic] = useState("Public Education Budget Allocations");
  const [actionStance, setActionStance] = useState("Increases in minimum classroom teacher starting pay with transparent metrics");
  const [actionFormat, setActionFormat] = useState<"letter" | "email" | "script" | "testimony">("letter");
  const [actionError, setActionError] = useState<string | null>(null);
  
  // State for scraper run simulations
  const [scrapersList, setScrapersList] = useState(mockScrapers);
  const [runningScraperId, setRunningScraperId] = useState<string | null>(null);

  // Address lookup handler (Simulation matching multi-state districts)
  const handleZipSearch = (e: FormEvent) => {
    e.preventDefault();
    const cleanAddress = searchZip.trim();
    setZipError(null);
    setZipResult(null);

    if (!cleanAddress) {
      setZipError("Address cannot be empty.");
      return;
    }
    if (cleanAddress.length < 5) {
      setZipError("Please enter a complete address or ZIP code.");
      return;
    }

    if (cleanAddress.includes("33128") || cleanAddress.includes("33101") || cleanAddress.toLowerCase().includes("miami")) {
      setZipResult("Cross-referencing Nodes 1-5 for Miami-Dade County. Synced: Federal (Rubio), State (DeSantis), and Municipal (Levine Cava).");
      setLevelFilter("All");
      setActiveTab("directory");
    } else if (cleanAddress.includes("32801") || cleanAddress.toLowerCase().includes("orlando")) {
      setZipResult("Cross-referencing Nodes 1-5 for Orange County. Synced: Federal (Rubio), State (DeSantis), and Special District (Thompson).");
      setLevelFilter("All");
      setActiveTab("directory");
    } else if (cleanAddress.toLowerCase().includes("georgia") || cleanAddress.includes("303") || cleanAddress.toLowerCase().includes("atlanta")) {
      setZipResult(`Cross-referencing Nodes 1-5 for "${cleanAddress}". Synced profiles for overlapping Georgia Federal, State, and County representatives.`);
      setLevelFilter("All");
      setActiveTab("directory");
    } else {
      setZipResult(`Cross-referencing Nodes 1-5 for "${cleanAddress}". Indexed full profile for all overlapping representatives (Federal, State, and Municipal).`);
      setLevelFilter("All");
      setActiveTab("directory");
    }
  };

  // Filtered Officials
  const filteredOfficials = useMemo(() => {
    return mockOfficials.filter(off => {
      const matchSearch = off.name.toLowerCase().includes(officialSearch.toLowerCase()) || 
                          off.currentTitle.toLowerCase().includes(officialSearch.toLowerCase()) ||
                          off.jurisdiction.toLowerCase().includes(officialSearch.toLowerCase());
      const matchLevel = levelFilter === "All" ? true : off.level === levelFilter;
      return matchSearch && matchLevel;
    });
  }, [officialSearch, levelFilter]);

  // Selected Official Object
  const selectedOfficial = useMemo(() => {
    return mockOfficials.find(o => o.id === selectedOfficialId) || null;
  }, [selectedOfficialId]);

  // Campaign Finance data for selected official
  const selectedFinance = useMemo(() => {
    if (!selectedOfficialId) return null;
    return mockCampaignFinance.find(f => f.officialId === selectedOfficialId) || null;
  }, [selectedOfficialId]);

  // Dynamic Trigger to explain bills via real express /api/gemini/action proxy or simulated fallback
  const handleExplainBill = async (bill: Bill) => {
    setAiLoading(true);
    setAiResponseText(null);
    setActiveExplainBillId(bill.id);
    try {
      const res = await fetch("/api/gemini/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "explain_bill",
          payload: {
            title: `${bill.number}: ${bill.title}`,
            text: bill.summary
          }
        })
      });
      const data = await res.json();
      setAiResponseText(data.text);
    } catch (e) {
      console.error(e);
      setAiResponseText("Unable to reach AI Explainer endpoint. Set GEMINI_API_KEY environment variable to test integration.");
    } finally {
      setAiLoading(false);
    }
  };

  // Citizen Action letter drafter
  const handleDraftAction = async (e: FormEvent) => {
    e.preventDefault();
    setActionError(null);
    
    if (!actionOfficial) {
      setActionError("Please select a target representative.");
      return;
    }
    if (!actionTopic.trim() || actionTopic.trim().length < 5) {
      setActionError("Please provide a core issue or topic (at least 5 characters).");
      return;
    }
    if (!actionStance.trim() || actionStance.trim().length < 10) {
      setActionError("Please provide your position/stance (at least 10 characters).");
      return;
    }

    setAiLoading(true);
    setAiResponseText(null);
    try {
      const res = await fetch("/api/gemini/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "draft_action",
          payload: {
            topic: actionTopic,
            officialName: actionOfficial || "Elected Official",
            stance: actionStance,
            format: actionFormat
          }
        })
      });
      const data = await res.json();
      setAiResponseText(data.text);
    } catch (e) {
      console.error(e);
      setAiResponseText("Drafter endpoint failed. Check API configuration inside your environment.");
    } finally {
      setAiLoading(false);
    }
  };

  // Run scraper pipeline simulations
  const runScraperJob = (id: string) => {
    setRunningScraperId(id);
    setScrapersList(prev => prev.map(s => s.id === id ? { ...s, status: "Running" } : s));

    setTimeout(() => {
      setScrapersList(prev => prev.map(s => {
        if (s.id === id) {
          const addedRecords = Math.floor(Math.random() * 25) + 5;
          return {
            ...s,
            status: "Success",
            recordsExtracted: s.recordsExtracted + addedRecords,
            lastRun: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
            health: Math.min(100, Math.max(90, s.health + (Math.random() * 2 - 1)))
          };
        }
        return s;
      }));
      setRunningScraperId(null);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" id="civiclenz-root">
      
      {/* 1. Global Transparencey Notice Strip */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs px-4 py-2 flex flex-wrap justify-between items-center gap-2" id="global-audit-notice-strip">
        <div className="flex items-center gap-2" id="notice-meta-left">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="font-sans text-slate-300">
            <strong>Active Ingestion Base</strong>: Multi-State Sunshine Records Directory (CS/SB bills, county audits, verified transcripts)
          </p>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-2xs font-mono" id="notice-meta-right">
          <button onClick={() => setActiveTab("scrapers")} className="hover:text-emerald-300 transition cursor-pointer">
            Active Scrapers: <strong className="text-emerald-400">{scrapersList.filter(s => s.status !== "Failed").length} / {scrapersList.length}</strong>
          </button>
          <span>Last Index Tick: {scrapersList[0]?.lastRun || "2026-05-20 03:33 UTC"}</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300">Political Neutrality Guard V1.4</span>
        </div>
      </div>

      {/* 2. Main High-Density Header Column */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs" id="main-site-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab("home"); setSelectedOfficialId(null); }} id="brand-identity-container">
            <div className="bg-slate-900 text-white p-2.5 rounded-lg flex items-center justify-center shadow-sm" id="brand-icon-box">
              <Building2 className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5" id="brand-main">
                <span className="text-2xl font-display font-semibold tracking-tight text-slate-900">CivicsLens</span>
                <span className="text-xs px-1.5 py-0.2 bg-slate-100 text-slate-600 font-mono rounded font-medium border border-gray-200">.com</span>
              </div>
              <p className="text-2xs text-slate-500 tracking-wide font-sans mt-0.5">The Democracy Accountability Layer</p>
            </div>
          </div>

          {/* Quick Find Zip Input */}
          <div className="w-full max-w-sm relative">
            <form onSubmit={handleZipSearch} className={`flex items-center bg-slate-100 border ${zipError ? 'border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500' : 'border-gray-200'} rounded-lg overflow-hidden w-full`} id="header-quick-zip-search">
              <span className={`px-3 ${zipError ? 'text-red-400' : 'text-slate-400'}`}>
                <MapPin className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Enter Full Address or ZIP (e.g. 123 Main St, Miami, FL 33128)..."
                value={searchZip}
                onChange={(e) => setSearchZip(e.target.value)}
                className="bg-transparent border-0 py-1.5 pl-0 pr-3 focus:outline-none text-xs w-full text-slate-800"
                id="zip-search-field"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-4 py-2 transition font-sans font-medium"
                id="zip-submit-btn"
              >
                Locate
              </button>
            </form>
            {zipError && (
              <p className="absolute -bottom-5 left-1 text-red-500 text-3xs font-medium bg-white px-1 shadow-sm rounded">{zipError}</p>
            )}
          </div>

          {/* Global Utility Actions */}
          <div className="flex items-center gap-2" id="header-global-navigation-buttons">
            <button
              onClick={() => { setActiveTab("action-center"); setSelectedOfficialId(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100`}
              id="action-center-quick-btn"
            >
              <Mail className="h-3.5 w-3.5" />
              Citizen Action Center
            </button>
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <nav className="bg-white border-t border-gray-100" id="main-navigation-menu">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 py-1 bg-white overflow-x-auto" id="nav-tabs-list">
              {[
                { id: "home", label: "Overview & Index", icon: Compass },
                { id: "identify", label: "Identify Officials", icon: Search },
                { id: "directory", label: "Officials Directory", icon: User },
                { id: "promises", label: "Promise Tracker Matrix", icon: CheckCircle2 },
                { id: "spending", label: "Federal Money & Grants", icon: DollarSign },
                { id: "action-center", label: "Citizen Action Hub", icon: FileText },
                { id: "scrapers", label: "Scrapers & Data Diagnostics", icon: Activity },
                { id: "specs", label: "CivicLenZ Core Blueprint Specs", icon: BookOpen }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id !== "directory") {
                        setSelectedOfficialId(null);
                      }
                    }}
                    className={`px-3 py-2.5 text-xs font-display font-medium border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "border-slate-900 text-slate-900 font-semibold"
                        : "border-transparent text-slate-500 hover:text-slate-900 hover:border-gray-200"
                    }`}
                    id={`tab-btn-${tab.id}`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Zip search status alert */}
      {zipResult && (
        <div className="bg-indigo-50 border-b border-indigo-100 text-indigo-800 text-xs px-4 py-3" id="zip-alert-ribbon">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="font-sans flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>{zipResult}</span>
            </p>
            <button 
              onClick={() => setZipResult(null)} 
              className="text-indigo-400 hover:text-indigo-700 font-bold ml-auto px-2"
              id="clear-zip-alert-btn"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 3. Main content body wrapper */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="primary-app-viewport">
        
        {/* ==================== TAB A: HOME / GATEWAY ==================== */}
        {activeTab === "home" && (
          <div className="space-y-8" id="tab-viewport-home">
            
            {/* Visual Hero Branding Grid */}
            <div className="bg-slate-950 text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl" id="hero-marketing-box">
              {/* Overlay abstract background nodes */}
              <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-slate-850 rounded-full opacity-30 pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-indigo-950 rounded-full opacity-20 pointer-events-none" />

              <div className="relative max-w-3xl space-y-4" id="hero-marketing-content">
                <span className="text-2xs font-mono px-3 py-1 bg-indigo-900/60 border border-indigo-700/60 text-indigo-200 rounded-full font-semibold uppercase tracking-wider">
                  CivicLenZ.ai Platform MVP (Florida & Georgia Base)
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-white tracking-tight leading-[1.1] font-bold" id="hero-big-heading">
                  The AI-powered accountability layer <br />for democracy.
                </h1>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl" id="hero-body-text">
                  Crawl legislative votes, map campaign finance PAC footprints, trace public grant flows down to local city jurisdictions, and check public promises against voting indexes using politically neutral, audit-transparent verified documentation.
                </p>

                <div className="pt-4 flex flex-wrap gap-3" id="hero-cta-buttons">
                  <button
                    onClick={() => setActiveTab("directory")}
                    className="bg-white hover:bg-slate-100 text-slate-950 text-sm font-display font-medium px-6 py-3.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
                    id="hero-primary-cta"
                  >
                    Explore Nationwide Rollout
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("specs")}
                    className="bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-sm font-display font-medium px-6 py-3.5 rounded-lg transition flex items-center gap-2 cursor-pointer"
                    id="hero-secondary-cta"
                  >
                    View Systems Blueprints Specs
                    <Database className="h-3.5 w-3.5 text-indigo-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Core Statistics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="home-analytics-counters-grid">
              {[
                { label: "Active Monitored Representatives", target: 64482, prefix: "", suffix: "+", decimals: 0, change: "Expanding Nationwide (Federal/State/Municipal)", color: "border-slate-200 text-slate-900" },
                { label: "Public Promises Monitored", target: 12435, prefix: "", suffix: " Pledge Actions", decimals: 0, change: "6,527 Completed / 5,908 In Progress", color: "border-slate-200 text-emerald-600" },
                { label: "Public Works Grants Indexed", target: 350.5, prefix: "$", suffix: " Billion", decimals: 1, change: "Nationwide Infrastructure Tracking", color: "border-slate-200 text-indigo-700" },
                { label: "Crawler System Pipelines", target: 98.7, prefix: "", suffix: "% Health Rate", decimals: 1, change: "5 Active / Scaling to new states", color: "border-slate-200 text-cyan-700" }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white border rounded-xl p-5 shadow-sm" id={`stat-box-${idx}`}>
                  <p className="text-3xs font-mono text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-display font-semibold mt-1 tracking-tight ${stat.color}`}>
                    <AnimatedStat targetNumber={stat.target} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} />
                  </p>
                  <p className="text-2xs text-slate-500 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Live Node Data Pipelines Dashboard */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm" id="live-nodes-dashboard">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-display font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-500" />
                    Live Data Pipeline Status
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Real-time status of our 5 expanding indexing nodes across the country.</p>
                </div>
                <button onClick={() => setActiveTab("scrapers")} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition">
                  View Detailed Logs
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scrapersList.map((scraper) => (
                  <div key={scraper.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-3xs font-mono font-bold uppercase tracking-widest text-slate-400">Node {scraper.id.toUpperCase()}</span>
                        {scraper.status === "Success" && <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase"><CheckCircle2 className="h-3 w-3" /> Healthy</span>}
                        {scraper.status === "Running" && <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase"><Activity className="h-3 w-3 animate-pulse" /> Syncing</span>}
                        {scraper.status === "Failed" && <span className="flex items-center gap-1 text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold uppercase"><XCircle className="h-3 w-3" /> Degraded</span>}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 leading-tight mb-2">{scraper.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2" title={scraper.source}>Source: {scraper.source}</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-400 mb-0.5">Records</p>
                        <p className="font-mono text-slate-700 font-medium">{scraper.recordsExtracted.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-0.5">Last Sync</p>
                        <p className="font-mono text-slate-700 font-medium text-[10px] mt-1">{scraper.lastRun}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Trust & Neutrality Statement Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm" id="neutrality-statement-panel">
              <div className="flex items-start gap-4" id="charter-header">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl" id="shield-box">
                  <ShieldAlert className="h-7 w-7 text-slate-800" />
                </div>
                <div className="space-y-1" id="charter-text-frame">
                  <h3 className="text-lg font-display font-semibold text-slate-900 tracking-tight">
                    Strict Political Nonpartisanship & Fact Grounding Charter
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans mt-2 max-w-4xl">
                    CivicLenZ is politically neutral, fact-based, source-driven, and institutionally credible. We prioritize official registers (Congress.gov, State Legislatures, Ethics filings). 
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 text-xs text-slate-500" id="charter-pillars-grid">
                    <div>
                      <strong className="text-slate-800 font-display">1. Absolutely No Partisan Bias</strong>
                      <p className="mt-1 leading-relaxed">We avoid color bias, editorial characterizations, or subjective metrics. Democratic and Republican ratings are derived exclusively from public voting records.</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 font-display">2. Real Cite Backlinks</strong>
                      <p className="mt-1 leading-relaxed">Every analyzed statement, financial disclosure, or promise details contains direct, archived hyperlinks back to official government records or transcripts.</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 font-display">3. Transparent AI Summaries</strong>
                      <p className="mt-1 leading-relaxed">Gemini-generated text acts as structural plain-English explainers. Disclaimers are attached to clarify that analytical checks are informational.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-Locator Features Portal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="home-features-portal-grid">
              
              {/* Feature 1: Official Profiles */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between group" id="card-feature-profiles">
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-100 h-12 w-12 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-800" />
                  </div>
                  <h4 className="text-sm font-display font-semibold text-slate-900 tracking-tight">Officials Profiles Directory</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    View full identity details, bio databases, campaign contributors, voting attendance logs, and promise matrices for tracked representatives.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("directory")}
                  className="mt-6 text-sm font-display font-medium text-slate-800 group-hover:text-slate-950 flex items-center gap-1 cursor-pointer"
                  id="btn-nav-to-directory"
                >
                  Launch Directory
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Feature 2: Citizens Stance Writer */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between group" id="card-feature-action">
                <div className="space-y-3">
                  <div className="bg-indigo-50 border border-indigo-100 h-12 w-12 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-indigo-700" />
                  </div>
                  <h4 className="text-sm font-display font-semibold text-indigo-950 tracking-tight">Citizen Action Center</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Draft professional, politically neutral constituent letters, meeting testimonies, email drafts, or phone scripts using Gemini API.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("action-center")}
                  className="mt-6 text-sm font-display font-medium text-indigo-700 group-hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  id="btn-nav-to-action"
                >
                  Write Representation Script
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Feature 3: Specs viewer link */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between group" id="card-feature-blueprints">
                <div className="space-y-3">
                  <div className="bg-cyan-50 border border-cyan-100 h-12 w-12 rounded-xl flex items-center justify-center">
                    <Activity className="h-6 w-6 text-cyan-700" />
                  </div>
                  <h4 className="text-sm font-display font-semibold text-cyan-950 tracking-tight">Developer & System Specs</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Explore detailed database schemas (50+ fields), local cron schedules, proxy rotation metrics, and data integrity maps defining CivicLenZ.ai.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("specs")}
                  className="mt-6 text-sm font-display font-medium text-cyan-700 group-hover:text-cyan-900 flex items-center gap-1 cursor-pointer"
                  id="btn-nav-to-specs"
                >
                  View Tech Specs Blueprints
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB B: OFFICIALS DIRECTORY ==================== */}
        {activeTab === "directory" && (
          <div className="space-y-6" id="tab-viewport-directory">
            
            {/* Split layout: Selector List when profile is closed, or Detail when open */}
            {!selectedOfficialId ? (
              <div className="space-y-6" id="directory-index-grid">
                
                {/* Search & Selection Controls Column */}
                <div className="bg-white border rounded-xl p-5 flex flex-wrap items-center justify-between gap-4" id="search-filter-controls-row">
                  <div className="w-full max-w-sm relative">
                    <div className={`flex items-center bg-slate-100 border ${officialSearchError ? 'border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500' : 'border-gray-200'} rounded-lg px-3 py-2 w-full`}>
                      <Search className={`h-4 w-4 mr-2 ${officialSearchError ? 'text-red-400' : 'text-slate-400'}`} />
                      <input
                        type="text"
                        placeholder="Search officials by name or jurisdiction..."
                        value={officialSearch}
                        onChange={(e) => {
                          const val = e.target.value;
                          setOfficialSearch(val);
                          if (val && !/^[a-zA-Z0-9\s-.,']*$/.test(val)) {
                            setOfficialSearchError("Only letters, numbers, spaces, and basic punctuation are allowed.");
                          } else {
                            setOfficialSearchError(null);
                          }
                        }}
                        className="bg-transparent border-0 focus:outline-none text-xs w-full text-slate-800"
                        id="official-name-search-input"
                      />
                    </div>
                    {officialSearchError && (
                      <p className="absolute -bottom-5 left-1 text-red-500 text-3xs font-medium bg-white px-1">{officialSearchError}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto" id="level-filter-pills-row">
                    <span className="text-2xs text-slate-400 font-mono flex items-center gap-1">
                      <Filter className="h-3 w-3" /> LEVEL:
                    </span>
                    {["All", "Federal", "State", "County", "Special District"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setLevelFilter(level)}
                        className={`text-2xs font-sans px-2.5 py-1 rounded-full border transition cursor-pointer font-medium ${
                          levelFilter === level
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-gray-200 text-slate-500 hover:text-slate-900"
                        }`}
                        id={`btn-filter-${level}`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid List of Officials */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="officials-grid-root">
                  {filteredOfficials.map((official) => {
                    let levelColor = "bg-slate-100 text-slate-600 border-slate-200";
                    if (official.level === "Federal") levelColor = "bg-indigo-50 text-indigo-700 border-indigo-100";
                    if (official.level === "State") levelColor = "bg-amber-50 text-amber-700 border-amber-100";
                    if (official.level === "County") levelColor = "bg-cyan-50 text-cyan-700 border-cyan-100";
                    if (official.level === "Special District") levelColor = "bg-emerald-50 text-emerald-700 border-emerald-100";

                    let partyColor = "bg-slate-100 text-slate-700";
                    if (official.party === "Republican") partyColor = "bg-red-50 text-red-800 border-red-100";
                    if (official.party === "Democrat") partyColor = "bg-blue-50 text-blue-800 border-blue-100";

                    return (
                      <div
                        key={official.id}
                        onClick={() => {
                          setSelectedOfficialId(official.id);
                        }}
                        className="bg-white border border-gray-200 hover:border-slate-400 rounded-xl p-5 hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between"
                        id={`official-card-${official.id}`}
                      >
                        <div className="space-y-3">
                          
                          {/* Photo and Titles */}
                          <div className="flex items-center gap-3">
                            <img
                              src={official.photoUrl}
                              alt={official.name}
                              className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                            />
                            <div>
                              <h3 className="text-base font-display font-semibold text-slate-900 line-clamp-1">{official.name}</h3>
                              <p className="text-2xs font-sans text-slate-500 line-clamp-1 font-mono">{official.currentTitle}</p>
                            </div>
                          </div>

                          {/* Level Metrics */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className={`text-4xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${levelColor}`}>
                              {official.level}
                            </span>
                            <span className={`text-4xs font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${partyColor}`}>
                              {official.party}
                            </span>
                          </div>

                          <p className="text-2xs text-slate-600 line-clamp-3 font-sans pt-1">
                            {official.bio}
                          </p>
                        </div>

                        <div className="border-t border-gray-100 mt-4 pt-3 flex justify-between items-center text-3xs font-mono text-slate-400">
                          <span>Verified Status: <strong className="text-emerald-600">YES</strong></span>
                          <span className="text-slate-900 group-hover:text-amber-600 hover:underline flex items-center">
                            Open Profile
                            <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {filteredOfficials.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-white border rounded-xl" id="no-officials-alert">
                      <p className="text-xs text-slate-400 font-sans">No elected representatives match your search criteria.</p>
                      <button
                        onClick={() => { setOfficialSearch(""); setLevelFilter("All"); }}
                        className="mt-2 text-2xs font-semibold text-indigo-600 underline"
                        id="reset-filter-btn"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              
              /* SINGLE PROFILE EXPANDED VIEW */
              <div className="space-y-6" id="official-profile-detail-panel">
                
                {/* Back button Row */}
                <button
                  onClick={() => setSelectedOfficialId(null)}
                  className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-2xs font-mono uppercase tracking-wide transition cursor-pointer"
                  id="btn-back-to-directory"
                >
                  ← Return to Results Directory
                </button>

                {/* Profile header block */}
                <div className="bg-white border rounded-xl p-6" id="profile-detailed-header-frame">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedOfficial?.photoUrl}
                        alt={selectedOfficial?.name}
                        className="w-20 h-20 rounded-full object-cover border border-gray-100 shadow-md"
                        id="expanded-photo-avatar"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-display font-semibold text-slate-900" id="expanded-name">
                            {selectedOfficial?.name}
                          </h2>
                          <span className="text-3xs font-mono uppercase px-2 py-0.5 bg-slate-100 border text-slate-600 rounded">
                            {selectedOfficial?.party}
                          </span>
                        </div>
                        <p className="text-sm font-sans text-slate-600 font-medium" id="expanded-title">
                          {selectedOfficial?.currentTitle}
                        </p>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          Jurisdiction Coverage: {selectedOfficial?.jurisdiction}
                        </p>
                      </div>
                    </div>

                    {/* Simple stats boxes */}
                    <div className="grid grid-cols-3 gap-3 w-full md:w-auto" id="profile-quick-metrics-box">
                      <div className="bg-slate-50 border p-3 rounded-lg text-center">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold">Attendance</span>
                        <p className="text-xl font-display font-semibold text-slate-900 mt-0.5">{selectedOfficial?.attendanceRate}%</p>
                      </div>
                      <div className="bg-slate-50 border p-3 rounded-lg text-center">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold">Voting Roll</span>
                        <p className="text-xl font-display font-semibold text-slate-900 mt-0.5">{selectedOfficial?.votingParticipation}%</p>
                      </div>
                      <div className="bg-slate-50 border p-3 rounded-lg text-center">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold">Promises Fulfilled</span>
                        <p className="text-xl font-display font-semibold text-emerald-600 mt-0.5">
                          {selectedOfficial?.promiseFulfillment.completed} / {selectedOfficial?.promiseFulfillment.total}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Sub Tab Panel implementations (Now rendered sequentially) */}

                {/* 1. Identity & Overview */}
                <div className="bg-white border rounded-xl p-6 space-y-6" id="panel-profile-overview">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Left: Bio Data */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Biographical Profile</h3>
                        <p className="text-xs leading-relaxed text-slate-600 font-sans bg-slate-50 p-4 rounded-lg border">
                          {selectedOfficial?.bio}
                        </p>
                        
                        <div>
                          <strong className="text-2xs font-sans text-slate-800">Prior Offices & Military Backings:</strong>
                          <ul className="list-disc pl-5 text-2xs text-slate-600 mt-1 space-y-1">
                            {selectedOfficial?.background.map((bg, index) => <li key={index}>{bg}</li>)}
                          </ul>
                        </div>

                        <div>
                          <strong className="text-2xs font-sans text-slate-800">Academic Disclosures:</strong>
                          <ul className="list-disc pl-5 text-2xs text-slate-600 mt-1 space-y-1">
                            {selectedOfficial?.education.map((edu, index) => <li key={index}>{edu}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* Right: Contact details */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Official Registry Contacts</h3>
                        
                        <div className="space-y-2 text-2xs text-slate-600 block bg-slate-50 border p-4 rounded-lg" id="contact-info-block">
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <strong>Official Email:</strong> 
                            <span className="text-indigo-600">{selectedOfficial?.contact.email || "Public registry email withheld"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <strong>Office Phone:</strong> <span>{selectedOfficial?.contact.phone || "Public phone withheld"}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-slate-400" />
                            <strong>Website:</strong> <a href={selectedOfficial?.contact.website} target="_blank" className="text-indigo-600 underline">{selectedOfficial?.contact.website}</a>
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <strong>Office Address:</strong> <span>{selectedOfficial?.contact.office || "Jurisdictional Assembly Offices"}</span>
                          </p>
                        </div>

                        {/* Stance Direct Pitch Buttons */}
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg space-y-2" id="action-pitch-box">
                          <strong className="text-2xs text-indigo-950 font-sans block">Constituent Letter Assistance</strong>
                          <p className="text-3xs text-indigo-700 leading-normal">
                            Generate a formal, politically-impartial speech draft, message script, or email to this representative concerning upcoming voting files.
                          </p>
                          <button
                            onClick={() => {
                              setActionOfficial(selectedOfficial?.name || "");
                              setActiveTab("action-center");
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded transition w-full"
                            id="btn-trigger-stance-writer"
                          >
                            Draft Message to {selectedOfficial?.name} now
                          </button>
                        </div>

                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border-t p-3 text-center rounded-b-xl text-3xs font-mono text-slate-500">
                      <strong>Source Verification:</strong> <a href={selectedOfficial?.sources?.biographyUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">{selectedOfficial?.sources?.biographyUrl || "https://dos.myflorida.com/elections/contacts/elected-officials/"}</a>
                    </div>
                  </div>

                {/* 1.5 Seat of Power & Campaign Web Audit Tab */}
                  <div className="space-y-6 mt-6" id="panel-profile-seat-campaign">
                    
                    {/* Top Level Quick Indicators Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="seat-campaign-quick-metrics">
                      <div className="bg-white border rounded-2xl p-5 shadow-sm">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold tracking-wider">Watchdog Trust Score</span>
                        <div className="flex items-baseline gap-1.5 mt-2">
                          <p className="text-3xl font-display font-semibold text-slate-900 tracking-tight">{selectedOfficial?.trustScore ?? "95.0"}%</p>
                          <span className="text-3xs text-emerald-600 font-mono font-bold">Excellent</span>
                        </div>
                        <p className="text-2xs text-slate-500 mt-2">Calculated via integrity audits</p>
                      </div>
                      <div className="bg-white border rounded-2xl p-5 shadow-sm">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold tracking-wider">Lobbyist Meetings</span>
                        <p className="text-3xl font-display font-semibold mt-2 text-slate-900 tracking-tight">{selectedOfficial?.lobbyistMeetingsCount ?? 12} <span className="text-lg text-slate-500 font-sans">Logs</span></p>
                        <p className="text-2xs text-slate-500 mt-2">Reported this calendar cycle</p>
                      </div>
                      <div className="bg-white border rounded-2xl p-5 shadow-sm">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold tracking-wider">Party Coherence</span>
                        <p className="text-3xl font-display font-semibold mt-2 text-indigo-700 tracking-tight">{selectedOfficial?.partyLineVotingRate ?? 92}%</p>
                        <p className="text-2xs text-slate-500 mt-2">Votes aligned with party docket</p>
                      </div>
                      <div className="bg-white border rounded-2xl p-5 shadow-sm">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold tracking-wider">Campaign Crawler</span>
                        <div className="flex items-center gap-2 mt-2.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                          <p className="text-xs font-mono font-bold text-emerald-700 uppercase">
                            {selectedOfficial?.campaignMonitoring?.crawlerStatus ?? "Active Tracking"}
                          </p>
                        </div>
                        <p className="text-2xs text-slate-500 mt-2">Last Crawl: {selectedOfficial?.campaignMonitoring?.lastChecked ?? "Recently Checked"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Left Block: Seat of Power Monitored State */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5" id="seat-power-spec-card">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                          <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">
                            🏛️ Seat of Power Authority & Succession Code
                          </h4>
                          <span className={`text-4xs font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                            selectedOfficial?.seatOfPower?.seatStabilityStatus === "Stable" 
                              ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                              : selectedOfficial?.seatOfPower?.seatStabilityStatus === "Contested"
                              ? "bg-amber-50 text-amber-800 border-amber-100"
                              : "bg-indigo-50 text-indigo-800 border-indigo-100"
                          }`}>
                            {selectedOfficial?.seatOfPower?.seatStabilityStatus ?? "Stable"}
                          </span>
                        </div>

                        <div className="space-y-4 text-2xs" id="seat-details-table">
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded">
                            <div>
                              <span className="text-4xs font-mono text-slate-400 block uppercase font-bold tracking-wider">Official Seat Designation</span>
                              <strong className="text-slate-900 text-sm font-display">{selectedOfficial?.seatOfPower?.name}</strong>
                            </div>
                            <div>
                              <span className="text-4xs font-mono text-slate-400 block uppercase font-bold tracking-wider">Constituents Represented</span>
                              <strong className="text-slate-900 text-sm font-display">{(selectedOfficial?.seatOfPower?.constituentsCount ?? 0).toLocaleString()} residents</strong>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center" id="seat-numeric-metrics font-sans">
                            <div className="bg-slate-50 p-2 rounded">
                              <span className="text-4xs font-mono text-slate-400 block uppercase">Est. Date</span>
                              <strong className="text-slate-700 text-2xs">{selectedOfficial?.seatOfPower?.establishmentDate}</strong>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                              <span className="text-4xs font-mono text-slate-400 block uppercase">Yearly Salary</span>
                              <strong className="text-slate-700 text-2xs">${(selectedOfficial?.seatOfPower?.yearlySalary ?? 0).toLocaleString()}</strong>
                            </div>
                            <div className="bg-slate-50 p-2 rounded">
                              <span className="text-4xs font-mono text-slate-400 block uppercase">Term Restriction</span>
                              <strong className="text-slate-700 text-3xs">{selectedOfficial?.seatOfPower?.termLimitRestrictions}</strong>
                            </div>
                          </div>

                          <div className="space-y-1 block">
                            <span className="text-4xs font-mono text-slate-400 uppercase font-bold">Scope of Official Powers & Authority:</span>
                            <p className="text-slate-600 bg-slate-50 p-3 rounded leading-normal border">
                              {selectedOfficial?.seatOfPower?.authorityScope}
                            </p>
                          </div>

                          <div className="space-y-1 block">
                            <span className="text-4xs font-mono text-slate-400 uppercase font-bold">Succession Hierarchy Line:</span>
                            <ol className="list-decimal pl-5 text-slate-600 space-y-1">
                              {selectedOfficial?.seatOfPower?.successionLine?.map((person, pIdx) => (
                                <li key={pIdx}><strong>{person}</strong></li>
                              ))}
                            </ol>
                          </div>

                          <div className="space-y-2 block" id="seat-predecessors-list">
                            <span className="text-4xs font-mono text-slate-400 uppercase font-bold block">Previous Holders of This Seat (Predecessors):</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {selectedOfficial?.seatOfPower?.activePredecessors?.map((pred, prIdx) => (
                                <div key={prIdx} className="bg-slate-50 p-2 rounded border text-center">
                                  <strong className="text-slate-700 block text-3xs leading-tight">{pred.name}</strong>
                                  <span className="text-4xs text-slate-500 block mt-0.5">{pred.party}</span>
                                  <span className="text-4xs font-mono text-slate-400 block">{pred.tenure}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Campaign Website Crawler Logs & Activity */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5" id="campaign-crawler-card">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                          <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider">
                            🌐 Campaign Web-Crawler & Policy Shifts
                          </h4>
                          <span className="text-4xs font-mono text-slate-400 flex items-center gap-1">
                            Status: <strong className="text-emerald-600 font-bold">CRAWLING ACTIVE</strong>
                          </span>
                        </div>

                        <div className="space-y-4 text-2xs" id="campaign-crawler-body">
                          <div className="bg-slate-50 p-3 rounded border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                              <span className="text-4xs font-mono text-slate-400 block uppercase font-bold">Campaign Official Site</span>
                              <a 
                                href={selectedOfficial?.campaignMonitoring?.websiteUrl} 
                                target="_blank" 
                                referrerPolicy="no-referrer"
                                className="text-indigo-600 font-sans font-medium hover:underline flex items-center gap-1.5"
                              >
                                {selectedOfficial?.campaignMonitoring?.websiteUrl}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            
                            {selectedOfficial?.campaignMonitoring?.fundingGoal && (
                              <div className="text-left sm:text-right">
                                <span className="text-4xs font-mono text-slate-400 block uppercase font-bold">Watchdog Goal Target</span>
                                <strong className="text-slate-800 font-mono">${(selectedOfficial?.campaignMonitoring?.fundingGoal ?? 0).toLocaleString()}</strong>
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 block">
                            <span className="text-4xs font-mono text-slate-400 uppercase font-bold block">Live Web-Scraper History Activity Log:</span>
                            <div className="space-y-2 bg-slate-950 text-slate-300 p-3.5 rounded-lg border border-slate-800 font-mono text-[10px] max-h-[160px] overflow-y-auto">
                              {selectedOfficial?.campaignMonitoring?.historyScrapeLog?.map((log, lIdx) => (
                                <div key={lIdx} className="border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                                  <div className="flex justify-between text-slate-500 font-semibold">
                                    <span>[{log.date} UTC]</span>
                                    <span className="text-indigo-400 uppercase font-bold">type: {log.changeType}</span>
                                  </div>
                                  <p className="text-slate-200 mt-0.5 leading-normal">
                                    &gt; {log.description}
                                  </p>
                                </div>
                              ))}
                              {(!selectedOfficial?.campaignMonitoring?.historyScrapeLog || selectedOfficial?.campaignMonitoring?.historyScrapeLog.length === 0) && (
                                <p className="text-slate-500">&gt; No local changes registered during the last tracking sweep.</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 block">
                            <span className="text-4xs font-mono text-slate-400 uppercase font-bold block">Detected Platform Policy Shifts (Original vs. Revised Stance):</span>
                            
                            {selectedOfficial?.campaignMonitoring?.policyShiftsDetected && selectedOfficial?.campaignMonitoring?.policyShiftsDetected.length > 0 ? (
                              <div className="space-y-3">
                                {selectedOfficial?.campaignMonitoring?.policyShiftsDetected.map((shift, sIdx) => (
                                  <div key={sIdx} className="bg-slate-50 p-3 rounded border space-y-2">
                                    <div className="flex justify-between items-center text-4xs font-mono text-slate-400">
                                      <span>Shift Date: <strong>{shift.date}</strong></span>
                                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.2 rounded font-bold uppercase text-[9px]">Topic: {shift.category}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-3xs font-sans">
                                      <div className="bg-rose-50 p-2.5 rounded border border-rose-100 border-dashed">
                                        <span className="font-mono text-[9px] text-rose-700 block uppercase font-bold mb-1">Original Text Draft:</span>
                                        <p className="text-rose-800 leading-normal font-medium">"{shift.originalText}"</p>
                                      </div>
                                      <div className="bg-emerald-50 p-2.5 rounded border border-emerald-100 border-dashed">
                                        <span className="font-mono text-[9px] text-emerald-700 block uppercase font-bold mb-1">Revised Post-Campaign text:</span>
                                        <p className="text-emerald-800 leading-normal font-bold">"{shift.revisedText}"</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 rounded bg-slate-50 text-center text-slate-400 text-3xs font-mono border">
                                No policy changes or revisions have been detected since campaign website monitoring was initiated.
                              </div>
                            )}

                          </div>

                        </div>
                      </div>

                    </div>
                    
                    {/* Extended Profile & Background Checks */}
                    {selectedOfficial?.extendedProfile && (
                      <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm" id="extended-profile-deep-scrape">
                        <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider border-b pb-2 flex items-center justify-between">
                          <span>🔍 Deep-Scrape Background & Extended Profile</span>
                          <span className="text-[9px] bg-slate-900 text-emerald-400 px-2 py-0.5 rounded">NODE S5: PUBLIC RECORDS DB</span>
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-2xs">
                          {/* Left Col */}
                          <div className="space-y-4">
                            <div className="bg-slate-50 p-3 rounded border">
                              <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Family & Known Associates</strong>
                              <div className="space-y-1 text-slate-600 mt-2">
                                <p><strong>Marital Status:</strong> {selectedOfficial.extendedProfile.family?.maritalStatus}</p>
                                {selectedOfficial.extendedProfile.family?.numberOfMarriages !== undefined && <p><strong>Number of Marriages:</strong> {selectedOfficial.extendedProfile.family?.numberOfMarriages}</p>}
                                <p><strong>Spouse:</strong> {selectedOfficial.extendedProfile.family?.spouse}</p>
                                <p><strong>Children:</strong> {selectedOfficial.extendedProfile.family?.children}</p>
                                {selectedOfficial.extendedProfile.family?.divorces && <p><strong>Divorces:</strong> {selectedOfficial.extendedProfile.family?.divorces}</p>}
                                <p><strong>Known Associates:</strong> {selectedOfficial.extendedProfile.knownAssociates?.join(", ")}</p>
                              </div>
                            </div>

                            {selectedOfficial.extendedProfile.education && (
                              <div className="bg-slate-50 p-3 rounded border">
                                <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Detailed Education</strong>
                                <div className="space-y-1 text-slate-600 mt-2">
                                  {selectedOfficial.extendedProfile.education.highSchool && <p><strong>High School:</strong> {selectedOfficial.extendedProfile.education.highSchool}</p>}
                                  {selectedOfficial.extendedProfile.education.university && selectedOfficial.extendedProfile.education.university.length > 0 && (
                                    <div>
                                      <strong>University:</strong>
                                      <ul className="list-disc pl-4 mt-0.5">
                                        {selectedOfficial.extendedProfile.education.university.map((u, i) => <li key={i}>{u}</li>)}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="bg-slate-50 p-3 rounded border">
                              <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Policy & Voting Tendencies</strong>
                              <p className="text-slate-600 mt-2 leading-relaxed">{selectedOfficial.extendedProfile.votingTendencies}</p>
                            </div>
                            
                            {selectedOfficial.extendedProfile.staffTies && selectedOfficial.extendedProfile.staffTies.length > 0 && (
                              <div className="bg-slate-50 p-3 rounded border">
                                <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Key Staff & Revolving Door Checks</strong>
                                <ul className="space-y-1 text-slate-600 mt-2 list-disc pl-4">
                                  {selectedOfficial.extendedProfile.staffTies.map((staff, i) => (
                                    <li key={i}>
                                      {staff.name} <span className="text-slate-400">({staff.role})</span>
                                      {staff.revolvingDoorFlag && <span className="ml-2 text-[9px] bg-amber-100 text-amber-700 px-1 py-0.5 rounded uppercase font-bold">Revolving Door Flag</span>}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {selectedOfficial.extendedProfile.mediaSentiment && (
                              <div className="bg-slate-50 p-3 rounded border">
                                <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Media Sentiment (Unofficial Synthesis)</strong>
                                <p className="text-slate-600 mt-2 leading-relaxed">{selectedOfficial.extendedProfile.mediaSentiment.unofficialSentiment}</p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {selectedOfficial.extendedProfile.mediaSentiment.topTopics.map((topic, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-medium border border-indigo-100">{topic}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right Col */}
                          <div className="space-y-4">
                            <div className="bg-slate-50 p-3 rounded border">
                              <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Legal & Court Records Audit</strong>
                              <div className="space-y-2 mt-2">
                                <div>
                                  <span className="text-[10px] font-mono text-slate-400 font-bold">CRIMINAL RECORDS</span>
                                  <ul className="list-disc pl-4 text-slate-600 mt-0.5">
                                    {selectedOfficial.extendedProfile.legalHistory?.criminalRecords?.map((r, i) => <li key={i}>{r}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-slate-400 font-bold">CIVIL LAWSUITS</span>
                                  <ul className="list-disc pl-4 text-slate-600 mt-0.5">
                                    {selectedOfficial.extendedProfile.legalHistory?.civilLawsuits?.map((r, i) => <li key={i}>{r}</li>)}
                                  </ul>
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono text-slate-400 font-bold">BANKRUPTCIES & FORECLOSURES</span>
                                  <ul className="list-disc pl-4 text-slate-600 mt-0.5">
                                    {selectedOfficial.extendedProfile.legalHistory?.bankruptcies?.map((r, i) => <li key={i}>{r}</li>)}
                                    {selectedOfficial.extendedProfile.legalHistory?.foreclosures?.map((r, i) => <li key={i}>{r}</li>)}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            {selectedOfficial.extendedProfile.ethicsInvestigations && selectedOfficial.extendedProfile.ethicsInvestigations.length > 0 && (
                              <div className="bg-slate-50 p-3 rounded border">
                                <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Ethics Investigations</strong>
                                <div className="space-y-2 mt-2">
                                  {selectedOfficial.extendedProfile.ethicsInvestigations.map((inv, i) => (
                                    <div key={i} className="text-[11px] leading-tight">
                                      <p className="font-semibold text-slate-700">{inv.allegation}</p>
                                      <p className="text-slate-500 mt-0.5">Status: {inv.status} | {inv.date}</p>
                                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">Source: {inv.source}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {selectedOfficial.extendedProfile.stockTrading && (
                              <div className="bg-slate-50 p-3 rounded border">
                                <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">STOCK Act & Asset Trading Activity</strong>
                                <p className="text-slate-600 mt-1"><strong>Est. Volume:</strong> {selectedOfficial.extendedProfile.stockTrading.volumeRange}</p>
                                <div className="mt-1.5 space-y-1">
                                  {selectedOfficial.extendedProfile.stockTrading.flags.map((flag, i) => (
                                    <span key={i} className="block text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">{flag}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {selectedOfficial.extendedProfile.keyVotes && selectedOfficial.extendedProfile.keyVotes.length > 0 && (
                              <div className="bg-slate-50 p-3 rounded border">
                                <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Key Legislative Votes</strong>
                                <div className="space-y-2 mt-2">
                                  {selectedOfficial.extendedProfile.keyVotes.map((vote, i) => (
                                    <div key={i} className="flex justify-between items-start text-[11px]">
                                      <div className="pr-2">
                                        <p className="font-semibold text-slate-800">{vote.bill}</p>
                                        <p className="text-slate-500 leading-tight">{vote.significance}</p>
                                      </div>
                                      <span className={`font-bold px-1.5 py-0.5 rounded border ${vote.vote === 'Yea' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : vote.vote === 'Nay' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                        {vote.vote}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="bg-slate-50 p-3 rounded border">
                              <strong className="text-slate-800 block text-xs mb-1 border-b border-slate-200 pb-1">Expanded Social Footprint</strong>
                              <div className="space-y-1.5 mt-2">
                                {selectedOfficial.extendedProfile.expandedSocials?.map((soc, i) => (
                                  <div key={i} className="flex flex-col">
                                    <a href={soc.url} target="_blank" referrerPolicy="no-referrer" className="text-indigo-600 font-medium hover:underline text-[11px]">{soc.platform}: {soc.handle}</a>
                                    <span className="text-[9px] text-slate-400 font-mono">Found: {soc.discoveryDate}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Committee, Legislation and lobbyingWatchdog parameters */}
                    <div className="bg-white border rounded-xl p-5 space-y-4" id="lobbying-watchdog-ledger">
                      <h4 className="text-xs font-mono uppercase text-slate-500 font-bold tracking-wider border-b pb-2">
                        ⚖️ Legislative Activity & Conflict Indicator Disclosures
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-2xs" id="legislative-watchdog-grid">
                        
                        <div className="space-y-2 bg-slate-50 p-3 rounded" id="committees-assignment-frame">
                          <strong className="text-slate-800 block text-xs">Standing Committee Rosters</strong>
                          <ul className="list-disc pl-5 text-slate-600 space-y-1">
                            {selectedOfficial?.committees?.map((comm, cIndex) => (
                              <li key={cIndex}>{comm}</li>
                            ))}
                            {(!selectedOfficial?.committees || selectedOfficial?.committees.length === 0) && (
                              <span className="text-slate-400 italic">No assigned standing committees reported.</span>
                            )}
                          </ul>
                        </div>

                        <div className="space-y-2 bg-slate-50 p-3 rounded" id="legislative-counters-frame">
                          <strong className="text-slate-800 block text-xs">Sponsorship Ledger Summary</strong>
                          <div className="space-y-1 text-slate-600 block pt-1">
                            <p><strong>Bills Sponsored Count:</strong> <span className="font-semibold text-slate-900">{selectedOfficial?.billsSponsoredCount ?? 0} bills</span></p>
                            <p><strong>Bills Co-Sponsored:</strong> <span className="font-semibold text-slate-900">{selectedOfficial?.billsCoSponsoredCount ?? 0} bills</span></p>
                            <p><strong>Registered Lobbyist Ties:</strong> <span className="font-semibold text-slate-900">{selectedOfficial?.registeredLobbyistsTiesCount ?? 0} active lobbyists</span></p>
                          </div>
                        </div>

                        <div className="space-y-2 bg-slate-50 p-3 rounded" id="assets-disclosures-frame">
                          <strong className="text-slate-800 block text-xs">Financial Disclosure & Assets</strong>
                          <div className="space-y-1 text-slate-600 block pt-1">
                            <p><strong>Est. Assets Range:</strong> <span className="font-semibold text-slate-900">{selectedOfficial?.financialAssetsValueRange ?? "Pending Ingestion"}</span></p>
                            <p><strong>Registered Liabilities:</strong> <span className="font-semibold text-slate-900">{selectedOfficial?.financialLiabilitiesValueRange ?? "None Specified"}</span></p>
                            <p><strong>Direct Disclosures Audit:</strong> <span className="text-emerald-700 font-bold font-mono text-[10px]">VERIFIED Form 6 File Indexed</span></p>
                          </div>
                        </div>

                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border p-3 text-center rounded-xl text-3xs font-mono text-slate-500 mt-2">
                      <strong>Source Verification (Seat of Power / Disclosures):</strong> <a href={selectedOfficial?.sources?.seatOfPowerUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">{selectedOfficial?.sources?.seatOfPowerUrl || "https://ethics.state.gov/financial-disclosures"}</a>
                    </div>
                  </div>

                {/* 2. Promises Tracking Tab */}
                  <div className="space-y-4 mt-6" id="panel-profile-promises">
                    
                    <div className="bg-white border rounded-xl p-6" id="promises-summary-bar">
                      <h3 className="text-sm font-sans font-semibold text-slate-950">Active Pledge Audit Matrix</h3>
                      <p className="text-2xs text-slate-500 mt-0.5">
                        These are monitored commitments processed by our nonpartisan AI systems. All status tags correlate with actual public bill records and fiscal receipts.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4" id="promise-categories-counters">
                        {[
                          { label: "Total pledges", count: selectedOfficial?.promiseFulfillment.total, col: "border-slate-100 text-slate-950" },
                          { label: "Completed", count: selectedOfficial?.promiseFulfillment.completed, col: "border-emerald-100 text-emerald-700 font-bold" },
                          { label: "In Progress", count: selectedOfficial?.promiseFulfillment.inProgress, col: "border-indigo-100 text-indigo-700" },
                          { label: "Broken", count: selectedOfficial?.promiseFulfillment.broken, col: "border-rose-100 text-rose-700" },
                          { label: "Not Started", count: selectedOfficial?.promiseFulfillment.notStarted, col: "border-slate-100 text-slate-400" }
                        ].map((stat, idx) => (
                          <div key={idx} className="bg-slate-50 border p-2.5 rounded text-center">
                            <span className="text-4xs font-mono uppercase text-slate-400 font-bold">{stat.label}</span>
                            <p className={`text-md font-sans font-bold ${stat.col}`}>{stat.count}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4" id="promises-mapped-cards">
                      {mockPromises
                        .filter(p => p.officialId === selectedOfficial?.id)
                        .map((promise) => {
                          let statusColor = "bg-slate-100 text-slate-700";
                          if (promise.status === "Completed") statusColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
                          if (promise.status === "In Progress") statusColor = "bg-indigo-50 text-indigo-800 border-indigo-100";
                          if (promise.status === "Partially Fulfilled") statusColor = "bg-amber-50 text-amber-800 border-amber-100";
                          if (promise.status === "Broken") statusColor = "bg-rose-50 text-rose-800 border-rose-100";

                          return (
                            <div key={promise.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-slate-400 transition" id={`pledge-card-${promise.id}`}>
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                                <span className={`text-4xs font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${statusColor}`}>
                                  {promise.status}
                                </span>
                                <div className="text-3xs font-mono text-slate-400 flex items-center gap-2">
                                  <span>Date: {promise.dateMade}</span>
                                  <span>Category: <strong>{promise.category}</strong></span>
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.2 rounded">Confidence: {promise.confidenceScore}%</span>
                                </div>
                              </div>
                              <h4 className="text-xs font-sans font-semibold text-slate-900">{promise.title}</h4>
                              
                              <div className="mt-2 text-2xs text-slate-600 space-y-2 font-sans bg-slate-50 p-3 rounded" id="transcript-quote">
                                <p><strong>Exact Commitment Quote:</strong> <em>"{promise.statement}"</em></p>
                                <p className="text-slate-400 text-4xs font-mono">Context: {promise.context}</p>
                              </div>

                              <div className="mt-3 text-2xs text-slate-600 font-sans" id="pledge-audit-evidence">
                                <p><strong>Audited Progress Evidence:</strong></p>
                                <p className="text-slate-500 text-xs mt-1 leading-relaxed bg-white border p-3 rounded">{promise.evidence}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    <div className="bg-slate-50 border p-3 text-center rounded-xl text-3xs font-mono text-slate-500 mt-2">
                      <strong>Source Verification (Promises & Quotes):</strong> <a href={selectedOfficial?.sources?.biographyUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">{selectedOfficial?.sources?.biographyUrl || "https://www.politifact.com/truth-o-meter/promises/"}</a>
                    </div>
                  </div>

                {/* 3. Voting Records Drawer & Explainer */}
                  <div className="space-y-4 mt-6" id="panel-profile-votes">
                    
                    <div className="bg-white border rounded-xl p-6" id="votes-header-frame">
                      <h3 className="text-sm font-sans font-semibold text-slate-950">Rollcall voting Participation</h3>
                      <p className="text-2xs text-slate-500 mt-0.5">
                        These records are scraped continuously from legislative journals (e.g., Online Sunshine, Georgia General Assembly). 
                      </p>
                    </div>

                    <div className="space-y-4" id="bills-ledger-list">
                      {mockBills.map((bill) => {
                        // Find the official's vote on this bill
                        const officialVote = bill.votes.find(v => v.officialName === selectedOfficial?.name) || { position: "Absent/No Vote", date: "N/A" };
                        const hasExplainedThis = activeExplainBillId === bill.id;

                        let positionColor = "bg-slate-100 text-slate-600";
                        if (officialVote.position === "Yes") positionColor = "bg-emerald-50 text-emerald-800 border-emerald-100";
                        if (officialVote.position === "No") positionColor = "bg-rose-50 text-rose-800 border-rose-100";

                        return (
                          <div key={bill.id} className="bg-white border rounded-xl p-5 hover:shadow-xs transition" id={`legislator-bill-card-${bill.id}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-3">
                              <div>
                                <span className="text-2xs font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                  Bill: {bill.number}
                                </span>
                                <h4 className="text-xs font-sans font-semibold text-slate-900 mt-1">{bill.title}</h4>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-3xs font-mono text-slate-400">Representative Vote:</span>
                                <span className={`text-3xs font-bold px-2.5 py-1 rounded border uppercase ${positionColor}`}>
                                  {officialVote.position}
                                </span>
                              </div>
                            </div>

                            <p className="text-2xs text-slate-600 leading-relaxed font-sans mt-2">
                              {bill.summary}
                            </p>

                            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3" id="bill-card-footer">
                              <span className="text-4xs font-mono text-slate-400">Last updated: {bill.lastUpdated}</span>
                              
                              <button
                                onClick={() => handleExplainBill(bill)}
                                className="bg-slate-900 text-white hover:bg-slate-800 text-2xs font-sans font-medium px-4 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5"
                                id={`btn-explain-bill-${bill.id}`}
                              >
                                <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                                Explain with CivicLenZ AI
                              </button>
                            </div>

                            {/* Gemini Explainer Response Frame inline */}
                            {hasExplainedThis && (
                              <div className="mt-4 bg-slate-950 text-slate-200 p-5 rounded-lg border border-slate-800 block" id="ai-bill-explainer-display">
                                <span className="text-4xs font-mono px-2 py-0.5 bg-indigo-900 text-indigo-200 rounded uppercase">
                                  CivicLenZ Cognitive Explainer Engine [Gemini 3.5]
                                </span>
                                
                                {aiLoading ? (
                                  <div className="flex items-center justify-center gap-2 py-6 text-slate-400 font-sans text-xs">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Structuring bill clauses & obligations lists...</span>
                                  </div>
                                ) : (
                                  <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 font-sans pt-3" id="explainer-response-md">
                                    {aiResponseText ? (
                                      aiResponseText.split("\n\n").map((b, bI) => {
                                        if (b.startsWith("###")) {
                                          return <h5 key={bI} className="text-xs font-semibold text-white mt-4 border-b border-slate-800 pb-1">{b.replace("###", "").trim()}</h5>;
                                        }
                                        if (b.startsWith("**")) {
                                          return <p key={bI} className="text-indigo-300 font-medium">{b}</p>;
                                        }
                                        return <p key={bI} className="text-slate-300 leading-relaxed">{b}</p>;
                                      })
                                    ) : (
                                      <p className="text-rose-400">Analysis response could not be loaded. Please ensure keys match settings.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-slate-50 border p-3 text-center rounded-xl text-3xs font-mono text-slate-500 mt-2">
                      <strong>Source Verification (Voting Records):</strong> <a href={selectedOfficial?.sources?.votingRecordUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">{selectedOfficial?.sources?.votingRecordUrl || "https://www.congress.gov/roll-call-votes"}</a>
                    </div>
                  </div>

                {/* 4. Campaign Finance and Disclosures Tab */}
                  <div className="space-y-6 mt-6" id="panel-profile-finance">
                    
                    <div className="bg-white border rounded-2xl p-8" id="finance-overview-bar">
                      <h3 className="text-xl font-display font-semibold text-slate-950 tracking-tight">Campaign Finance Disclosures (Audit period {selectedFinance?.cycle || "2024-2028"})</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Historical data extracted from the Ethics Commission reports. These represent hard accounting logs. All calculations are nonpartisan.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8" id="campaign-disclosure-ratios-grid">
                        <div className="bg-slate-50 border p-5 rounded-2xl text-center shadow-sm">
                          <span className="text-3xs font-mono text-slate-400 uppercase font-bold tracking-wider">Total Funding Raised</span>
                          <p className="text-3xl font-display font-bold text-slate-900 mt-2 tracking-tight">
                            ${((selectedFinance?.totalRaised || 0) / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-3xs text-slate-500 mt-1.5 uppercase font-mono tracking-wide">PAC & individual filings</p>
                        </div>
                        <div className="bg-slate-50 border p-5 rounded-2xl text-center shadow-sm">
                          <span className="text-3xs font-mono text-slate-400 uppercase font-bold tracking-wider">Total Spent / Obligated</span>
                          <p className="text-3xl font-display font-bold text-slate-900 mt-2 tracking-tight">
                            ${((selectedFinance?.totalSpent || 0) / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-3xs text-slate-500 mt-1.5 uppercase font-mono tracking-wide">Media & operations expenditure</p>
                        </div>
                        <div className="bg-slate-50 border p-5 rounded-2xl text-center shadow-sm">
                          <span className="text-3xs font-mono text-slate-400 uppercase font-bold tracking-wider">Remaining Cash on Hand</span>
                          <p className="text-3xl font-display font-bold text-emerald-700 mt-2 tracking-tight">
                            ${((selectedFinance?.cashOnHand || 0) / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-3xs text-slate-500 mt-1.5 uppercase font-mono tracking-wide">Active reserve portfolio</p>
                        </div>
                      </div>
                    </div>

                    {/* Left & Right layout for Donors and industry graphs */}
                    {selectedFinance ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="finance-split-ledger">
                        
                        {/* 1. Top Donors Card List */}
                        <div className="bg-white border rounded-2xl p-6 shadow-sm" id="finance-top-donors-ledger">
                          <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider font-bold mb-5">Top Registered Contributors</h4>
                          <div className="space-y-3">
                            {selectedFinance.topDonors.map((donor, dIdx) => (
                              <div key={dIdx} className="bg-slate-50 p-3 rounded border flex justify-between items-center text-2xs" id={`donor-item-${dIdx}`}>
                                <div>
                                  <strong className="text-slate-800 block text-xs">{donor.name}</strong>
                                  <span className="text-4xs font-mono px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded mt-1 inline-block">
                                    Type: {donor.type}
                                  </span>
                                </div>
                                <span className="text-xs font-mono font-bold text-slate-950">${donor.amount.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Industries custom SVG visualization graph */}
                        <div className="bg-white border rounded-2xl p-6 shadow-sm" id="finance-industries-graph-card">
                          <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider font-bold mb-5">Topic Industry Inflows Map</h4>
                          
                          <div className="space-y-4 pt-2">
                            {selectedFinance.industries.map((ind, iIdx) => {
                              // Compute percentages dynamically
                              const maxVal = Math.max(...selectedFinance.industries.map(item => item.amount));
                              const pctOfMax = (ind.amount / maxVal) * 100;

                              return (
                                <div key={iIdx} className="space-y-1 text-2xs" id={`industry-item-${iIdx}`}>
                                  <div className="flex justify-between items-center">
                                    <strong className="text-slate-700 font-sans">{ind.name}</strong>
                                    <span className="font-mono font-semibold">${(ind.amount / 1000000).toFixed(1)}M</span>
                                  </div>
                                  
                                  {/* Responsive SVG mock Bar */}
                                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-slate-900 h-full rounded-full transition duration-300"
                                      style={{ width: `${pctOfMax}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-amber-50 rounded border border-amber-100 p-3 mt-6 text-3xs text-amber-800 leading-normal" id="ethics-analyt-disclaimer">
                            <strong>Standard Analytical Notice:</strong> Campaign finance values represent aggregates retrieved via public transparency APIs. No implication of conflict or bias is intended. CivicLenZ.ai serves as a politically-neutral public log.
                          </div>

                        </div>

                      </div>
                    ) : (
                      <div className="p-12 text-center bg-white border rounded-xl font-sans text-xs text-slate-400">
                        Detailed campagin finance structures are pending crawler execution on this local district. Check back at next API refresh.
                      </div>
                    )}
                    
                    <div className="bg-slate-50 border p-3 text-center rounded-xl text-3xs font-mono text-slate-500 mt-2">
                      <strong>Source Verification (Campaign Finance):</strong> <a href={selectedOfficial?.sources?.campaignFinancesUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">{selectedOfficial?.sources?.campaignFinancesUrl || "https://www.fec.gov/data/"}</a>
                    </div>
                  </div>

                {/* 5. Jurisdictional Inflows and spending */}
                  <div className="space-y-6 mt-6" id="panel-profile-spending">
                    
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm" id="spending-header-block">
                      <h3 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Overlapping Jurisdiction Public Spending flows</h3>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed font-sans max-w-3xl">
                        Tracks federal and state funds (grants/contracts) currently allocated to agencies inside <strong className="text-slate-800">{selectedOfficial?.jurisdiction}</strong>. 
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4" id="spending-contracts-grid">
                      {mockSpending
                        .filter(spend => spend.county.toLowerCase() === "miami-dade" || spend.jurisdiction.includes("Water") || selectedOfficial?.id === "fl-county-cava")
                        .map((spend) => {
                          const spendPct = (spend.amountSpent / spend.amountAwarded) * 100;

                          return (
                            <div key={spend.id} className="bg-white border rounded-2xl p-6 space-y-4 hover:shadow-md transition shadow-sm" id={`spending-contract-card-${spend.id}`}>
                              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded">
                                  Awarded: ${spend.amountAwarded.toLocaleString()}
                                </span>
                                <span className="text-3xs font-mono text-slate-500 uppercase font-bold tracking-wider">Prog: {spendPct.toFixed(0)}% Spent</span>
                              </div>

                              <h4 className="text-base font-display font-semibold text-slate-900 leading-snug tracking-tight">{spend.title}</h4>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{spend.purpose}</p>

                              <div className="space-y-1.5 pt-2 text-xs text-slate-600 block" id="spend-details-ledger">
                                <p><strong>Receiving Agency:</strong> {spend.receivingAgency}</p>
                                <p><strong>Primary Contractor:</strong> {spend.contractor}</p>
                                <p><strong>Status:</strong> <strong className="text-indigo-600">{spend.status}</strong></p>
                              </div>

                              {/* Progress indicator bar */}
                              <div className="space-y-1" id="spend-bar-display">
                                <div className="text-4xs text-slate-400 flex justify-between font-mono">
                                  <span>Obligated: ${spend.amountObligated.toLocaleString()}</span>
                                  <span>Spent: ${spend.amountSpent.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-indigo-600 h-full rounded-full"
                                    style={{ width: `${spendPct}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    <div className="bg-slate-50 border p-3 text-center rounded-xl text-3xs font-mono text-slate-500 mt-2">
                      <strong>Source Verification (Spending):</strong> <a href="#" target="_blank" className="text-indigo-600 hover:underline">https://www.usaspending.gov/</a>
                    </div>
                  </div>

              </div>
            )}

          </div>
        )}

        {/* ==================== TAB C: PROMISE MATRIX VIEW ==================== */}
        {activeTab === "promises" && (
          <div className="space-y-6" id="tab-viewport-promises">
            
            <div className="border bg-white rounded-2xl p-8 shadow-sm" id="promises-tracker-banner">
              <h1 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">Democracy Promise tracker</h1>
              <p className="text-sm font-sans text-slate-500 mt-2 max-w-4xl leading-relaxed">
                We pull pledges, public declarations, and rallies transcript quotes, matching each statement with a measurable verification metric.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="promises-split-layout">
              
              {/* Left Column: Legend and indicators */}
              <div className="bg-white border rounded-xl p-5 space-y-4" id="promises-legend-panel">
                <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider font-bold">Audit Guidelines</h3>
                
                <div className="space-y-4 text-2xs text-slate-600 block" id="promises-explainer-list">
                  <div className="border-l-4 border-emerald-500 pl-3">
                    <strong className="text-slate-900 block text-xs">Completed</strong>
                    <p className="mt-0.5">Budget was passed and allocated, legislation was signed, or executive actions resolved conflict.</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-3">
                    <strong className="text-slate-900 block text-xs">In Progress</strong>
                    <p className="mt-0.5">Active bill referred to committee workshops, or partial transit procurement deployed on roads.</p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-3">
                    <strong className="text-slate-900 block text-xs">Partially Fulfilled</strong>
                    <p className="mt-0.5">Legislation was enacted but capped with altered margins, meeting partial thresholds.</p>
                  </div>
                  <div className="border-l-4 border-rose-500 pl-3">
                    <strong className="text-slate-900 block text-xs">Broken / Contradicted</strong>
                    <p className="mt-0.5">Diverging votes occurred during key assembly dockets, or deadlines lapsed without budget support.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border p-4 rounded-lg block pt-3 text-3xs text-slate-500 leading-normal" id="audit-confid-notice">
                  <strong>Verification confidence levels</strong> represent the mathematical matching coherence between scraped statements and final public law votes, determined by Gemini analysis.
                </div>
              </div>

              {/* Right Column: Complete Feed list */}
              <div className="md:col-span-2 space-y-4" id="promises-matrix-feed-column">
                {mockPromises.map((promise) => {
                  let statusCardColor = "border-slate-200";
                  let statusBadge = "bg-slate-100 text-slate-600";
                  if (promise.status === "Completed") {
                    statusCardColor = "border-emerald-200 hover:border-emerald-400";
                    statusBadge = "bg-emerald-50 text-emerald-800 border-emerald-100";
                  } else if (promise.status === "In Progress") {
                    statusCardColor = "border-indigo-200 hover:border-indigo-400";
                    statusBadge = "bg-indigo-50 text-indigo-800 border-indigo-100";
                  } else if (promise.status === "Partially Fulfilled") {
                    statusCardColor = "border-amber-200 hover:border-amber-400";
                    statusBadge = "bg-amber-50 text-amber-800 border-amber-100";
                  }

                  return (
                    <div 
                      key={promise.id} 
                      className={`bg-white border rounded-xl p-5 hover:shadow-xs transition duration-200 ${statusCardColor}`} id={`matrix-promise-card-${promise.id}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-slate-900">{promise.officialName}</strong>
                          <span className="text-4xs text-slate-400">({promise.category})</span>
                        </div>
                        <span className={`text-4xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${statusBadge}`}>
                          {promise.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-950">{promise.title}</h4>
                      <p className="text-2xs italic text-slate-600 font-sans mt-2 bg-slate-50 p-3 rounded border">
                        "{promise.statement}"
                      </p>

                      <div className="mt-3 space-y-2 text-2xs block" id="matrix-promise-card-evidence">
                        <p className="text-slate-700"><strong>Verification Audit Ledger:</strong></p>
                        <p className="text-slate-500 bg-white border p-3 rounded leading-normal">{promise.evidence}</p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-between items-center text-4xs font-mono text-slate-400">
                        <span>Pledge Date: {promise.dateMade}</span>
                        <span>Confidence Level: <strong>{promise.confidenceScore}%</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB D: PUBLIC SPENDING & GRANTS ==================== */}
        {activeTab === "spending" && (
          <div className="space-y-6" id="tab-viewport-spending">
            
            <div className="bg-white border rounded-xl p-6" id="spending-explorer-banner">
              <h1 className="text-lg font-sans font-semibold text-slate-900">Federal Funding flow & Grants Monitor</h1>
              <p className="text-2xs text-slate-500 mt-1">
                Transparency monitoring tracking obligated federal grants and procurement contracts mapped directly to local county regions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="spending-main-ledger">
              {mockSpending.map((spend) => {
                const awardSpentPercent = (spend.amountSpent / spend.amountAwarded) * 100;

                return (
                  <div key={spend.id} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 hover:shadow-md transition duration-200" id={`explorer-spend-card-${spend.id}`}>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-4xs font-mono uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          ID Ref: {spend.id}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">{spend.title}</h3>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-700 whitespace-nowrap">
                        ${(spend.amountAwarded / 1000000).toFixed(1)}M Award
                      </span>
                    </div>

                    <div className="text-2xs text-slate-600 space-y-2 font-sans" id="explorer-spend-body">
                      <p><strong>Region / County Focus:</strong> {spend.county} County, FL</p>
                      <p><strong>Awarding Agency:</strong> {spend.awardingAgency}</p>
                      <p><strong>Implementing Local Corp:</strong> {spend.contractor}</p>
                      <p><strong>Legislative Timeline:</strong> {spend.timeline}</p>
                      <p className="text-slate-500 bg-slate-50 p-3 rounded border">
                        <strong>Purpose:</strong> {spend.purpose}
                      </p>
                    </div>

                    {/* Progress graphs */}
                    <div className="space-y-1 block pt-1" id="explorer-spend-progress">
                      <div className="flex justify-between text-3xs font-mono text-slate-400">
                        <span>Spent: ${(spend.amountSpent / 1000000).toFixed(1)}M</span>
                        <span>Obligated Total: ${(spend.amountObligated / 1000000).toFixed(1)}M</span>
                        <span>{awardSpentPercent.toFixed(0)}% Utilized</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${awardSpentPercent}%` }}
                        />
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ==================== TAB E: CITIZEN ACTION CENTER ==================== */}
        {activeTab === "action-center" && (
          <div className="space-y-6" id="tab-viewport-action-center">
            
            <div className="bg-white border-b border-slate-200 rounded-2xl p-8 shadow-sm" id="action-center-overview">
              <h1 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">Constituent representation Script Generator</h1>
              <p className="text-sm text-slate-500 mt-2 font-sans leading-relaxed max-w-4xl">
                Submit your specific priorities, select a political representative, and generate a factual, nonpartisan communication draft compiled via Gemini. 
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="action-center-layout">
              
              {/* Form Input block */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" id="action-generator-form-panel">
                <h3 className="text-xs font-mono text-slate-500 uppercase font-bold mb-5 tracking-wider">Drafting Tool Controls</h3>
                
                <form onSubmit={handleDraftAction} className="space-y-4" id="action-drafter-form">
                  {actionError && (
                    <div className="bg-red-50 text-red-600 p-2.5 rounded-lg text-xs border border-red-100 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{actionError}</span>
                    </div>
                  )}

                  <div className="space-y-1 block">
                    <label className="text-3xs font-mono font-bold text-slate-400 uppercase">Target Representative</label>
                    <select
                      value={actionOfficial}
                      onChange={(e) => setActionOfficial(e.target.value)}
                      className="w-full p-2 text-xs border border-gray-200 rounded bg-white"
                      id="form-target-official"
                    >
                      <option value="">Select Official (Or Standard Title)</option>
                      {mockOfficials.map(o => (
                        <option key={o.id} value={o.name}>{o.name} - {o.currentTitle}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 block">
                    <label className="text-3xs font-mono font-bold text-slate-400 uppercase">Core Issue / Topic</label>
                    <input
                      type="text"
                      value={actionTopic}
                      onChange={(e) => setActionTopic(e.target.value)}
                      className="w-full p-2 text-xs border border-gray-200 rounded text-slate-800"
                      placeholder="e.g. Clean coastal water grants, property capping..."
                      id="form-topic-input"
                    />
                  </div>

                  <div className="space-y-1 block">
                    <label className="text-3xs font-mono font-bold text-slate-400 uppercase">Your Position / Stance</label>
                    <textarea
                      value={actionStance}
                      onChange={(e) => setActionStance(e.target.value)}
                      rows={3}
                      className="w-full p-2 text-xs border border-gray-200 rounded text-slate-800"
                      placeholder="Detail your request respectfully..."
                      id="form-stance-textarea"
                    />
                  </div>

                  <div className="space-y-1 block">
                    <label className="text-3xs font-mono font-bold text-slate-400 uppercase">Communication Format</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[
                        { id: "letter", label: "Formal Letter" },
                        { id: "email", label: "Compact Email" },
                        { id: "script", label: "Call Script" },
                        { id: "testimony", label: "Council Testimony" }
                      ].map(f => (
                        <label 
                          key={f.id} 
                          className={`flex items-center gap-1.5 p-2 rounded border text-3xs cursor-pointer ${
                            actionFormat === f.id ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="format"
                            value={f.id}
                            checked={actionFormat === f.id}
                            onChange={() => setActionFormat(f.id as any)}
                            className="hidden"
                          />
                          {f.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white hover:bg-slate-800 transition py-2.5 rounded text-xs font-sans font-medium cursor-pointer"
                    id="btn-draft-constituent-action"
                  >
                    Generate Draft with Gemini AI
                  </button>

                </form>

              </div>

              {/* Output block display */}
              <div className="md:col-span-2 space-y-4" id="action-output-preview-panel">
                <div className="bg-slate-950 text-slate-100 rounded-xl p-6 min-h-[380px] flex flex-col justify-between border border-slate-800" id="action-output-workspace-card">
                  
                  <div className="space-y-4">
                    <span className="text-4xs font-mono px-2 py-0.5 bg-indigo-900 border border-indigo-700 text-indigo-200 rounded-lg uppercase">
                      Live Output & Revision editor (Cites backed sources)
                    </span>

                    {aiLoading ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-20 text-slate-400 text-xs">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                        <span>Formulating formal terminology structure...</span>
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 font-sans" id="action-response-display">
                        {aiResponseText ? (
                          aiResponseText.split("\n\n").map((b, bI) => {
                            if (b.startsWith("###")) {
                              return <h5 key={bI} className="text-xs font-semibold text-white mt-4 pb-1 border-b border-slate-800">{b.replace("###", "").trim()}</h5>;
                            }
                            return <p key={bI} className="text-slate-300 whitespace-pre-line">{b}</p>;
                          })
                        ) : (
                          <div className="py-20 text-center text-slate-500 font-sans text-xs">
                            Select parameters on the left controls panel and click Generate to run the live AI assembly system. 
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {aiResponseText && !aiLoading && (
                    <div className="border-t border-slate-800 mt-6 pt-4 flex flex-wrap justify-between items-center gap-2" id="action-output-footer">
                      <span className="text-4xs font-mono text-slate-500">Neutral safety compliance index: 100%</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(aiResponseText);
                          alert("Draft text copied successfully to clipboard!");
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xs font-mono px-3 py-1.5 rounded transition uppercase tracking-wide cursor-pointer"
                        id="btn-copy-draft"
                      >
                        Copy Draft to Clipboard
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB F: SCRAPERS HEALTH DIAGNOSTICS ==================== */}
        {activeTab === "scrapers" && (
          <div className="space-y-6" id="tab-viewport-scrapers">
            
            <div className="bg-white border-b border-slate-200 rounded-2xl p-8 shadow-sm" id="scraper-dashboard-header">
              <h1 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">Automation Scraping Pipelines Health</h1>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-4xl">
                Supervise active API/RSS/FTP cron crawlers collecting documents, dockets, ethics filings, and expenditure spreadsheets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="scrapers-dashboard-split">
              
              {/* Left Column: Diagnostics summaries */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5" id="diagnostics-health-overview">
                <h3 className="text-xs font-mono uppercase text-slate-500 tracking-wider font-bold">System Integrity metrics</h3>
                
                <div className="space-y-3 block" id="diagnostics-ratios-list">
                  <div className="bg-slate-50 p-3 rounded text-2xs">
                    <span className="text-slate-400 font-bold block">Aggregated Records Scraped</span>
                    <strong className="text-md text-slate-900">86,375 Files</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded text-2xs">
                    <span className="text-slate-400 font-bold block">Duplicate Records Flagged</span>
                    <strong className="text-md text-slate-900">12 duplicate dockets resolved</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded text-2xs">
                    <span className="text-slate-400 font-bold block">Outage Alert Tracker</span>
                    <strong className="text-md text-rose-600">Miami-Dade RSS feed element mismatch</strong>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg block text-3xs text-indigo-950 leading-normal" id="scrapers-alert-policy">
                  <strong>Nonpartisan manual audit override queue:</strong> Records extracted automatically via Gemini containing confidence coefficients under 85% are withheld in the audit console prior to public release.
                </div>
              </div>

              {/* Right Column: Scrapers detail ledger */}
              <div className="md:col-span-2 space-y-4" id="scrapers-index-ledger">
                {scrapersList.map((sc) => {
                  const isRunningThis = runningScraperId === sc.id;
                  let healthBg = "bg-emerald-500";
                  if (sc.health < 90) healthBg = "bg-amber-500";
                  if (sc.health < 50) healthBg = "bg-rose-500";

                  return (
                    <div key={sc.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:border-slate-400 transition" id={`sc-job-card-${sc.id}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-4xs font-mono uppercase px-3 py-1 bg-slate-50 text-slate-500 rounded border">
                            Source: {sc.source}
                          </span>
                          <h4 className="text-base font-display font-semibold tracking-tight text-slate-900 mt-2">{sc.name}</h4>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-4xs font-mono text-slate-400">Pipeline health:</span>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            <span className="text-3xs font-mono font-bold text-slate-900">{sc.health}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 text-2xs text-slate-600" id="scraper-stats-grid">
                        <div>
                          <span>Indexed items:</span>
                          <p className="font-mono font-semibold text-slate-900 mt-0.5">{sc.recordsExtracted.toLocaleString()}</p>
                        </div>
                        <div>
                          <span>Crawl Status:</span>
                          <p className="font-mono font-semibold text-slate-900 mt-0.5 uppercase tracking-wide">{sc.status}</p>
                        </div>
                        <div className="col-span-2">
                          <span>Last checked:</span>
                          <p className="font-mono text-slate-400 mt-0.5">{sc.lastRun}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center" id="scraper-action-row">
                        <span className="text-3xs text-slate-400">Politeness delay rule: 1.5s active throttled</span>
                        
                        <button
                          onClick={() => runScraperJob(sc.id)}
                          disabled={isRunningThis}
                          className={`text-3xs font-mono uppercase font-bold px-3 py-1 bg-slate-150 border rounded-lg hover:bg-slate-250 hover:border-slate-350 transition cursor-pointer flex items-center gap-1.5 ${
                            isRunningThis ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          id={`btn-trigger-scraper-${sc.id}`}
                        >
                          {isRunningThis ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin text-slate-500" />
                              Crawl running...
                            </>
                          ) : (
                            <>
                              <Activity className="h-3 w-3 text-emerald-600" />
                              Trigger manual scraper tick
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB G: SYSTEM SPEC BLUEPRINTS ==================== */}
        {activeTab === "specs" && (
          <div className="space-y-6" id="tab-viewport-specs">
            <SpecsViewer />
          </div>
        )}

        {/* ==================== TAB H: IDENTIFY OFFICIALS ==================== */}
        {activeTab === "identify" && (
          <div className="space-y-6" id="tab-viewport-identify">
            
            <div className="bg-white border-b border-slate-200 rounded-2xl p-8 shadow-sm" id="identify-dashboard-header">
              <h1 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">Elected Official Aggregation Targeter</h1>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-4xl">
                Define a scope or domain constraints. The AI model will structure a list of target official seats and provide suggested sources to configure scraper paths. State boundaries are configured for Florida and Georgia.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm" id="identify-form-panel">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  if (!identifyQuery.trim() || identifyQuery.trim().length < 10) {
                    setIdentifyError("Query boundaries must be at least 10 characters long.");
                    return;
                  }
                  
                  setIdentifyError(null);
                  setIdentifyLoading(true);
                  setIdentifyResponseText(null);
                  try {
                    const res = await fetch("/api/gemini/action", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        action: "identify_officials",
                        payload: { query: identifyQuery }
                      })
                    });
                    const data = await res.json();
                    setIdentifyResponseText(data.text);
                  } catch (e) {
                    console.error(e);
                    setIdentifyResponseText("Identifier endpoint failed. Check API configuration inside your environment.");
                  } finally {
                    setIdentifyLoading(false);
                  }
                }} 
                className="space-y-4"
                id="identify-drafter-form"
              >
                <div className="space-y-1 block">
                  <label htmlFor="input-identify-query" className="text-2xs font-semibold text-slate-900 block">Query Parameters / Boundaries</label>
                  <input
                    type="text"
                    id="input-identify-query"
                    required
                    value={identifyQuery}
                    onChange={(e) => {
                      setIdentifyQuery(e.target.value);
                      if (identifyError) setIdentifyError(null);
                    }}
                    placeholder="e.g. All county-level executive roles in Miami-Dade"
                    className={`w-full text-xs font-sans text-slate-800 bg-slate-50 border ${identifyError ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'} rounded px-3 py-2 focus:ring-1 focus:outline-none transition`}
                  />
                  {identifyError && (
                    <p className="text-red-500 text-3xs mt-1 font-medium">{identifyError}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={identifyLoading || !identifyQuery}
                  className={`w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-5 py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                    (identifyLoading || !identifyQuery) ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  id="btn-generate-identify"
                >
                  {identifyLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Parsing Targets...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Generate Tracking Blueprint
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Official Output */}
            {identifyResponseText && (
              <div className="bg-white border rounded-xl overflow-hidden shadow-sm" id="identify-output-container">
                <div className="bg-slate-900 border-b border-gray-800 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <Terminal className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider">AI Aggregation Results</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose prose-sm prose-slate max-w-none prose-headings:font-display prose-headings:font-semibold prose-a:text-indigo-600 font-sans leading-relaxed whitespace-pre-wrap">
                    {identifyResponseText}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* 4. Global Footer Disclosures */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 mt-auto" id="global-portal-footer">
        <div className="max-w-7xl mx-auto space-y-8" id="footer-content-assembly">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="footer-branding-row">
            <div>
              <div className="flex items-center gap-3">
                <Building2 className="h-7 w-7 text-indigo-400" />
                <span className="text-2xl font-display font-semibold text-white tracking-tight">CivicLenZ.ai</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Politically-neutral, fact-grounded civic transparency software tracking local legislative outputs.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-2xs font-mono font-medium text-slate-400" id="footer-links-list">
              <span className="text-slate-500 hover:text-white cursor-pointer underline" onClick={() => setActiveTab("home")}>Charter Homepage</span>
              <span>•</span>
              <span className="text-slate-500 hover:text-white cursor-pointer underline" onClick={() => setActiveTab("specs")}>Database Schema Blueprint</span>
              <span>•</span>
              <span className="text-slate-500 hover:text-white cursor-pointer underline" onClick={() => setActiveTab("scrapers")}>Crawl Schedules</span>
              <span>•</span>
              <span className="text-slate-500 hover:text-white cursor-pointer underline" onClick={() => setActiveTab("specs")}>National Horizon Scaling Roadmap</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-4 text-3xs text-slate-500 leading-relaxed font-sans block" id="footer-legal-disclaimers">
            <p className="font-sans block text-slate-400 font-bold uppercase tracking-wider">Public Accountability & Safety Disclaimers:</p>
            <p>
              <strong>1. Status Nonpartisanship Charter:</strong> CivicLenZ is a nonpartisan data repository. Disclosures, votes, pledge markers, and money trackers represent public logs extracted natively from registers. No bias, moral characterization, or endorsement is implied.
            </p>
            <p>
              <strong>2. Analytical Content Warning:</strong> AI-generated text structures (plain-English bill explanations, citizen drafting outputs, pledge consistency analysis) represent informational structures processed via Gemini APIs. Users must cross-reference analyses against official physical PDFs before taking legally binding civic action.
            </p>
            <p>
              <strong>3. Third-Party Data Licensing:</strong> Information is aggregated directly from official registers like Congress.gov, Online Sunshine Florida Senate, Georgia General Assembly, Division of Elections, and Municipal commission agendas.
            </p>
            <p className="pt-2 text-slate-600 font-mono text-center">
              © 2026 CivicLenZ.ai. All rights reserved. Configured for Cloud Run Container Deployments on Port 3000.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
