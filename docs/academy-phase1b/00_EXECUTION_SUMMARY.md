# Phase 1B — execution summary

11 Oktober 2026, Asia/Jakarta. Penyerahan lokal saja; tidak ada push, merge, deployment, perubahan production, Drive, pembayaran, atau notifikasi nyata.

**CANDIDATE RULES VERIFIED LOCALLY — DEPLOYED RULES NOT VERIFIED**

## Provenance

- Branch: `fix/academy-phase1b-secure-access`, worktree terpisah dari main dan Phase 1A.
- Parent Phase 1A diverifikasi: `32424e5fc8b584172841f0cfc3afbc72294a9b83`; working tree bersih sebelum pekerjaan.
- Commit implementasi: `52d7663e6cfaad3f0c4a01720df4c388781cccdd`.
- Commit laporan dibuat sesudah pengujian; exact final HEAD tersedia dalam handover dan `git rev-parse HEAD`.
- Main tetap `14f547f82f761e8e3faa19cc11411bf0ef3f04d7`; Phase 1A tetap parent di atas, keduanya bersih.
- Dokumen Phase 0/1A, AGENTS/steering, dan jalur Firebase/auth/catalog/player/CMS/profile/containment diperiksa. Masterclass source dan flow tidak diubah.

## Hasil final

| Pemeriksaan                 | Command                                                 | Exit       | Hasil                                                           |
| --------------------------- | ------------------------------------------------------- | ---------- | --------------------------------------------------------------- |
| Dependency install Windows  | `npm ci`                                                | 0          | 326 packages audited                                            |
| Check                       | `npm run check:test`                                    | 0          | 0 errors, 5 existing warnings                                   |
| Formatting + ESLint         | `npm run lint`                                          | 0          | PASS                                                            |
| Unit/regression             | `npm test`                                              | 0          | 36 PASS, 0 FAIL, 0 BLOCKED                                      |
| Candidate SDK + actual Auth | `node scripts/run-local.mjs test:rules`                 | 0          | 86 PASS, 0 FAIL, 0 BLOCKED                                      |
| Actual browser application  | `node scripts/run-local.mjs test:browser`               | 0          | 16 PASS, 0 FAIL, 0 BLOCKED                                      |
| Linux install               | `npm ci` inside local container                         | 0          | PASS                                                            |
| Linux build                 | `npm run build:test` inside disconnected container      | 0          | PASS — TEST CONFIG ONLY                                         |
| Dependency registry audit   | `npm audit --json`                                      | 1          | 4 low entries; 0 moderate/high/critical                         |
| HTTP regression             | local curl assertions                                   | 0          | 8 enabled/contained + 5 default-OFF + 4 offline assertions PASS |
| Offline launcher            | `node scripts/run-local.mjs test:rules`, after shutdown | 1 expected | PASS: stops before fixture setup                                |
| Whitespace/provenance       | `git diff --check 32424e5`                              | 0          | PASS after removing two extra EOF blank lines                   |

138 reported automated passes: 36 unit + 86 Node candidate test nodes + 16 browser scenarios. The Node total includes six parent test nodes; it is not a count of individual SDK operations. No required automated scenario remains BLOCKED. Eight external release blockers are listed in `05_REMAINING_BLOCKERS.md`; they are not converted into security PASS.

## Isolation and artifact

Project `demo-academy-phase1b`; Auth and Firestore fixed to loopback. Firebase CLI 15.33.0; Node 24.21.0, npm 11.19.0, Java 21. Emulator CLI config/state/logs are outside Git and inherited credentials are removed. Tests load candidate Rules before clearing/seeding isolated data; mismatch and offline conditions stop the harness. Browser requests to non-loopback destinations are aborted; YouTube frames receive synthetic HTML, without fetching media.

Linux image `node:24.21.0-bookworm-slim`, digest `sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20`. Container network map `{}` before build. 130 snapshot input files matched at build time. Build archive SHA-256: `D0FBCDCD3F0881530FEAA3C9A421890A13DD40D9B2E66CC606B69B8C4E0FC630`. Final documentation cleanup removes trailing blank lines only in the example environment and candidate Rules; application/build source remains identical. The other 128 snapshot files still match after this cleanup. Raw logs, hashes and archive stay outside Git. Own servers/emulators/container are stopped after verification.

## Changes and limitations

New public/private collections, scoped grants, own progress, verified role claims, versioned approval and append-only audits are enforced by Rules. Catalog, shared player and CMS use this model. Client email, role/subscription profile fields and frontend storage cannot grant access. Private reads use Firestore Lite for a fresh server RPC; grant listeners, expiry timers and request generations close the player on identity/access changes. Route changes also invalidate prior scope data.

Initial attempts exposed EOF/encoding issues, an unsafe assumption about reused full-SDK read targets at expiry, a mount-only route load, and browser assertions racing automatic reconnect. These were corrected; final results above supersede intermediate failures. LF attributes make fresh Windows worktree formatting reproducible without Masterclass source changes. No lint rules or type checking were disabled, and no dependency was added. Existing five placeholder-link warnings and four low cookie advisory entries remain documented.

GO: local Phase 1B handover and technical input for scoped local Phase 1C. Public preview, real pilot, production, live transactions/content publication: NO-GO. Playback, deployed Rules, organizational approval and real role provisioning are NOT VERIFIED.

## Manifest relative to Phase 1A

21 implementation/config/test files and seven reports, 28 unique files:

```text
.env.example
.gitattributes
firebase.emulator.json
firebase/academy-v1.rules
package.json
scripts/run-local.mjs
scripts/start-emulators.mjs
src/lib/academyData.ts
src/lib/academyPlayer.ts
src/lib/components/AcademyCatalog.svelte
src/lib/components/AcademyPlayer.svelte
src/lib/firebase.ts
src/lib/firebaseClient.ts
src/routes/admin/courses/+page.svelte
src/routes/e-learning/[id]/+page.svelte
src/routes/profile/+page.svelte
src/routes/subscription/[id]/+page.svelte
tests/academy-fixtures.ts
tests/academy-isolation.test.ts
tests/academy.browser.mjs
tests/academy.rules.ts
docs/academy-phase1b/00_EXECUTION_SUMMARY.md
docs/academy-phase1b/01_DATA_BOUNDARY.md
docs/academy-phase1b/02_RULES_TEST_MATRIX.md
docs/academy-phase1b/03_APP_INTEGRATION_TESTS.md
docs/academy-phase1b/04_ACCESS_LIFECYCLE.md
docs/academy-phase1b/05_REMAINING_BLOCKERS.md
docs/academy-phase1b/06_RELEASE_GATE.md
```
