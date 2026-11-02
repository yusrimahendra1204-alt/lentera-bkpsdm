<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Disposisi extends Model
{
    protected $table = 'disposisi';

    protected $fillable = [
        'id_surat_masuk',
        'dari_user',
        'tujuan_user_id',
        'tujuan_nama',
        'sifat',
        'instruksi',
        'catatan',
        'batas_waktu',
        'status_tindak_lanjut',
        'tindak_lanjut_note',
    ];

    protected $casts = [
        'instruksi' => 'array',
        'batas_waktu' => 'date',
    ];

    public function suratMasuk()
    {
        return $this->belongsTo(SuratMasuk::class, 'id_surat_masuk');
    }

    public function pegawaiTujuan()
    {
        return $this->belongsTo(Pegawai::class, 'tujuan_user_id');
    }
}

