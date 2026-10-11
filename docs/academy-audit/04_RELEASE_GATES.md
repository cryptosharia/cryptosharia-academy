# Phase 0 — release gates dan go/no-go

Baseline `9423cefae98d1ce1797be58b0da705b059a9ce21`, 10 Oktober 2026. Checkbox belum dicentang berarti evidence belum memenuhi gate; status kolom memakai vocabulary audit. GO/NO-GO adalah keputusan tahap, bukan status feature.

| Tahap                    | Keputusan saat ini | Alasan                                                                                                                       |
| ------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Penyerahan audit Phase 0 | GO                 | Audit statis, tooling dan laporan lokal selesai; limitation runtime/rules dinyatakan eksplisit. Bukan security certification |
| MVP preview              | NO-GO              | Config/build blocked, check/lint gagal, rules/isolation belum terbukti, mock/approval/progress belum selesai                 |
| Pilot peserta nyata      | NO-GO              | Semua gate preview belum terpenuhi; content rights/syariah, access model dan backup belum terbukti                           |
| Production               | NO-GO              | Belum ada role test, browser playback, isolated staging, content/marketing approval atau restore evidence                    |

## Gate wajib

| Check | Gate                                | Status baseline | Evidence minimum untuk memenuhi                                                                                                                    | Owner                   |
| ----- | ----------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| [ ]   | Repo dan artifact provenance        | PARTIAL         | SHA target, source diff, dependency lock, reviewed artifact dan tidak mencampur Masterclass                                                        | Engineering             |
| [ ]   | Env contract                        | FAIL            | Semua import key terdokumentasi, isolated config diset owner; tidak memakai dummy untuk PASS                                                       | Engineering/ops         |
| [ ]   | npm ci/check/lint/build             | FAIL            | Semua exit 0; check/lint error ditutup; output build SHA terikat. Build saat ini BLOCKED BY CONFIG                                                 | Engineering             |
| [ ]   | Dependency security                 | FAIL            | 14 registry findings ditriage; high/critical patch atau reviewed nonreachability exception dengan expiry; bukan auto-fix buta                      | Security reviewer       |
| [ ]   | Firestore rules current + target    | NOT VERIFIED    | Export/version rules; emulator suite current baseline dan target; no allow-all fallback                                                            | Firebase owner          |
| [ ]   | Six-role access matrix              | BLOCKED         | Guest, unauthorized, active scoped, expired, revoked, verified admin; list/query/direct read dan every write path tested di isolated environment   | Security/QA             |
| [ ]   | No private data in public catalog   | NOT VERIFIED    | Dummy private ref tidak ada di guest/unauthorized response; published-only query; metadata terpisah lesson                                         | Engineering/QA          |
| [ ]   | Admin enforcement / grants          | NOT VERIFIED    | Verified trusted role; normal user tidak bisa CMS, voucher, approve order, grant, own-role escalation, other-user mutation                         | Security/ops            |
| [ ]   | Session / entitlement freshness     | PARTIAL         | Logout/switch/revoke/expiry/two-session tests; server-time request check, fail-closed loading/errors                                               | Engineering/QA          |
| [ ]   | Canonical player dan URL parser     | FAIL            | Positive variants normalized, negatives reject, no arbitrary iframe URL, approved canonical lesson route                                           | Engineering             |
| [ ]   | YouTube browser playback            | NOT VERIFIED    | Approved video dimainkan pada domain target isolated desktop/mobile, correct Referer, owner embedding aktif, error handling/captions evidence      | Content owner/QA        |
| [ ]   | Curated hierarchy                   | PARTIAL         | Empat bidang riil, stable IDs/order/outcomes, hanya bab siap approved dipublikasikan; 168 bab tidak diklaim sebagai video-ready                    | Curriculum owner        |
| [ ]   | Content approval / rights / syariah | NOT IMPLEMENTED | Approval reviewer berwenang pada versi yang dipublish, instructor consent/rights, evidence video edited/approved/uploaded                          | Content/syariah owner   |
| [ ]   | Drive integrity                     | FAIL            | Owner review metadata anyone:writer, keputusan sharing/inheritance dan protection approved assets; tanpa perubahan sepihak                         | Drive owner             |
| [ ]   | Marketing evidence                  | MOCK            | Unsupported counts/rating/alumni/certificates/example testimonials removed atau evidence approved; Academy metadata/title netral                   | Marketing/product owner |
| [ ]   | Model bisnis / payment containment  | PARTIAL         | Access policy diset; bank/order/WA/payment/email/voucher off pada MVP; sandbox evidence jika kelak payment masuk scope                             | Product/QA              |
| [ ]   | Progress / resume                   | NOT IMPLEMENTED | Own-user persistence, reload/device-second resume, bounds/conflict/error handling; historical progress tidak membuka private lesson                | Engineering/QA          |
| [ ]   | Responsive/accessibility/SEO/errors | PARTIAL         | Mobile/keyboard/screen-reader smoke; labeled controls, focus, captions; explicit empty/denied/error; sanitized SSR metadata published              | QA                      |
| [ ]   | Vercel preview isolation            | NOT VERIFIED    | Team/project/domain/source SHA dan preview targets tervalidasi; Firebase project ID berbeda prod; Auth/Firestore/Blob/side-effect mapping explicit | Ops                     |
| [ ]   | Logging/monitoring                  | PARTIAL         | Redacted auth/publish/grant/error audit, no PII/token, alert owner + incident procedure; tracked debug logs reviewed                               | Engineering/ops         |
| [ ]   | Backup/restore/rollback             | NOT VERIFIED    | Recovery plan approved, backup inventory/retention, successful restore dan artifact/rules rollback rehearsal isolated                              | Ops/data owner          |

Tidak cukup membuktikan env variable bernama preview. Firebase `$env/static/public` tertanam saat build: bandingkan identity build artifact yang benar dengan approved nonsecret project map, bukan hanya label deployment. `.vercel/output` yang sudah ada sebelum audit bukan proof current deployed code atau isolation. Connector tidak menemukan project/team; jangan menebak project/domain atau menganggap tidak ada deployment.

## Bukti isolasi yang harus direkam

1. Owner memberikan production/preview project map dengan ID nonsecret, allowed auth domains, database dan Blob target, commit SHA/build artifact serta approved preview domain. Tidak menyimpan env values/token di laporan.
2. QA membuktikan build preview memakai Firebase isolated project dan rules intended. Firestore/Auth emulator endpoints atau dedicated project berbeda harus terlihat dalam konfigurasi yang direview; test write hanya fixture isolated. Dedicated Blob store atau upload off.
3. Bank/payment orders, WhatsApp handoff, email/reset delivery dan external callbacks diblok/diarahkan sandbox. Periksa navigation/request destinations; jangan mengklik real checkout atau external send selama audit.
4. Jika identity/routing/permissions tidak bisa dibuktikan, STOP pengujian mutasi dan NO-GO. Hasil UI/build tidak dapat melewati gate ini.

## Backup dan rollback — rencana, belum operasi

Pada Phase 0 hanya menyusun rencana; tidak menjalankan export DB, restore, data migration, deploy promotion atau rollback production.

| Langkah fase berikutnya     | Acceptance / evidence                                                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inventory backup owner-led  | Firestore content/grants/progress/profiles, deployed rules/indexes, approved asset refs, Blob/content retention; klasifikasi PII dan access backup       |
| Tentukan recovery target    | Owner memilih RPO/RTO/retention dan maintenance/release owner; jangan mengarang angka                                                                    |
| Baseline recovery version   | Reviewed code SHA/lock, rules/index version dan schema/content version; recovery artifact tidak menyertakan secrets dalam repo                           |
| Restore rehearsal isolated  | Backup yang berizin atau synthetic fixture dipulihkan ke isolated target; count/checksum/content links dan role rules diuji; no production overwrite     |
| Rollback rehearsal isolated | Kembalikan previous reviewed artifact + compatible rules/config/content manifest; test login/catalog/private read/progress; record elapsed time dan gaps |
| Release failure procedure   | Freeze publish/grant changes, owner incident review, pilih artifact recovery approved; data restore bukan otomatis konsekuensi code rollback             |
| Pilot exit review           | Monitoring error/access events, recovery evidence, content issues dan owner sign-off sebelum production                                                  |

Keputusan release berikutnya hanya berdasarkan evidence pada commit dan environment target. Read-only audit GO tidak mengotorisasi Phase 1, deployment atau payment activation.
