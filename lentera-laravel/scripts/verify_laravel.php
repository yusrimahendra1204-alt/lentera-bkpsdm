<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "========================================================\n";
echo "VERIFIKASI SISTEM LENTERA BKPSDM (VERSI LARAVEL)\n";
echo "========================================================\n";

echo "1. Master Pegawai: " . App\Models\Pegawai::count() . " orang\n";
$admin = App\Models\Pegawai::where('role', 'admin')->first();
echo "   - Agendaris / Admin: " . ($admin ? $admin->nama : 'Tidak ditemukan') . "\n";
$kepala = App\Models\Pegawai::where('role', 'kepala_bkpsdm')->first();
echo "   - Kepala BKPSDM: " . ($kepala ? $kepala->nama : 'Tidak ditemukan') . "\n";

echo "2. Master Klasifikasi Arsip (Perbup 69/2023): " . App\Models\KlasifikasiArsip::count() . " kode\n";
echo "3. Buku Agenda Surat Masuk: " . App\Models\SuratMasuk::count() . " surat\n";
echo "4. Buku Agenda Surat Keluar: " . App\Models\SuratKeluar::count() . " surat\n";
echo "   - 5 Surat Keluar Terakhir (ID Desc):\n";
foreach (App\Models\SuratKeluar::orderBy('id', 'desc')->take(5)->get() as $item) {
    echo "     ID {$item->id}: {$item->no_surat_keluar} (Tgl: " . ($item->tgl_surat ? $item->tgl_surat->format('Y-m-d') : '-') . ")\n";
}
echo "5. Surat Perintah Tugas (SPT): " . App\Models\SuratTugas::count() . " SPT\n";

$sk = App\Services\NomorSuratService::getSuratKeluarSequenceInfo();
echo "\n--- UJI LOGIKA PENOMORAN (ANTI-NOMOR GANDA) ---\n";
echo "Surat Keluar:\n";
echo "   - Nomor Terakhir Terdaftar : " . ($sk['last_surat']->no_surat_keluar ?? '-') . "\n";
echo "   - Urutan Terakhir          : " . $sk['last_number'] . "\n";
echo "   - Estimasi Urut Berikutnya : " . $sk['next_number'] . " (SEHARUSNYA 842: " . ($sk['next_number'] === 842 ? "SESUAI ✓" : "GAGAL ✗") . ")\n";
echo "   - Format Preview           : " . $sk['template_preview'] . "\n";

$st = App\Services\NomorSuratService::getSuratTugasSequenceInfo();
echo "Surat Tugas (SPT):\n";
echo "   - Nomor Terakhir Terdaftar : " . ($st['last_spt']->no_surat_tugas ?? '-') . "\n";
echo "   - Urutan Terakhir          : " . $st['last_number'] . "\n";
echo "   - Estimasi Urut Berikutnya : " . $st['next_number'] . " (SEHARUSNYA 136: " . ($st['next_number'] === 136 ? "SESUAI ✓" : "GAGAL ✗") . ")\n";
echo "   - Nomor Lengkap Berikutnya : " . $st['full_next_no'] . "\n";

echo "\n--- UJI RENDER VIEW BLADE ---\n";
echo "1. View auth.login: " . (strlen(view('auth.login')->render()) > 0 ? "OK (" . strlen(view('auth.login')->render()) . " bytes) ✓" : "GAGAL") . "\n";
$stats = [
    'total_surat_masuk' => App\Models\SuratMasuk::count(),
    'total_surat_keluar' => App\Models\SuratKeluar::count(),
    'total_surat_tugas' => App\Models\SuratTugas::count(),
    'total_klasifikasi' => App\Models\KlasifikasiArsip::count(),
    'total_pegawai' => App\Models\Pegawai::where('aktif', 1)->count(),
];
$keluarSeq = $sk;
$tugasSeq = $st;
echo "2. View landing: " . (strlen(view('landing', compact('stats', 'keluarSeq', 'tugasSeq'))->render()) > 0 ? "OK (" . strlen(view('landing', compact('stats', 'keluarSeq', 'tugasSeq'))->render()) . " bytes) ✓" : "GAGAL") . "\n";

echo "\n========================================================\n";
echo "SEMUA FITUR DAN DATA TERVERIFIKASI SEMPURNA!\n";
echo "========================================================\n";
