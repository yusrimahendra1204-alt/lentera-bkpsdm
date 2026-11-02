<?php

namespace App\Http\Controllers;

use App\Models\Disposisi;
use App\Models\KlasifikasiArsip;
use App\Models\Pegawai;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\SuratTugas;
use App\Models\SuratTugasPersonil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DatabaseController extends Controller
{
    public function index()
    {
        $dbPath = database_path('database.sqlite');
        $sqliteSizeKb = file_exists($dbPath) ? round(filesize($dbPath) / 1024, 1) : 0;
        $sqliteMtime = file_exists($dbPath) ? date('d/m/Y H:i', filemtime($dbPath)) : '-';

        $stats = [
            'pegawai' => Pegawai::count(),
            'klasifikasi' => KlasifikasiArsip::count(),
            'surat_masuk' => SuratMasuk::count(),
            'disposisi' => Disposisi::count(),
            'surat_keluar' => SuratKeluar::count(),
            'surat_tugas' => SuratTugas::count(),
            'surat_tugas_personil' => SuratTugasPersonil::count(),
            'sqlite_size_kb' => $sqliteSizeKb,
            'sqlite_mtime' => $sqliteMtime,
        ];

        return view('database.index', compact('stats'));
    }

    /**
     * Ekspor seluruh data ke file MySQL Dump (.sql) yang siap diimport di phpMyAdmin / MySQL Workbench
     */
    public function downloadSql()
    {
        $now = date('Y-m-d H:i:s');
        $sql = "-- =====================================================================\n";
        $sql .= "-- SISTEM INFORMASI PERSURATAN BERBASIS WEB (LENTERA BKPSDM)\n";
        $sql .= "-- BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA (BKPSDM)\n";
        $sql .= "-- KABUPATEN LUWU TIMUR\n";
        $sql .= "-- Rujukan Regulasi: Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023\n";
        $sql .= "-- Tanggal Ekspor: {$now} WITA\n";
        $sql .= "-- =====================================================================\n\n";

        $sql .= "SET FOREIGN_KEY_CHECKS = 0;\n";
        $sql .= "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n";
        $sql .= "START TRANSACTION;\n";
        $sql .= "SET time_zone = \"+08:00\";\n\n";

        $sql .= "CREATE DATABASE IF NOT EXISTS `db_persuratan_bkpsdm` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n";
        $sql .= "USE `db_persuratan_bkpsdm`;\n\n";

        // 1. Pegawai
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "-- 1. Struktur Tabel `pegawai`\n";
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "DROP TABLE IF EXISTS `pegawai`;\n";
        $sql .= "CREATE TABLE `pegawai` (\n";
        $sql .= "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n";
        $sql .= "  `nip` VARCHAR(30) NOT NULL UNIQUE,\n";
        $sql .= "  `nama` VARCHAR(150) NOT NULL,\n";
        $sql .= "  `pangkat` VARCHAR(100) DEFAULT NULL,\n";
        $sql .= "  `jabatan` VARCHAR(200) NOT NULL,\n";
        $sql .= "  `role` VARCHAR(50) NOT NULL DEFAULT 'pegawai',\n";
        $sql .= "  `unit` VARCHAR(150) NOT NULL,\n";
        $sql .= "  `password` VARCHAR(255) DEFAULT '123456',\n";
        $sql .= "  `aktif` TINYINT(1) DEFAULT 1,\n";
        $sql .= "  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n";
        $sql .= "  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n";
        $sql .= "  PRIMARY KEY (`id`)\n";
        $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $pegawai = Pegawai::all();
        if ($pegawai->count() > 0) {
            $sql .= "INSERT INTO `pegawai` (`id`, `nip`, `nama`, `pangkat`, `jabatan`, `role`, `unit`, `password`, `aktif`) VALUES\n";
            $pRows = [];
            foreach ($pegawai as $p) {
                $pRows[] = "(" . implode(', ', [
                    $p->id,
                    $this->escapeSql($p->nip),
                    $this->escapeSql($p->nama),
                    $this->escapeSql($p->pangkat),
                    $this->escapeSql($p->jabatan),
                    $this->escapeSql($p->role),
                    $this->escapeSql($p->unit),
                    $this->escapeSql($p->password),
                    $p->aktif ? 1 : 0
                ]) . ")";
            }
            $sql .= implode(",\n", $pRows) . ";\n\n";
        }

        // 2. Klasifikasi Arsip
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "-- 2. Struktur Tabel `klasifikasi_arsip` (Perbup Luwu Timur No. 69/2023)\n";
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "DROP TABLE IF EXISTS `klasifikasi_arsip`;\n";
        $sql .= "CREATE TABLE `klasifikasi_arsip` (\n";
        $sql .= "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n";
        $sql .= "  `kode` VARCHAR(50) NOT NULL UNIQUE,\n";
        $sql .= "  `nama` VARCHAR(255) NOT NULL,\n";
        $sql .= "  `kategori` VARCHAR(20) NOT NULL,\n";
        $sql .= "  `keywords` VARCHAR(255) DEFAULT NULL,\n";
        $sql .= "  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n";
        $sql .= "  PRIMARY KEY (`id`),\n";
        $sql .= "  KEY `idx_kode` (`kode`),\n";
        $sql .= "  KEY `idx_kategori` (`kategori`)\n";
        $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $klasifikasi = KlasifikasiArsip::all();
        if ($klasifikasi->count() > 0) {
            $chunks = $klasifikasi->chunk(500);
            foreach ($chunks as $chunk) {
                $sql .= "INSERT INTO `klasifikasi_arsip` (`id`, `kode`, `nama`, `kategori`, `keywords`) VALUES\n";
                $kRows = [];
                foreach ($chunk as $k) {
                    $kRows[] = "(" . implode(', ', [
                        $k->id,
                        $this->escapeSql($k->kode),
                        $this->escapeSql($k->nama),
                        $this->escapeSql($k->kategori),
                        $this->escapeSql($k->keywords)
                    ]) . ")";
                }
                $sql .= implode(",\n", $kRows) . ";\n";
            }
            $sql .= "\n";
        }

        // 3. Surat Masuk
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "-- 3. Struktur Tabel `surat_masuk`\n";
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "DROP TABLE IF EXISTS `surat_masuk`;\n";
        $sql .= "CREATE TABLE `surat_masuk` (\n";
        $sql .= "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n";
        $sql .= "  `no_agenda` VARCHAR(100) NOT NULL UNIQUE,\n";
        $sql .= "  `no_surat_pengirim` VARCHAR(150) NOT NULL,\n";
        $sql .= "  `instansi_pengirim` VARCHAR(255) NOT NULL,\n";
        $sql .= "  `perihal` TEXT NOT NULL,\n";
        $sql .= "  `tgl_surat` DATE NOT NULL,\n";
        $sql .= "  `tgl_diterima` DATE NOT NULL,\n";
        $sql .= "  `sifat_surat` VARCHAR(50) NOT NULL DEFAULT 'Biasa',\n";
        $sql .= "  `kode_internal` VARCHAR(50) NOT NULL DEFAULT '800',\n";
        $sql .= "  `status_disposisi` VARCHAR(50) NOT NULL DEFAULT 'Menunggu Disposisi',\n";
        $sql .= "  `file_name` VARCHAR(255) DEFAULT NULL,\n";
        $sql .= "  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n";
        $sql .= "  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n";
        $sql .= "  PRIMARY KEY (`id`)\n";
        $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $smList = SuratMasuk::all();
        if ($smList->count() > 0) {
            $sql .= "INSERT INTO `surat_masuk` (`id`, `no_agenda`, `no_surat_pengirim`, `instansi_pengirim`, `perihal`, `tgl_surat`, `tgl_diterima`, `sifat_surat`, `kode_internal`, `status_disposisi`, `file_name`) VALUES\n";
            $smRows = [];
            foreach ($smList as $s) {
                $smRows[] = "(" . implode(', ', [
                    $s->id,
                    $this->escapeSql($s->no_agenda),
                    $this->escapeSql($s->no_surat_pengirim),
                    $this->escapeSql($s->instansi_pengirim),
                    $this->escapeSql($s->perihal),
                    $this->escapeSql($s->tgl_surat ? $s->tgl_surat->format('Y-m-d') : null),
                    $this->escapeSql($s->tgl_diterima ? $s->tgl_diterima->format('Y-m-d') : null),
                    $this->escapeSql($s->sifat_surat),
                    $this->escapeSql($s->kode_internal),
                    $this->escapeSql($s->status_disposisi),
                    $this->escapeSql($s->file_name)
                ]) . ")";
            }
            $sql .= implode(",\n", $smRows) . ";\n\n";
        }

        // 4. Disposisi
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "-- 4. Struktur Tabel `disposisi`\n";
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "DROP TABLE IF EXISTS `disposisi`;\n";
        $sql .= "CREATE TABLE `disposisi` (\n";
        $sql .= "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n";
        $sql .= "  `id_surat_masuk` INT(11) NOT NULL,\n";
        $sql .= "  `tujuan_nama` VARCHAR(255) NOT NULL,\n";
        $sql .= "  `sifat` VARCHAR(50) NOT NULL DEFAULT 'Biasa',\n";
        $sql .= "  `batas_waktu` DATE DEFAULT NULL,\n";
        $sql .= "  `instruksi` TEXT DEFAULT NULL,\n";
        $sql .= "  `catatan` TEXT DEFAULT NULL,\n";
        $sql .= "  `status` VARCHAR(50) NOT NULL DEFAULT 'Didisposisi',\n";
        $sql .= "  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n";
        $sql .= "  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n";
        $sql .= "  PRIMARY KEY (`id`),\n";
        $sql .= "  KEY `idx_surat_masuk` (`id_surat_masuk`)\n";
        $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $dispList = Disposisi::all();
        if ($dispList->count() > 0) {
            $sql .= "INSERT INTO `disposisi` (`id`, `id_surat_masuk`, `tujuan_nama`, `sifat`, `batas_waktu`, `instruksi`, `catatan`, `status`) VALUES\n";
            $dRows = [];
            foreach ($dispList as $d) {
                $insStr = is_array($d->instruksi) ? json_encode($d->instruksi, JSON_UNESCAPED_UNICODE) : $d->instruksi;
                $dRows[] = "(" . implode(', ', [
                    $d->id,
                    $d->id_surat_masuk,
                    $this->escapeSql($d->tujuan_nama),
                    $this->escapeSql($d->sifat),
                    $this->escapeSql($d->batas_waktu ? $d->batas_waktu->format('Y-m-d') : null),
                    $this->escapeSql($insStr),
                    $this->escapeSql($d->catatan),
                    $this->escapeSql($d->status)
                ]) . ")";
            }
            $sql .= implode(",\n", $dRows) . ";\n\n";
        }

        // 5. Surat Keluar
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "-- 5. Struktur Tabel `surat_keluar` (Anti-Nomor Ganda)\n";
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "DROP TABLE IF EXISTS `surat_keluar`;\n";
        $sql .= "CREATE TABLE `surat_keluar` (\n";
        $sql .= "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n";
        $sql .= "  `no_agenda` VARCHAR(100) NOT NULL UNIQUE,\n";
        $sql .= "  `bidang_pembuat` VARCHAR(255) NOT NULL,\n";
        $sql .= "  `kode_klasifikasi` VARCHAR(50) NOT NULL,\n";
        $sql .= "  `nama_klasifikasi` VARCHAR(255) NOT NULL,\n";
        $sql .= "  `no_surat_keluar` VARCHAR(150) NOT NULL UNIQUE,\n";
        $sql .= "  `tujuan_surat` VARCHAR(255) NOT NULL,\n";
        $sql .= "  `perihal` TEXT NOT NULL,\n";
        $sql .= "  `tgl_surat` DATE NOT NULL,\n";
        $sql .= "  `sifat_surat` VARCHAR(50) NOT NULL DEFAULT 'Biasa',\n";
        $sql .= "  `penandatangan` VARCHAR(150) NOT NULL DEFAULT 'PARHA ARIEF, S.AP',\n";
        $sql .= "  `metode_dokumen` VARCHAR(150) NOT NULL DEFAULT 'Fisik Manual (Tanda Tangan Basah)',\n";
        $sql .= "  `lokasi_arsip_fisik` VARCHAR(255) DEFAULT 'Lemari Arsip Subbag Umum',\n";
        $sql .= "  `is_surat_balasan` TINYINT(1) DEFAULT 0,\n";
        $sql .= "  `id_surat_masuk_asal` INT(11) DEFAULT NULL,\n";
        $sql .= "  `no_surat_pengirim_asal` VARCHAR(150) DEFAULT NULL,\n";
        $sql .= "  `file_name` VARCHAR(255) DEFAULT NULL,\n";
        $sql .= "  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n";
        $sql .= "  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n";
        $sql .= "  PRIMARY KEY (`id`),\n";
        $sql .= "  KEY `idx_kode_klasifikasi` (`kode_klasifikasi`)\n";
        $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $skList = SuratKeluar::all();
        if ($skList->count() > 0) {
            $chunks = $skList->chunk(200);
            foreach ($chunks as $chunk) {
                $sql .= "INSERT INTO `surat_keluar` (`id`, `no_agenda`, `bidang_pembuat`, `kode_klasifikasi`, `nama_klasifikasi`, `no_surat_keluar`, `tujuan_surat`, `perihal`, `tgl_surat`, `sifat_surat`, `penandatangan`, `metode_dokumen`, `lokasi_arsip_fisik`, `is_surat_balasan`, `id_surat_masuk_asal`, `no_surat_pengirim_asal`, `file_name`) VALUES\n";
                $skRows = [];
                foreach ($chunk as $sk) {
                    $skRows[] = "(" . implode(', ', [
                        $sk->id,
                        $this->escapeSql($sk->no_agenda),
                        $this->escapeSql($sk->bidang_pembuat),
                        $this->escapeSql($sk->kode_klasifikasi),
                        $this->escapeSql($sk->nama_klasifikasi),
                        $this->escapeSql($sk->no_surat_keluar),
                        $this->escapeSql($sk->tujuan_surat),
                        $this->escapeSql($sk->perihal),
                        $this->escapeSql($sk->tgl_surat ? $sk->tgl_surat->format('Y-m-d') : null),
                        $this->escapeSql($sk->sifat_surat),
                        $this->escapeSql($sk->penandatangan),
                        $this->escapeSql($sk->metode_dokumen),
                        $this->escapeSql($sk->lokasi_arsip_fisik),
                        $sk->is_surat_balasan ? 1 : 0,
                        $sk->id_surat_masuk_asal ? (int)$sk->id_surat_masuk_asal : 'NULL',
                        $this->escapeSql($sk->no_surat_pengirim_asal),
                        $this->escapeSql($sk->file_name)
                    ]) . ")";
                }
                $sql .= implode(",\n", $skRows) . ";\n";
            }
            $sql .= "\n";
        }

        // 6. Surat Tugas
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "-- 6. Struktur Tabel `surat_tugas`\n";
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "DROP TABLE IF EXISTS `surat_tugas`;\n";
        $sql .= "CREATE TABLE `surat_tugas` (\n";
        $sql .= "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n";
        $sql .= "  `no_surat_tugas` VARCHAR(150) NOT NULL UNIQUE,\n";
        $sql .= "  `bidang_pengusul` VARCHAR(255) NOT NULL,\n";
        $sql .= "  `kode_klasifikasi` VARCHAR(50) NOT NULL DEFAULT '800.1.11.1',\n";
        $sql .= "  `nama_klasifikasi` VARCHAR(255) NOT NULL DEFAULT 'Surat Perintah Dinas/Surat Tugas',\n";
        $sql .= "  `dasar` TEXT DEFAULT NULL,\n";
        $sql .= "  `maksud_tugas` TEXT NOT NULL,\n";
        $sql .= "  `tempat_tujuan` VARCHAR(255) NOT NULL,\n";
        $sql .= "  `tgl_berangkat` DATE NOT NULL,\n";
        $sql .= "  `tgl_kembali` DATE NOT NULL,\n";
        $sql .= "  `lama_hari` INT(5) NOT NULL DEFAULT 1,\n";
        $sql .= "  `pembebanan_anggaran` VARCHAR(255) NOT NULL DEFAULT 'DPA-SKPD BKPSDM Kabupaten Luwu Timur TA 2026',\n";
        $sql .= "  `pejabat_penandatangan` VARCHAR(150) NOT NULL DEFAULT 'PARHA ARIEF, S.AP',\n";
        $sql .= "  `jabatan_penandatangan` VARCHAR(200) NOT NULL DEFAULT 'Kepala BKPSDM Kabupaten Luwu Timur',\n";
        $sql .= "  `status_naskah_fisik` VARCHAR(255) DEFAULT 'Naskah fisik disusun & dicetak manual oleh bidang',\n";
        $sql .= "  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n";
        $sql .= "  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n";
        $sql .= "  PRIMARY KEY (`id`)\n";
        $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $stList = SuratTugas::all();
        if ($stList->count() > 0) {
            $sql .= "INSERT INTO `surat_tugas` (`id`, `no_surat_tugas`, `bidang_pengusul`, `kode_klasifikasi`, `nama_klasifikasi`, `dasar`, `maksud_tugas`, `tempat_tujuan`, `tgl_berangkat`, `tgl_kembali`, `lama_hari`, `pembebanan_anggaran`, `pejabat_penandatangan`, `jabatan_penandatangan`, `status_naskah_fisik`) VALUES\n";
            $stRows = [];
            foreach ($stList as $st) {
                $stRows[] = "(" . implode(', ', [
                    $st->id,
                    $this->escapeSql($st->no_surat_tugas),
                    $this->escapeSql($st->bidang_pengusul),
                    $this->escapeSql($st->kode_klasifikasi),
                    $this->escapeSql($st->nama_klasifikasi),
                    $this->escapeSql($st->dasar),
                    $this->escapeSql($st->maksud_tugas),
                    $this->escapeSql($st->tempat_tujuan),
                    $this->escapeSql($st->tgl_berangkat ? $st->tgl_berangkat->format('Y-m-d') : null),
                    $this->escapeSql($st->tgl_kembali ? $st->tgl_kembali->format('Y-m-d') : null),
                    (int)$st->lama_hari,
                    $this->escapeSql($st->pembebanan_anggaran),
                    $this->escapeSql($st->pejabat_penandatangan),
                    $this->escapeSql($st->jabatan_penandatangan),
                    $this->escapeSql($st->status_naskah_fisik)
                ]) . ")";
            }
            $sql .= implode(",\n", $stRows) . ";\n\n";
        }

        // 7. Surat Tugas Personil
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "-- 7. Struktur Tabel `surat_tugas_personil` (Multi-Pegawai)\n";
        $sql .= "-- --------------------------------------------------------\n";
        $sql .= "DROP TABLE IF EXISTS `surat_tugas_personil`;\n";
        $sql .= "CREATE TABLE `surat_tugas_personil` (\n";
        $sql .= "  `id` INT(11) NOT NULL AUTO_INCREMENT,\n";
        $sql .= "  `surat_tugas_id` INT(11) NOT NULL,\n";
        $sql .= "  `pegawai_id` INT(11) DEFAULT NULL,\n";
        $sql .= "  `nama` VARCHAR(150) NOT NULL,\n";
        $sql .= "  `nip` VARCHAR(50) DEFAULT NULL,\n";
        $sql .= "  `pangkat` VARCHAR(100) DEFAULT NULL,\n";
        $sql .= "  `jabatan` VARCHAR(200) DEFAULT NULL,\n";
        $sql .= "  `urutan` INT(5) NOT NULL DEFAULT 1,\n";
        $sql .= "  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,\n";
        $sql .= "  PRIMARY KEY (`id`),\n";
        $sql .= "  KEY `idx_surat_tugas_id` (`surat_tugas_id`)\n";
        $sql .= ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

        $stpList = SuratTugasPersonil::all();
        if ($stpList->count() > 0) {
            $sql .= "INSERT INTO `surat_tugas_personil` (`id`, `surat_tugas_id`, `pegawai_id`, `nama`, `nip`, `pangkat`, `jabatan`, `urutan`) VALUES\n";
            $stpRows = [];
            foreach ($stpList as $p) {
                $stpRows[] = "(" . implode(', ', [
                    $p->id,
                    $p->surat_tugas_id,
                    $p->pegawai_id ? (int)$p->pegawai_id : 'NULL',
                    $this->escapeSql($p->nama),
                    $this->escapeSql($p->nip),
                    $this->escapeSql($p->pangkat),
                    $this->escapeSql($p->jabatan),
                    (int)$p->urutan
                ]) . ")";
            }
            $sql .= implode(",\n", $stpRows) . ";\n\n";
        }

        $sql .= "COMMIT;\n";
        $sql .= "SET FOREIGN_KEY_CHECKS = 1;\n";

        return response($sql, 200, [
            'Content-Type' => 'application/sql; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="database_persuratan.sql"',
        ]);
    }

    /**
     * Download Snapshot JSON Cadangan
     */
    public function backupJson()
    {
        $data = [
            'pegawai' => Pegawai::all(),
            'surat_masuk' => SuratMasuk::all(),
            'disposisi' => Disposisi::all(),
            'surat_keluar' => SuratKeluar::all(),
            'surat_tugas' => SuratTugas::with('personil')->get(),
        ];

        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $filename = 'backup_persuratan_bkpsdm_' . date('Ymd_His') . '.json';

        return response($json, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Pulihkan Data dari file JSON Cadangan
     */
    public function restoreJson(Request $request)
    {
        $request->validate([
            'backup_file' => 'required|file|mimes:json,txt',
        ]);

        $content = file_get_contents($request->file('backup_file')->getRealPath());
        $data = json_decode($content, true);

        if (!$data || !is_array($data) || !isset($data['pegawai'])) {
            return back()->with('error', 'Format file cadangan tidak valid untuk sistem LENTERA BKPSDM.');
        }

        DB::transaction(function () use ($data) {
            // Restore surat masuk & disposisi & surat keluar & tugas
            if (isset($data['surat_masuk']) && is_array($data['surat_masuk'])) {
                SuratMasuk::truncate();
                foreach ($data['surat_masuk'] as $sm) {
                    SuratMasuk::create($sm);
                }
            }

            if (isset($data['disposisi']) && is_array($data['disposisi'])) {
                Disposisi::truncate();
                foreach ($data['disposisi'] as $d) {
                    Disposisi::create($d);
                }
            }

            if (isset($data['surat_keluar']) && is_array($data['surat_keluar'])) {
                SuratKeluar::truncate();
                foreach ($data['surat_keluar'] as $sk) {
                    SuratKeluar::create($sk);
                }
            }

            if (isset($data['surat_tugas']) && is_array($data['surat_tugas'])) {
                SuratTugasPersonil::truncate();
                SuratTugas::truncate();
                foreach ($data['surat_tugas'] as $st) {
                    $personil = $st['personil'] ?? [];
                    unset($st['personil']);
                    $created = SuratTugas::create($st);
                    foreach ($personil as $p) {
                        $p['surat_tugas_id'] = $created->id;
                        SuratTugasPersonil::create($p);
                    }
                }
            }
        });

        return back()->with('success', 'Data persuratan dan disposisi berhasil dipulihkan dari cadangan!');
    }

    /**
     * Bersihkan Seluruh Data Dummy Transaksi (Kosongkan Buku Agenda, Pertahankan Master Pegawai & Perbup)
     */
    public function clearDummy()
    {
        SuratTugasPersonil::truncate();
        SuratTugas::truncate();
        SuratKeluar::truncate();
        Disposisi::truncate();
        SuratMasuk::truncate();

        return back()->with('success', 'Seluruh data transaksi dummy surat masuk, surat keluar, disposisi, dan surat tugas berhasil dibersihkan! Sistem kini dalam kondisi bersih siap pakai.');
    }

    private function escapeSql($val)
    {
        if ($val === null || $val === '') {
            return 'NULL';
        }
        $val = str_replace(
            ['\\', "\0", "\n", "\r", "'", '"', "\x1a"],
            ['\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'],
            (string)$val
        );
        return "'{$val}'";
    }
}

