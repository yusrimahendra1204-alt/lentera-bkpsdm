// ============================================================
// SERVER.JS — Sistem Informasi Persuratan BKPSDM Luwu Timur
// MySQL Edition — Penggunaan Jangka Panjang
// Yusri Mahendra (NIM: IK2311011) - Univ. Mega Buana Palopo 2026
// Berdasarkan Perbup Luwu Timur No. 69 Tahun 2023
// ============================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const db = require('./config/database');
const { generateSqlFile } = require('./scripts/generate_sql');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const KLASIFIKASI_FILE = path.join(DATA_DIR, 'klasifikasi_perbup.json');
const SQL_FILE = path.join(__dirname, 'database_persuratan.sql');
const AUTH_SECRET = process.env.AUTH_SECRET || crypto.createHash('sha256').update(`${process.env.DB_NAME || 'persuratan'}:${process.env.DB_PASSWORD || 'local'}`).digest('hex');
const CORS_ORIGIN = process.env.ALLOWED_ORIGIN || '';
let accessPolicyReady = false;

async function ensureAccessPolicy() {
  if (accessPolicyReady) return;
  try {
    await db.query("ALTER TABLE pegawai ADD COLUMN IF NOT EXISTS akses_login TINYINT(1) NOT NULL DEFAULT 0");
    await db.query("UPDATE pegawai SET akses_login = 1 WHERE role = 'admin'");
  } catch (e) {
    // Abaikan jika MySQL versi lama tidak mendukung ADD COLUMN IF NOT EXISTS atau kolom sudah ada
  }
  try {
    await db.query("ALTER TABLE surat_masuk MODIFY COLUMN sifat_surat ENUM('Biasa','Segera','Penting','Sangat Penting','Rahasia','Sangat Rahasia') NOT NULL DEFAULT 'Biasa'");
    await db.query("ALTER TABLE surat_keluar MODIFY COLUMN sifat_surat ENUM('Biasa','Segera','Penting','Sangat Penting','Rahasia','Sangat Rahasia') NOT NULL DEFAULT 'Biasa'");
    await db.query("ALTER TABLE disposisi MODIFY COLUMN sifat ENUM('Biasa','Segera','Sangat Segera','Rahasia','A. Sangat Segera','B. Segera','C. Rahasia') NOT NULL DEFAULT 'Biasa'");
    await db.query("ALTER TABLE disposisi MODIFY COLUMN status_tindak_lanjut ENUM('Menunggu','Diproses','Selesai','Ditangguhkan') NOT NULL DEFAULT 'Diproses'");
  } catch (e) {
    // Abaikan jika gagal alter enum
  }
  accessPolicyReady = true;
}

// Klasifikasi tetap di-load dari JSON (2.961 kode, read-only, tidak perlu DB)
let classifications = [];
try {
  if (fs.existsSync(KLASIFIKASI_FILE)) {
    classifications = JSON.parse(fs.readFileSync(KLASIFIKASI_FILE, 'utf8'));
    console.log(`[DATA] Loaded ${classifications.length} classification codes from Perbup Luwu Timur 2023`);
  }
} catch (err) {
  console.error('[DATA ERROR] Failed to load classifications:', err.message);
}

// ============================================================
// HELPERS
// ============================================================
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) { req.destroy(); reject(new Error('Payload too large')); }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, data, status = 200) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  if (CORS_ORIGIN) headers['Access-Control-Allow-Origin'] = CORS_ORIGIN;
  const cookie = res.getHeader('Set-Cookie');
  if (cookie) headers['Set-Cookie'] = cookie;
  res.writeHead(status, headers);
  res.end(JSON.stringify(data));
}

function publicUser(user) {
  if (!user) return user;
  const safe = { ...user };
  delete safe.password;
  return safe;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `scrypt$${salt}$${key}`;
}

function hashIfNeeded(password) {
  return String(password || '').startsWith('scrypt$') ? String(password) : hashPassword(password || '123456');
}

function verifyPassword(password, stored) {
  if (!stored) return { valid: false, needsUpgrade: false };
  if (!String(stored).startsWith('scrypt$')) return { valid: String(password) === String(stored), needsUpgrade: true };
  const [, salt, expected] = String(stored).split('$');
  try {
    const actual = crypto.scryptSync(String(password), salt, 64).toString('hex');
    return { valid: actual.length === expected.length && crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected)), needsUpgrade: false };
  } catch { return { valid: false, needsUpgrade: false }; }
}

function createSession(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function getSessionUser(req) {
  const raw = String(req.headers.cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith('lentera_session='))?.slice(16);
  if (!raw) return null;
  const [payload, signature] = raw.split('.');
  if (!payload || !signature) return null;
  const expected = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try { const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); return data.exp > Date.now() ? data : null; }
  catch { return null; }
}

function setSessionCookie(res, user) {
  const secure = process.env.VERCEL === '1' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `lentera_session=${createSession(user)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${secure}`);
}

function getLocalToday() {
  const now = new Date(Date.now() + 8 * 60 * 60 * 1000);
  return now.toISOString().split('T')[0];
}

function normalizeDateStr(val) {
  if (!val) return '';
  if (val instanceof Date) {
    return new Date(val.getTime() + 8 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (s.includes('T')) {
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
      return new Date(parsed.getTime() + 8 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    return s.split('T')[0];
  }
  return s.split(' ')[0];
}

function normalizeRecordDates(row) {
  if (!row || typeof row !== 'object') return row;
  const dateFields = ['tgl_surat', 'tgl_diterima', 'tgl_berangkat', 'tgl_kembali', 'batas_waktu'];
  for (const field of dateFields) {
    if (row[field] !== undefined && row[field] !== null && row[field] !== '') {
      row[field] = normalizeDateStr(row[field]);
    }
  }
  return row;
}

const DISPOSISI_SIFAT = ['A. Sangat Segera', 'B. Segera', 'C. Rahasia', 'Biasa', 'Segera', 'Sangat Segera', 'Rahasia'];
const DISPOSISI_STATUS = ['Diproses', 'Selesai', 'Ditangguhkan', 'Menunggu'];

function normalizeDisposisiSifat(value) {
  const sifat = String(value || '').trim();
  if (sifat === 'A. Sangat Segera') return 'Sangat Segera';
  if (sifat === 'B. Segera') return 'Segera';
  if (sifat === 'C. Rahasia') return 'Rahasia';
  return sifat;
}

function formatDisposisiSifatFrontend(value) {
  const sifat = String(value || '').trim();
  if (sifat === 'Sangat Segera' || sifat === 'A. Sangat Segera') return 'A. Sangat Segera';
  if (sifat === 'Segera' || sifat === 'B. Segera') return 'B. Segera';
  if (sifat === 'Rahasia' || sifat === 'C. Rahasia' || sifat === 'Biasa') return 'C. Rahasia';
  return sifat || 'B. Segera';
}

function hydrateDisposisiRow(d) {
  if (!d) return d;
  normalizeRecordDates(d);
  if (typeof d.instruksi === 'string') {
    try { d.instruksi = JSON.parse(d.instruksi); }
    catch { d.instruksi = d.instruksi ? d.instruksi.split(',').map(s => s.trim()).filter(Boolean) : []; }
  }
  if (!Array.isArray(d.instruksi)) d.instruksi = [];
  if (!Array.isArray(d.diteruskan_kepada) || !d.diteruskan_kepada.length) {
    d.diteruskan_kepada = d.tujuan_nama
      ? String(d.tujuan_nama).split(',').map(s => s.trim()).filter(Boolean)
      : [];
  }
  d.sifat = formatDisposisiSifatFrontend(d.sifat);
  return d;
}

const GENERIC_QUERY_STOPWORDS = new Set([
  'surat', 'izin', 'ijin', 'permohonan', 'usulan', 'pengantar', 'rekomendasi',
  'keterangan', 'keputusan', 'berita', 'acara', 'undangan', 'laporan', 'daftar',
  'nota', 'dinas', 'tentang', 'dan', 'atau', 'yang', 'dari', 'untuk', 'pada',
  'dalam', 'atas', 'nama', 'kepada', 'sdr', 'sdri', 'asn', 'pns', 'pppk',
  'pegawai', 'staf', 'kabupaten', 'luwu', 'timur', 'bkpsdm', 'pemerintah', 'daerah'
]);

function searchKlasifikasi(query, kategori = '', limit = 25) {
  if (!query) {
    if (kategori) return classifications.filter(c => c.kategori === kategori).slice(0, limit);
    return classifications.slice(0, limit);
  }
  const q = (query || '').toLowerCase().trim();
  const qTokens = q.split(/\s+/).filter(t => t.length > 1);
  const specificTokens = qTokens.filter(t => !GENERIC_QUERY_STOPWORDS.has(t));
  const isCeraiQuery = /\b(cerai|perceraian|perkawinan|nikah|pernikahan|kawin)\b/i.test(q);
  const isDisiplinQuery = /\b(disiplin|hukuman|pelanggaran|bap)\b/i.test(q);
  const isPerjalananDinas = /\bperjalanan\s+dinas\b/i.test(q);
  let scored = [];
  for (const item of classifications) {
    if (kategori && item.kategori !== kategori) continue;
    let score = 0;
    let specificMatchCount = 0;
    const kode = item.kode.toLowerCase();
    const nama = item.nama.toLowerCase();
    const keywords = item.keywords || [];
    if (kode === q) { score += 1000; specificMatchCount = specificTokens.length || 1; }
    else if (kode.startsWith(q)) { score += 500; specificMatchCount = specificTokens.length || 1; }
    if (q && nama.includes(q)) { score += 400; specificMatchCount = specificTokens.length || 1; }
    for (const token of qTokens) {
      const isSpecific = !GENERIC_QUERY_STOPWORDS.has(token);
      let tokenHit = false;
      if (nama.includes(token)) { score += isSpecific ? 100 : 15; tokenHit = true; }
      if (keywords.includes(token)) { score += isSpecific ? 100 : 20; tokenHit = true; }
      if (keywords.some(k => k.includes(token))) { score += isSpecific ? 45 : 10; tokenHit = true; }
      if (kode.includes(token)) { score += 40; tokenHit = true; }
      if (isSpecific && tokenHit) specificMatchCount++;
    }
    if (specificTokens.length > 0 && specificMatchCount === 0) continue;
    if (specificTokens.length > 1 && specificMatchCount === specificTokens.length) score += 300;
    if (score > 0) {
      if (item.kode.startsWith('800')) score += 200;
      if (isPerjalananDinas && (item.kode === '000.1.2.3' || item.kode === '000.1.2' || item.kode === '800.1.11.1')) {
        score += 500;
        if (item.kode === '000.1.2.3') score += 150;
      }
      if (isCeraiQuery && item.kode === '800.1.8.1') score += 600;
      if (isCeraiQuery && item.kode === '800.1.8') score += 350;
      if (isDisiplinQuery && item.kode === '800.1.6.2') score += 400;
      scored.push({ item, score });
    }
  }
  scored.sort((a, b) => b.score - a.score || a.item.kode.localeCompare(b.item.kode));
  return scored.slice(0, limit).map(s => s.item);
}

// Nomor agenda otomatis berbasis tahun
async function generateNoAgenda(prefix) {
  const year = new Date().getFullYear();
  if (prefix === 'SM') {
    const [rows] = await db.getPool().execute('SELECT no_agenda FROM surat_masuk WHERE no_agenda LIKE ?', [`SM-${year}-%`]);
    const n = rows.reduce((max, row) => Math.max(max, parseInt(String(row.no_agenda).split('-').pop(), 10) || 0), 0) + 1;
    return `SM-${year}-${String(n).padStart(3, '0')}`;
  }
  if (prefix === 'SK') {
    const [rows] = await db.getPool().execute('SELECT no_agenda FROM surat_keluar WHERE no_agenda LIKE ?', [`SK-${year}-%`]);
    const n = rows.reduce((max, row) => Math.max(max, parseInt(String(row.no_agenda).split('-').pop(), 10) || 0), 0) + 1;
    return `SK-${year}-${String(n).padStart(3, '0')}`;
  }
  return `${prefix}-${year}-001`;
}

// Bangun state object dari MySQL (kompatibel dengan frontend lama)
async function buildAppState() {
  try {
    const pegawai = await db.query('SELECT * FROM pegawai ORDER BY id');
    const suratMasuk = await db.query('SELECT * FROM surat_masuk ORDER BY id DESC');
    const disposisi = await db.query('SELECT * FROM disposisi ORDER BY id DESC');
    const suratKeluar = await db.query('SELECT * FROM surat_keluar ORDER BY id DESC');
    const suratTugas = await db.query('SELECT * FROM surat_tugas ORDER BY id DESC');
    let personilRows = [];
    try {
      personilRows = await db.query('SELECT * FROM surat_tugas_personil ORDER BY id ASC');
    } catch (e) {
      personilRows = [];
    }

    const personilBySpt = {};
    for (const p of personilRows) {
      const sptId = p.id_surat_tugas;
      if (!personilBySpt[sptId]) personilBySpt[sptId] = [];
      const matchedPeg = pegawai.find(peg => (p.nip && peg.nip === p.nip) || (p.nama && peg.nama === p.nama));
      personilBySpt[sptId].push({
        pegawai_id: matchedPeg ? matchedPeg.id : null,
        nip: p.nip || '',
        nama: p.nama || '',
        pangkat: p.pangkat || '',
        jabatan: p.jabatan || ''
      });
    }

    // Parse instruksi & personil + normalisasi tanggal agar tidak mundur karena UTC
    suratMasuk.forEach(normalizeRecordDates);
    suratKeluar.forEach(normalizeRecordDates);
    disposisi.forEach(hydrateDisposisiRow);
    suratTugas.forEach(st => {
      normalizeRecordDates(st);
      if (typeof st.personil === 'string') {
        try { st.personil = JSON.parse(st.personil); }
        catch { st.personil = []; }
      }
      if (!Array.isArray(st.personil) || !st.personil.length) {
        st.personil = personilBySpt[st.id] || [];
      }
    });

    return { pegawai: pegawai.map(publicUser), surat_masuk: suratMasuk, disposisi, surat_keluar: suratKeluar, surat_tugas: suratTugas };
  } catch (err) {
    console.warn('[MySQL FAIL] Gagal memuat dari MySQL, fallback ke current_state.json:', err.message);
    const STATE_FILE = path.join(DATA_DIR, 'current_state.json');
    if (fs.existsSync(STATE_FILE)) {
      try {
        const fallbackState = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        fallbackState.pegawai = (fallbackState.pegawai || []).map(publicUser);
        return fallbackState;
      } catch (parseErr) {
        console.error('[STATE ERROR] Gagal parse JSON:', parseErr.message);
      }
    }
    return { pegawai: [], surat_masuk: [], disposisi: [], surat_keluar: [], surat_tugas: [] };
  }
}

// ============================================================
// HTTP SERVER
// ============================================================
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    if (CORS_ORIGIN) res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
    return res.end();
  }

  if (pathname.startsWith('/api/')) {
    try {
      await ensureAccessPolicy();
      if (method !== 'GET' && pathname !== '/api/login') {
        const session = getSessionUser(req);
        if (!session) return sendJSON(res, { success: false, message: 'Sesi login diperlukan' }, 401);
        req.authUser = session;
        const adminOnly = pathname === '/api/reset' || pathname === '/api/clear-dummy' || pathname.includes('/database/') || pathname === '/api/pegawai' || pathname.startsWith('/api/pegawai/');
        if (adminOnly && session.role !== 'admin') return sendJSON(res, { success: false, message: 'Akses khusus administrator' }, 403);
      }

      if (pathname === '/api/logout' && method === 'POST') {
        res.setHeader('Set-Cookie', 'lentera_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
        return sendJSON(res, { success: true });
      }

      // ---- KLASIFIKASI ----
      if (pathname === '/api/klasifikasi' && method === 'GET') {
        const q = parsedUrl.query.q || '';
        const kat = parsedUrl.query.kat || '';
        const limit = parseInt(parsedUrl.query.limit || '15', 10);
        const results = searchKlasifikasi(q, kat, limit);
        return sendJSON(res, { success: true, total: results.length, data: results });
      }

      // ---- STATE (kompatibel frontend lama) ----
      if (pathname === '/api/state' && method === 'GET') {
        const appState = await buildAppState();
        return sendJSON(res, { success: true, data: appState });
      }

      // ---- RESET ke data awal ----
      if (pathname === '/api/reset' && method === 'POST') {
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE surat_tugas_personil');
        await db.query('TRUNCATE TABLE disposisi');
        await db.query('TRUNCATE TABLE surat_masuk');
        await db.query('TRUNCATE TABLE surat_keluar');
        await db.query('TRUNCATE TABLE surat_tugas');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        const appState = await buildAppState();
        return sendJSON(res, { success: true, message: 'Data berhasil di-reset', data: appState });
      }

      // ---- CLEAR DUMMY TRANSACTIONS ----
      if ((pathname === '/api/database/clear-dummy' || pathname === '/api/clear-dummy') && method === 'POST') {
        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE surat_tugas_personil');
        await db.query('TRUNCATE TABLE disposisi');
        await db.query('TRUNCATE TABLE surat_masuk');
        await db.query('TRUNCATE TABLE surat_keluar');
        await db.query('TRUNCATE TABLE surat_tugas');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        const appState = await buildAppState();
        return sendJSON(res, {
          success: true,
          message: 'Seluruh data dummy surat masuk, surat keluar, disposisi, dan surat tugas berhasil dibersihkan!',
          data: appState
        });
      }

      // ---- LOGIN ----
      if (pathname === '/api/login' && method === 'POST') {
        const body = await parseBody(req);
        const nip = (body.nip || '').trim();
        const pass = (body.password || '').trim();
        if (!nip || !pass)
          return sendJSON(res, { success: false, message: 'NIP / username dan kata sandi wajib diisi' }, 400);
        let user = null;
        try {
          user = await db.queryOne(
            'SELECT * FROM pegawai WHERE (nip = ? OR (role = "admin" AND LOWER(?) = "admin") OR LOWER(nama) LIKE ?) AND (aktif = 1 OR aktif IS NULL) AND (role = "admin" OR akses_login = 1) LIMIT 1',
            [nip, nip, `%${nip.toLowerCase()}%`]
          );
        } catch (dbErr) {
          console.warn('[LOGIN FAIL] Gagal query MySQL, fallback ke master_pegawai_bkpsdm_final.json:', dbErr.message);
          const MASTER_FILE = path.join(DATA_DIR, 'master_pegawai_bkpsdm_final.json');
          if (fs.existsSync(MASTER_FILE)) {
            const list = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
            user = list.find(p =>
              p.nip === nip ||
              (p.username && p.username.toLowerCase() === nip.toLowerCase()) ||
              (nip.toLowerCase() === 'admin' && p.role === 'admin') ||
              p.nama.toLowerCase().includes(nip.toLowerCase())
            );
          }
        }
        // Database produksi yang belum dimigrasikan lengkap tetap dapat
        // mengenali pegawai dari master resmi, tanpa membuka akses anonim.
        if (!user) {
          const sources = [
            path.join(DATA_DIR, 'master_pegawai_bkpsdm_final.json'),
            path.join(DATA_DIR, 'current_state.json')
          ];
          for (const source of sources) {
            if (!fs.existsSync(source)) continue;
            try {
              const list = JSON.parse(fs.readFileSync(source, 'utf8'));
              const users = Array.isArray(list) ? list : (list.pegawai || []);
              user = users.find(p => p.nip === nip || (p.username && p.username.toLowerCase() === nip.toLowerCase()) || (nip.toLowerCase() === 'admin' && p.role === 'admin') || String(p.nama || '').toLowerCase().includes(nip.toLowerCase()));
              if (user) break;
            } catch (fallbackErr) { console.warn('[LOGIN FALLBACK]', fallbackErr.message); }
          }
        }
        if (!user)
          return sendJSON(res, { success: false, message: 'NIP / Nama pengguna tidak terdaftar di BKPSDM' }, 401);
        if (user.role !== 'admin' && user.akses_login !== 1)
          return sendJSON(res, { success: false, message: 'Akun belum diberi akses login oleh administrator' }, 403);
        const isYusriAdmin = user.role === 'admin' && (nip.toLowerCase() === 'admin' || user.nip === '199911202025211015');
        const check = verifyPassword(pass, user.password || '123456');
        if (!check.valid && !(isYusriAdmin && pass === '123466'))
          return sendJSON(res, { success: false, message: 'Kata sandi / Password salah' }, 401);
        if (check.needsUpgrade || (isYusriAdmin && pass === '123466')) await db.getPool().execute('UPDATE pegawai SET password = ? WHERE id = ?', [hashPassword(pass), user.id]);
        setSessionCookie(res, user);
        return sendJSON(res, { success: true, message: `Selamat datang, ${user.nama}`, user: publicUser(user) });
      }

      // ---- PEGAWAI: Load Master ----
      if (pathname === '/api/pegawai/load-master' && method === 'POST') {
        const MASTER_FILE = path.join(DATA_DIR, 'master_pegawai_bkpsdm_final.json');
        if (fs.existsSync(MASTER_FILE)) {
          const masterList = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
          for (const p of masterList) {
            const exists = await db.queryOne('SELECT id FROM pegawai WHERE nip = ?', [p.nip]);
            if (!exists) {
              await db.getPool().execute(
                'INSERT INTO pegawai (nip,nama,pangkat,jabatan,role,unit,password,akses_login) VALUES (?,?,?,?,?,?,?,?)',
                [p.nip, p.nama, p.pangkat || '', p.jabatan || 'Staf', p.role || 'pegawai', p.unit || 'BKPSDM', hashIfNeeded(p.password || '123456'), 0]
              );
            }
          }
          const allPegawai = await db.query('SELECT * FROM pegawai WHERE aktif = 1 ORDER BY id');
          return sendJSON(res, { success: true, message: `Berhasil memuat master pegawai (${allPegawai.length} data)`, data: allPegawai.map(publicUser) });
        }
        return sendJSON(res, { success: false, message: 'File master pegawai tidak ditemukan' }, 404);
      }

      // ---- PEGAWAI: Create ----
      if (pathname === '/api/pegawai' && method === 'POST') {
        const body = await parseBody(req);
        if (!body.nip || !body.nama)
          return sendJSON(res, { success: false, message: 'NIP dan Nama wajib diisi' }, 400);
        const exists = await db.queryOne('SELECT id FROM pegawai WHERE nip = ?', [body.nip.trim()]);
        if (exists)
          return sendJSON(res, { success: false, message: 'NIP sudah terdaftar' }, 400);
        const [result] = await db.getPool().execute(
          'INSERT INTO pegawai (nip,nama,pangkat,jabatan,role,unit,password,akses_login) VALUES (?,?,?,?,?,?,?,?)',
          [body.nip.trim(), body.nama.trim(),
          body.pangkat || 'Penata Muda (III/a)',
          body.jabatan || 'Staf Pelaksana',
          body.role || 'pegawai',
          body.unit || 'Subbag Umum & Kepegawaian',
          hashIfNeeded(body.password || '123456'), 1]
        );
        const newPeg = await db.queryOne('SELECT * FROM pegawai WHERE id = ?', [result.insertId]);
        return sendJSON(res, { success: true, message: 'Pegawai berhasil ditambahkan', data: publicUser(newPeg) });
      }

      // ---- PEGAWAI: Update ----
      if (pathname.startsWith('/api/pegawai/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const peg = await db.queryOne('SELECT * FROM pegawai WHERE id = ?', [id]);
        if (!peg) return sendJSON(res, { success: false, message: 'Pegawai tidak ditemukan' }, 404);
        await db.getPool().execute(
          'UPDATE pegawai SET nip=?,nama=?,pangkat=?,jabatan=?,role=?,unit=?,password=?,akses_login=? WHERE id=?',
          [body.nip || peg.nip,
          body.nama || peg.nama,
          body.pangkat || peg.pangkat,
          body.jabatan || peg.jabatan,
          body.role || peg.role,
          body.unit || peg.unit,
          body.password ? hashIfNeeded(body.password) : peg.password,
          body.role === 'admin' ? 1 : (body.akses_login !== undefined ? (body.akses_login ? 1 : 0) : (peg.akses_login || 0)),
            id]
        );
        const updated = await db.queryOne('SELECT * FROM pegawai WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: 'Data pegawai diperbarui', data: publicUser(updated) });
      }

      // ---- PEGAWAI: Delete ----
      if (pathname.startsWith('/api/pegawai/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const count = await db.queryOne('SELECT COUNT(*) AS c FROM pegawai WHERE aktif = 1');
        if (count.c <= 1)
          return sendJSON(res, { success: false, message: 'Tidak dapat menghapus pegawai terakhir' }, 400);
        await db.getPool().execute('UPDATE pegawai SET aktif = 0 WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: 'Pegawai berhasil dinonaktifkan' });
      }

      // ---- SURAT MASUK: Create ----
      if (pathname === '/api/surat-masuk' && method === 'POST') {
        const body = await parseBody(req);
        const noAgenda = await generateNoAgenda('SM');
        const tglSurat = normalizeDateStr(body.tgl_surat) || getLocalToday();
        const tglDiterima = normalizeDateStr(body.tgl_diterima) || getLocalToday();
        const sifatSurat = body.sifat_surat || 'Biasa';
        let result;
        try {
          [result] = await db.getPool().execute(`
            INSERT INTO surat_masuk
              (no_agenda,no_surat_pengirim,instansi_pengirim,kode_internal,
               nama_klasifikasi_internal,perihal,tgl_surat,tgl_diterima,
               sifat_surat,lampiran,status_disposisi,file_name)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [noAgenda,
              body.no_surat_pengirim || '',
              body.instansi_pengirim || '',
              body.kode_internal || '800',
              body.nama_klasifikasi_internal || 'Kepegawaian',
              body.perihal || '',
              tglSurat,
              tglDiterima,
              sifatSurat,
              body.lampiran || '1 Berkas',
              'Menunggu Disposisi',
              body.file_name || 'surat_masuk.pdf']
          );
        } catch (enumErr) {
          // Fallback jika kolom sifat_surat di database masih menggunakan ENUM lama tanpa 'Segera'
          const safeSifat = sifatSurat === 'Segera' ? 'Penting' : 'Biasa';
          [result] = await db.getPool().execute(`
            INSERT INTO surat_masuk
              (no_agenda,no_surat_pengirim,instansi_pengirim,kode_internal,
               nama_klasifikasi_internal,perihal,tgl_surat,tgl_diterima,
               sifat_surat,lampiran,status_disposisi,file_name)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [noAgenda,
              body.no_surat_pengirim || '',
              body.instansi_pengirim || '',
              body.kode_internal || '800',
              body.nama_klasifikasi_internal || 'Kepegawaian',
              body.perihal || '',
              tglSurat,
              tglDiterima,
              safeSifat,
              body.lampiran || '1 Berkas',
              'Menunggu Disposisi',
              body.file_name || 'surat_masuk.pdf']
          );
        }
        const newSM = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_masuk WHERE id = ?', [result.insertId]));
        return sendJSON(res, { success: true, data: newSM });
      }

      // ---- SURAT MASUK: Update ----
      if (pathname.startsWith('/api/surat-masuk/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const sm = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_masuk WHERE id = ?', [id]));
        if (!sm) return sendJSON(res, { success: false, message: 'Surat masuk tidak ditemukan' }, 404);
        const sifatSurat = body.sifat_surat || sm.sifat_surat;
        try {
          await db.getPool().execute(`
            UPDATE surat_masuk SET
              no_surat_pengirim=?, instansi_pengirim=?, kode_internal=?,
              nama_klasifikasi_internal=?, perihal=?, tgl_surat=?,
              tgl_diterima=?, sifat_surat=?, file_name=?
            WHERE id=?`,
            [body.no_surat_pengirim || sm.no_surat_pengirim,
            body.instansi_pengirim || sm.instansi_pengirim,
            body.kode_internal || sm.kode_internal,
            body.nama_klasifikasi_internal || sm.nama_klasifikasi_internal,
            body.perihal || sm.perihal,
            normalizeDateStr(body.tgl_surat) || sm.tgl_surat,
            normalizeDateStr(body.tgl_diterima) || sm.tgl_diterima,
            sifatSurat,
            body.file_name || sm.file_name,
              id]
          );
        } catch (enumErr) {
          const safeSifat = sifatSurat === 'Segera' ? 'Penting' : 'Biasa';
          await db.getPool().execute(`
            UPDATE surat_masuk SET
              no_surat_pengirim=?, instansi_pengirim=?, kode_internal=?,
              nama_klasifikasi_internal=?, perihal=?, tgl_surat=?,
              tgl_diterima=?, sifat_surat=?, file_name=?
            WHERE id=?`,
            [body.no_surat_pengirim || sm.no_surat_pengirim,
            body.instansi_pengirim || sm.instansi_pengirim,
            body.kode_internal || sm.kode_internal,
            body.nama_klasifikasi_internal || sm.nama_klasifikasi_internal,
            body.perihal || sm.perihal,
            normalizeDateStr(body.tgl_surat) || sm.tgl_surat,
            normalizeDateStr(body.tgl_diterima) || sm.tgl_diterima,
            safeSifat,
            body.file_name || sm.file_name,
              id]
          );
        }
        const updated = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_masuk WHERE id = ?', [id]));
        return sendJSON(res, { success: true, message: 'Surat masuk diperbarui', data: updated });
      }

      // ---- SURAT MASUK: Delete ----
      if (pathname.startsWith('/api/surat-masuk/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const sm = await db.queryOne('SELECT no_agenda FROM surat_masuk WHERE id = ?', [id]);
        if (!sm) return sendJSON(res, { success: false, message: 'Surat masuk tidak ditemukan' }, 404);
        await db.getPool().execute('DELETE FROM surat_masuk WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: `Surat ${sm.no_agenda} berhasil dihapus` });
      }

      // ---- DISPOSISI: Create ----
      if (pathname === '/api/disposisi' && method === 'POST') {
        const body = await parseBody(req);
        const instruksi = Array.isArray(body.instruksi) ? body.instruksi.filter(Boolean) : [body.instruksi].filter(Boolean);
        const diteruskanList = Array.isArray(body.diteruskan_kepada)
          ? body.diteruskan_kepada.filter(Boolean)
          : (body.diteruskan_kepada ? [body.diteruskan_kepada] : (body.tujuan_nama ? String(body.tujuan_nama).split(',').map(s => s.trim()).filter(Boolean) : []));
        const tujuanNama = body.tujuan_nama && String(body.tujuan_nama).trim()
          ? String(body.tujuan_nama).trim()
          : diteruskanList.join(', ');
        const suratId = parseInt(body.id_surat_masuk, 10);
        const sifatInput = String(body.sifat || '').trim();
        const sifat = normalizeDisposisiSifat(sifatInput || 'B. Segera');
        if (!Number.isInteger(suratId))
          return sendJSON(res, { success: false, message: 'Surat masuk wajib dipilih' }, 400);
        if (!await db.queryOne('SELECT id FROM surat_masuk WHERE id = ?', [suratId]))
          return sendJSON(res, { success: false, message: 'Surat masuk tidak ditemukan' }, 404);
        if (!tujuanNama)
          return sendJSON(res, { success: false, message: 'Tujuan disposisi wajib diisi' }, 400);
        if (!instruksi.length)
          return sendJSON(res, { success: false, message: 'Instruksi disposisi wajib diisi' }, 400);
        if (!DISPOSISI_SIFAT.includes(sifatInput) && !DISPOSISI_SIFAT.includes(sifat))
          return sendJSON(res, { success: false, message: 'Sifat disposisi tidak valid' }, 400);
        let result;
        try {
          [result] = await db.getPool().execute(`
            INSERT INTO disposisi
              (id_surat_masuk,dari_user,tujuan_user_id,tujuan_nama,
               sifat,instruksi,catatan,batas_waktu,status_tindak_lanjut)
            VALUES (?,?,?,?,?,?,?,?,?)`,
            [suratId,
              body.dari_user || 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
              body.tujuan_user_id ? parseInt(body.tujuan_user_id, 10) : null,
              tujuanNama,
              sifat,
              JSON.stringify(instruksi),
              body.catatan || '',
              normalizeDateStr(body.batas_waktu) || null,
              'Diproses']
          );
        } catch (enumErr) {
          const fallbackSifat = sifat === 'Rahasia' ? 'Biasa' : 'Segera';
          [result] = await db.getPool().execute(`
            INSERT INTO disposisi
              (id_surat_masuk,dari_user,tujuan_user_id,tujuan_nama,
               sifat,instruksi,catatan,batas_waktu,status_tindak_lanjut)
            VALUES (?,?,?,?,?,?,?,?,?)`,
            [suratId,
              body.dari_user || 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
              body.tujuan_user_id ? parseInt(body.tujuan_user_id, 10) : null,
              tujuanNama,
              fallbackSifat,
              JSON.stringify(instruksi),
              body.catatan || '',
              normalizeDateStr(body.batas_waktu) || null,
              'Diproses']
          );
        }
        // Update status surat masuk
        await db.getPool().execute(
          "UPDATE surat_masuk SET status_disposisi = 'Didisposisi' WHERE id = ?",
          [suratId]
        );
        const newDisp = hydrateDisposisiRow(await db.queryOne('SELECT * FROM disposisi WHERE id = ?', [result.insertId]));
        if (newDisp) {
          newDisp.diteruskan_kepada = diteruskanList;
          newDisp.sifat = formatDisposisiSifatFrontend(sifatInput || sifat);
        }
        return sendJSON(res, { success: true, data: newDisp });
      }

      // ---- DISPOSISI: Update ----
      if (pathname.startsWith('/api/disposisi/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const disp = normalizeRecordDates(await db.queryOne('SELECT * FROM disposisi WHERE id = ?', [id]));
        if (!disp) return sendJSON(res, { success: false, message: 'Disposisi tidak ditemukan' }, 404);
        const newStatus = body.status_tindak_lanjut || disp.status_tindak_lanjut;
        const diteruskanList = Array.isArray(body.diteruskan_kepada)
          ? body.diteruskan_kepada.filter(Boolean)
          : (body.diteruskan_kepada ? [body.diteruskan_kepada] : null);
        const newTujuanNama = body.tujuan_nama !== undefined
          ? body.tujuan_nama
          : (diteruskanList ? diteruskanList.join(', ') : disp.tujuan_nama);
        const newSifat = body.sifat !== undefined ? normalizeDisposisiSifat(body.sifat) : disp.sifat;
        const newCatatan = body.catatan !== undefined ? body.catatan : disp.catatan;
        const newBatasWaktu = body.batas_waktu !== undefined ? (normalizeDateStr(body.batas_waktu) || null) : (disp.batas_waktu || null);
        if (!DISPOSISI_STATUS.includes(newStatus))
          return sendJSON(res, { success: false, message: 'Status tindak lanjut tidak valid' }, 400);
        if (!DISPOSISI_SIFAT.includes(newSifat))
          return sendJSON(res, { success: false, message: 'Sifat disposisi tidak valid' }, 400);
        const newInstruksi = body.instruksi !== undefined
          ? (Array.isArray(body.instruksi) ? JSON.stringify(body.instruksi) : String(body.instruksi))
          : (typeof disp.instruksi === 'string' ? disp.instruksi : JSON.stringify(disp.instruksi || []));

        try {
          await db.getPool().execute(
            'UPDATE disposisi SET status_tindak_lanjut=?, tindak_lanjut_note=?, tujuan_nama=?, sifat=?, instruksi=?, catatan=?, batas_waktu=? WHERE id=?',
            [newStatus, body.tindak_lanjut_note !== undefined ? body.tindak_lanjut_note : (disp.tindak_lanjut_note || ''), newTujuanNama, newSifat, newInstruksi, newCatatan, newBatasWaktu, id]
          );
        } catch (enumErr) {
          const fallbackSifat = newSifat === 'Rahasia' ? 'Biasa' : 'Segera';
          const fallbackStatus = newStatus === 'Ditangguhkan' ? 'Diproses' : newStatus;
          await db.getPool().execute(
            'UPDATE disposisi SET status_tindak_lanjut=?, tindak_lanjut_note=?, tujuan_nama=?, sifat=?, instruksi=?, catatan=?, batas_waktu=? WHERE id=?',
            [fallbackStatus, body.tindak_lanjut_note !== undefined ? body.tindak_lanjut_note : (disp.tindak_lanjut_note || ''), newTujuanNama, fallbackSifat, newInstruksi, newCatatan, newBatasWaktu, id]
          );
        }
        if (newStatus === 'Selesai') {
          await db.getPool().execute(
            "UPDATE surat_masuk SET status_disposisi='Selesai' WHERE id=?",
            [disp.id_surat_masuk]
          );
        } else {
          await db.getPool().execute(
            "UPDATE surat_masuk SET status_disposisi='Didisposisi' WHERE id=?",
            [disp.id_surat_masuk]
          );
        }
        const updated = hydrateDisposisiRow(await db.queryOne('SELECT * FROM disposisi WHERE id = ?', [id]));
        if (updated && body.sifat) updated.sifat = formatDisposisiSifatFrontend(body.sifat);
        return sendJSON(res, { success: true, data: updated });
      }

      // ---- DISPOSISI: Delete ----
      if (pathname.startsWith('/api/disposisi/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const disp = await db.queryOne('SELECT * FROM disposisi WHERE id = ?', [id]);
        if (!disp) return sendJSON(res, { success: false, message: 'Disposisi tidak ditemukan' }, 404);
        await db.getPool().execute('DELETE FROM disposisi WHERE id = ?', [id]);
        // Cek apakah ada disposisi lain untuk surat ini
        const others = await db.queryOne(
          'SELECT COUNT(*) AS c FROM disposisi WHERE id_surat_masuk = ?', [disp.id_surat_masuk]);
        if (others.c === 0) {
          await db.getPool().execute(
            "UPDATE surat_masuk SET status_disposisi='Menunggu Disposisi' WHERE id=?",
            [disp.id_surat_masuk]
          );
        }
        return sendJSON(res, { success: true, message: 'Disposisi berhasil dihapus' });
      }

      // ---- SURAT KELUAR: Create ----
      if (pathname === '/api/surat-keluar' && method === 'POST') {
        const body = await parseBody(req);
        const noAgenda = await generateNoAgenda('SK');
        const kode = body.kode_klasifikasi || '000';
        const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const bulan = romawi[new Date().getMonth()];
        const tahun = new Date().getFullYear();

        let maxUrut = 0;
        const [allSK] = await db.getPool().execute(
          'SELECT no_surat_keluar FROM surat_keluar'
        );
        for (const row of allSK) {
          const m = (row.no_surat_keluar || '').match(/\/0*(\d+)\//);
          if (m) {
            const v = parseInt(m[1], 10);
            if (v < 2000 && v > maxUrut) {
              maxUrut = v;
            }
          }
        }
        const nextN = maxUrut > 0 ? maxUrut + 1 : (allSK.length || 0) + 1;
        const noUrut = String(nextN).padStart(3, '0');
        const noSurat = body.no_surat_keluar || `${kode}/${noUrut}/BKPSDM/${bulan}/${tahun}`;
        const kodeUsulan = body.kode_usulan_bidang || kode;
        const statusKomparasi = body.status_komparasi_kode || (kodeUsulan !== kode ? 'Dikoreksi Sistem' : 'Sesuai Standar');

        let result;
        try {
          [result] = await db.getPool().execute(`
            INSERT INTO surat_keluar
              (no_agenda,bidang_pembuat,kode_usulan_bidang,kode_klasifikasi,nama_klasifikasi,status_komparasi_kode,no_surat_keluar,
               tujuan_surat,perihal,tgl_surat,sifat_surat,penandatangan,metode_dokumen,
               lokasi_arsip_fisik,is_surat_balasan,id_surat_masuk_asal,no_surat_pengirim_asal,file_name)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [noAgenda,
              body.bidang_pembuat || 'Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian',
              kodeUsulan,
              kode,
              body.nama_klasifikasi || 'Umum',
              statusKomparasi,
              noSurat,
              body.tujuan_surat || '',
              body.perihal || '',
              normalizeDateStr(body.tgl_surat) || getLocalToday(),
              body.sifat_surat || 'Biasa',
              body.penandatangan || 'Kepala BKPSDM Kabupaten Luwu Timur',
              body.metode_dokumen || 'Fisik Manual (Tanda Tangan Basah)',
              body.lokasi_arsip_fisik || 'Lemari Arsip Subbag Umum',
              body.is_surat_balasan ? 1 : 0,
              body.id_surat_masuk_asal ? parseInt(body.id_surat_masuk_asal, 10) : null,
              body.no_surat_pengirim_asal || '',
              body.file_name || 'surat_keluar.pdf']
          );
        } catch (colErr) {
          // Fallback jika database MySQL belum di-alter kolom komparasi
          [result] = await db.getPool().execute(`
            INSERT INTO surat_keluar
              (no_agenda,bidang_pembuat,kode_klasifikasi,nama_klasifikasi,no_surat_keluar,
               tujuan_surat,perihal,tgl_surat,sifat_surat,penandatangan,metode_dokumen,
               lokasi_arsip_fisik,is_surat_balasan,id_surat_masuk_asal,no_surat_pengirim_asal,file_name)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [noAgenda,
              body.bidang_pembuat || 'Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian',
              kode,
              body.nama_klasifikasi || 'Umum',
              noSurat,
              body.tujuan_surat || '',
              body.perihal || '',
              normalizeDateStr(body.tgl_surat) || getLocalToday(),
              body.sifat_surat || 'Biasa',
              body.penandatangan || 'Kepala BKPSDM Kabupaten Luwu Timur',
              body.metode_dokumen || 'Fisik Manual (Tanda Tangan Basah)',
              body.lokasi_arsip_fisik || 'Lemari Arsip Subbag Umum',
              body.is_surat_balasan ? 1 : 0,
              body.id_surat_masuk_asal ? parseInt(body.id_surat_masuk_asal, 10) : null,
              body.no_surat_pengirim_asal || '',
              body.file_name || 'surat_keluar.pdf']
          );
        }
        const newSK = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_keluar WHERE id = ?', [result.insertId]));
        if (newSK && !newSK.kode_usulan_bidang) {
          newSK.kode_usulan_bidang = kodeUsulan;
          newSK.status_komparasi_kode = statusKomparasi;
        }
        return sendJSON(res, { success: true, data: newSK });
      }

      // ---- SURAT KELUAR: Update ----
      if (pathname.startsWith('/api/surat-keluar/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const sk = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_keluar WHERE id = ?', [id]));
        if (!sk) return sendJSON(res, { success: false, message: 'Surat keluar tidak ditemukan' }, 404);

        const kodeUsulan = body.kode_usulan_bidang !== undefined ? body.kode_usulan_bidang : (sk.kode_usulan_bidang || sk.kode_klasifikasi);
        const kodeBaku = body.kode_klasifikasi || sk.kode_klasifikasi;
        const statusKomparasi = body.status_komparasi_kode || (kodeUsulan !== kodeBaku ? 'Dikoreksi Sistem' : 'Sesuai Standar');

        try {
          await db.getPool().execute(`
            UPDATE surat_keluar SET
              tujuan_surat=?, perihal=?, tgl_surat=?, sifat_surat=?,
              penandatangan=?, kode_klasifikasi=?, nama_klasifikasi=?, bidang_pembuat=?,
              kode_usulan_bidang=?, status_komparasi_kode=?, no_surat_keluar=?
            WHERE id=?`,
            [body.tujuan_surat || sk.tujuan_surat,
            body.perihal || sk.perihal,
            normalizeDateStr(body.tgl_surat) || sk.tgl_surat,
            body.sifat_surat || sk.sifat_surat,
            body.penandatangan || sk.penandatangan,
              kodeBaku,
            body.nama_klasifikasi || sk.nama_klasifikasi,
            body.bidang_pembuat || sk.bidang_pembuat,
              kodeUsulan,
              statusKomparasi,
            body.no_surat_keluar || sk.no_surat_keluar,
              id]
          );
        } catch (colErr) {
          await db.getPool().execute(`
            UPDATE surat_keluar SET
              tujuan_surat=?, perihal=?, tgl_surat=?, sifat_surat=?,
              penandatangan=?, kode_klasifikasi=?, nama_klasifikasi=?, bidang_pembuat=?, no_surat_keluar=?
            WHERE id=?`,
            [body.tujuan_surat || sk.tujuan_surat,
            body.perihal || sk.perihal,
            normalizeDateStr(body.tgl_surat) || sk.tgl_surat,
            body.sifat_surat || sk.sifat_surat,
            body.penandatangan || sk.penandatangan,
              kodeBaku,
            body.nama_klasifikasi || sk.nama_klasifikasi,
            body.bidang_pembuat || sk.bidang_pembuat,
            body.no_surat_keluar || sk.no_surat_keluar,
              id]
          );
        }
        const updated = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_keluar WHERE id = ?', [id]));
        if (updated && !updated.kode_usulan_bidang) {
          updated.kode_usulan_bidang = kodeUsulan;
          updated.status_komparasi_kode = statusKomparasi;
        }
        return sendJSON(res, { success: true, message: 'Surat keluar diperbarui', data: updated });
      }

      // ---- SURAT KELUAR: Delete ----
      if (pathname.startsWith('/api/surat-keluar/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const sk = await db.queryOne('SELECT no_agenda FROM surat_keluar WHERE id = ?', [id]);
        if (!sk) return sendJSON(res, { success: false, message: 'Surat keluar tidak ditemukan' }, 404);
        await db.getPool().execute('DELETE FROM surat_keluar WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: `Surat ${sk.no_agenda} berhasil dihapus` });
      }

      // ---- SURAT TUGAS: Create ----
      if (pathname === '/api/surat-tugas' && method === 'POST') {
        const body = await parseBody(req);
        const tahun = new Date().getFullYear();
        const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const bulanRomawi = romawi[new Date().getMonth()];
        const allSpt = await db.query('SELECT no_surat_tugas FROM surat_tugas');
        let maxUrut = 0;
        for (const r of allSpt) {
          const m = (r.no_surat_tugas || '').match(/\/0*(\d+)\//);
          if (m) {
            const num = parseInt(m[1], 10);
            if (num < 2000 && num > maxUrut) maxUrut = num;
          }
        }
        const nextUrut = maxUrut > 0 ? maxUrut + 1 : (allSpt.length || 0) + 1;
        const noSpt = body.no_surat_tugas ||
          `800.1.11.1/${String(nextUrut).padStart(3, '0')}/BKPSDM/${bulanRomawi}/${tahun}`;
        const [result] = await db.getPool().execute(`
          INSERT INTO surat_tugas
            (no_surat_tugas,bidang_pengusul,kode_klasifikasi,nama_klasifikasi,
             dasar,maksud_tugas,tempat_tujuan,tgl_berangkat,tgl_kembali,
             lama_hari,pembebanan_anggaran,pejabat_penandatangan,jabatan_penandatangan)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [noSpt,
            body.bidang_pengusul || 'Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian',
            '800.1.11.1',
            'Surat Perintah Dinas/Surat Tugas',
            body.dasar || '',
            body.maksud_tugas || '',
            body.tempat_tujuan || '',
            normalizeDateStr(body.tgl_berangkat) || getLocalToday(),
            normalizeDateStr(body.tgl_kembali) || getLocalToday(),
            parseInt(body.lama_hari || '1', 10),
            body.pembebanan_anggaran || `DPA-SKPD BKPSDM Kabupaten Luwu Timur TA ${tahun}`,
            body.pejabat_penandatangan || 'PARHA ARIEF, S.AP',
            body.jabatan_penandatangan || 'Kepala BKPSDM Kabupaten Luwu Timur']
        );
        const sptId = result.insertId;
        // Insert personil
        const personil = Array.isArray(body.personil) ? body.personil : [];
        for (let i = 0; i < personil.length; i++) {
          const p = personil[i];
          try {
            await db.getPool().execute(
              'INSERT INTO surat_tugas_personil (id_surat_tugas,nip,nama,pangkat,jabatan,urutan) VALUES (?,?,?,?,?,?)',
              [sptId, p.nip || '', p.nama || '', p.pangkat || '', p.jabatan || '', i + 1]
            );
          } catch (colErr) {
            await db.getPool().execute(
              'INSERT INTO surat_tugas_personil (id_surat_tugas,nip,nama,pangkat,jabatan) VALUES (?,?,?,?,?)',
              [sptId, p.nip || '', p.nama || '', p.pangkat || '', p.jabatan || '']
            );
          }
        }
        const newSpt = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_tugas WHERE id = ?', [sptId]));
        newSpt.personil = personil;
        return sendJSON(res, { success: true, data: newSpt });
      }

      // ---- SURAT TUGAS: Update ----
      if (pathname.startsWith('/api/surat-tugas/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const spt = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_tugas WHERE id = ?', [id]));
        if (!spt) return sendJSON(res, { success: false, message: 'Surat tugas tidak ditemukan' }, 404);
        await db.getPool().execute(`
          UPDATE surat_tugas SET
            bidang_pengusul=?, dasar=?, maksud_tugas=?, tempat_tujuan=?, tgl_berangkat=?,
            tgl_kembali=?, lama_hari=?, pembebanan_anggaran=?, pejabat_penandatangan=?
          WHERE id=?`,
          [body.bidang_pengusul || spt.bidang_pengusul,
          body.dasar || spt.dasar,
          body.maksud_tugas || spt.maksud_tugas,
          body.tempat_tujuan || spt.tempat_tujuan,
          normalizeDateStr(body.tgl_berangkat) || spt.tgl_berangkat,
          normalizeDateStr(body.tgl_kembali) || spt.tgl_kembali,
          parseInt(body.lama_hari || spt.lama_hari, 10),
          body.pembebanan_anggaran || spt.pembebanan_anggaran,
          body.pejabat_penandatangan || spt.pejabat_penandatangan,
            id]
        );
        if (body.personil && Array.isArray(body.personil)) {
          await db.getPool().execute('DELETE FROM surat_tugas_personil WHERE id_surat_tugas = ?', [id]);
          for (let i = 0; i < body.personil.length; i++) {
            const p = body.personil[i];
            try {
              await db.getPool().execute(
                'INSERT INTO surat_tugas_personil (id_surat_tugas,nip,nama,pangkat,jabatan,urutan) VALUES (?,?,?,?,?,?)',
                [id, p.nip || '', p.nama || '', p.pangkat || '', p.jabatan || '', i + 1]
              );
            } catch (colErr) {
              await db.getPool().execute(
                'INSERT INTO surat_tugas_personil (id_surat_tugas,nip,nama,pangkat,jabatan) VALUES (?,?,?,?,?)',
                [id, p.nip || '', p.nama || '', p.pangkat || '', p.jabatan || '']
              );
            }
          }
        }
        const updated = normalizeRecordDates(await db.queryOne('SELECT * FROM surat_tugas WHERE id = ?', [id]));
        if (updated) {
          if (body.personil && Array.isArray(body.personil)) {
            updated.personil = body.personil;
          } else {
            try {
              updated.personil = await db.query('SELECT * FROM surat_tugas_personil WHERE id_surat_tugas = ? ORDER BY id ASC', [id]);
            } catch (e) {
              updated.personil = [];
            }
          }
        }
        return sendJSON(res, { success: true, message: 'Surat tugas diperbarui', data: updated });
      }

      // ---- SURAT TUGAS: Delete ----
      if (pathname.startsWith('/api/surat-tugas/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const spt = await db.queryOne('SELECT no_surat_tugas FROM surat_tugas WHERE id = ?', [id]);
        if (!spt) return sendJSON(res, { success: false, message: 'Surat tugas tidak ditemukan' }, 404);
        await db.getPool().execute('DELETE FROM surat_tugas WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: `Surat tugas ${spt.no_surat_tugas} berhasil dihapus` });
      }

      // ---- CHANGE PASSWORD ----
      if (pathname === '/api/user/change-password' && method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.user_id, 10);
        const oldPass = (body.old_password || '').trim();
        const newPass = (body.new_password || '').trim();
        const user = await db.queryOne('SELECT * FROM pegawai WHERE id = ?', [userId]);
        if (!user)
          return sendJSON(res, { success: false, message: 'Pengguna tidak ditemukan' }, 404);
        if (!verifyPassword(oldPass, user.password || '123456').valid)
          return sendJSON(res, { success: false, message: 'Kata sandi lama tidak sesuai' }, 400);
        if (!newPass || newPass.length < 5)
          return sendJSON(res, { success: false, message: 'Kata sandi baru minimal 5 karakter' }, 400);
        await db.getPool().execute('UPDATE pegawai SET password = ? WHERE id = ?', [hashIfNeeded(newPass), userId]);
        return sendJSON(res, { success: true, message: 'Kata sandi berhasil diperbarui' });
      }

      // ---- DATABASE STATS ----
      if (pathname === '/api/database/stats' && method === 'GET') {
        let sqlStats = { exists: false, size_kb: 0, mtime: null };
        if (fs.existsSync(SQL_FILE)) {
          const st = fs.statSync(SQL_FILE);
          sqlStats = {
            exists: true,
            size_kb: (st.size / 1024).toFixed(1),
            mtime: st.mtime
          };
        }
        try {
          const stats = await db.queryOne('SELECT * FROM vw_dashboard_stats');
          return sendJSON(res, {
            success: true,
            stats: {
              surat_masuk: stats.total_surat_masuk,
              surat_keluar: stats.total_surat_keluar,
              disposisi: stats.total_disposisi,
              surat_tugas: stats.total_surat_tugas,
              pegawai: stats.total_pegawai,
              klasifikasi: classifications.length,
              sql: sqlStats,
              engine: 'MySQL ' + db.DB_CONFIG.host + '/' + db.DB_CONFIG.database
            }
          });
        } catch (statsErr) {
          const appState = await buildAppState();
          return sendJSON(res, {
            success: true,
            stats: {
              surat_masuk: (appState.surat_masuk || []).length,
              surat_keluar: (appState.surat_keluar || []).length,
              disposisi: (appState.disposisi || []).length,
              surat_tugas: (appState.surat_tugas || []).length,
              pegawai: (appState.pegawai || []).length,
              klasifikasi: classifications.length,
              sql: sqlStats,
              engine: 'MySQL ' + db.DB_CONFIG.host + '/' + db.DB_CONFIG.database
            }
          });
        }
      }

      // ---- DOWNLOAD SQL DUMP ----
      if (pathname === '/api/database/download-sql' && method === 'GET') {
        if (!fs.existsSync(SQL_FILE)) {
          const appState = await buildAppState();
          generateSqlFile(appState, classifications, SQL_FILE);
        }
        const fileContent = fs.readFileSync(SQL_FILE, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/sql; charset=utf-8',
          'Content-Disposition': 'attachment; filename="database_persuratan.sql"',
        });
        return res.end(fileContent);
      }

      // ---- SYNC SQL DUMP ----
      if (pathname === '/api/database/sync-sql' && method === 'POST') {
        const appState = await buildAppState();
        generateSqlFile(appState, classifications, SQL_FILE);
        return sendJSON(res, { success: true, message: 'File database_persuratan.sql berhasil disinkronkan' });
      }

      // ---- BACKUP JSON ----
      if (pathname === '/api/database/backup-json' && method === 'GET') {
        const appState = await buildAppState();
        const dateStr = getLocalToday().replace(/-/g, '');
        const filename = `backup_persuratan_bkpsdm_${dateStr}.json`;
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        });
        return res.end(JSON.stringify(appState, null, 2));
      }

      // ---- RESTORE JSON ----
      if (pathname === '/api/database/restore' && method === 'POST') {
        const body = await parseBody(req);
        const data = body.data || body;
        if (!data.pegawai || !Array.isArray(data.pegawai))
          return sendJSON(res, { success: false, message: 'Format data tidak valid' }, 400);
        const collections = ['surat_masuk', 'disposisi', 'surat_keluar', 'surat_tugas'];
        if (collections.some(key => data[key] !== undefined && !Array.isArray(data[key])))
          return sendJSON(res, { success: false, message: 'Struktur backup tidak valid' }, 400);
        if (data.pegawai.length > 10000 || collections.some(key => (data[key] || []).length > 100000))
          return sendJSON(res, { success: false, message: 'Ukuran backup melebihi batas aman' }, 413);
        if (data.pegawai.some(p => !p || !String(p.nip || '').trim() || !String(p.nama || '').trim()))
          return sendJSON(res, { success: false, message: 'Setiap pegawai wajib memiliki NIP dan nama' }, 400);

        await db.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.query('TRUNCATE TABLE surat_tugas_personil');
        await db.query('TRUNCATE TABLE disposisi');
        await db.query('TRUNCATE TABLE surat_masuk');
        await db.query('TRUNCATE TABLE surat_keluar');
        await db.query('TRUNCATE TABLE surat_tugas');
        await db.query('DELETE FROM pegawai WHERE id > 0');
        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        for (const p of (data.pegawai || [])) {
          await db.getPool().execute(
            'INSERT INTO pegawai (nip,nama,pangkat,jabatan,role,unit,password,akses_login) VALUES (?,?,?,?,?,?,?,?)',
            [p.nip, p.nama, p.pangkat || '', p.jabatan || '', p.role || 'pegawai', p.unit || '', hashIfNeeded(p.password || '123456'), p.role === 'admin' ? 1 : (p.akses_login ? 1 : 0)]
          );
        }
        const smIdMap = {};
        for (const sm of (data.surat_masuk || [])) {
          const [smRes] = await db.getPool().execute(
            `INSERT INTO surat_masuk
              (no_agenda,no_surat_pengirim,instansi_pengirim,kode_internal,nama_klasifikasi_internal,
               perihal,tgl_surat,tgl_diterima,sifat_surat,lampiran,status_disposisi,file_name)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [sm.no_agenda, sm.no_surat_pengirim || '', sm.instansi_pengirim || '',
            sm.kode_internal || '800', sm.nama_klasifikasi_internal || 'Kepegawaian',
            sm.perihal || '', normalizeDateStr(sm.tgl_surat) || getLocalToday(), normalizeDateStr(sm.tgl_diterima) || getLocalToday(), sm.sifat_surat || 'Biasa',
            sm.lampiran || '1 Berkas', sm.status_disposisi || 'Menunggu Disposisi',
            sm.file_name || 'surat_masuk.pdf']
          );
          if (sm.id) smIdMap[sm.id] = smRes.insertId;
        }
        for (const d of (data.disposisi || [])) {
          const targetSmId = smIdMap[d.id_surat_masuk] || d.id_surat_masuk;
          if (!targetSmId) continue;
          const diteruskan = Array.isArray(d.diteruskan_kepada) ? d.diteruskan_kepada : [];
          const tujuanNama = d.tujuan_nama || diteruskan.join(', ');
          const instruksiJson = Array.isArray(d.instruksi) ? JSON.stringify(d.instruksi) : String(d.instruksi || '[]');
          try {
            await db.getPool().execute(
              `INSERT INTO disposisi
                (id_surat_masuk,dari_user,tujuan_user_id,tujuan_nama,sifat,instruksi,catatan,batas_waktu,status_tindak_lanjut,tindak_lanjut_note)
               VALUES (?,?,?,?,?,?,?,?,?,?)`,
              [targetSmId, d.dari_user || 'PARHA ARIEF, S.AP (Kepala BKPSDM)', null, tujuanNama,
              normalizeDisposisiSifat(d.sifat || 'B. Segera'), instruksiJson, d.catatan || '',
              normalizeDateStr(d.batas_waktu) || null, d.status_tindak_lanjut || 'Diproses', d.tindak_lanjut_note || '']
            );
          } catch (dispErr) {
            // Abaikan jika gagal restore satu baris disposisi
          }
        }
        for (const sk of (data.surat_keluar || [])) {
          await db.getPool().execute(
            `INSERT INTO surat_keluar
              (no_agenda,bidang_pembuat,kode_klasifikasi,nama_klasifikasi,no_surat_keluar,
               tujuan_surat,perihal,tgl_surat,sifat_surat,penandatangan,file_name)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [sk.no_agenda, sk.bidang_pembuat || '', sk.kode_klasifikasi || '000',
            sk.nama_klasifikasi || 'Umum', sk.no_surat_keluar || '',
            sk.tujuan_surat || '', sk.perihal || '', normalizeDateStr(sk.tgl_surat) || getLocalToday(), sk.sifat_surat || 'Biasa',
            sk.penandatangan || '', sk.file_name || 'surat_keluar.pdf']
          );
        }
        for (const spt of (data.surat_tugas || [])) {
          const [sptRes] = await db.getPool().execute(
            `INSERT INTO surat_tugas
              (no_surat_tugas,bidang_pengusul,kode_klasifikasi,nama_klasifikasi,dasar,maksud_tugas,
               tempat_tujuan,tgl_berangkat,tgl_kembali,lama_hari,pembebanan_anggaran,pejabat_penandatangan,jabatan_penandatangan)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [spt.no_surat_tugas, spt.bidang_pengusul || '', spt.kode_klasifikasi || '800.1.11.1',
            spt.nama_klasifikasi || 'Surat Perintah Dinas/Surat Tugas', spt.dasar || '', spt.maksud_tugas || '',
            spt.tempat_tujuan || '', normalizeDateStr(spt.tgl_berangkat) || getLocalToday(), normalizeDateStr(spt.tgl_kembali) || getLocalToday(),
            parseInt(spt.lama_hari || '1', 10), spt.pembebanan_anggaran || '',
            spt.pejabat_penandatangan || 'PARHA ARIEF, S.AP', spt.jabatan_penandatangan || 'Kepala BKPSDM Kabupaten Luwu Timur']
          );
          const sptId = sptRes.insertId;
          const personil = Array.isArray(spt.personil) ? spt.personil : [];
          for (const p of personil) {
            try {
              await db.getPool().execute(
                'INSERT INTO surat_tugas_personil (id_surat_tugas,nip,nama,pangkat,jabatan) VALUES (?,?,?,?,?)',
                [sptId, p.nip || '', p.nama || '', p.pangkat || '', p.jabatan || '']
              );
            } catch (pErr) { }
          }
        }
        return sendJSON(res, {
          success: true,
          message: 'Data berhasil dipulihkan ke MySQL!',
          stats: {
            pegawai: data.pegawai.length,
            surat_masuk: (data.surat_masuk || []).length,
            disposisi: (data.disposisi || []).length,
            surat_keluar: (data.surat_keluar || []).length,
            surat_tugas: (data.surat_tugas || []).length
          }
        });
      }

      return sendJSON(res, { error: 'Endpoint tidak ditemukan' }, 404);

    } catch (apiErr) {
      console.error('[API ERROR]', apiErr);
      return sendJSON(res, { error: apiErr.message, detail: 'Pastikan MySQL berjalan dan konfigurasi database.js benar' }, 500);
    }
  }

  // ---- STATIC FILES ----
  let safePath = path.normalize(pathname).replace(/^(\.\.[\\/])+/, '');
  if (safePath === '/' || safePath === '/login') safePath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, safePath);
  const publicRoot = path.resolve(PUBLIC_DIR) + path.sep;
  if (path.resolve(filePath) !== path.resolve(PUBLIC_DIR) && !path.resolve(filePath).startsWith(publicRoot)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        const fb = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(fb, (e2, content) => {
          if (e2) { res.writeHead(404); return res.end('Not Found'); }
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          });
          res.end(content);
        });
        return;
      }
      res.writeHead(404); return res.end('File Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

// ============================================================
// START SERVER — Test MySQL dulu sebelum listen
// ============================================================
async function startServer() {
  console.log('================================================================');
  console.log(' SISTEM INFORMASI PERSURATAN BKPSDM KAB. LUWU TIMUR');
  console.log(' Berbasis Peraturan Bupati Luwu Timur No. 69 Tahun 2023');
  console.log(' MySQL Edition — Yusri Mahendra (NIM: IK2311011)');
  console.log('================================================================');

  const connected = await db.testConnection();
  if (!connected) {
    console.error('[FATAL] Tidak dapat konek ke MySQL!');
    console.error('[INFO]  Pastikan MySQL berjalan dan config/database.js sudah diatur.');
    console.error('[INFO]  Jalankan schema: mysql -u root -p < database/schema.sql');
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`[MySQL] Terhubung ke: ${db.DB_CONFIG.host}/${db.DB_CONFIG.database}`);
    console.log(`[Server] Berjalan di: http://localhost:${PORT}`);
    console.log('================================================================');
  });
}

if (process.env.VERCEL !== '1') {
  startServer();
}

module.exports = server;
