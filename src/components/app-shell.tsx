import React from 'react';
import { Link } from 'react-router-dom';
import { OfficialAvatar } from './official-avatar';
import { Icon } from './icons';
import { MapVisual } from './map-visual';

import { activityItems, trackedOfficials } from '../lib/civic-records';

const sidebarItems = [
  ['Dashboard', '/dashboard/', 'home'], ['My Officials', '/watchlist/', 'users'], ['Alerts', '/alerts/', 'bell'], ['AI Monitor', '/monitor/', 'watch'], ['Promise Tracker', '/promises/', 'target'], ['Contact Officials', '/contact-official/', 'message'], ['Petitions', '/petitions/', 'edit'], ['My Activity', '/activity/', 'chart'], ['Reports', '/reports/', 'file'], ['Settings', '/settings/', 'settings'],
] as const;

export function AppShell({ active, children }: { active: string; children: React.ReactNode }) {
  return <div className="app-shell"><aside className="app-sidebar"><Link to="/" className="app-sidebar-logo"><img src="/brand/civicslenz-mark.svg" alt="" /><span>Civics<b>LenZ</b></span></Link><nav>{sidebarItems.map(([label, href, icon]) => <Link to={href} key={label} className={label === active ? 'active' : ''}><Icon name={icon} size={18} /><span>{label}</span></Link>)}</nav><Link className="app-logout" to="/"><Icon name="logout" size={18} /> Log Out</Link></aside><section className="app-content"><header className="app-topbar"><div className="mobile-app-name"><img src="/brand/civicslenz-mark.svg" alt="" /> CivicsLenZ</div><div className="app-topbar-actions"><button type="button" aria-label="Search"><Icon name="search" size={20} /></button><button type="button" aria-label="Alerts"><Icon name="bell" size={20} /></button><span className="app-user-dot">AS</span></div></header>{children}</section></div>;
}

const metrics = [['12', 'Officials', 'Following'], ['5', 'Alerts', 'New'], ['3', 'Promises', 'Broken'], ['2', 'Petitions', 'You Signed']];

export function DashboardView() {
  return <AppShell active="Dashboard"><div className="app-page"><section className="app-greeting"><div><span className="small-label">YOUR CIVICLENZ</span><h1>Good morning, Alex <span>👋</span></h1><p>Here&apos;s what&apos;s happening with your officials.</p></div><Link className="btn btn-primary btn-small" to="/search/">Find officials <Icon name="arrow-right" size={15} /></Link></section><section className="dashboard-metrics">{metrics.map(([number, label, detail]) => <article key={label}><b>{number}</b><span>{label}</span><small>{detail}</small></article>)}</section><section className="dashboard-grid"><article className="app-card monitor-overview"><div className="app-card-heading"><div><span className="small-label">AI MONITORING OVERVIEW</span><h2>What we&apos;re watching for you</h2></div><Link to="/monitor/">View all <Icon name="arrow-right" size={15} /></Link></div><p className="muted-copy">We&apos;re watching 12 officials across 4 levels of government.</p><div className="monitor-table"><div><span className="monitor-dot blue" /><b>Tracked Promises</b><strong>1,248</strong><em>+10%</em></div><div><span className="monitor-dot green" /><b>Votes Tracked</b><strong>37</strong><em>+8%</em></div><div><span className="monitor-dot orange" /><b>Campaign Promises</b><strong>24</strong><em>Tracking</em></div><div><span className="monitor-dot red" /><b>Presidential Actions</b><strong>3</strong><em>New</em></div></div></article><RecentAlerts /></section><section className="dashboard-bottom"><article className="app-card user-map"><div className="app-card-heading"><div><span className="small-label">YOUR OFFICIALS ON THE MAP</span><h2>Representation at a glance</h2></div><Icon name="map" size={20} /></div><MapVisual compact officials={trackedOfficials} /></article><QuickActions /></section></div></AppShell>;
}

function RecentAlerts() { return <article className="app-card recent-alerts"><div className="app-card-heading"><div><span className="small-label">RECENT ALERTS</span><h2>New since your last visit</h2></div><Link to="/alerts/">View all</Link></div>{activityItems.slice(0, 3).map((item) => <div className="recent-alert" key={item.title}><span className={`activity-icon ${item.tone}`}><Icon name="bell" size={13} /></span><div><b>{item.title}</b><small>{item.date}</small></div><Icon name="chevron-right" size={16} /></div>)}</article>; }

function QuickActions() { return <article className="quick-action-card dashboard-action-card"><span className="small-label">TAKE ACTION</span><h2>Your voice matters.</h2><Link to="/sign-up/" className="quick-action blue"><Icon name="message" size={21} /><span><b>Contact an Official</b><small>Send a message with AI assistance</small></span></Link><Link to="/petitions/" className="quick-action red"><Icon name="edit" size={21} /><span><b>Start a Petition</b><small>Create or support a public petition</small></span></Link></article>; }


