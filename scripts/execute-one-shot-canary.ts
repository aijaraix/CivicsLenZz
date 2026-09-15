import crypto from "crypto";
import { pool } from "../src/db/index.ts";
import { R2RawObjectStore } from "../src/lib/producer-storage/r2-raw-object-store.ts";
import { hermesBridgeClient } from "../src/lib/hermes-bridge-client.ts";

interface CanaryExecutionReport {
  producerGitSha: string;
  producerDeployedRevision: string;
  selectedResearchResultId: string;
  selectedRetrievalObjectKey: string;
  r2Sha256Digest: string;
  r2ByteLength: number;
  preNetworkPostgresPersistStatus: string;
  canonicalGatewayHttpStatus: number;
  canonicalIngestReceiptOrCorrelationId: string;
  canonicalAcknowledgmentState: string;
  canonicalIngestionDecision: string;
  finalDeliveryStateInProducerStorage: string;
  rawGatewayResponse?: any;
}

async function runOneShotCanary(): Promise<void> {
  console.log("=== CIVICSLENZZ ONE-SHOT INTEROPERABILITY CANARY STARTING ===");

  const PRODUCER_GIT_SHA = process.env.CIVICSLENZZ_GIT_SHA || "7ea49d6a45e8f6f5d1c8f89ad5a45c9bf037be4e";
  const PRODUCER_DEPLOYED_REVISION = process.env.K_REVISION || "ais-dev-fwsoxq7rqzqudtausrkgsl-00003-9z5";
  const TARGET_URL = "https://ingest.civicslenz.com/v1/harvester/results";

  const PRODUCER_ID = "civicslenzz-gemini-harvester";
  const EXECUTION_ID = "552d2f69-5abf-4a03-8481-79af5cef7b83";
  const CAPABILITY = "advance_research_harvest";
  const EXTRACTION_STATUS = "extracted_unreviewed";
  const AUTHORIZATION_ID = "3a4da59f-6ab9-4ea5-8692-d1c3ec4178e7";
  const AUTHORIZATION_EXPIRES = "2026-09-15T07:28:15.725Z";

  // 1. Select existing real retained research result from producer durable storage
  const SNAPSHOT_UUID = "686ece9a-5cf4-4130-9715-15ec66dfd47b";
  const EVIDENCE_UUID = "23463759-119c-4b6b-aac7-38a8f6641eac";
  const OBJECT_KEY = `artifacts/retrievals/${SNAPSHOT_UUID}.raw`;

  console.log(`[Step 1] Querying PostgreSQL for snapshot ${SNAPSHOT_UUID} and evidence ${EVIDENCE_UUID}...`);
  const snapRes = await pool.query(
    "SELECT * FROM raw_source_snapshots WHERE snapshot_uuid = $1",
    [SNAPSHOT_UUID]
  );
  if (snapRes.rows.length === 0) {
    throw new Error(`Snapshot ${SNAPSHOT_UUID} not found in PostgreSQL raw_source_snapshots`);
  }
  const snapRow = snapRes.rows[0];

  const evRes = await pool.query(
    "SELECT * FROM raw_evidence_objects WHERE evidence_uuid = $1",
    [EVIDENCE_UUID]
  );
  if (evRes.rows.length === 0) {
    throw new Error(`Evidence ${EVIDENCE_UUID} not found in PostgreSQL raw_evidence_objects`);
  }
  const evRow = evRes.rows[0];

  console.log(`[Step 1 Verified] Found snapshot: URL=${snapRow.target_url}, bytes=${snapRow.byte_length}, sha=${snapRow.payload_sha256}`);
  console.log(`[Step 1 Verified] Found evidence: title=${evRow.document_title}, classification=${evRow.provenance_classification}`);

  // 2. Verify actual PostgreSQL metadata and R2 object (byte length and SHA-256)
  console.log(`[Step 2] Reading R2 object ${OBJECT_KEY}...`);
  const r2Store = new R2RawObjectStore();
  const r2Obj = await r2Store.getObject(OBJECT_KEY);

  const computedR2Sha = crypto.createHash("sha256").update(r2Obj.bytes).digest("hex");
  console.log(`[Step 2] R2 Object: Length=${r2Obj.bytes.length}, SHA256=${computedR2Sha}`);

  if (r2Obj.bytes.length !== snapRow.byte_length) {
    throw new Error(`Byte length mismatch: R2=${r2Obj.bytes.length} vs PG=${snapRow.byte_length}`);
  }
  if (computedR2Sha !== snapRow.payload_sha256) {
    throw new Error(`SHA256 mismatch: R2=${computedR2Sha} vs PG=${snapRow.payload_sha256}`);
  }
  if (computedR2Sha !== evRow.retrieval_content_sha256) {
    throw new Error(`Evidence retrieval SHA256 mismatch: R2=${computedR2Sha} vs Evidence=${evRow.retrieval_content_sha256}`);
  }
  console.log("[Step 2 Verified] 100% byte-for-byte and SHA-256 integrity match between Postgres and R2.");

  // 3. Assemble the CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1 payload
  const jobId = `canary_job_${EXECUTION_ID}`;
  const researchWorkIdentity = "fl_dos_candidate_filing_canary";
  const idempotencyKey = crypto
    .createHash("sha256")
    .update(`${jobId}:${researchWorkIdentity}:${computedR2Sha}:CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1`)
    .digest("hex");

  const submissionId = `sub_${EXECUTION_ID}`;

  const ingestPackage = {
    contract_version: "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1",
    producer: {
      producer_id: PRODUCER_ID,
      producer_version: "2.2.0-HERMES-BRIDGE",
      execution_id: EXECUTION_ID,
      authorization_id: AUTHORIZATION_ID,
      authorization_expires: AUTHORIZATION_EXPIRES
    },
    job: {
      job_id: jobId,
      research_work_identity: researchWorkIdentity,
      execution_id: EXECUTION_ID,
      authorization_id: AUTHORIZATION_ID
    },
    authorization_id: AUTHORIZATION_ID,
    capability: CAPABILITY,
    extraction_status: EXTRACTION_STATUS,
    cohort: {
      cohort_key: "florida-elections",
      state: "HARVESTING"
    },
    sources: [
      {
        source_key: "fl_dos_elections",
        source_url: snapRow.target_url,
        source_name: "Florida Division of Elections",
        authority_tier: "OFFICIAL_STATE_ELECTIONS"
      }
    ],
    retrievals: [
      {
        source_key: "fl_dos_elections",
        source_url: snapRow.target_url,
        retrieved_at: snapRow.retrieved_at?.toISOString?.() || String(snapRow.retrieved_at),
        content_hash: computedR2Sha,
        mime_type: snapRow.content_type || "text/html",
        byte_length: r2Obj.bytes.length,
        method: "deterministic_fetch",
        parser_version: "2.2.0",
        raw_object_key: OBJECT_KEY,
        raw_artifact_reference: OBJECT_KEY,
        object_locator: `r2://${process.env.R2_BUCKET || "civicslenzz-producer-evidence"}/${OBJECT_KEY}`
      }
    ],
    evidence: [
      {
        evidence_key: EVIDENCE_UUID,
        source_url: evRow.source_url,
        retrieved_at: evRow.retrieved_at?.toISOString?.() || String(evRow.retrieved_at),
        mime_type: snapRow.content_type || "text/html",
        byte_length: r2Obj.bytes.length,
        sha256: computedR2Sha,
        content_base64: r2Obj.bytes.toString("base64"),
        method: "deterministic_fetch",
        parser_version: "2.2.0",
        raw_snapshot_uuid: SNAPSHOT_UUID,
        supporting_locator: evRow.supporting_locator || undefined,
        field_key: evRow.field_key || "CANDIDATE_FILING_RECORD",
        extracted_value: evRow.extracted_value ? JSON.parse(evRow.extracted_value) : undefined
      }
    ],
    entities: {
      jurisdiction_candidates: [
        {
          candidate_key: "jurisdiction_us_fl",
          attributes: { name: "State of Florida", fips: "12" },
          evidence_keys: [EVIDENCE_UUID]
        }
      ],
      seat_candidates: [],
      person_candidates: [],
      occupancy_candidates: [],
      election_candidates: [],
      candidate_campaign_candidates: []
    },
    claims: [],
    relationships: [],
    dataset_units: [],
    gis_boundaries: [],
    warnings: [],
    gaps: [],
    currentness: {
      current_as_of: snapRow.retrieved_at?.toISOString?.() || new Date().toISOString()
    },
    monitoring_recommendations: []
  };

  const rawBody = Buffer.from(JSON.stringify(ingestPackage), "utf8");

  // 4. Pre-network durable persistence in PostgreSQL
  console.log(`[Step 4] Pre-network durability write to bridge_submissions (submission_id=${submissionId})...`);
  const preNetworkState = "SUBMITTING";
  const now = new Date();

  await pool.query(
    `INSERT INTO bridge_submissions (
      submission_id, job_id, idempotency_key, delivery_state, attempts, max_attempts,
      last_attempt_at, result_package, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, 1, 1, $5, $6, $5, $5)
    ON CONFLICT (submission_id) DO UPDATE SET
      delivery_state = EXCLUDED.delivery_state,
      attempts = EXCLUDED.attempts,
      last_attempt_at = EXCLUDED.last_attempt_at,
      result_package = EXCLUDED.result_package,
      updated_at = EXCLUDED.updated_at`,
    [
      submissionId,
      jobId,
      idempotencyKey,
      preNetworkState,
      now,
      JSON.stringify(ingestPackage)
    ]
  );

  // Verify pre-network write
  const verifyPreRes = await pool.query(
    "SELECT submission_id, delivery_state, attempts FROM bridge_submissions WHERE submission_id = $1",
    [submissionId]
  );
  if (verifyPreRes.rows[0]?.delivery_state !== "SUBMITTING") {
    throw new Error(`Pre-network persistence check failed: ${JSON.stringify(verifyPreRes.rows[0])}`);
  }
  console.log("[Step 4 Verified] Pre-network persistence committed to PostgreSQL: COMMITTED_SUBMITTING");

  // 5. Sign the submission using production bridge authentication mechanism
  const timestamp = String(Math.floor(Date.now() / 1000));
  const baseHeaders = hermesBridgeClient.buildCanonicalHeaders(rawBody, timestamp);

  const headers: Record<string, string> = {
    ...baseHeaders,
    "Authorization": `Bearer ${AUTHORIZATION_ID}`,
    "x-civiclenz-authorization-id": AUTHORIZATION_ID,
    "X-Authorization-Id": AUTHORIZATION_ID,
    "X-Idempotency-Key": idempotencyKey,
    "X-Contract-Version": "CIVICLENZ_RESEARCH_INGEST_CONTRACT_V1"
  };

  console.log("[Step 5] Signing and headers prepared:");
  console.log("  Producer ID:", headers["x-civiclenz-producer-id"]);
  console.log("  Timestamp:", headers["x-civiclenz-timestamp"]);
  console.log("  Signature Header:", headers["x-civiclenz-signature"] ? `${headers["x-civiclenz-signature"].substring(0, 16)}...` : "NONE");
  console.log("  Authorization Header: Bearer [REDACTED]");
  console.log("  X-Authorization-Id:", AUTHORIZATION_ID);

  // 6. Issue exactly ONE HTTP POST using the provided Authorization ID.
  console.log(`[Step 6] Dispatching ONE-SHOT HTTP POST to ${TARGET_URL}...`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s single-attempt timeout

  let httpStatus = 0;
  let responseText = "";
  let responseJson: any = null;

  try {
    const res = await fetch(TARGET_URL, {
      method: "POST",
      headers,
      body: rawBody,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    httpStatus = res.status;
    responseText = await res.text();
    try {
      responseJson = JSON.parse(responseText);
    } catch {
      responseJson = { rawText: responseText };
    }
    console.log(`[Step 6 Complete] HTTP Status: ${httpStatus}`);
    console.log("[Step 6 Complete] Response Body:", JSON.stringify(responseJson, null, 2));
  } catch (netErr: any) {
    clearTimeout(timeoutId);
    console.error("[Step 6 Exception]", netErr);
    httpStatus = 0;
    responseJson = { error: netErr.message || String(netErr) };
  }

  // 7. Parse Canonical Response & Update PostgreSQL Durable Storage
  const rawAck = responseJson?.acknowledgement || responseJson || {};
  const correlationId = rawAck.correlation_id || rawAck.ingest_receipt_id || responseJson?.correlation_id || "N/A";
  const ackState = rawAck.acknowledgement_state || rawAck.code || (httpStatus === 200 || httpStatus === 202 ? "ACCEPTED_FOR_VALIDATION" : (httpStatus === 503 ? "RETRY_LATER" : (httpStatus === 401 ? "REJECTED_UNAUTHORIZED" : "CANONICAL_GATEWAY_RESPONSE")));
  const decision = rawAck.ingestion_decision || rawAck.decision || (httpStatus >= 200 && httpStatus < 300 ? "ACCEPTED_FOR_VALIDATION" : (httpStatus === 503 ? "PAUSED_OR_HOLD" : `HTTP_${httpStatus}`));

  let finalDeliveryState: string;
  if (httpStatus >= 200 && httpStatus < 300) {
    finalDeliveryState = "ACCEPTED_FOR_VALIDATION";
  } else if (httpStatus === 503) {
    finalDeliveryState = "RETRYABLE";
  } else if (httpStatus === 409) {
    finalDeliveryState = "DUPLICATE";
  } else if (httpStatus >= 400 && httpStatus < 500) {
    finalDeliveryState = "REJECTED";
  } else {
    finalDeliveryState = "SUBMITTED";
  }

  console.log(`[Step 7] Updating PostgreSQL final delivery state to ${finalDeliveryState}...`);
  await pool.query(
    `UPDATE bridge_submissions
     SET delivery_state = $1,
         acknowledgment = $2,
         last_error = $3,
         updated_at = NOW()
     WHERE submission_id = $4`,
    [
      finalDeliveryState,
      JSON.stringify(responseJson),
      httpStatus >= 400 ? (rawAck.message || JSON.stringify(rawAck.reasons) || `HTTP ${httpStatus}`) : null,
      submissionId
    ]
  );

  const finalCheck = await pool.query(
    "SELECT submission_id, delivery_state, updated_at FROM bridge_submissions WHERE submission_id = $1",
    [submissionId]
  );
  console.log("[Step 7 Verified] Final row in bridge_submissions:", finalCheck.rows[0]);

  // Report
  const report: CanaryExecutionReport = {
    producerGitSha: PRODUCER_GIT_SHA,
    producerDeployedRevision: PRODUCER_DEPLOYED_REVISION,
    selectedResearchResultId: `${EVIDENCE_UUID} (Snapshot: ${SNAPSHOT_UUID})`,
    selectedRetrievalObjectKey: OBJECT_KEY,
    r2Sha256Digest: computedR2Sha,
    r2ByteLength: r2Obj.bytes.length,
    preNetworkPostgresPersistStatus: "COMMITTED_SUBMITTING",
    canonicalGatewayHttpStatus: httpStatus,
    canonicalIngestReceiptOrCorrelationId: correlationId,
    canonicalAcknowledgmentState: ackState,
    canonicalIngestionDecision: decision,
    finalDeliveryStateInProducerStorage: finalDeliveryState,
    rawGatewayResponse: responseJson
  };

  console.log("\n==================================================");
  console.log("FINAL CANARY EXECUTION REPORT");
  console.log("==================================================");
  console.log(`Producer Git SHA: ${report.producerGitSha}`);
  console.log(`Producer Deployed Revision: ${report.producerDeployedRevision}`);
  console.log(`Selected Research Result ID: ${report.selectedResearchResultId}`);
  console.log(`Selected Retrieval Object Key: ${report.selectedRetrievalObjectKey}`);
  console.log(`R2 SHA-256 Digest: ${report.r2Sha256Digest}`);
  console.log(`R2 Byte Length: ${report.r2ByteLength}`);
  console.log(`Pre-Network Postgres Persist Status: ${report.preNetworkPostgresPersistStatus}`);
  console.log(`Canonical Gateway HTTP Status: ${report.canonicalGatewayHttpStatus}`);
  console.log(`Canonical Ingest Receipt / Correlation ID: ${report.canonicalIngestReceiptOrCorrelationId}`);
  console.log(`Canonical Acknowledgment State: ${report.canonicalAcknowledgmentState}`);
  console.log(`Canonical Ingestion Decision: ${report.canonicalIngestionDecision}`);
  console.log(`Final Delivery State in Producer Storage: ${report.finalDeliveryStateInProducerStorage}`);
  console.log("==================================================");
}

runOneShotCanary()
  .then(() => {
    console.log("One-shot execution completed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("FATAL ERROR executing one-shot canary:", err);
    process.exit(1);
  });
