@extends('layouts.app')

@section('title', 'Catat Surat Masuk Baru')
@section('page_title', 'Pencatatan Surat Masuk')

@section('content')
<div style="max-width: 850px; margin: 0 auto;">
    <div class="card">
        <div class="card-header-flex">
            <div>
                <h2 class="card-title" style="font-size: 1.15rem;">
                    <i class="bi bi-inbox-fill text-primary"></i> Formulir Registrasi Surat Masuk
                </h2>
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                    Registrasi agenda surat masuk ke dalam buku kendali digital BKPSDM.
                </p>
            </div>
            <a href="{{ route('surat-masuk.index') }}" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> Kembali
            </a>
        </div>

        <form action="{{ route('surat-masuk.store') }}" method="POST">
            @csrf

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Nomor Agenda Sistem *</label>
                    <input type="text" name="no_agenda" class="form-control" value="{{ old('no_agenda', $nextAgenda) }}" required readonly style="background: #f8fafc; font-weight: 700; color: #1e3a8a;">
                </div>

                <div class="form-group">
                    <label class="form-label">Sifat Naskah Surat *</label>
                    <select name="sifat_surat" class="form-select" required>
                        <option value="Biasa" {{ old('sifat_surat') == 'Biasa' ? 'selected' : '' }}>Biasa</option>
                        <option value="Penting" {{ old('sifat_surat') == 'Penting' ? 'selected' : '' }}>Penting</option>
                        <option value="Sangat Penting" {{ old('sifat_surat') == 'Sangat Penting' ? 'selected' : '' }}>Sangat Penting</option>
                        <option value="Rahasia" {{ old('sifat_surat') == 'Rahasia' ? 'selected' : '' }}>Rahasia</option>
                    </select>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Instansi / Pengirim Surat *</label>
                    <input type="text" name="instansi_pengirim" class="form-control" value="{{ old('instansi_pengirim') }}" placeholder="Contoh: BKN Regional IV Makassar / Sekretariat Daerah" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Nomor Surat Pengirim</label>
                    <input type="text" name="no_surat_pengirim" class="form-control" value="{{ old('no_surat_pengirim') }}" placeholder="Contoh: 123/SEK/X/2026">
                </div>
            </div>

            <!-- Kode Klasifikasi Internal -->
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Kode Klasifikasi Arsip *</label>
                    <input type="text" name="kode_internal" class="form-control" value="{{ old('kode_internal', '800') }}" placeholder="800" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Nama Klasifikasi Arsip</label>
                    <input type="text" name="nama_klasifikasi_internal" class="form-control" value="{{ old('nama_klasifikasi_internal', 'Kepegawaian') }}">
                </div>
            </div>

            <!-- Perihal Surat -->
            <div class="form-group">
                <label class="form-label">Perihal / Pokok Surat *</label>
                <textarea name="perihal" class="form-control" rows="3" placeholder="Uraian isi ringkas perihal surat..." required>{{ old('perihal') }}</textarea>
            </div>

            <!-- Tanggal Surat & Tanggal Diterima -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Tanggal Surat *</label>
                    <input type="date" name="tgl_surat" class="form-control" value="{{ old('tgl_surat', date('Y-m-d')) }}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Tanggal Diterima *</label>
                    <input type="date" name="tgl_diterima" class="form-control" value="{{ old('tgl_diterima', date('Y-m-d')) }}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Lampiran</label>
                    <input type="text" name="lampiran" class="form-control" value="{{ old('lampiran', '1 Berkas') }}">
                </div>
            </div>

            <div style="margin-top: 24px; display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('surat-masuk.index') }}" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-primary" style="padding: 10px 24px; font-weight: 700;">
                    <i class="bi bi-save"></i> Simpan ke Buku Agenda
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

