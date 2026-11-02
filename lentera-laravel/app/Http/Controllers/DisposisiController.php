<?php

namespace App\Http\Controllers;

use App\Models\Disposisi;
use App\Models\Pegawai;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;

class DisposisiController extends Controller
{
    // 6 Pejabat / Unit Tujuan Resmi Lembar Disposisi BKPSDM Luwu Timur
    public const TUJUAN_RESMI = [
        '1. Sekertaris',
        '2. Kasubag. Umum dan Kepegawaian',
        '3. Kasubag. Perencana dan Keuangan',
        '4. Kabid. Pengembangan Sumber Daya Aparatur',
        '5. Kabid. Mutasi, Kepangkatan dan Pengembangan Karir',
        '6. Kabid. Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian',
    ];

    // Opsi Instruksi Resmi
    public const INSTRUKSI_RESMI = [
        'Tindak lanjuti segera',
        'Pelajari & beri saran / telaahan',
        'Koordinasikan dengan bidang terkait',
        'Siapkan konsep jawaban / surat balasan',
        'Hadiri / wakili pimpinan',
        'Untuk diketahui / pedoman kerja',
        'Arsipkan / simpan',
    ];

    public function index(Request $request)
    {
        $query = Disposisi::with(['suratMasuk', 'pegawaiTujuan'])->orderBy('id', 'desc');

        if ($request->filled('status')) {
            $query->where('status_tindak_lanjut', $request->status);
        }

        if ($request->filled('search')) {
            $s = trim($request->search);
            $query->where(function ($q) use ($s) {
                $q->where('tujuan_nama', 'like', "%{$s}%")
                  ->orWhere('catatan', 'like', "%{$s}%")
                  ->orWhereHas('suratMasuk', function ($sm) use ($s) {
                      $sm->where('no_agenda', 'like', "%{$s}%")
                         ->orWhere('perihal', 'like', "%{$s}%");
                  });
            });
        }

        $disposisiList = $query->paginate(15)->withQueryString();
        $suratMenunggu = SuratMasuk::where('status_disposisi', 'Menunggu Disposisi')->get();

        return view('disposisi.index', compact('disposisiList', 'suratMenunggu'));
    }

    public function create(Request $request)
    {
        $idSurat = $request->query('surat_id');
        $suratMasuk = $idSurat ? SuratMasuk::findOrFail($idSurat) : null;
        $suratList = SuratMasuk::where('status_disposisi', '!=', 'Selesai')->orderBy('id', 'desc')->get();
        $pegawaiList = Pegawai::where('aktif', 1)->orderBy('nama')->get();
        $tujuanResmi = self::TUJUAN_RESMI;
        $instruksiResmi = self::INSTRUKSI_RESMI;

        return view('disposisi.create', compact('suratMasuk', 'suratList', 'pegawaiList', 'tujuanResmi', 'instruksiResmi'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_surat_masuk' => 'required|exists:surat_masuk,id',
            'tujuan_nama' => 'required|string',
            'tujuan_user_id' => 'nullable|exists:pegawai,id',
            'sifat' => 'required|string',
            'instruksi' => 'nullable|array',
            'catatan' => 'nullable|string',
            'batas_waktu' => 'nullable|date',
        ]);

        $validated['dari_user'] = 'PARHA ARIEF, S.AP (Kepala BKPSDM)';
        $validated['status_tindak_lanjut'] = 'Diproses';

        $disposisi = Disposisi::create($validated);

        // Update status surat masuk menjadi Didisposisi
        $surat = SuratMasuk::find($validated['id_surat_masuk']);
        if ($surat && $surat->status_disposisi === 'Menunggu Disposisi') {
            $surat->update(['status_disposisi' => 'Didisposisi']);
        }

        return redirect()->route('disposisi.index')
            ->with('success', "Disposisi untuk surat {$surat->no_agenda} berhasil diterbitkan!");
    }

    public function cetak(Disposisi $disposisi)
    {
        $disposisi->load(['suratMasuk', 'pegawaiTujuan']);
        $tujuanResmi = self::TUJUAN_RESMI;
        $instruksiResmi = self::INSTRUKSI_RESMI;

        return view('disposisi.cetak', compact('disposisi', 'tujuanResmi', 'instruksiResmi'));
    }

    public function updateStatus(Request $request, Disposisi $disposisi)
    {
        $validated = $request->validate([
            'status_tindak_lanjut' => 'required|in:Diproses,Selesai,Ditangguhkan',
            'tindak_lanjut_note' => 'nullable|string',
        ]);

        $disposisi->update($validated);

        if ($validated['status_tindak_lanjut'] === 'Selesai') {
            $disposisi->suratMasuk()->update(['status_disposisi' => 'Selesai']);
        }

        return back()->with('success', 'Status tindak lanjut disposisi berhasil diperbarui.');
    }
}
