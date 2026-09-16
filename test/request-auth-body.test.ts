import assert from 'node:assert/strict';
import { captureJsonRawBody, getAuthenticationBody } from '../src/lib/request-auth-body';

const original = Buffer.from('{"z":1,  "a":2}\n', 'utf8');
const req: any = { body: { z: 1, a: 2 } };
captureJsonRawBody(req, {} as any, original);
const authBody = getAuthenticationBody(req);
assert.ok(Buffer.isBuffer(authBody));
assert.deepEqual(authBody, original);
assert.notDeepEqual(authBody, Buffer.from(JSON.stringify(req.body), 'utf8'));

const fallback: any = { body: { z: 1, a: 2 } };
assert.deepEqual(getAuthenticationBody(fallback), Buffer.from('{"z":1,"a":2}', 'utf8'));
console.log('REQUEST_AUTH_RAW_BODY_TEST=PASS');
