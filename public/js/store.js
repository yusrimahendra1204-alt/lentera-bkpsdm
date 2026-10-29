// Store & Data Management - Sistem Informasi Persuratan BKPSDM Luwu Timur
const Store = {
  state: {
    pegawai: [],
    surat_masuk: [],
    disposisi: [],
    surat_keluar: [],
    surat_tugas: [],
    currentRole: 'admin', // admin | kepala_bkpsdm | sekretaris | kabid | pegawai
    currentUser: null,
    isLoggedIn: localStorage.getItem('bkpsdm_logged_in') === 'true' // strictly false unless explicitly logged in
  },

  listeners: [],

  // Subscribe to state updates
  subscribe(callback) {
    this.listeners.push(callback);
  },

  notify() {
    this.listeners.forEach(cb => cb(this.state));
  },

  // Initialize and load from server
  async init() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.state.pegawai = json.data.pegawai || [];
          this.state.surat_masuk = json.data.surat_masuk || [];
          this.state.disposisi = json.data.disposisi || [];
          this.state.surat_keluar = json.data.surat_keluar || [];
          this.state.surat_tugas = json.data.surat_tugas || [];
          
          // Check saved user session
          const savedUserId = localStorage.getItem('bkpsdm_user_id');
          if (savedUserId) {
            const found = this.state.pegawai.find(p => p.id === parseInt(savedUserId, 10));
            if (found) {
              this.state.currentUser = found;
              this.state.currentRole = found.role;
            } else {
              this.setRole(this.state.currentRole);
            }
          } else {
            this.setRole(this.state.currentRole);
          }
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to load state from API:', err);
    }
    return false;
  },

  // Authentication Login
  async login(nip, password) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nip, password })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        this.state.isLoggedIn = true;
        this.state.currentUser = json.user;
        this.state.currentRole = json.user.role;
        localStorage.setItem('bkpsdm_logged_in', 'true');
        localStorage.setItem('bkpsdm_user_id', String(json.user.id));
        this.notify();
        return { success: true, user: json.user };
      }
      return { success: false, message: json.message || 'Login gagal' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Authentication Logout
  logout() {
    this.state.isLoggedIn = false;
    localStorage.setItem('bkpsdm_logged_in', 'false');
    localStorage.removeItem('bkpsdm_user_id');
    this.notify();
  },

  // Add Pegawai
  async addPegawai(pegawaiData) {
    try {
      const res = await fetch('/api/pegawai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pegawaiData)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        this.state.pegawai.push(json.data);
        this.notify();
        return json;
      }
      return json;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Update Pegawai
  async updatePegawai(id, pegawaiData) {
    try {
      const res = await fetch(`/api/pegawai/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pegawaiData)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        const idx = this.state.pegawai.findIndex(p => p.id === id);
        if (idx !== -1) this.state.pegawai[idx] = json.data;
        this.notify();
        return json;
      }
      return json;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Delete Pegawai
  async deletePegawai(id) {
    try {
      const res = await fetch(`/api/pegawai/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        this.state.pegawai = this.state.pegawai.filter(p => p.id !== id);
        this.notify();
        return json;
      }
      return json;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Set active role for simulation & testing
  setRole(role) {
    this.state.currentRole = role;
    const fallback = this.state.pegawai[0] || null;
    if (role === 'kepala_bkpsdm') {
      this.state.currentUser = this.state.pegawai.find(p => p.role === 'kepala_bkpsdm') || fallback;
    } else if (role === 'admin') {
      this.state.currentUser = this.state.pegawai.find(p => p.role === 'admin') || fallback;
    } else if (role === 'sekretaris') {
      this.state.currentUser = this.state.pegawai.find(p => p.role === 'sekretaris') || fallback;
    } else if (role === 'kabid') {
      this.state.currentUser = this.state.pegawai.find(p => p.role === 'kabid') || fallback;
    } else {
      this.state.currentUser = this.state.pegawai.find(p => p.role === 'pegawai') || fallback;
    }
    if (this.state.currentUser) {
      localStorage.setItem('bkpsdm_user_id', String(this.state.currentUser.id));
    }
    this.notify();
  },

  // Search classification codes via API
  async searchKlasifikasi(query = '', kategori = '', limit = 15) {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (kategori) params.append('kat', kategori);
      params.append('limit', limit);

      const res = await fetch(`/api/klasifikasi?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data || [];
      }
    } catch (err) {
      console.error('Search error:', err);
    }
    return [];
  },

  // Add Surat Masuk
  async addSuratMasuk(data) {
    try {
      const res = await fetch('/api/surat-masuk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.state.surat_masuk.unshift(json.data);
          this.notify();
          return json.data;
        }
      }
    } catch (err) {
      console.error('Failed to add surat masuk:', err);
    }
    return null;
  },

  // Update Surat Masuk
  async updateSuratMasuk(id, data) {
    try {
      const res = await fetch(`/api/surat-masuk/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const idx = this.state.surat_masuk.findIndex(s => s.id === id);
          if (idx !== -1) this.state.surat_masuk[idx] = json.data;
          this.notify();
          return json.data;
        }
      }
    } catch (err) {
      console.error('Failed to update surat masuk:', err);
    }
    return null;
  },

  // Delete Surat Masuk
  async deleteSuratMasuk(id) {
    try {
      const res = await fetch(`/api/surat-masuk/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.state.surat_masuk = this.state.surat_masuk.filter(s => s.id !== id);
          this.state.disposisi = this.state.disposisi.filter(d => d.id_surat_masuk !== id);
          this.notify();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to delete surat masuk:', err);
    }
    return false;
  },

  // Add Disposisi
  async addDisposisi(data) {
    try {
      const res = await fetch('/api/disposisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.state.disposisi.unshift(json.data);
          // Update status in surat masuk
          const sm = this.state.surat_masuk.find(s => s.id === json.data.id_surat_masuk);
          if (sm) sm.status_disposisi = 'Didisposisi';
          this.notify();
          return json.data;
        }
      }
    } catch (err) {
      console.error('Failed to add disposisi:', err);
    }
    return null;
  },

  // Update Disposisi
  async updateDisposisi(id, data) {
    try {
      const res = await fetch(`/api/disposisi/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const index = this.state.disposisi.findIndex(d => d.id === id);
          if (index !== -1) {
            this.state.disposisi[index] = json.data;
          }
          if (json.data.status_tindak_lanjut === 'Selesai') {
            const sm = this.state.surat_masuk.find(s => s.id === json.data.id_surat_masuk);
            if (sm) sm.status_disposisi = 'Selesai';
          }
          this.notify();
          return json.data;
        }
      }
    } catch (err) {
      console.error('Failed to update disposisi:', err);
    }
    return null;
  },

  // Delete Disposisi
  async deleteDisposisi(id) {
    try {
      const res = await fetch(`/api/disposisi/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const disp = this.state.disposisi.find(d => d.id === id);
          const smId = disp ? disp.id_surat_masuk : null;
          this.state.disposisi = this.state.disposisi.filter(d => d.id !== id);
          if (smId && !this.state.disposisi.some(d => d.id_surat_masuk === smId)) {
            const sm = this.state.surat_masuk.find(s => s.id === smId);
            if (sm) sm.status_disposisi = 'Menunggu Disposisi';
          }
          this.notify();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to delete disposisi:', err);
    }
    return false;
  },

  // Add Surat Keluar
  async addSuratKeluar(data) {
    try {
      const res = await fetch('/api/surat-keluar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.state.surat_keluar.unshift(json.data);
          this.notify();
          return json.data;
        }
      }
    } catch (err) {
      console.error('Failed to add surat keluar:', err);
    }
    return null;
  },

  // Update Surat Keluar
  async updateSuratKeluar(id, data) {
    try {
      const res = await fetch(`/api/surat-keluar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const idx = this.state.surat_keluar.findIndex(s => s.id === id);
          if (idx !== -1) this.state.surat_keluar[idx] = json.data;
          this.notify();
          return json.data;
        }
      }
    } catch (err) {
      console.error('Failed to update surat keluar:', err);
    }
    return null;
  },

  // Delete Surat Keluar
  async deleteSuratKeluar(id) {
    try {
      const res = await fetch(`/api/surat-keluar/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.state.surat_keluar = this.state.surat_keluar.filter(s => s.id !== id);
          this.notify();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to delete surat keluar:', err);
    }
    return false;
  },

  // Add Surat Tugas (SPT)
  async addSuratTugas(data) {
    try {
      const res = await fetch('/api/surat-tugas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.state.surat_tugas.unshift(json.data);
          this.notify();
          return json.data;
        }
      }
    } catch (err) {
      console.error('Failed to add surat tugas:', err);
    }
    return null;
  },

  // Update Surat Tugas
  async updateSuratTugas(id, data) {
    try {
      const res = await fetch(`/api/surat-tugas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const idx = this.state.surat_tugas.findIndex(s => s.id === id);
          if (idx !== -1) this.state.surat_tugas[idx] = json.data;
          this.notify();
          return json.data;
        }
      }
    } catch (err) {
      console.error('Failed to update surat tugas:', err);
    }
    return null;
  },

  // Delete Surat Tugas
  async deleteSuratTugas(id) {
    try {
      const res = await fetch(`/api/surat-tugas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          this.state.surat_tugas = this.state.surat_tugas.filter(s => s.id !== id);
          this.notify();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to delete surat tugas:', err);
    }
    return false;
  },

  // Change Password
  async changePassword(oldPassword, newPassword) {
    try {
      const user = this.state.currentUser;
      if (!user) return { success: false, message: 'Sesi pengguna tidak valid' };

      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          old_password: oldPassword,
          new_password: newPassword
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        user.password = newPassword;
        this.notify();
        return json;
      }
      return json;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Reset demo state
  async resetDemoData() {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.state.pegawai = json.data.pegawai || [];
          this.state.surat_masuk = json.data.surat_masuk || [];
          this.state.disposisi = json.data.disposisi || [];
          this.state.surat_keluar = json.data.surat_keluar || [];
          this.state.surat_tugas = json.data.surat_tugas || [];
          this.setRole(this.state.currentRole);
          this.notify();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    }
    return false;
  },

  // Bersihkan data transaksi dummy
  async clearDummyData() {
    try {
      const res = await fetch('/api/database/clear-dummy', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          this.state.surat_masuk = [];
          this.state.disposisi = [];
          this.state.surat_keluar = [];
          this.state.surat_tugas = [];
          this.notify();
          return true;
        }
      }
    } catch (err) {
      console.error('Failed to clear dummy data:', err);
    }
    return false;
  },

  // Get database stats & file info
  async getDatabaseStats() {
    try {
      const res = await fetch('/api/database/stats');
      if (res.ok) {
        const json = await res.json();
        return json.stats;
      }
    } catch (err) {
      console.error('Failed to fetch database stats:', err);
    }
    return null;
  },

  // Restore database from JSON
  async restoreData(dataPayload) {
    try {
      const res = await fetch('/api/database/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          await this.init();
          return json;
        }
      }
    } catch (err) {
      console.error('Failed to restore database:', err);
    }
    return null;
  },

  // Manual SQL sync
  async syncSql() {
    try {
      const res = await fetch('/api/database/sync-sql', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        return json.success;
      }
    } catch (err) {
      console.error('Failed to sync SQL:', err);
    }
    return false;
  }
};
