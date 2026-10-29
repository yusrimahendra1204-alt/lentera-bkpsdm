// Buku Agenda & Laporan Persuratan Module
const LaporanModule = {
  currentTab: 'surat-masuk',

  render() {
    const container = document.getElementById('view-laporan');
    if (!container) return;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <h2>Buku Agenda & Rekapitulasi Laporan Persuratan</h2>
            <p>Penyusunan rekapitulasi data surat masuk, surat keluar, disposisi kepala BKPSDM, dan surat tugas dinas</p>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" onclick="window.print()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Cetak Buku Agenda
            </button>
            <button class="btn btn-outline" onclick="LaporanModule.exportCSV()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Ekspor CSV
            </button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="padding:14px 24px; border-bottom:1px solid var(--border-color); background:#fafbfc; display:flex; gap:10px;">
          <button class="btn btn-sm ${this.currentTab === 'surat-masuk' ? 'btn-primary' : 'btn-outline'}" onclick="LaporanModule.switchTab('surat-masuk')">
            Buku Agenda Surat Masuk
          </button>
          <button class="btn btn-sm ${this.currentTab === 'surat-keluar' ? 'btn-primary' : 'btn-outline'}" onclick="LaporanModule.switchTab('surat-keluar')">
            Buku Agenda Surat Keluar
          </button>
          <button class="btn btn-sm ${this.currentTab === 'surat-tugas' ? 'btn-primary' : 'btn-outline'}" onclick="LaporanModule.switchTab('surat-tugas')">
            Rekap Surat Perintah Tugas (SPT)
          </button>
          <button class="btn btn-sm ${this.currentTab === 'disposisi' ? 'btn-primary' : 'btn-outline'}" onclick="LaporanModule.switchTab('disposisi')">
            Rekap Disposisi Kepala BKPSDM
          </button>
        </div>

        <div class="card-body printable-area" style="padding:24px;">
          <!-- Formal Print Header -->
          <div class="spt-kop" style="margin-bottom:20px;">
            <h2>PEMERINTAH KABUPATEN LUWU TIMUR</h2>
            <h1>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</h1>
            <p>Jalan Soekarno-Hatta, Kawasan Perkantoran Praja Mukti, Puncak Indah, Malili 92981</p>
            <div style="font-size:15px; font-weight:800; text-decoration:underline; margin-top:10px; letter-spacing:0.5px;">
              ${this.getReportTitle()}
            </div>
            <div style="font-size:12px; margin-top:2px;">SIPADU • Tahun Anggaran 2026 • Peraturan Bupati Luwu Timur No. 69 Tahun 2023</div>
          </div>

          <div class="table-responsive">
            ${this.renderTabContent()}
          </div>

          <!-- Formal Signature for Report -->
          <div style="display:flex; justify-content:flex-end; margin-top:36px;">
            <div style="text-align:center; min-width:260px;">
              <div>Malili, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div style="font-weight:700; margin-top:4px;">Administrator SIPADU (Subbag Umum),</div>
              <div style="height:60px;"></div>
              <div style="font-weight:700; text-decoration:underline;">YUSRI MAHENDRA</div>
              <div style="font-size:12px;">NIP. 199911202025211015</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getReportTitle() {
    switch(this.currentTab) {
      case 'surat-masuk': return 'BUKU AGENDA SURAT MASUK';
      case 'surat-keluar': return 'BUKU AGENDA SURAT KELUAR';
      case 'surat-tugas': return 'REKAPITULASI SURAT PERINTAH TUGAS (SPT)';
      case 'disposisi': return 'BUKU KENDALI DISPOSISI KEPALA BADAN';
      default: return 'LAPORAN PERSURATAN';
    }
  },

  switchTab(tab) {
    this.currentTab = tab;
    this.render();
  },

  renderTabContent() {
    if (this.currentTab === 'surat-masuk') {
      const list = Store.state.surat_masuk || [];
      return `
        <table class="data-table" style="border:1px solid #cbd5e1;">
          <thead>
            <tr>
              <th>No. Agenda</th>
              <th>Tgl Terima</th>
              <th>Instansi Pengirim & No. Pengirim</th>
              <th>Perihal Surat</th>
              <th>Kode Arsip (Perbup)</th>
              <th>Sifat</th>
            </tr>
          </thead>
          <tbody>
            ${list.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding:28px; color:#94a3b8;">Belum ada catatan surat masuk dalam buku agenda.</td></tr>` : list.map(s => `
              <tr>
                <td style="font-family:monospace; font-weight:700;">${s.no_agenda}</td>
                <td>${s.tgl_diterima}</td>
                <td>
                  <strong>${s.instansi_pengirim}</strong><br>
                  <span style="font-size:11.5px; color:#475569;">No: ${s.no_surat_pengirim} (Tgl: ${s.tgl_surat})</span>
                </td>
                <td style="max-width:280px; font-weight:500;">${s.perihal}</td>
                <td><span class="code-tag code-tag-internal">${s.kode_internal}</span></td>
                <td>${s.sifat_surat}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (this.currentTab === 'surat-keluar') {
      const list = Store.state.surat_keluar || [];
      return `
        <table class="data-table" style="border:1px solid #cbd5e1;">
          <thead>
            <tr>
              <th>No. Agenda</th>
              <th>Tgl Surat</th>
              <th>Nomor Surat Keluar</th>
              <th>Kode Perbup</th>
              <th>Perihal Surat Keluar</th>
              <th>Penandatangan</th>
            </tr>
          </thead>
          <tbody>
            ${list.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding:28px; color:#94a3b8;">Belum ada catatan surat keluar dalam buku agenda.</td></tr>` : list.map(s => `
              <tr>
                <td style="font-family:monospace; font-weight:700;">${s.no_agenda}</td>
                <td>${s.tgl_surat}</td>
                <td style="font-family:monospace; font-weight:700; color:var(--primary);">${s.no_surat_keluar}</td>
                <td><span class="code-tag code-tag-internal">${s.kode_klasifikasi}</span></td>
                <td style="max-width:320px; font-weight:500;">${s.perihal}</td>
                <td>${s.penandatangan}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (this.currentTab === 'surat-tugas') {
      const list = Store.state.surat_tugas || [];
      return `
        <table class="data-table" style="border:1px solid #cbd5e1;">
          <thead>
            <tr>
              <th>Nomor SPT</th>
              <th>Maksud Tugas Kedinasan</th>
              <th>Tujuan & Jadwal</th>
              <th>Personil Ditugaskan</th>
            </tr>
          </thead>
          <tbody>
            ${list.length === 0 ? `<tr><td colspan="4" style="text-align:center; padding:28px; color:#94a3b8;">Belum ada catatan surat perintah tugas (SPT) dinas.</td></tr>` : list.map(spt => `
              <tr>
                <td style="font-family:monospace; font-weight:700; color:var(--primary);">${spt.no_surat_tugas}</td>
                <td style="max-width:300px; font-weight:500;">${spt.maksud_tugas}</td>
                <td>
                  <strong>${spt.tempat_tujuan}</strong><br>
                  <span style="font-size:11.5px; color:#64748b;">${spt.tgl_berangkat} s/d ${spt.tgl_kembali} (${spt.lama_hari} Hari)</span>
                </td>
                <td>
                  ${(spt.personil || []).map(p => `• ${p.nama}`).join('<br>')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    if (this.currentTab === 'disposisi') {
      const list = Store.state.disposisi || [];
      return `
        <table class="data-table" style="border:1px solid #cbd5e1;">
          <thead>
            <tr>
              <th>No. Agenda SM & Pengirim</th>
              <th>Perihal Surat</th>
              <th>Sifat</th>
              <th>Diteruskan Kepada (6 Jabatan)</th>
              <th>Instruksi Resmi</th>
              <th>Catatan Pimpinan</th>
            </tr>
          </thead>
          <tbody>
            ${list.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding:28px; color:#94a3b8;">Belum ada rekaman disposisi surat masuk.</td></tr>` : list.map(d => {
              const sm = Store.state.surat_masuk.find(s => s.id === d.id_surat_masuk) || {};
              const diteruskan = d.diteruskan_kepada || (d.tujuan_nama ? [d.tujuan_nama] : []);
              const instruksi = d.instruksi || [];
              return `
                <tr>
                  <td>
                    <strong style="color:var(--primary); font-family:monospace;">${sm.no_agenda || '-'}</strong><br>
                    <span style="font-size:11.5px; color:#475569;">${sm.instansi_pengirim || '-'}</span>
                  </td>
                  <td style="max-width:240px; font-size:12.5px;">${sm.perihal || '-'}</td>
                  <td><span class="badge ${d.sifat && d.sifat.includes('Sangat') ? 'badge-danger' : (d.sifat && d.sifat.includes('Rahasia') ? 'badge-purple' : 'badge-warning')}">${d.sifat || 'B. Segera'}</span></td>
                  <td>${diteruskan.map(j => `<div>• ${j}</div>`).join('')}</td>
                  <td>${instruksi.map(i => `<div>✓ ${i}</div>`).join('')}</td>
                  <td style="font-style:italic;">"${d.catatan || '-'}"</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }
  },

  exportCSV() {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `rekap_${this.currentTab}.csv`;

    if (this.currentTab === 'surat-masuk') {
      csvContent += 'No Agenda,No Pengirim,Instansi Pengirim,Perihal,Kode Internal,Tgl Diterima,Sifat\n';
      Store.state.surat_masuk.forEach(s => {
        csvContent += `"${s.no_agenda}","${s.no_surat_pengirim}","${s.instansi_pengirim}","${s.perihal}","${s.kode_internal}","${s.tgl_diterima}","${s.sifat_surat}"\n`;
      });
    } else if (this.currentTab === 'surat-keluar') {
      csvContent += 'No Agenda,No Surat Keluar,Kode Perbup,Perihal,Tgl Surat,Penandatangan\n';
      Store.state.surat_keluar.forEach(s => {
        csvContent += `"${s.no_agenda}","${s.no_surat_keluar}","${s.kode_klasifikasi}","${s.perihal}","${s.tgl_surat}","${s.penandatangan}"\n`;
      });
    } else if (this.currentTab === 'surat-tugas') {
      csvContent += 'No SPT,Maksud Tugas,Tujuan,Tgl Berangkat,Tgl Kembali,Lama Hari,Personil\n';
      Store.state.surat_tugas.forEach(s => {
        const personilStr = (s.personil || []).map(p => p.nama).join('; ');
        csvContent += `"${s.no_surat_tugas}","${s.maksud_tugas}","${s.tempat_tujuan}","${s.tgl_berangkat}","${s.tgl_kembali}","${s.lama_hari}","${personilStr}"\n`;
      });
    } else {
      csvContent += 'ID Surat,Penerima Disposisi,Instruksi,Catatan,Batas Waktu,Status\n';
      Store.state.disposisi.forEach(d => {
        csvContent += `"${d.id_surat_masuk}","${d.tujuan_nama}","${(d.instruksi || []).join('; ')}","${d.catatan}","${d.batas_waktu}","${d.status_tindak_lanjut}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    App.showToast(`Berhasil mengekspor data ke file ${filename}`, 'success');
  }
};
