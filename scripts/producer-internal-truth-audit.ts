/**
 * CIVICSLENZZ — PRODUCER INTERNAL TRUTH AUDIT
 * 
 * WHOLE-SYSTEM ANTI-SIMULATION & ZERO-SYNTHETIC TRUTH AUDIT
 * Enforces production invariants directly against physical disk state,
 * actual durable stores, and active source adapter behaviors.
 * 
 * Exits with 0 ONLY if all physical invariants pass.
 * Exits with 1 if any synthetic leakage, truncation, fake qualification,
 * or hardcoded officeholders are detected.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { hermesBackendStore } from '../src/lib/hermes-backend-store';
import { masterFloridaLedger } from '../src/lib/florida-master-ledger';
import { sourceAdapters, detectAccessChallenge } from '../src/lib/source-adapters';
import { HermesBridgeClient } from '../src/lib/hermes-bridge-client';
import { southFloridaRaces } from '../src/lib/elections-database';

export interface AuditInvariantResult {
  id: string;
  name: string;
  passed: boolean;
  details: string;
}

export interface ProductionTruthAuditReport {
  timestamp: string;
  producer_id: string;
  producer_version: string;
  role: string;
  overall_passed: boolean;
  physical_counts: {
    total_ledger_seats: number;
    total_store_seats: number;
    verified_seats_claimed: number;
    unverified_seats: number;
    total_raw_snapshots: number;
    total_raw_byte_files: number;
    truncated_payloads_found: number;
    total_evidence_objects: number;
    producer_verification_claims: number;
    candidate_records_audited: number;
    prematurely_qualified_candidates: number;
    synthetic_generator_production_imports: number;
    hardcoded_officeholder_names_found: number;
  };
  inspected_paths: string[];
  invariants: AuditInvariantResult[];
  disclaimers: {
    untrusted_producer_statement: string;
    canonical_authority_statement: string;
    unverified_items_statement: string;
  };
}

export function runProducerInternalTruthAudit(): ProductionTruthAuditReport {
  const timestamp = new Date().toISOString();
  const dataDir = process.env.CIVICSLENZZ_DATA_DIR || path.join(process.cwd(), 'data');
  const retrievalsDir = path.join(dataDir, 'artifacts', 'retrievals');
  const auditsDir = path.join(dataDir, 'artifacts', 'audits');

  const inspectedPaths: string[] = [
    dataDir,
    path.join(process.cwd(), 'src'),
    retrievalsDir,
    auditsDir,
    path.join(dataDir, 'hermes_persistent_db.json')
  ];

  const invariants: AuditInvariantResult[] = [];

  // -------------------------------------------------------------
  // 1. DYNAMIC INVENTORY: SEATS & HARDCODED NAMES
  // -------------------------------------------------------------
  const ledgerSeats = masterFloridaLedger.getSeatRecords();
  const storeSeats = hermesBackendStore.getSeatCoverageRecords();

  const forbiddenNames = [
    'Ron DeSantis', 'Marco Rubio', 'Rick Scott', 'Daniella Levine Cava', 'Francis Suarez'
  ];

  let hardcodedNamesCount = 0;
  for (const s of ledgerSeats) {
    if (forbiddenNames.some(n => s.current_officeholder_name?.toLowerCase().includes(n.toLowerCase()))) {
      hardcodedNamesCount++;
    }
  }
  for (const s of storeSeats) {
    if (forbiddenNames.some(n => s.current_official_name?.toLowerCase().includes(n.toLowerCase()))) {
      hardcodedNamesCount++;
    }
  }

  const baselineCompleteStore = storeSeats.filter(s => s.coverage_status === 'BASELINE_COMPLETE').length;
  const baselineCompleteLedger = ledgerSeats.filter(s => s.coverage_status === 'BASELINE_COMPLETE').length;

  invariants.push({
    id: 'ZERO_HARDCODED_OFFICEHOLDERS',
    name: 'Zero hardcoded officeholder names in master ledger and store',
    passed: hardcodedNamesCount === 0,
    details: `Found ${hardcodedNamesCount} hardcoded officeholder names across ${ledgerSeats.length} ledger seats and ${storeSeats.length} store seats.`
  });

  invariants.push({
    id: 'ZERO_PREMATURE_BASELINE_COMPLETE',
    name: 'Zero unverified seats claiming BASELINE_COMPLETE',
    passed: baselineCompleteStore === 0 && baselineCompleteLedger === 0,
    details: `Baseline complete claimed: ${baselineCompleteStore} in store, ${baselineCompleteLedger} in ledger.`
  });

  // -------------------------------------------------------------
  // 2. DYNAMIC INVENTORY: EVIDENCE OBJECTS & VERIFICATION CLAIMS
  // -------------------------------------------------------------
  const evidenceObjects = hermesBackendStore.getRawEvidenceObjects();
  let nonUnreviewedCount = 0;
  let producerVerificationClaims = 0;

  for (const ev of evidenceObjects) {
    if (ev.verification_state !== 'EXTRACTED_UNREVIEWED') {
      nonUnreviewedCount++;
    }
    if ((ev as any).verification_state === 'CANONICAL_VERIFIED' || (ev as any).verification_state === 'PRODUCER_VERIFIED') {
      producerVerificationClaims++;
    }
  }

  invariants.push({
    id: 'ALL_EVIDENCE_EXTRACTED_UNREVIEWED',
    name: 'All evidence objects marked EXTRACTED_UNREVIEWED',
    passed: nonUnreviewedCount === 0,
    details: `Evidence objects evaluated: ${evidenceObjects.length}. Non-EXTRACTED_UNREVIEWED: ${nonUnreviewedCount}.`
  });

  invariants.push({
    id: 'ZERO_PRODUCER_VERIFICATION_CLAIMS',
    name: 'Zero producer verification claims (producer has no verification authority)',
    passed: producerVerificationClaims === 0,
    details: `Producer verification claims: ${producerVerificationClaims}.`
  });

  // -------------------------------------------------------------
  // 3. DYNAMIC INVENTORY: RAW BYTE PRESERVATION & TRUNCATION
  // -------------------------------------------------------------
  const snapshots = hermesBackendStore.getRawSnapshots();
  let rawByteFilesCount = 0;
  let truncatedPayloadsFound = 0;

  if (fs.existsSync(retrievalsDir)) {
    const retrievalFiles = fs.readdirSync(retrievalsDir);
    rawByteFilesCount = retrievalFiles.length;

    for (const file of retrievalFiles) {
      const fullPath = path.join(retrievalsDir, file);
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('[TRUNCATED_AT_') || content.includes('[TRUNCATED_SOURCE_PAYLOAD]')) {
          truncatedPayloadsFound++;
        }
      } catch (err) {
        // Non-UTF8 file or read error
      }
    }
  }

  for (const snap of snapshots) {
    if (snap.raw_bytes_path && !fs.existsSync(snap.raw_bytes_path)) {
      // Snapshot claims raw_bytes_path that does not physically exist
      truncatedPayloadsFound++;
    }
  }

  invariants.push({
    id: 'FULL_RAW_BYTE_PRESERVATION',
    name: 'Full raw byte preservation (zero truncation markers)',
    passed: truncatedPayloadsFound === 0,
    details: `Inspected ${rawByteFilesCount} raw byte files in ${retrievalsDir}. Truncation markers found: ${truncatedPayloadsFound}.`
  });

  // -------------------------------------------------------------
  // 4. CANDIDATE LIFECYCLE & STATUTORY ELECTION WINDOWS (§ 99.061 F.S.)
  // -------------------------------------------------------------
  let totalCandidatesAudited = 0;
  let prematureQualifications = 0;
  let invalidCycleCount = 0;

  for (const race of southFloridaRaces) {
    if (!race.electionDate.includes('2026')) {
      invalidCycleCount++;
    }
    for (const cand of race.candidates) {
      totalCandidatesAudited++;
      // Check if candidate status claims QUALIFIED
      if ((cand as any).status === 'QUALIFIED' || (cand as any).qualificationStatus === 'QUALIFIED') {
        prematureQualifications++;
      }
    }
  }

  invariants.push({
    id: 'STATUTORY_QUALIFYING_WINDOW_COMPLIANCE',
    name: 'Candidate lifecycle compliance with Florida statutory window (§ 99.061 F.S.)',
    passed: prematureQualifications === 0 && invalidCycleCount === 0,
    details: `Audited ${totalCandidatesAudited} candidates across ${southFloridaRaces.length} races. Premature QUALIFIED statuses: ${prematureQualifications}. Invalid cycles: ${invalidCycleCount}.`
  });

  // -------------------------------------------------------------
  // 5. ZERO SYNTHETIC GENERATOR IN PRODUCTION PATHS & NO CIVIC DATABASE IN UI/SERVER
  // -------------------------------------------------------------
  let syntheticImportsInSrc = 0;
  let civicDatabaseImportsInUI = 0;
  const civicDbViolations: string[] = [];

  function scanDirForImports(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist' && entry.name !== 'legacy' && entry.name !== 'scripts' && entry.name !== 'test') {
          scanDirForImports(full);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        // Exclude legacy directory, test, scripts, or self
        if (full.includes('/legacy/') || full.includes('\\legacy\\') || full.includes('/scripts/') || full.includes('\\scripts\\') || full.includes('/test/') || full.includes('\\test\\')) continue;
        if (entry.name === 'master-data-generator.ts' || entry.name === 'civic-database.ts') continue;
        
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes('master-data-generator') || content.includes('generateDeterministic100FieldProfile')) {
          syntheticImportsInSrc++;
        }
        if (content.includes('civic-database') && (full.includes('/components/') || full.endsWith('App.tsx') || full.endsWith('server.ts'))) {
          civicDatabaseImportsInUI++;
          civicDbViolations.push(path.relative(process.cwd(), full));
        }
      }
    }
  }
  scanDirForImports(path.join(process.cwd(), 'src'));
  scanDirForImports(process.cwd()); // Also scans server.ts

  invariants.push({
    id: 'ZERO_SYNTHETIC_GENERATOR_IMPORTS',
    name: 'Zero synthetic generator imports in production src/ tree',
    passed: syntheticImportsInSrc === 0,
    details: `Found ${syntheticImportsInSrc} imports of master-data-generator across src/.`
  });

  invariants.push({
    id: 'ZERO_CIVIC_DATABASE_IMPORTS_IN_PUBLIC_UI',
    name: 'Zero civic-database imports in public UI components, App.tsx, or server.ts',
    passed: civicDatabaseImportsInUI === 0,
    details: civicDatabaseImportsInUI === 0
      ? 'All public UI components and server routes are clean of legacy civic-database imports.'
      : `Found ${civicDatabaseImportsInUI} violations in: ${civicDbViolations.join(', ')}`
  });

  // -------------------------------------------------------------
  // 5B. GETDATABASE SUMMARY SEMANTIC INTEGRITY & SEAT SEED SANITY
  // -------------------------------------------------------------
  const dbSummary = hermesBackendStore.getDatabaseSummary();
  const summarySemanticValid = 
    dbSummary.baseline_complete_seats === 0 &&
    dbSummary.gatekeeper_accepted_canonical_records === 0;

  let preseededFactualFieldsCount = 0;
  for (const s of storeSeats) {
    if (s.coverage_status === 'BASELINE_COMPLETE' || (s.coverage_status as any) === 'UNREVIEWED_RESEARCH_INGESTED') {
      preseededFactualFieldsCount++;
    }
    if (s.is_vacant !== 'UNKNOWN' && typeof s.is_vacant === 'boolean') {
      preseededFactualFieldsCount++;
    }
    if (s.tenure_years !== null && s.tenure_years !== undefined) {
      preseededFactualFieldsCount++;
    }
    if (s.next_election_date !== null && s.next_election_date !== undefined) {
      preseededFactualFieldsCount++;
    }
  }

  invariants.push({
    id: 'DATABASE_SUMMARY_SEMANTIC_INTEGRITY',
    name: 'Database summary semantics truthfully reflect unreviewed vs complete state',
    passed: summarySemanticValid,
    details: `baseline_complete_seats: ${dbSummary.baseline_complete_seats} (must be 0), gatekeeper_accepted_canonical_records: ${dbSummary.gatekeeper_accepted_canonical_records} (must be 0), unreviewed_evidence: ${dbSummary.unreviewed_evidence_objects_extracted}.`
  });

  invariants.push({
    id: 'ZERO_PRESEEDED_FACTUAL_CIVIC_FIELDS',
    name: 'Structural seat definitions contain zero pre-seeded factual civic fields',
    passed: preseededFactualFieldsCount === 0,
    details: `Evaluated ${storeSeats.length} store seats. Preseeded factual violations: ${preseededFactualFieldsCount}.`
  });

  // -------------------------------------------------------------
  // 5C. EXACT BYTE SHA-256 MATCHING FOR STORED RAW ARTIFACTS
  // -------------------------------------------------------------
  let artifactShaMismatchCount = 0;
  for (const snap of snapshots) {
    if (snap.raw_bytes_path && fs.existsSync(snap.raw_bytes_path)) {
      const fileBytes = fs.readFileSync(snap.raw_bytes_path);
      const computedSha = crypto.createHash('sha256').update(fileBytes).digest('hex');
      if (computedSha !== snap.payload_sha256) {
        artifactShaMismatchCount++;
      }
    }
  }

  invariants.push({
    id: 'EXACT_RAW_BYTE_SHA256_INTEGRITY',
    name: 'Physical raw byte files match stored SHA-256 hashes exactly',
    passed: artifactShaMismatchCount === 0,
    details: `Inspected ${snapshots.length} snapshot records. SHA-256 mismatches on disk: ${artifactShaMismatchCount}.`
  });

  // -------------------------------------------------------------
  // 6. ACCESS CHALLENGE DETECTION & FAIL-CLOSED ADAPTER BEHAVIOR
  // -------------------------------------------------------------
  const cfChallenge = detectAccessChallenge(403, '<html>Cloudflare Ray ID: 8943242<title>Attention Required! | Cloudflare</title></html>').isChallenge;
  const rateLimit = detectAccessChallenge(429, 'Rate limit exceeded').isChallenge;
  const serverError = detectAccessChallenge(503, 'Service unavailable').isChallenge;
  const legitimate = detectAccessChallenge(200, '<html><head><title>Florida Senate</title></head><body><h1>Senators</h1></body></html>').isChallenge;

  const accessChallengePassed = cfChallenge && rateLimit && serverError && !legitimate;

  invariants.push({
    id: 'FAIL_CLOSED_ACCESS_CHALLENGE_DETECTION',
    name: 'Access challenge detection flags Cloudflare, 429, and 5xx errors (fails closed)',
    passed: accessChallengePassed,
    details: `Cloudflare detected: ${cfChallenge}, 429 detected: ${rateLimit}, 503 detected: ${serverError}, Legitimate passed: ${!legitimate}.`
  });

  // -------------------------------------------------------------
  // 7. HERMES BRIDGE M2M INVARIANTS & SECRET REDACTION
  // -------------------------------------------------------------
  const bridgeClient = new HermesBridgeClient();
  const testPayload = JSON.stringify({ test: 'audit', timestamp: '1789400000' });
  const sig1 = bridgeClient.signPayload('1789400000', testPayload);
  const sig2 = bridgeClient.signPayload('1789400000', testPayload);
  const headers = bridgeClient.buildCanonicalHeaders(testPayload, '1789400000');
  const headersString = JSON.stringify(headers);

  const bridgeInvariantsPassed = 
    sig1 === sig2 &&
    typeof headers['x-civiclenz-signature'] === 'string' &&
    headers['x-civiclenz-signature'].startsWith('sha256=') &&
    !headersString.includes('sharedSecret') &&
    (bridgeClient as any).telemetry.direct_supabase_access === false &&
    (bridgeClient as any).telemetry.publication_authority === false &&
    (bridgeClient as any).telemetry.verification_authority === false;

  invariants.push({
    id: 'HERMES_BRIDGE_M2M_IDEMPOTENCE_AND_SAFETY',
    name: 'Hermes Bridge HMAC signing is idempotent, secret-redacting, and non-authoritative',
    passed: bridgeInvariantsPassed,
    details: `Idempotent: ${sig1 === sig2}, Signature format: ${headers['x-civiclenz-signature']?.slice(0, 15)}..., Non-authoritative telemetry verified.`
  });

  const overallPassed = invariants.every(i => i.passed);

  return {
    timestamp,
    producer_id: 'civicslenzz-gemini-harvester',
    producer_version: '2.2.0-HERMES-BRIDGE',
    role: 'UNTRUSTED_RESEARCH_PRODUCER',
    overall_passed: overallPassed,
    physical_counts: {
      total_ledger_seats: ledgerSeats.length,
      total_store_seats: storeSeats.length,
      verified_seats_claimed: baselineCompleteStore + baselineCompleteLedger,
      unverified_seats: ledgerSeats.length,
      total_raw_snapshots: snapshots.length,
      total_raw_byte_files: rawByteFilesCount,
      truncated_payloads_found: truncatedPayloadsFound,
      total_evidence_objects: evidenceObjects.length,
      producer_verification_claims: producerVerificationClaims,
      candidate_records_audited: totalCandidatesAudited,
      prematurely_qualified_candidates: prematureQualifications,
      synthetic_generator_production_imports: syntheticImportsInSrc,
      hardcoded_officeholder_names_found: hardcodedNamesCount
    },
    inspected_paths: inspectedPaths,
    invariants,
    disclaimers: {
      untrusted_producer_statement:
        'CivicsLenZz is an untrusted research producer. It does not possess publication authority or canonical verification authority.',
      canonical_authority_statement:
        'All publication, verification, and canonical status decisions belong exclusively to canonical CivicLenZ (aijaraix/CivicLenZ).',
      unverified_items_statement:
        'All harvested civic entities remain EXTRACTED_UNREVIEWED until independently confirmed by authoritative canonical ingestion pipelines.'
    }
  };
}

// CLI Execution Handler
if (process.argv[1] && (process.argv[1].endsWith('producer-internal-truth-audit.ts') || process.argv[1].endsWith('producer-internal-truth-audit.js'))) {
  console.log('================================================================');
  console.log('CIVICSLENZZ — PHYSICAL PRODUCER INTERNAL TRUTH AUDIT');
  console.log('================================================================');

  const report = runProducerInternalTruthAudit();

  console.log(`Timestamp:        ${report.timestamp}`);
  console.log(`Producer ID:      ${report.producer_id} (v${report.producer_version})`);
  console.log(`Producer Role:    ${report.role}`);
  console.log(`Overall Status:   ${report.overall_passed ? '✓ ALL INVARIANTS PASS' : '✗ INVARIANTS FAILED'}`);
  console.log('----------------------------------------------------------------');
  console.log('PHYSICAL COUNTS:');
  console.log(`  - Master Florida Ledger Seats:        ${report.physical_counts.total_ledger_seats}`);
  console.log(`  - Hermes Backend Store Seats:         ${report.physical_counts.total_store_seats}`);
  console.log(`  - Verified Seats Claimed:             ${report.physical_counts.verified_seats_claimed} (Must be 0)`);
  console.log(`  - Raw Source Snapshots:               ${report.physical_counts.total_raw_snapshots}`);
  console.log(`  - Raw Byte Files on Disk:             ${report.physical_counts.total_raw_byte_files}`);
  console.log(`  - Truncated Payloads Found:           ${report.physical_counts.truncated_payloads_found} (Must be 0)`);
  console.log(`  - Evidence Objects:                   ${report.physical_counts.total_evidence_objects}`);
  console.log(`  - Producer Verification Claims:       ${report.physical_counts.producer_verification_claims} (Must be 0)`);
  console.log(`  - Candidates Audited:                 ${report.physical_counts.candidate_records_audited}`);
  console.log(`  - Prematurely Qualified Candidates:   ${report.physical_counts.prematurely_qualified_candidates} (Must be 0)`);
  console.log(`  - Synthetic Generator Imports (src):  ${report.physical_counts.synthetic_generator_production_imports} (Must be 0)`);
  console.log(`  - Hardcoded Officeholder Names:       ${report.physical_counts.hardcoded_officeholder_names_found} (Must be 0)`);
  console.log('----------------------------------------------------------------');
  console.log('INVARIANT VERIFICATION:');
  for (const inv of report.invariants) {
    const symbol = inv.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`  ${symbol}: [${inv.id}] ${inv.name}`);
    console.log(`         Details: ${inv.details}`);
  }
  console.log('----------------------------------------------------------------');
  console.log('PRODUCER DISCLAIMERS:');
  console.log(`  - ${report.disclaimers.untrusted_producer_statement}`);
  console.log(`  - ${report.disclaimers.canonical_authority_statement}`);
  console.log(`  - ${report.disclaimers.unverified_items_statement}`);
  console.log('================================================================');

  if (!report.overall_passed) {
    console.error('CRITICAL AUDIT FAILURE: Physical invariants violated.');
    process.exit(1);
  } else {
    console.log('AUDIT PASSED: All physical production truth invariants satisfied.');
    process.exit(0);
  }
}
