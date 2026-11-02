<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use App\Models\SuratTugas;
use App\Models\SuratTugasPersonil;
use App\Services\NomorSuratService;
use Illuminate\Http\Request;

class SuratTugasController extends Controller
{
    // 4 Bidang Pengusul Resmi
    public const BIDANG_RESMI = [
        'Bidang Pengadaan, Mutasi dan Informasi Kepegawaian',
        'Bidang Pengembangan Kompetensi dan Penilaian Kinerja Aparatur',
        'Sekretariat / Subbagian Umum dan Kepegawaian',
        'Subbagian Perencanaan dan Keuangan',
    ];

    public function index(Request $request)
    {
        $query = SuratTugas::with('personil')->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $s = trim($request->search);
            $query->where(function ($q) use ($s) {
                $q->where('no_surat_tugas', 'like', "%{$s}%")
                  ->orWhere('maksud_tugas', 'like', "%{$s}%")
                  ->orWhere('tempat_tujuan', 'like', "%{$s}%")
                  ->orWhere('bidang_pengusul', 'like', "%{$s}%")
                  ->orWhereHas('personil', function ($p) use ($s) {
                      $p->where('nama', 'like', "%{$s}%")
                        ->orWhere('nip', 'like', "%{$s}%");
                  });
            });
        }

        if ($request->filled('bidang')) {
            $query->where('bidang_pengusul', $request->bidang);
        }

        $suratTugasList = $query->paginate(15)->withQueryString();
        $seqInfo = NomorSuratService::getSuratTugasSequenceInfo();
        $bidangList = self::BIDANG_RESMI;

        return view('surat_tugas.index', compact('suratTugasList', 'seqInfo', 'bidangList'));
    }

    public function create()
    {
        $seqInfo = NomorSuratService::getSuratTugasSequenceInfo();
        $bidangList = self::BIDANG_RESMI;
        $pegawaiList = Pegawai::where('aktif', 1)->orderBy('nama')->get();

        return view('surat_tugas.create', compact('seqInfo', 'bidangList', 'pegawaiList'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bidang_pengusul' => 'required|string',
            'nomor_urut' => 'required|numeric',
            'maksud_tugas' => 'required|string',
            'tempat_tujuan' => 'required|string|max:300',
            'tgl_berangkat' => 'required|date',
            'tgl_kembali' => 'required|date|after_or_equal:tgl_berangkat',
            'dasar' => 'nullable|string',
            'pembebanan_anggaran' => 'required|string',
            'pejabat_penandatangan' => 'required|string',
            'jabatan_penandatangan' => 'required|string',
            'personil' => 'required|array|min:1',
            'personil.*.pegawai_id' => 'nullable|exists:pegawai,id',
            'personil.*.nama' => 'required|string',
            'personil.*.nip' => 'nullable|string',
            'personil.*.pangkat' => 'nullable|string',
            'personil.*.jabatan' => 'nullable|string',
        ]);

        $noUrut = sprintf("%03d", (int)$validated['nomor_urut']);
        $noSuratTugas = "800.1.11.1/{$noUrut}/BKPSDM";

        // Hitung lama hari
        $d1 = strtotime($validated['tgl_berangkat']);
        $d2 = strtotime($validated['tgl_kembali']);
        $lamaHari = max(1, round(($d2 - $d1) / 86400) + 1);

        $spt = SuratTugas::create([
            'no_surat_tugas' => $noSuratTugas,
            'bidang_pengusul' => $validated['bidang_pengusul'],
            'kode_klasifikasi' => '800.1.11.1',
            'nama_klasifikasi' => 'Surat Perintah Dinas/Surat Tugas',
            'dasar' => $validated['dasar'] ?? "1. DPA-SKPD BKPSDM Kab. Luwu Timur TA 2026\n2. Disposisi Kepala BKPSDM Kab. Luwu Timur",
            'maksud_tugas' => $validated['maksud_tugas'],
            'tempat_tujuan' => $validated['tempat_tujuan'],
            'tgl_berangkat' => $validated['tgl_berangkat'],
            'tgl_kembali' => $validated['tgl_kembali'],
            'lama_hari' => $lamaHari,
            'pembebanan_anggaran' => $validated['pembebanan_anggaran'],
            'pejabat_penandatangan' => $validated['pejabat_penandatangan'],
            'jabatan_penandatangan' => $validated['jabatan_penandatangan'],
            'status_naskah_fisik' => 'Naskah fisik disusun & dicetak manual oleh bidang (Tanda tangan basah manual)',
        ]);

        $urut = 1;
        foreach ($validated['personil'] as $p) {
            SuratTugasPersonil::create([
                'id_surat_tugas' => $spt->id,
                'nip' => $p['nip'] ?? '',
                'nama' => $p['nama'],
                'pangkat' => $p['pangkat'] ?? '',
                'jabatan' => $p['jabatan'] ?? '',
                'urutan' => $urut++,
            ]);
        }

        return redirect()->route('surat-tugas.index')
            ->with('success', "Surat Perintah Tugas {$noSuratTugas} dengan " . count($validated['personil']) . " personil berhasil diterbitkan!");
    }

    public function show(SuratTugas $suratTugas)
    {
        $suratTugas->load('personil');
        return view('surat_tugas.show', compact('suratTugas'));
    }

    public function cetak(SuratTugas $suratTugas)
    {
        $suratTugas->load('personil');
        return view('surat_tugas.cetak', compact('suratTugas'));
    }

    public function destroy(SuratTugas $suratTugas)
    {
        $no = $suratTugas->no_surat_tugas;
        $suratTugas->delete();

        return redirect()->route('surat-tugas.index')
            ->with('success', "Surat Tugas {$no} berhasil dihapus.");
    }
}

