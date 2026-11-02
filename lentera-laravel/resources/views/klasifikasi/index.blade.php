@extends('layouts.app')

@section('title', 'Klasifikasi Arsip Perbup Luwu Timur No. 69/2023')
@section('page_title', 'Klasifikasi Arsip (Perbup No. 69/2023)')

@section('content')
<div class="card">
    <div class="card-header-flex">
        <div>
            <h3 class="card-title">
                <i class="bi bi-bookmarks-fill text-primary"></i> Master Kode Klasifikasi Arsip
            </h3>
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                Memuat lengkap <strong>{{ number_format($totalKode) }} Kode Klasifikasi</strong> sesuai Lampiran Resmi Perbup Luwu Timur No. 69 Tahun 2023.
            </p>
        </div>
        <span class="badge-perbup">
            <i class="bi bi-shield-check"></i> Kode Baku Resmi
        </span>
    </div>

    <!-- Filter & Search -->
    <form action="{{ route('klasifikasi.index') }}" method="GET" style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
        <div style="flex: 2; min-width: 250px;">
            <input type="text" name="search" class="form-control" placeholder="Ketik kode (misal: 800, 800.1.3.3) atau kata kunci..." value="{{ request('search') }}">
        </div>

        <div style="flex: 1; min-width: 180px;">
            <select name="kategori" class="form-select">
                <option value="">-- Semua Kategori Utama --</option>
                @foreach($kategoriList as $kat)
                    <option value="{{ $kat }}" {{ request('kategori') == $kat ? 'selected' : '' }}>Kategori {{ $kat }}</option>
                @endforeach
            </select>
        </div>

        <div>
            <button type="submit" class="btn btn-primary">
                <i class="bi bi-search"></i> Cari Kode
            </button>
            <a href="{{ route('klasifikasi.index') }}" class="btn btn-secondary" title="Reset">
                <i class="bi bi-arrow-counterclockwise"></i>
            </a>
        </div>
    </form>

    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 140px;">Kode Klasifikasi</th>
                    <th>Nama & Uraian Naskah / Arsip</th>
                    <th style="width: 120px;">Kategori</th>
                    <th>Kata Kunci Terkait</th>
                    <th style="width: 130px; text-align: center;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($klasifikasiList as $k)
                    <tr>
                        <td>
                            <strong style="color: #1e3a8a; font-size: 0.92rem; font-family: monospace;">{{ $k->kode }}</strong>
                        </td>
                        <td>
                            <div style="font-weight: 600; color: #0f172a;">{{ $k->nama }}</div>
                        </td>
                        <td>
                            <span class="badge badge-neutral">{{ $k->kategori }}</span>
                        </td>
                        <td>
                            <span style="font-size: 0.76rem; color: #64748b;">{{ $k->keywords ?: '-' }}</span>
                        </td>
                        <td style="text-align: center;">
                            <a href="{{ route('surat-keluar.create', ['kode' => $k->kode, 'nama' => $k->nama]) }}" class="btn btn-sm btn-outline-primary" style="font-size: 0.76rem; padding: 4px 10px;" title="Gunakan kode ini untuk menerbitkan surat keluar baru">
                                <i class="bi bi-pencil-square"></i> Pakai Kode
                            </a>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 30px; color: #94a3b8;">
                            Kode klasifikasi tidak ditemukan.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="pagination-container">
        {{ $klasifikasiList->links() }}
    </div>
</div>
@endsection

