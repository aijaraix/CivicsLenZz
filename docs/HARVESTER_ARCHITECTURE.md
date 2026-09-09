# CIVICSLENZZ — MASTER RESEARCH HARVESTER ARCHITECTURE

**Repository**: `aijaraix/CivicsLenZz`  
**Role**: High-Speed Research Harvester, Source Discovery Laboratory, Raw Evidence Archiver & Ingestion Staging Engine  
**Target Canonical Architecture**: `aijaraix/CivicLenZ` (Supabase / Cloudflare Workers / R2 / HERMES Prime)

---

## 1. Two-Repository Division of Labor

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CANONICAL PRODUCTION                            │
│                       aijaraix/CivicLenZ                               │
│                                                                        │
│ • Canonical Seat-Centric Civic Graph                                   │
│ • Supabase (Authoritative Structured State)                            │
│ • R2 (Long-Term Evidence Storage)                                      │
│ • Canonical HERMES Prime Orchestrator                                  │
│ • Validation, Contradiction Engine & Publication Gate                 │
│ • Public CivicLenZ User Experience                                    │
└──────────────────────────────────▲─────────────────────────────────────┘
                                   │
                    CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1
                    (Strictly: extraction_status: "extracted_unreviewed")
                                   │
┌──────────────────────────────────┴─────────────────────────────────────┐
│                        RESEARCH HARVESTER                              │
│                       aijaraix/CivicsLenZz                             │
│                                                                        │
│ • High-Speed Source Discovery & Crawling Laboratory                    │
│ • Deterministic Scrapers & Government Source Adapters                  │
│ • Browser Research Worker & Interactive Portal Navigation              │
│ • Raw Evidence Capture & SHA-256 Hashing                               │
│ • GIS & Boundary Research Environment                                  │
│ • Extraction Staging & Batch Exporting                                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Operating Principles

1. **The Permanent Object is the SEAT**:
   - `Seat` is the immutable civic anchor (e.g., *Florida Senate District 35*, *Miami-Dade County Mayor*).
   - `Person` is a human entity who may occupy a seat or run as a candidate.
   - `SeatOccupancy` connects a Person to a Seat with temporal term bounds.
   - `Election` and `CandidateCampaign` connect candidates to a contested Seat.
2. **Absolute Truth Rule — Zero Synthetic Data**:
   - Never fabricate officials, candidates, phone numbers, addresses, campaign sites, votes, polling, finance totals, donor records, portraits, worker activity, or fake completion percentages.
   - Demo fixtures must never leak into production counts or runtime civic paths.
3. **Deterministic First — AI as Research Tool Only**:
   - Prefer standard HTTP requests, HTML DOM / Cheerio parsing, JSON/CSV/XML parsing, regex, and structured APIs over LLMs.
   - Gemini output is **never** authoritative civic truth. Gemini is a research discovery and parser-construction accelerator. It cannot mark claims `VERIFIED`.
4. **All Output is `extracted_unreviewed`**:
   - Harvester output entering the canonical pipeline must default to `extraction_status: "extracted_unreviewed"`.
   - Raw bytes must be hashed (SHA-256) and preserved with full HTTP retrieval metadata.
5. **Continuous Reality & Monitoring**:
   - Civic profiles are never globally "100% complete." State is measured as `CURRENT_AS_OF`, `BASELINE_SUFFICIENT`, or `SCOPE_RECONCILED_AS_OF`.
   - Continuous monitoring detects changes, vacancies, and election filings.

---

## 3. Ingestion Contract Specification (`CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1`)

Every packet produced by `CivicsLenZz` adheres to the following contract before transfer:

```json
{
  "producer": "CivicsLenZz-Harvester",
  "producer_version": "2.5.0",
  "capability": "florida_division_of_elections_candidates",
  "source_key": "fl_dos_candidate_tracking",
  "source_url": "https://dos.elections.myflorida.com/candidates/CanList.asp",
  "source_authority": "Florida Department of State, Division of Elections",
  "source_type": "official_election",
  "jurisdiction_key": "state_fl",
  "seat_key": "seat_fl_senate_35",
  "person_candidate_key": "person_cand_...",
  "election_key": "election_fl_2026_general",
  "retrieved_at": "2026-09-07T19:00:00.000Z",
  "http_status": 200,
  "content_type": "text/html; charset=utf-8",
  "byte_length": 145820,
  "content_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "raw_object_reference": "raw_fl_dos_canlist_20260907.html",
  "parser_key": "fl_dos_canlist_table_parser",
  "parser_version": "1.0.0",
  "extracted_claims": {
    "candidate_name": "...",
    "party": "...",
    "filing_date": "...",
    "status": "Qualified"
  },
  "dataset_units": [],
  "relationships": [],
  "warnings": [],
  "extraction_status": "extracted_unreviewed"
}
```

---

## 4. Subsystem Roles & Directory Structure

- `data/`: Local disk research vault and staging area.
  - `data/seats/`: Permanent seats discovered.
  - `data/people/`: Authenticated persons discovered.
  - `data/occupancies/`: Active and historical seat occupancies.
  - `data/candidates/`: Qualified and filed candidates.
  - `data/raw/`: Physical raw source payloads captured during crawling.
  - `data/snapshots/`: Metadata records pairing URL, fetched timestamp, byte length, and SHA-256 hash to raw payload files.
- `src/lib/`:
  - `harvester-contract.ts`: Canonical Ingest Contract types, builder, and schema validator.
  - `source-adapters.ts`: Deterministic HTTP/DOM scrapers for government portals.
  - `hermes-worker-daemon.ts`: High-speed background harvesting loop.
  - `florida-master-ledger.ts`: Authoritative structural mapping of Florida government seats.
- `server.ts`: Harvester runtime daemon, US Census geocoding proxy, and export bridge API.
