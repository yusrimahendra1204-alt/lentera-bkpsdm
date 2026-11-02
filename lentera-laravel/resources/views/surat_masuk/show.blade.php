@extends('layouts.app')

@section('title', 'Detail Surat Masuk')
@section('page_title', 'Detail Surat Masuk')

@section('content')
<div style="max-width: 850px; margin: 0 auto;">
    <div class="card">
        <div class="card-header-flex">
            <div>
                <span class="badge badge-info" style="margin-bottom: 6px;">{{ $suratMasuk->no_agenda }}</span>
                <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e3a8a;">
                    {{ $suratMasuk->instansi_pengirim }}
                </h2>
            </div>
            <div style="display: flex; gap: 8px;">
                <a href="{{ route('disposisi.create', ['surat_id' => $suratMasuk->id]) }}" class="btn btn-primary">
                    <i class="bi bi-diagram-3-fill"></i> Buat Disposisi
                </a>
                <a href="{{ route('surat-masuk.index') }}" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Kembali
                </a>
            </div>
        </div>

        <div style="margin-top: 18px; border-top: 1px solid var(--border-color); padding-top: 18px;">
            <table class="table">
                <tbody>
                    <tr>
                        <td style="width: 200px; font-weight: 600; color: #64748b;">Perihal Surat</td>
                        <td><strong style="color: #0f172a;">{{ $suratMasuk->perihal }}</strong></td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Nomor Surat Pengirim</td>
                        <td>{{ $suratMasuk->no_surat_pengirim ?: '-' }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Kode Klasifikasi</td>
                        <td>
                            <span class="badge badge-neutral">{{ $suratMasuk->kode_internal }}</span> 
                            {{ $suratMasuk->nama_klasifikasi_internal }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Tanggal Surat / Diterima</td>
                        <td>
                            Surat: {{ $suratMasuk->tgl_surat ? $suratMasuk->tgl_surat->format('d/m/Y') : '-' }} | 
                            Diterima: {{ $suratMasuk->tgl_diterima ? $suratMasuk->tgl_diterima->format('d/m/Y') : '-' }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Sifat & Lampiran</td>
                        <td>
                            <span class="badge badge-warning">{{ $suratMasuk->sifat_surat }}</span> 
                            <span style="margin-left: 8px;">Lampiran: {{ $suratMasuk->lampiran }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Status Disposisi</td>
                        <td>
                            @if($suratMasuk->status_disposisi === 'Menunggu Disposisi')
                                <span class="badge badge-warning">Menunggu Disposisi</span>
                            @elseif($suratMasuk->status_disposisi === 'Didisposisi')
                                <span class="badge badge-info">Didisposisi</span>
                            @else
                                <span class="badge badge-success">Selesai</span>
                            @endif
                        </td>
                    </tr>
                </tbody>
            </table>

            <h4 style="margin: 22px 0 12px; font-size: 0.95rem; font-weight: 700; color: #1e3a8a;">
                <i class="bi bi-diagram-3-fill"></i> Riwayat Lembar Disposisi Kepala BKPSDM
            </h4>

            @if($suratMasuk->disposisi->count() > 0)
                <table class="table">
                    <thead>
                        <tr>
                            <th>Tujuan Disposisi</th>
                            <th>Instruksi & Catatan</th>
                            <th>Sifat / Batas Waktu</th>
                            <th>Status Tindak Lanjut</th>
                            <th>Cetak</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($suratMasuk->disposisi as $d)
                            <tr>
                                <td>
                                    <strong>{{ $d->tujuan_nama }}</strong>
                                    <div style="font-size: 0.72rem; color: #64748b;">Dari: {{ $d->dari_user }}</div>
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
                                    <div style="font-size: 0.72rem; color: #64748b;">{{ $d->batas_waktu ? $d->batas_waktu->format('d/m/Y') : '-' }}</div>
                                </td>
                                <td>
                                    <span class="badge badge-info">{{ $d->status_tindak_lanjut }}</span>
                                </td>
                                <td>
                                    <a href="{{ route('disposisi.cetak', $d->id) }}" target="_blank" class="btn btn-sm btn-secondary">
                                        <i class="bi bi-printer"></i> Blanko A4
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <div style="padding: 16px; background: #f8fafc; border-radius: 8px; text-align: center; color: #64748b; font-size: 0.82rem;">
                    Surat masuk ini belum memiliki lembar disposisi. 
                    <a href="{{ route('disposisi.create', ['surat_id' => $suratMasuk->id]) }}" style="color: #2563eb; font-weight: 600;">Klik di sini untuk membuat disposisi baru.</a>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
