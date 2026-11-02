@extends('layouts.app')

@section('title', 'Penerbitan Nomor Surat Keluar Resmi')
@section('page_title', 'Penerbitan Nomor Surat Keluar Baru')

@section('content')
<div style="max-width: 900px; margin: 0 auto;">
    <div class="card">
        <div class="card-header-flex">
            <div>
                <h2 class="card-title" style="font-size: 1.15rem;">
                    <i class="bi bi-file-earmark-plus-fill text-primary"></i> Formulir Registrasi & Penomoran Surat Keluar
                </h2>
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                    Nomor resmi otomatis terpusat tanpa risiko nomor ganda / lompat nomor.
                </p>
            </div>
            <a href="{{ route('surat-keluar.index') }}" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> Kembali ke Daftar
            </a>
        </div>

        <!-- LIVE PREVIEW BANNER -->
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 16px 20px; margin-bottom: 22px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #15803d; text-transform: uppercase;">
                <i class="bi bi-eye"></i> Format Resmi Pemkab Luwu Timur (Live Preview):
            </div>
            <div id="livePreviewNo" style="font-size: 1.25rem; font-weight: 800; color: #166534; margin-top: 6px; letter-spacing: 0.02em;">
                800.1.3.3/{{ $seqInfo['next_number'] }}/BKPSDM/{{ NomorSuratService::getBulanRomawi((int)date('n')) }}/{{ date('Y') }}
            </div>
            <div style="font-size: 0.74rem; color: #15803d; margin-top: 4px;">
                Rumus: [Kode Klasifikasi Perbup] / [Nomor Urut Terpusat] / BKPSDM / [Bulan Romawi] / [Tahun]
            </div>
        </div>

        <form action="{{ route('surat-keluar.store') }}" method="POST">
            @csrf

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <!-- No Agenda Internal -->
                <div class="form-group">
                    <label class="form-label">No. Agenda Internal Sistem *</label>
                    <input type="text" name="no_agenda" class="form-control" value="{{ old('no_agenda', $nextAgenda) }}" required readonly style="background: #f8fafc; font-weight: 600;">
                </div>

                <!-- Nomor Urut Terpusat -->
                <div class="form-group">
                    <label class="form-label">Nomor Urut Resmi Terpusat *</label>
                    <input type="number" id="nomorUrutInput" name="nomor_urut" class="form-control" value="{{ old('nomor_urut', $seqInfo['next_number']) }}" required style="font-weight: 700; color: #1e3a8a;" oninput="updatePreview()">
                    <small style="color: #64748b; font-size: 0.72rem;">Otomatis $N+1$ murni (terakhir terdaftar: {{ $seqInfo['last_number'] }}).</small>
                </div>
            </div>

            <!-- Bidang / Unit Kerja Pembuat Naskah Surat (Sesuai Gambar Dokumen Riil BKPSDM) -->
            <div class="form-group">
                <label class="form-label">Bidang / Unit Kerja Pembuat Naskah Surat *</label>
                <select name="bidang_pembuat" class="form-select" required>
                    <option value="">-- Pilih Unit Kerja Pembuat Surat --</option>
                    @foreach($bidangList as $b)
                        <option value="{{ $b }}" {{ old('bidang_pembuat') == $b ? 'selected' : '' }}>{{ $b }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Kode Klasifikasi Arsip Perbup 69/2023 -->
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Kode Klasifikasi Perbup 69/2023 *</label>
                    <input type="text" id="kodeKlasifikasiInput" name="kode_klasifikasi" class="form-control" value="{{ old('kode_klasifikasi', '800.1.3.3') }}" placeholder="Contoh: 800.1.3.3" required oninput="updatePreview(); searchKode(this.value);">
                    <small style="color: #64748b; font-size: 0.72rem;">Ketik kode klasifikasi Perbup</small>
                </div>

                <div class="form-group">
                    <label class="form-label">Uraian / Nama Klasifikasi</label>
                    <input type="text" id="namaKlasifikasiInput" name="nama_klasifikasi" class="form-control" value="{{ old('nama_klasifikasi', 'Pengadaan Pegawai ASN') }}" placeholder="Nama klasifikasi arsip">
                    <div id="kodeSearchResults" style="display: none; position: absolute; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; width: 400px; max-height: 200px; overflow-y: auto; z-index: 100; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);"></div>
                </div>
            </div>

            <!-- Tanggal Surat & Sifat Surat -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Tanggal Surat *</label>
                    <input type="date" id="tglSuratInput" name="tgl_surat" class="form-control" value="{{ old('tgl_surat', date('Y-m-d')) }}" required onchange="updatePreview()">
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

            <!-- Tujuan Surat -->
            <div class="form-group">
                <label class="form-label">Tujuan Surat / Penerima *</label>
                <input type="text" name="tujuan_surat" class="form-control" value="{{ old('tujuan_surat') }}" placeholder="Contoh: Seluruh Kepala Perangkat Daerah / Camat Se-Kabupaten Luwu Timur" required>
            </div>

            <!-- Perihal Surat -->
            <div class="form-group">
                <label class="form-label">Perihal / Pokok Surat *</label>
                <textarea name="perihal" class="form-control" rows="3" placeholder="Uraikan isi ringkas perihal naskah dinas..." required>{{ old('perihal') }}</textarea>
            </div>

            <!-- Penandatangan & Metode Dokumen -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Pejabat Penandatangan *</label>
                    <input type="text" name="penandatangan" class="form-control" value="{{ old('penandatangan', 'PARHA ARIEF, S.AP') }}" required>
                    <small style="color: #64748b; font-size: 0.72rem;">Kepala BKPSDM Kabupaten Luwu Timur</small>
                </div>

                <div class="form-group">
                    <label class="form-label">Metode Naskah Dokumen *</label>
                    <select name="metode_dokumen" class="form-select" required>
                        <option value="Fisik Manual (Tanda Tangan Basah)">Fisik Manual (Tanda Tangan Basah)</option>
                        <option value="Digital Elektronik (TTE BSrE)">Digital Elektronik (TTE BSrE)</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Lokasi Simpan Arsip Fisik</label>
                <input type="text" name="lokasi_arsip_fisik" class="form-control" value="{{ old('lokasi_arsip_fisik', 'Lemari Arsip Subbag Umum & Kepegawaian') }}">
            </div>

            <div style="margin-top: 24px; display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('surat-keluar.index') }}" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-success" style="padding: 10px 24px; font-weight: 700;">
                    <i class="bi bi-check2-circle"></i> Kunci & Terbitkan Nomor Surat
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    const romawiBulan = {
        1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
        7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };

    function updatePreview() {
        const kode = document.getElementById('kodeKlasifikasiInput').value.trim() || '[Kode Klasifikasi]';
        const urut = document.getElementById('nomorUrutInput').value.trim() || '---';
        const tglVal = document.getElementById('tglSuratInput').value;

        let romawi = 'X';
        let tahun = 2026;
        if (tglVal) {
            const parts = tglVal.split('-');
            if (parts.length === 3) {
                const b = parseInt(parts[1], 10);
                romawi = romawiBulan[b] || 'X';
                tahun = parts[0];
            }
        }

        const previewText = `${kode}/${urut}/BKPSDM/${romawi}/${tahun}`;
        document.getElementById('livePreviewNo').innerText = previewText;
    }

    let searchTimeout = null;
    function searchKode(query) {
        clearTimeout(searchTimeout);
        const resBox = document.getElementById('kodeSearchResults');
        if (query.length < 2) {
            resBox.style.display = 'none';
            return;
        }

        searchTimeout = setTimeout(() => {
            fetch(`/api/klasifikasi/search?q=${encodeURIComponent(query)}`)
                .then(r => r.json())
                .then(items => {
                    if (items.length === 0) {
                        resBox.style.display = 'none';
                        return;
                    }
                    resBox.innerHTML = '';
                    items.forEach(it => {
                        const row = document.createElement('div');
                        row.style.padding = '8px 12px';
                        row.style.cursor = 'pointer';
                        row.style.borderBottom = '1px solid #f1f5f9';
                        row.style.fontSize = '0.82rem';
                        row.innerHTML = `<strong>${it.kode}</strong> - ${it.nama}`;
                        row.onmouseenter = () => row.style.backgroundColor = '#eff6ff';
                        row.onmouseleave = () => row.style.backgroundColor = '#ffffff';
                        row.onclick = () => {
                            document.getElementById('kodeKlasifikasiInput').value = it.kode;
                            document.getElementById('namaKlasifikasiInput').value = it.nama;
                            resBox.style.display = 'none';
                            updatePreview();
                        };
                        resBox.appendChild(row);
                    });
                    resBox.style.display = 'block';
                })
                .catch(() => resBox.style.display = 'none');
        }, 300);
    }
</script>
@endsection
