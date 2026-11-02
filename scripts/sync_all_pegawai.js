const fs = require('fs');
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '2Sw3Ep8LH64tjUC.root',
    password: 'BmQmrKut89t8a5c0',
    database: 'persuratan_bkpsdm',
    ssl: { rejectUnauthorized: true }
  });

  const rawList = JSON.parse(fs.readFileSync('data/master_pegawai_bkpsdm_final.json', 'utf8'));
  console.log('Syncing all 44 pegawai...');

  // Always keep Yusri Mahendra as id: 1 (admin)
  await conn.query(`
    INSERT INTO pegawai (id, nip, nama, pangkat, jabatan, role, unit, password, username, aktif)
    VALUES (1, '199911202025211015', 'YUSRI MAHENDRA', 'Pengatur Muda (II/a)', 'Administrator Sistem Persuratan (Subbag Umum)', 'admin', 'Subbag Umum & Kepegawaian', '123', 'admin', 1)
    ON DUPLICATE KEY UPDATE
      nama = VALUES(nama),
      pangkat = VALUES(pangkat),
      jabatan = VALUES(jabatan),
      role = VALUES(role),
      unit = VALUES(unit),
      password = VALUES(password),
      username = VALUES(username),
      aktif = 1
  `);

  // Insert Parha Arief as id: 43
  await conn.query(`
    INSERT INTO pegawai (id, nip, nama, pangkat, jabatan, role, unit, password, username, aktif)
    VALUES (43, '198401142003122001', 'PARHA ARIEF, S.AP', 'Pembina, IV/a', 'Kepala BKPSDM', 'kepala_bkpsdm', 'Pimpinan', '123456', '198401142003122001', 1)
    ON DUPLICATE KEY UPDATE
      nama = VALUES(nama),
      pangkat = VALUES(pangkat),
      jabatan = VALUES(jabatan),
      role = VALUES(role),
      unit = VALUES(unit),
      username = VALUES(username),
      aktif = 1
  `);

  for (const p of rawList) {
    if (p.nip === '198401142003122001' || p.nip === '199911202025211015') continue;

    await conn.query(`
      INSERT INTO pegawai (id, nip, nama, pangkat, jabatan, role, unit, password, username, aktif)
      VALUES (?, ?, ?, ?, ?, ?, ?, '123456', ?, 1)
      ON DUPLICATE KEY UPDATE
        nama = VALUES(nama),
        pangkat = VALUES(pangkat),
        jabatan = VALUES(jabatan),
        role = VALUES(role),
        unit = VALUES(unit),
        username = VALUES(username),
        aktif = 1
    `, [p.id, p.nip, p.nama, p.pangkat || '', p.jabatan || 'Staf', p.role || 'pegawai', p.unit || 'BKPSDM', p.nip]);
  }

  const [rows] = await conn.query('SELECT count(*) as cnt FROM pegawai');
  console.log('Total pegawai now in database:', rows[0].cnt);

  // Also update data/current_state.json and data/initial_state.json
  const [allPeg] = await conn.query('SELECT * FROM pegawai ORDER BY id ASC');
  ['data/current_state.json', 'data/initial_state.json'].forEach(file => {
    if (fs.existsSync(file)) {
      const state = JSON.parse(fs.readFileSync(file, 'utf8'));
      state.pegawai = allPeg;
      fs.writeFileSync(file, JSON.stringify(state, null, 2), 'utf8');
      console.log('Updated', file, 'with', allPeg.length, 'pegawai');
    }
  });

  await conn.end();
}

run().catch(console.error);
