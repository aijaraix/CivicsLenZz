/**
 * SYSTEMIC ROOT-CAUSE & NON-BLOCKING RESEARCH CONTINUATION TEST SUITE
 * 
 * Verifies:
 * 1. Incident A (SD39 Occupancy) end-to-end trace & systemic repair
 * 2. Incident B (Vincent Parlatore) end-to-end trace & composite key repair
 * 3. Non-blocking multi-agent research isolation (1 scope degraded, 28 independent scopes active)
 * 4. Systemic blast radius audit & package supersession
 * 5. Deep dossier backlog progression from 308 to 324 dossiers
 * 6. Academy incident learning and rule promotion
 */

import assert from 'assert';
import { systemicRootCauseIncidentEngine } from '../src/lib/systemic-root-cause-incident-engine';

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

async function runSystemicIncidentTests() {
  console.log("\n=======================================================");
  console.log("RUNNING SYSTEMIC ROOT-CAUSE & NON-BLOCKING RESEARCH TESTS");
  console.log("=======================================================\n");

  // 1. Incident A: SD39 End-to-End Trace
  runTest("Incident A (SD39): Identifies STALE_SOURCE_USED_FOR_CURRENT_STATE and enforces chamber live roster precedence", () => {
    const incA = systemicRootCauseIncidentEngine.traceIncidentA_SD39();
    assert.strictEqual(incA.incident_id, 'INCIDENT-A-SD39-OCCUPANCY-001');
    assert.strictEqual(incA.root_cause_class, 'STALE_SOURCE_USED_FOR_CURRENT_STATE');
    assert.strictEqual(incA.agent_capability, 'cap_occupancy_reconciliation_agent');
    assert.ok(incA.source_url.includes('flsenate.gov/Senators/s39'));
    assert.strictEqual(incA.blast_radius.affected_records_count, 1);
    assert.strictEqual(incA.monitor_retest_status, 'PASS');
    assert.ok(incA.superseded_package_ids.length > 0);
    assert.ok(incA.replacement_package_ids.length > 0);
  });

  // 2. Incident B: Parlatore End-to-End Trace
  runTest("Incident B (Parlatore): Identifies DISTRICT_NUMBER_WITHOUT_OFFICE_TYPE and enforces composite candidate key", () => {
    const incB = systemicRootCauseIncidentEngine.traceIncidentB_Parlatore();
    assert.strictEqual(incB.incident_id, 'INCIDENT-B-PARLATORE-CAMPAIGN-002');
    assert.strictEqual(incB.root_cause_class, 'DISTRICT_NUMBER_WITHOUT_OFFICE_TYPE');
    assert.strictEqual(incB.agent_capability, 'cap_candidate_campaign_agent');
    assert.strictEqual(incB.blast_radius.affected_records_count, 2);
    assert.strictEqual(incB.monitor_retest_status, 'PASS');
    assert.ok(incB.superseded_package_ids.length > 0);
    assert.ok(incB.replacement_package_ids.length > 0);
  });

  // 3. Non-Blocking Multi-Agent Isolation
  runTest("Non-blocking multi-agent execution proves 1 degraded scope does not freeze other independent scopes", () => {
    const isolation = systemicRootCauseIncidentEngine.verifyNonBlockingScopeExecution('person_fl_sen_34_shevrin_jones');
    assert.strictEqual(isolation.degraded_scope_status, 'DEGRADED_RETRYING');
    assert.ok(isolation.active_independent_scopes.length >= 6);
    assert.strictEqual(isolation.concurrent_agent_jobs_active, 47);
    for (const scope of isolation.active_independent_scopes) {
      assert.ok(scope.evidence_collected_count > 0);
    }
  });

  // 4. Systemic Blast Radius Audit
  runTest("Systemic blast radius accurately accounts for affected occupancy, campaigns, and bridge packages", () => {
    const radius = systemicRootCauseIncidentEngine.getSystemicBlastRadiusSummary();
    assert.strictEqual(radius.occupancy_records_affected, 1);
    assert.strictEqual(radius.candidate_campaigns_affected, 2);
    assert.strictEqual(radius.elections_affected, 2);
    assert.strictEqual(radius.bridge_packages_superseded, 2);
  });

  // 5. Deep Research Continuation
  runTest("Deep research continuation advances dossiers from 308 to 324 (+16 deep subjects)", () => {
    const deep = systemicRootCauseIncidentEngine.executeDeepResearchContinuation();
    assert.strictEqual(deep.dossiers_before, 308);
    assert.strictEqual(deep.dossiers_after, 324);
    assert.strictEqual(deep.scopes_advanced, 64);
    assert.strictEqual(deep.newly_advanced_subjects.length, 16);
    assert.strictEqual(deep.gaps_closed, 16);
    assert.ok(deep.new_evidence_count > 100);
  });

  // 6. Academy Incident Learning
  runTest("Academy ingests both production incidents and promotes 2 generalized pipeline rules", () => {
    const academy = systemicRootCauseIncidentEngine.executeAcademyIncidentLearning();
    assert.strictEqual(academy.incidents_ingested, 2);
    assert.strictEqual(academy.proposals_tested, 4);
    assert.strictEqual(academy.proposals_promoted, 2);
    assert.strictEqual(academy.promoted_rules.length, 2);
  });

  console.log("\n=======================================================");
  console.log(`SYSTEMIC INCIDENT TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runSystemicIncidentTests().catch(err => {
  console.error("Systemic incident test runner failed:", err);
  process.exit(1);
});
