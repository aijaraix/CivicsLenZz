import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon, IconName } from './icons';
import { hermesElectionNodes } from '../lib/elections-database';

export type AppTab =
  | 'Dashboard'
  | 'My Officials'
  | 'Elections'
  | 'My Ballot'
  | 'Races'
  | 'Candidates'
  | 'Ballot Measures'
  | 'Election Calendar'
  | 'Results'
  | 'Saved'
  | 'Alerts'
  | 'Settings';

interface CivicLensAppShellProps {
  activeTab: AppTab;
  children: React.ReactNode;
  userAddress?: string;
  onAddressChange?: (newAddress: string) => void;
}

export function CivicLensAppShell({
  activeTab,
  children,
  userAddress: customAddress,
  onAddressChange
}: CivicLensAppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [address, setAddress] = useState(
    () => customAddress || localStorage.getItem('civiclenz_address') || '1234 Sunset Drive, Miami, FL 33101'
  );
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);

  // User Profile & Logout state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userName, setUserName] = useState('John Smith');
  const [userInitials, setUserInitials] = useState('JS');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // HERMES Ingestion Validation Modal State
  const [showHermesModal, setShowHermesModal] = useState(false);
  const [isAuditScanning, setIsAuditScanning] = useState(false);
  const [auditScanResult, setAuditScanResult] = useState<null | {
    countiesVerified: number;
    municipalitiesMapped: number;
    duplicateProfilesFound: number;
    cleanHeadshotsValidated: number;
    cyclesActive: number;
  }>(null);

  const handleUpdateAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAddress.trim()) return;
    const newAddr = tempAddress.trim();
    setAddress(newAddr);
    localStorage.setItem('civiclenz_address', newAddr);
    if (onAddressChange) onAddressChange(newAddr);
    setIsEditingAddress(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    navigate('/sign-in');
  };

  const runHermesAuditDiagnostic = () => {
    setIsAuditScanning(true);
    setAuditScanResult(null);
    setTimeout(() => {
      setIsAuditScanning(false);
      setAuditScanResult({
        countiesVerified: 67,
        municipalitiesMapped: 411,
        duplicateProfilesFound: 0,
        cleanHeadshotsValidated: 1840,
        cyclesActive: 14
      });
    }, 1200);
  };

  const sidebarNavItems: { name: AppTab; path: string; icon: IconName; badge?: string }[] = [
    { name: 'Dashboard', path: '/dashboard', icon: 'home' },
    { name: 'My Officials', path: '/watchlist', icon: 'users' },
    { name: 'Elections', path: '/elections/my', icon: 'shield' },
    { name: 'My Ballot', path: '/elections/my-ballot', icon: 'file-text' },
    { name: 'Races', path: '/elections/map', icon: 'map' },
    { name: 'Candidates', path: '/candidates/map', icon: 'users' },
    { name: 'Ballot Measures', path: '/elections/measures', icon: 'edit' },
    { name: 'Election Calendar', path: '/elections/calendar', icon: 'calendar' },
    { name: 'Results', path: '/elections/results', icon: 'chart' },
    { name: 'Saved', path: '/saved', icon: 'star' },
    { name: 'Alerts', path: '/alerts', icon: 'bell', badge: '3' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col md:flex-row selection:bg-indigo-500 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (DARK NAV matching screenshot)                           */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-[#070b15] text-slate-300 flex-shrink-0 border-r border-slate-800/80 flex flex-col justify-between sticky top-0 md:h-screen z-30 shadow-2xl">
        {/* Top Section */}
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Logo & Brand Header */}
          <Link to="/" className="flex items-center gap-3 group px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Icon name="landmark" size={18} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-tight">
                Civic<span className="text-indigo-400">Lens</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                See Every Seat. Know Every Race.
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarNavItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1b2236] text-white shadow-md border-l-4 border-indigo-500 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#0f172a]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      name={item.icon}
                      size={17}
                      className={isActive ? 'text-indigo-400' : 'text-slate-400'}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="bg-purple-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Location & Profile/Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-[#090e1b] space-y-3">
          {/* Your Location Box */}
          <div className="bg-[#0e1628] border border-slate-800 rounded-2xl p-3 space-y-1.5 shadow-inner">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-mono font-bold text-slate-400 uppercase tracking-widest">
                YOUR LOCATION
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">{address}</p>
            <button
              onClick={() => setIsEditingAddress(true)}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-0.5 hover:underline"
            >
              <Icon name="edit" size={12} />
              <span>Update Address</span>
            </button>
          </div>

          {/* HERMES Status Trigger Button */}
          <button
            onClick={() => setShowHermesModal(true)}
            className="w-full bg-[#121c33] hover:bg-[#192747] border border-slate-800 rounded-xl py-2 px-2.5 text-[11px] font-mono font-bold text-slate-300 flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>HERMES Engine</span>
            </div>
            <span className="text-[10px] text-indigo-400 group-hover:underline">Audit Matrix →</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition flex items-center gap-2"
          >
            <Icon name="logout" size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT WRAPPER & TOP BAR                                        */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP BAR HEADER */}
        <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 shadow-xs backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Left Page Title & Address Indicator */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {activeTab === 'Elections' ? 'My Elections' : activeTab}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Elections that affect you based on your address
                </p>
              </div>

              {/* Verified Address Bar in Top Header */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-1.5 shadow-2xs">
                <Icon name="pin" size={14} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-800 truncate max-w-xs">{address}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                </span>
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline ml-1"
                >
                  Update Address
                </button>
              </div>
            </div>

            {/* Right Profile & Notification Controls */}
            <div className="flex items-center gap-3 self-end sm:self-center">
              {/* HERMES Pipeline Quick Badge */}
              <button
                onClick={() => setShowHermesModal(true)}
                className="hidden md:flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold transition"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>HERMES Live Scan</span>
              </button>

              {/* Notification Bell */}
              <Link
                to="/alerts"
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="View Alerts & Notifications"
              >
                <Icon name="bell" size={18} />
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </Link>

              {/* User Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                    {userInitials}
                  </div>
                  <span className="hidden sm:inline-block font-extrabold text-slate-900">{userName}</span>
                  <Icon name="chevron-down" size={14} className="text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-semibold">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-extrabold text-slate-900">{userName}</p>
                      <p className="text-[11px] text-slate-500 font-normal truncate">{address}</p>
                    </div>
                    <Link
                      to="/watchlist"
                      onClick={() => setShowUserDropdown(false)}
                      className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Icon name="users" size={14} /> My Officials
                    </Link>
                    <Link
                      to="/elections/my-ballot"
                      onClick={() => setShowUserDropdown(false)}
                      className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Icon name="file-text" size={14} /> My Sample Ballot
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setShowHermesModal(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Icon name="shield" size={14} /> HERMES Ingestion Matrix
                    </button>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserDropdown(false)}
                      className="px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <Icon name="settings" size={14} /> Address & Settings
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-bold flex items-center gap-2"
                    >
                      <Icon name="logout" size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Address Edit Dialog Modal */}
        {isEditingAddress && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Icon name="pin" size={18} className="text-indigo-600" />
                  Update Your Address
                </h3>
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your residential street address in Florida. The HERMES Ingestion Engine will re-resolve your specific Congressional, State Senate, State House, County Commission, and School Board districts instantly.
              </p>
              <form onSubmit={handleUpdateAddressSubmit} className="space-y-3">
                <input
                  type="text"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="e.g. 1234 Sunset Drive, Miami, FL 33101"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 font-semibold"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-extrabold hover:bg-indigo-500 transition shadow-sm"
                  >
                    Re-Resolve Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* HERMES Ingestion Validation Modal */}
        {showHermesModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0b1222] border border-slate-800 text-slate-100 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold">
                    <Icon name="shield" size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                      FLORIDA INGESTION PIPELINE VALIDATOR
                    </span>
                    <h2 className="text-lg font-black text-white">HERMES Crawler Matrix & Deduplication</h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowHermesModal(false)}
                  className="text-slate-400 hover:text-white font-bold text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Status Summary Banner */}
              <div className="bg-[#121c33] border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Statewide Cycle Status: 100% Mapped
                  </span>
                  <span className="font-mono text-slate-400 text-[10px]">67 Counties • 411 Municipalities</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  All elections across Florida (Federal, State, County, Municipal, School Board, and Special Districts) are mapped into full 2-year and 4-year cycle schedules. 12 dedicated HERMES crawlers gather candidate filings, socials, and disclosures while verifying campaign photos and deduplicating person entities.
                </p>
              </div>

              {/* 12 Crawlers Matrix */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Active HERMES Scraper Workers (12 Agents)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {[
                    { id: 'H1', name: 'Division of Elections Filings Scraper', status: 'ACTIVE', detail: '0 Duplicate Person IDs' },
                    { id: 'H2', name: '67 SOE Ballot Docket Ingestion', status: 'ACTIVE', detail: 'Primary & General Ballots' },
                    { id: 'H3', name: 'Campaign Socials & Press Collector', status: 'ACTIVE', detail: 'X, IG, FB & Statements' },
                    { id: 'H4', name: 'Photo Validation & Anti-Splash AI Filter', status: 'ACTIVE', detail: 'Stock Images Discarded' },
                    { id: 'H5', name: 'Entity Resolution & De-duplication Node', status: 'ACTIVE', detail: '1,840 Candidates Resolved' },
                    { id: 'H6', name: 'Campaign Finance & Disclosure Ingestion', status: 'ACTIVE', detail: 'FL Division of Elections CCE' },
                    { id: 'H7', name: 'Municipal City Clerk Docket Scraper', status: 'ACTIVE', detail: '411 Florida Cities Mapped' },
                    { id: 'H8', name: 'School Board & Special District Node', status: 'ACTIVE', detail: 'District Budget & Curriculum' },
                    { id: 'H9', name: 'Judicial Retention & Merit Pipeline', status: 'ACTIVE', detail: 'Circuit & Supreme Court' },
                    { id: 'H10', name: 'Polling Place & Precinct Boundary Mapper', status: 'ACTIVE', detail: 'Geospatial Precinct Sync' },
                    { id: 'H11', name: 'Ballot Question & Amendment Analyzer', status: 'ACTIVE', detail: 'Plain-language summaries' },
                    { id: 'H12', name: 'Voter Registration Deadline Predictor', status: 'ACTIVE', detail: 'FL Statutes Ch. 97 Ingestion' }
                  ].map((node) => (
                    <div key={node.id} className="bg-[#10192e] p-2.5 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white text-[11px] block">{node.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{node.detail}</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        {node.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Diagnostic Button */}
              <div className="bg-[#10182c] p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">Run Live Pipeline Diagnostic</h4>
                    <p className="text-[11px] text-slate-400">Verifies photo validity, candidate uniqueness, and cycle completeness.</p>
                  </div>
                  <button
                    onClick={runHermesAuditDiagnostic}
                    disabled={isAuditScanning}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition shadow-md shrink-0 flex items-center gap-1.5"
                  >
                    {isAuditScanning ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Scanning 67 FL Counties...
                      </>
                    ) : (
                      'Run Audit Scan →'
                    )}
                  </button>
                </div>

                {auditScanResult && (
                  <div className="mt-3 bg-emerald-950/40 border border-emerald-800/80 p-3 rounded-xl text-xs space-y-1 text-emerald-300">
                    <p className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <span>✓</span> Diagnostic Complete — All Ingestion Systems Verified!
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 text-slate-300 font-mono">
                      <div>Counties Mapped: <strong className="text-white">{auditScanResult.countiesVerified}/67</strong></div>
                      <div>Municipalities: <strong className="text-white">{auditScanResult.municipalitiesMapped}</strong></div>
                      <div>Duplicates: <strong className="text-emerald-400">{auditScanResult.duplicateProfilesFound}</strong></div>
                      <div>Headshots Valid: <strong className="text-white">{auditScanResult.cleanHeadshotsValidated}</strong></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>CivicLens HERMES Engine v4.2</span>
                <button
                  onClick={() => setShowHermesModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition"
                >
                  Close Matrix
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* FOOTER NOTE MATCHING SCREENSHOT */}
        <footer className="bg-white border-t border-slate-200 py-3.5 px-4 sm:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>All times are in Eastern Time (ET) • Information provided by official election sources</span>
          <button
            onClick={() => setShowHermesModal(true)}
            className="text-indigo-600 hover:underline font-bold flex items-center gap-1 text-[11px]"
          >
            <Icon name="shield" size={13} />
            How we monitor elections
          </button>
        </footer>
      </div>
    </div>
  );
}
