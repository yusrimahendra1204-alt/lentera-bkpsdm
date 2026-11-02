<?php

namespace Database\Seeders;

use App\Models\Pegawai;
use App\Models\KlasifikasiArsip;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use App\Models\SuratTugas;
use App\Models\SuratTugasPersonil;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with authentic BKPSDM Luwu Timur datasets.
     */
    public function run(): void
    {
        $dataPath = base_path('../data');
        $currentStateFile = $dataPath . '/current_state.json';
        $klasifikasiFile = $dataPath . '/klasifikasi_perbup.json';

        if (!file_exists($currentStateFile)) {
            $this->command->error("File current_state.json tidak ditemukan di: {$currentStateFile}");
            return;
        }

        $stateData = json_decode(file_get_contents($currentStateFile), true);

        // 1. SEED PEGAWAI (44 Personil Resmi BKPSDM Luwu Timur)
        $this->command->info('1/5 Seeding Pegawai BKPSDM...');
        if (!empty($stateData['pegawai'])) {
            $pegawaiRows = [];
            $now = now();
            foreach ($stateData['pegawai'] as $p) {
                // Admin dapat login dengan password '123' atau '123456'
                $rawPwd = ($p['role'] === 'admin') ? '123' : ($p['password'] ?? '123456');
                $pegawaiRows[] = [
                    'id' => $p['id'],
                    'nip' => $p['nip'],
                    'nama' => $p['nama'],
                    'pangkat' => $p['pangkat'] ?? 'Penata Muda (III/a)',
                    'jabatan' => $p['jabatan'] ?? 'Staf Pelaksana',
                    'role' => $p['role'] ?? 'pegawai',
                    'unit' => $p['unit'] ?? 'Subbag Umum & Kepegawaian',
                    'password' => Hash::make($rawPwd),
                    'aktif' => $p['aktif'] ?? 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            DB::table('pegawai')->insert($pegawaiRows);
            $this->command->info('   ✓ ' . count($pegawaiRows) . ' pegawai berhasil diimpor.');
        }

        // 2. SEED KLASIFIKASI ARSIP (2.961 Kode Perbup No. 69 Tahun 2023)
        $this->command->info('2/5 Seeding Klasifikasi Arsip Perbup Luwu Timur No. 69/2023...');
        if (file_exists($klasifikasiFile)) {
            $klasifikasiList = json_decode(file_get_contents($klasifikasiFile), true);
            $chunks = array_chunk($klasifikasiList, 500);
            $now = now();
            foreach ($chunks as $chunk) {
                $rows = [];
                foreach ($chunk as $k) {
                    $kw = '';
                    if (isset($k['keywords'])) {
                        $kw = is_array($k['keywords']) ? implode(', ', $k['keywords']) : (string)$k['keywords'];
                    }
                    $rows[] = [
                        'kode' => $k['kode'],
                        'nama' => $k['nama'] ?? ($k['uraian'] ?? ''),
                        'kategori' => $k['kategori'] ?? 'Umum',
                        'keywords' => $kw,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                DB::table('klasifikasi_arsip')->insert($rows);
            }
            $this->command->info('   ✓ ' . count($klasifikasiList) . ' kode klasifikasi berhasil diimpor.');
        }

        // 3. SEED SURAT MASUK (130 Record Riil)
        $this->command->info('3/5 Seeding Buku Agenda Surat Masuk...');
        if (!empty($stateData['surat_masuk'])) {
            $now = now();
            $chunks = array_chunk($stateData['surat_masuk'], 100);
            foreach ($chunks as $chunk) {
                $rows = [];
                foreach ($chunk as $sm) {
                    $rows[] = [
                        'id' => $sm['id'],
                        'no_agenda' => $sm['no_agenda'],
                        'no_surat_pengirim' => $sm['no_surat_pengirim'] ?? '',
                        'instansi_pengirim' => $sm['instansi_pengirim'] ?? '',
                        'kode_internal' => $sm['kode_internal'] ?? '800',
                        'nama_klasifikasi_internal' => $sm['nama_klasifikasi_internal'] ?? 'Kepegawaian',
                        'perihal' => $sm['perihal'],
                        'tgl_surat' => $sm['tgl_surat'],
                        'tgl_diterima' => $sm['tgl_diterima'],
                        'sifat_surat' => $sm['sifat_surat'] ?? 'Biasa',
                        'lampiran' => $sm['lampiran'] ?? '1 Berkas',
                        'status_disposisi' => $sm['status_disposisi'] ?? 'Menunggu Disposisi',
                        'file_name' => $sm['file_name'] ?? 'surat_masuk.pdf',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                DB::table('surat_masuk')->insert($rows);
            }
            $this->command->info('   ✓ ' . count($stateData['surat_masuk']) . ' surat masuk berhasil diimpor.');
        }

        // 4. SEED SURAT KELUAR (822 Record Riil)
        $this->command->info('4/5 Seeding Buku Agenda Surat Keluar...');
        if (!empty($stateData['surat_keluar'])) {
            $now = now();
            $chunks = array_chunk($stateData['surat_keluar'], 100);
            foreach ($chunks as $chunk) {
                $rows = [];
                foreach ($chunk as $sk) {
                    $rows[] = [
                        'id' => $sk['id'],
                        'no_agenda' => $sk['no_agenda'],
                        'bidang_pembuat' => $sk['bidang_pembuat'] ?? 'Bidang Pengadaan, Mutasi & Informasi Kepegawaian',
                        'kode_klasifikasi' => $sk['kode_klasifikasi'] ?? '000',
                        'nama_klasifikasi' => $sk['nama_klasifikasi'] ?? 'Umum',
                        'no_surat_keluar' => $sk['no_surat_keluar'],
                        'tujuan_surat' => $sk['tujuan_surat'] ?? '',
                        'perihal' => $sk['perihal'],
                        'tgl_surat' => $sk['tgl_surat'],
                        'sifat_surat' => $sk['sifat_surat'] ?? 'Biasa',
                        'penandatangan' => $sk['penandatangan'] ?? 'PARHA ARIEF, S.AP',
                        'metode_dokumen' => $sk['metode_dokumen'] ?? 'Fisik Manual (Tanda Tangan Basah)',
                        'lokasi_arsip_fisik' => $sk['lokasi_arsip_fisik'] ?? 'Lemari Arsip Subbag Umum',
                        'is_surat_balasan' => $sk['is_surat_balasan'] ?? 0,
                        'id_surat_masuk_asal' => $sk['id_surat_masuk_asal'] ?? null,
                        'no_surat_pengirim_asal' => $sk['no_surat_pengirim_asal'] ?? null,
                        'file_name' => $sk['file_name'] ?? 'surat_keluar.pdf',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
                DB::table('surat_keluar')->insert($rows);
            }
            $this->command->info('   ✓ ' . count($stateData['surat_keluar']) . ' surat keluar berhasil diimpor.');
        }

        // 5. SEED SURAT TUGAS & PERSONIL (134 Record SPT Riil)
        $this->command->info('5/5 Seeding Surat Perintah Tugas (SPT)...');
        if (!empty($stateData['surat_tugas'])) {
            $now = now();
            $personilRows = [];
            foreach ($stateData['surat_tugas'] as $st) {
                DB::table('surat_tugas')->insert([
                    'id' => $st['id'],
                    'no_surat_tugas' => $st['no_surat_tugas'],
                    'bidang_pengusul' => $st['bidang_pengusul'] ?? 'Bidang Pengadaan, Mutasi dan Informasi Kepegawaian',
                    'kode_klasifikasi' => $st['kode_klasifikasi'] ?? '800.1.11.1',
                    'nama_klasifikasi' => $st['nama_klasifikasi'] ?? 'Surat Perintah Dinas/Surat Tugas',
                    'dasar' => $st['dasar'] ?? null,
                    'maksud_tugas' => $st['maksud_tugas'],
                    'tempat_tujuan' => $st['tempat_tujuan'] ?? 'Kabupaten Luwu Timur',
                    'tgl_berangkat' => $st['tgl_berangkat'],
                    'tgl_kembali' => $st['tgl_kembali'],
                    'lama_hari' => $st['lama_hari'] ?? 1,
                    'pembebanan_anggaran' => $st['pembebanan_anggaran'] ?? 'DPA-SKPD BKPSDM Kabupaten Luwu Timur TA 2026',
                    'pejabat_penandatangan' => $st['pejabat_penandatangan'] ?? 'PARHA ARIEF, S.AP',
                    'jabatan_penandatangan' => $st['jabatan_penandatangan'] ?? 'Kepala BKPSDM Kabupaten Luwu Timur',
                    'status_naskah_fisik' => $st['status_naskah_fisik'] ?? 'Naskah fisik disusun & dicetak manual oleh bidang (Tanda tangan basah manual)',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                if (!empty($st['personil']) && is_array($st['personil'])) {
                    $urut = 1;
                    foreach ($st['personil'] as $p) {
                        $personilRows[] = [
                            'id_surat_tugas' => $st['id'],
                            'nip' => $p['nip'] ?? '',
                            'nama' => $p['nama'] ?? '',
                            'pangkat' => $p['pangkat'] ?? '',
                            'jabatan' => $p['jabatan'] ?? '',
                            'urutan' => $urut++,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }
                }
            }

            if (!empty($personilRows)) {
                DB::table('surat_tugas_personil')->insert($personilRows);
            }
            $this->command->info('   ✓ ' . count($stateData['surat_tugas']) . ' surat tugas berhasil diimpor.');
        }

        $this->command->info('========================================================');
        $this->command->info('SELURUH DATA MASTER & AGENDA BKPSDM BERHASIL DI-SEEDING!');
        $this->command->info('========================================================');
    }
}
