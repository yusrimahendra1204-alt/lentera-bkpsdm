// Disposisi Module - Sistem Informasi Persuratan BKPSDM Kabupaten Luwu Timur
// Format Tabel Pencatatan & Pengelolaan Terpadu Sesuai Format Surat Masuk / Keluar
// Perekaman Data Lembar Disposisi Fisik Kepala BKPSDM Luwu Timur
const DisposisiModule = {
  currentFilter: 'all', // 'all', 'pending', 'didisposisi'
  currentSifatFilter: 'all',

  // 6 Jabatan Struktural Resmi BKPSDM Luwu Timur pada Lembar Disposisi Fisik
  JABATAN_TUJUAN: [
    '1. Sekertaris',
    '2. Kasubag. Umum dan Kepegawaian',
    '3. Kasubag. Perencana dan Keuangan',
    '4. Kabid. Pengembangan Sumber Daya Aparatur',
    '5. Kabid. Mutasi, Kepangkatan dan Pengembangan Karir',
    '6. Kabid. Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian'
  ],

  // 9 Butir Instruksi Resmi pada Lembar Disposisi Fisik
  INSTRUKSI_RESMI: [
    'Tanggapan/Saran',
    'Koreksi/Penyempurnaan',
    'Laksanakan',
    'Koordinasikan/Konfirmasikan',
    'Wakili/Dampingi',
    'Siapkan Bahan',
    'Proses Sesuai Ketentuan',
    'Jadwalkan/Laporkan',
    'File/Simpan/Edarkan'
  ],

  // Pejabat Penandatangan Resmi (Kepala BKPSDM Kab. Luwu Timur)
  PIMPINAN_BKPSDM: {
    nama: 'PARHA ARIEF, S.AP',
    jabatan: 'Kepala BKPSDM Kabupaten Luwu Timur',
    pangkat: 'Pembina',
    nip: '19840114 200312 2 001'
  },

  render() {
    const container = document.getElementById('view-disposisi');
    if (!container) return;

    const smList = Store.state.surat_masuk || [];
    const dispList = Store.state.disposisi || [];

    const pendingCount = smList.filter(s => s.status_disposisi === 'Menunggu Disposisi').length;
    const disposedCount = smList.filter(s => s.status_disposisi !== 'Menunggu Disposisi').length;

    const filteredItems = this.getFilteredData();

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="regulation-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Pencatatan Disposisi Fisik BKPSDM Luwu Timur
              </span>
              <span class="badge badge-info" style="font-size:11px; padding:3px 8px; font-weight:700;">
                Kepala BKPSDM: ${this.PIMPINAN_BKPSDM.nama}
              </span>
            </div>
            <h2 style="margin-top:4px;">Pencatatan & Pengelolaan Disposisi Surat Masuk</h2>
            <p>Perekaman data petunjuk lembar disposisi manual pimpinan (6 Jabatan Struktural & 9 Butir Instruksi Resmi) yang terintegrasi langsung dengan Surat Masuk.</p>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <div style="position:relative; width: 260px;">
              <input type="text" id="search-disp" class="form-control" placeholder="Cari agenda / pengirim / perihal..." oninput="DisposisiModule.filterTable()">
            </div>
            <button class="btn btn-primary" onclick="DisposisiModule.openCreateModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              + Catat Disposisi Baru
            </button>
          </div>
        </div>

        <!-- Filter Bar Status Disposisi & Sifat -->
        <div style="background:#f8fafc; padding:10px 24px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <span style="font-size:12px; font-weight:700; color:#475569; text-transform:uppercase;">Status Disposisi:</span>
            <button class="btn btn-sm ${this.currentFilter === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="DisposisiModule.setFilter('all')">
              Semua Surat Masuk (${smList.length})
            </button>
            <button class="btn btn-sm ${this.currentFilter === 'pending' ? 'btn-primary' : 'btn-outline'}" onclick="DisposisiModule.setFilter('pending')">
              ⏳ Menunggu Disposisi (${pendingCount})
            </button>
            <button class="btn btn-sm ${this.currentFilter === 'didisposisi' ? 'btn-primary' : 'btn-outline'}" onclick="DisposisiModule.setFilter('didisposisi')">
              ✍️ Sudah Didisposisi (${disposedCount})
            </button>
          </div>
          <div style="display:flex; align-items:center; gap:8px; font-size:12px;">
            <span style="color:#64748b; font-weight:600;">Sifat Disposisi:</span>
            <select id="filter-disp-sifat" class="form-control form-control-sm" style="width:160px; font-weight:600;" onchange="DisposisiModule.onSifatFilterChange(this.value)">
              <option value="all" ${this.currentSifatFilter === 'all' ? 'selected' : ''}>Semua Sifat</option>
              <option value="A. Sangat Segera" ${this.currentSifatFilter === 'A. Sangat Segera' ? 'selected' : ''}>A. Sangat Segera</option>
              <option value="B. Segera" ${this.currentSifatFilter === 'B. Segera' ? 'selected' : ''}>B. Segera</option>
              <option value="C. Rahasia" ${this.currentSifatFilter === 'C. Rahasia' ? 'selected' : ''}>C. Rahasia</option>
            </select>
          </div>
        </div>

        <div class="card-body" style="padding:0;">
          <div class="table-responsive">
            <table class="data-table" id="table-disposisi">
              <thead>
                <tr>
                  <th style="width: 140px;">No. Agenda SM</th>
                  <th>Surat Masuk (Pengirim & No. Asal)</th>
                  <th>Perihal Surat</th>
                  <th>Sifat Disposisi</th>
                  <th>Diteruskan Kepada (6 Jabatan)</th>
                  <th>Instruksi Resmi (9 Butir)</th>
                  <th>Catatan Pimpinan</th>
                  <th>Status</th>
                  <th style="text-align:right; width: 170px;">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbody-disposisi">
                ${this.renderRows(filteredItems)}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-footer">
          <span style="font-size:12.5px; color:var(--text-muted);">
            Menampilkan <strong>${filteredItems.length}</strong> dari total <strong>${smList.length}</strong> surat masuk yang terhubung dengan disposisi
          </span>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" onclick="App.navigate('surat-masuk')">
              ← Buka Agenda Surat Masuk
            </button>
          </div>
        </div>
      </div>
    `;
  },

  setFilter(filter) {
    this.currentFilter = filter;
    this.render();
  },

  onSifatFilterChange(val) {
    this.currentSifatFilter = val;
    this.render();
  },

  getFilteredData() {
    const smList = Store.state.surat_masuk || [];
    const dispList = Store.state.disposisi || [];
    const q = (document.getElementById('search-disp')?.value || '').toLowerCase().trim();

    return smList.map(sm => {
      const disp = dispList.find(d => d.id_surat_masuk === sm.id) || null;
      return { sm, disp };
    }).filter(item => {
      const { sm, disp } = item;

      // Filter Status
      if (this.currentFilter === 'pending' && sm.status_disposisi !== 'Menunggu Disposisi') return false;
      if (this.currentFilter === 'didisposisi' && sm.status_disposisi === 'Menunggu Disposisi') return false;

      // Filter Sifat
      if (this.currentSifatFilter !== 'all') {
        const itemSifat = disp ? disp.sifat : '';
        if (itemSifat !== this.currentSifatFilter) return false;
      }

      // Filter Search query
      if (q) {
        const textToSearch = [
          sm.no_agenda,
          sm.no_surat_pengirim,
          sm.instansi_pengirim,
          sm.perihal,
          sm.kode_internal,
          disp ? (disp.diteruskan_kepada || []).join(' ') : '',
          disp ? (disp.instruksi || []).join(' ') : '',
          disp ? (disp.catatan || '') : ''
        ].join(' ').toLowerCase();

        if (!textToSearch.includes(q)) return false;
      }

      return true;
    });
  },

  filterTable() {
    const tbody = document.getElementById('tbody-disposisi');
    if (!tbody) return;
    const filtered = this.getFilteredData();
    tbody.innerHTML = this.renderRows(filtered);
  },

  renderRows(items) {
    if (!items.length) {
      return `
        <tr>
          <td colspan="9" style="text-align:center; padding:38px 20px; color:#94a3b8;">
            <div style="font-size:32px; margin-bottom:8px;">📬</div>
            <div style="font-weight:600; font-size:14px; color:#475569;">Tidak ada data disposisi yang sesuai kriteria pencarian.</div>
            <div style="font-size:12px; margin-top:4px;">Klik "+ Catat Disposisi Baru" untuk merekam hasil disposisi lembar fisik pimpinan.</div>
          </td>
        </tr>
      `;
    }

    return items.map(({ sm, disp }) => {
      const isDisposed = Boolean(disp);
      const diteruskan = disp && disp.diteruskan_kepada ? disp.diteruskan_kepada : [];
      const instruksi = disp && disp.instruksi ? disp.instruksi : [];
      const sifat = disp ? disp.sifat : (sm.sifat_surat === 'Rahasia' ? 'C. Rahasia' : 'B. Segera');
      const catatan = disp && disp.catatan ? disp.catatan : '';

      // Format Sifat Badge
      let sifatBadge = `<span class="badge badge-outline" style="font-size:11px; color:#94a3b8;">Belum diatur</span>`;
      if (isDisposed) {
        if (sifat.includes('Sangat Segera')) {
          sifatBadge = `<span class="badge badge-danger" style="font-size:11px; font-weight:700;">${sifat}</span>`;
        } else if (sifat.includes('Segera')) {
          sifatBadge = `<span class="badge badge-warning" style="font-size:11px; font-weight:700;">${sifat}</span>`;
        } else {
          sifatBadge = `<span class="badge" style="background:#581c87; color:#f3e8ff; font-size:11px; font-weight:700;">${sifat}</span>`;
        }
      }

      return `
        <tr>
          <!-- No Agenda -->
          <td>
            <span style="font-weight:800; color:var(--primary); font-family:monospace; font-size:13px;">
              ${sm.no_agenda}
            </span>
            <div style="font-size:11px; color:#64748b; margin-top:3px;">
              Tgl Terima: ${sm.tgl_diterima}
            </div>
          </td>

          <!-- Surat Masuk (Pengirim & No. Asal) -->
          <td>
            <div style="font-weight:700; color:var(--text-main); font-size:13px;">${sm.instansi_pengirim}</div>
            <div style="margin-top:3px;">
              <span style="font-size:11px; color:#64748b;">No. Asal:</span>
              <span class="code-tag code-tag-pengirim">${sm.no_surat_pengirim}</span>
            </div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">
              Tgl Surat: ${sm.tgl_surat}
            </div>
          </td>

          <!-- Perihal & Kode Klasifikasi -->
          <td>
            <div style="font-weight:600; font-size:13px; line-height:1.35; max-width:240px; color:var(--text-main);">
              ${sm.perihal}
            </div>
            <div style="margin-top:4px;">
              <span class="code-tag code-tag-internal">Kode ${sm.kode_internal}</span>
            </div>
          </td>

          <!-- Sifat Disposisi -->
          <td>
            ${sifatBadge}
          </td>

          <!-- Diteruskan Kepada (6 Jabatan Struktural) -->
          <td>
            ${isDisposed && diteruskan.length ? `
              <div style="display:flex; flex-direction:column; gap:3px; max-width:210px;">
                ${diteruskan.map(j => `
                  <span class="code-tag" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; font-size:11px; white-space:normal; line-height:1.25; padding:2px 6px;">
                    ✓ ${j}
                  </span>
                `).join('')}
              </div>
            ` : `
              <span style="font-size:11.5px; color:#94a3b8; font-style:italic;">Belum dicatat</span>
            `}
          </td>

          <!-- Instruksi Resmi (9 Butir) -->
          <td>
            ${isDisposed && instruksi.length ? `
              <div style="display:flex; flex-direction:column; gap:3px; max-width:190px;">
                ${instruksi.map(inst => `
                  <span class="code-tag" style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; font-size:11px; white-space:normal; line-height:1.2; padding:2px 6px;">
                    • ${inst}
                  </span>
                `).join('')}
              </div>
            ` : `
              <span style="font-size:11.5px; color:#94a3b8; font-style:italic;">Belum dicatat</span>
            `}
          </td>

          <!-- Catatan Pimpinan -->
          <td>
            ${isDisposed && catatan ? `
              <div style="font-size:12.5px; color:#334155; font-style:italic; max-width:200px; line-height:1.35; background:#f8fafc; padding:4px 8px; border-left:3px solid #0284c7; border-radius:3px;">
                "${catatan}"
              </div>
            ` : (isDisposed ? `
              <span style="font-size:11.5px; color:#94a3b8;">- Tidak ada catatan -</span>
            ` : `
              <span style="font-size:11.5px; color:#94a3b8; font-style:italic;">-</span>
            `)}
          </td>

          <!-- Status -->
          <td>
            <span class="badge ${sm.status_disposisi === 'Menunggu Disposisi' ? 'badge-menunggu' : 'badge-didisposisi'}">
              ${sm.status_disposisi}
            </span>
          </td>

          <!-- Aksi -->
          <td style="text-align:right;">
            <div style="display:inline-flex; gap:4px; flex-wrap:wrap; justify-content:flex-end;">
              ${isDisposed ? `
                <button class="btn btn-outline btn-sm" onclick="DisposisiModule.showDetail(${disp.id})" title="Lihat Rincian Catatan Disposisi">
                  Detail
                </button>
                <button class="btn btn-outline btn-sm" style="background:#f0fdf4; color:#15803d; border-color:#86efac; font-weight:700;" onclick="DisposisiModule.printLembarDisposisi(${disp.id})" title="Cetak Lembar Disposisi Resmi A4">
                  🖨️ Cetak
                </button>
                <button class="btn btn-outline btn-sm" style="color:#0284c7; border-color:#bae6fd;" onclick="DisposisiModule.openEditModal(${disp.id})" title="Ubah Catatan Disposisi">
                  Ubah
                </button>
                <button class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fecaca;" onclick="DisposisiModule.confirmDelete(${disp.id})" title="Hapus Disposisi & Kembalikan Status Surat">
                  Hapus
                </button>
              ` : `
                <button class="btn btn-primary btn-sm" onclick="DisposisiModule.openCreateModal(${sm.id})" title="Catat Lembar Disposisi Surat Ini">
                  ✍️ Catat Disposisi
                </button>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // Buka Modal Pencatatan Disposisi Baru
  openCreateModal(targetSmId = null) {
    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    const smList = Store.state.surat_masuk || [];
    if (!smList.length) {
      App.showToast('Belum ada surat masuk yang terdaftar di sistem', 'warning');
      return;
    }

    // Default pilih targetSmId atau surat masuk pertama yang belum didisposisi
    let selectedId = targetSmId ? parseInt(targetSmId, 10) : null;
    if (!selectedId) {
      const pending = smList.find(s => s.status_disposisi === 'Menunggu Disposisi');
      selectedId = pending ? pending.id : smList[0].id;
    }

    const currentSm = smList.find(s => s.id === selectedId) || smList[0];
    const defaultSifat = currentSm.sifat_surat === 'Rahasia' ? 'C. Rahasia' : 'B. Segera';

    title.innerText = 'Pencatatan Lembar Disposisi Surat Masuk';
    body.innerHTML = `
      <form id="form-catat-disposisi">
        <!-- 1. Pilihan Surat Masuk yang Didisposisikan -->
        <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; padding:12px 16px; margin-bottom:16px;">
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-weight:700; color:#0f172a;">
              Pilih Surat Masuk yang Didisposisikan: <span class="required">*</span>
            </label>
            <select id="disp-select-sm" class="form-control" style="font-weight:600;" onchange="DisposisiModule.onModalSmChange(this.value)">
              ${smList.map(s => {
                const hasDisp = (Store.state.disposisi || []).some(d => d.id_surat_masuk === s.id);
                return `
                  <option value="${s.id}" ${s.id === currentSm.id ? 'selected' : ''}>
                    ${s.no_agenda} | ${s.instansi_pengirim} - "${s.perihal.substring(0, 45)}..." ${hasDisp ? '(Sudah Ada Catatan)' : '(Belum Didisposisi)'}
                  </option>
                `;
              }).join('')}
            </select>
          </div>

          <!-- Rincian Identitas Surat Sesuai Format Lembar Fisik -->
          <div id="disp-sm-preview" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 14px; margin-top:8px; font-size:12.5px;">
            ${this.getSmPreviewHtml(currentSm)}
          </div>
        </div>

        <!-- 2. Sifat Disposisi (Sesuai Blanko Resmi: A, B, C) -->
        <div class="form-group" style="margin-bottom:16px;">
          <label class="form-label" style="font-weight:700; color:#0f172a;">
            Sifat Disposisi: <span class="required">*</span>
          </label>
          <div style="display:flex; gap:20px; flex-wrap:wrap; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px;">
            <label style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:13px;">
              <input type="radio" name="modal-sifat" value="A. Sangat Segera" ${defaultSifat === 'A. Sangat Segera' ? 'checked' : ''}>
              <span style="color:#b91c1c;">A. Sangat Segera</span>
            </label>
            <label style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:13px;">
              <input type="radio" name="modal-sifat" value="B. Segera" ${defaultSifat === 'B. Segera' ? 'checked' : ''}>
              <span style="color:#b45309;">B. Segera</span>
            </label>
            <label style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:13px;">
              <input type="radio" name="modal-sifat" value="C. Rahasia" ${defaultSifat === 'C. Rahasia' ? 'checked' : ''}>
              <span style="color:#6b21a8;">C. Rahasia</span>
            </label>
          </div>
        </div>

        <!-- 3. Dua Kolom: Diteruskan Kepada & Dengan Hormat Harap -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
          <!-- Kolom Kiri: 6 Jabatan Struktural Resmi -->
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
            <div style="font-weight:800; font-size:12.5px; text-transform:uppercase; color:#0369a1; border-bottom:2px solid #bae6fd; padding-bottom:6px; margin-bottom:10px;">
              Diteruskan kepada saudara : <span class="required">*</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:7px;">
              ${this.JABATAN_TUJUAN.map(j => `
                <label style="display:flex; align-items:flex-start; gap:8px; font-size:12px; line-height:1.3; cursor:pointer; padding:3px 4px; border-radius:4px; hover:bg-slate-100;">
                  <input type="checkbox" name="modal-diteruskan" value="${j}" style="margin-top:2px;">
                  <span style="font-weight:600; color:#1e293b;">${j}</span>
                </label>
              `).join('')}
            </div>
            <div style="font-size:11px; color:#64748b; margin-top:8px; font-style:italic;">
              * Centang satu atau lebih jabatan yang dituju pada lembar fisik
            </div>
          </div>

          <!-- Kolom Kanan: 9 Butir Instruksi Resmi -->
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
            <div style="font-weight:800; font-size:12.5px; text-transform:uppercase; color:#15803d; border-bottom:2px solid #bbf7d0; padding-bottom:6px; margin-bottom:10px;">
              Dengan hormat harap : <span class="required">*</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${this.INSTRUKSI_RESMI.map((inst, idx) => `
                <label style="display:flex; align-items:center; gap:8px; font-size:12.5px; cursor:pointer; padding:2px 4px; border-radius:4px;">
                  <input type="checkbox" name="modal-instruksi" value="${inst}" ${idx === 2 || idx === 6 ? 'checked' : ''}>
                  <span style="color:#1e293b;">• ${inst}</span>
                </label>
              `).join('')}
            </div>
            <div style="font-size:11px; color:#64748b; margin-top:8px; font-style:italic;">
              * Centang instruksi yang ditandai oleh pimpinan
            </div>
          </div>
        </div>

        <!-- 4. Catatan Tulisan Tangan Pimpinan -->
        <div class="form-group" style="margin-bottom:16px;">
          <label class="form-label" style="font-weight:700; color:#0f172a;">
            Catatan / Arahan Pimpinan:
          </label>
          <textarea id="modal-catatan" class="form-control" rows="3" placeholder="Ketikkan catatan petunjuk tulisan tangan pimpinan dari lembar fisik (misal: 'Segera koordinasikan dengan bidang terkait dan siapkan bahan laporannya')..."></textarea>
          <span class="form-hint">Transkripsi catatan yang tertulis pada kolom Catatan lembar fisik pimpinan</span>
        </div>

        <!-- 5. Pejabat Penandatangan Resmi -->
        <div style="background:#f8fafc; border:1px dashed #94a3b8; border-radius:6px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:12px; color:#475569;">
            Pemberi Disposisi: <strong>${this.PIMPINAN_BKPSDM.nama}</strong> (${this.PIMPINAN_BKPSDM.jabatan})<br>
            Pangkat: ${this.PIMPINAN_BKPSDM.pangkat} / NIP. ${this.PIMPINAN_BKPSDM.nip}
          </div>
          <span class="badge badge-success" style="font-size:11px;">Otentikasi Pimpinan Sah</span>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" id="btn-submit-disposisi" onclick="DisposisiModule.submitCreate()">
        💾 Simpan Pencatatan Disposisi
      </button>
    `;

    App.openModal();
  },

  // Helper tampilan info surat masuk pada modal
  getSmPreviewHtml(sm) {
    return `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <div><strong>1. Surat Dari :</strong> ${sm.instansi_pengirim}</div>
        <div>• <strong>Diterima Tgl :</strong> ${sm.tgl_diterima}</div>
        <div><strong>2. No. Surat :</strong> <span class="code-tag code-tag-pengirim">${sm.no_surat_pengirim}</span></div>
        <div>• <strong>No. Agenda :</strong> <strong style="color:var(--primary);">${sm.no_agenda}</strong></div>
        <div><strong>3. Tgl. Surat :</strong> ${sm.tgl_surat}</div>
        <div>• <strong>Klasifikasi :</strong> Kode ${sm.kode_internal}</div>
      </div>
      <div style="margin-top:6px; padding-top:6px; border-top:1px dashed #cbd5e1;">
        <strong>Perihal :</strong> ${sm.perihal}
      </div>
    `;
  },

  onModalSmChange(suratId) {
    const id = parseInt(suratId, 10);
    const sm = Store.state.surat_masuk.find(s => s.id === id);
    const previewEl = document.getElementById('disp-sm-preview');
    if (previewEl && sm) {
      previewEl.innerHTML = this.getSmPreviewHtml(sm);
    }
  },

  async submitCreate() {
    const selectSmEl = document.getElementById('disp-select-sm');
    if (!selectSmEl) return;
    const smId = parseInt(selectSmEl.value, 10);
    const sm = Store.state.surat_masuk.find(s => s.id === smId);
    if (!sm) {
      App.showToast('Surat masuk tidak valid', 'warning');
      return;
    }

    const checkedDiteruskan = Array.from(document.querySelectorAll('input[name="modal-diteruskan"]:checked')).map(el => el.value);
    const checkedInstruksi = Array.from(document.querySelectorAll('input[name="modal-instruksi"]:checked')).map(el => el.value);
    const sifatEl = document.querySelector('input[name="modal-sifat"]:checked');
    const sifat = sifatEl ? sifatEl.value : 'B. Segera';
    const catatan = document.getElementById('modal-catatan')?.value.trim() || '';

    if (!checkedDiteruskan.length) {
      App.showToast('Mohon centang minimal satu jabatan pada "Diteruskan kepada saudara :"', 'warning');
      return;
    }

    if (!checkedInstruksi.length) {
      App.showToast('Mohon centang minimal satu butir pada "Dengan hormat harap :"', 'warning');
      return;
    }

    const existingDisp = (Store.state.disposisi || []).find(d => d.id_surat_masuk === smId);

    if (existingDisp) {
      // Jika sudah ada, update
      await Store.updateDisposisi(existingDisp.id, {
        diteruskan_kepada: checkedDiteruskan,
        tujuan_nama: checkedDiteruskan.join(', '),
        sifat: sifat,
        instruksi: checkedInstruksi,
        catatan: catatan
      });
      App.showToast(`Pencatatan disposisi untuk surat ${sm.no_agenda} berhasil diperbarui!`, 'success');
    } else {
      // Tambah baru
      await Store.addDisposisi({
        id_surat_masuk: smId,
        dari_user: `${this.PIMPINAN_BKPSDM.nama} (${this.PIMPINAN_BKPSDM.jabatan})`,
        diteruskan_kepada: checkedDiteruskan,
        tujuan_nama: checkedDiteruskan.join(', '),
        sifat: sifat,
        instruksi: checkedInstruksi,
        catatan: catatan
      });
      App.showToast(`Pencatatan disposisi untuk surat ${sm.no_agenda} berhasil disimpan!`, 'success');
    }

    App.closeModal();
    this.render();
    if (SuratMasukModule && typeof SuratMasukModule.render === 'function') SuratMasukModule.render();
    if (DashboardModule && typeof DashboardModule.render === 'function') DashboardModule.render();
  },

  // Buka Modal Edit Disposisi
  openEditModal(disposisiId) {
    const disp = Store.state.disposisi.find(d => d.id === disposisiId);
    if (!disp) return;

    const sm = Store.state.surat_masuk.find(s => s.id === disp.id_surat_masuk);
    if (!sm) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    const diteruskanSelected = disp.diteruskan_kepada || (disp.tujuan_nama ? [disp.tujuan_nama] : []);
    const instruksiSelected = disp.instruksi || [];
    const sifatSelected = disp.sifat || 'B. Segera';
    const catatanText = disp.catatan || '';

    title.innerText = `Ubah Pencatatan Disposisi: ${sm.no_agenda}`;
    body.innerHTML = `
      <form id="form-edit-disposisi">
        <!-- Rincian Identitas Surat Masuk -->
        <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:8px; padding:12px 16px; margin-bottom:16px;">
          <div style="font-weight:700; color:#0f172a; margin-bottom:6px; font-size:13px;">
            📄 Surat Masuk Terkait: <span style="color:var(--primary); font-family:monospace;">${sm.no_agenda}</span>
          </div>
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:10px 14px; font-size:12.5px;">
            ${this.getSmPreviewHtml(sm)}
          </div>
        </div>

        <!-- Sifat Disposisi -->
        <div class="form-group" style="margin-bottom:16px;">
          <label class="form-label" style="font-weight:700; color:#0f172a;">
            Sifat Disposisi: <span class="required">*</span>
          </label>
          <div style="display:flex; gap:20px; flex-wrap:wrap; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px;">
            <label style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:13px;">
              <input type="radio" name="edit-sifat" value="A. Sangat Segera" ${sifatSelected === 'A. Sangat Segera' ? 'checked' : ''}>
              <span style="color:#b91c1c;">A. Sangat Segera</span>
            </label>
            <label style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:13px;">
              <input type="radio" name="edit-sifat" value="B. Segera" ${sifatSelected === 'B. Segera' ? 'checked' : ''}>
              <span style="color:#b45309;">B. Segera</span>
            </label>
            <label style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-weight:600; font-size:13px;">
              <input type="radio" name="edit-sifat" value="C. Rahasia" ${sifatSelected === 'C. Rahasia' ? 'checked' : ''}>
              <span style="color:#6b21a8;">C. Rahasia</span>
            </label>
          </div>
        </div>

        <!-- Dua Kolom: Diteruskan Kepada & Dengan Hormat Harap -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
          <!-- Kolom Kiri: 6 Jabatan -->
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
            <div style="font-weight:800; font-size:12.5px; text-transform:uppercase; color:#0369a1; border-bottom:2px solid #bae6fd; padding-bottom:6px; margin-bottom:10px;">
              Diteruskan kepada saudara : <span class="required">*</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:7px;">
              ${this.JABATAN_TUJUAN.map(j => {
                const isChecked = diteruskanSelected.some(sel => sel.includes(j) || j.includes(sel));
                return `
                  <label style="display:flex; align-items:flex-start; gap:8px; font-size:12px; line-height:1.3; cursor:pointer; padding:3px 4px; border-radius:4px;">
                    <input type="checkbox" name="edit-diteruskan" value="${j}" ${isChecked ? 'checked' : ''} style="margin-top:2px;">
                    <span style="font-weight:600; color:#1e293b;">${j}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Kolom Kanan: 9 Butir Instruksi -->
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
            <div style="font-weight:800; font-size:12.5px; text-transform:uppercase; color:#15803d; border-bottom:2px solid #bbf7d0; padding-bottom:6px; margin-bottom:10px;">
              Dengan hormat harap : <span class="required">*</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              ${this.INSTRUKSI_RESMI.map(inst => {
                const isChecked = instruksiSelected.includes(inst);
                return `
                  <label style="display:flex; align-items:center; gap:8px; font-size:12.5px; cursor:pointer; padding:2px 4px; border-radius:4px;">
                    <input type="checkbox" name="edit-instruksi" value="${inst}" ${isChecked ? 'checked' : ''}>
                    <span style="color:#1e293b;">• ${inst}</span>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Catatan Tulisan Tangan Pimpinan -->
        <div class="form-group" style="margin-bottom:16px;">
          <label class="form-label" style="font-weight:700; color:#0f172a;">
            Catatan / Arahan Pimpinan:
          </label>
          <textarea id="edit-catatan" class="form-control" rows="3">${catatanText}</textarea>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="DisposisiModule.submitEdit(${disp.id})">
        Simpan Perubahan
      </button>
    `;

    App.openModal();
  },

  async submitEdit(disposisiId) {
    const checkedDiteruskan = Array.from(document.querySelectorAll('input[name="edit-diteruskan"]:checked')).map(el => el.value);
    const checkedInstruksi = Array.from(document.querySelectorAll('input[name="edit-instruksi"]:checked')).map(el => el.value);
    const sifatEl = document.querySelector('input[name="edit-sifat"]:checked');
    const sifat = sifatEl ? sifatEl.value : 'B. Segera';
    const catatan = document.getElementById('edit-catatan')?.value.trim() || '';

    if (!checkedDiteruskan.length) {
      App.showToast('Mohon centang minimal satu jabatan pada "Diteruskan kepada saudara :"', 'warning');
      return;
    }

    if (!checkedInstruksi.length) {
      App.showToast('Mohon centang minimal satu butir pada "Dengan hormat harap :"', 'warning');
      return;
    }

    const updated = await Store.updateDisposisi(disposisiId, {
      diteruskan_kepada: checkedDiteruskan,
      tujuan_nama: checkedDiteruskan.join(', '),
      sifat: sifat,
      instruksi: checkedInstruksi,
      catatan: catatan
    });

    if (updated) {
      App.closeModal();
      App.showToast('Pencatatan disposisi berhasil diperbarui', 'success');
      this.render();
      if (SuratMasukModule && typeof SuratMasukModule.render === 'function') SuratMasukModule.render();
      if (DashboardModule && typeof DashboardModule.render === 'function') DashboardModule.render();
    }
  },

  // Modal Rincian Catatan Disposisi
  showDetail(disposisiId) {
    const disp = Store.state.disposisi.find(d => d.id === disposisiId);
    if (!disp) return;

    const sm = Store.state.surat_masuk.find(s => s.id === disp.id_surat_masuk);
    if (!sm) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    const diteruskan = disp.diteruskan_kepada || (disp.tujuan_nama ? [disp.tujuan_nama] : []);
    const instruksi = disp.instruksi || [];

    title.innerText = `Rincian Pencatatan Disposisi: ${sm.no_agenda}`;
    body.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <!-- Card Informasi Surat Masuk -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:6px;">
            <div style="font-size:12px; font-weight:800; color:var(--primary); text-transform:uppercase;">
              Data Surat Masuk Terkait
            </div>
            <span class="badge badge-${sm.status_disposisi === 'Menunggu Disposisi' ? 'menunggu' : 'didisposisi'}">
              ${sm.status_disposisi}
            </span>
          </div>
          ${this.getSmPreviewHtml(sm)}
        </div>

        <!-- Informasi Disposisi Sifat & Tanggal -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <div style="font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase;">Sifat Disposisi:</div>
            <div style="margin-top:4px; font-size:13.5px; font-weight:700;">
              <span class="badge ${disp.sifat && disp.sifat.includes('Sangat') ? 'badge-danger' : (disp.sifat && disp.sifat.includes('Rahasia') ? 'badge-purple' : 'badge-warning')}">
                ${disp.sifat || 'B. Segera'}
              </span>
            </div>
          </div>
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
            <div style="font-size:11px; color:#64748b; font-weight:700; text-transform:uppercase;">Tanggal Pencatatan:</div>
            <div style="margin-top:4px; font-size:13px; font-weight:600; color:#0f172a;">
              ${disp.created_at || sm.tgl_diterima}
            </div>
          </div>
        </div>

        <!-- Dua Kolom: Diteruskan & Instruksi -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <!-- Kolom Diteruskan -->
          <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:12px;">
            <div style="font-weight:800; font-size:12px; text-transform:uppercase; color:#0369a1; margin-bottom:8px;">
              Diteruskan Kepada Saudara (${diteruskan.length}):
            </div>
            <div style="display:flex; flex-direction:column; gap:5px;">
              ${diteruskan.map(j => `
                <div style="font-size:12.5px; font-weight:600; color:#0c4a6e; display:flex; align-items:flex-start; gap:6px;">
                  <span style="color:#0284c7;">✓</span>
                  <span>${j}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Kolom Instruksi -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px;">
            <div style="font-weight:800; font-size:12px; text-transform:uppercase; color:#15803d; margin-bottom:8px;">
              Dengan Hormat Harap (${instruksi.length}):
            </div>
            <div style="display:flex; flex-direction:column; gap:5px;">
              ${instruksi.map(inst => `
                <div style="font-size:12.5px; font-weight:600; color:#14532d; display:flex; align-items:center; gap:6px;">
                  <span style="color:#16a34a;">•</span>
                  <span>${inst}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Kolom Catatan Pimpinan -->
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
          <div style="font-size:11.5px; color:#64748b; font-weight:700; text-transform:uppercase; margin-bottom:4px;">
            Catatan / Arahan Pimpinan:
          </div>
          <div style="font-size:13.5px; color:#0f172a; line-height:1.45; font-style:italic; background:#f8fafc; padding:8px 12px; border-left:3px solid #0284c7; border-radius:4px;">
            "${disp.catatan || 'Tidak ada catatan khusus yang dituliskan pimpinan.'}"
          </div>
        </div>

        <!-- Pimpinan Penandatangan -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; font-size:12px;">
          <div>
            Pemberi Disposisi: <strong>${this.PIMPINAN_BKPSDM.nama}</strong> (${this.PIMPINAN_BKPSDM.jabatan})<br>
            Pangkat: ${this.PIMPINAN_BKPSDM.pangkat} / NIP. ${this.PIMPINAN_BKPSDM.nip}
          </div>
          <span class="badge badge-success">Terverifikasi</span>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-primary" onclick="DisposisiModule.printLembarDisposisi(${disp.id})" title="Cetak format fisik Lembar Disposisi resmi BKPSDM">
        🖨️ Cetak Lembar Disposisi
      </button>
      <button class="btn btn-outline" style="color:#0284c7; border-color:#bae6fd;" onclick="App.closeModal(); DisposisiModule.openEditModal(${disp.id})">
        ✏️ Ubah Disposisi
      </button>
      <button class="btn btn-outline" style="color:#dc2626; border-color:#fecaca;" onclick="DisposisiModule.confirmDelete(${disp.id})">
        🗑️ Hapus Disposisi
      </button>
      <button class="btn btn-outline" onclick="App.closeModal()">Tutup</button>
    `;

    App.openModal();
  },

  // Cetak Lembar Disposisi Format Blanko Fisik Resmi BKPSDM Luwu Timur
  printLembarDisposisi(dispId) {
    const disp = Store.state.disposisi.find(d => d.id === dispId);
    if (!disp) return;
    const sm = Store.state.surat_masuk.find(s => s.id === disp.id_surat_masuk);
    if (!sm) return;

    const diteruskan = disp.diteruskan_kepada || (disp.tujuan_nama ? disp.tujuan_nama.split(',').map(s => s.trim()) : []);
    const instruksi = Array.isArray(disp.instruksi) ? disp.instruksi : [];
    const sifat = disp.sifat || 'B. Segera';

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      App.showToast('Gagal membuka jendela cetak. Mohon izinkan popup di browser Anda.', 'warning');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>LEMBAR DISPOSISI - ${sm.no_agenda}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #000; margin: 0; padding: 15px; line-height: 1.35; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 12px; }
          .kop h3 { margin: 0; font-size: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
          .kop h2 { margin: 2px 0; font-size: 17px; font-weight: 800; text-transform: uppercase; }
          .kop p { margin: 2px 0 0; font-size: 11px; font-style: italic; }
          .title { text-align: center; font-size: 16px; font-weight: bold; text-decoration: underline; margin: 14px 0 16px; text-transform: uppercase; letter-spacing: 1px; }
          table.main-box { width: 100%; border-collapse: collapse; border: 1.5px solid #000; }
          table.main-box td { border: 1px solid #000; padding: 7px 10px; vertical-align: top; }
          .check-box { display: inline-block; width: 15px; height: 15px; border: 1.5px solid #000; text-align: center; line-height: 14px; font-size: 12px; font-weight: bold; margin-right: 7px; vertical-align: middle; }
          .item-row { display: flex; align-items: flex-start; margin-bottom: 6px; font-size: 12.5px; }
          .ttd-box { margin-top: 18px; float: right; width: 290px; text-align: center; font-size: 13px; }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 18px; text-align: right; background: #f8fafc; padding: 10px 16px; border-radius: 6px; border: 1px solid #cbd5e1;">
          <span style="font-size: 13px; color: #475569; margin-right: 12px;">Format resmi Blanko Lembar Disposisi BKPSDM Luwu Timur</span>
          <button onclick="window.print()" style="padding: 7px 16px; background: #0284c7; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">
            🖨️ Cetak Lembar Disposisi
          </button>
          <button onclick="window.close()" style="padding: 7px 16px; background: #64748b; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 6px; font-size: 13px;">
            Tutup
          </button>
        </div>

        <div class="kop">
          <h3>PEMERINTAH KABUPATEN LUWU TIMUR</h3>
          <h2>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</h2>
          <p>Jl. Soekarno-Hatta Km. 02 Kantor Bupati Luwu Timur - Malili, Kode Pos 92981</p>
        </div>

        <div class="title">LEMBAR DISPOSISI</div>

        <table class="main-box">
          <tr>
            <td style="width: 50%;">
              <div style="margin-bottom: 4px;"><strong>Surat Dari :</strong> ${sm.instansi_pengirim || '-'}</div>
              <div style="margin-bottom: 4px;"><strong>No. Surat :</strong> ${sm.no_surat_pengirim || '-'}</div>
              <div><strong>Tgl. Surat :</strong> ${App.formatIndoDate(sm.tgl_surat)}</div>
            </td>
            <td style="width: 50%;">
              <div style="margin-bottom: 4px;"><strong>Diterima Tanggal :</strong> ${App.formatIndoDate(sm.tgl_diterima)}</div>
              <div style="margin-bottom: 4px;"><strong>No. Agenda :</strong> <span style="font-family:monospace; font-weight:bold; font-size: 14px;">${sm.no_agenda}</span></div>
              <div style="display:flex; align-items:center; gap: 12px; margin-top: 2px;">
                <strong>Sifat :</strong>
                <span><span class="check-box">${sifat.includes('Sangat') ? '✓' : '&nbsp;'}</span>Sangat Segera</span>
                <span><span class="check-box">${sifat.includes('B. Segera') || sifat === 'Segera' ? '✓' : '&nbsp;'}</span>Segera</span>
                <span><span class="check-box">${sifat.includes('Rahasia') ? '✓' : '&nbsp;'}</span>Rahasia</span>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <strong>Hal / Perihal :</strong><br>
              <div style="margin-top: 4px; font-weight: 600; line-height: 1.45;">"${sm.perihal}"</div>
            </td>
          </tr>
          <tr>
            <td style="width: 50%;">
              <div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 3px;">
                Diteruskan kepada saudara :
              </div>
              ${this.JABATAN_TUJUAN.map(j => {
                const isChecked = diteruskan.some(sel => sel.includes(j) || j.includes(sel));
                return `
                  <div class="item-row">
                    <span class="check-box">${isChecked ? '✓' : '&nbsp;'}</span>
                    <span style="${isChecked ? 'font-weight: bold;' : ''}">${j}</span>
                  </div>
                `;
              }).join('')}
            </td>
            <td style="width: 50%;">
              <div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #000; padding-bottom: 3px;">
                Dengan hormat harap :
              </div>
              ${this.INSTRUKSI_RESMI.map(inst => {
                const isChecked = instruksi.some(sel => sel.includes(inst) || inst.includes(sel));
                return `
                  <div class="item-row">
                    <span class="check-box">${isChecked ? '✓' : '&nbsp;'}</span>
                    <span style="${isChecked ? 'font-weight: bold;' : ''}">${inst}</span>
                  </div>
                `;
              }).join('')}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="min-height: 90px; height: 100px;">
              <div style="font-weight: bold; margin-bottom: 6px; border-bottom: 1px solid #000; padding-bottom: 3px;">
                Catatan Kepala Badan :
              </div>
              <div style="font-style: italic; min-height: 60px; line-height: 1.5; padding: 4px 0;">
                ${disp.catatan ? `"${disp.catatan}"` : '...................................................................................................................................................................................................................'}
              </div>
            </td>
          </tr>
        </table>

        <div class="ttd-box">
          Malili, ${App.formatIndoDate(disp.created_at || sm.tgl_diterima)}<br>
          <strong>${this.PIMPINAN_BKPSDM.jabatan}</strong><br>
          <div style="height: 65px;"></div>
          <strong><u>${this.PIMPINAN_BKPSDM.nama}</u></strong><br>
          Pangkat: ${this.PIMPINAN_BKPSDM.pangkat}<br>
          NIP. ${this.PIMPINAN_BKPSDM.nip}
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  },

  // Helper jika dibuka dari ID Surat Masuk
  showDetailBySuratMasukId(suratMasukId) {
    const disp = (Store.state.disposisi || []).find(d => d.id_surat_masuk === suratMasukId);
    if (disp) {
      this.showDetail(disp.id);
    } else {
      this.openCreateModal(suratMasukId);
    }
  },

  // Kompatibilitas jika dipanggil dari modul lain
  selectSuratAndNavigate(suratId) {
    App.navigate('disposisi');
    const disp = (Store.state.disposisi || []).find(d => d.id_surat_masuk === suratId);
    if (disp) {
      setTimeout(() => this.showDetail(disp.id), 200);
    } else {
      setTimeout(() => this.openCreateModal(suratId), 200);
    }
  },

  async confirmDelete(disposisiId) {
    const disp = Store.state.disposisi.find(d => d.id === disposisiId);
    if (!disp) return;

    const sm = Store.state.surat_masuk.find(s => s.id === disp.id_surat_masuk);
    const labelSurat = sm ? sm.no_agenda : '';

    if (confirm(`Yakin ingin menghapus rekaman disposisi untuk surat ${labelSurat}? Status surat masuk akan otomatis kembali menjadi "Menunggu Disposisi".`)) {
      const ok = await Store.deleteDisposisi(disposisiId);
      if (ok) {
        App.closeModal();
        App.showToast('Rekaman disposisi berhasil dihapus dan status surat masuk dikembalikan', 'success');
        this.render();
        if (SuratMasukModule && typeof SuratMasukModule.render === 'function') SuratMasukModule.render();
        if (DashboardModule && typeof DashboardModule.render === 'function') DashboardModule.render();
      }
    }
  }
};
