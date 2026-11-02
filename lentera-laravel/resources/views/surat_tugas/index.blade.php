@extends('layouts.app')

@section('title', 'Buku Register Surat Perintah Tugas (SPT)')
@section('page_title', 'Surat Perintah Tugas (SPT Dinas)')

@section('content')
<!-- PAPAN INFORMASI SPT -->
<div class="banner-anti-ganda" style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); border-color: #99f6e4;">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="bi bi-briefcase-fill" style="color: #0d9488; font-size: 1.25rem;"></i>
                <h3 style="font-size: 1rem; font-weight: 800; color: #115e59;">
                    PAPAN INFORMASI PENOMORAN SURAT PERINTAH TUGAS (SPT DINAS)
                </h3>
            </div>
            <p style="font-size: 0.8rem; color: #0f766e; margin-top: 4px;">
                Klasifikasi Resmi Perbup No. 69/2023 Kode <strong>800.1.11.1</strong> (Surat Perintah Dinas/Surat Tugas).
            </p>
        </div>
        <a href="{{ route('surat-tugas.create') }}" class="btn btn-success" style="background: #0d9488;">
            <i class="bi bi-plus-circle-fill"></i> Buat Surat Tugas Baru
        </a>
    </div>

    <div class="board-cards" style="margin-top: 14px;">
        <div class="board-card">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">NOMOR SPT TERAKHIR:</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #115e59; margin: 4px 0;">
                {{ $seqInfo['last_spt']->no_surat_tugas ?? '800.1.11.1/135/BKPSDM' }}
            </div>
            <div style="font-size: 0.75rem; color: #64748b;">
                Terkait: {{ $seqInfo['last_spt']->maksud_tugas ?? 'Tugas Kedinasan Aparatur' }}
            </div>
        </div>

        <div class="board-card secondary-board">
            <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">ESTIMASI NOMOR URUT BERIKUTNYA:</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0d9488; margin: 4px 0;">
                800.1.11.1/<strong>{{ $seqInfo['next_number_formatted'] }}</strong>/BKPSDM
            </div>
            <div style="font-size: 0.75rem; color: #0f766e; font-weight: 600;">
                <i class="bi bi-check-circle"></i> Terhitung Murni N+1 (Nomor Urut: {{ $seqInfo['next_number'] }})
            </div>
        </div>
    </div>
</div>

<!-- Table Card -->
<div class="card">
    <div class="card-header-flex">
        <h3 class="card-title">
            <i class="bi bi-file-earmark-person-fill text-primary"></i> Daftar Surat Perintah Tugas Terdaftar (Total: {{ $suratTugasList->total() }})
        </h3>
        <form action="{{ route('surat-tugas.index') }}" method="GET" style="display: flex; gap: 8px;">
            <input type="text" name="search" class="form-control" placeholder="Cari nomor / personil / maksud..." value="{{ request('search') }}" style="width: 250px;">
            <button type="submit" class="btn btn-primary btn-sm"><i class="bi bi-search"></i></button>
        </form>
    </div>

    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th>Nomor SPT</th>
                    <th>Bidang Pengusul</th>
                    <th>Maksud Tugas / Keperluan</th>
                    <th>Personil Ditugaskan</th>
                    <th>Tanggal & Lokasi</th>
                    <th style="width: 120px; text-align: center;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($suratTugasList as $st)
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <strong style="color: #0d9488; font-size: 0.9rem; font-family: monospace;">{{ $st->no_surat_tugas }}</strong>
                                <button type="button" class="btn btn-sm btn-secondary" style="padding: 2px 6px; font-size: 0.7rem;" onclick="copyNoSpt('{{ $st->no_surat_tugas }}', this)" title="Salin nomor SPT">
                                    <i class="bi bi-clipboard"></i> Salin
                                </button>
                            </div>
                            <div style="font-size: 0.72rem; color: #64748b; margin-top: 2px;">Kode: {{ $st->kode_klasifikasi }}</div>
                        </td>
                        <td>
                            <span style="font-size: 0.78rem; color: #334155;">{{ $st->bidang_pengusul }}</span>
                        </td>
                        <td>
                            <div style="font-weight: 600; color: #0f172a;">{{ $st->maksud_tugas }}</div>
                            <div style="font-size: 0.75rem; color: #64748b;"><i class="bi bi-geo-alt"></i> {{ $st->tempat_tujuan }} ({{ $st->lama_hari }} Hari)</div>
                        </td>
                        <td>
                            @if($st->personil->count() > 0)
                                <div style="font-size: 0.78rem;">
                                    <strong>{{ $st->personil->first()->nama }}</strong>
                                    @if($st->personil->count() > 1)
                                        <span class="badge badge-info">+{{ $st->personil->count() - 1 }} Personil</span>
                                    @endif
                                </div>
                            @else
                                <span style="font-size: 0.75rem; color: #94a3b8;">Personil terdaftar di draf fisik</span>
                            @endif
                        </td>
                        <td style="white-space: nowrap; font-size: 0.78rem;">
                            {{ $st->tgl_berangkat ? $st->tgl_berangkat->format('d/m/Y') : '-' }} s.d. 
                            {{ $st->tgl_kembali ? $st->tgl_kembali->format('d/m/Y') : '-' }}
                        </td>
                        <td style="text-align: center;">
                            <div style="display: inline-flex; gap: 4px;">
                                <a href="{{ route('surat-tugas.cetak', $st->id) }}" target="_blank" class="btn btn-sm btn-secondary" title="Cetak Format Resmi A4">
                                    <i class="bi bi-printer"></i>
                                </a>
                                <a href="{{ route('surat-tugas.show', $st->id) }}" class="btn btn-sm btn-secondary" title="Detail">
                                    <i class="bi bi-eye"></i>
                                </a>
                                <form action="{{ route('surat-tugas.destroy', $st->id) }}" method="POST" onsubmit="return confirm('Hapus SPT ini?');" style="display:inline;">
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
                        <td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">
                            Tidak ada data Surat Perintah Tugas yang cocok.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="pagination-container">
        {{ $suratTugasList->links() }}
    </div>
</div>

<script>
    function copyNoSpt(text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="bi bi-check-lg text-success"></i> Disalin!';
            btn.classList.add('btn-success');
            btn.classList.remove('btn-secondary');
            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-secondary');
            }, 2000);
        });
    }
</script>
@endsection

