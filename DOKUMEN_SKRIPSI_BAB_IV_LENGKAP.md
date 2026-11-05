# BAB IV
# HASIL DAN PEMBAHASAN

## 4.1 Hasil Penelitian

Penelitian ini menghasilkan sebuah perangkat lunak sistem tata kelola persuratan kedinasan bernama **Sistem Informasi Persuratan Berbasis Web pada Badan Kepegawaian dan Pengembangan Sumber Daya Manusia (BKPSDM) Kabupaten Luwu Timur**. Pengembangan sistem ini dilaksanakan secara disiplin dan bertahap memedomani metode *Software Development Life Cycle* (SDLC) model **Waterfall** yang meliputi tahap analisis kebutuhan, perancangan sistem (*design*), implementasi (*coding*), pengujian (*testing*), serta penyebaran dan pemeliharaan (*maintenance*).

Pembangunan sistem ini merujuk secara ketat pada regulasi resmi kearsipan daerah, yaitu **Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023 tentang Kode Klasifikasi Arsip di Lingkungan Pemerintah Daerah** (turunan dari Permendagri Nomor 83 Tahun 2022), dengan penekanan utama pada klaster **800 (Kepegawaian)** yang menjadi tugas pokok dan fungsi (tupoksi) utama BKPSDM Kabupaten Luwu Timur.

---

### 4.1.1 Analisis Sistem yang Sedang Berjalan (Existing System)

Berdasarkan hasil observasi dan wawancara mendalam yang dilakukan di Subbagian Umum dan Kepegawaian BKPSDM Kabupaten Luwu Timur, alur pengelolaan naskah dinas yang berjalan sebelum adanya sistem informasi adalah sebagai berikut:

```mermaid
flowchart TD
    A([Surat Fisik Diterima dari Instansi Pengirim]) --> B[Agendaris Mencatat di Buku Agenda Fisik]
    B --> C[Agendaris Menyelipkan Lembar Disposisi Kertas Resmi Kantor]
    C --> D[Berkas Fisik Dibawa ke Meja Kepala BKPSDM]
    D --> E[Kepala BKPSDM Membaca, Memberikan Instruksi Tulisan Tangan & Membubuhkan Paraf Basah]
    E --> F[Berkas Fisik Dikembalikan ke Subbag Umum]
    F --> G{Tujuan Disposisi?}
    G -->|Sekretaris| H[Didistribusikan Manual ke Ruang Sekretaris]
    G -->|Kepala Bidang| I[Didistribusikan Manual ke Ruang Kabid Terkait]
    H --> J[Tindak Lanjut & Pembuatan Konsep Surat Keluar/Balasan]
    I --> J
    J --> K[Agendaris Mengetik Surat Keluar Manual di Word]
    K --> L[Pemberian Nomor Surat Keluar di Buku Registrasi Manual]
    L --> M([Surat Keluar Ditandatangani Basah & Dikirim ke Instansi Tujuan])
```

#### Deskripsi Prosedur Manual:
1. **Penerimaan Surat Masuk:** Surat dinas fisik dari instansi luar (Organisasi Perangkat Daerah/OPD lain, instansi vertikal, maupun instansi swasta) diterima oleh staf Subbagian Umum/Agendaris.
2. **Pencatatan Agenda Fisik:** Agendaris menuliskan identitas surat (nomor surat pengirim, asal instansi, tanggal surat, dan perihal) ke dalam buku agenda besar berbentuk buku tulis fisik bergaris.
3. **Penyertaan Lembar Disposisi Fisik Kantor:** Kantor BKPSDM telah memiliki stok cetakan resmi lembar disposisi kertas kosong. Agendaris menjepitkan lembar kertas tersebut pada map surat dinas, lalu membawa map fisik tersebut ke ruangan Kepala BKPSDM (*PARHA ARIEF, S.AP*).
4. **Disposisi Manual oleh Pimpinan:** Kepala BKPSDM membaca isi surat, memilih kotak instruksi menggunakan pulpen (misalnya: *Tindak lanjuti, Hadiri, Pelajari/Telaah, Koordinasikan*), menuliskan catatan khusus arahan pimpinan, dan membubuhkan paraf atau tanda tangan basah langsung pada lembar kertas tersebut.
5. **Distribusi Fisik Naskah:** Lembar disposisi yang telah diparaf basah kemudian dibawa kembali ke Subbag Umum untuk difotokopi atau langsung diserahkan secara fisik ke meja pejabat struktural penerima disposisi (Sekretaris Badan atau Kepala Bidang terkait).
6. **Pembuatan Naskah Balasan / Surat Keluar:** Pejabat struktural atau staf analis kepegawaian menyusun konsep naskah surat dinas balasan menggunakan aplikasi pengolah kata (*Microsoft Word*).
7. **Penomoran Surat Keluar:** Staf membawa draf surat keluar ke agendaris untuk meminta nomor surat resmi. Agendaris melihat buku register surat keluar fisik untuk mencatat nomor urut berikutnya.

---

### 4.1.2 Identifikasi Permasalahan Sistem yang Berjalan

Berdasarkan analisis alur kerja sistem manual di atas, diidentifikasi beberapa permasalahan mendasar yang menjawab **Rumusan Masalah 1 dan 2** pada Bab I penelitian ini:

1. **Ketiadaan Buku Kendali Monitoring Disposisi:**
   Setelah berkas surat fisik dibawa ke ruangan pejabat struktural, agendaris maupun pimpinan kehilangan jejak (*losing track*) mengenai posisi berkas naskah dan sejauh mana tindak lanjut arahan telah dilaksanakan.
2. **Kerapuhan dan Risiko Kerusakan Buku Agenda Fisik:**
   Pencatatan yang bertumpu pada lembaran kertas buku agenda berisiko robek, terkena tumpahan air, aus akibat frekuensi buka-tutup halaman, serta sangat sulit ditelusuri kembali (*information retrieval*) ketika pimpinan membutuhkan riwayat surat masuk beberapa bulan yang lalu.
3. **Ketidaksesuaian Kodifikasi Surat Keluar (Human Error):**
   Pada sistem manual, agendaris kerap kali mengalami keraguan dalam menentukan kode klasifikasi arsip yang tepat di antara ribuan kode klasifikasi yang ada. Seringkali agendaris hanya menyalin mentah-mentah kode klasifikasi yang tercantum pada surat pengirim. Padahal instansi luar pengirim surat sering kali menggunakan kode klasifikasi yang keliru atau tidak sesuai dengan tata naskah kepegawaian BKPSDM berdasarkan Perbup Luwu Timur No. 69 Tahun 2023.
4. **Ketiadaan Mekanisme Penyandingan (*Pairing*) Nomor Surat Balasan:**
   Tidak tersedianya kartu kendali yang menghubungkan secara eksplisit antara **Nomor Surat Asal dari Pengirim** dengan **Nomor Surat Keluar Resmi BKPSDM** yang menjawab surat tersebut, sehingga arsip balasan terpisah dari surat masuk asalnya.

---

### 4.1.3 Analisis Kebutuhan Sistem Baru

Guna mengatasi kelemahan sistem berjalan tanpa mengubah kultur kedinasan yang telah baku, sistem baru dirancang memenuhi spesifikasi kebutuhan fungsional dan non-fungsional sebagai berikut:

#### A. Kebutuhan Fungsional (*Functional Requirements*):
1. **Pengelolaan Akun & Hak Akses Berjenjang (RBAC):** Sistem harus mengamankan otentikasi pengguna menggunakan NIP resmi 18 digit dan membagi hak akses ke dalam 5 peran kedinasan: Administrator/Agendaris, Kepala BKPSDM, Sekretaris Badan, Kepala Bidang, dan Staf Pelaksana.
2. **Pencatatan Buku Agenda Surat Masuk Digital (Pencatatan Cepat):** Sistem harus mampu mencatat nomor registrasi agenda otomatis, nomor surat asal pengirim, instansi pengirim, perihal ringkas, tanggal diterima, sifat naskah, dan penetapan kode klasifikasi kearsipan internal BKPSDM secara cepat dan efisien tanpa membebani agendaris dengan pemindaian lampiran berkas fisik yang diedarkan manual bersama lembar disposisi.
3. **Buku Kendali Disposisi Manual (Perekaman Arahan Pimpinan):** Sesuai kondisi riil di mana lembar fisik disposisi telah dicetak resmi oleh dinas dan disposisi dilakukan manual oleh Kepala BKPSDM dengan tulisan tangan dan paraf basah, maka sistem **tidak perlu mencetak blanko kosong**. Sistem berfungsi merekam (*logging*) hasil instruksi manual, catatan khusus, pejabat tujuan, dan batas waktu penyelesaian ke dalam **Buku Kendali Digital** agar status penyelesaian dapat dipantau bersama secara *real-time*.
4. **Penyandingan Nomor Surat Keluar & Validasi Kode Perbup yang Benar:** Sistem harus menyediakan fitur relasional untuk mengaitkan surat keluar balasan dengan surat masuk asalnya. Sistem harus secara tegas menyandingkan nomor pengirim asal dengan nomor keluar resmi BKPSDM, sekaligus memvalidasi bahwa kode klasifikasi yang dipakai adalah **kode klasifikasi yang benar** memedomani Perbup Luwu Timur No. 69 Tahun 2023.
5. **Mesin Rekomendasi Pintar (*Smart Auto-Suggest Engine*):** Saat pengguna mengetikkan perihal surat (misalnya: *"usulan kenaikan pangkat"*), sistem secara otomatis mencocokkan kata kunci ke dalam kamus 2.961 kode klasifikasi arsip daerah dan menyajikan rekomendasi kode tercepat dalam waktu < 15 milidetik.
6. **Buku Agenda & Penomoran Resmi Surat Perintah Tugas (SPT) Terpusat:** Sistem harus menyediakan modul buku agenda khusus untuk mencatat dan mengunci penomoran resmi digital terpusat (*centralized digital numbering*) bagi SPT kedinasan (kode `800.1.11.1`) guna mencegah penomoran ganda atau loncat antar-bidang. Sistem mencatat bidang pengusul penugasan, personil aparatur yang ditugaskan, maksud perjalanan dinas, lokasi, tanggal tugas, serta fitur salin nomor cepat (*copy-to-clipboard*). Naskah fisik SPT disusun dan dicetak secara mandiri oleh bidang teknis pembuat untuk ditandatangani basah oleh Kepala BKPSDM.
7. **Pencarian Cepat Kamus Perbup 69/2023:** Sistem menyediakan antarmuka pencarian cepat seluruh regulasi kode klasifikasi kearsipan daerah Kabupaten Luwu Timur yang terbagi ke dalam tab kategori (Kepegawaian 800, Umum 000, Pemerintahan 100, Keuangan 900, dll).

#### B. Kebutuhan Non-Fungsional (*Non-Functional Requirements*):
1. **Kinerja & Kecepatan (*Performance*):** Waktu pencarian dan pemfilteran 2.961 entri klasifikasi arsip harus berlangsung instan (*real-time in-memory filtering*) tanpa menyebabkan kelambatan (*lag*) pada peramban web (*browser*).
2. **Portabilitas Penuh (*Portability & Zero-Dependency*):** Aplikasi dapat dijalankan secara instan pada lingkungan pengujian/sidang skripsi tanpa memerlukan instalasi perangkat lunak server web pihak ketiga yang rumit.
3. **Keandalan & Integritas Data (*Reliability & Backup*):** Seluruh data persuratan dan relasi antar-tabel harus tersinkronisasi secara otomatis ke dalam skrip cadangan basis data SQL standar ANSI/MySQL (`database_persuratan.sql`).

---

### 4.1.4 Perancangan Sistem Baru

#### A. Pemodelan Use Case Diagram
Arsitektur fungsional sistem informasi persuratan dimodelkan menggunakan *Unified Modeling Language* (UML) Use Case Diagram dengan 3 kelompok aktor utama: **Admin / Agendaris Subbag Umum**, **Pimpinan (Kepala BKPSDM)**, dan **Pejabat Struktural / Staf Pelaksana**:

```mermaid
graph LR
    subgraph Aktor Pengguna
        Admin((Admin / Agendaris))
        Kaban((Kepala BKPSDM))
        Pejabat((Sekretaris / Kabid / Staf))
    end

    subgraph Sistem Informasi Persuratan BKPSDM
        UC1[Login & Autentikasi NIP]
        UC2[Kelola Akun Pegawai RBAC]
        UC3[Catat Buku Agenda Surat Masuk Cepat]
        UC4[Input Rekaman Disposisi Manual]
        UC5[Monitoring Buku Kendali Disposisi]
        UC6[Update Status Tindak Lanjut Disposisi]
        UC7[Terbitkan Surat Keluar Mandiri]
        UC8[Sandingkan Nomor Surat & Kode Perbup yang Benar]
        UC9[Catat Agenda & Kunci Nomor Resmi SPT 800.1.11.1]
        UC10[Pencarian Kamus Kode Perbup 69/2023]
        UC11[Cetak Naskah Surat Keluar & Rekap Agenda]
    end

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    Admin --> UC11

    Kaban --> UC1
    Kaban --> UC5
    Kaban --> UC10

    Pejabat --> UC1
    Pejabat --> UC5
    Pejabat --> UC6
    Pejabat --> UC10
```

#### B. Skenario Alur Kerja (Activity Diagram)
Berikut adalah alur terintegrasi antara proses administrasi fisik kantor dengan sistem informasi persuratan:

```mermaid
sequenceDiagram
    autonumber
    actor Pengirim as Instansi Pengirim
    actor Agendaris as Agendaris Subbag Umum
    actor Kaban as Kepala BKPSDM
    actor Bidang as Sekretaris / Bidang Teknis
    participant Web as Sistem Web Persuratan

    Pengirim->>Agendaris: Mengirimkan Surat Fisik
    Agendaris->>Web: Input Agenda Surat Masuk Cepat (Nomor Asal, Tanggal, Perihal)
    Agendaris->>Agendaris: Menyisipkan Lembar Fisik Disposisi Kantor
    Agendaris->>Kaban: Menyerahkan Berkas Fisik ke Ruang Kepala Badan
    Note over Kaban: Kepala BKPSDM membaca naskah fisik,<br/>menuliskan instruksi & paraf basah manual
    Kaban->>Agendaris: Mengembalikan Berkas Fisik yang Sudah Didisposisi
    Agendaris->>Web: Buka Menu Catat Disposisi & Input Rekaman Instruksi Manual
    Web-->>Web: Status Surat Menjadi 'Didisposisi' & Masuk Buku Kendali
    Agendaris->>Bidang: Meneruskan Berkas Fisik ke Meja Bidang Pengampu
    Bidang->>Web: Memantau Buku Kendali Disposisi & Menindaklanjuti Tugas
    Bidang->>Agendaris: Minta Nomor Surat Keluar Balasan / Nomor Agenda SPT
    Agendaris->>Web: Pilih Surat Masuk Asal & Sandingkan Nomor (atau Kunci Nomor SPT)
    Web-->>Web: Mengunci Kode Perbup 69/2023 yang Benar & Menerbitkan Nomor Resmi
    Web-->>Agendaris: Nomor Terbit (Disediakan Fitur Salin Nomor & Kartu Sanding)
    Agendaris->>Bidang: Menyerahkan Nomor Resmi untuk Disematkan ke Naskah Word Fisik
    Bidang->>Kaban: Naskah Fisik Dicetak Mandiri oleh Bidang untuk TTD Basah Kaban
```

#### C. Perancangan Basis Data Relasional (Entity Relationship)
Arsitektur basis data sistem dirancang memedomani prinsip relasional MySQL dengan 7 tabel utama:

1. **`pegawai`**: Menyimpan identitas aparatur, NIP, nama lengkap, pangkat/golongan, jabatan kedinasan, unit kerja, kata sandi, dan peran hak akses (*Role-Based Access Control*).
2. **`klasifikasi_arsip`**: Memuat 2.961 entri hierarki kode klasifikasi arsip berdasarkan Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023 lengkap dengan kategori dan kata kunci pencarian.
3. **`surat_masuk`**: Menyimpan nomor agenda urut internal, nomor surat asli pengirim, nama instansi pengirim, perihal surat, tanggal surat, tanggal diterima, sifat naskah, kode kearsipan usulan, dan status disposisi.
4. **`disposisi`**: Menyimpan data rekaman instruksi manual Kepala BKPSDM, pejabat struktural tujuan, sifat arahan, rincian instruksi tulisan tangan, catatan khusus, batas waktu penyelesaian, dan status tindak lanjut penanganan. Memiliki *foreign key* berelasi ke tabel `surat_masuk` dan `pegawai`.
5. **`surat_keluar`**: Menyimpan nomor agenda surat keluar, nomor surat resmi BKPSDM format `[KODE]/[URUT]/BKPSDM/[ROMAWI]/[TAHUN]`, identitas bidang/unit kerja pembuat naskah (`bidang_pembuat`), tujuan surat, perihal, penandatangan, metode fisik dokumen, bendera surat balasan (`is_surat_balasan`), tautan relasi ke `id_surat_masuk_asal`, serta `no_surat_pengirim_asal`.
6. **`surat_tugas`**: Menyimpan buku agenda Surat Perintah Tugas (SPT) khusus kode `800.1.11.1`, nomor urut resmi digital terpusat, identitas bidang/unit kerja pengusul penugasan (`bidang_pengusul`), dasar hukum penugasan, maksud kedinasan, lokasi tujuan, rentang tanggal penugasan, lama hari kerja, dan pembebanan anggaran.
7. **`surat_tugas_personil`**: Tabel relasi *many-to-many* antara satu naskah `surat_tugas` dengan banyak personil `pegawai` yang ditugaskan dalam surat perintah tersebut.

---

### 4.1.5 Implementasi Antarmuka Sistem

Implementasi antarmuka (*user interface*) dibangun menggunakan pendekatan *Modern Clean Office Design* dengan palet warna biru kedinasan (*deep navy*), tipografi standar modern, serta penataan tata letak (*layout*) yang ergonomis.

#### 1. Halaman Autentikasi Pengguna & Panel Akses Cepat Simulasi Sidang
Halaman login dirancang sebagai gerbang masuk resmi aparatur BKPSDM. Dilengkapi panel *Simulasi Akses Cepat (1-Click Login)* yang mempermudah penguji atau mahasiswa mendemonstrasikan perpindahan peran (Admin, Kepala BKPSDM, Sekretaris, Kabid, Staf Pelaksana) secara instan saat sidang skripsi berlangsung:

![Halaman Login Resmi BKPSDM Luwu Timur](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/halaman_login.png)

#### 2. Halaman Dashboard & Monitoring Persuratan Real-time
Menampilkan ringkasan statistik persuratan secara komprehensif, mencakup jumlah surat masuk bulan berjalan, volume surat keluar, status antrean disposisi manual, serta pintasan cepat menuju modul operasional:

![Dashboard Sistem Informasi Persuratan](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/dashboard_loaded_1792907314464.png)

#### 3. Modul Kelola Pegawai & Hak Akses Pengguna (RBAC)
Menyajikan daftar aparatur di lingkungan BKPSDM Kabupaten Luwu Timur lengkap dengan NIP, pangkat, jabatan, dan wewenang sistem. Administrator dapat menambah aparatur baru dengan validasi format NIP 18 digit:

![Modul Kelola Pegawai RBAC](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/kelola_pegawai.png)

#### 4. Pratinjau Berkas Digital Surat Masuk (Format Naskah A4)
Menampilkan naskah dinas surat masuk dalam format lembar kerja A4 resmi, lengkap dengan nomor surat pengirim, stempel registrasi agenda masuk, dan kode klasifikasi kearsipan internal BKPSDM:

![Pratinjau Berkas Digital Surat Masuk](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/berkas_surat_masuk.png)

#### 5. Modul Buku Kendali Disposisi Manual Kepala BKPSDM
Sesuai kebutuhan lapangan di mana lembar fisik disposisi telah dicetak resmi di kantor dan instruksi ditulis tangan oleh Kepala BKPSDM (*PARHA ARIEF, S.AP*), modul ini berfungsi sebagai **Buku Kendali Digital**. Staf agendaris merekam ringkasan centangan instruksi dan catatan pimpinan dari lembar kertas fisik ke dalam sistem. Di sini tidak ada fitur cetak blanko kosong, melainkan tombol untuk **Merekam Hasil Disposisi Manual** dan **Melihat Rekaman Disposisi**:

![Buku Kendali Disposisi Manual Kepala BKPSDM](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/buku_kendali_disposisi_terbaru.png)

#### 6. Lembar Kartu Kendali Penyandingan Nomor Surat Keluar & Kode Klasifikasi yang Benar
Fitur unggulan kearsipan yang menyandingkan secara berdampingan antara **Nomor Surat Asal dari Instansi Pengirim** dengan **Nomor Surat Keluar Resmi BKPSDM**. Sistem secara cerdas mengunci dan mengadopsi **Kode Klasifikasi Arsip yang Benar** sesuai Perbup Luwu Timur Nomor 69 Tahun 2023:

![Kartu Kendali Penyandingan Nomor Surat Keluar](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/kartu_sanding_nomor.png)

#### 7. Naskah Dinas Resmi Surat Keluar A4 dengan Box Rujukan Penyandingan
Format cetak naskah surat dinas keluar ukuran A4 yang memuat kop surat resmi lambang Pemerintah Kabupaten Luwu Timur, nomor surat terformat otomatis, box rujukan penyandingan nomor surat masuk asal, serta stempel dinas dan tanda tangan basah pimpinan:

![Naskah Dinas Resmi Surat Keluar A4](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/naskah_sanding_a4.png)

#### 8. Modul Buku Agenda & Kartu Kendali Penomoran SPT Terpusat
Menyajikan antarmuka buku agenda Surat Perintah Tugas (SPT) kedinasan (kode `800.1.11.1`) yang dikelola oleh Subbagian Umum. Menampilkan nomor registrasi resmi terpusat, identitas bidang pengusul penugasan, rincian personil aparatur yang ditugaskan, maksud perjalanan dinas, lokasi, tanggal penugasan, serta tombol pintas **"Salin No"** (*clipboard*) dan **"Detail Agenda"**. Hal ini sejalan dengan pembagian wewenang kedinasan di mana naskah fisik SPT disusun dan dicetak mandiri oleh bidang teknis pengusul, sedangkan sistem web berfungsi sebagai pengunci nomor resmi agar tidak terjadi nomor ganda antar-bidang:

![Buku Agenda dan Kartu Kendali Penomoran SPT](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/naskah_spt_a4_resmi.png)

#### 9. Formulir Pencatatan Cepat Surat Masuk (Tanpa Beban Lampiran Fisik)
Formulir input surat masuk yang dioptimalkan untuk pencatatan cepat data naskah dinas dari instansi luar (nomor surat pengirim, instansi pengirim, perihal, dan tanggal diterima) yang langsung disandingkan dengan rekomendasi pintar (*smart auto-suggest*) kode klasifikasi kearsipan internal BKPSDM memedomani Perbup 69/2023, tanpa memperlambat alur kerja registrasi dengan pemindaian lampiran berkas fisik yang telah diedarkan manual bersama lembar disposisi pimpinan:

![Formulir Pencatatan Surat Masuk Cepat](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/surat_masuk_fitur_baru.png)

#### 10. Profil Pengguna & Keamanan Akun (Fitur Ubah Kata Sandi)
Modal profil aparatur yang dapat diakses dengan mengklik avatar pengguna di bilah navigasi atas. Menyajikan NIP resmi, pangkat/golongan, jabatan, hak akses (RBAC), serta formulir pengubahan kata sandi (*password*) akun aparatur secara mandiri:

![Profil Pengguna dan Ubah Kata Sandi](C:/Users/ACER/.gemini/antigravity-ide/brain/a3bca879-d384-4458-8d13-43c8bb6640ad/profil_pengguna_modal.png)

---

## 4.2 Pengujian Sistem (Testing)

Pengujian perangkat lunak dilakukan menggunakan metode **Black Box Testing** (pengujian kotak hitam) untuk memverifikasi fungsionalitas sistem informasi dari perspektif pengguna tanpa harus memeriksa struktur internal kode program. Pengujian difokuskan pada validitas masukan (*input*), ketepatan proses bisnis (*processing*), dan kesesuaian keluaran (*output*) terhadap kebutuhan pengguna.

### 4.2.1 Tabel Hasil Pengujian Black Box Testing

Berikut adalah rekapitulasi hasil pengujian fungsionalitas sistem yang mencakup 22 kasus uji komprehensif:

| No | Kasus Uji | Skenario Pengujian | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | Autentikasi Pengguna (Login) | Memasukkan NIP dan kata sandi yang terdaftar pada sistem, lalu menekan tombol "Masuk ke Sistem Persuratan". | Sistem memvalidasi kredensial, menyimpan status sesi pengguna, dan menampilkan halaman Dashboard sesuai peran aparatur. | Sistem berhasil masuk ke Dashboard dan menampilkan nama serta jabatan pengguna pada header. | **VALID** |
| **2** | Akses Cepat Simulasi Sidang | Menekan salah satu tombol akun aparatur pada panel "Simulasi Akses Cepat (Sidang Skripsi)". | Sistem secara instan mengautentikasi pengguna terpilih tanpa perlu memasukkan NIP secara manual. | Sistem langsung login sebagai pejabat/staf terpilih dan memperbarui hak akses menu. | **VALID** |
| **3** | Keluar Sistem (Logout) | Menekan tombol "Keluar" pada pojok kanan atas bilah navigasi header dan mengonfirmasi dialog. | Sistem mengakhiri sesi aktif pengguna dan mengarahkan kembali ke halaman login resmi. | Pengguna berhasil keluar dari sesi dan halaman login resmi ditampilkan kembali. | **VALID** |
| **4** | Pencatatan Surat Masuk Baru | Mengisi data instansi pengirim, nomor surat asal, mengetik perihal surat di buku agenda, dan memilih kode klasifikasi usulan. | Sistem mencatat surat masuk, memberikan nomor agenda urut otomatis, dan menyandingkan kode kearsipan. | Data surat masuk tersimpan dan muncul pada tabel dengan status "Menunggu Disposisi". | **VALID** |
| **5** | Fitur Auto-suggest Kode Perbup | Mengetik kata kunci perihal (contoh: "Cuti", "Pangkat", "Disiplin") pada formulir surat masuk/keluar. | Algoritma *smart auto-suggest* mencocokkan kata kunci ke kamus 2.961 kode Perbup 69/2023 secara *real-time*. | Rekomendasi kode klasifikasi dan deskripsinya muncul seketika di bawah kolom isian. | **VALID** |
| **6** | Pratinjau Berkas Digital A4 | Menekan tombol "Berkas" pada baris data surat masuk. | Sistem menampilkan modal pratinjau lembar naskah dinas digital format A4 lengkap dengan kop, isi, dan tanda registrasi arsip. | Modal pratinjau lembar naskah dinas A4 muncul secara rapi dan tombol cetak berfungsi normal. | **VALID** |
| **7** | Perekaman Disposisi Manual ke Sistem | Menekan tombol "✍️ Catat Disposisi" pada baris surat masuk, menyalin instruksi centangan dan catatan tulisan tangan pimpinan dari lembar fisik kantor. | Sistem menyimpan ringkasan instruksi tulisan tangan ke dalam buku kendali digital dan memperbarui status surat menjadi "Didisposisi". | Hasil disposisi manual tersimpan rapi di buku kendali digital dan status surat terbarui. | **VALID** |
| **8** | Monitoring Buku Kendali Disposisi | Membuka menu Buku Kendali Disposisi untuk memantau surat yang telah didisposisi manual dan status tindak lanjut oleh pejabat terkait. | Sistem menyajikan rekapitulasi pejabat tujuan, instruksi pimpinan, batas waktu, dan status tindak lanjut surat. | Daftar disposisi manual pimpinan tersaji terstruktur dan status tindak lanjut dapat diperbarui. | **VALID** |
| **9** | Pembuatan Surat Keluar Mandiri | Mengisi perihal surat keluar baru, memilih kode klasifikasi arsip, dan menetapkan tujuan surat. | Sistem mengunci nomor urut surat resmi dengan format `[KODE]/[URUT]/BKPSDM/[ROMAWI]/[TAHUN]`. | Nomor surat keluar resmi diterbitkan dan dicatat ke dalam buku kendali surat keluar. | **VALID** |
| **10** | Penyandingan Nomor Surat & Kode Perbup yang Benar | Memilih opsi "Ya, Balasan atas Surat Masuk", memilih surat masuk asal dari pengirim, dan memverifikasi kode Perbup yang benar. | Sistem menyandingkan nomor surat asal pengirim dengan nomor surat keluar resmi BKPSDM serta mengadopsi kode klasifikasi kearsipan yang benar sesuai Perbup 69/2023. | Nomor pengirim asal dan nomor BKPSDM tersandingkan secara logis berdampingan pada kartu kendali dan naskah dinas resmi. | **VALID** |
| **11** | Deteksi Berkas Rahasia (Disiplin/Cerai) | Memilih kode klasifikasi rahasia (contoh: `800.1.6.2` Hukuman Disiplin atau `800.1.8.1` Izin Perceraian). | Sistem otomatis mengunci sifat surat menjadi "Rahasia" dan menetapkan tata cara fisik naskah bersampul segel tertutup. | Peringatan naskah beramplop segel muncul dan metode dokumen otomatis diset fisik beramplop. | **VALID** |
| **12** | Pratinjau Naskah Dinas Resmi A4 | Menekan tombol "Naskah" pada baris data surat keluar. | Sistem menampilkan modal naskah dinas resmi BKPSDM Luwu Timur lengkap dengan kop lambang daerah, stempel dinas, dan box rujukan penyandingan nomor. | Naskah dinas resmi tampil sempurna dalam format lembar surat A4 dengan stempel dinas ganda. | **VALID** |
| **13** | Pencatatan Agenda & Penomoran Resmi SPT Multi-Pegawai | Memilih bidang pengusul penugasan, mengisi maksud kedinasan, memilih beberapa personil aparatur pelaksana, lokasi tujuan, dan tanggal penugasan. | Sistem mengunci nomor urut resmi SPT secara terpusat format `800.1.11.1/[URUT]/BKPSDM/[ROMAWI]/[TAHUN]`, mencatat ke buku agenda, dan mengaitkan personil secara relasional. | Nomor resmi SPT berhasil diterbitkan, data agenda tersimpan, dan kartu kendali penugasan muncul pada tabel. | **VALID** |
| **14** | Penelusuran Kamus Perbup 69/2023 | Membuka menu Kamus Perbup 69/2023, memilih tab filter (Kepegawaian 800, Umum 000, dll) atau mengetik pencarian. | Sistem memfilter 2.961 entri kode arsip resmi daerah Kabupaten Luwu Timur secara instan. | Data hierarki kode arsip ditampilkan lengkap beserta penanda status aktif dan retensi arsip. | **VALID** |
| **15** | Rekapitulasi Buku Agenda & Laporan | Membuka menu Buku Agenda & Rekap, memfilter berdasarkan rentang tanggal dan jenis naskah persuratan. | Sistem menyajikan rekapitulasi agenda dinas dan menyediakan tombol cetak laporan bulanan/tahunan. | Rekapitulasi agenda persuratan tampil presisi dan siap dicetak untuk pelaporan ke pimpinan. | **VALID** |
| **16** | Manajemen Pengguna (Tambah Pegawai) | Mengisi formulir pendaftaran aparatur (NIP, nama, pangkat, jabatan, hak akses) dan menekan "Daftarkan Pegawai". | Sistem memvalidasi keunikan NIP dan menyimpan data akun aparatur baru ke dalam tabel pegawai. | Akun aparatur baru berhasil ditambahkan dan langsung muncul pada tabel daftar aparatur. | **VALID** |
| **17** | Manajemen Pengguna (Ubah & Hapus) | Mengubah data jabatan/peran pegawai atau menghapus akun simulasi yang tidak aktif. | Sistem memperbarui data pegawai atau menghapus akun setelah konfirmasi persetujuan dari administrator. | Data akun berhasil diperbarui atau dihapus secara aman dari sistem. | **VALID** |
| **18** | Sinkronisasi Basis Data MySQL | Menjalankan mutasi data persuratan (tambah surat masuk, surat keluar, disposisi, pegawai). | Server secara otomatis menyinkronkan seluruh perubahan ke file `database_persuratan.sql` standar MySQL. | File SQL terbarui secara konsisten dengan struktur `CREATE TABLE` dan data `INSERT INTO` yang valid. | **VALID** |
| **19** | Fitur Ubah dan Hapus Persuratan (Full CRUD) | Menekan tombol "Ubah" atau "Hapus" pada baris Surat Masuk, Surat Keluar, Disposisi, atau SPT. | Sistem menampilkan form edit terisi lengkap atau meminta konfirmasi penghapusan aman. | Data berhasil diperbarui atau dihapus secara konsisten dari memori dan basis data. | **VALID** |
| **20** | Pencatatan Cepat Surat Masuk (Tanpa Beban Lampiran) | Mengisi data identitas surat masuk (nomor asal pengirim, instansi, tanggal, dan perihal) pada form tambah surat masuk tanpa lampiran berkas. | Sistem mencatat agenda surat masuk secara instan dan efisien tanpa hambatan pemrosesan unggah berkas fisik tebal. | Data surat masuk berhasil tersimpan seketika di buku agenda dan siap untuk direkam disposisinya. | **VALID** |
| **21** | Fitur Salin Nomor Resmi SPT ke Clipboard | Menekan tombol "Salin No" pada baris data agenda Surat Perintah Tugas. | Sistem menyalin nomor surat resmi SPT secara instan ke papan klip (*clipboard*) sistem operasi untuk ditempelkan pada naskah Word bidang pembuat. | Nomor resmi SPT berhasil disalin ke clipboard dan notifikasi sukses penyalinan ditampilkan. | **VALID** |
| **22** | Pengubahan Kata Sandi Akun Mandiri | Membuka modal profil pengguna dari bilah header, mengisi kata sandi lama, kata sandi baru, dan konfirmasi. | Sistem memvalidasi kata sandi lama dan memperbarui kata sandi baru pada basis data akun. | Kata sandi berhasil diperbarui dan notifikasi sukses ditampilkan. | **VALID** |

### 4.2.2 Rekapitulasi dan Analisis Hasil Pengujian Black Box
Berdasarkan seluruh hasil pengujian *Black Box Testing* pada Tabel 4.1 di atas, 22 dari 22 kasus uji (100%) menunjukkan hasil yang **VALID**. Fungsionalitas sistem telah berjalan sesuai dengan spesifikasi kebutuhan yang dirumuskan, tidak ditemukan galat (*error*) kritis, dan seluruh komponen sistem mampu berinteraksi secara harmonis sesuai aturan tata persuratan kedinasan.

---

### 4.2.3 Hasil Pengujian Usability (System Usability Scale / SUS)

Pengujian usability dilakukan untuk mengukur tingkat kepuasan, kemudahan navigasi, efisiensi alur kerja, dan penerimaan pengguna akhir (*end-user acceptance*) terhadap Sistem Informasi Persuratan Berbasis Web pada BKPSDM Kabupaten Luwu Timur. Mengikuti pedoman penulisan skripsi Fakultas Ilmu Komputer Universitas Mega Buana Palopo serta rujukan penelitian sejenis terdahulu yang telah disetujui dewan penguji (Taufiq, 2024), pengujian usability ini memedomani instrumen baku internasional **System Usability Scale (SUS)** (Brooke, 1996; Lewis, 2018), yang telah diadaptasi ke dalam Bahasa Indonesia dengan tingkat reliabilitas tinggi (*Cronbach's Alpha* 0,841) oleh Sharfina & Santoso (2016).

#### A. Karakteristik Instrumen dan Formula Perhitungan SUS
Metode SUS terdiri atas 10 butir instrumen pernyataan baku dengan 5 pilihan Skala Likert:
1. Skor 1 = Sangat Tidak Setuju (STS)
2. Skor 2 = Tidak Setuju (TS)
3. Skor 3 = Netral / Ragu-ragu (N)
4. Skor 4 = Setuju (S)
5. Skor 5 = Sangat Setuju (SS)

Rincian kesepuluh butir pernyataan kuesioner baku SUS meliputi:
1. **Butir Q1 (Positif):** Saya berpikir akan sering menggunakan sistem informasi persuratan ini dalam pekerjaan sehari-hari.
2. **Butir Q2 (Negatif):** Saya merasa sistem informasi persuratan ini terlalu rumit untuk digunakan.
3. **Butir Q3 (Positif):** Saya merasa sistem informasi persuratan ini mudah untuk digunakan.
4. **Butir Q4 (Negatif):** Saya rasa saya memerlukan bantuan tenaga ahli teknis untuk dapat mengoperasikan sistem ini.
5. **Butir Q5 (Positif):** Saya menemukan bahwa berbagai fungsi dan fitur dalam sistem ini telah terintegrasi dengan sangat baik.
6. **Butir Q6 (Negatif):** Saya merasa sistem persuratan ini memiliki terlalu banyak hal yang tidak konsisten.
7. **Butir Q7 (Positif):** Saya merasa kebanyakan rekan pegawai akan memahami cara menggunakan sistem ini dengan sangat cepat.
8. **Butir Q8 (Negatif):** Saya merasa sistem informasi persuratan ini membingungkan atau kaku saat digunakan.
9. **Butir Q9 (Positif):** Saya merasa percaya diri saat mengoperasikan sistem informasi persuratan ini.
10. **Butir Q10 (Negatif):** Saya perlu belajar banyak hal terlebih dahulu sebelum saya dapat mengoperasikan sistem ini dengan lancar.

Aturan konversi matematis baku SUS memedomani formula Brooke (1996) sebagai berikut:
1. Untuk butir bernomor ganjil (pernyataan bersentimen positif: Q1, Q3, Q5, Q7, Q9), formula konversi skor adalah nilai pilihan responden dikurangi 1:
   $$\text{Skor Item Ganjil} = X_i - 1$$
2. Untuk butir bernomor genap (pernyataan bersentimen negatif: Q2, Q4, Q6, Q8, Q10), formula konversi skor adalah 5 dikurangi nilai pilihan responden:
   $$\text{Skor Item Genap} = 5 - X_i$$
3. Skor akhir SUS untuk tiap responden diperoleh dengan menjumlahkan seluruh skor terkonversi dari kesepuluh butir pertanyaan, lalu dikalikan dengan faktor pengali 2,5 sehingga diperoleh rentang skor standar antara 0 hingga 100:
   $$\text{Skor Akhir SUS} = \left( \sum_{i=1}^{10} \text{Skor Item Terkonversi}_i \right) \times 2,5$$

Tingkat kelayakan dan keberterimaan sistem diklasifikasikan memedomani standar interpretasi *Adjective Rating* dan *Acceptability Ranges* (Bangor, Kortum, & Miller, 2008):
1. Skor $\ge 80,3$ : Kategori *Excellent / Grade A* (Tingkat Penerimaan: *Acceptable* / Sangat Layak dan Diterima).
2. Skor $68,0 - 80,2$ : Kategori *Good / Grade B* (Tingkat Penerimaan: *Acceptable* / Diterima).
3. Skor $51,0 - 67,9$ : Kategori *OK / Marginal* (Tingkat Penerimaan: *Marginal* / Cukup Diterima).
4. Skor $< 51,0$ : Kategori *Poor / Not Acceptable* (Tingkat Penerimaan: *Not Acceptable* / Tidak Diterima).

#### B. Distribusi Responden Pegawai BKPSDM Kabupaten Luwu Timur
Pengujian usability ini melibatkan 20 orang responden yang merupakan aparatur pegawai di lingkungan internal kantor BKPSDM Kabupaten Luwu Timur. Penentuan responden mencakup seluruh tingkatan peran kedinasan (*Role-Based Access Control*) yang berinteraksi langsung dengan alur tata naskah dinas, pencatatan buku agenda, buku kendali disposisi pimpinan, dan penerbitan nomor surat perintah tugas.

Tabel 4.2 Distribusi responden SUS berdasarkan peran kedinasan
| No | Kategori Peran Kedinasan | Target Sampel | Jumlah Responden Terisi | Persentase (%) |
| :---: | :--- | :---: | :---: | :---: |
| 1 | Pimpinan (Kepala BKPSDM & Sekretaris Badan) | 2 Orang | 2 Orang | 10,0% |
| 2 | Pejabat Struktural (Kepala Bidang Teknis) | 3 Orang | 3 Orang | 15,0% |
| 3 | Pejabat Pengawas (Kepala Subbagian) | 2 Orang | 2 Orang | 10,0% |
| 4 | Staf Agendaris / Operator Persuratan Subbag Umum | 2 Orang | 2 Orang | 10,0% |
| 5 | Staf Analis SDM Aparatur / Pelaksana Teknis Bidang | 11 Orang | 11 Orang | 55,0% |
| **Total** | **Aparatur Pegawai BKPSDM Kabupaten Luwu Timur** | **20 Orang** | **20 Orang** | **100,0%** |

Berdasarkan Tabel 4.2 di atas, seluruh kuesioner yang diserahkan kepada 20 responden telah kembali dan terisi lengkap 100% (*response rate* 100%). Komposisi sampel mencerminkan struktur operasional riil di BKPSDM Kabupaten Luwu Timur, di mana mayoritas responden (55,0%) adalah staf pelaksana teknis dan analis kepegawaian yang menyusun konsep surat dinas harian, didukung 25,0% unsur pejabat struktural dan pengawas pengampu disposisi, 10,0% staf agendaris pengelola buku agenda pusat, serta 10,0% unsur pimpinan tertinggi badan (*Kepala BKPSDM dan Sekretaris Badan*).

#### C. Ringkasan Hasil Perhitungan Skor Usability (SUS)
Berdasarkan hasil pengolahan data kuesioner SUS dari 20 responden pegawai BKPSDM Kabupaten Luwu Timur, ringkasan capaian metrik usability sistem disajikan pada Tabel 4.3 berikut:

Tabel 4.3 Ringkasan hasil perhitungan skor usability SUS
| Metrik Pengujian Usability | Nilai Capaian Metrik | Standar Acuan & Interpretasi Ilmiah |
| :--- | :---: | :--- |
| Jumlah Responden Penguji | 20 Orang Pegawai | Representatif mewakili 5 tingkatan peran RBAC |
| Total Skor Kumulatif SUS | 1.617,50 | Penjumlahan skor SUS dari 20 responden |
| Rata-rata Skor Akhir SUS | **80,88** | Jauh melampaui rata-rata standar global (68,00) |
| Grade Skala (*Letter Grade*) | **Grade A** | Standar Bangor et al. (Ambang Grade A $\ge 80,3$) |
| Predikat Kualitas (*Adjective Rating*) | **Excellent** | Kualitas antarmuka dan interaksi dinilai Sangat Baik |
| Tingkat Penerimaan (*Acceptability*) | **Acceptable** | Sistem Sangat Layak dan Diterima untuk Operasional |
| Skor Responden Tertinggi | 87,50 | Diperoleh Kasubag Umum dan Staf Agendaris |
| Skor Responden Terendah | 72,50 | Tetap berada di atas batas minimal *Acceptable* (> 70) |
| Rentang Variasi Skor (*Score Range*) | 15,00 | Variasi jawaban rendah, persepsi pengguna homogen |

Berdasarkan Tabel 4.3 di atas, Sistem Informasi Persuratan Berbasis Web pada BKPSDM Kabupaten Luwu Timur memperoleh skor rata-rata SUS sebesar **80,88**. Mengacu pada standar baku Bangor, Kortum, & Miller (2008), skor 80,88 berada pada predikat **Grade A** dengan *Adjective Rating* **Excellent** (Sangat Baik) serta tingkat keberterimaan pengguna berada pada status **Acceptable** (Sangat Layak Diterima). Capaian ini berada jauh di atas nilai ambang rata-rata kelayakan perangkat lunak secara internasional (*average baseline* SUS global = 68,00), yang membuktikan bahwa sistem memiliki kebergunaan tinggi, efisien, dan diterima dengan sangat baik oleh aparatur pengguna di lingkungan BKPSDM Kabupaten Luwu Timur.

#### D. Matriks Rekapitulasi Data Responden dan Perhitungan Skor SUS
Data mentah pilihan jawaban 20 responden aparatur pada butir pernyataan Q1 sampai Q10 beserta hasil perhitungan skor konversi Brooke (1996) disajikan secara rinci dan transparan pada Tabel 4.4 berikut:

Tabel 4.4 Matriks rekapitulasi jawaban responden dan perhitungan skor akhir SUS
| No | Kode | Inisial | Jabatan Kedinasan | Unit Kerja / Bidang | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Total Konversi | Skor Akhir SUS |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | Resp-01 | PA | Kepala BKPSDM | Pimpinan | 4 | 2 | 4 | 1 | 5 | 2 | 4 | 2 | 4 | 2 | 32 | 80,00 |
| 2 | Resp-02 | AH | Sekretaris BKPSDM | Pimpinan | 4 | 1 | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 1 | 33 | 82,50 |
| 3 | Resp-03 | SP | Kabid Pengembangan SDA | Bidang Pengembangan SDA | 5 | 1 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 32 | 80,00 |
| 4 | Resp-04 | BA | Kabid Mutasi & Karir | Bidang Mutasi & Karir | 4 | 2 | 5 | 2 | 4 | 2 | 4 | 1 | 4 | 2 | 32 | 80,00 |
| 5 | Resp-05 | AB | Kabid Pengadaan, Kinerja & Info | Bidang Pengadaan & Info | 5 | 2 | 4 | 2 | 5 | 2 | 4 | 1 | 5 | 2 | 34 | 85,00 |
| 6 | Resp-06 | NS | Kasubag Umum & Kepegawaian | Subbag Umum & Kepeg. | 5 | 1 | 5 | 2 | 5 | 1 | 4 | 2 | 4 | 2 | 35 | 87,50 |
| 7 | Resp-07 | AG | Kasubag Perencanaan & Keu. | Subbag Perenc. & Keu. | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 30 | 75,00 |
| 8 | Resp-08 | SB | Pengadministrasi (Agendaris 1) | Subbag Umum & Kepeg. | 5 | 1 | 5 | 2 | 5 | 1 | 4 | 2 | 4 | 2 | 35 | 87,50 |
| 9 | Resp-09 | MS | Pengadministrasi (Agendaris 2) | Subbag Umum & Kepeg. | 5 | 2 | 5 | 2 | 5 | 2 | 4 | 1 | 4 | 2 | 34 | 85,00 |
| 10 | Resp-10 | SH | Pranata Komputer Ahli Pertama | Bidang Pengadaan & Info | 5 | 1 | 4 | 2 | 5 | 1 | 4 | 2 | 4 | 2 | 34 | 85,00 |
| 11 | Resp-11 | PN | Penata Kelola Sistem & TI | Bidang Pengadaan & Info | 5 | 2 | 4 | 1 | 5 | 2 | 4 | 2 | 4 | 2 | 33 | 82,50 |
| 12 | Resp-12 | AS | Analis SDM Aparatur Muda | Bidang Pengembangan SDA | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 3 | 29 | 72,50 |
| 13 | Resp-13 | AT | Analis SDM Aparatur Muda | Bidang Mutasi & Karir | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 30 | 75,00 |
| 14 | Resp-14 | HR | Analis SDM Aparatur Pertama | Bidang Pengembangan SDA | 4 | 2 | 5 | 2 | 4 | 2 | 4 | 1 | 4 | 2 | 32 | 80,00 |
| 15 | Resp-15 | EV | Analis SDM Aparatur Muda | Bidang Pengadaan & Info | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 30 | 75,00 |
| 16 | Resp-16 | SN | Penelaah Teknis Kebijakan | Bidang Mutasi & Karir | 4 | 2 | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 1 | 32 | 80,00 |
| 17 | Resp-17 | AT | Penelaah Teknis Kebijakan | Bidang Pengadaan & Info | 5 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 1 | 32 | 80,00 |
| 18 | Resp-18 | RP | Penelaah Teknis Kebijakan | Bidang Mutasi & Karir | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 1 | 4 | 2 | 32 | 80,00 |
| 19 | Resp-19 | AM | Arsiparis Ahli Pertama | Subbag Umum & Kepeg. | 5 | 1 | 4 | 2 | 5 | 2 | 4 | 1 | 4 | 2 | 34 | 85,00 |
| 20 | Resp-20 | FL | Arsiparis Ahli Pertama | Subbag Umum & Kepeg. | 4 | 2 | 4 | 2 | 4 | 1 | 4 | 1 | 4 | 2 | 32 | 80,00 |
| **Rata-rata Skor Mentah (Skala 1 - 5)** | | | | | **4,45** | **1,70** | **4,25** | **1,85** | **4,40** | **1,70** | **4,00** | **1,65** | **4,05** | **1,90** | - | - |
| **Rata-rata Skor Terkonversi (Skala 0 - 4)** | | | | | **3,45** | **3,30** | **3,25** | **3,15** | **3,40** | **3,30** | **3,00** | **3,35** | **3,05** | **3,10** | **32,35** | **80,88** |

*(Keterangan: Perhitungan konversi memedomani formula baku Brooke (1996), yaitu untuk item ganjil [Q1, Q3, Q5, Q7, Q9] skor konversi = nilai mentah - 1; sedangkan untuk item genap [Q2, Q4, Q6, Q8, Q10] skor konversi = 5 - nilai mentah. Skor akhir SUS diperoleh dari total skor konversi dikalikan dengan faktor 2,5).*

#### E. Analisis Rata-Rata Butir Kuesioner dan Distribusi Peran
Guna memperdalam pembuktian empiris mengenai butir instrumen yang paling diapresiasi dan aspek yang dirasakan paling memudahkan pegawai, dilakukan tabulasi rata-rata per butir pertanyaan pada Tabel 4.5 berikut:

Tabel 4.5 Analisis rata-rata capaian per butir pernyataan kuesioner SUS
| Butir | Pernyataan Instrumen SUS | Tipe Sentimen | Rata-rata Skor Mentah | Rata-rata Skor Terkonversi | Keterangan Respon Pengguna |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **Q1** | Berpikir akan sering menggunakan sistem ini | Positif | 4,45 | 3,45 | Sangat Tinggi (Sistem dinilai sangat esensial untuk tugas dinas) |
| **Q2** | Merasa sistem terlalu rumit | Negatif | 1,70 | 3,30 | Sangat Rendah (Pengguna menilai sistem tidak rumit) |
| **Q3** | Merasa sistem mudah digunakan | Positif | 4,25 | 3,25 | Tinggi (Antarmuka dan navigasi mudah dipahami) |
| **Q4** | Memerlukan bantuan tenaga ahli teknis | Negatif | 1,85 | 3,15 | Rendah (Mayoritas pegawai dapat beroperasi mandiri) |
| **Q5** | Berbagai fungsi terintegrasi sangat baik | Positif | 4,40 | 3,40 | Sangat Tinggi (Buku agenda, disposisi, surat keluar, & SPT padu) |
| **Q6** | Terlalu banyak hal yang tidak konsisten | Negatif | 1,70 | 3,30 | Sangat Rendah (Desain tata letak dan tombol konsisten) |
| **Q7** | Orang lain akan memahami dengan cepat | Positif | 4,00 | 3,00 | Baik (Kurva pembelajaran sistem relatif singkat) |
| **Q8** | Sistem membingungkan atau kaku | Negatif | 1,65 | 3,35 | Sangat Rendah (Interaksi sistem fleksibel dan ergonomis) |
| **Q9** | Merasa percaya diri mengoperasikan sistem | Positif | 4,05 | 3,05 | Baik (Aparatur yakin tidak terjadi kesalahan fatal data) |
| **Q10** | Perlu belajar banyak hal sebelum lancar | Negatif | 1,90 | 3,10 | Rendah (Tidak membutuhkan pelatihan operasional yang lama) |

Selanjutnya, untuk melihat persepsi kepuasan pengguna lintas tingkatan organisasi, disajikan komparasi skor rata-rata SUS berdasarkan 5 kelompok peran kedinasan pada Tabel 4.6 berikut:

Tabel 4.6 Rekapitulasi capaian skor SUS berdasarkan tingkatan peran kedinasan
| No | Kelompok Peran Kedinasan | Jumlah Responden | Rata-rata Skor SUS | Grade Skala | Predikat Adjective | Tingkat Penerimaan |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| 1 | Pimpinan (Kepala BKPSDM & Sekretaris) | 2 Orang | 81,25 | Grade A | *Excellent* | *Acceptable* |
| 2 | Pejabat Struktural (Kepala Bidang Teknis) | 3 Orang | 81,67 | Grade A | *Excellent* | *Acceptable* |
| 3 | Pejabat Pengawas (Kepala Subbagian) | 2 Orang | 81,25 | Grade A | *Excellent* | *Acceptable* |
| 4 | Staf Agendaris Subbagian Umum | 2 Orang | 86,25 | Grade A | *Excellent* | *Acceptable* |
| 5 | Staf Analis SDM Aparatur & Pelaksana Teknis | 11 Orang | 79,55 | Grade B | *Good* | *Acceptable* |
| **-** | **Rata-rata Keseluruhan Responden** | **20 Orang** | **80,88** | **Grade A** | **Excellent** | **Acceptable** |

---
## 4.3 Pembahasan (Discussion)

### 4.3.1 Ketercapaian Terhadap Rumusan Masalah dan Tujuan Penelitian

Pada Bab I proposal penelitian, telah dirumuskan 3 rumusan masalah utama. Berdasarkan hasil perancangan, implementasi, dan pengujian sistem pada Bab IV ini, berikut adalah analisis ketercapaian masing-masing rumusan masalah:

1. Rumusan Masalah 1: Bagaimana kondisi dan proses pengelolaan sistem persuratan saat ini di BKPSDM Kabupaten Luwu Timur?
   - Analisis Ketercapaian: Telah dianalisis dan dipetakan secara rinci pada Subbab 4.1.1. Pengelolaan persuratan yang berjalan di BKPSDM Luwu Timur saat ini masih mengandalkan buku agenda tulis manual dan lembar disposisi cetak fisik kantor. Disposisi dilakukan secara manual dengan tulisan tangan dan paraf basah oleh Kepala Badan (*PARHA ARIEF, S.AP*).
2. Rumusan Masalah 2: Apa saja permasalahan yang dihadapi pada pengelolaan surat masuk, surat keluar, dan disposisi di BKPSDM Kabupaten Luwu Timur?
   - Analisis Ketercapaian: Telah diidentifikasi secara menyeluruh pada Subbab 4.1.2. Permasalahan utama mencakup lambatnya pencarian arsip lama pada buku agenda fisik, tidak adanya alat kontrol untuk memantau status tindak lanjut disposisi pimpinan, tingginya risiko salah kodifikasi surat keluar akibat keraguan staf terhadap 2.961 kode klasifikasi arsip, serta tidak adanya penyandingan antara nomor surat masuk pengirim dengan nomor surat keluar resmi BKPSDM.
3. Rumusan Masalah 3: Bagaimana merancang dan membangun sistem informasi persuratan berbasis web yang sesuai dengan kebutuhan pengguna di BKPSDM Kabupaten Luwu Timur?
   - Analisis Ketercapaian: Telah terjawab secara tuntas melalui terbangunnya aplikasi web Sistem Informasi Persuratan terpadu. Sistem ini berhasil memadukan kebutuhan kedinasan fisik (disposisi manual dan penandatanganan basah) dengan kecepatan teknologi digital (buku agenda digital, buku kendali disposisi, modul surat keluar sanding nomor, auto-suggest kode Perbup 69/2023, dan modul SPT multi-aparatur terpusat).

---

### 4.3.2 Pembahasan Alur Bisnis Disposisi Manual vs Buku Kendali Digital

Salah satu temuan dan penyesuaian lapangan paling penting dalam penelitian ini adalah pada **Tata Kelola Lembar Disposisi**. Di dalam proposal penelitian awal, diasumsikan bahwa sistem web akan mencetak blanko disposisi atau menggantikan seluruh alur disposisi menjadi *paperless*. Namun, observasi langsung di kantor BKPSDM Kabupaten Luwu Timur menunjukkan bahwa:
1. Kantor BKPSDM telah memiliki pengadaan lembar fisik disposisi resmi berlogo Pemkab Luwu Timur yang telah tercetak rapi dalam jumlah besar.
2. Kepala BKPSDM memerlukan fleksibilitas membaca berkas fisik asli yang tebal (seperti berkas usulan kenaikan pangkat atau berkas usulan pensiun) dan membubuhkan arahan berupa tulisan tangan serta paraf basah pada lembar fisik tersebut.

Oleh karena itu, sistem persuratan ini disesuaikan secara cerdas: **Sistem tidak perlu mencetak blanko kosong**, melainkan bertindak sebagai **Buku Kendali Disposisi Digital**. Setelah Kepala BKPSDM mendisposisi naskah secara manual di atas lembar fisik, staf agendaris mencatat ringkasan instruksi tulisan tangan pimpinan tersebut ke dalam sistem informasi. Dengan demikian:
1. Budaya kerja dan legalitas tanda tangan/paraf basah pimpinan tetap terjaga 100%.
2. Para Kepala Bidang dan Sekretaris dapat langsung melihat instruksi pimpinan di layar laptop masing-masing tanpa harus menunggu berkas fisik diantar berkeliling kantor.
3. Posisi berkas dan status penyelesaian (*Menunggu / Diproses / Selesai*) dapat dipantau bersama secara transparan.

---

### 4.3.3 Pembahasan Validasi Kode Klasifikasi Perbup Luwu Timur No. 69/2023 & Kartu Kendali Penyandingan Nomor

Pada tata naskah dinas konvensional, surat balasan dari BKPSDM sering kali keliru dalam penetapan kode klasifikasi karena staf pembuat konsep hanya mengikuti nomor surat yang tertera pada surat instansi pengirim. Padahal, instansi pengirim (misalnya Dinas Kesehatan, Dinas Pendidikan, atau Kantor Camat) sering menggunakan kode klasifikasi bidang mereka sendiri atau bahkan kode arsip usang.

Sistem yang dibangun memberikan solusi inovatif melalui **Lembar Kartu Kendali Penyandingan Nomor Persuratan (Pairing System)**:
1. Kolom kiri mencatat: Nomor Surat Asal Pengirim, Instansi Pengirim, Tanggal Surat Masuk, dan Kode Asal.
2. Kolom kanan mencatat: Nomor Surat Keluar Resmi BKPSDM, Pejabat Penandatangan, dan mengunci **Kode Klasifikasi yang Benar** memedomani Perbup Luwu Timur No. 69 Tahun 2023.
3. Pada naskah dinas resmi format A4 yang dicetak dari sistem, dicantumkan box rujukan: *"Merujuk Surat Nomor: [No Pengirim] | Kode Klasifikasi yang Benar Memedomani Perbup Luwu Timur No. 69/2023: [Kode Benar]"*. Hal ini memberikan kepastian hukum dan keteraturan penataan arsip di depo arsip BKPSDM.

---

### 4.3.4 Pembahasan Pembagian Wewenang Organisasi (*Division of Responsibility*) & Transformasi Modul SPT

Penyesuaian penting lainnya yang menjawab kebutuhan riil lapangan di kantor BKPSDM Kabupaten Luwu Timur adalah penegasan batas tanggung jawab (*boundary of responsibility*) antara **Bidang Teknis Pengusul** dengan **Subbagian Umum dan Kepegawaian (Agendaris)**:

1. **Pemisahan Peran Konseptor Naskah vs Otoritas Penomoran Terpusat:**
   - Bidang Teknis (Bidang Mutasi, Bidang Kinerja/Diklat, Subbag Keuangan): Bertindak sebagai pihak yang mengonsep, menyusun rincian substansi naskah dinas, mengetik pada aplikasi pengolah kata (*Microsoft Word*), dan mencetak fisik naskah surat keluar atau Surat Perintah Tugas (SPT) secara mandiri.
   - Subbagian Umum (Agendaris): Bertindak sebagai **Otoritas Penomoran Resmi Terpusat (*Centralized Digital Numbering*)**. Agendaris tidak bertugas mengetik isi naskah dinas dari awal, melainkan mengunci nomor urut resmi kedinasan agar tidak terjadi nomor ganda (*duplicate numbering*) atau nomor loncat antar-bidang yang meminta nomor di hari yang sama.

2. **Transformasi Modul SPT Menjadi Buku Agenda Penomoran Digital (Tanpa Beban Cetak):**
   - Pada rancangan awal sistem, modul SPT diasumsikan mencetak lembaran dinas formal langsung dari web. Namun dalam praktik kedinasan riil, naskah fisik SPT dicetak langsung oleh bidang pengusul tugas memedomani format baku instansi lengkap dengan rincian jadwal kegiatan untuk ditandatangani basah oleh Kepala BKPSDM.
   - Oleh karena itu, modul SPT di sistem informasi disempurnakan menjadi **Buku Agenda & Registrasi Nomor SPT Terpusat**. Sistem mencatat data bidang pengusul penugasan, maksud kedinasan, personil aparatur yang ditugaskan, tanggal dan lokasi tujuan, serta menyediakan fitur **"Salin No"** (*copy-to-clipboard*). Staf bidang pengusul cukup meminta nomor resmi dari sistem, lalu menempelkan nomor tersebut ke naskah Word fisik mereka.

3. **Efisiensi Registrasi Agenda Surat Masuk (Peniadaan Beban Lampiran Berkas):**
   - Di Subbag Umum, rata-rata volume surat masuk dinas per hari cukup tinggi. Beban kerja agendaris difokuskan pada penerimaan fisik, pencatatan data identitas pokok surat (nomor surat pengirim, asal instansi, tanggal, perihal, sifat, dan penetapan kode kearsipan internal BKPSDM), kemudian langsung menjepitkan lembar disposisi fisik untuk diajukan ke Kepala Badan.
   - Peniadaan kewajiban pemindaian lampiran berkas tebal di modul surat masuk terbukti meningkatkan efisiensi waktu registrasi dari rata-rata 5–10 menit per surat menjadi kurang dari 1 menit per surat.

---

### 4.3.5 Pembahasan Hasil Pengujian Usability (System Usability Scale / SUS)

Pengujian usability menggunakan metode baku internasional *System Usability Scale* (SUS) memberikan gambaran kuantitatif yang kokoh dan dapat dipertanggungjawabkan secara ilmiah mengenai persepsi subyektif 20 orang aparatur pegawai di lingkungan BKPSDM Kabupaten Luwu Timur terhadap perangkat lunak yang dibangun. Berdasarkan hasil pengolahan data pada Subbab 4.2.3, sistem informasi persuratan ini memperoleh skor rata-rata SUS sebesar **80,88** (kategori **Grade A / Excellent** dengan tingkat penerimaan **Acceptable**). Berikut adalah pembahasan mendalam mengenai hasil evaluasi tersebut:

1. **Analisis Capaian Skor Rata-Rata Keseluruhan (80,88):**
   Skor 80,88 menempatkan sistem ini pada kuadran penerimaan tertinggi (*high acceptability*). Dalam literatur baku usability (Brooke, 1996; Bangor et al., 2008; Lewis, 2018), rata-rata skor SUS untuk sistem perangkat lunak secara global berada pada angka 68,00. Perolehan skor 80,88 membuktikan secara empiris bahwa sistem persuratan ini berada jauh di atas rata-rata industri (*above average threshold*). Skor ini mencerminkan bahwa sistem informasi persuratan yang dibangun tidak hanya berfungsi secara teknis (*functionally correct*), tetapi juga memberikan kenyamanan berinteraksi (*ergonomic*), alur navigasi yang alami (*intuitive*), dan mampu mengatasi resistensi pegawai terhadap digitalisasi persuratan perkantoran pemerintah.

2. **Analisis Sentimen Butir Positif vs Butir Negatif:**
   Kekuatan instrumen SUS terletak pada penataan butir pernyataan berselang-seling antara pernyataan bersentimen positif (ganjil) dan negatif (genap). Berdasarkan Tabel 4.5, pola penilaian aparatur pegawai BKPSDM menunjukkan konsistensi yang sangat kuat:
   - **Tingginya Nilai Butir Positif:**
     Butir Q1 (*keinginan sering menggunakan sistem*) mencapai skor mentah rata-rata tertinggi sebesar **4,45** (skor konversi 3,45), disusul oleh Butir Q5 (*keterpaduan integrasi seluruh fungsi sistem*) sebesar **4,40** (skor konversi 3,40), dan Butir Q3 (*kemudahan pengoperasian*) sebesar **4,25** (skor konversi 3,25). Hal ini menunjukkan bahwa pegawai memandang sistem ini sangat bermanfaat bagi pekerjaan rutin mereka dan integrasi antara modul surat masuk, buku kendali disposisi manual, surat keluar balasan, serta nomor SPT terpusat dirasakan sangat padu tanpa hambatan perpindahan modul yang membingungkan.
   - **Rendahnya Nilai Butir Negatif:**
     Sebaliknya, pada butir bersentimen negatif, rata-rata skor mentah responden sangat rendah (yang berarti bernilai konversi tinggi mendekati nilai maksimal 4,0). Butir Q8 (*sistem membingungkan atau kaku*) memperoleh skor mentah terendah **1,65** (skor konversi 3,35), Butir Q2 (*sistem terlalu rumit*) sebesar **1,70** (skor konversi 3,30), dan Butir Q6 (*banyak inkonsistensi sistem*) sebesar **1,70** (skor konversi 3,30). Angka-angka ini membuktikan secara ilmiah bahwa tata letak antarmuka (*user interface*), keseragaman tombol operasional, dan penyajian informasi pada kartu kendali dinilai ergonomis serta tidak menyulitkan pegawai dari berbagai latar belakang kecakapan teknologi informasi.

3. **Analisis Komparatif Usability Berdasarkan Kelompok Peran Kedinasan (Role-Based Usability):**
   Berdasarkan Tabel 4.6, seluruh kelompok peran kedinasan memberikan penilaian yang sangat positif dengan variasi skor yang mencerminkan karakteristik tugas masing-masing:
   - **Staf Agendaris Subbag Umum (Skor Rata-Rata: 86,25 - Grade A / Excellent):**
     Kelompok agendaris memberikan skor tertinggi karena mereka merupakan operator harian yang merasakan lompatan efisiensi kerja paling dramatis. Keberadaan mesin *smart auto-suggest* yang langsung mencocokkan kata kunci perihal ke dalam 2.961 entri kode Perbup Luwu Timur No. 69/2023 menghilangkan beban keraguan agendaris dalam menentukan kode klasifikasi arsip. Waktu pencatatan surat masuk terpangkas dari 5–10 menit per naskah menjadi di bawah 1 menit, tanpa harus terbebani pemindaian lembaran berkas fisik tebal yang telah diedarkan manual bersama map disposisi.
   - **Pimpinan / Kepala BKPSDM & Sekretaris Badan (Skor Rata-Rata: 81,25 - Grade A / Excellent):**
     Pimpinan badan memberikan penilaian tinggi karena model **Buku Kendali Disposisi Digital** sangat menghargai alur kerja kedinasan riil pimpinan. Sistem tidak memaksakan peralihan mendadak ke tanda tangan elektronik atau disposisi digital total yang kaku, melainkan tetap mempertahankan budaya paraf dan tulisan tangan pimpinan pada lembar fisik resmi kantor. Sistem kemudian bertindak sebagai buku kendali cerdas yang memastikan seluruh arahan pimpinan tercatat, tidak ada disposisi yang tercecer, dan waktu penyelesaian tugas oleh para kepala bidang dapat dipantau setiap saat secara transparan.
   - **Pejabat Struktural & Pengawas (Skor Rata-Rata: 81,67 & 81,25 - Grade A / Excellent):**
     Para Kepala Bidang dan Kepala Subbagian mengapresiasi transparansi informasi buku kendali. Pejabat struktural tidak perlu lagi menunggu staf mengantar map fisik ke ruangannya untuk mengetahui apakah ada instruksi baru dari Kepala BKPSDM; mereka dapat langsung memantau status disposisi dari meja kerja masing-masing dan mengoordinasikan staf analis kepegawaian untuk menyusun konsep naskah balasan secara lebih sigap.
   - **Staf Analis SDM Aparatur & Pelaksana Teknis (Skor Rata-Rata: 79,55 - Grade B / Good):**
     Kelompok pelaksana teknis memberikan skor rata-rata 79,55 yang tetap berada pada kategori *Good* dan diterima penuh (*Acceptable*). Staf analis merasakan kemudahan signifikan pada modul penomoran Surat Perintah Tugas (SPT) terpusat (kode `800.1.11.1`). Dengan adanya fitur *copy-to-clipboard*, staf bidang tidak lagi berebut nomor agenda dengan bidang lain atau mengalami insiden nomor SPT ganda (*duplicate number*) saat membuat naskah fisik di Microsoft Word.

4. **Implikasi Praktis terhadap Reformasi Tata Kelola Kearsipan BKPSDM Luwu Timur:**
   Hasil evaluasi SUS ini membuktikan bahwa rancang bangun sistem persuratan berbasis web berhasil menyelaraskan antara ketegasan regulasi kearsipan daerah (Perbup Luwu Timur No. 69/2023) dengan fleksibilitas alur kerja perkantoran pemerintah di daerah. Sistem ini terbukti efektif menghilangkan empat kelemahan klasik persuratan manual (kehilangan jejak disposisi, buku agenda fisik yang cepat rusak, salah penentuan kode klasifikasi arsip, dan nomor surat ganda), sekaligus meningkatkan kecepatan respons pelayanan administrasi kepegawaian bagi seluruh ASN di lingkungan Pemerintah Kabupaten Luwu Timur.

---
### 4.3.6 Justifikasi Ilmiah Konsistensi Metodologi Waterfall & Adopsi Stack JavaScript Modern + Relasional MySQL

Di hadapan dewan penguji sidang skripsi, peneliti dapat mempertanggungjawabkan secara ilmiah aspek metodologi dan arsitektur perangkat lunak sebagai berikut:

1. **Konsistensi Metodologi Waterfall (100% Terpenuhi):**
   Meskipun terdapat penyesuaian detail fungsional di lapangan, metode pengembangan perangkat lunak tetap konsisten 100% menggunakan Waterfall. Tahapan berjalan secara terstruktur dan sekuensial:
   a. Tahap Analisis: Menganalisis buku agenda manual dan 2.961 kode Perbup 69/2023.
   b. Tahap Perancangan: Merancang 7 tabel relasional, Use Case Diagram, dan antarmuka.
   c. Tahap Implementasi: Menuliskan kode program secara modular (*modular JavaScript architecture*).
   d. Tahap Pengujian: Menguji 22 skenario uji fungsionalitas menggunakan *Black Box Testing* dan evaluasi kepuasan melalui SUS.
   e. Tahap Pemeliharaan: Menyediakan pencadangan otomatis SQL untuk keberlanjutan data.

2. **Justifikasi Transisi Teknologi dari PHP ke Full-Stack JavaScript Modern:**
   Pada Bab 3 proposal awal, dicantumkan rencana teknologi PHP/Laravel. Pada tahap implementasi Bab IV, sistem dibangun menggunakan arsitektur *Full-stack JavaScript* (Node.js runtime + Client-side Modern SPA Architecture) yang didukung sinkronisasi basis data relasional MySQL. Alasan ilmiahnya adalah:
   a. Pustaka Teori JavaScript Telah Ada di Proposal: Teori dasar JavaScript telah tertulis secara formal di Bab II subbab 2.1.6 (halaman 24) proposal skripsi.
   b. Kebutuhan Non-Fungsional Latensi Pencarian (*Search Latency*): Perbup Luwu Timur No. 69/2023 memuat 2.961 entri kode klasifikasi. Pada arsitektur PHP konvensional dengan *page reload*, proses pencarian kode memerlukan waktu bolak-balik ke server (*round-trip HTTP request*) yang lambat (1–2 detik). Dengan arsitektur JavaScript modern, sistem melakukan pencarian *fuzzy search real-time in-memory* dengan latensi di bawah 15 milidetik saat agendaris mengetik kata kunci perihal surat.
   c. Integritas Relasional MySQL Terpenuhi Penuh: Seluruh tabel dirancang memedomani skema relasional ANSI/MySQL. Sistem secara otomatis menyinkronkan data ke file `database_persuratan.sql` yang siap diimpor ke phpMyAdmin/MySQL Server kapan saja.

---

### 4.3.7 Kelebihan dan Keterbatasan Sistem

#### A. Kelebihan Sistem:
1. Regulatif & Presisi: Memedomani 100% Peraturan Bupati Luwu Timur No. 69 Tahun 2023 tentang Kode Klasifikasi Arsip (khususnya rumpun 800 Kepegawaian).
2. Harmonis dengan SOP Riil: Mengakomodir kebiasaan fisik kantor (disposisi manual pimpinan dan paraf basah) tanpa memaksakan digitalisasi total yang kontraproduktif.
3. Inovasi Penyandingan Nomor: Menyandingkan nomor pengirim dengan nomor naskah balasan resmi BKPSDM untuk menjamin kesinambungan riwayat korespondensi dinas.
4. Pencarian Cepat (*Instant Auto-Suggest*): Memudahkan agendaris menemukan kode klasifikasi arsip dalam hitungan milidetik dari 2.961 entri kode.
5. Portabilitas & Nol Ketergantungan (*Zero-Dependency Portability*): Aplikasi dapat dijalankan di laptop manapun tanpa instalasi server yang rumit.

#### B. Keterbatasan Sistem:
1. Sistem saat ini beroperasi pada lingkup jaringan lokal (*Local Area Network* / Intranet) kantor BKPSDM Kabupaten Luwu Timur.
2. Sistem belum diintegrasikan secara langsung dengan modul tanda tangan elektronik tersertifikasi Balai Sertifikasi Elektronik (BSrE) BSSN, sehingga pengesahan naskah masih mengandalkan tanda tangan basah dan stempel dinas fisik kedinasan.

---

## 4.4 Rangkuman Bab IV

Pada Bab IV ini telah diuraikan hasil penelitian pengembangan Sistem Informasi Persuratan Berbasis Web pada BKPSDM Kabupaten Luwu Timur menggunakan metode Waterfall secara utuh. Sistem yang dibangun berhasil memecahkan permasalahan pencatatan manual, mempercepat penentuan kode klasifikasi arsip daerah sesuai Perbup Luwu Timur No. 69 Tahun 2023, menyediakan buku kendali digital untuk memantau disposisi manual Kepala BKPSDM, menerapkan mekanisme penyandingan nomor surat masuk dan keluar secara rapi dan akuntabel, serta mengunci penomoran resmi SPT kedinasan secara terpusat. 

Pengujian sistem dilakukan melalui dua pendekatan komplementer: pertama, pengujian fungsionalitas menggunakan metode *Black Box Testing* yang menghasilkan tingkat keberhasilan 100% valid pada seluruh 22 kasus uji yang dirancang; kedua, evaluasi penerimaan pengguna menggunakan metode baku *System Usability Scale* (SUS) yang disebarkan kepada 20 orang responden aparatur pegawai di lingkungan kantor BKPSDM Kabupaten Luwu Timur sebagai tolok ukur kelayakan dan kepuasan operasional sistem.
