# SEAT, ELECTION, AND CANDIDATE PIPELINE — Dual-Track Processing

In CivicLenZ, the foundational architectural invariant is:

**SEAT DISCOVERY REQUIRES ELECTION DISCOVERY.**

CivicsLenZz must never operate as an incumbent directory with candidates tacked on as an afterthought.

---

## 1. The Core Civic Graph

```
                   ┌───────────────────┐
                   │   Jurisdiction    │
                   └─────────┬─────────┘
                             │
                             ▼
                   ┌───────────────────┐
                   │       Seat        │ ◄── [PERMANENT ANCHOR]
                   └───┬───────────┬───┘
                       │           │
       [BRANCH A]      │           │      [BRANCH B]
    Current Occupancy  │           │   Election Lifecycle
                       ▼           ▼
             ┌───────────┐       ┌───────────┐
             │ Occupancy │       │ Election  │
             └─────┬─────┘       └─────┬─────┘
                   │                   │
                   │                   ▼
                   │             ┌───────────────────┐
                   │             │ CandidateCampaign │
                   │             └─────────┬─────────┘
                   │                       │
                   ▼                       ▼
             ┌───────────────────────────────────┐
             │              Person               │
             └───────────────────────────────────┘
```

---

## 2. Invariants for First-Pass Extraction

1. **Continuous Identity**:
   * If an incumbent runs for re-election or for another office, they remain the **same Person entity**. Do not generate a new politician ID when office status changes.
   * If a candidate wins, their `CandidateCampaign` record concludes and they gain a new `SeatOccupancy` attached to the same Person.
2. **Candidates are First-Class Entities**:
   * Every filed candidate receives an extracted `CandidateCampaign` dossier.
   * Dossiers track:
     - Filing date and qualification status (`FILED`, `QUALIFIED`, `WITHDRAWN`, `DISQUALIFIED`)
     - Party affiliation
     - Official campaign website and campaign committee registration
     - Campaign finance authority link and filing numbers
     - Platform commitments, policy statements, and signed pledges
3. **Parallel Dossier Endpoint**:
   * Available at `GET /api/harvester/parallel-dossier?seat=<seat_key>`.
   * Returns Branch A and Branch B concurrently with full source provenance.
