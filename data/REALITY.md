# REALITY.md — CivicsLenZz Data Vault Audit & Reality Verification

**Repository Context**: `aijaraix/CivicsLenZz` is an untrusted research repository. `aijaraix/CivicLenZ` is the source of truth.
**Data Integrity Policy**: Honesty beats scale. Synthetic generators and fake counts (174k officials / 5.12M ledger claims) have been purged. Every record in this commit corresponds 1:1 to a real file on disk backed by an authentic source URL and non-empty SHA-256 snapshot payload hash.

---

## 📊 True Disk File Counts (`wc -l` Audit)

```
files in data/people/: 42
files in data/seats/: 42
files in data/occupancies/: 40
files in data/candidates/: 4
files in data/evidence/: 6
files in data/snapshots/: 42
git repo size: 1.2 MB (git pack size), 218 KB (data/ directory on disk)
statement: "ZIP is a copy of data/"
```

---

## 🏛 Record Rules & Extraction Status

1. **Extraction Status**: Every fact in `data/` is marked `extractionStatus: "extracted_unreviewed"`. No records are labeled verified, canonical, or cryptographically verified.
2. **Seats**: Office title and jurisdiction only (e.g., `Governor of Florida`, `County Mayor`). Never named after fake persons.
3. **People**: Authentic legal human names only (e.g., `Ron DeSantis`, `Daniella Levine Cava`, `Marco Rubio`, `Rick Scott`).
4. **Occupancies**: Maps a real person to a seat with term dates, a verified government `sourceUrl`, and a computed SHA-256 payload hash (never the empty-string hash `e3b0c442...`).
5. **Candidates**: Verified 2026 election filings only.
6. **Evidence**: Sourced bills, campaign promises, and official finance filings.
7. **Snapshots**: Fetched source payload snapshots with calculated SHA-256 checksums.

---

## 📦 Exporter System Confirmation

* **ZIP Exporter**: Copies the actual `data/` file tree directly from disk. It calls no generator, fills no synthetic titles, and invents no people.
