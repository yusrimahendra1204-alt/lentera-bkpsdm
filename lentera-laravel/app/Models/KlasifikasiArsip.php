<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KlasifikasiArsip extends Model
{
    protected $table = 'klasifikasi_arsip';

    protected $fillable = [
        'kode',
        'nama',
        'kategori',
        'keywords',
    ];
}

