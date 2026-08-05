import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# Modify OverviewPanel
# We will show the biography paragraphs if they exist, otherwise fallback to detail.
overview_match = re.search(r'function OverviewPanel.*?</section>\s*\}', text, flags=re.DOTALL)
if overview_match:
    old_overview = overview_match.group(0)
    
    bio_content = """        {official.biography && official.biography.length > 0 ? (
          <div className="text-sm text-slate-700 mb-6 space-y-3">
            {official.biography.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600 mb-6">{official.detail} This record aggregates verified biography, district context, and professional experience.</p>
        )}"""
    
    new_overview = old_overview.replace(
        '<p className="text-sm text-slate-600 mb-6">{official.detail} This record aggregates verified biography, district context, and professional experience.</p>',
        bio_content
    )
    
    # Add Social Media block
    social_media_content = """
        {official.socialMedia && official.socialMedia.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block w-full">Official Platforms</span>
            {official.socialMedia.map((sm, idx) => (
              <a key={idx} href={sm.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-xs font-semibold">
                 <Icon name="globe" size={14} /> {sm.platform}: {sm.handle}
              </a>
            ))}
          </div>
        )}
"""
    
    new_overview = new_overview.replace('        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">', social_media_content + '        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">')

    text = text.replace(old_overview, new_overview)

# Modify BioPanel to include careerHistory and endorsements and keyStaff
bio_match = re.search(r'function BioPanel.*?</section>\s*\}', text, flags=re.DOTALL)
if bio_match:
    old_bio = bio_match.group(0)
    
    career_and_staff = """
        {official.careerHistory && official.careerHistory.length > 0 && (
          <AccordionItem title="Professional Experience" icon="building">
             <ul className="space-y-3">
               {official.careerHistory.map((job, i) => (
                 <li key={i} className="flex flex-col">
                   <span className="font-semibold text-slate-900">{job.role}</span>
                   <span className="text-sm text-slate-600">{job.organization} <span className="text-slate-400">|</span> {job.years}</span>
                 </li>
               ))}
             </ul>
          </AccordionItem>
        )}
        
        {official.keyStaff && official.keyStaff.length > 0 && (
          <AccordionItem title="Key Staff & Cabinet" icon="users">
             <ul className="space-y-2">
               {official.keyStaff.map((staff, i) => (
                 <li key={i} className="flex justify-between items-center text-sm">
                   <span className="font-semibold text-slate-800">{staff.name}</span>
                   <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs">{staff.role}</span>
                 </li>
               ))}
             </ul>
          </AccordionItem>
        )}

        {official.endorsements && official.endorsements.length > 0 && (
          <AccordionItem title="Key Endorsements" icon="check-circle">
             <ul className="space-y-1">
               {official.endorsements.map((end, i) => (
                 <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                   <span className={`w-2 h-2 rounded-full ${end.type === 'Organization' ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                   {end.name} <span className="text-xs text-slate-400 italic">({end.type})</span>
                 </li>
               ))}
             </ul>
          </AccordionItem>
        )}
"""
    new_bio = old_bio.replace(
        '      <div className="divide-y divide-slate-100">',
        '      <div className="divide-y divide-slate-100">\n' + career_and_staff
    )
    
    text = text.replace(old_bio, new_bio)

# Modify FinancialsPanel
fin_match = re.search(r'function FinancialsPanel.*?</section>\s*\}', text, flags=re.DOTALL)
if fin_match:
    old_fin = fin_match.group(0)
    
    fin_disclosures = """
      {official.financialDisclosures && official.financialDisclosures.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Personal Financial Disclosures</h3>
          <div className="space-y-3">
             {official.financialDisclosures.map((asset, i) => (
               <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                 <div>
                   <span className="block font-semibold text-sm text-slate-900">{asset.asset}</span>
                   <span className="block text-xs text-slate-500">Reported Year: {asset.year}</span>
                 </div>
                 <span className="font-mono text-sm text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{asset.valueRange}</span>
               </div>
             ))}
          </div>
        </div>
      )}
"""
    new_fin = old_fin.replace(
        '    </section>',
        fin_disclosures + '    </section>'
    )
    text = text.replace(old_fin, new_fin)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
