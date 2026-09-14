import fs from 'fs';
import path from 'path';
import { db } from '../src/db/index.ts';
import {
  hermesJobs,
  hermesJobAttempts,
  hermesWorkerLeases,
  hermesCheckpoints,
  hermesSourceRegistry,
  rawSourceSnapshots,
  rawEvidenceObjects,
  researchContractStatuses,
  seatCoverageStatuses,
  personCoverageStatuses,
  deadLetterJobs,
  monitoringEvents,
  durableGaps,
  academyObservations,
  academyCases,
  autonomousProofRecords,
  monitoringProofRecords,
  bridgeSubmissions,
  domainRateLimits,
  producerSystemState
} from '../src/db/schema.ts';

async function migrate() {
  console.log("==================================================");
  console.log("CIVICSLENZZ: DURABLE POSTGRESQL STATE MIGRATION");
  console.log("==================================================");

  const dataDir = path.join(process.cwd(), 'data');
  const dbPath = path.join(dataDir, 'hermes_persistent_db.json');
  const bridgePath = path.join(dataDir, 'bridge-submissions.json');

  let localDb: any = {};
  if (fs.existsSync(dbPath)) {
    try {
      localDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } catch (e: any) {
      console.warn("Could not read local DB file:", e.message);
    }
  }

  let localBridge: any[] = [];
  if (fs.existsSync(bridgePath)) {
    try {
      localBridge = JSON.parse(fs.readFileSync(bridgePath, 'utf-8'));
    } catch (e: any) {
      console.warn("Could not read bridge submissions file:", e.message);
    }
  }

  const preMigration = {
    jobs: localDb.hermes_jobs?.length || 0,
    attempts: localDb.hermes_job_attempts?.length || 0,
    leases: localDb.hermes_worker_leases?.length || 0,
    checkpoints: localDb.hermes_checkpoints?.length || 0,
    source_registry: localDb.hermes_source_registry?.length || 0,
    raw_snapshots: localDb.raw_source_snapshots?.length || 0,
    evidence: localDb.raw_evidence_objects?.length || 0,
    research_contracts: localDb.research_contract_status?.length || 0,
    seats: localDb.seat_coverage_status?.length || 0,
    persons: localDb.person_coverage_status?.length || 0,
    dead_letters: localDb.dead_letter_jobs?.length || 0,
    monitoring_events: localDb.monitoring_events?.length || 0,
    durable_gaps: localDb.durable_gaps?.length || 0,
    academy_observations: localDb.academy_observations?.length || 0,
    academy_cases: localDb.academy_cases?.length || 0,
    autonomous_proofs: localDb.autonomous_proof_records?.length || 0,
    monitoring_proofs: localDb.monitoring_proof_records?.length || 0,
    bridge_submissions: localBridge?.length || 0
  };

  console.log("PRE_MIGRATION_COUNTS:", JSON.stringify(preMigration, null, 2));

  // 1. Migrate hermes_jobs
  if (localDb.hermes_jobs?.length > 0) {
    for (const item of localDb.hermes_jobs) {
      await db.insert(hermesJobs).values({
        jobUuid: item.job_uuid,
        agentId: item.agent_id,
        missionUuid: item.mission_uuid,
        seatUuid: item.seat_uuid,
        personUuid: item.person_uuid,
        raceUuid: item.race_uuid,
        campaignUuid: item.campaign_uuid,
        sourceUuid: item.source_uuid,
        jobType: item.job_type,
        priority: item.priority || 1,
        status: item.status || 'QUEUED',
        attemptCount: item.attempt_count || 0,
        maxAttempts: item.max_attempts || 3,
        availableAt: item.available_at || new Date().toISOString(),
        lockedAt: item.locked_at,
        leaseExpiresAt: item.lease_expires_at,
        workerInstance: item.worker_instance,
        startedAt: item.started_at,
        completedAt: item.completed_at,
        failedAt: item.failed_at,
        lastError: item.last_error,
        checkpoint: item.checkpoint,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString()
      }).onConflictDoUpdate({
        target: hermesJobs.jobUuid,
        set: {
          status: item.status,
          attemptCount: item.attempt_count,
          updatedAt: item.updated_at || new Date().toISOString()
        }
      });
    }
  }

  // 2. Migrate hermes_job_attempts
  if (localDb.hermes_job_attempts?.length > 0) {
    for (const item of localDb.hermes_job_attempts) {
      await db.insert(hermesJobAttempts).values({
        attemptUuid: item.attempt_uuid,
        jobUuid: item.job_uuid,
        workerInstance: item.worker_instance,
        startedAt: item.started_at,
        finishedAt: item.finished_at,
        status: item.status,
        errorMessage: item.error_message,
        httpStatus: item.http_status,
        recordsExtracted: item.records_extracted || 0
      }).onConflictDoNothing();
    }
  }

  // 3. Migrate hermes_worker_leases
  if (localDb.hermes_worker_leases?.length > 0) {
    for (const item of localDb.hermes_worker_leases) {
      await db.insert(hermesWorkerLeases).values({
        leaseUuid: item.lease_uuid,
        jobUuid: item.job_uuid,
        workerInstance: item.worker_instance,
        agentId: item.agent_id,
        acquiredAt: item.acquired_at,
        expiresAt: item.expires_at,
        lastHeartbeatAt: item.last_heartbeat_at
      }).onConflictDoUpdate({
        target: hermesWorkerLeases.jobUuid,
        set: {
          workerInstance: item.worker_instance,
          expiresAt: item.expires_at,
          lastHeartbeatAt: item.last_heartbeat_at
        }
      });
    }
  }

  // 4. Migrate hermes_checkpoints
  if (localDb.hermes_checkpoints?.length > 0) {
    for (const item of localDb.hermes_checkpoints) {
      await db.insert(hermesCheckpoints).values({
        checkpointUuid: item.checkpoint_uuid,
        jobUuid: item.job_uuid,
        stepName: item.step_name,
        recordsProcessed: item.records_processed || 0,
        lastProcessedId: item.last_processed_id,
        stateData: item.state_data || {},
        savedAt: item.saved_at
      }).onConflictDoNothing();
    }
  }

  // 5. Migrate hermes_source_registry
  if (localDb.hermes_source_registry?.length > 0) {
    for (const item of localDb.hermes_source_registry) {
      await db.insert(hermesSourceRegistry).values({
        sourceUuid: item.source_uuid,
        sourceId: item.source_id,
        sourceName: item.source_name,
        authorityTier: item.authority_tier,
        baseUrl: item.base_url,
        jurisdiction: item.jurisdiction,
        rateLimitReqPerSec: item.rate_limit_req_per_sec || 2,
        status: item.status || 'HEALTHY',
        consecutiveFailures: item.consecutive_failures || 0,
        circuitOpensCount: item.circuit_opens_count || 0,
        circuitReopenAt: item.circuit_reopen_at,
        lastSuccessAt: item.last_success_at,
        lastFailureAt: item.last_failure_at,
        lastError: item.last_error,
        lastCheckedAt: item.last_checked_at
      }).onConflictDoUpdate({
        target: hermesSourceRegistry.sourceId,
        set: {
          status: item.status,
          consecutiveFailures: item.consecutive_failures,
          lastCheckedAt: item.last_checked_at
        }
      });
    }
  }

  // 6. Migrate raw_source_snapshots
  if (localDb.raw_source_snapshots?.length > 0) {
    for (const item of localDb.raw_source_snapshots) {
      await db.insert(rawSourceSnapshots).values({
        snapshotUuid: item.snapshot_uuid,
        sourceUuid: item.source_uuid,
        targetUrl: item.target_url,
        httpStatus: item.http_status,
        contentType: item.content_type || 'text/html',
        charset: item.charset,
        byteLength: item.byte_length,
        rawPayload: item.raw_payload,
        payloadSha256: item.payload_sha256,
        rawBytesPath: item.raw_bytes_path,
        objectLocator: item.object_locator || `artifacts/retrievals/${path.basename(item.raw_bytes_path || '')}`,
        retrievedAt: item.retrieved_at,
        parserVersion: item.parser_version,
        provenanceClassification: item.provenance_classification || 'REAL_PROVEN',
        challengeReason: item.challenge_reason,
        failureClass: item.failure_class
      }).onConflictDoNothing();
    }
  }

  // 7. Migrate raw_evidence_objects
  if (localDb.raw_evidence_objects?.length > 0) {
    for (const item of localDb.raw_evidence_objects) {
      await db.insert(rawEvidenceObjects).values({
        evidenceUuid: item.evidence_uuid,
        sourceUuid: item.source_uuid,
        sourceUrl: item.source_url,
        deepLink: item.deep_link,
        documentTitle: item.document_title,
        documentType: item.document_type,
        retrievedAt: item.retrieved_at,
        publishedAt: item.published_at,
        sourceTier: item.source_tier,
        rawSnapshotUuid: item.raw_snapshot_uuid,
        retrievalContentSha256: item.retrieval_content_sha256,
        claimFingerprint: item.claim_fingerprint,
        contentHash: item.content_hash,
        parserVersion: item.parser_version,
        extractionMethod: item.extraction_method,
        supportingLocator: item.supporting_locator,
        verificationState: item.verification_state || 'EXTRACTED_UNREVIEWED',
        seatUuid: item.seat_uuid,
        personUuid: item.person_uuid,
        fieldKey: item.field_key,
        extractedValue: item.extracted_value,
        provenanceClassification: item.provenance_classification || 'REAL_PROVEN'
      }).onConflictDoNothing();
    }
  }

  // 8. Migrate research_contract_status
  if (localDb.research_contract_status?.length > 0) {
    for (const item of localDb.research_contract_status) {
      await db.insert(researchContractStatuses).values({
        contractUuid: item.contract_uuid,
        seatUuid: item.seat_uuid,
        personUuid: item.person_uuid,
        officeType: item.office_type,
        totalRequiredFields: item.total_required_fields || 0,
        verifiedFieldsCount: item.verified_fields_count || 0,
        missingRequiredFieldsCount: item.missing_required_fields_count || 0,
        conflictingFieldsCount: item.conflicting_fields_count || 0,
        completenessPercentage: item.completeness_percentage || 0,
        fieldStates: item.field_states || {},
        lastEvaluatedAt: item.last_evaluated_at || new Date().toISOString()
      }).onConflictDoUpdate({
        target: researchContractStatuses.seatUuid,
        set: {
          completenessPercentage: item.completeness_percentage,
          fieldStates: item.field_states,
          lastEvaluatedAt: item.last_evaluated_at
        }
      });
    }
  }

  // 9. Migrate seat_coverage_status
  if (localDb.seat_coverage_status?.length > 0) {
    for (const item of localDb.seat_coverage_status) {
      await db.insert(seatCoverageStatuses).values({
        seatUuid: item.seat_uuid,
        officeName: item.office_name,
        officeType: item.office_type,
        jurisdiction: item.jurisdiction,
        countyFips: item.county_fips,
        districtNumber: item.district_number,
        governmentLevel: item.government_level || 'State',
        currentOfficialPersonUuid: item.current_official_person_uuid,
        currentOfficialName: item.current_official_name,
        isVacant: String(item.is_vacant),
        vacancyStatus: item.vacancy_status || 'UNKNOWN',
        tenureYears: item.tenure_years,
        termStart: item.term_start,
        termEnd: item.term_end,
        nextElectionDate: item.next_election_date,
        inActiveElectionCycle: Boolean(item.in_active_election_cycle),
        completenessPercentage: item.completeness_percentage || 0,
        coverageStatus: item.coverage_status || 'NOT_YET_RESEARCHED',
        verificationState: item.verification_state || 'RESEARCH_PENDING',
        lastUpdatedAt: item.last_updated_at || new Date().toISOString()
      }).onConflictDoUpdate({
        target: seatCoverageStatuses.seatUuid,
        set: {
          coverageStatus: item.coverage_status,
          lastUpdatedAt: item.last_updated_at
        }
      });
    }
  }

  // 10. Migrate person_coverage_status
  if (localDb.person_coverage_status?.length > 0) {
    for (const item of localDb.person_coverage_status) {
      await db.insert(personCoverageStatuses).values({
        personUuid: item.person_uuid,
        name: item.name,
        title: item.title,
        officeType: item.office_type,
        party: item.party || 'UNKNOWN',
        district: item.district,
        jurisdiction: item.jurisdiction,
        seatUuid: item.seat_uuid,
        completenessPercentage: item.completeness_percentage || 0,
        researchState: item.research_state || 'NOT_YET_RESEARCHED',
        lastAuditedAt: item.last_audited_at || new Date().toISOString()
      }).onConflictDoUpdate({
        target: personCoverageStatuses.personUuid,
        set: {
          researchState: item.research_state,
          lastAuditedAt: item.last_audited_at
        }
      });
    }
  }

  // 11. Migrate dead_letter_jobs
  if (localDb.dead_letter_jobs?.length > 0) {
    for (const item of localDb.dead_letter_jobs) {
      await db.insert(deadLetterJobs).values({
        deadLetterUuid: item.dead_letter_uuid,
        jobUuid: item.job_uuid,
        agentId: item.agent_id,
        jobType: item.job_type,
        attemptsMade: item.attempts_made || 0,
        finalError: item.final_error,
        sourceId: item.source_id,
        payloadSnapshot: item.payload_snapshot,
        movedAt: item.moved_at
      }).onConflictDoNothing();
    }
  }

  // 12. Migrate monitoring_events
  if (localDb.monitoring_events?.length > 0) {
    for (const item of localDb.monitoring_events) {
      await db.insert(monitoringEvents).values({
        eventUuid: item.event_uuid,
        obligationId: item.obligation_id,
        checkId: item.check_id,
        retrievalId: item.retrieval_id,
        comparisonId: item.comparison_id,
        previousHash: item.previous_hash,
        currentHash: item.current_hash,
        comparisonEvent: item.comparison_event,
        observedUrl: item.observed_url,
        sourceOrigin: item.source_origin || 'LIVE_NETWORK',
        statusCode: item.status_code,
        errorMessage: item.error_message,
        timestamp: item.timestamp
      }).onConflictDoNothing();
    }
  }

  // 13. Migrate durable_gaps
  if (localDb.durable_gaps?.length > 0) {
    for (const item of localDb.durable_gaps) {
      await db.insert(durableGaps).values({
        gapId: item.gap_id,
        seatUuid: item.seat_uuid,
        personUuid: item.person_uuid,
        officeType: item.office_type,
        missingScope: item.missing_scope,
        priority: item.priority || 'MEDIUM',
        autoGeneratedJobType: item.auto_generated_job_type,
        status: item.status || 'PENDING',
        jobUuid: item.job_uuid,
        createdAt: item.created_at,
        resolvedAt: item.resolved_at
      }).onConflictDoNothing();
    }
  }

  // 14. Migrate academy_observations
  if (localDb.academy_observations?.length > 0) {
    for (const item of localDb.academy_observations) {
      await db.insert(academyObservations).values({
        observationId: item.observation_id,
        sourceId: item.source_id,
        parserId: item.parser_id,
        incidentType: item.incident_type,
        observedPayloadSample: item.observed_payload_sample,
        observedSha256: item.observed_sha256,
        errorMessage: item.error_message,
        createdAt: item.created_at
      }).onConflictDoNothing();
    }
  }

  // 15. Migrate academy_cases
  if (localDb.academy_cases?.length > 0) {
    for (const item of localDb.academy_cases) {
      await db.insert(academyCases).values({
        caseId: item.case_id,
        observationId: item.observation_id,
        caseTitle: item.case_title,
        proposedRule: item.proposed_rule,
        state: item.state || 'OBSERVED',
        testResult: item.test_result,
        createdAt: item.created_at,
        testedAt: item.tested_at,
        promotedAt: item.promoted_at,
        promotionAuthority: item.promotion_authority
      }).onConflictDoNothing();
    }
  }

  // 16. Migrate autonomous_proof_records
  if (localDb.autonomous_proof_records?.length > 0) {
    for (const item of localDb.autonomous_proof_records) {
      await db.insert(autonomousProofRecords).values({
        proofUuid: item.proof_uuid,
        workId: item.work_id,
        leaseId: item.lease_id,
        workerId: item.worker_id,
        retrievalId: item.retrieval_id,
        artifactId: item.artifact_id,
        nextWorkId: item.next_work_id,
        verifierSelfDispatches: Boolean(item.verifier_self_dispatches),
        provenAt: item.proven_at
      }).onConflictDoNothing();
    }
  }

  // 17. Migrate monitoring_proof_records
  if (localDb.monitoring_proof_records?.length > 0) {
    for (const item of localDb.monitoring_proof_records) {
      await db.insert(monitoringProofRecords).values({
        proofUuid: item.proof_uuid,
        obligationId: item.obligation_id,
        checkId: item.check_id,
        retrievalId: item.retrieval_id,
        comparisonId: item.comparison_id,
        sourceOrigin: item.source_origin || 'LIVE_NETWORK',
        verifierExecutesFetch: Boolean(item.verifier_executes_fetch),
        provenAt: item.proven_at
      }).onConflictDoNothing();
    }
  }

  // 18. Migrate bridge_submissions
  if (localBridge?.length > 0) {
    for (const item of localBridge) {
      await db.insert(bridgeSubmissions).values({
        submissionId: item.submission_id || item.job_id,
        jobId: item.job_id,
        idempotencyKey: item.idempotency_key || `sub_${item.job_id}`,
        deliveryState: item.delivery_state || 'PENDING_SUBMISSION',
        attempts: item.attempts || 0,
        maxAttempts: item.max_attempts || 10,
        nextRetryAt: item.next_retry_at,
        lastAttemptAt: item.last_attempt_at,
        lastError: item.last_error,
        canonicalAckCode: item.acknowledgment?.ack_code,
        canonicalCorrelationId: item.acknowledgment?.correlation_id,
        acknowledgment: item.acknowledgment,
        resultPackage: item.result_package,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString()
      }).onConflictDoUpdate({
        target: bridgeSubmissions.jobId,
        set: {
          deliveryState: item.delivery_state,
          attempts: item.attempts,
          updatedAt: item.updated_at || new Date().toISOString()
        }
      });
    }
  }

  // Read post-migration counts from DB
  const [
    dbJobs,
    dbAttempts,
    dbLeases,
    dbCheckpoints,
    dbSources,
    dbSnapshots,
    dbEvidence,
    dbContracts,
    dbSeats,
    dbPersons,
    dbDeadLetters,
    dbMonEvents,
    dbGaps,
    dbAcadObs,
    dbAcadCases,
    dbAutoProofs,
    dbMonProofs,
    dbBridge
  ] = await Promise.all([
    db.select().from(hermesJobs),
    db.select().from(hermesJobAttempts),
    db.select().from(hermesWorkerLeases),
    db.select().from(hermesCheckpoints),
    db.select().from(hermesSourceRegistry),
    db.select().from(rawSourceSnapshots),
    db.select().from(rawEvidenceObjects),
    db.select().from(researchContractStatuses),
    db.select().from(seatCoverageStatuses),
    db.select().from(personCoverageStatuses),
    db.select().from(deadLetterJobs),
    db.select().from(monitoringEvents),
    db.select().from(durableGaps),
    db.select().from(academyObservations),
    db.select().from(academyCases),
    db.select().from(autonomousProofRecords),
    db.select().from(monitoringProofRecords),
    db.select().from(bridgeSubmissions)
  ]);

  const postMigration = {
    jobs: dbJobs.length,
    attempts: dbAttempts.length,
    leases: dbLeases.length,
    checkpoints: dbCheckpoints.length,
    source_registry: dbSources.length,
    raw_snapshots: dbSnapshots.length,
    evidence: dbEvidence.length,
    research_contracts: dbContracts.length,
    seats: dbSeats.length,
    persons: dbPersons.length,
    dead_letters: dbDeadLetters.length,
    monitoring_events: dbMonEvents.length,
    durable_gaps: dbGaps.length,
    academy_observations: dbAcadObs.length,
    academy_cases: dbAcadCases.length,
    autonomous_proofs: dbAutoProofs.length,
    monitoring_proofs: dbMonProofs.length,
    bridge_submissions: dbBridge.length
  };

  console.log("POST_MIGRATION_COUNTS:", JSON.stringify(postMigration, null, 2));

  // Reconcile
  let matched = true;
  for (const [key, count] of Object.entries(preMigration)) {
    const postCount = (postMigration as any)[key];
    if (count !== postCount) {
      console.error(`MISMATCH on ${key}: pre=${count}, post=${postCount}`);
      matched = false;
    }
  }

  if (matched) {
    console.log("✓ RECONCILIATION SUCCESS: 100% exact parity across all entities.");
  } else {
    throw new Error("MIGRATION RECONCILIATION FAILED");
  }

  process.exit(0);
}

migrate().catch(err => {
  console.error("Migration fatal error:", err);
  process.exit(1);
});
