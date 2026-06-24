# Rencana Implementasi Revisi Jadwal Masterclass

## Tujuan

Merevisi bagian jadwal, pembagian materi, dan ringkasan investasi pada landing page utama agar mengikuti referensi **Masterclass Crypto Sharia — Jadwal & Pembagian Materi** yang diberikan.

Dokumen ini hanya berisi rencana. Implementasi kode dilakukan setelah rencana disetujui.

## Temuan Kondisi Saat Ini

- Jadwal ditampilkan pada section `curriculum` di landing page `/`.
- Data default dan normalisasi data Firestore berada di `src/lib/landingContent.ts`.
- Tampilan section berada di `src/routes/+page.svelte`.
- Form pengelolaan konten berada di `src/routes/admin/landing/+page.svelte`.
- Struktur data saat ini hanya menyimpan judul sesi dan pemateri. Struktur tersebut belum dapat menyimpan harga serta daftar materi untuk setiap sesi.
- Tanggal saat ini masih 27–28 Juni dan 4–5 Juli 2026, sedangkan referensi baru menggunakan 4, 5, 11, dan 12 Juli 2026.
- Harga per sesi pada kartu paket saat ini masih `Rp400k`, sedangkan referensi baru menetapkan `Rp500k`.

## Hasil Akhir yang Ditargetkan

Section jadwal menampilkan empat hari pembelajaran berikut:

| Hari | Tanggal      | Paket                               | Sesi 1                        | Sesi 2                               |
| ---- | ------------ | ----------------------------------- | ----------------------------- | ------------------------------------ |
| 1    | 4 Juli 2026  | Pondasi Crypto & Financial Planning | Crypto & Web3 Industry Map    | Financial Planning & Risk Management |
| 2    | 5 Juli 2026  | Analisis Fundamental & Global Macro | Analisis Fundamental Crypto   | Analisis Makro Global                |
| 3    | 11 Juli 2026 | Analisis Teknikal                   | Fondasi & Pattern Grafik      | Indikator & Eksekusi Trading         |
| 4    | 12 Juli 2026 | Analisis Syariah & Screening Koin   | Fikih Muamalah & Fatwa Crypto | Screening Koin & Bedah Kasus         |

Setiap hari akan memiliki:

- judul dan tanggal;
- deskripsi manfaat paket;
- dua sesi beserta harga `Rp500k per sesi`;
- tiga butir materi pada setiap sesi;
- harga paket harian `Rp750k`;
- layout dua kolom untuk sesi pada layar lebar dan satu kolom pada layar kecil.

Di akhir daftar jadwal ditampilkan ringkasan investasi:

- Per sesi: `Rp500k`;
- Per paket (1 hari): `Rp750k`;
- Total 4 paket: `Rp3.000k` atau diformat konsisten sebagai `Rp3.000.000` pada UI.

## Rencana Perubahan Teknis

### 1. Perluas model data kurikulum

File: `src/lib/landingContent.ts`

- Tambahkan tipe sesi terstruktur, misalnya `CurriculumSession`, dengan properti:
  - `title`;
  - `price`;
  - `topics: string[]`;
  - `speaker` bila informasi pemateri tetap diperlukan.
- Perluas `CurriculumDay` dengan:
  - deskripsi paket;
  - sesi terstruktur;
  - harga paket harian.
- Tambahkan data ringkasan investasi pada `curriculum`, atau tipe khusus yang memuat harga sesi, harga paket, dan total empat paket.
- Pertahankan kompatibilitas dengan data lama selama migrasi agar data Firestore yang sudah tersimpan tidak menyebabkan halaman gagal dirender.

### 2. Masukkan copy dan jadwal baru

File: `src/lib/landingContent.ts`

- Ganti jadwal default dengan tanggal dan materi dari referensi.
- Masukkan deskripsi lengkap untuk setiap hari.
- Masukkan enam butir materi per hari, masing-masing tiga butir pada tiap sesi.
- Sinkronkan judul paket pada area pricing dengan nama paket baru.
- Ubah seluruh harga per sesi dari `Rp400k` menjadi `Rp500k`.
- Pastikan harga paket `Rp750k` dan total empat paket `Rp3.000.000` konsisten di seluruh landing page.
- Hindari campuran format `Rp3.000k` dan `Rp3.000.000` pada UI; nilai ditampilkan sebagai `Rp3.000.000` tanpa mengubah nominal dari referensi.

### 3. Tambahkan normalisasi dan migrasi data lama

File: `src/lib/landingContent.ts`

- Perbarui fungsi normalisasi agar dapat membaca struktur jadwal lama dan baru.
- Konversi otomatis sesi lama berbentuk string menjadi objek sesi terstruktur.
- Sediakan fallback untuk `description`, `topics`, dan `packagePrice` yang belum ada pada dokumen Firestore lama.
- Tambahkan pemetaan copy lama ke copy baru agar data tersimpan tidak terus menimpa default revisi setelah deploy.
- Pertahankan data kustom admin yang tidak termasuk copy lama yang dikenal.

### 4. Revisi tampilan section kurikulum

File: `src/routes/+page.svelte`

- Ubah kartu timeline ringkas menjadi kartu paket harian yang memuat detail dua sesi.
- Gunakan hierarki visual:
  1. nomor hari dan tanggal;
  2. nama paket;
  3. deskripsi;
  4. dua panel sesi;
  5. total paket harian.
- Gunakan warna brand yang sudah ada: orange sebagai aksen, slate untuk teks, dan latar krem/orange muda pada panel sesi.
- Pertahankan dukungan dark mode dengan kontras yang memenuhi keterbacaan.
- Pada mobile, gunakan accordion yang tetap accessible atau tampilkan konten penuh bila panjang halaman masih wajar.
- Tambahkan blok `Ringkasan Investasi` setelah hari keempat.
- Jangan menghilangkan CTA dan outcome section yang sudah ada; sesuaikan jaraknya agar alur jadwal → ringkasan harga → hasil belajar → CTA tetap jelas.

### 5. Perbarui form admin landing page

File: `src/routes/admin/landing/+page.svelte`

- Tambahkan field untuk:
  - deskripsi tiap hari;
  - harga paket harian;
  - harga tiap sesi;
  - daftar materi tiap sesi;
  - ringkasan investasi.
- Pertahankan fungsi tambah/hapus hari, sesi, dan butir materi.
- Pastikan perubahan nested array memicu reaktivitas Svelte dan tersimpan melalui alur penyimpanan yang sudah ada.
- Beri label dan placeholder dalam Bahasa Indonesia agar struktur baru mudah dikelola admin.

### 6. Sinkronkan area pricing

File: `src/lib/landingContent.ts` dan `src/routes/+page.svelte`

- Samakan nama paket, harga sesi, harga paket, tanggal, dan total paket dengan section jadwal.
- Pertahankan kartu paket, CTA WhatsApp, benefit, dan gambar paket yang sudah ada.
- Hilangkan atau revisi copy promosi yang menghasilkan konflik nominal dengan ringkasan investasi baru.
- Gunakan satu sumber data harga bila memungkinkan agar perubahan berikutnya tidak perlu dilakukan di beberapa tempat.

## Rencana Responsivitas

- **Mobile (< 640 px):** satu kolom, panel sesi ditumpuk, harga selalu terlihat, dan teks tidak terpotong.
- **Tablet (640–1023 px):** kartu hari tetap satu kolom dengan dua panel sesi sejajar bila ruang mencukupi.
- **Desktop (≥ 1024 px):** konten dibatasi pada lebar baca yang nyaman; tiap hari tampil sebagai satu blok dengan dua sesi sejajar.
- Ringkasan investasi berubah dari satu kolom pada mobile menjadi tiga kolom pada tablet/desktop.

## Aksesibilitas

- Heading mengikuti urutan `h2` → `h3` → `h4`.
- Accordion, bila dipertahankan, memiliki `aria-expanded` dan kontrol keyboard.
- Informasi harga tidak hanya dibedakan melalui warna.
- Kontras teks orange/krem diverifikasi pada light dan dark mode.
- Teks materi tetap berupa list semantik agar mudah dipindai screen reader.

## Verifikasi Setelah Implementasi

### Pemeriksaan kode

1. Jalankan `npm run check`.
2. Jalankan `npm run lint`.
3. Jalankan `npm run build`.

### Pemeriksaan visual

1. Bandingkan copy, tanggal, urutan sesi, materi, dan harga dengan referensi.
2. Uji landing page pada lebar sekitar 375 px, 768 px, 1024 px, dan 1440 px.
3. Uji light mode dan dark mode.
4. Pastikan tidak ada overflow horizontal atau teks harga terpotong.
5. Pastikan section pricing dan curriculum menampilkan nominal yang sama.

### Pemeriksaan admin dan persistensi

1. Buka `/admin/landing` dan edit satu materi sesi.
2. Simpan perubahan dan muat ulang halaman.
3. Pastikan data baru kembali dari Firestore tanpa kehilangan nested topics atau harga.
4. Uji dokumen lama tanpa field baru untuk memastikan fallback berjalan.

## Kriteria Selesai

- Empat hari, delapan sesi, seluruh butir materi, dan semua harga sesuai referensi.
- Tidak ada tanggal atau harga lama yang masih tampil pada landing page.
- Admin dapat mengelola seluruh field baru tanpa mengedit kode.
- Data Firestore lama tetap kompatibel.
- Tampilan rapi pada mobile, tablet, dan desktop serta tetap usable pada dark mode.
- `check`, `lint`, dan `build` selesai tanpa error baru.

## Batasan Implementasi

- Revisi difokuskan pada landing page utama dan form admin landing.
- Halaman `/bootcamp` yang berisi katalog bootcamp generik tidak diubah karena tidak menggunakan data jadwal pada referensi ini.
- Gambar paket dan CTA WhatsApp yang sudah ada tetap digunakan kecuali ada arahan revisi terpisah.
