# COHORT READINESS STANDARD

This document specifies the minimum empirical criteria required before a geographic cohort can be declared ready for canonical export and validation handoff.

---

## 1. Readiness Invariant

A cohort cannot claim readiness merely because seat titles and current occupants were collected. 

**True readiness requires concurrent coverage across the Seat, Election, and Candidate lifecycle.**

---

## 2. Mandatory Readiness Checklist

Before a cohort package can be exported as `COHORT_READINESS_PACKAGE_V1`, the following conditions must be satisfied:

1. **Seat Universe Enumerate**:
   * All authorized seats in the cohort are enumerated (e.g., exactly 40 seats for Florida State Senate).
2. **Current Occupancy Verified**:
   * Every seat has a documented occupant or an explicit, verified `VACANT` / `ACTING` status.
3. **Election Authority Identified**:
   * Official election administrative body identified (e.g., Florida Division of Elections, County Supervisor of Elections).
4. **Current / Upcoming Election Cycle Mapped**:
   * Election date, cycle year, and filing/qualification calendar documented.
5. **CandidateCampaign Discovery**:
   * All actively filed, qualified, or withdrawn candidates on the official docket are extracted.
6. **Raw Evidence Preservation**:
   * Every extracted record has an associated raw source file, retrieval timestamp, HTTP status, and cryptographic SHA-256 byte hash.
7. **No Synthetic Fillers**:
   * Zero fabricated candidates, fake donors, or simulated biographies. If no candidate has filed, the candidate count is empirically `0`.
8. **Geographic Layer Classification**:
   * Boundary source explicitly tagged as either `US_CENSUS_BUREAU_TIGER` or `PENDING_LOCAL_GIS`.

---

## 3. Cohort Status Output Format

```typescript
export interface CohortReadinessReport {
  cohort_name: string;
  jurisdiction_key: string;
  total_seats_expected: number;
  total_seats_discovered: number;
  occupancy_coverage_rate: number; // 0.0 to 1.0
  election_coverage_rate: number;  // 0.0 to 1.0
  candidates_discovered: number;
  unresolved_identities_count: number;
  evidence_snapshots_stored: number;
  readiness_verdict: 'BASELINE_SUFFICIENT' | 'INCOMPLETE_RESEARCH' | 'BLOCKED';
}
```
