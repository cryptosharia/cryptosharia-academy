# Phase 1A — baseline recovery

Source yang diuji: `70959a84f506eec32e53d0b294d2466a9a0c069c`. Perbandingan baseline menggunakan laporan Phase 0 pada `9423cefae98d1ce1797be58b0da705b059a9ce21`; base pekerjaan adalah remote `14f547f82f761e8e3faa19cc11411bf0ef3f04d7`.

## Perbaikan

Missing public env exports ditangani namespace env dan resolver yang memvalidasi konfigurasi. Null user ditangani snapshot user dan pembatalan async ketika actor berubah. Route ID diperiksa sebelum dipakai. Catch memakai unknown dan guard Error/FirebaseError; schema course/order memiliki tipe dan pemeriksaan data. Payment dan mock unit diganti unavailable, sehingga error lama di komponen itu hilang melalui containment, bukan bukti bahwa checkout/unit player sudah berfungsi.

Label Academy diasosiasikan dengan kontrol; backdrop password menjadi button; subscription claim palsu dinetralkan. CMS tidak melakukan seeding dan menyalin nested lessons saat edit. List keys, unused bindings dan navigasi internal diperbaiki. Tidak menambahkan `any`, `@ts-ignore`, broad lint exception, atau membuang validasi untuk membuat check hijau. Plugin ESLint Svelte dipin pada versi baseline 3.17.1; seluruh rules aktif tetap dijalankan.

Formatting baseline berada dalam commit sendiri `b631b9ba17a0154561c081bf75e5203ef5bb00cf`, bukan digabung dengan perubahan fungsional. Formatting berikutnya hanya merapikan source yang diedit dan versi formatter kompatibel.

## Perintah yang benar-benar dijalankan

`check:test` dan `build:test` menjalankan `npm run check` / `npm run build` sebagai child process dengan konfigurasi sintetis dari `scripts/run-local.mjs`. Tidak menarik env production.

| Perintah / lingkungan                                                    | Exit code | Status       | Evidence                                                         |
| ------------------------------------------------------------------------ | --------- | ------------ | ---------------------------------------------------------------- |
| `npm ci`, worktree awal                                                  | 0         | PASS         | Baseline dependencies terpasang                                  |
| `npm update`                                                             | 0         | PASS         | Update dalam rentang major yang sudah diizinkan package manifest |
| `npm install --save-dev --save-exact @firebase/rules-unit-testing@5.0.2` | 0         | PASS         | Peer Firebase 12                                                 |
| `npm install --ignore-scripts` sesudah override gRPC                     | 0         | PASS         | Lockfile memakai gRPC 1.13.6                                     |
| `npm install --save-dev --save-exact eslint-plugin-svelte@3.17.1`        | 0         | PASS         | Mempertahankan versi lint baseline                               |
| `npm run format`, baseline                                               | 0         | PASS         | Commit formatting terpisah                                       |
| `npm ci`, Windows, fresh directory                                       | 0         | PASS         | 326 packages audited; lockfile tervalidasi                       |
| `npm run check:test` → `npm run check`, final                            | 0         | PASS         | 0 errors, 5 warnings                                             |
| `npm run lint`, final                                                    | 0         | PASS         | Prettier seluruh file dan ESLint lulus                           |
| `npm test`, final                                                        | 0         | PASS         | 35 passed, 0 failed                                              |
| `node scripts/run-local.mjs test:rules` → `npm run test:rules`           | 0         | PASS         | 9 passed, 0 failed; launcher juga diuji                          |
| `npm run build:test`, Windows Node 25.8.1                                | 1         | FAIL         | Adapter menolak runtime Node 25                                  |
| `npm run build:test`, Windows Node 24.21.0                               | 1         | BLOCKED      | Compile berhasil; packaging symlink ditolak OS dengan EPERM      |
| `npm ci`, Linux container Node 24.21.0                                   | 0         | PASS         | Dependencies terpasang sebelum jaringan dilepas                  |
| `npm run build:test` → `npm run build`, Linux                            | 0         | PASS         | BUILD PASS — TEST CONFIG ONLY; adapter Vercel selesai            |
| Verifikasi hash source build vs worktree                                 | 0         | PASS         | 73 source/config/test files identik                              |
| `npm audit --json --package-lock-only`, baseline lock                    | 1         | FAIL         | 14 findings direproduksi                                         |
| `npm audit --json`, final lock                                           | 1         | FAIL         | Empat low masih terbuka                                          |
| `npm explain ... --json`                                                 | 0         | PASS         | Chain setiap dependency terdampak ditinjau                       |
| HTTP lokal: enabled, default-OFF, layanan offline                        | 0         | PASS         | Response code sesuai containment; lihat isolation evidence       |
| Browser/YouTube playback                                                 | —         | NOT VERIFIED | Tidak dijalankan                                                 |

Percobaan intermediate juga menghasilkan check/build error saat penyuntingan, satu rules test gagal karena callback pengumpulan evidence mengembalikan void, dan reinstall Windows EPERM (exit -4048) akibat file native terkunci. Semuanya dicatat privat. Reinstall akhirnya lulus dalam directory node_modules baru; folder lama dipertahankan di luar Git. Satu pemeriksaan ESLint yang berbarengan dengan update dependency tidak valid sebagai baseline. Hasil final di atas menggantikan percobaan tersebut.

Linux image: `node:24.21.0-bookworm-slim`, digest `sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20`. Npm Windows 11.11.0; npm image 11.19.0. Source disalin tanpa `.env`, credential, Git directory atau audit/log sensitif. Network container saat build: `{}`. Arsip build disimpan privat, tidak dipublikasikan.

## Warning tersisa

Lima warning `href="#"`: satu di `Instructors.svelte`, tiga di halaman bootcamp, satu reset-password placeholder di auth/login. Tidak disembunyikan. Menghubungkannya ke aksi nyata memerlukan keputusan produk dan pengujian terkait; Phase 1A tidak mengaktifkan reset email atau mendesain ulang Masterclass. Status penuntasan warning: BLOCKED untuk keputusan aksi produk; kualitas interaksi terkait NOT VERIFIED.

## Reproduksi lokal

Gunakan Node 24 sesuai `.node-version` dan Java 21 di PATH untuk emulator. Jalankan `npm ci`, `npm run emulators`, lalu di terminal lain `npm run check:test`, `npm run lint`, `npm test`, `node scripts/run-local.mjs test:rules` dan `npm run build:test`. `npm run dev:test` membuka pengujian Academy lokal dengan flag eksplisit true dan memeriksa kedua layanan sebelum start. `.env.example` tetap false secara default. Launcher menyimpan config/state/log CLI dalam temp directory di luar Git, tanpa credentials Firebase/ADC yang diwarisi.

Windows yang tidak mengizinkan symlink masih BLOCKED untuk packaging adapter. Gunakan build Linux lokal; jangan menganggap output compile Windows sebagai artifact release, mengubah OS permissions otomatis, atau mengganti adapter hanya untuk mengabaikan failure.
