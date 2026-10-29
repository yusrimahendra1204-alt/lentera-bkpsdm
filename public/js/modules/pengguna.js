// Modul Kelola Pegawai & Pengguna Sistem (User Management CRUD & RBAC)
// SIPADU - BKPSDM Kabupaten Luwu Timur
const PenggunaModule = {
  render() {
    const container = document.getElementById('view-pengguna');
    if (!container) return;

    const currentUser = Store.state.currentUser;
    const isAdmin = Boolean(currentUser && (currentUser.role === 'admin' || currentUser.nip === '199911202025211015'));

    // Strict RBAC Guard: Hanya Admin yang berhak melihat dan mengelola menu pengguna
    if (!isAdmin) {
      container.innerHTML = `
        <div class="card" style="padding: 60px 24px; text-align: center;">
          <div style="width: 68px; height: 68px; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 32px;">
            🔒
          </div>
          <h2 style="color: #991b1b; font-size: 22px; font-weight: 800; margin-bottom: 8px;">Akses Ditolak: Khusus Administrator Sistem</h2>
          <p style="color: #64748b; font-size: 14.5px; max-width: 540px; margin: 0 auto 24px; line-height: 1.6;">
            Menu Manajemen Data Pegawai & Hak Akses Pengguna hanya dapat dikelola oleh <strong>Administrator Sistem (Subbag Umum & Kepegawaian)</strong>. Role akun Anda saat ini tidak memiliki wewenang untuk menambah, mengubah, atau menghapus akun pengguna.
          </p>
          <div>
            <button class="btn btn-primary" onclick="App.navigate('dashboard')">
              Kembali ke Dashboard Utama
            </button>
          </div>
        </div>
      `;
      return;
    }

    const list = Store.state.pegawai || [];
    const totalAdmin = list.filter(p => p.role === 'admin').length;
    const totalPimpinan = list.filter(p => p.role === 'kepala_bkpsdm' || p.role === 'sekretaris' || p.role === 'kabid').length;
    const totalStaf = list.filter(p => p.role === 'pegawai').length;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="regulation-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Role-Based Access Control (RBAC)
              </span>
            </div>
            <h2 style="margin-top:4px;">Manajemen Data Pegawai & Hak Akses Pengguna</h2>
            <p>Pengelolaan akun pengguna, NIP aparatur, pangkat/golongan, jabatan, dan pembagian hak akses operasional SIPADU BKPSDM Luwu Timur (Khusus Administrator).</p>
          </div>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <div style="position:relative; width: 220px;">
              <input type="text" id="search-pegawai" class="form-control" placeholder="Cari NIP / nama / jabatan..." oninput="PenggunaModule.filterTable()">
            </div>
            <button class="btn btn-outline" onclick="PenggunaModule.loadMasterData()" title="Muat 44 Master Pegawai BKPSDM 2026 (Opsional)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Muat 44 Master Pegawai
            </button>
            <button class="btn btn-primary" onclick="PenggunaModule.openCreateModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Tambah Pegawai Baru
            </button>
          </div>
        </div>

        <!-- KPI Mini Grid -->
        <div style="background:#f8fafc; border-bottom:1px solid var(--border-color); padding:14px 24px; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px;">
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:8px; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-weight:800;">
              👥
            </div>
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Total Akun Pegawai</div>
              <div style="font-size:18px; font-weight:800; color:#0f172a;">${list.length} Orang</div>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:8px; background:#dcfce7; color:#15803d; display:flex; align-items:center; justify-content:center; font-weight:800;">
              🎖️
            </div>
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Pimpinan & Struktural</div>
              <div style="font-size:18px; font-weight:800; color:#15803d;">${totalPimpinan} Pejabat</div>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:8px; background:#fef3c7; color:#b45309; display:flex; align-items:center; justify-content:center; font-weight:800;">
              🔑
            </div>
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Admin Agendaris</div>
              <div style="font-size:18px; font-weight:800; color:#b45309;">${totalAdmin} Admin</div>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:flex; align-items:center; gap:12px;">
            <div style="width:38px; height:38px; border-radius:8px; background:#f1f5f9; color:#475569; display:flex; align-items:center; justify-content:center; font-weight:800;">
              💼
            </div>
            <div>
              <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Staf Pelaksana</div>
              <div style="font-size:18px; font-weight:800; color:#475569;">${totalStaf} Pegawai</div>
            </div>
          </div>
        </div>

        <div class="card-body" style="padding:0;">
          <div class="table-responsive">
            <table class="data-table" id="table-pegawai">
              <thead>
                <tr>
                  <th>No</th>
                  <th>NIP Pegawai</th>
                  <th>Nama Lengkap & Gelar</th>
                  <th>Pangkat / Golongan</th>
                  <th>Jabatan & Unit Kerja</th>
                  <th>Hak Akses (Role)</th>
                  <th style="text-align:right;">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbody-pegawai">
                ${this.renderRows(list)}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card-footer">
          <span style="font-size:12.5px; color:var(--text-muted);">
            Menampilkan <strong>${list.length}</strong> pegawai terdaftar di BKPSDM Luwu Timur
          </span>
        </div>
      </div>
    `;
  },

  renderRows(list) {
    if (!list.length) {
      return `<tr><td colspan="7" style="text-align:center; padding:32px; color:#94a3b8;">Belum ada data pegawai yang terdaftar.</td></tr>`;
    }

    return list.map((p, index) => {
      const roleBadges = {
        kepala_bkpsdm: '<span class="badge badge-primary" style="background:#1e3a8a; color:#ffffff;">Kepala BKPSDM</span>',
        sekretaris: '<span class="badge badge-info" style="background:#0284c7; color:#ffffff;">Sekretaris Badan</span>',
        kabid: '<span class="badge badge-accent" style="background:#059669; color:#ffffff;">Kepala Bidang</span>',
        admin: '<span class="badge badge-warning" style="background:#d97706; color:#ffffff;">Admin Agendaris</span>',
        pegawai: '<span class="badge badge-secondary" style="background:#e2e8f0; color:#334155;">Staf Pelaksana</span>'
      };

      const isCurrent = Store.state.currentUser && Store.state.currentUser.id === p.id;

      return `
        <tr>
          <td style="font-weight:600; color:#64748b; width:40px;">${index + 1}</td>
          <td>
            <span style="font-family:monospace; font-weight:700; color:#0f172a; font-size:13px;">
              ${p.nip}
            </span>
          </td>
          <td>
            <div style="font-weight:700; color:var(--text-main); font-size:13.5px; display:flex; align-items:center; gap:6px;">
              ${p.nama}
              ${isCurrent ? '<span class="badge badge-success" style="font-size:10px; padding:1px 5px;">Sesi Aktif</span>' : ''}
            </div>
          </td>
          <td>
            <div style="font-size:12.5px; color:#334155; font-weight:500;">
              ${p.pangkat || '-'}
            </div>
          </td>
          <td>
            <div style="font-weight:600; font-size:13px; color:#0f172a;">${p.jabatan}</div>
            <div style="font-size:11.5px; color:#64748b; margin-top:2px;">Unit: ${p.unit}</div>
          </td>
          <td>
            ${roleBadges[p.role] || p.role}
          </td>
          <td style="text-align:right;">
            <div style="display:flex; justify-content:flex-end; gap:6px;">
              <button class="btn btn-outline btn-sm" onclick="PenggunaModule.openEditModal(${p.id})">
                Edit
              </button>
              <button class="btn btn-danger-outline btn-sm" onclick="PenggunaModule.confirmDelete(${p.id}, '${p.nama.replace(/'/g, "\\'")}')" ${isCurrent ? 'disabled title="Tidak dapat menghapus akun Anda sendiri"' : ''}>
                Hapus
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterTable() {
    const q = (document.getElementById('search-pegawai')?.value || '').toLowerCase();
    const list = (Store.state.pegawai || []).filter(p => 
      p.nip.toLowerCase().includes(q) ||
      p.nama.toLowerCase().includes(q) ||
      p.jabatan.toLowerCase().includes(q) ||
      (p.pangkat || '').toLowerCase().includes(q) ||
      p.unit.toLowerCase().includes(q)
    );
    const tbody = document.getElementById('tbody-pegawai');
    if (tbody) tbody.innerHTML = this.renderRows(list);
  },

  openCreateModal() {
    const user = Store.state.currentUser;
    if (!user || (user.role !== 'admin' && user.nip !== '199911202025211015')) {
      App.showToast('Akses Ditolak: Hanya Administrator yang berhak menambah akun pegawai', 'warning');
      return;
    }

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.innerText = 'Tambah Data Pegawai & Pengguna Baru';
    body.innerHTML = `
      <form id="form-pegawai">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nomor Induk Pegawai (NIP) <span class="required">*</span></label>
            <input type="text" id="peg-nip" class="form-control" placeholder="Contoh: 199611022020121005" required maxlength="25">
            <span class="form-hint">Format standar NIP 18 digit aparatur sipil negara</span>
          </div>
          <div class="form-group">
            <label class="form-label">Nama Lengkap & Gelar <span class="required">*</span></label>
            <input type="text" id="peg-nama" class="form-control" placeholder="Contoh: Ahmad Fauzi, S.STP., M.Si." required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Pangkat / Golongan Ruang</label>
            <select id="peg-pangkat" class="form-control">
              <option value="Pembina Utama Muda (IV/c)">Pembina Utama Muda (IV/c)</option>
              <option value="Pembina Utama Pratama (IV/b)">Pembina Utama Pratama (IV/b)</option>
              <option value="Pembina (IV/a)">Pembina (IV/a)</option>
              <option value="Penata Tingkat I (III/d)" selected>Penata Tingkat I (III/d)</option>
              <option value="Penata (III/c)">Penata (III/c)</option>
              <option value="Penata Muda Tingkat I (III/b)">Penata Muda Tingkat I (III/b)</option>
              <option value="Penata Muda (III/a)">Penata Muda (III/a)</option>
              <option value="Pengatur Tingkat I (II/d)">Pengatur Tingkat I (II/d)</option>
              <option value="Pengatur (II/c)">Pengatur (II/c)</option>
              <option value="Pengatur Muda (II/a)">Pengatur Muda (II/a)</option>
              <option value="PPPK Ahli Pertama / Terampil">PPPK Ahli Pertama / Terampil</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Jabatan Kedinasan <span class="required">*</span></label>
            <input type="text" id="peg-jabatan" class="form-control" placeholder="Contoh: Analis SDM Aparatur Ahli Muda" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Unit Kerja / Bidang <span class="required">*</span></label>
            <select id="peg-unit" class="form-control" required>
              <option value="Pimpinan">Pimpinan</option>
              <option value="Sekretariat">Sekretariat</option>
              <option value="Subbag Umum & Kepegawaian" selected>Subbag Umum & Kepegawaian</option>
              <option value="Subbag Perencanaan & Keuangan">Subbag Perencanaan & Keuangan</option>
              <option value="Bidang Pengadaan, Mutasi & Info">Bidang Pengadaan, Mutasi & Info</option>
              <option value="Bidang Bangkom & Kinerja">Bidang Bangkom & Kinerja</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Hak Akses Sistem (Role) <span class="required">*</span></label>
            <select id="peg-role" class="form-control" required>
              <option value="admin">Admin Agendaris (Kelola Surat & Pengguna)</option>
              <option value="kepala_bkpsdm">Kepala BKPSDM (Pemberi Disposisi Utama)</option>
              <option value="sekretaris">Sekretaris BKPSDM (Verifikator Naskah)</option>
              <option value="kabid">Kepala Bidang (Penerima Disposisi Struktural)</option>
              <option value="pegawai" selected>Staf Pelaksana (Tindak Lanjut & SPT)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Kata Sandi (Password Akun)</label>
          <input type="password" id="peg-password" class="form-control" value="123456" placeholder="Default: 123456">
          <span class="form-hint">Kata sandi standar awal: <code>123456</code></span>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="PenggunaModule.submitCreate()">Simpan Data Pegawai</button>
    `;

    App.openModal();
  },

  async submitCreate() {
    const nip = document.getElementById('peg-nip')?.value.trim();
    const nama = document.getElementById('peg-nama')?.value.trim();
    const pangkat = document.getElementById('peg-pangkat')?.value;
    const jabatan = document.getElementById('peg-jabatan')?.value.trim();
    const unit = document.getElementById('peg-unit')?.value;
    const role = document.getElementById('peg-role')?.value;
    const password = document.getElementById('peg-password')?.value || '123456';

    if (!nip || !nama || !jabatan) {
      App.showToast('Mohon lengkapi NIP, Nama, dan Jabatan pegawai', 'warning');
      return;
    }

    App.showToast('Menyimpan pegawai baru...', 'info');
    const res = await Store.addPegawai({
      nip,
      nama,
      pangkat,
      jabatan,
      unit,
      role,
      password
    });

    if (res && res.success) {
      App.showToast('Data pegawai berhasil ditambahkan!', 'success');
      App.closeModal();
      this.render();
    } else {
      App.showToast(res ? res.message : 'Gagal menambahkan pegawai', 'danger');
    }
  },

  openEditModal(id) {
    const user = Store.state.currentUser;
    if (!user || (user.role !== 'admin' && user.nip !== '199911202025211015')) {
      App.showToast('Akses Ditolak: Hanya Administrator yang berhak mengubah data pegawai', 'warning');
      return;
    }

    const p = Store.state.pegawai.find(item => item.id === id);
    if (!p) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.innerText = `Edit Data Pegawai: ${p.nama}`;
    body.innerHTML = `
      <form id="form-edit-pegawai">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nomor Induk Pegawai (NIP) <span class="required">*</span></label>
            <input type="text" id="edit-peg-nip" class="form-control" value="${p.nip}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Nama Lengkap & Gelar <span class="required">*</span></label>
            <input type="text" id="edit-peg-nama" class="form-control" value="${p.nama}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Pangkat / Golongan Ruang</label>
            <input type="text" id="edit-peg-pangkat" class="form-control" value="${p.pangkat || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Jabatan Kedinasan <span class="required">*</span></label>
            <input type="text" id="edit-peg-jabatan" class="form-control" value="${p.jabatan}" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Unit Kerja / Bidang <span class="required">*</span></label>
            <input type="text" id="edit-peg-unit" class="form-control" value="${p.unit}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Hak Akses Sistem (Role) <span class="required">*</span></label>
            <select id="edit-peg-role" class="form-control" required>
              <option value="admin" ${p.role === 'admin' ? 'selected' : ''}>Admin Agendaris</option>
              <option value="kepala_bkpsdm" ${p.role === 'kepala_bkpsdm' ? 'selected' : ''}>Kepala BKPSDM</option>
              <option value="sekretaris" ${p.role === 'sekretaris' ? 'selected' : ''}>Sekretaris BKPSDM</option>
              <option value="kabid" ${p.role === 'kabid' ? 'selected' : ''}>Kepala Bidang</option>
              <option value="pegawai" ${p.role === 'pegawai' ? 'selected' : ''}>Staf Pelaksana</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Ganti Kata Sandi (Kosongkan jika tidak diubah)</label>
          <input type="password" id="edit-peg-password" class="form-control" placeholder="Kata sandi baru">
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="PenggunaModule.submitEdit(${p.id})">Simpan Perubahan</button>
    `;

    App.openModal();
  },

  async submitEdit(id) {
    const nip = document.getElementById('edit-peg-nip')?.value.trim();
    const nama = document.getElementById('edit-peg-nama')?.value.trim();
    const pangkat = document.getElementById('edit-peg-pangkat')?.value.trim();
    const jabatan = document.getElementById('edit-peg-jabatan')?.value.trim();
    const unit = document.getElementById('edit-peg-unit')?.value.trim();
    const role = document.getElementById('edit-peg-role')?.value;
    const password = document.getElementById('edit-peg-password')?.value;

    const payload = { nip, nama, pangkat, jabatan, unit, role };
    if (password) payload.password = password.trim();

    App.showToast('Memperbarui data...', 'info');
    const res = await Store.updatePegawai(id, payload);
    if (res && res.success) {
      App.showToast('Data pegawai berhasil diperbarui!', 'success');
      App.closeModal();
      this.render();
    } else {
      App.showToast(res ? res.message : 'Gagal memperbarui pegawai', 'danger');
    }
  },

  async confirmDelete(id, nama) {
    const user = Store.state.currentUser;
    if (!user || (user.role !== 'admin' && user.nip !== '199911202025211015')) {
      App.showToast('Akses Ditolak: Hanya Administrator yang berhak menghapus akun pegawai', 'warning');
      return;
    }

    if (confirm(`Konfirmasi Penghapusan:\nApakah Anda yakin ingin menghapus data pegawai:\n"${nama}"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
      App.showToast('Menghapus pegawai...', 'info');
      const res = await Store.deletePegawai(id);
      if (res && res.success) {
        App.showToast(`Pegawai ${nama} berhasil dihapus`, 'success');
        this.render();
      } else {
        App.showToast(res ? res.message : 'Gagal menghapus pegawai', 'danger');
      }
    }
  },

  async loadMasterData() {
    const user = Store.state.currentUser;
    if (!user || (user.role !== 'admin' && user.nip !== '199911202025211015')) {
      App.showToast('Akses Ditolak: Hanya Administrator yang berhak memuat master data', 'warning');
      return;
    }

    if (!confirm('Muat 44 data master aparatur resmi BKPSDM Kabupaten Luwu Timur dari file master bawaan?\n\nData master akan ditambahkan/dimuat ke sistem.')) return;
    try {
      App.showToast('Memuat master pegawai...', 'info');
      const res = await fetch('/api/pegawai/load-master', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        Store.state.pegawai = json.data;
        Store.notify();
        App.showToast(json.message, 'success');
        this.render();
      } else {
        App.showToast(json.message || 'Gagal memuat master pegawai', 'warning');
      }
    } catch (e) {
      App.showToast(e.message, 'warning');
    }
  }
};
