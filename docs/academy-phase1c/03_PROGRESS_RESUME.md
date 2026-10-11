# Phase 1C — progress and resume

Kontrak Phase 1B dipertahankan: `academy_progress/{uid}/lessons/{lessonId}` menyimpan lessonId, version, positionSeconds dan server updatedAt. `positionSeconds` adalah last-position field; tidak menggandakannya sebagai completion. Own history read tersedia meski expired/revoked; write tetap membutuhkan current published lesson/version dan active scoped grant pada request.time. Cross-user query/get/write denied, termasuk admin.

Runtime autosave memakai Firestore Lite agar tidak mengantre offline writes. Adapter membaca fresh own history, memeriksa UID/generation sebelum seek/render, dan resume hanya jika version cocok serta posisi finite dalam 0..duration. Version baru mulai 0 dengan history lama tetap terbaca. Last lesson per scope diturunkan dari server updatedAt history + current public metadata; tidak ada redundant pointer write. Posisi boleh turun saat seek backward; last accepted write wins antar sesi. Tidak menetapkan completion/scoring policy.

PLAYING samples tiap 1 detik, tetapi write minimal 15 detik antar periodic samples. Pause/ended flush minimum 3 detik; posisi sama/invalid/out-of-bounds diabaikan, hanya satu write in flight. Destroy/revoke/expiry/logout/switch/offline menghentikan timer/recorder; late result tidak memberi success UI di actor baru. Rules tetap final authority. Periodic save window dapat kehilangan bagian posisi terakhir saat tab ditutup mendadak; tidak mengandalkan unload atau offline queue. Throttle adalah UX write-control, bukan backend abuse-rate guarantee.

Evidence: actual pause event menyimpan 42 lalu 57 detik; reload dan Edge seek ke 57, last scoped lesson dipulihkan. PLAYING timer menyimpan 75; revoke destroys adapter, delayed fake sample 99 tidak menulis, SDK direct write permission-denied, history tetap 75. Actual authorized A history response ditahan, switch B, dilepas; dashboard B tidak menampilkan posisi A. Dashboard dua tab sync dengan own UID lifecycle.

Unit test mengukur samples pada 0/3/18 detik menghasilkan tiga writes, menolak nonfinite/bounds, cancels stale responses, dan reset resume version. Backend test menolak NaN, Infinity, negative, >duration, stale version dan revoked write. Progress adalah self-reported history, bukan bukti kelulusan, sertifikat, entitlement atau analytics watch-time yang tepercaya.

Primary API reference: [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference), untuk seek/getCurrentTime/state events. Real provider execution tetap NOT VERIFIED.
