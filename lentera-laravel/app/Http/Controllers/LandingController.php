<?php

namespace App\Http\Controllers;

use App\Models\KlasifikasiArsip;
use App\Models\Pegawai;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\SuratTugas;
use App\Services\NomorSuratService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LandingController extends Controller
{
    public function index()
    {
        if (Auth::check()) {
            return redirect()->route('dashboard');
        }

        $stats = [
            'total_surat_masuk' => SuratMasuk::count(),
            'total_surat_keluar' => SuratKeluar::count(),
            'total_surat_tugas' => SuratTugas::count(),
            'total_klasifikasi' => KlasifikasiArsip::count(),
            'total_pegawai' => Pegawai::where('aktif', 1)->count(),
        ];

        $keluarSeq = NomorSuratService::getSuratKeluarSequenceInfo();
        $tugasSeq = NomorSuratService::getSuratTugasSequenceInfo();

        return view('landing', compact('stats', 'keluarSeq', 'tugasSeq'));
    }
}
