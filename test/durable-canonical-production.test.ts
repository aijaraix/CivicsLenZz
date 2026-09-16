import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  submitDurableHermesJob,
  buildCanonicalResultEnvelope,
  stageCanonicalResultForCompletedJob,
  CONTROLLED_CAPABILITY,
  CONTROLLED_SCOPE,
} from '../src/lib/durable-canonical-production';

const work='a'.repeat(64);
const rawEnvelope={
  contract_version:'HERMES_RESEARCH_JOB_V1', job_id:'canonical-job-0001',
  research_work_identity:{work_key:work,jurisdiction_key:'jurisdiction_us_fl',research_domain:CONTROLLED_CAPABILITY,cycle_year:2026},
  research_reservation_id:'reservation-0001', producer_target:'civicslenzz-gemini-harvester', priority:1,
  capability:CONTROLLED_CAPABILITY, cohort:'FLORIDA_CONTROLLED_INITIAL', jurisdiction:'jurisdiction_us_fl',
  research_scope:CONTROLLED_SCOPE, source_constraints:['dos.elections.myflorida.com'], attempt:1,
  created_at:'2026-09-16T00:00:00Z', trace_id:'trace-0001'
};
function normalized(){return {...rawEnvelope,research_work_identity:{...rawEnvelope.research_work_identity}};}
function bridge(){return {validateInboundEnvelope:()=>({valid:true}),normalizeInboundEnvelope:()=>normalized(),registerCanonicalEnvelopeDurable:async()=>({delivery_state:'RESULT_READY'})};}

async function main(){
  let created:any=null;
  const persistence:any={
    findJobByLogicalKey:async()=>null,
    createJob:async(input:any)=>{created={job_uuid:'producer-job-1',status:'QUEUED',attempt_count:0,available_at:'2026-09-16T00:00:00Z',created_at:'2026-09-16T00:00:00Z',updated_at:'2026-09-16T00:00:00Z',...input};return created;},
  };
  const first=await submitDurableHermesJob(rawEnvelope,{persistence,bridge:bridge() as any});
  assert.equal(first.valid,true);assert.equal(first.is_new,true);
  assert.equal(created.agent_id,'H1');assert.equal(created.job_type,'INGEST_CANDIDATE_FILINGS');
  assert.equal(created.logical_work_key,`canonical:${work}`);assert.equal(created.max_attempts,1);
  assert.equal(created.checkpoint.canonical_assignment.canonical_job_id,'canonical-job-0001');
  assert.equal(created.checkpoint.canonical_assignment.research_scope,CONTROLLED_SCOPE);

  const existingPersistence:any={findJobByLogicalKey:async()=>({...created,status:'COMPLETED'}),createJob:async()=>{throw Error('duplicate created')}};
  const dup=await submitDurableHermesJob(rawEnvelope,{persistence:existingPersistence,bridge:bridge() as any});
  assert.equal(dup.valid,true);assert.equal(dup.is_new,false);assert.equal(dup.job?.job_uuid,'producer-job-1');

  let replacementCreated=false;
  const terminalPersistence:any={
    findJobByLogicalKey:async()=>({...created,status:'FAILED_PERMANENT'}),
    createJob:async(input:any)=>{replacementCreated=true;return {...created,...input,job_uuid:'producer-job-replacement',status:'QUEUED'};},
  };
  const replacement=await submitDurableHermesJob(rawEnvelope,{persistence:terminalPersistence,bridge:bridge() as any});
  assert.equal(replacement.valid,true);assert.equal(replacement.is_new,true);assert.equal(replacement.job?.job_uuid,'producer-job-replacement');assert.equal(replacementCreated,true);

  const bad=await submitDurableHermesJob({...rawEnvelope,research_scope:'FULL_PARALLEL_DOSSIER'},{persistence,bridge:bridge() as any});
  assert.equal(bad.valid,false);assert.equal(bad.error_code,'RESEARCH_SCOPE_REJECTED');

  const bytes=Buffer.from('<html>real florida dos bytes</html>');
  const hash=crypto.createHash('sha256').update(bytes).digest('hex');
  const job:any={...created,source_uuid:'fl_dos_elections',checkpoint:created.checkpoint};
  const parsed:any={success:true,source_id:'fl_dos_elections',source_url:'https://dos.elections.myflorida.com/candidates/CanList.asp',http_status:200,records_extracted:2,extracted_items:[{
    target_entity:'Example Candidate',field_key:'CANDIDATE_FILING_RECORD',
    extracted_value:JSON.stringify({candidate_name:'Example Candidate',party_affiliation:'NPA',filing_status:'Qualified',office_sought:'Governor'}),
    evidence_locator:'#row-1'
  },{
    target_entity:'Second Candidate',field_key:'CANDIDATE_FILING_RECORD',
    extracted_value:JSON.stringify({candidate_name:'Second Candidate',party_affiliation:'DEM',filing_status:'Filed',office_sought:'Governor'}),
    evidence_locator:'#row-2'
  }],raw_snapshot_uuid:'snapshot-1',evidence_objects:[{
    evidence_uuid:'evidence-1',source_uuid:'fl_dos_elections',source_url:'https://dos.elections.myflorida.com/candidates/CanList.asp',retrieved_at:'2026-09-16T00:05:00Z',source_tier:'TIER_A',raw_snapshot_uuid:'snapshot-1',retrieval_content_sha256:hash,content_hash:hash,parser_version:'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',extraction_method:'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',supporting_locator:'#row-1',verification_state:'EXTRACTED_UNREVIEWED',provenance_classification:'REAL_PROVEN'
  },{
    evidence_uuid:'evidence-2',source_uuid:'fl_dos_elections',source_url:'https://dos.elections.myflorida.com/candidates/CanList.asp',retrieved_at:'2026-09-16T00:05:00Z',source_tier:'TIER_A',raw_snapshot_uuid:'snapshot-1',retrieval_content_sha256:hash,content_hash:hash,parser_version:'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',extraction_method:'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',supporting_locator:'#row-2',verification_state:'EXTRACTED_UNREVIEWED',provenance_classification:'REAL_PROVEN'
  }]};
  const resultPersistence:any={getRawSnapshot:async()=>({snapshot_uuid:'snapshot-1',source_uuid:'fl_dos_elections',target_url:parsed.source_url,http_status:200,content_type:'text/html',byte_length:bytes.length,payload_sha256:hash,raw_bytes_path:'r2://bucket/snapshot-1.raw',object_locator:'r2://bucket/snapshot-1.raw',retrieved_at:'2026-09-16T00:05:00Z',parser_version:'DETERMINISTIC_PARSER_V2_2_ZERO_SYNTHETIC',provenance_classification:'REAL_PROVEN'})};
  const rawStore:any={getObject:async()=>({bytes,contentType:'text/html',sha256:hash})};
  const envelope=await buildCanonicalResultEnvelope(job,parsed,{persistence:resultPersistence,rawStore});
  assert.ok(envelope);assert.equal(envelope!.job.job_id,'canonical-job-0001');assert.equal(envelope!.job.research_work_identity,work);
  assert.equal(envelope!.capability,CONTROLLED_CAPABILITY);assert.equal(envelope!.evidence[0].sha256,hash);
  assert.equal(envelope!.entities.person_candidates.length,0);
  assert.equal(envelope!.evidence.length,2);
  assert.deepEqual(envelope!.evidence.map((e:any)=>e.evidence_key),['evidence-1','evidence-2']);
  assert.equal(envelope!.entities.candidate_campaign_candidates.length,2);
  assert.equal(envelope!.entities.candidate_campaign_candidates[0].attributes.candidate_name,'Example Candidate');
  assert.equal(envelope!.entities.candidate_campaign_candidates[0].identity_resolution_required,true);
  assert.deepEqual(envelope!.entities.candidate_campaign_candidates[0].evidence_keys,['evidence-1']);
  assert.equal(envelope!.claims.length,2);
  assert.equal(envelope!.claims[0].field_key,'candidate_filing_record');
  const knownEvidence=new Set(envelope!.evidence.map((e:any)=>e.evidence_key));
  for (const c of envelope!.entities.candidate_campaign_candidates as any[]) for (const k of c.evidence_keys as string[]) assert.ok(knownEvidence.has(k));
  for (const c of envelope!.claims as any[]) for (const k of c.evidence_keys as string[]) assert.ok(knownEvidence.has(k));
  assert.deepEqual(envelope!.claims[0].evidence_keys,['evidence-1']);
  assert.ok(envelope!.gaps.includes('CANONICAL_IDENTITY_RESOLUTION_REQUIRED'));

  let staged:any=null;
  const stagingBridge:any={...bridge(),registerCanonicalEnvelopeDurable:async(e:any,max:number)=>{staged={e,max};return {delivery_state:'RESULT_READY'};}};
  const stagedResult=await stageCanonicalResultForCompletedJob(job,parsed,{persistence:resultPersistence,rawStore,bridge:stagingBridge});
  assert.equal(stagedResult.state,'RESULT_READY');assert.equal(staged.max,1);assert.equal(staged.e.job.job_id,'canonical-job-0001');

  const corruptStore:any={getObject:async()=>({bytes:Buffer.from('corrupt'),contentType:'text/html',sha256:'0'.repeat(64)})};
  await assert.rejects(()=>buildCanonicalResultEnvelope(job,parsed,{persistence:resultPersistence,rawStore:corruptStore}),/INTEGRITY_MISMATCH/);

  const autonomous={...job,checkpoint:{}};
  assert.equal(await buildCanonicalResultEnvelope(autonomous,parsed,{persistence:resultPersistence,rawStore}),null);

  const storeSourceText = await import('node:fs/promises').then(fs=>fs.readFile(new URL('../src/lib/producer-storage/postgres-producer-store.ts',import.meta.url),'utf8'));
  assert.ok(storeSourceText.includes('logical_work_key: r.logicalWorkKey || r.logical_work_key || undefined'));
  const { PostgresProducerStore } = await import('../src/lib/producer-storage/postgres-producer-store');
  const mapperStore:any = new PostgresProducerStore({} as any);
  const mapped = mapperStore.mapJobRow({job_uuid:'mapped-job',agent_id:'H1',logical_work_key:`canonical:${work}`,job_type:'INGEST_CANDIDATE_FILINGS',priority:1,status:'QUEUED',attempt_count:0,max_attempts:1,available_at:'2026-09-16T00:00:00Z',created_at:'2026-09-16T00:00:00Z',updated_at:'2026-09-16T00:00:00Z'});
  assert.equal(mapped.logical_work_key,`canonical:${work}`);

  // Leasing filter contract: controlled mode must not select producer-autonomous logical work.
  const storeSource = await import('../src/lib/hermes-backend-store');
  const localStore:any = storeSource.hermesBackendStore;
  const unique = Date.now().toString(36);
  const testAgent = `TEST_CANONICAL_${unique}`;
  const autonomousJob = localStore.createJob({agent_id:testAgent,job_type:'INGEST_CANDIDATE_FILINGS',logical_work_key:`autonomous:${unique}`,priority:99});
  const canonicalJob = localStore.createJob({agent_id:testAgent,job_type:'INGEST_CANDIDATE_FILINGS',logical_work_key:`canonical:${unique}`,priority:1});
  const leased = localStore.claimAvailableJob(testAgent,`worker-${unique}`,'canonical:');
  assert.equal(leased?.job.job_uuid,canonicalJob.job_uuid);
  assert.notEqual(leased?.job.job_uuid,autonomousJob.job_uuid);

  console.log('DURABLE_CANONICAL_PRODUCTION_TESTS=PASS');
}
main().catch(e=>{console.error(e);process.exit(1)});
