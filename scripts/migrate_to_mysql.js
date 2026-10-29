// scripts/migrate_to_mysql.js
// Script migrasi data dari JSON (current_state.json) ke MySQL
// Jalankan SEKALI saja: node scripts/migrate_to_mysql.js
// Yusri Mahendra (NIM: IK2311011) - BKPSDM Luwu Timur 2026

const fs   = require('fs');
const path = require('path');
const db   = require('../config/database');

const STATE_FILE   = path.join(__dirname, '..', 'data', 'current_state.json');
const INITIAL_FILE = path.join(__dirname, '..', 'data', 'initial_state.json');

async function migrate() {
  console.log('=================================================');
  console.log(' MIGRASI DATA: JSON File → MySQL Database');
  console.log(' Sistem Informasi Persuratan BKPSDM Luwu Timur');
  console.log('=================================================\n');

  // Load data sumber
  let data = null;
  if (fs.existsSync(STATE_FILE)) {
    data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    console.log('[OK] Membaca data dari: data/current_state.json');
  } else if (fs.existsSync(INITIAL_FILE)) {
    data = JSON.parse(fs.readFileSync(INITIAL_FILE, 'utf8'));
    console.log('[OK] Membaca data dari: data/initial_state.json');
  } else {
    console.error('[ERROR] File data tidak ditemukan!');
    process.exit(1);
  }

  // Test koneksi
  const ok = await db.testConnection();
  if (!ok) {
    console.error('[ERROR] Tidak dapat konek ke MySQL!');
    console.error('[INFO]  1. Pastikan MySQL/XAMPP berjalan');
    console.error('[INFO]  2. Jalankan schema dulu: mysql -u root < database/schema.sql');
    console.error('[INFO]  3. Sesuaikan config/database.js');
    process.exit(1);
  }

  try {
    console.log('\n[1/5] Menghapus data lama (jika ada)...');
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE surat_tugas_personil');
    await db.query('TRUNCATE TABLE disposisi');
    await db.query('TRUNCATE TABLE surat_masuk');
    await db.query('TRUNCATE TABLE surat_keluar');
    await db.query('TRUNCATE TABLE surat_tugas');
    await db.query('DELETE FROM pegawai WHERE id > 0');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('    → Tabel dikosongkan ✓');

    // === MIGRASIKAN PEGAWAI ===
    console.log('\n[2/5] Migrasi data Pegawai...');
    const pegawaiMap = {}; // nip → id MySQL (untuk relasi disposisi)
    for (const p of (data.pegawai || [])) {
      const [result] = await db.getPool().execute(
        'INSERT INTO pegawai (nip,nama,pangkat,jabatan,role,unit,password) VALUES (?,?,?,?,?,?,?)',
        [p.nip, p.nama,
         p.pangkat || 'Penata Muda (III/a)',
         p.jabatan || 'Staf Pelaksana',
         p.role    || 'pegawai',
         p.unit    || 'Subbag Umum & Kepegawaian',
         p.password|| '123456']
      );
      pegawaiMap[p.id] = result.insertId;
    }
    console.log(`    → ${data.pegawai?.length || 0} pegawai dimigrasikan ✓`);

    // === MIGRASIKAN SURAT MASUK ===
    console.log('\n[3/5] Migrasi data Surat Masuk...');
    const smMap = {}; // id lama → id MySQL baru
    for (const sm of (data.surat_masuk || [])) {
      const tglSurat   = sm.tgl_surat   || new Date().toISOString().split('T')[0];
      const tglDiterima= sm.tgl_diterima|| tglSurat;
      const [result] = await db.getPool().execute(`
        INSERT INTO surat_masuk
          (no_agenda,no_surat_pengirim,instansi_pengirim,kode_internal,
           nama_klasifikasi_internal,perihal,tgl_surat,tgl_diterima,
           sifat_surat,lampiran,status_disposisi,file_name)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [sm.no_agenda,
         sm.no_surat_pengirim || '',
         sm.instansi_pengirim || '',
         sm.kode_internal     || '800',
         sm.nama_klasifikasi_internal || 'Kepegawaian',
         sm.perihal           || '',
         tglSurat, tglDiterima,
         sm.sifat_surat       || 'Biasa',
         sm.lampiran          || '1 Berkas',
         sm.status_disposisi  || 'Menunggu Disposisi',
         sm.file_name         || 'surat_masuk.pdf']
      );
      smMap[sm.id] = result.insertId;
    }
    console.log(`    → ${data.surat_masuk?.length || 0} surat masuk dimigrasikan ✓`);

    // === MIGRASIKAN DISPOSISI ===
    console.log('\n[4/5] Migrasi data Disposisi...');
    let dispCount = 0;
    for (const d of (data.disposisi || [])) {
      const smMysqlId  = smMap[d.id_surat_masuk];
      if (!smMysqlId) continue; // skip jika surat masuk tidak ditemukan
      const tujuanId   = pegawaiMap[d.tujuan_user_id] || null;
      const instruksi  = Array.isArray(d.instruksi)
        ? JSON.stringify(d.instruksi)
        : JSON.stringify([d.instruksi].filter(Boolean));
      const batasWaktu = d.batas_waktu && d.batas_waktu.trim() ? d.batas_waktu : null;
      await db.getPool().execute(`
        INSERT INTO disposisi
          (id_surat_masuk,dari_user,tujuan_user_id,tujuan_nama,sifat,
           instruksi,catatan,batas_waktu,status_tindak_lanjut,tindak_lanjut_note,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        [smMysqlId,
         d.dari_user   || 'Kepala BKPSDM',
         tujuanId,
         d.tujuan_nama || '',
         d.sifat       || 'Biasa',
         instruksi,
         d.catatan     || '',
         batasWaktu,
         d.status_tindak_lanjut || 'Diproses',
         d.tindak_lanjut_note  || '',
         d.created_at  || new Date().toISOString().replace('T',' ').substring(0,19)]
      );
      dispCount++;
    }
    console.log(`    → ${dispCount} disposisi dimigrasikan ✓`);

    // === MIGRASIKAN SURAT KELUAR ===
    console.log('\n[5/5] Migrasi Surat Keluar & Surat Tugas...');
    for (const sk of (data.surat_keluar || [])) {
      await db.getPool().execute(`
        INSERT INTO surat_keluar
          (no_agenda,bidang_pembuat,kode_klasifikasi,nama_klasifikasi,no_surat_keluar,
           tujuan_surat,perihal,tgl_surat,sifat_surat,penandatangan,
           metode_dokumen,lokasi_arsip_fisik,is_surat_balasan,file_name)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [sk.no_agenda,
         sk.bidang_pembuat    || '',
         sk.kode_klasifikasi  || '000',
         sk.nama_klasifikasi  || 'Umum',
         sk.no_surat_keluar   || '',
         sk.tujuan_surat      || '',
         sk.perihal           || '',
         sk.tgl_surat         || new Date().toISOString().split('T')[0],
         sk.sifat_surat       || 'Biasa',
         sk.penandatangan     || 'Kepala BKPSDM',
         sk.metode_dokumen    || 'Fisik Manual',
         sk.lokasi_arsip_fisik|| 'Lemari Arsip Subbag Umum',
         sk.is_surat_balasan  ? 1 : 0,
         sk.file_name         || 'surat_keluar.pdf']
      );
    }
    console.log(`    → ${data.surat_keluar?.length || 0} surat keluar dimigrasikan ✓`);

    // === SURAT TUGAS ===
    for (const st of (data.surat_tugas || [])) {
      const [stResult] = await db.getPool().execute(`
        INSERT INTO surat_tugas
          (no_surat_tugas,bidang_pengusul,kode_klasifikasi,nama_klasifikasi,
           dasar,maksud_tugas,tempat_tujuan,tgl_berangkat,tgl_kembali,
           lama_hari,pembebanan_anggaran,pejabat_penandatangan,jabatan_penandatangan)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [st.no_surat_tugas,
         st.bidang_pengusul       || '',
         st.kode_klasifikasi      || '800.1.11.1',
         st.nama_klasifikasi      || 'Surat Perintah Dinas/Surat Tugas',
         st.dasar                 || '',
         st.maksud_tugas          || '',
         st.tempat_tujuan         || '',
         st.tgl_berangkat         || new Date().toISOString().split('T')[0],
         st.tgl_kembali           || new Date().toISOString().split('T')[0],
         parseInt(st.lama_hari    || '1', 10),
         st.pembebanan_anggaran   || '',
         st.pejabat_penandatangan || 'Kepala BKPSDM',
         st.jabatan_penandatangan || 'Kepala BKPSDM Kabupaten Luwu Timur']
      );
      // Personil
      const personil = Array.isArray(st.personil) ? st.personil : [];
      for (let i = 0; i < personil.length; i++) {
        const p = personil[i];
        await db.getPool().execute(
          'INSERT INTO surat_tugas_personil (id_surat_tugas,nip,nama,pangkat,jabatan,urutan) VALUES (?,?,?,?,?,?)',
          [stResult.insertId, p.nip||'', p.nama||'', p.pangkat||'', p.jabatan||'', i+1]
        );
      }
    }
    console.log(`    → ${data.surat_tugas?.length || 0} surat tugas dimigrasikan ✓`);

    // VERIFIKASI
    const stats = await db.queryOne('SELECT * FROM vw_dashboard_stats');
    console.log('\n=================================================');
    console.log(' ✅ MIGRASI BERHASIL!');
    console.log('=================================================');
    console.log(' Ringkasan data di MySQL:');
    console.log('   Pegawai      :', stats.total_pegawai);
    console.log('   Surat Masuk  :', stats.total_surat_masuk);
    console.log('   Disposisi    :', stats.total_disposisi);
    console.log('   Surat Keluar :', stats.total_surat_keluar);
    console.log('   Surat Tugas  :', stats.total_surat_tugas);
    console.log('=================================================');
    console.log('\n Langkah selanjutnya:');
    console.log('   node server_mysql.js   ← Jalankan server MySQL');
    console.log('=================================================\n');

  } catch (err) {
    console.error('\n[ERROR] Migrasi gagal:', err.message);
    console.error(err);
  } finally {
    process.exit(0);
  }
}

migrate();
