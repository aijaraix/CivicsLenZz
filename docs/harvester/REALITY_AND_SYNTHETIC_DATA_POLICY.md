# REALITY AND SYNTHETIC DATA POLICY — Strict Zero-Synthetic Mandate

In CivicsLenZz, reality is sacred. Civic intelligence systems that fabricate data destroy trust and compromise democratic accountability.

---

## 1. Absolute Prohibitions

1. **`Math.random()` Banned**:
   * No pseudorandom generators may be used anywhere in the data extraction, transformation, or reporting pipelines.
2. **No Placeholder / Fake Entities**:
   * Never insert fictional politicians (e.g., "John Doe", "Jane Smith"), synthetic candidates, or mocked party committees to fill out an interface or meet a quota.
3. **No Simulated Metrics**:
   * Polling percentages, campaign contribution dollar amounts, voter registration counts, and legislative votes must be derived exclusively from real records.
4. **No Artificial Completion**:
   * If a candidate's campaign finance filings cannot be found, the finance field must be marked `INSUFFICIENT_EVIDENCE` or `RESEARCH_IN_PROGRESS`—never estimated or faked.

---

## 2. Operational Capability vs. Empirical Reality

A critical failure mode in automated systems is confusing an internal bug or missing parser with a real-world fact:

$$\text{CAPABILITY\_NOT\_IMPLEMENTED} \neq \text{CHECKED\_NO\_AUTHORITATIVE\_RESULT}$$

* **`CAPABILITY_NOT_IMPLEMENTED`**:
  - The harvester lacks an active adapter or tool to query the specific county clerk portal.
  - **Verdict**: Operational backlog item. Must NOT be recorded as evidence of non-existence.
* **`CHECKED_NO_AUTHORITATIVE_RESULT`**:
  - An implemented, tested parser queried the official registry through all required pagination or search parameters and proved that no record exists.
  - **Verdict**: Legitimate negative civic research (e.g., confirmed that no campaign disclosure was filed by the statutory deadline).

---

## 3. Physical State Verification Standards

Every report emitted by CivicsLenZz must present physical, verifiable counts:
- `HARVESTED`: Actual captured source files on disk.
- `EXTRACTED_UNREVIEWED`: Extracted entities pending canonical review.
- `EXPORTED`: Packages delivered under Ingest Contract V1.
- `CANONICAL_ACCEPTED`: Strictly 0 until verified by canonical CivicLenZ.
- `VERIFIED`: Strictly 0 until verified by canonical CivicLenZ.
