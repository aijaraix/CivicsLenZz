# HERMES SERVER-SIDE WORKER RUNTIME ENGINE
**CivicLenZ / HERMES Asynchronous Execution Architecture**

---

## 1. Runtime Architecture Overview

The HERMES Server-Side Worker Engine runs as a background process inside the Node Express server (`server.ts`). It executes 24 hours a day, 7 days a week, independently of any open browser sessions, laptop state, or user logins.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NODE EXPRESS SERVER (server.ts)                   │
│                                                                             │
│  ┌───────────────────────┐             ┌─────────────────────────────────┐  │
│  │  HERMES Server Daemon │             │  Persistent DB Store            │  │
│  │ (hermes-worker-daemon)│             │ (hermes_persistent_db.json)     │  │
│  └───────────┬───────────┘             └────────────────┬────────────────┘  │
│              │                                          │                   │
│              ▼                                          ▼                   │
│  ┌───────────────────────┐             ┌─────────────────────────────────┐  │
│  │ Job Queue & Lease Mgr │◄───────────►│ Job Tables & Execution Logs     │  │
│  │ (hermes-backend-store)│             │ - hermes_jobs                   │  │
│  └───────────┬───────────┘             │ - hermes_worker_leases          │  │
│              │                         │ - raw_ingestion_records         │  │
│              ▼                         │ - raw_evidence_objects          │  │
│  ┌───────────────────────┐             │ - seat_coverage_status          │  │
│  │ Live Source Adapters  │             │ - dead_letter_jobs              │  │
│  │ (Florida DOS, Senate, │             └─────────────────────────────────┘  │
│  │  House, SOE, FEC, etc)│                                                  │
│  └───────────────────────┘                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Job Execution Lifecycle

1. **Job Creation**: HERMES Prime or Seat Controllers create real `HermesJob` entries in `hermes_jobs` with status `QUEUED`.
2. **Lease Acquisition**: A background worker instance (e.g. `H1-worker-001`) claims an available job and obtains a time-limited lease in `hermes_worker_leases` (`status = 'LEASED'`, `lease_expires_at = Date.now() + 60000`).
3. **Execution**: The worker invokes the corresponding `SourceAdapter` to fetch authoritative live data, parse records, and generate raw snapshots.
4. **Evidence Generation**: The worker creates SHA-256 cryptographic evidence objects in `raw_evidence_objects` containing retrieved payload hashes, source URLs, and deep links.
5. **Checkpointing & Completion**: The worker saves progress in `hermes_checkpoints`, updates field states in `research_contract_status` and `seat_coverage_status`, sets job status to `COMPLETED`, and releases the lease.
6. **Lease Expiry Watchdog**: If a worker process dies mid-job, the watchdog detects expired leases (`lease_expires_at < Date.now()`) and automatically re-queues the job or increments retry attempts.
7. **Retry & Exponential Backoff**: On transient failures (timeouts, 429 rate limits, 503 service unavailable), jobs are scheduled for retry with exponential backoff + jitter. If `attempt_count >= max_attempts`, the job transitions to `DEAD_LETTER`.

---

## 3. Server API Endpoints

The backend server exposes the following REST endpoints to the frontend UI:
- `GET /api/hermes/status`: Backend daemon worker status, active leases, backlog depth, dead letters, uptime.
- `GET /api/hermes/jobs`: List real jobs in queue, completed jobs, and failed attempts.
- `GET /api/hermes/coverage`: Live Florida Seat Ledger & Coverage statistics computed directly from DB.
- `GET /api/hermes/evidence`: Real SHA-256 evidence records with primary source links.
- `GET /api/hermes/audit`: Forensic reality matrix and source adapter health status.
- `POST /api/hermes/jobs/create`: Dispatch a real seat research mission or completeness loop.
