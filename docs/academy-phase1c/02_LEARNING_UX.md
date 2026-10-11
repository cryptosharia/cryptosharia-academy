# Phase 1C — learning UX

Entry `/e-learning`, aliases `/subscription` dan `/units`: empat bidang, enam level slots, details keyboard-operable, bab/lesson ordered, published count dan duration sum, approved instructor, available/empty state. Tidak menambahkan rating/alumni/review/sertifikat/harga fiktif. Loading, error, offline dan retry eksplisit.

Player shared `/e-learning/[scopeId]` dan subscription alias: canonical validated private video, lesson title/outcomes, subject/level/chapter breadcrumb, sidebar ordered metadata, active visual border + aria-pressed, previous/next disabled pada batas, dashboard/catalog links. Pemilihan lesson memakai stable ID; SvelteKit router menyelaraskan `?lesson=` dan reload. Jika tidak ada explicit lesson, pilih last updated history dalam scope, lalu first published lesson. Unknown explicit lesson tidak fallback ke protected item lain.

Player access tetap melalui unchanged `academyPlayer.ts`: no-grant/expired/revoked/unpublished/not-found/backend-unavailable, fresh Lite private read, listener/timer/poll dan actor/lesson request generations. Iframe dan progress adapter hanya ada pada ready; actor/access/offline changes destroy keduanya. Navigasi tidak mengambil private collection.

YouTube API memakai canonical nocookie iframe, enablejsapi dan origin; onReady seek, onStateChange sample, onError/unavailable/autoplay-blocked message. Script/API/frame diintercept sintetis dalam tes. Actual audio/playback/captions/fullscreen/mobile provider errors NOT VERIFIED. No YouTube DRM/recall claim.

Screenshot private catalog 360×800, desktop player/dashboard diperiksa; mobile catalog tidak overflow, lesson link keyboard focus diuji. Responsive grid menumpuk sidebar di layar kecil; iframe minimum height 200. Ini smoke evidence, bukan audit screen-reader atau cross-device exhaustive. MySkill tetap referensi konsep saja; tidak menyalin brand/content/design atau membuka akun referensi.
