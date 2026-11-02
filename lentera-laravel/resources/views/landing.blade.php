<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LENTERA BKPSDM - Layanan Elektronik Tata Naskah dan Administrasi Kab. Luwu Timur</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- CSS Proyek Persuratan BKPSDM -->
    <link rel="stylesheet" href="{{ asset('css/variables.css') }}">
    <link rel="stylesheet" href="{{ asset('css/landing.css') }}">
    <link rel="stylesheet" href="{{ asset('css/components.css') }}">

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #0f172a;
            color: #ffffff;
            overflow-x: hidden;
        }
        .landing-page-root {
            display: block !important;
            position: relative;
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <div class="landing-page-root">
        <!-- Ambient Dynamic Glows -->
        <div class="landing-ambient-bg">
            <div class="ambient-orb ambient-orb-1"></div>
            <div class="ambient-orb ambient-orb-2"></div>
            <div class="ambient-orb ambient-orb-3"></div>
        </div>
        <div class="landing-grid-pattern"></div>

        <!-- Navigation Header -->
        <header class="landing-header">
            <div class="landing-nav-container">
                <a href="#hero" class="landing-brand">
                    <img src="{{ asset('img/logo_lutim_juara.png') }}" alt="Logo Lutim Juara" class="landing-brand-logo">
                    <div style="background: #ffffff; padding: 4px 10px; border-radius: 8px; display: inline-flex; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                        <img src="{{ asset('img/logo_bkpsdm.png') }}" alt="Logo BKPSDM" style="height: 22px; width: auto; object-fit: contain;">
                    </div>
                    <div class="landing-brand-text">
                        <h1>LENTERA BKPSDM</h1>
                        <p>Layanan Elektronik Tata Naskah & Administrasi</p>
                    </div>
                </a>

                <ul class="landing-nav-links">
                    <li><a href="#hero">Beranda</a></li>
                    <li><a href="#cek-nomor">Cek Nomor</a></li>
                    <li><a href="#layanan">Layanan</a></li>
                    <li><a href="#regulasi">Alur Persuratan</a></li>
                </ul>

                <div class="landing-nav-actions">
                    <a href="{{ route('login') }}" class="btn-landing-primary">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                        Masuk Pegawai
                    </a>
                </div>
            </div>
        </header>

        <!-- Hero Section -->
        <section class="landing-hero" id="hero">
            <div class="hero-grid">
                <div>
                    <div class="hero-pill-badge">
                        <span class="hero-pill-dot"></span>
                        Portal Resmi LENTERA - BKPSDM Luwu Timur
                    </div>

                    <h1 class="hero-title">
                        LENTERA: Layanan Elektronik Tata Naskah <span class="gradient-text">& Administrasi BKPSDM</span>
                    </h1>

                    <p class="hero-subtitle">
                        Layanan Elektronik Tata Naskah dan Administrasi terpadu berbasis <strong>Perbup No. 69 Tahun 2023</strong>. Mempermudah pencatatan agenda, kendali disposisi, penomoran resmi surat keluar, dan SPT secara akuntabel.
                    </p>

                    <div class="hero-cta-group">
                        <a href="{{ route('login') }}" class="btn-hero-primary">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            Buka Aplikasi
                        </a>
                        <button class="btn-hero-secondary" onclick="document.getElementById('cek-nomor').scrollIntoView({behavior: 'smooth'})">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Cek Nomor Surat
                        </button>
                    </div>

                    <div class="hero-trust-bar">
                        <div class="trust-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>Perbup Lutim 69/2023</span>
                        </div>
                        <div class="trust-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>Penomoran Terpusat</span>
                        </div>
                        <div class="trust-item">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>Kendali Disposisi</span>
                        </div>
                    </div>
                </div>

                <!-- Right Side: Official Lutim Juara & BKPSDM Showcase -->
                <div class="hero-visual-card">
                    <div class="hero-emblem-wrap">
                        <div class="hero-emblem-glow"></div>
                        <img src="{{ asset('img/logo_lutim_juara.png') }}" alt="Logo Resmi Lutim Juara" class="hero-emblem-img">
                    </div>
                    <!-- Official BKPSDM Logo -->
                    <div style="background: #ffffff; padding: 10px 24px; border-radius: 12px; margin: 0 auto 16px; max-width: 220px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(255, 255, 255, 0.8);">
                        <img src="{{ asset('img/logo_bkpsdm.png') }}" alt="Logo Resmi BKPSDM" style="width: 100%; height: auto; max-height: 46px; object-fit: contain;">
                    </div>
                    <h2 class="hero-visual-title">LUTIM JUARA</h2>
                    <div class="hero-visual-tagline">BKPSDM KABUPATEN LUWU TIMUR</div>
                    <div class="hero-chips-container">
                        <span class="hero-chip accent-cyan">
                            Aparatur BKPSDM
                        </span>
                        <span class="hero-chip accent-green">
                            2.961 Kode Perbup
                        </span>
                        <span class="hero-chip accent-amber">
                            Agenda 2026
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Statistics Section -->
        <section class="landing-stats-section">
            <div class="stats-glass-grid">
                <div class="stat-glass-card">
                    <div class="stat-glass-header">
                        <span class="stat-glass-title">Surat Masuk</span>
                        <div class="stat-glass-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                    </div>
                    <div class="stat-glass-value">{{ number_format($stats['total_surat_masuk']) }}</div>
                    <div class="stat-glass-desc">Total Agenda Masuk</div>
                </div>

                <div class="stat-glass-card">
                    <div class="stat-glass-header">
                        <span class="stat-glass-title">Surat Keluar</span>
                        <div class="stat-glass-icon" style="color: #34d399;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </div>
                    </div>
                    <div class="stat-glass-value" style="color: #34d399;">{{ number_format($stats['total_surat_keluar']) }}</div>
                    <div class="stat-glass-desc">Nomor Resmi Terbit</div>
                </div>

                <div class="stat-glass-card">
                    <div class="stat-glass-header">
                        <span class="stat-glass-title">Surat Tugas</span>
                        <div class="stat-glass-icon" style="color: #fbbf24;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                        </div>
                    </div>
                    <div class="stat-glass-value" style="color: #fbbf24;">{{ number_format($stats['total_surat_tugas']) }}</div>
                    <div class="stat-glass-desc">SPT Kedinasan</div>
                </div>

                <div class="stat-glass-card">
                    <div class="stat-glass-header">
                        <span class="stat-glass-title">Klasifikasi Arsip</span>
                        <div class="stat-glass-icon" style="color: #c084fc;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        </div>
                    </div>
                    <div class="stat-glass-value" style="color: #c084fc;">{{ number_format($stats['total_klasifikasi']) }}</div>
                    <div class="stat-glass-desc">Kode Perbup 69/2023</div>
                </div>

                <div class="stat-glass-card">
                    <div class="stat-glass-header">
                        <span class="stat-glass-title">Pegawai</span>
                        <div class="stat-glass-icon" style="color: #f472b6;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </div>
                    </div>
                    <div class="stat-glass-value" style="color: #f472b6;">{{ $stats['total_pegawai'] }}</div>
                    <div class="stat-glass-desc">Aparatur BKPSDM</div>
                </div>
            </div>
        </section>

        <!-- Interactive Live Tools Section: Anti-Nomor Ganda -->
        <section class="landing-tools-section" id="cek-nomor">
            <div class="section-badge-center">
                <span class="section-badge">Informasi Cepat</span>
            </div>
            <div class="section-heading-center">
                <h2>Cek Nomor Surat Resmi (Anti Nomor Ganda)</h2>
                <p>Pantau nomor surat keluar dan nomor SPT dinas terakhir yang resmi tercatat di sistem.</p>
            </div>

            <div style="max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px);">
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #38bdf8; letter-spacing: 0.5px;">Surat Keluar Dinas</div>
                    <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">Nomor Terakhir Terbit:</div>
                    <div style="font-size: 18px; font-weight: 800; color: #34d399; margin: 4px 0;">
                        {{ $keluarSeq['last_surat']->no_surat_keluar ?? '800.1.3.3/841/BKPSDM/X/2026' }}
                    </div>
                    <div style="font-size: 12px; color: #cbd5e1; margin-top: 8px;">
                        Estimasi Urutan Berikutnya: <strong style="color: #38bdf8; font-size: 15px;">{{ $keluarSeq['next_number'] }}</strong>
                    </div>
                </div>

                <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 16px; padding: 24px; backdrop-filter: blur(12px);">
                    <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #fbbf24; letter-spacing: 0.5px;">Surat Tugas (SPT Dinas)</div>
                    <div style="font-size: 13px; color: #94a3b8; margin-top: 6px;">Nomor Terakhir Terbit:</div>
                    <div style="font-size: 18px; font-weight: 800; color: #fbbf24; margin: 4px 0;">
                        {{ $tugasSeq['last_spt']->no_surat_tugas ?? '800.1.11.1/135/BKPSDM' }}
                    </div>
                    <div style="font-size: 12px; color: #cbd5e1; margin-top: 8px;">
                        Estimasi Urutan Berikutnya: <strong style="color: #34d399; font-size: 15px;">{{ $tugasSeq['next_number'] }}</strong> ({{ $tugasSeq['full_next_no'] }})
                    </div>
                </div>
            </div>
        </section>

        <!-- 4 Pillars of Persuratan Section -->
        <section class="landing-pillars-section" id="layanan">
            <div class="section-badge-center">
                <span class="section-badge">Layanan Persuratan</span>
            </div>
            <div class="section-heading-center">
                <h2>Modul Tata Kelola Persuratan</h2>
                <p>Empat pilar utama dalam pengelolaan naskah dinas kedinasan BKPSDM Kabupaten Luwu Timur.</p>
            </div>

            <div class="pillars-grid">
                <div class="pillar-card">
                    <div class="pillar-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <h3>Surat Masuk</h3>
                    <p>Registrasi cepat surat dinas masuk, penomoran agenda otomatis, dan pelacakan status disposisi.</p>
                    <div class="pillar-tags">
                        <span class="pillar-tag">Agenda Otomatis</span>
                        <span class="pillar-tag">Auto-Suggest Kode</span>
                    </div>
                    <a href="{{ route('login') }}" class="pillar-btn-link">Buka Agenda Masuk →</a>
                </div>

                <div class="pillar-card">
                    <div class="pillar-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                    </div>
                    <h3>Kendali Disposisi</h3>
                    <p>Perekaman instruksi arahan pimpinan dari lembar fisik untuk monitoring tindak lanjut bidang.</p>
                    <div class="pillar-tags">
                        <span class="pillar-tag">Buku Kendali Digital</span>
                        <span class="pillar-tag">Tracking Status</span>
                    </div>
                    <a href="{{ route('login') }}" class="pillar-btn-link">Buka Disposisi →</a>
                </div>

                <div class="pillar-card">
                    <div class="pillar-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </div>
                    <h3>Surat Keluar</h3>
                    <p>Penomoran resmi terpusat berbasis Perbup Luwu Timur 69/2023 guna mencegah nomor dobel.</p>
                    <div class="pillar-tags">
                        <span class="pillar-tag">Nomor Terpusat</span>
                        <span class="pillar-tag">Sanding Nomor</span>
                    </div>
                    <a href="{{ route('login') }}" class="pillar-btn-link">Buka Register Keluar →</a>
                </div>

                <div class="pillar-card">
                    <div class="pillar-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    </div>
                    <h3>Surat Tugas (SPT)</h3>
                    <p>Penomoran resmi digital terpusat kode 800.1.11.1 dengan integrasi data aparatur penugasan.</p>
                    <div class="pillar-tags">
                        <span class="pillar-tag">Kode 800.1.11.1</span>
                        <span class="pillar-tag">Multi-Personil</span>
                    </div>
                    <a href="{{ route('login') }}" class="pillar-btn-link">Buka Agenda SPT →</a>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="landing-footer">
            <div class="footer-inner">
                <div class="footer-brand">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <img src="{{ asset('img/logo_lutim_juara.png') }}" alt="Logo Lutim Juara" class="footer-logo">
                        <div style="background: #ffffff; padding: 6px 14px; border-radius: 8px; display: inline-flex; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                            <img src="{{ asset('img/logo_bkpsdm.png') }}" alt="Logo BKPSDM" style="height: 26px; width: auto; object-fit: contain;">
                        </div>
                    </div>
                    <div class="footer-info">
                        <h3>BKPSDM KABUPATEN LUWU TIMUR</h3>
                        <p>
                            Jalan Soekarno Hatta - Puncak Indah Malili, Kode Pos 92981, Sulawesi Selatan<br>
                            Sistem Informasi Persuratan & Tata Naskah Dinas Terpadu (LENTERA)
                        </p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom-bar">
                <div>&copy; 2026 BKPSDM Kabupaten Luwu Timur. Hak Cipta Dilindungi.</div>
                <div>LENTERA — Layanan Elektronik Tata Naskah dan Administrasi</div>
            </div>
        </footer>
    </div>
</body>
</html>
