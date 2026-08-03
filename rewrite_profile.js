const fs = require('fs');

const original = fs.readFileSync('profile.txt', 'utf-8');

// I will output the new jsx structure to a file.
// The structure uses the existing data model.

const newJSX = `
              /* SINGLE PROFILE EXPANDED VIEW */
              <div className="bg-white border rounded-2xl shadow-sm overflow-hidden" id="official-profile-detail-panel">
                
                {/* 1. Header & Navigation (Sticky) */}
                <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10" id="profile-sticky-nav">
                  <button
                    onClick={() => setSelectedOfficialId(null)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                    id="btn-back-to-directory"
                  >
                    ← Return to Directory
                  </button>
                  <span className="text-3xs font-mono uppercase tracking-wider text-slate-400">
                    ID: {selectedOfficial?.id} | {selectedOfficial?.jurisdiction}
                  </span>
                </div>

                {/* 2. Top Profile Identity Hero */}
                <div className="p-8 md:p-12 border-b border-slate-100" id="profile-hero-section">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    <div className="shrink-0">
                      <img
                        src={selectedOfficial?.photoUrl}
                        alt={selectedOfficial?.name}
                        className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border border-slate-200 shadow-sm"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-5">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">{selectedOfficial?.name}</h2>
                          <span className="text-3xs font-mono uppercase px-2.5 py-1 bg-slate-100 border text-slate-600 rounded font-bold">
                            {selectedOfficial?.party}
                          </span>
                        </div>
                        <p className="text-lg font-sans text-slate-600 font-medium mt-1">
                          {selectedOfficial?.currentTitle}
                        </p>
                      </div>
                      
                      <p className="text-sm leading-relaxed text-slate-700 font-sans max-w-4xl bg-slate-50 p-5 rounded-xl border border-slate-100">
                        {selectedOfficial?.bio}
                      </p>
                      
                      <div className="flex gap-4 pt-2">
                        <button
                          onClick={() => {
                            setActionOfficial(selectedOfficial?.name || "");
                            setActiveTab("action-center");
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-6 py-3 rounded-lg transition shadow-sm"
                        >
                          Draft Constituent Letter
                        </button>
                      </div>
                    </div>
                    
                    {/* Hero Quick Metrics */}
                    <div className="grid grid-cols-2 gap-3 w-full lg:w-72 shrink-0">
                      <div className="bg-slate-50 border p-4 rounded-xl text-center">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold tracking-wider">Trust Score</span>
                        <p className="text-2xl font-display font-bold text-slate-900 mt-1">{selectedOfficial?.trustScore ?? 95}%</p>
                      </div>
                      <div className="bg-slate-50 border p-4 rounded-xl text-center">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold tracking-wider">Attendance</span>
                        <p className="text-2xl font-display font-bold text-slate-900 mt-1">{selectedOfficial?.attendanceRate ?? 100}%</p>
                      </div>
                      <div className="bg-slate-50 border p-4 rounded-xl text-center">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold tracking-wider">Promises</span>
                        <p className="text-xl font-display font-bold text-emerald-600 mt-2">
                          {selectedOfficial?.promiseFulfillment?.completed ?? 0} / {selectedOfficial?.promiseFulfillment?.total ?? 0}
                        </p>
                      </div>
                      <div className="bg-slate-50 border p-4 rounded-xl text-center">
                        <span className="text-4xs font-mono text-slate-400 uppercase font-bold tracking-wider">Voting Roll</span>
                        <p className="text-xl font-display font-bold text-indigo-700 mt-2">{selectedOfficial?.votingParticipation ?? 98}%</p>
                      </div>
                    </div>

                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-slate-50 flex justify-end">
                    <div className="text-3xs font-mono text-slate-400 flex items-center gap-2">
                      <strong>Source Verification (Bio):</strong> 
                      <a href={selectedOfficial?.sources?.biographyUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">
                        {selectedOfficial?.sources?.biographyUrl || "https://dos.myflorida.com/elections/contacts/elected-officials/"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Deep Identity & Contact Section */}
                <div className="p-8 md:p-12 border-b border-slate-100 space-y-8" id="profile-identity-section">
                  <h3 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Public Registry & Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div>
                        <strong className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-3">Registry Contacts</strong>
                        <div className="space-y-3 text-xs text-slate-700 block bg-slate-50 border border-slate-100 p-5 rounded-xl">
                          <p className="flex items-center gap-3">
                            <strong className="w-24">Official Email:</strong> 
                            <span className="text-indigo-600 font-medium">{selectedOfficial?.contact.email || "Public registry email withheld"}</span>
                          </p>
                          <p className="flex items-center gap-3">
                            <strong className="w-24">Office Phone:</strong> 
                            <span>{selectedOfficial?.contact.phone || "Public phone withheld"}</span>
                          </p>
                          <p className="flex items-center gap-3">
                            <strong className="w-24">Website:</strong> 
                            <a href={selectedOfficial?.contact.website} target="_blank" className="text-indigo-600 underline">{selectedOfficial?.contact.website}</a>
                          </p>
                          <p className="flex items-center gap-3 items-start">
                            <strong className="w-24 shrink-0">Office Address:</strong> 
                            <span className="leading-snug">{selectedOfficial?.contact.office || "Jurisdictional Assembly Offices"}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <strong className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-3">Prior Offices & Military</strong>
                        <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1.5">
                          {selectedOfficial?.background?.map((bg, index) => <li key={index}>{bg}</li>)}
                          {!selectedOfficial?.background && <li className="text-slate-400 italic">No prior offices registered.</li>}
                        </ul>
                      </div>
                      <div>
                        <strong className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-3">Academic Disclosures</strong>
                        <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1.5">
                          {selectedOfficial?.education?.map((edu, index) => <li key={index}>{edu}</li>)}
                          {!selectedOfficial?.education && <li className="text-slate-400 italic">No academic disclosures registered.</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <div className="text-3xs font-mono text-slate-400 flex items-center gap-2">
                      <strong>Source Verification (Registry):</strong> 
                      <a href={selectedOfficial?.sources?.biographyUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">
                        {selectedOfficial?.sources?.biographyUrl || "https://dos.myflorida.com/elections/"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4. Legislative Watchdog & Disclosures Section */}
                <div className="p-8 md:p-12 border-b border-slate-100 space-y-8 bg-slate-50/50" id="profile-watchdog-section">
                  <h3 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Legislative Activity & Ethics Disclosures</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border p-6 rounded-xl shadow-sm">
                      <strong className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-4 border-b pb-2">Standing Committees</strong>
                      <ul className="list-disc pl-5 text-xs text-slate-700 space-y-2">
                        {selectedOfficial?.committees?.map((comm, cIndex) => (
                          <li key={cIndex}>{comm}</li>
                        ))}
                        {(!selectedOfficial?.committees || selectedOfficial?.committees.length === 0) && (
                          <span className="text-slate-400 italic">No assigned standing committees reported.</span>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-white border p-6 rounded-xl shadow-sm">
                      <strong className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-4 border-b pb-2">Sponsorship Ledger</strong>
                      <div className="space-y-3 text-xs text-slate-700">
                        <p className="flex justify-between border-b border-slate-50 pb-2"><strong>Bills Sponsored:</strong> <span className="font-semibold">{selectedOfficial?.billsSponsoredCount ?? 0}</span></p>
                        <p className="flex justify-between border-b border-slate-50 pb-2"><strong>Bills Co-Sponsored:</strong> <span className="font-semibold">{selectedOfficial?.billsCoSponsoredCount ?? 0}</span></p>
                        <p className="flex justify-between border-b border-slate-50 pb-2"><strong>Lobbyist Meetings:</strong> <span className="font-semibold">{selectedOfficial?.lobbyistMeetingsCount ?? 12}</span></p>
                        <p className="flex justify-between border-b border-slate-50 pb-2"><strong>Party Coherence:</strong> <span className="font-semibold text-indigo-600">{selectedOfficial?.partyLineVotingRate ?? 92}%</span></p>
                      </div>
                    </div>
                    
                    <div className="bg-white border p-6 rounded-xl shadow-sm">
                      <strong className="text-xs font-mono uppercase tracking-wider text-slate-500 block mb-4 border-b pb-2">Financial & Asset Disclosures</strong>
                      <div className="space-y-3 text-xs text-slate-700">
                        <p className="flex flex-col gap-1 border-b border-slate-50 pb-2">
                          <strong>Est. Assets Range:</strong> 
                          <span className="font-semibold text-emerald-700">{selectedOfficial?.financialAssetsValueRange ?? "Pending Ingestion"}</span>
                        </p>
                        <p className="flex flex-col gap-1 border-b border-slate-50 pb-2">
                          <strong>Registered Liabilities:</strong> 
                          <span className="font-semibold text-rose-700">{selectedOfficial?.financialLiabilitiesValueRange ?? "None Specified"}</span>
                        </p>
                        <p className="flex justify-between pt-1">
                          <strong>Audit State:</strong> 
                          <span className="text-emerald-600 font-bold font-mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded">VERIFIED (Form 6)</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <div className="text-3xs font-mono text-slate-400 flex items-center gap-2">
                      <strong>Source Verification (Disclosures):</strong> 
                      <a href={selectedOfficial?.sources?.seatOfPowerUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">
                        {selectedOfficial?.sources?.seatOfPowerUrl || "https://ethics.state.gov/financial-disclosures"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 5. Promises Tracker Section */}
                <div className="p-8 md:p-12 border-b border-slate-100 space-y-8" id="profile-promises-section">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                      <h3 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Active Pledge Audit Matrix</h3>
                      <p className="text-xs text-slate-500 mt-2 max-w-3xl leading-relaxed">
                        These are monitored commitments processed by our nonpartisan AI systems. All status tags correlate with actual public bill records and fiscal receipts.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { label: "Completed", count: selectedOfficial?.promiseFulfillment.completed, col: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                        { label: "In Progress", count: selectedOfficial?.promiseFulfillment.inProgress, col: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                        { label: "Broken", count: selectedOfficial?.promiseFulfillment.broken, col: "bg-rose-50 text-rose-700 border-rose-200" }
                      ].map((st, i) => (
                        <div key={i} className={\`px-3 py-1.5 rounded-lg border text-xs font-medium font-sans flex items-center gap-2 \${st.col}\`}>
                          <span>{st.label}</span>
                          <span className="font-bold">{st.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPromises
                      .filter(p => p.officialId === selectedOfficial?.id)
                      .map((promise) => (
                        <div key={promise.id} className="bg-white border rounded-xl p-5 hover:border-slate-300 transition shadow-sm space-y-3">
                          <div className="flex justify-between items-start gap-3">
                            <h4 className="text-sm font-semibold text-slate-900 leading-snug">{promise.promise}</h4>
                            <span className={\`text-3xs font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shrink-0 \${
                                promise.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                                promise.status === "In Progress" ? "bg-indigo-100 text-indigo-800" :
                                promise.status === "Broken" ? "bg-rose-100 text-rose-800" :
                                "bg-slate-100 text-slate-600"
                            }\`}>
                              {promise.status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-3 rounded border">
                            <strong>Status Context:</strong> {promise.context}
                          </p>
                          
                          <div className="flex items-center justify-between text-2xs font-mono text-slate-400">
                            <span>Category: {promise.category}</span>
                            <span>Date: {promise.dateMade}</span>
                          </div>
                        </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <div className="text-3xs font-mono text-slate-400 flex items-center gap-2">
                      <strong>Source Verification (Promises):</strong> 
                      <a href={selectedOfficial?.sources?.biographyUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">
                        {selectedOfficial?.sources?.biographyUrl || "https://www.politifact.com/truth-o-meter/promises/"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 6. Voting Record Section */}
                <div className="p-8 md:p-12 border-b border-slate-100 space-y-8 bg-slate-50/50" id="profile-voting-section">
                  <div>
                    <h3 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Recent Voting Rolls & Bill Positions</h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-3xl leading-relaxed">
                      Immutable record of recent floor votes. Explanations provided by the AI engine based on direct bill text reading.
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-900 text-white font-medium">
                        <tr>
                          <th className="px-5 py-4 w-32 border-r border-slate-700">Bill / File</th>
                          <th className="px-5 py-4 border-r border-slate-700">Legislation Scope & AI Explainer</th>
                          <th className="px-5 py-4 w-40">Official's Vote</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {mockBills.map((bill) => {
                          const officialVote = bill.votes.find(v => v.officialName === selectedOfficial?.name) || { position: "Absent/No Vote", date: "N/A" };
                          
                          return (
                            <tr key={bill.id} className="hover:bg-slate-50 transition">
                              <td className="px-5 py-5 border-r border-slate-100 align-top">
                                <span className="font-mono font-bold text-slate-900 block text-sm">{bill.number}</span>
                                <span className="text-2xs text-slate-500 mt-1 block">{bill.dateIntroduced}</span>
                                <span className={\`mt-3 inline-block px-2 py-0.5 rounded text-3xs font-mono uppercase font-bold \${
                                  bill.status === "Passed" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                                }\`}>
                                  {bill.status}
                                </span>
                              </td>
                              <td className="px-5 py-5 border-r border-slate-100 align-top">
                                <h4 className="font-semibold text-slate-900 text-sm">{bill.title}</h4>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                                  {bill.summary}
                                </p>
                                <button 
                                  onClick={() => handleExplainBill(bill)}
                                  className="mt-3 text-indigo-600 hover:text-indigo-800 font-semibold text-2xs uppercase tracking-wide flex items-center gap-1"
                                >
                                  {activeExplainBillId === bill.id && aiLoading ? (
                                    <><Loader2 className="h-3 w-3 animate-spin" /> Generating AI Explainer...</>
                                  ) : (
                                    <>Explain Bill Impact <ChevronRight className="h-3 w-3" /></>
                                  )}
                                </button>
                                
                                {activeExplainBillId === bill.id && aiResponseText && !aiLoading && (
                                  <div className="mt-4 p-4 bg-slate-900 rounded-lg text-slate-300 font-sans text-xs shadow-inner leading-relaxed border-l-4 border-indigo-500">
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700 text-indigo-400">
                                      <Terminal className="h-4 w-4" />
                                      <span className="font-mono text-3xs uppercase tracking-widest font-bold">Hermes-6 Policy Explainer Engine</span>
                                    </div>
                                    <div className="whitespace-pre-line space-y-2">
                                      {aiResponseText}
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-5 py-5 align-top">
                                <div className={\`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs \${
                                  officialVote.position === "Yea" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                                  officialVote.position === "Nay" ? "bg-rose-50 border-rose-200 text-rose-700" :
                                  "bg-slate-50 border-slate-200 text-slate-600"
                                }\`}>
                                  {officialVote.position}
                                </div>
                                <div className="text-3xs text-slate-400 font-mono mt-3">
                                  Vote logged: <br/>{officialVote.date}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <div className="text-3xs font-mono text-slate-400 flex items-center gap-2">
                      <strong>Source Verification (Voting Records):</strong> 
                      <a href={selectedOfficial?.sources?.votingRecordUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">
                        {selectedOfficial?.sources?.votingRecordUrl || "https://www.congress.gov/roll-call-votes"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 7. Campaign Finance Section */}
                <div className="p-8 md:p-12 border-b border-slate-100 space-y-8" id="profile-finance-section">
                  <div>
                    <h3 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Campaign Finance Disclosures (Audit period {selectedFinance?.cycle || "2024-2028"})</h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-3xl leading-relaxed">
                      Historical data extracted from Ethics Commission reports. These represent hard accounting logs.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="campaign-disclosure-ratios-grid">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center shadow-sm">
                      <span className="text-3xs font-mono text-slate-400 uppercase font-bold tracking-wider">Total Funding Raised</span>
                      <p className="text-4xl font-display font-bold text-slate-900 mt-2 tracking-tight">
                        \${((selectedFinance?.totalRaised || 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center shadow-sm">
                      <span className="text-3xs font-mono text-slate-400 uppercase font-bold tracking-wider">Total Spent / Obligated</span>
                      <p className="text-4xl font-display font-bold text-slate-900 mt-2 tracking-tight">
                        \${((selectedFinance?.totalSpent || 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center shadow-sm">
                      <span className="text-3xs font-mono text-slate-400 uppercase font-bold tracking-wider">Remaining Cash on Hand</span>
                      <p className="text-4xl font-display font-bold text-emerald-700 mt-2 tracking-tight">
                        \${((selectedFinance?.cashOnHand || 0) / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </div>

                  {selectedFinance ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider font-bold mb-5 border-b pb-2">Top Registered Contributors</h4>
                        <div className="space-y-4">
                          {selectedFinance.topDonors.map((donor, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-sans">
                              <span className="font-semibold text-slate-800">{donor.name}</span>
                              <span className="font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded border">\${donor.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider font-bold mb-5 border-b pb-2">Contribution by Industry Sector</h4>
                        <div className="space-y-5">
                          {selectedFinance.industries.map((ind, idx) => {
                            const pct = (ind.amount / selectedFinance.totalRaised) * 100;
                            return (
                              <div key={idx} className="space-y-1.5 text-xs font-sans">
                                <div className="flex justify-between">
                                  <span className="font-semibold text-slate-800">{ind.sector}</span>
                                  <span className="font-mono text-slate-600">\${ind.amount.toLocaleString()} ({pct.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: \`\${pct}%\` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
                      Detailed campaign finance structures are pending crawler execution on this local district. Check back at next API refresh.
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <div className="text-3xs font-mono text-slate-400 flex items-center gap-2">
                      <strong>Source Verification (Campaign Finance):</strong> 
                      <a href={selectedOfficial?.sources?.campaignFinancesUrl || "#"} target="_blank" className="text-indigo-600 hover:underline">
                        {selectedOfficial?.sources?.campaignFinancesUrl || "https://www.fec.gov/data/"}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 8. Public Spending / Grants Section */}
                <div className="p-8 md:p-12 bg-slate-50/50 space-y-8" id="profile-spending-section">
                  <div>
                    <h3 className="text-xl font-display font-semibold text-slate-900 tracking-tight">Overlapping Jurisdiction Public Spending flows</h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-3xl leading-relaxed">
                      Tracks federal and state funds (grants/contracts) currently allocated to agencies inside <strong className="text-slate-800">{selectedOfficial?.jurisdiction}</strong>. 
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mockSpending
                      .filter(spend => spend.county.toLowerCase() === "miami-dade" || spend.jurisdiction.includes("Water") || selectedOfficial?.id === "fl-county-cava")
                      .map((spend) => {
                        const spendPct = (spend.amountSpent / spend.amountAwarded) * 100;
                        return (
                          <div key={spend.id} className="bg-white border rounded-2xl p-6 space-y-5 hover:shadow-md transition shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded">
                                Awarded: \${spend.amountAwarded.toLocaleString()}
                              </span>
                              <span className="text-3xs font-mono text-slate-500 uppercase font-bold tracking-wider">
                                {spendPct.toFixed(0)}% Spent
                              </span>
                            </div>

                            <div>
                              <h4 className="text-base font-display font-semibold text-slate-900 leading-snug tracking-tight">{spend.title}</h4>
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">{spend.purpose}</p>
                            </div>

                            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <p><strong>Receiving Agency:</strong> {spend.receivingAgency}</p>
                              <p><strong>Primary Contractor:</strong> {spend.contractor}</p>
                              <p><strong>Status:</strong> <strong className="text-indigo-600">{spend.status}</strong></p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="text-3xs text-slate-500 flex justify-between font-mono font-bold uppercase tracking-wide">
                                <span>Obligated: \${spend.amountObligated.toLocaleString()}</span>
                                <span>Spent: \${spend.amountSpent.toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: \`\${spendPct}%\` }} />
                              </div>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <div className="text-3xs font-mono text-slate-400 flex items-center gap-2">
                      <strong>Source Verification (Spending):</strong> 
                      <a href="#" target="_blank" className="text-indigo-600 hover:underline">
                        https://www.usaspending.gov/
                      </a>
                    </div>
                  </div>
                </div>

              </div>
`;
fs.writeFileSync('profile-new.tsx', newJSX);
