<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_masuk', function (Blueprint $table) {
            $table->id();
            $table->string('no_agenda', 50)->unique();
            $table->string('no_surat_pengirim', 150)->nullable();
            $table->string('instansi_pengirim', 200)->nullable();
            $table->string('kode_internal', 50)->default('800');
            $table->string('nama_klasifikasi_internal', 300)->nullable()->default('Kepegawaian');
            $table->text('perihal');
            $table->date('tgl_surat');
            $table->date('tgl_diterima');
            $table->string('sifat_surat', 50)->default('Biasa'); // Biasa, Penting, Sangat Penting, Rahasia
            $table->string('lampiran', 100)->nullable()->default('1 Berkas');
            $table->string('status_disposisi', 50)->default('Menunggu Disposisi'); // Menunggu Disposisi, Didisposisi, Selesai
            $table->string('file_name', 255)->nullable()->default('surat_masuk.pdf');
            $table->timestamps();

            $table->index('tgl_diterima');
            $table->index('status_disposisi');
            $table->index('kode_internal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_masuk');
    }
};
