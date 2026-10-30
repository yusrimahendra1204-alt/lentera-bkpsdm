// Dashboard View Module - Sistem Informasi Persuratan BKPSDM Luwu Timur
const DashboardModule = {
  render() {
    const container = document.getElementById('view-dashboard');
    if (!container) return;

    const sm = Store.state.surat_masuk || [];
    const sk = Store.state.surat_keluar || [];
    const disp = Store.state.disposisi || [];
    const spt = Store.state.surat_tugas || [];

    const latestSk = sk[0];
    const latestSkNum = latestSk ? latestSk.no_surat_keluar : '-';
    const latestSkDate = latestSk && latestSk.tgl_surat ? App.formatIndoDate(latestSk.tgl_surat) : '-';

    const pendingDisp = sm.filter(s => s.status_disposisi === 'Menunggu Disposisi');
    const activeDisp = disp.filter(d => d.status_tindak_lanjut !== 'Selesai');

    const isKepala = Store.state.currentRole === 'kepala_bkpsdm';

    container.innerHTML = `
      <!-- Urgency Banner for Kepala BKPSDM -->
      ${pendingDisp.length > 0 ? `
        <div class="urgent-banner">
          <div class="urgent-banner-content">
            <div class="urgent-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div class="urgent-text">
              <h4>Perhatian: Terdapat ${pendingDisp.length} Surat Masuk Memerlukan Disposisi Pimpinan!</h4>
              <p>Surat dari instansi luar telah diverifikasi dan siap diberi lembar disposisi oleh Kepala BKPSDM.</p>
            </div>
          </div>
          <button class="btn btn-primary" onclick="App.navigate('disposisi')">
            Buka Meja Disposisi
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      ` : ''}

      <!-- Stats Cards Grid -->
      <div class="stats-grid">
        <div class="stat-card blue" onclick="App.navigate('surat-masuk')">
          <div class="stat-info">
            <div class="stat-label">Surat Masuk</div>
            <div class="stat-value">${sm.length}</div>
            <div class="stat-desc">
              <span style="color: ${pendingDisp.length ? '#d97706' : '#059669'}; font-weight:700;">
                ${pendingDisp.length} Menunggu Disposisi
              </span>
            </div>
          </div>
          <div class="stat-icon-wrapper">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        </div>

        <div class="stat-card amber" onclick="App.navigate('disposisi')">
          <div class="stat-info">
            <div class="stat-label">Disposisi Kepala BKPSDM</div>
            <div class="stat-value">${disp.length}</div>
            <div class="stat-desc">
              <span style="color:#d97706; font-weight:600;">${activeDisp.length} Dalam Proses Tindak Lanjut</span>
            </div>
          </div>
          <div class="stat-icon-wrapper">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
        </div>

        <div class="stat-card emerald" onclick="App.navigate('surat-keluar')">
          <div class="stat-info">
            <div class="stat-label">Surat Keluar</div>
            <div class="stat-value">${sk.length} <span style="font-size:13px; font-weight:600; color:#475569;">berkas</span></div>
            <div class="stat-desc" style="display:flex; flex-direction:column; gap:2px; margin-top:4px;">
              <span style="color:#059669; font-weight:700; font-size:12px;">
                No. Terakhir: ${latestSkNum}
              </span>
              <span style="color:#475569; font-size:11.5px; font-weight:600; display:flex; align-items:center; gap:4px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Tgl Keluar: ${latestSkDate}
              </span>
            </div>
          </div>
          <div class="stat-icon-wrapper">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
        </div>

        <div class="stat-card purple" onclick="App.navigate('surat-tugas')">
          <div class="stat-info">
            <div class="stat-label">Surat Perintah Tugas (SPT)</div>
            <div class="stat-value">${spt.length}</div>
            <div class="stat-desc">
              <span style="color:#7c3aed; font-weight:600;">Kode Arsip 800.1.11.1</span>
            </div>
          </div>
          <div class="stat-icon-wrapper">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7.5" r="4"></circle>
              <polyline points="17 11 19 13 23 9"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="dashboard-grid">
        <!-- Recent Surat Masuk & Status Disposisi -->
        <div class="card">
          <div class="card-header">
            <div class="card-title-group">
              <h3>Surat Masuk Terbaru & Status Disposisi</h3>
              <p>Daftar surat masuk instansi luar dan progres lembar disposisi pimpinan</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="App.navigate('surat-masuk')">
              Lihat Semua
            </button>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>No. Agenda / Pengirim</th>
                    <th>Perihal & Klasifikasi Internal</th>
                    <th>Sifat</th>
                    <th>Status Disposisi</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  ${sm.length === 0 ? `
                    <tr>
                      <td colspan="5" style="text-align:center; padding:36px 20px; color:#64748b;">
                        <div style="font-size:24px; margin-bottom:6px;">📭</div>
                        <div style="font-weight:600; color:var(--text-main); font-size:14px; margin-bottom:4px;">Belum ada surat masuk yang tercatat</div>
                        <div style="font-size:12.5px; color:var(--text-muted); margin-bottom:12px;">Sistem dalam kondisi bersih dan siap untuk mencatat agenda surat baru.</div>
                        <button class="btn btn-primary btn-sm" onclick="SuratMasukModule.openCreateModal()">
                          + Catat Surat Masuk Baru
                        </button>
                      </td>
                    </tr>
                  ` : sm.slice(0, 5).map(s => `
                    <tr>
                      <td>
                        <div style="font-weight:700; color:var(--primary);">${s.no_agenda}</div>
                        <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
                          No: <span class="code-tag code-tag-pengirim">${s.no_surat_pengirim}</span>
                        </div>
                        <div style="font-size:11px; color:#475569; margin-top:1px;">${s.instansi_pengirim}</div>
                      </td>
                      <td>
                        <div style="font-weight:600; font-size:13px; line-height:1.3; max-width:320px;">
                          ${s.perihal}
                        </div>
                        <div style="margin-top:4px;">
                          <span class="code-tag code-tag-internal">Kode ${s.kode_internal}</span>
                          <span style="font-size:11px; color:#15803d; margin-left:4px;">${s.nama_klasifikasi_internal}</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-${s.sifat_surat.toLowerCase()}">${s.sifat_surat}</span>
                      </td>
                      <td>
                        <span class="badge badge-${s.status_disposisi === 'Menunggu Disposisi' ? 'menunggu' : (s.status_disposisi === 'Didisposisi' ? 'didisposisi' : 'selesai')}">
                          ${s.status_disposisi}
                        </span>
                      </td>
                      <td>
                        ${s.status_disposisi === 'Menunggu Disposisi' ? `
                          <button class="btn btn-primary btn-sm" onclick="DisposisiModule.openCreateModal(${s.id})">
                            ✍️ Catat Disposisi
                          </button>
                        ` : `
                          <button class="btn btn-outline btn-sm" onclick="SuratMasukModule.showDetail(${s.id})">
                            Detail
                          </button>
                        `}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Regulation Guide -->
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div class="card">
            <div class="card-header">
              <div class="card-title-group">
                <h3>Aksi Cepat</h3>
                <p>Jalan pintas administrasi persuratan</p>
              </div>
            </div>
            <div class="card-body">
              <div class="quick-action-list">
                <div class="quick-action-item" onclick="SuratMasukModule.openCreateModal()">
                  <div class="quick-action-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                  </div>
                  <div class="quick-action-text">
                    <div class="title">Catat Surat Masuk Baru</div>
                    <div class="subtitle">Nomor pengirim & kode Perbup otomatis</div>
                  </div>
                </div>

                <div class="quick-action-item" onclick="App.navigate('disposisi')">
                  <div class="quick-action-icon" style="color:var(--warning);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                  </div>
                  <div class="quick-action-text">
                    <div class="title">Meja Disposisi Pimpinan</div>
                    <div class="subtitle">Instruksi resmi Kepala BKPSDM</div>
                  </div>
                </div>

                <div class="quick-action-item" onclick="SuratTugasModule.openCreateModal()">
                  <div class="quick-action-icon" style="color:var(--purple);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7.5" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                  </div>
                  <div class="quick-action-text">
                    <div class="title">Terbitkan Surat Tugas (SPT)</div>
                    <div class="subtitle">Multi-personil & template resmi BKPSDM</div>
                  </div>
                </div>

                <div class="quick-action-item" onclick="SuratKeluarModule.openCreateModal()">
                  <div class="quick-action-icon" style="color:var(--accent);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </div>
                  <div class="quick-action-text">
                    <div class="title">Buat Surat Keluar</div>
                    <div class="subtitle">Auto-suggest kode dari perihal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Perbup Info Card -->
          <div class="card" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff;">
            <div class="card-body">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                <span style="background:rgba(56, 189, 248, 0.2); color:#38bdf8; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:10px;">
                  LANDASAN HUKUM
                </span>
              </div>
              <h4 style="font-size:14px; font-weight:700; color:#f8fafc; line-height:1.4;">
                Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023
              </h4>
              <p style="font-size:12px; color:#94a3b8; margin-top:6px; line-height:1.45;">
                Sistem terintegrasi dengan seluruh 2.961 kode klasifikasi arsip Pemkab Luwu Timur (000 Umum, 100 Pemda, 800 Kepegawaian, 900 Keuangan, dll).
              </p>
              <button class="btn btn-primary btn-sm" style="margin-top:14px; width:100%;" onclick="App.navigate('klasifikasi')">
                Buka Kamus Kode Perbup
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};
