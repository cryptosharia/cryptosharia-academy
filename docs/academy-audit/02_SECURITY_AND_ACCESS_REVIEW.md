# Phase 0 — security dan akses

Internal lokal. Baseline `9423cefae98d1ce1797be58b0da705b059a9ce21`. Tidak memuat credential, token, rekening, PII atau URL/ID file Drive privat. Tidak membuat issue/PR publik. Jika laporan dibagikan, buat ringkasan umum setelah owner review.

## Kesimpulan evidence

Authorization/data exposure Firebase: NOT VERIFIED. Uji exploit SDK/REST: BLOCKED. Tidak ada rules lokal/deployed export, emulator configuration atau isolated test project. Firebase CLI dan connector rules tidak tersedia. Tidak menganggap hidden button atau upload API sebagai bukti keamanan database. Tidak mengirim request ke database production untuk membuktikan temuan.

| ID | Prioritas / severity indikatif | Status | Evidence | Konsekuensi dan uji lanjutan |
| --- | --- | --- | --- | --- |
| SEC-01 | P0 / High | NOT VERIFIED | Catalog getDocs seluruh `elearning_courses` pada e-learning/+page.svelte:27–32; ID player getDoc:64 sebelum/independen hasAccess | Jika rules mengizinkan dokumen tersebut, array lessons termasuk videoUrl terbaca walaupun iframe tertutup. Uji query dan direct doc guest/unauthorized/expired/revoked dengan dummy URLs pada emulator memakai rules aktual |
| SEC-02 | P0 / High | NOT VERIFIED | Client setDoc/deleteDoc CMS; client profile/order/grant writes; rules tidak tersedia | Kemungkinan privilege escalation/IDOR jika rules longgar. Uji user lain, field grant/status/role/email forged dan direct SDK writes tanpa UI |
| SEC-03 | P0 / High | PARTIAL | Email allowlist browser di admin.ts:1, admin/orders:7, admin/courses:173; admin/vouchers:1–102 tanpa guard | UI admin control tidak menjadi trusted boundary; vouchers bahkan tidak punya guard UI. Rules denial masih NOT VERIFIED. Ganti trust dengan server-controlled roles/claims + denial tests |
| SEC-04 | P0 / High | FAIL | admin/courses:703 → save:227,235 → player src:146; landing helper:913–914 | URL arbitrary diterima sebagai source iframe; negative helper tests terbukti diteruskan. Arbitrary embedding/unsafe scheme handling terkonfirmasi statis; XSS execution dan exploit lintas origin NOT VERIFIED. Validasi URL bersama + controlled browser test |
| SEC-05 | P0 / High | PARTIAL | ID player:10–33, subscription/[id]:9–30 | One-shot entitlement, clock client, no timer/listener/cancellation; stale response bisa overwrite hasil user baru. Runtime race NOT VERIFIED. Uji switch account, delayed responses, revoke/expiry saat tab terbuka |
| SEC-06 | P0 / High | FAIL | admin/orders:53 lalu 65/76; purchasedUnits read-modify-write:61–66 | Status order dan grant tidak atomic; dua approval unit bisa kehilangan grant. Renewal dihitung dari now, bukan max(now,currentExpiry); repeated approval dapat mengganti expiry. Pola kode terkonfirmasi; failure/race runtime belum direproduksi. Trusted transaction/idempotency dalam scope berikutnya |
| SEC-07 | P0 / High | PARTIAL | checkout menulis amount/status/userId/type/planId; voucher validation client | Price tampering, unauthorized status/grant dan redemption cap bergantung rules/backend yang belum terbukti. usedCount tidak di-increment pada submit. Uji hanya dummy order jika payment kelak diizinkan |
| SEC-08 | P0 / High | NOT VERIFIED | src/lib/firebase.ts tidak memakai emulator/env guard; Vercel connector results kosong | Preview isolation tidak bisa dibuktikan; jangan menjalankan app berkonfigurasi live. Owner sediakan nonsecret environment mapping dan isolated backend |
| SEC-09 | P0 / High | FAIL | Drive metadata permission `anyone: writer`, `allowFileDiscovery=false` | Link holders memiliki izin writer menurut metadata; owner confirmation/inheritance NOT VERIFIED. Tidak mencoba edit. Owner review sharing, approved-content integrity dan audit history |
| SEC-10 | P0 / High | FAIL | npm audit: 14 affected packages, 2 critical | Dependency hygiene gagal; exploit reachability NOT VERIFIED. Triage build/runtime chain dan patch reviewed, tanpa npm audit fix di Phase 0 |
| SEC-11 | P1 / Medium | PARTIAL | firebaseAuth.ts:19–45; blob upload +server.ts | Token lookup server ada, tetapi authorization berdasarkan email dan tidak mengecek emailVerified/claim; proof abuse NOT VERIFIED. Gunakan trusted role, uji unverified identity, revoked/expired token dan provider policy isolated |
| SEC-12 | P1 / Medium | PARTIAL | auth.svelte.ts:49–52; profile:88–91; admin courses:184–187 | Auth listener tidak diekspos cleanup; profile load async tanpa uid guard; beberapa snapshot tanpa error callback. Potensi stale PII/loading indefinite. Uji lifecycle/race dan denied/network errors |

FAIL pada SEC-04/06/09/10 berarti invariant/konfigurasi yang diperiksa gagal, bukan kebocoran production atau exploit berhasil.

## Firestore read/write inventory

Seluruh pemanggilan mutasi/snapshot pada `src` ditelusuri dengan `rg`; tidak ditemukan trusted backend untuk order/entitlement/course mutation. Server route yang ditemukan hanya `/api/blob/upload`.

| Collection / document | Read/listen | Client mutation | Enforcement yang dibutuhkan |
| --- | --- | --- | --- |
| elearning_courses | Catalog e-learning:27, subscription:24, units:28; player e-learning/[id]:64, subscription/[id]:46, units/[id]:49; CMS onSnapshot:184 | admin/courses setDoc:235, deleteDoc:249, seed writeBatch:304–314 | Published metadata only public; lesson references terpisah entitlement-restricted; trusted admin schema/status transitions |
| users/{uid} | auth save profile:26; entitlement player:14/13; profile:101; admin approval:62 | auth setDoc:30,41,123; profile setDoc:129; admin purchasedUnits/subscription updateDoc:65/76 | Own profile allowlist field; immutable uid/email/roles/grants; server/admin-only grants; cross-user deny |
| orders | admin/orders onSnapshot:27; profile onSnapshot:88 filtered own userId | checkout addDoc payment/e-learning:44, payment/subscription:106, units/[id]:93; admin/orders updateDoc:53,95 | Own create/read minimal fields; trusted prices/transition; immutable owner/type/amount; admin scoped; atomic grant |
| vouchers | admin getDocs:36; checkout query subscription:82, units/[id]:70 | admin addDoc:70, updateDoc:75, deleteDoc:93 | Admin-only management, safe bounded validation, quota transaction; no broad unauthenticated listing |
| site_content/landing | landingContent getDoc:1942, onSnapshot:1952 | landingContent setDoc:1966, merge:false | Public approved read and admin write. Masterclass mutation out of scope; jangan mengubah dokumen ini |
| Progress / separate entitlement | Tidak ditemukan | Tidak ditemukan | Rancang per-user progress dan scoped immutable grants; rules tests sebelum implementasi |

Client mengambil seluruh document; mapping TypeScript `Course` atau tidak menampilkan field di UI tidak menghapus field dari response. Security Rules mengizinkan/menolak document, sehingga pisahkan metadata publik dan lesson sensitif. Query public saat ini juga tidak memfilter published; rules berbasis published memerlukan query kompatibel, bukan menganggap rules akan memfilter hasil otomatis.

CMS seed bukan operasi insert-if-missing: `batch.set` tanpa merge/existence check pada IDs berbasis judul dapat menimpa dokumen existing, sementara dialog menyebut membuat dokumen baru jika belum ada. Tidak menjalankan seed. CMS edit menggunakan shallow copy course sehingga nested array lessons bisa ikut berubah dalam state sebelum save; concurrent editors memakai last-write-wins. Publish/rollback perlu stable ID, version/revision checks dan approval record.

## Auth dan hak akses

Firebase SDK mengelola auth client. Tidak ditemukan session-cookie middleware/hook atau server load guard untuk materi. Global layout menginisialisasi auth; `onAuthStateChanged` menyelesaikan loading, tetapi entitlement punya async lifecycle tersendiri. UI guest dan unauthorized sama-sama diarahkan subscription; tidak ada state entitlement loading yang eksplisit. Kegagalan profile write setelah login/signup dapat menghasilkan pesan gagal walaupun Firebase auth telah sukses.

Player ID hanya memeriksa subscriptionStatus active dan expiry. Tidak mengecek purchasedUnits, scope subject/course, explicit revokedAt atau privileged admin preview. Admin memiliki UI CMS, tetapi belum ada override playback khusus. Profil menampilkan teks langganan aktif tanpa membaca status aktual. Slug player berbeda: mock, video hardcoded dan tanpa entitlement gate; ini route demo publik terkonfirmasi dari kode, bukan bukti akses ke video membership asli.

## Role matrix — expected target, belum dijalankan

Setiap cell adalah expected acceptance; observed enforcement seluruh row NOT VERIFIED karena rules/emulator belum ada.

| Actor | Metadata published | Draft/unapproved | Private lesson/video ref | Profile/grants | Course/order admin mutations |
| --- | --- | --- | --- | --- | --- |
| Guest | Allow sanitized metadata | Deny | Deny | Deny | Deny |
| Logged in tanpa grant | Allow | Deny | Deny | Own profile fields only; deny grant writes | Deny |
| Active scoped member | Allow | Deny | Allow hanya scope granted | Own progress/profile; deny grant writes | Deny |
| Expired member | Allow | Deny | Deny pada request-time | Own historical progress; deny grant writes | Deny |
| Revoked member | Allow | Deny | Deny pada request-time | Own history; deny grant writes | Deny |
| Verified admin | Allow | Allow sesuai role | Allow explicit admin preview policy | Scoped management + audit record | Allow validated operation sesuai role |

## YouTube flow dan uji lokal

Admin text input → formData.lessons[].videoUrl → Firestore setDoc → catalog/player doc.data → iframe.src mentah. Tidak ada parser/allowlist pada jalur Academy. Reading/quiz memakai src video yang sama ketika URL disediakan; ikon saja berubah.

Helper reusable `resolveVideoEmbed` di landingContent:890–914 mendukung beberapa URL, tetapi regex substring bukan hostname validator dan fallback arbitrary URL. Uji dilakukan melalui ekstraksi fungsi murni ke Node; tidak mengimpor Firebase module, tidak navigasi atau menjalankan input negatif. Exit 0 berarti harness selesai, bukan semua acceptance PASS.

| Input lokal | Hasil helper landing | Academy saat ini | Status acceptance parser aman |
| --- | --- | --- | --- |
| https://youtu.be/ethrPMuAayU?si=Gb5QPRVzlh_oDWjR | Official embed untuk ID yang sama | Raw short URL | PARTIAL |
| https://www.youtube.com/watch?v=ethrPMuAayU | Official embed untuk ID yang sama | Raw watch URL | PARTIAL |
| https://www.youtube.com/embed/ethrPMuAayU | Official embed untuk ID yang sama | Raw embed URL | PARTIAL |
| https://youtube.com/shorts/ethrPMuAayU | Official embed untuk ID yang sama | Raw shorts URL | PARTIAL |
| javascript: | Diteruskan ke iframe fallback | Raw nonempty src | FAIL |
| https://youtube.com.evil.example/watch?v=ethrPMuAayU | Diteruskan ke iframe fallback | Raw lookalike host | FAIL |
| https://www.youtube.com/watch?v=bad | Diteruskan ke iframe fallback | Raw invalid ID | FAIL |
| URL kosong | kind:none | Video placeholder | PASS untuk helper empty handling saja |
| ID valid + suffix tambahan | Regex memotong jadi ID 11 karakter | Raw invalid URL | FAIL |

Usulan Phase 1: satu parser pure menggunakan `new URL`, HTTPS only, exact hostname allowlist `youtube.com`, `www.youtube.com`, `m.youtube.com`, `youtu.be` dan official nocookie embed hosts jika disetujui. Tolak userinfo/port tak disetujui, malformed/duplicate IDs dan unknown paths; full ID match `^[A-Za-z0-9_-]{11}$`. Derive embed URL sendiri dari ID; jangan iframe arbitrary fallback. Gunakan ulang parser di admin, persisted-content validator dan player. Video availability/rights tetap perlu pemeriksaan tersendiri.

Iframe Academy mempunyai title dan allow controls tetapi tidak memasang referrerpolicy eksplisit; hanya root Masterclass iframe yang memiliki strict-origin-when-cross-origin. Tidak ada CSP lokal di svelte.config.js/hooks/app yang ditemukan; deployed headers NOT VERIFIED. Svelte interpolation melakukan escaping, tidak ditemukan `{@html}` pada source yang ditelusuri, tetapi escaping tidak memvalidasi scheme/host. Jangan mengklaim XSS tanpa controlled browser reproduction.

[Dokumentasi IFrame API](https://developers.google.com/youtube/iframe_api_reference) menjelaskan error 153 untuk request tanpa HTTP Referer atau identifikasi setara, 101/150 untuk embedding tidak diizinkan, serta 100 untuk unavailable/private. Verifikasi browser harus dari halaman di domain preview isolated yang benar; response oEmbed atau sukses normalisasi URL tidak cukup. [Privacy-enhanced embed](https://support.google.com/youtube/answer/171780) memakai youtube-nocookie.com; itu bukan DRM atau jaminan konten tidak bisa disebar. Unlisted bukan entitlement protection.

## Upload terpisah dari CMS database

`api/blob/upload/+server.ts`: server membaca Blob secret, memvalidasi scope/path pattern, mengambil ID token dari Bearer/payload, melakukan Firebase accounts lookup dan mengecek email allowlist; content types gambar dan limit 5 MB diberikan pada Blob token. Client upload `blobUpload.ts` menggunakan `access:public`. Ini kontrol server nyata secara statis: PARTIAL, belum runtime PASS. Tidak menguji upload atau token lookup live.

Tidak ada emailVerified/custom claims check pada user hasil lookup; perlu review role provisioning, revocation dan verified identity di isolated project. MIME/size constraints bukan bukti pemeriksaan byte signature atau malware scan. Jangan gunakan public Blob ini untuk PDF/slide/video membership tanpa kebijakan baru. Upload API tidak menegakkan izin `setDoc`/`deleteDoc` Firestore; rules harus dinilai terpisah.

## Rencana reproduksi terkendali

1. Owner menyediakan export rules/indexes saat ini + nonsecret project identity. Simpan evidence internal, checksum dan waktu; jangan menulis rules production.
2. Siapkan Firebase Emulator Auth/Firestore dengan demo project atau dedicated isolated project yang jelas berbeda dari production. Jika tidak tersedia, pertahankan BLOCKED; jangan memakai allow-all rules sebagai bukti current security.
3. Buat fixture sintetis: published metadata, draft, lesson privat dummy, enam actor, expiry server-time, revoked grant, own/other profiles dan dummy pending order. Tidak menggunakan PII/media privat nyata.
4. Dengan @firebase/rules-unit-testing atau SDK/REST emulator, uji list/query/direct-get sebelum UI, role matrix, writes setiap inventory, immutable fields dan cross-user access. Uji auth null, spoofed userId, approved status/grant mutation sebagai peserta; asserted denial dan write invariants. Tidak menuliskan payload exploit production di laporan publik.
5. Uji missing config fail-closed, expiry crossing, revocation, account-switch response ordering, concurrent grants, partial write failure dan idempotency. Admin SDK bypasses rules: pakai hanya fixture setup, bukan assertions izin peserta.
6. Catat expected/observed/status dan evidence redacted per actor/path. Emulator memakai rules aktual untuk baseline; rules target diuji terpisah sesudah fix. Jalankan ulang seluruh suite pada commit Phase 1.

Tidak ada POC akses production yang dijalankan; data exposure, privilege escalation, IDOR dan XSS production tetap NOT VERIFIED.
