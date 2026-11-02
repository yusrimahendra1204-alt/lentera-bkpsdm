<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'LENTERA BKPSDM') - Kab. Luwu Timur</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">
    
    <!-- Google Fonts Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <style>
        :root {
            --primary: #1e3a8a;
            --primary-hover: #1e40af;
            --primary-light: #eff6ff;
            --secondary: #0d9488;
            --secondary-light: #f0fdfa;
            --accent: #d97706;
            --bg-body: #f8fafc;
            --bg-card: #ffffff;
            --border-color: #e2e8f0;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --sidebar-width: 270px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        body {
            background-color: var(--bg-body);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
        }

        /* Sidebar */
        aside.sidebar {
            width: var(--sidebar-width);
            background: #ffffff;
            border-right: 1px solid var(--border-color);
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            display: flex;
            flex-direction: column;
            z-index: 50;
        }

        .sidebar-brand {
            padding: 20px 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sidebar-brand img {
            height: 38px;
            width: auto;
            object-fit: contain;
        }

        .sidebar-brand .brand-text {
            display: flex;
            flex-direction: column;
        }

        .sidebar-brand .brand-title {
            font-size: 1.15rem;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: -0.02em;
        }

        .sidebar-brand .brand-sub {
            font-size: 0.72rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        .sidebar-menu {
            padding: 16px 12px;
            flex: 1;
            overflow-y: auto;
        }

        .menu-category {
            font-size: 0.68rem;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.05em;
            color: #94a3b8;
            padding: 12px 14px 6px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 14px;
            color: #475569;
            text-decoration: none;
            border-radius: 8px;
            font-size: 0.88rem;
            font-weight: 500;
            margin-bottom: 3px;
            transition: all 0.15s ease;
        }

        .nav-item:hover {
            background-color: var(--primary-light);
            color: var(--primary);
        }

        .nav-item.active {
            background-color: #1e3a8a;
            color: #ffffff;
            font-weight: 600;
        }

        .nav-item i {
            font-size: 1.1rem;
        }

        .sidebar-footer {
            padding: 14px 18px;
            border-top: 1px solid var(--border-color);
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .user-info {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .user-name {
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--text-main);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .user-role {
            font-size: 0.7rem;
            color: var(--secondary);
            font-weight: 600;
        }

        /* Main Content */
        main.main-content {
            margin-left: var(--sidebar-width);
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        header.topbar {
            height: 68px;
            background: #ffffff;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 32px;
            position: sticky;
            top: 0;
            z-index: 40;
        }

        .topbar-title {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .topbar-title h1 {
            font-size: 1.15rem;
            font-weight: 700;
            color: var(--text-main);
        }

        .badge-perbup {
            background: #dbeafe;
            color: #1e40af;
            font-size: 0.72rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .topbar-actions {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .content-body {
            padding: 28px 32px;
            flex: 1;
        }

        /* Cards & Components */
        .card {
            background: #ffffff;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 22px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.02);
            margin-bottom: 24px;
        }

        .card-header-flex {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 18px;
        }

        .card-title {
            font-size: 1.02rem;
            font-weight: 700;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 8px 16px;
            border-radius: 8px;
            border: 1px solid transparent;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.15s ease;
        }

        .btn-primary {
            background: #1e3a8a;
            color: #ffffff;
        }
        .btn-primary:hover {
            background: #1e40af;
        }

        .btn-secondary {
            background: #f1f5f9;
            color: #334155;
            border-color: #cbd5e1;
        }
        .btn-secondary:hover {
            background: #e2e8f0;
        }

        .btn-success {
            background: #0d9488;
            color: #ffffff;
        }
        .btn-success:hover {
            background: #0f766e;
        }

        .btn-danger {
            background: #dc2626;
            color: #ffffff;
        }
        .btn-danger:hover {
            background: #b91c1c;
        }

        .btn-sm {
            padding: 5px 10px;
            font-size: 0.78rem;
        }

        /* Tables */
        .table-responsive {
            overflow-x: auto;
        }

        table.table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 0.85rem;
        }

        table.table th {
            background: #f8fafc;
            color: #475569;
            font-weight: 600;
            padding: 12px 14px;
            border-bottom: 1px solid var(--border-color);
            text-align: left;
            white-space: nowrap;
        }

        table.table td {
            padding: 13px 14px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
            vertical-align: middle;
        }

        table.table tbody tr:hover td {
            background-color: #f8fafc;
        }

        /* Badges */
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 0.72rem;
            font-weight: 600;
        }
        .badge-info { background: #e0f2fe; color: #0369a1; }
        .badge-success { background: #dcfce7; color: #15803d; }
        .badge-warning { background: #fef3c7; color: #b45309; }
        .badge-danger { background: #fee2e2; color: #b91c1c; }
        .badge-neutral { background: #f1f5f9; color: #475569; }

        /* Form elements */
        .form-group {
            margin-bottom: 18px;
        }

        .form-label {
            display: block;
            font-size: 0.82rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 6px;
        }

        .form-control, .form-select {
            width: 100%;
            padding: 9px 12px;
            font-size: 0.875rem;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            background: #ffffff;
            color: var(--text-main);
            outline: none;
            transition: border-color 0.15s ease;
        }

        .form-control:focus, .form-select:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }

        /* Alerts */
        .alert {
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 0.86rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .alert-success { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .alert-danger { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .alert-info { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }

        /* Pagination */
        .pagination-container {
            margin-top: 18px;
            display: flex;
            justify-content: flex-end;
        }

        /* Banner Antinormor Ganda */
        .banner-anti-ganda {
            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
            border: 1px solid #a7f3d0;
            border-radius: 12px;
            padding: 18px 22px;
            margin-bottom: 22px;
        }

        .banner-anti-ganda .board-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 12px;
        }

        .board-card {
            background: #ffffff;
            border-radius: 10px;
            padding: 14px 18px;
            border: 1px solid #bbf7d0;
        }

        .board-card.secondary-board {
            border-color: #bfdbfe;
            background: #ffffff;
        }

        @media (max-width: 900px) {
            aside.sidebar { display: none; }
            main.main-content { margin-left: 0; }
        }
    </style>
    @yield('styles')
</head>
<body>
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <img src="{{ asset('img/logo_bkpsdm.png') }}" alt="Logo BKPSDM" onerror="this.src='{{ asset('img/logo_lutim_juara.png') }}'">
            <div class="brand-text">
                <span class="brand-title">LENTERA</span>
                <span class="brand-sub">BKPSDM KAB. LUWU TIMUR</span>
            </div>
        </div>

        <div class="sidebar-menu">
            <div class="menu-category">Utama</div>
            <a href="{{ route('dashboard') }}" class="nav-item {{ request()->routeIs('dashboard') || request()->routeIs('home') ? 'active' : '' }}">
                <i class="bi bi-grid-1x2-fill"></i>
                <span>Dashboard</span>
            </a>

            <div class="menu-category">Persuratan & Disposisi</div>
            <a href="{{ route('surat-masuk.index') }}" class="nav-item {{ request()->routeIs('surat-masuk.*') ? 'active' : '' }}">
                <i class="bi bi-inbox-fill"></i>
                <span>Surat Masuk</span>
            </a>
            <a href="{{ route('disposisi.index') }}" class="nav-item {{ request()->routeIs('disposisi.*') ? 'active' : '' }}">
                <i class="bi bi-diagram-3-fill"></i>
                <span>Lembar Disposisi</span>
            </a>
            <a href="{{ route('surat-keluar.index') }}" class="nav-item {{ request()->routeIs('surat-keluar.*') ? 'active' : '' }}">
                <i class="bi bi-send-fill"></i>
                <span>Surat Keluar</span>
            </a>
            <a href="{{ route('surat-tugas.index') }}" class="nav-item {{ request()->routeIs('surat-tugas.*') ? 'active' : '' }}">
                <i class="bi bi-briefcase-fill"></i>
                <span>Surat Tugas (SPT)</span>
            </a>

            <div class="menu-category">Referensi & Laporan</div>
            <a href="{{ route('klasifikasi.index') }}" class="nav-item {{ request()->routeIs('klasifikasi.*') ? 'active' : '' }}">
                <i class="bi bi-bookmarks-fill"></i>
                <span>Klasifikasi Perbup</span>
            </a>
            <a href="{{ route('laporan.index') }}" class="nav-item {{ request()->routeIs('laporan.*') ? 'active' : '' }}">
                <i class="bi bi-journal-text"></i>
                <span>Buku Agenda & Cetak</span>
            </a>

            <div class="menu-category">Pengaturan</div>
            <a href="{{ route('pegawai.index') }}" class="nav-item {{ request()->routeIs('pegawai.*') ? 'active' : '' }}">
                <i class="bi bi-people-fill"></i>
                <span>Data Pegawai (44)</span>
            </a>
        </div>

        <div class="sidebar-footer">
            <div class="user-info">
                <span class="user-name">{{ Auth::user()->nama ?? 'Admin BKPSDM' }}</span>
                <span class="user-role">{{ strtoupper(Auth::user()->role ?? 'ADMIN') }}</span>
            </div>
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button type="submit" class="btn btn-sm btn-secondary" title="Keluar">
                    <i class="bi bi-box-arrow-right"></i>
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <header class="topbar">
            <div class="topbar-title">
                <h1>@yield('page_title', 'Dashboard')</h1>
                <span class="badge-perbup">
                    <i class="bi bi-check-circle-fill"></i> Perbup Luwu Timur No. 69 Tahun 2023
                </span>
            </div>
            <div class="topbar-actions">
                <span style="font-size: 0.8rem; color: var(--text-muted);">
                    <i class="bi bi-building"></i> BKPSDM Kab. Luwu Timur
                </span>
            </div>
        </header>

        <div class="content-body">
            @if(session('success'))
                <div class="alert alert-success">
                    <i class="bi bi-check-circle-fill"></i>
                    <span>{{ session('success') }}</span>
                </div>
            @endif

            @if(session('info'))
                <div class="alert alert-info">
                    <i class="bi bi-info-circle-fill"></i>
                    <span>{{ session('info') }}</span>
                </div>
            @endif

            @if($errors->any())
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <div>
                        <strong>Terjadi Kesalahan:</strong>
                        <ul style="margin-left: 20px; margin-top: 4px;">
                            @foreach($errors->all() as $err)
                                <li>{{ $err }}</li>
                            @endforeach
                        </ul>
                    </div>
                </div>
            @endif

            @yield('content')
        </div>
    </main>

    @yield('scripts')
</body>
</html>
