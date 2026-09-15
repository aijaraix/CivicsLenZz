import assert from 'node:assert/strict';
import { Pool } from 'pg';
import { reserveCanaryAttempt } from '../src/lib/canonical-canary-envelope.ts';
// Only isolated CI PostgreSQL, never runtime data or credentials.
if (process.env.SQL_DB_NAME !== 'producer_test') throw new Error('Isolated producer_test database required');
const pool = new Pool({host:process.env.SQL_HOST,user:process.env.SQL_USER,password:process.env.SQL_PASSWORD,database:process.env.SQL_DB_NAME});
const client = await pool.connect();
try {
 await client.query('BEGIN');
 await client.query(`CREATE TEMP TABLE bridge_submissions (submission_id text PRIMARY KEY,job_id text UNIQUE,idempotency_key text UNIQUE,delivery_state text,attempts integer,max_attempts integer,last_attempt_at text,result_package jsonb,created_at text,updated_at text)`);
 await client.query(`INSERT INTO bridge_submissions (submission_id,job_id,attempts,delivery_state) VALUES ('historical','historical-job',1,'REJECTED')`);
 const envelope:any={producer:{execution_id:'isolated-new'},job:{job_id:'new-job'}};
 const outcomes=await Promise.allSettled(Array.from({length:5},()=>reserveCanaryAttempt(client,envelope,Buffer.from(JSON.stringify(envelope)))));
 assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1);
 assert.equal(outcomes.filter(x=>x.status==='rejected').length,4);
 assert.deepEqual((await client.query("SELECT attempts,delivery_state FROM bridge_submissions WHERE submission_id='historical'")).rows,[{attempts:1,delivery_state:'REJECTED'}]);
 assert.deepEqual((await client.query("SELECT attempts,max_attempts,delivery_state FROM bridge_submissions WHERE submission_id='sub_isolated-new'")).rows,[{attempts:1,max_attempts:1,delivery_state:'SUBMITTING'}]);
 console.log('Create-only attempt, duplicate suppression and failure history: PASS');
} finally {await client.query('ROLLBACK');client.release();await pool.end();}
