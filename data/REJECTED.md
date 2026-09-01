# REJECTED.md — Synthetic & Unverifiable Records Ledger

This document lists synthetic, mock, placeholder, or algorithmic records that were rejected from the authentic research data vault (`data/people/`, `data/occupancies/`).

## 1. Source of Truth & Untrusted Research Notice
* **CivicLenZ (`aijaraix/CivicLenZ`)**: Source of truth for verified civic data.
* **CivicsLenZz (`aijaraix/CivicsLenZz`)**: Untrusted research repository. Contains only unreviewed, raw extracted facts.

## 2. Rejected Synthetic Name Generators & Stubs
The following generated profiles and synthetic placeholders have been explicitly purged and barred from inclusion in `data/people/` and `data/occupancies/`:

* **Synthetic 50-State Generators**:
  - `generateDeterministic100FieldProfile` synthetic profiles across 50 states (e.g., "Aaliyah Garcia", "Carlos Rodriguez", "Marcus Vance", "Elena Rostova", "Hon. Governor of Alabama").
  - 4-stub per state placeholder matrices (`01_ELECTED_OFFICIALS_50_STATES` stubs).
* **Fake / Placeholder Contact Details**:
  - All synthetic `555-01XX` telephone numbers.
  - All algorithmic emails (e.g., `governor@alabama.gov` synthetic stubs).
  - Unsplash placeholder images and stock photos.
* **Simulated Metrics**:
  - Simulated 5.12M data point ledger stubs.
  - Simulated 174,850 official counts.
  - Auto-generated verification badges ("CRYPTOGRAPHICALLY_VERIFIED", "100% complete"). All inbound facts are labeled strictly as `extractionStatus: "extracted_unreviewed"`.

## 3. Policy Enforcement
Any record without an authentic source URL, a non-empty SHA-256 snapshot hash, and a real human legal name is rejected and logged here.
