/**
 * CIVICSLENZZ — ELECTION SEMANTICS & STATUTORY QUALIFYING DATES TEST SUITE
 * 
 * Verifies strict semantic separation across the Harvester:
 * 1. Statutory Qualifying Dates (§ 99.061(2), F.S.): Noon June 8, 2026 – Noon June 12, 2026
 * 2. Pre-qualifying Document Acceptance (§ 99.061(8), F.S.): May 25, 2026 – Noon June 8, 2026 (14-day window)
 *    Strict Rule: Pre-qualifying acceptance must NEVER be represented as the beginning of the statutory qualifying period.
 * 3. Continuous Candidate Filing (§ 106.021, F.S.): Active DS-DE 9 campaign treasury filing.
 * 4. Candidate Qualification Status: Must be 'FILED', NEVER 'QUALIFIED' prior to the statutory qualifying period.
 * 5. Senate Staggered Term Semantics:
 *    - Even districts (2, 4, ..., 40) are on 2026 ballot (seat_scheduled_for_election: true)
 *    - Odd districts (1, 3, ..., 39) are off-cycle in 2026 (seat_scheduled_for_election: false, cycle_year: 2028)
 * 6. Florida House Semantics: All 120 seats are on 2026 ballot (seat_scheduled_for_election: true)
 * 7. Legislative GIS Authority Hierarchy:
 *    - operational_geometry_source: US_CENSUS_BUREAU_TIGER_WEB
 *    - legal_authoritative_district_source: FLORIDA_LEGISLATURE_SJR_20E_SUPREME_COURT_OF_FLORIDA
 * 8. Cohort Readiness Engine Semantics:
 *    - Distinguishes election_cycles_known from seats_scheduled_for_election and seats_in_active_qualifying
 * 9. Canonical Unreviewed Default:
 *    - All extraction statuses default to extracted_unreviewed
 *    - VERIFIED count strictly 0, CANONICAL_ACCEPTED strictly 0
 */

import {
  ALL_STRUCTURAL_SEATS,
  FLORIDA_STATEWIDE_EXECUTIVE_SEATS,
  FLORIDA_SENATE_SEATS,
  FLORIDA_HOUSE_SEATS,
  SOUTH_FLORIDA_LOCAL_SEATS,
  FL_2026_STATUTORY_QUALIFYING_PERIOD,
  FL_2026_PRE_QUALIFYING_ACCEPTANCE,
  FL_CANDIDATE_FILING_ACTIVITY_ACTIVE
} from '../src/lib/fl-senate-house-seats';
import { cohortReadinessEngine } from '../src/lib/cohort-readiness-engine';
import { seatLifecycleEngine } from '../src/lib/seat-lifecycle-engine';
import { floridaBacklogEngine } from '../src/lib/florida-backlog-engine';
import assert from 'assert';

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

async function runAllSemanticsTests() {
  console.log("\n=======================================================");
  console.log("RUNNING CIVICSLENZZ - ELECTION & GIS SEMANTICS TEST SUITE");
  console.log("=======================================================\n");

  // Test 1: Statutory Qualifying Window Constant Accuracy
  await runTest("1. Statutory Qualifying Window (§ 99.061(2), F.S.) is Noon June 8 – Noon June 12, 2026", () => {
    assert.strictEqual(FL_2026_STATUTORY_QUALIFYING_PERIOD.start, "2026-06-08T12:00:00-04:00");
    assert.strictEqual(FL_2026_STATUTORY_QUALIFYING_PERIOD.end, "2026-06-12T12:00:00-04:00");
    assert.ok(FL_2026_STATUTORY_QUALIFYING_PERIOD.statutory_authority.includes("Section 99.061(2)"));
  });

  // Test 2: Pre-Qualifying Document Acceptance Constant Accuracy
  await runTest("2. Pre-Qualifying Document Acceptance (§ 99.061(8), F.S.) is Separate 14-Day Window", () => {
    assert.strictEqual(FL_2026_PRE_QUALIFYING_ACCEPTANCE.start, "2026-05-25T08:00:00-04:00");
    assert.strictEqual(FL_2026_PRE_QUALIFYING_ACCEPTANCE.end, "2026-06-08T12:00:00-04:00");
    assert.notStrictEqual(
      FL_2026_PRE_QUALIFYING_ACCEPTANCE.start,
      FL_2026_STATUTORY_QUALIFYING_PERIOD.start,
      "Pre-qualifying document acceptance start must NEVER equal statutory qualifying start"
    );
  });

  // Test 3: No Candidate Reported as 'QUALIFIED' before June 8, 2026
  await runTest("3. Candidate Lifecycle Status: Zero Candidates Reported as QUALIFIED Prior to Qualifying Window", () => {
    let checkedCandidates = 0;
    ALL_STRUCTURAL_SEATS.forEach(seat => {
      const candidates = seat.election_schedule?.candidates || [];
      candidates.forEach(c => {
        checkedCandidates++;
        assert.notStrictEqual(
          c.status,
          "QUALIFIED",
          `Candidate ${c.candidate_name} on seat ${seat.seat_key} must NOT have status QUALIFIED before statutory qualifying window`
        );
        assert.ok(
          c.status === "FILED" || c.status === "DECLARED",
          `Candidate status must be FILED or DECLARED (got ${c.status})`
        );
      });
    });
    console.log(`     (Audited ${checkedCandidates} candidate record(s) across all seats)`);
  });

  // Test 4: Florida Senate Staggered Term Semantics
  await runTest("4. Florida Senate Staggered Terms: Even Districts Scheduled for 2026, Odd Districts Off-Cycle", () => {
    assert.strictEqual(FLORIDA_SENATE_SEATS.length, 40);
    
    let evenCount = 0;
    let oddCount = 0;

    FLORIDA_SENATE_SEATS.forEach(seat => {
      const distMatch = seat.chamber_district.match(/District (\d+)/);
      assert.ok(distMatch, "Must have valid district number");
      const distNum = parseInt(distMatch[1], 10);
      const isEven = distNum % 2 === 0;

      if (isEven) {
        evenCount++;
        assert.strictEqual(
          seat.election_schedule?.seat_scheduled_for_election,
          true,
          `Senate District ${distNum} (even) must be scheduled for 2026 election`
        );
        assert.strictEqual(seat.election_schedule?.cycle_year, 2026);
        assert.strictEqual(seat.election_schedule?.next_election_date, "2026-11-03");
      } else {
        oddCount++;
        assert.strictEqual(
          seat.election_schedule?.seat_scheduled_for_election,
          false,
          `Senate District ${distNum} (odd) must NOT be scheduled for 2026 election (off-cycle)`
        );
        assert.strictEqual(seat.election_schedule?.cycle_year, 2028);
        assert.strictEqual(seat.election_schedule?.next_election_date, "2028-11-07");
      }
    });

    assert.strictEqual(evenCount, 20, "Must have exactly 20 even Senate districts scheduled for 2026");
    assert.strictEqual(oddCount, 20, "Must have exactly 20 odd Senate districts off-cycle until 2028");
  });

  // Test 5: Florida House Semantics (All 120 Scheduled for 2026)
  await runTest("5. Florida House: All 120 Seats Scheduled for 2026 General Election", () => {
    assert.strictEqual(FLORIDA_HOUSE_SEATS.length, 120);
    FLORIDA_HOUSE_SEATS.forEach(seat => {
      assert.strictEqual(seat.election_schedule?.election_cycle_known, true);
      assert.strictEqual(seat.election_schedule?.seat_scheduled_for_election, true);
      assert.strictEqual(seat.election_schedule?.cycle_year, 2026);
      assert.strictEqual(seat.election_schedule?.next_election_date, "2026-11-03");
    });
  });

  // Test 6: Florida Legislative GIS Authority Hierarchy
  await runTest("6. Florida Legislative GIS Authority Hierarchy: Operational vs Legal Sources", () => {
    FLORIDA_SENATE_SEATS.forEach(seat => {
      const gis = seat.gis_boundary as any;
      assert.strictEqual(gis.operational_geometry_source, "US_CENSUS_BUREAU_TIGER_WEB");
      assert.ok(
        gis.legal_authoritative_district_source.includes("FLORIDA_LEGISLATURE_SJR_20E_SUPREME_COURT_OF_FLORIDA"),
        "Must reference Florida Legislature SJR 20-E"
      );
      assert.strictEqual(gis.cross_source_reconciliation_state, "RECONCILED_WITH_LEGAL_BASE");
    });

    FLORIDA_HOUSE_SEATS.forEach(seat => {
      const gis = seat.gis_boundary as any;
      assert.strictEqual(gis.operational_geometry_source, "US_CENSUS_BUREAU_TIGER_WEB");
      assert.ok(
        gis.legal_authoritative_district_source.includes("House Plan H027H8002"),
        "Must reference House Plan H027H8002"
      );
      assert.strictEqual(gis.cross_source_reconciliation_state, "RECONCILED_WITH_LEGAL_BASE");
    });
  });

  // Test 7: Cohort Readiness Accounting Verification
  await runTest("7. Cohort Readiness Package: Decomposed Election Metrics & Strict Zero Trust Promotion", () => {
    const senatePkg = cohortReadinessEngine.generateFloridaSenateCohort();
    assert.strictEqual(senatePkg.metrics.seats_expected, 40);
    assert.strictEqual(senatePkg.metrics.seats_discovered, 40);
    assert.strictEqual(senatePkg.metrics.election_cycles_known, 40);
    assert.strictEqual(senatePkg.metrics.seats_scheduled_for_election, 20);
    assert.strictEqual(senatePkg.metrics.seats_off_cycle_monitored, 20);
    assert.strictEqual(senatePkg.metrics.seats_in_active_qualifying, 0, "No seats in active qualifying before Noon June 8, 2026");
    assert.strictEqual(senatePkg.metrics.candidate_filing_active_count, 40);

    // Strict non-promotion:
    assert.strictEqual(senatePkg.status_accounting.CANONICAL_ACCEPTED, 0);
    assert.strictEqual(senatePkg.status_accounting.VERIFIED, 0);
  });

  // Test 8: Seat Lifecycle Engine Decomposed Schedule
  await runTest("8. SeatLifecycleEngine: Decomposed Upcoming Election & Default Candidate Status", () => {
    const govSeat = seatLifecycleEngine.getSeatMeta("seat_fl_gov_master");
    assert.ok(govSeat, "Governor seat must exist");
    assert.strictEqual(govSeat.upcoming_election.election_cycle_known, true);
    assert.strictEqual(govSeat.upcoming_election.seat_scheduled_for_election, true);
    assert.strictEqual(govSeat.upcoming_election.cycle_year, 2026);
    assert.strictEqual(govSeat.upcoming_election.qualifying_period.start, "2026-06-08T12:00:00-04:00");
    assert.strictEqual(govSeat.upcoming_election.qualifying_period.end, "2026-06-12T12:00:00-04:00");
    assert.strictEqual(govSeat.upcoming_election.pre_qualifying_document_acceptance.start, "2026-05-25T08:00:00-04:00");

    govSeat.declared_candidates.forEach(c => {
      assert.notStrictEqual(c.status, "QUALIFIED");
      assert.strictEqual(c.total_raised, undefined, "Zero fake financial numbers");
    });

    const newCand = seatLifecycleEngine.registerCandidate("seat_fl_gov_master", {
      candidate_name: "Test Candidate",
      party: "Independent"
    });
    assert.strictEqual(newCand.status, "FILED", "Newly registered candidate must default to FILED, not QUALIFIED");
  });

  // Test 9: Florida Backlog Engine Parallel Dossier Semantics
  await runTest("9. FloridaBacklogEngine: Dossier Semantics for Governor & SD35", () => {
    const govDossier = floridaBacklogEngine.getParallelSeatDossier("seat_fl_governor_executive");
    assert.ok(govDossier);
    assert.strictEqual(govDossier.track_b_election_candidates.election_cycle_known, true);
    assert.strictEqual(govDossier.track_b_election_candidates.seat_scheduled_for_election, true);
    assert.strictEqual(govDossier.track_b_election_candidates.cycle_year, 2026);
    assert.strictEqual(govDossier.track_b_election_candidates.qualifying_period.start, "2026-06-08T12:00:00-04:00");
    assert.strictEqual(govDossier.track_b_election_candidates.qualifying_period.end, "2026-06-12T12:00:00-04:00");
    assert.strictEqual(govDossier.track_b_election_candidates.candidates_tracked[0].qualification_status, "FILED");

    const sd35Dossier = floridaBacklogEngine.getParallelSeatDossier("seat_fl_senate_35");
    assert.ok(sd35Dossier);
    assert.strictEqual(sd35Dossier.track_b_election_candidates.seat_scheduled_for_election, false, "SD35 is odd district, off-cycle in 2026");
    assert.strictEqual(sd35Dossier.track_b_election_candidates.cycle_year, 2028);
    assert.strictEqual(sd35Dossier.track_b_election_candidates.candidates_tracked[0].qualification_status, "FILED");
  });

  console.log("\n=======================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllSemanticsTests().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
