<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LENTERA BKPSDM - Layanan Elektronik Tata Naskah & Administrasi Kab. Luwu Timur</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <style>
        :root {
            --gov-navy: #0f2b5c;
            --gov-navy-dark: #0a1c3d;
            --gov-navy-light: #1e3a8a;
            --gov-blue: #0284c7;
            --gov-blue-light: #f0f9ff;
            --gov-emerald: #0d9488;
            --gov-emerald-light: #f0fdfa;
            --gov-gold: #d97706;
            --gov-gold-light: #fef3c7;
            --gov-slate: #334155;
            --gov-slate-light: #f8fafc;
            --gov-border: #e2e8f0;
            --gov-card-shadow: 0 10px 25px -5px rgba(15, 43, 92, 0.06), 0 8px 10px -6px rgba(15, 43, 92, 0.04);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        body {
            background-color: #ffffff;
            color: var(--gov-slate);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* 1. TOP ANNOUNCEMENT BAR */
        .top-announce-bar {
            background: linear-gradient(90deg, #0a1c3d 0%, #1e3a8a 100%);
            color: #ffffff;
            font-size: 0.78rem;
            padding: 8px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .announce-left {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        }

        .badge-regulasi {
            background: rgba(255, 255, 255, 0.15);
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.3px;
        }

        .announce-right {
            display: flex;
            align-items: center;
            gap: 20px;
            color: #cbd5e1;
            font-size: 0.75rem;
        }

        /* 2. MAIN NAVBAR */
        header.portal-navbar {
            background: #ffffff;
            border-bottom: 1px solid var(--gov-border);
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }

        .navbar-container {
            max-width: 1240px;
            margin: 0 auto;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .portal-brand {
            display: flex;
            align-items: center;
            gap: 14px;
            text-decoration: none;
        }

        .brand-logos {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .logo-circle {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #0284c7;
            box-shadow: 0 2px 8px rgba(2, 132, 199, 0.2);
        }

        .logo-rect-card {
            background: #ffffff;
            border: 1px solid var(--gov-border);
            border-radius: 8px;
            padding: 4px 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
        }

        .logo-bkpsdm-img {
            height: 24px;
            width: auto;
        }

        .brand-meta h1 {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--gov-navy);
            letter-spacing: -0.3px;
            line-height: 1.2;
        }

        .brand-meta p {
            font-size: 0.72rem;
            color: #64748b;
            font-weight: 600;
        }

        nav.nav-menu ul {
            display: flex;
            align-items: center;
            list-style: none;
            gap: 28px;
        }

        nav.nav-menu a {
            text-decoration: none;
            color: #475569;
            font-size: 0.88rem;
            font-weight: 600;
            transition: color 0.15s ease;
        }

        nav.nav-menu a:hover {
            color: var(--gov-blue);
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .btn-login-header {
            background: linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%);
            color: #ffffff;
            padding: 8px 18px;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(30, 58, 138, 0.2);
            transition: all 0.2s ease;
        }

        .btn-login-header:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(30, 58, 138, 0.3);
        }

        /* 3. HERO SECTION (Asymmetric Split Layout) */
        section.hero-portal {
            background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
            padding: 64px 24px 80px;
            position: relative;
            overflow: hidden;
            border-bottom: 1px solid var(--gov-border);
        }

        .hero-portal::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 100%;
            background: radial-gradient(circle at 80% 20%, rgba(2, 132, 199, 0.05) 0%, transparent 60%);
            pointer-events: none;
        }

        .hero-container {
            max-width: 1240px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 48px;
            align-items: center;
        }

        .hero-tag-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #eff6ff;
            color: #1e40af;
            border: 1px solid #bfdbfe;
            padding: 5px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            margin-bottom: 20px;
        }

        .hero-headline {
            font-size: 2.35rem;
            font-weight: 800;
            color: var(--gov-navy-dark);
            line-height: 1.25;
            letter-spacing: -0.02em;
            margin-bottom: 18px;
        }

        .hero-headline .text-highlight {
            color: #0284c7;
            position: relative;
        }

        .hero-description {
            font-size: 1.02rem;
            color: #475569;
            margin-bottom: 28px;
            line-height: 1.65;
            max-width: 580px;
        }

        .hero-buttons {
            display: flex;
            gap: 14px;
            margin-bottom: 36px;
            flex-wrap: wrap;
        }

        .btn-hero-main {
            background: #1e3a8a;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 700;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 14px rgba(30, 58, 138, 0.25);
            transition: all 0.2s ease;
        }

        .btn-hero-main:hover {
            background: #1e40af;
            transform: translateY(-2px);
        }

        .btn-hero-alt {
            background: #ffffff;
            color: #1e293b;
            border: 1px solid #cbd5e1;
            padding: 12px 22px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.15s ease;
        }

        .btn-hero-alt:hover {
            background: #f1f5f9;
            border-color: #94a3b8;
        }

        .hero-metrics-strip {
            display: flex;
            gap: 28px;
            border-top: 1px solid var(--gov-border);
            padding-top: 24px;
        }

        .metric-item {
            display: flex;
            flex-direction: column;
        }

        .metric-value {
            font-size: 1.4rem;
            font-weight: 800;
            color: var(--gov-navy);
        }

        .metric-label {
            font-size: 0.75rem;
            color: #64748b;
            font-weight: 600;
        }

        /* 4. HERO RIGHT: LIVE CONTROL CARD WIDGET */
        .live-control-widget {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 18px;
            padding: 26px;
            box-shadow: 0 20px 40px -15px rgba(15, 43, 92, 0.12);
            position: relative;
        }

        .widget-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 14px;
            border-bottom: 1px solid var(--gov-border);
        }

        .widget-title {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .widget-pulse {
            width: 10px;
            height: 10px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .widget-title h3 {
            font-size: 0.95rem;
            font-weight: 800;
            color: var(--gov-navy);
        }

        .widget-badge {
            background: #ecfdf5;
            color: #065f46;
            font-size: 0.72rem;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid #a7f3d0;
        }

        .live-stat-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 14px 16px;
            margin-bottom: 12px;
        }

        .live-stat-card.accent-card {
            background: #f0fdf4;
            border-color: #bbf7d0;
        }

        .card-top-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.74rem;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .card-mid-val {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--gov-navy);
            letter-spacing: -0.2px;
        }

        .card-next-est {
            margin-top: 6px;
            font-size: 0.75rem;
            color: #059669;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .widget-footer-note {
            background: #eff6ff;
            border: 1px solid #dbeafe;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 0.74rem;
            color: #1e40af;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 14px;
        }

        /* 5. SECTION: EXECUTIVE SPOTLIGHT (Pimpinan BKPSDM) */
        section.executive-spotlight {
            padding: 70px 24px;
            background: #ffffff;
        }

        .section-header-modern {
            text-align: center;
            max-width: 680px;
            margin: 0 auto 48px;
        }

        .section-badge-modern {
            background: #eff6ff;
            color: #1e40af;
            font-size: 0.75rem;
            font-weight: 800;
            padding: 4px 12px;
            border-radius: 9999px;
            display: inline-block;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .section-title-modern {
            font-size: 1.85rem;
            font-weight: 800;
            color: var(--gov-navy-dark);
            margin-bottom: 10px;
            letter-spacing: -0.01em;
        }

        .section-sub-modern {
            font-size: 0.95rem;
            color: #64748b;
        }

        .executive-card-wrapper {
            max-width: 1080px;
            margin: 0 auto;
            background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
            border: 1px solid #dbeafe;
            border-radius: 18px;
            padding: 36px 42px;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 36px;
            align-items: center;
            box-shadow: var(--gov-card-shadow);
        }

        .exec-quote-text {
            font-size: 1.05rem;
            font-weight: 500;
            color: #1e293b;
            line-height: 1.7;
            font-style: italic;
            margin-bottom: 20px;
            position: relative;
            padding-left: 18px;
            border-left: 4px solid #0284c7;
        }

        .exec-profile-meta {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .exec-avatar {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: #1e3a8a;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.1rem;
        }

        .exec-name {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--gov-navy);
        }

        .exec-rank {
            font-size: 0.78rem;
            color: #0d9488;
            font-weight: 600;
        }

        .connected-units-list {
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #cbd5e1;
        }

        .connected-units-title {
            font-size: 0.8rem;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }

        .unit-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.84rem;
            font-weight: 600;
            color: #334155;
            padding: 7px 0;
            border-bottom: 1px solid #f1f5f9;
        }

        .unit-item:last-child { border-bottom: none; }
        .unit-item i { color: #0284c7; }

        /* 6. BENTO GRID MODULES SECTION */
        section.bento-section {
            background: #f8fafc;
            padding: 80px 24px;
            border-top: 1px solid var(--gov-border);
            border-bottom: 1px solid var(--gov-border);
        }

        .bento-container {
            max-width: 1240px;
            margin: 0 auto;
        }

        .bento-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }

        .bento-card {
            background: #ffffff;
            border: 1px solid var(--gov-border);
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.2s ease;
        }

        .bento-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 24px -6px rgba(15, 43, 92, 0.08);
            border-color: #cbd5e1;
        }

        .bento-wide {
            grid-column: span 2;
            background: linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
            border-color: #99f6e4;
        }

        .bento-icon-pill {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: #eff6ff;
            color: #1e40af;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.35rem;
            margin-bottom: 18px;
        }

        .bento-card.emerald .bento-icon-pill {
            background: #f0fdf4;
            color: #15803d;
        }

        .bento-card.gold .bento-icon-pill {
            background: #fffbeb;
            color: #b45309;
        }

        .bento-card h3 {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--gov-navy);
            margin-bottom: 10px;
        }

        .bento-card p {
            font-size: 0.88rem;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 18px;
        }

        .bento-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 18px;
        }

        .bento-tag {
            background: #f1f5f9;
            color: #475569;
            font-size: 0.72rem;
            font-weight: 600;
            padding: 3px 8px;
            border-radius: 6px;
        }

        .bento-link {
            color: #0284c7;
            font-weight: 700;
            font-size: 0.85rem;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .bento-link:hover { text-decoration: underline; }

        /* 7. LIVE KLASIFIKASI SEARCH SECTION */
        section.klasifikasi-tool-section {
            padding: 80px 24px;
            background: #ffffff;
        }

        .search-box-wrap {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border: 2px solid #0284c7;
            border-radius: 14px;
            padding: 6px;
            box-shadow: 0 10px 30px rgba(2, 132, 199, 0.12);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .search-box-wrap i {
            font-size: 1.25rem;
            color: #0284c7;
            margin-left: 14px;
        }

        .search-input-live {
            flex: 1;
            border: none;
            outline: none;
            font-size: 1rem;
            color: #0f172a;
            padding: 10px 0;
        }

        .search-btn-action {
            background: #1e3a8a;
            color: #ffffff;
            border: none;
            padding: 10px 22px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            font-size: 0.9rem;
        }

        #liveSearchSuggestions {
            max-width: 800px;
            margin: 12px auto 0;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            box-shadow: 0 12px 24px rgba(0,0,0,0.08);
            display: none;
            overflow: hidden;
        }

        .suggestion-item {
            padding: 10px 16px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 0.84rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .suggestion-item:hover {
            background: #eff6ff;
        }

        /* 8. FOOTER */
        footer.portal-footer {
            background: #0a1c3d;
            color: #ffffff;
            padding: 60px 24px 24px;
        }

        .footer-grid {
            max-width: 1240px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr;
            gap: 40px;
            padding-bottom: 40px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-brand-title {
            font-size: 1.25rem;
            font-weight: 800;
            margin-bottom: 10px;
            color: #38bdf8;
        }

        .footer-brand-desc {
            font-size: 0.84rem;
            color: #94a3b8;
            line-height: 1.6;
            margin-bottom: 18px;
        }

        .footer-col h4 {
            font-size: 0.95rem;
            font-weight: 700;
            margin-bottom: 14px;
            color: #ffffff;
        }

        .footer-col ul {
            list-style: none;
        }

        .footer-col li {
            margin-bottom: 8px;
        }

        .footer-col a {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.84rem;
            transition: color 0.15s ease;
        }

        .footer-col a:hover { color: #38bdf8; }

        .footer-bottom {
            max-width: 1240px;
            margin: 20px auto 0;
            display: flex;
            justify-content: space-between;
            font-size: 0.78rem;
            color: #64748b;
        }

        @media (max-width: 992px) {
            .hero-container { grid-template-columns: 1fr; }
            .bento-grid { grid-template-columns: 1fr; }
            .bento-wide { grid-column: span 1; }
            .executive-card-wrapper { grid-template-columns: 1fr; }
            .footer-grid { grid-template-columns: 1fr; }
            nav.nav-menu { display: none; }
        }
    </style>
</head>
<body>

    <!-- 1. TOP ANNOUNCEMENT BAR -->
    <div class="top-announce-bar">
        <div class="announce-left">
            <span class="badge-regulasi"><i class="bi bi-shield-check"></i> RESMI</span>
            <span>Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023 tentang Kode Klasifikasi Arsip</span>
        </div>
        <div class="announce-right">
            <span><i class="bi bi-geo-alt-fill"></i> Malili, Kab. Luwu Timur</span>
            <span><i class="bi bi-clock-fill"></i> Layanan: 07.30 - 16.00 WITA</span>
        </div>
    </div>

    <!-- 2. MAIN NAVBAR -->
    <header class="portal-navbar">
        <div class="navbar-container">
            <a href="{{ route('landing') }}" class="portal-brand">
                <div class="brand-logos">
                    <img src="{{ asset('img/logo_lutim_juara.png') }}" alt="Logo Lutim Juara" class="logo-circle">
                    <div class="logo-rect-card">
                        <img src="{{ asset('img/logo_bkpsdm.png') }}" alt="Logo BKPSDM" class="logo-bkpsdm-img">
                    </div>
                </div>
                <div class="brand-meta">
                    <h1>LENTERA BKPSDM</h1>
                    <p>Kabupaten Luwu Timur • Versi Laravel MVC</p>
                </div>
            </a>

            <nav class="nav-menu">
                <ul>
                    <li><a href="#hero">Beranda</a></li>
                    <li><a href="#pimpinan">Pimpinan</a></li>
                    <li><a href="#modul">Modul Layanan</a></li>
                    <li><a href="#kamus">Cari Klasifikasi</a></li>
                </ul>
            </nav>

            <div class="nav-actions">
                <a href="{{ route('login') }}" class="btn-login-header">
                    <i class="bi bi-box-arrow-in-right"></i> Masuk ke Sistem
                </a>
            </div>
        </div>
    </header>

    <!-- 3. HERO SECTION (Split Layout) -->
    <section class="hero-portal" id="hero">
        <div class="hero-container">
            <!-- Left Info -->
            <div>
                <div class="hero-tag-badge">
                    <i class="bi bi-cpu-fill"></i> Sistem Persuratan Elektronik & Tata Naskah Dinas Terpadu
                </div>

                <h1 class="hero-headline">
                    Transformasi Digital Persuratan & <span class="text-highlight">Tertib Naskah Dinas</span> BKPSDM
                </h1>

                <p class="hero-description">
                    Mewujudkan administrasi perkantoran modern tanpa nomor ganda. Integrasi penomoran surat keluar otomatis, pencatatan buku agenda masuk, dan kendali lembar disposisi pimpinan berbasis regulasi daerah.
                </p>

                <div class="hero-buttons">
                    <a href="{{ route('login') }}" class="btn-hero-main">
                        <i class="bi bi-shield-lock-fill"></i> Masuk Portal Persuratan
                    </a>
                    <a href="#kamus" class="btn-hero-alt">
                        <i class="bi bi-search"></i> Cari Kode Perbup (2.961 Kode)
                    </a>
                </div>

                <div class="hero-metrics-strip">
                    <div class="metric-item">
                        <span class="metric-value">{{ number_format($stats['total_surat_keluar']) }}</span>
                        <span class="metric-label">Surat Keluar Terbit</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">{{ number_format($stats['total_surat_masuk']) }}</span>
                        <span class="metric-label">Agenda Masuk</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">{{ number_format($stats['total_surat_tugas']) }}</span>
                        <span class="metric-label">SPT Kedinasan</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">{{ number_format($stats['total_klasifikasi']) }}</span>
                        <span class="metric-label">Kode Perbup 69/2023</span>
                    </div>
                </div>
            </div>

            <!-- Right Live Control Panel Widget -->
            <div class="live-control-widget">
                <div class="widget-header">
                    <div class="widget-title">
                        <span class="widget-pulse"></span>
                        <h3>Pusat Penomoran Digital (Anti-Ganda)</h3>
                    </div>
                    <span class="widget-badge">Real-Time Terkunci</span>
                </div>

                <!-- Surat Keluar Live Card -->
                <div class="live-stat-card accent-card">
                    <div class="card-top-row">
                        <span><i class="bi bi-send-fill text-success"></i> SURAT KELUAR DINAS</span>
                        <span>Kode Perbup 69/2023</span>
                    </div>
                    <div class="card-mid-val">
                        {{ $keluarSeq['last_surat']->no_surat_keluar ?? '800.1.3.3/841/BKPSDM/X/2026' }}
                    </div>
                    <div class="card-next-est">
                        <i class="bi bi-check-circle-fill"></i> Estimasi Urutan Berikutnya: <strong>{{ $keluarSeq['next_number'] }}</strong>
                    </div>
                </div>

                <!-- Surat Tugas Live Card -->
                <div class="live-stat-card">
                    <div class="card-top-row">
                        <span><i class="bi bi-briefcase-fill text-primary"></i> SURAT PERINTAH TUGAS (SPT)</span>
                        <span>Klasifikasi: 800.1.11.1</span>
                    </div>
                    <div class="card-mid-val">
                        {{ $tugasSeq['last_spt']->no_surat_tugas ?? '800.1.11.1/135/BKPSDM' }}
                    </div>
                    <div class="card-next-est" style="color: #2563eb;">
                        <i class="bi bi-check-circle-fill"></i> Nomor Urut Berikutnya: <strong>{{ $tugasSeq['full_next_no'] }}</strong>
                    </div>
                </div>

                <div class="widget-footer-note">
                    <i class="bi bi-info-circle-fill"></i>
                    <span>Rekan kantor yang sedang menyusun draf di Microsoft Word dapat mengacu ke nomor estimasi di atas.</span>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. SECTION: EXECUTIVE SPOTLIGHT (Pimpinan BKPSDM) -->
    <section class="executive-spotlight" id="pimpinan">
        <div class="section-header-modern">
            <span class="section-badge-modern">Kepemimpinan & Komitmen</span>
            <h2 class="section-title-modern">Aparatur Berintegritas, Tata Naskah Akuntabel</h2>
            <p class="section-sub-modern">Penyelenggaraan tata naskah dinas kedinasan BKPSDM Kabupaten Luwu Timur di bawah koordinasi Kepala Badan.</p>
        </div>

        <div class="executive-card-wrapper">
            <div>
                <p class="exec-quote-text">
                    "Penerapan tertib administrasi persuratan dan penomoran digital terpusat merupakan komitmen BKPSDM Kabupaten Luwu Timur dalam mewujudkan birokrasi aparatur yang berkeadaban, transparan, dan bebas dari duplikasi administrasi sesuai Peraturan Bupati Nomor 69 Tahun 2023."
                </p>

                <div class="exec-profile-meta">
                    <div class="exec-avatar">PA</div>
                    <div>
                        <div class="exec-name">PARHA ARIEF, S.AP</div>
                        <div class="exec-rank">Pembina (IV/a) • Kepala BKPSDM Kabupaten Luwu Timur</div>
                    </div>
                </div>
            </div>

            <!-- Connected Organizational Units -->
            <div class="connected-units-list">
                <div class="connected-units-title">Unit Kerja Terintegrasi Sistem:</div>
                <div class="unit-item">
                    <i class="bi bi-check2-circle"></i>
                    <span>Bidang Pengadaan, Mutasi & Informasi Kepegawaian</span>
                </div>
                <div class="unit-item">
                    <i class="bi bi-check2-circle"></i>
                    <span>Bidang Pengembangan Kompetensi & Kinerja Aparatur</span>
                </div>
                <div class="unit-item">
                    <i class="bi bi-check2-circle"></i>
                    <span>Sekretariat / Subbagian Umum & Kepegawaian</span>
                </div>
                <div class="unit-item">
                    <i class="bi bi-check2-circle"></i>
                    <span>Subbagian Perencanaan & Keuangan</span>
                </div>
            </div>
        </div>
    </section>

    <!-- 5. BENTO GRID MODULES SECTION -->
    <section class="bento-section" id="modul">
        <div class="bento-container">
            <div class="section-header-modern">
                <span class="section-badge-modern">Arsitektur Modul Persuratan</span>
                <h2 class="section-title-modern">Empat Pilar Tata Naskah Dinas Terpadu</h2>
                <p class="section-sub-modern">Alur operasional persuratan dirancang terstruktur dan terotomatisasi secara end-to-end.</p>
            </div>

            <div class="bento-grid">
                <!-- Bento 1: Large Wide Box (Surat Keluar) -->
                <div class="bento-card bento-wide">
                    <div>
                        <div class="bento-icon-pill" style="background: #f0fdf4; color: #15803d;">
                            <i class="bi bi-send-check-fill"></i>
                        </div>
                        <h3>Penerbitan Nomor Surat Keluar Resmi (Anti Nomor Ganda)</h3>
                        <p>
                            Menghilangkan insiden bentrok penomoran antar-bidang yang sedang menyusun draf di Microsoft Word. Rumus baku <code>[Kode Perbup]/[Urut]/BKPSDM/[Romawi]/[Tahun]</code> terhitung murni secara real-time dari database pusat.
                        </p>
                        <div class="bento-tags">
                            <span class="bento-tag">Algoritma N+1 Murni</span>
                            <span class="bento-tag">Buku Agenda Otomatis</span>
                            <span class="bento-tag">Klasifikasi Baku 2026</span>
                        </div>
                    </div>
                    <a href="{{ route('login') }}" class="bento-link">Buka Registrasi Surat Keluar →</a>
                </div>

                <!-- Bento 2: Kendali Disposisi -->
                <div class="bento-card">
                    <div>
                        <div class="bento-icon-pill">
                            <i class="bi bi-diagram-3-fill"></i>
                        </div>
                        <h3>Lembar Kendali Disposisi</h3>
                        <p>
                            Distribusi petunjuk pimpinan secara presisi ke 6 unit/pejabat struktural resmi. Dilengkapi format cetak blanko fisik A4 standar pemerintah.
                        </p>
                        <div class="bento-tags">
                            <span class="bento-tag">6 Unit Tujuan Resmi</span>
                            <span class="bento-tag">Cetak A4 Siap Pakai</span>
                        </div>
                    </div>
                    <a href="{{ route('login') }}" class="bento-link">Buka Lembar Disposisi →</a>
                </div>

                <!-- Bento 3: Surat Tugas (SPT) -->
                <div class="bento-card">
                    <div>
                        <div class="bento-icon-pill" style="background: #fffbeb; color: #b45309;">
                            <i class="bi bi-briefcase-fill"></i>
                        </div>
                        <h3>Surat Perintah Tugas (SPT)</h3>
                        <p>
                            Penugasan aparatur terpusat pada kode <code>800.1.11.1</code> dengan dukungan multi-pegawai dari 44 personil resmi BKPSDM.
                        </p>
                        <div class="bento-tags">
                            <span class="bento-tag">Kode 800.1.11.1</span>
                            <span class="bento-tag">Multi-Personil</span>
                        </div>
                    </div>
                    <a href="{{ route('login') }}" class="bento-link">Buka Register SPT →</a>
                </div>

                <!-- Bento 4: Surat Masuk -->
                <div class="bento-card">
                    <div>
                        <div class="bento-icon-pill">
                            <i class="bi bi-inbox-fill"></i>
                        </div>
                        <h3>Buku Agenda Surat Masuk</h3>
                        <p>
                            Registrasi naskah masuk instansi eksternal secara tertib dengan nomor agenda unik <code>SM-2026-XXX</code> dan pelacakan status disposisi.
                        </p>
                        <div class="bento-tags">
                            <span class="bento-tag">No. Agenda Unik</span>
                            <span class="bento-tag">Pelacakan Status</span>
                        </div>
                    </div>
                    <a href="{{ route('login') }}" class="bento-link">Buka Agenda Masuk →</a>
                </div>

                <!-- Bento 5: Laporan & Ekspor -->
                <div class="bento-card">
                    <div>
                        <div class="bento-icon-pill" style="background: #fdf2f8; color: #be185d;">
                            <i class="bi bi-journal-text"></i>
                        </div>
                        <h3>Rekapitulasi & Ekspor CSV</h3>
                        <p>
                            Laporan buku agenda berkala dapat difilter berdasarkan rentang tanggal dan diekspor ke format spreadsheet CSV / Excel sekali klik.
                        </p>
                        <div class="bento-tags">
                            <span class="bento-tag">Ekspor CSV Excel</span>
                            <span class="bento-tag">Cetak Buku Agenda</span>
                        </div>
                    </div>
                    <a href="{{ route('login') }}" class="bento-link">Lihat Fitur Laporan →</a>
                </div>
            </div>
        </div>
    </section>

    <!-- 6. LIVE KLASIFIKASI SEARCH SECTION -->
    <section class="klasifikasi-tool-section" id="kamus">
        <div class="section-header-modern">
            <span class="section-badge-modern">Kamus Digital Kearsipan</span>
            <h2 class="section-title-modern">Pencarian Kode Klasifikasi Perbup 69/2023</h2>
            <p class="section-sub-modern">Ketik kata kunci perihal surat untuk menemukan kode klasifikasi resmi dari 2.961 entri baku daerah.</p>
        </div>

        <div class="search-box-wrap">
            <i class="bi bi-search"></i>
            <input type="text" id="landingLiveSearch" class="search-input-live" placeholder="Ketik kata kunci naskah dinas (contoh: mutasi, cuti, pensiun, tugas belajar, 800)..." oninput="doSearch(this.value)">
            <button type="button" class="search-btn-action">Cari Kode</button>
        </div>

        <div id="liveSearchSuggestions"></div>
    </section>

    <!-- 7. FOOTER -->
    <footer class="portal-footer">
        <div class="footer-grid">
            <div>
                <div class="footer-brand-title">LENTERA BKPSDM KAB. LUWU TIMUR</div>
                <p class="footer-brand-desc">
                    Layanan Elektronik Tata Naskah dan Administrasi Persuratan Terpadu berbasis Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023. Implementasi arsitektur Model-View-Controller (Laravel 11/12).
                </p>
                <div style="font-size: 0.8rem; color: #cbd5e1;">
                    <i class="bi bi-geo-alt"></i> Kompleks Perkantoran Pemerintah Daerah Kabupaten Luwu Timur, Puncak Indah Malili, 92981
                </div>
            </div>

            <div class="footer-col">
                <h4>Navigasi Portal</h4>
                <ul>
                    <li><a href="#hero">Beranda Utama</a></li>
                    <li><a href="#pimpinan">Profil Kepemimpinan</a></li>
                    <li><a href="#modul">Empat Pilar Layanan</a></li>
                    <li><a href="#kamus">Pencarian Kode Klasifikasi</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Akses Pegawai</h4>
                <ul>
                    <li><a href="{{ route('login') }}">Masuk Portal LENTERA</a></li>
                    <li><a href="{{ route('login') }}">Buku Agenda Surat Keluar</a></li>
                    <li><a href="{{ route('login') }}">Registrasi Surat Tugas</a></li>
                    <li><a href="{{ route('login') }}">Papan Kendali Disposisi</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <div>&copy; 2026 Pemerintah Kabupaten Luwu Timur — BKPSDM. Hak Cipta Dilindungi.</div>
            <div>Implementasi Skripsi Mahasiswa Universitas Mega Buana Palopo (Yusri Mahendra - IK2311011)</div>
        </div>
    </footer>

    <script>
        let debounceTimer;
        function doSearch(q) {
            clearTimeout(debounceTimer);
            const box = document.getElementById('liveSearchSuggestions');
            const query = q.trim();

            if (query.length < 2) {
                box.style.display = 'none';
                return;
            }

            debounceTimer = setTimeout(() => {
                fetch(`/api/klasifikasi/search?q=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (!data || data.length === 0) {
                            box.innerHTML = '<div style="padding: 14px; text-align: center; color: #94a3b8; font-size: 0.85rem;">Tidak ditemukan kode klasifikasi yang cocok.</div>';
                            box.style.display = 'block';
                            return;
                        }

                        let html = '';
                        data.slice(0, 6).forEach(item => {
                            html += `
                                <div class="suggestion-item">
                                    <div>
                                        <strong style="color: #1e3a8a; font-size: 0.95rem;">${item.kode}</strong>
                                        <div style="color: #334155; font-weight: 500;">${item.nama}</div>
                                    </div>
                                    <span style="background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; color: #64748b;">${item.kategori}</span>
                                </div>
                            `;
                        });
                        box.innerHTML = html;
                        box.style.display = 'block';
                    })
                    .catch(() => {
                        box.style.display = 'none';
                    });
            }, 250);
        }
    </script>
</body>
</html>
