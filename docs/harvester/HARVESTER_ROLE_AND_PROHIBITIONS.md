# HARVESTER ROLE AND PROHIBITIONS

This document specifies the exact operational boundaries, capabilities, and explicit prohibitions of the CivicsLenZz Research Harvester.

---

## 1. What the Harvester MUST Do

1. **Autonomous Frontier Harvesting**:
   * Advance through authorized geographic cohorts (Florida statewide, legislative districts, county commissions, municipal governments, school boards).
   * Discover and map primary government `.gov` endpoints, legislative rosters, court dockets, and election filings.
2. **Deterministic-First Extraction**:
   * Prioritize structured DOM traversal using `cheerio` over generic LLM inference.
   * Parse tables, lists, images, and anchors directly from raw HTML.
3. **Cryptographic Byte Archiving**:
   * Capture raw source payloads via direct TLS HTTP requests.
   * Compute SHA-256 hashes directly over the captured byte arrays.
   * Store raw object references alongside extracted claims.
4. **Parallel Seat + Election Research**:
   * For every seat discovered, immediately fork into:
     - Branch A: Current occupant / vacancy / term data
     - Branch B: Election cycle / filing windows / candidate filings / campaign committees
5. **Continuous Source Monitoring**:
   * Calculate ETag and byte-hash drift across official feeds to detect new candidate filings, legislative bill sponsorships, or executive actions.

---

## 2. Strict Prohibitions (Zero Tolerance)

1. **NO Canonical Truth Declaration**:
   * The harvester is strictly forbidden from setting `verification_state: "VERIFIED"`. All items are `extracted_unreviewed`.
2. **NO Synthetic / Random Data**:
   * `Math.random()` is banned from all runtime code.
   * Zero synthetic politicians, fabricated campaign donations, simulated voting records, or mock polling data.
3. **NO LLM "Hallucinated Verification"**:
   * Neither Gemini nor web search results constitute verification. They are research accelerators only.
4. **NO Global "100% Complete" Flags**:
   * Civic data is continuous. Never declare a profile globally "complete." Express state as `CURRENT_AS_OF` or `BASELINE_SUFFICIENT`.
5. **NO Merging Incomplete Capabilities with Zero Records**:
   * `CAPABILITY_NOT_IMPLEMENTED` must NEVER be recorded as `CHECKED_NO_AUTHORITATIVE_RESULT`. If a parser does not exist, the operational state must remain `CAPABILITY_NOT_IMPLEMENTED`.
6. **NO Direct Writes to Canonical Production**:
   * The harvester must never write directly into canonical Supabase tables or production R2 buckets without going through the canonical ingest/validation pipeline.
