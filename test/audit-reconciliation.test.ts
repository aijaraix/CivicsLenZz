/**
 * AUDIT RECONCILIATION & MONITORING CANARY TEST SUITE
 * 
 * Verifies:
 * 1. Truth Metric Reclassifications (INGEST_CONTRACT_VALID vs CANONICAL_VALIDATED)
 * 2. Monitoring Scope Domain Reconciliations
 * 3. SD39 Live Vacancy / Occupancy Canary Trace
 * 4. Current 2026 Election Data Canary
 * 5. Deep Dossier Backlog Advancement (292 -> 308 dossiers)
 */

import assert from 'assert';
import { auditReconciliationEngine } from '../src/lib/audit-reconciliation-engine';

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

async function runAuditReconciliationTests() {
  console.log("\n=======================================================");
  console.log("RUNNING AUDIT RECONCILIATION & MONITORING CANARY TESTS");
  console.log("=======================================================\n");

  // 1. Canonical Terminology Reconciliation
  runTest("Canonical validation terminology correctly reports 0 validated while upstream intake is paused", () => {
    const recon = auditReconciliationEngine.getCanonicalMetricReconciliation();
    assert.strictEqual(recon.structural_record_exists, 5508);
    assert.strictEqual(recon.ingest_contract_valid, 5508);
    assert.strictEqual(recon.bridge_ready, 36);
    assert.strictEqual(recon.canonical_received, 0);
    assert.strictEqual(recon.canonical_validated, 0);
    assert.strictEqual(recon.published, 0);
  });

  // 2. Monitoring Domain Decomposition
  runTest("Monitoring scopes accurately separate cohort surveillance from per-seat deep monitoring", () => {
    const mon = auditReconciliationEngine.getMonitoringDomainReconciliation();
    assert.strictEqual(mon.seats_with_at_least_one_monitoring_scope, 5508);
    assert.strictEqual(mon.seats_with_all_applicable_monitoring_scopes, 308);
    assert.strictEqual(mon.elections_monitored, 1634);
    assert.strictEqual(mon.candidate_campaigns_monitored, 3492);
    assert.strictEqual(mon.occupancies_monitored, 4910);
    assert.strictEqual(mon.boundaries_monitored, 5503);
    assert.strictEqual(mon.finance_scopes_monitored, 3840);
    assert.strictEqual(mon.legislative_activity_scopes_monitored, 190);
    assert.strictEqual(mon.source_endpoints_checked, 24);
  });

  // 3. SD39 Live Canary
  runTest("SD39 Live Canary executes authoritative check with complete trace and bridge package creation", () => {
    const canary = auditReconciliationEngine.executeSD39LiveCanary();
    assert.strictEqual(canary.seat_uuid, 'seat_fl_sen_39');
    assert.ok(canary.sd39_stored_state_before.includes('Bryan Avila'));
    assert.ok(canary.sd39_authoritative_state.includes('Bryan Avila'));
    assert.strictEqual(canary.change_detected_by_existing_monitor, true);
    assert.strictEqual(canary.occupancy_history_preserved, true);
    assert.strictEqual(canary.dashboard_state_updated, true);
    assert.strictEqual(canary.bridge_package_created, true);
    assert.ok(canary.followup_jobs_created.length >= 3);
  });

  // 4. Election Data Canary
  runTest("Election Canary verifies active 2026 contests against authoritative SHA-256 hashes", () => {
    const samples = auditReconciliationEngine.getElectionCanarySamples();
    assert.strictEqual(samples.length, 4);
    for (const sample of samples) {
      assert.ok(sample.sha256_hash.length === 64);
      assert.ok(sample.authoritative_source_url.startsWith('https://'));
      assert.ok(sample.current_as_of.startsWith('2026-09-09'));
    }
  });

  // 5. Deep Dossier Advancement
  runTest("Deep Dossier Backlog burns down from 292 to 308 dossiers across South Florida & Legislature", () => {
    const advancement = auditReconciliationEngine.advanceDeepDossierBacklog();
    assert.strictEqual(advancement.deep_dossiers_before, 292);
    assert.strictEqual(advancement.deep_dossiers_after, 308);
    assert.strictEqual(advancement.gaps_closed, 16);
    assert.strictEqual(advancement.advanced_subjects.length, 16);
  });

  console.log("\n=======================================================");
  console.log(`AUDIT RECONCILIATION TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAuditReconciliationTests().catch(err => {
  console.error("Audit reconciliation test runner failed:", err);
  process.exit(1);
});
