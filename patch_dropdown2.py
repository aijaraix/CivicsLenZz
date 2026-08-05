import re
with open("src/components/search-experience.tsx", "r") as f:
    text = f.read()

target = """                {/* State Dropdown */}
                {level === 'State' && (
                 <div className="flex items-center ml-2">
                     <select 
                         className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 outline-none focus:border-blue-500 font-semibold"
                         onChange={(e) => {
                             const val = e.target.value;
                             if (val) {
                                 setSearch(val);
                                 setSubmittedAddress(val);
                             } else {
                                 setSearch("");
                                 setSubmittedAddress("");
                             }
                         }}
                     >
                         <option value="">All States</option>
                         <option value="Alabama">Alabama</option>
                         <option value="Alaska">Alaska</option>
                         <option value="Arizona">Arizona</option>
                         <option value="Arkansas">Arkansas</option>
                         <option value="California">California</option>
                         <option value="Colorado">Colorado</option>
                         <option value="Connecticut">Connecticut</option>
                         <option value="Delaware">Delaware</option>
                         <option value="Florida">Florida</option>
                         <option value="Georgia">Georgia</option>
                         <option value="Hawaii">Hawaii</option>
                         <option value="Idaho">Idaho</option>
                         <option value="Illinois">Illinois</option>
                         <option value="Indiana">Indiana</option>
                         <option value="Iowa">Iowa</option>
                         <option value="Kansas">Kansas</option>
                         <option value="Kentucky">Kentucky</option>
                         <option value="Louisiana">Louisiana</option>
                         <option value="Maine">Maine</option>
                         <option value="Maryland">Maryland</option>
                         <option value="Massachusetts">Massachusetts</option>
                         <option value="Michigan">Michigan</option>
                         <option value="Minnesota">Minnesota</option>
                         <option value="Mississippi">Mississippi</option>
                         <option value="Missouri">Missouri</option>
                         <option value="Montana">Montana</option>
                         <option value="Nebraska">Nebraska</option>
                         <option value="Nevada">Nevada</option>
                         <option value="New Hampshire">New Hampshire</option>
                         <option value="New Jersey">New Jersey</option>
                         <option value="New Mexico">New Mexico</option>
                         <option value="New York">New York</option>
                         <option value="North Carolina">North Carolina</option>
                         <option value="North Dakota">North Dakota</option>
                         <option value="Ohio">Ohio</option>
                         <option value="Oklahoma">Oklahoma</option>
                         <option value="Oregon">Oregon</option>
                         <option value="Pennsylvania">Pennsylvania</option>
                         <option value="Rhode Island">Rhode Island</option>
                         <option value="South Carolina">South Carolina</option>
                         <option value="South Dakota">South Dakota</option>
                         <option value="Tennessee">Tennessee</option>
                         <option value="Texas">Texas</option>
                         <option value="Utah">Utah</option>
                         <option value="Vermont">Vermont</option>
                         <option value="Virginia">Virginia</option>
                         <option value="Washington">Washington</option>
                         <option value="West Virginia">West Virginia</option>
                         <option value="Wisconsin">Wisconsin</option>
                         <option value="Wyoming">Wyoming</option>
                     </select>
                 </div>
                )}"""

text = text.replace(target, "")

# Now inject it back nicely BELOW the filters flex container
target2 = """             </div>
           </div>
        </div>
        {/* Main Split Layout */}"""

replacement2 = """             </div>
             
             {/* Secondary Filter Rows */}
             {level === 'State' && (
                 <div className="mt-4 flex flex-col md:flex-row gap-4 items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                     <span className="text-sm font-semibold text-slate-700">Filter by State:</span>
                     <select 
                         className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-semibold shadow-sm w-full md:w-auto min-w-[200px]"
                         value={submittedAddress}
                         onChange={(e) => {
                             const val = e.target.value;
                             if (val) {
                                 setSearch(val);
                                 setSubmittedAddress(val);
                             } else {
                                 setSearch("");
                                 setSubmittedAddress("");
                             }
                         }}
                     >
                         <option value="">-- Select a State --</option>
                         <option value="Alabama">Alabama</option>
                         <option value="Alaska">Alaska</option>
                         <option value="Arizona">Arizona</option>
                         <option value="Arkansas">Arkansas</option>
                         <option value="California">California</option>
                         <option value="Colorado">Colorado</option>
                         <option value="Connecticut">Connecticut</option>
                         <option value="Delaware">Delaware</option>
                         <option value="Florida">Florida</option>
                         <option value="Georgia">Georgia</option>
                         <option value="Hawaii">Hawaii</option>
                         <option value="Idaho">Idaho</option>
                         <option value="Illinois">Illinois</option>
                         <option value="Indiana">Indiana</option>
                         <option value="Iowa">Iowa</option>
                         <option value="Kansas">Kansas</option>
                         <option value="Kentucky">Kentucky</option>
                         <option value="Louisiana">Louisiana</option>
                         <option value="Maine">Maine</option>
                         <option value="Maryland">Maryland</option>
                         <option value="Massachusetts">Massachusetts</option>
                         <option value="Michigan">Michigan</option>
                         <option value="Minnesota">Minnesota</option>
                         <option value="Mississippi">Mississippi</option>
                         <option value="Missouri">Missouri</option>
                         <option value="Montana">Montana</option>
                         <option value="Nebraska">Nebraska</option>
                         <option value="Nevada">Nevada</option>
                         <option value="New Hampshire">New Hampshire</option>
                         <option value="New Jersey">New Jersey</option>
                         <option value="New Mexico">New Mexico</option>
                         <option value="New York">New York</option>
                         <option value="North Carolina">North Carolina</option>
                         <option value="North Dakota">North Dakota</option>
                         <option value="Ohio">Ohio</option>
                         <option value="Oklahoma">Oklahoma</option>
                         <option value="Oregon">Oregon</option>
                         <option value="Pennsylvania">Pennsylvania</option>
                         <option value="Rhode Island">Rhode Island</option>
                         <option value="South Carolina">South Carolina</option>
                         <option value="South Dakota">South Dakota</option>
                         <option value="Tennessee">Tennessee</option>
                         <option value="Texas">Texas</option>
                         <option value="Utah">Utah</option>
                         <option value="Vermont">Vermont</option>
                         <option value="Virginia">Virginia</option>
                         <option value="Washington">Washington</option>
                         <option value="West Virginia">West Virginia</option>
                         <option value="Wisconsin">Wisconsin</option>
                         <option value="Wyoming">Wyoming</option>
                     </select>
                 </div>
             )}
             
             {level === 'Local' && (
                 <div className="mt-4 flex flex-col md:flex-row gap-4 items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                     <span className="text-sm font-semibold text-slate-700">Filter by City/County:</span>
                     <select 
                         className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 font-semibold shadow-sm w-full md:w-auto min-w-[200px]"
                         value={submittedAddress}
                         onChange={(e) => {
                             const val = e.target.value;
                             if (val) {
                                 setSearch(val);
                                 setSubmittedAddress(val);
                             } else {
                                 setSearch("");
                                 setSubmittedAddress("");
                             }
                         }}
                     >
                         <option value="">-- Select a Municipality --</option>
                         <option value="Miami">Miami, FL</option>
                         <option value="Jacksonville">Jacksonville, FL</option>
                         <option value="San Francisco">San Francisco, CA</option>
                     </select>
                 </div>
             )}
           </div>
        </div>
        {/* Main Split Layout */}"""

text = text.replace(target2, replacement2)

with open("src/components/search-experience.tsx", "w") as f:
    f.write(text)
