// config/database.js
// Konfigurasi Koneksi MySQL - Sistem Informasi Persuratan BKPSDM Luwu Timur
// Yusri Mahendra (NIM: IK2311011) - Universitas Mega Buana Palopo 2026

const mysql = require('mysql2/promise');

// ============================================================
// KONFIGURASI DATABASE — Sesuaikan dengan server Anda
// ============================================================
const DB_CONFIG = {
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306', 10),
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',           // Ganti dengan password MySQL Anda
  database: process.env.DB_NAME     || 'persuratan_bkpsdm',
  charset:  'utf8mb4',
  timezone: '+08:00',                                // WIT (Waktu Indonesia Timur)
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  ssl: (process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1'))
    ? { minVersion: 'TLSv1.2', rejectUnauthorized: false }
    : undefined
};

// Connection pool (lebih efisien untuk multi-user)
let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(DB_CONFIG);
  }
  return pool;
}

// Test koneksi
async function testConnection() {
  try {
    const conn = await getPool().getConnection();
    console.log('[MySQL] Koneksi berhasil ke database:', DB_CONFIG.database, 'di', DB_CONFIG.host);
    conn.release();
    return true;
  } catch (err) {
    console.error('[MySQL ERROR] Gagal koneksi ke database:', err.message);
    return false;
  }
}

// Helper query
async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

// Helper untuk satu baris
async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

module.exports = { getPool, testConnection, query, queryOne, DB_CONFIG };
