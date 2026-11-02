<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PegawaiController extends Controller
{
    public function index(Request $request)
    {
        $query = Pegawai::query()->orderBy('id');

        if ($request->filled('search')) {
            $s = trim($request->search);
            $query->where(function ($q) use ($s) {
                $q->where('nama', 'like', "%{$s}%")
                  ->orWhere('nip', 'like', "%{$s}%")
                  ->orWhere('jabatan', 'like', "%{$s}%")
                  ->orWhere('unit', 'like', "%{$s}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $pegawaiList = $query->paginate(15)->withQueryString();
        $totalPegawai = Pegawai::count();

        return view('pegawai.index', compact('pegawaiList', 'totalPegawai'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'required|string|unique:pegawai,nip',
            'nama' => 'required|string|max:150',
            'pangkat' => 'nullable|string|max:100',
            'jabatan' => 'nullable|string|max:150',
            'role' => 'required|string|in:admin,kepala_bkpsdm,sekretaris,kabid,pegawai',
            'unit' => 'nullable|string|max:150',
            'password' => 'nullable|string|min:4',
        ]);

        $validated['password'] = Hash::make($validated['password'] ?? '123456');
        $validated['aktif'] = true;

        Pegawai::create($validated);

        return redirect()->route('pegawai.index')
            ->with('success', "Pegawai {$validated['nama']} berhasil ditambahkan ke sistem.");
    }

    public function update(Request $request, Pegawai $pegawai)
    {
        $validated = $request->validate([
            'nip' => 'required|string|unique:pegawai,nip,' . $pegawai->id,
            'nama' => 'required|string|max:150',
            'pangkat' => 'nullable|string|max:100',
            'jabatan' => 'nullable|string|max:150',
            'role' => 'required|string|in:admin,kepala_bkpsdm,sekretaris,kabid,pegawai',
            'unit' => 'nullable|string|max:150',
            'password' => 'nullable|string|min:4',
            'aktif' => 'nullable|boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $validated['aktif'] = $request->has('aktif');

        $pegawai->update($validated);

        return redirect()->route('pegawai.index')
            ->with('success', "Data Pegawai {$pegawai->nama} berhasil diperbarui.");
    }

    public function toggleAktif(Pegawai $pegawai)
    {
        $pegawai->aktif = !$pegawai->aktif;
        $pegawai->save();

        $status = $pegawai->aktif ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Status pegawai {$pegawai->nama} berhasil {$status}.");
    }
}

