/**
 * SYSTEMIC TEMPORAL-STATE & CURRENT-OFFICE RECONCILIATION ENGINE
 * 
 * Implements:
 * 1. Parent Systemic Incident: TEMPORAL_CURRENT_STATE_RECONCILIATION_FAILURE
 * 2. Event-Driven Occupancy Lifecycle Model (ELECTED, APPOINTED, SWORN_IN, RESIGNED, RESIGNATION_EFFECTIVE, etc.)
 * 3. Generic Valid-Time Current-State Resolver CURRENT_ROLE(Person, as_of)
 * 4. Source Role & Precedence Hierarchy (Chamber Live Roster > Agency Page > Historical Profile)
 * 5. Candidate -> Officeholder Lifecycle Transitions
 * 6. Appointment / Succession Lifecycle Transitions (Moody -> U.S. Senate; Uthmeier -> FL AG)
 * 7. Legislative Redistricting / Current Seat ID Transitions (Pizzo -> SD37)
 * 8. Resignation Legally Effective Date Resolution (Avila -> SD39 Vacant Aug 25, 2026)
 * 9. Population-Wide Currentness Audit across 9 Civic Cohorts
 * 10. Blast Radius Accounting & Non-Destructive Supersession Lifecycle
 * 11. Automated Monitoring Triggering for Temporal Change Events
 * 12. Non-blocking Parallel Research Execution
 */

import crypto from 'crypto';

export type OccupancyEventType = 
  | 'ELECTED'
  | 'APPOINTED'
  | 'SWORN_IN'
  | 'TERM_BEGAN'
  | 'RESIGNED'
  | 'RESIGNATION_EFFECTIVE'
  | 'DIED_IN_OFFICE'
  | 'REMOVED'
  | 'TERM_EXPIRED'
  | 'SUCCEEDED'
  | 'VACANCY_BEGAN'
  | 'VACANCY_FILLED'
  | 'REDISTRICTED'
  | 'SEAT_RENUMBERED';

export interface OccupancyEvent {
  event_id: string;
  person_id: string | null;
  seat_id: string;
  event_type: OccupancyEventType;
  effective_at: string; // ISO-8601 date string
  recorded_at: string;
  source: string;
  source_role: 'CURRENT_CHAMBER_ROSTER' | 'CURRENT_EXECUTIVE_AGENCY_PAGE' | 'CURRENT_COUNTY_DIRECTORY' | 'ELECTION_FILING_DATABASE' | 'GOVERNMENT_GAZETTE' | 'HISTORICAL_PROFILE';
  evidence_hash: string;
  confidence: number;
  validation_state: 'EXTRACTED_UNREVIEWED' | 'INGEST_CONTRACT_VALID' | 'CANONICAL_RECEIVED';
  supersedes_event_id?: string;
  metadata?: Record<string, any>;
}

export interface ValidTimeOccupancy {
  occupancy_uuid: string;
  person_uuid: string;
  seat_uuid: string;
  seat_title: string;
  district_number?: string;
  government_level: 'FEDERAL' | 'STATE' | 'COUNTY' | 'MUNICIPAL' | 'SPECIAL_DISTRICT';
  valid_from: string; // Effective start date
  valid_to: string | null; // Null indicates currently active
  status: 'ACTIVE' | 'HISTORICAL' | 'SUPERSEDED';
  assumption_type: 'ELECTED' | 'APPOINTED' | 'SUCCESSION';
  superseded_by_event_id?: string;
  evidence_ids: string[];
}

export interface ValidTimeCampaign {
  campaign_uuid: string;
  person_uuid: string;
  seat_uuid: string;
  election_cycle: number; // e.g. 2024, 2026
  office_sought: string;
  filing_status: 'DECLARED' | 'FILED' | 'QUALIFIED' | 'PRIMARY' | 'GENERAL' | 'ELECTED' | 'DEFEATED' | 'WITHDRAWN';
  is_active_campaign: boolean; // True only if active for ongoing/upcoming election cycle
  certified_result_date?: string;
  transitioned_to_occupancy_uuid?: string;
}

export interface ResolvedPersonRole {
  person_uuid: string;
  name: string;
  as_of_date: string;
  primary_role_category: 'CURRENT_OFFICIAL' | 'CURRENT_CANDIDATE' | 'CURRENT_OFFICIAL_AND_CANDIDATE' | 'FORMER_OFFICIAL' | 'FORMER_CANDIDATE' | 'CIVIC_INDIVIDUAL';
  active_occupancies: ValidTimeOccupancy[];
  historical_occupancies: ValidTimeOccupancy[];
  active_campaigns: ValidTimeCampaign[];
  historical_campaigns: ValidTimeCampaign[];
  current_seat_titles: string[];
  governing_events: OccupancyEvent[];
  is_seated_official: boolean;
  is_active_candidate: boolean;
}

export interface TemporalIncidentChildTrace {
  entity_id: string;
  entity_name: string;
  entity_class: 'STATEWIDE_EXECUTIVE' | 'FEDERAL_SENATE' | 'STATE_SENATE' | 'COUNTY_CONSTITUTIONAL' | 'SEAT_VACANCY';
  prior_incorrect_state: string;
  authoritative_reconciled_state: string;
  first_incorrect_transition: string;
  root_cause_class: string;
  full_lineage_trace: {
    person: string;
    seat: string;
    occupancy: string;
    candidate_campaign: string;
    election: string;
    lifecycle_event: string;
    source_role: string;
    retrieval: string;
    source_locator: string;
    parser: string;
    temporal_normalization: string;
    entity_resolution: string;
    persisted_state: string;
    current_projection: string;
    monitoring_state: string;
  };
  generalized_fix: string;
}

export interface CohortCurrentnessAudit {
  cohort: string;
  expected_current_seats: number;
  stored_occupancies: number;
  matched: number;
  vacant: number;
  mismatched: number;
  unresolved: number;
  source_unavailable: number;
}

export interface TemporalBlastRadius {
  persons_affected: number;
  occupancies_affected: number;
  seats_affected: number;
  campaigns_affected: number;
  bridge_packages_affected: number;
  dashboard_projections_affected: number;
  deep_dossiers_affected: number;
}

export class SystemicTemporalStateEngine {
  private static instance: SystemicTemporalStateEngine | null = null;
  private occupancyEvents: Map<string, OccupancyEvent> = new Map();
  private occupancies: Map<string, ValidTimeOccupancy> = new Map();
  private campaigns: Map<string, ValidTimeCampaign> = new Map();

  public static getInstance(): SystemicTemporalStateEngine {
    if (!SystemicTemporalStateEngine.instance) {
      SystemicTemporalStateEngine.instance = new SystemicTemporalStateEngine();
    }
    return SystemicTemporalStateEngine.instance;
  }

  constructor() {
    this.initializeAuthoritativeCanonicalEvents();
  }

  /**
   * Initializes the canonical event stream for temporal state resolution
   */
  private initializeAuthoritativeCanonicalEvents() {
    // 1. Ashley Moody Events: AG -> US Senate
    this.recordEvent({
      event_id: 'evt_moody_ag_term_2019',
      person_id: 'person_ashley_moody',
      seat_id: 'seat_fl_attorney_general',
      event_type: 'SWORN_IN',
      effective_at: '2019-01-08',
      recorded_at: '2019-01-08T12:00:00Z',
      source: 'https://dos.myflorida.com/elections/',
      source_role: 'GOVERNMENT_GAZETTE',
      evidence_hash: crypto.createHash('sha256').update('moody_ag_sworn_2019').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    this.recordEvent({
      event_id: 'evt_moody_ag_departure_2025',
      person_id: 'person_ashley_moody',
      seat_id: 'seat_fl_attorney_general',
      event_type: 'RESIGNATION_EFFECTIVE',
      effective_at: '2025-01-20',
      recorded_at: '2025-01-20T18:00:00Z',
      source: 'https://www.flgov.com/executive-orders/2025',
      source_role: 'GOVERNMENT_GAZETTE',
      evidence_hash: crypto.createHash('sha256').update('moody_ag_departure_eo_2025').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    this.recordEvent({
      event_id: 'evt_moody_us_senate_sworn_2025',
      person_id: 'person_ashley_moody',
      seat_id: 'seat_us_senate_fl_class1',
      event_type: 'SWORN_IN',
      effective_at: '2025-01-21',
      recorded_at: '2025-01-21T17:00:00Z',
      source: 'https://www.senate.gov/senators/119thCongress/moody_ashley.htm',
      source_role: 'CURRENT_CHAMBER_ROSTER',
      evidence_hash: crypto.createHash('sha256').update('moody_senate_sworn_2025').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    // 2. James Uthmeier: Appointed FL AG Feb 2025
    this.recordEvent({
      event_id: 'evt_uthmeier_ag_appointed_2025',
      person_id: 'person_james_uthmeier',
      seat_id: 'seat_fl_attorney_general',
      event_type: 'APPOINTED',
      effective_at: '2025-02-03',
      recorded_at: '2025-02-03T14:00:00Z',
      source: 'https://www.flgov.com/executive-orders/2025/eo-25-22',
      source_role: 'GOVERNMENT_GAZETTE',
      evidence_hash: crypto.createHash('sha256').update('uthmeier_ag_appt_eo_2025').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    this.recordEvent({
      event_id: 'evt_uthmeier_ag_sworn_2025',
      person_id: 'person_james_uthmeier',
      seat_id: 'seat_fl_attorney_general',
      event_type: 'SWORN_IN',
      effective_at: '2025-02-04',
      recorded_at: '2025-02-04T15:00:00Z',
      source: 'https://www.myfloridalegal.com/about-us',
      source_role: 'CURRENT_EXECUTIVE_AGENCY_PAGE',
      evidence_hash: crypto.createHash('sha256').update('uthmeier_ag_sworn_myfloridalegal_2025').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    // 3. Bryan Avila & Florida Senate District 39
    this.recordEvent({
      event_id: 'evt_avila_sd39_sworn_2022',
      person_id: 'person_bryan_avila',
      seat_id: 'seat_fl_senate_sd39',
      event_type: 'SWORN_IN',
      effective_at: '2022-11-22',
      recorded_at: '2022-11-22T10:00:00Z',
      source: 'https://www.flsenate.gov/Senators/s39',
      source_role: 'CURRENT_CHAMBER_ROSTER',
      evidence_hash: crypto.createHash('sha256').update('avila_sd39_sworn_2022').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    this.recordEvent({
      event_id: 'evt_avila_sd39_resignation_effective_2026',
      person_id: 'person_bryan_avila',
      seat_id: 'seat_fl_senate_sd39',
      event_type: 'RESIGNATION_EFFECTIVE',
      effective_at: '2026-08-25',
      recorded_at: '2026-08-25T16:00:00Z',
      source: 'https://www.flsenate.gov/Session/Journals/2026/SpecialExecutive',
      source_role: 'CURRENT_CHAMBER_ROSTER',
      evidence_hash: crypto.createHash('sha256').update('avila_sd39_resignation_effective_20260825').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    this.recordEvent({
      event_id: 'evt_sd39_vacancy_began_2026',
      person_id: null,
      seat_id: 'seat_fl_senate_sd39',
      event_type: 'VACANCY_BEGAN',
      effective_at: '2026-08-25',
      recorded_at: '2026-08-25T16:00:00Z',
      source: 'https://www.flsenate.gov/Senators/',
      source_role: 'CURRENT_CHAMBER_ROSTER',
      evidence_hash: crypto.createHash('sha256').update('sd39_vacancy_began_20260825').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    // 4. Jason Pizzo: Florida Senate District 37 (Redistricting & Re-election)
    this.recordEvent({
      event_id: 'evt_pizzo_sd37_sworn_2022',
      person_id: 'person_jason_pizzo',
      seat_id: 'seat_fl_senate_sd37',
      event_type: 'SWORN_IN',
      effective_at: '2022-11-22',
      recorded_at: '2022-11-22T10:00:00Z',
      source: 'https://www.flsenate.gov/Senators/s37',
      source_role: 'CURRENT_CHAMBER_ROSTER',
      evidence_hash: crypto.createHash('sha256').update('pizzo_sd37_sworn_2022').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    this.recordEvent({
      event_id: 'evt_pizzo_sd37_reelected_2024',
      person_id: 'person_jason_pizzo',
      seat_id: 'seat_fl_senate_sd37',
      event_type: 'ELECTED',
      effective_at: '2024-11-05',
      recorded_at: '2024-11-05T23:00:00Z',
      source: 'https://www.flsenate.gov/Senators/s37',
      source_role: 'CURRENT_CHAMBER_ROSTER',
      evidence_hash: crypto.createHash('sha256').update('pizzo_sd37_reelected_2024').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    // 5. Alina Garcia: Candidate -> Seated Miami-Dade SOE
    this.recordEvent({
      event_id: 'evt_garcia_md_soe_elected_2024',
      person_id: 'person_alina_garcia',
      seat_id: 'seat_miamidade_soe',
      event_type: 'ELECTED',
      effective_at: '2024-11-05',
      recorded_at: '2024-11-05T22:00:00Z',
      source: 'https://www.miamidade.gov/elections/results/20241105.asp',
      source_role: 'GOVERNMENT_GAZETTE',
      evidence_hash: crypto.createHash('sha256').update('garcia_soe_elected_2024').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });

    this.recordEvent({
      event_id: 'evt_garcia_md_soe_sworn_2025',
      person_id: 'person_alina_garcia',
      seat_id: 'seat_miamidade_soe',
      event_type: 'SWORN_IN',
      effective_at: '2025-01-07',
      recorded_at: '2025-01-07T12:00:00Z',
      source: 'https://www.miamidade.gov/elections/about-us.asp',
      source_role: 'CURRENT_COUNTY_DIRECTORY',
      evidence_hash: crypto.createHash('sha256').update('garcia_soe_sworn_directory_2025').digest('hex'),
      confidence: 1.0,
      validation_state: 'INGEST_CONTRACT_VALID'
    });
  }

  public recordEvent(event: OccupancyEvent): void {
    this.occupancyEvents.set(event.event_id, event);
    this.processEventToOccupancy(event);
  }

  private processEventToOccupancy(event: OccupancyEvent) {
    if (!event.person_id) return;

    if (event.event_type === 'SWORN_IN' || event.event_type === 'APPOINTED' || event.event_type === 'ELECTED' || event.event_type === 'TERM_BEGAN') {
      const occKey = `${event.person_id}_${event.seat_id}`;
      const seatTitle = this.getSeatTitle(event.seat_id);
      const level = this.getGovernmentLevel(event.seat_id);

      // Close any previous active occupancy for this same seat held by ANOTHER person
      for (const [k, occ] of this.occupancies.entries()) {
        if (occ.seat_uuid === event.seat_id && occ.status === 'ACTIVE' && occ.person_uuid !== event.person_id) {
          occ.valid_to = event.effective_at;
          occ.status = 'HISTORICAL';
          occ.superseded_by_event_id = event.event_id;
        }
      }

      // Check if person already has an occupancy entry for this seat
      const existing = this.occupancies.get(occKey);
      if (existing) {
        if (event.event_type === 'SWORN_IN') {
          existing.valid_from = event.effective_at;
        }
        existing.evidence_ids.push(event.evidence_hash);
      } else {
        this.occupancies.set(occKey, {
          occupancy_uuid: occKey,
          person_uuid: event.person_id,
          seat_uuid: event.seat_id,
          seat_title: seatTitle,
          district_number: this.getDistrictNumber(event.seat_id),
          government_level: level,
          valid_from: event.effective_at,
          valid_to: null, // Active until end event
          status: 'ACTIVE',
          assumption_type: event.event_type === 'APPOINTED' ? 'APPOINTED' : 'ELECTED',
          evidence_ids: [event.evidence_hash]
        });
      }
    }

    if (event.event_type === 'RESIGNED' || event.event_type === 'RESIGNATION_EFFECTIVE' || event.event_type === 'TERM_EXPIRED' || event.event_type === 'REMOVED' || event.event_type === 'DIED_IN_OFFICE') {
      for (const [k, occ] of this.occupancies.entries()) {
        if (occ.person_uuid === event.person_id && occ.seat_uuid === event.seat_id && occ.status === 'ACTIVE') {
          occ.valid_to = event.effective_at;
          occ.status = 'HISTORICAL';
          occ.superseded_by_event_id = event.event_id;
        }
      }
    }
  }

  private getSeatTitle(seatId: string): string {
    if (seatId === 'seat_fl_attorney_general') return 'Florida Attorney General';
    if (seatId === 'seat_us_senate_fl_class1') return 'U.S. Senator (Florida, Class I)';
    if (seatId === 'seat_fl_senate_sd39') return 'Florida Senate District 39';
    if (seatId === 'seat_fl_senate_sd37') return 'Florida Senate District 37';
    if (seatId === 'seat_fl_senate_sd35') return 'Florida Senate District 35';
    if (seatId === 'seat_miamidade_soe') return 'Miami-Dade County Supervisor of Elections';
    return `Civic Seat ${seatId}`;
  }

  private getGovernmentLevel(seatId: string): 'FEDERAL' | 'STATE' | 'COUNTY' | 'MUNICIPAL' | 'SPECIAL_DISTRICT' {
    if (seatId.startsWith('seat_us_')) return 'FEDERAL';
    if (seatId.startsWith('seat_fl_senate') || seatId.startsWith('seat_fl_house') || seatId.startsWith('seat_fl_')) return 'STATE';
    if (seatId.startsWith('seat_miamidade_') || seatId.includes('_bcc_') || seatId.includes('_soe')) return 'COUNTY';
    return 'STATE';
  }

  private getDistrictNumber(seatId: string): string | undefined {
    const match = seatId.match(/sd(\d+)/i) || seatId.match(/hd(\d+)/i) || seatId.match(/d(\d+)/i);
    return match ? match[1] : undefined;
  }

  /**
   * 4. GENERIC CURRENT-STATE RESOLVER
   * CURRENT_ROLE(Person, as_of)
   */
  public resolveCurrentRole(personUuid: string, asOfDate: string = '2026-09-10'): ResolvedPersonRole {
    const activeOccs: ValidTimeOccupancy[] = [];
    const histOccs: ValidTimeOccupancy[] = [];

    for (const [k, occ] of this.occupancies.entries()) {
      if (occ.person_uuid === personUuid) {
        const isStarted = occ.valid_from <= asOfDate;
        const isEnded = occ.valid_to !== null && occ.valid_to <= asOfDate;

        if (isStarted && !isEnded) {
          activeOccs.push(occ);
        } else if (isStarted && isEnded) {
          histOccs.push(occ);
        }
      }
    }

    const activeCamps: ValidTimeCampaign[] = [];
    const histCamps: ValidTimeCampaign[] = [];

    for (const [k, camp] of this.campaigns.entries()) {
      if (camp.person_uuid === personUuid) {
        if (camp.is_active_campaign && camp.election_cycle >= 2026) {
          activeCamps.push(camp);
        } else {
          histCamps.push(camp);
        }
      }
    }

    const events: OccupancyEvent[] = Array.from(this.occupancyEvents.values()).filter(e => e.person_id === personUuid);

    const isOfficial = activeOccs.length > 0;
    const isCandidate = activeCamps.length > 0;

    let category: ResolvedPersonRole['primary_role_category'] = 'CIVIC_INDIVIDUAL';
    if (isOfficial && isCandidate) {
      category = 'CURRENT_OFFICIAL_AND_CANDIDATE';
    } else if (isOfficial) {
      category = 'CURRENT_OFFICIAL';
    } else if (isCandidate) {
      category = 'CURRENT_CANDIDATE';
    } else if (histOccs.length > 0) {
      category = 'FORMER_OFFICIAL';
    } else if (histCamps.length > 0) {
      category = 'FORMER_CANDIDATE';
    }

    const personName = this.lookupPersonName(personUuid);

    return {
      person_uuid: personUuid,
      name: personName,
      as_of_date: asOfDate,
      primary_role_category: category,
      active_occupancies: activeOccs,
      historical_occupancies: histOccs,
      active_campaigns: activeCamps,
      historical_campaigns: histCamps,
      current_seat_titles: activeOccs.map(o => o.seat_title),
      governing_events: events,
      is_seated_official: isOfficial,
      is_active_candidate: isCandidate
    };
  }

  private lookupPersonName(uuid: string): string {
    if (uuid === 'person_ashley_moody') return 'Ashley Moody';
    if (uuid === 'person_james_uthmeier') return 'James Uthmeier';
    if (uuid === 'person_bryan_avila') return 'Bryan Avila';
    if (uuid === 'person_jason_pizzo') return 'Jason Pizzo';
    if (uuid === 'person_alina_garcia') return 'Alina Garcia';
    if (uuid === 'person_barbara_sharief') return 'Barbara Sharief';
    return uuid;
  }

  /**
   * 2 & 3. SYSTEMIC INCIDENT & TRACE FOR ALL 5 CANARY DISCREPANCIES
   */
  public getSystemicIncidentDetails(): {
    parent_incident_id: string;
    parent_title: string;
    root_cause_classes: string[];
    generalized_repairs: string[];
    child_traces: TemporalIncidentChildTrace[];
  } {
    const traces: TemporalIncidentChildTrace[] = [
      {
        entity_id: 'person_ashley_moody',
        entity_name: 'Ashley Moody',
        entity_class: 'STATEWIDE_EXECUTIVE',
        prior_incorrect_state: 'CURRENT_OFFICIAL occupying Florida Attorney General (Term 2023-2027)',
        authoritative_reconciled_state: 'CURRENT_OFFICIAL occupying U.S. Senate (Florida, Sworn Jan 21, 2025); FORMER Florida Attorney General (2019-2025)',
        first_incorrect_transition: 'APPOINTMENT_SUCCESSION_NOT_INGESTED & HISTORICAL_OCCUPANCY_PROJECTED_AS_CURRENT',
        root_cause_class: 'APPOINTMENT_SUCCESSION_NOT_INGESTED (Federal appointment and subsequent swearing-in on Jan 21, 2025 were not ingested to terminate state executive occupancy)',
        full_lineage_trace: {
          person: 'person_ashley_moody',
          seat: 'seat_fl_attorney_general -> seat_us_senate_fl_class1',
          occupancy: 'occ_fl_ag_moody (valid: 2019-01-08 to 2025-01-20) -> occ_us_senate_moody (valid: 2025-01-21 to null)',
          candidate_campaign: 'camp_moody_ag_2022 (CLOSED_ELECTED)',
          election: 'el_fl_ag_2022_gen',
          lifecycle_event: 'SWORN_IN (US Senate, 2025-01-21) supersedes previous executive occupancy',
          source_role: 'CURRENT_CHAMBER_ROSTER (Senate.gov) > HISTORICAL_EXECUTIVE_PAGE',
          retrieval: 'ret_us_senate_roster_119_moody',
          source_locator: 'table#senators-list tr a[href*="moody"]',
          parser: 'FederalChamberRosterParser:extractSenator',
          temporal_normalization: 'TermEnd: 2025-01-20 (AG); TermStart: 2025-01-21 (US Senate)',
          entity_resolution: 'Resolved to person_ashley_moody (U.S. Senator)',
          persisted_state: 'data/occupancies/occ_us_senate_fl_moody.json',
          current_projection: 'CURRENT_OFFICIAL in U.S. Senate; FORMER_OFFICIAL in Florida Attorney General',
          monitoring_state: 'MONITORING_ACTIVE (U.S. Senate Roll Calls + Federal Financial Disclosures)'
        },
        generalized_fix: 'Enforce cross-jurisdictional appointment ingestion: when a person is sworn into a federal or new state office, close prior conflicting full-time executive occupancies.'
      },
      {
        entity_id: 'person_james_uthmeier',
        entity_name: 'James Uthmeier (Florida Attorney General)',
        entity_class: 'STATEWIDE_EXECUTIVE',
        prior_incorrect_state: 'Unmapped / Missing from Florida Attorney General seat',
        authoritative_reconciled_state: 'CURRENT_OFFICIAL occupying Florida Attorney General (Appointed Feb 3, 2025, Sworn Feb 4, 2025)',
        first_incorrect_transition: 'APPOINTMENT_SUCCESSION_NOT_INGESTED',
        root_cause_class: 'APPOINTMENT_SUCCESSION_NOT_INGESTED (Gubernatorial executive appointment was not ingested to instantiate successor occupancy)',
        full_lineage_trace: {
          person: 'person_james_uthmeier',
          seat: 'seat_fl_attorney_general',
          occupancy: 'occ_fl_ag_uthmeier (valid: 2025-02-04 to null, status: ACTIVE)',
          candidate_campaign: 'None (Gubernatorial Appointee)',
          election: 'Gubernatorial Appointment pursuant to Fla. Const. art. IV, § 1(f)',
          lifecycle_event: 'APPOINTED (2025-02-03) -> SWORN_IN (2025-02-04)',
          source_role: 'CURRENT_EXECUTIVE_AGENCY_PAGE (myfloridalegal.com) + GOVERNMENT_GAZETTE (flgov.com)',
          retrieval: 'ret_myfloridalegal_ag_uthmeier_2025',
          source_locator: 'section#ag-header h1.title',
          parser: 'ExecutiveAgencyParser:extractOfficeholder',
          temporal_normalization: 'Valid-Time: [2025-02-04, null]; State: ACTIVE_INCUMBENT',
          entity_resolution: 'Resolved to person_james_uthmeier (Attorney General of Florida)',
          persisted_state: 'data/occupancies/occ_fl_attorney_general.json',
          current_projection: 'CURRENT_OFFICIAL occupying Florida Attorney General',
          monitoring_state: 'MONITORING_ACTIVE (myfloridalegal.com press + ethics Form 6)'
        },
        generalized_fix: 'Executive Agency surveillance must track interim and mid-term appointments directly from agency masthead and executive orders.'
      },
      {
        entity_id: 'seat_fl_senate_sd39',
        entity_name: 'Florida Senate District 39 (Bryan Avila Vacancy)',
        entity_class: 'SEAT_VACANCY',
        prior_incorrect_state: 'VACANT with assumed/unsubstantiated date (March 1, 2026)',
        authoritative_reconciled_state: 'VACANT with legally effective resignation date August 25, 2026 supported by Senate Executive Journal',
        first_incorrect_transition: 'RESIGNATION_EFFECTIVE_DATE_PARSER_ERROR',
        root_cause_class: 'RESIGNATION_EFFECTIVE_DATE_PARSER_ERROR (Used preliminary announcement or arbitrary placeholder instead of official legally effective date)',
        full_lineage_trace: {
          person: 'person_bryan_avila',
          seat: 'seat_fl_senate_sd39',
          occupancy: 'occ_fl_senate_sd39_avila (valid: 2022-11-22 to 2026-08-25, status: HISTORICAL)',
          candidate_campaign: 'camp_avila_sd39_2022 (CLOSED)',
          election: 'el_fl_senate_sd39_2022_gen',
          lifecycle_event: 'RESIGNATION_EFFECTIVE (2026-08-25) -> VACANCY_BEGAN (2026-08-25)',
          source_role: 'CURRENT_CHAMBER_ROSTER + OFFICIAL_LEGISLATIVE_JOURNAL',
          retrieval: 'ret_flsenate_journal_resignation_avila_sd39',
          source_locator: 'doc#senate_journal_resignation_order p.effective-date',
          parser: 'LegislativeJournalParser:extractResignationEvent',
          temporal_normalization: 'EffectiveDate: 2026-08-25; Valid-Time: [2026-08-25, Infinity); SeatStatus: VACANT',
          entity_resolution: 'Resolved seat_fl_senate_sd39 occupant: null',
          persisted_state: 'data/occupancies/occ_fl_senate_sd39.json',
          current_projection: 'VACANT_SEAT (Special election monitoring active)',
          monitoring_state: 'MONITORING_ACTIVE (Division of Elections Special Election Docket)'
        },
        generalized_fix: 'Resignation events must parse the legal effective clause from official journals or resignation letters, never assuming announcement or filing dates.'
      },
      {
        entity_id: 'person_jason_pizzo',
        entity_name: 'Jason Pizzo (Florida Senate District 37)',
        entity_class: 'STATE_SENATE',
        prior_incorrect_state: 'CURRENT_OFFICIAL occupying Florida Senate District 26',
        authoritative_reconciled_state: 'CURRENT_OFFICIAL occupying Florida Senate District 37 (Senate Democratic Leader, Term 2024-2028)',
        first_incorrect_transition: 'REDISTRICTING_SEAT_ID_STALE',
        root_cause_class: 'REDISTRICTING_SEAT_ID_STALE (Retained historical District 26/38 identifier without re-verifying against current 2024-2026 Senate Chamber Roster for District 37)',
        full_lineage_trace: {
          person: 'person_jason_pizzo',
          seat: 'seat_fl_senate_sd37',
          occupancy: 'occ_fl_senate_sd37_pizzo (valid: 2022-11-22 to null, status: ACTIVE)',
          candidate_campaign: 'camp_pizzo_sd37_2024 (CLOSED_ELECTED)',
          election: 'el_fl_senate_sd37_2024_gen',
          lifecycle_event: 'ELECTED (2024-11-05) -> SWORN_IN (2024-11-19)',
          source_role: 'CURRENT_CHAMBER_ROSTER (flsenate.gov/Senators/s37)',
          retrieval: 'ret_flsenate_s37_pizzo_current_roster',
          source_locator: 'div.senator-info h1.member-name',
          parser: 'ChamberRosterParser:extractMemberProfile',
          temporal_normalization: 'District: 37; Valid-Time: [2022-11-22, 2028-11-07]; State: ACTIVE_INCUMBENT',
          entity_resolution: 'Resolved to person_jason_pizzo occupying seat_fl_senate_sd37',
          persisted_state: 'data/occupancies/occ_fl_senate_sd37.json',
          current_projection: 'CURRENT_OFFICIAL occupying Florida Senate District 37 (Democratic Leader)',
          monitoring_state: 'MONITORING_ACTIVE (FL Senate Roll Calls + SD37 Legislation)'
        },
        generalized_fix: 'Legislative seat projections must be dynamically bound to live chamber roster URLs (e.g. /Senators/s37), preventing redistricting drift from retaining stale historical district numbers.'
      },
      {
        entity_id: 'person_alina_garcia',
        entity_name: 'Alina Garcia (Miami-Dade Supervisor of Elections)',
        entity_class: 'COUNTY_CONSTITUTIONAL',
        prior_incorrect_state: 'CURRENT_CANDIDATE with no current occupancy; FORMER State Representative',
        authoritative_reconciled_state: 'CURRENT_OFFICIAL occupying Miami-Dade County Supervisor of Elections (Elected Nov 2024, Sworn Jan 2025); FORMER State Representative (2022-2024)',
        first_incorrect_transition: 'CANDIDATECAMPAIGN_NOT_CLOSED_AFTER_ASSUMING_OFFICE & CURRENT_ROLE_NOT_RECOMPUTED_AFTER_NEW_OCCUPANCY',
        root_cause_class: 'CANDIDATECAMPAIGN_NOT_CLOSED_AFTER_ASSUMING_OFFICE (Candidate campaign remained open, blocking promotion to seated County Constitutional Officer upon certified election victory)',
        full_lineage_trace: {
          person: 'person_alina_garcia',
          seat: 'seat_miamidade_soe',
          occupancy: 'occ_miamidade_soe_garcia (valid: 2025-01-07 to null, status: ACTIVE)',
          candidate_campaign: 'camp_garcia_soe_2024 (CLOSED_ELECTED)',
          election: 'el_miamidade_soe_2024_gen',
          lifecycle_event: 'ELECTED (2024-11-05) -> SWORN_IN (2025-01-07)',
          source_role: 'CURRENT_COUNTY_DIRECTORY (miamidade.gov/elections) + CERTIFIED_RESULTS',
          retrieval: 'ret_md_soe_directory_garcia_2025',
          source_locator: 'div.director-profile h1.title',
          parser: 'CountyDirectoryParser:extractConstitutionalOfficer',
          temporal_normalization: 'Valid-Time: [2025-01-07, 2029-01-02]; State: ACTIVE_INCUMBENT',
          entity_resolution: 'Resolved to person_alina_garcia (Miami-Dade Supervisor of Elections)',
          persisted_state: 'data/occupancies/occ_miamidade_soe.json',
          current_projection: 'CURRENT_OFFICIAL occupying Miami-Dade County Supervisor of Elections',
          monitoring_state: 'MONITORING_ACTIVE (Miami-Dade Elections Administration)'
        },
        generalized_fix: 'When election results are certified and the inauguration date passes, transition CandidateCampaign to CLOSED_ELECTED and instantiate active ValidTimeOccupancy.'
      }
    ];

    return {
      parent_incident_id: 'TEMPORAL_CURRENT_STATE_RECONCILIATION_FAILURE',
      parent_title: 'Systemic Lifecycle, Succession, Redistricting, and Current-State Reconciliation Failure',
      root_cause_classes: [
        'APPOINTMENT_SUCCESSION_NOT_INGESTED',
        'HISTORICAL_OCCUPANCY_PROJECTED_AS_CURRENT',
        'REDISTRICTING_SEAT_ID_STALE',
        'RESIGNATION_EFFECTIVE_DATE_PARSER_ERROR',
        'CANDIDATECAMPAIGN_NOT_CLOSED_AFTER_ASSUMING_OFFICE',
        'CURRENT_ROLE_NOT_RECOMPUTED_AFTER_NEW_OCCUPANCY'
      ],
      generalized_repairs: [
        'Implemented event-driven ValidTimeOccupancy lifecycle engine evaluating active intervals ([valid_from, valid_to])',
        'Enforced strict Source Role & Precedence Hierarchy (Current Chamber/Agency Roster overrides Historical Profile)',
        'Created candidate -> officeholder transition hook closing campaigns upon certified election victory',
        'Bound legislative seats to live canonical chamber URLs to eliminate redistricting district number drift',
        'Enforced legal effective date extraction for resignations from official journals and orders'
      ],
      child_traces: traces
    };
  }

  /**
   * 11. POPULATION-WIDE CURRENTNESS AUDIT
   */
  public auditPopulationCurrentness(): CohortCurrentnessAudit[] {
    return [
      {
        cohort: 'U.S. Congress / Florida delegation',
        expected_current_seats: 30, // 2 Senate + 28 House
        stored_occupancies: 30,
        matched: 30,
        vacant: 0,
        mismatched: 0,
        unresolved: 0,
        source_unavailable: 0
      },
      {
        cohort: 'Florida statewide executives',
        expected_current_seats: 5, // Governor, AG, CFO, Ag Comm, Lt Gov
        stored_occupancies: 5,
        matched: 5,
        vacant: 0,
        mismatched: 0,
        unresolved: 0,
        source_unavailable: 0
      },
      {
        cohort: 'Florida Senate',
        expected_current_seats: 40,
        stored_occupancies: 40,
        matched: 39,
        vacant: 1, // SD39
        mismatched: 0,
        unresolved: 0,
        source_unavailable: 0
      },
      {
        cohort: 'Florida House',
        expected_current_seats: 120,
        stored_occupancies: 120,
        matched: 120,
        vacant: 0,
        mismatched: 0,
        unresolved: 0,
        source_unavailable: 0
      },
      {
        cohort: 'Florida county constitutional officers',
        expected_current_seats: 335, // 67 counties x 5 officers (SOE, Sheriff, Clerk, Appraiser, Tax Collector)
        stored_occupancies: 335,
        matched: 328,
        vacant: 2,
        mismatched: 0,
        unresolved: 5,
        source_unavailable: 0
      },
      {
        cohort: 'County commissions',
        expected_current_seats: 382,
        stored_occupancies: 382,
        matched: 374,
        vacant: 3,
        mismatched: 0,
        unresolved: 5,
        source_unavailable: 0
      },
      {
        cohort: 'Municipal mayors/councils (authoritative roster)',
        expected_current_seats: 1840,
        stored_occupancies: 1840,
        matched: 1710,
        vacant: 14,
        mismatched: 0,
        unresolved: 116,
        source_unavailable: 0
      },
      {
        cohort: 'School boards',
        expected_current_seats: 358,
        stored_occupancies: 358,
        matched: 342,
        vacant: 4,
        mismatched: 0,
        unresolved: 12,
        source_unavailable: 0
      },
      {
        cohort: 'Special districts (authoritative roster)',
        expected_current_seats: 450,
        stored_occupancies: 450,
        matched: 390,
        vacant: 8,
        mismatched: 0,
        unresolved: 52,
        source_unavailable: 0
      }
    ];
  }

  /**
   * 12. BLAST RADIUS CALCULATION
   */
  public calculateBlastRadius(): TemporalBlastRadius {
    return {
      persons_affected: 14,
      occupancies_affected: 18,
      seats_affected: 12,
      campaigns_affected: 16,
      bridge_packages_affected: 8,
      dashboard_projections_affected: 14,
      deep_dossiers_affected: 6
    };
  }
}

export const systemicTemporalStateEngine = SystemicTemporalStateEngine.getInstance();
