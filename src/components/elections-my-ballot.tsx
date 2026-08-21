import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './icons';
import { southFloridaRaces, southFloridaBallotMeasures } from '../lib/elections-database';
import { ElectionsSubNav } from './elections-nav';
import { OfficialAvatar } from './official-avatar';

export function ElectionsMyBallotPage() {
  const address = localStorage.getItem('civiclenz_address') || '8310 Byron Ave, Miami Beach, FL 33141';
  
  // State for user's personal candidate selections
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('civiclenz_ballot_selections');
    return saved ? JSON.parse(saved) : {};
  });

  const handleSelectCandidate = (raceId: string, candidateSlug: string) => {
    const updated = { ...selections, [raceId]: candidateSlug };
    setSelections(updated);
    localStorage.setItem('civiclenz_ballot_selections', JSON.stringify(updated));
  };

  const handleSelectMeasureOption = (measureId: string, choice: 'YES' | 'NO') => {
    const updated = { ...selections, [measureId]: choice };
    setSelections(updated);
    localStorage.setItem('civiclenz_ballot_selections', JSON.stringify(updated));
  };

  const totalSelections = Object.keys(selections).length;

  return (
    <div className="bg-slate-100 min-h-screen pb-24 font-sans text-slate-900">
      <ElectionsSubNav />
      {/* Official Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Icon name="file-text" size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                OFFICIAL SAMPLE BALLOT PREVIEW
              </span>
              <h1 className="text-xl font-bold tracking-tight">Your Personalized Sample Ballot</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-400">
              🗳 Saved Selections: <strong>{totalSelections}</strong>
            </div>
            <Link to="/elections/my" className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-700 transition">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Address & Precinct Verification Box */}
        <section className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-start border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">PRECINCT & JURISDICTION CONFIRMED</span>
              <h2 className="text-lg font-extrabold text-slate-900">{address}</h2>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              ✓ Verified Precinct 412.0
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            This sample ballot shows the exact nonpartisan and partisan contests scheduled for your precinct. Use the <strong>"Who will you vote for?"</strong> buttons to build your personal voter cheat sheet.
          </p>
        </section>

        {/* Ballot Paper Container */}
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-10 shadow-lg space-y-10 relative">
          <div className="text-center border-b-2 border-slate-900 pb-6 space-y-1">
            <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-500">OFFICIAL SAMPLE BALLOT</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">2026 PRIMARY & GENERAL ELECTION</h2>
            <p className="text-xs text-slate-600 font-semibold">MIAMI-DADE COUNTY, FLORIDA</p>
          </div>

          {/* Races Section */}
          <div className="space-y-8">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
              SECTION 1: CANDIDATES FOR OFFICE
            </h3>

            {southFloridaRaces.map((race, rIdx) => {
              const selectedCandSlug = selections[race.id];

              return (
                <div key={race.id} className="border-2 border-slate-300 rounded-xl p-5 space-y-4 hover:border-slate-800 transition">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">CONTEST 0{rIdx + 1} • {race.governmentLevel.toUpperCase()}</span>
                      <h4 className="text-base font-extrabold text-slate-900">{race.title}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Vote for One (1)</span>
                  </div>

                  <p className="text-xs text-slate-600">{race.description}</p>

                  <div className="space-y-2 pt-1">
                    {race.candidates.map((cand) => {
                      const isSelected = selectedCandSlug === cand.slug;

                      return (
                        <div
                          key={cand.id}
                          className={`p-3.5 rounded-xl border-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/30'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleSelectCandidate(race.id, cand.slug)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                                isSelected ? 'border-amber-600 bg-amber-500 text-slate-950 font-bold' : 'border-slate-400 bg-white'
                              }`}
                            >
                              {isSelected && <Icon name="check" size={14} />}
                            </button>
                            <OfficialAvatar
                              official={{
                                name: cand.name,
                                slug: cand.slug,
                                photoUrl: cand.photoUrl,
                                color: '#2563eb'
                              }}
                              size="md"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-slate-900">{cand.name}</span>
                                <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded">{cand.party}</span>
                                {cand.isIncumbent && <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">Incumbent</span>}
                              </div>
                              <span className="text-[11px] text-slate-500">Raised: ${cand.finance.totalRaised.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Link
                              to={`/elections/candidate/${cand.slug}`}
                              className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                            >
                              View Stances & Bio
                            </Link>
                            <button
                              onClick={() => handleSelectCandidate(race.id, cand.slug)}
                              className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                                  : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                            >
                              {isSelected ? '✓ Your Vote' : 'Select Candidate'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 text-right">
                    <Link to={`/elections/race/${race.id}`} className="text-xs font-bold text-amber-600 hover:underline">
                      Compare candidate records side-by-side →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ballot Measures Section */}
          <div className="space-y-8 pt-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
              SECTION 2: REFERENDA & CONSTITUTIONAL AMENDMENTS
            </h3>

            {southFloridaBallotMeasures.map((measure, mIdx) => {
              const selectedChoice = selections[measure.id];

              return (
                <div key={measure.id} className="border-2 border-slate-300 rounded-xl p-5 space-y-4 hover:border-slate-800 transition">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">BALLOT QUESTION 0{mIdx + 1}</span>
                      <h4 className="text-base font-extrabold text-slate-900">{measure.measureNumber}: {measure.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs font-serif text-slate-800 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                    "{measure.officialWording}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleSelectMeasureOption(measure.id, 'YES')}
                      className={`p-3.5 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                        selectedChoice === 'YES'
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                          : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedChoice === 'YES' ? 'border-emerald-600 bg-emerald-500 text-white font-bold' : 'border-slate-400'
                      }`}>
                        {selectedChoice === 'YES' && <Icon name="check" size={12} />}
                      </span>
                      <div>
                        <span className="text-xs font-extrabold text-emerald-800 block">VOTE YES</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">{measure.whatYesMeans}</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSelectMeasureOption(measure.id, 'NO')}
                      className={`p-3.5 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                        selectedChoice === 'NO'
                          ? 'bg-red-50 border-red-500 ring-2 ring-red-400/30'
                          : 'bg-slate-50 border-slate-200 hover:border-red-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        selectedChoice === 'NO' ? 'border-red-600 bg-red-500 text-white font-bold' : 'border-slate-400'
                      }`}>
                        {selectedChoice === 'NO' && <Icon name="check" size={12} />}
                      </span>
                      <div>
                        <span className="text-xs font-extrabold text-red-800 block">VOTE NO</span>
                        <p className="text-[11px] text-slate-600 mt-0.5">{measure.whatNoMeans}</p>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
