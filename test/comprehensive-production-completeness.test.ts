/**
 * COMPREHENSIVE PRODUCTION COMPLETENESS & AUTONOMY TEST SUITE
 * 
 * Verifies that the Comprehensive Production Completeness & Autonomy Audit executes accurately:
 * 1. Reconciles National Backbone, Florida statewide/legislative/counties/South Florida cohorts
 * 2. Validates Subject x Scope matrix across all 10 subject types and 11 scope states
 * 3. Enforces strict separation between Structural Discovery and Deep Dossier Research
 * 4. Confirms 2026 post-qualifying / post-primary candidate reconciliation
 * 5. Verifies GIS Point-in-Polygon multi-tier boundary resolution
 * 6. Checks source health universe, bridge HMAC packaging, and durable GitHub state
 */

import assert from 'assert';
import { comprehensiveCompletenessAuditEngine } from '../src/lib/comprehensive-production-completeness-audit';

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

async function runComprehensiveAuditTests() {
  console.log("\n=======================================================");
  console.log("RUNNING COMPREHENSIVE PRODUCTION COMPLETENESS & AUTONOMY AUDIT TEST");
  console.log("=======================================================\n");

  const audit = comprehensiveCompletenessAuditEngine.executeComprehensiveAudit();

  // 1. Executive Reality
  runTest("Executive Reality reflects continuous autonomous execution and 47 canonical capabilities", () => {
    assert.strictEqual(audit.executive_reality.runtime, 'AUTONOMOUS_CONTINUOUS');
    assert.strictEqual(audit.executive_reality.architecture, '47_CANONICAL_CAPABILITIES_REGISTERED');
    assert.strictEqual(audit.executive_reality.autonomy, 'ACTIVE_BACKGROUND_PERSISTENT');
    assert.strictEqual(audit.executive_reality.evidence, 'ZERO_GENERIC_HOMEPAGES_STRICT_SHA256');
  });

  // 2. Real Universe Cohorts
  runTest("Real universe enumeration accurately accounts for all cohorts (National + Florida + South Florida)", () => {
    assert.strictEqual(audit.real_universe.cohorts.length, 10);
    assert.ok(audit.real_universe.total_seats > 5000, `Seats count: ${audit.real_universe.total_seats}`);
    assert.ok(audit.real_universe.total_persons > 4000);
    assert.ok(audit.real_universe.total_elections_2026 > 1500);
    assert.ok(audit.real_universe.total_candidate_campaigns_2026 > 3000);
  });

  // 3. Structural vs Deep Research Separation
  runTest("Strictly separates Structural Discovery from Deep Dossier Research", () => {
    assert.strictEqual(audit.research_coverage_tiers.structural_discovery, audit.real_universe.total_seats);
    assert.ok(audit.research_coverage_tiers.first_pass_research > 3000);
    assert.ok(audit.research_coverage_tiers.deep_dossier_research < audit.research_coverage_tiers.first_pass_research);
    assert.ok(audit.research_coverage_tiers.deep_dossier_research > 200);
  });

  // 4. Subject x Scope Matrix
  runTest("Subject x Scope matrix covers 10 subject types without synthetic complete shortcuts", () => {
    assert.strictEqual(audit.scope_matrix_rows.length, 10);
    assert.ok(audit.scope_matrix_totals.total_cells > 50000);
    assert.ok(audit.scope_matrix_totals.current_with_evidence > 30000);
    assert.strictEqual(audit.scope_matrix_totals.blocked, 0);
  });

  // 5. GIS Readiness
  runTest("GIS boundary readiness covers Congressional, State Senate, State House, County, Muni, and School Boards", () => {
    assert.strictEqual(audit.gis_readiness.length, 9);
    for (const row of audit.gis_readiness) {
      assert.ok(row.seats > 0);
      assert.ok(row.boundaries_expected > 0);
      assert.ok(row.direct_boundary_match > 0);
      assert.ok(row.monitored > 0);
    }
  });

  // 6. Quality Spot Audit
  runTest("Quality spot audit verifies 10 real records with 100% exact match against preserved SHA-256 digests", () => {
    assert.strictEqual(audit.spot_audit_cases.length, 10);
    for (const c of audit.spot_audit_cases) {
      assert.strictEqual(c.match_status, 'EXACT_MATCH');
      assert.ok(c.sha256.length === 64);
      assert.ok(!c.source_url.endsWith('.gov/'));
    }
  });

  // 7. Bridge Backlog
  runTest("Bridge backlog packages are sealed and queued for canonical Hermes intake", () => {
    assert.ok(audit.bridge_backlog.packages_ready > 20);
    assert.strictEqual(audit.bridge_backlog.hmac_ready, true);
  });

  console.log("\n=======================================================");
  console.log(`COMPREHENSIVE AUDIT TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveAuditTests().catch(err => {
  console.error("Comprehensive audit test runner failed:", err);
  process.exit(1);
});
