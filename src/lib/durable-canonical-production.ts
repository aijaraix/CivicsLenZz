import { createHash } from 'node:crypto';
import { assertCanonicalEnvelope } from './canonical-canary-envelope';
import { hermesBridgeClient } from './hermes-bridge-client';
import { getProducerPersistence, getRawObjectStore } from './producer-storage/index';
import type { ProducerPersistence, RawObjectStore } from './producer-storage/index';
import type { PersistentHermesJob } from './hermes-backend-store';
import type { AdapterParseResult } from './source-adapters';
import type { ResearchIngestEnvelope } from './canonical-ingest-v1/types';

export const CONTROLLED_CAPABILITY = 'advance_research_harvest';
export const CONTROLLED_SCOPE = 'FL_DOS_CANDIDATE_FILINGS';
export const CONTROLLED_PRODUCER = 'civicslenzz-gemini-harvester';
export const CONTROLLED_SOURCE = 'fl_dos_elections';
export const CONTROLLED_JOB_TYPE = 'INGEST_CANDIDATE_FILINGS';
export const CONTROLLED_AGENT = 'H1';

export type DurableInboundResult = {
  valid: boolean;
  is_new: boolean;
  job?: PersistentHermesJob;
  error_code?: string;
  error?: string;
};

type Bridge = {
  validateInboundEnvelope(input: unknown): { valid: boolean; code?: string; error?: string };
  normalizeInboundEnvelope(input: any): any;
  registerCanonicalEnvelopeDurable(input: ResearchIngestEnvelope, maxAttempts?: number): Promise<any>;
};

type InboundDeps = { persistence?: ProducerPersistence; bridge?: Bridge };

type ResultDeps = { persistence?: ProducerPersistence; rawStore?: RawObjectStore; bridge?: Bridge };

function fail(error_code: string, error: string): DurableInboundResult {
  return { valid: false, is_new: false, error_code, error };
}

function strictInbound(raw: any, bridge: Bridge): DurableInboundResult | null {
  const base = bridge.validateInboundEnvelope(raw);
  if (!base.valid) return fail(base.code || 'INVALID_ENVELOPE', base.error || 'Invalid HERMES envelope');
  if (raw?.contract_version !== 'HERMES_RESEARCH_JOB_V1') return fail('CONTRACT_VERSION_REQUIRED', 'Exact HERMES_RESEARCH_JOB_V1 is required');
  if (raw?.producer_target !== CONTROLLED_PRODUCER) return fail('PRODUCER_TARGET_REJECTED', 'First production cohort requires the exact registered producer target');
  if (raw?.capability !== CONTROLLED_CAPABILITY) return fail('CAPABILITY_REJECTED', 'Capability is outside the controlled producer cohort');
  if (raw?.research_scope !== CONTROLLED_SCOPE) return fail('RESEARCH_SCOPE_REJECTED', 'Research scope is outside the controlled producer cohort');
  if (raw?.jurisdiction !== 'jurisdiction_us_fl' && raw?.research_work_identity?.jurisdiction_key !== 'jurisdiction_us_fl') return fail('JURISDICTION_REJECTED', 'Controlled cohort is Florida only');
  if (typeof raw?.job_id !== 'string' || raw.job_id.length < 8) return fail('JOB_ID_REQUIRED', 'Canonical job identity is required');
  const work = raw?.research_work_identity?.work_key;
  if (typeof work !== 'string' || !(/^[a-f0-9]{64}$/.test(work) || /^work:v1:[a-f0-9]{64}$/.test(work))) return fail('WORK_IDENTITY_REQUIRED', 'Canonical ResearchWorkIdentity is required');
  if (typeof raw?.research_reservation_id !== 'string' || raw.research_reservation_id.length < 8) return fail('RESERVATION_REQUIRED', 'Canonical research reservation identity is required');
  if (raw?.attempt !== 1) return fail('ATTEMPT_REJECTED', 'Initial controlled cohort accepts only attempt 1');
  if (!Array.isArray(raw?.source_constraints) || raw.source_constraints.length < 1) return fail('SOURCE_CONSTRAINT_REQUIRED', 'Controlled cohort requires explicit source constraints');
  const allowed = new Set(['dos.elections.myflorida.com', 'https://dos.elections.myflorida.com/candidates/CanList.asp']);
  if (!raw.source_constraints.every((item: unknown) => typeof item === 'string' && allowed.has(item))) return fail('SOURCE_CONSTRAINT_REJECTED', 'Only the proven Florida DOS candidate-filings source is allowed');
  return null;
}

export async function submitDurableHermesJob(rawEnvelope: any, deps: InboundDeps = {}): Promise<DurableInboundResult> {
  const persistence = deps.persistence ?? getProducerPersistence();
  const bridge = deps.bridge ?? hermesBridgeClient;
  const rejected = strictInbound(rawEnvelope, bridge);
  if (rejected) return rejected;
  const envelope = bridge.normalizeInboundEnvelope(rawEnvelope);
  const workKey = envelope.research_work_identity.work_key as string;
  const logicalWorkKey = `canonical:${workKey}`;
  const existing = await persistence.findJobByLogicalKey(logicalWorkKey);
  if (existing) return { valid: true, is_new: false, job: existing };
  const checkpoint = {
    canonical_assignment: {
      contract_version: 'HERMES_RESEARCH_JOB_V1',
      canonical_job_id: envelope.job_id,
      research_work_identity: envelope.research_work_identity,
      research_reservation_id: envelope.research_reservation_id,
      producer_target: envelope.producer_target,
      capability: envelope.capability,
      cohort: envelope.cohort,
      jurisdiction: envelope.jurisdiction,
      seat_key: envelope.seat_key ?? null,
      research_scope: envelope.research_scope,
      source_constraints: envelope.source_constraints,
      dataset_period: envelope.dataset_period ?? null,
      trace_id: envelope.trace_id ?? null,
      correlation_id: envelope.correlation_id ?? null,
      canonical_attempt: envelope.attempt,
      canonical_created_at: envelope.created_at,
      producer_source_id: CONTROLLED_SOURCE,
    },
  };
  const job = await persistence.createJob({
    agent_id: CONTROLLED_AGENT,
    job_type: CONTROLLED_JOB_TYPE,
    logical_work_key: logicalWorkKey,
    seat_uuid: envelope.seat_key,
    source_uuid: CONTROLLED_SOURCE,
    priority: Math.max(1, Math.min(10, Number(envelope.priority) || 1)),
    max_attempts: 1,
    checkpoint,
    status: 'QUEUED',
  });
  return { valid: true, is_new: job.logical_work_key === logicalWorkKey, job };
}

function assignmentFor(job: PersistentHermesJob): any | null {
  const assignment = (job.checkpoint as any)?.canonical_assignment;
  return assignment && assignment.contract_version === 'HERMES_RESEARCH_JOB_V1' ? assignment : null;
}

export async function buildCanonicalResultEnvelope(
  job: PersistentHermesJob,
  parsed: AdapterParseResult,
  deps: Omit<ResultDeps, 'bridge'> = {},
): Promise<ResearchIngestEnvelope | null> {
  const assignment = assignmentFor(job);
  if (!assignment) return null;
  if (job.job_type !== CONTROLLED_JOB_TYPE || job.agent_id !== CONTROLLED_AGENT || job.source_uuid !== CONTROLLED_SOURCE) throw new Error('CANONICAL_ASSIGNMENT_RUNTIME_MISMATCH');
  if (assignment.capability !== CONTROLLED_CAPABILITY || assignment.research_scope !== CONTROLLED_SCOPE || assignment.producer_source_id !== CONTROLLED_SOURCE) throw new Error('CANONICAL_ASSIGNMENT_SCOPE_MISMATCH');
  if (!parsed.success || parsed.source_id !== CONTROLLED_SOURCE || !parsed.raw_snapshot_uuid || parsed.evidence_objects.length < 1) throw new Error('CANONICAL_RESULT_REQUIRES_REAL_EVIDENCE');

  const persistence = deps.persistence ?? getProducerPersistence();
  const rawStore = deps.rawStore ?? getRawObjectStore();
  const snapshot = await persistence.getRawSnapshot(parsed.raw_snapshot_uuid);
  if (!snapshot || snapshot.provenance_classification !== 'REAL_PROVEN' || snapshot.http_status !== 200 || snapshot.challenge_reason || snapshot.failure_class || !snapshot.object_locator) throw new Error('CANONICAL_RESULT_SNAPSHOT_NOT_REAL_PROVEN');
  const stored = await rawStore.getObject(snapshot.object_locator);
  if (!stored) throw new Error('CANONICAL_RESULT_RAW_OBJECT_MISSING');
  const digest = createHash('sha256').update(stored.bytes).digest('hex');
  if (digest !== snapshot.payload_sha256 || stored.sha256 !== digest || stored.bytes.length !== snapshot.byte_length) throw new Error('CANONICAL_RESULT_RAW_OBJECT_INTEGRITY_MISMATCH');
  for (const evidence of parsed.evidence_objects) {
    if (evidence.raw_snapshot_uuid !== snapshot.snapshot_uuid || evidence.retrieval_content_sha256 !== digest || evidence.provenance_classification !== 'REAL_PROVEN' || evidence.verification_state !== 'EXTRACTED_UNREVIEWED' || evidence.source_uuid !== snapshot.source_uuid) throw new Error('CANONICAL_RESULT_EVIDENCE_LINEAGE_MISMATCH');
  }
  const firstEvidence = parsed.evidence_objects[0];
  const locator = JSON.stringify({
    object_locator: snapshot.object_locator,
    snapshot_uuid: snapshot.snapshot_uuid,
    producer_job_uuid: job.job_uuid,
    source_uuid: snapshot.source_uuid,
    supporting_locator: firstEvidence.supporting_locator ?? null,
    provenance_classification: firstEvidence.provenance_classification,
  });
  const envelope: ResearchIngestEnvelope = {
    contract_version: 'CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1',
    producer: {
      producer_id: CONTROLLED_PRODUCER,
      producer_version: '2.2.0-HERMES-BRIDGE',
      execution_id: job.job_uuid,
    },
    job: {
      job_id: assignment.canonical_job_id,
      research_work_identity: assignment.research_work_identity.work_key,
    },
    extraction_status: 'extracted_unreviewed',
    capability: CONTROLLED_CAPABILITY,
    cohort: {
      cohort_key: assignment.cohort || 'FLORIDA_CONTROLLED_INITIAL',
      state: 'CONTROLLED_PRODUCTION',
      assignment_id: assignment.research_reservation_id,
    },
    sources: [{
      source_key: CONTROLLED_SOURCE,
      source_name: 'Florida Division of Elections',
      source_url: snapshot.target_url,
      authority_tier: 'TIER_A',
    }],
    retrievals: [{
      source_key: CONTROLLED_SOURCE,
      source_url: snapshot.target_url,
      retrieved_at: snapshot.retrieved_at,
      content_hash: digest,
      mime_type: snapshot.content_type,
      byte_length: stored.bytes.length,
      method: firstEvidence.extraction_method,
      parser_version: snapshot.parser_version,
    }],
    evidence: [{
      evidence_key: firstEvidence.evidence_uuid,
      source_url: snapshot.target_url,
      retrieved_at: snapshot.retrieved_at,
      mime_type: snapshot.content_type,
      byte_length: stored.bytes.length,
      sha256: digest,
      content_base64: stored.bytes.toString('base64'),
      method: firstEvidence.extraction_method,
      parser_version: firstEvidence.parser_version,
      locator,
    }],
    entities: {
      jurisdiction_candidates: [], seat_candidates: [], person_candidates: [], occupancy_candidates: [],
      election_candidates: [], candidate_campaign_candidates: [],
    },
    claims: [], relationships: [], dataset_units: [], gis_boundaries: [], warnings: [],
    gaps: ['CANONICAL_ENTITY_MAPPING_REQUIRED'],
    currentness: { current_as_of: snapshot.retrieved_at },
    monitoring_recommendations: [],
  };
  return assertCanonicalEnvelope(envelope);
}

export async function stageCanonicalResultForCompletedJob(
  job: PersistentHermesJob,
  parsed: AdapterParseResult,
  deps: ResultDeps = {},
): Promise<{ state: string; envelope?: ResearchIngestEnvelope; submission?: any }> {
  const envelope = await buildCanonicalResultEnvelope(job, parsed, deps);
  if (!envelope) return { state: 'NOT_CANONICAL_ASSIGNED' };
  const bridge = deps.bridge ?? hermesBridgeClient;
  const submission = await bridge.registerCanonicalEnvelopeDurable(envelope, 1);
  return { state: submission.delivery_state || 'RESULT_DURABLY_STAGED', envelope, submission };
}
