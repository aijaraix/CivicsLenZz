import React from 'react';
import { CoverageMap } from './CoverageMap';

export function CoverageExperience() {
  return (
    <div className="coverage-page py-16 bg-slate-50 min-h-screen">
      <div className="site-width">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">National Coverage Map</h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">Real-time ingestion tracking of federal, state, and local records across the United States. View the active nodes processing official data.</p>
        </header>
        <CoverageMap onSelectState={(stateId) => console.log('Selected', stateId)} />
      </div>
    </div>
  );
}
