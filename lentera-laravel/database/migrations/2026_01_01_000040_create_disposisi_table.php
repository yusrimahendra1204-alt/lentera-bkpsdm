<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disposisi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_surat_masuk')->constrained('surat_masuk')->onDelete('cascade');
            $table->string('dari_user', 200)->default('PARHA ARIEF, S.AP (Kepala BKPSDM)');
            $table->foreignId('tujuan_user_id')->nullable()->constrained('pegawai')->nullOnDelete();
            $table->string('tujuan_nama', 200)->nullable();
            $table->string('sifat', 50)->default('Biasa'); // Biasa, Segera, Sangat Segera
            $table->json('instruksi')->nullable(); // Array of instructions
            $table->text('catatan')->nullable();
            $table->date('batas_waktu')->nullable();
            $table->string('status_tindak_lanjut', 50)->default('Diproses'); // Diproses, Selesai, Ditangguhkan
            $table->text('tindak_lanjut_note')->nullable();
            $table->timestamps();

            $table->index('id_surat_masuk');
            $table->index('status_tindak_lanjut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disposisi');
    }
};

