import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

new_panels = """
function ElectionHistoryPanel({ official }: { official: TrackedOfficial }) {
  if (!official.electionHistory || official.electionHistory.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">DEMOCRATIC RECORD</span>
         <h2 className="text-xl font-bold text-slate-900">Election History</h2>
       </div>
       <div className="divide-y divide-slate-100">
         {official.electionHistory.map((election, i) => (
           <div key={i} className="p-6 flex justify-between items-center">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <h4 className="font-bold text-slate-900">{election.year} - {election.office}</h4>
                 <span className={`text-xs font-bold px-2 py-0.5 rounded ${election.outcome === 'Won' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{election.outcome}</span>
               </div>
               <span className="text-sm text-slate-600">Opponents: {election.opponents.join(', ')}</span>
             </div>
             <div className="text-right">
               <span className="block text-xl font-bold text-slate-900">{election.votePercentage}</span>
               <span className="text-xs text-slate-500 uppercase tracking-wider">Vote Share</span>
             </div>
           </div>
         ))}
       </div>
    </section>
  );
}

function FactChecksPanel({ official }: { official: TrackedOfficial }) {
  if (!official.factChecks || official.factChecks.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">VERIFICATION</span>
         <h2 className="text-xl font-bold text-slate-900">Recent Fact Checks</h2>
       </div>
       <div className="divide-y divide-slate-100">
         {official.factChecks.map((fact, i) => (
           <div key={i} className="p-6">
             <div className="flex justify-between items-start mb-2">
               <h4 className="font-bold text-slate-900 text-sm">"{fact.claim}"</h4>
               <span className={`text-xs font-bold px-2 py-1 rounded shrink-0 ${
                 fact.rating.toLowerCase().includes('false') ? 'bg-red-100 text-red-700' : 
                 fact.rating.toLowerCase().includes('true') ? 'bg-emerald-100 text-emerald-700' : 
                 'bg-amber-100 text-amber-700'
               }`}>{fact.rating}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Source: <span className="font-semibold">{fact.source}</span></span>
                <span className="text-slate-400">{fact.date}</span>
             </div>
           </div>
         ))}
       </div>
    </section>
  );
}

function PublicStatementsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.publicStatements || official.publicStatements.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">COMMUNICATIONS</span>
         <h2 className="text-xl font-bold text-slate-900">Public Statements & Speeches</h2>
       </div>
       <div className="p-6 space-y-4">
         {official.publicStatements.map((stmt, i) => (
           <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
             <div className="flex justify-between items-start mb-2">
               <h4 className="font-bold text-slate-900 text-sm">{stmt.title}</h4>
               <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">{stmt.type}</span>
             </div>
             <p className="text-sm text-slate-600 mb-2">{stmt.summary}</p>
             <div className="flex justify-between items-center">
               <span className="text-xs font-medium text-slate-500">{stmt.date}</span>
               {stmt.url && <a href={stmt.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">Transcript <Icon name="external-link" size={12} /></a>}
             </div>
           </div>
         ))}
       </div>
    </section>
  );
}

function NetworkPanel({ official }: { official: TrackedOfficial }) {
  if (!official.relationships || official.relationships.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">CONNECTIONS</span>
         <h2 className="text-xl font-bold text-slate-900">Key Relationships & Staff</h2>
       </div>
       <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
           <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Key Staff</h3>
           <ul className="space-y-3">
             {official.keyStaff?.map((staff, i) => (
               <li key={i} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0">
                 <span className="font-semibold text-slate-900">{staff.name}</span>
                 <span className="text-slate-500">{staff.role}</span>
               </li>
             ))}
           </ul>
         </div>
         <div>
           <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">Notable Relationships</h3>
           <ul className="space-y-3">
             {official.relationships.map((rel, i) => (
               <li key={i} className="text-sm border-b border-slate-100 pb-2 last:border-0">
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-semibold text-slate-900">{rel.name}</span>
                   <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-medium border border-blue-100">{rel.relationType}</span>
                 </div>
                 <p className="text-xs text-slate-500">{rel.description}</p>
               </li>
             ))}
           </ul>
         </div>
       </div>
    </section>
  );
}

function PublicOpinionPanel({ official }: { official: TrackedOfficial }) {
  if (!official.approvalRating) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">POLLING & SENTIMENT</span>
         <h2 className="text-xl font-bold text-slate-900">Public Opinion</h2>
       </div>
       <div className="p-6">
         <div className="flex items-center gap-6 mb-4">
           <div className="flex-1">
             <div className="flex justify-between items-end mb-2">
               <span className="text-3xl font-bold text-emerald-600">{official.approvalRating.approve}%</span>
               <span className="text-3xl font-bold text-red-600">{official.approvalRating.disapprove}%</span>
             </div>
             <div className="w-full h-3 rounded-full flex overflow-hidden">
               <div className="bg-emerald-500 h-full" style={{width: `${official.approvalRating.approve}%`}}></div>
               <div className="bg-slate-200 h-full" style={{width: `${100 - official.approvalRating.approve - official.approvalRating.disapprove}%`}}></div>
               <div className="bg-red-500 h-full" style={{width: `${official.approvalRating.disapprove}%`}}></div>
             </div>
             <div className="flex justify-between mt-2 text-xs font-bold uppercase tracking-wider">
               <span className="text-emerald-700">Approve</span>
               <span className="text-slate-400">Undecided</span>
               <span className="text-red-700">Disapprove</span>
             </div>
           </div>
         </div>
         <p className="text-xs text-slate-500 text-center">Source: <a href={official.approvalRating.source} className="underline" target="_blank" rel="noreferrer">Gallup / Polling Average</a> (As of {official.approvalRating.date})</p>
       </div>
    </section>
  );
}
"""

text = text.replace("function BioPanel", new_panels + "\nfunction BioPanel")

render_target = "<TimelinePanel official={official} />"
new_renders = """<TimelinePanel official={official} />
            <ElectionHistoryPanel official={official} />
            <PublicOpinionPanel official={official} />"""
text = text.replace(render_target, new_renders)

render_target2 = "<AppointmentsPanel official={official} />"
new_renders2 = """<AppointmentsPanel official={official} />
            <NetworkPanel official={official} />
            <PublicStatementsPanel official={official} />
            <FactChecksPanel official={official} />"""
text = text.replace(render_target2, new_renders2)


with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)

