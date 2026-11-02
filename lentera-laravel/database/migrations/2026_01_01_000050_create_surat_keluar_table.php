<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_keluar', function (Blueprint $table) {
            $table->id();
            $table->string('no_agenda', 50)->unique();
            $table->string('bidang_pembuat', 200)->nullable()->default('Bidang Pengadaan, Mutasi & Informasi Kepegawaian');
            $table->string('kode_klasifikasi', 50)->default('000');
            $table->string('nama_klasifikasi', 300)->nullable()->default('Umum');
            $table->string('no_surat_keluar', 200);
            $table->text('tujuan_surat');
            $table->text('perihal');
            $table->date('tgl_surat');
            $table->string('sifat_surat', 50)->default('Biasa'); // Biasa, Penting, Sangat Penting, Rahasia
            $table->string('penandatangan', 200)->default('Kepala BKPSDM Kabupaten Luwu Timur');
            $table->string('metode_dokumen', 150)->default('Fisik Manual (Tanda Tangan Basah)');
            $table->string('lokasi_arsip_fisik', 200)->default('Lemari Arsip Subbag Umum');
            $table->boolean('is_surat_balasan')->default(false);
            $table->unsignedBigInteger('id_surat_masuk_asal')->nullable();
            $table->string('no_surat_pengirim_asal', 150)->nullable();
            $table->string('file_name', 255)->nullable()->default('surat_keluar.pdf');
            $table->timestamps();

            $table->index('tgl_surat');
            $table->index('kode_klasifikasi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_keluar');
    }
};

