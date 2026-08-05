import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# Add new panels before ScorePanel
new_panels = """
function BusinessEmpirePanel({ official }: { official: TrackedOfficial }) {
  if (!official.businessesOwned && !official.propertiesRealEstate) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">BUSINESS & ASSETS</span>
            <h2 className="text-xl font-bold text-slate-900">Commercial Empire & Real Estate</h2>
          </div>
          <Icon name="briefcase" size={20} className="text-slate-400" />
        </div>
      </div>
      
      {official.businessesOwned && official.businessesOwned.length > 0 && (
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Owned Businesses & Entities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {official.businessesOwned.map((biz, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900">{biz.name}</h4>
                  <span className="text-xs font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600">{biz.years}</span>
                </div>
                <div className="text-sm text-slate-600 mb-2">
                  <span className="font-semibold">Role:</span> {biz.role} &bull; <span className="font-semibold">Status:</span> {biz.status}
                </div>
                <p className="text-xs text-slate-500">{biz.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {official.propertiesRealEstate && official.propertiesRealEstate.length > 0 && (
        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Key Real Estate Holdings</h3>
          <div className="space-y-3">
            {official.propertiesRealEstate.map((prop, i) => (
              <div key={i} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-3">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{prop.name}</h4>
                  <span className="text-xs text-slate-500">{prop.location}</span>
                </div>
                <span className="font-mono text-sm text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">{prop.estimatedValue}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function LegalCompliancePanel({ official }: { official: TrackedOfficial }) {
  if (!official.legalHistory || official.legalHistory.length === 0) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">LEGAL</span>
            <h2 className="text-xl font-bold text-slate-900">Legal History & Proceedings</h2>
          </div>
          <Icon name="scale" size={20} className="text-slate-400" />
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {official.legalHistory.map((caseItem, i) => (
          <div key={i} className="p-6">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-900">{caseItem.caseName}</h4>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded">{caseItem.date}</span>
            </div>
            <div className="inline-block mb-3">
               <span className={`text-xs font-bold px-2 py-1 rounded-md ${caseItem.outcome.includes('liable') || caseItem.outcome.includes('Convicted') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                 Outcome: {caseItem.outcome}
               </span>
            </div>
            <p className="text-sm text-slate-600">{caseItem.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CampaignFinancePanel({ official }: { official: TrackedOfficial }) {
  if (!official.campaignFinance) return null;
  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-1 block">CAMPAIGN FINANCE</span>
            <h2 className="text-xl font-bold text-slate-900">Campaign War Chest</h2>
          </div>
          <Icon name="pie-chart" size={20} className="text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">As of {official.campaignFinance.asOf}</p>
      </div>
      
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        <div className="p-6 text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Raised</span>
          <span className="text-xl font-bold text-slate-900">${(official.campaignFinance.totalRaised / 1000000).toFixed(1)}M</span>
        </div>
        <div className="p-6 text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spent</span>
          <span className="text-xl font-bold text-slate-900">${(official.campaignFinance.totalSpent / 1000000).toFixed(1)}M</span>
        </div>
        <div className="p-6 text-center">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cash on Hand</span>
          <span className="text-xl font-bold text-emerald-600">${(official.campaignFinance.cashOnHand / 1000000).toFixed(1)}M</span>
        </div>
      </div>
      
      <div className="p-6 flex items-center gap-4">
        <div className="flex-1 h-3 rounded-full bg-slate-100 flex overflow-hidden">
           <div className="bg-blue-500 h-full" style={{width: `${official.campaignFinance.individualPercentage}%`}}></div>
           <div className="bg-purple-500 h-full" style={{width: `${official.campaignFinance.pacPercentage}%`}}></div>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Individuals ({official.campaignFinance.individualPercentage}%)</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> PACs ({official.campaignFinance.pacPercentage}%)</div>
        </div>
      </div>
    </section>
  );
}

function ScorePanel
"""
text = text.replace("function ScorePanel", new_panels)


# Update BioPanel to include Affiliations and Previous Offices
bio_match = re.search(r'\{official\.careerHistory.*?\</AccordionItem\>\s*\)', text, flags=re.DOTALL)
if bio_match:
    additions = """
        {official.previousOffices && official.previousOffices.length > 0 && (
          <AccordionItem title="Previous Elected Offices" icon="award">
             <ul className="space-y-3">
               {official.previousOffices.map((office, i) => (
                 <li key={i} className="flex justify-between items-center">
                   <span className="font-semibold text-slate-900 text-sm">{office.title}</span>
                   <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{office.years}</span>
                 </li>
               ))}
             </ul>
          </AccordionItem>
        )}
        
        {official.affiliations && official.affiliations.length > 0 && (
          <AccordionItem title="Memberships & Affiliations" icon="link">
             <ul className="space-y-2">
               {official.affiliations.map((aff, i) => (
                 <li key={i} className="flex flex-col text-sm">
                   <span className="font-semibold text-slate-800">{aff.organization}</span>
                   <span className="text-slate-500">{aff.role}</span>
                 </li>
               ))}
             </ul>
          </AccordionItem>
        )}
"""
    text = text.replace(bio_match.group(0), bio_match.group(0) + "\n" + additions)

# Update FinancialsPanel to include netWorth
fin_match = re.search(r'<h2 className="text-xl font-bold text-slate-900">Financials & Donors</h2>', text)
if fin_match:
    net_worth_block = """
      {official.netWorth && (
        <div className="px-6 py-4 border-b border-slate-100 bg-emerald-50/50 flex justify-between items-center">
           <div>
             <span className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-0.5">Estimated Net Worth</span>
             <span className="text-lg font-bold text-emerald-900">{official.netWorth}</span>
           </div>
           <Icon name="dollar-sign" size={24} className="text-emerald-300" />
        </div>
      )}
"""
    text = text.replace('      <div className="p-6 border-b border-slate-100">', '      <div className="p-6 border-b border-slate-100">')
    text = text.replace('      </div>\n      <div className="p-6">', '      </div>\n' + net_worth_block + '      <div className="p-6">')

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
