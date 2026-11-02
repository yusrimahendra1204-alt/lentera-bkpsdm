<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pegawai', function (Blueprint $table) {
            $table->id();
            $table->string('nip', 50)->unique();
            $table->string('nama', 150);
            $table->string('pangkat', 100)->nullable()->default('Penata Muda (III/a)');
            $table->string('jabatan', 150)->nullable()->default('Staf Pelaksana');
            $table->string('role', 50)->default('pegawai'); // admin, kepala_bkpsdm, sekretaris, kabid, pegawai
            $table->string('unit', 150)->nullable()->default('Subbag Umum & Kepegawaian');
            $table->string('password', 255)->default('123456');
            $table->boolean('aktif')->default(true);
            $table->rememberToken();
            $table->timestamps();

            $table->index('role');
            $table->index('aktif');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pegawai');
    }
};

