# Candidate Rules compatibility, IAM and rollback

DEPLOYED RULES — NOT VERIFIED.

Dedicated Academy staging is the safer proposed choice: no shared Masterclass collections, Auth identities or production resource permissions. It remains an owner decision; candidate default deny cannot safely replace shared legacy Rules. No production export or collection discovery was performed; legacy inventory below comes from repository source, not a database census.

| Collection / path                                                                     | Expected reads                                                                                | Expected writes                                                                                       |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| academy_catalog/{id}                                                                  | Guest published-only query/get; draft/unbounded query denied                                  | Publisher exact approved projection, parent and position validation; lesson withdrawal on revision    |
| academy_editorial/{id}                                                                | Verified admin/reviewer/publisher                                                             | Admin draft/edit/review; reviewer approval/reject; publisher current approved version; matching audit |
| academy_positions/{parent_order}                                                      | Verified content roles                                                                        | Publisher atomic reservation; duplicate order denied; bounded withdrawal                              |
| academy_lessons/{id}                                                                  | Known ID: valid scoped grant/current published version, or verified admin; list ALWAYS denied | Publisher exact projection; approved canonical lifecycle only                                         |
| academy_grants/{uid}/scopes/{scope}                                                   | Own UID or admin                                                                              | Admin only, exact synthetic source/schema/server time + audit; participants cannot self-grant         |
| academy_progress/{uid}/lessons/{id}                                                   | Own history, including after expiry/revoke                                                    | Own finite bounded position/current version/current grant; no cross-user/admin override               |
| users/{uid}                                                                           | Own UID; user list denied                                                                     | Own allowlisted identity/profile fields; no authorization changes                                     |
| academy_audit/{id}                                                                    | Verified content roles                                                                        | Matching current actor/server time; append-only, no update/delete                                     |
| Source legacy: elearning_courses, orders, vouchers, site_content; all unmatched paths | Candidate default deny, including verified admins                                             | Candidate default deny; deployed policy UNKNOWN                                                       |

Rules v1C unchanged. 90 tests and 33 browser scenarios preserve known-ID, constrained/unbounded queries, private listing, cross-scope/user, forged profile/role/grant, direct SDK, stale approval/rights/audit and request-time expiry/revoke denials. Hierarchy traversal across invalid parent/subject/level/scope is rejected; invalid identifiers cannot create valid editorial records. Frontend/Vercel protection never substitutes for backend policy. Admin SDK/IAM bypasses Rules; limit trusted backend permissions separately.

## Owner export comparison procedure

When explicitly authorized, owner supplies read-only deployed Rules source, ruleset/release identity, database/project identity and indexes export in private storage; checksum and capture time bind them. Compare path union, default deny, list vs get, query predicates, custom claims, profiles/grants, publication/getAfter limits and every legacy collection. Run current and candidate/composed policies against synthetic Academy AND legacy cases. Record allow/deny deltas and index errors; no broad legacy allow rule, no direct deployment of candidate. Missing baseline remains NOT VERIFIED.

Existing queries use published/kind/scope predicates, own progress subcollections and own grant reads. Emulator PASS does not prove hosted composite indexes, collection-group policy, latency/cost or IAM. Index design must cover actual final queries and be reviewed on the isolated target; no production index guesses/file generated here.

## IAM/claims design

Owner chooses separate least-privilege claim-provisioner, Rules release reviewer/operator and backup/restore operator, restricted to staging. No production Owner/Editor role, no downloaded service-account key in repository, no participant service identity. Record exact IAM permissions/resources privately before granting them. Browser users receive no IAM/database-admin role. Claims must come from an owner-authorized privileged environment; client profile/email cannot create them. [Firebase custom claims guidance](https://firebase.google.com/docs/auth/admin/custom-claims).

Role separation gap: Editor currently maps to academyAdmin and shares grant/admin capability. No academyEditor claim exists. Strict separate Editor vs access Admin therefore requires owner-approved Rules/UI change and new regressions before hosted testing, or explicit acceptance of this synthetic combined capability. Syariah approval currently requires reviewer and syariah claim on the same approving actor; a two-person syariah/content workflow is not implemented. Real provisioning/revoke policy remains blocked.

## Rules rollback before any application

Preserve last target-specific Rules source/hash/release, indexes and compatible code/schema/content/claims manifest. On failed release freeze publishing/grants, close Academy via approved OFF artifact, choose reviewed compatible tuple, restore Rules by authorized operator and rerun role/query/private/progress negatives. Never rollback Rules alone across incompatible schema versions or widen access to regain UI availability. Candidate copy restored locally; deployed Rules release switching and legacy compatibility NOT VERIFIED.
