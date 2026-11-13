const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, '..', 'data', 'current_state.json');
const INITIAL_FILE = path.join(__dirname, '..', 'data', 'initial_state.json');

const sampleDisposisi = [
  {
    id: 1,
    id_surat_masuk: 1,
    dari_user: 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
    diteruskan_kepada: ['4. Kabid. Pengembangan Sumber Daya Aparatur'],
    tujuan_user_id: null,
    tujuan_nama: '4. Kabid. Pengembangan Sumber Daya Aparatur',
    sifat: 'B. Segera',
    instruksi: ['Laksanakan', 'Proses Sesuai Ketentuan'],
    catatan: 'Verifikasi berkas usulan kenaikan jenjang yang bersangkutan dan tindak lanjuti sesuai ketentuan BKN.',
    batas_waktu: '2026-02-05',
    status_tindak_lanjut: 'Diproses',
    created_at: '2026-01-29 09:30:00',
    tindak_lanjut_note: ''
  },
  {
    id: 2,
    id_surat_masuk: 2,
    dari_user: 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
    diteruskan_kepada: ['4. Kabid. Pengembangan Sumber Daya Aparatur'],
    tujuan_user_id: null,
    tujuan_nama: '4. Kabid. Pengembangan Sumber Daya Aparatur',
    sifat: 'B. Segera',
    instruksi: ['Proses Sesuai Ketentuan'],
    catatan: 'Teliti kelengkapan dokumen kenaikan jenjang jabatan fungsional.',
    batas_waktu: '2026-02-05',
    status_tindak_lanjut: 'Diproses',
    created_at: '2026-01-29 10:15:00',
    tindak_lanjut_note: ''
  },
  {
    id: 3,
    id_surat_masuk: 3,
    dari_user: 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
    diteruskan_kepada: ['6. Kabid. Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian'],
    tujuan_user_id: null,
    tujuan_nama: '6. Kabid. Pengadaan, Pemberhentian, Kinerja, dan Informasi Kepegawaian',
    sifat: 'B. Segera',
    instruksi: ['Koordinasikan/Konfirmasikan', 'Siapkan Bahan'],
    catatan: 'Cek peta jabatan dan ketersediaan formasi JF Pranata Laboratorium Kesehatan Dinkes.',
    batas_waktu: '2026-02-06',
    status_tindak_lanjut: 'Diproses',
    created_at: '2026-01-29 11:00:00',
    tindak_lanjut_note: ''
  },
  {
    id: 4,
    id_surat_masuk: 4,
    dari_user: 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
    diteruskan_kepada: ['1. Sekertaris', '3. Kasubag. Perencana dan Keuangan'],
    tujuan_user_id: null,
    tujuan_nama: '1. Sekertaris, 3. Kasubag. Perencana dan Keuangan',
    sifat: 'A. Sangat Segera',
    instruksi: ['Siapkan Bahan', 'Jadwalkan/Laporkan'],
    catatan: 'Segera himpun data dukung capaian kinerja kepegawaian untuk LPPD Tahun 2025.',
    batas_waktu: '2026-02-04',
    status_tindak_lanjut: 'Diproses',
    created_at: '2026-01-29 13:45:00',
    tindak_lanjut_note: ''
  },
  {
    id: 5,
    id_surat_masuk: 5,
    dari_user: 'PARHA ARIEF, S.AP (Kepala BKPSDM)',
    diteruskan_kepada: ['1. Sekertaris', '2. Kasubag. Umum dan Kepegawaian'],
    tujuan_user_id: null,
    tujuan_nama: '1. Sekertaris, 2. Kasubag. Umum dan Kepegawaian',
    sifat: 'B. Segera',
    instruksi: ['Tanggapan/Saran', 'Laksanakan'],
    catatan: 'Pelajari dan jadikan pedoman tata kelola administrasi kepegawaian TA 2026.',
    batas_waktu: '2026-02-07',
    status_tindak_lanjut: 'Diproses',
    created_at: '2026-01-30 08:30:00',
    tindak_lanjut_note: ''
  }
];

function seed(filePath) {
  if (!fs.existsSync(filePath)) return;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.disposisi = sampleDisposisi;
  
  // Set status_disposisi for the first 5 surat masuk to 'Didisposisi'
  data.surat_masuk.forEach(sm => {
    if (sampleDisposisi.some(d => d.id_surat_masuk === sm.id)) {
      sm.status_disposisi = 'Didisposisi';
    } else {
      sm.status_disposisi = 'Menunggu Disposisi';
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully seeded ${filePath}: ${sampleDisposisi.length} disposisi records.`);
}

seed(STATE_FILE);
seed(INITIAL_FILE);
