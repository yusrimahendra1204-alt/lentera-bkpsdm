@extends('layouts.app')

@section('title', 'Penerbitan Nomor Surat Keluar Resmi')
@section('page_title', 'Penerbitan Nomor Surat Keluar Baru')

@section('content')
<div style="max-width: 950px; margin: 0 auto;">
    <div class="card">
        <div class="card-header-flex">
            <div>
                <h2 class="card-title" style="font-size: 1.15rem;">
                    <i class="bi bi-file-earmark-plus-fill text-primary"></i> Formulir Registrasi & Penomoran Surat Keluar
                </h2>
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                    Nomor resmi otomatis terpusat berbasis Perbup Luwu Timur No. 69 Tahun 2023 tanpa risiko nomor ganda.
                </p>
            </div>
            <a href="{{ route('surat-keluar.index') }}" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> Kembali ke Daftar
            </a>
        </div>

        <!-- LIVE PREVIEW BANNER -->
        <div style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 10px; padding: 16px 20px; margin-bottom: 22px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                    <div style="font-size: 0.75rem; font-weight: 700; color: #15803d; text-transform: uppercase;">
                        <i class="bi bi-eye"></i> Format Resmi Pemkab Luwu Timur (Live Preview):
                    </div>
                    <div id="livePreviewNo" style="font-size: 1.35rem; font-weight: 800; color: #166534; margin-top: 6px; letter-spacing: 0.02em; font-family: monospace;">
                        {{ request('kode', '800.1.3.2') }}/{{ $seqInfo['next_number'] }}/BKPSDM/{{ \App\Services\NomorSuratService::getBulanRomawi((int)date('n')) }}/{{ date('Y') }}
                    </div>
                    <div style="font-size: 0.74rem; color: #15803d; margin-top: 4px;">
                        Rumus Baku: <code>[Kode Klasifikasi Perbup] / [Nomor Urut Terpusat] / BKPSDM / [Bulan Romawi] / [Tahun]</code>
                    </div>
                </div>
                <div style="text-align: right; background: #ffffff; padding: 8px 14px; border-radius: 8px; border: 1px solid #86efac;">
                    <div style="font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Nomor Terakhir:</div>
                    <div style="font-weight: 800; font-family: monospace; font-size: 0.95rem; color: #15803d;">
                        {{ $seqInfo['last_surat']->no_surat_keluar ?? '800.1.5/834/BKPSDM' }}
                    </div>
                </div>
            </div>
        </div>

        <!-- BANNER PERINGATAN SURAT RAHASIA -->
        <div id="bannerRahasia" style="display: none; background: #fee2e2; border: 1.5px solid #f87171; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
                <i class="bi bi-lock-fill" style="color: #dc2626; font-size: 1.4rem;"></i>
                <div>
                    <div style="font-weight: 800; color: #991b1b; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.02em;">
                        Perlakuan Khusus Dokumen Rahasia (Perbup Luwu Timur 69/2023 & UU ASN)
                    </div>
                    <div style="font-size: 0.78rem; color: #7f1d1d; margin-top: 4px; line-height: 1.4;">
                        Surat ini bersifat <strong>RAHASIA</strong> (seperti rekomendasi izin perceraian atau berkas pemeriksaan disiplin pegawai). Naskah fisik surat wajib dimasukkan ke dalam amplop bersegel tertutup bertanda <strong>'RAHASIA'</strong>. Sistem tetap mencatatkan nomor urut resmi agar terdaftar sah di buku agenda.
                    </div>
                </div>
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
                    <small style="color: #64748b; font-size: 0.72rem;">Otomatis $N+1$ murni (nomor terakhir terdaftar: {{ $seqInfo['last_number'] }}).</small>
                </div>
            </div>

            <!-- KATALOG KODE KLASIFIKASI POPULER BKPSDM (PERBUP 69/2023) -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-size: 0.75rem; font-weight: 800; color: #1e3a8a; text-transform: uppercase;">
                        <i class="bi bi-star-fill text-warning"></i> Kode Klasifikasi Terpopuler BKPSDM (Klik untuk Pasang Cepat):
                    </span>
                    <a href="{{ route('klasifikasi.index') }}" target="_blank" style="font-size: 0.72rem; color: #2563eb; text-decoration: none; font-weight: 600;">
                        <i class="bi bi-search"></i> Telusuri 2.961 Kode Perbup
                    </a>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-chip" onclick="pilihKodePopuler('800.1.3.2', 'Kenaikan Pangkat/ Golongan/ Jabatan ASN', 'Biasa')">
                        <strong>800.1.3.2</strong> Kenaikan Pangkat
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-chip" onclick="pilihKodePopuler('800.1.11.13', 'Pengurusan Kenaikan Gaji Berkala (KGB)', 'Biasa')">
                        <strong>800.1.11.13</strong> KGB
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-chip" onclick="pilihKodePopuler('800.1.3.1', 'Usulan Alih Status, Pindah Instansi, Mutasi Wilayah Kerja', 'Biasa')">
                        <strong>800.1.3.1</strong> Mutasi ASN
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-chip" onclick="pilihKodePopuler('800.1.11.4', 'Cuti Tahunan Pegawai', 'Biasa')">
                        <strong>800.1.11.4</strong> Cuti Tahunan
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-chip" onclick="pilihKodePopuler('800.1.4.1', 'Usulan Tugas Belajar / Izin Belajar / Diklat / Ujian Dinas', 'Penting')">
                        <strong>800.1.4.1</strong> Diklat / Tugas Belajar
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-chip" onclick="pilihKodePopuler('800.1.8.1', 'Status Kepegawaian (Izin Perceraian / Perkawinan ASN)', 'Rahasia')">
                        🔒 <strong>800.1.8.1</strong> Izin Perceraian (Rahasia)
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-chip" onclick="pilihKodePopuler('800.1.6.2', 'Disiplin ASN (Hukuman Disiplin Ringan / Sedang / Berat)', 'Rahasia')">
                        🔒 <strong>800.1.6.2</strong> Disiplin ASN (Rahasia)
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary btn-chip" onclick="pilihKodePopuler('000.1.5', 'Undangan Rapat Kedinasan', 'Biasa')">
                        <strong>000.1.5</strong> Undangan Rapat
                    </button>
                </div>
            </div>

            <!-- Bidang Pembuat Naskah Surat -->
            <div class="form-group">
                <label class="form-label">Bidang / Unit Kerja Pembuat Naskah Surat *</label>
                <select name="bidang_pembuat" class="form-select" required>
                    <option value="">-- Pilih Unit Kerja Pembuat Surat --</option>
                    @foreach($bidangList as $b)
                        <option value="{{ $b }}" {{ old('bidang_pembuat') == $b ? 'selected' : '' }}>{{ $b }}</option>
                    @endforeach
                </select>
                <small style="color: #64748b; font-size: 0.72rem;">Naskah fisik disusun & dicetak mandiri oleh bidang pembuat.</small>
            </div>

            <!-- Kode Klasifikasi Arsip Perbup 69/2023 -->
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px; position: relative;">
                <div class="form-group">
                    <label class="form-label">Kode Klasifikasi Perbup 69/2023 *</label>
                    <input type="text" id="kodeKlasifikasiInput" name="kode_klasifikasi" class="form-control" value="{{ old('kode_klasifikasi', request('kode', '800.1.3.2')) }}" placeholder="Contoh: 800.1.3.2" required oninput="updatePreview(); checkRahasia(); searchKode(this.value);" style="font-family: monospace; font-weight: 700;">
                    <small style="color: #64748b; font-size: 0.72rem;">Ketik kode klasifikasi Perbup</small>
                </div>

                <div class="form-group" style="position: relative;">
                    <label class="form-label">Uraian / Nama Klasifikasi Perbup</label>
                    <input type="text" id="namaKlasifikasiInput" name="nama_klasifikasi" class="form-control" value="{{ old('nama_klasifikasi', request('nama', 'Kenaikan Pangkat/ Golongan/ Jabatan ASN')) }}" placeholder="Nama klasifikasi arsip">
                    <div id="kodeSearchResults" style="display: none; position: absolute; top: 70px; left: 0; right: 0; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; max-height: 220px; overflow-y: auto; z-index: 100; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);"></div>
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
                    <select id="sifatSuratSelect" name="sifat_surat" class="form-select" required onchange="checkRahasia()">
                        <option value="Biasa" {{ old('sifat_surat') == 'Biasa' ? 'selected' : '' }}>Biasa</option>
                        <option value="Penting" {{ old('sifat_surat') == 'Penting' ? 'selected' : '' }}>Penting</option>
                        <option value="Sangat Penting" {{ old('sifat_surat') == 'Sangat Penting' ? 'selected' : '' }}>Sangat Penting</option>
                        <option value="Rahasia" {{ old('sifat_surat') == 'Rahasia' ? 'selected' : '' }}>🔒 Rahasia (Izin Cerai, Disiplin, dsb)</option>
                    </select>
                </div>
            </div>

            <!-- Tujuan Surat -->
            <div class="form-group">
                <label class="form-label">Tujuan Surat / Penerima *</label>
                <input type="text" name="tujuan_surat" class="form-control" value="{{ old('tujuan_surat') }}" placeholder="Contoh: Kepala Badan Kepegawaian Negara RI / Kepala Perangkat Daerah Lingkup Pemkab Luwu Timur" required>
            </div>

            <!-- Perihal Surat -->
            <div class="form-group">
                <label class="form-label">Perihal / Pokok Surat *</label>
                <textarea id="perihalInput" name="perihal" class="form-control" rows="3" placeholder="Uraikan isi perihal naskah dinas..." required>{{ old('perihal') }}</textarea>
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

<style>
    .btn-chip {
        font-size: 0.76rem;
        padding: 5px 10px;
        border-radius: 6px;
        background: #ffffff;
        border: 1px solid #cbd5e1;
        cursor: pointer;
        transition: all 0.15s ease;
    }
    .btn-chip:hover {
        background: #eff6ff;
        border-color: #2563eb;
        color: #1e40af;
    }
</style>

<script>
    const romawiBulan = {
        1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI',
        7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };

    function updatePreview() {
        const kode = document.getElementById('kodeKlasifikasiInput').value.trim() || '[Kode Klasifikasi]';
        const urut = document.getElementById('nomorUrutInput').value.trim() || '---';
        const tglVal = document.getElementById('tglSuratInput').value;

        let romawi = 'XI';
        let tahun = 2026;
        if (tglVal) {
            const parts = tglVal.split('-');
            if (parts.length === 3) {
                const b = parseInt(parts[1], 10);
                romawi = romawiBulan[b] || 'XI';
                tahun = parts[0];
            }
        }

        const previewText = `${kode}/${urut}/BKPSDM/${romawi}/${tahun}`;
        document.getElementById('livePreviewNo').innerText = previewText;
    }

    function checkRahasia() {
        const kode = document.getElementById('kodeKlasifikasiInput').value.trim();
        const sifat = document.getElementById('sifatSuratSelect').value;
        const banner = document.getElementById('bannerRahasia');

        if (kode === '800.1.8.1' || kode === '800.1.6.2' || sifat === 'Rahasia') {
            banner.style.display = 'block';
            if (kode === '800.1.8.1' || kode === '800.1.6.2') {
                document.getElementById('sifatSuratSelect').value = 'Rahasia';
            }
        } else {
            banner.style.display = 'none';
        }
    }

    function pilihKodePopuler(kode, nama, sifat) {
        document.getElementById('kodeKlasifikasiInput').value = kode;
        document.getElementById('namaKlasifikasiInput').value = nama;
        if (sifat) {
            document.getElementById('sifatSuratSelect').value = sifat;
        }
        updatePreview();
        checkRahasia();
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
                        row.innerHTML = `<strong style="color: #1e3a8a;">${it.kode}</strong> - ${it.nama}`;
                        row.onmouseenter = () => row.style.backgroundColor = '#eff6ff';
                        row.onmouseleave = () => row.style.backgroundColor = '#ffffff';
                        row.onclick = () => {
                            document.getElementById('kodeKlasifikasiInput').value = it.kode;
                            document.getElementById('namaKlasifikasiInput').value = it.nama;
                            resBox.style.display = 'none';
                            updatePreview();
                            checkRahasia();
                        };
                        resBox.appendChild(row);
                    });
                    resBox.style.display = 'block';
                })
                .catch(() => resBox.style.display = 'none');
        }, 300);
    }

    // Jalankan pengecekan saat dokumen dimuat
    document.addEventListener('DOMContentLoaded', function() {
        updatePreview();
        checkRahasia();
    });
</script>
@endsection
