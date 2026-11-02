<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_tugas', function (Blueprint $table) {
            $table->id();
            $table->string('no_surat_tugas', 200)->unique();
            $table->string('bidang_pengusul', 200)->nullable()->default('Bidang Pengadaan, Mutasi dan Informasi Kepegawaian');
            $table->string('kode_klasifikasi', 50)->default('800.1.11.1');
            $table->string('nama_klasifikasi', 200)->default('Surat Perintah Dinas/Surat Tugas');
            $table->text('dasar')->nullable();
            $table->text('maksud_tugas');
            $table->string('tempat_tujuan', 300)->nullable();
            $table->date('tgl_berangkat');
            $table->date('tgl_kembali');
            $table->unsignedSmallInteger('lama_hari')->default(1);
            $table->string('pembebanan_anggaran', 200)->default('DPA-SKPD BKPSDM Kabupaten Luwu Timur TA 2026');
            $table->string('pejabat_penandatangan', 200)->default('PARHA ARIEF, S.AP');
            $table->string('jabatan_penandatangan', 200)->default('Kepala BKPSDM Kabupaten Luwu Timur');
            $table->string('status_naskah_fisik', 200)->default('Naskah fisik disusun & dicetak manual oleh bidang');
            $table->timestamps();

            $table->index('tgl_berangkat');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_tugas');
    }
};

