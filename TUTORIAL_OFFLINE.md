# Panduan Menjalankan Web Portofolio & CMS Sneat (100% Offline)

Proyek ini telah selesai dibangun dan diekspor ke:
`C:\Users\finnpc\Documents\Kuliah\project\web\porto`

---

## 🌟 Fitur Utama yang Telah Selesai:
1. **Frontend Landing Page Modern (Nova Astro)**:
   - Desain responsif, clean, dan estetis.
   - Pilihan bahasa: **ID (Bahasa Indonesia)** & **EN (English)**. Opsi Polandia telah dihapus sepenuhnya.
   - Tipografi telah diperbaiki: **Teks tidak saling bertumpuk / nabrak** (`leading` & `tracking` proporsional).
   - Tombol mengambang (floating button) di halaman depan telah dihilangkan sehingga tampilan rapi.
   - Bagian atas (Hero, title, stat, trust logos, logo text) & bagian bawah (Footer, CTA, social media) **terhubung langsung ke database SQLite**.

2. **Panel Admin / Dashboard (Sneat Bootstrap 5)**:
   - Akses via: `http://localhost:4321/admin`
   - Manajemen konten lengkap:
     - **Hero Section**: Edit teks logo atas, tombol CTA atas, tagline/eyebrow, judul, deskripsi, statistik, dan trust logos.
     - **Projects / Portofolio**: Tambah, edit, hapus karya dan tautan proyek.
     - **Services**: Kelola layanan yang ditawarkan.
     - **Skills**: Kelola keahlian & progress bar.
     - **Testimonials**: Kelola ulasan klien.
     - **FAQs**: Kelola pertanyaan umum.
     - **Settings & Footer**: Kelola identitas web, kontak, social media, serta seluruh teks penawaran CTA dan copyright footer bagian bawah.
     - **Pesan Masuk**: Menerima form kontak dari pengunjung.

3. **Database Lokal (SQLite)**:
   - Menggunakan native `node:sqlite` bawaan Node.js.
   - File database tersimpan di root folder: `database.sqlite`.
   - **Bisa berjalan 100% offline tanpa koneksi internet sama sekali**.

---

## 🚀 Cara Menjalankan Secara Offline

### 1. Buka Terminal / CMD / Git Bash
Arahkan ke folder proyek:
```bash
cd "C:\Users\finnpc\Documents\Kuliah\project\web\porto"
```

### 2. Jalankan Server Lokal
Cukup ketik perintah:
```bash
npm run dev
```

### 3. Buka di Browser
- **Halaman Utama / Portofolio**: [http://localhost:4321/](http://localhost:4321/)
  - Versi Bahasa Inggris: [http://localhost:4321/?lang=en](http://localhost:4321/?lang=en)
- **Dashboard Sneat CMS**: [http://localhost:4321/admin](http://localhost:4321/admin)

---

## 🛠️ Menu Manajemen di CMS Sneat (`/admin`)

| Menu | Fungsi |
|---|---|
| **Dashboard** | Ringkasan statistik jumlah proyek, layanan, pesan masuk, dan skill |
| **Hero (Bagian Atas)** | Edit teks brand logo atas, button header, headline utama, bio hero, dan statistik |
| **Projects** | Tambah / edit portofolio, teknologi yang digunakan, serta link demo |
| **Services** | Tambah / edit layanan digital |
| **Skills** | Tambah / edit tingkat keahlian (progress percentage) |
| **Testimonials** | Kelola ulasan klien |
| **FAQs** | Kelola tanya-jawab umum |
| **Settings & Footer (Bagian Bawah)** | Kelola profil, email, telepon, medsos, serta seluruh teks penawaran dan footer bawah |
| **Pesan Masuk** | Membaca pesan kontak dari formulir publik |

---

*Semua dependensi dan aset Sneat telah terpasang secara lokal di dalam folder proyek, siap digunakan kapan saja secara offline!*


Website portofolio ini dibangun dengan perpaduan:
1. **Frontend**: **Nova Astro** (Modern, cepat, responsif, Tailwind CSS v4, dynamic SSR).
2. **Dashboard / CMS**: **Sneat Admin Template** (Bootstrap 5, navigasi intuitif, panel edit lengkap).
3. **Database**: **SQLite** (`database.sqlite` lokal menggunakan built-in `node:sqlite`).
4. **Skill Integrasi**: Frontend Developer (React/Modern Layouts, UI state) & Design System (Design tokens, clean typography & component structure).

---

## 📂 Struktur Halaman & Fitur

- **Tampilan Depan (Nova Astro)**: `http://localhost:4321/`
  - Hero Section dinamis (headline, deskripsi, CTA button, statistik counter, tech stack).
  - Portfolio / Projects showcase.
  - Technical Expertise & Skill Level progress bar.
  - Layanan & Solusi Digital (Services grid).
  - Testimoni Klien & Review carousel.
  - FAQ (Pertanyaan yang sering diajukan).
  - Formulir Kontak interaktif (Pesan langsung masuk ke Inbox database SQLite).
  - Tombol melayang cepat *"Buka Sneat CMS"*.

- **Dashboard Admin (Sneat CMS)**: `http://localhost:4321/admin`
  - `/admin` : Ringkasan statistik (jumlah project, pesan inbox masuk, preview hero aktif).
  - `/admin/hero` : Edit konten hero depan secara real-time.
  - `/admin/projects` : CRUD (Tambah, Edit, Hapus) portofolio karya.
  - `/admin/services` : CRUD daftar layanan.
  - `/admin/skills` : CRUD keahlian & presentase skill bar.
  - `/admin/testimonials` : CRUD testimoni klien.
  - `/admin/faqs` : CRUD pertanyaan & jawaban.
  - `/admin/messages` : Kotak masuk pesan dari form kontak (bisa dibaca dan dihapus).
  - `/admin/settings` : Pengaturan data diri (Nama, Bio, Kontak WhatsApp/Email, Link Medsos).

---

## 🛠️ Cara Menjalankan Secara Offline

Semua dependencies sudah terpasang di folder:
`C:\Users\finnpc\Documents\Kuliah\project\web\porto`

### 1. Buka Terminal / CMD / Git Bash
Buka folder proyek ini di terminal Anda:
```bash
cd "C:\Users\finnpc\Documents\Kuliah\project\web\porto"
```

### 2. Jalankan Mode Development (Rekomendasi untuk edit langsung)
Jalankan perintah berikut:
```bash
npm run dev
```
Setelah muncul pesan `Local: http://localhost:4321/`:
- Buka browser dan kunjungi:
  - **Halaman Depan Portofolio**: [http://localhost:4321/](http://localhost:4321/)
  - **Dashboard Sneat CMS**: [http://localhost:4321/admin](http://localhost:4321/admin)

Setiap perubahan yang Anda simpan di CMS akan langsung tersimpan di database lokal `database.sqlite` dan langsung terupdate saat halaman depan di-refresh.

---

### 3. Menjalankan Mode Production Build (Opsional / Standalone)
Jika ingin menjalankan build yang sudah dioptimasi:
```bash
npm run build
npm run start
```
Aplikasi akan langsung berjalan di `http://localhost:4321/`.

---

## 🗄️ Lokasi Database
File database SQLite tersimpan lokal di root direktori proyek:
```
database.sqlite
```
Data aman, tidak membutuhkan server database eksternal (MySQL/Postgres tidak diperlukan), dan 100% bekerja saat komputer tidak terhubung ke internet (offline).
