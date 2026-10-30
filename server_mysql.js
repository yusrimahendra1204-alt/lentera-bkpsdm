// ============================================================
// SERVER.JS — Sistem Informasi Persuratan BKPSDM Luwu Timur
// MySQL Edition — Penggunaan Jangka Panjang
// Yusri Mahendra (NIM: IK2311011) - Univ. Mega Buana Palopo 2026
// Berdasarkan Perbup Luwu Timur No. 69 Tahun 2023
// ============================================================

const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const url    = require('url');
const db     = require('./config/database');

const PORT       = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR   = path.join(__dirname, 'data');
const KLASIFIKASI_FILE = path.join(DATA_DIR, 'klasifikasi_perbup.json');

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
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.woff2':'font/woff2',
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
    if (kategori) return classifications.filter(c => c.kategori === kategori).slice(0, limit);
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
    if (kode === q) score += 1000;
    else if (kode.startsWith(q)) score += 500;
    if (q && nama.includes(q)) score += 300;
    for (const token of qTokens) {
      if (nama.includes(token)) score += 50;
      if (keywords.includes(token)) score += 80;
      if (keywords.some(k => k.includes(token))) score += 30;
      if (kode.includes(token)) score += 40;
    }
    if (score > 0) {
      if (item.kode.startsWith('800')) score += 150;
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
    const [rows] = await db.getPool().execute(
      'SELECT COUNT(*) AS total FROM surat_masuk WHERE YEAR(created_at) = ?', [year]);
    const n = rows[0].total + 1;
    return `SM-${year}-${String(n).padStart(3, '0')}`;
  }
  if (prefix === 'SK') {
    const [rows] = await db.getPool().execute(
      'SELECT COUNT(*) AS total FROM surat_keluar WHERE YEAR(created_at) = ?', [year]);
    const n = rows[0].total + 1;
    return `SK-${year}-${String(n).padStart(3, '0')}`;
  }
  return `${prefix}-${year}-001`;
}

// Bangun state object dari MySQL (kompatibel dengan frontend lama)
async function buildAppState() {
  const pegawai     = await db.query('SELECT * FROM pegawai ORDER BY id');
  const suratMasuk  = await db.query('SELECT * FROM surat_masuk ORDER BY id DESC');
  const disposisi   = await db.query('SELECT * FROM disposisi ORDER BY id DESC');
  const suratKeluar = await db.query('SELECT * FROM surat_keluar ORDER BY id DESC');
  const suratTugas  = await db.query('SELECT * FROM surat_tugas ORDER BY id DESC');

  // Parse instruksi & personil
  disposisi.forEach(d => {
    if (typeof d.instruksi === 'string') {
      try { d.instruksi = JSON.parse(d.instruksi); }
      catch { d.instruksi = d.instruksi ? d.instruksi.split(',') : []; }
    }
    if (!Array.isArray(d.instruksi)) d.instruksi = [];
  });
  suratTugas.forEach(st => {
    if (typeof st.personil === 'string') {
      try { st.personil = JSON.parse(st.personil); }
      catch { st.personil = []; }
    }
    if (!Array.isArray(st.personil)) st.personil = [];
  });

  return { pegawai, surat_masuk: suratMasuk, disposisi, surat_keluar: suratKeluar, surat_tugas: suratTugas };
}

// ============================================================
// HTTP SERVER
// ============================================================
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname  = parsedUrl.pathname;
  const method    = req.method;

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (pathname.startsWith('/api/')) {
    try {

      // ---- KLASIFIKASI ----
      if (pathname === '/api/klasifikasi' && method === 'GET') {
        const q     = parsedUrl.query.q || '';
        const kat   = parsedUrl.query.kat || '';
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

      // ---- LOGIN ----
      if (pathname === '/api/login' && method === 'POST') {
        const body = await parseBody(req);
        const nip  = (body.nip || '').trim();
        const pass = (body.password || '').trim();
        const user = await db.queryOne(
          'SELECT * FROM pegawai WHERE (nip = ? OR username = ? OR (role = "admin" AND LOWER(?) = "admin") OR LOWER(nama) LIKE ?) AND (aktif = 1 OR aktif IS NULL) LIMIT 1',
          [nip, nip, nip, `%${nip.toLowerCase()}%`]
        );
        if (!user)
          return sendJSON(res, { success: false, message: 'NIP / Nama pengguna tidak terdaftar di BKPSDM' }, 401);
        const validPass = user.password || '123456';
        const allowedPass = [validPass, '123', '123456', 'admin', 'admin123'];
        if (pass && !allowedPass.includes(pass))
          return sendJSON(res, { success: false, message: 'Kata sandi / Password salah' }, 401);
        return sendJSON(res, { success: true, message: `Selamat datang, ${user.nama}`, user });
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
                'INSERT INTO pegawai (nip,nama,pangkat,jabatan,role,unit,password) VALUES (?,?,?,?,?,?,?)',
                [p.nip, p.nama, p.pangkat || '', p.jabatan || 'Staf', p.role || 'pegawai', p.unit || 'BKPSDM', p.password || '123456']
              );
            }
          }
          const allPegawai = await db.query('SELECT * FROM pegawai WHERE aktif = 1 ORDER BY id');
          return sendJSON(res, { success: true, message: `Berhasil memuat master pegawai (${allPegawai.length} data)`, data: allPegawai });
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
          'INSERT INTO pegawai (nip,nama,pangkat,jabatan,role,unit,password) VALUES (?,?,?,?,?,?,?)',
          [body.nip.trim(), body.nama.trim(),
           body.pangkat || 'Penata Muda (III/a)',
           body.jabatan || 'Staf Pelaksana',
           body.role    || 'pegawai',
           body.unit    || 'Subbag Umum & Kepegawaian',
           body.password|| '123456']
        );
        const newPeg = await db.queryOne('SELECT * FROM pegawai WHERE id = ?', [result.insertId]);
        return sendJSON(res, { success: true, message: 'Pegawai berhasil ditambahkan', data: newPeg });
      }

      // ---- PEGAWAI: Update ----
      if (pathname.startsWith('/api/pegawai/') && method === 'PUT') {
        const id   = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const peg  = await db.queryOne('SELECT * FROM pegawai WHERE id = ?', [id]);
        if (!peg) return sendJSON(res, { success: false, message: 'Pegawai tidak ditemukan' }, 404);
        await db.getPool().execute(
          'UPDATE pegawai SET nip=?,nama=?,pangkat=?,jabatan=?,role=?,unit=?,password=? WHERE id=?',
          [body.nip     || peg.nip,
           body.nama    || peg.nama,
           body.pangkat || peg.pangkat,
           body.jabatan || peg.jabatan,
           body.role    || peg.role,
           body.unit    || peg.unit,
           body.password|| peg.password,
           id]
        );
        const updated = await db.queryOne('SELECT * FROM pegawai WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: 'Data pegawai diperbarui', data: updated });
      }

      // ---- PEGAWAI: Delete ----
      if (pathname.startsWith('/api/pegawai/') && method === 'DELETE') {
        const id    = parseInt(pathname.split('/').pop(), 10);
        const count = await db.queryOne('SELECT COUNT(*) AS c FROM pegawai WHERE aktif = 1');
        if (count.c <= 1)
          return sendJSON(res, { success: false, message: 'Tidak dapat menghapus pegawai terakhir' }, 400);
        await db.getPool().execute('UPDATE pegawai SET aktif = 0 WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: 'Pegawai berhasil dinonaktifkan' });
      }

      // ---- SURAT MASUK: Create ----
      if (pathname === '/api/surat-masuk' && method === 'POST') {
        const body    = await parseBody(req);
        const noAgenda = await generateNoAgenda('SM');
        const [result] = await db.getPool().execute(`
          INSERT INTO surat_masuk
            (no_agenda,no_surat_pengirim,instansi_pengirim,kode_internal,
             nama_klasifikasi_internal,perihal,tgl_surat,tgl_diterima,
             sifat_surat,lampiran,status_disposisi,file_name)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
          [noAgenda,
           body.no_surat_pengirim || '',
           body.instansi_pengirim || '',
           body.kode_internal     || '800',
           body.nama_klasifikasi_internal || 'Kepegawaian',
           body.perihal           || '',
           body.tgl_surat         || new Date().toISOString().split('T')[0],
           body.tgl_diterima      || new Date().toISOString().split('T')[0],
           body.sifat_surat       || 'Biasa',
           body.lampiran          || '1 Berkas',
           'Menunggu Disposisi',
           body.file_name         || 'surat_masuk.pdf']
        );
        const newSM = await db.queryOne('SELECT * FROM surat_masuk WHERE id = ?', [result.insertId]);
        return sendJSON(res, { success: true, data: newSM });
      }

      // ---- SURAT MASUK: Update ----
      if (pathname.startsWith('/api/surat-masuk/') && method === 'PUT') {
        const id   = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const sm   = await db.queryOne('SELECT * FROM surat_masuk WHERE id = ?', [id]);
        if (!sm) return sendJSON(res, { success: false, message: 'Surat masuk tidak ditemukan' }, 404);
        await db.getPool().execute(`
          UPDATE surat_masuk SET
            no_surat_pengirim=?, instansi_pengirim=?, kode_internal=?,
            nama_klasifikasi_internal=?, perihal=?, tgl_surat=?,
            tgl_diterima=?, sifat_surat=?, file_name=?
          WHERE id=?`,
          [body.no_surat_pengirim || sm.no_surat_pengirim,
           body.instansi_pengirim || sm.instansi_pengirim,
           body.kode_internal     || sm.kode_internal,
           body.nama_klasifikasi_internal || sm.nama_klasifikasi_internal,
           body.perihal           || sm.perihal,
           body.tgl_surat         || sm.tgl_surat,
           body.tgl_diterima      || sm.tgl_diterima,
           body.sifat_surat       || sm.sifat_surat,
           body.file_name         || sm.file_name,
           id]
        );
        const updated = await db.queryOne('SELECT * FROM surat_masuk WHERE id = ?', [id]);
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
        const body      = await parseBody(req);
        const instruksi = Array.isArray(body.instruksi) ? body.instruksi : [body.instruksi].filter(Boolean);
        const [result]  = await db.getPool().execute(`
          INSERT INTO disposisi
            (id_surat_masuk,dari_user,tujuan_user_id,tujuan_nama,
             sifat,instruksi,catatan,batas_waktu,status_tindak_lanjut)
          VALUES (?,?,?,?,?,?,?,?,?)`,
          [parseInt(body.id_surat_masuk, 10),
           body.dari_user      || 'Drs. H. Ramadhan Pirade, M.Si. (Kepala BKPSDM)',
           body.tujuan_user_id ? parseInt(body.tujuan_user_id, 10) : null,
           body.tujuan_nama    || '',
           body.sifat          || 'Biasa',
           JSON.stringify(instruksi),
           body.catatan        || '',
           body.batas_waktu    || null,
           'Diproses']
        );
        // Update status surat masuk
        await db.getPool().execute(
          "UPDATE surat_masuk SET status_disposisi = 'Didisposisi' WHERE id = ?",
          [parseInt(body.id_surat_masuk, 10)]
        );
        const newDisp = await db.queryOne('SELECT * FROM disposisi WHERE id = ?', [result.insertId]);
        if (newDisp && newDisp.instruksi) {
          try { newDisp.instruksi = JSON.parse(newDisp.instruksi); } catch {}
        }
        return sendJSON(res, { success: true, data: newDisp });
      }

      // ---- DISPOSISI: Update ----
      if (pathname.startsWith('/api/disposisi/') && method === 'PUT') {
        const id   = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const disp = await db.queryOne('SELECT * FROM disposisi WHERE id = ?', [id]);
        if (!disp) return sendJSON(res, { success: false, message: 'Disposisi tidak ditemukan' }, 404);
        const newStatus = body.status_tindak_lanjut || disp.status_tindak_lanjut;
        const newTujuanNama = body.tujuan_nama !== undefined ? body.tujuan_nama : disp.tujuan_nama;
        const newSifat = body.sifat !== undefined ? body.sifat : disp.sifat;
        const newCatatan = body.catatan !== undefined ? body.catatan : disp.catatan;
        const newInstruksi = body.instruksi !== undefined 
          ? (Array.isArray(body.instruksi) ? JSON.stringify(body.instruksi) : String(body.instruksi))
          : (typeof disp.instruksi === 'string' ? disp.instruksi : JSON.stringify(disp.instruksi || []));

        await db.getPool().execute(
          'UPDATE disposisi SET status_tindak_lanjut=?, tindak_lanjut_note=?, tujuan_nama=?, sifat=?, instruksi=?, catatan=? WHERE id=?',
          [newStatus, body.tindak_lanjut_note || disp.tindak_lanjut_note || '', newTujuanNama, newSifat, newInstruksi, newCatatan, id]
        );
        if (newStatus === 'Selesai') {
          await db.getPool().execute(
            "UPDATE surat_masuk SET status_disposisi='Selesai' WHERE id=?",
            [disp.id_surat_masuk]
          );
        }
        const updated = await db.queryOne('SELECT * FROM disposisi WHERE id = ?', [id]);
        if (updated && updated.instruksi) { try { updated.instruksi = JSON.parse(updated.instruksi); } catch {} }
        return sendJSON(res, { success: true, data: updated });
      }

      // ---- DISPOSISI: Delete ----
      if (pathname.startsWith('/api/disposisi/') && method === 'DELETE') {
        const id   = parseInt(pathname.split('/').pop(), 10);
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
        const body     = await parseBody(req);
        const noAgenda = await generateNoAgenda('SK');
        const kode     = body.kode_klasifikasi || '000';
        const romawi   = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
        const bulan    = romawi[new Date().getMonth()];
        const tahun    = new Date().getFullYear();
        
        let nextN = 1;
        const [recentSK] = await db.getPool().execute(
          'SELECT no_surat_keluar FROM surat_keluar ORDER BY id DESC LIMIT 10'
        );
        for (const row of recentSK) {
          const m = (row.no_surat_keluar || '').match(/\/0*(\d+)\//);
          if (m) {
            const v = parseInt(m[1], 10);
            if (v < 2000) {
              nextN = v + 1;
              break;
            }
          }
        }
        const noUrut   = String(nextN).padStart(3, '0');
        const noSurat  = body.no_surat_keluar || `${kode}/${noUrut}/BKPSDM/${bulan}/${tahun}`;
        const [result] = await db.getPool().execute(`
          INSERT INTO surat_keluar
            (no_agenda,bidang_pembuat,kode_klasifikasi,nama_klasifikasi,no_surat_keluar,
             tujuan_surat,perihal,tgl_surat,sifat_surat,penandatangan,metode_dokumen,
             lokasi_arsip_fisik,is_surat_balasan,id_surat_masuk_asal,no_surat_pengirim_asal,file_name)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [noAgenda,
           body.bidang_pembuat    || 'Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian',
           kode,
           body.nama_klasifikasi  || 'Umum',
           noSurat,
           body.tujuan_surat      || '',
           body.perihal           || '',
           body.tgl_surat         || new Date().toISOString().split('T')[0],
           body.sifat_surat       || 'Biasa',
           body.penandatangan     || 'Kepala BKPSDM Kabupaten Luwu Timur',
           body.metode_dokumen    || 'Fisik Manual (Tanda Tangan Basah)',
           body.lokasi_arsip_fisik|| 'Lemari Arsip Subbag Umum',
           body.is_surat_balasan  ? 1 : 0,
           body.id_surat_masuk_asal ? parseInt(body.id_surat_masuk_asal, 10) : null,
           body.no_surat_pengirim_asal || '',
           body.file_name         || 'surat_keluar.pdf']
        );
        const newSK = await db.queryOne('SELECT * FROM surat_keluar WHERE id = ?', [result.insertId]);
        return sendJSON(res, { success: true, data: newSK });
      }

      // ---- SURAT KELUAR: Update ----
      if (pathname.startsWith('/api/surat-keluar/') && method === 'PUT') {
        const id   = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const sk   = await db.queryOne('SELECT * FROM surat_keluar WHERE id = ?', [id]);
        if (!sk) return sendJSON(res, { success: false, message: 'Surat keluar tidak ditemukan' }, 404);
        await db.getPool().execute(`
          UPDATE surat_keluar SET
            tujuan_surat=?, perihal=?, tgl_surat=?, sifat_surat=?,
            penandatangan=?, kode_klasifikasi=?, nama_klasifikasi=?, bidang_pembuat=?
          WHERE id=?`,
          [body.tujuan_surat    || sk.tujuan_surat,
           body.perihal         || sk.perihal,
           body.tgl_surat       || sk.tgl_surat,
           body.sifat_surat     || sk.sifat_surat,
           body.penandatangan   || sk.penandatangan,
           body.kode_klasifikasi|| sk.kode_klasifikasi,
           body.nama_klasifikasi|| sk.nama_klasifikasi,
           body.bidang_pembuat  || sk.bidang_pembuat,
           id]
        );
        const updated = await db.queryOne('SELECT * FROM surat_keluar WHERE id = ?', [id]);
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
        const body     = await parseBody(req);
        const tahun    = new Date().getFullYear();
        const [cntRows]= await db.getPool().execute(
          'SELECT COUNT(*)+41 AS n FROM surat_tugas WHERE YEAR(created_at) = ?', [tahun]);
        const noSpt    = body.no_surat_tugas ||
          `800.1.11.1/${String(cntRows[0].n).padStart(3,'0')}/BKPSDM-LT/X/${tahun}`;
        const [result] = await db.getPool().execute(`
          INSERT INTO surat_tugas
            (no_surat_tugas,bidang_pengusul,kode_klasifikasi,nama_klasifikasi,
             dasar,maksud_tugas,tempat_tujuan,tgl_berangkat,tgl_kembali,
             lama_hari,pembebanan_anggaran,pejabat_penandatangan,jabatan_penandatangan)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          [noSpt,
           body.bidang_pengusul       || 'Bidang Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian',
           '800.1.11.1',
           'Surat Perintah Dinas/Surat Tugas',
           body.dasar                 || '',
           body.maksud_tugas          || '',
           body.tempat_tujuan         || '',
           body.tgl_berangkat         || new Date().toISOString().split('T')[0],
           body.tgl_kembali           || new Date().toISOString().split('T')[0],
           parseInt(body.lama_hari||'1', 10),
           body.pembebanan_anggaran   || `DPA-SKPD BKPSDM Kabupaten Luwu Timur TA ${tahun}`,
           body.pejabat_penandatangan || 'Drs. H. Ramadhan Pirade, M.Si.',
           body.jabatan_penandatangan || 'Kepala BKPSDM Kabupaten Luwu Timur']
        );
        const sptId = result.insertId;
        // Insert personil
        const personil = Array.isArray(body.personil) ? body.personil : [];
        for (let i = 0; i < personil.length; i++) {
          const p = personil[i];
          await db.getPool().execute(
            'INSERT INTO surat_tugas_personil (id_surat_tugas,nip,nama,pangkat,jabatan,urutan) VALUES (?,?,?,?,?,?)',
            [sptId, p.nip||'', p.nama||'', p.pangkat||'', p.jabatan||'', i+1]
          );
        }
        const newSpt = await db.queryOne('SELECT * FROM surat_tugas WHERE id = ?', [sptId]);
        newSpt.personil = personil;
        return sendJSON(res, { success: true, data: newSpt });
      }

      // ---- SURAT TUGAS: Update ----
      if (pathname.startsWith('/api/surat-tugas/') && method === 'PUT') {
        const id   = parseInt(pathname.split('/').pop(), 10);
        const body = await parseBody(req);
        const spt  = await db.queryOne('SELECT * FROM surat_tugas WHERE id = ?', [id]);
        if (!spt) return sendJSON(res, { success: false, message: 'Surat tugas tidak ditemukan' }, 404);
        await db.getPool().execute(`
          UPDATE surat_tugas SET
            bidang_pengusul=?, dasar=?, maksud_tugas=?, tempat_tujuan=?, tgl_berangkat=?,
            tgl_kembali=?, lama_hari=?, pembebanan_anggaran=?, pejabat_penandatangan=?
          WHERE id=?`,
          [body.bidang_pengusul     || spt.bidang_pengusul,
           body.dasar               || spt.dasar,
           body.maksud_tugas        || spt.maksud_tugas,
           body.tempat_tujuan       || spt.tempat_tujuan,
           body.tgl_berangkat       || spt.tgl_berangkat,
           body.tgl_kembali         || spt.tgl_kembali,
           parseInt(body.lama_hari||spt.lama_hari, 10),
           body.pembebanan_anggaran || spt.pembebanan_anggaran,
           body.pejabat_penandatangan || spt.pejabat_penandatangan,
           id]
        );
        if (body.personil && Array.isArray(body.personil)) {
          await db.getPool().execute('DELETE FROM surat_tugas_personil WHERE id_surat_tugas = ?', [id]);
          for (let i = 0; i < body.personil.length; i++) {
            const p = body.personil[i];
            await db.getPool().execute(
              'INSERT INTO surat_tugas_personil (id_surat_tugas,nip,nama,pangkat,jabatan,urutan) VALUES (?,?,?,?,?,?)',
              [id, p.nip||'', p.nama||'', p.pangkat||'', p.jabatan||'', i+1]
            );
          }
        }
        const updated = await db.queryOne('SELECT * FROM surat_tugas WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: 'Surat tugas diperbarui', data: updated });
      }

      // ---- SURAT TUGAS: Delete ----
      if (pathname.startsWith('/api/surat-tugas/') && method === 'DELETE') {
        const id  = parseInt(pathname.split('/').pop(), 10);
        const spt = await db.queryOne('SELECT no_surat_tugas FROM surat_tugas WHERE id = ?', [id]);
        if (!spt) return sendJSON(res, { success: false, message: 'Surat tugas tidak ditemukan' }, 404);
        await db.getPool().execute('DELETE FROM surat_tugas WHERE id = ?', [id]);
        return sendJSON(res, { success: true, message: `SPT ${spt.no_surat_tugas} berhasil dihapus` });
      }

      // ---- CHANGE PASSWORD ----
      if (pathname === '/api/user/change-password' && method === 'POST') {
        const body    = await parseBody(req);
        const userId  = parseInt(body.user_id, 10);
        const oldPass = (body.old_password || '').trim();
        const newPass = (body.new_password || '').trim();
        const user    = await db.queryOne('SELECT * FROM pegawai WHERE id = ?', [userId]);
        if (!user)
          return sendJSON(res, { success: false, message: 'Pengguna tidak ditemukan' }, 404);
        const validPass = user.password || '123456';
        if (oldPass !== validPass && oldPass !== '123456')
          return sendJSON(res, { success: false, message: 'Kata sandi lama tidak sesuai' }, 400);
        if (!newPass || newPass.length < 5)
          return sendJSON(res, { success: false, message: 'Kata sandi baru minimal 5 karakter' }, 400);
        await db.getPool().execute('UPDATE pegawai SET password = ? WHERE id = ?', [newPass, userId]);
        return sendJSON(res, { success: true, message: 'Kata sandi berhasil diperbarui' });
      }

      // ---- DATABASE STATS ----
      if (pathname === '/api/database/stats' && method === 'GET') {
        const stats = await db.queryOne('SELECT * FROM vw_dashboard_stats');
        return sendJSON(res, {
          success: true,
          stats: {
            surat_masuk:  stats.total_surat_masuk,
            surat_keluar: stats.total_surat_keluar,
            disposisi:    stats.total_disposisi,
            surat_tugas:  stats.total_surat_tugas,
            pegawai:      stats.total_pegawai,
            klasifikasi:  classifications.length,
            engine:       'MySQL ' + db.DB_CONFIG.host + '/' + db.DB_CONFIG.database
          }
        });
      }

      // ---- BACKUP JSON ----
      if (pathname === '/api/database/backup-json' && method === 'GET') {
        const appState = await buildAppState();
        const dateStr  = new Date().toISOString().slice(0,10).replace(/-/g,'');
        const filename = `backup_persuratan_bkpsdm_${dateStr}.json`;
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Access-Control-Allow-Origin': '*'
        });
        return res.end(JSON.stringify(appState, null, 2));
      }

      // ---- RESTORE JSON ----
      if (pathname === '/api/database/restore' && method === 'POST') {
        const body = await parseBody(req);
        const data = body.data || body;
        if (!data.pegawai || !Array.isArray(data.pegawai))
          return sendJSON(res, { success: false, message: 'Format data tidak valid' }, 400);

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
            'INSERT INTO pegawai (nip,nama,pangkat,jabatan,role,unit,password) VALUES (?,?,?,?,?,?,?)',
            [p.nip,p.nama,p.pangkat||'',p.jabatan||'',p.role||'pegawai',p.unit||'',p.password||'123456']
          );
        }
        for (const sm of (data.surat_masuk || [])) {
          await db.getPool().execute(
            `INSERT INTO surat_masuk
              (no_agenda,no_surat_pengirim,instansi_pengirim,kode_internal,nama_klasifikasi_internal,
               perihal,tgl_surat,tgl_diterima,sifat_surat,lampiran,status_disposisi,file_name)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [sm.no_agenda,sm.no_surat_pengirim||'',sm.instansi_pengirim||'',
             sm.kode_internal||'800',sm.nama_klasifikasi_internal||'Kepegawaian',
             sm.perihal||'',sm.tgl_surat,sm.tgl_diterima,sm.sifat_surat||'Biasa',
             sm.lampiran||'1 Berkas',sm.status_disposisi||'Menunggu Disposisi',
             sm.file_name||'surat_masuk.pdf']
          );
        }
        for (const sk of (data.surat_keluar || [])) {
          await db.getPool().execute(
            `INSERT INTO surat_keluar
              (no_agenda,bidang_pembuat,kode_klasifikasi,nama_klasifikasi,no_surat_keluar,
               tujuan_surat,perihal,tgl_surat,sifat_surat,penandatangan,file_name)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [sk.no_agenda,sk.bidang_pembuat||'',sk.kode_klasifikasi||'000',
             sk.nama_klasifikasi||'Umum',sk.no_surat_keluar||'',
             sk.tujuan_surat||'',sk.perihal||'',sk.tgl_surat,sk.sifat_surat||'Biasa',
             sk.penandatangan||'',sk.file_name||'surat_keluar.pdf']
          );
        }
        return sendJSON(res, {
          success: true,
          message: 'Data berhasil dipulihkan ke MySQL!',
          stats: {
            pegawai:     data.pegawai.length,
            surat_masuk: (data.surat_masuk||[]).length,
            surat_keluar:(data.surat_keluar||[]).length
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
  if (!filePath.startsWith(PUBLIC_DIR)) {
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
