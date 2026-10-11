# Phase 1D-A — readiness only

11 Oktober 2026, Asia/Jakarta. READINESS ONLY — NO DEPLOYMENT. Local handover GO; Phase 1D-B authorization request BLOCKED, protected hosted preview/pilot/production NO-GO.

## Provenance

Branch `chore/academy-phase1d-hosted-readiness`, separate worktree; implementation/readiness tooling `6d663a46d52e696ebde72c496a198cd354b2e206` on exact Phase 1C `12bbd8f7a288b880ef32ab90685ae5acc90ad2dc`. Phase 1C implementation `5a252e653b46107324d76e0e3b1cb6937384c74f`, Phase 1B ancestor `fe81f4d1ed1e3c6431fcc4331a25e1c731e290fd`. Remote Phase 1C verified `12bbd8f7a288b880ef32ab90685ae5acc90ad2dc`, main `32424e5fc8b584172841f0cfc3afbc72294a9b83`. Main/1A/1B/1C not edited. Documentation commit follows; exact final HEAD is supplied in handover.

AGENTS/steering and Phase 0–1C evidence were reviewed with Firebase/auth/CMS/player/progress/containment. Runtime source, candidate Rules, dependencies, lock, .env example and feature policy unchanged. No push/merge/deploy/project creation/domain change/production export or restore/Drive mutation/real content publication/payment/notification.

## Commands and final evidence

| Command                                                     | Exit       | Evidence                                                   |
| ----------------------------------------------------------- | ---------- | ---------------------------------------------------------- |
| Windows `npm ci`                                            | 0          | 325 added / 326 audited; lock unchanged                    |
| `npm run check:test`                                        | 0          | 0 errors, 5 existing warnings                              |
| `npm run lint`                                              | 0          | Prettier and ESLint, source and final reports              |
| `npm test`                                                  | 0          | 54 PASS; all 50 Phase 1C baseline retained                 |
| `node scripts/run-local.mjs test:rules`                     | 0          | 90 PASS; baseline unchanged                                |
| `node scripts/run-local.mjs test:browser`                   | 0          | 33 PASS; Chrome and Edge, baseline unchanged               |
| HTTP helper enabled/default-OFF/offline                     | 0          | 11 + 6 + 5 = 22 assertions PASS                            |
| Offline Rules launcher                                      | 1 expected | Auth connection refused before fixture setup               |
| `node --test tests/academy.recovery.ts`                     | 0          | 1 PASS; 81 documents restored into different demo project  |
| Linux `npm ci`                                              | 0          | Fresh dependency install                                   |
| Linux `npm run build:test`                                  | 0          | TEST CONFIG ONLY; network disconnected                     |
| Linux `node scripts/verify-test-build.mjs`                  | 0          | Actual server/client compiled Firebase targets verified    |
| `node --check scripts/academy-hosted-qa.mjs`; QA plan mode  | 0          | Prepared operator script; run mode NOT EXECUTED            |
| `npm audit --json`                                          | 1          | Four low; zero moderate/high/critical                      |
| Firebase read-only `projects:list --json --non-interactive` | 1          | Not authenticated; UNKNOWN, no login                       |
| Git provenance/source hashes/whitespace                     | 0          | 139 reviewed build inputs match; protected worktrees clean |

178 reported automated passes: 54 unit + 90 Rules test nodes + 33 browser scenarios + 1 recovery test. HTTP assertions counted separately. Rules nodes are not SDK-operation counts. Tests are sequential when they reseed the same demo project. All final counts have zero failures/skips; intermediate harness failures were corrected without removing assertions. Initial install was interrupted by PowerShell native warning handling; repeat installation exited 0. First Rules attempt had active-access failures; an unchanged sequential rerun passed all 90, so first attempt is not counted as PASS. Recovery callback return type and build-verifier compiler string representation were corrected; final check and actual artifact verification pass.

## Artifact

Node 24.21.0/npm 11.19.0/Java 21. Linux image `node:24.21.0-bookworm-slim`, digest `sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20`. Docker network map `{}` during build. 139-file SHA manifest and artifact remain outside Git. Rules SHA-256 `849df8a238e0f6cfef6459b91240781f16702c932c779419fc808b3a22fce11e` (unchanged Phase 1C); build archive SHA-256 `2903413a99be809c3193491460245f6e83e78dc34598d9058c04daf919a5108a`. Compiled server JS digest `d08e002ed4e63f8e38fe3a544bec70b18979238e3ce0fc9d10660d9856dba373`; compiled browser JS digest `d226da64c21e26c0f26a8e4f22a89581cc95fea4fb60037af558aab06ae26702`. These are test-only identities, not a deployable staging artifact. Owned test services/browser contexts/container stopped after checks.

## Changes

Four readiness-tool/test files:

```text
scripts/academy-hosted-qa.mjs
scripts/verify-test-build.mjs
tests/academy-readiness.test.ts
tests/academy.recovery.ts
```

Documentation manifest:

```text
docs/academy-phase1d/00_EXECUTION_SUMMARY.md
docs/academy-phase1d/01_ENVIRONMENT_MAPPING.md
docs/academy-phase1d/02_FIREBASE_RULES_COMPATIBILITY.md
docs/academy-phase1d/03_PREVIEW_PROTECTION.md
docs/academy-phase1d/04_REAL_YOUTUBE_QA_PLAN.md
docs/academy-phase1d/05_CONTENT_AND_ROLE_READINESS.md
docs/academy-phase1d/06_RECOVERY_AND_MONITORING.md
docs/academy-phase1d/07_OWNER_DECISION_REGISTER.md
docs/academy-phase1d/08_RELEASE_GATE.md
docs/academy-phase1d/pilot-lesson-readiness.example.json
```

Nine numbered reports `00`–`08` and `pilot-lesson-readiness.example.json`: 14 new files total against Phase 1C. No active GitHub workflow or CODEOWNERS assumption was introduced. Raw platform discovery, confidentiality/history scan, fixture snapshot, logs and build outputs stay outside Git. Public documents omit private infrastructure targets, Drive IDs/URLs, reviewer identities, credentials and diagnostic bodies.

DEPLOYED RULES — NOT VERIFIED. REAL YOUTUBE PLAYBACK — NOT VERIFIED. Owner approvals and real account provisioning NOT VERIFIED. Synthetic Firestore restoration PASS; Auth/index/asset restoration and hosted build/config/Rules rollback NOT VERIFIED.
