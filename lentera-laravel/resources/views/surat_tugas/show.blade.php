@extends('layouts.app')

@section('title', 'Detail Surat Tugas (SPT)')
@section('page_title', 'Detail Surat Perintah Tugas')

@section('content')
<div style="max-width: 850px; margin: 0 auto;">
    <div class="card">
        <div class="card-header-flex">
            <div>
                <span class="badge badge-info" style="margin-bottom: 6px;">Klasifikasi: {{ $suratTugas->kode_klasifikasi }}</span>
                <h2 style="font-size: 1.25rem; font-weight: 800; color: #0d9488;">
                    {{ $suratTugas->no_surat_tugas }}
                </h2>
            </div>
            <div style="display: flex; gap: 8px;">
                <a href="{{ route('surat-tugas.cetak', $suratTugas->id) }}" target="_blank" class="btn btn-primary">
                    <i class="bi bi-printer"></i> Cetak A4 Resmi
                </a>
                <a href="{{ route('surat-tugas.index') }}" class="btn btn-secondary">
                    <i class="bi bi-arrow-left"></i> Kembali
                </a>
            </div>
        </div>

        <div style="margin-top: 18px; border-top: 1px solid var(--border-color); padding-top: 18px;">
            <table class="table">
                <tbody>
                    <tr>
                        <td style="width: 220px; font-weight: 600; color: #64748b;">Maksud Tugas</td>
                        <td><strong style="color: #0f172a;">{{ $suratTugas->maksud_tugas }}</strong></td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Bidang Pengusul</td>
                        <td>{{ $suratTugas->bidang_pengusul }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Lokasi / Tujuan</td>
                        <td>{{ $suratTugas->tempat_tujuan }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Waktu Pelaksanaan</td>
                        <td>
                            {{ $suratTugas->tgl_berangkat ? $suratTugas->tgl_berangkat->format('d F Y') : '-' }} s.d. 
                            {{ $suratTugas->tgl_kembali ? $suratTugas->tgl_kembali->format('d F Y') : '-' }}
                            <span class="badge badge-neutral" style="margin-left: 8px;">{{ $suratTugas->lama_hari }} Hari</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Dasar Penugasan</td>
                        <td style="white-space: pre-line;">{{ $suratTugas->dasar }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Pembebanan Anggaran</td>
                        <td>{{ $suratTugas->pembebanan_anggaran }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #64748b;">Pejabat Penandatangan</td>
                        <td><strong>{{ $suratTugas->pejabat_penandatangan }}</strong> ({{ $suratTugas->jabatan_penandatangan }})</td>
                    </tr>
                </tbody>
            </table>

            <h4 style="margin: 22px 0 12px; font-size: 0.95rem; font-weight: 700; color: #1e3a8a;">
                <i class="bi bi-people-fill"></i> Personil Aparatur yang Ditugaskan ({{ $suratTugas->personil->count() }} Orang)
            </h4>

            <table class="table">
                <thead>
                    <tr>
                        <th style="width: 40px;">No</th>
                        <th>Nama Aparatur</th>
                        <th>NIP</th>
                        <th>Pangkat / Golongan</th>
                        <th>Jabatan</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($suratTugas->personil as $idx => $p)
                        <tr>
                            <td>{{ $idx + 1 }}</td>
                            <td><strong>{{ $p->nama }}</strong></td>
                            <td>{{ $p->nip ?: '-' }}</td>
                            <td>{{ $p->pangkat ?: '-' }}</td>
                            <td>{{ $p->jabatan ?: '-' }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" style="text-align: center; color: #94a3b8; padding: 16px;">
                                Belum ada personil yang terdaftar secara digital.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
