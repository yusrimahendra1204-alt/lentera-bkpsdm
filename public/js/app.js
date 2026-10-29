// Main Application Controller - Sistem Informasi Persuratan BKPSDM Luwu Timur
const App = {
  currentView: 'dashboard',

  async init() {
    console.log('[APP] Menginisialisasi LENTERA BKPSDM Luwu Timur...');
    
    // Load store state
    await Store.init();

    // Check authentication state immediately
    this.checkAuthState();

    // Subscribe store updates
    Store.subscribe((state) => {
      this.checkAuthState();
      this.updateHeaderUser();
      this.updateSidebarBadges();
      this.refreshCurrentView();
    });

    // Set up global modal listeners
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
      // Hidden shortcut untuk Yusri Mahendra: Buka tools database secara privat
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        this.navigate('database');
        this.showToast('Mode Pengelola Database Terbuka (Khusus Pengembang)', 'info');
      }
    });

    const overlay = document.getElementById('global-modal');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeModal();
      });
    }

    // Role switcher listener
    const roleSelect = document.getElementById('select-role-sim');
    if (roleSelect) {
      roleSelect.value = Store.state.currentRole;
      roleSelect.addEventListener('change', (e) => {
        Store.setRole(e.target.value);
        this.showToast(`Beralih peran menjadi: ${this.getRoleLabel(e.target.value)}`, 'info');
      });
    }

    // Check if directly visiting /login URL
    if (window.location.pathname === '/login') {
      Store.state.isLoggedIn = false;
      localStorage.setItem('bkpsdm_logged_in', 'false');
    }

    // Hash change listener
    window.addEventListener('hashchange', () => {
      const h = window.location.hash;
      if (h === '#landing' || h === '' || h === '#') {
        this.showScreen('landing');
      } else if (h === '#login') {
        this.showScreen('login');
      } else if (Store.state.isLoggedIn || this.isPublicMode) {
        this.showScreen('app');
        const view = h.replace('#', '');
        if (view) this.navigate(view);
      } else {
        this.showScreen('landing');
      }
    });

    // Screen enforcement on startup
    this.checkAuthState();
  },

  // Kontrol Tampilan Layar (Landing Page | Login | Aplikasi E-Surat)
  showScreen(screenName) {
    this.currentScreen = screenName;
    const landingScreen = document.getElementById('screen-landing');
    const loginScreen = document.getElementById('screen-login');
    const appScreen = document.getElementById('screen-app');
    const earlyCss = document.getElementById('early-auth-css');

    if (earlyCss) {
      earlyCss.remove();
    }

    if (screenName === 'landing') {
      if (landingScreen) landingScreen.style.setProperty('display', 'block', 'important');
      if (loginScreen) loginScreen.style.setProperty('display', 'none', 'important');
      if (appScreen) appScreen.style.setProperty('display', 'none', 'important');
      document.title = 'LENTERA BKPSDM - Layanan Elektronik Tata Naskah dan Administrasi Luwu Timur';
      
      if (window.LandingModule) {
        LandingModule.init();
      }

      // Update label tombol navbar jika sudah login
      const navAuthBtn = document.getElementById('btn-nav-auth');
      if (navAuthBtn) {
        if (Store.state.isLoggedIn) {
          navAuthBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Buka Dashboard →
          `;
        } else {
          navAuthBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            Masuk Pegawai
          `;
        }
      }
    } else if (screenName === 'login') {
      if (landingScreen) landingScreen.style.setProperty('display', 'none', 'important');
      if (loginScreen) loginScreen.style.setProperty('display', 'flex', 'important');
      if (appScreen) appScreen.style.setProperty('display', 'none', 'important');
      document.title = 'Login - LENTERA BKPSDM Kabupaten Luwu Timur';
      setTimeout(() => document.getElementById('login-nip')?.focus(), 150);
    } else if (screenName === 'app') {
      if (landingScreen) landingScreen.style.setProperty('display', 'none', 'important');
      if (loginScreen) loginScreen.style.setProperty('display', 'none', 'important');
      if (appScreen) appScreen.style.setProperty('display', 'flex', 'important');
      document.title = 'LENTERA BKPSDM - Kab. Luwu Timur';
      this.updateHeaderUser();
      this.updateSidebarBadges();
      this.updateSidebarVisibility();
      // Pastikan seluruh menu sidebar tampil normal jika bukan mode read-only
      if (!this.isPublicMode) {
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
          if (item.getAttribute('data-view') !== 'pengguna') {
            item.style.display = 'flex';
          }
        });
        this.updateSidebarVisibility();
      }
    }
  },

  // Navigasi cepat dari Landing Page ke Dashboard atau ke Login
  goToAppOrLogin(targetView = 'dashboard') {
    if (Store.state.isLoggedIn) {
      this.showScreen('app');
      this.navigate(targetView);
    } else {
      this.showScreen('login');
    }
  },

  // Periksa apakah user sedang login atau belum
  checkAuthState() {
    if (this.isPublicMode) {
      this.showScreen('app');
      return;
    }

    const hash = window.location.hash;
    if (Store.state.isLoggedIn) {
      if (hash === '#landing') {
        this.showScreen('landing');
      } else {
        this.showScreen('app');
        const view = hash.replace('#', '') || 'dashboard';
        this.navigate(view);
      }
    } else {
      if (hash === '#login') {
        this.showScreen('login');
      } else {
        // Tampilkan Landing Page sebagai beranda utama publik
        this.showScreen('landing');
      }
    }
  },

  // Buka portal register nomor surat keluar dalam mode baca terbuka untuk rekan kantor
  openPublicSuratKeluar() {
    this.isPublicMode = true;
    this.showScreen('app');
    document.title = 'Register Nomor Surat Keluar (Akses Staf Kantor) - BKPSDM';

    // Batasi sidebar navigation: hanya tampilkan menu Surat Keluar dan SPT
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      const view = item.getAttribute('data-view');
      if (view === 'surat-keluar' || view === 'surat-tugas' || item.classList.contains('nav-item-landing')) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });

    // Sesuaikan header
    const nameEl = document.getElementById('user-header-name');
    const roleEl = document.getElementById('user-header-role');
    const avatarEl = document.getElementById('user-header-avatar');
    if (nameEl) nameEl.innerText = 'Staf Kantor (Mode Terbuka)';
    if (roleEl) roleEl.innerText = 'Akses Read-Only Penomoran';
    if (avatarEl) avatarEl.innerText = 'BK';

    this.navigate('surat-keluar');
    this.showToast('Membuka Buku Register Penomoran Surat Keluar (Mode Terbuka Kantor)', 'info');
  },

  // Handle submit form login resmi
  async handleLoginSubmit(event) {
    if (event) event.preventDefault();
    const nipInput = document.getElementById('login-nip');
    const passInput = document.getElementById('login-password');
    const nip = nipInput ? nipInput.value.trim() : '';
    const pass = passInput ? passInput.value.trim() : '';

    if (!nip) {
      this.showToast('Silakan masukkan NIP Pegawai / Pengguna', 'warning');
      return;
    }

    const res = await Store.login(nip, pass);
    if (res.success) {
      this.isPublicMode = false;
      localStorage.setItem('bkpsdm_logged_in', 'true');
      localStorage.setItem('bkpsdm_user_id', String(res.user.id));
      this.showScreen('app');
      this.navigate('dashboard');
      this.showToast(`Selamat datang, ${res.user.nama}!`, 'success');
    } else {
      this.showToast(res.message || 'Login gagal. Periksa kembali NIP & kata sandi.', 'warning');
    }
  },

  // 1-Click Quick Demo Login untuk Sidang Skripsi
  async quickLogin(nip) {
    const res = await Store.login(nip, '123456');
    if (res.success) {
      this.isPublicMode = false;
      localStorage.setItem('bkpsdm_logged_in', 'true');
      localStorage.setItem('bkpsdm_user_id', String(res.user.id));
      this.showScreen('app');
      this.navigate('dashboard');
      this.showToast(`Login berhasil sebagai: ${res.user.nama}`, 'success');
    } else {
      this.showToast(res.message || 'Gagal login simulasi', 'warning');
    }
  },

  // Logout dari aplikasi: langsung logout dan navigasi ke landing page
  logout() {
    this.isPublicMode = false;
    Store.logout();
    localStorage.setItem('bkpsdm_logged_in', 'false');
    localStorage.removeItem('bkpsdm_user_id');
    this.showToast('Anda telah berhasil keluar dari sistem persuratan', 'info');
    this.showScreen('landing');
  },

  navigate(viewName) {
    if (!Store.state.isLoggedIn && !this.isPublicMode) {
      this.checkAuthState();
      return;
    }

    // Jika dalam mode baca terbuka kantor, batasi akses selain surat-keluar & surat-tugas
    if (this.isPublicMode && viewName !== 'surat-keluar' && viewName !== 'surat-tugas') {
      this.showToast('Menu ini memerlukan autentikasi login petugas persuratan', 'warning');
      return;
    }

    // Strict RBAC: Menu Kelola Pegawai ('pengguna') & Database ('database') HANYA untuk Administrator
    const currentUser = Store.state.currentUser;
    const isAdmin = Boolean(currentUser && (currentUser.role === 'admin' || currentUser.nip === '199911202025211015'));

    if (viewName === 'pengguna' && !isAdmin) {
      this.showToast('Akses Ditolak: Menu Kelola Pegawai hanya dapat diakses oleh Administrator Sistem', 'warning');
      this.navigate('dashboard');
      return;
    }

    this.currentView = viewName;

    // Update sidebar active link
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update page view containers
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Update top header title
    const titleElem = document.getElementById('header-page-title');
    if (titleElem) {
      titleElem.innerText = this.getViewTitle(viewName);
    }

    // Render active module
    this.refreshCurrentView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  refreshCurrentView() {
    switch (this.currentView) {
      case 'dashboard':
        DashboardModule.render();
        break;
      case 'surat-masuk':
        SuratMasukModule.render();
        break;
      case 'disposisi':
        DisposisiModule.render();
        break;
      case 'surat-keluar':
        SuratKeluarModule.render();
        break;
      case 'surat-tugas':
        SuratTugasModule.render();
        break;
      case 'klasifikasi':
        KlasifikasiExplorerModule.render();
        break;
      case 'laporan':
        LaporanModule.render();
        break;
      case 'pengguna':
        PenggunaModule.render();
        break;
      case 'database':
        DatabaseModule.render();
        break;
    }
  },

  getViewTitle(viewName) {
    switch (viewName) {
      case 'dashboard': return 'Dashboard & Monitoring Persuratan';
      case 'surat-masuk': return 'Pengelolaan Surat Masuk';
      case 'disposisi': return 'Pengelolaan & Pencatatan Disposisi Surat Masuk';
      case 'surat-keluar': return 'Pengelolaan Surat Keluar';
      case 'surat-tugas': return 'Surat Perintah Tugas (SPT)';
      case 'klasifikasi': return 'Kamus Kode Perbup Luwu Timur No. 69/2023';
      case 'laporan': return 'Buku Agenda & Rekapitulasi Laporan';
      case 'pengguna': return 'Manajemen Data Pegawai & Hak Akses (RBAC)';
      case 'database': return 'Manajemen Basis Data & Cadangan (Portabilitas)';
      default: return 'Sistem Informasi Persuratan';
    }
  },

  getRoleLabel(role) {
    switch (role) {
      case 'kepala_bkpsdm': return 'Kepala BKPSDM';
      case 'admin': return 'Admin Agendaris (Subbag Umum)';
      case 'sekretaris': return 'Sekretaris BKPSDM';
      case 'kabid': return 'Kepala Bidang';
      case 'pegawai': return 'Pegawai / Staf Pelaksana';
      default: return role;
    }
  },

  updateHeaderUser() {
    const user = Store.state.currentUser;
    const nameEl = document.getElementById('user-header-name');
    const roleEl = document.getElementById('user-header-role');
    const avatarEl = document.getElementById('user-header-avatar');
    const roleSelect = document.getElementById('select-role-sim');

    if (user && nameEl && roleEl) {
      nameEl.innerText = user.nama;
      roleEl.innerText = user.jabatan;
      if (roleSelect && user.role) {
        roleSelect.value = user.role;
      }
      if (avatarEl) {
        // Initials
        const initials = user.nama.split(' ').slice(0, 2).map(n => n[0]).join('');
        avatarEl.innerText = initials;
      }
    }
    this.updateSidebarVisibility();
  },

  updateSidebarVisibility() {
    const user = Store.state.currentUser;
    const isAdmin = Boolean(user && (user.role === 'admin' || user.nip === '199911202025211015'));

    const navPengguna = document.getElementById('nav-item-pengguna') || document.querySelector('.nav-item[data-view="pengguna"]');
    const secMaster = document.getElementById('section-master-title');

    if (navPengguna) {
      navPengguna.style.display = isAdmin ? 'flex' : 'none';
    }
    if (secMaster) {
      secMaster.style.display = isAdmin ? 'block' : 'none';
    }
  },

  updateSidebarBadges() {
    const pendingDisp = Store.state.surat_masuk.filter(s => s.status_disposisi === 'Menunggu Disposisi').length;
    const badgeDisp = document.getElementById('badge-disposisi');
    if (badgeDisp) {
      if (pendingDisp > 0) {
        badgeDisp.innerText = pendingDisp;
        badgeDisp.style.display = 'inline-block';
      } else {
        badgeDisp.style.display = 'none';
      }
    }

    const totalSm = Store.state.surat_masuk.length;
    const badgeSm = document.getElementById('badge-sm');
    if (badgeSm) badgeSm.innerText = totalSm;
  },

  // Modal Handlers
  openModal() {
    const modal = document.getElementById('global-modal');
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    const modal = document.getElementById('global-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  // Toast System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      <div style="flex-shrink:0;">${iconSvg}</div>
      <div style="flex:1; font-weight:500;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Reset Demo Data
  async confirmResetData() {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh data ke data simulasi awal BKPSDM Luwu Timur?')) {
      const ok = await Store.resetDemoData();
      if (ok) {
        this.showToast('Data simulasi berhasil dikembalikan ke kondisi awal', 'success');
        this.refreshCurrentView();
      }
    }
  },

  // Digital Archive Viewer dialihkan ke modal kartu kendali agenda
  openDigitalArchive(type, id) {
    if (type === 'surat-masuk') {
      SuratMasukModule.showDetail(id);
    } else if (type === 'surat-keluar') {
      SuratKeluarModule.showDetail(id);
    }
  },

  // Modal Profil Pengguna & Ubah Kata Sandi
  openProfileModal() {
    const user = Store.state.currentUser || Store.state.pegawai[0];
    if (!user) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    const roleLabels = {
      admin: 'Admin Agendaris (Subbag Umum)',
      kepala_bkpsdm: 'Kepala BKPSDM Kabupaten Luwu Timur',
      sekretaris: 'Sekretaris Badan',
      kabid: 'Kepala Bidang',
      pegawai: 'Staf Pelaksana / Analis SDM'
    };

    title.innerText = 'Profil Pengguna & Keamanan Akun';
    body.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <!-- Identitas Pegawai Card -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px; display:flex; gap:16px; align-items:center;">
          <div style="width:58px; height:58px; border-radius:50%; background:var(--primary); color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:800; flex-shrink:0;">
            ${user.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div style="font-size:16px; font-weight:800; color:#0f172a;">${user.nama}</div>
            <div style="font-size:12.5px; color:#64748b; font-family:monospace; margin-top:2px;">NIP. ${user.nip}</div>
            <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;">
              <span class="badge badge-info" style="font-size:11px;">${roleLabels[user.role] || user.role}</span>
              <span style="font-size:12px; color:#334155;">Pangkat: <strong>${user.pangkat || '-'}</strong></span>
            </div>
            <div style="font-size:12px; color:#475569; margin-top:4px;">
              Unit: <strong>${user.unit || 'BKPSDM Kabupaten Luwu Timur'}</strong>
            </div>
          </div>
        </div>

        <!-- Form Ubah Password -->
        <div style="border:1px solid #e2e8f0; border-radius:8px; padding:18px; background:#ffffff;">
          <h4 style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Ubah Kata Sandi Akun
          </h4>

          <form id="form-change-password" onsubmit="event.preventDefault(); App.submitChangePassword();">
            <div class="form-group">
              <label class="form-label">Kata Sandi Saat Ini <span class="required">*</span></label>
              <input type="password" id="user-old-pass" class="form-control" placeholder="Masukkan kata sandi lama (default: 123456)" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Kata Sandi Baru <span class="required">*</span></label>
                <input type="password" id="user-new-pass" class="form-control" placeholder="Minimal 5 karakter" minlength="5" required>
              </div>
              <div class="form-group">
                <label class="form-label">Konfirmasi Kata Sandi Baru <span class="required">*</span></label>
                <input type="password" id="user-confirm-pass" class="form-control" placeholder="Ulangi kata sandi baru" minlength="5" required>
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end;">
              <button type="submit" class="btn btn-primary btn-sm">
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Tutup</button>
    `;

    this.openModal();
  },

  async submitChangePassword() {
    const oldPass = document.getElementById('user-old-pass')?.value;
    const newPass = document.getElementById('user-new-pass')?.value;
    const confirmPass = document.getElementById('user-confirm-pass')?.value;

    if (!oldPass || !newPass || !confirmPass) {
      this.showToast('Semua kolom kata sandi wajib diisi', 'warning');
      return;
    }

    if (newPass !== confirmPass) {
      this.showToast('Konfirmasi kata sandi baru tidak cocok', 'warning');
      return;
    }

    if (newPass.length < 5) {
      this.showToast('Kata sandi baru minimal 5 karakter', 'warning');
      return;
    }

    const res = await Store.changePassword(oldPass, newPass);
    if (res.success) {
      this.closeModal();
      this.showToast('Kata sandi berhasil diperbarui!', 'success');
    } else {
      this.showToast(res.message || 'Gagal memperbarui kata sandi', 'danger');
    }
  }
};

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
