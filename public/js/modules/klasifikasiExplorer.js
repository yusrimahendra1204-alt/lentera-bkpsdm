// Klasifikasi Perbup 69/2023 Explorer Module
const KlasifikasiExplorerModule = {
  currentCategory: '',
  searchQuery: '',
  currentPage: 1,
  pageSize: 50, // 25 | 50 | 100 | 250 | 3000 (Semua)
  allResults: [],
  isLoading: false,

  CATEGORY_COUNTS: {
    '': 2961,
    '000': 234,
    '100': 75,
    '200': 83,
    '300': 41,
    '400': 726,
    '500': 1300,
    '600': 282,
    '700': 16,
    '800': 119,
    '900': 85
  },

  CAT_MAP: {
    '000': { name: '000 UMUM & KETATAUSAHAAN', color: '#0284c7', bg: '#e0f2fe' },
    '100': { name: '100 PEMERINTAHAN & HUKUM', color: '#4338ca', bg: '#e0e7ff' },
    '200': { name: '200 POLITIK', color: '#b91c1c', bg: '#fee2e2' },
    '300': { name: '300 KEAMANAN & KETERTIBAN', color: '#c2410c', bg: '#ffedd5' },
    '400': { name: '400 KESRA', color: '#0f766e', bg: '#ccfbf1' },
    '500': { name: '500 PEREKONOMIAN', color: '#0e7490', bg: '#cffafe' },
    '600': { name: '600 PEKERJAAN UMUM', color: '#475569', bg: '#f1f5f9' },
    '700': { name: '700 PENGAWASAN (INSPEKTORAT)', color: '#7e22ce', bg: '#f3e8ff' },
    '800': { name: '800 KEPEGAWAIAN (BKPSDM)', color: '#047857', bg: '#d1fae5' },
    '900': { name: '900 KEUANGAN DAERAH', color: '#b45309', bg: '#fef3c7' }
  },

  async render() {
    const container = document.getElementById('view-klasifikasi');
    if (!container) return;

    container.innerHTML = `
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:12px;">
          <div class="card-title-group">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="regulation-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                Peraturan Bupati Luwu Timur No. 69 Tahun 2023
              </span>
            </div>
            <h2 style="margin-top:6px;">Kamus Master Kode Klasifikasi Arsip Daerah (2.961 Kode Lengkap)</h2>
            <p>Database terpadu seluruh 10 urusan pemerintahan daerah Kabupaten Luwu Timur (Permendagri No. 83/2022)</p>
          </div>
          <div style="position:relative; width:340px; max-width:100%;">
            <input type="text" id="explorer-search" class="form-control" placeholder="Cari kode (misal: 800, 000) atau perihal..." value="${this.searchQuery}" oninput="KlasifikasiExplorerModule.onSearch(this.value)">
          </div>
        </div>

        <!-- Filter Category Tabs dengan Badge Jumlah Kode Asli -->
        <div style="padding:12px 20px; border-bottom:1px solid var(--border-color); background:#fafbfc; display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
          <button class="btn btn-sm ${!this.currentCategory ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('')">
            Semua (2.961)
          </button>
          <button class="btn btn-sm ${this.currentCategory === '800' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('800')" style="font-weight:700; ${this.currentCategory !== '800' ? 'color:#047857; border-color:#86efac; background:#f0fdf4;' : ''}">
            ⭐ 800 Kepegawaian (${this.CATEGORY_COUNTS['800']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '000' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('000')">
            000 Umum (${this.CATEGORY_COUNTS['000']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '900' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('900')">
            900 Keuangan (${this.CATEGORY_COUNTS['900']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '700' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('700')">
            700 Pengawasan (${this.CATEGORY_COUNTS['700']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '100' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('100')">
            100 Pemerintahan (${this.CATEGORY_COUNTS['100']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '400' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('400')">
            400 Kesra (${this.CATEGORY_COUNTS['400']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '500' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('500')">
            500 Perekonomian (${this.CATEGORY_COUNTS['500']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '600' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('600')">
            600 PU (${this.CATEGORY_COUNTS['600']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '200' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('200')">
            200 Politik (${this.CATEGORY_COUNTS['200']})
          </button>
          <button class="btn btn-sm ${this.currentCategory === '300' ? 'btn-primary' : 'btn-outline'}" onclick="KlasifikasiExplorerModule.setCategory('300')">
            300 Keamanan (${this.CATEGORY_COUNTS['300']})
          </button>
        </div>

        <!-- Top Controls: Info Bar & Page Size Selector -->
        <div style="padding:10px 20px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div id="explorer-info-text" style="font-size:13px; font-weight:600; color:#334155;">
            Memuat data kode klasifikasi...
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <label style="font-size:12.5px; color:#475569; font-weight:600;">Tampilkan per halaman:</label>
            <select id="explorer-page-size" class="form-control" style="width:auto; padding:4px 10px; font-size:12.5px; font-weight:700;" onchange="KlasifikasiExplorerModule.onPageSizeChange(this.value)">
              <option value="50" ${this.pageSize === 50 ? 'selected' : ''}>50 Baris</option>
              <option value="100" ${this.pageSize === 100 ? 'selected' : ''}>100 Baris</option>
              <option value="250" ${this.pageSize === 250 ? 'selected' : ''}>250 Baris</option>
              <option value="3500" ${this.pageSize >= 3000 ? 'selected' : ''}>Tampilkan Semua (2.961 Kode)</option>
            </select>
          </div>
        </div>

        <div class="card-body" style="padding:0;">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width:150px;">Kode Klasifikasi</th>
                  <th>Keterangan / Nama Klasifikasi Arsip</th>
                  <th>Rumpun Kategori</th>
                  <th style="text-align:right; width:100px;">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbody-explorer">
                <tr><td colspan="4" style="text-align:center; padding:36px; color:#64748b;">Memuat data kode klasifikasi...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bottom Pagination Bar -->
        <div id="explorer-pagination-container" style="padding:12px 20px; border-top:1px solid #e2e8f0; background:#f8fafc; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <!-- Will be rendered dynamically -->
        </div>
      </div>
    `;

    await this.fetchData();
  },

  async fetchData() {
    this.isLoading = true;
    const tbody = document.getElementById('tbody-explorer');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:36px; color:#64748b;">Mengambil database klasifikasi Perbup...</td></tr>`;
    }

    // Fetch all matching data (up to 3500 items so all 2.961 are loaded into client memory)
    this.allResults = await Store.searchKlasifikasi(this.searchQuery, this.currentCategory, 3500);
    this.currentPage = 1;
    this.isLoading = false;
    this.renderCurrentPage();
  },

  renderCurrentPage() {
    const tbody = document.getElementById('tbody-explorer');
    const infoText = document.getElementById('explorer-info-text');
    const paginationContainer = document.getElementById('explorer-pagination-container');
    if (!tbody) return;

    const total = this.allResults.length;

    if (!total) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:36px; color:#94a3b8;">Tidak ada kode yang cocok dengan pencarian Anda.</td></tr>`;
      if (infoText) infoText.innerHTML = `Ditemukan <strong>0</strong> kode klasifikasi`;
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    const effectivePageSize = this.pageSize >= 3000 ? total : this.pageSize;
    const totalPages = Math.ceil(total / effectivePageSize) || 1;
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const startIndex = (this.currentPage - 1) * effectivePageSize;
    const endIndex = Math.min(startIndex + effectivePageSize, total);
    const pageItems = this.allResults.slice(startIndex, endIndex);

    // Update info text
    if (infoText) {
      const catLabel = this.currentCategory ? `Kategori ${this.currentCategory}` : 'Seluruh Rumpun';
      infoText.innerHTML = `
        Menampilkan baris <strong>${startIndex + 1}</strong> s/d <strong>${endIndex}</strong> dari total <strong>${total.toLocaleString('id-ID')}</strong> Kode Klasifikasi (${catLabel})
      `;
    }

    // Render table rows
    tbody.innerHTML = pageItems.map(item => {
      const catInfo = this.CAT_MAP[item.kategori] || { name: `Kategori ${item.kategori}`, color: '#64748b', bg: '#f1f5f9' };
      return `
        <tr>
          <td>
            <span style="font-family:monospace; font-weight:800; font-size:13.5px; padding:3px 8px; border-radius:4px; background:${catInfo.bg}; color:${catInfo.color}; border:1px solid ${catInfo.color}44;">
              ${item.kode}
            </span>
          </td>
          <td>
            <div style="font-size:13.5px; font-weight:600; color:var(--text-main); line-height:1.4;">
              ${item.nama}
            </div>
            ${item.keywords && item.keywords.length ? `
              <div style="font-size:11px; color:#94a3b8; margin-top:2px;">
                Kata kunci: ${item.keywords.slice(0, 8).join(', ')}
              </div>
            ` : ''}
          </td>
          <td>
            <span style="font-size:11px; font-weight:700; color:${catInfo.color}; background:${catInfo.bg}; padding:3px 8px; border-radius:999px; white-space:nowrap;">
              ${catInfo.name}
            </span>
          </td>
          <td style="text-align:right;">
            <button class="btn btn-outline btn-sm" onclick="KlasifikasiExplorerModule.copyCode('${item.kode}')" title="Salin Kode ke Naskah Word">
              Salin
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Render Pagination Controls
    if (paginationContainer) {
      if (totalPages <= 1) {
        paginationContainer.innerHTML = `
          <div style="font-size:12px; color:#64748b;">
            Menampilkan seluruh data dalam 1 halaman.
          </div>
        `;
      } else {
        paginationContainer.innerHTML = `
          <div style="font-size:12.5px; color:#475569;">
            Halaman <strong>${this.currentPage}</strong> dari <strong>${totalPages}</strong>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn btn-outline btn-sm" ${this.currentPage <= 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="KlasifikasiExplorerModule.goToPage(1)" title="Halaman Pertama">
              ⏮️ Awal
            </button>
            <button class="btn btn-outline btn-sm" ${this.currentPage <= 1 ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="KlasifikasiExplorerModule.goToPage(${this.currentPage - 1})" title="Halaman Sebelumnya">
              ◀️ Sebelumnya
            </button>

            <!-- Jump to page selector -->
            <select class="form-control" style="width:auto; padding:3px 8px; font-size:12px;" onchange="KlasifikasiExplorerModule.goToPage(parseInt(this.value, 10))">
              ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
                <option value="${p}" ${p === this.currentPage ? 'selected' : ''}>Hlm ${p}</option>
              `).join('')}
            </select>

            <button class="btn btn-outline btn-sm" ${this.currentPage >= totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="KlasifikasiExplorerModule.goToPage(${this.currentPage + 1})" title="Halaman Selanjutnya">
              Selanjutnya ▶️
            </button>
            <button class="btn btn-outline btn-sm" ${this.currentPage >= totalPages ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="KlasifikasiExplorerModule.goToPage(${totalPages})" title="Halaman Terakhir">
              Akhir ⏭️
            </button>
          </div>
        `;
      }
    }
  },

  goToPage(page) {
    this.currentPage = page;
    this.renderCurrentPage();
    const container = document.getElementById('view-klasifikasi');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  onPageSizeChange(val) {
    this.pageSize = parseInt(val, 10);
    this.currentPage = 1;
    this.renderCurrentPage();
  },

  setCategory(kat) {
    this.currentCategory = kat;
    this.currentPage = 1;
    this.render();
  },

  onSearch(query) {
    this.searchQuery = query;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.fetchData();
    }, 250);
  },

  copyCode(kode) {
    navigator.clipboard.writeText(kode).then(() => {
      App.showToast(`Kode ${kode} berhasil disalin ke clipboard`, 'success');
    }).catch(() => {
      App.showToast(`Kode ${kode}`, 'info');
    });
  }
};
