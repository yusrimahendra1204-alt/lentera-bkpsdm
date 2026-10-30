-- ============================================================
-- SCHEMA MySQL - Sistem Informasi Persuratan BKPSDM Luwu Timur
-- Berdasarkan Perbup Luwu Timur No. 69 Tahun 2023
-- Yusri Mahendra (NIM: IK2311011) - Universitas Mega Buana Palopo 2026
-- ============================================================

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS `persuratan_bkpsdm`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `persuratan_bkpsdm`;

-- ============================================================
-- TABEL 1: PEGAWAI (Master data pengguna sistem + RBAC)
-- ============================================================
CREATE TABLE IF NOT EXISTS `pegawai` (
  `id`       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nip`      VARCHAR(30)  NOT NULL UNIQUE COMMENT 'Nomor Induk Pegawai',
  `nama`     VARCHAR(150) NOT NULL,
  `pangkat`  VARCHAR(100) DEFAULT 'Penata Muda (III/a)',
  `jabatan`  VARCHAR(150) DEFAULT 'Staf Pelaksana',
  `role`     ENUM('admin','kepala_bkpsdm','sekretaris','kabid','pegawai') NOT NULL DEFAULT 'pegawai'
             COMMENT 'Role RBAC: admin=Agendaris, kepala_bkpsdm=Pimpinan, kabid=Kepala Bidang, pegawai=Staf',
  `unit`     VARCHAR(150) DEFAULT 'Subbag Umum & Kepegawaian',
  `password` VARCHAR(255) DEFAULT '123456' COMMENT 'Password default: 123456',
  `aktif`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_role` (`role`),
  INDEX `idx_aktif` (`aktif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Master data pegawai dan pengguna sistem dengan Role-Based Access Control';

-- ============================================================
-- TABEL 2: SURAT MASUK (Buku Agenda Surat Masuk)
-- ============================================================
CREATE TABLE IF NOT EXISTS `surat_masuk` (
  `id`                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `no_agenda`               VARCHAR(30) NOT NULL UNIQUE COMMENT 'Nomor agenda internal: SM-2026-001',
  `no_surat_pengirim`       VARCHAR(150) DEFAULT '' COMMENT 'Nomor surat dari instansi pengirim',
  `instansi_pengirim`       VARCHAR(200) DEFAULT '' COMMENT 'Nama instansi/lembaga pengirim',
  `kode_internal`           VARCHAR(30) DEFAULT '800' COMMENT 'Kode klasifikasi Perbup 69/2023',
  `nama_klasifikasi_internal` VARCHAR(300) DEFAULT 'Kepegawaian'
                            COMMENT 'Nama klasifikasi sesuai Perbup 69/2023',
  `perihal`                 TEXT NOT NULL COMMENT 'Perihal/pokok surat',
  `tgl_surat`               DATE NOT NULL,
  `tgl_diterima`            DATE NOT NULL,
  `sifat_surat`             ENUM('Biasa','Penting','Sangat Penting','Rahasia','Sangat Rahasia')
                            NOT NULL DEFAULT 'Biasa',
  `lampiran`                VARCHAR(100) DEFAULT '1 Berkas',
  `status_disposisi`        ENUM('Menunggu Disposisi','Didisposisi','Selesai')
                            NOT NULL DEFAULT 'Menunggu Disposisi',
  `file_name`               VARCHAR(255) DEFAULT 'surat_masuk.pdf'
                            COMMENT 'Nama file arsip digital (jika ada)',
  `created_at`              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tgl_diterima` (`tgl_diterima`),
  INDEX `idx_status` (`status_disposisi`),
  INDEX `idx_kode` (`kode_internal`),
  FULLTEXT INDEX `ft_perihal` (`perihal`, `instansi_pengirim`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Buku agenda surat masuk BKPSDM Kab. Luwu Timur';

-- ============================================================
-- TABEL 3: DISPOSISI (Buku Kendali Disposisi Kepala BKPSDM)
-- ============================================================
CREATE TABLE IF NOT EXISTS `disposisi` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_surat_masuk`       INT UNSIGNED NOT NULL,
  `dari_user`            VARCHAR(200) DEFAULT 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
  `tujuan_user_id`       INT UNSIGNED DEFAULT NULL,
  `tujuan_nama`          VARCHAR(200) DEFAULT '',
  `sifat`                ENUM('Biasa','Segera','Sangat Segera') NOT NULL DEFAULT 'Biasa',
  `instruksi`            JSON          COMMENT 'Array instruksi disposisi: ["Untuk diproses","Koordinasikan"]',
  `catatan`              TEXT,
  `batas_waktu`          DATE DEFAULT NULL,
  `status_tindak_lanjut` ENUM('Diproses','Selesai','Ditangguhkan') NOT NULL DEFAULT 'Diproses',
  `tindak_lanjut_note`   TEXT COMMENT 'Catatan tindak lanjut dari penerima disposisi',
  `created_at`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_surat_masuk`) REFERENCES `surat_masuk`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tujuan_user_id`) REFERENCES `pegawai`(`id`) ON DELETE SET NULL,
  INDEX `idx_surat_masuk` (`id_surat_masuk`),
  INDEX `idx_status` (`status_tindak_lanjut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Buku kendali disposisi Kepala BKPSDM - alur distribusi surat masuk';

-- ============================================================
-- TABEL 4: SURAT KELUAR (Buku Agenda Surat Keluar)
-- ============================================================
CREATE TABLE IF NOT EXISTS `surat_keluar` (
  `id`                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `no_agenda`            VARCHAR(30) NOT NULL UNIQUE COMMENT 'Nomor agenda: SK-2026-001',
  `bidang_pembuat`       VARCHAR(200) DEFAULT 'Bidang Pengadaan, Mutasi & Informasi Kepegawaian',
  `kode_klasifikasi`     VARCHAR(30) DEFAULT '000' COMMENT 'Kode Perbup 69/2023',
  `nama_klasifikasi`     VARCHAR(300) DEFAULT 'Umum',
  `no_surat_keluar`      VARCHAR(200) NOT NULL COMMENT 'Format: 800/001/BKPSDM/X/2026',
  `tujuan_surat`         TEXT NOT NULL,
  `perihal`              TEXT NOT NULL,
  `tgl_surat`            DATE NOT NULL,
  `sifat_surat`          ENUM('Biasa','Penting','Sangat Penting','Rahasia') NOT NULL DEFAULT 'Biasa',
  `penandatangan`        VARCHAR(200) DEFAULT 'Kepala BKPSDM Kabupaten Luwu Timur',
  `metode_dokumen`       VARCHAR(150) DEFAULT 'Fisik Manual (Tanda Tangan Basah)',
  `lokasi_arsip_fisik`   VARCHAR(200) DEFAULT 'Lemari Arsip Subbag Umum',
  `is_surat_balasan`     TINYINT(1) DEFAULT 0,
  `id_surat_masuk_asal`  INT UNSIGNED DEFAULT NULL,
  `no_surat_pengirim_asal` VARCHAR(150) DEFAULT '',
  `file_name`            VARCHAR(255) DEFAULT 'surat_keluar.pdf',
  `created_at`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tgl_surat` (`tgl_surat`),
  INDEX `idx_kode` (`kode_klasifikasi`),
  FULLTEXT INDEX `ft_surat_keluar` (`perihal`, `tujuan_surat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Buku agenda surat keluar BKPSDM Kab. Luwu Timur';

-- ============================================================
-- TABEL 5: SURAT TUGAS (SPT - Surat Perintah Tugas)
-- ============================================================
CREATE TABLE IF NOT EXISTS `surat_tugas` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `no_surat_tugas`        VARCHAR(200) NOT NULL UNIQUE
                          COMMENT 'Format: 800.1.11.1/041/BKPSDM-LT/X/2026',
  `bidang_pengusul`       VARCHAR(200) DEFAULT 'Bidang Pengadaan, Mutasi dan Informasi Kepegawaian',
  `kode_klasifikasi`      VARCHAR(30) DEFAULT '800.1.11.1'
                          COMMENT 'Surat Perintah Dinas/Surat Tugas sesuai Perbup 69/2023',
  `nama_klasifikasi`      VARCHAR(200) DEFAULT 'Surat Perintah Dinas/Surat Tugas',
  `dasar`                 TEXT COMMENT 'Dasar hukum/surat perintah',
  `maksud_tugas`          TEXT NOT NULL COMMENT 'Uraian tugas/keperluan dinas',
  `tempat_tujuan`         VARCHAR(300) DEFAULT '',
  `tgl_berangkat`         DATE NOT NULL,
  `tgl_kembali`           DATE NOT NULL,
  `lama_hari`             TINYINT UNSIGNED DEFAULT 1,
  `pembebanan_anggaran`   VARCHAR(200) DEFAULT 'DPA-SKPD BKPSDM Kabupaten Luwu Timur TA 2026',
  `pejabat_penandatangan` VARCHAR(200) DEFAULT 'PARHA ARIEF, S.AP',
  `jabatan_penandatangan` VARCHAR(200) DEFAULT 'Kepala BKPSDM Kabupaten Luwu Timur',
  `status_naskah_fisik`   VARCHAR(200) DEFAULT 'Naskah fisik disusun & dicetak manual oleh bidang',
  `created_at`            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tgl` (`tgl_berangkat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Surat Perintah Tugas (SPT) dinas BKPSDM Kab. Luwu Timur';

-- ============================================================
-- TABEL 6: PERSONIL SURAT TUGAS (Many-to-Many detail SPT)
-- ============================================================
CREATE TABLE IF NOT EXISTS `surat_tugas_personil` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `id_surat_tugas` INT UNSIGNED NOT NULL,
  `nip`            VARCHAR(30) DEFAULT '',
  `nama`           VARCHAR(150) NOT NULL,
  `pangkat`        VARCHAR(100) DEFAULT '',
  `jabatan`        VARCHAR(150) DEFAULT '',
  `urutan`         TINYINT UNSIGNED DEFAULT 1,
  FOREIGN KEY (`id_surat_tugas`) REFERENCES `surat_tugas`(`id`) ON DELETE CASCADE,
  INDEX `idx_spt` (`id_surat_tugas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Daftar personil/pelaksana dalam surat tugas';

-- ============================================================
-- VIEW: Dashboard Summary (memudahkan query statistik)
-- ============================================================
CREATE OR REPLACE VIEW `vw_dashboard_stats` AS
SELECT
  (SELECT COUNT(*) FROM surat_masuk) AS total_surat_masuk,
  (SELECT COUNT(*) FROM surat_masuk WHERE status_disposisi = 'Menunggu Disposisi') AS menunggu_disposisi,
  (SELECT COUNT(*) FROM surat_masuk WHERE status_disposisi = 'Didisposisi') AS sudah_disposisi,
  (SELECT COUNT(*) FROM surat_masuk WHERE status_disposisi = 'Selesai') AS selesai,
  (SELECT COUNT(*) FROM surat_keluar) AS total_surat_keluar,
  (SELECT COUNT(*) FROM disposisi) AS total_disposisi,
  (SELECT COUNT(*) FROM surat_tugas) AS total_surat_tugas,
  (SELECT COUNT(*) FROM pegawai WHERE aktif = 1) AS total_pegawai;

-- ============================================================
-- DATA AWAL: Pegawai BKPSDM Luwu Timur (Sesuai Simulasi Sistem)
-- ============================================================
INSERT IGNORE INTO `pegawai` (`nip`, `nama`, `pangkat`, `jabatan`, `role`, `unit`, `password`) VALUES
('198401142003122001', 'PARHA ARIEF, S.AP',
  'Pembina (IV/a)', 'Kepala BKPSDM',
  'kepala_bkpsdm', 'Kepala BKPSDM Kabupaten Luwu Timur', '123456'),
('199611022020121005', 'Yusri Mahendra, S.Kom.',
  'Penata Muda (III/a)', 'Pengadministrasi Umum',
  'admin', 'Subbag Umum & Kepegawaian', '123456'),
('198007202006041011', 'Muhammad Yusuf, S.Sos., M.Si.',
  'Pembina (IV/a)', 'Kepala Bidang Mutasi & Informasi Kepegawaian',
  'kabid', 'Bidang Mutasi & Informasi Kepegawaian', '123456'),
('198903252011012004', 'Fitriani, S.STP.',
  'Penata (III/c)', 'Analis Sumber Daya Manusia Aparatur',
  'pegawai', 'Bidang Pengadaan & Mutasi', '123456');

SELECT 'Schema MySQL berhasil dibuat! Database siap digunakan.' AS status;
