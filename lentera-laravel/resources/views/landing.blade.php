<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LENTERA 2.0 - Sistem Informasi Tata Naskah & Penomoran Digital BKPSDM Luwu Timur</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <style>
        :root {
            --brand-primary: #2563eb;
            --brand-primary-hover: #1d4ed8;
            --brand-dark: #0f172a;
            --brand-navy: #1e3a8a;
            --brand-emerald: #10b981;
            --brand-amber: #f59e0b;
            --brand-purple: #8b5cf6;
            --bg-page: #f8fafc;
            --bg-card: #ffffff;
            --border-subtle: #e2e8f0;
            --border-highlight: #cbd5e1;
            --text-heading: #0f172a;
            --text-body: #475569;
            --text-muted: #94a3b8;
            --radius-pill: 9999px;
            --radius-card: 20px;
            --radius-btn: 12px;
            --shadow-subtle: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
            --shadow-float: 0 20px 35px -10px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.04);
            --shadow-glow: 0 0 25px rgba(37, 99, 235, 0.15);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        body {
            background-color: var(--bg-page);
            background-image: 
                radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.06) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.06) 0px, transparent 50%),
                radial-gradient(at 50% 100%, rgba(139, 92, 246, 0.04) 0px, transparent 50%);
            color: var(--text-body);
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* 1. TOP FLOATING TICKER */
        .top-ticker {
            background: #ffffff;
            border-bottom: 1px solid var(--border-subtle);
            padding: 8px 24px;
            font-size: 0.78rem;
            color: var(--text-body);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ticker-badge {
            background: #eff6ff;
            color: #1d4ed8;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: var(--radius-pill);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: 1px solid #bfdbfe;
        }

        .ticker-right {
            display: flex;
            align-items: center;
            gap: 16px;
            font-weight: 500;
        }

        .status-dot-live {
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
            animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        /* 2. MODERN FROSTED NAVBAR */
        header.modern-header {
            position: sticky;
            top: 14px;
            z-index: 1000;
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .navbar-pill {
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(226, 232, 240, 0.9);
            border-radius: var(--radius-pill);
            padding: 10px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: var(--shadow-float);
        }

        .brand-link {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .brand-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #2563eb;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
        }

        .brand-badge-bkpsdm {
            background: #ffffff;
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            padding: 4px 8px;
            display: flex;
            align-items: center;
        }

        .brand-title-group h1 {
            font-size: 1.05rem;
            font-weight: 800;
            color: var(--brand-dark);
            letter-spacing: -0.02em;
            line-height: 1.2;
        }

        .brand-title-group span {
            font-size: 0.7rem;
            font-weight: 600;
            color: var(--text-muted);
        }

        nav.nav-links {
            display: flex;
            align-items: center;
            gap: 28px;
        }

        nav.nav-links a {
            text-decoration: none;
            color: var(--text-body);
            font-size: 0.88rem;
            font-weight: 600;
            transition: color 0.15s ease;
        }

        nav.nav-links a:hover {
            color: var(--brand-primary);
        }

        .btn-portal-login {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            color: #ffffff;
            font-size: 0.85rem;
            font-weight: 700;
            padding: 9px 20px;
            border-radius: var(--radius-pill);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
            transition: all 0.2s ease;
        }

        .btn-portal-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
        }

        /* 3. HERO SECTION - 2026 CUTTING EDGE */
        section.hero-section {
            max-width: 1240px;
            margin: 40px auto 0;
            padding: 40px 24px 60px;
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            gap: 48px;
            align-items: center;
        }

        .hero-chip {
            background: #ffffff;
            border: 1px solid #bfdbfe;
            color: #1d4ed8;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 6px 16px;
            border-radius: var(--radius-pill);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.08);
            margin-bottom: 22px;
        }

        .hero-title {
            font-size: clamp(2rem, 3.8vw, 3.1rem);
            font-weight: 800;
            color: var(--brand-dark);
            line-height: 1.18;
            letter-spacing: -0.03em;
            margin-bottom: 20px;
        }

        .text-gradient {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0d9488 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
            font-size: 1.05rem;
            color: #475569;
            line-height: 1.7;
            margin-bottom: 32px;
            max-width: 580px;
        }

        .hero-cta-group {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }

        .btn-cta-primary {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            color: #ffffff;
            font-size: 0.95rem;
            font-weight: 700;
            padding: 13px 28px;
            border-radius: var(--radius-btn);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
            transition: all 0.2s ease;
        }

        .btn-cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 14px 28px -5px rgba(37, 99, 235, 0.5);
        }

        .btn-cta-secondary {
            background: #ffffff;
            color: #1e293b;
            border: 1px solid var(--border-subtle);
            font-size: 0.95rem;
            font-weight: 600;
            padding: 13px 24px;
            border-radius: var(--radius-btn);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: var(--shadow-subtle);
            transition: all 0.15s ease;
        }

        .btn-cta-secondary:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
        }

        /* 4-KPI Strip */
        .kpi-strip {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            border-top: 1px solid var(--border-subtle);
            padding-top: 24px;
        }

        .kpi-box {
            display: flex;
            flex-direction: column;
        }

        .kpi-number {
            font-size: 1.45rem;
            font-weight: 800;
            color: var(--brand-dark);
            line-height: 1.2;
        }

        .kpi-desc {
            font-size: 0.74rem;
            color: var(--text-muted);
            font-weight: 600;
            margin-top: 2px;
        }

        /* 4. HERO RIGHT: INTERACTIVE SIMULATOR WIDGET */
        .hero-simulator-widget {
            background: #ffffff;
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-card);
            padding: 28px;
            box-shadow: var(--shadow-float);
            position: relative;
        }

        .widget-top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
            padding-bottom: 14px;
            border-bottom: 1px solid var(--border-subtle);
        }

        .widget-badge-status {
            background: #ecfdf5;
            color: #065f46;
            border: 1px solid #a7f3d0;
            font-size: 0.72rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: var(--radius-pill);
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .live-preview-box {
            background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
            border: 1px solid #bfdbfe;
            border-radius: 14px;
            padding: 18px 20px;
            margin-bottom: 18px;
        }

        .preview-label {
            font-size: 0.72rem;
            font-weight: 700;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }

        .preview-output-number {
            font-size: 1.25rem;
            font-weight: 800;
            color: #1e3a8a;
            font-family: monospace;
            letter-spacing: 0.02em;
            word-break: break-all;
        }

        .preview-subtext {
            font-size: 0.72rem;
            color: #059669;
            font-weight: 600;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* Live test input in widget */
        .widget-input-row {
            margin-bottom: 16px;
        }

        .widget-input-row label {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--brand-dark);
            margin-bottom: 6px;
        }

        .widget-input-group {
            display: flex;
            gap: 8px;
        }

        .widget-input-control {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            font-size: 0.85rem;
            font-weight: 600;
            outline: none;
            transition: border-color 0.15s ease;
        }

        .widget-input-control:focus {
            border-color: var(--brand-primary);
        }

        .btn-copy-widget {
            background: #ffffff;
            border: 1px solid #cbd5e1;
            color: #334155;
            padding: 0 14px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 0.82rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.15s ease;
        }

        .btn-copy-widget:hover {
            background: #eff6ff;
            border-color: #93c5fd;
            color: #1d4ed8;
        }

        .widget-spt-strip {
            background: #f0fdfa;
            border: 1px solid #99f6e4;
            border-radius: 12px;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.78rem;
        }

        /* 5. SECTION: BENTO GRID MODULES 2.0 */
        section.bento-showcase {
            max-width: 1240px;
            margin: 60px auto 0;
            padding: 0 24px;
        }

        .section-header-pill {
            text-align: center;
            max-width: 650px;
            margin: 0 auto 48px;
        }

        .pill-tag {
            background: #eff6ff;
            color: #2563eb;
            font-size: 0.75rem;
            font-weight: 800;
            padding: 4px 14px;
            border-radius: var(--radius-pill);
            display: inline-block;
            margin-bottom: 12px;
            border: 1px solid #dbeafe;
        }

        .bento-heading {
            font-size: 2rem;
            font-weight: 800;
            color: var(--brand-dark);
            letter-spacing: -0.02em;
            margin-bottom: 12px;
        }

        .bento-grid-2026 {
            display: grid;
            grid-template-columns: 1.3fr 0.85fr 0.85fr;
            grid-template-rows: auto auto;
            gap: 22px;
        }

        .bento-card-modern {
            background: #ffffff;
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-card);
            padding: 30px;
            box-shadow: var(--shadow-subtle);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
        }

        .bento-card-modern:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-float);
            border-color: #cbd5e1;
        }

        .bento-card-hero {
            grid-column: span 1;
            grid-row: span 2;
            background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
            border-color: #a7f3d0;
        }

        .bento-icon-box {
            width: 50px;
            height: 50px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            margin-bottom: 20px;
        }

        .icon-blue { background: #eff6ff; color: #2563eb; }
        .icon-emerald { background: #ecfdf5; color: #059669; }
        .icon-amber { background: #fffbeb; color: #d97706; }
        .icon-purple { background: #f5f3ff; color: #7c3aed; }

        .bento-card-modern h3 {
            font-size: 1.2rem;
            font-weight: 800;
            color: var(--brand-dark);
            margin-bottom: 10px;
        }

        .bento-card-modern p {
            font-size: 0.88rem;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .bento-feature-list {
            list-style: none;
            margin-bottom: 22px;
        }

        .bento-feature-list li {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.82rem;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
        }

        .bento-feature-list li i { color: #10b981; }

        .bento-card-link {
            font-size: 0.86rem;
            font-weight: 700;
            color: var(--brand-primary);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: auto;
        }

        .bento-card-link:hover { text-decoration: underline; }

        /* 6. SECTION: LIVE KLASIFIKASI EXPLORER (2026 Tech Tool) */
        section.klasifikasi-explorer {
            max-width: 1240px;
            margin: 80px auto 0;
            padding: 0 24px;
        }

        .explorer-card {
            background: #ffffff;
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-card);
            padding: 38px 40px;
            box-shadow: var(--shadow-float);
        }

        .explorer-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .search-pill-input {
            position: relative;
            max-width: 480px;
            width: 100%;
        }

        .search-pill-input i {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 1.05rem;
        }

        .search-pill-input input {
            width: 100%;
            padding: 12px 18px 12px 44px;
            border-radius: var(--radius-pill);
            border: 1.5px solid #cbd5e1;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.2s ease;
        }

        .search-pill-input input:focus {
            border-color: var(--brand-primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .chips-category-bar {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .category-chip-btn {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid transparent;
            padding: 6px 14px;
            border-radius: var(--radius-pill);
            font-size: 0.78rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .category-chip-btn.active, .category-chip-btn:hover {
            background: #eff6ff;
            color: #1d4ed8;
            border-color: #bfdbfe;
        }

        .results-table-preview {
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            overflow: hidden;
        }

        table.explorer-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
        }

        table.explorer-table th {
            background: #f8fafc;
            color: #64748b;
            font-weight: 700;
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border-subtle);
        }

        table.explorer-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #334155;
        }

        table.explorer-table tr:hover td {
            background-color: #f8fafc;
        }

        /* 7. SECTION: LEADERSHIP GOVERNANCE (PARHA ARIEF, S.AP) */
        section.leadership-section {
            max-width: 1240px;
            margin: 80px auto 0;
            padding: 0 24px;
        }

        .leadership-card {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
            color: #ffffff;
            border-radius: var(--radius-card);
            padding: 42px 48px;
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 40px;
            align-items: center;
            box-shadow: var(--shadow-float);
        }

        .quote-lead {
            font-size: 1.15rem;
            font-weight: 500;
            line-height: 1.7;
            font-style: italic;
            margin-bottom: 24px;
            opacity: 0.95;
            position: relative;
            padding-left: 20px;
            border-left: 4px solid #38bdf8;
        }

        .leader-profile-row {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .leader-initials-badge {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.15);
            border: 2px solid #38bdf8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 1.2rem;
            color: #ffffff;
        }

        .leader-name {
            font-size: 1.15rem;
            font-weight: 800;
            letter-spacing: -0.01em;
        }

        .leader-role {
            font-size: 0.82rem;
            color: #93c5fd;
            font-weight: 600;
        }

        .audit-compliance-card {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
        }

        .audit-card-title {
            font-size: 0.82rem;
            font-weight: 700;
            color: #38bdf8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }

        .audit-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.84rem;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .audit-item:last-child { border-bottom: none; }
        .audit-item i { color: #34d399; }

        /* 8. FOOTER - 2026 CLEAN CORPORATE */
        footer.modern-footer {
            background: #ffffff;
            border-top: 1px solid var(--border-subtle);
            margin-top: 90px;
            padding: 60px 24px 30px;
        }

        .footer-inner-grid {
            max-width: 1240px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1.5fr 1fr 1fr;
            gap: 40px;
            padding-bottom: 40px;
            border-bottom: 1px solid var(--border-subtle);
        }

        .footer-brand-title {
            font-size: 1.2rem;
            font-weight: 800;
            color: var(--brand-dark);
            margin-bottom: 8px;
        }

        .footer-brand-text {
            font-size: 0.86rem;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 16px;
            max-width: 480px;
        }

        .footer-col-title {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--brand-dark);
            margin-bottom: 14px;
        }

        .footer-links-list {
            list-style: none;
        }

        .footer-links-list li {
            margin-bottom: 8px;
        }

        .footer-links-list a {
            color: #64748b;
            text-decoration: none;
            font-size: 0.85rem;
            transition: color 0.15s ease;
        }

        .footer-links-list a:hover {
            color: var(--brand-primary);
        }

        .footer-bottom-bar {
            max-width: 1240px;
            margin: 20px auto 0;
            display: flex;
            justify-content: space-between;
            font-size: 0.78rem;
            color: #94a3b8;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1024px) {
            section.hero-section { grid-template-columns: 1fr; }
            .bento-grid-2026 { grid-template-columns: 1fr; }
            .bento-card-hero { grid-column: span 1; grid-row: span 1; }
            .leadership-card { grid-template-columns: 1fr; }
            .footer-inner-grid { grid-template-columns: 1fr; }
            nav.nav-links { display: none; }
        }

        @media (max-width: 640px) {
            .kpi-strip { grid-template-columns: 1fr 1fr; }
            .hero-cta-group { flex-direction: column; width: 100%; }
            .btn-cta-primary, .btn-cta-secondary { width: 100%; justify-content: center; }
            .top-ticker { display: none; }
            .navbar-pill { padding: 8px 16px; }
        }
    </style>
</head>
<body>

    <!-- 1. TOP FLOATING TICKER -->
    <div class="top-ticker">
        <div class="ticker-badge">
            <span class="status-dot-live"></span>
            <span>Perbup Luwu Timur No. 69 Tahun 2023</span>
        </div>
        <div class="ticker-right">
            <span><i class="bi bi-geo-alt-fill text-primary"></i> Puncak Indah Malili</span>
            <span><i class="bi bi-clock-history"></i> Jam Operasional: 07.30 - 16.00 WITA</span>
        </div>
    </div>

    <!-- 2. MODERN FROSTED NAVBAR (Floating Pill) -->
    <header class="modern-header">
        <div class="navbar-pill">
            <a href="{{ route('landing') }}" class="brand-link">
                <img src="{{ asset('img/logo_lutim_juara.png') }}" alt="Logo Lutim Juara" class="brand-avatar">
                <div class="brand-badge-bkpsdm">
                    <img src="{{ asset('img/logo_bkpsdm.png') }}" alt="Logo BKPSDM" style="height: 22px; width: auto; object-fit: contain;">
                </div>
                <div class="brand-title-group">
                    <h1>LENTERA 2.0</h1>
                    <span>BKPSDM KAB. LUWU TIMUR</span>
                </div>
            </a>

            <nav class="nav-links">
                <a href="#hero">Beranda</a>
                <a href="#modul">Layanan Digital</a>
                <a href="#kamus">Cari Kode Perbup</a>
                <a href="#pimpinan">Kepemimpinan</a>
            </nav>

            <a href="{{ route('login') }}" class="btn-portal-login">
                <i class="bi bi-box-arrow-in-right"></i> Masuk ke Sistem
            </a>
        </div>
    </header>

    <!-- 3. HERO SECTION - 2026 CUTTING EDGE TECH -->
    <section class="hero-section" id="hero">
        <!-- Left: High Impact Value Proposition -->
        <div>
            <div class="hero-chip">
                <i class="bi bi-lightning-charge-fill" style="color: #f59e0b;"></i>
                <span>Platform Tata Naskah Dinas Terakreditasi • Versi Laravel 11 MVC</span>
            </div>

            <h1 class="hero-title">
                Satu Ekosistem Digital untuk <span class="text-gradient">Tata Naskah & Penomoran Resmi</span> BKPSDM
            </h1>

            <p class="hero-subtitle">
                Menjamin integritas persuratan tanpa risiko nomor ganda, mengotomasi penomoran surat keluar dan SPT dinas secara terpusat, serta mempercepat alur disposisi pimpinan secara akuntabel.
            </p>

            <div class="hero-cta-group">
                <a href="{{ route('login') }}" class="btn-cta-primary">
                    <i class="bi bi-shield-lock-fill"></i> Masuk ke Portal Persuratan
                </a>
                <a href="#kamus" class="btn-cta-secondary">
                    <i class="bi bi-search"></i> Eksplorasi 2.961 Kode Klasifikasi
                </a>
            </div>

            <div class="kpi-strip">
                <div class="kpi-box">
                    <span class="kpi-number">{{ number_format($stats['total_surat_keluar']) }}</span>
                    <span class="kpi-desc">Surat Keluar Terbit</span>
                </div>
                <div class="kpi-box">
                    <span class="kpi-number">{{ number_format($stats['total_surat_masuk']) }}</span>
                    <span class="kpi-desc">Buku Agenda Masuk</span>
                </div>
                <div class="kpi-box">
                    <span class="kpi-number">{{ number_format($stats['total_surat_tugas']) }}</span>
                    <span class="kpi-desc">SPT Terbit</span>
                </div>
                <div class="kpi-box">
                    <span class="kpi-number">{{ number_format($stats['total_klasifikasi']) }}</span>
                    <span class="kpi-desc">Kode Perbup Resmi</span>
                </div>
            </div>
        </div>

        <!-- Right: Interactive Live Numbering Simulator Widget -->
        <div class="hero-simulator-widget">
            <div class="widget-top-bar">
                <div style="font-weight: 800; font-size: 0.95rem; color: var(--brand-dark); display: flex; align-items: center; gap: 8px;">
                    <i class="bi bi-cpu text-primary"></i> Live Engine Penomoran
                </div>
                <span class="widget-badge-status">
                    <span class="status-dot-live"></span> Anti-Nomor Ganda Aktif
                </span>
            </div>

            <!-- Surat Keluar Live Generator -->
            <div class="live-preview-box">
                <div class="preview-label">Nomor Surat Keluar Resmi Terakhir:</div>
                <div class="preview-output-number" id="previewSuratKeluar">
                    {{ $keluarSeq['last_surat']->no_surat_keluar ?? '800.1.3.3/841/BKPSDM/X/2026' }}
                </div>
                <div class="preview-subtext">
                    <i class="bi bi-check-circle-fill"></i> Estimasi Urutan Berikutnya: <strong>{{ $keluarSeq['next_number'] }}</strong> (Siap digunakan di Microsoft Word)
                </div>
            </div>

            <!-- Interactive Code Tester Input -->
            <div class="widget-input-row">
                <label>Uji Rumus Penomoran Mandiri (Live Test):</label>
                <div class="widget-input-group">
                    <input type="text" id="demoKodeInput" class="widget-input-control" value="800.1.3.3" placeholder="Masukkan kode perbup..." oninput="updateLiveSimulator()">
                    <button type="button" class="btn-copy-widget" onclick="copySimulatedNumber()">
                        <i class="bi bi-clipboard"></i> Salin
                    </button>
                </div>
            </div>

            <!-- SPT Strip -->
            <div class="widget-spt-strip">
                <div>
                    <strong style="color: #0f766e;"><i class="bi bi-briefcase-fill"></i> SPT Kedinasan (800.1.11.1):</strong>
                    <div style="font-family: monospace; font-size: 0.88rem; font-weight: 800; color: #115e59; margin-top: 2px;">
                        800.1.11.1/{{ sprintf('%03d', $tugasSeq['next_number']) }}/BKPSDM
                    </div>
                </div>
                <span style="background: #ffffff; border: 1px solid #99f6e4; color: #0d9488; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
                    Urutan {{ $tugasSeq['next_number'] }}
                </span>
            </div>
        </div>
    </section>

    <!-- 4. SECTION: BENTO GRID 2026 (4 Layanan Utama) -->
    <section class="bento-showcase" id="modul">
        <div class="section-header-pill">
            <span class="pill-tag">Arsitektur Terstruktur</span>
            <h2 class="bento-heading">Empat Modul Inti Tata Naskah Digital</h2>
            <p>Dirancang untuk memenuhi standar operasional persuratan dinas modern secara terintegrasi.</p>
        </div>

        <div class="bento-grid-2026">
            <!-- Bento 1: Large Primary Bento Card -->
            <div class="bento-card-modern bento-card-hero">
                <div>
                    <div class="bento-icon-box icon-emerald">
                        <i class="bi bi-shield-check"></i>
                    </div>
                    <h3>Anti-Nomor Ganda Engine</h3>
                    <p>
                        Solusi mutakhir untuk mencegah insiden nomor naskah bentrok antar-bidang yang sedang menyusun draf di Microsoft Word. Menghitung urutan murni $N+1$ secara real-time dari database pusat.
                    </p>
                    <ul class="bento-feature-list">
                        <li><i class="bi bi-check-circle-fill"></i> Verifikasi real-time bebas lompat nomor</li>
                        <li><i class="bi bi-check-circle-fill"></i> Konversi otomatis bulan Romawi (I s.d. XII)</li>
                        <li><i class="bi bi-check-circle-fill"></i> Sesuai format baku Perbup Luwu Timur No. 69/2023</li>
                        <li><i class="bi bi-check-circle-fill"></i> Papan pantau nomor transparan bagi seluruh staf</li>
                    </ul>
                </div>
                <a href="{{ route('login') }}" class="bento-card-link">Akses Register Surat Keluar →</a>
            </div>

            <!-- Bento 2: Lembar Disposisi -->
            <div class="bento-card-modern">
                <div>
                    <div class="bento-icon-box icon-blue">
                        <i class="bi bi-diagram-3-fill"></i>
                    </div>
                    <h3>Lembar Kendali Disposisi</h3>
                    <p>
                        Distribusi instruksi pimpinan secara presisi ke 6 unit/pejabat struktural resmi. Dilengkapi format cetak blanko fisik A4 resmi standar pemerintah.
                    </p>
                </div>
                <a href="{{ route('login') }}" class="bento-card-link">Buka Lembar Disposisi →</a>
            </div>

            <!-- Bento 3: Surat Tugas (SPT) -->
            <div class="bento-card-modern">
                <div>
                    <div class="bento-icon-box icon-amber">
                        <i class="bi bi-briefcase-fill"></i>
                    </div>
                    <h3>Surat Perintah Tugas (SPT)</h3>
                    <p>
                        Penomoran terpusat kode <code>800.1.11.1</code> dengan dukungan multi-pegawai langsung dari master 44 aparatur BKPSDM Luwu Timur.
                    </p>
                </div>
                <a href="{{ route('login') }}" class="bento-card-link">Buka Registrasi SPT →</a>
            </div>

            <!-- Bento 4: Agenda Masuk -->
            <div class="bento-card-modern">
                <div>
                    <div class="bento-icon-box icon-purple">
                        <i class="bi bi-inbox-fill"></i>
                    </div>
                    <h3>Buku Agenda Masuk</h3>
                    <p>
                        Registrasi cepat surat dinas masuk dengan nomor agenda unik <code>SM-2026-XXX</code> dan integrasi pelacakan status tindak lanjut.
                    </p>
                </div>
                <a href="{{ route('login') }}" class="bento-card-link">Buka Agenda Masuk →</a>
            </div>

            <!-- Bento 5: Ekspor & Laporan -->
            <div class="bento-card-modern">
                <div>
                    <div class="bento-icon-box" style="background: #fef2f2; color: #dc2626;">
                        <i class="bi bi-file-earmark-excel-fill"></i>
                    </div>
                    <h3>Rekapitulasi & Ekspor CSV</h3>
                    <p>
                        Filter buku register berdasarkan rentang tanggal dan unduh berkas spreadsheet CSV / Excel sekali klik untuk pelaporan audit kearsipan.
                    </p>
                </div>
                <a href="{{ route('login') }}" class="bento-card-link">Unduh Rekapitulasi →</a>
            </div>
        </div>
    </section>

    <!-- 5. SECTION: INTERACTIVE LIVE KLASIFIKASI EXPLORER -->
    <section class="klasifikasi-explorer" id="kamus">
        <div class="explorer-card">
            <div class="explorer-header">
                <div>
                    <span class="pill-tag" style="margin-bottom: 8px;">Kamus Digital Kearsipan</span>
                    <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--brand-dark);">
                        Eksplorasi 2.961 Kode Klasifikasi Arsip
                    </h2>
                    <p style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">
                        Berdasarkan Lampiran Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023.
                    </p>
                </div>

                <div class="search-pill-input">
                    <i class="bi bi-search"></i>
                    <input type="text" id="liveSearchInput" placeholder="Ketik kata kunci (contoh: mutasi, cuti, pensiun, 800)..." oninput="cariKode(this.value)">
                </div>
            </div>

            <!-- Category Chips -->
            <div class="chips-category-bar">
                <button type="button" class="category-chip-btn active" onclick="filterKategori('')">Semua Kategori</button>
                <button type="button" class="category-chip-btn" onclick="filterKategori('800')">800 - Kepegawaian</button>
                <button type="button" class="category-chip-btn" onclick="filterKategori('000')">000 - Umum</button>
                <button type="button" class="category-chip-btn" onclick="filterKategori('100')">100 - Pemerintahan</button>
                <button type="button" class="category-chip-btn" onclick="filterKategori('900')">900 - Keuangan</button>
            </div>

            <div class="results-table-preview">
                <table class="explorer-table">
                    <thead>
                        <tr>
                            <th style="width: 160px;">Kode Perbup</th>
                            <th>Uraian / Nama Naskah Dinas</th>
                            <th style="width: 140px;">Kategori</th>
                            <th style="width: 90px; text-align: center;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="explorerTableBody">
                        <tr>
                            <td><strong style="color: #2563eb;">800.1.3.3</strong></td>
                            <td>Pengadaan Pegawai ASN / CPNS / PPPK</td>
                            <td><span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">800</span></td>
                            <td style="text-align: center;">
                                <button type="button" class="btn-copy-widget" onclick="pilihKodeTester('800.1.3.3')">Gunakan</button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong style="color: #2563eb;">800.1.11.1</strong></td>
                            <td>Surat Perintah Tugas / Perjalanan Dinas Aparatur</td>
                            <td><span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">800</span></td>
                            <td style="text-align: center;">
                                <button type="button" class="btn-copy-widget" onclick="pilihKodeTester('800.1.11.1')">Gunakan</button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong style="color: #2563eb;">800.1.6.2</strong></td>
                            <td>Kenaikan Pangkat Aparatur Sipil Negara</td>
                            <td><span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">800</span></td>
                            <td style="text-align: center;">
                                <button type="button" class="btn-copy-widget" onclick="pilihKodeTester('800.1.6.2')">Gunakan</button>
                            </td>
                        </tr>
                        <tr>
                            <td><strong style="color: #2563eb;">000.1.2</strong></td>
                            <td>Urusan Surat Menyurat dan Ketatausahaan Umum</td>
                            <td><span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">000</span></td>
                            <td style="text-align: center;">
                                <button type="button" class="btn-copy-widget" onclick="pilihKodeTester('000.1.2')">Gunakan</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <!-- 6. SECTION: LEADERSHIP GOVERNANCE (PARHA ARIEF, S.AP) -->
    <section class="leadership-section" id="pimpinan">
        <div class="leadership-card">
            <div>
                <p class="quote-lead">
                    "Penerapan tertib administrasi persuratan dan penomoran digital terpusat merupakan komitmen BKPSDM Kabupaten Luwu Timur dalam mewujudkan birokrasi aparatur yang berkeadaban, transparan, dan bebas dari duplikasi administrasi sesuai Peraturan Bupati Nomor 69 Tahun 2023."
                </p>

                <div class="leader-profile-row">
                    <div class="leader-initials-badge">PA</div>
                    <div>
                        <div class="leader-name">PARHA ARIEF, S.AP</div>
                        <div class="leader-role">Pembina (IV/a) • Kepala BKPSDM Kabupaten Luwu Timur</div>
                    </div>
                </div>
            </div>

            <!-- Audit Compliance Card -->
            <div class="audit-compliance-card">
                <div class="audit-card-title">Standar Kepatuhan Sistem:</div>
                <div class="audit-item">
                    <i class="bi bi-shield-check"></i>
                    <span>Peraturan Bupati Luwu Timur No. 69 Tahun 2023</span>
                </div>
                <div class="audit-item">
                    <i class="bi bi-shield-check"></i>
                    <span>Permendagri No. 83 Tahun 2022 tentang Tata Kearsipan</span>
                </div>
                <div class="audit-item">
                    <i class="bi bi-shield-check"></i>
                    <span>Tervalidasi 22 Skenario Pengujian Black Box Testing</span>
                </div>
                <div class="audit-item">
                    <i class="bi bi-shield-check"></i>
                    <span>Terhubung 4 Bidang Kerja BKPSDM Luwu Timur</span>
                </div>
            </div>
        </div>
    </section>

    <!-- 7. FOOTER -->
    <footer class="modern-footer">
        <div class="footer-inner-grid">
            <div>
                <div class="footer-brand-title">LENTERA BKPSDM KAB. LUWU TIMUR</div>
                <p class="footer-brand-text">
                    Layanan Elektronik Tata Naskah dan Administrasi Persuratan Terpadu berbasis Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023. Dibangun dengan arsitektur modern Model-View-Controller (Laravel 11).
                </p>
                <div style="font-size: 0.8rem; color: #64748b;">
                    <i class="bi bi-geo-alt"></i> Kompleks Perkantoran Pemerintah Daerah Kabupaten Luwu Timur, Puncak Indah Malili, 92981
                </div>
            </div>

            <div>
                <h4 class="footer-col-title">Navigasi Utama</h4>
                <ul class="footer-links-list">
                    <li><a href="#hero">Beranda Portal</a></li>
                    <li><a href="#modul">Empat Pilar Layanan</a></li>
                    <li><a href="#kamus">Kamus Kode Perbup</a></li>
                    <li><a href="#pimpinan">Profil Kepemimpinan</a></li>
                </ul>
            </div>

            <div>
                <h4 class="footer-col-title">Akses Pegawai</h4>
                <ul class="footer-links-list">
                    <li><a href="{{ route('login') }}">Masuk Portal LENTERA</a></li>
                    <li><a href="{{ route('login') }}">Buku Agenda Surat Masuk</a></li>
                    <li><a href="{{ route('login') }}">Register Surat Keluar</a></li>
                    <li><a href="{{ route('login') }}">Papan Kendali Disposisi</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom-bar">
            <div>&copy; 2026 Pemerintah Kabupaten Luwu Timur — BKPSDM. Hak Cipta Dilindungi.</div>
            <div>Implementasi Skripsi Mahasiswa Universitas Mega Buana Palopo (Yusri Mahendra - IK2311011)</div>
        </div>
    </footer>

    <!-- Interactive Script -->
    <script>
        const nextUrutNumber = {{ $keluarSeq['next_number'] }};
        const romawiBulan = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        const currentMonthRomawi = romawiBulan[new Date().getMonth()];
        const currentYear = new Date().getFullYear();

        function updateLiveSimulator() {
            const kodeInput = document.getElementById('demoKodeInput').value.trim() || '800';
            const formatted = `${kodeInput}/${nextUrutNumber}/BKPSDM/${currentMonthRomawi}/${currentYear}`;
            document.getElementById('previewSuratKeluar').innerText = formatted;
        }

        function pilihKodeTester(kode) {
            document.getElementById('demoKodeInput').value = kode;
            updateLiveSimulator();
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        }

        function copySimulatedNumber() {
            const num = document.getElementById('previewSuratKeluar').innerText;
            navigator.clipboard.writeText(num).then(() => {
                alert(`Nomor surat berhasil disalin ke clipboard:\n${num}`);
            }).catch(() => {
                prompt("Salin nomor surat berikut:", num);
            });
        }

        let debounceCari;
        function cariKode(keyword) {
            clearTimeout(debounceCari);
            const q = keyword.trim();
            if (q.length < 2) return;

            debounceCari = setTimeout(() => {
                fetch(`/api/klasifikasi/search?q=${encodeURIComponent(q)}`)
                    .then(r => r.json())
                    .then(items => {
                        const tbody = document.getElementById('explorerTableBody');
                        if (!items || items.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 24px; color: #94a3b8;">Tidak ada kode klasifikasi yang cocok dengan kata kunci.</td></tr>';
                            return;
                        }

                        let html = '';
                        items.slice(0, 8).forEach(it => {
                            html += `
                                <tr>
                                    <td><strong style="color: #2563eb;">${it.kode}</strong></td>
                                    <td>${it.nama}</td>
                                    <td><span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 600;">${it.kategori || 'Umum'}</span></td>
                                    <td style="text-align: center;">
                                        <button type="button" class="btn-copy-widget" onclick="pilihKodeTester('${it.kode}')">Gunakan</button>
                                    </td>
                                </tr>
                            `;
                        });
                        tbody.innerHTML = html;
                    });
            }, 250);
        }

        function filterKategori(kat) {
            document.querySelectorAll('.category-chip-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');

            if (!kat) {
                document.getElementById('liveSearchInput').value = '';
                cariKode('800');
            } else {
                document.getElementById('liveSearchInput').value = kat;
                cariKode(kat);
            }
        }
    </script>
</body>
</html>
