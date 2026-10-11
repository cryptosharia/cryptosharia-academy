# Phase 0 — baseline CryptoSharia Academy

Tanggal audit: 10 Oktober 2026, Asia/Jakarta. Laporan internal lokal; jangan publikasi tanpa review redaksi. Status teknis menggunakan PASS, FAIL, PARTIAL, MOCK, NOT IMPLEMENTED, NOT VERIFIED, BLOCKED. Status merupakan hasil pada baseline ini, bukan sertifikasi production.

## Identitas dan batas audit

| Item | Bukti / hasil |
| --- | --- |
| Repository | origin `https://github.com/cryptosharia/cryptosharia-academy` |
| Direktori | `cryptosharia-academy` di workspace `cs` |
| Branch | `main`; tidak membuat atau berpindah branch |
| HEAD | `9423cefae98d1ce1797be58b0da705b059a9ce21` |
| Worktree awal | PASS — `git status --short` kosong |
| Node | `v25.8.1` |
| npm | `11.11.0` |
| Instruksi lokal | `AGENTS.md`, `.kiro/steering/ponytail.md`; tidak ada AGENTS tambahan di ancestor workspace atau `src` yang ditemukan |
| Perubahan diizinkan | Enam dokumen audit ini; instalasi dependency dan output tooling lokal yang diabaikan git |
| Batasan | Tidak mengubah source, env, DB, sharing, produksi; tidak menjalankan checkout/reset, commit, push, PR, deploy, pembayaran atau notifikasi |

Percobaan baseline pertama dari root `cs` menghasilkan `fatal: not a git repository (or any of the parent directories): .git` pada tiga perintah git. Setelah lokasi repo ditemukan, semua perintah baseline diulang di repository yang benar. Error lokasi awal bukan kerusakan repository. Git origin telah diverifikasi.

## Stack yang benar

`package.json` + lockfile v3: SvelteKit/Svelte 5, TypeScript strict, Tailwind 4, Firebase client Auth/Firestore, Vercel Blob, GSAP, Lenis. Adapter aktif: `@sveltejs/adapter-vercel` (`svelte.config.js`).

| Dependency | Deklarasi package | Versi lock aktual |
| --- | --- | --- |
| SvelteKit | ^2.57.0 | 2.60.1 |
| Svelte | ^5.55.2 | 5.55.7 |
| Vite | ^8.0.7 | 8.0.13 |
| TypeScript | ^6.0.2 | 6.0.3 |
| Firebase | ^12.13.0 | 12.13.0 |
| Vercel Blob | ^2.4.0 | 2.4.0 |
| Adapter Vercel | ^6.3.3 | 6.3.3 |

README:11–18 mengklaim Fluid Tailwind, bits-ui, Lucide, openapi-fetch, Zod, PostgreSQL/Drizzle, JWT/jose/Argon2id, Vitest. Paket tersebut tidak menjadi dependency langsung pada baseline ini; integrasi DB/auth aktual adalah Firebase (`src/lib/firebase.ts`, `src/lib/auth.svelte.ts`). README:110–115 mengiklankan `db:*`, `gen:api-types`, `test`; script-script itu tidak tersedia di `package.json`. Tidak ditemukan test suite otomatis atau konfigurasi emulator lokal. Direktori API/db/migration yang dijelaskan README tidak ditemukan. README:81 menyebut port 5177; `vite.config.ts` tidak menetapkan port tersebut. Klaim README mengenai quiz, sertifikat, progress dan RBAC belum didukung implementasi end-to-end.

## Environment — nama key saja

`.env.example` dibaca dengan ekstraksi nama key tanpa mencetak nilainya:

```text
PUBLIC_APP_URL
PUBLIC_CS_API_URL
BLOB_READ_WRITE_TOKEN
CS_API_KEY
DATABASE_URL
```

Key yang diimpor aktual tetapi tidak dicantumkan contoh:

```text
PUBLIC_FIREBASE_API_KEY
PUBLIC_FIREBASE_AUTH_DOMAIN
PUBLIC_FIREBASE_PROJECT_ID
PUBLIC_FIREBASE_MESSAGING_SENDER_ID
PUBLIC_FIREBASE_APP_ID
```

Tidak ada file `.env` aktif yang ditemukan di root repo, dan tidak ada key process environment terkait Firebase/Blob/CS API/DB/Vercel yang tersedia pada pemeriksaan. Tidak membuat env dummy atau menyalin contoh. Firebase memakai `$env/static/public`; konfigurasi akan tertanam dalam build. Key public Firebase bukan pengganti Security Rules. Blob memakai `BLOB_READ_WRITE_TOKEN` server-only melalui `$env/dynamic/private`.

## Command logs dan hasil

Semua perintah npm dijalankan di repository. Output check/lint/build/audit ditangkap dalam log lokal sementara `academy-phase0-{check,lint,build,audit}.log` di direktori TEMP; cuplikan relevan di bawah. Log sementara bukan artifact publik. Tidak menjalankan `npm audit fix`, formatter write, migrasi atau test pembayaran.

| Command | Exit code | Status | Hasil |
| --- | --- | --- | --- |
| `git status --short` awal | 0 | PASS | Kosong |
| `git branch --show-current` | 0 | PASS | main |
| `git rev-parse HEAD` | 0 | PASS | SHA persis di atas |
| `node --version` | 0 | PASS | v25.8.1 |
| `npm --version` | 0 | PASS | 11.11.0 |
| `npm ci` | 0 | PASS | 299 packages added, 300 audited, sekitar 2 menit; lifecycle `svelte-kit sync` dijalankan |
| `npm run check` | 1 | FAIL | 13 errors, 41 warnings, 16 files; komponen konfigurasi BLOCKED BY CONFIG |
| `npm run lint` | 1 | FAIL | Prettier melaporkan 62 file; ESLint tidak dijalankan karena `&&` |
| `npm run build` | 1 | BLOCKED | BLOCKED BY CONFIG; 6 missing exports Firebase, belum menghasilkan build tervalidasi |
| `npm audit --json` | 1 | FAIL | 14 dependency findings: 1 low, 2 moderate, 9 high, 2 critical |
| `npm explain tar websocket-driver undici --json` | 0 | PASS | Rantai dependency diverifikasi; bukan verifikasi exploit |
| Uji helper URL lokal via Node | 0 | PARTIAL | Empat bentuk URL positif dinormalisasi helper landing; input negatif tidak ditolak; Academy tidak memakai helper |
| Firestore Rules SDK/REST role test | — | BLOCKED | Rules, emulator, isolated project belum tersedia |
| Browser end-to-end / playback | — | BLOCKED | Config dan isolasi belum terbukti; tidak menjalankan dev server atau halaman live |

Output asli utama:

```text
added 299 packages, and audited 300 packages in 2m
14 vulnerabilities (1 low, 2 moderate, 9 high, 2 critical)

svelte-check found 13 errors and 41 warnings in 16 files
[warn] Code style issues found in 62 files. Run Prettier with --write to fix.

vite v8.0.13 building ssr environment for production...
transforming...✓ 182 modules transformed.
Build failed with 6 errors:
[MISSING_EXPORT] "PUBLIC_FIREBASE_API_KEY" is not exported by "\0virtual:env/static/public".
[MISSING_EXPORT] "PUBLIC_FIREBASE_AUTH_DOMAIN" is not exported by "\0virtual:env/static/public".
[MISSING_EXPORT] "PUBLIC_FIREBASE_PROJECT_ID" is not exported by "\0virtual:env/static/public".
[MISSING_EXPORT] "PUBLIC_FIREBASE_MESSAGING_SENDER_ID" is not exported by "\0virtual:env/static/public".
[MISSING_EXPORT] "PUBLIC_FIREBASE_APP_ID" is not exported by "\0virtual:env/static/public".
```

Build menampilkan lima nama export; ringkasan enam error mencakup penggunaan API key di dua modul. Tidak menyimpulkan build akan PASS setelah env tersedia.

Semua 13 error check, dengan path relatif:

| Path:line | Diagnostic asli utama |
| --- | --- |
| src/lib/firebase.ts:5 | Module '"$env/static/public"' has no exported member 'PUBLIC_FIREBASE_API_KEY'. |
| src/lib/firebase.ts:6 | Module '"$env/static/public"' has no exported member 'PUBLIC_FIREBASE_AUTH_DOMAIN'. |
| src/lib/firebase.ts:7 | Module '"$env/static/public"' has no exported member 'PUBLIC_FIREBASE_PROJECT_ID'. |
| src/lib/firebase.ts:8 | Module '"$env/static/public"' has no exported member 'PUBLIC_FIREBASE_MESSAGING_SENDER_ID'. |
| src/lib/firebase.ts:9 | Module '"$env/static/public"' has no exported member 'PUBLIC_FIREBASE_APP_ID'. |
| src/lib/server/firebaseAuth.ts:1 | Module '"$env/static/public"' has no exported member 'PUBLIC_FIREBASE_API_KEY'. |
| src/routes/e-learning/[id]/+page.svelte:14 | 'userAuth.user' is possibly 'null'. |
| src/routes/e-learning/[id]/+page.svelte:64 | No overload matches this call. Argument of type 'string \| undefined' is not assignable to parameter of type 'string'. |
| src/routes/payment/subscription/[id]/+page.svelte:40 | Type 'undefined' cannot be used as an index type. |
| src/routes/profile/+page.svelte:175 | Property 'message' does not exist on type '{}'. |
| src/routes/subscription/[id]/+page.svelte:13 | 'userAuth.user' is possibly 'null'. |
| src/routes/subscription/[id]/+page.svelte:46 | No overload matches this call. Argument of type 'string \| undefined' is not assignable to parameter of type 'string'. |
| src/routes/units/[id]/+page.svelte:49 | No overload matches this call. Argument of type 'string \| undefined' is not assignable to parameter of type 'string'. |

Warnings mencakup label tanpa association, href `#`, state nonreactive dan event directive lama (`admin/vouchers`). Tidak menjalankan lint ulang setelah membuat laporan, agar jumlah 62 tetap mencerminkan source baseline sebelum dokumen audit ditambahkan.

Dependency severity merupakan hasil npm registry saat audit, bukan bukti eksploitasi aplikasi. Paket terdampak: `@grpc/grpc-js` high; `@sveltejs/kit` moderate; `brace-expansion` high; `cookie` low; `devalue` high; `nanoid` high; `postcss` high; `postcss-selector-parser` moderate; `protobufjs` high; `source-map-js` high; `tar` critical; `undici` high; `vite` high; `websocket-driver` critical. Seluruh entry menyebut fixAvailable. `tar@7.5.15` berasal dari adapter-vercel → @vercel/nft → @mapbox/node-pre-gyp (dev/build chain). `websocket-driver@0.7.4` berasal dari firebase → @firebase/database → faye-websocket; source aplikasi tidak mengimpor Realtime Database, sehingga runtime reachability NOT VERIFIED. `undici@6.26.0` berasal dari @vercel/blob. Lakukan triage dan upgrade terarah pada Phase 1, tanpa auto-fix pada Phase 0.

## Pemeriksaan eksternal read-only

- Vercel connector `list_projects(search=cryptosharia-academy)` dan `list_teams` mengembalikan daftar kosong. Ini keterbatasan koneksi, bukan bukti project tidak ada. `.vercel` hanya berisi output lama; tidak ada `.vercel/project.json`. Team/project/domain/deployed env: NOT VERIFIED. Tidak membaca/decrypt secret dan tidak menjalankan `vercel pull` atau deploy.
- Tidak ditemukan `firebase.json`, `.firebaserc`, Firestore/Storage/RTDB rules, indexes, emulator wiring atau Firebase CLI. Tidak tersedia connector Firebase Rules read-only. Rules deployed: NOT VERIFIED. `firebase-debug.log` tracked bukan rules; isinya tidak dipublikasikan. Review redaksi log tersebut sebelum berbagi repo.
- Drive: hanya metadata dan listing terbatas. Folder induk menunjukkan permission `type=anyone, role=writer, allowFileDiscovery=false`, serta owner. Owner belum mengonfirmasi maksud sharing/inheritance. Empat dokumen bidang kurikulum teridentifikasi dari metadata; 17 file MOV ditemukan di folder tim video. Tidak mengunduh, mengekspor, menyalin isi privat atau menganggap file itu video approved. Approval, jumlah bab aktual, deck, editing readiness dan rights: NOT VERIFIED.
- MySkill dibaca sebagai referensi pemisahan e-learning mandiri dan bootcamp; account/resume/player di balik login tidak diverifikasi: [referensi UX](https://myskill.id/). Tidak menyalin konten atau klaim merek.
- Dokumentasi resmi YouTube dibaca: [embed help](https://support.google.com/youtube/answer/171780), [IFrame API](https://developers.google.com/youtube/iframe_api_reference). Playback video uji tidak dicoba karena preview belum isolated.

## Hasil dan git akhir

Audit statis dan pemeriksaan tooling: GO untuk diserahkan sebagai laporan Phase 0 dengan batas evidence di atas. MVP preview, pilot nyata dan production: NO-GO. Bukti security/runtime tetap NOT VERIFIED/BLOCKED.

Enam file baru di `docs/academy-audit/`; tracked source dan lockfile tetap tidak berubah. Verifikasi akhir: `git status --short` hanya `?? docs/`; branch `main` dan HEAD tetap `9423cefae98d1ce1797be58b0da705b059a9ce21`. `git diff --exit-code` dan `git diff --cached --exit-code` keduanya exit 0. Tidak ada staged changes. `npm ci`, sync dan build attempt mengubah output lokal di direktori ignored; tidak ada perubahan production.

Keenam dokumen diverifikasi jumlah/nama, UTF-8, keseimbangan code fences, dan tidak adanya assignment secret, pola credential, literal email atau URL Drive privat. Pemeriksaan pola ini bukan audit menyeluruh terhadap seluruh sejarah repository.
