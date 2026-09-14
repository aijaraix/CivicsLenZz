import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OfficialAvatar } from './official-avatar';
import { Icon } from './icons';
import { trackedOfficials, trackedPetitions } from '../lib/civic-records';

export function PetitionsExperience() {
  const [active, setActive] = useState('Active Petitions');

  return (
    <section className="petitions-page">
      <div className="site-width">
        <div className="petitions-shell">
          {/* Explicit Demonstration Banner */}
          <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-900">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                DEMO / NOT LIVE
              </span>
              <span className="text-xs font-semibold">
                Petition creation and participation metrics are illustrative interface demonstrations only.
              </span>
            </div>
          </div>

          <header className="petitions-header">
            <div>
              <span className="small-label">CIVIC ACTION CENTER — PROTOTYPE</span>
              <h1>Petitions</h1>
              <p>Discover and support petitions to hold officials accountable. (Demonstration UI)</p>
            </div>
            <button type="button" className="btn btn-primary btn-small opacity-60 cursor-not-allowed" title="Feature disabled in demo mode" disabled>
              <Icon name="plus" size={16} /> Start a petition (Demo)
            </button>
          </header>
          <div className="petition-tabs">
            {['Active Petitions', 'Sample Petitions'].map((item) => (
              <button type="button" onClick={() => setActive(item)} className={active === item ? 'active' : ''} key={item}>
                {item}
              </button>
            ))}
          </div>
          <div className="petition-list">
            {trackedPetitions.map((petition, index) => {
              const official = trackedOfficials[index % trackedOfficials.length];
              const progress = Math.round((petition.signatures / petition.goal) * 100);
              return (
                <article className="petition-row" key={petition.slug}>
                  <OfficialAvatar official={official} size="lg" />
                  <div className="petition-copy">
                    <span className="petition-category" style={{ '--petition-color': petition.color } as React.CSSProperties}>
                      {petition.category}
                    </span>
                    <h2>{petition.title}</h2>
                    <p>Started by <b>{petition.official}</b> · {petition.age}</p>
                    <div className="petition-progress">
                      <span>
                        <i style={{ width: `${Math.min(progress, 100)}%`, background: petition.color }} />
                      </span>
                      <b>Demo Target: {petition.goal.toLocaleString()} (Non-Live Example)</b>
                      <small>{progress}% target</small>
                    </div>
                  </div>
                  <div className="petition-actions">
                    <Link to={`/petitions/${petition.slug}/`} className="btn btn-outline btn-small">
                      View Demo
                    </Link>
                    <button type="button" className="btn btn-small btn-outline opacity-60 cursor-not-allowed" disabled>
                      Signing Disabled (Demo)
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PetitionDetail({ slug }: { slug: string }) {
  const petition = trackedPetitions.find((item) => item.slug === slug) ?? trackedPetitions[0];
  const progress = Math.round((petition.signatures / petition.goal) * 100);

  return (
    <section className="petition-detail">
      <div className="site-width">
        <Link className="back-link petition-back" to="/petitions/">
          <Icon name="arrow-left" size={16} /> Back to petitions
        </Link>
        <div className="petition-detail-grid">
          <article className="petition-article">
            <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-900 text-xs font-semibold">
              <span className="font-mono uppercase font-bold bg-amber-200 px-1.5 py-0.5 rounded mr-2">DEMO / NOT LIVE</span>
              This petition is an illustrative UI prototype. No actual petitions or signatures are recorded in production.
            </div>
            <span className="petition-category" style={{ '--petition-color': petition.color } as React.CSSProperties}>
              {petition.category}
            </span>
            <h1>{petition.title}</h1>
            <p className="petition-lede">{petition.summary}</p>
            <div className="petition-hero-meta">
              <span><Icon name="users" size={17} /> Demonstration author</span>
              <span><Icon name="calendar" size={17} /> {petition.age}</span>
            </div>
            <div className="petition-story">
              <h2>Why this petition matters</h2>
              <p>
                This page shows the prototype layout where a petition&apos;s background, requested action, verified source materials, and updates will appear.
              </p>
              <p>
                In a future production release with persistent signature storage, every petition will require verified author identity, moderation review, and audited signature verification.
              </p>
              <h2>Requested action</h2>
              <ul>
                <li>Publish the relevant public plan in plain language.</li>
                <li>Set a specific timeline for action and public updates.</li>
                <li>Provide a visible response from the relevant office.</li>
              </ul>
            </div>
          </article>
          <aside className="petition-sign-card">
            <span className="small-label font-mono text-amber-800">DEMO INTERFACE</span>
            <h2>Sample Campaign</h2>
            <div className="petition-detail-progress">
              <span>
                <i style={{ width: `${Math.min(progress, 100)}%`, background: petition.color }} />
              </span>
              <div>
                <b>Sample Target:</b>
                <small>{petition.goal.toLocaleString()} goal</small>
              </div>
            </div>
            <button type="button" className="btn btn-large btn-outline opacity-60 cursor-not-allowed" disabled>
              Petition Signing Disabled (Demo Mode)
            </button>
            <p className="text-xs text-slate-500 mt-2">
              Persistent petition storage is not yet connected. No real user participation or signature data is collected.
            </p>
            <div className="petition-share">
              <span>Share sample</span>
              <button type="button"><Icon name="share" size={18} /> Share</button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
