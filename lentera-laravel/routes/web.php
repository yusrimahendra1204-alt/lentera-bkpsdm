<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DatabaseController;
use App\Http\Controllers\DisposisiController;
use App\Http\Controllers\KlasifikasiController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\SuratKeluarController;
use App\Http\Controllers\SuratMasukController;
use App\Http\Controllers\SuratTugasController;
use Illuminate\Support\Facades\Route;

// Public Landing Page (Beranda Publik seperti di JS)
Route::get('/', [LandingController::class, 'index'])->name('landing');

// Guest Authentication Routes (Halaman Login persis seperti di JS)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

// Authenticated Routes (Aplikasi Persuratan Internal)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Surat Masuk
    Route::resource('surat-masuk', SuratMasukController::class);

    // Disposisi
    Route::get('/disposisi', [DisposisiController::class, 'index'])->name('disposisi.index');
    Route::get('/disposisi/create', [DisposisiController::class, 'create'])->name('disposisi.create');
    Route::post('/disposisi', [DisposisiController::class, 'store'])->name('disposisi.store');
    Route::get('/disposisi/{disposisi}/cetak', [DisposisiController::class, 'cetak'])->name('disposisi.cetak');
    Route::put('/disposisi/{disposisi}/status', [DisposisiController::class, 'updateStatus'])->name('disposisi.updateStatus');

    // Surat Keluar
    Route::resource('surat-keluar', SuratKeluarController::class);

    // Surat Tugas
    Route::get('/surat-tugas', [SuratTugasController::class, 'index'])->name('surat-tugas.index');
    Route::get('/surat-tugas/create', [SuratTugasController::class, 'create'])->name('surat-tugas.create');
    Route::post('/surat-tugas', [SuratTugasController::class, 'store'])->name('surat-tugas.store');
    Route::get('/surat-tugas/{suratTugas}', [SuratTugasController::class, 'show'])->name('surat-tugas.show');
    Route::get('/surat-tugas/{suratTugas}/cetak', [SuratTugasController::class, 'cetak'])->name('surat-tugas.cetak');
    Route::delete('/surat-tugas/{suratTugas}', [SuratTugasController::class, 'destroy'])->name('surat-tugas.destroy');

    // Klasifikasi Arsip
    Route::get('/klasifikasi', [KlasifikasiController::class, 'index'])->name('klasifikasi.index');
    Route::get('/api/klasifikasi/search', [KlasifikasiController::class, 'searchApi'])->name('api.klasifikasi.search');

    // Laporan & Buku Agenda
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/cetak', [LaporanController::class, 'cetak'])->name('laporan.cetak');
    Route::get('/laporan/export-csv', [LaporanController::class, 'exportCsv'])->name('laporan.exportCsv');

    // Manajemen Pegawai
    Route::get('/pegawai', [PegawaiController::class, 'index'])->name('pegawai.index');
    Route::post('/pegawai', [PegawaiController::class, 'store'])->name('pegawai.store');
    Route::put('/pegawai/{pegawai}', [PegawaiController::class, 'update'])->name('pegawai.update');
    Route::post('/pegawai/{pegawai}/toggle', [PegawaiController::class, 'toggleAktif'])->name('pegawai.toggle');

    // Manajemen Basis Data & Portabilitas
    Route::get('/database', [DatabaseController::class, 'index'])->name('database.index');
    Route::get('/database/download-sql', [DatabaseController::class, 'downloadSql'])->name('database.downloadSql');
    Route::get('/database/backup-json', [DatabaseController::class, 'backupJson'])->name('database.backupJson');
    Route::post('/database/restore-json', [DatabaseController::class, 'restoreJson'])->name('database.restoreJson');
    Route::post('/database/clear-dummy', [DatabaseController::class, 'clearDummy'])->name('database.clearDummy');
});
