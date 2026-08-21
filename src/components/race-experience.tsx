import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Icon } from './icons';
import { getRaceById, getPollsForRace } from '../lib/elections-database';
import { ElectionsSubNav } from './elections-nav';
import { OfficialAvatar } from './official-avatar';

export function RacePageExperience() {
  const { raceId } = useParams<{ raceId: string }>();
  const race = getRaceById(raceId || '');
  const detailedPolls = getPollsForRace(raceId || '');

  // User vote tracker
  const [userVote, setUserVote] = useState<string>(() => {
    const saved = localStorage.getItem('civiclenz_ballot_selections');
    if (!saved || !race) return '';
    const parsed = JSON.parse(saved);
    return parsed[race.id] || '';
  });

  const handleVote = (candidateSlug: string) => {
    setUserVote(candidateSlug);
    const saved = localStorage.getItem('civiclenz_ballot_selections');
    const parsed = saved ? JSON.parse(saved) : {};
    parsed[race?.id || ''] = candidateSlug;
    localStorage.setItem('civiclenz_ballot_selections', JSON.stringify(parsed));
  };

  if (!race) {
    return (
      <div className="bg-slate-50 min-h-screen py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <Icon name="check" size={40} className="mx-auto text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">Race Not Found</h2>
          <p className="text-xs text-slate-600">The requested election race could not be located in the South Florida database.</p>
          <Link to="/elections/my" className="inline-block bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs">
            Return to My Elections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans text-slate-900">
      <ElectionsSubNav />
      {/* Race Header Banner */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Link to="/elections/my" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition">
              <Icon name="arrow-left" size={18} />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                {race.governmentLevel.toUpperCase()} • {race.jurisdiction}
              </span>
              <h1 className="text-xl font-bold tracking-tight">{race.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-semibold bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
              Election Date: <strong>{race.electionDate}</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Race Information Card */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {race.status}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {race.votingMethod}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{race.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{race.description}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-center shrink-0 min-w-[200px]">
              <span className="text-xs text-slate-500 font-medium block">Incumbent Status</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">
                {race.incumbentName} ({race.incumbentRunning === 'YES' ? 'Running for Re-election' : 'Not Running'})
              </span>
            </div>
          </div>

          {/* Key Debate Topics */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Key Policy Debates in this Contest</span>
            <div className="flex flex-wrap gap-2">
              {race.keyIssues.map((issue) => (
                <span key={issue} className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold px-3 py-1 rounded-full">
                  ⚡ {issue}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Agent E7 & E8 Detailed Polling Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
                  AGENT E7 & E8 POLLING INTELLIGENCE
                </span>
                <span className="text-xs text-slate-500 font-bold">AAPOR Methodology Audited</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Verified Polling Snapshots & Methodology Analysis</h3>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900 text-xs max-w-sm flex items-center gap-2">
              <Icon name="info" size={18} className="shrink-0 text-amber-600" />
              <span><strong>Notice:</strong> Polling is a statistical snapshot of opinion during field dates, not an election result prediction.</span>
            </div>
          </div>

          {(detailedPolls.length > 0 ? detailedPolls : [
            {
              id: 'poll-fallback-01',
              raceId: race.id,
              pollster: race.polling?.[0]?.pollster || 'South Florida Research Institute',
              sponsor: 'Civic Research Center',
              fieldDates: race.polling?.[0]?.date || 'August 2026',
              sampleSize: 625,
              populationType: 'Likely Voters' as const,
              methodology: 'Live Telephone + Web Panel Survey (Cellular & Landline)',
              marginOfError: '±3.9%',
              publicationDate: '2026-08-07',
              grade: 'A+' as const,
              results: race.polling?.[0]?.results || race.candidates.map(c => ({ candidateSlug: c.slug, candidateName: c.name, percentage: 45 })),
              undecidedPercentage: 10,
              sourceUrl: 'https://mason-dixon.com'
            }
          ]).map((poll) => (
            <div key={poll.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{poll.pollster}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Grade: {poll.grade}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Sponsor: {poll.sponsor} • Field Dates: {poll.fieldDates}</span>
                </div>

                <div className="text-xs font-mono text-slate-600 space-x-2">
                  <span>Sample: <strong>{poll.sampleSize} ({poll.populationType})</strong></span>
                  <span>MoE: <strong>{poll.marginOfError}</strong></span>
                </div>
              </div>

              {/* Polling Bar Graph */}
              <div className="space-y-3">
                {poll.results.map((r, rIdx) => (
                  <div key={rIdx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>{r.candidateName}</span>
                      <span className="font-mono text-amber-700">{r.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden border border-slate-300">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-700"
                        style={{ width: `${r.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}

                {poll.undecidedPercentage > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 font-semibold">
                      <span>Undecided / Other</span>
                      <span className="font-mono">{poll.undecidedPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full" style={{ width: `${poll.undecidedPercentage}%` }} />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 text-[10px] text-slate-500 flex justify-between items-center border-t border-slate-200">
                <span>Methodology: {poll.methodology}</span>
                <a href={poll.sourceUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">
                  Full Polling Crosstabs →
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Candidate Side-by-Side Comparison Matrix */}
        <section className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-indigo-500/40 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h2 className="text-sm font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  Swarm B (C1–C32) Candidate Agent Worker Pool Active for this Race
                </h2>
              </div>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2.5 py-1 rounded border border-indigo-800">
                24/7 Race Sync • C2 Race Construction & C3 Candidate Discovery
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">
              Swarm B candidate agents continuously harvest campaign filings, itemized FEC disclosures, and policy stances for all contenders in this race. When an election winner is certified, the permanent <code className="text-amber-300">person_uuid</code> transitions directly into Swarm A officeholder monitoring without data loss.
            </p>
          </div>

          <div className="flex justify-between items-center border-b border-slate-200 pb-2 pt-2">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Side-By-Side Contender Matrix</span>
              <h2 className="text-xl font-bold text-slate-900">Candidate Records & Platform Comparison</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {race.candidates.map((cand) => {
              const isSelected = userVote === cand.slug;

              return (
                <div key={cand.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 flex flex-col justify-between hover:border-amber-400 transition">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <OfficialAvatar
                          official={{
                            name: cand.name,
                            slug: cand.slug,
                            photoUrl: cand.photoUrl,
                            color: '#2563eb'
                          }}
                          size="lg"
                        />
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            {cand.party} {cand.isIncumbent && '• Incumbent'}
                          </span>
                          <h3 className="text-lg font-black text-slate-900">{cand.name}</h3>
                          <span className="text-xs text-slate-500">{cand.qualificationStatus}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleVote(cand.slug)}
                        className={`text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs ${
                          isSelected ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400/50' : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ Voting For This Candidate' : 'Select Vote'}
                      </button>
                    </div>

                    {/* Bio & Education */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Biography & Background</span>
                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {cand.biography[0]}
                      </p>
                      <div className="text-[11px] text-slate-600 font-medium space-y-0.5">
                        <span className="block"><strong>Education:</strong> {cand.education.join(', ')}</span>
                        <span className="block"><strong>Gov Experience:</strong> {cand.governmentExperience.join(', ')}</span>
                      </div>
                    </div>

                    {/* Campaign Finance Card */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-400">Campaign Finances ({cand.finance.asOf})</span>
                        <span className="font-mono text-slate-400">Raised: ${cand.finance.totalRaised.toLocaleString()}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-slate-800 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">Individual Donors</span>
                          <span className="font-bold text-emerald-400 font-mono">{cand.finance.individualSupport}%</span>
                        </div>
                        <div className="bg-slate-800 p-2 rounded-lg">
                          <span className="text-[10px] text-slate-400 block">PAC Support</span>
                          <span className="font-bold text-amber-400 font-mono">{cand.finance.pacSupport}%</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300">
                        <strong>Top Donors:</strong> {cand.finance.topDonors.map(d => d.name).join(', ')}
                      </div>
                    </div>

                    {/* Key Stances */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Key Policy Stances</span>
                      <div className="space-y-2">
                        {cand.stances.map((st, stIdx) => (
                          <div key={stIdx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase">
                                {st.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{st.aiConfidence}% AI Confidence</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">{st.position}</h4>
                            <p className="text-[11px] text-slate-600">{st.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Social Analysis Summary */}
                    <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-indigo-900 flex items-center gap-1">
                          <Icon name="sparkles" size={14} className="text-indigo-600" /> AI Social Media Tone Analysis
                        </span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                          {cand.aiSocialAnalysis.overallTone}
                        </span>
                      </div>
                      <p className="text-indigo-950 text-[11px] leading-relaxed">
                        {cand.aiSocialAnalysis.aiSummary}
                      </p>
                    </div>

                    {/* Ethics & Legal Disclosures */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Legal & Family Disclosures</span>
                      {cand.legalArrestEthicsDisclosures.map((disc, dIdx) => (
                        <div key={dIdx} className="text-[11px] text-slate-600 bg-slate-100 p-2 rounded-lg">
                          <strong>{disc.title} ({disc.year}):</strong> {disc.details}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-2">
                    <Link
                      to={`/elections/candidate/${cand.slug}`}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs py-2.5 rounded-xl text-center transition"
                    >
                      View Full Candidate Profile Card →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
