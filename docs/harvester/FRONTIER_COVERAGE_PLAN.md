# FRONTIER COVERAGE PLAN — Florida Master Sequence

`CivicsLenZz` executes advance frontier research along a phased geographic roadmap for the State of Florida before expanding nationally.

---

## 1. Florida Geographic Cohort Phases

```
Phase 1: Statewide Executive Cabinet (Governor, Attorney General, CFO, Agriculture Comm.)
   │
Phase 2: Florida State Senate (40 Districts)
   │
Phase 3: Florida House of Representatives (120 Districts)
   │
Phase 4: Florida Federal Congressional Delegation (28 U.S. House + 2 U.S. Senate)
   │
Phase 5: South Florida Priority Metro (Miami-Dade, Broward, Palm Beach County Commissions)
   │
Phase 6: Remaining 64 County Commissions
   │
Phase 7: Major Municipalities (Miami, Tampa, Orlando, Jacksonville, St. Petersburg, etc.)
   │
Phase 8: 67 District School Boards & 5 Regional Water Management Districts
```

---

## 2. Active Cohort Statuses

| Cohort Name | Expected Seats | Census Layer | Local GIS Layer Required | Harvester Status |
| :--- | :--- | :--- | :--- | :--- |
| **FL Statewide Executive** | 4 Seats | State of Florida (FIPS 12) | None (Statewide at-large) | **HARVESTED / STAGED** |
| **FL State Senate** | 40 Seats | 2024 SLDU (Districts 1–40) | None (Direct Census) | **HARVESTED / STAGED** |
| **FL State House** | 120 Seats | 2024 SLDL (Districts 1–120) | None (Direct Census) | **IN PROGRESS** |
| **FL Congressional** | 28 Seats | 119th Congress (Districts 1–28) | None (Direct Census) | **IN PROGRESS** |
| **Miami-Dade County** | 14 Seats | County FIPS 086 | Board of County Commissioners GIS | **QUEUED (Local GIS)** |
| **Broward County** | 9 Seats | County FIPS 011 | Board of County Commissioners GIS | **QUEUED (Local GIS)** |
| **Palm Beach County** | 7 Seats | County FIPS 099 | Board of County Commissioners GIS | **QUEUED (Local GIS)** |

---

## 3. Frontier Advance Rule

Once a cohort has achieved baseline first-pass coverage (Seats + Current Occupancy + Election Authority + Candidate Filings + Raw Snapshots + SHA-256 Hashes) and emitted Ingest Contract packages, the Harvester advances geographically to the next cohort. Deep validation and corroboration are handled by canonical HERMES.
