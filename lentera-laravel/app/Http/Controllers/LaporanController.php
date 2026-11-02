<?php

namespace App\Http\Controllers;

use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\SuratTugas;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $tipe = $request->get('tipe', 'masuk'); // masuk, keluar, tugas
        $tglAwal = $request->get('tgl_awal', '2026-01-01');
        $tglAkhir = $request->get('tgl_akhir', date('Y-m-d'));

        $data = [];
        if ($tipe === 'masuk') {
            $data = SuratMasuk::whereBetween('tgl_diterima', [$tglAwal, $tglAkhir])
                ->orderBy('tgl_diterima')
                ->get();
        } elseif ($tipe === 'keluar') {
            $data = SuratKeluar::whereBetween('tgl_surat', [$tglAwal, $tglAkhir])
                ->orderBy('tgl_surat')
                ->get();
        } elseif ($tipe === 'tugas') {
            $data = SuratTugas::with('personil')
                ->whereBetween('tgl_berangkat', [$tglAwal, $tglAkhir])
                ->orderBy('tgl_berangkat')
                ->get();
        }

        return view('laporan.index', compact('data', 'tipe', 'tglAwal', 'tglAkhir'));
    }

    public function cetak(Request $request)
    {
        $tipe = $request->get('tipe', 'masuk');
        $tglAwal = $request->get('tgl_awal', '2026-01-01');
        $tglAkhir = $request->get('tgl_akhir', date('Y-m-d'));

        $data = [];
        if ($tipe === 'masuk') {
            $data = SuratMasuk::whereBetween('tgl_diterima', [$tglAwal, $tglAkhir])->orderBy('tgl_diterima')->get();
        } elseif ($tipe === 'keluar') {
            $data = SuratKeluar::whereBetween('tgl_surat', [$tglAwal, $tglAkhir])->orderBy('tgl_surat')->get();
        } elseif ($tipe === 'tugas') {
            $data = SuratTugas::with('personil')->whereBetween('tgl_berangkat', [$tglAwal, $tglAkhir])->orderBy('tgl_berangkat')->get();
        }

        return view('laporan.cetak', compact('data', 'tipe', 'tglAwal', 'tglAkhir'));
    }

    public function exportCsv(Request $request)
    {
        $tipe = $request->get('tipe', 'masuk');
        $tglAwal = $request->get('tgl_awal', '2026-01-01');
        $tglAkhir = $request->get('tgl_akhir', date('Y-m-d'));

        $filename = "buku_agenda_{$tipe}_{$tglAwal}_sd_{$tglAkhir}.csv";
        $headers = [
            "Content-Type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename={$filename}",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($tipe, $tglAwal, $tglAkhir) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF)); // BOM UTF-8

            if ($tipe === 'masuk') {
                fputcsv($file, ['No Agenda', 'No Surat Pengirim', 'Pengirim', 'Kode Klasifikasi', 'Perihal', 'Tgl Surat', 'Tgl Diterima', 'Sifat', 'Status Disposisi']);
                $records = SuratMasuk::whereBetween('tgl_diterima', [$tglAwal, $tglAkhir])->orderBy('tgl_diterima')->get();
                foreach ($records as $r) {
                    fputcsv($file, [
                        $r->no_agenda,
                        $r->no_surat_pengirim,
                        $r->instansi_pengirim,
                        $r->kode_internal,
                        $r->perihal,
                        $r->tgl_surat ? $r->tgl_surat->format('d/m/Y') : '',
                        $r->tgl_diterima ? $r->tgl_diterima->format('d/m/Y') : '',
                        $r->sifat_surat,
                        $r->status_disposisi,
                    ]);
                }
            } elseif ($tipe === 'keluar') {
                fputcsv($file, ['No Agenda', 'No Surat Keluar', 'Bidang Pembuat', 'Kode Perbup', 'Tujuan', 'Perihal', 'Tgl Surat', 'Sifat', 'Penandatangan']);
                $records = SuratKeluar::whereBetween('tgl_surat', [$tglAwal, $tglAkhir])->orderBy('tgl_surat')->get();
                foreach ($records as $r) {
                    fputcsv($file, [
                        $r->no_agenda,
                        $r->no_surat_keluar,
                        $r->bidang_pembuat,
                        $r->kode_klasifikasi,
                        $r->tujuan_surat,
                        $r->perihal,
                        $r->tgl_surat ? $r->tgl_surat->format('d/m/Y') : '',
                        $r->sifat_surat,
                        $r->penandatangan,
                    ]);
                }
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
