# Phase 1C — CMS and publishing

CMS `/admin/courses` memakai verified custom claims, bukan email/profile role. Admin memilih kind/valid parent, title/outcomes, explicit order/numbers, scope untuk subject, validated YouTube URL untuk lesson. Scope/subject/level/chapter identity lesson diturunkan dari parent. Stable ID dan status/version terlihat. Subject IDs canonical; entity lain UUID. Parent tidak memakai media/instructor/duration palsu.

Shared protected SDK transaksi: save draft expected version → review admin → approved reviewer (+ syariah claim saat required) → publish publisher. Same-version rights/approval/audit tetap wajib. Edit menaikkan version, current approval null; lesson public projection ditarik. Parent revision menampilkan previous approved public snapshot sampai approved revision selesai. Concurrent update hanya satu yang diterima; second write konflik versi atau permission-denied dari Rules, bukan last-writer overwrite. Sequential stale expectedVersion terdeteksi eksplisit.

Parent deletion/structural mutation setelah publish dibatasi untuk melindungi relasi; tidak ada bulk cascade. Lesson draft deletion mempertahankan atomic audit/canonical cleanup. Public/order/private projection writes tetap Rules-enforced. Tidak ada Admin SDK endpoint, server bypass, self-service role, payment/voucher/commercial subscription change atau Masterclass change.

Browser memakai UI nyata untuk lesson dan subject/level/chapter draft → review → approved → publish; invalid YouTube hostname ditolak sebelum mutasi. Revisi lesson published menghasilkan draft version 2, tidak ada publish button dengan stale approval, dan kedua title revision/old unpublished lesson hilang dari catalog. Candidate negative tests juga meliputi missing/wrong-kind parent, out-of-scope, duplicate order, orphan publication, parent deletion, wrong number/version/rights/audit dan role-specific denial.

## Curated manifest

Template `curated-content-manifest.example.json` memisahkan curriculum identity/outcome/order/version; opaque private asset record; stage raw/edited/final; duration/editing/captions/availability evidence; ownership/instructor/embedding rights; syariah reviewer; reviewer/approval version/time; publication readiness/blockers. Contoh sintetis memiliki ready=false dan semua real rights/approval kosong. Manifest merupakan kurasi owner-led, bukan bulk import atau claim enforcement baru terhadap external asset stages.

Connected Drive hanya read-only folder metadata/listing: empat dokumen bidang masih terlihat. Tidak membaca/menyalin asset bodies, membuat import, mengubah sharing atau menganggap MOV/slides/YouTube telah approved. Current permission/rights/content readiness NOT VERIFIED; URL/IDs privat dan nama individu tidak digandakan di repository. Real manifest instance dan evidence refs harus berada pada penyimpanan private berizin.
