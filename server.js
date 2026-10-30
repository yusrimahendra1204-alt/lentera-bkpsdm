const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'current_state.json');
const INITIAL_FILE = path.join(DATA_DIR, 'initial_state.json');
const KLASIFIKASI_FILE = path.join(DATA_DIR, 'klasifikasi_perbup.json');
const SQL_FILE = path.join(__dirname, 'database_persuratan.sql');

const { generateSqlFile } = require('./scripts/generate_sql');

// In-memory state and classifications
let classifications = [];
let appState = null;

// Load classifications
try {
  if (fs.existsSync(KLASIFIKASI_FILE)) {
    classifications = JSON.parse(fs.readFileSync(KLASIFIKASI_FILE, 'utf8'));
    console.log(`[DATA] Loaded ${classifications.length} classification codes from Perbup Luwu Timur 2023`);
  }
} catch (err) {
  console.error('[DATA ERROR] Failed to load classifications:', err);
}

// Load or initialize state
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      appState = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } else if (fs.existsSync(INITIAL_FILE)) {
      appState = JSON.parse(fs.readFileSync(INITIAL_FILE, 'utf8'));
      saveState();
    }
  } catch (err) {
    console.error('[STATE ERROR] Failed to load state:', err);
    if (fs.existsSync(INITIAL_FILE)) {
      appState = JSON.parse(fs.readFileSync(INITIAL_FILE, 'utf8'));
    }
  }
}

function saveState() {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(appState, null, 2), 'utf8');
    // Auto-sync SQL dump in background so phpMyAdmin file is always updated
    try {
      if (classifications && classifications.length > 0) {
        generateSqlFile(appState, classifications, SQL_FILE);
      }
    } catch (sqlErr) {
      console.warn('[SQL SYNC WARNING]', sqlErr.message);
    }
  } catch (err) {
    console.error('[STATE ERROR] Failed to save state:', err);
  }
}

loadState();

// Helper: MIME types
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

// Helper: Read JSON request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Helper: JSON response
function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function searchKlasifikasi(query, kategori = '', limit = 25) {
  if (!query) {
    if (kategori) {
      return classifications.filter(c => c.kategori === kategori).slice(0, limit);
    }
    // Default jika tanpa query dan tanpa filter kategori: Tampilkan urutan awal Perbup (000 UMUM dst)
    return classifications.slice(0, limit);
  }

  const q = (query || '').toLowerCase().trim();
  const qTokens = q.split(/\s+/).filter(t => t.length > 1);

  let scored = [];

  for (const item of classifications) {
    if (kategori && item.kategori !== kategori) continue;

    let score = 0;
    const kode = item.kode.toLowerCase();
    const nama = item.nama.toLowerCase();
    const keywords = item.keywords || [];

    // Exact code match
    if (kode === q) {
      score += 1000;
    } else if (kode.startsWith(q)) {
      score += 500;
    }

    // Exact phrase in name
    if (q && nama.includes(q)) {
      score += 300;
    }

    // Token matches in name and keywords
    for (const token of qTokens) {
      if (nama.includes(token)) score += 50;
      if (keywords.includes(token)) score += 80;
      if (keywords.some(k => k.includes(token))) score += 30;
      if (kode.includes(token)) score += 40;
    }

    // Priority boost for BKPSDM domain: 800 KEPEGAWAIAN
    if (score > 0) {
      if (item.kode.startsWith('800')) {
        score += 150;
      }
      scored.push({ item, score });
    }
  }

  // Sort by score desc, then by code length asc (prefer parent categories if equal score)
  scored.sort((a, b) => b.score - a.score || a.item.kode.localeCompare(b.item.kode));

  return scored.slice(0, limit).map(s => s.item);
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  // API ROUTES
  if (pathname.startsWith('/api/')) {
    try {
      // 1. Search classifications
      if (pathname === '/api/klasifikasi' && method === 'GET') {
        const q = parsedUrl.query.q || '';
        const kat = parsedUrl.query.kat || '';
        const limit = parseInt(parsedUrl.query.limit || '15', 10);
        const results = searchKlasifikasi(q, kat, limit);
        return sendJSON(res, { success: true, total: results.length, data: results });
      }

      // 2. Get full state
      if (pathname === '/api/state' && method === 'GET') {
        return sendJSON(res, { success: true, data: appState });
      }

      // 3. Reset state to default
      if (pathname === '/api/reset' && method === 'POST') {
        if (fs.existsSync(INITIAL_FILE)) {
          appState = JSON.parse(fs.readFileSync(INITIAL_FILE, 'utf8'));
          saveState();
          return sendJSON(res, { success: true, message: 'State berhasil di-reset', data: appState });
        }
        return sendJSON(res, { success: false, message: 'File initial_state.json tidak ditemukan' }, 500);
      }

      // 3.0 Bersihkan seluruh data dummy transaksi (surat masuk, surat keluar, disposisi, surat tugas)
      if ((pathname === '/api/database/clear-dummy' || pathname === '/api/clear-dummy') && method === 'POST') {
        appState.surat_masuk = [];
        appState.disposisi = [];
        appState.surat_keluar = [];
        appState.surat_tugas = [];
        saveState();
        return sendJSON(res, {
          success: true,
          message: 'Seluruh data dummy surat masuk, surat keluar, disposisi, dan surat tugas berhasil dibersihkan!',
          data: appState
        });
      }

      // 3.1 Authentication Login API
      if (pathname === '/api/login' && method === 'POST') {
        const body = await parseBody(req);
        const nip = (body.nip || '').trim();
        const password = (body.password || '').trim();

        const user = appState.pegawai.find(p => 
          p.nip === nip || 
          (p.username && p.username.toLowerCase() === nip.toLowerCase()) ||
          (nip.toLowerCase() === 'admin' && p.role === 'admin') ||
          p.nama.toLowerCase().includes(nip.toLowerCase())
        );

        if (!user) {
          return sendJSON(res, { success: false, message: 'NIP / Username tidak terdaftar' }, 401);
        }

        // Check password (accept user's password, 123, 123456, admin, admin123)
        const validPassword = user.password || '123456';
        const allowedPasswords = [validPassword, '123', '123456', 'admin', 'admin123'];
        if (password && !allowedPasswords.includes(password)) {
          return sendJSON(res, { success: false, message: 'Kata sandi / Password salah' }, 401);
        }

        return sendJSON(res, {
          success: true,
          message: `Selamat datang, ${user.nama}`,
          user: user
        });
      }

      // 3.1b Load Master Pegawai (Optional Batch Import)
      if (pathname === '/api/pegawai/load-master' && method === 'POST') {
        const MASTER_FILE = path.join(DATA_DIR, 'master_pegawai_bkpsdm_final.json');
        if (fs.existsSync(MASTER_FILE)) {
          const masterList = JSON.parse(fs.readFileSync(MASTER_FILE, 'utf8'));
          appState.pegawai = masterList;
          saveState();
          return sendJSON(res, { 
            success: true, 
            message: `Berhasil memuat ${masterList.length} master pegawai resmi BKPSDM`, 
            data: masterList 
          });
        }
        return sendJSON(res, { success: false, message: 'File master pegawai tidak ditemukan' }, 404);
      }

      // 3.2 Create Pegawai (User Management)
      if (pathname === '/api/pegawai' && method === 'POST') {
        const body = await parseBody(req);
        const newId = (appState.pegawai.length ? Math.max(...appState.pegawai.map(p => p.id)) : 0) + 1;

        if (!body.nip || !body.nama) {
          return sendJSON(res, { success: false, message: 'NIP dan Nama Pegawai wajib diisi' }, 400);
        }

        // Check duplicate NIP
        if (appState.pegawai.some(p => p.nip === body.nip.trim())) {
          return sendJSON(res, { success: false, message: 'NIP tersebut sudah terdaftar di sistem' }, 400);
        }

        const newPegawai = {
          id: newId,
          nip: body.nip.trim(),
          nama: body.nama.trim(),
          pangkat: body.pangkat || 'Penata Muda (III/a)',
          jabatan: body.jabatan || 'Staf Pelaksana',
          role: body.role || 'pegawai',
          unit: body.unit || 'Subbag Umum & Kepegawaian',
          password: body.password || '123456'
        };

        appState.pegawai.push(newPegawai);
        saveState();
        return sendJSON(res, { success: true, message: 'Data pegawai berhasil ditambahkan', data: newPegawai });
      }

      // 3.3 Update Pegawai
      if (pathname.startsWith('/api/pegawai/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const peg = appState.pegawai.find(p => p.id === id);

        if (!peg) {
          return sendJSON(res, { success: false, message: 'Pegawai tidak ditemukan' }, 404);
        }

        if (body.nip) peg.nip = body.nip.trim();
        if (body.nama) peg.nama = body.nama.trim();
        if (body.pangkat) peg.pangkat = body.pangkat.trim();
        if (body.jabatan) peg.jabatan = body.jabatan.trim();
        if (body.role) peg.role = body.role;
        if (body.unit) peg.unit = body.unit.trim();
        if (body.password) peg.password = body.password.trim();

        saveState();
        return sendJSON(res, { success: true, message: 'Data pegawai berhasil diperbarui', data: peg });
      }

      // 3.4 Delete Pegawai
      if (pathname.startsWith('/api/pegawai/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const index = appState.pegawai.findIndex(p => p.id === id);

        if (index === -1) {
          return sendJSON(res, { success: false, message: 'Pegawai tidak ditemukan' }, 404);
        }

        if (appState.pegawai.length <= 1) {
          return sendJSON(res, { success: false, message: 'Tidak dapat menghapus pegawai terakhir' }, 400);
        }

        const deleted = appState.pegawai.splice(index, 1)[0];
        saveState();
        return sendJSON(res, { success: true, message: `Pegawai ${deleted.nama} berhasil dihapus` });
      }

      // 4. Create Surat Masuk
      if (pathname === '/api/surat-masuk' && method === 'POST') {
        const body = await parseBody(req);
        const newId = (appState.surat_masuk.length ? Math.max(...appState.surat_masuk.map(s => s.id)) : 0) + 1;
        const noAgenda = `SM-2026-${String(newId).padStart(3, '0')}`;

        const newSurat = {
          id: newId,
          no_agenda: noAgenda,
          no_surat_pengirim: body.no_surat_pengirim || '',
          instansi_pengirim: body.instansi_pengirim || '',
          kode_internal: body.kode_internal || '800',
          nama_klasifikasi_internal: body.nama_klasifikasi_internal || 'Kepegawaian',
          perihal: body.perihal || '',
          tgl_surat: body.tgl_surat || new Date().toISOString().split('T')[0],
          tgl_diterima: body.tgl_diterima || new Date().toISOString().split('T')[0],
          sifat_surat: body.sifat_surat || 'Biasa',
          lampiran: body.lampiran || '1 Berkas',
          status_disposisi: body.status_disposisi || 'Menunggu Disposisi',
          file_name: body.file_name || 'surat_masuk.pdf'
        };

        appState.surat_masuk.unshift(newSurat);
        saveState();
        return sendJSON(res, { success: true, data: newSurat });
      }

      // 4.1 Update Surat Masuk
      if (pathname.startsWith('/api/surat-masuk/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const sm = appState.surat_masuk.find(s => s.id === id);
        if (!sm) {
          return sendJSON(res, { success: false, message: 'Surat masuk tidak ditemukan' }, 404);
        }

        if (body.no_surat_pengirim) sm.no_surat_pengirim = body.no_surat_pengirim;
        if (body.instansi_pengirim) sm.instansi_pengirim = body.instansi_pengirim;
        if (body.kode_internal) sm.kode_internal = body.kode_internal;
        if (body.nama_klasifikasi_internal) sm.nama_klasifikasi_internal = body.nama_klasifikasi_internal;
        if (body.perihal) sm.perihal = body.perihal;
        if (body.tgl_surat) sm.tgl_surat = body.tgl_surat;
        if (body.tgl_diterima) sm.tgl_diterima = body.tgl_diterima;
        if (body.sifat_surat) sm.sifat_surat = body.sifat_surat;
        if (body.file_name) sm.file_name = body.file_name;

        saveState();
        return sendJSON(res, { success: true, message: 'Surat masuk berhasil diperbarui', data: sm });
      }

      // 4.2 Delete Surat Masuk
      if (pathname.startsWith('/api/surat-masuk/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const index = appState.surat_masuk.findIndex(s => s.id === id);
        if (index === -1) {
          return sendJSON(res, { success: false, message: 'Surat masuk tidak ditemukan' }, 404);
        }

        const deleted = appState.surat_masuk.splice(index, 1)[0];
        // Also remove cascade disposisi
        appState.disposisi = appState.disposisi.filter(d => d.id_surat_masuk !== id);
        saveState();
        return sendJSON(res, { success: true, message: `Surat masuk ${deleted.no_agenda} berhasil dihapus` });
      }

      // 5. Create Disposisi Plt. Kepala BKPSDM
      if (pathname === '/api/disposisi' && method === 'POST') {
        const body = await parseBody(req);
        const newId = (appState.disposisi.length ? Math.max(...appState.disposisi.map(d => d.id)) : 0) + 1;

        const diteruskanList = Array.isArray(body.diteruskan_kepada) 
          ? body.diteruskan_kepada 
          : (body.diteruskan_kepada ? [body.diteruskan_kepada] : (body.tujuan_nama ? [body.tujuan_nama] : []));

        const newDisposisi = {
          id: newId,
          id_surat_masuk: parseInt(body.id_surat_masuk, 10),
          dari_user: body.dari_user || 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
          diteruskan_kepada: diteruskanList,
          tujuan_user_id: body.tujuan_user_id ? parseInt(body.tujuan_user_id, 10) : null,
          tujuan_nama: body.tujuan_nama || diteruskanList.join(', '),
          sifat: body.sifat || 'B. Segera',
          instruksi: Array.isArray(body.instruksi) ? body.instruksi : (body.instruksi ? [body.instruksi] : []),
          catatan: body.catatan || '',
          batas_waktu: body.batas_waktu || '',
          status_tindak_lanjut: 'Diproses',
          created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          tindak_lanjut_note: ''
        };

        appState.disposisi.unshift(newDisposisi);

        // Update status surat masuk
        const sm = appState.surat_masuk.find(s => s.id === newDisposisi.id_surat_masuk);
        if (sm) {
          sm.status_disposisi = 'Didisposisi';
        }

        saveState();
        return sendJSON(res, { success: true, data: newDisposisi });
      }

      // 6. Update Disposisi
      if (pathname.startsWith('/api/disposisi/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const disp = appState.disposisi.find(d => d.id === id);
        if (!disp) {
          return sendJSON(res, { success: false, message: 'Disposisi tidak ditemukan' }, 404);
        }

        if (body.diteruskan_kepada) {
          disp.diteruskan_kepada = Array.isArray(body.diteruskan_kepada) ? body.diteruskan_kepada : [body.diteruskan_kepada];
          disp.tujuan_nama = disp.diteruskan_kepada.join(', ');
        }
        if (body.tujuan_nama) disp.tujuan_nama = body.tujuan_nama;
        if (body.sifat) disp.sifat = body.sifat;
        if (body.instruksi) disp.instruksi = Array.isArray(body.instruksi) ? body.instruksi : [body.instruksi];
        if (body.catatan !== undefined) disp.catatan = body.catatan;
        if (body.status_tindak_lanjut) disp.status_tindak_lanjut = body.status_tindak_lanjut;
        if (body.tindak_lanjut_note) disp.tindak_lanjut_note = body.tindak_lanjut_note;

        // If completed, check if surat masuk can be marked Selesai
        if (disp.status_tindak_lanjut === 'Selesai') {
          const sm = appState.surat_masuk.find(s => s.id === disp.id_surat_masuk);
          if (sm) sm.status_disposisi = 'Selesai';
        }

        saveState();
        return sendJSON(res, { success: true, data: disp });
      }

      // 6.1 Delete Disposisi
      if (pathname.startsWith('/api/disposisi/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const index = appState.disposisi.findIndex(d => d.id === id);
        if (index === -1) {
          return sendJSON(res, { success: false, message: 'Disposisi tidak ditemukan' }, 404);
        }

        const disp = appState.disposisi.splice(index, 1)[0];
        // Check if other disposisi exist for this surat masuk, if not reset to Menunggu
        const otherDisp = appState.disposisi.filter(d => d.id_surat_masuk === disp.id_surat_masuk);
        if (!otherDisp.length) {
          const sm = appState.surat_masuk.find(s => s.id === disp.id_surat_masuk);
          if (sm) sm.status_disposisi = 'Menunggu Disposisi';
        }

        saveState();
        return sendJSON(res, { success: true, message: 'Rekaman disposisi berhasil dihapus' });
      }

      // 7. Create Surat Keluar
      if (pathname === '/api/surat-keluar' && method === 'POST') {
        const body = await parseBody(req);
        const newId = (appState.surat_keluar.length ? Math.max(...appState.surat_keluar.map(s => s.id)) : 0) + 1;
        const noAgenda = `SK-2026-${String(newId).padStart(3, '0')}`;
        const kode = body.kode_klasifikasi || '000';

        const romawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const monthRomawi = romawi[new Date().getMonth()];
        const year = new Date().getFullYear();
        const formattedUrut = String(newId + 100).padStart(3, '0');
        const noSurat = `${kode}/${formattedUrut}/BKPSDM/${monthRomawi}/${year}`;

        const newSuratKeluar = {
          id: newId,
          no_agenda: noAgenda,
          bidang_pembuat: body.bidang_pembuat || 'Bidang Pengadaan, Mutasi & Informasi Kepegawaian',
          kode_klasifikasi: kode,
          nama_klasifikasi: body.nama_klasifikasi || 'Kepegawaian',
          no_surat_keluar: body.no_surat_keluar || noSurat,
          tujuan_surat: body.tujuan_surat || '',
          perihal: body.perihal || '',
          tgl_surat: body.tgl_surat || new Date().toISOString().split('T')[0],
          sifat_surat: body.sifat_surat || 'Biasa',
          penandatangan: body.penandatangan || 'Kepala BKPSDM Kabupaten Luwu Timur',
          metode_dokumen: body.metode_dokumen || 'Fisik Manual (Tanda Tangan Basah)',
          lokasi_arsip_fisik: body.lokasi_arsip_fisik || 'Lemari Arsip Subbag Umum',
          is_surat_balasan: body.is_surat_balasan || false,
          id_surat_masuk_asal: body.id_surat_masuk_asal || null,
          no_surat_pengirim_asal: body.no_surat_pengirim_asal || '',
          file_name: body.file_name || 'surat_keluar.pdf'
        };

        appState.surat_keluar.unshift(newSuratKeluar);
        saveState();
        return sendJSON(res, { success: true, data: newSuratKeluar });
      }

      // 7.1 Update Surat Keluar
      if (pathname.startsWith('/api/surat-keluar/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const sk = appState.surat_keluar.find(s => s.id === id);
        if (!sk) {
          return sendJSON(res, { success: false, message: 'Surat keluar tidak ditemukan' }, 404);
        }

        if (body.tujuan_surat) sk.tujuan_surat = body.tujuan_surat;
        if (body.perihal) sk.perihal = body.perihal;
        if (body.tgl_surat) sk.tgl_surat = body.tgl_surat;
        if (body.sifat_surat) sk.sifat_surat = body.sifat_surat;
        if (body.penandatangan) sk.penandatangan = body.penandatangan;
        if (body.kode_klasifikasi) sk.kode_klasifikasi = body.kode_klasifikasi;
        if (body.nama_klasifikasi) sk.nama_klasifikasi = body.nama_klasifikasi;
        if (body.bidang_pembuat) sk.bidang_pembuat = body.bidang_pembuat;

        saveState();
        return sendJSON(res, { success: true, message: 'Surat keluar berhasil diperbarui', data: sk });
      }

      // 7.2 Delete Surat Keluar
      if (pathname.startsWith('/api/surat-keluar/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const index = appState.surat_keluar.findIndex(s => s.id === id);
        if (index === -1) {
          return sendJSON(res, { success: false, message: 'Surat keluar tidak ditemukan' }, 404);
        }

        const deleted = appState.surat_keluar.splice(index, 1)[0];
        saveState();
        return sendJSON(res, { success: true, message: `Surat keluar ${deleted.no_agenda} berhasil dihapus` });
      }

      // 8. Create Surat Tugas (SPT) - Pencatatan & Penomoran Saja
      if (pathname === '/api/surat-tugas' && method === 'POST') {
        const body = await parseBody(req);
        const newId = (appState.surat_tugas.length ? Math.max(...appState.surat_tugas.map(s => s.id)) : 0) + 1;
        const noSpt = `800.1.11.1/${String(newId + 40).padStart(3, '0')}/BKPSDM-LT/X/2026`;

        const newSpt = {
          id: newId,
          no_surat_tugas: body.no_surat_tugas || noSpt,
          bidang_pengusul: body.bidang_pengusul || 'Bidang Pengadaan, Mutasi dan Informasi Kepegawaian',
          kode_klasifikasi: '800.1.11.1',
          nama_klasifikasi: 'Surat Perintah Dinas/Surat Tugas',
          dasar: body.dasar || '',
          maksud_tugas: body.maksud_tugas || '',
          tempat_tujuan: body.tempat_tujuan || '',
          tgl_berangkat: body.tgl_berangkat || new Date().toISOString().split('T')[0],
          tgl_kembali: body.tgl_kembali || new Date().toISOString().split('T')[0],
          lama_hari: parseInt(body.lama_hari || '1', 10),
          pembebanan_anggaran: body.pembebanan_anggaran || 'DPA-SKPD BKPSDM Kabupaten Luwu Timur TA 2026',
          pejabat_penandatangan: body.pejabat_penandatangan || 'PARHA ARIEF, S.AP',
          jabatan_penandatangan: body.jabatan_penandatangan || 'Kepala BKPSDM Kabupaten Luwu Timur',
          status_naskah_fisik: 'Naskah fisik disusun & dicetak manual oleh bidang (Tanda tangan basah manual)',
          personil: Array.isArray(body.personil) ? body.personil : []
        };

        appState.surat_tugas.unshift(newSpt);
        saveState();
        return sendJSON(res, { success: true, data: newSpt });
      }

      // 8.1 Update Surat Tugas (SPT)
      if (pathname.startsWith('/api/surat-tugas/') && method === 'PUT') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const spt = appState.surat_tugas.find(s => s.id === id);
        if (!spt) {
          return sendJSON(res, { success: false, message: 'Surat tugas tidak ditemukan' }, 404);
        }

        if (body.dasar) spt.dasar = body.dasar;
        if (body.maksud_tugas) spt.maksud_tugas = body.maksud_tugas;
        if (body.tempat_tujuan) spt.tempat_tujuan = body.tempat_tujuan;
        if (body.tgl_berangkat) spt.tgl_berangkat = body.tgl_berangkat;
        if (body.tgl_kembali) spt.tgl_kembali = body.tgl_kembali;
        if (body.lama_hari) spt.lama_hari = parseInt(body.lama_hari, 10);
        if (body.pembebanan_anggaran) spt.pembebanan_anggaran = body.pembebanan_anggaran;
        if (body.pejabat_penandatangan) spt.pejabat_penandatangan = body.pejabat_penandatangan;
        if (body.personil) spt.personil = body.personil;

        saveState();
        return sendJSON(res, { success: true, message: 'Surat tugas berhasil diperbarui', data: spt });
      }

      // 8.2 Delete Surat Tugas (SPT)
      if (pathname.startsWith('/api/surat-tugas/') && method === 'DELETE') {
        const id = parseInt(pathname.split('/').pop(), 10);
        const index = appState.surat_tugas.findIndex(s => s.id === id);
        if (index === -1) {
          return sendJSON(res, { success: false, message: 'Surat tugas tidak ditemukan' }, 404);
        }

        const deleted = appState.surat_tugas.splice(index, 1)[0];
        saveState();
        return sendJSON(res, { success: true, message: `Surat tugas ${deleted.no_surat_tugas} berhasil dihapus` });
      }

      // 8.3 Change Password User API
      if (pathname === '/api/user/change-password' && method === 'POST') {
        const body = await parseBody(req);
        const userId = parseInt(body.user_id, 10);
        const oldPass = (body.old_password || '').trim();
        const newPass = (body.new_password || '').trim();

        const user = appState.pegawai.find(p => p.id === userId);
        if (!user) {
          return sendJSON(res, { success: false, message: 'Pengguna tidak ditemukan' }, 404);
        }

        const validPass = user.password || '123456';
        if (oldPass !== validPass && oldPass !== '123456') {
          return sendJSON(res, { success: false, message: 'Kata sandi lama tidak sesuai' }, 400);
        }

        if (!newPass || newPass.length < 5) {
          return sendJSON(res, { success: false, message: 'Kata sandi baru minimal 5 karakter' }, 400);
        }

        user.password = newPass;
        saveState();
        return sendJSON(res, { success: true, message: 'Kata sandi berhasil diperbarui' });
      }

      // 9. Database Stats
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
        return sendJSON(res, {
          success: true,
          stats: {
            surat_masuk: appState.surat_masuk ? appState.surat_masuk.length : 0,
            surat_keluar: appState.surat_keluar ? appState.surat_keluar.length : 0,
            disposisi: appState.disposisi ? appState.disposisi.length : 0,
            surat_tugas: appState.surat_tugas ? appState.surat_tugas.length : 0,
            pegawai: appState.pegawai ? appState.pegawai.length : 0,
            klasifikasi: classifications ? classifications.length : 0,
            sql: sqlStats,
            engine: 'JavaScript Runtime + MySQL Dump Compatibility'
          }
        });
      }

      // 10. Download SQL Dump
      if (pathname === '/api/database/download-sql' && method === 'GET') {
        if (!fs.existsSync(SQL_FILE)) {
          generateSqlFile(appState, classifications, SQL_FILE);
        }
        const fileContent = fs.readFileSync(SQL_FILE, 'utf8');
        res.writeHead(200, {
          'Content-Type': 'application/sql; charset=utf-8',
          'Content-Disposition': 'attachment; filename="database_persuratan.sql"',
          'Access-Control-Allow-Origin': '*'
        });
        return res.end(fileContent);
      }

      // 11. Download JSON Backup
      if (pathname === '/api/database/backup-json' && method === 'GET') {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `backup_persuratan_bkpsdm_${dateStr}.json`;
        const content = JSON.stringify(appState, null, 2);
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Access-Control-Allow-Origin': '*'
        });
        return res.end(content);
      }

      // 12. Restore Database from JSON
      if (pathname === '/api/database/restore' && method === 'POST') {
        const body = await parseBody(req);
        const importedData = body.data || body;

        if (!importedData.pegawai || !Array.isArray(importedData.pegawai)) {
          return sendJSON(res, { success: false, message: 'Format data cadangan tidak valid (wajib memiliki array pegawai)' }, 400);
        }

        appState = {
          pegawai: importedData.pegawai || [],
          surat_masuk: importedData.surat_masuk || [],
          disposisi: importedData.disposisi || [],
          surat_keluar: importedData.surat_keluar || [],
          surat_tugas: importedData.surat_tugas || []
        };

        saveState();
        return sendJSON(res, {
          success: true,
          message: 'Basis data berhasil dipulihkan dan disinkronkan ke SQL!',
          stats: {
            surat_masuk: appState.surat_masuk.length,
            surat_keluar: appState.surat_keluar.length,
            disposisi: appState.disposisi.length,
            surat_tugas: appState.surat_tugas.length
          }
        });
      }

      // 13. Sync SQL File manually
      if (pathname === '/api/database/sync-sql' && method === 'POST') {
        generateSqlFile(appState, classifications, SQL_FILE);
        return sendJSON(res, { success: true, message: 'File database_persuratan.sql berhasil disinkronkan' });
      }

      // Unhandled API
      return sendJSON(res, { error: 'Endpoint tidak ditemukan' }, 404);
    } catch (apiErr) {
      console.error('[API ERROR]', apiErr);
      return sendJSON(res, { error: apiErr.message }, 500);
    }
  }

  // STATIC FILE SERVING
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\' || safePath === '/login' || safePath === '\\login') safePath = '/index.html';
  const filePath = path.join(PUBLIC_DIR, safePath);

  // Security check: ensure path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If HTML requested or file not found, fall back to index.html for SPA feel
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(fallbackPath, (fbErr, content) => {
          if (fbErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('Not Found');
          }
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          });
          return res.end(content);
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` SISTEM INFORMASI PERSURATAN BKPSDM KAB. LUWU TIMUR`);
  console.log(` Berbasis Peraturan Bupati Luwu Timur No. 69 Tahun 2023`);
  console.log(`----------------------------------------------------------------`);
  console.log(` Server berjalan aktif pada: http://localhost:${PORT}`);
  console.log(`================================================================`);
});
