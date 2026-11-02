<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratMasuk extends Model
{
    protected $table = 'surat_masuk';

    protected $fillable = [
        'no_agenda',
        'no_surat_pengirim',
        'instansi_pengirim',
        'kode_internal',
        'nama_klasifikasi_internal',
        'perihal',
        'tgl_surat',
        'tgl_diterima',
        'sifat_surat',
        'lampiran',
        'status_disposisi',
        'file_name',
    ];

    protected $casts = [
        'tgl_surat' => 'date',
        'tgl_diterima' => 'date',
    ];

    public function disposisi()
    {
        return $this->hasMany(Disposisi::class, 'id_surat_masuk');
    }
}
