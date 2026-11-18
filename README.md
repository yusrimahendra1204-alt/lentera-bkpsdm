# LENTERA BKPSDM — Sistem Informasi Persuratan Berbasis Web

**Layanan Elektronik Tata Naskah dan Administrasi (LENTERA)** pada **BKPSDM Kabupaten Luwu Timur** berbasis **Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023** tentang Kode Klasifikasi Arsip Pemerintah Daerah.

---

## 📋 Prasyarat Sistem (Laptop/Komputer Pengujian)

1. **Node.js** versi **18 LTS** atau **22 LTS** ([https://nodejs.org](https://nodejs.org))
2. **Git** (opsional jika menggunakan *Download ZIP* dari GitHub)
3. **Visual Studio Code (VS Code)** atau **Antigravity IDE**
4. **Google Chrome / Microsoft Edge** (untuk membuka aplikasi)

---

## 🧩 Ekstensi VS Code yang Disarankan (Opsional untuk Presentasi Kode)

Aplikasi web ini berjalan menggunakan **Node.js + Vanilla JavaScript**, sehingga **tidak wajib** menginstal ekstensi apa pun untuk menjalankannya. Namun, agar tampilan kode lebih rapi saat dipresentasikan di VS Code:
* **ESLint** (`dbaeumer.vscode-eslint`) — penyorotan sintaks & pengecekan kode JavaScript
* **Prettier - Code formatter** (`esbenp.prettier-vscode`) — perapian format kode
* **Material Icon Theme** (`PKief.material-icon-theme`) — ikon folder & file yang jelas di Sidebar

*(Catatan: Jangan jalankan file HTML lewat Live Server; selalu jalankan melalui server Node.js agar API `/api/*` aktif.)*

---

## 🚀 Langkah Menjalankan Setelah Download / Clone dari GitHub

1. **Unduh Proyek:**
   ```bash
   git clone https://github.com/yusrimahendra1204-alt/persuratan-bkpsdm.git
   cd persuratan-bkpsdm
   ```
   *(Atau ekstrak file `.zip` dari GitHub, lalu buka foldernya di VS Code via `File -> Open Folder`.)*

2. **Instal Dependensi:**
   Buka Terminal di VS Code (`Ctrl + ~`), lalu jalankan:
   ```bash
   npm install
   ```

3. **Jalankan Server Aplikasi:**
   * **Mode Lokal / Portabel (Tanpa Setup MySQL, menggunakan data JSON `data/current_state.json`):**
     ```bash
     node server.js
     ```
   * **Mode Produksi MySQL (Jika `.env` sudah dikonfigurasi ke database MySQL):**
     ```bash
     npm run start:mysql
     ```

4. **Buka di Browser:**
   Akses alamat berikut di Google Chrome / Edge:
   ```
   http://localhost:3000
   ```
