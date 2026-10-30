// Surat Keluar Module - Sistem Penomoran Digital & Kodifikasi Perbup Luwu Timur No. 69 Tahun 2023
const SuratKeluarModule = {
  currentFilter: 'all',

  // Master Kode Klasifikasi Khusus BKPSDM Berdasarkan Perbup Luwu Timur No. 69 Tahun 2023
  POPULAR_CODES: [
    {
      kode: '800.1.3.2',
      nama: 'Kenaikan Pangkat/ Golongan/ Jabatan ASN',
      kategori: '800',
      klaster: 'pangkat_mutasi',
      desc: 'Pengusulan dan persetujuan teknis kenaikan pangkat reguler/pilihan pegawai',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.3 Mutasi Pegawai'
    },
    {
      kode: '800.1.11.13',
      nama: 'Pengurusan Kenaikan Gaji Berkala (KGB)',
      kategori: '800',
      klaster: 'cuti_admin',
      desc: 'Pemberitahuan berkala kenaikan gaji 2 tahunan PNS & PPPK',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.11 Administrasi Pegawai'
    },
    {
      kode: '800.1.3.1',
      nama: 'Usulan Alih Status, Pindah Instansi, Mutasi Wilayah Kerja',
      kategori: '800',
      klaster: 'pangkat_mutasi',
      desc: 'Mutasi antar instansi/wilayah kerja, persetujuan Kepala BKN',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.3 Mutasi Pegawai'
    },
    {
      kode: '800.1.6.6',
      nama: 'Pensiun ASN (BUP, Janda/Duda, Anumerta)',
      kategori: '800',
      klaster: 'pangkat_mutasi',
      desc: 'Pemberkasan dan penetapan surat keputusan pensiun batas usia pensiun',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.6 Kode Etik, Disiplin & Pensiun'
    },
    {
      kode: '800.1.11.4',
      nama: 'Cuti Tahunan Pegawai',
      kategori: '800',
      klaster: 'cuti_admin',
      desc: 'Pemberian izin cuti tahunan bagi ASN di lingkungan Pemkab Luwu Timur',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.11 Administrasi Pegawai'
    },
    {
      kode: '800.1.11.3',
      nama: 'Cuti Bersalin / Melahirkan',
      kategori: '800',
      klaster: 'cuti_admin',
      desc: 'Surat izin cuti persalinan bagi ASN',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.11 Administrasi Pegawai'
    },
    {
      kode: '800.1.11.2',
      nama: 'Cuti Sakit Pegawai',
      kategori: '800',
      klaster: 'cuti_admin',
      desc: 'Keterangan cuti karena sakit berdasarkan surat dokter resmi',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.11 Administrasi Pegawai'
    },
    {
      kode: '800.1.11.5',
      nama: 'Cuti Alasan Penting',
      kategori: '800',
      klaster: 'cuti_admin',
      desc: 'Izin cuti keperluan mendesak keluarga/musibah',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.11 Administrasi Pegawai'
    },
    {
      kode: '800.1.4.1',
      nama: 'Usulan Tugas Belajar / Izin Belajar / Diklat / Ujian Dinas',
      kategori: '800',
      klaster: 'kinerja_diklat',
      desc: 'Rekomendasi pengembangan kompetensi & pendidikan formal lanjutan',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.4 Pengembangan Karir'
    },
    {
      kode: '800.1.4.2',
      nama: 'Penyesuaian Ijazah ASN',
      kategori: '800',
      klaster: 'kinerja_diklat',
      desc: 'Pencantuman gelar akademik dan penyesuaian kualifikasi pendidikan',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.4 Pengembangan Karir'
    },
    {
      kode: '800.1.4.4',
      nama: 'Standar Kinerja Pegawai (SKP) dan Penilaian Prestasi Kerja',
      kategori: '800',
      klaster: 'kinerja_diklat',
      desc: 'Evaluasi kinerja periodik ASN tahunan dan triwulanan',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.4 Pengembangan Karir'
    },
    {
      kode: '800.1.2.1',
      nama: 'Formasi ASN / Usulan CPNS & PPPK',
      kategori: '800',
      klaster: 'pangkat_mutasi',
      desc: 'Usulan penetapan formasi kepada KemenPAN-RB & BKN',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.2 Formasi & Pengadaan'
    },
    {
      kode: '800.1.2.5',
      nama: 'Pengangkatan ASN / Pengambilan Sumpah Janji',
      kategori: '800',
      klaster: 'pangkat_mutasi',
      desc: 'SK pengangkatan CPNS menjadi PNS / pengangkatan PPPK',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.2 Formasi & Pengadaan'
    },
    {
      kode: '800.1.6.2',
      nama: 'Disiplin ASN (Hukuman Disiplin Ringan / Sedang / Berat)',
      kategori: '800',
      klaster: 'rahasia',
      isRahasia: true,
      desc: '🔒 Berkas Rahasia - Pemanggilan pemeriksaan & SK Penjatuhan Hukuman Disiplin',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.6 Kode Etik, Disiplin & Pensiun'
    },
    {
      kode: '800.1.8.1',
      nama: 'Status Kepegawaian (Izin Perceraian / Perkawinan ASN)',
      kategori: '800',
      klaster: 'rahasia',
      isRahasia: true,
      desc: '🔒 Berkas Rahasia - Rekomendasi/Izin tertulis perceraian bagi ASN',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.8 Status dan Kedudukan Pegawai'
    },
    {
      kode: '800.1.12.8',
      nama: 'Pemberian Piagam Penghargaan dan Tanda Jasa',
      kategori: '800',
      klaster: 'cuti_admin',
      desc: 'Usulan Satyalancana Karya Satya pengabdian 10, 20, 30 tahun',
      hierarki: '800 Kepegawaian > 800.1 SDM > 800.1.12 Kesejahteraan Pegawai'
    },
    {
      kode: '000.1.5',
      nama: 'Undangan Rapat Kedinasan',
      kategori: '000',
      klaster: 'umum',
      desc: 'Penyelenggaraan rapat koordinasi / dinas BKPSDM',
      hierarki: '000 Umum > 000.1 Ketatausahaan > 000.1.5 Undangan Rapat'
    },
    {
      kode: '050',
      nama: 'Perencanaan Pembangunan Daerah / Rencana Strategis (Renstra)',
      kategori: '050',
      klaster: 'umum',
      desc: 'Penyusunan Renja, Renstra, dan IKU BKPSDM',
      hierarki: '050 Perencanaan Pembangunan'
    },
    {
      kode: '900',
      nama: 'Keuangan Daerah (DPA-SKPD & SPJ)',
      kategori: '900',
      klaster: 'umum',
      desc: 'Administrasi keuangan daerah, anggaran, dan perjalanan dinas',
      hierarki: '900 Keuangan'
    }
  ],

  // Hitung nomor urut surat keluar berikutnya berdasarkan nomor surat riil terakhir
  getNextUrutNumber(list = null) {
    const items = list || Store.state.surat_keluar || [];
    for (const item of items) {
      const m = (item.no_surat_keluar || '').match(/\/0*(\d+)\//);
      if (m) {
        const num = parseInt(m[1], 10);
        // Abaikan anomali / typo tahun lampau jika ada
        if (num < 2000) {
          return num + 1;
        }
      }
    }
    return (items.length || 0) + 1;
  },

  render() {
    const container = document.getElementById('view-surat-keluar');
    if (!container) return;

    const isAuth = Store.state.isLoggedIn;
    const allList = Store.state.surat_keluar || [];
    const filteredList = this.getFilteredList(allList);

    // Hitung nomor terakhir & estimasi nomor berikutnya secara real-time
    const lastItem = allList[0];
    const nextUrut = this.getNextUrutNumber(allList);
    const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const monthRomawi = romawi[new Date().getMonth()];
    const year = new Date().getFullYear();
    const nextFormatPreview = `[Kode Klasifikasi]/${String(nextUrut).padStart(3, '0')}/BKPSDM/${monthRomawi}/${year}`;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="regulation-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Perbup Luwu Timur No. 69 Tahun 2023
              </span>
              ${!isAuth ? `
                <span class="badge badge-info" style="font-size:11px; padding:3px 8px; font-weight:700;">
                  🔒 Mode Baca Terbuka Staf Kantor (Read-Only)
                </span>
              ` : ''}
            </div>
            <h2 style="margin-top:4px;">Buku Agenda & Penomoran Digital Surat Keluar BKPSDM</h2>
            <p>Penomoran resmi terpusat berbasis Kode Klasifikasi Perbup Luwu Timur No. 69 Tahun 2023. Naskah fisik surat disusun mandiri oleh bidang pembuat.</p>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <div style="position:relative; width: 250px;">
              <input type="text" id="search-sk" class="form-control" placeholder="Cari nomor/perihal/kode..." oninput="SuratKeluarModule.filterTable()">
            </div>
            ${isAuth ? `
              <button class="btn btn-primary" onclick="SuratKeluarModule.openCreateModal()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Ambil Nomor Surat Keluar
              </button>
            ` : `
              <button class="btn btn-outline" style="border-color:#0284c7; color:#0284c7; font-weight:700;" onclick="App.checkAuthState()">
                🔐 Login Petugas
              </button>
            `}
          </div>
        </div>

        <!-- Papan Informasi Penomoran Terbuka untuk Rekan Kantor -->
        <div style="background:#f0fdf4; border-bottom:1px solid #bbf7d0; padding:16px 24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:40px; height:40px; border-radius:8px; background:#dcfce7; color:#15803d; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; flex-shrink:0;">
                📋
              </div>
              <div>
                <div style="font-size:11px; text-transform:uppercase; color:#166534; font-weight:800; letter-spacing:0.5px;">
                  Papan Informasi Penomoran Surat Keluar (Anti Nomor Ganda)
                </div>
                <div style="font-size:12.5px; color:#334155; margin-top:2px;">
                  Rekan kantor yang sedang menyusun draf di Microsoft Word dapat memantau nomor surat terakhir di bawah ini agar penomoran tidak kembar.
                  ${!isAuth ? '<span style="color:#0284c7; font-weight:600;">(Akses baca terbuka untuk staf kantor; edit & hapus dinonaktifkan)</span>' : ''}
                </div>
              </div>
            </div>

            <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
              <div style="background:#ffffff; border:1px solid #86efac; border-radius:8px; padding:7px 14px; text-align:right;">
                <div style="font-size:10px; text-transform:uppercase; color:#64748b; font-weight:700;">Nomor Terakhir Terbit:</div>
                <div style="font-family:monospace; font-weight:800; font-size:13.5px; color:#15803d; margin-top:1px;">
                  ${lastItem ? lastItem.no_surat_keluar : 'Belum Ada Data'}
                </div>
                <div style="font-size:11px; color:#047857; margin-top:3px; display:flex; align-items:center; justify-content:flex-end; gap:4px; font-weight:600;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Tanggal Surat: ${lastItem && lastItem.tgl_surat ? App.formatIndoDate(lastItem.tgl_surat) : '-'}
                </div>
              </div>
              <div style="background:#ffffff; border:1px solid #93c5fd; border-radius:8px; padding:7px 14px; text-align:right;">
                <div style="font-size:10px; text-transform:uppercase; color:#0369a1; font-weight:700;">Estimasi Urut Berikutnya:</div>
                <div style="font-family:monospace; font-weight:800; font-size:13.5px; color:#0284c7; margin-top:1px;">
                  ${nextFormatPreview}
                </div>
                <div style="font-size:11px; color:#0284c7; margin-top:3px; font-weight:600;">
                  Siap Digunakan
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Bar Kategori Perbup Luwu Timur -->
        <div style="background:#f1f5f9; padding:10px 24px; border-bottom:1px solid var(--border-color); display:flex; gap:8px; align-items:center; overflow-x:auto;">
          <span style="font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; margin-right:4px; white-space:nowrap;">Klaster Perbup:</span>
          <button class="btn btn-sm ${this.currentFilter === 'all' ? 'btn-primary' : 'btn-outline'}" onclick="SuratKeluarModule.setFilter('all')">
            Semua (${allList.length})
          </button>
          <button class="btn btn-sm ${this.currentFilter === 'pangkat_mutasi' ? 'btn-primary' : 'btn-outline'}" onclick="SuratKeluarModule.setFilter('pangkat_mutasi')">
            800.1 Pangkat & Mutasi
          </button>
          <button class="btn btn-sm ${this.currentFilter === 'cuti_admin' ? 'btn-primary' : 'btn-outline'}" onclick="SuratKeluarModule.setFilter('cuti_admin')">
            800.1.11 Cuti & Administrasi
          </button>
          <button class="btn btn-sm ${this.currentFilter === 'kinerja_diklat' ? 'btn-primary' : 'btn-outline'}" onclick="SuratKeluarModule.setFilter('kinerja_diklat')">
            800.1.4 Diklat & Kinerja
          </button>
          <button class="btn btn-sm ${this.currentFilter === 'umum' ? 'btn-primary' : 'btn-outline'}" onclick="SuratKeluarModule.setFilter('umum')">
            000 Umum & Rapat
          </button>
          <button class="btn btn-sm ${this.currentFilter === 'rahasia' ? 'btn-danger-outline' : 'btn-outline'}" style="${this.currentFilter === 'rahasia' ? 'background:#dc2626; color:#ffffff; border-color:#dc2626;' : ''}" onclick="SuratKeluarModule.setFilter('rahasia')">
            🔒 Sifat Rahasia (Disiplin/Cerai)
          </button>
        </div>

        <div class="card-body" style="padding:0;">
          <div class="table-responsive">
            <table class="data-table" id="table-surat-keluar">
              <thead>
                <tr>
                  <th style="width:110px;">No. Agenda</th>
                  <th style="width:115px;">Tanggal Surat</th>
                  <th>Nomor Surat Resmi BKPSDM</th>
                  <th>Kode Klasifikasi (Perbup 69/2023)</th>
                  <th>Perihal Surat Keluar</th>
                  <th style="width:140px;">Sifat & Penandatangan</th>
                  <th style="text-align:right; width:150px;">Aksi</th>
                </tr>
              </thead>
              <tbody id="tbody-surat-keluar">
                ${this.renderRows(filteredList)}
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer">
          <span style="font-size:12.5px; color:var(--text-muted);">
            Menampilkan <strong>${filteredList.length}</strong> dari total <strong>${allList.length}</strong> nomor surat keluar aktif
          </span>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" onclick="App.navigate('laporan')">
              Cetak Buku Agenda Surat Keluar
            </button>
          </div>
        </div>
      </div>
    `;
  },

  setFilter(filterType) {
    this.currentFilter = filterType;
    this.render();
  },

  getFilteredList(list) {
    if (this.currentFilter === 'all') return list;

    return list.filter(s => {
      const kode = s.kode_klasifikasi || '';
      const isRahasia = (s.sifat_surat || '').toLowerCase() === 'rahasia';

      if (this.currentFilter === 'rahasia') return isRahasia;
      if (this.currentFilter === 'pangkat_mutasi') {
        return kode.startsWith('800.1.1') || kode.startsWith('800.1.2') || kode.startsWith('800.1.3') || kode.startsWith('800.1.6');
      }
      if (this.currentFilter === 'cuti_admin') {
        return kode.startsWith('800.1.11') || kode.startsWith('800.1.12');
      }
      if (this.currentFilter === 'kinerja_diklat') {
        return kode.startsWith('800.1.4') || kode.startsWith('800.1.5');
      }
      if (this.currentFilter === 'umum') {
        return kode.startsWith('000') || kode.startsWith('050') || kode.startsWith('900');
      }
      return true;
    });
  },

  renderRows(list) {
    if (!list.length) {
      return `<tr><td colspan="7" style="text-align:center; padding:36px; color:#94a3b8;">Tidak ada data surat keluar yang cocok dengan filter ini.</td></tr>`;
    }

    const isAuth = Store.state.isLoggedIn;

    return list.map(s => {
      const isRahasia = (s.sifat_surat || '').toLowerCase() === 'rahasia';
      const is800 = (s.kode_klasifikasi || '').startsWith('800');

      return `
        <tr>
          <td>
            <span style="font-weight:700; color:var(--primary); font-family:monospace; font-size:13px;">
              ${s.no_agenda}
            </span>
          </td>
          <td>
            <span style="font-weight:600; color:#1e293b; font-size:12.5px;">
              ${App.formatIndoDate(s.tgl_surat)}
            </span>
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-family:monospace; font-weight:800; color:#0f172a; font-size:13.5px;">
                ${s.no_surat_keluar}
              </span>
              <button class="btn btn-outline btn-sm" style="padding:2px 6px; font-size:10.5px;" onclick="SuratKeluarModule.copyText('${s.no_surat_keluar}')" title="Salin nomor untuk ditempel di naskah Word">
                Salin
              </button>
            </div>
            <div style="font-size:11.5px; color:#475569; margin-top:3px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span style="display:inline-flex; align-items:center; gap:3px; font-weight:700; color:#0369a1;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                Tgl: ${App.formatIndoDate(s.tgl_surat)}
              </span>
              <span style="color:#cbd5e1;">•</span>
              <span>Unit: ${s.bidang_pembuat || 'Bidang Terkait'}</span>
            </div>
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span class="code-tag ${is800 ? 'code-tag-internal' : ''}" style="${!is800 ? 'background:#e0f2fe; color:#0369a1; border-color:#bae6fd;' : ''}">
                ${s.kode_klasifikasi}
              </span>
              <span class="badge ${is800 ? 'badge-success' : 'badge-info'}" style="font-size:10px; padding:2px 6px;">
                Perbup 69/2023
              </span>
            </div>
            <div style="font-size:12px; font-weight:600; color:#1e293b; margin-top:3px; max-width:260px; line-height:1.35;">
              ${s.nama_klasifikasi}
            </div>
          </td>
          <td>
            <div style="font-weight:600; color:var(--text-main); font-size:13px; line-height:1.4; max-width:320px;">
              ${s.perihal}
            </div>
          </td>
          <td>
            <div>
              <span class="badge badge-${s.sifat_surat.toLowerCase()}">
                ${isRahasia ? '🔒 ' : ''}${s.sifat_surat}
              </span>
            </div>
            <div style="font-size:11px; color:#64748b; margin-top:4px;">
              ${s.penandatangan ? s.penandatangan.replace('Kabupaten Luwu Timur', '') : 'PARHA ARIEF, S.AP'}
            </div>
          </td>
          <td style="text-align:right;">
            <div style="display:inline-flex; gap:4px; flex-wrap:wrap; justify-content:flex-end;">
              <button class="btn btn-outline btn-sm" onclick="SuratKeluarModule.showDetail(${s.id})" title="Lihat Rincian Surat">
                Detail
              </button>
              <button class="btn btn-outline btn-sm" style="background:#f0fdf4; color:#15803d; border-color:#86efac;" onclick="SuratKeluarModule.copyText('${s.no_surat_keluar}')" title="Salin Nomor Surat Resmi untuk ditempel di Microsoft Word">
                📋 Salin No
              </button>
              ${isAuth ? `
                <button class="btn btn-outline btn-sm" style="color:#0284c7; border-color:#bae6fd;" onclick="SuratKeluarModule.openEditModal(${s.id})" title="Ubah Data Surat Keluar">
                  Ubah
                </button>
                <button class="btn btn-outline btn-sm" style="color:#dc2626; border-color:#fecaca;" onclick="SuratKeluarModule.confirmDelete(${s.id})" title="Hapus Surat Keluar">
                  Hapus
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterTable() {
    const q = (document.getElementById('search-sk')?.value || '').toLowerCase();
    let list = this.getFilteredList(Store.state.surat_keluar || []);
    if (q) {
      list = list.filter(s => 
        s.no_agenda.toLowerCase().includes(q) ||
        s.no_surat_keluar.toLowerCase().includes(q) ||
        s.perihal.toLowerCase().includes(q) ||
        s.kode_klasifikasi.toLowerCase().includes(q) ||
        (s.bidang_pembuat || '').toLowerCase().includes(q)
      );
    }
    const tbody = document.getElementById('tbody-surat-keluar');
    if (tbody) tbody.innerHTML = this.renderRows(list);
  },

  openCreateModal() {
    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const monthRomawi = romawi[new Date().getMonth()];
    const year = new Date().getFullYear();
    const allSK = Store.state.surat_keluar || [];
    const lastItem = allSK[0];
    const nextUrutNum = this.getNextUrutNumber(allSK);
    const defaultUrut = String(nextUrutNum).padStart(3, '0');
    const defaultNoSurat = `[KODE_PERBUP]/${defaultUrut}/BKPSDM/${monthRomawi}/${year}`;

    title.innerText = 'Pengambilan Nomor Surat Keluar Resmi (Perbup Luwu Timur No. 69/2023)';
    body.innerHTML = `
      <form id="form-surat-keluar">
        <!-- Informasi Nomor Terakhir & Tanggal Keluar -->
        <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-size:10.5px; text-transform:uppercase; color:#166534; font-weight:700;">Nomor Surat Terakhir di Buku Agenda:</div>
            <div style="font-family:monospace; font-weight:800; font-size:13.5px; color:#15803d; margin-top:2px;">
              ${lastItem ? lastItem.no_surat_keluar : '-'}
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10.5px; text-transform:uppercase; color:#64748b; font-weight:700;">Tanggal Terakhir Keluar:</div>
            <div style="font-size:12.5px; font-weight:700; color:#0f172a; margin-top:2px;">
              📅 ${lastItem && lastItem.tgl_surat ? App.formatIndoDate(lastItem.tgl_surat) : '-'}
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Perihal Surat Keluar <span class="required">*</span> (Ketik untuk auto-suggest cerdas Perbup)</label>
          <div class="autosuggest-wrapper">
            <textarea id="sk-perihal" class="form-control" rows="2" placeholder="Ketik perihal surat di sini (misal: Usulan Kenaikan Pangkat / Permohonan Cuti Tahunan / Izin Cerai)..." required></textarea>
          </div>
          <span class="form-hint">⚡ Sistem akan mencari kode Perbup Luwu Timur secara otomatis saat Anda mengetik perihal.</span>
        </div>

        <!-- Box Kodifikasi Perbup Luwu Timur No. 69 Tahun 2023 -->
        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:16px; margin-bottom:16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <span style="font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px;">
                KODIFIKASI PERATURAN BUPATI LUWU TIMUR NO. 69 TAHUN 2023
              </span>
            </div>
            <button type="button" class="btn btn-outline btn-sm" style="background:#ffffff; color:#166534; border-color:#86efac; font-weight:700;" onclick="SuratKeluarModule.togglePerbupDrawer()">
              🔍 Telusuri / Pilih dari Katalog Perbup
            </button>
          </div>

          <div class="form-row" style="margin-bottom:0;">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="color:#166534; font-size:12px;">Kode Klasifikasi yang Betul <span class="required">*</span></label>
              <input type="text" id="sk-kode" class="form-control" style="font-family:monospace; font-weight:800; font-size:15px; color:#15803d; background:#ffffff;" placeholder="Contoh: 800.1.3.2" required oninput="SuratKeluarModule.onManualCodeInput(this.value)">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label" style="color:#166534; font-size:12px;">Nama / Uraian Klasifikasi Perbup</label>
              <input type="text" id="sk-nama-kode" class="form-control" placeholder="Nama klasifikasi Perbup" readonly style="background:#ffffff; font-weight:600; color:#0f172a;">
            </div>
          </div>

          <!-- Live Hierarchy Verification Indicator -->
          <div id="sk-hierarchy-box" style="margin-top:10px; padding:8px 12px; background:#dcfce7; border-radius:6px; font-size:12px; color:#166534; display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span id="sk-hierarchy-text">Pilih atau ketik kode untuk memvalidasi kesesuaian dengan Lampiran Perbup Luwu Timur 2023</span>
          </div>

          <!-- Expandable Perbup Catalog Drawer -->
          <div id="drawer-perbup-catalog" style="display:none; margin-top:14px; background:#ffffff; border:1px solid #bbf7d0; border-radius:8px; padding:14px; box-shadow:var(--shadow-sm);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <strong style="font-size:13px; color:#166534;">Daftar Kode Klasifikasi Terpopuler BKPSDM Luwu Timur:</strong>
              <button type="button" class="btn btn-outline btn-sm" style="padding:2px 8px; font-size:11px;" onclick="SuratKeluarModule.togglePerbupDrawer()">Tutup Katalog</button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:8px; max-height:240px; overflow-y:auto; padding-right:4px;">
              ${this.POPULAR_CODES.map(c => `
                <div style="border:1px solid #e2e8f0; border-radius:6px; padding:8px 10px; cursor:pointer; background:#fafafa; transition:all 0.15s ease;"
                     onmouseover="this.style.background='#f0fdf4'; this.style.borderColor='#86efac';" 
                     onmouseout="this.style.background='#fafafa'; this.style.borderColor='#e2e8f0';"
                     onclick="SuratKeluarModule.selectCatalogCode('${c.kode}', '${c.nama.replace(/'/g, "\\'")}', '${c.hierarki.replace(/'/g, "\\'")}', ${Boolean(c.isRahasia)})">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-family:monospace; font-weight:800; color:#15803d; font-size:12.5px;">${c.kode}</span>
                    ${c.isRahasia ? '<span class="badge badge-danger" style="font-size:9px;">🔒 Rahasia</span>' : ''}
                  </div>
                  <div style="font-weight:700; font-size:12px; color:#0f172a; margin-top:2px; line-height:1.3;">${c.nama}</div>
                  <div style="font-size:11px; color:#64748b; margin-top:2px;">${c.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nomor Surat Keluar Resmi (Dikunci Otomatis oleh Sistem) <span class="required">*</span></label>
          <input type="text" id="sk-no-surat" class="form-control" style="font-family:monospace; font-weight:800; font-size:15px; color:var(--primary);" value="${defaultNoSurat}" required>
          <span class="form-hint">Format resmi Pemkab Luwu Timur: <code>[Kode Klasifikasi Perbup] / [Nomor Urut] / BKPSDM / [Bulan Romawi] / [Tahun]</code></span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Bidang / Unit Kerja Pembuat Naskah Surat <span class="required">*</span></label>
            <select id="sk-bidang" class="form-control" required>
              <option value="Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian" selected>Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian</option>
              <option value="Bidang Mutasi, Kepangkatan dan Pengembangan Karir">Bidang Mutasi, Kepangkatan dan Pengembangan Karir</option>
              <option value="Bidang Pengembangan Sumber Daya Aparatur">Bidang Pengembangan Sumber Daya Aparatur</option>
              <option value="Sekretariat / Subbagian Umum dan Kepegawaian">Sekretariat / Subbagian Umum dan Kepegawaian</option>
              <option value="Subbagian Perencanaan dan Keuangan">Subbagian Perencanaan dan Keuangan</option>
            </select>
            <span class="form-hint">Bidang menyusun & mencetak surat fisik. Subbag Umum mengagendakan nomor.</span>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Surat Keluar <span class="required">*</span></label>
            <input type="date" id="sk-tgl-surat" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
            <span class="form-hint">Tanggal yang tercantum pada naskah surat fisik</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Sifat Surat <span class="required">*</span></label>
            <select id="sk-sifat" class="form-control" onchange="SuratKeluarModule.onSifatChange(this.value)">
              <option value="Biasa" selected>Biasa</option>
              <option value="Penting">Penting</option>
              <option value="Segera">Segera</option>
              <option value="Rahasia">🔒 Rahasia (Izin Cerai, Disiplin, dsb)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Pejabat Penandatangan Surat</label>
            <select id="sk-penandatangan" class="form-control">
              <option value="PARHA ARIEF, S.AP" selected>Kepala BKPSDM Kab. Luwu Timur (PARHA ARIEF, S.AP)</option>
              <option value="Bupati Luwu Timur cq. Kepala BKPSDM">Bupati Luwu Timur cq. Kepala BKPSDM</option>
              <option value="Sekretaris BKPSDM an. Kepala Badan">Sekretaris BKPSDM an. Kepala Badan</option>
            </select>
          </div>
        </div>

        <!-- Banner Peringatan Surat Rahasia -->
        <div id="banner-rahasia-box" style="display:none; background:#fee2e2; border:1px solid #fca5a5; border-radius:8px; padding:12px; margin-bottom:16px;">
          <div style="font-weight:700; color:#dc2626; font-size:12.5px;">
            🔒 PERLAKUAN KHUSUS DOKUMEN RAHASIA (PERBUP 69/2023 & UU ASN)
          </div>
          <div style="font-size:11.5px; color:#991b1b; margin-top:3px; line-height:1.4;">
            Surat ini bersifat rahasia (seperti izin perceraian atau berkas disiplin pegawai). Naskah fisik surat wajib dimasukkan ke dalam amplop bersegel tertutup bertanda 'RAHASIA'. Sistem mengunci nomor urut resmi agar terdaftar sah di agenda.
          </div>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="SuratKeluarModule.submitCreate()">
        Ambil & Kunci Nomor Surat Ini
      </button>
    `;

    App.openModal();

    // Attach AutoSuggest to Perihal input
    new SmartAutoSuggest({
      input: '#sk-perihal',
      targetCode: '#sk-kode',
      targetName: '#sk-nama-kode',
      onSelect: (item) => {
        SuratKeluarModule.updateNumberWithCode(item.kode);
        SuratKeluarModule.updateHierarchyBox(item.kode, item.nama);

        // Auto-select Rahasia for sensitive codes
        if (item.kode === '800.1.8.1' || item.kode === '800.1.6.2' || item.kode === '800.1.6.4' || item.kode === '800.1.6.5') {
          const sifatSel = document.getElementById('sk-sifat');
          if (sifatSel) {
            sifatSel.value = 'Rahasia';
            SuratKeluarModule.onSifatChange('Rahasia');
          }
        }
      }
    });
  },

  togglePerbupDrawer() {
    const drawer = document.getElementById('drawer-perbup-catalog');
    if (drawer) {
      drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
    }
  },

  selectCatalogCode(kode, nama, hierarki, isRahasia) {
    const kodeInput = document.getElementById('sk-kode');
    const namaInput = document.getElementById('sk-nama-kode');
    if (kodeInput) kodeInput.value = kode;
    if (namaInput) namaInput.value = nama;

    this.updateNumberWithCode(kode);
    this.updateHierarchyBox(kode, nama, hierarki);

    if (isRahasia) {
      const sifatSel = document.getElementById('sk-sifat');
      if (sifatSel) {
        sifatSel.value = 'Rahasia';
        this.onSifatChange('Rahasia');
      }
    }

    this.togglePerbupDrawer();
    App.showToast(`Kode Perbup ${kode} (${nama}) berhasil dipilih`, 'success');
  },

  onManualCodeInput(val) {
    const code = val.trim();
    this.updateNumberWithCode(code);
    this.updateHierarchyBox(code);
  },

  updateNumberWithCode(code) {
    const validCode = code || '[KODE_PERBUP]';
    const noSuratInput = document.getElementById('sk-no-surat');
    if (noSuratInput) {
      const parts = noSuratInput.value.split('/');
      if (parts.length >= 2) {
        parts[0] = validCode;
        noSuratInput.value = parts.join('/');
      }
    }
  },

  updateHierarchyBox(code, name = '', customHierarki = '') {
    const box = document.getElementById('sk-hierarchy-box');
    const text = document.getElementById('sk-hierarchy-text');
    if (!box || !text) return;

    if (!code) {
      text.innerText = 'Pilih atau ketik kode untuk memvalidasi kesesuaian dengan Lampiran Perbup Luwu Timur 2023';
      box.style.background = '#f1f5f9';
      box.style.color = '#475569';
      return;
    }

    const pop = this.POPULAR_CODES.find(p => p.kode === code);
    const hierarkiText = customHierarki || (pop ? pop.hierarki : `Kode ${code} Klasifikasi Perbup Luwu Timur No. 69/2023`);

    text.innerHTML = `<strong>Kesesuaian Regulasi:</strong> Terdaftar resmi dalam Perbup Luwu Timur No. 69/2023 &bull; <em>${hierarkiText}</em>`;
    box.style.background = '#dcfce7';
    box.style.color = '#166534';
  },

  onSifatChange(val) {
    const banner = document.getElementById('banner-rahasia-box');
    if (banner) banner.style.display = val === 'Rahasia' ? 'block' : 'none';
  },

  async submitCreate() {
    const perihal = document.getElementById('sk-perihal')?.value.trim();
    const kode = document.getElementById('sk-kode')?.value.trim();
    const namaKode = document.getElementById('sk-nama-kode')?.value.trim();
    const noSurat = document.getElementById('sk-no-surat')?.value.trim();
    const bidang = document.getElementById('sk-bidang')?.value || 'Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian';
    const tglSurat = document.getElementById('sk-tgl-surat')?.value;
    const sifat = document.getElementById('sk-sifat')?.value;
    const penandatangan = document.getElementById('sk-penandatangan')?.value;

    if (!perihal || !kode || !noSurat) {
      App.showToast('Mohon lengkapi perihal dan kode klasifikasi surat (*)', 'warning');
      return;
    }

    const created = await Store.addSuratKeluar({
      perihal: perihal,
      kode_klasifikasi: kode,
      nama_klasifikasi: namaKode || 'Kepegawaian',
      no_surat_keluar: noSurat,
      bidang_pembuat: bidang,
      tgl_surat: tglSurat,
      sifat_surat: sifat,
      penandatangan: penandatangan
    });

    if (created) {
      this.render();
      this.showSuccessSlip(created);
    }
  },

  showSuccessSlip(letter) {
    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    const isRahasia = (letter.sifat_surat || '').toLowerCase() === 'rahasia';

    title.innerText = '✓ Nomor Surat Resmi Berhasil Diambil & Dikunci';
    body.innerHTML = `
      <div style="text-align:center; padding:10px 0 20px;">
        <div style="width:60px; height:60px; border-radius:50%; background:#ecfdf5; color:#059669; font-size:28px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
          ✓
        </div>
        <h3 style="font-size:18px; font-weight:800; color:var(--text-main);">
          Nomor Surat Telah Terkunci di Sistem
        </h3>
        <p style="font-size:13px; color:var(--text-muted); max-width:480px; margin:4px auto 0;">
          Nomor urut resmi berbasis Perbup Luwu Timur No. 69 Tahun 2023 telah terkunci agar tidak ganda. Salin nomor ini untuk ditempelkan pada naskah fisik dinas (Microsoft Word) Anda.
        </p>

        <!-- Box Nomor Resmi -->
        <div style="background:#f0f9ff; border:2px dashed #0284c7; border-radius:10px; padding:18px; margin:20px 0; display:inline-block; min-width:360px;">
          <div style="font-size:11px; font-weight:700; text-transform:uppercase; color:#0369a1; letter-spacing:0.8px;">
            NOMOR SURAT KELUAR RESMI BKPSDM
          </div>
          <div style="font-family:monospace; font-size:20px; font-weight:800; color:#0c4a6e; margin:6px 0;">
            ${letter.no_surat_keluar}
          </div>
          <button class="btn btn-primary btn-sm" onclick="SuratKeluarModule.copyText('${letter.no_surat_keluar}')">
            📋 Salin Nomor Surat
          </button>
        </div>

        <!-- Detail Penyandingan & Rujukan Perbup -->
        <div style="text-align:left; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; font-size:13px; line-height:1.5;">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div><strong>No. Agenda:</strong> ${letter.no_agenda}</div>
            <div><strong>Sifat Surat:</strong> <span class="badge badge-${letter.sifat_surat.toLowerCase()}">${letter.sifat_surat}</span></div>
            <div>
              <strong>Tanggal Surat:</strong><br>
              <span style="font-weight:700; color:#0f172a;">${letter.tgl_surat || '-'}</span>
            </div>
            <div>
              <strong>Kode Klasifikasi yang Betul:</strong><br>
              <span class="code-tag code-tag-internal">${letter.kode_klasifikasi}</span> ${letter.nama_klasifikasi}
            </div>
            <div>
              <strong>Bidang Pembuat Naskah:</strong><br>
              <span style="color:#0f172a; font-weight:600;">${letter.bidang_pembuat || 'Bidang Terkait'}</span>
            </div>
            <div style="grid-column: span 2;">
              <strong>Perihal Surat Keluar:</strong><br>
              <span style="color:#0f172a; font-weight:600;">${letter.perihal}</span>
            </div>
          </div>
        </div>

        ${isRahasia ? `
          <div style="background:#fee2e2; border:1px solid #f87171; border-radius:8px; padding:12px; margin-top:16px; text-align:left; font-size:12px; color:#991b1b;">
            🔒 <strong>Dokumen Rahasia (Perbup Luwu Timur 2023):</strong> Naskah fisik surat wajib dimasukkan ke dalam amplop bersegel tertutup bertanda 'RAHASIA' sebelum ditandatangani basah oleh Kepala Badan.
          </div>
        ` : ''}
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Tutup</button>
      <button class="btn btn-primary" onclick="SuratKeluarModule.copyText('${letter.no_surat_keluar}')">
        Salin Nomor Surat
      </button>
    `;

    App.openModal();
  },

  showDetail(id) {
    const s = Store.state.surat_keluar.find(item => item.id === id);
    if (!s) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    const isRahasia = (s.sifat_surat || '').toLowerCase() === 'rahasia';
    const is800 = (s.kode_klasifikasi || '').startsWith('800');

    title.innerText = `Detail Kendali Surat Keluar: ${s.no_agenda}`;
    body.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="background:#f8fafc; padding:16px; border-radius:8px; border:1px solid #e2e8f0;">
          <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Nomor Surat Resmi BKPSDM (Digital Locked)</div>
          <div style="font-family:monospace; font-size:17px; font-weight:800; color:var(--primary); margin-top:4px; display:flex; align-items:center; gap:8px;">
            ${s.no_surat_keluar}
            <button class="btn btn-outline btn-sm" onclick="SuratKeluarModule.copyText('${s.no_surat_keluar}')">Salin</button>
          </div>
          <div style="margin-top:8px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="code-tag ${is800 ? 'code-tag-internal' : ''}">Kode Klasifikasi: ${s.kode_klasifikasi}</span>
            <span style="font-size:12.5px; color:#15803d; font-weight:700;">${s.nama_klasifikasi}</span>
            <span class="badge badge-success" style="font-size:10px;">Perbup Luwu Timur No. 69/2023 Valid</span>
          </div>
        </div>

        <div>
          <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Perihal Surat Keluar</div>
          <div style="font-size:14px; font-weight:600; line-height:1.4; color:var(--text-main); margin-top:2px;">
            ${s.perihal}
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; border-top:1px solid #e2e8f0; padding-top:14px;">
          <div>
            <div style="font-size:11px; color:#64748b;">Bidang Pembuat Naskah:</div>
            <div style="font-weight:700; font-size:13px; color:#0f172a;">${s.bidang_pembuat || 'Bidang Terkait'}</div>
          </div>
          <div>
            <div style="font-size:11px; color:#64748b;">Tanggal Surat Keluar:</div>
            <div style="font-weight:700; font-size:13px; color:var(--primary);">${s.tgl_surat || '-'}</div>
          </div>
          <div>
            <div style="font-size:11px; color:#64748b;">Sifat Surat:</div>
            <span class="badge badge-${s.sifat_surat.toLowerCase()}">${isRahasia ? '🔒 ' : ''}${s.sifat_surat}</span>
          </div>
          <div>
            <div style="font-size:11px; color:#64748b;">Pejabat Penandatangan:</div>
            <div style="font-weight:600; font-size:13px;">${s.penandatangan || 'PARHA ARIEF, S.AP (Kepala BKPSDM)'}</div>
          </div>
        </div>

        <!-- Box Bukti Yuridis Perbup -->
        <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:8px; padding:12px; font-size:12px; color:#166534; line-height:1.45;">
          <strong>Rujukan Regulasi:</strong> Naskah ini resmi dikodifikasikan berdasarkan <strong>Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023</strong> tentang Kode Klasifikasi Arsip Pemerintah Daerah (sesuai Permendagri No. 83/2022).
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Tutup</button>
      <button class="btn btn-primary" onclick="SuratKeluarModule.copyText('${s.no_surat_keluar}')">
        📋 Salin Nomor Surat Resmi
      </button>
    `;

    App.openModal();
  },

  copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      App.showToast(`Nomor surat ${text} berhasil disalin ke clipboard!`, 'success');
    }).catch(() => {
      App.showToast(`Nomor: ${text}`, 'info');
    });
  },

  openEditModal(id) {
    const s = Store.state.surat_keluar.find(item => item.id === id);
    if (!s) return;

    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const footer = document.getElementById('modal-footer');

    title.innerText = `Ubah Data Surat Keluar: ${s.no_agenda}`;
    body.innerHTML = `
      <form id="form-edit-sk">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:16px;">
          <div style="font-size:11px; text-transform:uppercase; color:#64748b; font-weight:700;">Nomor Surat Resmi Terkunci:</div>
          <div style="font-family:monospace; font-size:16px; font-weight:800; color:var(--primary); margin-top:2px;">
            ${s.no_surat_keluar}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Bidang Pembuat Naskah</label>
            <select id="edit-sk-bidang" class="form-control">
              <option value="Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian" ${s.bidang_pembuat && (s.bidang_pembuat.includes('Pengadaan') || s.bidang_pembuat.includes('PPK')) ? 'selected' : ''}>Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian</option>
              <option value="Bidang Mutasi, Kepangkatan dan Pengembangan Karir" ${s.bidang_pembuat && s.bidang_pembuat.includes('Mutasi') ? 'selected' : ''}>Bidang Mutasi, Kepangkatan dan Pengembangan Karir</option>
              <option value="Bidang Pengembangan Sumber Daya Aparatur" ${s.bidang_pembuat && (s.bidang_pembuat.includes('Pengembangan') || s.bidang_pembuat.includes('Diklat')) ? 'selected' : ''}>Bidang Pengembangan Sumber Daya Aparatur</option>
              <option value="Sekretariat / Subbagian Umum dan Kepegawaian" ${s.bidang_pembuat && s.bidang_pembuat.includes('Umum') ? 'selected' : ''}>Sekretariat / Subbagian Umum dan Kepegawaian</option>
              <option value="Subbagian Perencanaan dan Keuangan" ${s.bidang_pembuat && s.bidang_pembuat.includes('Perencanaan') ? 'selected' : ''}>Subbagian Perencanaan dan Keuangan</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tanggal Surat Keluar <span class="required">*</span></label>
            <input type="date" id="edit-sk-tgl" class="form-control" value="${s.tgl_surat || new Date().toISOString().split('T')[0]}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Perihal Surat <span class="required">*</span></label>
          <div class="autosuggest-wrapper">
            <textarea id="edit-sk-perihal" class="form-control" rows="2" required>${s.perihal}</textarea>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Sifat Surat</label>
            <select id="edit-sk-sifat" class="form-control">
              <option value="Biasa" ${s.sifat_surat === 'Biasa' ? 'selected' : ''}>Biasa</option>
              <option value="Segera" ${s.sifat_surat === 'Segera' ? 'selected' : ''}>Segera</option>
              <option value="Penting" ${s.sifat_surat === 'Penting' ? 'selected' : ''}>Penting</option>
              <option value="Rahasia" ${s.sifat_surat === 'Rahasia' ? 'selected' : ''}>Rahasia</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Pejabat Penandatangan</label>
            <select id="edit-sk-penandatangan" class="form-control">
              <option value="PARHA ARIEF, S.AP" ${(!s.penandatangan || s.penandatangan.includes('PARHA') || s.penandatangan.includes('Kepala BKPSDM')) && !s.penandatangan.includes('Bupati') && !s.penandatangan.includes('Sekretaris') ? 'selected' : ''}>Kepala BKPSDM Kab. Luwu Timur (PARHA ARIEF, S.AP)</option>
              <option value="Bupati Luwu Timur cq. Kepala BKPSDM" ${s.penandatangan && s.penandatangan.includes('Bupati') ? 'selected' : ''}>Bupati Luwu Timur cq. Kepala BKPSDM</option>
              <option value="Sekretaris BKPSDM an. Kepala Badan" ${s.penandatangan && s.penandatangan.includes('Sekretaris') ? 'selected' : ''}>Sekretaris BKPSDM an. Kepala Badan</option>
            </select>
          </div>
        </div>
      </form>
    `;

    footer.innerHTML = `
      <button class="btn btn-outline" onclick="App.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="SuratKeluarModule.submitEdit(${s.id})">Simpan Perubahan</button>
    `;

    App.openModal();
  },

  async submitEdit(id) {
    const bidang = document.getElementById('edit-sk-bidang')?.value;
    const perihal = document.getElementById('edit-sk-perihal')?.value.trim();
    const tgl = document.getElementById('edit-sk-tgl')?.value;
    const sifat = document.getElementById('edit-sk-sifat')?.value;
    const penandatangan = document.getElementById('edit-sk-penandatangan')?.value;

    if (!perihal) {
      App.showToast('Perihal surat wajib diisi', 'warning');
      return;
    }

    const updated = await Store.updateSuratKeluar(id, {
      bidang_pembuat: bidang,
      perihal: perihal,
      tgl_surat: tgl,
      sifat_surat: sifat,
      penandatangan: penandatangan
    });

    if (updated) {
      App.closeModal();
      App.showToast('Data surat keluar berhasil diperbarui', 'success');
      this.render();
      DashboardModule.render();
    }
  },

  async confirmDelete(id) {
    const s = Store.state.surat_keluar.find(item => item.id === id);
    if (!s) return;

    if (confirm(`Yakin ingin menghapus surat keluar ${s.no_agenda} (${s.no_surat_keluar})?`)) {
      const ok = await Store.deleteSuratKeluar(id);
      if (ok) {
        App.showToast(`Surat keluar ${s.no_agenda} berhasil dihapus`, 'success');
        this.render();
        DashboardModule.render();
      }
    }
  }
};
