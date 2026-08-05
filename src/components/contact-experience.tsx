import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './icons';
import { trackedOfficials } from '../lib/civic-database';
import { OfficialAvatar } from './official-avatar';

export function ContactExperience() {
  const [selectedOfficial, setSelectedOfficial] = useState(trackedOfficials[0].slug);
  const [topic, setTopic] = useState('Housing');
  const [stance, setStance] = useState<'Support' | 'Oppose' | 'Concern'>('Concern');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const official = trackedOfficials.find(o => o.slug === selectedOfficial)!;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDraft(`Dear ${official.title} ${official.name},\n\nAs a constituent in your district, I am writing to express my ${stance.toLowerCase()} regarding ${topic.toLowerCase()} issues in our community. I believe it is critical that we address these challenges with transparency and direct action.\n\nI expect your office to prioritize this and look forward to seeing your upcoming votes align with the needs of the community.\n\nSincerely,\n[Your Name]`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSend = () => {
    setIsSent(true);
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Icon name="message" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Citizen Action Center</h1>
              <p className="text-sm text-slate-500 font-medium">Draft and send AI-assisted messages to your representatives.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSent ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="check" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent Successfully</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Your message has been officially logged and sent to {official.title} {official.name}'s office at {official.email}.
            </p>
            <button 
              onClick={() => { setIsSent(false); setDraft(''); }}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">1. Select Official</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {trackedOfficials.slice(0, 8).map(o => (
                    <button
                      key={o.slug}
                      onClick={() => setSelectedOfficial(o.slug)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors border text-left ${
                        selectedOfficial === o.slug
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-transparent border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <OfficialAvatar official={o} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${selectedOfficial === o.slug ? 'text-blue-900' : 'text-slate-900'}`}>{o.name}</div>
                        <div className={`text-xs truncate ${selectedOfficial === o.slug ? 'text-blue-700' : 'text-slate-500'}`}>{o.title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">2. Configure Message</h3>
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Topic</label>
                  <select 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option>Housing & Zoning</option>
                    <option>Education Funding</option>
                    <option>Public Safety</option>
                    <option>Transportation</option>
                    <option>Environment</option>
                    <option>Healthcare</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Your Stance</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Support', 'Concern', 'Oppose'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setStance(s)}
                        className={`py-2 rounded-lg text-xs font-bold transition-colors border ${
                          stance === s
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 text-white font-bold text-sm px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> Generating Draft...</>
                  ) : (
                    <><Icon name="sparkles" size={16} /> Generate AI Draft</>
                  )}
                </button>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">3. Review & Send</h3>
                  {draft && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      Draft Ready
                    </span>
                  )}
                </div>

                {draft ? (
                  <>
                    <textarea 
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-800 font-medium leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[300px]"
                    />
                    
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <Icon name="info" size={14} />
                        Messages become public record.
                      </div>
                      <button 
                        onClick={handleSend}
                        className="bg-slate-900 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                      >
                        Send Official Message <Icon name="arrow-right" size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                      <Icon name="message" size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">No draft generated yet</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Configure your message on the left and click "Generate AI Draft" to create a professional letter.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
