@extends('layouts.app')

@section('title', 'Buku Agenda Surat Keluar BKPSDM')
@section('page_title', 'Buku Agenda & Penomoran Surat Keluar')

@section('content')
<!-- PAPAN INFORMASI PENOMORAN RESMI (ANTI NOMOR GANDA) -->
<div class="banner-anti-ganda">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="bi bi-shield-check" style="color: #059669; font-size: 1.25rem;"></i>
                <h3 style="font-size: 1rem; font-weight: 800; color: #065f46;">
                    PAPAN INFORMASI PENOMORAN SURAT KELUAR (ANTI NOMOR GANDA)
                </h3>
            </div>
            <p style="font-size: 0.8rem; color: #047857; margin-top: 4px;">
                Penomoran resmi terpusat berbasis Kode Klasifikasi Perbup Luwu Timur No. 69 Tahun 2023.
            </p>
        </div>
        <a href="{{ route('surat-keluar.create') }}" class="btn btn-success">
            <i class="bi bi-plus-circle-fill"></i> Terbitkan Nomor Surat Baru
        </a>
    </div>

    <div class="board-cards" style="margin-top: 14px;">
        <div class="board-card">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">NOMOR TERAKHIR TERBIT:</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #065f46; margin: 4px 0;">
                {{ $seqInfo['last_surat']->no_surat_keluar ?? '800.1.3.3/841/BKPSDM/X/2026' }}
            </div>
            <div style="font-size: 0.75rem; color: #64748b;">
                <i class="bi bi-calendar-event"></i> Tanggal Surat: {{ $seqInfo['last_surat'] && $seqInfo['last_surat']->tgl_surat ? $seqInfo['last_surat']->tgl_surat->format('d F Y') : '14 Oktober 2026' }}
            </div>
        </div>

        <div class="board-card secondary-board">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">ESTIMASI URUT BERIKUTNYA:</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #2563eb; margin: 4px 0;">
                [Kode Klasifikasi]/<strong>{{ $seqInfo['next_number'] }}</strong>/BKPSDM/{{ NomorSuratService::getBulanRomawi((int)date('n')) }}/{{ date('Y') }}
            </div>
            <div style="font-size: 0.75rem; color: #059669; font-weight: 600;">
                <i class="bi bi-check-circle"></i> Siap Digunakan untuk Registrasi Naskah
            </div>
        </div>
    </div>
</div>

<!-- Filter & Search Card -->
<div class="card">
    <form action="{{ route('surat-keluar.index') }}" method="GET" style="display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-end;">
        <div style="flex: 2; min-width: 250px;">
            <label class="form-label">Pencarian Nomor / Perihal / Tujuan</label>
            <input type="text" name="search" class="form-control" placeholder="Ketik kata kunci..." value="{{ request('search') }}">
        </div>

        <div style="flex: 1; min-width: 200px;">
            <label class="form-label">Bidang Pembuat</label>
            <select name="bidang" class="form-select">
                <option value="">-- Semua Bidang --</option>
                @foreach($bidangList as $b)
                    <option value="{{ $b }}" {{ request('bidang') == $b ? 'selected' : '' }}>{{ $b }}</option>
                @endforeach
            </select>
        </div>

        <div style="flex: 1; min-width: 140px;">
            <label class="form-label">Sifat Surat</label>
            <select name="sifat" class="form-select">
                <option value="">-- Semua Sifat --</option>
                <option value="Biasa" {{ request('sifat') == 'Biasa' ? 'selected' : '' }}>Biasa</option>
                <option value="Penting" {{ request('sifat') == 'Penting' ? 'selected' : '' }}>Penting</option>
                <option value="Rahasia" {{ request('sifat') == 'Rahasia' ? 'selected' : '' }}>Rahasia</option>
            </select>
        </div>

        <div>
            <button type="submit" class="btn btn-primary">
                <i class="bi bi-search"></i> Cari
            </button>
            <a href="{{ route('surat-keluar.index') }}" class="btn btn-secondary" title="Reset filter">
                <i class="bi bi-arrow-counterclockwise"></i>
            </a>
        </div>
    </form>
</div>

<!-- Table Card -->
<div class="card">
    <div class="card-header-flex">
        <h3 class="card-title">
            <i class="bi bi-journal-check text-primary"></i> Data Register Surat Keluar (Total: {{ $suratKeluarList->total() }})
        </h3>
    </div>

    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 130px;">No. Agenda</th>
                    <th>Nomor Resmi Surat Keluar</th>
                    <th>Bidang Pembuat</th>
                    <th>Tujuan & Perihal</th>
                    <th>Tanggal</th>
                    <th>Penandatangan</th>
                    <th style="width: 100px; text-align: center;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($suratKeluarList as $sk)
                    <tr>
                        <td>
                            <span class="badge badge-neutral">{{ $sk->no_agenda }}</span>
                        </td>
                        <td>
                            <strong style="color: #1e3a8a; font-size: 0.9rem;">{{ $sk->no_surat_keluar }}</strong>
                            <div style="font-size: 0.72rem; color: #64748b;">Kode: {{ $sk->kode_klasifikasi }} ({{ Str::limit($sk->nama_klasifikasi, 25) }})</div>
                        </td>
                        <td>
                            <span style="font-size: 0.78rem; color: #334155;">{{ $sk->bidang_pembuat }}</span>
                        </td>
                        <td>
                            <div style="font-weight: 600; color: #0f172a;">{{ $sk->perihal }}</div>
                            <div style="font-size: 0.75rem; color: #0d9488;">Kepada: {{ $sk->tujuan_surat }}</div>
                        </td>
                        <td style="white-space: nowrap;">
                            {{ $sk->tgl_surat ? $sk->tgl_surat->format('d/m/Y') : '-' }}
                        </td>
                        <td>
                            <span style="font-size: 0.75rem; font-weight: 600; color: #475569;">{{ $sk->penandatangan }}</span>
                        </td>
                        <td style="text-align: center;">
                            <div style="display: inline-flex; gap: 4px;">
                                <a href="{{ route('surat-keluar.show', $sk->id) }}" class="btn btn-sm btn-secondary" title="Detail">
                                    <i class="bi bi-eye"></i>
                                </a>
                                <form action="{{ route('surat-keluar.destroy', $sk->id) }}" method="POST" onsubmit="return confirm('Hapus surat keluar ini?');" style="display:inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger" title="Hapus">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 30px; color: #94a3b8;">
                            <i class="bi bi-inbox" style="font-size: 2rem; display: block; margin-bottom: 8px;"></i>
                            Tidak ada data surat keluar yang cocok dengan kriteria pencarian.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="pagination-container">
        {{ $suratKeluarList->links() }}
    </div>
</div>
@endsection
