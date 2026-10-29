// Database & Backup Management Module - E-Office BKPSDM Kab. Luwu Timur
const DatabaseModule = {
  stats: null,

  async render() {
    const container = document.getElementById('view-database');
    if (!container) return;

    // Fetch stats
    this.stats = await Store.getDatabaseStats();

    const sqlInfo = this.stats && this.stats.sql ? this.stats.sql : { exists: false, size_kb: 0 };
    const dateFormatted = sqlInfo.mtime ? new Date(sqlInfo.mtime).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }) : 'Baru saja disinkronkan';

    container.innerHTML = `
      <div class="module-header-container">
        <div>
          <h2 class="module-title">Manajemen Basis Data & Cadangan (Portabilitas Sistem)</h2>
          <p class="module-subtitle">Kelola sinkronisasi file MySQL, pencadangan otomatis, dan pemindahan data saat berpindah laptop.</p>
        </div>
        <div class="module-actions">
          <a href="/api/database/download-sql" class="btn btn-primary" download="database_persuratan.sql">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Unduh database_persuratan.sql
          </a>
          <a href="/api/database/backup-json" class="btn btn-accent" download>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Cadangkan (JSON Snapshot)
          </a>
        </div>
      </div>

      <!-- Status Cards Grid -->
      <div class="dashboard-stats-grid mb-4">
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Status File MySQL Dump</span>
            <span class="badge ${sqlInfo.exists ? 'badge-success' : 'badge-warning'}">${sqlInfo.exists ? 'Tersedia' : 'Belum Ada'}</span>
          </div>
          <div class="stat-value" style="font-size: 20px; font-weight: 700; color: var(--primary);">
            database_persuratan.sql
          </div>
          <div class="stat-desc">
            Ukuran: <strong>${sqlInfo.size_kb} KB</strong> | Diperbarui: ${dateFormatted}
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Total Arsip Surat Masuk</span>
            <div class="stat-icon-wrapper info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </div>
          <div class="stat-value">${this.stats ? this.stats.surat_masuk : Store.state.surat_masuk.length}</div>
          <div class="stat-desc">Termasuk nomor surat instansi luar & kode internal</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Disposisi & Surat Keluar</span>
            <div class="stat-icon-wrapper success">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            </div>
          </div>
          <div class="stat-value">${this.stats ? this.stats.disposisi : Store.state.disposisi.length} / ${this.stats ? this.stats.surat_keluar : Store.state.surat_keluar.length}</div>
          <div class="stat-desc">${Store.state.surat_tugas.length} Surat Perintah Tugas (SPT Dinas)</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-title">Master Regulasi Perbup 69/2023</span>
            <div class="stat-icon-wrapper warning">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
          </div>
          <div class="stat-value">${this.stats ? this.stats.klasifikasi : 2961}</div>
          <div class="stat-desc">100% Master Kode Terindeks & Siap Di-auto-suggest</div>
        </div>
      </div>

      <!-- Migration Guide Card (Portabilitas Laptop) -->
      <div class="card mb-4" style="border-left: 4px solid var(--primary); background: linear-gradient(to right, #f0f9ff 0%, #ffffff 100%);">
        <div class="card-header" style="border-bottom: 1px solid #e0f2fe;">
          <h3 style="font-size: 16px; color: #0369a1; display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Petunjuk Praktis: Cara Memindahkan Database & Aplikasi ke Laptop Lain
          </h3>
        </div>
        <div class="card-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
            <div style="background: #ffffff; padding: 16px; border-radius: var(--radius-md); border: 1px solid #bae6fd; box-shadow: var(--shadow-xs);">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="background: #0284c7; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">1</span>
                <strong style="color: #0f172a; font-size: 14.5px;">Bawa Satu Folder Proyek</strong>
              </div>
              <p style="font-size: 13px; color: #475569; line-height: 1.5; margin: 0;">
                Cukup salin (copy) satu folder <code>pengembangan sistem informasi persuratan berbasis web</code> ke Flashdisk atau Google Drive. Di dalamnya sudah memuat kode JavaScript, file data JSON, serta file <code>database_persuratan.sql</code>.
              </p>
            </div>

            <div style="background: #ffffff; padding: 16px; border-radius: var(--radius-md); border: 1px solid #bae6fd; box-shadow: var(--shadow-xs);">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="background: #0284c7; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">2</span>
                <strong style="color: #0f172a; font-size: 14.5px;">Jalankan di Laptop Baru</strong>
              </div>
              <p style="font-size: 13px; color: #475569; line-height: 1.5; margin: 0;">
                Di laptop baru, buka Terminal/CMD pada folder tersebut lalu ketik:
                <br><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0284c7; font-weight: 600;">node server.js</code>
                <br>Aplikasi web langsung berjalan dengan data utuh 100% tanpa wajib konfigurasi MySQL tambahan!
              </p>
            </div>

            <div style="background: #ffffff; padding: 16px; border-radius: var(--radius-md); border: 1px solid #bae6fd; box-shadow: var(--shadow-xs);">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="background: #0284c7; color: #ffffff; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px;">3</span>
                <strong style="color: #0f172a; font-size: 14.5px;">Jika Penguji Meminta MySQL</strong>
              </div>
              <p style="font-size: 13px; color: #475569; line-height: 1.5; margin: 0;">
                Buka <code>http://localhost/phpmyadmin</code> di XAMPP, buat database <code>db_persuratan_bkpsdm</code>, lalu klik tab <strong>Import</strong> dan pilih file <code>database_persuratan.sql</code>. Seluruh tabel dan data langsung sinkron sesuai ERD Skripsi Anda.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Database Actions & Toolset -->
      <div class="row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Left: Backup & Export -->
        <div class="card">
          <div class="card-header">
            <h3>Pencadangan & Ekspor Data</h3>
          </div>
          <div class="card-body">
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 18px;">
              Ekspor seluruh data sistem yang tersimpan saat ini agar siap dipindahkan atau diarsipkan.
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-card-muted); border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 600; font-size: 14px; color: var(--text-main);">File Skema MySQL (.SQL)</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Format standar untuk phpMyAdmin / MySQL Workbench</div>
                </div>
                <a href="/api/database/download-sql" class="btn btn-primary btn-sm" download="database_persuratan.sql">
                  Unduh .SQL
                </a>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-card-muted); border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 600; font-size: 14px; color: var(--text-main);">Snapshot Data JSON (.JSON)</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Cadangan terstruktur untuk pemulihan instan antar komputer</div>
                </div>
                <a href="/api/database/backup-json" class="btn btn-outline btn-sm" download>
                  Unduh .JSON
                </a>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-card-muted); border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 600; font-size: 14px; color: var(--text-main);">Sinkronkan Ulang File SQL</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Paksa regenerasi file database_persuratan.sql dari state terkini</div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="DatabaseModule.triggerSyncSql()">
                  Sinkronkan Sekarang
                </button>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: var(--radius-md);">
                <div>
                  <div style="font-weight: 600; font-size: 14px; color: #be123c;">Bersihkan Semua Data Transaksi (Dummy)</div>
                  <div style="font-size: 12px; color: #9f1239;">Kosongkan seluruh data surat masuk, disposisi, surat keluar, & SPT dinas</div>
                </div>
                <button class="btn btn-sm" style="background:#e11d48; color:#ffffff; font-weight:600;" onclick="DatabaseModule.clearDummyTransactions()">
                  Bersihkan Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Restore / Import -->
        <div class="card">
          <div class="card-header">
            <h3>Pemulihan Data (Restore / Impor)</h3>
          </div>
          <div class="card-body">
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 18px;">
              Pulihkan data persuratan dan disposisi dari file cadangan JSON yang pernah Anda unduh di laptop lain.
            </p>

            <div style="border: 2px dashed var(--border-color); padding: 24px 20px; border-radius: var(--radius-md); text-align: center; background: #fafafa;" id="dropzone-restore">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="1.8" style="margin-bottom: 10px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 6px;">Pilih File Cadangan JSON</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">File harus bertipe .json yang diekspor dari sistem ini</div>
              
              <input type="file" id="input-restore-file" accept=".json" style="display: none;" onchange="DatabaseModule.handleFileSelect(event)">
              <button class="btn btn-outline btn-sm" onclick="document.getElementById('input-restore-file').click()">
                Pilih File Cadangan...
              </button>
            </div>

            <div style="margin-top: 16px; padding: 12px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: var(--radius-sm); font-size: 12px; color: #92400e;">
              <strong>Perhatian:</strong> Memulihkan data akan menggantikan data surat yang sedang aktif dengan isi data pada file cadangan tersebut.
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async triggerSyncSql() {
    App.showToast('Menyinkronkan file database_persuratan.sql...', 'info');
    const success = await Store.syncSql();
    if (success) {
      App.showToast('File database_persuratan.sql berhasil disinkronkan!', 'success');
      this.render();
    } else {
      App.showToast('Gagal menyinkronkan file SQL', 'danger');
    }
  },

  async clearDummyTransactions() {
    const confirmed = confirm("Apakah Anda yakin ingin membersihkan seluruh data surat transaksi dummy?\n\nSemua surat masuk, disposisi, surat keluar, dan surat tugas akan dikosongkan. Data akun pegawai dan master kode klasifikasi tetap aman.");
    if (!confirmed) return;

    App.showToast('Membersihkan seluruh data transaksi dummy...', 'info');
    const success = await Store.clearDummyData();
    if (success) {
      App.showToast('Data dummy berhasil dibersihkan! Sistem kini bersih.', 'success');
      this.render();
    } else {
      App.showToast('Gagal membersihkan data', 'danger');
    }
  },

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.pegawai || !Array.isArray(parsed.pegawai)) {
          alert('File tidak valid: Struktur data cadangan tidak cocok dengan sistem persuratan BKPSDM.');
          return;
        }

        const confirmRestore = confirm(`Konfirmasi Pemulihan:\nFile ini berisi:\n- ${parsed.surat_masuk ? parsed.surat_masuk.length : 0} Surat Masuk\n- ${parsed.disposisi ? parsed.disposisi.length : 0} Disposisi\n- ${parsed.surat_keluar ? parsed.surat_keluar.length : 0} Surat Keluar\n- ${parsed.surat_tugas ? parsed.surat_tugas.length : 0} Surat Tugas\n\nLanjutkan pemulihan data?`);
        
        if (confirmRestore) {
          App.showToast('Memulihkan basis data...', 'info');
          const res = await Store.restoreData(parsed);
          if (res && res.success) {
            App.showToast('Basis data berhasil dipulihkan dengan sempurna!', 'success');
            this.render();
          } else {
            App.showToast(res ? res.message : 'Gagal memulihkan database', 'danger');
          }
        }
      } catch (err) {
        alert('Gagal membaca file JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  }
};
