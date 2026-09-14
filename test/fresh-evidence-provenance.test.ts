/**
 * FRESH EVIDENCE PROVENANCE & REAL_PROVEN CLASSIFICATION TEST SUITE
 * 
 * Verifies:
 * 1. Fresh real retrieval with DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC classifies as REAL_PROVEN
 * 2. Exact raw snapshot byte match and SHA-256 verification yields REAL_PROVEN
 * 3. Legacy records with legacy parser versions or content_to_hash are classified as LEGACY_SYNTHETIC
 * 4. Synthetic generator markers or non-authoritative claims are REJECTED / SYNTHETIC
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import assert from 'assert';

const isolatedTestDir = fs.mkdtempSync(path.join(os.tmpdir(), 'civicslenzz-provenance-test-'));
process.env.CIVICSLENZZ_DATA_DIR = isolatedTestDir;

import { hermesBackendStore } from '../src/lib/hermes-backend-store';

// Reinitialize store in isolated temp directory
hermesBackendStore.reinitialize(isolatedTestDir);

let passed = 0;
let failed = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res.then(() => {
        passed++;
        console.log(`  ✓ PASS: ${name}`);
      }).catch(err => {
        failed++;
        console.error(`  ✗ FAIL: ${name}`, err);
      });
    } else {
      passed++;
      console.log(`  ✓ PASS: ${name}`);
    }
  } catch (err) {
    failed++;
    console.error(`  ✗ FAIL: ${name}`, err);
  }
}

async function runAllProvenanceTests() {
  console.log("\n=======================================================");
  console.log("RUNNING FRESH EVIDENCE PROVENANCE & REAL_PROVEN TEST SUITE");
  console.log("=======================================================\n");

  // TEST 1: Fresh Real Retrieval with exact byte match -> REAL_PROVEN
  await runTest("1. Fresh real retrieval with DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC classifies as REAL_PROVEN", () => {
    const realHtml = `<!DOCTYPE html><html><head><title>Florida Senate Roster</title></head><body><h1>Senator District 34</h1><div class="roster-item">Shevrin Jones</div></body></html>`;
    const realBytes = Buffer.from(realHtml, 'utf8');
    const sha256 = crypto.createHash('sha256').update(realBytes).digest('hex');

    const snapshot = hermesBackendStore.storeRawSnapshot({
      source_uuid: 'src_fl_senate_official',
      target_url: 'https://flsenate.gov/Senators/s34',
      http_status: 200,
      content_type: 'text/html; charset=utf-8',
      byte_length: realBytes.byteLength,
      raw_payload: realHtml,
      parser_version: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC'
    });

    assert.ok(snapshot.snapshot_uuid, "Snapshot UUID must be generated");
    assert.strictEqual(snapshot.provenance_classification, 'REAL_PROVEN');
    assert.strictEqual(hermesBackendStore.classifySnapshot(snapshot), 'REAL_PROVEN');

    const evidence = hermesBackendStore.createEvidenceObject({
      seat_uuid: 'seat_fl_senate_34',
      source_uuid: 'src_fl_senate_official',
      source_url: 'https://flsenate.gov/Senators/s34',
      document_title: 'Florida Senate Official Roster - District 34',
      document_type: 'OFFICIAL_ROSTER',
      source_tier: 'TIER_A',
      field_key: 'official_name',
      extracted_value: 'Shevrin Jones',
      claim_fingerprint: 'claim_sd34_shevrin_jones',
      raw_snapshot_uuid: snapshot.snapshot_uuid,
      retrieval_content_sha256: sha256,
      extraction_method: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',
      parser_version: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',
      verification_state: 'EXTRACTED_UNREVIEWED'
    });

    assert.ok(evidence.evidence_uuid, "Evidence UUID must be generated");
    assert.strictEqual(evidence.provenance_classification, 'REAL_PROVEN');
    assert.strictEqual(evidence.verification_state, 'EXTRACTED_UNREVIEWED');
    assert.strictEqual(evidence.retrieval_content_sha256, sha256);
    assert.strictEqual((evidence as any).content_to_hash, undefined, "content_to_hash must not be persisted on new evidence");
  });

  // TEST 2: Exact Raw Snapshot Byte Match -> REAL_PROVEN
  await runTest("2. Stored byte payload passes disk verification and validates as REAL_PROVEN", () => {
    const rawText = "Official Florida Division of Elections Candidate Filing Report\nCandidate: Test Candidate\nOffice: State Representative District 100";
    const rawBytes = Buffer.from(rawText, 'utf8');

    const snapshot = hermesBackendStore.storeRawSnapshot({
      source_uuid: 'src_fl_dos_elections',
      target_url: 'https://dos.elections.myflorida.com/candidates/canlist.asp',
      http_status: 200,
      content_type: 'text/plain; charset=utf-8',
      byte_length: rawBytes.byteLength,
      raw_payload: rawText,
      parser_version: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC'
    });

    const classification = hermesBackendStore.classifySnapshot(snapshot);
    assert.strictEqual(classification, 'REAL_PROVEN');
  });

  // TEST 3: Legacy records with legacy parser or content_to_hash -> LEGACY_SYNTHETIC
  await runTest("3. Legacy records with legacy parser versions or content_to_hash classify as LEGACY_SYNTHETIC", () => {
    const legacySnapshot = {
      snapshot_uuid: 'snap_legacy_001',
      seat_uuid: 'seat_fl_senate_1',
      source_name: 'LEGACY_SOURCE',
      source_url: 'https://flsenate.gov/Senators/s1',
      retrieved_at: '2026-01-01T00:00:00Z',
      http_status: 200,
      mime_type: 'text/html',
      byte_length: 100,
      payload_sha256: 'abc123456789',
      parser_version: 'DETERMINISTIC_PARSER_V2'
    };
    const snapClass = hermesBackendStore.classifySnapshot(legacySnapshot as any);
    assert.strictEqual(snapClass, 'LEGACY_SYNTHETIC');

    const legacyEvidence = {
      evidence_uuid: 'ev_legacy_001',
      seat_uuid: 'seat_fl_senate_1',
      source_name: 'LEGACY_SOURCE',
      source_url: 'https://flsenate.gov/Senators/s1',
      source_type: 'PRIMARY_GOVERNMENT_PORTAL',
      extracted_claim: 'Legacy claim',
      claim_fingerprint: 'fp_legacy',
      raw_snapshot_uuid: 'snap_legacy_001',
      extracted_at: '2026-01-01T00:00:00Z',
      extraction_method: 'DETERMINISTIC_PARSER_V2',
      verification_state: 'EXTRACTED_UNREVIEWED',
      content_to_hash: 'legacy_content'
    };
    const evClass = hermesBackendStore.classifyEvidence(legacyEvidence as any);
    assert.strictEqual(evClass, 'LEGACY_SYNTHETIC');
  });

  // TEST 4: Synthetic Generator Content -> REJECTED / SYNTHETIC
  await runTest("4. Synthetic content markers are rejected as SYNTHETIC", () => {
    const syntheticSnapshot = {
      snapshot_uuid: 'snap_synth_001',
      seat_uuid: 'seat_fl_gov',
      source_name: 'SYNTHETIC_GENERATOR',
      source_url: 'http://localhost/synthetic',
      retrieved_at: '2026-09-14T00:00:00Z',
      http_status: 200,
      mime_type: 'text/plain',
      byte_length: 200,
      payload_sha256: 'deadbeef',
      raw_payload_text: 'OFFICIAL_FL_DOS_CANDIDATE_LISTING_STUB_2026',
      parser_version: 'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC'
    };
    const snapClass = hermesBackendStore.classifySnapshot(syntheticSnapshot as any);
    assert.strictEqual(snapClass, 'LEGACY_SYNTHETIC');
  });

  console.log("\n=======================================================");
  console.log(`PROVENANCE TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllProvenanceTests().catch(err => {
  console.error("Provenance test error:", err);
  process.exit(1);
});
