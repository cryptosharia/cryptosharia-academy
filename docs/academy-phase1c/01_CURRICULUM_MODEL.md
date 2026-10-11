# Phase 1C — curriculum model

Reuse `academy_editorial` dan `academy_catalog` untuk entity dengan `kind`: subject, level, chapter, lesson. Setiap entity mempunyai id, parentId, subjectId, scopeId, title, description/outcomes, order, level, chapterNumber, editorial status/version dan server audit/change metadata. Subject IDs tetap fundamental / technical / muamalah / web3, parent virtual root. Child IDs UUID; judul tidak menjadi identity. Media hanya lesson: editorial media null untuk parent; private `academy_lessons` hanya lesson.

| Jenis   | Parent  | Nomor/order                     | Publication                                |
| ------- | ------- | ------------------------------- | ------------------------------------------ |
| Subject | root    | Explicit unique root order      | Reviewed published snapshot                |
| Level   | subject | 1–6; order equals level         | Parent published required                  |
| Chapter | level   | 1–7; order equals chapterNumber | Parent published required                  |
| Lesson  | chapter | Explicit sibling order 0–10000  | Same-version approval + parent publication |

Rules memvalidasi parent kind, subjectId, level/chapter number dan scope equality. Public projection berisi metadata allowlist saja. `academy_positions/{parentId_order}` direservasi atomik saat publish; sibling tidak bisa mengambil order yang sudah dimiliki ID lain. Lesson edit melepas slot published dan menarik catalog; review/publish ulang diperlukan. Sort lesson: level, chapterNumber, order, ID tie-break defensif. Query navigation hanya metadata publik, bukan private listing.

Parent title edit menaikkan editorial version dan menghapus approval current. Snapshot public versi terakhir yang telah approved tetap ada sampai revision disetujui/published. Draft title tidak bocor ke public; old snapshot tidak memberi hak publish revision. Structural fields parent (ID/parent/scope/subject/number/order) dibekukan setelah publication. Parent tidak bisa dihapus melalui client, termasuk draft; cascade/archive policy belum diputuskan. Ini deliberate ceiling yang mencegah orphan published/draft descendants tanpa counter/cascade baru. Lesson draft deletion tetap tersedia sebagaimana Phase 1B.

Tidak membentuk 168 records. UI merender empat bidang resmi dan enam planning slots; hanya node/lesson approved yang benar-benar ada dihitung. Duration parent bernilai zero; estimasi chapter menjumlah durationSeconds lesson published. Instructor hanya dari approved lesson metadata. Attachment refs tidak diduplikasi ke publik dan belum dirender.

Candidate schema membutuhkan hierarchy fields; existing Phase 1B collections/security dipertahankan tetapi data lama tidak dimigrasikan otomatis. Project Phase 1C terpisah; fixture hanya beberapa synthetic nodes dan lessons. Combined production/legacy migration, actual curriculum names/outcomes/ownership, access-granularity mapping, structural reparent/archive/index/performance tetap owner gates. Tidak deploy candidate ini ke backend shared Masterclass.
