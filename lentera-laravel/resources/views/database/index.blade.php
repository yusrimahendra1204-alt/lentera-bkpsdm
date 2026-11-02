@extends('layouts.app')

@section('title', 'Manajemen Basis Data & Portabilitas Sistem')
@section('page_title', 'Basis Data & Portabilitas Sistem')

@section('content')
<div style="max-width: 1100px; margin: 0 auto;">
    <!-- Header -->
    <div class="card" style="margin-bottom: 20px;">
        <div class="card-header-flex">
            <div>
                <h2 class="card-title" style="font-size: 1.25rem;">
                    <i class="bi bi-database-fill-gear text-primary"></i> Manajemen Basis Data & Cadangan Sistem
                </h2>
                <p style="font-size: 0.82rem; color: #64748b; margin-top: 4px;">
                    Kelola pencadangan data, ekspor MySQL untuk penguji skripsi, dan portabilitas saat berpindah komputer/laptop.
                </p>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <a href="{{ route('database.downloadSql') }}" class="btn btn-primary">
                    <i class="bi bi-download"></i> Unduh database_persuratan.sql
                </a>
                <a href="{{ route('database.backupJson') }}" class="btn btn-secondary">
                    <i class="bi bi-file-earmark-code"></i> Cadangkan (JSON)
                </a>
            </div>
        </div>
    </div>

    <!-- Stats Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div class="card" style="padding: 18px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px;">
                Status Database Aktif (SQLite)
            </div>
            <div style="font-size: 1.25rem; font-weight: 800; color: #1e3a8a;">
                database.sqlite
            </div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 6px;">
                Ukuran: <strong>{{ $stats['sqlite_size_kb'] }} KB</strong> | Diperbarui: {{ $stats['sqlite_mtime'] }}
            </div>
        </div>

        <div class="card" style="padding: 18px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px;">
                Total Arsip Surat Masuk
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #0284c7;">
                {{ number_format($stats['surat_masuk']) }} Surat
            </div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 6px;">
                Tercatat lengkap dengan nomor surat pengirim & disposisi
            </div>
        </div>

        <div class="card" style="padding: 18px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px;">
                Surat Keluar & Tugas (SPT)
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #16a34a;">
                {{ number_format($stats['surat_keluar']) }} / {{ number_format($stats['surat_tugas']) }}
            </div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 6px;">
                Surat Keluar resmi & {{ $stats['surat_tugas'] }} SPT Multi-Personil
            </div>
        </div>

        <div class="card" style="padding: 18px;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px;">
                Klasifikasi Perbup 69/2023
            </div>
            <div style="font-size: 1.5rem; font-weight: 800; color: #d97706;">
                {{ number_format($stats['klasifikasi']) }} Kode
            </div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 6px;">
                100% Master Kode Terindeks & Siap Digunakan
            </div>
        </div>
    </div>

    <!-- Panduan Portabilitas Laptop (Penting untuk Sidang Skripsi) -->
    <div class="card" style="border-left: 5px solid #0284c7; background: linear-gradient(to right, #f0f9ff 0%, #ffffff 100%); margin-bottom: 24px;">
        <div style="padding: 18px 24px; border-bottom: 1px solid #e0f2fe;">
            <h3 style="font-size: 1rem; color: #0369a1; display: flex; align-items: center; gap: 8px;">
                <i class="bi bi-info-circle-fill"></i> Petunjuk Praktis: Cara Memindahkan Sistem ke Laptop Lain Saat Ujian Skripsi
            </h3>
        </div>
        <div style="padding: 20px 24px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #bae6fd; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <span style="background: #0284c7; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">1</span>
                        <strong style="color: #0f172a; font-size: 0.92rem;">Salin Folder Proyek</strong>
                    </div>
                    <p style="font-size: 0.8rem; color: #475569; line-height: 1.5; margin: 0;">
                        Salin satu folder <code>lentera-laravel</code> ke Flashdisk atau Google Drive. Di dalamnya sudah memuat kode Laravel, basis data SQLite mandiri, dan seluruh aset.
                    </p>
                </div>

                <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #bae6fd; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <span style="background: #0284c7; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">2</span>
                        <strong style="color: #0f172a; font-size: 0.92rem;">Jalankan di Laptop Baru</strong>
                    </div>
                    <p style="font-size: 0.8rem; color: #475569; line-height: 1.5; margin: 0;">
                        Di laptop baru, buka Terminal/PowerShell pada folder tersebut lalu ketik:<br>
                        <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0284c7; font-weight: 600;">php artisan serve</code><br>
                        Aplikasi langsung berjalan 100% tanpa perlu install/konfigurasi MySQL tambahan!
                    </p>
                </div>

                <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #bae6fd; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <span style="background: #0284c7; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">3</span>
                        <strong style="color: #0f172a; font-size: 0.92rem;">Jika Penguji Meminta MySQL</strong>
                    </div>
                    <p style="font-size: 0.8rem; color: #475569; line-height: 1.5; margin: 0;">
                        Klik tombol <strong>Unduh database_persuratan.sql</strong> di atas. Buka <code>http://localhost/phpmyadmin</code> di XAMPP, klik tab <strong>Import</strong> dan upload file tersebut. Seluruh tabel dan data langsung sinkron sesuai ERD Skripsi!
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Actions Row: Backup & Restore -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Left: Export & Tools -->
        <div class="card" style="padding: 20px;">
            <h3 style="font-size: 1rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="bi bi-box-arrow-up-right text-primary"></i> Pencadangan & Ekspor Data
            </h3>
            <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 18px;">
                Ekspor seluruh data sistem yang tersimpan saat ini agar siap dipindahkan atau diarsipkan.
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div>
                        <div style="font-weight: 600; font-size: 0.88rem; color: #0f172a;">File Skema MySQL (.SQL)</div>
                        <div style="font-size: 0.74rem; color: #64748b;">Format standar untuk phpMyAdmin / MySQL Workbench</div>
                    </div>
                    <a href="{{ route('database.downloadSql') }}" class="btn btn-sm btn-primary">
                        Unduh .SQL
                    </a>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div>
                        <div style="font-weight: 600; font-size: 0.88rem; color: #0f172a;">Snapshot Data JSON (.JSON)</div>
                        <div style="font-size: 0.74rem; color: #64748b;">Cadangan data terstruktur untuk pemulihan instan</div>
                    </div>
                    <a href="{{ route('database.backupJson') }}" class="btn btn-sm btn-secondary">
                        Unduh .JSON
                    </a>
                </div>

                <div style="padding: 14px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 700; font-size: 0.86rem; color: #be123c;">Bersihkan Semua Data Transaksi (Dummy)</div>
                            <div style="font-size: 0.74rem; color: #9f1239;">Kosongkan seluruh data surat masuk, disposisi, surat keluar, & SPT. Master 44 pegawai & 2.961 klasifikasi tetap utuh.</div>
                        </div>
                        <form action="{{ route('database.clearDummy') }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin mengosongkan seluruh data transaksi dummy persuratan?\n\nSemua surat masuk, disposisi, surat keluar, dan SPT dinas akan dihapus. Data pegawai dan master kode klasifikasi tetap aman.');">
                            @csrf
                            <button type="submit" class="btn btn-sm btn-danger" style="background: #e11d48;">
                                Bersihkan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right: Restore / Import -->
        <div class="card" style="padding: 20px;">
            <h3 style="font-size: 1rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                <i class="bi bi-box-arrow-in-down text-primary"></i> Pemulihan Data (Restore / Impor)
            </h3>
            <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 18px;">
                Pulihkan data persuratan dan disposisi dari file cadangan JSON yang pernah Anda unduh di komputer lain.
            </p>

            <form action="{{ route('database.restoreJson') }}" method="POST" enctype="multipart/form-data" onsubmit="return confirm('PERHATIAN: Memulihkan basis data akan menggantikan data surat yang sedang aktif dengan data dari file cadangan tersebut. Lanjutkan?');">
                @csrf
                <div style="border: 2px dashed #cbd5e1; border-radius: 8px; padding: 24px; text-align: center; background: #f8fafc; margin-bottom: 16px;">
                    <i class="bi bi-cloud-arrow-up text-primary" style="font-size: 2.5rem;"></i>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #0f172a; margin-top: 8px;">Pilih File Cadangan JSON</div>
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 14px;">File bertipe .json yang diekspor dari sistem LENTERA BKPSDM</div>

                    <input type="file" name="backup_file" id="backup_file" accept=".json,.txt" class="form-control" required style="max-width: 320px; margin: 0 auto;">
                </div>

                <div style="padding: 10px 14px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; font-size: 0.75rem; color: #92400e; margin-bottom: 16px;">
                    <i class="bi bi-exclamation-triangle-fill"></i> <strong>Peringatan:</strong> Proses restore akan meregenerasi tabel transaksi persuratan sesuai isi snapshot JSON yang diunggah.
                </div>

                <div style="text-align: right;">
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-arrow-repeat"></i> Mulai Pemulihan Data
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection

