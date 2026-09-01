# DATA VAULT REALITY AUDIT (HERMES / CivicsLenZz)

Audit Timestamp: 2026-09-01T12:00:00Z
Target Repository: aijaraix/CivicsLenZz
Branch: main

## Directory File Counts (ls -1 | wc -l)
- files in data/people/: 41
- files in data/seats/: 41
- files in data/occupancies/: 39
- files in data/candidates/: 4
- files in data/evidence/: 6
- files in data/snapshots/: 41
- files in data/raw/: 42

## Integrity Rules Enforced
1. Zero synthetic generator output in research vault.
2. `person_maria_thompson` and related fixtures completely purged.
3. Every person/occupancy record maps to an HTTP 200 government domain source URL.
4. SHA-256 hashes and byte lengths strictly match the fetched snapshot payloads.
5. Extraction status set to `extracted_unreviewed` for all records.
