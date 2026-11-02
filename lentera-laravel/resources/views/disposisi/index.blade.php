@extends('layouts.app')

@section('title', 'Buku Kendali Lembar Disposisi')
@section('page_title', 'Buku Kendali Disposisi Pimpinan')

@section('content')
<div class="card">
    <div class="card-header-flex">
        <div>
            <h3 class="card-title">
                <i class="bi bi-diagram-3-fill text-primary"></i> Kendali Disposisi Kepala BKPSDM
            </h3>
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                Alur distribusi instruksi disposisi dari <strong>PARHA ARIEF, S.AP (Kepala BKPSDM)</strong> kepada pejabat struktural.
            </p>
        </div>
        <a href="{{ route('disposisi.create') }}" class="btn btn-primary">
            <i class="bi bi-plus-circle-fill"></i> Terbitkan Lembar Disposisi Baru
        </a>
    </div>

    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th>Surat Masuk Terkait</th>
                    <th>Tujuan Disposisi (Pejabat)</th>
                    <th>Instruksi / Catatan Pimpinan</th>
                    <th>Sifat / Batas Waktu</th>
                    <th>Status Tindak Lanjut</th>
                    <th style="width: 140px; text-align: center;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($disposisiList as $d)
                    <tr>
                        <td>
                            <strong style="color: #1e3a8a;">{{ $d->suratMasuk->no_agenda ?? '-' }}</strong>
                            <div style="font-size: 0.74rem; color: #334155;">{{ Str::limit($d->suratMasuk->perihal ?? '', 40) }}</div>
                            <div style="font-size: 0.7rem; color: #64748b;">Pengirim: {{ $d->suratMasuk->instansi_pengirim ?? '-' }}</div>
                        </td>
                        <td>
                            <strong style="color: #0f172a;">{{ $d->tujuan_nama }}</strong>
                            <div style="font-size: 0.72rem; color: #64748b;">Oleh: {{ $d->dari_user }}</div>
                        </td>
                        <td>
                            <div style="font-size: 0.8rem;">{{ $d->catatan ?: '-' }}</div>
                            @if(!empty($d->instruksi) && is_array($d->instruksi))
                                <div style="margin-top: 4px;">
                                    @foreach($d->instruksi as $ins)
                                        <span class="badge badge-neutral" style="margin-right: 2px;">{{ $ins }}</span>
                                    @endforeach
                                </div>
                            @endif
                        </td>
                        <td>
                            <span class="badge badge-warning">{{ $d->sifat }}</span>
                            <div style="font-size: 0.72rem; color: #64748b;">Batas: {{ $d->batas_waktu ? $d->batas_waktu->format('d/m/Y') : '-' }}</div>
                        </td>
                        <td>
                            @if($d->status_tindak_lanjut === 'Selesai')
                                <span class="badge badge-success"><i class="bi bi-check-all"></i> Selesai</span>
                            @else
                                <span class="badge badge-info"><i class="bi bi-hourglass-split"></i> Diproses</span>
                            @endif
                        </td>
                        <td style="text-align: center;">
                            <div style="display: inline-flex; gap: 4px;">
                                <a href="{{ route('disposisi.cetak', $d->id) }}" target="_blank" class="btn btn-sm btn-secondary" title="Cetak Blanko Lembar Disposisi A4">
                                    <i class="bi bi-printer"></i>
                                </a>
                                @if($d->status_tindak_lanjut !== 'Selesai')
                                    <form action="{{ route('disposisi.updateStatus', $d->id) }}" method="POST" style="display:inline;">
                                        @csrf
                                        @method('PUT')
                                        <input type="hidden" name="status_tindak_lanjut" value="Selesai">
                                        <button type="submit" class="btn btn-sm btn-success" title="Tandai Selesai">
                                            <i class="bi bi-check2"></i>
                                        </button>
                                    </form>
                                @endif
                            </div>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">
                            Belum ada lembar disposisi yang diterbitkan.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="pagination-container">
        {{ $disposisiList->links() }}
    </div>
</div>
@endsection

