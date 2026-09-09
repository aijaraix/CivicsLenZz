# CANONICAL ALIGNMENT — Subordination to CivicLenZ

**Canonical System**: `aijaraix/CivicLenZ`  
**Subordinate Harvester System**: `aijaraix/CivicsLenZz`

---

## 1. Upstream Authority

`aijaraix/CivicLenZ` is the canonical specification owner, truth arbiter, and public presentation platform for the CivicLenZ nationwide civic intelligence system.

`aijaraix/CivicsLenZz` is an advance research harvester operating under the direction of canonical standards. It does not set policy, redefine schema contracts, or declare civic facts to be "verified."

```
┌───────────────────────────────────────────────────────────┐
│                    CANONICAL SYSTEM                       │
│                   aijaraix/CivicLenZ                      │
│                                                           │
│  • Defines Canonical Contracts (Ingest Contract V1)       │
│  • Manages Research Work Ledger & Identity Reservations   │
│  • Validates Evidence Objects & Contradictions            │
│  • Enforces Publication Policies (V0 -> V4)               │
│  • Authoritative Supabase & Cloudflare R2 Datastores      │
└─────────────────────────────▲─────────────────────────────┘
                              │
               CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1
               (Strictly: extraction_status: "extracted_unreviewed")
                              │
┌─────────────────────────────┴─────────────────────────────┐
│                   HARVESTER SYSTEM                        │
│                  aijaraix/CivicsLenZz                     │
│                                                           │
│  • Discovers Government Portals & Roster Tables           │
│  • Fetches Raw HTML/JSON via Direct TLS HTTP GET          │
│  • Computes SHA-256 Byte Fingerprints                     │
│  • Parses Entities Deterministically (Cheerio DOM)        │
│  • Gathers Parallel Seat, Election, & Candidate Dossiers  │
│  • Emits Staged Batches for Canonical Review              │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Core Invariants

1. **Producer Independence**:
   * HERMES (canonical) must remain capable of operating if Gemini, CivicsLenZz, or any other producer is unavailable.
   * CivicsLenZz is a replaceable executor; canonical HERMES owns the Research Work Ledger, reservations, and validation.
2. **Work Identity & Reservation**:
   * To prevent duplicate research across VPS workers, Cloudflare workers, and CivicsLenZz, work is keyed deterministically by `ResearchWorkIdentity` (`jurisdiction:seat:domain:cycle`).
3. **Subordinate Verification Status**:
   * Every claim extracted by CivicsLenZz is tagged `extraction_status: "extracted_unreviewed"`.
   * Only canonical validation pipelines can promote claims to `V2_SOURCE_VALIDATED`, `V3_INDEPENDENTLY_CORROBORATED`, or `V4_CANONICAL_PUBLICATION_ELIGIBLE`.
4. **Authoritative Specification Tracking**:
   * The canonical repository commits in `docs/control-plane/` are the absolute law. When canonical directives change, CivicsLenZz updates its adapters to match.
