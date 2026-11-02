@extends('layouts.app')

@section('title', 'Detail Surat Keluar')
@section('page_title', 'Detail Surat Keluar')

@section('content')
<div style="max-width: 800px; margin: 0 auto;">
    <div class="card">
        <div class="card-header-flex">
            <div>
                <span class="badge badge-neutral" style="margin-bottom: 6px;">{{ $suratKeluar->no_agenda }}</span>
                <h2 style="font-size: 1.25rem; font-weight: 800; color: #1e3a8a;">
                    {{ $suratKeluar->no_surat_keluar }}
                </h2>
            </div>
            <a href="{{ route('surat-keluar.index') }}" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> Kembali
            </a>
        </div>

        <div style="margin-top: 18px; border-top: 1px solid var(--border-color); padding-top: 18px;">
            <table class="table" style="margin-bottom: 0;">
                <tbody>
                    <tr>
                        <td style="width: 200px; font-weight: 600; color: #64748b;">Perihal</td>
                        <td><strong style="color: #0f172a;">{{ $suratKeluar->perihal }}</strong></td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Tujuan Surat</td>
                        <td>{{ $suratKeluar->tujuan_surat }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Bidang Pembuat</td>
                        <td>{{ $suratKeluar->bidang_pembuat }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Kode Klasifikasi</td>
                        <td>
                            <span class="badge badge-info">{{ $suratKeluar->kode_klasifikasi }}</span> 
                            {{ $suratKeluar->nama_klasifikasi }}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Tanggal Surat</td>
                        <td>{{ $suratKeluar->tgl_surat ? $suratKeluar->tgl_surat->format('d F Y') : '-' }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Sifat Surat</td>
                        <td><span class="badge badge-warning">{{ $suratKeluar->sifat_surat }}</span></td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Penandatangan</td>
                        <td><strong>{{ $suratKeluar->penandatangan }}</strong> (Kepala BKPSDM Kab. Luwu Timur)</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Metode Dokumen</td>
                        <td>{{ $suratKeluar->metode_dokumen }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Lokasi Arsip Fisik</td>
                        <td>{{ $suratKeluar->lokasi_arsip_fisik }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
