// Surat Masuk Module - Sistem Informasi Persuratan BKPSDM Luwu Timur
const SuratMasukModule = {
  currentStatusFilter: 'all',

  render() {
    const container = document.getElementById('view-surat-masuk');
    if (!container) return;

    let list = Store.state.surat_masuk || [];
    if (this.currentStatusFilter !== 'all') {
      list = list.filter(s => s.status_disposisi === this.currentStatusFilter);
    }

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <h2>Buku Agenda & Pengelolaan Surat Masuk</h2>
            <p>Pencatatan ganda: Nomor/Kode Surat Asal Pengirim vs Kode Klasifikasi Internal BKPSDM (Perbup 69/2023)</p>
          </div>
          <div style="display:flex; gap:10px;">
            <div style="position:relative; width: 240px;">
              <input type="text" id="search-sm" class="form-control" placeholder="Cari surat masuk..." oninput="SuratMasukModule.filterTable()">
            </div>
            <button class="btn btn-primary" onclick="SuratMasukModule.openCreateModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Tambah Surat Masuk
            </button>
          </div>
        </div>

        <!-- Filter Bar Status Disposisi & Tanggal -->
        <div style="background:#f8fafc; padding:10px 24px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; gap:8px; align-items:center;">
            <span style="font-size:12px; font-weight:700; color:#475569; text-transform:uppercase;">Status Disposisi:</span>
            <button class="btn btn-sm ${this.currentStatusFilter === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="SuratMasukModule.setStatusFilter('all')">
              Semua (${Store.state.surat_masuk.length})
            </button>
            <button class="btn btn-sm ${this.currentStatusFilter === 'Menunggu Disposisi' ? 'btn-primary' : 'btn-outline'}" onclick="SuratMasukModule.setStatusFilter('Menunggu Disposisi')">
              ⏳ Menunggu Disposisi (${Store.state.surat_masuk.filter(s => s.status_disposisi === 'Menunggu Disposisi').length})
            </button>
            <button class="btn btn-sm ${this.currentStatusFilter === 'Didisposisi' ? 'btn-primary' : 'btn-outline'}" onclick="SuratMasukModule.setStatusFilter('Didisposisi')">
              ✍️ Didisposisi (${Store.state.surat_masuk.filter(s => s.status_disposisi === 'Didisposisi').length})
            </button>
            <button class="btn btn-sm ${this.currentStatusFilter === 'Selesai' ? 'btn-primary' : 'btn-outline'}" onclick="SuratMasukModule.setStatusFilter('Selesai')">
              ✓ Selesai (${Store.state.surat_masuk.filter(s => s.status_disposisi === 'Selesai').length})
            </button>
          </div>
          <div style="display:flex; align-items:center; gap:8px; font-size:12px;">
            <span style="color:#64748b;">Filter Tgl:</span>
            <input type="date" id="filter-sm-start" class="form-control form-control-sm" style="width:130px;" onchange="SuratMasukModule.filterTable()">
            <span style="color:#64748b;">s/d</span>
            <input type="date" id="filter-sm-end" class="form-control form-control-sm" style="width:130px;" onchange="SuratMasukModule.filterTable()">
          </div>
        </div>

        <div class="card-body" style="padding:0;">
          <div class="table-responsive">
            <table class="data-table" id="table-surat-masuk">
              <thead>
                <tr>
                  <th style="width: 130px;">No. Agenda</th>
                  <th>Identitas Pengirim & Nomor Asal</th>
                  <th>Perihal Surat</th>
                  <th>Klasifikasi Internal BKPSDM</th>
                  <th>Tanggal Diterima</th>
                  <th>Sifat</th>
                  <th>Status Disposisi</th>
                  <th style="text-align:right;">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbody-surat-masuk">
                ${this.renderRows(list)}
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer">
          <span style="font-size:12.5px; color:var(--text-muted);">
            Menampilkan <strong>${list.length}</strong> dari total <strong>${Store.state.surat_masuk.length}</strong> data surat masuk
          </span>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" onclick="App.navigate('laporan')">
              Cetak Buku Agenda Surat Masuk
            </button>
          </div>
        </div>
      </div>
    `;
  },

  setStatusFilter(status) {
    this.currentStatusFilter = status;
    this.render();
  },

  renderRows(list) {
    if (!list.length) {
      return `<tr><td colspan="8" style="text-align:center; padding:32px; color:#94a3b8;">Belum ada data surat masuk yang sesuai filter.</td></tr>`;
    }

    return list.map(s => `
      <tr>
        <td>
          <span style="font-weight:700; color:var(--primary); font-family:monospace; font-size:13px;">
            ${s.no_agenda}
          </span>
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-main);">${s.instansi_pengirim}</div>
          <div style="margin-top:3px;">
            <span style="font-size:11px; color:#64748b;">No. Surat Pengirim:</span>
            <span class="code-tag code-tag-pengirim">${s.no_surat_pengirim}</span>
          </div>
        </td>
        <td>
          <div style="font-weight:600; font-size:13px; line-height:1.35; max-width:280px; color:var(--text-main);">
            ${s.perihal}
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="code-tag code-tag-internal">Kode ${s.kode_internal}</span>
          </div>
          <div style="font-size:11.5px; color:#166534; font-weight:500; margin-top:3px; max-width:220px; line-height:1.2;">
            ${s.nama_klasifikasi_internal}
          </div>
        </td>
        <td>
          <div style="font-size:13px; font-weight:500;">${App.formatIndoDate(s.tgl_diterima)}</div>
          <div style="font-size:11px; color:var(--text-muted);">Surat: ${App.formatIndoDate(s.tgl_surat)}</div>
        </td>
        <td>
          <span class="badge badge-${s.sifat_surat.toLowerCase()}">${s.sifat_surat}</span>
        </td>
        <td>
          <span class="badge badge-${s.status_disposisi === 'Menunggu Disposisi' ? 'menunggu' : (s.status_disposisi === 'Didisposisi' ? 'didisposisi' : 'selesai')}">
            ${s.status_disposisi}
          </span>
        </td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:4px; flex-wrap:wrap; justify-content:flex-end;">
            <button class="btn btn-outline btn-sm" onclick="SuratMasukModule.showDetail(${s.id})" title="Lihat Rincian Agenda Surat">
              Detail
            </button>
            ${s.status_disposisi === 'Menunggu Disposisi' ? `
              <button class="btn btn-outline btn-sm" style="background:#fffbeb; color:#b45309; border-color:#fcd34d; font-weight:700;" onclick="DisposisiModule.openCreateModal(${s.id})" title="Catat Lembar Disposisi Surat Ini">
                ✍️ Catat Disposisi
              </button>
            ` : `
              <button class="btn btn-outline btn-sm" style="background:#f0fdf4; color:#15803d; border-color:#86efac; font-weight:700;" onclick="DisposisiModule.showDetailBySuratMasukId(${s.id})" title="Lihat Rincian Disposisi Surat Ini">
                📄 Disposisi
              </button>
            `}
            <button class="btn btn-outline btn-sm" style="color:#0284c7; border-color:#bae6fd;" onclick="SuratMasukModule.openEditModal(${s.id})" title="Ubah Data Surat Masuk">
              Ubah
            </button>
            <button class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fecaca;" onclick="SuratMasukModule.confirmDelete(${s.id})" title="Hapus Surat Masuk">
              Hapus
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  filterTable() {
    const q = (document.getElementById('search-sm')?.value || '').toLowerCase();
    const tglStart = document.getElementById('filter-sm-start')?.value;
    const tglEnd = document.getElementById('filter-sm-end')?.value;

    let list = Store.state.surat_masuk.filter(s => {
      const matchText = s.no_agenda.toLowerCase().includes(q) ||
        s.no_surat_pengirim.toLowerCase().includes(q) ||
        s.instansi_pengirim.toLowerCase().includes(q) ||
        s.perihal.toLowerCase().includes(q) ||
        s.kode_internal.toLowerCase().includes(q);

      const matchStatus = this.currentStatusFilter === 'all' || s.status_disposisi === this.currentStatusFilter;

      let matchDate = true;
      if (tglStart && s.tgl_diterima < tglStart) matchDate = false;
      if (tglEnd && s.tgl_diterima > tglEnd) matchDate = false;

      return matchText && matchStatus && matchDate;
    });

    const tbody = document.getElementById('tbody-surat-masuk');
    if (tbody) tbody.innerHTML = this.renderRows(list);
  },

  openCreateModal() {
    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.innerText = 'Pencatatan Surat Masuk Baru';
    body.innerHTML = `
      <form id="form-surat-masuk">
        <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:16px;">
          <div style="font-weight:700; color:var(--primary); font-size:12.5px; margin-bottom:4px;">
            ℹ️ Konsep Pencatatan Dual-Identification
          </div>
          <div style="font-size:11.5px; color:#475569; line-height:1.4;">
            Surat masuk mencatat <strong>Nomor Asli dari Instansi Pengirim</strong> dan <strong>Kode Klasifikasi Arsip Internal BKPSDM</strong> yang otomatis disarankan dari perihal berdasarkan Perbup Luwu Timur No. 69 Tahun 2023.
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Instansi Pengirim Surat <span class="required">*</span></label>
            <input type="text" id="sm-instansi" class="form-control" placeholder="Contoh: Sekretariat Daerah Kab. Luwu Timur" required>
          </div>
          <div class="form-group">
            <label class="form-label">Nomor / Kode Surat dari Pengirim <span class="required">*</span></label>
            <input type="text" id="sm-no-pengirim" class="form-control" placeholder="Contoh: 005/182/SETDA" required>
            <span class="form-hint">Nomor asli dari instansi/OPD asal</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Perihal Surat <span class="required">*</span> (Ketik perihal untuk auto-suggest kode)</label>
          <div class="autosuggest-wrapper">
            <textarea id="sm-perihal" class="form-control" rows="2" placeholder="Contoh: Permohonan Cuti Tahunan Pegawai atau Usulan Kenaikan Pangkat..." required></textarea>
          </div>
          <span class="form-hint">⚡ Sistem akan mencocokkan kata kunci perihal dengan kamus Perbup 69/2023 secara real-time.</span>
        </div>

        <div class="form-row" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px; margin-bottom:18px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="color:#166534;">Kode Klasifikasi Sesuai Perbup 69/2023 <span class="required">*</span></label>
            <input type="text" id="sm-kode-internal" class="form-control" style="font-family:monospace; font-weight:700; color:#15803d;" placeholder="Contoh: 000.1.5 / 800.1.3.2 / 900.1.3" required>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="color:#166534;">Nama / Keterangan Klasifikasi</label>
            <input type="text" id="sm-nama-internal" class="form-control" placeholder="Keterangan klasifikasi" readonly style="background:#ffffff;">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tanggal Surat</label>
            <input type="date" id="sm-tgl-surat" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Diterima BKPSDM</label>
            <input type="date" id="sm-tgl-diterima" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Sifat Surat</label>
            <select id="sm-sifat" class="form-control">
              <option value="Biasa">Biasa</option>
              <option value="Segera" selected>Segera</option>
              <option value="Penting">Penting</option>
              <option value="Rahasia">Rahasia</option>
            </select>
          </div>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="SuratMasukModule.submitCreate()">Simpan Surat Masuk</button>
    `;

    App.openModal();

    // Attach Smart AutoSuggest to Perihal input!
    new SmartAutoSuggest({
      input: '#sm-perihal',
      targetCode: '#sm-kode-internal',
      targetName: '#sm-nama-internal'
    });
  },

  handleFileSelect(e) {
    const file = e.target.files[0];
    const label = document.getElementById('sm-file-label');
    if (file && label) {
      label.innerHTML = `✓ Berkas Terpilih: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB)`;
      label.style.color = '#15803d';
    }
  },

  async submitCreate() {
    const instansi = document.getElementById('sm-instansi')?.value.trim();
    const noPengirim = document.getElementById('sm-no-pengirim')?.value.trim();
    const perihal = document.getElementById('sm-perihal')?.value.trim();
    const kodeInternal = document.getElementById('sm-kode-internal')?.value.trim();
    const namaInternal = document.getElementById('sm-nama-internal')?.value.trim();
    const tglSurat = document.getElementById('sm-tgl-surat')?.value;
    const tglDiterima = document.getElementById('sm-tgl-diterima')?.value;
    const sifat = document.getElementById('sm-sifat')?.value;

    if (!instansi || !noPengirim || !perihal || !kodeInternal) {
      App.showToast('Mohon lengkapi seluruh field yang bertanda bintang (*)', 'warning');
      return;
    }

    const created = await Store.addSuratMasuk({
      instansi_pengirim: instansi,
      no_surat_pengirim: noPengirim,
      perihal: perihal,
      kode_internal: kodeInternal,
      nama_klasifikasi_internal: namaInternal || 'Kepegawaian',
      tgl_surat: tglSurat,
      tgl_diterima: tglDiterima,
      sifat_surat: sifat,
      status_disposisi: 'Menunggu Disposisi'
    });

    if (created) {
      App.closeModal();
      App.showToast(`Surat masuk berhasil dicatat dengan Nomor Agenda ${created.no_agenda}`, 'success');
      this.render();
      DashboardModule.render();
    }
  },

  openEditModal(id) {
    const s = Store.state.surat_masuk.find(item => item.id === id);
    if (!s) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.innerText = `Ubah Data Surat Masuk: ${s.no_agenda}`;
    body.innerHTML = `
      <form id="form-edit-sm">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Instansi Pengirim Surat <span class="required">*</span></label>
            <input type="text" id="edit-sm-instansi" class="form-control" value="${s.instansi_pengirim}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Nomor / Kode Surat dari Pengirim <span class="required">*</span></label>
            <input type="text" id="edit-sm-no-pengirim" class="form-control" value="${s.no_surat_pengirim}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Perihal Surat <span class="required">*</span></label>
          <div class="autosuggest-wrapper">
            <textarea id="edit-sm-perihal" class="form-control" rows="2" required>${s.perihal}</textarea>
          </div>
        </div>

        <div class="form-row" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px; margin-bottom:18px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="color:#166534;">Kode Klasifikasi Internal (Perbup 69/2023) <span class="required">*</span></label>
            <input type="text" id="edit-sm-kode-internal" class="form-control" style="font-family:monospace; font-weight:700; color:#15803d;" value="${s.kode_internal}" required>
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="color:#166534;">Nama / Keterangan Klasifikasi</label>
            <input type="text" id="edit-sm-nama-internal" class="form-control" value="${s.nama_klasifikasi_internal}" readonly style="background:#ffffff;">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tanggal Surat</label>
            <input type="date" id="edit-sm-tgl-surat" class="form-control" value="${s.tgl_surat}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Diterima</label>
            <input type="date" id="edit-sm-tgl-diterima" class="form-control" value="${s.tgl_diterima}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Sifat Surat</label>
            <select id="edit-sm-sifat" class="form-control">
              <option value="Biasa" ${s.sifat_surat === 'Biasa' ? 'selected' : ''}>Biasa</option>
              <option value="Segera" ${s.sifat_surat === 'Segera' ? 'selected' : ''}>Segera</option>
              <option value="Penting" ${s.sifat_surat === 'Penting' ? 'selected' : ''}>Penting</option>
              <option value="Rahasia" ${s.sifat_surat === 'Rahasia' ? 'selected' : ''}>Rahasia</option>
            </select>
          </div>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="SuratMasukModule.submitEdit(${s.id})">Simpan Perubahan</button>
    `;

    App.openModal();

    new SmartAutoSuggest({
      input: '#edit-sm-perihal',
      targetCode: '#edit-sm-kode-internal',
      targetName: '#edit-sm-nama-internal'
    });
  },

  async submitEdit(id) {
    const instansi = document.getElementById('edit-sm-instansi')?.value.trim();
    const noPengirim = document.getElementById('edit-sm-no-pengirim')?.value.trim();
    const perihal = document.getElementById('edit-sm-perihal')?.value.trim();
    const kodeInternal = document.getElementById('edit-sm-kode-internal')?.value.trim();
    const namaInternal = document.getElementById('edit-sm-nama-internal')?.value.trim();
    const tglSurat = document.getElementById('edit-sm-tgl-surat')?.value;
    const tglDiterima = document.getElementById('edit-sm-tgl-diterima')?.value;
    const sifat = document.getElementById('edit-sm-sifat')?.value;

    if (!instansi || !noPengirim || !perihal || !kodeInternal) {
      App.showToast('Mohon lengkapi seluruh field yang bertanda bintang (*)', 'warning');
      return;
    }

    const updated = await Store.updateSuratMasuk(id, {
      instansi_pengirim: instansi,
      no_surat_pengirim: noPengirim,
      perihal: perihal,
      kode_internal: kodeInternal,
      nama_klasifikasi_internal: namaInternal,
      tgl_surat: tglSurat,
      tgl_diterima: tglDiterima,
      sifat_surat: sifat
    });

    if (updated) {
      App.closeModal();
      App.showToast('Data surat masuk berhasil diperbarui', 'success');
      this.render();
      DashboardModule.render();
    }
  },

  async confirmDelete(id) {
    const s = Store.state.surat_masuk.find(item => item.id === id);
    if (!s) return;

    if (confirm(`Yakin ingin menghapus surat masuk ${s.no_agenda} (${s.instansi_pengirim})? Seluruh riwayat disposisi terkait juga akan terhapus.`)) {
      const ok = await Store.deleteSuratMasuk(id);
      if (ok) {
        App.showToast(`Surat masuk ${s.no_agenda} berhasil dihapus`, 'success');
        this.render();
        DashboardModule.render();
      }
    }
  },

  showDetail(id) {
    const s = Store.state.surat_masuk.find(item => item.id === id);
    if (!s) return;

    const disp = Store.state.disposisi.filter(d => d.id_surat_masuk === id);

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.innerText = `Detail Surat Masuk: ${s.no_agenda}`;
    body.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:18px;">
        <!-- Card Penyandingan Nomor Asli Pengirim & Kode Klasifikasi Perbup -->
        <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:10px; padding:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; border-bottom:1px solid #bbf7d0; padding-bottom:8px;">
            <div style="font-size:12px; font-weight:800; color:#15803d; text-transform:uppercase; letter-spacing:0.5px;">
              🔗 Penyandingan Nomor Surat Pengirim & Kode Klasifikasi Kearsipan (Perbup 69/2023)
            </div>
            <span class="badge badge-success" style="font-size:11px;">Disandingkan Sah</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr auto 1.2fr; gap:14px; align-items:center;">
            <!-- Sisi Kiri: Nomor Pengirim Asli -->
            <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
              <div style="font-size:10.5px; text-transform:uppercase; color:#64748b; font-weight:700;">Instansi Pengirim Asal:</div>
              <div style="font-size:13.5px; font-weight:700; color:#0f172a; margin-top:2px;">${s.instansi_pengirim}</div>
              <div style="margin-top:6px;">
                <span style="font-size:11px; color:#475569;">Nomor Surat Pengirim:</span><br>
                <span class="code-tag code-tag-pengirim" style="font-size:12.5px; font-weight:800; margin-top:2px; display:inline-block;">
                  ${s.no_surat_pengirim}
                </span>
              </div>
            </div>

            <!-- Simbol Penghubung / Sanding -->
            <div style="text-align:center; font-size:22px; font-weight:900; color:#16a34a;" title="Disandingkan ke Kode Klasifikasi Resmi">
              ⇄
            </div>

            <!-- Sisi Kanan: Kodifikasi Perbup BKPSDM -->
            <div style="background:#ffffff; border:1px solid #86efac; border-radius:8px; padding:12px;">
              <div style="font-size:10.5px; text-transform:uppercase; color:#166534; font-weight:700;">Klasifikasi Arsip BKPSDM (Perbup No. 69/2023):</div>
              <div style="margin-top:4px;">
                <span class="code-tag code-tag-internal" style="font-size:13px; font-weight:800;">
                  Kode ${s.kode_internal}
                </span>
              </div>
              <div style="font-size:12px; font-weight:600; color:#15803d; margin-top:4px; line-height:1.35;">
                ${s.nama_klasifikasi_internal}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:#64748b;">Perihal Surat Masuk</label>
          <div style="font-size:14.5px; font-weight:600; line-height:1.4; color:var(--text-main); margin-top:3px;">
            ${s.perihal}
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; border-top:1px solid #e2e8f0; padding-top:14px;">
          <div>
            <div style="font-size:11px; color:#64748b;">Tanggal Surat:</div>
            <div style="font-weight:600; font-size:13px;">${s.tgl_surat}</div>
          </div>
          <div>
            <div style="font-size:11px; color:#64748b;">Tanggal Diterima:</div>
            <div style="font-weight:600; font-size:13px;">${s.tgl_diterima}</div>
          </div>
          <div>
            <div style="font-size:11px; color:#64748b;">Sifat & Status Disposisi:</div>
            <div style="display:flex; gap:6px; margin-top:2px;">
              <span class="badge badge-${s.sifat_surat.toLowerCase()}">${s.sifat_surat}</span>
              <span class="badge badge-${s.status_disposisi === 'Menunggu Disposisi' ? 'menunggu' : (s.status_disposisi === 'Didisposisi' ? 'didisposisi' : 'selesai')}">
                ${s.status_disposisi}
              </span>
            </div>
          </div>
        </div>

        <!-- Riwayat Disposisi -->
        <div style="border-top:1px solid #e2e8f0; padding-top:16px;">
          <h4 style="font-size:13.5px; font-weight:700; color:var(--text-main); margin-bottom:10px;">
            Riwayat Disposisi Plt. Kepala BKPSDM (${disp.length})
          </h4>
          ${disp.length ? disp.map(d => `
            <div style="background:#fafbfc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:var(--primary); font-size:13px;">Diteruskan ke: ${d.tujuan_nama}</span>
                <span style="font-size:11px; color:#64748b;">${d.created_at}</span>
              </div>
              <div style="margin-top:6px; font-size:12.5px;">
                <strong>Instruksi:</strong> ${(d.instruksi || []).join(', ')}
              </div>
              ${d.catatan ? `<div style="margin-top:4px; font-size:12.5px; color:#334155;"><em>"${d.catatan}"</em></div>` : ''}
              <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
                <span class="badge badge-${d.status_tindak_lanjut === 'Selesai' ? 'selesai' : 'didisposisi'}">
                  Status: ${d.status_tindak_lanjut}
                </span>
                ${d.tindak_lanjut_note ? `<span style="font-size:11.5px; color:#059669;">Tindak Lanjut: ${d.tindak_lanjut_note}</span>` : ''}
              </div>
            </div>
          `).join('') : `
            <div style="padding:14px; background:#fffbeb; border:1px solid #fef3c7; border-radius:8px; font-size:12.5px; color:#92400e;">
              Surat ini belum didisposisikan oleh Plt. Kepala BKPSDM.
            </div>
          `}
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Tutup</button>
      <button class="btn btn-primary" onclick="App.closeModal(); DisposisiModule.selectSuratAndNavigate(${s.id})">
        ${disp.length ? '📄 Rincian Disposisi' : '✍️ Catat Disposisi'}
      </button>
    `;

    App.openModal();
  }
};
