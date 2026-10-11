# Phase 1A — isolation and security design

## Kontrak konfigurasi

Lima field public Firebase yang digunakan SDK: `PUBLIC_FIREBASE_API_KEY`, `PUBLIC_FIREBASE_AUTH_DOMAIN`, `PUBLIC_FIREBASE_PROJECT_ID`, `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `PUBLIC_FIREBASE_APP_ID`. Server token lookup menggunakan API key dari settings yang sama. Seluruh field divalidasi pada mode aktif.

Field baru: `PUBLIC_FIREBASE_MODE`, `PUBLIC_FIREBASE_AUTH_EMULATOR_URL`, `PUBLIC_FIREBASE_FIRESTORE_EMULATOR_URL`, `PUBLIC_ACADEMY_ENABLED`. Satu secret server-only yang benar-benar dibaca source adalah `BLOB_READ_WRITE_TOKEN`; opsional dan tidak diperlukan test mode. Source tidak menggunakan contoh lama DATABASE_URL/CS_API_KEY. `.env.example` hanya nilai sintetis, bukan env production.

| Mode                           | Kontrak                                                                                                                         | Akses Academy                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| disabled / tidak dikonfigurasi | Inert demo handles; Auth/Firestore loopback port tertutup; service guard menolak                                                | OFF                                            |
| emulator                       | Semua lima field wajib; project `demo-*`, API key demo, auth domain localhost; dua endpoint HTTP loopback eksplisit dan berbeda | Hanya flag true eksplisit dan layanan tersedia |
| live eksplisit                 | Lima field wajib; konfigurasi emulator tidak boleh dicampur                                                                     | Tetap OFF dalam Phase 1A, bahkan flag true     |

SDK Auth dan Firestore diarahkan ke emulator saat factory dibuat sebelum operasi. Reuse app dengan konfigurasi berbeda ditolak; restart app diperlukan, termasuk ketika perubahan modul melalui HMR kehilangan informasi konfigurasi. Ini fail closed, bukan fallback. Health check memerlukan kedua endpoint sebelum start dev/actions yang memakai guard dan setiap request Academy. Hilangnya layanan pada client yang telah dimuat tetap hanya menyasar loopback; SDK dapat retry lokal, tidak beralih ke production.

## Evidence yang benar-benar dijalankan

- PASS: unit tests menolak config parsial, mixed real/demo project, host non-loopback, mode tidak dikenal, endpoint kosong dan OFF default. Fetch yang gagal hanya menerima dua tujuan loopback.
- PASS: Firebase CLI 15.33.0, Node 24.21.0, Java 21; project `demo-academy`, Auth `127.0.0.1:9099`, Firestore `127.0.0.1:8080`, UI disabled. Launcher beroperasi dari temp directory, dengan CLI configuration store baru, tanpa Firebase token/ADC yang diwarisi. Tidak membuat project nyata.
- PASS: suite sembilan tests memakai rules dari fixture lokal, bukan deployed rules. Fixtures hanya data sintetis `test_*`; `clearFirestore` dan bypass setup hanya menuju emulator dengan project tetap. Tidak ada allow-all fallback.
- PASS: factory aplikasi yang sama menciptakan akun email `example.test` di Auth emulator. SDK membaca private lesson yang diizinkan dan menulis progress; test harness mengamati data tersebut di Firestore emulator. Auth emulator configuration host dan project diperiksa; sign-out menyebabkan private read ditolak; reuse dengan endpoint berbeda ditolak.
- PASS: query katalog tanpa predicate ditolak; query `status == published` diizinkan. Rules bukan filter hasil query.
- PASS: HTTP lokal enabled: `/`, `/e-learning`, `/subscription` 200; payment, voucher, orders dan mock course 503. Unit detail merender unavailable, bukan transaksi atau player mock.
- PASS: HTTP flag false: `/` 200; Academy catalog, subscription, profile dan payment 503. Setelah kedua emulator dihentikan, enabled `/e-learning` tetap 503. Tidak mencoba operasi production.
- PASS: build Linux snapshot mencocokkan hash 73 source/config/test files; Docker network dilepas sebelum build, network map `{}`. Build sukses tanpa akses backend.

Keterbatasan: pemeriksaan root endpoint membuktikan availability transport, bukan identitas kriptografis service; hanya fixture dan operasi SDK memberi evidence emulator fungsional. Tidak ada capture seluruh network browser atau OS egress firewall untuk sesi Windows. Loopback/demo validation dan koneksi kedua SDK membatasi operasi pengujian, bukan sertifikasi semua konfigurasi masa depan. Production env/config/deployed rules, actor provisioning aktual dan browser data-flow keseluruhan NOT VERIFIED.

## Desain batas data untuk Phase 1B

| Batas                  | Desain yang diusulkan                                                                                                                                   | Enforcement dalam Phase 1A                                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Katalog publik         | Metadata allowlist: identitas, judul, bidang/level/bab, ringkasan dan published version; jangan menyimpan private lessons/assets pada document publik   | Fixture published metadata read; client write denied. Trusted writer harus menegakkan schema                                                     |
| Private lessons        | Dokumen terpisah; published scope dan active grant diperiksa pada server time                                                                           | Diuji pada `test_lessons`; semua legacy collections ditolak                                                                                      |
| Video asset references | Dokumen terpisah; akses sama dengan lesson; URL YouTube bukan DRM                                                                                       | Diuji pada `test_video_assets`; rights/playback NOT VERIFIED                                                                                     |
| Entitlements           | Trusted grant provisioning, scope course, state active/revoked, starts/expiry; participant tidak boleh membuat grant                                    | Waktu/state dan cross-user/admin read diuji; own-grant read didefinisikan fixture, belum diuji terpisah; semua client writes denied              |
| Admin                  | Trusted custom claim + email verification; email allowlist UI tidak menjadi enforcement backend                                                         | Mock claims pada test contexts; verified admin read, unverified admin denied; provisioning aktual NOT VERIFIED                                   |
| Approval/publishing    | Draft → review → approved version → published; perubahan versi membatalkan approval; rights/syariah review dan immutable audit melalui trusted service  | NOT VERIFIED; fixture menolak seluruh client publishing writes, termasuk admin                                                                   |
| Progress               | Own UID, course/lesson valid, published dan active grant; field allowlist dan posisi bounded; completion/scoring dihitung trusted logic bila dibutuhkan | Own bounded progress tested; cross-user, extra fields, missing lesson, draft course dan invalid bounds denied. Completion/resume UI NOT VERIFIED |

Public-read rules tidak dapat menyembunyikan field dalam document. Query harus membatasi dataset yang diizinkan rules. Jangan menyalin fixture ke deployed rules atau memetakan legacy data secara otomatis.

## Matrix enam role — synthetic fixture

| Role                  | Published metadata | Private lesson/assets              | Draft lesson/assets                | Own progress write       | Grant/publish write |
| --------------------- | ------------------ | ---------------------------------- | ---------------------------------- | ------------------------ | ------------------- |
| guest                 | Allow              | Deny                               | Deny                               | Deny                     | Deny                |
| logged-in tanpa grant | Allow              | Deny                               | Deny                               | Deny                     | Deny                |
| active member         | Allow              | Allow pada scope                   | Deny                               | Allow bounded pada scope | Deny                |
| expired               | Allow              | Deny                               | Deny                               | Deny                     | Deny                |
| revoked               | Allow              | Deny                               | Deny                               | Deny                     | Deny                |
| verified admin        | Allow              | Allow explicit test preview policy | Allow explicit test preview policy | Deny tanpa member grant  | Deny                |

PASS berarti observed sesuai expectation fixture. Actual rules matrix tetap NOT VERIFIED, sehingga hasil ini tidak boleh disebut kelulusan authorization aplikasi produksi.

Dasar isolation: [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite/connect_and_prototype), [Auth emulator](https://firebase.google.com/docs/emulator-suite/connect_auth), [Firestore emulator](https://firebase.google.com/docs/emulator-suite/connect_firestore), [Rules testing](https://firebase.google.com/docs/rules/unit-tests).
