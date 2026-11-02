<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('klasifikasi_arsip', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 50)->index();
            $table->text('nama');
            $table->string('kategori', 50)->index();
            $table->text('keywords')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('klasifikasi_arsip');
    }
};

