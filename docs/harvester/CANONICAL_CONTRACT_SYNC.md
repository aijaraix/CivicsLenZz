# CANONICAL CONTRACT SYNC — CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1

All packages exported from `CivicsLenZz` to canonical `CivicLenZ` must conform to `CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1`.

---

## 1. Schema Definition

```typescript
export interface CivicLenZResearchIngestContractV1 {
  producer: 'CivicsLenZz-Harvester';
  producer_version: string;
  capability: string;
  source_key: string;
  source_url: string;
  source_authority: string;
  source_type: SourceType;
  jurisdiction_key: string;
  seat_key: string;
  person_candidate_key?: string;
  election_key?: string;
  retrieved_at: string;
  http_status: number;
  content_type: string;
  byte_length: number;
  content_hash: string; // SHA-256 of raw fetched bytes
  raw_object_reference: string;
  parser_key: string;
  parser_version: string;
  extracted_claims: Record<string, any>;
  dataset_units?: any[];
  relationships?: Array<{
    relationship_type: string;
    target_key: string;
    target_type: string;
  }>;
  warnings: string[];
  extraction_status: 'extracted_unreviewed'; // Mandatory
}
```

---

## 2. Verification Hierarchy Synchronization

Claims progress through canonical validation gates under the following levels:

| Level | Identifier | Description | Producer Role |
| :--- | :--- | :--- | :--- |
| **V0** | `V0_DISCOVERED` | Source URL or entity discovered; unparsed | Discovered by Harvester |
| **V1** | `V1_EXTRACTED` | Extracted from raw payload with byte hash | Emitted by CivicsLenZz |
| **V2** | `V2_SOURCE_VALIDATED` | Verified against primary government portal | Validated by Canonical HERMES |
| **V3** | `V3_INDEPENDENTLY_CORROBORATED` | Secondary authoritative corroboration | Validated by Canonical HERMES |
| **V4** | `V4_CANONICAL_PUBLICATION_ELIGIBLE` | Approved for public presentation | Published by Canonical HERMES |

---

## 3. Batch Envelope Specification

Batch transmissions are packaged in envelopes containing the producer manifest and physical counts:

```json
{
  "batch_id": "batch_fl_senate_20260907_01",
  "schema_version": "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1",
  "producer": "CivicsLenZz-Harvester",
  "exported_at": "2026-09-07T21:00:00.000Z",
  "records_count": 42,
  "manifest": {
    "sources_collected": 3,
    "seats_targeted": 41,
    "candidates_targeted": 12,
    "errors_count": 0
  },
  "items": [ /* ... array of CivicLenZResearchIngestContractV1 records ... */ ]
}
```
