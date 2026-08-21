// CivicLenZ / HERMES Matrix V2 — Orchestration Hierarchy Engine
// Implements Master Instruction Document Stage 2:
// Main HERMES Prime -> Florida Prime -> Level Primes -> Seat Controller (Sub-Prime per active Seat)

import { HermesWorkerId, hermesOrchestratorV2 } from './hermes-matrix-v2';
import { OfficeTypeTemplate } from './completeness-contract';

export type SeatLifecycleStage =
  | 'DISCOVERY_LOCK'
  | 'COLLECTION'
  | 'PRIMARY_SURGE'
  | 'FIELD_NARROWS'
  | 'GENERAL_ELECTION'
  | 'WINNER_PROMOTION'
  | 'BASELINE_COMPLETE'
  | 'MONITORING';

export type GovernmentLevelCategory =
  | 'FEDERAL_STATEWIDE'
  | 'STATE_LEGISLATIVE'
  | 'COUNTY'
  | 'LOCAL_MUNICIPAL';

export interface TemporaryAgentClone {
  clone_id: string;
  base_agent_id: HermesWorkerId;
  seat_uuid: string;
  candidate_uuid?: string;
  candidate_name?: string;
  purpose: string;
  created_at: string;
  expires_at?: string;
  status: 'ACTIVE_SURGE' | 'RETIRED_PRESERVED';
  collected_evidence_count: number;
}

export interface SeatResearchLock {
  seat_uuid: string;
  seat_title: string;
  office_type: OfficeTypeTemplate;
  level: GovernmentLevelCategory;
  jurisdiction: string;
  district?: string;
  active_official_uuid?: string;
  active_candidate_uuids: string[];
  locked_by_controller: boolean;
  controller_id: string;
  assigned_specialist_workers: HermesWorkerId[];
  active_agent_clones: TemporaryAgentClone[];
  research_contract_uuid: string;
  lock_established_at: string;
  last_activity_at: string;
}

export interface SeatStatusReport {
  seat_uuid: string;
  seat_title: string;
  level: GovernmentLevelCategory;
  jurisdiction: string;
  lifecycle_stage: SeatLifecycleStage;
  completeness_score: number;
  official_completeness?: number;
  candidate_completeness_avg?: number;
  active_official_uuid?: string;
  active_candidate_count: number;
  assigned_worker_count: number;
  active_clone_count: number;
  total_evidence_objects: number;
  field_state_summary: {
    verified_value_count: number;
    verified_none_count: number;
    not_applicable_count: number;
    conflicting_count: number;
    insufficient_count: number;
    in_progress_count: number;
  };
  missing_categories: string[];
  last_updated_at: string;
}

export interface LevelStatusReport {
  level_id: GovernmentLevelCategory;
  level_name: string;
  total_seats_managed: number;
  seats_in_collection: number;
  seats_in_primary_surge: number;
  seats_in_general_election: number;
  seats_baseline_complete: number;
  average_completeness_percent: number;
  total_active_agent_clones: number;
  level_bottlenecks: string[];
  active_seat_reports: SeatStatusReport[];
  report_timestamp: string;
}

export interface FloridaPrimeStatusReport {
  state_code: 'FL';
  state_name: 'Florida';
  total_seats_tracked: number; // 2,450 South FL + 20,000 Rest of FL
  overall_completeness_percent: number;
  active_primary_surges_count: number;
  total_active_agent_clones: number;
  level_summaries: Record<GovernmentLevelCategory, LevelStatusReport>;
  top_priority_seats: { seat_uuid: string; title: string; completeness: number; stage: SeatLifecycleStage }[];
  report_timestamp: string;
}

export interface DirectiveDownward {
  directive_id: string;
  source_prime: 'MAIN_PRIME' | 'FLORIDA_PRIME' | 'LEVEL_PRIME';
  target_level?: GovernmentLevelCategory;
  target_seat_uuid?: string;
  priority_weight: number; // 1 to 10
  allocated_worker_budget?: number;
  lifecycle_command?: 'ADVANCE_TO_SURGE' | 'NARROW_FIELD' | 'PROMOTE_WINNER' | 'SWITCH_TO_MONITORING';
  issued_at: string;
  notes?: string;
}

// ============================================================================
// SEAT CONTROLLER (SUB-PRIME PER ACTIVE SEAT)
// ============================================================================
export class SeatController {
  public seatUuid: string;
  public seatTitle: string;
  public level: GovernmentLevelCategory;
  public jurisdiction: string;
  public officeType: OfficeTypeTemplate;
  public lifecycleStage: SeatLifecycleStage;
  
  private lock: SeatResearchLock;
  private evidenceCount: number = 0;
  private completenessScore: number = 0;
  private activeClones: Map<string, TemporaryAgentClone> = new Map();
  private missingCategories: string[] = [];

  constructor(params: {
    seatUuid: string;
    seatTitle: string;
    level: GovernmentLevelCategory;
    jurisdiction: string;
    officeType: OfficeTypeTemplate;
    initialOfficialUuid?: string;
    initialCandidateUuids?: string[];
  }) {
    this.seatUuid = params.seatUuid;
    this.seatTitle = params.seatTitle;
    this.level = params.level;
    this.jurisdiction = params.jurisdiction;
    this.officeType = params.officeType;
    this.lifecycleStage = 'COLLECTION';

    const defaultAssignedWorkers: HermesWorkerId[] = [
      'H1', 'H2', 'H4', 'H13', 'H14', 'H17', 'H28', 'H32',
      'C1', 'C2', 'C11', 'C27',
      'E1', 'E5', 'E7', 'E13'
    ];

    this.lock = {
      seat_uuid: params.seatUuid,
      seat_title: params.seatTitle,
      office_type: params.officeType,
      level: params.level,
      jurisdiction: params.jurisdiction,
      active_official_uuid: params.initialOfficialUuid,
      active_candidate_uuids: params.initialCandidateUuids || [],
      locked_by_controller: true,
      controller_id: `subprime_seat_${params.seatUuid}`,
      assigned_specialist_workers: defaultAssignedWorkers,
      active_agent_clones: [],
      research_contract_uuid: `contract_${params.seatUuid}_v1`,
      lock_established_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString()
    };

    this.missingCategories = [
      'Identity & Biography',
      'Office Seat & History',
      'Campaign Finance Itemization',
      'Voting Records & Roll Calls',
      'Bill Sponsorships',
      'Public Promises',
      'Ethics Disclosures',
      'Court & Legal Dockets',
      'Committee Work'
    ];
  }

  public getLock(): SeatResearchLock {
    return { ...this.lock, active_agent_clones: Array.from(this.activeClones.values()) };
  }

  public setCompleteness(score: number, missingCats?: string[]) {
    this.completenessScore = Math.min(100, Math.max(0, score));
    if (missingCats) this.missingCategories = missingCats;
    this.lock.last_activity_at = new Date().toISOString();

    if (this.completenessScore >= 100 && this.lifecycleStage === 'COLLECTION') {
      this.lifecycleStage = 'BASELINE_COMPLETE';
    }
  }

  public incrementEvidence(count: number = 1) {
    this.evidenceCount += count;
    this.lock.last_activity_at = new Date().toISOString();
  }

  // --- PRIMARY SURGE & AGENT CLONING MECHANICS ---
  public requestAgentClone(
    baseAgentId: HermesWorkerId,
    candidateUuid: string,
    candidateName: string,
    purpose: string
  ): TemporaryAgentClone {
    const cloneId = `${baseAgentId}_CLONE_${candidateUuid.slice(-6)}_${Date.now().toString(36)}`;
    const newClone: TemporaryAgentClone = {
      clone_id: cloneId,
      base_agent_id: baseAgentId,
      seat_uuid: this.seatUuid,
      candidate_uuid: candidateUuid,
      candidate_name: candidateName,
      purpose,
      created_at: new Date().toISOString(),
      status: 'ACTIVE_SURGE',
      collected_evidence_count: 0
    };

    this.activeClones.set(cloneId, newClone);
    this.lifecycleStage = 'PRIMARY_SURGE';
    this.lock.last_activity_at = new Date().toISOString();
    return newClone;
  }

  public retireAgentClones(candidateUuidFilter?: string): number {
    let retiredCount = 0;
    this.activeClones.forEach((clone, id) => {
      if (!candidateUuidFilter || clone.candidate_uuid === candidateUuidFilter) {
        clone.status = 'RETIRED_PRESERVED';
        retiredCount++;
      }
    });

    if (Array.from(this.activeClones.values()).every(c => c.status === 'RETIRED_PRESERVED')) {
      if (this.lifecycleStage === 'PRIMARY_SURGE') {
        this.lifecycleStage = 'FIELD_NARROWS';
      }
    }

    this.lock.last_activity_at = new Date().toISOString();
    return retiredCount;
  }

  public advanceStage(targetStage: SeatLifecycleStage) {
    this.lifecycleStage = targetStage;
    this.lock.last_activity_at = new Date().toISOString();
  }

  public receiveDirective(directive: DirectiveDownward) {
    if (directive.lifecycle_command === 'ADVANCE_TO_SURGE') {
      this.lifecycleStage = 'PRIMARY_SURGE';
    } else if (directive.lifecycle_command === 'NARROW_FIELD') {
      this.retireAgentClones();
      this.lifecycleStage = 'FIELD_NARROWS';
    } else if (directive.lifecycle_command === 'PROMOTE_WINNER') {
      this.lifecycleStage = 'WINNER_PROMOTION';
    } else if (directive.lifecycle_command === 'SWITCH_TO_MONITORING') {
      this.lifecycleStage = 'MONITORING';
    }
  }

  public generateUpwardReport(): SeatStatusReport {
    const activeCloneCount = Array.from(this.activeClones.values()).filter(c => c.status === 'ACTIVE_SURGE').length;
    
    return {
      seat_uuid: this.seatUuid,
      seat_title: this.seatTitle,
      level: this.level,
      jurisdiction: this.jurisdiction,
      lifecycle_stage: this.lifecycleStage,
      completeness_score: this.completenessScore,
      active_official_uuid: this.lock.active_official_uuid,
      active_candidate_count: this.lock.active_candidate_uuids.length,
      assigned_worker_count: this.lock.assigned_specialist_workers.length,
      active_clone_count: activeCloneCount,
      total_evidence_objects: this.evidenceCount,
      field_state_summary: {
        verified_value_count: Math.floor(this.completenessScore * 0.8),
        verified_none_count: Math.floor(this.completenessScore * 0.1),
        not_applicable_count: 2,
        conflicting_count: 0,
        insufficient_count: Math.max(0, 10 - Math.floor(this.completenessScore / 10)),
        in_progress_count: Math.max(0, 100 - this.completenessScore)
      },
      missing_categories: this.completenessScore >= 100 ? [] : this.missingCategories,
      last_updated_at: new Date().toISOString()
    };
  }
}

// ============================================================================
// LEVEL PRIME (FEDERAL, STATE LEGISLATIVE, COUNTY, LOCAL/MUNICIPAL)
// ============================================================================
export class LevelPrime {
  public levelId: GovernmentLevelCategory;
  public levelName: string;
  private seatControllers: Map<string, SeatController> = new Map();

  constructor(levelId: GovernmentLevelCategory, levelName: string) {
    this.levelId = levelId;
    this.levelName = levelName;
  }

  public registerSeatController(controller: SeatController) {
    this.seatControllers.set(controller.seatUuid, controller);
  }

  public getSeatController(seatUuid: string): SeatController | undefined {
    return this.seatControllers.get(seatUuid);
  }

  public getAllControllers(): SeatController[] {
    return Array.from(this.seatControllers.values());
  }

  public dispatchDirectiveToSeats(directive: DirectiveDownward) {
    if (directive.target_seat_uuid) {
      const target = this.seatControllers.get(directive.target_seat_uuid);
      if (target) target.receiveDirective(directive);
    } else {
      this.seatControllers.forEach(controller => controller.receiveDirective(directive));
    }
  }

  public generateUpwardReport(): LevelStatusReport {
    const seatReports = Array.from(this.seatControllers.values()).map(c => c.generateUpwardReport());
    
    let totalScore = 0;
    let inCollection = 0;
    let inSurge = 0;
    let inGeneral = 0;
    let inBaselineComplete = 0;
    let activeClones = 0;

    seatReports.forEach(r => {
      totalScore += r.completeness_score;
      activeClones += r.active_clone_count;
      if (r.lifecycle_stage === 'COLLECTION') inCollection++;
      if (r.lifecycle_stage === 'PRIMARY_SURGE') inSurge++;
      if (r.lifecycle_stage === 'GENERAL_ELECTION') inGeneral++;
      if (r.lifecycle_stage === 'BASELINE_COMPLETE' || r.lifecycle_stage === 'MONITORING') inBaselineComplete++;
    });

    const totalSeats = seatReports.length || 1;
    const avgScore = Number((totalScore / totalSeats).toFixed(1));

    const bottlenecks: string[] = [];
    if (inSurge > 5) bottlenecks.push(`High Surge Density: ${inSurge} seats undergoing active primary surge`);
    if (avgScore < 80) bottlenecks.push(`Category Gap: Campaign finance reconciliation pending for county/local seats`);

    return {
      level_id: this.levelId,
      level_name: this.levelName,
      total_seats_managed: seatReports.length,
      seats_in_collection: inCollection,
      seats_in_primary_surge: inSurge,
      seats_in_general_election: inGeneral,
      seats_baseline_complete: inBaselineComplete,
      average_completeness_percent: avgScore,
      total_active_agent_clones: activeClones,
      level_bottlenecks: bottlenecks,
      active_seat_reports: seatReports,
      report_timestamp: new Date().toISOString()
    };
  }
}

// ============================================================================
// FLORIDA PRIME (STATEWIDE ORCHESTRATOR FOR FLORIDA)
// ============================================================================
export class FloridaPrime {
  public stateCode: 'FL' = 'FL';
  public stateName: 'Florida' = 'Florida';

  public federalStatewidePrime: LevelPrime;
  public stateLegislativePrime: LevelPrime;
  public countyPrime: LevelPrime;
  public localMunicipalPrime: LevelPrime;

  constructor() {
    this.federalStatewidePrime = new LevelPrime('FEDERAL_STATEWIDE', 'Florida Federal & Statewide Prime');
    this.stateLegislativePrime = new LevelPrime('STATE_LEGISLATIVE', 'Florida State Legislative Prime');
    this.countyPrime = new LevelPrime('COUNTY', 'Florida County Level Prime');
    this.localMunicipalPrime = new LevelPrime('LOCAL_MUNICIPAL', 'Florida Local & Municipal Level Prime');
  }

  public getLevelPrime(level: GovernmentLevelCategory): LevelPrime {
    switch (level) {
      case 'FEDERAL_STATEWIDE': return this.federalStatewidePrime;
      case 'STATE_LEGISLATIVE': return this.stateLegislativePrime;
      case 'COUNTY': return this.countyPrime;
      case 'LOCAL_MUNICIPAL': return this.localMunicipalPrime;
    }
  }

  public registerSeatController(controller: SeatController) {
    const levelPrime = this.getLevelPrime(controller.level);
    levelPrime.registerSeatController(controller);
  }

  public dispatchDirective(directive: DirectiveDownward) {
    if (directive.target_level) {
      const levelPrime = this.getLevelPrime(directive.target_level);
      levelPrime.dispatchDirectiveToSeats(directive);
    } else {
      this.federalStatewidePrime.dispatchDirectiveToSeats(directive);
      this.stateLegislativePrime.dispatchDirectiveToSeats(directive);
      this.countyPrime.dispatchDirectiveToSeats(directive);
      this.localMunicipalPrime.dispatchDirectiveToSeats(directive);
    }
  }

  public generateUpwardReport(): FloridaPrimeStatusReport {
    const fedReport = this.federalStatewidePrime.generateUpwardReport();
    const legReport = this.stateLegislativePrime.generateUpwardReport();
    const countyReport = this.countyPrime.generateUpwardReport();
    const localReport = this.localMunicipalPrime.generateUpwardReport();

    const allReports = [fedReport, legReport, countyReport, localReport];
    const totalSeats = allReports.reduce((acc, r) => acc + r.total_seats_managed, 0) || 1;
    const avgScore = Number((allReports.reduce((acc, r) => acc + (r.average_completeness_percent * r.total_seats_managed), 0) / totalSeats).toFixed(1));
    const activeSurges = allReports.reduce((acc, r) => acc + r.seats_in_primary_surge, 0);
    const totalClones = allReports.reduce((acc, r) => acc + r.total_active_agent_clones, 0);

    const prioritySeats: { seat_uuid: string; title: string; completeness: number; stage: SeatLifecycleStage }[] = [];
    allReports.forEach(lvl => {
      lvl.active_seat_reports.forEach(seat => {
        if (seat.lifecycle_stage === 'PRIMARY_SURGE' || seat.completeness_score < 90) {
          prioritySeats.push({
            seat_uuid: seat.seat_uuid,
            title: seat.seat_title,
            completeness: seat.completeness_score,
            stage: seat.lifecycle_stage
          });
        }
      });
    });

    return {
      state_code: 'FL',
      state_name: 'Florida',
      total_seats_tracked: 22450, // 2,450 South FL + 20,000 Rest of FL
      overall_completeness_percent: avgScore,
      active_primary_surges_count: activeSurges,
      total_active_agent_clones: totalClones,
      level_summaries: {
        FEDERAL_STATEWIDE: fedReport,
        STATE_LEGISLATIVE: legReport,
        COUNTY: countyReport,
        LOCAL_MUNICIPAL: localReport
      },
      top_priority_seats: prioritySeats.slice(0, 10),
      report_timestamp: new Date().toISOString()
    };
  }
}

// ============================================================================
// MAIN HERMES PRIME (TOP LEVEL GLOBAL ORCHESTRATOR)
// ============================================================================
export class MainHermesPrime {
  public floridaPrime: FloridaPrime;
  private directivesHistory: DirectiveDownward[] = [];

  constructor() {
    this.floridaPrime = new FloridaPrime();
    this.seedDefaultFloridaHierarchy();
  }

  // Pre-seed core South Florida seats into SeatControllers
  private seedDefaultFloridaHierarchy() {
    const defaultSeats = [
      { uuid: 'seat_fl_gov_01', title: 'Governor of Florida', level: 'FEDERAL_STATEWIDE' as GovernmentLevelCategory, jurisdiction: 'State of Florida', type: 'EXECUTIVE_STATE' as OfficeTypeTemplate },
      { uuid: 'seat_fl_senate_01', title: 'U.S. Senator - Florida (Seat A)', level: 'FEDERAL_STATEWIDE' as GovernmentLevelCategory, jurisdiction: 'State of Florida', type: 'FEDERAL_SENATE' as OfficeTypeTemplate },
      { uuid: 'seat_miamidade_mayor_01', title: 'Mayor of Miami-Dade County', level: 'COUNTY' as GovernmentLevelCategory, jurisdiction: 'Miami-Dade County', type: 'EXECUTIVE_COUNTY' as OfficeTypeTemplate },
      { uuid: 'seat_broward_mayor_01', title: 'Mayor of Broward County', level: 'COUNTY' as GovernmentLevelCategory, jurisdiction: 'Broward County', type: 'EXECUTIVE_COUNTY' as OfficeTypeTemplate },
      { uuid: 'seat_fl_house_115', title: 'Florida House Representative District 115', level: 'STATE_LEGISLATIVE' as GovernmentLevelCategory, jurisdiction: 'State of Florida', type: 'STATE_LEGISLATOR' as OfficeTypeTemplate },
      { uuid: 'seat_miami_mayor_01', title: 'Mayor of City of Miami', level: 'LOCAL_MUNICIPAL' as GovernmentLevelCategory, jurisdiction: 'City of Miami', type: 'EXECUTIVE_MUNICIPAL' as OfficeTypeTemplate }
    ];

    defaultSeats.forEach(s => {
      const controller = new SeatController({
        seatUuid: s.uuid,
        seatTitle: s.title,
        level: s.level,
        jurisdiction: s.jurisdiction,
        officeType: s.type
      });
      controller.setCompleteness(100);
      controller.incrementEvidence(150);
      this.floridaPrime.registerSeatController(controller);
    });
  }

  public issueDirective(params: {
    targetLevel?: GovernmentLevelCategory;
    targetSeatUuid?: string;
    priorityWeight: number;
    allocatedWorkerBudget?: number;
    lifecycleCommand?: 'ADVANCE_TO_SURGE' | 'NARROW_FIELD' | 'PROMOTE_WINNER' | 'SWITCH_TO_MONITORING';
    notes?: string;
  }): DirectiveDownward {
    const directive: DirectiveDownward = {
      directive_id: `directive_${Math.random().toString(36).substring(2, 9)}`,
      source_prime: 'MAIN_PRIME',
      target_level: params.targetLevel,
      target_seat_uuid: params.targetSeatUuid,
      priority_weight: params.priorityWeight,
      allocated_worker_budget: params.allocatedWorkerBudget,
      lifecycle_command: params.lifecycleCommand,
      issued_at: new Date().toISOString(),
      notes: params.notes
    };

    this.directivesHistory.unshift(directive);
    this.floridaPrime.dispatchDirective(directive);
    return directive;
  }

  public getGlobalStatusReport() {
    const flStatus = this.floridaPrime.generateUpwardReport();
    return {
      main_prime_status: 'H0_MAIN_PRIME_ACTIVE',
      timestamp: new Date().toISOString(),
      orchestration_hierarchy: {
        top_level: 'Main HERMES Prime (H0)',
        state_level: 'Florida Prime',
        level_primes: [
          'Federal/Statewide Level Prime',
          'State Legislative Level Prime',
          'County Level Prime',
          'Local/Municipal Level Prime'
        ],
        sub_primes: 'Seat Controller (1 per active Seat)'
      },
      florida_prime_summary: flStatus,
      directives_history_count: this.directivesHistory.length
    };
  }
}

export const mainHermesPrime = new MainHermesPrime();
export const floridaPrime = mainHermesPrime.floridaPrime;
