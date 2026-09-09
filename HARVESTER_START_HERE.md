# HARVESTER START HERE — CivicsLenZz Autonomous Research Harvester

Welcome to **CivicsLenZz** (`aijaraix/CivicsLenZz`).

If you are an autonomous coding assistant, AI agent, or human engineer starting a session in this repository, **read this document first**.

---

## 1. What This System Is (And What It Is NOT)

| Attribute | Canonical System (`aijaraix/CivicLenZ`) | Harvester System (`aijaraix/CivicsLenZz` — THIS REPOSITORY) |
| :--- | :--- | :--- |
| **Role** | Canonical Authority, Source of Truth, Public Experience | High-speed Advance Research Harvester, Raw Evidence Archiver, Parser Lab |
| **Truth Authority** | **Sole Authority**. Validates, verifies, and publishes claims | **Zero Authority**. Emits strictly `extracted_unreviewed` research |
| **Data Models** | Owns canonical `Seat`, `Person`, `Occupancy`, `Election`, `CandidateCampaign` | Operates upstream; extracts and stages candidate/seat packages |
| **Storage** | Supabase (State Graph), Cloudflare R2 (Evidence Storage) | Staging SQLite/JSON store, Local Raw Snapshots, Export Packages |
| **Orchestration** | HERMES Prime Master Orchestrator, Research Work Ledger | Autonomous Frontier Harvester Worker, Cheerio Parsers, Browser Worker |
| **Verification** | Enforces `V0` through `V4` Verification Levels | Emits `V1_EXTRACTED` claims; cannot mark anything `VERIFIED` |

---

## 2. The Golden Rules of CivicsLenZz

1. **The Permanent Object is the SEAT**:
   * Do not organize research around politicians. Seats outlive individuals.
   * Core graph:
     $$\text{Jurisdiction} \longrightarrow \text{Seat} \longrightarrow \text{SeatOccupancy} \longrightarrow \text{Person}$$
     $$\text{Seat} \longrightarrow \text{Election} \longrightarrow \text{CandidateCampaign} \longrightarrow \text{Person}$$
2. **Every Seat Requires Four Parallel Tracks**:
   * **A. Civic Structure**: Jurisdiction, Seat Title, Authority, Office Type, Occupancy, Vacancy/Acting status.
   * **B. Election & Candidates**: Authority, Filing Windows, Qualified Candidates, CandidateCampaign records.
   * **C. Governance Activity**: Bills sponsored, Votes, Committees, Executive Orders, Appointments, Dockets.
   * **D. Evidence & Geospatial**: TLS HTTP raw bytes, SHA-256 seal, Census & Local GIS layer mapping.
3. **All Output is `extracted_unreviewed`**:
   * Never output data marked `VERIFIED`. CivicsLenZz outputs cannot declare truth without canonical review.
4. **Absolute Prohibition of Synthetic / Fake Data**:
   * Never use `Math.random()`, placeholder names, simulated candidates, fabricated polls, or fake finance numbers.
5. **No Fake "100% Complete"**:
   * Civic data is continuous. Status must be: `BASELINE_SUFFICIENT`, `CURRENT_AS_OF`, `SCOPE_RECONCILED_AS_OF`, `DATASET_RECONCILED_THROUGH`, `STALE`, `RESEARCHING`, `BLOCKED`, or `MONITORING_ACTIVE`.
6. **`CAPABILITY_NOT_IMPLEMENTED` is NEVER `CHECKED_NO_AUTHORITATIVE_RESULT`**:
   * Lack of an automated scraper is an operational state, never a civic fact that a record doesn't exist.

---

## 3. Core Documentation Index

Before executing any harvester tasks, consult the modular documentation in `docs/harvester/`:

1. [`CANONICAL_ALIGNMENT.md`](docs/harvester/CANONICAL_ALIGNMENT.md) — Relationship with `aijaraix/CivicLenZ`.
2. [`HARVESTER_ROLE_AND_PROHIBITIONS.md`](docs/harvester/HARVESTER_ROLE_AND_PROHIBITIONS.md) — Allowed activities and strict boundaries.
3. [`CANONICAL_CONTRACT_SYNC.md`](docs/harvester/CANONICAL_CONTRACT_SYNC.md) — Contract specification (`CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1`).
4. [`FRONTIER_COVERAGE_PLAN.md`](docs/harvester/FRONTIER_COVERAGE_PLAN.md) — Florida geographic expansion cohorts and frontier queues.
5. [`HARVESTER_JOB_PROTOCOL.md`](docs/harvester/HARVESTER_JOB_PROTOCOL.md) — Autonomous job lifecycle and reservation protocols.
6. [`COHORT_READINESS_STANDARD.md`](docs/harvester/COHORT_READINESS_STANDARD.md) — Criteria for cohort readiness and handoff.
7. [`GIS_AND_BOUNDARY_HARVESTING.md`](docs/harvester/GIS_AND_BOUNDARY_HARVESTING.md) — Census API vs. Local County/Municipal GIS layer mapping.
8. [`SEAT_ELECTION_CANDIDATE_PIPELINE.md`](docs/harvester/SEAT_ELECTION_CANDIDATE_PIPELINE.md) — Parallel dual-track processing.
9. [`EVIDENCE_AND_PROVENANCE_RULES.md`](docs/harvester/EVIDENCE_AND_PROVENANCE_RULES.md) — SHA-256 byte hashing and source provenance.
10. [`ACADEMY_AND_EVOLUTION.md`](docs/harvester/ACADEMY_AND_EVOLUTION.md) — Self-improving deterministic parsers and error recovery.
11. [`REALITY_AND_SYNTHETIC_DATA_POLICY.md`](docs/harvester/REALITY_AND_SYNTHETIC_DATA_POLICY.md) — Strict zero-synthetic mandate.
12. [`docs/control-plane/`](docs/control-plane/) — Direct upstream copies of authoritative canonical directives.

---

## 4. Current Operational Endpoints

CivicsLenZz runs a live Express + TypeScript service on port 3000:

* `GET /api/harvester/physical-counts` — Authoritative counts: `HARVESTED`, `EXTRACTED_UNREVIEWED`, `EXPORTED`, `CANONICAL_ACCEPTED` (0), `VERIFIED` (0).
* `GET /api/harvester/parallel-dossier?seat=<seat_key>` — Parallel 4-track Seat + Election + Candidate dossier.
* `GET /api/harvester/export-contract` — Batch export adhering to Ingest Contract V1.
* `GET /api/harvester/representative-export` — Representative FL Senate SD 35 package for canonical interoperability.
* `GET /api/harvester/geographic-catalog` — Direct Census vs. Local GIS layer demarcation.
* `GET /api/geo/resolve?address=<address>` — Street address boundary resolution via US Census Bureau Geocoder.
