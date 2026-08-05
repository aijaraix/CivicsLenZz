import re

with open("src/components/profile-experience.tsx", "r") as f:
    text = f.read()

# Replace the prototype label at the top with an active live stream label
old_label = """<div className="prototype-label profile-prototype"><Icon name="sparkles" size={15} /> Continuous profile · All data points, graphs, voting, financials, and AI validated pictures are visible at a glance.</div>"""
new_label = """<div className="prototype-label profile-prototype" style={{ backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2" style={{ display: 'inline-block' }}></span>
        <b>LIVE STREAM ACTIVE</b> <span style={{ opacity: 0.8, marginLeft: '6px' }}>· Profile is continuously updating with verified data from 8 active Hermes nodes (Identity, Finance, Voting, etc).</span>
      </div>"""
text = text.replace(old_label, new_label)

# Update the identity validation section header
old_identity = """<span className="profile-panel-stat text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-xs">Hermes Identity Node Active</span>"""
new_identity = """<span className="profile-panel-stat text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-xs flex items-center gap-1.5 font-mono uppercase tracking-tight">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Node H-ETA Active
        </span>"""
text = text.replace(old_identity, new_identity)

# Update the financials section header
old_finance = """<Icon name="chart" size={22} />"""
new_finance = """<span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-xs flex items-center gap-1.5 font-mono uppercase tracking-tight">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Node H-THETA Active
        </span>"""
text = text.replace(old_finance, new_finance)

with open("src/components/profile-experience.tsx", "w") as f:
    f.write(text)
