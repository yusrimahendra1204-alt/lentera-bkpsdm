<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surat_tugas_personil', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_surat_tugas')->constrained('surat_tugas')->onDelete('cascade');
            $table->string('nip', 50)->nullable();
            $table->string('nama', 150);
            $table->string('pangkat', 100)->nullable();
            $table->string('jabatan', 150)->nullable();
            $table->unsignedSmallInteger('urutan')->default(1);
            $table->timestamps();

            $table->index('id_surat_tugas');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surat_tugas_personil');
    }
};

