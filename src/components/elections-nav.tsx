import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from './icons';

export function ElectionsSubNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Elections Hub', href: '/elections', icon: 'home' as const, exact: true },
    { label: 'Candidate Pipeline', href: '/elections/candidates', icon: 'users' as const, exact: false },
    { label: 'My Local Ballot', href: '/elections/my-ballot', icon: 'check-circle' as const, exact: false },
    { label: 'Candidates Map', href: '/elections/map', icon: 'map' as const, exact: false },
    { label: 'Coverage & Transparency', href: '/coverage', icon: 'shield' as const, exact: false },
    { label: 'HERMES Swarm Admin', href: '/admin/elections', icon: 'activity' as const, exact: false },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return currentPath === href;
    return currentPath.startsWith(href);
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Top Banner Context Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <Link to="/elections" className="flex items-center gap-1.5 font-black tracking-wider text-amber-400 hover:opacity-90 transition">
            <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-mono">CIVICLENZ</span>
            <span className="text-sm">Elections & Candidate Engine</span>
          </Link>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Swarm C Agents Active (E1–E16) • 50-State Election Watch
          </span>
        </div>

        {/* Header Actions & Burger Toggle */}
        <div className="flex items-center gap-3">
          {/* Dual Cross-Bridge Link to Elected Officials Domain */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-slate-400 text-[11px] hidden lg:inline">Monitoring officeholders?</span>
            <Link
              to="/officials"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg border border-indigo-400/30 transition flex items-center gap-1.5 shadow-sm"
            >
              <Icon name="users" size={14} />
              <span>Switch to Elected Officials Monitor &rarr;</span>
            </Link>
          </div>

          {/* Elections Hamburger Dropdown Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold"
            aria-label="Open Elections Menu"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={18} className="text-amber-400" />
            <span className="hidden xs:inline">Elections Menu</span>
          </button>
        </div>
      </div>

      {/* Main Desktop Navigation Bar */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 py-2 text-xs font-bold" aria-label="Elections Sub-Navigation">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
                  active
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon name={item.icon} size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-800 text-[11px] font-mono text-amber-300">
          <span>Targeting: Candidates & Races</span>
        </div>
      </div>

      {/* Hamburger Dropdown Menu Drawer */}
      {menuOpen && (
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 shadow-2xl">
          <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider px-2 border-b border-slate-800/80 pb-2 flex justify-between items-center">
            <span>🗳 ELECTIONS & CANDIDATE ENGINE MENU</span>
            <span className="text-slate-500">Standalone Product View</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2.5 ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon name={item.icon} size={16} className={active ? 'text-slate-950' : 'text-amber-400'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Bridge Link in Dropdown */}
          <div className="pt-2 border-t border-slate-800/80">
            <Link
              to="/officials"
              onClick={() => setMenuOpen(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-indigo-400/30 transition flex items-center justify-center gap-2 shadow-md"
            >
              <Icon name="users" size={16} />
              <span>🏛 Switch to Elected Officials Monitor &rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

