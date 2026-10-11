# Phase 1B — data boundary

Candidate version: `firebase/academy-v1.rules`. This is an isolated schema, not a production migration or a final commercial access policy.

| Boundary            | Collection / contract                                                                                                                                                          | Authority                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Public metadata     | `academy_catalog/{lessonId}`: id, scopeId, subject, level, chapter, title, description, local thumbnail, durationSeconds, order, approved instructor, published status/version | Only exact metadata from the same approved editorial version can be written by a verified publisher                                         |
| Restricted content  | `academy_lessons/{lessonId}`: validated videoId, opaque reading/slide/subtitle/attachment refs, internal note, id/scope/version                                                | Get only: active scoped participant at request time, or verified admin under the synthetic management/preview policy; listing always denied |
| Editorial source    | `academy_editorial/{lessonId}`: metadata, media, version, status, approval, syariahRequired, actor/time/auditId                                                                | Verified editor/admin, reviewer or publisher reads; role-specific mutations                                                                 |
| Entitlements        | `academy_grants/{uid}/scopes/{scopeId}`: uid, explicit scope, active/revoked, startsAt/expiresAt, synthetic source, trusted actor/time/auditId                                 | Own or admin reads; verified admin writes with matching atomic audit; no participant writes/deletes                                         |
| Progress            | `academy_progress/{uid}/lessons/{lessonId}`: lesson/version, bounded position, updatedAt                                                                                       | Own history reads; writes additionally require a currently published lesson and valid scoped grant                                          |
| Profile             | `users/{uid}`: identity fields plus bounded display name/photo and timestamps                                                                                                  | Own read; create bound to authenticated UID/email; update allowlist excludes authorization/identity fields                                  |
| Audit               | `academy_audit/{auditId}`                                                                                                                                                      | Verified role creates current actor/time; immutable afterwards; role-limited reads                                                          |
| Legacy/transactions | old course, orders, vouchers and all unmatched paths                                                                                                                           | Default deny, including admins; HTTP transaction routes remain contained                                                                    |

The public collection does not contain private media fields. SDK projection, TypeScript casts and hidden UI are not used as a data boundary. Public queries explicitly constrain `status == published`; Rules do not filter an unrestricted query. Missing/unpublished public metadata does not expose editorial existence.

Stable lesson IDs are UUIDs in CMS; title edits do not change identity. `scopeId` is an explicit stable access-group identifier. Catalog/private IDs, scope and version must match editorial records; grant UID/scope must match their paths. Hierarchy labels are metadata within the scoped lesson model. Full subject/level/chapter entity management and the real curriculum mapping remain owner decisions, not a claimed inventory of completed lessons.

## Approval and atomic changes

Draft creation starts at version 1. Editing increments the expected version, returns to draft and clears approval. Concurrent edits with an old version fail. Flow: draft → review → approved → published. Review rejection returns to draft. A verified reviewer records content ID/version, own reviewer identity, rights confirmation, decision and server timestamp; when syariah is required the reviewer also needs the synthetic syariah claim. A publisher can publish only the unchanged approved version.

Publishing writes exact public metadata and private content from editorial source in one transaction, together with an immutable audit. Editing withdraws public metadata atomically; an old private copy cannot be read by participants because editorial status/version no longer qualifies. Draft deletion removes material/catalog and records a deletion audit. The deterministic deletion audit intentionally disallows reusing the same deleted identity repeatedly; CMS always creates fresh UUIDs. Approval assertions are synthetic: no real rights or organizational reviewer consent is implied.

No Admin SDK or application endpoint bypasses these Rules. Existing client transactions/batches remain the enforcement path. Trusted fixture bypass is confined to emulator setup; assertion actors use Rules-enforced SDK calls. Real role provisioning is not exposed through the UI or profile.

References are opaque and bounded lists, with no attachment renderer or storage authorization claimed. Existing YouTube parsing validates IDs and derives the embed host. Previously disclosed references cannot be recalled or converted into DRM.

## Future migration design — NOT EXECUTED

1. Obtain owner-approved deployed Rules/index export, environment identity, backup and content/access manifest.
2. Produce a private read-only mapping of legacy content to stable IDs, scope, public allowlist and restricted assets. Reject invalid IDs, missing rights/review, duplicate/orphan references and authorization fields in public metadata.
3. Dry-run the transform only on synthetic exports first, then on an explicitly authorized isolated copy. Compare counts, reference/version integrity, public exposure and six-role permissions; keep reports private.
4. Define rollback and role provisioning before owner review of any real write plan. This phase neither reads nor migrates the production database, imports Drive content, nor deploys Rules.
