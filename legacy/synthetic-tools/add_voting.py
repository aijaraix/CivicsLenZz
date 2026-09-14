import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

voting_panel = """
function VotingRecordPanel({ official }: { official: TrackedOfficial }) {
  if (!official.votingRecord || official.votingRecord.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">CONGRESSIONAL ACTION</span>
         <h2 className="text-xl font-bold text-slate-900">Voting Record</h2>
       </div>
       <div className="divide-y divide-slate-100">
         {official.votingRecord.map((vote, i) => (
           <div key={i} className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start">
             <div>
               <h4 className="font-bold text-slate-900 mb-1">{vote.bill}</h4>
               <span className="text-xs text-slate-500">{vote.date}</span>
             </div>
             <div className="flex gap-4 shrink-0">
               <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Official's Vote</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    vote.vote === 'Yea' ? 'bg-emerald-100 text-emerald-700' :
                    vote.vote === 'Nay' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>{vote.vote}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Result</span>
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700">{vote.result}</span>
               </div>
             </div>
           </div>
         ))}
       </div>
    </section>
  );
}
"""

text = text.replace("function BioPanel", voting_panel + "\nfunction BioPanel")

render_target = "<LegislationPanel official={official} />"
new_renders = """<LegislationPanel official={official} />
            <VotingRecordPanel official={official} />"""
            
text = text.replace(render_target, new_renders)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)

