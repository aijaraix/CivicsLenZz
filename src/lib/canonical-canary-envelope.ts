import { createHash } from 'node:crypto';
import { validateResearchIngestEnvelope } from './canonical-ingest-v1/contract.ts';

export function assertCanonicalEnvelope(input: unknown) {
  const result = validateResearchIngestEnvelope(input);
  if (result.ok === false) throw new Error(`Canonical V1 schema rejection: ${result.errors.join('; ')}`);
  return result.envelope;
}

/** Repackage retained, independently re-read evidence. No retrieval or civic inference. */
export function buildRetainedCanaryEnvelope(prior: any, snapshot: any, evidence: any, bytes: Buffer, correlation: string) {
  if (!/^[0-9a-f-]{36}$/i.test(correlation) || correlation === prior.producer?.execution_id) throw new Error('New correlation UUID required');
  if (prior.producer?.producer_id !== 'civicslenzz-gemini-harvester' || prior.extraction_status !== 'extracted_unreviewed') throw new Error('Producer classification mismatch');
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (snapshot.provenance_classification !== 'REAL_PROVEN' || evidence.provenance_classification !== 'REAL_PROVEN' || snapshot.http_status !== 200 || snapshot.challenge_reason || snapshot.failure_class) throw new Error('Evidence is not clean REAL_PROVEN');
  if (snapshot.byte_length !== bytes.length || snapshot.payload_sha256 !== hash || evidence.retrieval_content_sha256 !== hash || evidence.raw_snapshot_uuid !== snapshot.snapshot_uuid || evidence.source_uuid !== snapshot.source_uuid || evidence.source_url !== snapshot.target_url) throw new Error('Retained evidence lineage/integrity mismatch');
  if (!snapshot.object_locator?.startsWith('r2://') || !snapshot.object_locator.endsWith(`/${snapshot.snapshot_uuid}.raw`)) throw new Error('Durable R2 locator required');
  if (prior.retrievals?.length !== 1 || prior.evidence?.length !== 1 || prior.evidence[0].evidence_key !== evidence.evidence_uuid || prior.retrievals[0].source_url !== snapshot.target_url) throw new Error('Prior package evidence mismatch');
  const envelope = {
    contract_version: prior.contract_version,
    producer: { producer_id: prior.producer.producer_id, producer_version: prior.producer.producer_version, execution_id: correlation },
    job: { job_id: `canary_job_${correlation}`, research_work_identity: prior.job.research_work_identity },
    extraction_status: 'extracted_unreviewed', capability: prior.capability, cohort: prior.cohort,
    sources: prior.sources,
    retrievals: [{ source_key: prior.retrievals[0].source_key, source_url: snapshot.target_url, retrieved_at: snapshot.retrieved_at, content_hash: hash, mime_type: snapshot.content_type, byte_length: bytes.length, method: evidence.extraction_method, parser_version: snapshot.parser_version }],
    evidence: [{ evidence_key: evidence.evidence_uuid, source_url: evidence.source_url, retrieved_at: evidence.retrieved_at, mime_type: snapshot.content_type, byte_length: bytes.length, sha256: hash, content_base64: bytes.toString('base64'), method: evidence.extraction_method, parser_version: evidence.parser_version,
      // V1's opaque locator preserves snapshot/artifact and extraction provenance without schema extension.
      locator: JSON.stringify({ object_locator: snapshot.object_locator, snapshot_uuid: snapshot.snapshot_uuid, previous_job_id: prior.job.job_id, previous_execution_id: prior.producer.execution_id, source_uuid: snapshot.source_uuid, supporting_locator: evidence.supporting_locator, field_key: evidence.field_key, extracted_value: evidence.extracted_value, provenance_classification: evidence.provenance_classification, http_status: snapshot.http_status, charset: snapshot.charset }) }],
    entities: { jurisdiction_candidates: [], seat_candidates: [], person_candidates: [], occupancy_candidates: [], election_candidates: [], candidate_campaign_candidates: [] },
    claims: [], relationships: [], dataset_units: [], gis_boundaries: [], warnings: [], gaps: [],
    currentness: { current_as_of: snapshot.retrieved_at }, monitoring_recommendations: []
  };
  return assertCanonicalEnvelope(envelope);
}

export async function reserveCanaryAttempt(database: { query: (...args: any[]) => Promise<any> }, envelope: ReturnType<typeof assertCanonicalEnvelope>, body: Buffer) {
  const submission = `sub_${envelope.producer.execution_id}`;
  const inserted = await database.query(`INSERT INTO bridge_submissions
    (submission_id,job_id,idempotency_key,delivery_state,attempts,max_attempts,last_attempt_at,result_package,created_at,updated_at)
    VALUES ($1,$2,$3,'SUBMITTING',1,1,NOW(),$4,NOW(),NOW()) ON CONFLICT DO NOTHING RETURNING submission_id`,
    [submission, envelope.job.job_id, createHash('sha256').update(body).digest('hex'), JSON.stringify(envelope)]);
  if (inserted.rowCount !== 1) throw new Error('Attempt already reserved; no resend permitted');
  return submission;
}
