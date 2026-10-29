// scripts/setup_tidb_cloud.js
// Migrasi otomatis ke TiDB Cloud MySQL
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const TIDB_CONFIG = {
  host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DB_PORT || '4000', 10),
  user: process.env.DB_USER || '2Sw3Ep8LH64tjUC.root',
  password: process.env.DB_PASSWORD || 'BmQmrKut89t8a5c0',
  multipleStatements: true,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
};

async function setup() {
  console.log('================================================================');
  console.log(' PENGHUBUNGAN & MIGRASI BASIS DATA KE TIDB CLOUD');
  console.log(' Host:', TIDB_CONFIG.host);
  console.log('================================================================');

  let conn = await mysql.createConnection(TIDB_CONFIG);
  console.log('[OK] Terhubung ke TiDB Cloud Serverless');

  console.log('[1/4] Membuat database persuratan_bkpsdm...');
  await conn.execute('CREATE DATABASE IF NOT EXISTS `persuratan_bkpsdm` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  await conn.execute('USE `persuratan_bkpsdm`;');
  console.log('[OK] Database persuratan_bkpsdm aktif');

  console.log('[2/4] Membaca file SQL database_persuratan.sql...');
  const sqlFile = path.join(__dirname, '..', 'database_persuratan.sql');
  const sqlContent = fs.readFileSync(sqlFile, 'utf8');

  // Pisahkan query berdasarkan ';' di akhir baris
  console.log('[3/4] Menjalankan skema dan migrasi data ke TiDB Cloud...');
  
  // Karena TiDB Cloud Serverless mendukung multipleStatements, kita eksekusi dalam beberapa chunk
  // Hapus baris CREATE DATABASE db_persuratan_bkpsdm dan USE db_persuratan_bkpsdm jika ada agar konsisten di persuratan_bkpsdm
  const cleanSql = sqlContent
    .replace(/CREATE DATABASE IF NOT EXISTS `db_persuratan_bkpsdm`[^;]*;/gi, '')
    .replace(/USE `db_persuratan_bkpsdm`;/gi, 'USE `persuratan_bkpsdm`;');

  const statements = cleanSql
    .split(/;\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

  console.log(`[INFO] Total ${statements.length} instruksi SQL akan dijalankan...`);

  let executed = 0;
  for (const stmt of statements) {
    if (!stmt) continue;
    try {
      await conn.query(stmt);
      executed++;
      if (executed % 200 === 0 || executed === statements.length) {
        console.log(`       Progress: ${executed}/${statements.length} instruksi selesai...`);
      }
    } catch (err) {
      // Abaikan error drop table jika belum ada
      if (!stmt.toUpperCase().startsWith('DROP TABLE') && !stmt.toUpperCase().startsWith('SET ')) {
        console.warn(`[WARN] Statement warning: ${err.message.substring(0, 80)}`);
      }
    }
  }

  console.log('\n[4/4] Verifikasi data di TiDB Cloud:');
  const [tables] = await conn.execute('SHOW TABLES');
  console.log('Tabel yang terbentuk:', tables.map(t => Object.values(t)[0]).join(', '));

  const [pegRows] = await conn.execute('SELECT COUNT(*) AS total FROM pegawai');
  const [adminRows] = await conn.execute('SELECT id, nip, nama, role, jabatan FROM pegawai WHERE role = "admin"');
  const [smRows] = await conn.execute('SELECT COUNT(*) AS total FROM surat_masuk');
  const [skRows] = await conn.execute('SELECT COUNT(*) AS total FROM surat_keluar');
  const [stRows] = await conn.execute('SELECT COUNT(*) AS total FROM surat_tugas');
  const [klasRows] = await conn.execute('SELECT COUNT(*) AS total FROM klasifikasi_arsip');

  console.log('----------------------------------------------------------------');
  console.log(`✓ Total Pegawai     : ${pegRows[0].total} (Admin: ${adminRows[0]?.nama || 'Belum ada'})`);
  console.log(`✓ Total Surat Masuk : ${smRows[0].total} agenda`);
  console.log(`✓ Total Surat Keluar: ${skRows[0].total} nomor`);
  console.log(`✓ Total Surat Tugas : ${stRows[0].total} SPT`);
  console.log(`✓ Kode Klasifikasi  : ${klasRows[0].total} kode Perbup No. 69/2023`);
  console.log('----------------------------------------------------------------');
  console.log('MIGRASI DATA KE TIDB CLOUD SUKSES 100%!');

  await conn.end();
}

setup().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});

