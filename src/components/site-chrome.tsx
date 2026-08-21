import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './icons';

const officialsLinks = [
  { label: 'Find Officials', href: '/search/' },
  { label: 'AI Monitor', href: '/monitor/' },
  { label: 'Promises', href: '/promises/' },
  { label: 'Petitions', href: '/petitions/' },
  { label: 'Coverage', href: '/coverage/' },
];

export function Logo({ inverse = false, compact = false }: { inverse?: boolean; compact?: boolean }) {
  return (
    <span className={`logo-lockup ${inverse ? 'logo-lockup-inverse' : ''} ${compact ? 'logo-lockup-compact' : ''}`}>
      <img src="/brand/civicslenz-mark.svg" alt="" />
      {!compact ? (
        <span className="logo-name flex flex-col leading-none">
          <span className="flex items-center gap-1">
            <span>Civics</span><b>LenZ</b>
          </span>
          <span className="text-[9px] text-indigo-400 font-mono tracking-wider font-semibold">ELECTED OFFICIALS</span>
        </span>
      ) : null}
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="public-header">
      <div className="site-width public-header-inner">
        <Link to="/" className="header-logo" aria-label="CivicLenZ Officials Home"><Logo /></Link>
        <nav className="public-nav" aria-label="Elected Officials navigation">
          {officialsLinks.map((link) => <Link to={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
        <div className="header-actions">
          {/* Bridge Switcher Button to 2026 Candidate Engine */}
          <Link
            to="/elections"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <span>🗳 Switch to Candidate Engine &rarr;</span>
          </Link>

          <Link className="header-login hidden sm:inline-block" to="/sign-in/">Log In</Link>

          <details className="public-menu">
            <summary aria-label="Open menu"><Icon name="menu" size={23} /></summary>
            <div className="public-menu-panel">
              <div className="menu-heading text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 border-b border-slate-800 mb-1">
                🏛 ELECTED OFFICIALS ENGINE
              </div>
              <Link to="/">Home (Officials)</Link>
              <Link to="/search/">Find Officials & Representatives</Link>
              <Link to="/monitor/">AI Accountability Monitor</Link>
              <Link to="/promises/">Campaign Promises Tracker</Link>
              <Link to="/petitions/">Citizen Petitions</Link>
              <Link to="/coverage/">Coverage Transparency</Link>

              <div className="pt-2 border-t border-slate-800 mt-2">
                <Link
                  to="/elections"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 px-3 rounded-lg text-center block"
                >
                  🗳 Switch to 2026 Candidate Engine &rarr;
                </Link>
              </div>

              <div className="pt-2 border-t border-slate-800 mt-2 flex gap-2">
                <Link to="/sign-in/" className="text-xs text-slate-300">Log In</Link>
                <Link to="/sign-up/" className="text-xs text-amber-400 font-bold">Sign Up</Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

const footerGroups = [
  { title: 'Platform', links: [['Features', '/features/'], ['How It Works', '/how-it-works/'], ['Pricing', '/pricing/'], ['About', '/about/']] },
  { title: 'Resources', links: [['Blog', '/about/'], ['Help Center', '/contact/'], ['Guides', '/how-it-works/'], ['API', '/contact/']] },
  { title: 'Get Involved', links: [['Petitions', '/petitions/'], ['Community', '/contact/'], ['Events', '/contact/'], ['Contact', '/contact/']] },
] as const;

export function SiteFooter() {
  return (
    <footer className="public-footer">
      <div className="site-width footer-grid-new">
        <section className="footer-intro">
          <Logo inverse />
          <p>CivicLenZ gives you the data, context, and insights you need to track your elected officials and their actions.</p>
          <span>© 2026 CivicLenZ. All rights reserved.</span>
        </section>
        {footerGroups.map((group) => (
          <section className="footer-group" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map(([label, href]) => <Link to={href} key={label}>{label}</Link>)}
          </section>
        ))}
        <section className="footer-group footer-connect">
          <h2>Connect</h2>
          <div className="social-row" aria-label="Social links"><span>𝕏</span><span>f</span><span>◎</span><span>▶</span></div>
          <Link to="/research/">Privacy Policy</Link>
          <Link to="/corrections/">Terms of Service</Link>
        </section>
      </div>
    </footer>
  );
}

export function MobileTabs({ pathname }: { pathname: string }) {
  const isElectionsDomain = pathname.startsWith('/elections') || pathname.startsWith('/candidates') || pathname.startsWith('/admin/elections');

  if (isElectionsDomain) {
    const electionsTabs = [
      ['Elections', '/elections', 'home'],
      ['Candidates', '/elections/candidates', 'users'],
      ['My Ballot', '/elections/my-ballot', 'check-circle'],
      ['Map', '/elections/map', 'map'],
      ['Swarm Admin', '/admin/elections', 'activity'],
    ] as const;

    const active = pathname.includes('/candidates')
      ? 'Candidates'
      : pathname.includes('/my-ballot') || pathname.includes('/elections/my')
        ? 'My Ballot'
        : pathname.includes('/map')
          ? 'Map'
          : pathname.includes('/admin')
            ? 'Swarm Admin'
            : 'Elections';

    return (
      <nav className="mobile-tabs bg-slate-900 border-t border-slate-800 text-slate-300" aria-label="Elections application navigation">
        {electionsTabs.map(([label, href, icon]) => (
          <Link key={label} to={href} className={label === active ? 'active text-amber-400 font-bold' : 'hover:text-white'}>
            <Icon name={icon} size={19} />
            <span className="text-[10px] tracking-tight">{label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  const tabs = [
    ['Home', '/', 'home'],
    ['Officials', '/search/', 'users'],
    ['Monitor', '/monitor/', 'watch'],
    ['Action', '/petitions/', 'edit'],
  ] as const;

  const active = pathname.startsWith('/search') || pathname.startsWith('/officials') || pathname.startsWith('/watchlist')
    ? 'Officials'
    : pathname.startsWith('/monitor') || pathname.startsWith('/alerts') || pathname.startsWith('/promises')
      ? 'Monitor'
      : pathname.startsWith('/petitions') || pathname.startsWith('/contact-official')
        ? 'Action'
        : 'Home';

  return (
    <nav className="mobile-tabs" aria-label="Mobile application navigation">
      {tabs.map(([label, href, icon]) => (
        <Link key={label} to={href} className={label === active ? 'active' : ''}>
          <Icon name={icon} size={19} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
