/**
 * CIVICSLENZZ PRODUCER MANIFEST
 * 
 * Formal Producer Identity and Capability Declaration for CivicsLenZz Harvester.
 * Strictly subordinate to canonical system (aijaraix/CivicLenZ).
 */

export interface HarvesterProducerCapability {
  id: string;
  category: 'EXTRACTION' | 'PARSING' | 'ARCHIVAL' | 'GEOSPATIAL' | 'DISCOVERY' | 'EVOLUTION';
  name: string;
  description: string;
  deterministic: boolean;
  status: 'OPERATIONAL' | 'STAGED';
}

export interface HarvesterProhibitionRule {
  rule_id: string;
  title: string;
  description: string;
  enforcement: 'HARD_ERROR' | 'DEFAULT_STATUS_OVERRIDE' | 'SCHEMA_CONSTRAINT';
}

export const CIVICSLENZZ_PRODUCER_MANIFEST = {
  producer_id: "civicslenzz-gemini-harvester",
  producer_name: "CivicsLenZz-Gemini-Harvester",
  producer_version: "2.2.0-HERMES-BRIDGE",
  canonical_upstream: "aijaraix/CivicLenZ",
  contract_versions_supported: [
    "HERMES_RESEARCH_JOB_V1",
    "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1"
  ],
  contract_package_version: "CANONICAL_RESEARCH_CONTRACT_PACKAGE_V1",
  target_ingest_contract: "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1",
  environment: "PRODUCTION_ADVANCE_HARVESTER",
  runtime_version: process.version || "v20.x",
  result_formats: [
    "application/json",
    "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1"
  ],
  default_extraction_status: "extracted_unreviewed",
  
  capabilities: [
    {
      id: "official_legislature_extraction",
      category: "EXTRACTION",
      name: "State Legislature Roster & Committee Harvester",
      description: "Extracts official rosters, district assignments, and committee dockets from flsenate.gov and myfloridahouse.gov",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "official_executive_extraction",
      category: "EXTRACTION",
      name: "State Executive & Constitutional Officers Harvester",
      description: "Extracts Governor, Cabinet, and statewide executive actions from flgov.com and official agency portals",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "election_authority_discovery",
      category: "DISCOVERY",
      name: "Election Cycle & Authority Discovery",
      description: "Catalogs official election authorities, filing windows, qualification deadlines, and registration links",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "candidate_campaign_discovery",
      category: "DISCOVERY",
      name: "First-Class Candidate Campaign Harvester",
      description: "Extracts filed, qualified, and withdrawn candidates, campaign committees, finance links, and official platform statements",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "cheerio_dom_roster_parsing",
      category: "PARSING",
      name: "Deterministic DOM Table/Card Parser",
      description: "Deterministic CSS/XPath extraction of official rosters without generative hallucinations",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "tls_raw_byte_archival",
      category: "ARCHIVAL",
      name: "Direct TLS HTTP Raw Byte Archiver",
      description: "Stores unaltered raw HTML and JSON responses in data/snapshots/ alongside HTTP response headers and status codes",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "sha256_cryptographic_verification",
      category: "ARCHIVAL",
      name: "Cryptographic SHA-256 Digital Seal",
      description: "Computes SHA-256 over raw byte payloads to provide non-repudiable provenance evidence for HERMES verification",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "census_tiger_web_geocoding",
      category: "GEOSPATIAL",
      name: "US Census Bureau TIGERweb Geocoding",
      description: "Resolves street addresses to State Legislative Upper/Lower and Congressional districts via Census Bureau APIs",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "boundary_evolution_tracking",
      category: "EVOLUTION",
      name: "Boundary and Seat Evolution Monitoring",
      description: "Tracks geometry versions, hashes, and generates structured unreviewed change candidates for redistricting or annexation",
      deterministic: true,
      status: "OPERATIONAL"
    },
    {
      id: "parallel_4track_research_dossier",
      category: "DISCOVERY",
      name: "Parallel 4-Track Seat Research Pipeline",
      description: "Discovers Seat and concurrently produces Track A (Civic Structure), Track B (Election & Candidates), Track C (Governance Activity), and Track D (Evidence & Geospatial)",
      deterministic: true,
      status: "OPERATIONAL"
    }
  ] as HarvesterProducerCapability[],

  prohibitions: [
    {
      rule_id: "NO_CANONICAL_VERIFICATION",
      title: "Prohibition: Canonical Verification",
      description: "CivicsLenZz cannot verify data or mark records VERIFIED or CANONICAL_ACCEPTED. All civic outputs default strictly to extracted_unreviewed. Only canonical HERMES may verify.",
      enforcement: "HARD_ERROR"
    },
    {
      rule_id: "NO_CANONICAL_PUBLICATION",
      title: "Prohibition: Canonical Publication",
      description: "CivicsLenZz is an untrusted advance research producer without authority to publish to the canonical public ledger or end-user endpoints.",
      enforcement: "HARD_ERROR"
    },
    {
      rule_id: "NO_CANONICAL_IDENTITY_OVERRIDE",
      title: "Prohibition: Canonical Identity Override",
      description: "CivicsLenZz cannot override or unilaterally alter canonical Person, Seat, or Election entity resolutions established by HERMES.",
      enforcement: "HARD_ERROR"
    },
    {
      rule_id: "NO_TRUTH_STANDARD_OVERRIDE",
      title: "Prohibition: Truth-Standard Override",
      description: "CivicsLenZz cannot redefine truth criteria, relax provenance validation rules, or bypass evidentiary cryptographic checks.",
      enforcement: "HARD_ERROR"
    },
    {
      rule_id: "NO_DIRECT_CANONICAL_DATABASE_WRITES",
      title: "Prohibition: Direct Canonical Database Writes",
      description: "CivicsLenZz must never receive direct unrestricted write access to canonical CivicLenZ Supabase storage; all output must flow through the authenticated canonical ingest gateway.",
      enforcement: "SCHEMA_CONSTRAINT"
    },
    {
      rule_id: "NO_SYNTHETIC_DATA",
      title: "Zero Synthetic or Mock Civic Data",
      description: "Strict prohibition against fabricating civic officials, candidate platforms, election outcomes, vote tallies, campaign finances, or civic metrics.",
      enforcement: "HARD_ERROR"
    },
    {
      rule_id: "NO_RANDOM_GENERATION",
      title: "Zero Math.random() in Production Logic",
      description: "All parsing, matching, and data production must be strictly deterministic and reproducible.",
      enforcement: "HARD_ERROR"
    },
    {
      rule_id: "NO_UNSUPPORTED_BOUNDARY_INFERENCE",
      title: "No Unsupported Boundary Inference",
      description: "Do not synthesize fictional polygon bounds for local jurisdictions without authoritative local GIS shapefiles.",
      enforcement: "SCHEMA_CONSTRAINT"
    }
  ] as HarvesterProhibitionRule[]
};
