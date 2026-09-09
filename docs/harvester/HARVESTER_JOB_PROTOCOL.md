# HARVESTER JOB PROTOCOL — Autonomous Execution & Leasing

This document defines the lifecycle of autonomous research jobs within CivicsLenZz, including coordination with canonical HERMES to prevent duplicate work.

---

## 1. Job Lifecycle States

```
[QUEUED] ──► [LEASED] ──► [FETCHING] ──► [PARSING] ──► [STAGED_UNREVIEWED] ──► [EXPORTED]
                │              │             │
                ▼              ▼             ▼
          [LEASE_EXPIRED] [FETCH_ERROR] [PARSE_ERROR]
                │              │             │
                └──────────────┴─────────────┴──► [BLOCKED / QUARANTINED]
```

1. **`QUEUED`**: A targeted seat, roster, or docket is identified for harvest.
2. **`LEASED`**: The harvester reserves the job under a deterministic `ResearchWorkIdentity` to prevent duplicate concurrent harvesting.
3. **`FETCHING`**: A direct TLS HTTP request is dispatched with strict timeout (15s) and user-agent signaling.
4. **`PARSING`**: Deterministic Cheerio/DOM extraction parses entities, claims, and links.
5. **`STAGED_UNREVIEWED`**: Claims and SHA-256 byte hashes are assembled into an Ingest Contract record.
6. **`EXPORTED`**: The package is emitted to `data/exports/` or served via `/api/harvester/export-contract`.

---

## 2. Deterministic Research Work Identity

To ensure idempotency across workers:

$$\text{WorkKey} = \text{SHA256}(\text{jurisdiction\_key} + \text{":"} + \text{seat\_key} + \text{":"} + \text{research\_domain} + \text{":"} + \text{cycle})$$

Example:
* `jurisdiction_key`: `jurisdiction_us_fl`
* `seat_key`: `seat_fl_senate_35`
* `research_domain`: `OFFICIAL_ROSTER`
* `cycle`: `2024-2026`
* Yields unique work identity that prevents duplicate fetching.

---

## 3. Rate Limiting and Politeness Rules

* **Concurrency**: Maximum 5 concurrent HTTP requests to the same domain.
* **Backoff**: Exponential backoff (1s, 2s, 4s, 8s) upon encountering HTTP 429 or 503.
* **User-Agent**: Clear identification: `CivicLenZ-Harvester/2.1 (Advance Research Engine; +https://civiclenz.org)`.
* **Caching**: Cache headers (ETag / Last-Modified) must be respected to minimize origin server load.
