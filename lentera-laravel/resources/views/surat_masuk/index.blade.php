@extends('layouts.app')

@section('title', 'Buku Agenda Surat Masuk BKPSDM')
@section('page_title', 'Buku Agenda Surat Masuk')

@section('content')
<div class="card">
    <div class="card-header-flex">
        <div>
            <h3 class="card-title">
                <i class="bi bi-inbox-fill text-primary"></i> Register Buku Agenda Surat Masuk
            </h3>
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                Pencatatan surat masuk kedinasan BKPSDM Kab. Luwu Timur (Total: {{ $suratMasukList->total() }} surat).
            </p>
        </div>
        <a href="{{ route('surat-masuk.create') }}" class="btn btn-primary">
            <i class="bi bi-plus-circle-fill"></i> Catat Surat Masuk Baru
        </a>
    </div>

    <!-- Filter & Search -->
    <form action="{{ route('surat-masuk.index') }}" method="GET" style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px;">
        <div style="flex: 2; min-width: 240px;">
            <input type="text" name="search" class="form-control" placeholder="Cari No. Agenda / Instansi / Perihal..." value="{{ request('search') }}">
        </div>

        <div style="flex: 1; min-width: 160px;">
            <select name="status" class="form-select">
                <option value="">-- Semua Status --</option>
                <option value="Menunggu Disposisi" {{ request('status') == 'Menunggu Disposisi' ? 'selected' : '' }}>Menunggu Disposisi</option>
                <option value="Didisposisi" {{ request('status') == 'Didisposisi' ? 'selected' : '' }}>Didisposisi</option>
                <option value="Selesai" {{ request('status') == 'Selesai' ? 'selected' : '' }}>Selesai</option>
            </select>
        </div>

        <div style="flex: 1; min-width: 140px;">
            <select name="sifat" class="form-select">
                <option value="">-- Semua Sifat --</option>
                <option value="Biasa" {{ request('sifat') == 'Biasa' ? 'selected' : '' }}>Biasa</option>
                <option value="Penting" {{ request('sifat') == 'Penting' ? 'selected' : '' }}>Penting</option>
                <option value="Rahasia" {{ request('sifat') == 'Rahasia' ? 'selected' : '' }}>Rahasia</option>
            </select>
        </div>

        <div>
            <button type="submit" class="btn btn-secondary">
                <i class="bi bi-search"></i> Filter
            </button>
            <a href="{{ route('surat-masuk.index') }}" class="btn btn-secondary" title="Reset">
                <i class="bi bi-arrow-counterclockwise"></i>
            </a>
        </div>
    </form>

    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 130px;">No. Agenda</th>
                    <th>Instansi Pengirim & No. Surat</th>
                    <th>Perihal Surat</th>
                    <th>Tgl Diterima</th>
                    <th>Sifat</th>
                    <th>Status Disposisi</th>
                    <th style="width: 120px; text-align: center;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($suratMasukList as $sm)
                    <tr>
                        <td>
                            <strong style="color: #1e3a8a;">{{ $sm->no_agenda }}</strong>
                            <div style="font-size: 0.72rem; color: #64748b;">Kode: {{ $sm->kode_internal }}</div>
                        </td>
                        <td>
                            <strong style="color: #0f172a;">{{ $sm->instansi_pengirim }}</strong>
                            <div style="font-size: 0.74rem; color: #64748b;">No: {{ $sm->no_surat_pengirim ?: '-' }}</div>
                        </td>
                        <td>
                            <div>{{ Str::limit($sm->perihal, 55) }}</div>
                        </td>
                        <td style="white-space: nowrap; font-size: 0.8rem;">
                            {{ $sm->tgl_diterima ? $sm->tgl_diterima->format('d/m/Y') : '-' }}
                        </td>
                        <td>
                            @if($sm->sifat_surat === 'Rahasia')
                                <span class="badge badge-danger">Rahasia</span>
                            @elseif($sm->sifat_surat === 'Penting')
                                <span class="badge badge-warning">Penting</span>
                            @else
                                <span class="badge badge-neutral">Biasa</span>
                            @endif
                        </td>
                        <td>
                            @if($sm->status_disposisi === 'Menunggu Disposisi')
                                <span class="badge badge-warning">
                                    <i class="bi bi-clock"></i> Menunggu Disposisi
                                </span>
                            @elseif($sm->status_disposisi === 'Didisposisi')
                                <span class="badge badge-info">
                                    <i class="bi bi-check2"></i> Didisposisi
                                </span>
                            @else
                                <span class="badge badge-success">
                                    <i class="bi bi-check-all"></i> Selesai
                                </span>
                            @endif
                        </td>
                        <td style="text-align: center;">
                            <div style="display: inline-flex; gap: 4px;">
                                <a href="{{ route('disposisi.create', ['surat_id' => $sm->id]) }}" class="btn btn-sm btn-primary" title="Buat Lembar Disposisi">
                                    <i class="bi bi-diagram-3"></i>
                                </a>
                                <a href="{{ route('surat-masuk.show', $sm->id) }}" class="btn btn-sm btn-secondary" title="Detail">
                                    <i class="bi bi-eye"></i>
                                </a>
                                <form action="{{ route('surat-masuk.destroy', $sm->id) }}" method="POST" onsubmit="return confirm('Hapus surat masuk ini?');" style="display:inline;">
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
                            Tidak ada data surat masuk yang cocok.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="pagination-container">
        {{ $suratMasukList->links() }}
    </div>
</div>
@endsection

