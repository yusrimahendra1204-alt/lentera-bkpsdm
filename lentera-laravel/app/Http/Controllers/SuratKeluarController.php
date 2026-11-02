<?php

namespace App\Http\Controllers;

use App\Models\KlasifikasiArsip;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Services\NomorSuratService;
use Illuminate\Http\Request;

class SuratKeluarController extends Controller
{
    // 4 Bidang / Unit Kerja Resmi BKPSDM Luwu Timur
    public const BIDANG_RESMI = [
        'Bidang Pengadaan, Mutasi dan Informasi Kepegawaian',
        'Bidang Pengembangan Kompetensi dan Penilaian Kinerja Aparatur',
        'Sekretariat / Subbagian Umum dan Kepegawaian',
        'Subbagian Perencanaan dan Keuangan',
    ];

    public function index(Request $request)
    {
        $query = SuratKeluar::query()->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $s = trim($request->search);
            $query->where(function ($q) use ($s) {
                $q->where('no_agenda', 'like', "%{$s}%")
                  ->orWhere('no_surat_keluar', 'like', "%{$s}%")
                  ->orWhere('tujuan_surat', 'like', "%{$s}%")
                  ->orWhere('perihal', 'like', "%{$s}%")
                  ->orWhere('kode_klasifikasi', 'like', "%{$s}%");
            });
        }

        if ($request->filled('bidang')) {
            $query->where('bidang_pembuat', $request->bidang);
        }

        if ($request->filled('sifat')) {
            $query->where('sifat_surat', $request->sifat);
        }

        $suratKeluarList = $query->paginate(15)->withQueryString();
        $seqInfo = NomorSuratService::getSuratKeluarSequenceInfo();
        $bidangList = self::BIDANG_RESMI;

        return view('surat_keluar.index', compact('suratKeluarList', 'seqInfo', 'bidangList'));
    }

    public function create(?Request $request = null)
    {
        $seqInfo = NomorSuratService::getSuratKeluarSequenceInfo();
        $nextAgenda = NomorSuratService::getNextAgendaSuratKeluar();
        $bidangList = self::BIDANG_RESMI;
        $suratMasukList = SuratMasuk::orderBy('id', 'desc')->take(50)->get();

        // Default kode umum kepegawaian
        $defaultKode = '800.1.3.3';

        return view('surat_keluar.create', compact('seqInfo', 'nextAgenda', 'bidangList', 'suratMasukList', 'defaultKode'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_agenda' => 'required|string|unique:surat_keluar,no_agenda',
            'bidang_pembuat' => 'required|string',
            'kode_klasifikasi' => 'required|string',
            'nama_klasifikasi' => 'nullable|string',
            'nomor_urut' => 'required|numeric',
            'tujuan_surat' => 'required|string',
            'perihal' => 'required|string',
            'tgl_surat' => 'required|date',
            'sifat_surat' => 'required|string',
            'penandatangan' => 'required|string',
            'metode_dokumen' => 'required|string',
            'lokasi_arsip_fisik' => 'nullable|string',
            'is_surat_balasan' => 'nullable|boolean',
            'id_surat_masuk_asal' => 'nullable|exists:surat_masuk,id',
        ]);

        $tgl = strtotime($validated['tgl_surat']);
        $bulan = (int)date('n', $tgl);
        $tahun = (int)date('Y', $tgl);
        $romawi = NomorSuratService::getBulanRomawi($bulan);
        $noUrut = (int)$validated['nomor_urut'];

        // Format Resmi Pemkab Luwu Timur: [Kode Klasifikasi]/[Nomor Urut]/BKPSDM/[Romawi Bulan]/[Tahun]
        $noSuratKeluar = sprintf("%s/%d/BKPSDM/%s/%d", $validated['kode_klasifikasi'], $noUrut, $romawi, $tahun);

        $data = [
            'no_agenda' => $validated['no_agenda'],
            'bidang_pembuat' => $validated['bidang_pembuat'],
            'kode_klasifikasi' => $validated['kode_klasifikasi'],
            'nama_klasifikasi' => $validated['nama_klasifikasi'] ?? 'Umum',
            'no_surat_keluar' => $noSuratKeluar,
            'tujuan_surat' => $validated['tujuan_surat'],
            'perihal' => $validated['perihal'],
            'tgl_surat' => $validated['tgl_surat'],
            'sifat_surat' => $validated['sifat_surat'],
            'penandatangan' => $validated['penandatangan'],
            'metode_dokumen' => $validated['metode_dokumen'],
            'lokasi_arsip_fisik' => $validated['lokasi_arsip_fisik'] ?? 'Lemari Arsip Subbag Umum',
            'is_surat_balasan' => $request->boolean('is_surat_balasan'),
            'id_surat_masuk_asal' => $validated['id_surat_masuk_asal'] ?? null,
            'file_name' => 'surat_keluar.pdf',
        ];

        SuratKeluar::create($data);

        return redirect()->route('surat-keluar.index')
            ->with('success', "Nomor Surat Keluar {$noSuratKeluar} berhasil diterbitkan dan terdaftar di Buku Agenda!");
    }

    public function show(SuratKeluar $suratKeluar)
    {
        return view('surat_keluar.show', compact('suratKeluar'));
    }

    public function edit(SuratKeluar $suratKeluar)
    {
        $bidangList = self::BIDANG_RESMI;
        return view('surat_keluar.edit', compact('suratKeluar', 'bidangList'));
    }

    public function update(Request $request, SuratKeluar $suratKeluar)
    {
        $validated = $request->validate([
            'bidang_pembuat' => 'required|string',
            'kode_klasifikasi' => 'required|string',
            'nama_klasifikasi' => 'nullable|string',
            'tujuan_surat' => 'required|string',
            'perihal' => 'required|string',
            'tgl_surat' => 'required|date',
            'sifat_surat' => 'required|string',
            'penandatangan' => 'required|string',
            'metode_dokumen' => 'required|string',
            'lokasi_arsip_fisik' => 'nullable|string',
        ]);

        $suratKeluar->update($validated);

        return redirect()->route('surat-keluar.index')
            ->with('success', "Data Surat Keluar {$suratKeluar->no_surat_keluar} berhasil diperbarui.");
    }

    public function destroy(SuratKeluar $suratKeluar)
    {
        $no = $suratKeluar->no_surat_keluar;
        $suratKeluar->delete();

        return redirect()->route('surat-keluar.index')
            ->with('success', "Surat Keluar {$no} berhasil dihapus.");
    }
}

