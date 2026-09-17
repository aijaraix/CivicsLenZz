/**
 * CIVICSLENZZ PRODUCER PERSISTENCE INTERFACE
 * 
 * Formal interface separating the durable production PostgreSQL + GCS
 * storage engine from local development / test harness mocks.
 * 
 * Enforces:
 * - Single authoritative persistence path
 * - Acid transactions and row locking
 * - Exact attempt identity mapping
 * - Fail-closed provenance and health defaults
 * - Logical work idempotency
 */

import {
  PersistentHermesJob,
  HermesWorkerLease,
  HermesJobAttempt,
  HermesCheckpoint,
  SourceRegistryEntry,
  RawSourceSnapshot,
  RawEvidenceObject,
  ResearchContractStatus,
  SeatCoverageStatusRecord,
  PersonCoverageStatusRecord,
  DeadLetterJobRecord,
  MonitoringEventRecord,
  DurableGapRecord,
  DurableAcademyObservationRecord,
  DurableAcademyCaseRecord,
  DurableAutonomousProofRecord,
  DurableMonitoringProofRecord,
  JobStatus
} from '../hermes-backend-store';
import { ResultSubmissionRecord } from '../hermes-bridge-client';
import { ResearchIngestPackage } from '../hermes-bridge-types';

export interface StorageHealthInfo {
  storageMode: string;
  postgresConfigured: boolean;
  postgresConnected: boolean;
  postgresSchemaReady: boolean;
  rawObjectStorageConfigured: boolean;
  rawObjectStorageConnected: boolean;
  localFallbackEnabled: boolean;
  daemonActive: boolean;
  error?: string;
}

export interface ClaimLeaseResult {
  job: PersistentHermesJob;
  lease: HermesWorkerLease;
  attempt: HermesJobAttempt;
}

export interface ProducerPersistence {
  // Initialization & Health
  initialize(): Promise<void>;
  checkHealth(): Promise<StorageHealthInfo>;
  isFailClosed(): boolean;

  // Jobs
  createJob(jobData: {
    agent_id: string;
    job_type: string;
    logical_work_key?: string;
    seat_uuid?: string;
    person_uuid?: string;
    race_uuid?: string;
    campaign_uuid?: string;
    source_uuid?: string;
    priority?: number;
    max_attempts?: number;
    available_at?: string;
    checkpoint?: any;
    status?: JobStatus;
  }): Promise<PersistentHermesJob>;

  findJobByLogicalKey(logicalWorkKey: string): Promise<PersistentHermesJob | null>;
  getJob(jobUuid: string): Promise<PersistentHermesJob | null>;
  getAllJobs(): Promise<PersistentHermesJob[]>;
  getQueuedJobsCount(): Promise<number>;

  // Atomic Leasing with Exact Attempt Tracking
  claimAtomicLease(
    agentId: string,
    workerInstance: string,
    leaseDurationSec?: number,
    logicalWorkPrefix?: string
  ): Promise<ClaimLeaseResult | null>;

  getJobAttempts(jobUuid?: string): Promise<HermesJobAttempt[]>;

  heartbeatLease(leaseUuid: string, extendSeconds?: number): Promise<boolean>;
  completeJob(jobUuid: string, attemptUuid: string, recordsExtracted?: number): Promise<void>;
  failJob(
    jobUuid: string,
    attemptUuid: string,
    errorMessage: string,
    retryable?: boolean,
    httpStatus?: number
  ): Promise<void>;
  expireLeasesWatchdog(): Promise<number>;

  // Checkpoints
  saveCheckpoint(checkpoint: {
    job_uuid: string;
    step_name: string;
    records_processed: number;
    last_processed_id?: string;
    state_data: Record<string, any>;
  }): Promise<HermesCheckpoint>;
  getCheckpoints(jobUuid: string): Promise<HermesCheckpoint[]>;

  // Raw Snapshots & Exact Bytes
  saveRawSnapshot(snapshot: any): Promise<RawSourceSnapshot>;
  getRawSnapshot(snapshotUuid: string): Promise<RawSourceSnapshot | null>;
  getAllRawSnapshots(): Promise<RawSourceSnapshot[]>;

  // Evidence Objects
  saveEvidenceObjects(evidenceList: any[]): Promise<RawEvidenceObject[]>;
  getAllEvidenceObjects(): Promise<RawEvidenceObject[]>;
  getEvidenceForSeat(seatUuid: string): Promise<RawEvidenceObject[]>;

  // Source Registry
  getSourceRegistry(): Promise<SourceRegistryEntry[]>;
  updateSourceStatus(sourceId: string, status: string, error?: string): Promise<void>;

  // Coverage Status (Seat & Person)
  getSeatCoverageRecords(): Promise<SeatCoverageStatusRecord[]>;
  updateSeatCoverageRecord(seatUuid: string, updates: Partial<SeatCoverageStatusRecord>): Promise<void>;
  getPersonCoverageRecords(): Promise<PersonCoverageStatusRecord[]>;

  // Dead Letter Queue
  getDeadLetterJobs(): Promise<DeadLetterJobRecord[]>;

  // Monitoring Events & Gaps
  recordMonitoringEvent(event: Omit<MonitoringEventRecord, 'event_uuid'>): Promise<MonitoringEventRecord>;
  getMonitoringEvents(): Promise<MonitoringEventRecord[]>;
  getDurableGaps(): Promise<DurableGapRecord[]>;
  createDurableGap(gap: Omit<DurableGapRecord, 'gap_id' | 'created_at'>): Promise<DurableGapRecord>;
  updateDurableGap(gapId: string, updates: Partial<DurableGapRecord>): Promise<DurableGapRecord | null>;

  // Academy Observations & Cases
  recordAcademyObservation(obs: Omit<DurableAcademyObservationRecord, 'observation_id' | 'created_at'>): Promise<DurableAcademyObservationRecord>;
  getAcademyObservations(): Promise<DurableAcademyObservationRecord[]>;
  recordAcademyCase(caseRecord: Omit<DurableAcademyCaseRecord, 'case_id' | 'created_at'>): Promise<DurableAcademyCaseRecord>;
  getAcademyCases(): Promise<DurableAcademyCaseRecord[]>;
  updateAcademyCase(caseId: string, updates: Partial<DurableAcademyCaseRecord>): Promise<DurableAcademyCaseRecord | null>;

  // Proof Records
  recordAutonomousProof(proof: Omit<DurableAutonomousProofRecord, 'proof_uuid' | 'proven_at'>): Promise<DurableAutonomousProofRecord>;
  getAutonomousProofRecords(): Promise<DurableAutonomousProofRecord[]>;
  recordMonitoringProof(proof: Omit<DurableMonitoringProofRecord, 'proof_uuid' | 'proven_at'>): Promise<DurableMonitoringProofRecord>;
  getMonitoringProofRecords(): Promise<DurableMonitoringProofRecord[]>;

  // Bridge Submissions
  getBridgeSubmission(jobId: string): Promise<ResultSubmissionRecord | null>;
  getAllBridgeSubmissions(): Promise<ResultSubmissionRecord[]>;
  getBridgeResultPackage(jobId: string): Promise<ResearchIngestPackage | null>;
  upsertBridgeSubmission(submission: ResultSubmissionRecord, resultPackage?: ResearchIngestPackage): Promise<void>;

  // Reconciliation & Summaries
  getEntityCounts(): Promise<Record<string, number>>;
  getDatabaseSummary(): Promise<Record<string, any>>;
}
