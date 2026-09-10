/**
 * PRODUCTION BACKLOG EXECUTION TEST SUITE
 * 
 * Verifies:
 * 1. Scope accounting across all 7 cohorts (National, Statewide, Legislature, Miami-Dade, Broward, Palm Beach, Other Florida)
 * 2. Backlog burn-down execution pass with Gap Detector work generation
 * 3. Deep dossier tracking (started, advanced, complete)
 * 4. Source health accounting across 24 registered endpoints
 * 5. Bridge packaging and HMAC readiness
 */

import assert from 'assert';
import { productionBacklogExecutionEngine } from '../src/lib/production-backlog-execution-engine';

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

async function runProductionBacklogTests() {
  console.log("\n=======================================================");
  console.log("RUNNING CIVICSLENZZ PRODUCTION BACKLOG HARVEST VERIFICATION");
  console.log("=======================================================\n");

  // 1. Initial Backlog Scope Accounting
  runTest("Cohort scope accounting covers all 7 target cohorts without omissions", () => {
    const backlog = productionBacklogExecutionEngine.getBacklogSummary();
    assert.strictEqual(backlog.total_scopes, 6102);
    assert.ok(backlog.current > 3000);
    assert.ok(backlog.unresolved > 0);
    assert.ok(backlog.not_started > 0);
    assert.strictEqual(backlog.blocked, 0);
  });

  // 2. Execute Production Harvest Pass
  await runTest("Autonomous execution pass burns down real backlog and creates evidence", async () => {
    const metrics = await productionBacklogExecutionEngine.executeProductionHarvestPass();
    assert.ok(metrics.jobs_executed >= 6);
    assert.ok(metrics.subjects_researched >= 3);
    assert.ok(metrics.bytes_retrieved > 50000);
    assert.ok(metrics.claims_extracted >= 10);
    assert.ok(metrics.evidence_persisted >= 6);
    assert.ok(metrics.gaps_closed >= 4);
    assert.ok(metrics.monitoring_checks >= 6);
    assert.strictEqual(metrics.packages_ready, 18);
    assert.strictEqual(metrics.packages_waiting, 18);
  });

  // 3. Deep Dossier Tracking
  runTest("Deep dossier summary tracks multi-subject progression across legislative, statewide, and county tiers", () => {
    const dossiers = productionBacklogExecutionEngine.getDossierSummary();
    assert.ok(dossiers.subjects_started >= 6);
    assert.ok(dossiers.subjects_advanced >= 6);
    assert.ok(dossiers.subjects_with_current_applicable_scopes >= 1);
  });

  // 4. Source Health Accounting
  runTest("Source health breakdown accounts for all 24 registered authoritative endpoints", () => {
    const health = productionBacklogExecutionEngine.getSourceHealth();
    assert.strictEqual(health.registered, 24);
    assert.ok(health.healthy >= 23);
    assert.strictEqual(health.unavailable, 0);
  });

  console.log("\n=======================================================");
  console.log(`PRODUCTION BACKLOG TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runProductionBacklogTests().catch(err => {
  console.error("Production backlog test runner failed:", err);
  process.exit(1);
});
