<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratTugasPersonil extends Model
{
    protected $table = 'surat_tugas_personil';

    protected $fillable = [
        'id_surat_tugas',
        'nip',
        'nama',
        'pangkat',
        'jabatan',
        'urutan',
    ];

    public function suratTugas()
    {
        return $this->belongsTo(SuratTugas::class, 'id_surat_tugas');
    }
}
