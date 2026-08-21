import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './icons';
import { southFloridaRaces } from '../lib/elections-database';
import { OfficialAvatar } from './official-avatar';

export function ElectionsMapPage() {
  const [selectedLayer, setSelectedLayer] = useState<'All' | 'Federal' | 'State' | 'Local'>('All');
  const [activeRaceId, setActiveRaceId] = useState<string>(southFloridaRaces[0].id);

  const activeRace = southFloridaRaces.find(r => r.id === activeRaceId) || southFloridaRaces[0];

  return (
    <div className="bg-slate-900 text-white min-h-screen pb-20 font-sans">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Icon name="map" size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">GEOSPATIAL ELECTION COVERAGE</span>
              <h1 className="text-xl font-bold tracking-tight">South Florida District & Election Map</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/elections/my" className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
              ← Back to My Elections
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Map Stage Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 relative min-h-[500px] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Interactive Visual Map Representation */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 flex justify-between items-center bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-300 font-bold">MAP LAYER: {selectedLayer.toUpperCase()} DISTRICTS</span>
              </div>
              <div className="flex gap-1">
                {(['All', 'Federal', 'State', 'Local'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setSelectedLayer(layer)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      selectedLayer === layer ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Map District Grid Overlay */}
            <div className="relative z-10 my-auto py-12 px-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {southFloridaRaces
                .filter(r => selectedLayer === 'All' || r.governmentLevel === selectedLayer)
                .map((race) => (
                  <button
                    key={race.id}
                    onClick={() => setActiveRaceId(race.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      activeRaceId === race.id
                        ? 'bg-amber-500/20 border-amber-400 text-white ring-2 ring-amber-400/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">{race.district}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-400">{race.status}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{race.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{race.jurisdiction}</p>
                  </button>
                ))}
            </div>

            <div className="relative z-10 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 flex justify-between items-center">
              <span>📍 Lat: 25.7617, Lng: -80.1918 (Miami-Dade Pilot Boundaries)</span>
              <span className="text-emerald-400 font-mono font-bold">Coverage 100% Verified</span>
            </div>
          </div>
        </div>

        {/* Selected District Details Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">SELECTED DISTRICT DETAIL</span>
            <h2 className="text-lg font-bold text-white">{activeRace.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{activeRace.description}</p>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Candidate Coverage</span>
              {activeRace.candidates.map((cand) => (
                <Link
                  key={cand.id}
                  to={`/elections/candidate/${cand.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 transition"
                >
                  <OfficialAvatar
                    official={{
                      name: cand.name,
                      slug: cand.slug,
                      photoUrl: cand.photoUrl,
                      color: '#2563eb'
                    }}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block truncate">{cand.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{cand.party} {cand.isIncumbent && '• Incumbent'}</span>
                  </div>
                  <Icon name="chevron-right" size={16} className="text-slate-500" />
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to={`/elections/race/${activeRace.id}`}
                className="w-full inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl text-center transition shadow-sm"
              >
                Open Full Race Page →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
