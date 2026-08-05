import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Remove global-audit-notice-strip (roughly lines 427-447)
# It starts with: {/* 1. Global Transparencey Notice Strip */}
# and ends right before {/* 2. Main High-Density Header Column
content = re.sub(
    r"\{\/\* 1\. Global Transparencey Notice Strip \*\/\}.*?\{\/\* 2\. Main High-Density Header Column \(Replicating civicslenz\.com branding\) \*\/\}",
    r"{/* 1. Main High-Density Header Column */}",
    content,
    flags=re.DOTALL
)

# 2. Add 'Hermes Monitor' button to header
# We will inject it right next to "Find Officials"
header_links = r"""<button onClick={() => setActiveTab("identify")} className={`hover:text-blue-600 transition ${activeTab === 'identify' ? 'text-blue-600 font-semibold' : ''}`}>"""
new_header_links = r"""<button onClick={() => setActiveTab("scrapers")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition mr-2 ${activeTab === 'scrapers' ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white' : ''}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Hermes Monitor
            </button>
            <button onClick={() => setActiveTab("identify")} className={`hover:text-blue-600 transition ${activeTab === 'identify' ? 'text-blue-600 font-semibold' : ''}`}>"""
content = content.replace(header_links, new_header_links)

# 3. Move data-completeness-dashboard from Home to Scrapers
# Find the completeness dashboard
dashboard_start = "{/* Data Completeness & Indexing Gaps Dashboard */}"
dashboard_end_regex = r"\{\/\* Data Completeness & Indexing Gaps Dashboard \*\/\}.*?\{\/\* ==================== TAB 1: DIRECTORY / DISCOVERY VIEW ==================== \*\/\}"

match = re.search(dashboard_end_regex, content, flags=re.DOTALL)
if match:
    dashboard_content_full = match.group(0)
    # The dashboard_content_full includes the closing div for home tab:
    #           </div>
    #         )}
    # Let's extract just the dashboard part.
    dashboard_extract_regex = r"(\{\/\* Data Completeness & Indexing Gaps Dashboard \*\/\}.*?</div>\s*</div>\s*</div>)\s*</div>\s*\)\}\s*\{\/\* ==================== TAB 1"
    dashboard_match = re.search(dashboard_extract_regex, content, flags=re.DOTALL)
    if dashboard_match:
        dashboard_content = dashboard_match.group(1)
        
        # Remove it from home
        content = content.replace(dashboard_content, "")
        
        # Insert it into scrapers tab, at the very end before its closing div
        # Find scrapers tab end
        scrapers_end = r"\{\/\* ==================== TAB 7: SYSTEM SPECS ==================== \*\/\}"
        # We need to insert right before the closing divs of scrapers
        # The scrapers tab is structurally:
        #           </div>
        #         )}
        #         {/* TAB 7
        
        scrapers_insert = dashboard_content + "\n\n          </div>\n        )}\n\n        {/* ==================== TAB 7: SYSTEM SPECS ==================== */}"
        content = re.sub(r"          </div>\n        \)\}\n\n        \{\/\* ==================== TAB 7: SYSTEM SPECS ==================== \*\/\}", scrapers_insert, content)


with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done")
