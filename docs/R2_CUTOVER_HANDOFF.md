# R2 cutover — draft, not deployed

Base main: 4b3ab18d86128d9315e87b87b2ca1f5c095dc4d0.

The production factory and direct PostgresProducerStore constructor use R2RawObjectStore.
Cloud SQL schema and work histories are unchanged. No canonical operations are authorized by this patch.
The R2 implementation uses the S3 SDK, validates account/endpoint pairing, checks bucket access, and reads back every write before returning a durable locator. Readback checks byte length and SHA-256 against object metadata and the original payload. SDK error details are not logged.

## Pending release gates

This session had no working Node runtime or producer deployment connection. Tests have been authored but NOT executed. Do not merge or deploy this draft until all gates below pass.

1. Run npm install to update package-lock.json for @aws-sdk/client-s3. Commit the resulting lockfile on this branch.
2. Run npm run test:r2 first. These SDK transport fixtures do not prove actual credentials, bucket permissions, PostgreSQL snapshot lineage, or production durability.
3. Run npm test, npm run production:truth-audit, npm run lint, npm run build. Resolve failures before merging.
4. Independently inspect the current serving producer revision and its deployment configuration without printing secret values.
5. Confirm all five R2 variables are present in the serving runtime; AI Studio configuration alone is not serving-revision proof. Keep Cloud SQL settings unchanged. No GCS credentials are required by the new production factory.
6. Keep canonical intake paused. Do not trigger research or invoke the bridge.
7. Deploy the reviewed exact clean main SHA using the existing AI Studio deployment channel; set GIT_SHA to that SHA. Confirm build-info and serving revision match. No Cloudflare Worker deployment is required.
8. Through the serving runtime's existing protected execution mechanism, save isolated NON-CIVIC binary bytes with ProducerPersistence.saveRawSnapshot and provenance UNKNOWN. Do not register civic evidence, create jobs, or add an unauthenticated diagnostic endpoint.
9. Record snapshot UUID, r2 locator, PostgreSQL byte length/hash, and R2 getObject readback length/hash. Compare against the original bytes. Confirm health/status require PostgreSQL schema ready, R2 available, no fallback, daemon active.
10. Record hashes/existence of local JSON files and retrieval directory before/after the isolated operation. They must not change due to this operation.
11. Record job/evidence/attempt/bridge identities, force real Cloud Run replacement through the authorized deployment mechanism, and recover the same snapshot UUID/object/length/hash. Reconcile identities: no losses, resets, or duplicates.
12. Retain the isolated proof lineage; cleanup only if explicitly scoped to that test object. Do not delete historical raw evidence.

## Runtime values

Secrets: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (AI Studio protected environment only).
Nonsecrets: R2_ACCOUNT_ID, R2_BUCKET=civicslenzz-producer-evidence, R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com.
Production must not set NODE_ENV=test or PRODUCER_STORAGE_MODE=LOCAL_TEST.
R2 health uses HeadBucket for only the configured bucket; no account bucket listing.

## Rollback

Retain prior revision and do not alter Cloud SQL, attempts, or R2 objects. The previous GCS backend was unavailable, so reverting traffic is NOT a claim of restored storage health. Stop affected producer execution via the existing control if necessary, keep canonical intake paused, and preserve R2 locators for recovery. Never substitute local files or reset attempts.

## Remaining acceptance

DURABLE_PRODUCER_NOT_READY. No physical R2 write, replacement, or recovery proof has been performed by this source change.
