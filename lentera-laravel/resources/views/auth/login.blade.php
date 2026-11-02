<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - LENTERA BKPSDM Kabupaten Luwu Timur</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- CSS Proyek Persuratan BKPSDM -->
    <link rel="stylesheet" href="{{ asset('css/variables.css') }}">
    <link rel="stylesheet" href="{{ asset('css/main.css') }}">
    <link rel="stylesheet" href="{{ asset('css/components.css') }}">

    <style>
        /* Memastikan login-wrapper selalu tampil penuh di Blade */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: radial-gradient(circle at 10% 20%, #0f172a 0%, #1e293b 50%, #0c4a6e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-wrapper {
            position: relative;
            width: 100%;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .alert-login-error {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 13px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .alert-login-info {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1e40af;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 13px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Akun cepat simulasi sidang skripsi (dapat ditoggle / disembunyikan) */
        .login-quick-demo {
            margin-top: 22px;
            padding-top: 18px;
            border-top: 1px dashed #cbd5e1;
        }

        .quick-demo-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .quick-demo-title span {
            font-size: 11px;
            font-weight: 800;
            color: #0369a1;
            letter-spacing: 0.5px;
        }

        .quick-accounts-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }

        .btn-quick-acc {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 8px 10px;
            text-align: left;
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            flex-direction: column;
        }

        .btn-quick-acc:hover {
            background: #f0f9ff;
            border-color: #7dd3fc;
            transform: translateY(-1px);
        }

        .btn-quick-acc strong {
            font-size: 12px;
            color: #0f172a;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .btn-quick-acc span {
            font-size: 10.5px;
            color: #64748b;
            margin-top: 2px;
        }
    </style>
</head>
<body>
    <div class="login-wrapper">
        <div class="login-card">
            <div class="login-header">
                <!-- Dual Logo Emblem: Lutim Juara + BKPSDM Resmi (Persis Versi JS) -->
                <div class="login-logo-emblem" style="background: transparent; border: none; box-shadow: none; display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 12px;">
                    <img src="{{ asset('img/logo_lutim_juara.png') }}" alt="Logo Lutim Juara" style="width: 58px; height: 58px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4); border: 2px solid #38bdf8;">
                    <div style="background: #ffffff; padding: 6px 14px; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.1); display: flex; align-items: center; border: 1px solid #e2e8f0;">
                        <img src="{{ asset('img/logo_bkpsdm.png') }}" alt="Logo BKPSDM" style="height: 36px; width: auto; object-fit: contain;">
                    </div>
                </div>
                <h2>LENTERA BKPSDM</h2>
                <h3>LAYANAN ELEKTRONIK TATA NASKAH DAN ADMINISTRASI</h3>
                <p>BKPSDM Kabupaten Luwu Timur • Berbasis Perbup No. 69 Tahun 2023</p>
            </div>

            @if(session('info'))
                <div class="alert-login-info">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>{{ session('info') }}</span>
                </div>
            @endif

            @if(isset($errors) && $errors->any())
                <div class="alert-login-error">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>{{ $errors->first() }}</span>
                </div>
            @endif

            <form id="form-login-auth" action="{{ route('login.post') }}" method="POST">
                @csrf
                <div class="form-group">
                    <label class="form-label">Username atau NIP <span class="required" style="color: #ef4444;">*</span></label>
                    <input type="text" id="login-nip" name="nip" class="form-control" style="font-size:14px; padding:11px 14px;" placeholder="Masukkan Username atau NIP Anda" value="{{ old('nip') }}" required autofocus autocomplete="username">
                </div>

                <div class="form-group">
                    <label class="form-label">Kata Sandi (Password) <span class="required" style="color: #ef4444;">*</span></label>
                    <input type="password" id="login-password" name="password" class="form-control" style="font-size:14px; padding:11px 14px;" placeholder="Masukkan kata sandi" required autocomplete="current-password">
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%; padding:11px; font-size:14.5px; margin-top:6px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                    Masuk ke Portal LENTERA
                </button>

                <div style="margin-top: 18px; text-align: center;">
                    <a href="{{ url('/') }}" style="font-size: 13px; color: #0284c7; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                        ← Kembali ke Beranda Portal (Landing Page)
                    </a>
                </div>
            </form>

            <!-- Akun Cepat Simulasi / Sidang Skripsi (Opsional & Sangat Membantu Ujian) -->
            <div class="login-quick-demo">
                <div class="quick-demo-title">
                    <span>AKUN UJI COBA CEPAT (SIMULASI SKRIPSI):</span>
                </div>
                <div class="quick-accounts-grid">
                    <button type="button" class="btn-quick-acc" onclick="fillLogin('admin', '123')">
                        <strong>YUSRI MAHENDRA</strong>
                        <span>Agendaris (Admin) • 123</span>
                    </button>
                    <button type="button" class="btn-quick-acc" onclick="fillLogin('198401142003122001', '123456')">
                        <strong>PARHA ARIEF, S.AP</strong>
                        <span>Kepala BKPSDM • 123456</span>
                    </button>
                    <button type="button" class="btn-quick-acc" onclick="fillLogin('198007202006041011', '123456')">
                        <strong>M. YUSUF, M.Si</strong>
                        <span>Kepala Bidang • 123456</span>
                    </button>
                    <button type="button" class="btn-quick-acc" onclick="fillLogin('198903252011012004', '123456')">
                        <strong>FITRIANI, S.STP</strong>
                        <span>Staf Pelaksana • 123456</span>
                    </button>
                </div>
            </div>

            <div class="login-footer">
                BKPSDM Kabupaten Luwu Timur • LENTERA (Layanan Elektronik Tata Naskah dan Administrasi)
            </div>
        </div>
    </div>

    <script>
        function fillLogin(nip, pwd) {
            document.getElementById('login-nip').value = nip;
            document.getElementById('login-password').value = pwd;
            document.getElementById('login-nip').focus();
        }
    </script>
</body>
</html>
