@extends('layouts.app')

@section('title', 'Data Pegawai & Aparatur BKPSDM')
@section('page_title', 'Master Data Pegawai BKPSDM')

@section('content')
<div class="card">
    <div class="card-header-flex">
        <div>
            <h3 class="card-title">
                <i class="bi bi-people-fill text-primary"></i> Aparatur BKPSDM Kabupaten Luwu Timur (Total: {{ $totalPegawai }})
            </h3>
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                Daftar personil aparatur resmi untuk penerbitan SPT dan hak akses Role-Based Access Control (RBAC).
            </p>
        </div>
        <button type="button" class="btn btn-primary" onclick="bukaModalTambah()">
            <i class="bi bi-person-plus-fill"></i> Tambah Pegawai Baru
        </button>
    </div>

    <!-- Search & Filter -->
    <form action="{{ route('pegawai.index') }}" method="GET" style="display: flex; gap: 12px; margin-bottom: 20px;">
        <input type="text" name="search" class="form-control" placeholder="Cari nama / NIP / jabatan pegawai..." value="{{ request('search') }}" style="max-width: 350px;">
        <select name="role" class="form-select" style="max-width: 200px;">
            <option value="">-- Semua Role --</option>
            <option value="admin" {{ request('role') == 'admin' ? 'selected' : '' }}>Admin (Agendaris)</option>
            <option value="kepala_bkpsdm" {{ request('role') == 'kepala_bkpsdm' ? 'selected' : '' }}>Kepala BKPSDM</option>
            <option value="sekretaris" {{ request('role') == 'sekretaris' ? 'selected' : '' }}>Sekretaris</option>
            <option value="kabid" {{ request('role') == 'kabid' ? 'selected' : '' }}>Kepala Bidang</option>
            <option value="pegawai" {{ request('role') == 'pegawai' ? 'selected' : '' }}>Pegawai / Staf</option>
        </select>
        <button type="submit" class="btn btn-secondary"><i class="bi bi-search"></i> Cari</button>
    </form>

    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 40px;">No</th>
                    <th>Nama Aparatur</th>
                    <th>NIP</th>
                    <th>Pangkat / Golongan</th>
                    <th>Jabatan & Unit Kerja</th>
                    <th>Role RBAC</th>
                    <th>Status</th>
                    <th style="width: 80px; text-align: center;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($pegawaiList as $idx => $p)
                    <tr>
                        <td>{{ $pegawaiList->firstItem() + $idx }}</td>
                        <td>
                            <strong style="color: #0f172a;">{{ $p->nama }}</strong>
                        </td>
                        <td>
                            <span style="font-family: monospace; font-size: 0.8rem;">{{ $p->nip }}</span>
                        </td>
                        <td>{{ $p->pangkat }}</td>
                        <td>
                            <div style="font-weight: 500;">{{ $p->jabatan }}</div>
                            <div style="font-size: 0.72rem; color: #64748b;">{{ $p->unit }}</div>
                        </td>
                        <td>
                            @if($p->role === 'admin')
                                <span class="badge badge-info">Admin</span>
                            @elseif($p->role === 'kepala_bkpsdm')
                                <span class="badge badge-success">Kepala Badan</span>
                            @elseif($p->role === 'kabid')
                                <span class="badge badge-warning">Kabid</span>
                            @else
                                <span class="badge badge-neutral">Staf</span>
                            @endif
                        </td>
                        <td>
                            @if($p->aktif)
                                <span class="badge badge-success">Aktif</span>
                            @else
                                <span class="badge badge-danger">Nonaktif</span>
                            @endif
                        </td>
                        <td style="text-align: center;">
                            <form action="{{ route('pegawai.toggle', $p->id) }}" method="POST" style="display:inline;">
                                @csrf
                                <button type="submit" class="btn btn-sm {{ $p->aktif ? 'btn-secondary' : 'btn-success' }}" title="{{ $p->aktif ? 'Nonaktifkan' : 'Aktifkan' }}">
                                    <i class="bi {{ $p->aktif ? 'bi-toggle-on' : 'bi-toggle-off' }}"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 30px; color: #94a3b8;">
                            Data pegawai tidak ditemukan.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="pagination-container">
        {{ $pegawaiList->links() }}
    </div>
</div>

<!-- Modal Tambah Pegawai -->
<div id="modalTambah" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center;">
    <div style="background: #ffffff; width: 100%; max-width: 520px; border-radius: 12px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e3a8a;">Tambah Pegawai BKPSDM</h3>
            <button type="button" onclick="tutupModalTambah()" style="background: none; border: none; font-size: 1.25rem; cursor: pointer;">&times;</button>
        </div>

        <form action="{{ route('pegawai.store') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label">NIP *</label>
                <input type="text" name="nip" class="form-control" placeholder="Nomor Induk Pegawai" required>
            </div>
            <div class="form-group">
                <label class="form-label">Nama Lengkap & Gelar *</label>
                <input type="text" name="nama" class="form-control" placeholder="Nama pegawai" required>
            </div>
            <div class="form-group">
                <label class="form-label">Pangkat / Golongan</label>
                <input type="text" name="pangkat" class="form-control" placeholder="Contoh: Penata Muda (III/a)" value="Penata Muda (III/a)">
            </div>
            <div class="form-group">
                <label class="form-label">Jabatan</label>
                <input type="text" name="jabatan" class="form-control" placeholder="Contoh: Staf Pelaksana" value="Staf Pelaksana">
            </div>
            <div class="form-group">
                <label class="form-label">Role Akses *</label>
                <select name="role" class="form-select" required>
                    <option value="pegawai">Pegawai / Staf</option>
                    <option value="kabid">Kepala Bidang</option>
                    <option value="sekretaris">Sekretaris</option>
                    <option value="kepala_bkpsdm">Kepala BKPSDM</option>
                    <option value="admin">Agendaris (Admin)</option>
                </select>
            </div>
            <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 8px;">
                <button type="button" class="btn btn-secondary" onclick="tutupModalTambah()">Batal</button>
                <button type="submit" class="btn btn-primary">Simpan Pegawai</button>
            </div>
        </form>
    </div>
</div>

<script>
    function bukaModalTambah() {
        document.getElementById('modalTambah').style.display = 'flex';
    }
    function tutupModalTambah() {
        document.getElementById('modalTambah').style.display = 'none';
    }
</script>
@endsection

