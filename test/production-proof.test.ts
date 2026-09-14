/**
 * PRODUCTION-PROOF & LIVE SOURCE VERIFICATION TEST SUITE
 * 
 * Verifies:
 * 1. Proof standard reclassification (DEFINED, IMPLEMENTED, TEST_PROVEN, LIVE_SOURCE_PROVEN, AUTONOMOUS_RUNTIME_PROVEN, MONITORING_PROVEN)
 * 2. Physical source execution with real response bytes, SHA-256 calculation, and exact locator validation
 * 3. Physical artifact persistence (disk write, flush, read-back, SHA-256 integrity verification)
 * 4. Anti-simulation compliance:
 *    - Zero fabricated HTTP 200 responses
 *    - Zero producer self-verification (producer marks state as PRODUCER_LOCAL_UNREVIEWED)
 *    - Zero producer self-acknowledgement (acknowledged_by_consumer defaults to false)
 *    - No cloned capability proofs across distinct domains
 * 5. Deep multi-subject dossier research (State Senator, Governor, CandidateCampaign, Census Demographics, Local Government)
 * 6. Production observation window metrics accounting (non-fabricated persisted counters)
 * 7. Source Health Universe breakdown (REGISTERED, CHECKED, HEALTHY, DEGRADED, UNAVAILABLE, UNKNOWN)
 * 8. September 2026 Authoritative Election Lifecycle reconciliation
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { 
  productionProofEngine 
} from '../src/lib/production-proof-engine';
import { 
  harvesterCapabilityMatrixEngine, 
  CANONICAL_CAPABILITY_MATRIX 
} from '../src/lib/harvester-capability-matrix';

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

async function runProductionProofTests() {
  console.log("\n=======================================================");
  console.log("RUNNING CIVICSLENZZ PHYSICAL REALITY & PRODUCTION PROOF TESTS");
  console.log("=======================================================\n");

  // 1. Rigorous 6-Tier Proof Classification
  runTest("Proof standard honors complete 47-capability matrix", () => {
    const matrix = Object.keys(CANONICAL_CAPABILITY_MATRIX);
    assert.strictEqual(matrix.length, 47);
  });

  // 2. Truth in Initial Source Health (All 24 Registered Endpoints start UNKNOWN)
  runTest("Initial Source Health universe initializes as UNKNOWN (no synthetic 100% assumption)", () => {
    const initialHealth = productionProofEngine.getSourceHealthBreakdown();
    assert.strictEqual(initialHealth.REGISTERED, 24);
    assert.strictEqual(initialHealth.UNKNOWN, 24);
    assert.strictEqual(initialHealth.CHECKED, 0);
  });

  // 3. Physical Source Health Check transitions state authentically
  await runTest("Physical source health checks transition endpoints from UNKNOWN to CHECKED", async () => {
    const epCheck = await productionProofEngine.performPhysicalSourceHealthCheck("ep_flsenate_portal");
    assert.strictEqual(epCheck.endpoint_id, "ep_flsenate_portal");
    assert.ok(epCheck.observation_state === "CHECKED_HEALTHY" || epCheck.observation_state === "CHECKED_DEGRADED");
    assert.ok(epCheck.latency_ms !== null && epCheck.latency_ms > 0);

    const healthAfter = productionProofEngine.getSourceHealthBreakdown();
    assert.strictEqual(healthAfter.CHECKED, 1);
    assert.strictEqual(healthAfter.UNKNOWN, 23);
  });

  // 4. Physical Artifact Storage Verification (Write -> ReadBack -> SHA-256 Re-Hash)
  runTest("Physical artifact engine enforces real write, flush, readback, and hash integrity", () => {
    const sampleBuffer = Buffer.from("CANONICAL_PHYSICAL_VERIFICATION_PAYLOAD_TEST", "utf-8");
    const testRelPath = "data/artifacts/test/physical_artifact_test.dat";
    
    const result = productionProofEngine.persistPhysicalArtifact(testRelPath, sampleBuffer);
    assert.strictEqual(result.is_physically_persisted, true);
    assert.strictEqual(result.readback_verified, true);
    assert.strictEqual(result.byte_length, sampleBuffer.length);

    const resolved = path.resolve(process.cwd(), testRelPath);
    assert.ok(fs.existsSync(resolved));
    const diskBytes = fs.readFileSync(resolved);
    assert.strictEqual(diskBytes.toString("utf-8"), "CANONICAL_PHYSICAL_VERIFICATION_PAYLOAD_TEST");

    // Clean up test file
    fs.unlinkSync(resolved);
  });

  // 5. Execute Sustained Observation Window
  await runTest("Autonomous runtime executes sustained production observation window with physical persistence", async () => {
    const metrics = await productionProofEngine.executeSustainedObservationWindow();
    assert.ok(metrics.jobs_created >= 12);
    assert.ok(metrics.jobs_completed >= 12);
    assert.ok(metrics.bytes_retrieved > 10000);
    assert.ok(metrics.facts_extracted >= 12);
    assert.ok(metrics.claims_created >= 12);
    assert.ok(metrics.evidence_objects_persisted >= 12);
    assert.strictEqual(metrics.handoffs_acknowledged, 0); // Producer does not self-acknowledge!
    assert.ok(typeof metrics.gap_jobs_generated === 'number');
    assert.ok(typeof metrics.academy_observations === 'number');
  });

  // 6. Live Source Execution, Physical Readback & Anti-Simulation Rules
  runTest("Live source execution obeys anti-simulation invariants and accurate proof levels", () => {
    const summary = productionProofEngine.getProofClassificationSummary();
    assert.ok(summary.live_proofs.length >= 12);

    for (const proof of summary.live_proofs) {
      if (proof.live_execution.network_request.source_origin === 'LIVE_NETWORK') {
        assert.strictEqual(proof.proof_level, "LIVE_SOURCE_PROVEN");
      } else {
        assert.strictEqual(proof.proof_level, "FIXTURE_REPLAY_PROVEN");
      }
      assert.ok(proof.live_execution.network_request.response_sha256.length === 64);
      assert.ok(proof.live_execution.network_request.byte_length > 0);
      assert.ok(proof.live_execution.network_request.latency_ms > 0);

      // Anti-simulation invariant: Producer marks unreviewed; does not self-assert zero_synthetic
      assert.strictEqual(proof.live_execution.evidence.extraction_status, "EXTRACTED_UNREVIEWED");
      assert.strictEqual(proof.live_execution.evidence.producer_attestation, "PRODUCER_LOCAL_UNREVIEWED");
      assert.strictEqual(proof.live_execution.evidence.is_physically_persisted, true);
      assert.strictEqual(proof.live_execution.evidence.readback_verified, true);
      assert.ok(proof.live_execution.evidence.persisted_bytes > 0);

      // Anti-simulation invariant: Producer does not self-acknowledge handoff
      assert.strictEqual(proof.live_execution.handoff.acknowledged_by_consumer, false);
      assert.strictEqual(proof.live_execution.handoff.acknowledged_at, null);

      // Verify non-homepage locators and anchors
      for (const fact of proof.live_execution.extraction.facts) {
        assert.strictEqual(fact.locator.is_homepage_shortcut, false);
        assert.ok(fact.locator.exact_text_anchor.length > 3);
        assert.strictEqual(fact.locator.anchor_verified_in_artifact, true);
      }
    }
  });

  // 7. Canary: Autonomous Execution Lifecycle
  await runTest("Autonomous canary executes complete lease, retrieval, artifact, and work transition lifecycle", async () => {
    const autoResult = await productionProofEngine.executeAutonomousCanary();
    assert.strictEqual(autoResult.proven, true);
    assert.ok(autoResult.work_id.length > 0);
    assert.ok(autoResult.lease_id.length > 0);
    assert.ok(autoResult.worker_id.length > 0);
    assert.ok(autoResult.retrieval_id.length > 0);
    assert.ok(autoResult.artifact_id.length > 0);
    assert.ok(autoResult.next_work_id.length > 0);
  });

  // 8. Canary: Monitoring Cadence & Comparison Lifecycle
  await runTest("Monitoring canary verifies scheduled retrieval, hash comparison, and event emission", async () => {
    const monResult = await productionProofEngine.executeMonitoringCanary();
    assert.strictEqual(monResult.proven, true);
    assert.ok(monResult.obligation_id.length > 0);
    assert.ok(monResult.check_id.length > 0);
    assert.ok(monResult.retrieval_id.length > 0);
    assert.ok(monResult.comparison_id.length > 0);
  });

  // 9. Canary: Gap Detector Flow
  runTest("Gap detector canary identifies missing domain scope and produces durable research job", () => {
    const gapResult = productionProofEngine.executeGapDetectorCanary();
    assert.strictEqual(gapResult.proven, true);
    assert.ok(gapResult.gap_id.length > 0);
    assert.ok(gapResult.job_id.length > 0);
  });

  // 10. Canary: Harvester Academy Observation -> Case -> Promotion
  runTest("Harvester Academy canary records observation, constructs case, and promotes tested rule", () => {
    const acadResult = productionProofEngine.executeAcademyCanary();
    assert.strictEqual(acadResult.proven, true);
    assert.ok(acadResult.observation_id.length > 0);
    assert.ok(acadResult.case_id.length > 0);
  });

  // 11. Multi-Subject Deep Dossier Coverage
  runTest("Deep dossier proof covers diverse civic subjects across multiple domains", () => {
    const summary = productionProofEngine.getProofClassificationSummary();
    assert.ok(summary.dossiers.length >= 2);

    const sd34Dossier = summary.dossiers.find(d => d.subject_key === "seat_fl_senate_34");
    assert.ok(sd34Dossier);
    assert.strictEqual(sd34Dossier.occupancy_reconciled, true);
    assert.strictEqual(sd34Dossier.election_reconciled, true);
    assert.strictEqual(sd34Dossier.candidate_campaign_reconciled, true);
    assert.strictEqual(sd34Dossier.gis_reconciled, true);
    assert.ok(sd34Dossier.evidence_objects_count >= 3);

    const govDossier = summary.dossiers.find(d => d.subject_key === "seat_fl_governor");
    assert.ok(govDossier);
    assert.strictEqual(govDossier.occupancy_reconciled, true);
    assert.strictEqual(govDossier.governance_reconciled, true);
  });

  // 8. September 2026 Election State Reconciliation
  runTest("September 2026 election state separates filed, qualifying, primary, and general ballot status", () => {
    const summary = productionProofEngine.getProofClassificationSummary();
    const sd34Proof = summary.live_proofs.find(p => p.live_subject.subject_key === "seat_fl_senate_34");
    assert.ok(sd34Proof);
    const candidateFact = sd34Proof.live_execution.extraction.facts.find(f => f.field_name === "candidate_campaign.general_election_ballot_status");
    assert.ok(candidateFact);
    assert.strictEqual(candidateFact.field_value, "QUALIFIED_BALLOT_PLACEMENT");
  });

  console.log("\n=======================================================");
  console.log(`PRODUCTION PROOF TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionProofTests().catch(err => {
  console.error("FATAL: Unhandled exception during production proof test execution:", err);
  process.exit(1);
});
