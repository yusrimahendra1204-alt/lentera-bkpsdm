@extends('layouts.app')

@section('title', 'Dashboard Persuratan BKPSDM')
@section('page_title', 'Dashboard Utama')

@section('content')
<!-- Hero Welcome -->
<div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f766e 100%); color: #ffffff; border-radius: 14px; padding: 24px 28px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.15);">
    <div>
        <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 6px;">
            LENTERA BKPSDM KABUPATEN LUWU TIMUR
        </h2>
        <p style="font-size: 0.88rem; opacity: 0.9; max-width: 650px;">
            Sistem Informasi Penomoran Digital & Tata Naskah Dinas Terpadu Berdasarkan 
            <strong>Perbup Luwu Timur No. 69 Tahun 2023</strong>.
        </p>
    </div>
    <div style="display: flex; gap: 10px;">
        <a href="{{ route('surat-keluar.create') }}" class="btn" style="background: #ffffff; color: #1e3a8a; font-weight: 700;">
            <i class="bi bi-plus-circle-fill"></i> Terbitkan No. Surat
        </a>
        <a href="{{ route('surat-tugas.create') }}" class="btn" style="background: rgba(255,255,255,0.2); color: #ffffff; border: 1px solid rgba(255,255,255,0.4);">
            <i class="bi bi-file-earmark-person-fill"></i> Buat SPT
        </a>
    </div>
</div>

<!-- PAPAN INFORMASI PENOMORAN (ANTI NOMOR GANDA) -->
<div class="banner-anti-ganda">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <i class="bi bi-clipboard2-check-fill" style="color: #059669; font-size: 1.25rem;"></i>
        <h3 style="font-size: 0.95rem; font-weight: 800; color: #065f46; letter-spacing: 0.02em;">
            PAPAN INFORMASI PENOMORAN RESMI (ANTI NOMOR GANDA)
        </h3>
    </div>
    <p style="font-size: 0.8rem; color: #047857; margin-bottom: 12px;">
        Rekan kantor yang sedang menyusun draf di Microsoft Word dapat memantau nomor surat terakhir yang resmi terdaftar.
    </p>

    <div class="board-cards">
        <!-- Surat Keluar Board -->
        <div class="board-card">
            <div style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">
                <i class="bi bi-send"></i> Surat Keluar Biasa / Dinas
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div>
                    <div style="font-size: 0.75rem; color: #64748b;">Nomor Terakhir Terbit:</div>
                    <div style="font-size: 0.95rem; font-weight: 800; color: #065f46;">
                        {{ $keluarSeq['last_surat']->no_surat_keluar ?? '800.1.3.3/841/BKPSDM/X/2026' }}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.75rem; color: #64748b;">Estimasi Urut Berikutnya:</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #2563eb;">
                        {{ $keluarSeq['next_number'] }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Surat Tugas Board -->
        <div class="board-card secondary-board">
            <div style="font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">
                <i class="bi bi-briefcase"></i> Surat Perintah Tugas (SPT Dinas)
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div>
                    <div style="font-size: 0.75rem; color: #64748b;">Nomor Terakhir Terbit:</div>
                    <div style="font-size: 0.95rem; font-weight: 800; color: #0f766e;">
                        {{ $tugasSeq['last_spt']->no_surat_tugas ?? '800.1.11.1/135/BKPSDM' }}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.75rem; color: #64748b;">Estimasi Urut Berikutnya:</div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #059669;">
                        {{ $tugasSeq['next_number'] }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- KPI Stats Row -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px;">
    <div class="card" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Surat Masuk</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary); margin-top: 4px;">
                    {{ number_format($stats['total_surat_masuk']) }}
                </div>
            </div>
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                <i class="bi bi-inbox"></i>
            </div>
        </div>
        <div style="margin-top: 10px; font-size: 0.74rem; color: var(--text-muted);">
            <span class="badge badge-warning">{{ $stats['menunggu_disposisi'] }} Menunggu Disposisi</span>
        </div>
    </div>

    <div class="card" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Surat Keluar Terbit</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: #059669; margin-top: 4px;">
                    {{ number_format($stats['total_surat_keluar']) }}
                </div>
            </div>
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                <i class="bi bi-send-check"></i>
            </div>
        </div>
        <div style="margin-top: 10px; font-size: 0.74rem; color: #059669; font-weight: 600;">
            <i class="bi bi-shield-check"></i> Anti-Nomor Ganda Aktif
        </div>
    </div>

    <div class="card" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Surat Tugas (SPT)</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: #d97706; margin-top: 4px;">
                    {{ number_format($stats['total_surat_tugas']) }}
                </div>
            </div>
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #fffbeb; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                <i class="bi bi-briefcase"></i>
            </div>
        </div>
        <div style="margin-top: 10px; font-size: 0.74rem; color: var(--text-muted);">
            Klasifikasi: <strong>800.1.11.1</strong>
        </div>
    </div>

    <div class="card" style="margin-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">Personil BKPSDM</div>
                <div style="font-size: 1.6rem; font-weight: 800; color: #7c3aed; margin-top: 4px;">
                    {{ $stats['total_pegawai'] }}
                </div>
            </div>
            <div style="width: 44px; height: 44px; border-radius: 10px; background: #f5f3ff; color: #7c3aed; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                <i class="bi bi-people"></i>
            </div>
        </div>
        <div style="margin-top: 10px; font-size: 0.74rem; color: #7c3aed; font-weight: 600;">
            Pimpinan: PARHA ARIEF, S.AP
        </div>
    </div>
</div>

<!-- Grid 2 Kolom: Aktivitas Terbaru -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px;">
    <!-- Surat Keluar Terakhir -->
    <div class="card">
        <div class="card-header-flex">
            <h3 class="card-title">
                <i class="bi bi-send text-primary"></i> Surat Keluar Terakhir
            </h3>
            <a href="{{ route('surat-keluar.index') }}" class="btn btn-sm btn-secondary">Lihat Semua</a>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nomor Surat</th>
                        <th>Perihal / Tujuan</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($latestSuratKeluar as $sk)
                        <tr>
                            <td>
                                <strong style="color: #1e3a8a;">{{ $sk->no_surat_keluar }}</strong>
                                <div style="font-size: 0.72rem; color: #64748b;">{{ $sk->bidang_pembuat }}</div>
                            </td>
                            <td>
                                <div>{{ Str::limit($sk->perihal, 38) }}</div>
                                <div style="font-size: 0.72rem; color: #0d9488;">Kepada: {{ Str::limit($sk->tujuan_surat, 30) }}</div>
                            </td>
                            <td style="white-space: nowrap;">
                                {{ $sk->tgl_surat ? $sk->tgl_surat->format('d/m/Y') : '-' }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <!-- Surat Tugas SPT Terakhir -->
    <div class="card">
        <div class="card-header-flex">
            <h3 class="card-title">
                <i class="bi bi-briefcase text-primary"></i> Surat Tugas (SPT) Terakhir
            </h3>
            <a href="{{ route('surat-tugas.index') }}" class="btn btn-sm btn-secondary">Lihat Semua</a>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nomor SPT</th>
                        <th>Maksud Tugas / Tujuan</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($latestSuratTugas as $st)
                        <tr>
                            <td>
                                <strong style="color: #0d9488;">{{ $st->no_surat_tugas }}</strong>
                                <div style="font-size: 0.72rem; color: #64748b;">{{ $st->bidang_pengusul }}</div>
                            </td>
                            <td>
                                <div>{{ Str::limit($st->maksud_tugas, 38) }}</div>
                                <div style="font-size: 0.72rem; color: #64748b;">Lokasi: {{ $st->tempat_tujuan }}</div>
                            </td>
                            <td style="white-space: nowrap;">
                                {{ $st->tgl_berangkat ? $st->tgl_berangkat->format('d/m/Y') : '-' }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
