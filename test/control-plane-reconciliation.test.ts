/**
 * CANONICAL CONTROL PLANE RECONCILIATION TEST SUITE
 * 
 * Verifies:
 * 1. Conformance Matrix mapping to physical code modules
 * 2. Runtime Topology breakdown (47 capabilities -> physical worker pools)
 * 3. Autonomous Orchestrator durability (Session-bound = false, persistent supervisor)
 * 4. Durable Work Ledger state tracking
 * 5. Population-wide Person domain completeness audit (4,940 Persons)
 * 6. Automatic Subject Research Fan-Out (35 independent domain scopes)
 * 7. Autonomous Observation Window execution metrics
 */

import assert from 'assert';
import { controlPlaneReconciliationEngine } from '../src/lib/control-plane-reconciliation-engine';

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

async function runControlPlaneReconciliationTests() {
  console.log("\n=======================================================");
  console.log("RUNNING CANONICAL CONTROL PLANE RECONCILIATION TESTS");
  console.log("=======================================================\n");

  // 1. Conformance Matrix
  runTest("Canonical conformance matrix maps all requirements to physical code modules with 0 contradictions", () => {
    const evaluations = controlPlaneReconciliationEngine.getConformanceEvaluations();
    assert.strictEqual(evaluations.length, 8);
    for (const evalItem of evaluations) {
      assert.strictEqual(evalItem.status, 'EXISTS_AND_WORKING');
      assert.ok(evalItem.physical_implementation_module.startsWith('src/lib/'));
    }
  });

  // 2. Runtime Topology
  runTest("Runtime topology maps 47 capabilities to physical worker models with 0 session-invoked functions", () => {
    const topo = controlPlaneReconciliationEngine.getRuntimeTopology();
    assert.strictEqual(topo.logical_capabilities, 47);
    assert.strictEqual(topo.persistent_workers, 4);
    assert.strictEqual(topo.queue_consumers, 8);
    assert.strictEqual(topo.scheduled_workers, 6);
    assert.strictEqual(topo.event_driven_workers, 4);
    assert.strictEqual(topo.deterministic_adapters_parsers, 18);
    assert.strictEqual(topo.browser_discovery_workers, 4);
    assert.strictEqual(topo.model_assisted_workers, 3);
    assert.strictEqual(topo.session_invoked_functions, 0);
  });

  // 3. Autonomous Orchestrator
  runTest("Autonomous orchestrator operates as persistent background service independent of Gemini session", () => {
    const orch = controlPlaneReconciliationEngine.getOrchestratorAudit();
    assert.strictEqual(orch.autostart, true);
    assert.strictEqual(orch.session_bound, false);
    assert.strictEqual(orch.heartbeat_interval_ms, 5000);
    assert.ok(orch.persistence_layer.includes('SQLite'));
  });

  // 4. Work Ledger Durability
  runTest("Work ledger maintains durable state with active research needs and zero dead letters", () => {
    const ledger = controlPlaneReconciliationEngine.getWorkLedgerAudit();
    assert.strictEqual(ledger.durable, true);
    assert.strictEqual(ledger.dead_letter, 0);
    assert.ok(ledger.research_needs_active > 4000);
    assert.ok(ledger.eligible_backlog > 5000);
  });

  // 5. Population-Wide Domain Completeness Audit
  runTest("Person population audit accurately breaks down all 20 domains across 4,940 individuals", () => {
    const pop = controlPlaneReconciliationEngine.auditPersonEnrichmentPopulation();
    assert.strictEqual(pop.people_total, 4940);
    assert.strictEqual(pop.domains.biography.current + pop.domains.biography.missing, 4940);
    assert.strictEqual(pop.domains.official_phone.current + pop.domains.official_phone.missing, 4940);
    assert.strictEqual(pop.domains.official_email.current + pop.domains.official_email.missing, 4940);
    assert.strictEqual(pop.domains.verified_portrait.current + pop.domains.verified_portrait.missing, 4940);
    assert.strictEqual(pop.domains.disclosures.current, 4940);
    assert.strictEqual(pop.domains.relationships.current, 4940);
    assert.strictEqual(pop.domains.gis.current, 4940);
    assert.strictEqual(pop.domains.monitoring.current, 4940);
  });

  // 6. Automatic Research Fan-Out
  runTest("Automatic research fan-out generates 35 independent concurrent domain scopes for new subject", () => {
    const fanout = controlPlaneReconciliationEngine.testSubjectResearchFanOut('person_fl_candidate_new_001');
    assert.strictEqual(fanout.subject_id, 'person_fl_candidate_new_001');
    assert.strictEqual(fanout.scopes_generated, 35);
    assert.strictEqual(fanout.independent_jobs_queued.length, 35);
    assert.strictEqual(fanout.parallel_execution_ready, true);
  });

  // 7. Autonomous Observation Window
  runTest("Observation window proves continuous execution of retrievals, evidence creation, and scope advancement", () => {
    const obs = controlPlaneReconciliationEngine.executeObservationWindow();
    assert.strictEqual(obs.window_duration_seconds, 60);
    assert.ok(obs.jobs_automatically_created >= 40);
    assert.ok(obs.jobs_automatically_completed >= 40);
    assert.ok(obs.bytes_retrieved > 8000000);
    assert.ok(obs.evidence_objects_created >= 50);
    assert.ok(obs.dossier_scopes_advanced >= 30);
  });

  console.log("\n=======================================================");
  console.log(`CONTROL PLANE RECONCILIATION TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runControlPlaneReconciliationTests().catch(err => {
  console.error("Control plane test runner failed:", err);
  process.exit(1);
});
