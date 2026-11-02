<?php

namespace App\Http\Controllers;

use App\Models\KlasifikasiArsip;
use App\Models\SuratMasuk;
use App\Services\NomorSuratService;
use Illuminate\Http\Request;

class SuratMasukController extends Controller
{
    public function index(Request $request)
    {
        $query = SuratMasuk::query()->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $s = trim($request->search);
            $query->where(function ($q) use ($s) {
                $q->where('no_agenda', 'like', "%{$s}%")
                  ->orWhere('no_surat_pengirim', 'like', "%{$s}%")
                  ->orWhere('instansi_pengirim', 'like', "%{$s}%")
                  ->orWhere('perihal', 'like', "%{$s}%")
                  ->orWhere('kode_internal', 'like', "%{$s}%");
            });
        }

        if ($request->filled('sifat')) {
            $query->where('sifat_surat', $request->sifat);
        }

        if ($request->filled('status')) {
            $query->where('status_disposisi', $request->status);
        }

        $suratMasukList = $query->paginate(15)->withQueryString();
        $nextAgenda = NomorSuratService::getNextAgendaSuratMasuk();

        return view('surat_masuk.index', compact('suratMasukList', 'nextAgenda'));
    }

    public function create()
    {
        $nextAgenda = NomorSuratService::getNextAgendaSuratMasuk();
        $klasifikasiList = KlasifikasiArsip::orderBy('kode')->limit(100)->get();

        return view('surat_masuk.create', compact('nextAgenda', 'klasifikasiList'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'no_agenda' => 'required|string|unique:surat_masuk,no_agenda',
            'no_surat_pengirim' => 'nullable|string|max:150',
            'instansi_pengirim' => 'required|string|max:200',
            'kode_internal' => 'required|string|max:50',
            'nama_klasifikasi_internal' => 'nullable|string|max:300',
            'perihal' => 'required|string',
            'tgl_surat' => 'required|date',
            'tgl_diterima' => 'required|date',
            'sifat_surat' => 'required|string',
            'lampiran' => 'nullable|string|max:100',
        ]);

        SuratMasuk::create($validated);

        return redirect()->route('surat-masuk.index')
            ->with('success', "Surat Masuk dengan nomor agenda {$validated['no_agenda']} berhasil dicatat!");
    }

    public function show(SuratMasuk $suratMasuk)
    {
        $suratMasuk->load('disposisi.pegawaiTujuan');
        return view('surat_masuk.show', compact('suratMasuk'));
    }

    public function edit(SuratMasuk $suratMasuk)
    {
        return view('surat_masuk.edit', compact('suratMasuk'));
    }

    public function update(Request $request, SuratMasuk $suratMasuk)
    {
        $validated = $request->validate([
            'no_surat_pengirim' => 'nullable|string|max:150',
            'instansi_pengirim' => 'required|string|max:200',
            'kode_internal' => 'required|string|max:50',
            'nama_klasifikasi_internal' => 'nullable|string|max:300',
            'perihal' => 'required|string',
            'tgl_surat' => 'required|date',
            'tgl_diterima' => 'required|date',
            'sifat_surat' => 'required|string',
            'lampiran' => 'nullable|string|max:100',
            'status_disposisi' => 'required|string',
        ]);

        $suratMasuk->update($validated);

        return redirect()->route('surat-masuk.index')
            ->with('success', "Data Surat Masuk {$suratMasuk->no_agenda} berhasil diperbarui!");
    }

    public function destroy(SuratMasuk $suratMasuk)
    {
        $agenda = $suratMasuk->no_agenda;
        $suratMasuk->delete();

        return redirect()->route('surat-masuk.index')
            ->with('success', "Surat Masuk {$agenda} berhasil dihapus dari sistem.");
    }
}

