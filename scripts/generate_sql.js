/**
 * Generator Database SQL Otomatis untuk MySQL / phpMyAdmin
 * Sistem Informasi Persuratan BKPSDM Kabupaten Luwu Timur
 * Perbup Luwu Timur No. 69 Tahun 2023
 * Oleh: Yusri Mahendra (NIM: IK2311011)
 */

const fs = require('fs');
const path = require('path');

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
      switch (char) {
        case "\0": return "\\0";
        case "\x08": return "\\b";
        case "\x09": return "\\t";
        case "\x1a": return "\\z";
        case "\n": return "\\n";
        case "\r": return "\\r";
        case "\"":
        case "'":
        case "\\":
        case "%":
          return "\\" + char;
        default:
          return char;
      }
    })}'`;
  }

  return `'${String(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"":
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
      default:
        return char;
    }
  })}'`;
}

function generateSqlContent(state, klasifikasiList) {
  let sql = `-- =====================================================================
-- SISTEM INFORMASI PERSURATAN BERBASIS WEB
-- BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA (BKPSDM)
-- KABUPATEN LUWU TIMUR
--
-- Rujukan Regulasi: Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023
-- Peneliti: Yusri Mahendra (NIM: IK2311011)
-- Program Studi: Sarjana Informatika, Universitas Mega Buana Palopo
-- Waktu Pembuatan/Export: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: \`db_persuratan_bkpsdm\`
--
CREATE DATABASE IF NOT EXISTS \`db_persuratan_bkpsdm\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_persuratan_bkpsdm\`;

-- --------------------------------------------------------
-- 1. Struktur Tabel \`pegawai\` (Pengguna / RBAC)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`pegawai\`;
CREATE TABLE \`pegawai\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`nip\` VARCHAR(30) NOT NULL UNIQUE,
  \`nama\` VARCHAR(150) NOT NULL,
  \`pangkat\` VARCHAR(100) DEFAULT NULL,
  \`jabatan\` VARCHAR(200) NOT NULL,
  \`role\` ENUM('admin','kepala_bkpsdm','sekretaris','kabid','pegawai') NOT NULL DEFAULT 'pegawai',
  \`unit\` VARCHAR(150) NOT NULL,
  \`password\` VARCHAR(255) DEFAULT '123456',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Struktur Tabel \`klasifikasi_arsip\` (Perbup Luwu Timur No. 69 Tahun 2023)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`klasifikasi_arsip\`;
CREATE TABLE \`klasifikasi_arsip\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`kode\` VARCHAR(50) NOT NULL,
  \`nama\` TEXT NOT NULL,
  \`kategori\` VARCHAR(50) NOT NULL,
  \`keywords\` TEXT DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_kode\` (\`kode\`),
  KEY \`idx_kategori\` (\`kategori\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Struktur Tabel \`surat_masuk\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`surat_masuk\`;
CREATE TABLE \`surat_masuk\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`no_agenda\` VARCHAR(50) NOT NULL UNIQUE,
  \`no_surat_pengirim\` VARCHAR(100) NOT NULL,
  \`instansi_pengirim\` VARCHAR(200) NOT NULL,
  \`kode_internal\` VARCHAR(50) NOT NULL,
  \`nama_klasifikasi_internal\` VARCHAR(255) NOT NULL,
  \`perihal\` TEXT NOT NULL,
  \`tgl_surat\` DATE NOT NULL,
  \`tgl_diterima\` DATE NOT NULL,
  \`sifat_surat\` ENUM('Biasa','Penting','Segera','Rahasia') NOT NULL DEFAULT 'Biasa',
  \`lampiran\` VARCHAR(100) DEFAULT '1 Berkas',
  \`status_disposisi\` ENUM('Menunggu Disposisi','Didisposisi','Selesai') NOT NULL DEFAULT 'Menunggu Disposisi',
  \`file_name\` VARCHAR(255) DEFAULT 'surat_masuk.pdf',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_kode_internal\` (\`kode_internal\`),
  KEY \`idx_status_disposisi\` (\`status_disposisi\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Struktur Tabel \`disposisi\` (Alur Instruksi Pimpinan BKPSDM)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`disposisi\`;
CREATE TABLE \`disposisi\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`id_surat_masuk\` INT(11) NOT NULL,
  \`dari_user\` VARCHAR(150) NOT NULL,
  \`tujuan_user_id\` INT(11) NOT NULL,
  \`tujuan_nama\` VARCHAR(150) NOT NULL,
  \`sifat\` ENUM('Biasa','Segera','Sangat Segera','Rahasia') NOT NULL DEFAULT 'Biasa',
  \`instruksi\` TEXT NOT NULL,
  \`catatan\` TEXT DEFAULT NULL,
  \`batas_waktu\` DATE DEFAULT NULL,
  \`status_tindak_lanjut\` ENUM('Menunggu','Diproses','Selesai') NOT NULL DEFAULT 'Menunggu',
  \`tindak_lanjut_note\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`fk_disposisi_surat_masuk\` (\`id_surat_masuk\`),
  KEY \`fk_disposisi_tujuan_user\` (\`tujuan_user_id\`),
  CONSTRAINT \`fk_disposisi_sm\` FOREIGN KEY (\`id_surat_masuk\`) REFERENCES \`surat_masuk\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Struktur Tabel \`surat_keluar\`
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`surat_keluar\`;
CREATE TABLE \`surat_keluar\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`no_agenda\` VARCHAR(50) NOT NULL UNIQUE,
  \`bidang_pembuat\` VARCHAR(200) NOT NULL,
  \`kode_klasifikasi\` VARCHAR(50) NOT NULL,
  \`nama_klasifikasi\` VARCHAR(255) NOT NULL,
  \`no_surat_keluar\` VARCHAR(100) NOT NULL UNIQUE,
  \`tujuan_surat\` VARCHAR(255) DEFAULT '',
  \`perihal\` TEXT NOT NULL,
  \`tgl_surat\` DATE NOT NULL,
  \`sifat_surat\` ENUM('Biasa','Penting','Segera','Rahasia') NOT NULL DEFAULT 'Biasa',
  \`penandatangan\` VARCHAR(150) NOT NULL,
  \`metode_dokumen\` VARCHAR(100) DEFAULT 'Fisik Manual (Tanda Tangan Basah)',
  \`lokasi_arsip_fisik\` VARCHAR(150) DEFAULT 'Lemari Arsip Subbag Umum',
  \`is_surat_balasan\` TINYINT(1) NOT NULL DEFAULT 0,
  \`id_surat_masuk_asal\` INT(11) DEFAULT NULL,
  \`no_surat_pengirim_asal\` VARCHAR(100) DEFAULT NULL,
  \`file_name\` VARCHAR(255) DEFAULT 'surat_keluar.pdf',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_kode_klasifikasi_sk\` (\`kode_klasifikasi\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Struktur Tabel \`surat_tugas\` (SPT Dinas Khusus 800.1.11.1)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`surat_tugas\`;
CREATE TABLE \`surat_tugas\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`no_surat_tugas\` VARCHAR(100) NOT NULL UNIQUE,
  \`bidang_pengusul\` VARCHAR(200) NOT NULL,
  \`kode_klasifikasi\` VARCHAR(50) NOT NULL DEFAULT '800.1.11.1',
  \`nama_klasifikasi\` VARCHAR(255) NOT NULL DEFAULT 'Surat Perintah Dinas/Surat Tugas',
  \`dasar\` TEXT NOT NULL,
  \`maksud_tugas\` TEXT NOT NULL,
  \`tempat_tujuan\` VARCHAR(255) NOT NULL,
  \`tgl_berangkat\` DATE NOT NULL,
  \`tgl_kembali\` DATE NOT NULL,
  \`lama_hari\` INT(11) NOT NULL DEFAULT 1,
  \`pembebanan_anggaran\` VARCHAR(255) DEFAULT '',
  \`pejabat_penandatangan\` VARCHAR(150) NOT NULL,
  \`jabatan_penandatangan\` VARCHAR(150) NOT NULL,
  \`status_naskah_fisik\` VARCHAR(200) DEFAULT 'Naskah fisik disusun & dicetak manual oleh bidang (Tanda tangan basah manual)',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Struktur Tabel \`surat_tugas_personil\` (Multi-Pegawai SPT)
-- --------------------------------------------------------
DROP TABLE IF EXISTS \`surat_tugas_personil\`;
CREATE TABLE \`surat_tugas_personil\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`id_surat_tugas\` INT(11) NOT NULL,
  \`nip\` VARCHAR(30) NOT NULL,
  \`nama\` VARCHAR(150) NOT NULL,
  \`pangkat\` VARCHAR(100) DEFAULT NULL,
  \`jabatan\` VARCHAR(200) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`fk_spt_personil\` (\`id_surat_tugas\`),
  CONSTRAINT \`fk_spt_personil_id\` FOREIGN KEY (\`id_surat_tugas\`) REFERENCES \`surat_tugas\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- PENGISIAN DATA AWAL (SEED DATA SIMULASI BKPSDM LUWU TIMUR)
-- =====================================================================

--
-- Data Pegawai
--
`;

  // Pegawai
  if (state.pegawai && state.pegawai.length > 0) {
    const pegawaiValues = state.pegawai.map(p => {
      return `(${p.id}, ${escapeSql(p.nip)}, ${escapeSql(p.nama)}, ${escapeSql(p.pangkat)}, ${escapeSql(p.jabatan)}, ${escapeSql(p.role)}, ${escapeSql(p.unit)}, '123456', NOW())`;
    }).join(',\n');
    sql += `INSERT INTO \`pegawai\` (\`id\`, \`nip\`, \`nama\`, \`pangkat\`, \`jabatan\`, \`role\`, \`unit\`, \`password\`, \`created_at\`) VALUES\n${pegawaiValues};\n\n`;
  }

  // Surat Masuk
  if (state.surat_masuk && state.surat_masuk.length > 0) {
    sql += `--\n-- Data Surat Masuk\n--\n`;
    const smValues = state.surat_masuk.map(s => {
      return `(${s.id}, ${escapeSql(s.no_agenda)}, ${escapeSql(s.no_surat_pengirim)}, ${escapeSql(s.instansi_pengirim)}, ${escapeSql(s.kode_internal)}, ${escapeSql(s.nama_klasifikasi_internal)}, ${escapeSql(s.perihal)}, ${escapeSql(s.tgl_surat)}, ${escapeSql(s.tgl_diterima)}, ${escapeSql(s.sifat_surat)}, ${escapeSql(s.lampiran || '1 Berkas')}, ${escapeSql(s.status_disposisi)}, ${escapeSql(s.file_name || 'surat_masuk.pdf')}, NOW())`;
    }).join(',\n');
    sql += `INSERT INTO \`surat_masuk\` (\`id\`, \`no_agenda\`, \`no_surat_pengirim\`, \`instansi_pengirim\`, \`kode_internal\`, \`nama_klasifikasi_internal\`, \`perihal\`, \`tgl_surat\`, \`tgl_diterima\`, \`sifat_surat\`, \`lampiran\`, \`status_disposisi\`, \`file_name\`, \`created_at\`) VALUES\n${smValues};\n\n`;
  }

  // Disposisi
  if (state.disposisi && state.disposisi.length > 0) {
    sql += `--\n-- Data Disposisi Kepala BKPSDM\n--\n`;
    const dispValues = state.disposisi.map(d => {
      const instText = Array.isArray(d.instruksi) ? d.instruksi.join('; ') : d.instruksi;
      return `(${d.id}, ${d.id_surat_masuk}, ${escapeSql(d.dari_user)}, ${d.tujuan_user_id}, ${escapeSql(d.tujuan_nama)}, ${escapeSql(d.sifat)}, ${escapeSql(instText)}, ${escapeSql(d.catatan)}, ${escapeSql(d.batas_waktu)}, ${escapeSql(d.status_tindak_lanjut)}, ${escapeSql(d.tindak_lanjut_note || '')}, NOW())`;
    }).join(',\n');
    sql += `INSERT INTO \`disposisi\` (\`id\`, \`id_surat_masuk\`, \`dari_user\`, \`tujuan_user_id\`, \`tujuan_nama\`, \`sifat\`, \`instruksi\`, \`catatan\`, \`batas_waktu\`, \`status_tindak_lanjut\`, \`tindak_lanjut_note\`, \`created_at\`) VALUES\n${dispValues};\n\n`;
  }

  // Surat Keluar
  if (state.surat_keluar && state.surat_keluar.length > 0) {
    sql += `--\n-- Data Surat Keluar\n--\n`;
    const skValues = state.surat_keluar.map(sk => {
      return `(${sk.id}, ${escapeSql(sk.no_agenda)}, ${escapeSql(sk.bidang_pembuat)}, ${escapeSql(sk.kode_klasifikasi)}, ${escapeSql(sk.nama_klasifikasi)}, ${escapeSql(sk.no_surat_keluar)}, ${escapeSql(sk.tujuan_surat)}, ${escapeSql(sk.perihal)}, ${escapeSql(sk.tgl_surat)}, ${escapeSql(sk.sifat_surat)}, ${escapeSql(sk.penandatangan)}, ${escapeSql(sk.metode_dokumen)}, ${escapeSql(sk.lokasi_arsip_fisik)}, ${sk.is_surat_balasan ? 1 : 0}, ${sk.id_surat_masuk_asal || 'NULL'}, ${escapeSql(sk.no_surat_pengirim_asal || '')}, ${escapeSql(sk.file_name || 'surat_keluar.pdf')}, NOW())`;
    }).join(',\n');
    sql += `INSERT INTO \`surat_keluar\` (\`id\`, \`no_agenda\`, \`bidang_pembuat\`, \`kode_klasifikasi\`, \`nama_klasifikasi\`, \`no_surat_keluar\`, \`tujuan_surat\`, \`perihal\`, \`tgl_surat\`, \`sifat_surat\`, \`penandatangan\`, \`metode_dokumen\`, \`lokasi_arsip_fisik\`, \`is_surat_balasan\`, \`id_surat_masuk_asal\`, \`no_surat_pengirim_asal\`, \`file_name\`, \`created_at\`) VALUES\n${skValues};\n\n`;
  }

  // Surat Tugas & Personil
  if (state.surat_tugas && state.surat_tugas.length > 0) {
    sql += `--\n-- Data Surat Perintah Tugas (SPT)\n--\n`;
    const stValues = state.surat_tugas.map(st => {
      return `(${st.id}, ${escapeSql(st.no_surat_tugas)}, ${escapeSql(st.bidang_pengusul)}, ${escapeSql(st.kode_klasifikasi)}, ${escapeSql(st.nama_klasifikasi)}, ${escapeSql(st.dasar)}, ${escapeSql(st.maksud_tugas)}, ${escapeSql(st.tempat_tujuan)}, ${escapeSql(st.tgl_berangkat)}, ${escapeSql(st.tgl_kembali)}, ${st.lama_hari || 1}, ${escapeSql(st.pembebanan_anggaran)}, ${escapeSql(st.pejabat_penandatangan)}, ${escapeSql(st.jabatan_penandatangan)}, ${escapeSql(st.status_naskah_fisik)}, NOW())`;
    }).join(',\n');
    sql += `INSERT INTO \`surat_tugas\` (\`id\`, \`no_surat_tugas\`, \`bidang_pengusul\`, \`kode_klasifikasi\`, \`nama_klasifikasi\`, \`dasar\`, \`maksud_tugas\`, \`tempat_tujuan\`, \`tgl_berangkat\`, \`tgl_kembali\`, \`lama_hari\`, \`pembebanan_anggaran\`, \`pejabat_penandatangan\`, \`jabatan_penandatangan\`, \`status_naskah_fisik\`, \`created_at\`) VALUES\n${stValues};\n\n`;

    let allPersonil = [];
    let personilId = 1;
    state.surat_tugas.forEach(st => {
      if (Array.isArray(st.personil)) {
        st.personil.forEach(p => {
          allPersonil.push(`(${personilId++}, ${st.id}, ${escapeSql(p.nip)}, ${escapeSql(p.nama)}, ${escapeSql(p.pangkat)}, ${escapeSql(p.jabatan)})`);
        });
      }
    });

    if (allPersonil.length > 0) {
      sql += `--\n-- Data Personil yang Ditugaskan (SPT)\n--\n`;
      sql += `INSERT INTO \`surat_tugas_personil\` (\`id\`, \`id_surat_tugas\`, \`nip\`, \`nama\`, \`pangkat\`, \`jabatan\`) VALUES\n${allPersonil.join(',\n')};\n\n`;
    }
  }

  // Insert Master Klasifikasi Perbup Luwu Timur No. 69 Tahun 2023 in batches of 100
  sql += `-- =====================================================================\n`;
  sql += `-- MASTER DATA KODE KLASIFIKASI ARSIP (PERBUP LUWU TIMUR NO. 69 TAHUN 2023)\n`;
  sql += `-- Total: ${klasifikasiList.length} Kode Klasifikasi\n`;
  sql += `-- =====================================================================\n\n`;

  const BATCH_SIZE = 100;
  for (let i = 0; i < klasifikasiList.length; i += BATCH_SIZE) {
    const batch = klasifikasiList.slice(i, i + BATCH_SIZE);
    const rows = batch.map((item, idx) => {
      const id = i + idx + 1;
      const kw = Array.isArray(item.keywords) ? item.keywords.join(', ') : '';
      return `(${id}, ${escapeSql(item.kode)}, ${escapeSql(item.nama)}, ${escapeSql(item.kategori)}, ${escapeSql(kw)})`;
    }).join(',\n');

    sql += `INSERT INTO \`klasifikasi_arsip\` (\`id\`, \`kode\`, \`nama\`, \`kategori\`, \`keywords\`) VALUES\n${rows};\n\n`;
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\nCOMMIT;\n\n-- SELESAI EKSEKUSI DATABASE PERSURATAN BKPSDM LUWU TIMUR\n`;

  return sql;
}

function generateSqlFile(state, klasifikasiList, targetPath) {
  const content = generateSqlContent(state, klasifikasiList);
  fs.writeFileSync(targetPath, content, 'utf8');
  return targetPath;
}

module.exports = {
  escapeSql,
  generateSqlContent,
  generateSqlFile
};

// If run directly from CLI
if (require.main === module) {
  const ROOT_DIR = path.resolve(__dirname, '..');
  const DATA_DIR = path.join(ROOT_DIR, 'data');
  const OUTPUT_FILE = path.join(ROOT_DIR, 'database_persuratan.sql');

  const initialState = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'initial_state.json'), 'utf8'));
  const klasifikasi = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'klasifikasi_perbup.json'), 'utf8'));

  generateSqlFile(initialState, klasifikasi, OUTPUT_FILE);
  console.log(`[GENERATE SQL SUCCESS] File berhasil dibuat di: ${OUTPUT_FILE}`);
  console.log(`[INFO] Ukuran file: ${(fs.statSync(OUTPUT_FILE).size / (1024 * 1024)).toFixed(2)} MB`);
}
