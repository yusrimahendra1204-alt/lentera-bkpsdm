// Smart Auto-Suggest Engine - Matching Perihal Surat to Perbup Luwu Timur No. 69 Tahun 2023
class SmartAutoSuggest {
  constructor(options) {
    this.input = typeof options.input === 'string' ? document.querySelector(options.input) : options.input;
    this.targetCodeInput = typeof options.targetCode === 'string' ? document.querySelector(options.targetCode) : options.targetCode;
    this.targetNameInput = typeof options.targetName === 'string' ? document.querySelector(options.targetName) : options.targetName;
    this.onSelect = options.onSelect || null;
    this.debounceTime = options.debounce || 200;
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

    this.debounceTimer = setTimeout(async () => {
      this.results = await Store.searchKlasifikasi(query, '', 8);
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
        const regex = new RegExp(`(${token})`, 'gi');
        displayName = displayName.replace(regex, '<mark>$1</mark>');
      });

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

      return `
        <div class="autosuggest-item" data-index="${index}">
          <div class="autosuggest-code">${item.kode}</div>
          <div class="autosuggest-details">
            <div class="autosuggest-title">${displayName}</div>
            <div class="autosuggest-category">${catBadge}</div>
          </div>
        </div>
      `;
    }).join('');

    this.dropdown.innerHTML = `
      <div class="autosuggest-header">
        <span>⚡ Rekomendasi Kode Perbup No. 69/2023 (${this.results.length})</span>
        <span style="font-size: 10px; color: #94a3b8;">Klik untuk pilih otomatis</span>
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

  selectItem(item) {
    if (!item) return;

    if (this.targetCodeInput) {
      this.targetCodeInput.value = item.kode;
      this.flashInput(this.targetCodeInput);
    }

    if (this.targetNameInput) {
      this.targetNameInput.value = item.nama;
      this.flashInput(this.targetNameInput);
    }

    if (this.onSelect) {
      this.onSelect(item);
    }

    this.hideDropdown();

    // Trigger change events
    if (this.targetCodeInput) {
      this.targetCodeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
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
