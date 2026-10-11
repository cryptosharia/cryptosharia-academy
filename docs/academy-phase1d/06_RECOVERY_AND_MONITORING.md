# Recovery, rollback and monitoring runbook

## Local rehearsal evidence

`ACADEMY_RECOVERY_EVIDENCE_DIR=/outside/repository node --test tests/academy.recovery.ts`: one PASS. Existing fixed demo isolation/health/hub guard precedes source setup. Candidate Rules compile before clearing; no allow-all fallback. Backup fixture schema, candidate Rules and 81 documents from enumerated Academy/profile groups, including grants/progress subcollections and Timestamp seconds/nanoseconds, to a private JSON file; hash and reload from disk. Restore into distinct `demo-academy-phase1d-recovery` on loopback, compare every path/value, read position57, check guest/no-grant/cross-scope/list denials and persist fresh position58 through application operation. Measured ~2.8 seconds is a small-fixture observation, NOT a chosen RTO/SLA.

Snapshot uses explicit current collection groups and path allowlist; future schema/types require extension and integrity tests. Emulator setup bypass is used only for backup/restore; verification actors use candidate Rules. Synthetic Auth identities are not restored into target Auth. Indexes/IAM/Blob/provider assets/PITR/full SDK browser login/deployed Rules rollback are NOT VERIFIED. This is neither production backup nor proof of production rollback.

## Owner-approved hosted procedure — not executed

1. Assign incident commander, release operator, Firebase/backup operator, content/access owner and independent verifier; contact details private. Agree RPO/RTO/retention/backup schedule/encryption/storage region/restore access and review dates before pilot.
2. Before release capture exact build/source/lock/environment-contract digest; separately Rules source/hash/release, indexes, schema/content/version/rights manifest, private scoped-grant roster and trusted-claim audit. Preserve last compatible tuple and known OFF artifact. Data backup alone does not back up Auth/IAM/Rules/index/assets/config.
3. Owner approves managed database backup/export scope and isolated restore target, restricted backup storage and IAM; exclude production credentials from application artifacts. Do not infer export consistency from a JSON fixture snapshot. [Firestore export/import documentation](https://firebase.google.com/docs/firestore/manage-data/export-import).
4. Restore first to isolated target; verify counts/checksums/parents/order/status/version/approval/audit references, effective roles/scopes, unknown/draft/private/list/cross-user negatives, own progress and real synthetic login. Reconcile revoked grants/disabled identities against current incident ledger before opening access; retain revocations rather than resurrecting old privileges.
5. Roll back reviewed build/config to same approved protected target; preserve protection/side-effect containment. Config changes embedded at build time require compatible rebuilt artifact. Do not promote an untested environment or assume a code rollback rewinds data.
6. Apply only separately authorized compatible Rules/index release; never broad allow recovery. Freeze content writes while reconciling schema. Rerun backend/browser/protection/media cases on exact recovered tuple, verify telemetry, record elapsed recovery and owner sign-off before reopening.
7. Failure: keep OFF/contained, preserve private audit/evidence, notify owner through approved incident process; no auto retry into a different project, no production restore from this phase.

## Monitoring design

| Signal                  | Minimum private record                                             | Escalation / action                                                                     |
| ----------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Auth/role change        | Project fingerprint, event/reason, approved opaque actor/change ID | Unexpected privilege/failed identity provisioning → access owner                        |
| Permission-denied       | Route/operation class, timestamp, counter/status                   | Separate expected negative QA from unusual spikes/cross-scope attempts; security review |
| Publication             | Content opaque ID/version/transition/outcome/audit reference       | Invalid approval/rights/atomicity → freeze publisher workflow                           |
| Progress/provider       | Bounded error category, version, save latency/count                | Repeated save failure/provider errors → QA/engineering; do not fake completion          |
| Availability/protection | Safe status/latency and approved target fingerprint                | Misrouted backend/exposed preview → OFF/contain and incident commander                  |

Never log auth headers/tokens/passwords/API keys/private media URLs/raw RPC bodies or participant email. UIDs/reviewer identities stay in access-controlled audit, minimize or pseudonymize analytics; retention and access are owner decisions. No email/WhatsApp/alert provider configured or message sent here. Dashboards, log sinks, thresholds, rehearsal on representative volume and incident contacts remain pending; telemetry is a design, not monitoring PASS.
