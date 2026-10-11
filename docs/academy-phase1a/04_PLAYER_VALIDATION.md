# Phase 1A — YouTube player validation

PASS: `src/lib/youtube.ts` menyediakan shared pure `parseYouTubeUrl`. Parser memakai `new URL`, HTTPS, exact host allowlist, path yang dikenal dan video ID 11 karakter. Host: youtube.com, www.youtube.com, m.youtube.com, youtu.be serta official youtube-nocookie embed hosts. No-cookie host hanya menerima embed path.

Bentuk watch, shortened, embed dan shorts yang diminta didukung. Username/password, non-default port, fragments, control/whitespace/backslash, host palsu, path tambahan, malformed IDs dan arbitrary iframe source ditolak. Query keys dibatasi `v`, `si`, `t`, `start`; duplicate keys, parameter asing/playlist, konflik t/start dan waktu non-numeric ditolak. Waktu/share metadata tidak diteruskan ke iframe. Embed canonical selalu `https://www.youtube-nocookie.com/embed/` ditambah ID yang tervalidasi.

Admin course editor memvalidasi nonempty URL video sebelum save dan menyimpan canonical embed; URL pada tipe non-video ditolak. Empty URL tetap dapat menjadi draft lesson, bukan approved playable material. Kedua player Academy memvalidasi ulang persisted content; invalid URL atau non-video lesson tidak menghasilkan iframe arbitrary. Referrer policy `strict-origin-when-cross-origin` mempertahankan origin Referer untuk embed lintas origin. Masterclass video helper tidak diganti.

## Tests

PASS: `npm test` exit 0, total 35 tests: 24 URL cases (6 positif, 18 negatif) dan 11 config/containment cases. Positif mencakup empat bentuk wajib, shortened share parameter dan canonical nocookie embed. Negatif mencakup javascript URL, HTTP, lookalike/suffix host, userinfo, port lain, path ekstra, ID salah, duplicate v, conflicting IDs, playlist, ambiguous times, fragment, leading whitespace, backslashes dan unknown parameter.

Tests hanya string parsing; tidak menghubungi YouTube. ID `ethrPMuAayU` digunakan sebagai kandidat sintetis yang diminta, bukan konten Academy yang sudah diizinkan atau disetujui. Tidak melakukan oEmbed check, playback, rights verification atau browser iframe request.

## Batas bukti dan gate berikutnya

- PLAYBACK NOT VERIFIED: video availability, owner embedding permissions, audio/play/pause/seek/fullscreen/captions dan desktop/mobile behavior.
- NOT VERIFIED: error handling nyata YouTube 100/101/150/153 pada browser/domain yang disetujui; parser sukses tidak membuktikan playback.
- NOT VERIFIED: approval rights dan peninjauan syariah per versi konten.
- NOT VERIFIED: actual entitlement/rules enforcement. Parser hanya menolak source yang tidak valid; video references yang terlihat pengguna tidak menjadi DRM.

Owner harus menyetujui asset dan lingkungan/domain terisolasi sebelum uji playback Phase 1B. Jangan memainkan kandidat video sebagai bukti bahwa 168 bab tersedia. Empat bidang × enam level × tujuh bab merupakan rencana silabus; tidak ada inventory video ready-to-publish yang disimpulkan dari formula itu.

Referensi primer: [YouTube IFrame API errors](https://developers.google.com/youtube/iframe_api_reference#onError), [privacy-enhanced embedding](https://support.google.com/youtube/answer/171780).
