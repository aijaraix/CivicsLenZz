# HERMES PERMANENT MACHINE-TO-MACHINE BRIDGE
**Authoritative Architectural Specification for CivicsLenZz Harvester Integration**
*Version: 2.2.0-HERMES-BRIDGE | Upstream: aijaraix/CivicLenZ | Producer: civicslenzz-gemini-harvester*

---

## 1. Architectural Boundary & Core Principles

The CivicsLenZ ecosystem enforces a strict separation of concerns between two distinct repositories:

```
+--------------------------------------------------------+
|             aijaraix/CivicsLenZz                       |
|   Untrusted Advance Research Producer / Harvester      |
|   - High-throughput autonomous civic discovery         |
|   - 4-Track Parallel Dossiers (A, B, C, D)             |
|   - extraction_status: STRICTLY extracted_unreviewed   |
+--------------------------------------------------------+
                           │
                           │ HTTP POST /api/canonical/ingest
                           │ Machine Bearer Secret + Idempotency
                           ▼
+--------------------------------------------------------+
|             aijaraix/CivicLenZ                         |
|   Canonical HERMES Control Plane / Ingest Gateway      |
|   - Canonical Schema & Cryptographic Validation        |
|   - Entity Resolution (Person, Seat, Election)         |
|   - Verification Authority                             |
|   - Publication Authority (Supabase, Public API)       |
+--------------------------------------------------------+
```

### Governing Rules
1. **GitHub is NOT a runtime transport for civic data**: GitHub stores code, contracts, schemas, parsers, and reviewed documentation. Runtime research flows exclusively across the authenticated machine-to-machine HTTP API bridge.
2. **Zero Direct Supabase Writes**: `CivicsLenZz` never receives write credentials to canonical Supabase. The Harvester submits; canonical HERMES validates and decides whether to accept.
3. **No Autonomous Verification**: All Harvester outputs default strictly to `extracted_unreviewed`. Only HERMES has the authority to declare records `VERIFIED` or promote them to canonical truth.
4. **Resilience to Canonical Outages**: If canonical HERMES is unconfigured, unreachable, or responding with 5xx/429, completed results are safely persisted as `RESULT_READY` without data loss or fabricated state.

---

## 2. Producer Manifest & Identity

- **Producer ID**: `civicslenzz-gemini-harvester`
- **Producer Name**: `CivicsLenZz-Gemini-Harvester`
- **Producer Version**: `2.2.0-HERMES-BRIDGE`
- **Supported Contracts**:
  - Inbound: `HERMES_RESEARCH_JOB_V1`
  - Outbound: `CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1`
- **Default Extraction Status**: `extracted_unreviewed`
- **Explicit Prohibitions**:
  - `NO_CANONICAL_VERIFICATION`
  - `NO_CANONICAL_PUBLICATION`
  - `NO_CANONICAL_IDENTITY_OVERRIDE`
  - `NO_TRUTH_STANDARD_OVERRIDE`
  - `NO_DIRECT_CANONICAL_DATABASE_WRITES`
  - `NO_SYNTHETIC_DATA`
  - `NO_RANDOM_GENERATION`
  - `NO_UNSUPPORTED_BOUNDARY_INFERENCE`

---

## 3. Inbound HERMES Job Envelope (`HERMES_RESEARCH_JOB_V1`)

Inbound requests from HERMES into CivicsLenZz are received at `POST /api/harvester/jobs`.

### Schema Specification
```json
{
  "contract_version": "HERMES_RESEARCH_JOB_V1",
  "job_id": "job_0c8d1e2f3a4b_1773000000000",
  "research_work_identity": {
    "work_key": "4f9a...sha256",
    "jurisdiction_key": "jurisdiction_us_fl",
    "seat_key": "seat_fl_senate_35",
    "research_domain": "FULL_PARALLEL_DOSSIER",
    "cycle_year": 2026
  },
  "research_reservation_id": "resv_8a7b6c5d_1773000000",
  "producer_target": "civicslenzz-gemini-harvester",
  "priority": 1,
  "capability": "FULL_PARALLEL_DOSSIER",
  "cohort": "FLORIDA_STATE_SENATE",
  "jurisdiction": "jurisdiction_us_fl",
  "seat_key": "seat_fl_senate_35",
  "person_identity": "person_fl_senator_barbara_sharief",
  "research_scope": "COMPREHENSIVE_SEAT_DOSSIER",
  "dataset_period": "2024-2026",
  "source_constraints": ["flsenate.gov", "dos.elections.myflorida.com"],
  "deadline": "2026-09-08T00:00:00Z",
  "attempt": 1,
  "created_at": "2026-09-07T21:00:00Z",
  "trace_id": "trace_7b8c9d0e1f2a"
}
```

### Inbound Envelope Validation
Before execution, the Harvester validates:
- `contract_version === "HERMES_RESEARCH_JOB_V1"`
- `producer_target === "civicslenzz-gemini-harvester" || "*"`
- Required structural fields (`seat_key` or `jurisdiction`)
- Deduplication against existing `work_key` index: if already running or completed, returns existing job idempotently with `is_new_job: false`.

---

## 4. Outbound Ingest Contract (`CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1`)

Upon research execution completion, the Harvester constructs a self-contained research ingest package:

```json
{
  "contract_version": "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1",
  "producer": "civicslenzz-gemini-harvester",
  "producer_version": "2.2.0-HERMES-BRIDGE",
  "job_id": "job_0c8d1e2f3a4b_1773000000000",
  "research_work_identity": { "work_key": "..." },
  "research_reservation_id": "resv_8a7b6c5d_1773000000",
  "cohort": "FLORIDA_STATE_SENATE",
  "capability": "FULL_PARALLEL_DOSSIER",
  "jurisdiction": "jurisdiction_us_fl",
  "seat_candidate_key": "seat_fl_senate_35",
  "person_identity_candidates": [
    {
      "person_key": "person_fl_senator_barbara_sharief",
      "full_name": "Barbara Sharief",
      "official_title": "Florida State Senator, District 35",
      "extraction_status": "extracted_unreviewed"
    }
  ],
  "election_identity_candidates": [
    {
      "election_key": "election_fl_senate_35_2026",
      "election_date": "2026-11-03",
      "election_type": "State Legislative General & Primaries",
      "extraction_status": "extracted_unreviewed"
    }
  ],
  "sources": [
    {
      "source_id": "src_fl_official_gazette",
      "source_name": "flsenate.gov",
      "agency": "Florida Legislature",
      "url": "https://flsenate.gov",
      "authority_scope": "STATEWIDE"
    }
  ],
  "retrievals": [
    {
      "retrieval_id": "ret_b4a8e3d1c9f2",
      "url": "https://flsenate.gov",
      "retrieved_at": "2026-09-07T21:40:00Z",
      "http_status": 200,
      "mime_type": "text/html; charset=utf-8",
      "byte_length": 124800,
      "sha256_hash": "b4a8e3d1c9f2e7b5a6c3d8f1e4b7a2c5d8e1f4b7a2c5d8e1f4b7a2c5d8e1f4b7",
      "parser_method": "deterministic_dom_cheerio",
      "parser_version": "2.2.0",
      "source_authority": "The Florida Senate (flsenate.gov)",
      "dataset_period": "2024-2026",
      "raw_artifact_reference": "data/snapshots/fl_senate_sd35_authoritative.html"
    }
  ],
  "raw_evidence_metadata": {
    "total_artifacts": 1,
    "sealed_hashes": ["b4a8e3d1c9f2e7b5a6c3d8f1e4b7a2c5d8e1f4b7a2c5d8e1f4b7a2c5d8e1f4b7"],
    "harvester_retrieval_endpoint": "/api/harvester/snapshots/b4a8e3d1c9f2e7b5..."
  },
  "content_hash": "5d2f...sha256",
  "parser_method": "deterministic_dom_cheerio",
  "parser_version": "2.2.0",
  "claims": [
    {
      "claim_id": "claim_seat_fl_senate_35_occupancy",
      "statement": "Barbara Sharief occupies Florida State Senator, District 35",
      "evidence_hash": "b4a8e3d1c9f2...",
      "extraction_status": "extracted_unreviewed"
    }
  ],
  "relationships": [],
  "dataset_units": [],
  "boundary_objects": [
    {
      "seat_key": "seat_fl_senate_35",
      "boundary_source": "US_CENSUS_BUREAU_TIGER_WEB",
      "layer_type": "STATE_LEGISLATIVE_DISTRICT_UPPER",
      "district_fips": "12035",
      "census_geocoder_verified": true
    }
  ],
  "warnings": [],
  "known_gaps": [
    "County Commission Single-Member Districts (Requires Broward County GIS)"
  ],
  "current_as_of": "2026-09-07T21:40:00Z",
  "monitoring_recommendations": [
    "Check Florida Division of Elections candidate qualifying docket at candidate qualification window open (May 4, 2026)"
  ],
  "extraction_status": "extracted_unreviewed",
  "canonical_validation_required": true
}
```

---

## 5. Result Delivery Lifecycle States

Each result package is tracked across an explicit state machine:

| Delivery State | Description |
| :--- | :--- |
| `RESULT_READY` | Package constructed and sealed with SHA-256 content hash; held in local queue. |
| `SUBMISSION_PENDING` | Queued for outbound network dispatch to canonical ingest gateway. |
| `SUBMITTING` | HTTP request active to `${CIVICLENZ_CANONICAL_INGEST_URL}/api/canonical/ingest`. |
| `SUBMITTED` | HTTP transmission complete; awaiting gateway response. |
| `ACCEPTED_FOR_VALIDATION` | Canonical HERMES parsed, validated schema, and enqueued package for validation. |
| `DUPLICATE` | Gateway recognized identical research work identity already staged. |
| `NEEDS_RESOLUTION` | Canonical identity resolution requires disambiguation (e.g. FEC vs DOS candidate). |
| `RETRYABLE` | Gateway responded with 429 (Rate Limit) or 5xx (Gateway Error); queued for backoff retry. |
| `REJECTED` | Terminal rejection due to schema violation or policy failure (`REJECTED_SCHEMA`, `REJECTED_POLICY`). |

---

## 6. Canonical Acknowledgment Protocol

The Bridge Client parses standard HERMES Acknowledgment responses:
- `ACCEPTED_FOR_VALIDATION`: Transitions to `ACCEPTED_FOR_VALIDATION`.
- `DUPLICATE`: Transitions to `DUPLICATE`.
- `NEEDS_IDENTITY_RESOLUTION`: Transitions to `NEEDS_RESOLUTION`.
- `NEEDS_MORE_EVIDENCE`: Transitions to `NEEDS_RESOLUTION`.
- `PARTIALLY_ACCEPTED`: Transitions to `ACCEPTED_FOR_VALIDATION`.
- `REJECTED_SCHEMA`: Transitions to `REJECTED`.
- `REJECTED_POLICY`: Transitions to `REJECTED`.
- `RETRY_LATER`: Transitions to `RETRYABLE` with `retry_after_seconds`.
- `CANONICAL_CONFLICT`: Transitions to `REJECTED`.

---

## 7. Retry, Backpressure & Canonical-Offline Behavior

1. **Canonical Endpoint Unconfigured**:
   - When `CIVICLENZ_CANONICAL_INGEST_URL` is empty:
   - Result packages are safely staged as `RESULT_READY`.
   - All provenance snapshots, byte lengths, and SHA-256 hashes are retained in `data/bridge-submissions.json`.
   - The Harvester never fabricates a submission confirmation.
   - Status is transparently reported via `GET /api/harvester/bridge/telemetry`.
2. **Rate Limiting (HTTP 429)**:
   - Reads `Retry-After` header (defaults to 30s if absent).
   - Marks delivery as `RETRYABLE` and schedules next attempt.
3. **Server Errors (HTTP 5xx)**:
   - Bounded exponential backoff: $T = \min(60000, 2^{\text{attempt}} \times 1000 + \text{jitter})$.
   - Caps at 5 retry attempts before holding for operator investigation.

---

## 8. Machine Security & Credential Configuration

### Environment Variables
```bash
# Canonical HERMES Ingest Endpoint (empty in advance mode until canonical receiver is live)
CIVICLENZ_CANONICAL_INGEST_URL=""

# Machine-to-Machine Producer Identifier
CIVICLENZ_HARVESTER_PRODUCER_ID="civicslenzz-gemini-harvester"

# Shared Machine Service Credential (managed via secure runtime secrets, NEVER committed)
CIVICLENZ_HARVESTER_SHARED_SECRET=""
```

### Inbound & Outbound Headers
- **Inbound**: When `CIVICLENZ_HARVESTER_SHARED_SECRET` is set, all mutating `/api/harvester/*` calls require:
  `Authorization: Bearer <secret>` or `X-Harvester-Secret: <secret>`.
- **Outbound**: When submitting to HERMES:
  - `Authorization: Bearer ${CIVICLENZ_HARVESTER_SHARED_SECRET}`
  - `X-Harvester-Producer-Id: civicslenzz-gemini-harvester`
  - `X-Idempotency-Key: <job_id>_<content_hash>`
  - `X-Contract-Version: CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1`
- **Secret Redaction**:
  - Secrets are NEVER returned in JSON outputs, error responses, or telemetry.
  - Secrets are NEVER logged to disk or console.

---

## 9. Contract Verification Test Suite Results

The permanent machine-to-machine bridge contract test suite (`test/hermes-bridge-contract.test.ts`) was executed with 100% physical pass rate:

```
=======================================================
RUNNING CIVICSLENZZ - HERMES BRIDGE CONTRACT TEST SUITE
=======================================================
  ✓ PASS: 1. Valid Inbound Job Envelope (HERMES_RESEARCH_JOB_V1)
  ✓ PASS: 2. Invalid Inbound Job (Contract Version Mismatch & Missing Fields)
  ✓ PASS: 3. Duplicate Job (Idempotent work_key matching)
  ✓ PASS: 4. Idempotent Result (Stable Content Hash & Key)
  ✓ PASS: 5. Valid Result Contract (CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1)
  ✓ PASS: 6. Invalid Result Contract Rejection
  ✓ PASS: 7. Authentication Failure & Success Checks
  ✓ PASS: 8. Canonical Unavailable (Safe Retention as RESULT_READY)
  ✓ PASS: 9. Canonical Rate Limit (429) & Backoff Calculation
  ✓ PASS: 10. Canonical 5xx Handling (Exponential Backoff)
  ✓ PASS: 11. Bounded Retry Logic
  ✓ PASS: 12. Duplicate Acknowledgment Protocol
  ✓ PASS: 13. Needs Identity Resolution Protocol
  ✓ PASS: 14. Terminal Rejection Protocol
  ✓ PASS: 15. Disk Persistence & State Recovery
  ✓ PASS: 16. Strict Machine Secret Redaction
=======================================================
TEST SUMMARY: 16 PASSED | 0 FAILED
=======================================================
```
