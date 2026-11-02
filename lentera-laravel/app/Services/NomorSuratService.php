<?php

namespace App\Services;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\SuratTugas;

class NomorSuratService
{
    /**
     * Konversi angka bulan (1-12) ke angka romawi (I-XII)
     */
    public static function getBulanRomawi(int $bulan): string
    {
        $romawi = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
        ];
        return $romawi[$bulan] ?? 'X';
    }

    /**
     * Estimasi nomor agenda Surat Masuk berikutnya (format: SM-2026-131)
     */
    public static function getNextAgendaSuratMasuk(int $tahun = 2026): string
    {
        $maxUrut = 0;
        $items = SuratMasuk::select('no_agenda')->get();
        foreach ($items as $item) {
            if (preg_match('/SM-\d{4}-(\d+)/i', $item->no_agenda, $matches)) {
                $num = (int)$matches[1];
                if ($num > $maxUrut) $maxUrut = $num;
            }
        }
        $next = $maxUrut + 1;
        return sprintf("SM-%d-%03d", $tahun, $next);
    }

    /**
     * Estimasi nomor agenda Surat Keluar berikutnya (format: SK-2026-823)
     */
    public static function getNextAgendaSuratKeluar(int $tahun = 2026): string
    {
        $maxUrut = 0;
        $items = SuratKeluar::select('no_agenda')->get();
        foreach ($items as $item) {
            if (preg_match('/SK-\d{4}-(\d+)/i', $item->no_agenda, $matches)) {
                $num = (int)$matches[1];
                if ($num > $maxUrut) $maxUrut = $num;
            }
        }
        $next = $maxUrut + 1;
        return sprintf("SK-%d-%03d", $tahun, $next);
    }

    /**
     * Ambil nomor urut tertinggi dan estimasi nomor urut surat keluar murni (misal 841 -> 842)
     */
    public static function getSuratKeluarSequenceInfo(): array
    {
        $maxUrut = 0;
        $lastSurat = null;
        $items = SuratKeluar::select('id', 'no_surat_keluar', 'tgl_surat', 'kode_klasifikasi')->get();

        foreach ($items as $item) {
            // Format: [Kode]/[Urut]/BKPSDM/[Romawi]/[Tahun]
            if (preg_match('/\/(\d+)\/BKPSDM/i', $item->no_surat_keluar, $matches)) {
                $num = (int)$matches[1];
                if ($num > $maxUrut) {
                    $maxUrut = $num;
                    $lastSurat = $item;
                }
            }
        }

        // Jika tidak ada kecocokan regex di atas, cari angka setelah slash pertama
        if ($maxUrut === 0) {
            foreach ($items as $item) {
                $parts = explode('/', $item->no_surat_keluar);
                if (isset($parts[1]) && is_numeric($parts[1])) {
                    $num = (int)$parts[1];
                    if ($num > $maxUrut) {
                        $maxUrut = $num;
                        $lastSurat = $item;
                    }
                }
            }
        }

        $nextUrut = $maxUrut > 0 ? $maxUrut + 1 : 1;
        $bulanSekarang = (int)date('n');
        $tahunSekarang = (int)date('Y');
        $romawi = self::getBulanRomawi($bulanSekarang);

        return [
            'last_number' => $maxUrut,
            'last_surat' => $lastSurat,
            'next_number' => $nextUrut,
            'next_number_formatted' => sprintf("%03d", $nextUrut),
            'template_preview' => "[Kode Klasifikasi]/{$nextUrut}/BKPSDM/{$romawi}/{$tahunSekarang}",
        ];
    }

    /**
     * Ambil nomor urut tertinggi dan estimasi nomor urut Surat Perintah Tugas (SPT) murni (misal 135 -> 136)
     */
    public static function getSuratTugasSequenceInfo(): array
    {
        $maxUrut = 0;
        $lastSpt = null;
        $items = SuratTugas::select('id', 'no_surat_tugas', 'tgl_berangkat', 'maksud_tugas')->get();

        foreach ($items as $item) {
            // Format: 800.1.11.1/[Urut]/BKPSDM
            if (preg_match('/\/(\d+)\/BKPSDM/i', $item->no_surat_tugas, $matches)) {
                $num = (int)$matches[1];
                if ($num > $maxUrut) {
                    $maxUrut = $num;
                    $lastSpt = $item;
                }
            }
        }

        if ($maxUrut === 0) {
            foreach ($items as $item) {
                $parts = explode('/', $item->no_surat_tugas);
                if (isset($parts[1]) && is_numeric($parts[1])) {
                    $num = (int)$parts[1];
                    if ($num > $maxUrut) {
                        $maxUrut = $num;
                        $lastSpt = $item;
                    }
                }
            }
        }

        $nextUrut = $maxUrut > 0 ? $maxUrut + 1 : 1;
        $padded = sprintf("%03d", $nextUrut);

        return [
            'last_number' => $maxUrut,
            'last_spt' => $lastSpt,
            'next_number' => $nextUrut,
            'next_number_formatted' => $padded,
            'full_next_no' => "800.1.11.1/{$padded}/BKPSDM",
        ];
    }
}
