import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# 1. Update Profile Header Contact Info
header_search = r'<div className="profile-actions hidden sm:flex">.*?</div>'
header_match = re.search(header_search, text, flags=re.DOTALL)
if header_match:
    new_header = """
            <div className="profile-actions hidden sm:flex flex-col gap-2 shrink-0">
               <button className="btn-secondary"><Icon name="star" size={18} /> Follow</button>
            </div>
"""
    text = text.replace(header_match.group(0), new_header)

identity_copy_search = r'<div className="profile-identity-copy">.*?</div>'
identity_copy_match = re.search(identity_copy_search, text, flags=re.DOTALL)
if identity_copy_match:
    old_identity_copy = identity_copy_match.group(0)
    new_identity_copy = """<div className="profile-identity-copy flex-1">
              <h1 className="flex items-center gap-2">{official.name} <Icon name="check-circle" size={24} className="text-blue-600" /></h1>
              <p className="text-lg font-medium text-slate-700">{official.title}</p>
              <div className="flex gap-2 items-center mt-1 mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded ${official.party === 'Republican' ? 'bg-red-100 text-red-700' : official.party === 'Democratic' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{official.party}</span>
                <span className="text-sm font-semibold text-slate-500">{official.district}</span>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-slate-600 mb-4 border-l-2 border-slate-200 pl-3">
                {official.phone && (
                  <div className="flex items-center gap-2">
                    <Icon name="phone" size={14} className="text-slate-400" /> {official.phone}
                  </div>
                )}
                {official.email && (
                  <div className="flex items-center gap-2">
                    <Icon name="mail" size={14} className="text-slate-400" /> {official.email}
                  </div>
                )}
                {official.office && (
                  <div className="flex items-center gap-2">
                    <Icon name="building" size={14} className="text-slate-400" /> {official.office}
                  </div>
                )}
              </div>
              
              {official.socialMedia && official.socialMedia.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {official.socialMedia.map((social, i) => (
                    <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 shadow-sm">
                       <Icon name="external-link" size={14} className="text-slate-400" />
                       {social.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>"""
    text = text.replace(old_identity_copy, new_identity_copy)

# 2. Update PromisePanel
promise_search = r'function PromisePanel\(\{ official \}: \{ official: TrackedOfficial \}\) \{.*?\n\}'
promise_match = re.search(promise_search, text, flags=re.DOTALL)
if promise_match:
    old_promise = promise_match.group(0)
    new_promise = """function PromisePanel({ official }: { official: TrackedOfficial }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
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
      
      <div className="grid grid-cols-3 gap-2 mb-6 text-center">
        <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100">
          <span className="block text-xl font-bold text-emerald-700">8</span>
          <span className="block text-3xs font-bold text-emerald-600 uppercase tracking-wider">Kept</span>
        </div>
        <div className="bg-red-50 rounded-lg p-2 border border-red-100">
          <span className="block text-xl font-bold text-red-700">5</span>
          <span className="block text-3xs font-bold text-red-600 uppercase tracking-wider">Broken</span>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
          <span className="block text-xl font-bold text-blue-700">11</span>
          <span className="block text-3xs font-bold text-blue-600 uppercase tracking-wider">In Progress</span>
        </div>
      </div>
      
      {official.detailedPromises && official.detailedPromises.length > 0 ? (
        <div className="mt-auto">
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="w-full text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-2 px-4 flex items-center justify-between transition-colors"
          >
            <span>See detailed promises</span>
            <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} />
          </button>
          
          {expanded && (
            <div className="mt-4 space-y-3 pt-4 border-t border-slate-100">
              {official.detailedPromises.map((promise) => (
                <div key={promise.id} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-slate-900">{promise.title}</h4>
                    <span className={`text-3xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                      promise.status === 'Kept' ? 'bg-emerald-100 text-emerald-700' :
                      promise.status === 'Broken' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {promise.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{promise.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500 italic text-center mt-auto">Detailed promises not available.</p>
      )}
    </section>
  );
}"""
    text = text.replace(old_promise, new_promise)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)

