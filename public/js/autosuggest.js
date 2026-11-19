// Smart Auto-Suggest Engine - Matching Perihal Surat to Perbup Luwu Timur No. 69 Tahun 2023
class SmartAutoSuggest {
  static RAHASIA_CODES = ['800.1.8.1', '800.1.6.1', '800.1.6.2', '800.1.6.4', '800.1.6.5'];

  static isRahasiaCode(kode) {
    const clean = String(kode || '').trim();
    return SmartAutoSuggest.RAHASIA_CODES.includes(clean);
  }

  static isRahasiaPerihal(text) {
    const q = String(text || '').toLowerCase();
    return /\b(cerai|perceraian|izin\s+cerai|gugatan\s+cerai|akta\s+cerai|hukuman\s+disiplin|pelanggaran\s+disiplin|sidang\s+kode\s+etik|pemberhentian\s+dengan\s+tidak\s+hormat|pemberhentian\s+sementara)\b/i.test(q);
  }

  static detectInstantCode(text) {
    const q = String(text || '').toLowerCase().trim();
    if (/\b(cerai|perceraian|izin\s+cerai|gugatan\s+cerai|mediasi\s+perceraian)\b/i.test(q)) {
      return {
        kode: '800.1.8.1',
        nama: 'Status Kepegawaian',
        kategori: '800',
        is_rahasia: true,
        sifat_default: 'Rahasia'
      };
    }
    if (/\b(hukuman\s+disiplin|pelanggaran\s+disiplin|sidang\s+disiplin|pemeriksaan\s+disiplin|bap\s+disiplin)\b/i.test(q)) {
      return {
        kode: '800.1.6.2',
        nama: 'Disiplin',
        kategori: '800',
        is_rahasia: true,
        sifat_default: 'Rahasia'
      };
    }
    if (/\b(sidang\s+kode\s+etik|pelanggaran\s+kode\s+etik)\b/i.test(q)) {
      return {
        kode: '800.1.6.1',
        nama: 'Kode etik Pegawai',
        kategori: '800',
        is_rahasia: true,
        sifat_default: 'Rahasia'
      };
    }
    if (/\b(pemberhentian\s+dengan\s+tidak\s+hormat|ptdh)\b/i.test(q)) {
      return {
        kode: '800.1.6.4',
        nama: 'Pemberhentian Dengan Tidak Hormat',
        kategori: '800',
        is_rahasia: true,
        sifat_default: 'Rahasia'
      };
    }
    return null;
  }

  constructor(options) {
    this.input = typeof options.input === 'string' ? document.querySelector(options.input) : options.input;
    this.targetCodeInput = typeof options.targetCode === 'string' ? document.querySelector(options.targetCode) : options.targetCode;
    this.targetNameInput = typeof options.targetName === 'string' ? document.querySelector(options.targetName) : options.targetName;
    this.targetSifatInput = typeof options.targetSifat === 'string' ? document.querySelector(options.targetSifat) : options.targetSifat;
    this.onSelect = options.onSelect || null;
    this.autoFillTop = options.autoFillTop !== false;
    this.debounceTime = options.debounce || 180;
    this.debounceTimer = null;
    this.dropdown = null;
    this.selectedIndex = -1;
    this.results = [];

    if (this.input) {
      this.init();
    }
  }

  init() {
    // Create dropdown element
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'autosuggest-dropdown';
    
    // Ensure parent has position relative
    const parent = this.input.parentElement;
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    parent.appendChild(this.dropdown);

    // Event listeners
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.input.addEventListener('focus', () => {
      if (this.input.value.trim().length >= 2 && this.results.length) {
        this.showDropdown();
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }

  handleInput(e) {
    clearTimeout(this.debounceTimer);
    const query = this.input.value.trim();

    if (query.length < 2) {
      this.hideDropdown();
      return;
    }

    // Deteksi instan untuk kata kunci sensitif/rahasia (seperti "cerai" / "disiplin")
    const instantItem = SmartAutoSuggest.detectInstantCode(query);
    if (instantItem) {
      this.applyItemFields(instantItem, true);
    }

    this.debounceTimer = setTimeout(async () => {
      let fetched = await Store.searchKlasifikasi(query, '', 8);
      if (instantItem) {
        // Pastikan kode rahasia instan selalu berada di urutan paling atas (#1)
        const existingIdx = fetched.findIndex(x => x.kode === instantItem.kode);
        if (existingIdx > 0) {
          const [found] = fetched.splice(existingIdx, 1);
          fetched.unshift({ ...found, ...instantItem });
        } else if (existingIdx === -1) {
          fetched.unshift(instantItem);
        } else if (existingIdx === 0) {
          fetched[0] = { ...fetched[0], ...instantItem };
        }
      }
      this.results = fetched;

      // Auto-fill otomatis rekomendasi terbaik (#1) saat mengetik perihal
      if (this.autoFillTop && this.results.length > 0) {
        this.applyItemFields(this.results[0], true);
      }

      this.renderResults(query);
    }, this.debounceTime);
  }

  handleKeydown(e) {
    if (!this.dropdown.classList.contains('show')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.results.length - 1);
      this.updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      this.updateSelection();
    } else if (e.key === 'Enter') {
      if (this.selectedIndex >= 0 && this.results[this.selectedIndex]) {
        e.preventDefault();
        this.selectItem(this.results[this.selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      this.hideDropdown();
    }
  }

  updateSelection() {
    const items = this.dropdown.querySelectorAll('.autosuggest-item');
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  renderResults(query) {
    if (!this.results || !this.results.length) {
      this.dropdown.innerHTML = `
        <div class="autosuggest-header">
          <span>Rekomendasi Kode Perbup Luwu Timur 2023</span>
        </div>
        <div style="padding: 12px; font-size: 12.5px; color: #64748b; text-align: center;">
          Tidak ditemukan kode spesifik untuk kata kunci ini. Anda dapat memilih secara manual.
        </div>
      `;
      this.showDropdown();
      return;
    }

    const qTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

    const itemsHTML = this.results.map((item, index) => {
      let displayName = item.nama;
      // Highlight matching words
      qTokens.forEach(token => {
        const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        displayName = displayName.replace(regex, '<mark>$1</mark>');
      });

      const isRahasia = Boolean(item.is_rahasia || SmartAutoSuggest.isRahasiaCode(item.kode));

      const categoryNames = {
        '000': '000 UMUM & KETATAUSAHAAN',
        '100': '100 PEMERINTAHAN & HUKUM',
        '200': '200 POLITIK',
        '300': '300 KEAMANAN & KETERTIBAN',
        '400': '400 KESEJAHTERAAN RAKYAT',
        '500': '500 PEREKONOMIAN',
        '600': '600 PEKERJAAN UMUM',
        '700': '700 PENGAWASAN',
        '800': '800 KEPEGAWAIAN (BKPSDM)',
        '900': '900 KEUANGAN'
      };
      const catLabel = categoryNames[item.kategori] || `Kategori ${item.kategori}`;
      const catColor = item.kategori === '800' ? '#059669' : (item.kategori === '000' ? '#0284c7' : (item.kategori === '900' ? '#d97706' : '#64748b'));
      const catBadge = `<span style="color:${catColor}; font-weight:700;">● ${catLabel}</span>`;
      const rahasiaBadge = isRahasia
        ? `<span style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; padding:1px 6px; border-radius:4px; font-size:10px; font-weight:800; margin-left:6px;">🔒 KODE RAHASIA</span>`
        : '';

      return `
        <div class="autosuggest-item" data-index="${index}" style="${isRahasia ? 'background:#fff5f5; border-left:3px solid #dc2626;' : ''}">
          <div class="autosuggest-code" style="${isRahasia ? 'background:#fee2e2; color:#b91c1c; border-color:#fca5a5;' : ''}">${item.kode}</div>
          <div class="autosuggest-details">
            <div class="autosuggest-title">${displayName} ${rahasiaBadge}</div>
            <div class="autosuggest-category">${catBadge}${index === 0 ? ' <span style="color:#0284c7; font-weight:700; margin-left:6px;">✓ Terpilih Otomatis</span>' : ''}</div>
          </div>
        </div>
      `;
    }).join('');

    this.dropdown.innerHTML = `
      <div class="autosuggest-header">
        <span>⚡ Rekomendasi Kode Perbup No. 69/2023 (${this.results.length})</span>
        <span style="font-size: 10px; color: #94a3b8;">Otomatis terisi &bull; Klik untuk ganti</span>
      </div>
      <div class="autosuggest-list">
        ${itemsHTML}
      </div>
    `;

    // Attach click events
    const items = this.dropdown.querySelectorAll('.autosuggest-item');
    items.forEach((elem) => {
      elem.addEventListener('click', () => {
        const idx = parseInt(elem.getAttribute('data-index'), 10);
        this.selectItem(this.results[idx]);
      });
    });

    this.selectedIndex = 0;
    this.updateSelection();
    this.showDropdown();
  }

  applyItemFields(item, isAuto = false) {
    if (!item) return;

    if (this.targetCodeInput) {
      this.targetCodeInput.value = item.kode;
      if (!isAuto) this.flashInput(this.targetCodeInput);
    }

    if (this.targetNameInput) {
      this.targetNameInput.value = item.nama;
      if (!isAuto) this.flashInput(this.targetNameInput);
    }

    const isRahasia = Boolean(item.is_rahasia || SmartAutoSuggest.isRahasiaCode(item.kode) || SmartAutoSuggest.isRahasiaPerihal(this.input?.value));
    if (this.targetSifatInput && isRahasia) {
      this.targetSifatInput.value = 'Rahasia';
      this.targetSifatInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (this.onSelect) {
      this.onSelect(item, isAuto);
    }

    if (this.targetCodeInput) {
      this.targetCodeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  selectItem(item) {
    if (!item) return;
    this.applyItemFields(item, false);
    this.hideDropdown();
  }

  flashInput(element) {
    element.style.transition = 'background-color 0.4s ease, border-color 0.4s ease';
    element.style.backgroundColor = '#ecfdf5';
    element.style.borderColor = '#10b981';
    setTimeout(() => {
      element.style.backgroundColor = '';
      element.style.borderColor = '';
    }, 1200);
  }

  showDropdown() {
    this.dropdown.classList.add('show');
  }

  hideDropdown() {
    this.dropdown.classList.remove('show');
    this.selectedIndex = -1;
  }
}
