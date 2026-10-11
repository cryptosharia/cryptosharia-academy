# Phase 0 — scope MVP dan backlog Phase 1

Baseline `9423cefae98d1ce1797be58b0da705b059a9ce21`. Dokumen ini rencana; belum ada implementasi atau aktivasi. Phase 1 menunggu review owner. Estimasi waktu tidak diberikan karena rules, content readiness, staffing dan model akses belum tersedia.

## Produk target

Academy adalah belajar mandiri berbasis modul. Masterclass empat pertemuan, landing dan flow-nya tetap out of scope. Referensi [MySkill](https://myskill.id/) digunakan untuk prinsip pemisahan katalog e-learning vs bootcamp dan navigasi bertahap; jangan menyalin desain merek/konten/statistik. Player/account/resume signed-in MySkill belum diperiksa.

Empat bidang: Analisis Fundamental, Analisis Teknikal, Fikih Muamalah, Web3 & Blockchain. Rencana tiap bidang 6 level × 7 bab = 42 bab, total 168 bab silabus; tidak menganggapnya 168 video edited/approved/uploaded. Metadata Drive mendukung keberadaan empat dokumen bidang dan file MOV pada folder tim video, bukan bukti seluruh bab lengkap. Deck/rights/durasi/status approval belum diverifikasi.

MVP minimum: katalog bidang/level/bab dengan metadata published; login; CMS draft/review/approve/publish; video YouTube tervalidasi; entitlement scoped yang ditegakkan rules/trusted service; progress dan resume nyata. Model gratis/berbayar/langganan/invite-only belum diputuskan. Preview menggunakan synthetic grants dan content test yang disetujui; jangan mengaktifkan bank/WhatsApp/payment/voucher. Pemilik konten wajib menyetujui video test sebelum ditayangkan. Quiz/scoring/certificate di luar minimum kecuali owner menaikkan scope beserta acceptance dan reviewer.

## Model data yang diusulkan

Tidak melakukan migration/seed. Pilih collection layout final setelah rules dan query design dibuktikan; berikut kontrak logis, bukan skema production final.

| Entity | Field minimum | Boundary |
| --- | --- | --- |
| Subject | stable subjectId, approved name, sortOrder, summary, outcomes | Public hanya approved/published metadata |
| Level | stable levelId, subjectId, levelNumber 1–6, sortOrder, outcomes | Hierarchy eksplisit; empty level tidak mengklaim konten siap |
| Chapter | stable chapterId, levelId, sortOrder 1–7, title, outcomes, durationSeconds, instructorId, status, version | Metadata published terpisah dari private media |
| Lesson | stable lessonId, chapterId, sortOrder, type video/reading, title, durationSeconds, instructorId, status/version | Content privat harus entitlement-restricted |
| Video asset | assetId, provider, validated videoId, derived embed policy, sourceStage raw/edited, review state, uploadedAt, availabilityCheckedAt, rightsOwner/ref, access policy | Jangan public raw source link/Drive ref; approval != uploaded != published |
| Reading/material | materialId, MIME/type, approved storage ref, rights/access metadata, caption/subtitle refs bila ada | Sanitize renderer dan access per material |
| Approval | contentId/version, reviewerId, reviewedAt, decision, rightsConfirmed, syariahReviewerId/approval record, publishedBy/publishedAt | Trusted immutable audit; edit setelah approval perlu review versi baru |
| Entitlement | stable grantId, uid, scopeType/scopeId, source, state active/revoked, startsAt/expiresAt/revokedAt, grantedBy, audit ref | Server/admin-owned; request-time validity memakai server time |
| Progress | uid + lessonId, lastPositionSeconds, completion policy/status, updatedAt, contentVersion, lastLessonId per chapter/course | Peserta hanya own progress; grant dan completion certificate tidak self-assignable |

Status editorial: draft → review → approved → published; archived/unpublished jika dibutuhkan owner. Publication memerlukan approval versi yang sama, rights dan review syariah yang relevan. Stable IDs tidak dibuat dari judul semata agar perubahan judul tidak mengubah identity/progress. Durasi numerik; label bahasa adalah display. Sort ordering explicit. Public catalog tidak boleh mengandung private playback/reference fields.

Manifest kurasi internal menghubungkan subject/level/chapter/lesson ke assetId dan rights/approval records. Owner dapat menambahkan referensi sumber privat di manifest berizin; jangan masukkan URL Drive privat ke repo/issue publik. Asset stage harus membedakan raw, edited, approved, uploaded dan published sebagai evidence berbeda. Tidak auto-import seluruh folder atau publish semua hasil listing.

## Urutan unit implementasi dan acceptance

| Urutan | Unit | Prioritas | Acceptance criteria | Dependensi |
| --- | --- | --- | --- | --- |
| 1 | Review audit dan keputusan akses/content owner | P0 | Owner memilih model akses awal, siapa grant/review/publish, kebijakan preview admin dan video rights; Masterclass excluded | Owner, penanggung jawab syariah |
| 2 | Provision dedicated staging / emulator dan environment contract | P0 | Nonsecret mapping Vercel preview → Firebase isolated terbukti; prod routing diblok; env key names sesuai imports; side effects bank/WA/email off | Project owner/devops; tidak pada Phase 0 |
| 3 | Baseline build/check/lint repair + dependency triage | P0 | npm ci/check/lint/build exit 0 dengan approved isolated config; tujuh error kode diperbaiki; advisory high/critical patched atau documented reviewed reachability decision; README sesuai actual stack | Unit 2; reviewer dependency changes |
| 4 | Export current rules dan automated access tests | P0 | Rules versioned internal; six-role queries/direct reads/writes asserted; forged grant/role/order state dan other user access deny; fixture sintetis | Unit 2; actual rules owner |
| 5 | Public/private content model + scoped grants | P0 | Public query tidak mengembalikan playback/private refs; active authorized scope allow, guest/unauthorized/expired/revoked deny; publication server/rules enforced | Unit 4 dan access policy |
| 6 | Auth/session lifecycle | P0 | Google/email/register/logout, slow auth, canceled popup, profile-write failure, logout/account-switch stale response diuji; loading terpisah dari denied; own profile immutable grant fields | Units 2,4,5 |
| 7 | Curated catalog hierarchy | P0 | Empat bidang riil, ordered level/chapter/lesson, stable IDs/outcomes; hanya approved published muncul; empty categories transparan; tidak menjalankan default seed | Approved manifest + unit 5 |
| 8 | CMS validation + review/publish gate | P0 | Authorized admin CRUD, restricted roles, validation IDs/URL/types; draft invisible; wrong-version approval tidak publish; audited approval; concurrent edit conflict aman | Units 4,5,7; syariah reviewer |
| 9 | Shared YouTube parser + canonical player | P0 | Semua positive input menghasilkan same ID/embed; semua negatives rejected; mock slug retired/replaced scoped; lessons berpindah benar; browser playback approved video dari proper domain tanpa error 153 | Units 5–8; embed owner permission |
| 10 | Entitlement freshness + expiry/revoke behavior | P0 | Open tab revoke/expire dan switch user tidak mempertahankan prior access; request-time rules deny; unit grant/admin preview mengikuti keputusan scope | Units 5,6,9 |
| 11 | Progress / persistence / resume | P0 | Lesson/time persist setelah reload dan device kedua; own-user writes only, bounded values dan idempotent save; revoke tidak memberi media access lewat history | Stable IDs dan role rules |
| 12 | Clean Academy marketing + payment containment | P0 | Unsupported 1400+,125K+,4.9/5,alumni,certificate/testimonial removed/verified; harga tidak dijanjikan; checkout/notification dinonaktifkan untuk MVP preview/pilot sesuai keputusan owner | Marketing owner + unit 1 |
| 13 | Release evidence + isolated restore/rollback rehearsal | P0 | Gate report pada SHA target, six-role suite, mobile/playback/content approval, restore backup dan rollback artifact rehearsal isolated; owner sign-off | Semua P0 |
| 14 | Reading/PDF/slides/subtitle, recovery password | P1 | Approved attachment readable dan restricted; unsafe URL denied; accessible captions; recovery hanya sandbox saat QA | Content rights/provider + auth config |
| 15 | Accessibility/error/SEO/dashboard/observability | P1 | 360–1280 layouts, keyboard/focus/dialog, explicit denied/network/404, real subscription status, neutral metadata dan redacted audit events | Canonical player + config |
| 16 | Payment jika bisnis menyetujui fase berikutnya | P1 | Trusted price/order transition, atomic idempotent grant, renewal max(currentExpiry,now), voucher quota atomic, bank/payment sandbox; no real send pada QA | Approval bisnis tertulis; bukan MVP default |
| 17 | Quiz, server-validated scoring, verifiable certificate | P2 | Questions/reviewer approved, attempt policy, scoring resistant tampering, issuance auditable/revokeable; marketing baru sesudah nyata | Kurikulum dan assessment policy |
| 18 | Advanced search, recommendations, analytics | P2 | Data nyata, privacy agreed, performance measured | Pilot usage; jangan prioritaskan template counts |

Risiko content seed: admin/courses:297–314 memakai batch.set tanpa existence guard; jangan gunakan seed default sebagai shortcut migrasi. Tidak mengganti framework/stack sekadar mengikuti README; minimalkan reuse per flow setelah rules terbukti.

## Keputusan dan evidence owner yang masih dibutuhkan

- Firebase production/staging identity, deployed rules/indexes dan read-only export; Vercel team/project/domain/env target mapping tanpa secret. Credential dipasang owner melalui mekanisme aman, tidak dikirim di chat/laporan.
- Grant policy gratis/invite/paid/subscription, scope per bidang/level/chapter, expiry/revoke/admin preview, role provisioning dan email verification.
- Manifest bab/asset readiness, video editing/hosting/embed permission, ownership/rights, captions, approval content/syariah versi tertentu. Empat bidang × 168 bab tetap rencana sampai isi silabus diperiksa.
- Owner Drive konfirmasi `anyone:writer`, intended sharing/inheritance dan remediation owner-led; jangan mengubah akses sepihak.
- Evidence statistik/testimonial/sertifikat/harga jika ingin ditampilkan; jika tidak, hilangkan dari Academy publik pada implementasi berikutnya.
- Backup retention, RPO/RTO, restore owner, monitoring/incident owner, dan release sign-off. Tidak ada estimasi yang bisa dipertanggungjawabkan sebelum dependency tersebut jelas.

Phase 0 berhenti setelah laporan. Backlog ini tidak mengotorisasi implementasi, pembayaran, publikasi atau deployment.
