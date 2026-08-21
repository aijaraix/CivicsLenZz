import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './icons';
import { southFloridaElections, southFloridaRaces, southFloridaBallotMeasures } from '../lib/elections-database';
import { OfficialAvatar } from './official-avatar';

export function ElectionsMyDashboard() {
  const [address, setAddress] = useState(() => localStorage.getItem('civiclenz_address') || '8310 Byron Ave, Miami Beach, FL 33141');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(address);
  const [activeTab, setActiveTab] = useState<'All' | 'Federal' | 'State' | 'Local' | 'School Board' | 'Measures'>('All');

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempAddress.trim()) return;
    localStorage.setItem('civiclenz_address', tempAddress.trim());
    setAddress(tempAddress.trim());
    setIsEditingAddress(false);
  };

  const filteredRaces = southFloridaRaces.filter((race) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Measures') return false;
    return race.governmentLevel === activeTab;
  });

  const timelineSteps = [
    { title: 'Candidate Qualifying Closes', date: 'June 12, 2026', completed: true },
    { title: 'Voter Registration Deadline', date: 'July 20, 2026', completed: true },
    { title: 'Vote-by-Mail Request Deadline', date: 'August 8, 2026', completed: true, active: true },
    { title: 'Early Voting Begins', date: 'August 3 - 16, 2026', completed: false, highlight: true },
    { title: 'Primary Election Day', date: 'August 18, 2026', completed: false },
    { title: 'Official Certification', date: 'August 28, 2026', completed: false },
    { title: 'General Election Day', date: 'November 3, 2026', completed: false }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900">
      {/* Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Icon name="check" size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                PERSONALIZED ELECTION DASHBOARD
              </span>
              <h1 className="text-xl font-bold tracking-tight">Your Upcoming Elections</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/elections/my-ballot" className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5 shadow-sm">
              <Icon name="file-text" size={15} /> View My Sample Ballot
            </Link>
            <Link to="/elections/map" className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-slate-700 transition flex items-center gap-1">
              <Icon name="map" size={14} /> District Map
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Address Banner */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Icon name="pin" size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Resolved User Address</span>
              {isEditingAddress ? (
                <form onSubmit={handleUpdateAddress} className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button type="submit" className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-lg">Save</button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{address}</span>
                  <button onClick={() => setIsEditingAddress(true)} className="text-xs text-amber-600 hover:underline font-semibold">
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-amber-900 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Identified <strong>8 Races</strong> & <strong>2 Ballot Measures</strong> for your seat geography.</span>
          </div>
        </section>

        {/* Next Election Countdown Card */}
        {southFloridaElections.slice(0, 1).map((election) => (
          <section key={election.id} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded">
                    YOUR NEXT ELECTION
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded animate-pulse">
                    {election.status}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{election.name}</h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  {election.jurisdiction} • Early Voting: {election.earlyVotingStart} – {election.earlyVotingEnd}
                </p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl text-center min-w-[160px] shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 block font-mono">{election.daysUntil}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Days Until Election</span>
              </div>
            </div>
          </section>
        ))}

        {/* Personal Election Timeline */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Icon name="calendar" size={16} className="text-amber-600" />
              Personal Election Timeline
            </h3>
            <span className="text-xs text-slate-500 font-medium">Miami-Dade County Deadlines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between space-y-1.5 transition ${
                  step.highlight
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                    : step.completed
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 0{idx + 1}</span>
                  {step.completed && <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">DONE</span>}
                  {step.highlight && <span className="text-amber-800 font-bold text-[10px] bg-amber-200 px-1.5 py-0.5 rounded animate-pulse">CURRENT</span>}
                </div>
                <h4 className="font-bold text-slate-900">{step.title}</h4>
                <p className="text-[11px] font-mono text-slate-500">{step.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Filter Navigation Tabs */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['All', 'Federal', 'State', 'Local', 'School Board', 'Measures'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === tab
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'Measures' ? 'Ballot Measures' : tab}
                </button>
              ))}
            </div>

            <Link to="/elections/my-ballot" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              View Sample Ballot Preview <Icon name="arrow-right" size={14} />
            </Link>
          </div>

          {/* List of Races */}
          {activeTab !== 'Measures' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Upcoming Contests ({filteredRaces.length})
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRaces.map((race) => (
                  <div key={race.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
                            {race.governmentLevel} • {race.jurisdiction}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            {race.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 hover:text-amber-600 transition">
                          <Link to={`/elections/race/${race.id}`}>{race.title}</Link>
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shrink-0">
                        {race.electionDate}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{race.description}</p>

                    {/* Candidate Comparison Row */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Candidates Seeking Seat</span>
                      <div className="grid grid-cols-2 gap-2">
                        {race.candidates.map((cand) => (
                          <Link
                            key={cand.id}
                            to={`/elections/candidate/${cand.slug}`}
                            className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-slate-200 hover:border-amber-400 transition"
                          >
                            <OfficialAvatar
                              official={{
                                name: cand.name,
                                slug: cand.slug,
                                photoUrl: cand.photoUrl,
                                color: '#2563eb'
                              }}
                              size="sm"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-900 truncate block">{cand.name}</span>
                              <span className="text-[10px] text-slate-500 truncate block">
                                {cand.party} {cand.isIncumbent && '(Incumbent)'}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Link
                        to={`/elections/race/${race.id}`}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold py-2.5 rounded-xl text-center transition shadow-xs"
                      >
                        View Race & Compare Candidates
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List of Ballot Measures */}
          {(activeTab === 'All' || activeTab === 'Measures') && (
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Applicable Ballot Questions ({southFloridaBallotMeasures.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {southFloridaBallotMeasures.map((measure) => (
                  <div key={measure.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {measure.measureNumber}
                      </span>
                      <span className="text-xs text-slate-500">{measure.jurisdiction}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{measure.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {measure.plainLanguageSummary}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                        <span className="font-bold text-emerald-800 block mb-0.5">What YES Means</span>
                        <p className="text-[11px] text-emerald-950 leading-tight">{measure.whatYesMeans}</p>
                      </div>
                      <div className="bg-red-50 border border-red-100 p-2.5 rounded-xl">
                        <span className="font-bold text-red-800 block mb-0.5">What NO Means</span>
                        <p className="text-[11px] text-red-950 leading-tight">{measure.whatNoMeans}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
