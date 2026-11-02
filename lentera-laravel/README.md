# LENTERA BKPSDM KABUPATEN LUWU TIMUR (VERSI LARAVEL MVC)
### Layanan Elektronik Tata Naskah dan Administrasi Persuratan Terpadu
**Berdasarkan Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023**

Aplikasi ini merupakan implementasi versi **Laravel MVC (PHP 8.3+)** dari sistem informasi persuratan BKPSDM Kabupaten Luwu Timur yang dibangun sesuai dengan rancangan Bab III & Bab IV Dokumen Skripsi / Proposal Universitas Mega Buana Palopo (NIM: IK2311011 - Yusri Mahendra).

---

## 🌟 Keunggulan & Fitur Utama

1. **Arsitektur Model-View-Controller (MVC) Standar Industri:**
   - **Models (Eloquent ORM):** `Pegawai`, `KlasifikasiArsip`, `SuratMasuk`, `Disposisi`, `SuratKeluar`, `SuratTugas`, `SuratTugasPersonil`.
   - **Controllers:** Menangani validasi data, otorisasi RBAC, kalkulasi penomoran $N+1$, dan relasi antar entitas.
   - **Blade Views:** Tampilan *Clean Government Modern UI* responsif dengan visualisasi palet resmi BKPSDM Luwu Timur.

2. **Papan Informasi Penomoran Resmi (Anti Nomor Ganda):**
   - Menghitung secara *real-time* estimasi nomor urut berikutnya murni ($N+1$) berdasarkan nomor registrasi riil tertinggi di database.
   - Mencegah insiden duplikasi nomor naskah dinas antar-bidang yang sedang menyusun draf di Microsoft Word.

3. **Master Kode Klasifikasi Arsip Lengkap (2.961 Entri):**
   - Memuat 100% lampiran resmi **Perbup Luwu Timur No. 69 Tahun 2023** (kode `000` s.d. `900`).
   - Pencarian kode instan via AJAX Autocomplete saat registrasi naskah dinas.

4. **Surat Perintah Tugas (SPT) Multi-Personil:**
   - Terkunci pada kode klasifikasi resmi `800.1.11.1`.
   - Mendukung penugasan jamak (multi-aparatur) dari daftar lengkap **44 pegawai BKPSDM Luwu Timur**.
   - Dilengkapi fitur cetak format naskah fisik A4 resmi lengkap dengan pejabat penandatangan **PARHA ARIEF, S.AP** (Kepala BKPSDM).

5. **Lembar Kendali Disposisi Pimpinan:**
   - 6 Unit/Pejabat tujuan resmi sesuai format blanko kantor BKPSDM Luwu Timur.
   - Format cetak A4 lembar disposisi standar pemerintah daerah.

6. **Database Mandiri (Zero-Config SQLite):**
   - Telah terisi (*pre-seeded*) seluruh data autentik: 44 pegawai, 2.961 kode klasifikasi, 130 surat masuk, 822 surat keluar, dan 134 surat tugas.

---

## 🚀 Cara Menjalankan Aplikasi di Komputer Lokal

### 1. Masuk ke Direktori Proyek
Buka terminal (PowerShell / Command Prompt) dan arahkan ke folder ini:
```bash
cd "d:\pengembangan sistem informasi persuratan berbasis web\lentera-laravel"
```

### 2. Jalankan Server Artisan
```bash
php artisan serve
```

Aplikasi langsung aktif di:
👉 **http://127.0.0.1:8000** atau **http://localhost:8000**

---

## 🔑 Akun & Kredensial Pengujian (Demo / Ujian Skripsi)

Sistem telah dilengkapi data 44 aparatur BKPSDM Luwu Timur dengan pembagian hak akses (Role-Based Access Control):

| Peran (Role) | Identitas Login (NIP / Username) | Kata Sandi | Nama Pejabat / Pengguna |
| :--- | :--- | :--- | :--- |
| **Agendaris (Admin)** | `admin` | `123` | **Yusri Mahendra, S.Kom.** |
| **Pimpinan (Kepala BKPSDM)** | `198401142003122001` | `123456` | **PARHA ARIEF, S.AP** |
| **Kepala Bidang (Kabid)** | `198007202006041011` | `123456` | **Muhammad Yusuf, S.Sos., M.Si.** |
| **Staf Pelaksana** | `198903252011012004` | `123456` | **Fitriani, S.STP.** |

*(Pada halaman login tersedia tombol sekali klik "Akun Cepat untuk Uji Coba" untuk kemudahan demonstrasi).*

---

## 🗄️ Struktur Basis Data Relasional (7 Tabel)

1. `pegawai` (Master 44 personil BKPSDM + RBAC + auth)
2. `klasifikasi_arsip` (2.961 kode Perbup 69/2023)
3. `surat_masuk` (130 buku agenda surat masuk)
4. `disposisi` (Alur disposisi instruksi pimpinan)
5. `surat_keluar` (822 buku agenda surat keluar)
6. `surat_tugas` (134 Surat Perintah Tugas dinas)
7. `surat_tugas_personil` (Relasi personil aparatur yang ditugaskan)

---

## 🛠️ Perintah Berguna Artisan

- **Reset dan isi ulang data awal (Clean Seed):**
  ```bash
  php artisan migrate:fresh --seed
  ```
- **Cek daftar rute aplikasi:**
  ```bash
  php artisan route:list
  ```
- **Uji verifikasi sistem:**
  ```bash
  php scripts/verify_laravel.php
  ```
