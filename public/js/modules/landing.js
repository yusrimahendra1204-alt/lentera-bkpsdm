// Landing Page Module - Portal Resmi Sistem Informasi Persuratan BKPSDM Kab. Luwu Timur
// Theme: Lutim Juara - Maju dan Sejahtera (Perbup No. 69 Tahun 2023)
const LandingModule = {
  activeTab: 'surat-keluar',
  skFilterBidang: 'all',
  skSearchQuery: '',
  klasifikasiSearchQuery: '',
  klasifikasiResults: [],

  init() {
    this.renderStats();
    this.renderToolContent();
    this.initSmoothScroll();
  },

  renderStats() {
    const smCount = Store.state.surat_masuk ? Store.state.surat_masuk.length : 130;
    const skCount = Store.state.surat_keluar ? Store.state.surat_keluar.length : 822;
    const stCount = Store.state.surat_tugas ? Store.state.surat_tugas.length : 134;
    const pegCount = Store.state.pegawai ? Store.state.pegawai.length : 1;

    const elSm = document.getElementById('landing-stat-sm');
    const elSk = document.getElementById('landing-stat-sk');
    const elSt = document.getElementById('landing-stat-st');
    const elPeg = document.getElementById('landing-stat-peg');

    if (elSm) this.animateCounter(elSm, smCount);
    if (elSk) this.animateCounter(elSk, skCount);
    if (elSt) this.animateCounter(elSt, stCount);
    if (elPeg) this.animateCounter(elPeg, pegCount);
  },

  animateCounter(element, target) {
    let start = 0;
    const duration = 1000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.innerText = target.toLocaleString('id-ID');
        clearInterval(timer);
      } else {
        element.innerText = Math.floor(start).toLocaleString('id-ID');
      }
    }, stepTime);
  },

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.tool-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    this.renderToolContent();
  },

  renderToolContent() {
    const container = document.getElementById('landing-tool-body');
    if (!container) return;

    if (this.activeTab === 'surat-keluar') {
      this.renderSuratKeluarTool(container);
    } else {
      this.renderKlasifikasiTool(container);
    }
  },

  renderSuratKeluarTool(container) {
    const allSk = Store.state.surat_keluar || [];
    
    // Get unique bidang list
    const bidangSet = new Set();
    allSk.forEach(sk => {
      if (sk.bidang_pembuat) bidangSet.add(sk.bidang_pembuat);
    });
    const bidangList = Array.from(bidangSet);

    // Filter
    let filtered = allSk.filter(sk => {
      if (this.skFilterBidang !== 'all' && sk.bidang_pembuat !== this.skFilterBidang) {
        return false;
      }
      if (this.skSearchQuery) {
        const q = this.skSearchQuery.toLowerCase();
        const str = `${sk.no_surat_keluar} ${sk.perihal} ${sk.tujuan_surat} ${sk.bidang_pembuat} ${sk.tgl_surat}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });

    const displayList = filtered.slice(0, 8); // Top 8 recent records

    container.innerHTML = `
      <div class="tool-filter-row">
        <div class="tool-search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Cari nomor surat atau perihal..." value="${this.skSearchQuery}" oninput="LandingModule.onSearchSk(this.value)">
        </div>
        <select class="tool-filter-select" onchange="LandingModule.onFilterBidang(this.value)">
          <option value="all">Semua Bidang</option>
          ${bidangList.map(b => `<option value="${b}" ${this.skFilterBidang === b ? 'selected' : ''}>${b}</option>`).join('')}
        </select>
      </div>

      <div class="tool-table-wrap">
        <table class="tool-data-table">
          <thead>
            <tr>
              <th style="width: 200px;">Nomor Surat Resmi</th>
              <th>Perihal</th>
              <th style="width: 170px;">Bidang</th>
              <th style="width: 120px;">Tanggal</th>
              <th style="width: 90px; text-align: center;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${displayList.length ? displayList.map(sk => `
              <tr>
                <td>
                  <span class="number-badge-live">${sk.no_surat_keluar}</span>
                </td>
                <td>
                  <div style="font-weight: 600; color: #f1f5f9; line-height: 1.4;">${sk.perihal}</div>
                  <div style="font-size: 11.5px; color: #64748b; margin-top: 3px;">Tujuan: <span style="color: #94a3b8;">${sk.tujuan_surat || 'Instansi Terkait'}</span></div>
                </td>
                <td>
                  <span style="font-size: 11.5px; background: rgba(255, 255, 255, 0.05); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.08); display: inline-block;">
                    ${sk.bidang_pembuat || 'Umum & Kepegawaian'}
                  </span>
                </td>
                <td style="color: #94a3b8; font-size: 12px; font-family: monospace;">
                  ${sk.tgl_surat || '-'}
                </td>
                <td style="text-align: center;">
                  <button class="btn-landing-glass" style="padding: 5px 10px; font-size: 11.5px;" onclick="LandingModule.copyText('${sk.no_surat_keluar}')" title="Salin Nomor Surat">
                    📋 Salin
                  </button>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="5" style="text-align: center; padding: 30px; color: #64748b;">
                  Tidak ada nomor surat keluar yang sesuai kriteria pencarian.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 12px; color: #94a3b8;">
        <div>Menampilkan ${displayList.length} dari ${filtered.length} surat keluar</div>
        <button class="btn-landing-glass" style="padding: 6px 14px; font-size: 12px;" onclick="App.openPublicSuratKeluar()">
          Lihat Semua Registrasi Nomor →
        </button>
      </div>
    `;
  },

  onSearchSk(val) {
    this.skSearchQuery = val;
    this.renderToolContent();
  },

  onFilterBidang(val) {
    this.skFilterBidang = val;
    this.renderToolContent();
  },

  renderKlasifikasiTool(container) {
    container.innerHTML = `
      <div class="tool-filter-row">
        <div class="tool-search-box" style="flex: 1;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="input-landing-klasifikasi" placeholder="Cari kata kunci (contoh: Pangkat, Mutasi, Cuti, Diklat)..." value="${this.klasifikasiSearchQuery}" oninput="LandingModule.onSearchKlasifikasi(this.value)">
        </div>
        <div style="font-size: 12px; color: #38bdf8; font-weight: 600; display: flex; align-items: center; gap: 6px;">
          <span style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); padding: 5px 12px; border-radius: 6px;">
            2.961 Kode Perbup 69/2023
          </span>
        </div>
      </div>

      <div id="landing-klasifikasi-results">
        ${this.renderKlasifikasiRows(this.klasifikasiResults)}
      </div>
    `;

    // Load initial samples if empty
    if (!this.klasifikasiResults.length) {
      this.fetchKlasifikasiSample();
    }
  },

  async fetchKlasifikasiSample() {
    try {
      const res = await fetch('/api/klasifikasi?limit=6');
      const json = await res.json();
      if (json && json.data) {
        this.klasifikasiResults = json.data;
        const box = document.getElementById('landing-klasifikasi-results');
        if (box) box.innerHTML = this.renderKlasifikasiRows(this.klasifikasiResults);
      }
    } catch (e) {
      console.error(e);
    }
  },

  searchTimer: null,
  onSearchKlasifikasi(val) {
    this.klasifikasiSearchQuery = val;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/klasifikasi?q=${encodeURIComponent(val)}&limit=8`);
        const json = await res.json();
        this.klasifikasiResults = json.data || [];
        const box = document.getElementById('landing-klasifikasi-results');
        if (box) box.innerHTML = this.renderKlasifikasiRows(this.klasifikasiResults);
      } catch (e) {
        console.error(e);
      }
    }, 250);
  },

  renderKlasifikasiRows(list) {
    if (!list || !list.length) {
      return `
        <div style="text-align: center; padding: 40px 20px; background: rgba(9, 14, 23, 0.5); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
          <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
          <div style="font-weight: 600; color: #f1f5f9; font-size: 14px;">Tidak ditemukan kode klasifikasi yang sesuai.</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Coba gunakan kata kunci umum seperti "Pegawai", "Jabatan", "SK", atau "Disiplin".</div>
        </div>
      `;
    }

    return `
      <div class="tool-table-wrap">
        <table class="tool-data-table">
          <thead>
            <tr>
              <th style="width: 140px;">Kode Klasifikasi</th>
              <th>Nama / Uraian Klasifikasi Arsip</th>
              <th style="width: 220px;">Kategori Urusan</th>
              <th style="width: 90px; text-align: center;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(k => `
              <tr>
                <td>
                  <span class="number-badge-live" style="color: #34d399; border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.15);">
                    ${k.kode}
                  </span>
                </td>
                <td>
                  <div style="font-weight: 600; color: #f1f5f9; font-size: 13.5px;">${k.nama}</div>
                  ${k.keywords && k.keywords.length ? `
                    <div style="font-size: 11px; color: #64748b; margin-top: 3px;">
                      Kata kunci: ${Array.isArray(k.keywords) ? k.keywords.slice(0, 4).join(', ') : k.keywords}
                    </div>
                  ` : ''}
                </td>
                <td>
                  <span style="font-size: 11px; background: rgba(255, 255, 255, 0.06); padding: 3px 8px; border-radius: 4px; color: #94a3b8;">
                    ${k.kategori || 'Kepegawaian'}
                  </span>
                </td>
                <td style="text-align: center;">
                  <button class="btn-landing-glass" style="padding: 5px 10px; font-size: 11.5px;" onclick="LandingModule.copyText('${k.kode}')" title="Salin Kode Klasifikasi">
                    📋 Salin
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      App.showToast(`Berhasil disalin: ${text}`, 'success');
    }).catch(() => {
      prompt('Salin teks berikut:', text);
    });
  },

  initSmoothScroll() {
    document.querySelectorAll('.landing-nav-links a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};
