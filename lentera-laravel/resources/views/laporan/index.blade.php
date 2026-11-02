@extends('layouts.app')

@section('title', 'Laporan & Buku Agenda Persuratan')
@section('page_title', 'Buku Agenda & Rekapitulasi')

@section('content')
<div class="card">
    <div class="card-header-flex">
        <div>
            <h3 class="card-title">
                <i class="bi bi-journal-text text-primary"></i> Cetak & Ekspor Buku Agenda Persuratan
            </h3>
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                Cetak format buku register agenda dinas atau ekspor data ke spreadsheet CSV / Excel.
            </p>
        </div>
        <div style="display: flex; gap: 8px;">
            <a href="{{ route('laporan.cetak', ['tipe' => $tipe, 'tgl_awal' => $tglAwal, 'tgl_akhir' => $tglAkhir]) }}" target="_blank" class="btn btn-primary">
                <i class="bi bi-printer"></i> Cetak Buku Agenda
            </a>
            <a href="{{ route('laporan.exportCsv', ['tipe' => $tipe, 'tgl_awal' => $tglAwal, 'tgl_akhir' => $tglAkhir]) }}" class="btn btn-success">
                <i class="bi bi-file-earmark-excel"></i> Ekspor CSV
            </a>
        </div>
    </div>

    <!-- Filter Form -->
    <form action="{{ route('laporan.index') }}" method="GET" style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 22px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="flex: 1; min-width: 180px;">
            <label class="form-label">Jenis Buku Agenda</label>
            <select name="tipe" class="form-select" onchange="this.form.submit()">
                <option value="masuk" {{ $tipe === 'masuk' ? 'selected' : '' }}>Buku Agenda Surat Masuk</option>
                <option value="keluar" {{ $tipe === 'keluar' ? 'selected' : '' }}>Buku Agenda Surat Keluar</option>
                <option value="tugas" {{ $tipe === 'tugas' ? 'selected' : '' }}>Buku Register Surat Tugas (SPT)</option>
            </select>
        </div>

        <div style="flex: 1; min-width: 150px;">
            <label class="form-label">Tanggal Awal</label>
            <input type="date" name="tgl_awal" class="form-control" value="{{ $tglAwal }}">
        </div>

        <div style="flex: 1; min-width: 150px;">
            <label class="form-label">Tanggal Akhir</label>
            <input type="date" name="tgl_akhir" class="form-control" value="{{ $tglAkhir }}">
        </div>

        <div style="align-self: flex-end;">
            <button type="submit" class="btn btn-secondary">
                <i class="bi bi-filter"></i> Tampilkan
            </button>
        </div>
    </form>

    <!-- Table Preview -->
    <div class="table-responsive">
        @if($tipe === 'masuk')
            <table class="table">
                <thead>
                    <tr>
                        <th>No. Agenda</th>
                        <th>No. Surat Pengirim</th>
                        <th>Instansi Pengirim</th>
                        <th>Kode Perbup</th>
                        <th>Perihal Surat</th>
                        <th>Tgl Terima</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($data as $r)
                        <tr>
                            <td><strong>{{ $r->no_agenda }}</strong></td>
                            <td>{{ $r->no_surat_pengirim ?: '-' }}</td>
                            <td><strong>{{ $r->instansi_pengirim }}</strong></td>
                            <td><span class="badge badge-neutral">{{ $r->kode_internal }}</span></td>
                            <td>{{ Str::limit($r->perihal, 50) }}</td>
                            <td>{{ $r->tgl_diterima ? $r->tgl_diterima->format('d/m/Y') : '-' }}</td>
                            <td><span class="badge badge-info">{{ $r->status_disposisi }}</span></td>
                        </tr>
                    @empty
                        <tr><td colspan="7" style="text-align:center; padding: 20px;">Tidak ada data pada periode ini.</td></tr>
                    @endforelse
                </tbody>
            </table>
        @elseif($tipe === 'keluar')
            <table class="table">
                <thead>
                    <tr>
                        <th>No. Agenda</th>
                        <th>Nomor Resmi Surat Keluar</th>
                        <th>Bidang Pembuat</th>
                        <th>Tujuan Surat</th>
                        <th>Perihal</th>
                        <th>Tanggal Surat</th>
                        <th>Penandatangan</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($data as $r)
                        <tr>
                            <td><span class="badge badge-neutral">{{ $r->no_agenda }}</span></td>
                            <td><strong style="color: #1e3a8a;">{{ $r->no_surat_keluar }}</strong></td>
                            <td>{{ $r->bidang_pembuat }}</td>
                            <td>{{ $r->tujuan_surat }}</td>
                            <td>{{ Str::limit($r->perihal, 45) }}</td>
                            <td>{{ $r->tgl_surat ? $r->tgl_surat->format('d/m/Y') : '-' }}</td>
                            <td>{{ $r->penandatangan }}</td>
                        </tr>
                    @empty
                        <tr><td colspan="7" style="text-align:center; padding: 20px;">Tidak ada data pada periode ini.</td></tr>
                    @endforelse
                </tbody>
            </table>
        @else
            <table class="table">
                <thead>
                    <tr>
                        <th>Nomor SPT</th>
                        <th>Bidang Pengusul</th>
                        <th>Maksud Tugas</th>
                        <th>Tempat Tujuan</th>
                        <th>Tgl Berangkat</th>
                        <th>Personil</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($data as $r)
                        <tr>
                            <td><strong style="color: #0d9488;">{{ $r->no_surat_tugas }}</strong></td>
                            <td>{{ $r->bidang_pengusul }}</td>
                            <td>{{ $r->maksud_tugas }}</td>
                            <td>{{ $r->tempat_tujuan }}</td>
                            <td>{{ $r->tgl_berangkat ? $r->tgl_berangkat->format('d/m/Y') : '-' }}</td>
                            <td>{{ $r->personil->count() }} orang</td>
                        </tr>
                    @empty
                        <tr><td colspan="6" style="text-align:center; padding: 20px;">Tidak ada data pada periode ini.</td></tr>
                    @endforelse
                </tbody>
            </table>
        @endif
    </div>
</div>
@endsection
