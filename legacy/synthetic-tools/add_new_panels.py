import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# Add AI Analysis Panel
ai_panel = """
function AIAnalysisPanel({ official }: { official: TrackedOfficial }) {
  if (!official.aiAnalysis) return null;
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm mb-6 text-slate-300">
      <div className="p-6 border-b border-slate-800 bg-slate-950/50">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase mb-1 block flex items-center gap-2"><Icon name="sparkles" size={14} /> AI INTELLIGENCE</span>
            <h2 className="text-xl font-bold text-white">Political Profile Analysis</h2>
          </div>
          <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-mono font-semibold border border-blue-500/20">AUTO-GENERATED</div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Ideology Profile</h3>
           <p className="text-white text-lg">{official.aiAnalysis.ideologyProfile}</p>
        </div>
        <div>
           <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Leadership Style</h3>
           <p className="text-white text-lg">{official.aiAnalysis.leadershipStyle}</p>
        </div>
        <div className="flex gap-4 col-span-1 md:col-span-2">
          <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-purple-400 mb-1">{official.aiAnalysis.bipartisanScore}/100</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Bipartisan Score</span>
          </div>
          <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-center items-center">
            <span className="text-3xl font-bold text-emerald-400 mb-1">{official.aiAnalysis.transparencyScore}/100</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Transparency Score</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function PoliticalPositionsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.politicalPositions || official.politicalPositions.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">POLICY & STANCES</span>
         <h2 className="text-xl font-bold text-slate-900">Political Positions</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {official.politicalPositions.map((pos, i) => (
          <div key={i} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
               <h4 className="font-bold text-slate-900">{pos.issue}</h4>
               <span className="inline-block mt-1 bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded">{pos.stance}</span>
            </div>
            <div className="md:col-span-3 text-sm text-slate-600">
               {pos.history}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelinePanel({ official }: { official: TrackedOfficial }) {
  if (!official.timeline || official.timeline.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">HISTORY</span>
         <h2 className="text-xl font-bold text-slate-900">Event Timeline</h2>
      </div>
      <div className="p-6 relative">
         <div className="absolute left-[39px] top-6 bottom-6 w-0.5 bg-slate-200"></div>
         <div className="space-y-6">
           {official.timeline.map((event, i) => (
             <div key={i} className="flex gap-4 relative z-10">
                <div className="w-4 h-4 rounded-full bg-white border-4 border-blue-500 mt-1 shrink-0"></div>
                <div>
                   <span className="text-xs font-bold text-slate-500">{event.date}</span>
                   <p className="text-slate-900 font-medium">{event.event}</p>
                   <span className="text-xs text-slate-400 uppercase tracking-wider">{event.category}</span>
                </div>
             </div>
           ))}
         </div>
      </div>
    </section>
  );
}

function AppointmentsPanel({ official }: { official: TrackedOfficial }) {
  if (!official.appointments || official.appointments.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="p-6 border-b border-slate-100">
         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">EXECUTIVE ACTION</span>
         <h2 className="text-xl font-bold text-slate-900">Key Appointments</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {official.appointments.map((app, i) => (
          <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
             <div className="flex justify-between items-start mb-1">
               <h4 className="font-bold text-slate-900">{app.name}</h4>
               <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">{app.status}</span>
             </div>
             <p className="text-sm text-slate-600">{app.position}</p>
             <p className="text-xs text-slate-400 mt-2">{app.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
"""

text = text.replace("function AIAnalysisPanel", "") # just in case
text = text.replace("function ScorePanel", ai_panel + "\nfunction ScorePanel")


render_target = "<OverviewPanel official={official} />"
new_renders = """<AIAnalysisPanel official={official} />
            <OverviewPanel official={official} />
            <TimelinePanel official={official} />
            <PoliticalPositionsPanel official={official} />
            <AppointmentsPanel official={official} />"""

text = text.replace(render_target, new_renders)


# Add more detailed Bio properties to BioPanel
bio_match = re.search(r'function BioPanel.*?return \(.*?</section>\s*\);', text, flags=re.DOTALL)
if bio_match:
    old_bio = bio_match.group(0)
    
    # We want to replace the first Accordion item that just has text, or add basic info above accordions.
    info_block = """
      <div className="p-6 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 text-sm">
        {official.fullLegalName && (<div><span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Legal Name</span><span className="font-medium text-slate-900">{official.fullLegalName}</span></div>)}
        {official.dateOfBirth && (<div><span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</span><span className="font-medium text-slate-900">{official.dateOfBirth}</span></div>)}
        {official.placeOfBirth && (<div><span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Place of Birth</span><span className="font-medium text-slate-900">{official.placeOfBirth}</span></div>)}
        {official.nationality && (<div><span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nationality</span><span className="font-medium text-slate-900">{official.nationality}</span></div>)}
        {official.militaryService && (<div><span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Military Service</span><span className="font-medium text-slate-900">{official.militaryService}</span></div>)}
        {official.nicknames && official.nicknames.length > 0 && (<div><span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Also Known As</span><span className="font-medium text-slate-900">{official.nicknames.join(', ')}</span></div>)}
      </div>
"""
    new_bio = old_bio.replace('<div className="accordion divide-y divide-slate-100 border-t border-slate-100">', info_block + '<div className="accordion divide-y divide-slate-100 border-t border-slate-100">')
    
    
    
    edu_fam = """
        {official.education && official.education.length > 0 && (
          <AccordionItem title="Education" icon="book">
             <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
               {official.education.map((edu, i) => <li key={i}>{edu}</li>)}
             </ul>
          </AccordionItem>
        )}
        {official.family && official.family.length > 0 && (
          <AccordionItem title="Family" icon="users">
             <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
               {official.family.map((member, i) => <li key={i}>{member}</li>)}
             </ul>
          </AccordionItem>
        )}
"""
    new_bio = new_bio.replace('{official.careerHistory &&', edu_fam + '{official.careerHistory &&')
    text = text.replace(old_bio, new_bio)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
