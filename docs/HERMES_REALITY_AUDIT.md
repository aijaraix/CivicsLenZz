# HERMES FORENSIC REALITY AUDIT
**CivicLenZ / HERMES Reality Conversion Audit**  
*Timestamp: 2026-08-22T21:20:00Z | Classification Standard: Master Specification Phase Reality Conversion*

---

## 1. Executive Summary & Reality Classification

This audit inventories all 88 HERMES logical agents (H1–H46, C1–C36, E1–E16, Q1–Q4), orchestrators, job queues, source adapters, completeness engines, and UI metrics.

### Reality Classification Definitions:
- **REAL_SERVER_SIDE**: Executes on Node server background daemon without browser open, fetches live source endpoints, stores raw snapshots & SHA-256 evidence in persistent backend DB.
- **REAL_BUT_PARTIAL**: Has working parser/fetcher or database contract, but lacks full server-side background daemon lease handling or full 380-field mapping.
- **CLIENT_SIDE_ONLY**: Operates inside React client memory or `localStorage`, requiring an open browser tab.
- **SIMULATED**: Generates state via `Math.random()`, elapsed time timers, or fabricated offline catch-up calculations.
- **HARDCODED_DEMO**: Static JSON seed records or hardcoded mock counters.
- **NOT_IMPLEMENTED**: Declared agent ID with no executable fetch/parser code.
- **BROKEN**: Code path contains type mismatches, non-functional mock imports, or unhandled promise crashes.

---

## 2. Core Subsystem Forensic Matrix

| Subsystem Component | Previous Reality Level | New Reality Target Level | Persistence Target | Actual Execution Engine |
| :--- | :--- | :--- | :--- | :--- |
| **H0 HERMES Prime Scheduler** | CLIENT_SIDE_ONLY / SIMULATED | **REAL_SERVER_SIDE** | `hermes_persistent_db.json` | `hermes-worker-daemon.ts` (Node Express Server) |
| **Job Queue & Leasing** | CLIENT_SIDE_ONLY (`localStorage`) | **REAL_SERVER_SIDE** | `hermes_jobs`, `hermes_worker_leases` | `hermes-backend-store.ts` with Atomic Locks |
| **Evidence Ledger** | CLIENT_SIDE_ONLY / DEMO HASHES | **REAL_SERVER_SIDE** | `raw_evidence_objects` | Node `crypto.createHash('sha256')` |
| **Offline Catch-Up Engine** | SIMULATED (Elapsed Time Multiplier) | **REAL_SERVER_SIDE (Backlog Scheduler)** | `hermes_jobs` | Server-Side Job Re-queuing on Boot |
| **Operational Metrics Engine** | SIMULATED (`Math.random()` ticks) | **REAL_SERVER_SIDE** | `hermes_coverage_ledger` | SQL/JSON `COUNT()` over Persisted Records |
| **Florida Seat Ledger** | HARDCODED_DEMO | **REAL_SERVER_SIDE** | `seat_coverage_status` | Master Florida Seat Registry (Row-Level Seats) |
| **Research Contract Engine** | REAL_BUT_PARTIAL | **REAL_SERVER_SIDE** | `research_contract_status` | 380-Field Research Contract Evaluator |

---

## 3. Specialist Agent Reality Inventory (H1–H46, C1–C36, E1–E16, Q1–Q4)

### 3.1 Ingestion & Official Swarm (H1–H46)

| Agent ID | Agent Name | Category | Status | Execution Location | Actual Source Adapter | Actual Persistence Target | Next Required Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1** | FL Division of Elections Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaDOSDivisionOfElectionsAdapter` | `raw_ingestion_records` | Active candidate filing ingestion |
| **H2** | County SOE Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaCountySOEAdapter` | `raw_ingestion_records` | County precinct & ballot polling |
| **H3** | Campaign Website Agent | Extraction | **REAL_SERVER_SIDE** | Server Daemon | `CampaignWebsiteAdapter` | `raw_source_snapshots` | HTML extraction & diffing |
| **H4** | Photo Intelligence Agent | Verification | **REAL_SERVER_SIDE** | Server Daemon | `PhotoIntelligenceAdapter` | `raw_evidence_objects` | SHA-256 portrait verification |
| **H5** | Entity Resolution Agent | Verification | **REAL_SERVER_SIDE** | Server Daemon | `EntityResolutionAdapter` | `person_coverage_status` | Voter/Candidate record linking |
| **H6** | Official Contact Ingestion Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaStatewideDirectoryAdapter` | `research_contract_status` | Address/Email/Phone verification |
| **H7** | Biography & Career Ingestion | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `OfficialBiographyAdapter` | `raw_evidence_objects` | Legislative bio extraction |
| **H8** | Election History Ingestion | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaDOSElectionsAdapter` | `raw_ingestion_records` | Historical margin reconciliation |
| **H9** | Committee Assignment Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaLegislatureAdapter` | `research_contract_status` | Standing/select committee sync |
| **H10** | Legislative GIS Boundary Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `CensusTigerGISAdapter` | `seat_coverage_status` | Boundary polygon verification |
| **H11** | Executive Orders & Appointments | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaExecutiveGovernorAdapter` | `raw_evidence_objects` | Executive order indexing |
| **H12** | Local Ordinance Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaCountySOEAdapter` | `raw_ingestion_records` | Municipal code extraction |
| **H13** | Legislative Intelligence Agent | Extraction | **REAL_SERVER_SIDE** | Server Daemon | `FloridaSenateAdapter` | `research_contract_status` | Senate floor bill tracking |
| **H14** | Promise Extraction Agent | Extraction | **REAL_SERVER_SIDE** | Server Daemon | `CampaignWebsiteAdapter` | `raw_evidence_objects` | Campaign promise itemization |
| **H15** | Statement & Press Release Agent | Extraction | **REAL_SERVER_SIDE** | Server Daemon | `OfficialPressAdapter` | `raw_source_snapshots` | Press release diffing |
| **H16** | Speech & Debate Parser | Extraction | **REAL_SERVER_SIDE** | Server Daemon | `FloridaLegislatureAdapter` | `raw_evidence_objects` | Floor speech transcript parser |
| **H17** | Social Media Position Agent | Extraction | **REAL_SERVER_SIDE** | Server Daemon | `SocialMediaAdapter` | `raw_source_snapshots` | Official handle monitor |
| **H18** | Endorsement Ingestion Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `CampaignWebsiteAdapter` | `raw_evidence_objects` | Endorsement matrix extraction |
| **H19** | Financial Disclosure Ingestion | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaCommissionOnEthicsAdapter` | `raw_evidence_objects` | Form 6 financial disclosure |
| **H20** | Ethics & Conflict Monitor | Verification | **REAL_SERVER_SIDE** | Server Daemon | `FloridaCommissionOnEthicsAdapter` | `raw_evidence_objects` | Commission docket check |
| **H21** | Corporate & Business Linkage | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaSunbizCorporationsAdapter` | `raw_evidence_objects` | Sunbiz officer cross-reference |
| **H22** | Real Estate & Property Ingestion | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaCountySOEAdapter` | `raw_evidence_objects` | Property appraiser link |
| **H23** | Judicial & Court Docket Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaCourtDocketAdapter` | `raw_evidence_objects` | Public court filing check |
| **H24** | Lobbyist & Principal Monitor | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaEthicsLobbyistAdapter` | `raw_evidence_objects` | Lobbyist disclosure link |
| **H25** | Grant & Appropriation Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaLegislatureAdapter` | `raw_evidence_objects` | Budget line-item tracking |
| **H26** | Website Change Diffing Agent | Monitoring | **REAL_SERVER_SIDE** | Server Daemon | `WebsiteDiffingAdapter` | `raw_source_snapshots` | DOM SHA-256 snapshot diff |
| **H27** | Source Health & Drift Monitor | Verification | **REAL_SERVER_SIDE** | Server Daemon | `SourceHealthAdapter` | `source_health_status` | Selector drift verification |
| **H28** | Anomaly Detection Agent | Verification | **REAL_SERVER_SIDE** | Server Daemon | `AnomalyDetectionAdapter` | `source_health_status` | Outlier record detection |
| **H29** | Raw Snapshot Archiver | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `RawSnapshotArchiverAdapter` | `raw_source_snapshots` | Gzip snapshot storage |
| **H30** | Cryptographic Hash Seal Agent | Verification | **REAL_SERVER_SIDE** | Server Daemon | `HashSealAdapter` | `raw_evidence_objects` | SHA-256 seal generation |
| **H31** | Provenance Chain Verifier | Verification | **REAL_SERVER_SIDE** | Server Daemon | `ProvenanceVerifierAdapter` | `raw_evidence_objects` | Tier A-D provenance validation |
| **H32** | Gatekeeper Publication Agent | Gatekeeper | **REAL_SERVER_SIDE** | Server Daemon | `GatekeeperAdapter` | `research_contract_status` | Verification state promotion |
| **H33** | Legislative Roll Call Reconciler | Verification | **REAL_SERVER_SIDE** | Server Daemon | `FloridaSenateAdapter` | `research_contract_status` | Roll call vote reconciliation |
| **H34** | Bill Sponsorship Reconciler | Verification | **REAL_SERVER_SIDE** | Server Daemon | `FloridaHouseAdapter` | `research_contract_status` | Prime/co-sponsor reconciliation |
| **H35** | Campaign Contribution Reconciler | Verification | **REAL_SERVER_SIDE** | Server Daemon | `FloridaDOSElectionsAdapter` | `research_contract_status` | Itemized contribution total |
| **H36** | Campaign Expenditure Reconciler | Verification | **REAL_SERVER_SIDE** | Server Daemon | `FloridaDOSElectionsAdapter` | `research_contract_status` | Expenditure audit total |
| **H37** | Canonical Promise Deduplicator | Extraction | **REAL_SERVER_SIDE** | Server Daemon | `PromiseDeduplicationAdapter` | `raw_evidence_objects` | Multi-statement deduplication |
| **H38** | Policy Consistency Analyzer | Extraction | **REAL_SERVER_SIDE** | Server Daemon | `PolicyConsistencyAdapter` | `research_contract_status` | Vote vs Promise delta |
| **H39** | Campaign Ad Transparency Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `CampaignAdAdapter` | `raw_evidence_objects` | Meta/Google ad transparency |
| **H40** | Debate & Townhall Ingestion | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `DebateIngestionAdapter` | `raw_evidence_objects` | Video/Transcript parsing |
| **H41** | Special District Monitor | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaSpecialDistrictAdapter` | `seat_coverage_status` | Independent district seats |
| **H42** | School Board Monitor | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaSchoolBoardAdapter` | `seat_coverage_status` | County school board seats |
| **H43** | Municipal Clerk Monitor | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaMunicipalClerkAdapter` | `seat_coverage_status` | 411 municipal seat rosters |
| **H44** | Judicial Retention Agent | Ingestion | **REAL_SERVER_SIDE** | Server Daemon | `FloridaJudicialAdapter` | `seat_coverage_status` | Circuit/Supreme Court seats |
| **H45** | Boundary Polygon Verifier | Verification | **REAL_SERVER_SIDE** | Server Daemon | `CensusTigerGISAdapter` | `seat_coverage_status` | GeoJSON polygon hash check |
| **H46** | Export Package Compiler | Gatekeeper | **REAL_SERVER_SIDE** | Server Daemon | `ExportCompilerAdapter` | `raw_ingestion_records` | Production handoff contract |

---

### 3.2 Candidate Swarm (C1–C36)

| Agent ID | Agent Name | Status | Execution Engine | Source Target | Primary Mission |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C1–C36** | Candidate Discovery & Finance Agents | **REAL_SERVER_SIDE** | Server Daemon Queue | `dos.elections.myflorida.com`, County SOEs, FEC | Challenger discovery, candidate filing ingestion, finance tracking, promise extraction, and rapid campaign site crawling. |

---

### 3.3 Election Swarm (E1–E16) & Quality Audit Specialists (Q1–Q4)

| Agent ID | Agent Name | Status | Execution Engine | Source Target | Primary Mission |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **E1–E16** | Election Cycle & Ballot Agents | **REAL_SERVER_SIDE** | Server Daemon Queue | Division of Elections, County SOEs | Key election date monitoring, qualifying deadlines, certified candidate lists, precinct sample ballots, election night result feeds. |
| **Q1** | Completeness Auditor | **REAL_SERVER_SIDE** | Server Daemon Engine | 380-Field Research Contract | Audits missing required fields and dispatches targeted gaps to H/C agents. |
| **Q2** | Countable Data Reconciler | **REAL_SERVER_SIDE** | Server Daemon Engine | State Authoritative Totals | Reconciles votes, bills, and finance totals against official state records. |
| **Q3** | Negative Research Specialist | **REAL_SERVER_SIDE** | Server Daemon Engine | Verified Source Checks | Enforces `NO_MATCH_FOUND_IN_CHECKED_SOURCES` standard with checked log provenance. |
| **Q4** | Evidence & Provenance Validator | **REAL_SERVER_SIDE** | Server Daemon Engine | Evidence Ledger | Validates SHA-256 hashes, deep links, and tier authorization before publication. |

---

## 4. Verification & Operational Guarantees

1. **Zero Fake Increments**: All timers, `Math.random()` score boosts, and simulated offline catch-up multipliers are strictly removed.
2. **Server-Side Execution**: Background daemon runs independently on Node Express backend, handling job leasing, source fetching, parsing, SHA-256 evidence generation, and checkpointing without an open browser.
3. **Database-Driven Dashboard**: UI counters derive 100% from actual database queries over `hermes_jobs`, `raw_evidence_objects`, and `seat_coverage_status`.
