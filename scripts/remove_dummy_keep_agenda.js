const fs = require('fs');
const path = require('path');
const { generateSqlFile } = require('./generate_sql');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATE_FILE = path.join(DATA_DIR, 'current_state.json');
const INITIAL_FILE = path.join(DATA_DIR, 'initial_state.json');
const KLASIFIKASI_FILE = path.join(DATA_DIR, 'klasifikasi_perbup.json');
const SQL_FILE = path.join(__dirname, '..', 'database_persuratan.sql');

console.log('[1/4] Loading state...');
const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));

console.log('Original counts:', {
  pegawai: state.pegawai?.length,
  surat_masuk: state.surat_masuk?.length,
  disposisi: state.disposisi?.length,
  surat_keluar: state.surat_keluar?.length,
  surat_tugas: state.surat_tugas?.length
});

// 1. Clear dummy disposisi
state.disposisi = [];

// 2. Reset status_disposisi on all 130 authentic Surat Masuk
state.surat_masuk = state.surat_masuk.map(sm => {
  return {
    ...sm,
    status_disposisi: 'Menunggu Disposisi'
  };
});

// 3. Reset dummy personil on all 134 authentic Surat Tugas (in Excel there were no personil columns)
state.surat_tugas = state.surat_tugas.map(st => {
  return {
    ...st,
    personil: []
  };
});

console.log('[2/4] Cleaned counts (Agenda authentic data preserved):', {
  pegawai: state.pegawai?.length,
  surat_masuk: state.surat_masuk?.length,
  disposisi: state.disposisi?.length,
  surat_keluar: state.surat_keluar?.length,
  surat_tugas: state.surat_tugas?.length
});

// 4. Save to current_state.json and initial_state.json
console.log('[3/4] Saving JSON files...');
fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
fs.writeFileSync(INITIAL_FILE, JSON.stringify(state, null, 2), 'utf8');

// 5. Regenerate database_persuratan.sql
console.log('[4/4] Regenerating database_persuratan.sql...');
const classifications = JSON.parse(fs.readFileSync(KLASIFIKASI_FILE, 'utf8'));
generateSqlFile(state, classifications, SQL_FILE);

console.log('SUCCESS! All dummy data removed while preserving 100% of the authentic agenda provided.');
