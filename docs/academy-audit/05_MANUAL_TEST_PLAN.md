# Phase 0 — rencana tes manual isolated

Baseline `9423cefae98d1ce1797be58b0da705b059a9ce21`. Ini checklist untuk preview isolated pada fase berikutnya, bukan hasil tes yang sudah PASS. Runtime plan saat ini BLOCKED BY CONFIG dan isolation/rules NOT VERIFIED. Pure URL-helper check sudah dilaksanakan; evidence di 02. Jangan menguji mutasi/akses ke production.

## Prasyarat dan pencatatan

1. [ ] Owner review Phase 0 dan tentukan access policy/grant scopes/admin preview. Jangan lanjut implementasi/publish secara otomatis.
2. [ ] Sediakan rules current export + target rules version, Firebase emulator atau dedicated test project. Buktikan target bukan production sesuai 04.
3. [ ] Approved preview domain, Vercel team/project dan artifact SHA dicatat tanpa env values. Config valid dipasang owner; tidak memakai env palsu.
4. [ ] Jalankan npm ci/check/lint/build; semua exit 0. Tidak menganggap build PASS berarti feature/security PASS.
5. [ ] Bank/payment/WA/email nyata/upload callbacks off; manual checkout tidak boleh membuka penerima nyata. Recovery-email test hanya Auth emulator/sandbox delivery.
6. [ ] Gunakan enam actor sintetis di isolated Auth: guest, login tanpa grant, active scoped, expired, revoked, verified admin. Tambahkan user kedua untuk IDOR; no PII nyata.
7. [ ] Fixture internal sintetis: published metadata, draft/review/approved-unpublished, course scope A/B, video URL dummy untuk security tests, reading safe ref, progress history dan dummy order bila payment tests diotorisasi kemudian.
8. [ ] Owner menyetujui penggunaan video uji `ethrPMuAayU`, rights dan embedding. Jika tidak, gunakan approved public test asset; label playback NOT VERIFIED untuk video user sampai bisa diuji.

Format setiap hasil: `Case ID | SHA/env/browser/viewport | Actor | Steps | Expected | Observed | Status | Evidence redacted | Follow-up`. Gunakan PASS/FAIL/PARTIAL/MOCK/NOT IMPLEMENTED/NOT VERIFIED/BLOCKED. Capture screenshot hanya tanpa PII; jangan lampirkan token/credential, private media refs atau request secrets dalam HAR publik.

## Participant flow

| Case                   | Langkah                                                                                                           | Expected acceptance                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| U01 Catalog guest      | Buka /e-learning fresh session; filter empat bidang, level, bab; buka detail published                            | Hanya approved published metadata; ordered stable hierarchy, outcomes/instructor/duration akurat; tidak ada template course/statistik tak terbukti |
| U02 Empty/error        | Gunakan fixture kosong, query tanpa hasil, offline dan denied rules                                               | Loading selesai; bedakan empty/network/permission/404; retry aman; tidak menampilkan private defaults                                              |
| U03 Google login       | Login lewat provider isolated; repeat canceled popup, blocked popup, denied profile write                         | Tidak redirect sukses saat cancel; auth error jelas; profile failure tidak menyamarkan auth state; no duplicate profile writes                     |
| U04 Email signup/login | Valid/invalid password, confirm mismatch, existing account, invalid credentials, throttling                       | Loading/disabled control, readable errors, safe own profile creation; no invented role/grant fields                                                |
| U05 Session loading    | Reload halaman protected pada slow auth/network                                                                   | Loading auth/entitlement jelas, fail-closed; tidak mem-flash unlocked player/admin                                                                 |
| U06 Logout             | Logout di player kemudian back/refresh; switch dua accounts cepat                                                 | State/private references dibersihkan sesuai policy; delayed response uid lama tidak membuka hak user baru; no stale profile UI                     |
| U07 Recovery/password  | Sandbox reset password jika diimplementasikan; change-password dengan reauthentication dan Google-linked provider | Delivery hanya sandbox, no secret logs; password change errors benar. Baseline reset: NOT IMPLEMENTED                                              |
| U08 Authorized player  | Active scoped actor buka published chapter; pilih lesson kedua, reload, buka direct link                          | Video sesuai lesson, scope valid, no mock slug fallback; arbitrary slug tidak membuka protected content                                            |
| U09 Unauthorized       | Guest dan login tanpa grant buka ID/slug/subscription alias/direct link                                           | No media/private lesson response; correct login/request-access state; UI dan direct SDK sama-sama deny                                             |
| U10 Expiry/revoke      | Fixture expiry lalu lintasi waktu expiry saat tab terbuka; admin test revoke; request ulang                       | Request-time access denied, state diperbarui, no stale open/refetch access; historical progress tetap aman                                         |
| U11 Scope isolation    | Active scope A coba course/lesson B, unit grant, admin preview sesuai policy                                      | Grant hanya scope yang ditentukan; admin preview deliberate audited; unit model tidak otomatis full subscription                                   |
| U12 Progress/resume    | Tonton/pause/save, lanjut lesson, reload dan device kedua; offline/retry save                                     | Position/lesson/completion persist per uid; bounds enforced, debounced/idempotent retry; revoked user history tidak membuka media                  |
| U13 Profile/dashboard  | Login tanpa subscription lalu active/expired/revoked; view own orders dan history                                 | Status sebenarnya, bukan heading active statis; own data only; pending tidak memberi akses                                                         |
| U14 Reading/captions   | Buka approved reading/PDF/slide, caption aktif, keyboard navigation                                               | Tipe lesson memiliki renderer sesuai, access protected, attachment safe; missing refs/subtitle state jelas                                         |

## Admin dan publishing flow

| Case                | Langkah                                                                                                                                   | Expected acceptance                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| A01 Guard           | Guest/nonadmin buka admin courses/orders/vouchers serta langsung SDK emulator                                                             | Semua unauthorized read/mutation deny; no reliance pada redirect/hidden button; nonadmin tidak mendapat broad orders/PII        |
| A02 CRUD draft      | Verified admin membuat draft sintetis lengkap, menambah/edit/hapus lesson, cancel edit                                                    | Stable IDs, no nested state mutation pada cancel, schema/URL/type/duration validation; draft tidak visible peserta              |
| A03 Concurrency     | Dua editor mengubah version yang sama; duplicate judul/ID; malformed required field                                                       | Conflict terdeteksi, no silent overwrite; judul bukan sole identity; no last-writer loss                                        |
| A04 Approve/publish | Ajukan review; reviewer approved version; publish; edit sesudah approved; unpublish                                                       | Hanya same approved version boleh publish; rights/syariah required; audit reviewer/time/version; unauthorized transition denied |
| A05 Manifest        | Tautkan curated fixture ke empat bidang; staged raw/edited/approved/uploaded/published                                                    | Tidak auto-publish raw/uploaded; counts bab/video akurat; tidak mengimpor semua Drive                                           |
| A06 Seed/delete     | Review seed code tanpa menekan seed; isolated delete fixture jika diotorisasi                                                             | Default seed tidak dipakai; existing records tidak overwritten; safe confirmation/references/version handling                   |
| A07 Image upload    | Hanya dedicated sandbox Blob atau local handler test: valid image, invalid MIME, >5MB, invalid scope/path, missing/expired token/nonadmin | Server deny invalid; verified admin allow batas type/size; no public private materials; no API secret/token logs                |
| A08 Error paths     | Denied snapshot/write, lost network saat save/publish/upload                                                                              | Loading selesai/error jelas; no false success/publish; retry idempotent dan no duplicate data                                   |
| A09 Marketing       | Review catalog/pricing/profile metadata/testimonials/CTA pada Academy                                                                     | Unsupported counts, harga dan certificate promise removed/approved; Masterclass landing/flow tidak diubah                       |

## Data exposure dan writes — emulator SDK/REST

Pengujian berikut hanya pada emulator/isolated project dengan rules actual/target yang jelas. Setup via Admin SDK boleh bypass rules untuk fixture; participant/admin assertions menggunakan authenticated client contexts, bukan Admin SDK.

1. [ ] Jalankan enam actor terhadap list/get/query published metadata, direct course document dan private lesson. Uji sebelum UI check; assert tidak ada dummy protected video reference di unauthorized response. Public type casting bukan sanitization.
2. [ ] Guest/unauthorized/expired/revoked denied private lesson; active hanya scope granted; admin sesuai policy. Draft/review/approved-unpublished tidak public. Uji alias/direct link/query tanpa published constraint.
3. [ ] Sebagai participant, update own allowed profile fields berhasil; own grants/subscription/roles/uid/admin fields denied; profile user kedua denied; arbitrary extra fields denied.
4. [ ] Course/lesson/site content create/update/delete dan voucher management denied untuk nonadmin. Site content test memakai fixture isolated; tidak mengubah Masterclass production.
5. [ ] Orders: own read saja; cross-user/direct guessed ID/query luas denied; participant tidak bisa approved/rejected/adminNote/grant fields. Create disabled bila payments out of scope.
6. [ ] Expiry memakai rule server time, bukan modifikasi clock browser; revoke mencabut request berikutnya. Delayed entitlement response tidak dapat mengubah state user baru.
7. [ ] Catat matrix expected/observed untuk setiap method dan actor. Denied rule tidak cukup bila public doc masih membawa video reference. Existing rules yang belum tersedia → BLOCKED, bukan emulator PASS dengan rules buatan.

## YouTube cases dan playback browser

| Case | Input / langkah                                                                     | Expected                                                                                                          |
| ---- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Y01  | https://youtu.be/ethrPMuAayU?si=Gb5QPRVzlh_oDWjR                                    | Same exact videoId, embed derived trusted                                                                         |
| Y02  | https://www.youtube.com/watch?v=ethrPMuAayU                                         | Same exact videoId                                                                                                |
| Y03  | https://www.youtube.com/embed/ethrPMuAayU                                           | Same exact videoId                                                                                                |
| Y04  | https://youtube.com/shorts/ethrPMuAayU                                              | Same exact videoId                                                                                                |
| Y05  | javascript: / non-HTTPS / lookalike youtube.com.evil.example                        | Validation reject; tidak navigasi arbitrary URL atau eksekusi scheme                                              |
| Y06  | Empty, invalid ID, ID suffix tambahan, malformed URL/duplicate v params             | Empty state atau validation error; no truncated ID fallback                                                       |
| Y07  | Approved official embed dan youtube-nocookie.com variant pada actual preview domain | Playback nyata, audio/play/pause/seek/fullscreen/captions berfungsi sesuai permission; nocookie tidak diklaim DRM |
| Y08  | Inspect request header destination tanpa menyimpan tokens                           | Referer appropriate; CSP permits intended host saja; no no-referrer regression                                    |
| Y09  | Controlled unavailable/private/embedding-disabled asset; autoplay block             | Error 2/100/101/150/153 dan autoplay handling jelas, no endless blank iframe                                      |
| Y10  | Switch lesson lalu back/forward route, slow network, mobile rotation                | Correct src/title, no previous course leak/state, responsive controls                                             |

Playback tidak PASS hanya karena parser PASS, iframe ada, video direct watch bisa dimainkan atau endpoint metadata sukses. [YouTube API](https://developers.google.com/youtube/iframe_api_reference) mengaitkan error 153 dengan Referer/client identification; [embed help](https://support.google.com/youtube/answer/171780) menjelaskan embedding/privacy-enhanced mode. Unlisted URL dapat disebar; entitlement app tidak memberikan DRM pada media YouTube.

## Mobile, accessibility dan SEO

1. [ ] Uji 360×800, 390×844, 768×1024, 1280×800; portrait/landscape dan 200% zoom. Player/sidebar tidak overflow; mock fixed-width route tidak menjadi canonical.
2. [ ] Keyboard login/catalog/player/lesson/admin modal; focus visible, trap/restore modal, Escape, labels associated, buttons named, tidak ada nested interactive checkbox/button.
3. [ ] Screen-reader smoke loading/error/access denied, title iframe, headings/breadcrumb dan caption availability. Check warnings baseline ditindaklanjuti, bukan disembunyikan.
4. [ ] Title/description Academy sesuai published content, no unsupported #1/terbesar/1400+/125K+/4.9/5; canonical/draft noindex policy sesuai owner.
5. [ ] Loading/empty/denied/offline/404 berbeda; no false active subscription, certificate atau quiz success.

## Pembayaran — tertunda dan dibatasi

Jangan tes checkout nyata, transfer, approve order produksi, voucher nyata atau WhatsApp handoff. Baseline audit hanya membaca kode. Jika owner menyetujui payment di fase berikutnya, gunakan fixture isolated dan stub external navigation:

- [ ] Trusted pricing menolak perubahan amount/plan/type/user ownership; checkout route ID dipakai benar, bukan selalu one-month package.
- [ ] Pending order tidak grant; approved transition dan entitlement atomic/idempotent; simulate user-update failure setelah order update.
- [ ] Concurrent approval dua unit tidak lost-write; repeated approval tidak menggandakan grant; renewal menambah dari max(now,expiry), bukan memotong masa aktif.
- [ ] Voucher expiry/scope/maxUses dan usedCount/reservation atomic; concurrent redemption tidak melampaui quota; no real bank/recipient data di evidence.
- [ ] Reject order policy dan revoke grant explicit; no participant privilege escalation/IDOR. Notification sandbox hanya jika diotorisasi secara terpisah.

## Recovery dan hasil gate

1. [ ] Rehearse backup restore dan code/rules/content rollback di isolated environment sesuai 04; ukur hasil terhadap RPO/RTO yang dipilih owner.
2. [ ] Verify catalog/auth/entitlement/progress sesudah restore; monitoring redacted dan incident owner tersedia.
3. [ ] Himpun hasil pada SHA/environment yang sama; semua P0 gate dipenuhi dan owner content/business sign-off.
4. [ ] Jika rules, isolation, rights atau playback belum terbukti, tetap NO-GO untuk preview/pilot/production. Serahkan unresolved cases, jangan menjalankan Phase 1 dari laporan ini.
