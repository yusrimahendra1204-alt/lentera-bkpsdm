<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Pegawai extends Authenticatable
{
    use Notifiable;

    protected $table = 'pegawai';

    protected $fillable = [
        'nip',
        'nama',
        'pangkat',
        'jabatan',
        'role',
        'unit',
        'password',
        'aktif',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'aktif' => 'boolean',
        ];
    }

    public function disposisi()
    {
        return $this->hasMany(Disposisi::class, 'tujuan_user_id');
    }

    // Role helpers
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isKepalaBkpsdm(): bool
    {
        return $this->role === 'kepala_bkpsdm';
    }

    public function isKabid(): bool
    {
        return $this->role === 'kabid';
    }

    public function isSekretaris(): bool
    {
        return $this->role === 'sekretaris';
    }
}
