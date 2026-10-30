// Surat Tugas (SPT) Module - Sistem Informasi Persuratan BKPSDM Luwu Timur
// Alur Bisnis: Bidang menyusun naskah fisik SPT mandiri. Subbag Umum HANYA MENCATAT agenda & menerbitkan nomor SPT resmi terpusat.
const SuratTugasModule = {
  render() {
    const container = document.getElementById('view-surat-tugas');
    if (!container) return;

    const list = Store.state.surat_tugas || [];
    const isAuth = Store.state.isLoggedIn;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="code-tag code-tag-internal">Kode Klasifikasi: 800.1.11.1</span>
              <span style="font-size:12px; color:#166534; font-weight:700;">Buku Agenda Surat Perintah Tugas</span>
              ${!isAuth ? `
                <span class="badge badge-info" style="font-size:11px; padding:3px 8px; font-weight:700;">
                  🔒 Mode Baca Terbuka Staf Kantor (Read-Only)
                </span>
              ` : ''}
            </div>
            <h2 style="margin-top:4px;">Buku Agenda & Pencatatan Surat Perintah Tugas (SPT)</h2>
            <p>Pencatatan data agenda perjalanan dinas & penerbitan nomor SPT resmi terpusat. Naskah fisik surat tugas disusun & dicetak mandiri oleh bidang pembuat penugasan.</p>
          </div>
          ${isAuth ? `
            <button class="btn btn-primary" onclick="SuratTugasModule.openCreateModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              + Catat & Ambil Nomor SPT
            </button>
          ` : `
            <button class="btn btn-outline" style="border-color:#0284c7; color:#0284c7; font-weight:700;" onclick="App.checkAuthState()">
              🔐 Login Petugas
            </button>
          `}
        </div>

        <!-- Banner Alur Bisnis SPT -->
        <div style="margin: 0 24px 16px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:12px 16px; display:flex; align-items:flex-start; gap:12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" style="flex-shrink:0; margin-top:2px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <div style="font-size:12.5px; color:#1e40af; line-height:1.45;">
            <strong>Ketentuan Alur Tata Kelola SPT di BKPSDM:</strong><br>
            Surat Perintah Tugas (SPT) disusun dan dicetak naskah fisiknya oleh masing-masing <strong>Bidang Pembuat</strong> untuk diteken basah oleh Kepala BKPSDM. Sistem persuratan ini di Subbagian Umum bertugas <strong>hanya mencatat agenda dan mengunci nomor urut resmi (digital numbering)</strong> agar tidak terjadi nomor ganda. Sistem tidak mencetak naskah fisik SPT.
          </div>
        </div>

        <div class="card-body" style="padding:0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width:190px;">Nomor SPT Resmi</th>
                  <th style="width:180px;">Bidang Pembuat / Pengusul</th>
                  <th>Maksud Tugas Kedinasan</th>
                  <th>Tujuan & Jadwal</th>
                  <th>Personil yang Ditugaskan</th>
                  <th style="text-align:right; width:170px;">Aksi</th>
                </tr>
              </thead>
              <tbody>
                ${this.renderRows(list)}
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer">
          <span style="font-size:12.5px; color:var(--text-muted);">
            Menampilkan <strong>${list.length}</strong> catatan agenda Surat Perintah Tugas terdaftar
          </span>
          <button class="btn btn-outline btn-sm" onclick="App.navigate('laporan')">
            Cetak Rekap Agenda SPT
          </button>
        </div>
      </div>
    `;
  },

  renderRows(list) {
    if (!list.length) {
      return `<tr><td colspan="6" style="text-align:center; padding:32px; color:#94a3b8;">Belum ada catatan surat tugas di agenda.</td></tr>`;
    }

    return list.map(spt => `
      <tr>
        <td>
          <div style="font-family:monospace; font-weight:800; color:var(--primary); font-size:13.5px;">
            ${spt.no_surat_tugas}
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
            <span style="font-size:11px; background:#dcfce7; color:#15803d; font-weight:700; padding:1px 6px; border-radius:4px;">
              Perbup: ${spt.kode_klasifikasi}
            </span>
          </div>
        </td>
        <td>
          <span style="font-size:12px; font-weight:700; color:#334155; background:#f1f5f9; padding:4px 8px; border-radius:6px; display:inline-block; line-height:1.3;">
            ${spt.bidang_pengusul || 'Subbagian Umum dan Kepegawaian'}
          </span>
          <div style="font-size:10.5px; color:#64748b; margin-top:4px;">
            Fisik: Tanda Tangan Basah
          </div>
        </td>
        <td>
          <div style="font-weight:600; font-size:13.5px; line-height:1.35; color:var(--text-main);">
            ${spt.maksud_tugas}
          </div>
        </td>
        <td>
          <div style="font-weight:700; font-size:13px; color:#0f172a;">${spt.tempat_tujuan}</div>
          <div style="font-size:12px; color:#475569; margin-top:2px;">
            ${App.formatIndoDate(spt.tgl_berangkat)} s/d ${App.formatIndoDate(spt.tgl_kembali)}
          </div>
          <div style="font-size:11px; color:#d97706; font-weight:700; margin-top:2px;">
            (${spt.lama_hari} Hari Kerja)
          </div>
        </td>
        <td>
          <div style="display:flex; flex-direction:column; gap:4px; max-width:240px;">
            ${(spt.personil && spt.personil.length > 0) ? spt.personil.map(p => `
              <div style="font-size:11.5px; background:#f8fafc; border:1px solid #e2e8f0; padding:4px 8px; border-radius:4px; border-left:3px solid var(--primary);">
                <span style="font-weight:700; color:#0f172a;">${p.nama}</span>
              </div>
            `).join('') : `
              <span style="font-size:11.5px; color:#64748b; font-style:italic; background:#f1f5f9; padding:3px 8px; border-radius:4px; display:inline-block;">(Manual di naskah fisik)</span>
            `}
          </div>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:4px; flex-wrap:wrap; justify-content:flex-end;">
            <button class="btn btn-outline btn-sm" onclick="SuratTugasModule.viewDetailAgendaSPT(${spt.id})" title="Lihat Rincian Agenda">
              Detail
            </button>
            <button class="btn btn-sm" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;" onclick="SuratTugasModule.copyNoSpt('${spt.no_surat_tugas}')" title="Salin Nomor SPT">
              📋 Salin No
            </button>
            ${Store.state.isLoggedIn ? `
              <button class="btn btn-outline btn-sm" style="color:#0284c7; border-color:#bae6fd;" onclick="SuratTugasModule.openEditModal(${spt.id})" title="Ubah Data SPT">
                Ubah
              </button>
              <button class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fecaca;" onclick="SuratTugasModule.confirmDelete(${spt.id})" title="Hapus SPT">
                Hapus
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  },

  openCreateModal() {
    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    const nextId = (Store.state.surat_tugas.length ? Math.max(...Store.state.surat_tugas.map(s => s.id)) : 0) + 1;
    const defaultNoSpt = `800.1.11.1/${String(nextId + 40).padStart(3, '0')}/BKPSDM-LT/X/2026`;

    title.innerText = 'Pencatatan & Pengambilan Nomor Surat Perintah Tugas (SPT)';
    body.innerHTML = `
      <form id="form-surat-tugas">
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:700; color:#166534; font-size:13px;">
              ⚡ Kode Klasifikasi Perbup Luwu Timur: 800.1.11.1
            </span>
            <span style="font-size:11px; background:#dcfce7; color:#15803d; font-weight:700; padding:2px 8px; border-radius:10px;">
              Surat Perintah Tugas Kedinasan
            </span>
          </div>
          <div style="font-size:11.5px; color:#166534; margin-top:4px; line-height:1.4;">
            Sistem mengunci Nomor SPT resmi terpusat untuk dicatat pada buku agenda. Naskah fisik SPT tetap disusun dan dicetak mandiri oleh bidang pengusul tugas.
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nomor SPT Resmi (Dikunci Otomatis oleh Sistem) <span class="required">*</span></label>
            <input type="text" id="spt-nomor" class="form-control" style="font-family:monospace; font-weight:800; color:var(--primary);" value="${defaultNoSpt}" required>
            <span class="form-hint">Format otomatis: 800.1.11.1 / [No Urut] / BKPSDM-LT / [Bulan] / [Tahun]</span>
          </div>
          <div class="form-group">
            <label class="form-label">Bidang / Unit Kerja Pembuat SPT <span class="required">*</span></label>
            <select id="spt-bidang" class="form-control" required>
              <option value="Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian" selected>Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian</option>
              <option value="Bidang Mutasi, Kepangkatan dan Pengembangan Karir">Bidang Mutasi, Kepangkatan dan Pengembangan Karir</option>
              <option value="Bidang Pengembangan Sumber Daya Aparatur">Bidang Pengembangan Sumber Daya Aparatur</option>
              <option value="Sekretariat / Subbagian Umum dan Kepegawaian">Sekretariat / Subbagian Umum dan Kepegawaian</option>
              <option value="Subbagian Perencanaan dan Keuangan">Subbagian Perencanaan dan Keuangan</option>
            </select>
            <span class="form-hint">Bidang yang menyusun & mencetak naskah fisik SPT</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Maksud Tugas Kedinasan <span class="required">*</span></label>
          <textarea id="spt-maksud" class="form-control" rows="2" placeholder="Contoh: Melaksanakan koordinasi teknis percepatan verifikasi usulan Kenaikan Pangkat ASN Periode April 2026..." required></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Tempat Tujuan Tugas <span class="required">*</span></label>
          <input type="text" id="spt-tujuan" class="form-control" placeholder="Contoh: Kantor Regional IV BKN Makassar, Kota Makassar" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tanggal Berangkat</label>
            <input type="date" id="spt-tgl-berangkat" class="form-control" value="${new Date().toISOString().split('T')[0]}" required onchange="SuratTugasModule.calcLama()">
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Kembali</label>
            <input type="date" id="spt-tgl-kembali" class="form-control" value="${new Date().toISOString().split('T')[0]}" required onchange="SuratTugasModule.calcLama()">
          </div>
          <div class="form-group" style="max-width:110px;">
            <label class="form-label">Lama Hari</label>
            <input type="number" id="spt-lama" class="form-control" value="1" min="1" readonly style="background:#f1f5f9; font-weight:700;">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Dasar Penugasan</label>
          <textarea id="spt-dasar" class="form-control" rows="2">1. Dokumen Pelaksanaan Anggaran (DPA-SKPD) BKPSDM Kabupaten Luwu Timur TA 2026&#10;2. Disposisi Kepala BKPSDM Kabupaten Luwu Timur</textarea>
        </div>

        <div style="border-top:1px solid #e2e8f0; padding-top:14px; margin-top:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <label class="form-label" style="margin:0; font-weight:700; color:var(--text-main);">
              Personil yang Ditugaskan <span class="required">*</span>
            </label>
            <button type="button" class="btn btn-outline btn-sm" onclick="SuratTugasModule.addPersonilRow()">
              + Tambah Personil
            </button>
          </div>
          <div id="personil-container" style="display:flex; flex-direction:column; gap:8px;">
            <!-- Row personil dynamically generated -->
          </div>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="SuratTugasModule.submitCreate()">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Simpan & Terbitkan Nomor SPT
      </button>
    `;

    App.openModal();
    this.addPersonilRow();
  },

  addPersonilRow(containerId = 'personil-container', selectedPegawaiId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'form-row personil-row';
    div.style.marginBottom = '8px';
    div.style.background = '#fafbfc';
    div.style.padding = '10px 12px';
    div.style.borderRadius = '6px';
    div.style.border = '1px solid #cbd5e1';

    const pegawaiList = Store.state.pegawai || [];
    const options = pegawaiList.map(p => `
      <option value="${p.id}" ${selectedPegawaiId === p.id ? 'selected' : ''}>
        ${p.no || p.id}. ${p.nama} — ${p.jabatan} (${p.pangkat || '-'})
      </option>
    `).join('');

    div.innerHTML = `
      <div class="form-group" style="flex:1; margin:0;">
        <select class="form-control select-pegawai" onchange="SuratTugasModule.onPersonilChange(this)" style="font-weight:600; font-size:13px;">
          ${options}
        </select>
        <div class="personil-info-preview" style="margin-top:5px; font-size:11.5px; color:#475569; display:flex; gap:10px; flex-wrap:wrap; background:#f1f5f9; padding:4px 8px; border-radius:4px;">
        </div>
      </div>
      <div style="display:flex; align-items:center; margin-left:8px;">
        <button type="button" class="btn btn-outline btn-sm" style="color:#ef4444; border-color:#fca5a5; padding:6px 10px;" onclick="this.closest('.personil-row').remove()" title="Hapus personil ini">
          ✕
        </button>
      </div>
    `;

    container.appendChild(div);
    const sel = div.querySelector('.select-pegawai');
    if (sel) this.onPersonilChange(sel);
  },

  onPersonilChange(selectEl) {
    const pegId = parseInt(selectEl.value, 10);
    const peg = (Store.state.pegawai || []).find(p => p.id === pegId);
    const infoEl = selectEl.parentElement.querySelector('.personil-info-preview');
    if (infoEl && peg) {
      infoEl.innerHTML = `
        <span>NIP: <strong style="font-family:monospace; color:#0f172a;">${peg.nip}</strong></span>
        <span>•</span>
        <span>Pangkat: <strong style="color:#15803d;">${peg.pangkat}</strong></span>
        <span>•</span>
        <span>Unit: <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:10.5px;">${peg.unit}</span></span>
      `;
    }
  },

  calcLama() {
    const tgl1 = new Date(document.getElementById('spt-tgl-berangkat')?.value);
    const tgl2 = new Date(document.getElementById('spt-tgl-kembali')?.value);
    if (!isNaN(tgl1) && !isNaN(tgl2) && tgl2 >= tgl1) {
      const diffTime = Math.abs(tgl2 - tgl1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      document.getElementById('spt-lama').value = diffDays;
    } else {
      document.getElementById('spt-lama').value = 1;
    }
  },

  async submitCreate() {
    const nomor = document.getElementById('spt-nomor')?.value.trim();
    const bidang = document.getElementById('spt-bidang')?.value || 'Subbagian Umum dan Kepegawaian';
    const dasar = document.getElementById('spt-dasar')?.value.trim();
    const maksud = document.getElementById('spt-maksud')?.value.trim();
    const tujuan = document.getElementById('spt-tujuan')?.value.trim();
    const tglBerangkat = document.getElementById('spt-tgl-berangkat')?.value;
    const tglKembali = document.getElementById('spt-tgl-kembali')?.value;
    const lama = parseInt(document.getElementById('spt-lama')?.value || '1', 10);

    if (!nomor || !maksud || !tujuan) {
      App.showToast('Mohon lengkapi data surat tugas wajib', 'warning');
      return;
    }

    // Collect personil
    const rows = document.querySelectorAll('#personil-container .personil-row');
    const personil = [];
    rows.forEach(r => {
      const pegId = parseInt(r.querySelector('.select-pegawai')?.value, 10);
      const peg = Store.state.pegawai.find(p => p.id === pegId);
      if (peg) {
        personil.push({
          pegawai_id: peg.id,
          nama: peg.nama,
          nip: peg.nip,
          pangkat: peg.pangkat,
          jabatan: peg.jabatan
        });
      }
    });

    if (!personil.length) {
      App.showToast('Mohon tambahkan minimal 1 personil yang ditugaskan', 'warning');
      return;
    }

    const created = await Store.addSuratTugas({
      no_surat_tugas: nomor,
      bidang_pengusul: bidang,
      dasar: dasar,
      maksud_tugas: maksud,
      tempat_tujuan: tujuan,
      tgl_berangkat: tglBerangkat,
      tgl_kembali: tglKembali,
      lama_hari: lama,
      pejabat_penandatangan: 'PARHA ARIEF, S.AP',
      jabatan_penandatangan: 'Kepala BKPSDM Kabupaten Luwu Timur',
      status_naskah_fisik: 'Naskah fisik disusun & dicetak manual oleh bidang (Tanda tangan basah manual)',
      personil: personil
    });

    if (created) {
      App.closeModal();
      App.showToast(`Nomor SPT berhasil diterbitkan & dicatat: ${created.no_surat_tugas}`, 'success');
      this.render();
      DashboardModule.render();
    }
  },

  // Modal Rincian Pencatatan Agenda SPT (Bukan untuk mencetak naskah)
  viewDetailAgendaSPT(id) {
    const spt = Store.state.surat_tugas.find(s => s.id === id);
    if (!spt) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.innerText = 'Kartu Kendali Agenda Surat Perintah Tugas (SPT)';
    body.innerHTML = `
      <div style="font-size:13px; line-height:1.5;">
        <!-- Status Banner -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 16px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Nomor SPT Resmi Terdaftar:</div>
              <div style="font-family:monospace; font-size:18px; font-weight:800; color:var(--primary); margin-top:2px;">
                ${spt.no_surat_tugas}
              </div>
            </div>
            <button class="btn btn-sm btn-outline" onclick="SuratTugasModule.copyNoSpt('${spt.no_surat_tugas}')">
              Salin Nomor
            </button>
          </div>
          <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #cbd5e1; display:flex; gap:16px; font-size:12px;">
            <div>
              <span style="color:#64748b;">Kode Perbup:</span> 
              <strong style="color:#15803d;">${spt.kode_klasifikasi || '800.1.11.1'}</strong>
            </div>
            <div>
              <span style="color:#64748b;">Status Naskah:</span> 
              <strong style="color:#0284c7;">Fisik Manual Bertanda Tangan Basah</strong>
            </div>
          </div>
        </div>

        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:16px;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:12px;">
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Bidang / Unit Kerja Pembuat SPT:</div>
              <div style="font-weight:700; color:#0f172a; margin-top:3px;">
                ${spt.bidang_pengusul || 'Subbagian Umum dan Kepegawaian'}
              </div>
            </div>
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Pejabat Penandatangan Basah:</div>
              <div style="font-weight:700; color:#0f172a; margin-top:3px;">
                ${spt.pejabat_penandatangan || 'PARHA ARIEF, S.AP'} (${spt.jabatan_penandatangan || 'Kepala BKPSDM Kab. Luwu Timur'})
              </div>
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Maksud Tugas Kedinasan:</div>
            <div style="font-weight:600; color:var(--text-main); margin-top:3px; background:#f8fafc; padding:8px 12px; border-radius:6px;">
              ${spt.maksud_tugas}
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:12px;">
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Tempat Tujuan Tugas:</div>
              <div style="font-weight:600; color:#0f172a; margin-top:3px;">
                ${spt.tempat_tujuan}
              </div>
            </div>
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Jadwal & Lama Penugasan:</div>
              <div style="font-weight:600; color:#0f172a; margin-top:3px;">
                ${spt.tgl_berangkat} s/d ${spt.tgl_kembali} (${spt.lama_hari} Hari)
              </div>
            </div>
          </div>

          <div>
            <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Status Dokumen Fisik:</div>
            <div style="color:#334155; margin-top:3px;">
              ${spt.status_naskah_fisik || 'Dicetak manual oleh bidang pengusul'}
            </div>
          </div>
        </div>

        <!-- Tabel Daftar Personil -->
        <div style="margin-top:16px;">
          <div style="font-size:12px; font-weight:700; text-transform:uppercase; color:#475569; margin-bottom:6px;">
            Personil yang Ditugaskan (${(spt.personil || []).length} Pegawai):
          </div>
          <table class="data-table" style="font-size:12px;">
            <thead>
              <tr style="background:#f1f5f9;">
                <th style="width:30px;">No</th>
                <th>Nama Pegawai & NIP</th>
                <th>Pangkat / Golongan</th>
                <th>Jabatan</th>
              </tr>
            </thead>
            <tbody>
              ${(spt.personil && spt.personil.length > 0) ? (spt.personil || []).map((p, idx) => `
                <tr>
                  <td style="text-align:center;">${idx + 1}</td>
                  <td>
                    <strong>${p.nama}</strong><br>
                    <span style="font-family:monospace; color:#64748b;">NIP. ${p.nip}</span>
                  </td>
                  <td>${p.pangkat || '-'}</td>
                  <td>${p.jabatan || '-'}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="4" style="text-align:center; padding:16px; color:#64748b; font-style:italic;">
                    Daftar nama pegawai yang ditugaskan dicantumkan langsung pada naskah fisik SPT manual oleh bidang pengusul.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>

        <div style="margin-top:16px; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:10px 14px; font-size:11.5px; color:#92400e;">
          💡 <strong>Catatan Agendaris:</strong> Naskah cetak fisik SPT dibuat dan dicetak secara manual oleh bidang pengusul. Bagian Umum hanya memvalidasi agenda ini dan mengunci nomor urut agar tidak bentrok.
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Tutup</button>
      <button class="btn btn-primary" onclick="SuratTugasModule.copyNoSpt('${spt.no_surat_tugas}')">
        Salin Nomor SPT
      </button>
    `;

    App.openModal();
  },

  copyNoSpt(noSpt) {
    navigator.clipboard.writeText(noSpt).then(() => {
      App.showToast(`Nomor SPT ${noSpt} berhasil disalin`, 'success');
    }).catch(() => {
      App.showToast(`Nomor: ${noSpt}`, 'info');
    });
  },

  openPrintPreviewSPT(id) {
    this.showDetail(id);
  },

  openEditModal(id) {
    const spt = Store.state.surat_tugas.find(s => s.id === id);
    if (!spt) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.innerText = `Ubah Data Surat Perintah Tugas: ${spt.no_surat_tugas}`;
    body.innerHTML = `
      <form id="form-edit-spt">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:16px;">
          <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Nomor SPT Resmi Terkunci:</div>
          <div style="font-family:monospace; font-size:16px; font-weight:800; color:var(--primary); margin-top:2px;">
            ${spt.no_surat_tugas}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Bidang / Unit Kerja Pembuat SPT <span class="required">*</span></label>
          <select id="edit-spt-bidang" class="form-control" required>
            <option value="Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian" ${spt.bidang_pengusul && (spt.bidang_pengusul.includes('Pengadaan') || spt.bidang_pengusul.includes('PPK')) ? 'selected' : ''}>Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian</option>
            <option value="Bidang Mutasi, Kepangkatan dan Pengembangan Karir" ${spt.bidang_pengusul && spt.bidang_pengusul.includes('Mutasi') ? 'selected' : ''}>Bidang Mutasi, Kepangkatan dan Pengembangan Karir</option>
            <option value="Bidang Pengembangan Sumber Daya Aparatur" ${spt.bidang_pengusul && (spt.bidang_pengusul.includes('Pengembangan') || spt.bidang_pengusul.includes('Diklat')) ? 'selected' : ''}>Bidang Pengembangan Sumber Daya Aparatur</option>
            <option value="Sekretariat / Subbagian Umum dan Kepegawaian" ${spt.bidang_pengusul && spt.bidang_pengusul.includes('Umum') ? 'selected' : ''}>Sekretariat / Subbagian Umum dan Kepegawaian</option>
            <option value="Subbagian Perencanaan dan Keuangan" ${spt.bidang_pengusul && spt.bidang_pengusul.includes('Perencanaan') ? 'selected' : ''}>Subbagian Perencanaan dan Keuangan</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Maksud Tugas Kedinasan <span class="required">*</span></label>
          <textarea id="edit-spt-maksud" class="form-control" rows="2" required>${spt.maksud_tugas}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tempat Tujuan Tugas <span class="required">*</span></label>
            <input type="text" id="edit-spt-tujuan" class="form-control" value="${spt.tempat_tujuan}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Lama Hari Penugasan</label>
            <input type="number" id="edit-spt-hari" class="form-control" value="${spt.lama_hari}" min="1" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tanggal Berangkat</label>
            <input type="date" id="edit-spt-tgl-berangkat" class="form-control" value="${spt.tgl_berangkat}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Kembali</label>
            <input type="date" id="edit-spt-tgl-kembali" class="form-control" value="${spt.tgl_kembali}" required>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0; padding-top:14px; margin-top:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <label class="form-label" style="margin:0; font-weight:700; color:var(--text-main);">
              Personil yang Ditugaskan <span class="required">*</span>
            </label>
            <button type="button" class="btn btn-outline btn-sm" onclick="SuratTugasModule.addPersonilRow('edit-personil-container')">
              + Tambah Personil
            </button>
          </div>
          <div id="edit-personil-container" style="display:flex; flex-direction:column; gap:8px;">
            <!-- Row personil dynamically generated -->
          </div>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="SuratTugasModule.submitEdit(${spt.id})">Simpan Perubahan</button>
    `;

    App.openModal();

    // Populate existing personil
    if (spt.personil && spt.personil.length) {
      spt.personil.forEach(p => {
        this.addPersonilRow('edit-personil-container', p.pegawai_id);
      });
    } else {
      this.addPersonilRow('edit-personil-container');
    }
  },

  async submitEdit(id) {
    const bidang = document.getElementById('edit-spt-bidang')?.value;
    const maksud = document.getElementById('edit-spt-maksud')?.value.trim();
    const tujuan = document.getElementById('edit-spt-tujuan')?.value.trim();
    const hari = document.getElementById('edit-spt-hari')?.value;
    const tglBerangkat = document.getElementById('edit-spt-tgl-berangkat')?.value;
    const tglKembali = document.getElementById('edit-spt-tgl-kembali')?.value;

    if (!maksud || !tujuan) {
      App.showToast('Maksud tugas dan tempat tujuan wajib diisi', 'warning');
      return;
    }

    // Collect personil from edit form
    const rows = document.querySelectorAll('#edit-personil-container .personil-row');
    const personil = [];
    rows.forEach(r => {
      const pegId = parseInt(r.querySelector('.select-pegawai')?.value, 10);
      const peg = Store.state.pegawai.find(p => p.id === pegId);
      if (peg) {
        personil.push({
          pegawai_id: peg.id,
          nama: peg.nama,
          nip: peg.nip,
          pangkat: peg.pangkat,
          jabatan: peg.jabatan
        });
      }
    });

    if (!personil.length) {
      App.showToast('Mohon tentukan minimal 1 personil yang ditugaskan', 'warning');
      return;
    }

    const updated = await Store.updateSuratTugas(id, {
      bidang_pengusul: bidang,
      maksud_tugas: maksud,
      tempat_tujuan: tujuan,
      lama_hari: parseInt(hari, 10),
      tgl_berangkat: tglBerangkat,
      tgl_kembali: tglKembali,
      personil: personil
    });

    if (updated) {
      App.closeModal();
      App.showToast('Data SPT berhasil diperbarui', 'success');
      this.render();
      DashboardModule.render();
    }
  },

  async confirmDelete(id) {
    const spt = Store.state.surat_tugas.find(s => s.id === id);
    if (!spt) return;

    if (confirm(`Yakin ingin menghapus Surat Perintah Tugas ${spt.no_surat_tugas}?`)) {
      const ok = await Store.deleteSuratTugas(id);
      if (ok) {
        App.showToast(`SPT ${spt.no_surat_tugas} berhasil dihapus`, 'success');
        this.render();
        DashboardModule.render();
      }
    }
  },

  copyNoSpt(text) {
    navigator.clipboard.writeText(text).then(() => {
      App.showToast(`Nomor SPT ${text} berhasil disalin ke clipboard!`, 'success');
    }).catch(() => {
      App.showToast(`Nomor: ${text}`, 'info');
    });
  }
};
