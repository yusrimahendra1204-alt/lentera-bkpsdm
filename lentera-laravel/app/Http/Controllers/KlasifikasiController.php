<?php

namespace App\Http\Controllers;

use App\Models\KlasifikasiArsip;
use Illuminate\Http\Request;

class KlasifikasiController extends Controller
{
    public function index(Request $request)
    {
        $query = KlasifikasiArsip::query();

        if ($request->filled('search')) {
            $s = trim($request->search);
            $query->where(function ($q) use ($s) {
                $q->where('kode', 'like', "%{$s}%")
                  ->orWhere('nama', 'like', "%{$s}%")
                  ->orWhere('kategori', 'like', "%{$s}%")
                  ->orWhere('keywords', 'like', "%{$s}%");
            });
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        $klasifikasiList = $query->paginate(25)->withQueryString();
        $totalKode = KlasifikasiArsip::count();
        $kategoriList = KlasifikasiArsip::select('kategori')->distinct()->orderBy('kategori')->pluck('kategori');

        return view('klasifikasi.index', compact('klasifikasiList', 'totalKode', 'kategoriList'));
    }

    public function searchApi(Request $request)
    {
        $q = trim($request->query('q', ''));
        if (strlen($q) < 1) {
            return response()->json([]);
        }

        $results = KlasifikasiArsip::where('kode', 'like', "%{$q}%")
            ->orWhere('nama', 'like', "%{$q}%")
            ->orWhere('keywords', 'like', "%{$q}%")
            ->limit(20)
            ->get(['id', 'kode', 'nama', 'kategori']);

        return response()->json($results);
    }
}

