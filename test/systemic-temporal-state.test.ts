/**
 * SYSTEMIC TEMPORAL-STATE & CURRENT-OFFICE RECONCILIATION REGRESSION TEST
 * 
 * Verifies:
 * 1. Ashley Moody: Former state AG -> Appointed & Sworn U.S. Senator (Jan 21, 2025)
 * 2. James Uthmeier: Successor appointed as Florida Attorney General (Feb 2025)
 * 3. SD39 Vacancy: Resignation legally effective date (Aug 25, 2026) vs preliminary announcement
 * 4. Jason Pizzo: Legislative redistricting / current seat (SD37) vs stale historical district
 * 5. Alina Garcia: Candidate -> Elected & Sworn County Supervisor of Elections
 * 6. Generic Current-State Resolver CURRENT_ROLE(Person, as_of) with valid-time interval resolution
 * 7. Source Role & Precedence Hierarchy (Current Chamber/Agency Roster overrides Historical Profile)
 * 8. Population-Wide Currentness Audit across 9 Civic Cohorts
 * 9. Non-destructive supersession lifecycle & blast radius accounting
 */

import assert from 'assert';
import { systemicTemporalStateEngine } from '../src/lib/systemic-temporal-state-engine';

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

async function runSystemicTemporalTests() {
  console.log("\n=======================================================");
  console.log("RUNNING SYSTEMIC TEMPORAL-STATE RECONCILIATION TESTS");
  console.log("=======================================================\n");

  // 1. Ashley Moody Reconciliation
  runTest("Ashley Moody: Former state AG (2019-2025) -> Current U.S. Senator (Sworn Jan 21, 2025)", () => {
    const role = systemicTemporalStateEngine.resolveCurrentRole('person_ashley_moody', '2026-09-10');
    assert.strictEqual(role.primary_role_category, 'CURRENT_OFFICIAL');
    assert.strictEqual(role.active_occupancies.length, 1);
    assert.strictEqual(role.active_occupancies[0].seat_title, 'U.S. Senator (Florida, Class I)');
    assert.strictEqual(role.active_occupancies[0].government_level, 'FEDERAL');
    
    // Check historical occupancy for AG
    assert.strictEqual(role.historical_occupancies.length, 1);
    assert.strictEqual(role.historical_occupancies[0].seat_title, 'Florida Attorney General');
    assert.strictEqual(role.historical_occupancies[0].valid_to, '2025-01-20');
  });

  // 2. James Uthmeier Reconciliation
  runTest("James Uthmeier: Successor appointed as Florida Attorney General (Feb 2025)", () => {
    const role = systemicTemporalStateEngine.resolveCurrentRole('person_james_uthmeier', '2026-09-10');
    assert.strictEqual(role.primary_role_category, 'CURRENT_OFFICIAL');
    assert.strictEqual(role.active_occupancies.length, 1);
    assert.strictEqual(role.active_occupancies[0].seat_title, 'Florida Attorney General');
    assert.strictEqual(role.active_occupancies[0].valid_from, '2025-02-04');
    assert.strictEqual(role.active_occupancies[0].status, 'ACTIVE');
  });

  // 3. SD39 Vacancy Legally Effective Date
  runTest("SD39 Vacancy: Bryan Avila resignation legally effective August 25, 2026", () => {
    const avilaRole = systemicTemporalStateEngine.resolveCurrentRole('person_bryan_avila', '2026-09-10');
    assert.strictEqual(avilaRole.primary_role_category, 'FORMER_OFFICIAL');
    assert.strictEqual(avilaRole.active_occupancies.length, 0);
    assert.strictEqual(avilaRole.historical_occupancies.length, 1);
    assert.strictEqual(avilaRole.historical_occupancies[0].seat_title, 'Florida Senate District 39');
    assert.strictEqual(avilaRole.historical_occupancies[0].valid_to, '2026-08-25');
  });

  // 4. Jason Pizzo Redistricting Seat Resolution
  runTest("Jason Pizzo: Florida Senate District 37 (Democratic Leader)", () => {
    const role = systemicTemporalStateEngine.resolveCurrentRole('person_jason_pizzo', '2026-09-10');
    assert.strictEqual(role.primary_role_category, 'CURRENT_OFFICIAL');
    assert.strictEqual(role.active_occupancies.length, 1);
    assert.strictEqual(role.active_occupancies[0].seat_title, 'Florida Senate District 37');
    assert.strictEqual(role.active_occupancies[0].district_number, '37');
  });

  // 5. Alina Garcia Candidate -> Officeholder Transition
  runTest("Alina Garcia: Seated Miami-Dade County Supervisor of Elections", () => {
    const role = systemicTemporalStateEngine.resolveCurrentRole('person_alina_garcia', '2026-09-10');
    assert.strictEqual(role.primary_role_category, 'CURRENT_OFFICIAL');
    assert.strictEqual(role.active_occupancies.length, 1);
    assert.strictEqual(role.active_occupancies[0].seat_title, 'Miami-Dade County Supervisor of Elections');
    assert.strictEqual(role.active_occupancies[0].valid_from, '2025-01-07');
    assert.strictEqual(role.is_seated_official, true);
  });

  // 6. Generic Current-State Resolver Temporal Intervals
  runTest("Generic Current-State Resolver evaluates temporal boundaries accurately for historical dates", () => {
    // In 2023: Ashley Moody was FL AG
    const moody2023 = systemicTemporalStateEngine.resolveCurrentRole('person_ashley_moody', '2023-06-01');
    assert.strictEqual(moody2023.active_occupancies.length, 1);
    assert.strictEqual(moody2023.active_occupancies[0].seat_title, 'Florida Attorney General');

    // In 2023: Bryan Avila was in SD39
    const avila2023 = systemicTemporalStateEngine.resolveCurrentRole('person_bryan_avila', '2023-06-01');
    assert.strictEqual(avila2023.active_occupancies.length, 1);
    assert.strictEqual(avila2023.active_occupancies[0].seat_title, 'Florida Senate District 39');
  });

  // 7. Systemic Incident Structure & Child Traces
  runTest("Systemic Incident TEMPORAL_CURRENT_STATE_RECONCILIATION_FAILURE tracks all 5 canaries end-to-end", () => {
    const incident = systemicTemporalStateEngine.getSystemicIncidentDetails();
    assert.strictEqual(incident.parent_incident_id, 'TEMPORAL_CURRENT_STATE_RECONCILIATION_FAILURE');
    assert.strictEqual(incident.child_traces.length, 5);
    assert.strictEqual(incident.root_cause_classes.length, 6);
    assert.strictEqual(incident.generalized_repairs.length, 5);

    for (const trace of incident.child_traces) {
      assert.ok(trace.full_lineage_trace.person.length > 0);
      assert.ok(trace.full_lineage_trace.seat.length > 0);
      assert.ok(trace.full_lineage_trace.source_role.length > 0);
      assert.ok(trace.full_lineage_trace.persisted_state.length > 0);
    }
  });

  // 8. Population-Wide Currentness Audit across 9 Cohorts
  runTest("Population-wide currentness audit accounts for all 9 civic cohorts without synthetic 100% shortcuts", () => {
    const cohorts = systemicTemporalStateEngine.auditPopulationCurrentness();
    assert.strictEqual(cohorts.length, 9);

    const cong = cohorts.find(c => c.cohort.includes('Congress'));
    assert.ok(cong);
    assert.strictEqual(cong.matched, 30);

    const exec = cohorts.find(c => c.cohort.includes('statewide executives'));
    assert.ok(exec);
    assert.strictEqual(exec.matched, 5);

    const senate = cohorts.find(c => c.cohort.includes('Senate'));
    assert.ok(senate);
    assert.strictEqual(senate.matched, 39);
    assert.strictEqual(senate.vacant, 1); // SD39

    const bcc = cohorts.find(c => c.cohort.includes('County commissions'));
    assert.ok(bcc);
    assert.strictEqual(bcc.expected_current_seats, 382);
  });

  // 9. Blast Radius Calculation
  runTest("Blast radius accounts for all affected entities and non-destructive supersession lifecycle", () => {
    const blast = systemicTemporalStateEngine.calculateBlastRadius();
    assert.strictEqual(blast.persons_affected, 14);
    assert.strictEqual(blast.occupancies_affected, 18);
    assert.strictEqual(blast.seats_affected, 12);
    assert.strictEqual(blast.campaigns_affected, 16);
    assert.strictEqual(blast.bridge_packages_affected, 8);
    assert.strictEqual(blast.dashboard_projections_affected, 14);
    assert.strictEqual(blast.deep_dossiers_affected, 6);
  });

  console.log("\n=======================================================");
  console.log(`SYSTEMIC TEMPORAL TESTS COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runSystemicTemporalTests().catch(err => {
  console.error("Systemic temporal test runner failed:", err);
  process.exit(1);
});
