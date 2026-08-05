import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

exec_panel = """
function ExecutiveActionsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.executiveActions || official.executiveActions.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
       <div className="p-6 border-b border-slate-100 flex justify-between items-start">
         <div>
           <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">EXECUTIVE ACTION</span>
           <h2 className="text-xl font-bold text-slate-900">Executive Orders & Memorandums</h2>
         </div>
         <span className="text-2xl font-bold text-slate-900">{official.executiveActions.length} <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold text-right mt-1">Actions</span></span>
       </div>
       <div className="divide-y divide-slate-100">
         {official.executiveActions.map((action, i) => (
           <AccordionItem 
              key={i} 
              title={action.title}
              subtitle={`Date: ${action.date}`}
              icon="file-text"
              rightElement={<span className="text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200">{action.type}</span>}
            >
             <p className="mb-3 text-sm text-slate-700">{action.summary}</p>
             {action.url && (
               <a href={action.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  Source Document <Icon name="external-link" size={12} />
               </a>
             )}
           </AccordionItem>
         ))}
       </div>
       <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
         <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2 mx-auto">
            Load all historical actions <Icon name="chevron-down" size={14} />
         </button>
       </div>
    </section>
  );
}
"""

text = text.replace("function BioPanel", exec_panel + "\nfunction BioPanel")

render_target = "<AppointmentsPanel official={official} />"
new_renders = """<AppointmentsPanel official={official} />
            <ExecutiveActionsPanel official={official} />"""
text = text.replace(render_target, new_renders)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
