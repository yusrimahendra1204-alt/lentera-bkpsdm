<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKeluar extends Model
{
    protected $table = 'surat_keluar';

    protected $fillable = [
        'no_agenda',
        'bidang_pembuat',
        'kode_klasifikasi',
        'nama_klasifikasi',
        'no_surat_keluar',
        'tujuan_surat',
        'perihal',
        'tgl_surat',
        'sifat_surat',
        'penandatangan',
        'metode_dokumen',
        'lokasi_arsip_fisik',
        'is_surat_balasan',
        'id_surat_masuk_asal',
        'no_surat_pengirim_asal',
        'file_name',
    ];

    protected $casts = [
        'tgl_surat' => 'date',
        'is_surat_balasan' => 'boolean',
    ];

    public function suratMasukAsal()
    {
        return $this->belongsTo(SuratMasuk::class, 'id_surat_masuk_asal');
    }
}
