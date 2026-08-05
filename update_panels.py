import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# Update ProfileExperience component to include LegislationPanel
profile_experience_match = re.search(r'<ControversyPanel official=\{official\} />\s*</div>', text)
if profile_experience_match:
    new_profile_experience = """<LegislationPanel official={official} />
            <ControversyPanel official={official} />
          </div>"""
    text = text[:profile_experience_match.start()] + new_profile_experience + text[profile_experience_match.end():]

# Update ScorePanel
score_panel_match = re.search(r'function ScorePanel.*?</section>\s*\}', text, flags=re.DOTALL)
if score_panel_match:
    new_score_panel = """function ScorePanel({ official }: { official: TrackedOfficial }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">AI ACCOUNTABILITY SCORE</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold text-slate-900">{official.score}</span>
              <span className="text-sm font-semibold text-slate-500">/100</span>
            </div>
          </div>
          <span className={`text-3xs font-mono font-bold px-2 py-1 rounded uppercase tracking-widest border ${official.score >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : official.score >= 60 ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>
            {official.score >= 80 ? 'High' : official.score >= 60 ? 'Moderate' : 'Needs Improvement'}
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-6">Measured across votes, public commitments, transparency signals, and source coverage.</p>
        <div className="mb-4">
          <SparkChart />
        </div>
      </div>
      
      {official.scoreBreakdown && official.scoreBreakdown.length > 0 && (
        <div className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50">
           <div className="p-4 pb-2">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score Breakdown</h3>
           </div>
           {official.scoreBreakdown.map((factor, i) => (
             <AccordionItem 
                key={i} 
                title={factor.category}
                rightElement={<span className={`text-xs font-bold ${factor.impact > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{factor.impact > 0 ? '+' : ''}{factor.impact}</span>}
              >
               <p className="mb-2">{factor.description}</p>
               <a href={factor.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  View Data Source <Icon name="external-link" size={12} />
               </a>
             </AccordionItem>
           ))}
        </div>
      )}
    </section>
  );
}"""
    text = text[:score_panel_match.start()] + new_score_panel + text[score_panel_match.end():]

# Update PromisePanel
promise_panel_match = re.search(r'function PromisePanel.*?</section>\s*\}', text, flags=re.DOTALL)
if promise_panel_match:
    new_promise_panel = """function PromisePanel({ official }: { official: TrackedOfficial }) {
  const kept = official.detailedPromises?.filter(p => p.status === 'Kept').length || 0;
  const broken = official.detailedPromises?.filter(p => p.status === 'Broken').length || 0;
  const inProgress = official.detailedPromises?.filter(p => p.status === 'In Progress').length || 0;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">PROMISE TRACKER</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-display font-bold text-slate-900">{official.promises}</span>
              <span className="text-sm font-semibold text-slate-500">tracked</span>
            </div>
          </div>
          <Icon name="target" size={24} className="text-slate-400" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-center mb-2">
          <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
            <span className="block text-xl font-bold text-emerald-700">{kept}</span>
            <span className="block text-3xs font-bold text-emerald-600 uppercase tracking-wider">Kept</span>
          </div>
          <div className="bg-red-50 rounded-lg p-2 border border-red-100">
            <span className="block text-xl font-bold text-red-700">{broken}</span>
            <span className="block text-3xs font-bold text-red-600 uppercase tracking-wider">Broken</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
            <span className="block text-xl font-bold text-blue-700">{inProgress}</span>
            <span className="block text-3xs font-bold text-blue-600 uppercase tracking-wider">In Progress</span>
          </div>
        </div>
      </div>
      
      {official.detailedPromises && official.detailedPromises.length > 0 && (
        <div className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50">
           <div className="p-4 pb-2 flex justify-between items-center">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Detailed Promises</h3>
           </div>
           {official.detailedPromises.map((promise) => (
             <AccordionItem 
                key={promise.id} 
                title={promise.title}
                subtitle={`Tracked since: ${promise.date}`}
                rightElement={<span className={`text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  promise.status === 'Kept' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  promise.status === 'Broken' ? 'bg-red-50 text-red-700 border-red-200' :
                  promise.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>{promise.status}</span>}
              >
               <p className="mb-3 text-sm text-slate-700">{promise.description}</p>
               <a href={promise.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  Source: {promise.sourceLabel} <Icon name="external-link" size={12} />
               </a>
             </AccordionItem>
           ))}
        </div>
      )}
    </section>
  );
}"""
    text = text[:promise_panel_match.start()] + new_promise_panel + text[promise_panel_match.end():]

# Add LegislationPanel before BioPanel
bio_panel_match = re.search(r'function BioPanel', text)
if bio_panel_match:
    new_legislation_panel = """function LegislationPanel({ official }: { official: TrackedOfficial }) {
  if (!official.detailedLegislation || official.detailedLegislation.length === 0) return null;
  
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
       <div className="p-6 border-b border-slate-100 flex justify-between items-start">
        <div>
          <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">LEGISLATION & ACTION</span>
          <h2 className="text-xl font-bold text-slate-900">Bills, Resolutions, and Executive Orders</h2>
        </div>
        <span className="text-2xl font-bold text-slate-900">{official.bills} <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold text-right mt-1">Actions</span></span>
      </div>
      
      <div className="divide-y divide-slate-100">
         {official.detailedLegislation.map((leg) => (
           <AccordionItem 
              key={leg.id} 
              title={leg.title}
              subtitle={`Date: ${leg.date}`}
              icon="file-text"
              rightElement={<span className={`text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                leg.action.includes('Yes') || leg.action === 'Signed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                leg.action.includes('No') || leg.action === 'Vetoed' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>{leg.action}</span>}
            >
             <p className="mb-3 text-sm text-slate-700">{leg.summary}</p>
             <a href={leg.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                Source: {leg.sourceLabel} <Icon name="external-link" size={12} />
             </a>
           </AccordionItem>
         ))}
      </div>
    </section>
  );
}

"""
    text = text[:bio_panel_match.start()] + new_legislation_panel + text[bio_panel_match.end():]

# OverviewPanel to include Approval Rating
overview_match = re.search(r'function OverviewPanel.*?</section>\s*\}', text, flags=re.DOTALL)
if overview_match:
    new_overview = """function OverviewPanel({ official }: { official: TrackedOfficial }) {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">ABOUT</span>
            <h2 className="text-xl font-bold text-slate-900">Public profile overview</h2>
          </div>
          <Icon name="user" size={20} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-600 mb-6">{official.detail} This record aggregates verified biography, district context, and professional experience.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">District / State</span>
            <span className="font-semibold text-slate-900">{official.district}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current office</span>
            <span className="font-semibold text-slate-900">{official.title}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Next election</span>
            <span className="font-semibold text-slate-900">{official.nextElection}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Profile status</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1"><Icon name="check-circle" size={14} /> Verified</span>
          </div>
        </div>
        
        {official.approvalRating && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3 block">Latest Approval Rating</h3>
            <div className="flex items-center gap-6">
               <div className="flex-1 max-w-md">
                 <div className="flex justify-between text-sm mb-1">
                   <span className="font-semibold text-emerald-700">Approve ({official.approvalRating.approve}%)</span>
                   <span className="font-semibold text-red-700">Disapprove ({official.approvalRating.disapprove}%)</span>
                 </div>
                 <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{width: `${official.approvalRating.approve}%`}}></div>
                    <div className="h-full bg-red-500" style={{width: `${official.approvalRating.disapprove}%`}}></div>
                 </div>
               </div>
               <div className="text-xs text-slate-500">
                 Source: <a href={official.approvalRating.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{new URL(official.approvalRating.source).hostname}</a><br/>
                 As of {official.approvalRating.date}
               </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-slate-50 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-200">
        <div><span className="block text-2xl font-bold text-slate-900">{official.votes}</span><span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">Votes Cast</span></div>
        <div><span className="block text-2xl font-bold text-slate-900">{official.bills}</span><span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">Bills Sponsored</span></div>
        <div><span className="block text-2xl font-bold text-slate-900">{official.promises}</span><span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">Promises Tracked</span></div>
        <div><span className="block text-2xl font-bold text-slate-900">3%</span><span className="block text-xs font-bold text-slate-500 tracking-wider uppercase mt-1">Missed Votes</span></div>
      </div>
    </section>
  );
}"""
    text = text[:overview_match.start()] + new_overview + text[overview_match.end():]


with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
