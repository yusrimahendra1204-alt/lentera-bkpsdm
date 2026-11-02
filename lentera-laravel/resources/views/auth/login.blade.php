<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Masuk - LENTERA BKPSDM Luwu Timur</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        body {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f766e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .login-card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 440px;
            padding: 36px 32px;
        }
        .login-header {
            text-align: center;
            margin-bottom: 28px;
        }
        .login-header img {
            height: 48px;
            margin-bottom: 12px;
        }
        .app-title {
            font-size: 1.45rem;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: -0.02em;
        }
        .app-sub {
            font-size: 0.8rem;
            color: #64748b;
            margin-top: 4px;
        }
        .badge-perbup {
            background: #eff6ff;
            color: #2563eb;
            font-size: 0.72rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 9999px;
            display: inline-block;
            margin-top: 10px;
            border: 1px solid #bfdbfe;
        }
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
        .input-group {
            position: relative;
        }
        .input-group i {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
        }
        .form-control {
            width: 100%;
            padding: 10px 12px 10px 38px;
            font-size: 0.875rem;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            outline: none;
            transition: all 0.15s ease;
        }
        .form-control:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .btn-submit {
            width: 100%;
            padding: 11px;
            background: #1e3a8a;
            color: #ffffff;
            font-size: 0.9rem;
            font-weight: 700;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.15s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 22px;
        }
        .btn-submit:hover {
            background: #1e40af;
        }
        .demo-box {
            margin-top: 24px;
            padding: 14px;
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 8px;
            font-size: 0.78rem;
            color: #475569;
        }
        .demo-box strong { color: #1e3a8a; }
        .demo-btn-group {
            display: flex;
            gap: 6px;
            margin-top: 8px;
        }
        .btn-demo {
            padding: 4px 8px;
            font-size: 0.72rem;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            background: #ffffff;
            cursor: pointer;
            font-weight: 600;
            color: #334155;
        }
        .btn-demo:hover {
            background: #eff6ff;
            border-color: #93c5fd;
            color: #1e40af;
        }
        .alert-error {
            background: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 0.8rem;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="login-header">
            <img src="{{ asset('img/logo_bkpsdm.png') }}" alt="Logo BKPSDM" onerror="this.src='{{ asset('img/logo_lutim_juara.png') }}'">
            <h1 class="app-title">LENTERA</h1>
            <p class="app-sub">Layanan Elektronik Tata Naskah & Administrasi</p>
            <span class="badge-perbup"><i class="bi bi-shield-check"></i> BKPSDM KAB. LUWU TIMUR</span>
        </div>

        @if($errors->any())
            <div class="alert-error">
                <i class="bi bi-exclamation-circle-fill"></i> {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('login.post') }}" method="POST">
            @csrf
            <div class="form-group">
                <label class="form-label" for="nip">NIP / Identitas Pengguna</label>
                <div class="input-group">
                    <i class="bi bi-person-badge"></i>
                    <input type="text" id="nip" name="nip" class="form-control" placeholder="Masukkan NIP atau 'admin'" value="{{ old('nip', 'admin') }}" required autofocus>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label" for="password">Kata Sandi</label>
                <div class="input-group">
                    <i class="bi bi-key"></i>
                    <input type="password" id="password" name="password" class="form-control" placeholder="Kata sandi" value="123" required>
                </div>
            </div>

            <button type="submit" class="btn-submit">
                <i class="bi bi-box-arrow-in-right"></i> Masuk ke Sistem
            </button>
        </form>

        <div class="demo-box">
            <div><strong>Akun Cepat untuk Uji Coba:</strong></div>
            <div class="demo-btn-group">
                <button type="button" class="btn-demo" onclick="fillLogin('admin', '123')">
                    <i class="bi bi-shield-lock"></i> Agendaris (Admin)
                </button>
                <button type="button" class="btn-demo" onclick="fillLogin('198401142003122001', '123456')">
                    <i class="bi bi-person-fill"></i> Kepala BKPSDM
                </button>
            </div>
        </div>
    </div>

    <script>
        function fillLogin(nip, pwd) {
            document.getElementById('nip').value = nip;
            document.getElementById('password').value = pwd;
        }
    </script>
</body>
</html>
