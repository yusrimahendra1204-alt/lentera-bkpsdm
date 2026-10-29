// index.js — Unified Smart Server Runner
// Sistem Informasi Persuratan BKPSDM Kabupaten Luwu Timur
// Mendukung mode Standalone File System & mode Cloud MySQL Database

const isCloudDb = Boolean(process.env.DB_HOST && process.env.DB_HOST.trim() !== '');

if (isCloudDb) {
  console.log('================================================================');
  console.log('[RUNNER] Terdeteksi konfigurasi DB_HOST di Environment Variables');
  console.log(`[RUNNER] Menjalankan server dalam mode MySQL Cloud (${process.env.DB_HOST})`);
  console.log('================================================================');
  require('./server_mysql.js');
} else {
  console.log('================================================================');
  console.log('[RUNNER] Menjalankan server dalam mode Standalone JSON Storage');
  console.log('================================================================');
  require('./server.js');
}

