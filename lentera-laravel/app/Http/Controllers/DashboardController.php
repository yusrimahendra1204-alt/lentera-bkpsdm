<?php

namespace App\Http\Controllers;

use App\Models\Disposisi;
use App\Models\Pegawai;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\SuratTugas;
use App\Services\NomorSuratService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_surat_masuk' => SuratMasuk::count(),
            'menunggu_disposisi' => SuratMasuk::where('status_disposisi', 'Menunggu Disposisi')->count(),
            'didisposisi' => SuratMasuk::where('status_disposisi', 'Didisposisi')->count(),
            'selesai' => SuratMasuk::where('status_disposisi', 'Selesai')->count(),
            'total_surat_keluar' => SuratKeluar::count(),
            'total_surat_tugas' => SuratTugas::count(),
            'total_pegawai' => Pegawai::where('aktif', 1)->count(),
            'total_disposisi' => Disposisi::count(),
        ];

        $keluarSeq = NomorSuratService::getSuratKeluarSequenceInfo();
        $tugasSeq = NomorSuratService::getSuratTugasSequenceInfo();

        $latestSuratMasuk = SuratMasuk::orderBy('id', 'desc')->take(5)->get();
        $latestSuratKeluar = SuratKeluar::orderBy('id', 'desc')->take(5)->get();
        $latestSuratTugas = SuratTugas::orderBy('id', 'desc')->take(5)->get();

        return view('dashboard', compact('stats', 'keluarSeq', 'tugasSeq', 'latestSuratMasuk', 'latestSuratKeluar', 'latestSuratTugas'));
    }
}
