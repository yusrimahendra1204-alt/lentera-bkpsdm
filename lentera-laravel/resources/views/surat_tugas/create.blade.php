@extends('layouts.app')

@section('title', 'Buat Surat Perintah Tugas (SPT)')
@section('page_title', 'Penerbitan Surat Perintah Tugas (SPT)')

@section('content')
<div style="max-width: 950px; margin: 0 auto;">
    <div class="card">
        <div class="card-header-flex">
            <div>
                <h2 class="card-title" style="font-size: 1.15rem;">
                    <i class="bi bi-briefcase-fill text-primary"></i> Formulir Penerbitan Surat Perintah Tugas (SPT Dinas)
                </h2>
                <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                    Penugasan aparatur BKPSDM Kab. Luwu Timur dengan penomoran terpadu.
                </p>
            </div>
            <a href="{{ route('surat-tugas.index') }}" class="btn btn-secondary">
                <i class="bi bi-arrow-left"></i> Kembali
            </a>
        </div>

        <!-- Live Preview Banner SPT -->
        <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 16px 20px; margin-bottom: 22px;">
            <div style="font-size: 0.75rem; font-weight: 700; color: #0f766e; text-transform: uppercase;">
                <i class="bi bi-eye"></i> Format Resmi Nomor Surat Tugas (SPT):
            </div>
            <div id="livePreviewSpt" style="font-size: 1.25rem; font-weight: 800; color: #115e59; margin-top: 6px;">
                800.1.11.1/{{ $seqInfo['next_number_formatted'] }}/BKPSDM
            </div>
            <div style="font-size: 0.74rem; color: #0d9488; margin-top: 4px;">
                Kode Klasifikasi: 800.1.11.1 (Surat Perintah Dinas/Surat Tugas) | Urutan Murni $N+1$: {{ $seqInfo['next_number'] }}
            </div>
        </div>

        <form action="{{ route('surat-tugas.store') }}" method="POST">
            @csrf

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
                <!-- Nomor Urut SPT -->
                <div class="form-group">
                    <label class="form-label">Nomor Urut SPT *</label>
                    <input type="number" id="nomorUrutInput" name="nomor_urut" class="form-control" value="{{ old('nomor_urut', $seqInfo['next_number']) }}" required oninput="updatePreviewSpt()" style="font-weight: 700; color: #0d9488;">
                    <small style="color: #64748b; font-size: 0.72rem;">Nomor urut murni berikutnya (terakhir: {{ $seqInfo['last_number'] }}).</small>
                </div>

                <!-- Bidang Pengusul -->
                <div class="form-group">
                    <label class="form-label">Bidang Pengusul Penugasan *</label>
                    <select name="bidang_pengusul" class="form-select" required>
                        <option value="">-- Pilih Bidang Pengusul --</option>
                        @foreach($bidangList as $b)
                            <option value="{{ $b }}" {{ old('bidang_pengusul') == $b ? 'selected' : '' }}>{{ $b }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <!-- Maksud Perjalanan Dinas -->
            <div class="form-group">
                <label class="form-label">Maksud Tugas / Keperluan Dinas *</label>
                <textarea name="maksud_tugas" class="form-control" rows="3" placeholder="Contoh: Mengikuti Rapat Koordinasi Teknis Kepegawaian Se-Sulawesi Selatan..." required>{{ old('maksud_tugas') }}</textarea>
            </div>

            <!-- Tempat Tujuan, Tanggal Berangkat & Kembali, Lama Hari -->
            <div style="display: grid; grid-template-columns: 2fr 1.2fr 1.2fr 1fr; gap: 14px;">
                <div class="form-group">
                    <label class="form-label">Tempat / Lokasi Tujuan *</label>
                    <input type="text" name="tempat_tujuan" class="form-control" value="{{ old('tempat_tujuan', 'Kabupaten Luwu Timur') }}" placeholder="Contoh: Makassar / Malili / Bone-Bone" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Tanggal Berangkat *</label>
                    <input type="date" id="tglBerangkatInput" name="tgl_berangkat" class="form-control" value="{{ old('tgl_berangkat', date('Y-m-d')) }}" required onchange="calcLamaHari()">
                </div>

                <div class="form-group">
                    <label class="form-label">Tanggal Kembali *</label>
                    <input type="date" id="tglKembaliInput" name="tgl_kembali" class="form-control" value="{{ old('tgl_kembali', date('Y-m-d')) }}" required onchange="calcLamaHari()">
                </div>

                <div class="form-group">
                    <label class="form-label">Lama Tugas</label>
                    <input type="text" id="lamaHariDisplay" class="form-control" value="1 Hari Kerja" readonly style="font-weight: 800; color: #0d9488; background: #f0fdfa;">
                    <input type="hidden" id="lamaHariInput" name="lama_hari" value="1">
                </div>
            </div>

            <!-- Dasar Hukum & Pembebanan Anggaran -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Dasar Perintah Penugasan</label>
                    <textarea name="dasar" class="form-control" rows="2">{{ old('dasar', "1. Dokumen Pelaksanaan Anggaran (DPA-SKPD) BKPSDM Kab. Luwu Timur TA 2026\n2. Disposisi Kepala BKPSDM Kabupaten Luwu Timur") }}</textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Pembebanan Anggaran *</label>
                    <input type="text" name="pembebanan_anggaran" class="form-control" value="{{ old('pembebanan_anggaran', 'DPA-SKPD BKPSDM Kabupaten Luwu Timur TA 2026') }}" required>
                </div>
            </div>

            <!-- BAGIAN MULTI-PERSONIL RESMI (44 PEGAWAI BKPSDM) -->
            <div style="margin: 24px 0; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <div>
                        <h4 style="font-size: 0.95rem; font-weight: 800; color: #1e3a8a;">
                            <i class="bi bi-people-fill"></i> Personil Aparatur yang Ditugaskan (Multi-Pegawai)
                        </h4>
                        <p style="font-size: 0.75rem; color: #64748b;">
                            Pilih personil dari daftar resmi 44 aparatur BKPSDM Luwu Timur. Data NIP, Pangkat, dan Jabatan otomatis terisi.
                        </p>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary" onclick="tambahPersonil()">
                        <i class="bi bi-person-plus-fill"></i> + Tambah Personil
                    </button>
                </div>

                <div id="personilContainer">
                    <!-- Row 1 Personil -->
                    <div class="personil-row" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span class="badge badge-info personil-badge">Personil #1</span>
                            <button type="button" class="btn btn-sm btn-danger btn-hapus-personil" onclick="hapusPersonil(this)" style="display: none;">
                                <i class="bi bi-trash"></i> Hapus
                            </button>
                        </div>
                        <div style="display: grid; grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr; gap: 12px;">
                            <div>
                                <label class="form-label">Pilih Pegawai BKPSDM *</label>
                                <select class="form-select pegawai-selector" onchange="pilihPegawai(this)">
                                    <option value="">-- Pilih dari 44 Pegawai BKPSDM --</option>
                                    @foreach($pegawaiList as $peg)
                                        <option value="{{ $peg->id }}" 
                                            data-nama="{{ $peg->nama }}" 
                                            data-nip="{{ $peg->nip }}" 
                                            data-pangkat="{{ $peg->pangkat }}" 
                                            data-jabatan="{{ $peg->jabatan }}">
                                            {{ $peg->nama }} ({{ $peg->jabatan }})
                                        </option>
                                    @endforeach
                                </select>
                                <input type="hidden" name="personil[0][nama]" class="input-nama" required>
                            </div>
                            <div>
                                <label class="form-label">NIP</label>
                                <input type="text" name="personil[0][nip]" class="form-control input-nip" placeholder="Nomor Induk Pegawai">
                            </div>
                            <div>
                                <label class="form-label">Pangkat / Golongan</label>
                                <input type="text" name="personil[0][pangkat]" class="form-control input-pangkat" placeholder="Pangkat">
                            </div>
                            <div>
                                <label class="form-label">Jabatan</label>
                                <input type="text" name="personil[0][jabatan]" class="form-control input-jabatan" placeholder="Jabatan">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Penandatangan SPT -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label class="form-label">Pejabat Penandatangan *</label>
                    <input type="text" name="pejabat_penandatangan" class="form-control" value="{{ old('pejabat_penandatangan', 'PARHA ARIEF, S.AP') }}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Jabatan Penandatangan *</label>
                    <input type="text" name="jabatan_penandatangan" class="form-control" value="{{ old('jabatan_penandatangan', 'Kepala BKPSDM Kabupaten Luwu Timur') }}" required>
                </div>
            </div>

            <div style="margin-top: 24px; display: flex; gap: 10px; justify-content: flex-end;">
                <a href="{{ route('surat-tugas.index') }}" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-success" style="padding: 10px 24px; font-weight: 700; background: #0d9488;">
                    <i class="bi bi-check2-circle"></i> Kunci & Terbitkan Surat Tugas (SPT)
                </button>
            </div>
        </form>
    </div>
</div>

<template id="personilTemplate">
    <div class="personil-row" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="badge badge-info personil-badge">Personil #{INDEX}</span>
            <button type="button" class="btn btn-sm btn-danger btn-hapus-personil" onclick="hapusPersonil(this)">
                <i class="bi bi-trash"></i> Hapus
            </button>
        </div>
        <div style="display: grid; grid-template-columns: 2fr 1.5fr 1.5fr 1.5fr; gap: 12px;">
            <div>
                <label class="form-label">Pilih Pegawai BKPSDM *</label>
                <select class="form-select pegawai-selector" onchange="pilihPegawai(this)">
                    <option value="">-- Pilih dari 44 Pegawai BKPSDM --</option>
                    @foreach($pegawaiList as $peg)
                        <option value="{{ $peg->id }}" 
                            data-nama="{{ $peg->nama }}" 
                            data-nip="{{ $peg->nip }}" 
                            data-pangkat="{{ $peg->pangkat }}" 
                            data-jabatan="{{ $peg->jabatan }}">
                            {{ $peg->nama }} ({{ $peg->jabatan }})
                        </option>
                    @endforeach
                </select>
                <input type="hidden" name="personil[{IDX}][nama]" class="input-nama" required>
            </div>
            <div>
                <label class="form-label">NIP</label>
                <input type="text" name="personil[{IDX}][nip]" class="form-control input-nip" placeholder="Nomor Induk Pegawai">
            </div>
            <div>
                <label class="form-label">Pangkat / Golongan</label>
                <input type="text" name="personil[{IDX}][pangkat]" class="form-control input-pangkat" placeholder="Pangkat">
            </div>
            <div>
                <label class="form-label">Jabatan</label>
                <input type="text" name="personil[{IDX}][jabatan]" class="form-control input-jabatan" placeholder="Jabatan">
            </div>
        </div>
    </div>
</template>

<script>
    function updatePreviewSpt() {
        const urut = parseInt(document.getElementById('nomorUrutInput').value, 10) || 1;
        const padded = String(urut).padStart(3, '0');
        document.getElementById('livePreviewSpt').innerText = `800.1.11.1/${padded}/BKPSDM`;
    }

    function calcLamaHari() {
        const t1Val = document.getElementById('tglBerangkatInput').value;
        const t2Val = document.getElementById('tglKembaliInput').value;
        if (t1Val && t2Val) {
            const d1 = new Date(t1Val);
            const d2 = new Date(t2Val);
            if (!isNaN(d1) && !isNaN(d2) && d2 >= d1) {
                const diffTime = Math.abs(d2 - d1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                document.getElementById('lamaHariDisplay').value = `${diffDays} Hari Kerja`;
                document.getElementById('lamaHariInput').value = diffDays;
                return;
            }
        }
        document.getElementById('lamaHariDisplay').value = '1 Hari Kerja';
        document.getElementById('lamaHariInput').value = 1;
    }

    let personilCount = 1;

    function tambahPersonil() {
        const container = document.getElementById('personilContainer');
        const tpl = document.getElementById('personilTemplate').innerHTML;
        const html = tpl.replace(/{INDEX}/g, personilCount + 1).replace(/{IDX}/g, personilCount);
        
        const temp = document.createElement('div');
        temp.innerHTML = html.trim();
        const row = temp.firstChild;
        container.appendChild(row);

        personilCount++;
        updateHapusButtons();
    }

    function hapusPersonil(btn) {
        const row = btn.closest('.personil-row');
        row.remove();
        renumberPersonil();
        updateHapusButtons();
    }

    function renumberPersonil() {
        const rows = document.querySelectorAll('.personil-row');
        rows.forEach((r, idx) => {
            r.querySelector('.personil-badge').innerText = `Personil #${idx + 1}`;
            r.querySelector('.input-nama').setAttribute('name', `personil[${idx}][nama]`);
            r.querySelector('.input-nip').setAttribute('name', `personil[${idx}][nip]`);
            r.querySelector('.input-pangkat').setAttribute('name', `personil[${idx}][pangkat]`);
            r.querySelector('.input-jabatan').setAttribute('name', `personil[${idx}][jabatan]`);
        });
        personilCount = rows.length;
    }

    function updateHapusButtons() {
        const rows = document.querySelectorAll('.personil-row');
        rows.forEach((r) => {
            const btn = r.querySelector('.btn-hapus-personil');
            if (btn) {
                btn.style.display = rows.length > 1 ? 'inline-flex' : 'none';
            }
        });
    }

    function pilihPegawai(sel) {
        const opt = sel.options[sel.selectedIndex];
        const row = sel.closest('.personil-row');
        if (opt.value) {
            row.querySelector('.input-nama').value = opt.getAttribute('data-nama');
            row.querySelector('.input-nip').value = opt.getAttribute('data-nip');
            row.querySelector('.input-pangkat').value = opt.getAttribute('data-pangkat');
            row.querySelector('.input-jabatan').value = opt.getAttribute('data-jabatan');
        } else {
            row.querySelector('.input-nama').value = '';
            row.querySelector('.input-nip').value = '';
            row.querySelector('.input-pangkat').value = '';
            row.querySelector('.input-jabatan').value = '';
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        calcLamaHari();
    });
</script>
@endsection

