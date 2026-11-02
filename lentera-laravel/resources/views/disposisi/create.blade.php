@extends('layouts.app')

@section('title', 'Buat Lembar Disposisi Kepala BKPSDM')
@section('page_title', 'Penerbitan Lembar Disposisi')

@section('content')
<div style="max-width: 850px; margin: 0 auto;">
    <div class="card">
        <div class="card-header-flex">
            <div>
                <h2 class="card-title" style="font-size: 1.15rem;">
                    <i class="bi bi-diagram-3-fill text-primary"></i> Formulir Lembar Disposisi Kepala BKPSDM
                </h2>
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                    Pemberian instruksi dan petunjuk tindak lanjut surat masuk oleh <strong>PARHA ARIEF, S.AP</strong>.
                </p>
            </div>
            <a href="{{ route('disposisi.index') }}" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> Kembali
            </a>
        </div>

        <form action="{{ route('disposisi.store') }}" method="POST">
            @csrf

            <!-- Pilih Surat Masuk Terkait -->
            <div class="form-group">
                <label class="form-label">Pilih Surat Masuk yang Didisposisikan *</label>
                @if($suratMasuk)
                    <input type="hidden" name="id_surat_masuk" value="{{ $suratMasuk->id }}">
                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px 16px;">
                        <strong style="color: #1e3a8a;">{{ $suratMasuk->no_agenda }}</strong> - {{ $suratMasuk->instansi_pengirim }}
                        <div style="font-size: 0.82rem; color: #334155; margin-top: 4px;">Perihal: {{ $suratMasuk->perihal }}</div>
                    </div>
                @else
                    <select name="id_surat_masuk" class="form-select" required>
                        <option value="">-- Pilih dari Surat Masuk --</option>
                        @foreach($suratList as $sm)
                            <option value="{{ $sm->id }}">{{ $sm->no_agenda }} - {{ Str::limit($sm->perihal, 60) }} ({{ $sm->instansi_pengirim }})</option>
                        @endforeach
                    </select>
                @endif
            </div>

            <!-- TUJUAN DISPOSISI RESMI (6 PEJABAT SESUAI FORMAT ASLI BKPSDM LUWU TIMUR) -->
            <div class="form-group" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
                <label class="form-label" style="font-weight: 700; color: #1e3a8a;">
                    Diteruskan Kepada Saudara (Pilih Pejabat / Unit Tujuan) *
                </label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px;">
                    @foreach($tujuanResmi as $t)
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; cursor: pointer;">
                            <input type="radio" name="tujuan_nama" value="{{ $t }}" required {{ $loop->first ? 'checked' : '' }}>
                            <span>{{ $t }}</span>
                        </label>
                    @endforeach
                </div>
            </div>

            <!-- Sifat Disposisi & Batas Waktu -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Sifat Disposisi *</label>
                    <select name="sifat" class="form-select" required>
                        <option value="Biasa">Biasa</option>
                        <option value="Segera">Segera</option>
                        <option value="Sangat Segera">Sangat Segera</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Batas Waktu Penyelesaian</label>
                    <input type="date" name="batas_waktu" class="form-control" value="{{ date('Y-m-d', strtotime('+3 days')) }}">
                </div>
            </div>

            <!-- Petunjuk / Instruksi Disposisi -->
            <div class="form-group" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
                <label class="form-label" style="font-weight: 700; color: #0f766e;">
                    Petunjuk / Arahan Disposisi Kepala Badan
                </label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                    @foreach($instruksiResmi as $ins)
                        <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; cursor: pointer;">
                            <input type="checkbox" name="instruksi[]" value="{{ $ins }}">
                            <span>{{ $ins }}</span>
                        </label>
                    @endforeach
                </div>
            </div>

            <!-- Catatan Tambahan Pimpinan -->
            <div class="form-group">
                <label class="form-label">Catatan Tambahan Kepala BKPSDM</label>
                <textarea name="catatan" class="form-control" rows="3" placeholder="Tuliskan catatan khusus dari Kepala Badan jika ada..."></textarea>
            </div>

            <div style="margin-top: 24px; display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('disposisi.index') }}" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-primary" style="padding: 10px 24px; font-weight: 700;">
                    <i class="bi bi-send-check"></i> Terbitkan Lembar Disposisi
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
