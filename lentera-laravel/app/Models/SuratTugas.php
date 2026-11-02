<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratTugas extends Model
{
    protected $table = 'surat_tugas';

    protected $fillable = [
        'no_surat_tugas',
        'bidang_pengusul',
        'kode_klasifikasi',
        'nama_klasifikasi',
        'dasar',
        'maksud_tugas',
        'tempat_tujuan',
        'tgl_berangkat',
        'tgl_kembali',
        'lama_hari',
        'pembebanan_anggaran',
        'pejabat_penandatangan',
        'jabatan_penandatangan',
        'status_naskah_fisik',
    ];

    protected $casts = [
        'tgl_berangkat' => 'date',
        'tgl_kembali' => 'date',
        'lama_hari' => 'integer',
    ];

    public function personil()
    {
        return $this->hasMany(SuratTugasPersonil::class, 'id_surat_tugas')->orderBy('urutan');
    }
}

