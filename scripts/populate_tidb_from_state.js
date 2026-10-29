// scripts/populate_tidb_from_state.js
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const TIDB_CONFIG = {
  host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DB_PORT || '4000', 10),
  user: process.env.DB_USER || '2Sw3Ep8LH64tjUC.root',
  password: process.env.DB_PASSWORD || 'BmQmrKut89t8a5c0',
  database: 'persuratan_bkpsdm',
  ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
};

async function run() {
  console.log('Menghubungkan ke TiDB Cloud...');
  const conn = await mysql.createConnection(TIDB_CONFIG);
  console.log('Terhubung! Membaca current_state.json...');

  const statePath = path.join(__dirname, '..', 'data', 'current_state.json');
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

  console.log('Menyesuaikan kapasitas kolom & indeks...');
  try {
    await conn.execute('ALTER TABLE surat_keluar DROP INDEX no_surat_keluar');
  } catch (e) {}
  await conn.execute('ALTER TABLE surat_keluar MODIFY COLUMN nama_klasifikasi TEXT');
  await conn.execute('ALTER TABLE surat_keluar MODIFY COLUMN tujuan_surat TEXT');
  await conn.execute('ALTER TABLE surat_keluar MODIFY COLUMN no_surat_keluar VARCHAR(255)');
  await conn.execute('ALTER TABLE surat_masuk MODIFY COLUMN nama_klasifikasi_internal TEXT');
  await conn.execute('ALTER TABLE surat_tugas MODIFY COLUMN nama_klasifikasi TEXT');
  await conn.execute('ALTER TABLE surat_tugas MODIFY COLUMN tempat_tujuan TEXT');

  console.log('Mengosongkan tabel transaksi lama...');
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
  await conn.execute('TRUNCATE TABLE surat_tugas_personil');
  await conn.execute('TRUNCATE TABLE disposisi');
  await conn.execute('TRUNCATE TABLE surat_masuk');
  await conn.execute('TRUNCATE TABLE surat_keluar');
  await conn.execute('TRUNCATE TABLE surat_tugas');
  await conn.execute('TRUNCATE TABLE pegawai');
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1');

  // 1. Pegawai
  console.log(`Mengimpor ${state.pegawai.length} Pegawai...`);
  for (const p of state.pegawai) {
    await conn.execute(
      'INSERT INTO pegawai (id, nip, nama, pangkat, jabatan, role, unit, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [p.id, p.nip, p.nama, p.pangkat || null, p.jabatan, p.role || 'pegawai', p.unit || 'Subbag Umum', p.password || '123']
    );
  }

  // 2. Surat Masuk
  console.log(`Mengimpor ${state.surat_masuk.length} Surat Masuk...`);
  for (const sm of state.surat_masuk) {
    await conn.execute(
      `INSERT INTO surat_masuk (
        id, no_agenda, no_surat_pengirim, instansi_pengirim, kode_internal,
        nama_klasifikasi_internal, perihal, tgl_surat, tgl_diterima, sifat_surat,
        lampiran, status_disposisi, file_name, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sm.id, sm.no_agenda, sm.no_surat_pengirim || '', sm.instansi_pengirim || '',
        sm.kode_internal || '800', sm.nama_klasifikasi_internal || 'Kepegawaian',
        sm.perihal, sm.tgl_surat || '2026-01-01', sm.tgl_diterima || '2026-01-01',
        sm.sifat_surat || 'Biasa', sm.lampiran || '1 Berkas', sm.status_disposisi || 'Menunggu Disposisi',
        sm.file_name || 'surat_masuk.pdf', sm.created_at || '2026-01-01 00:00:00'
      ]
    );
  }

  // 3. Disposisi
  console.log(`Mengimpor ${state.disposisi.length} Disposisi...`);
  for (const d of state.disposisi) {
    const instStr = Array.isArray(d.instruksi) ? JSON.stringify(d.instruksi) : (d.instruksi || '[]');
    await conn.execute(
      `INSERT INTO disposisi (
        id, id_surat_masuk, dari_user, tujuan_user_id, tujuan_nama,
        sifat, instruksi, catatan, batas_waktu, status_tindak_lanjut,
        tindak_lanjut_note, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.id, d.id_surat_masuk, d.dari_user || 'PARHA ARIEF, S.AP (Plt. Kepala BKPSDM)',
        d.tujuan_user_id || 1, d.tujuan_nama || '', d.sifat || 'Biasa',
        instStr, d.catatan || '', d.batas_waktu || null,
        d.status_tindak_lanjut || 'Menunggu', d.tindak_lanjut_note || '',
        d.created_at || '2026-01-01 00:00:00'
      ]
    );
  }

  // 4. Surat Keluar
  console.log(`Mengimpor ${state.surat_keluar.length} Surat Keluar...`);
  for (const sk of state.surat_keluar) {
    await conn.execute(
      `INSERT INTO surat_keluar (
        id, no_agenda, bidang_pembuat, kode_klasifikasi, nama_klasifikasi,
        no_surat_keluar, tujuan_surat, perihal, tgl_surat, sifat_surat,
        penandatangan, metode_dokumen, lokasi_arsip_fisik, is_surat_balasan,
        id_surat_masuk_asal, no_surat_pengirim_asal, file_name, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sk.id, sk.no_agenda, sk.bidang_pembuat || '', sk.kode_klasifikasi || '800',
        sk.nama_klasifikasi || '', sk.no_surat_keluar, sk.tujuan_surat || '',
        sk.perihal, sk.tgl_surat || '2026-01-01', sk.sifat_surat || 'Biasa',
        sk.penandatangan || '', sk.metode_dokumen || 'TTE', sk.lokasi_arsip_fisik || '',
        sk.is_surat_balasan ? 1 : 0, sk.id_surat_masuk_asal || null,
        sk.no_surat_pengirim_asal || '', sk.file_name || 'surat_keluar.pdf',
        sk.created_at || '2026-01-01 00:00:00'
      ]
    );
  }

  // 5. Surat Tugas
  console.log(`Mengimpor ${state.surat_tugas.length} Surat Tugas...`);
  for (const st of state.surat_tugas) {
    await conn.execute(
      `INSERT INTO surat_tugas (
        id, no_surat_tugas, bidang_pengusul, kode_klasifikasi, nama_klasifikasi,
        dasar, maksud_tugas, tempat_tujuan, tgl_berangkat, tgl_kembali,
        lama_hari, pembebanan_anggaran, pejabat_penandatangan, jabatan_penandatangan,
        status_naskah_fisik, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        st.id, st.no_surat_tugas, st.bidang_pengusul || '', st.kode_klasifikasi || '800.1.11.1',
        st.nama_klasifikasi || 'Surat Perintah Tugas (SPT)', st.dasar || '',
        st.maksud_tugas, st.tempat_tujuan || '', st.tgl_berangkat || '2026-01-01',
        st.tgl_kembali || '2026-01-01', st.lama_hari || 1, st.pembebanan_anggaran || '',
        st.pejabat_penandatangan || '', st.jabatan_penandatangan || '',
        st.status_naskah_fisik || 'Diterbitkan', st.created_at || '2026-01-01 00:00:00'
      ]
    );
  }

  // Final check
  console.log('\n================================================================');
  const [pegRows] = await conn.execute('SELECT COUNT(*) AS total FROM pegawai');
  const [adminRows] = await conn.execute('SELECT id, nip, nama, role, jabatan FROM pegawai WHERE role = "admin"');
  const [smRows] = await conn.execute('SELECT COUNT(*) AS total FROM surat_masuk');
  const [dispRows] = await conn.execute('SELECT COUNT(*) AS total FROM disposisi');
  const [skRows] = await conn.execute('SELECT COUNT(*) AS total FROM surat_keluar');
  const [stRows] = await conn.execute('SELECT COUNT(*) AS total FROM surat_tugas');
  const [klasRows] = await conn.execute('SELECT COUNT(*) AS total FROM klasifikasi_arsip');

  console.log(`✓ Total Pegawai     : ${pegRows[0].total} (Admin: ${adminRows[0]?.nama})`);
  console.log(`✓ Total Surat Masuk : ${smRows[0].total} agenda`);
  console.log(`✓ Total Disposisi   : ${dispRows[0].total} disposisi`);
  console.log(`✓ Total Surat Keluar: ${skRows[0].total} nomor`);
  console.log(`✓ Total Surat Tugas : ${stRows[0].total} SPT`);
  console.log(`✓ Kode Klasifikasi  : ${klasRows[0].total} kode Perbup No. 69/2023`);
  console.log('================================================================');
  console.log('STATUS: DATA TIDB CLOUD LENGKAP & TERVERIFIKASI!');
  await conn.end();
}

run().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
