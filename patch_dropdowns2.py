import re
with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

target = """                ))}
             </div>
           </div>
        </div>
        {/* Main Split Layout */}"""

replacement = """                ))}
             </div>
           </div>
        </div>

        {/* Secondary Filter Rows */}
        {level === 'State' && (
            <div className="mb-8 max-w-4xl flex flex-col md:flex-row gap-4 items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <span className="text-sm font-semibold text-slate-700">Filter by State:</span>
                <select 
                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold shadow-sm w-full md:w-auto min-w-[200px]"
                    value={submittedAddress}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSearch(val);
                        setSubmittedAddress(val);
                    }}
                >
                    <option value="">-- All States --</option>
                    <option value="California">California</option>
                    <option value="Florida">Florida</option>
                    <option value="Texas">Texas</option>
                    <option value="New York">New York</option>
                    <option value="Pennsylvania">Pennsylvania</option>
                    <option value="Illinois">Illinois</option>
                    <option value="Ohio">Ohio</option>
                    <option value="Georgia">Georgia</option>
                    <option value="North Carolina">North Carolina</option>
                    <option value="Michigan">Michigan</option>
                </select>
            </div>
        )}
        
        {level === 'Local' && (
            <div className="mb-8 max-w-4xl flex flex-col md:flex-row gap-4 items-center bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <span className="text-sm font-semibold text-slate-700">Filter by City/County:</span>
                <select 
                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold shadow-sm w-full md:w-auto min-w-[200px]"
                    value={submittedAddress}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSearch(val);
                        setSubmittedAddress(val);
                    }}
                >
                    <option value="">-- All Municipalities --</option>
                    <option value="Miami, FL">Miami, FL</option>
                    <option value="Miami Beach, FL">Miami Beach, FL</option>
                    <option value="Jacksonville, FL">Jacksonville, FL</option>
                    <option value="San Francisco, CA">San Francisco, CA</option>
                    <option value="Los Angeles, CA">Los Angeles, CA</option>
                    <option value="New York, NY">New York, NY</option>
                    <option value="Chicago, IL">Chicago, IL</option>
                </select>
            </div>
        )}

        {/* Main Split Layout */}"""

text = text.replace(target, replacement)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
