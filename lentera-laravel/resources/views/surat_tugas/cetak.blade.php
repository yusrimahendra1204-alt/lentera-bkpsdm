<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Perintah Tugas - {{ $suratTugas->no_surat_tugas }}</title>
    <style>
        @page { size: A4 portrait; margin: 20mm 20mm 20mm 25mm; }
        * { box-sizing: border-box; font-family: 'Times New Roman', Times, serif; }
        body { font-size: 12pt; line-height: 1.4; color: #000; background: #fff; }
        .kop-surat { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 16px; position: relative; }
        .kop-surat h3 { margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: bold; }
        .kop-surat h2 { margin: 2px 0; font-size: 15pt; text-transform: uppercase; font-weight: bold; }
        .kop-surat p { margin: 0; font-size: 10pt; font-style: italic; }
        .judul-dokumen { text-align: center; margin: 20px 0 16px; }
        .judul-dokumen h1 { font-size: 14pt; text-decoration: underline; margin: 0; font-weight: bold; letter-spacing: 1px; }
        .judul-dokumen p { margin: 4px 0 0; font-size: 11pt; }
        .content-section { margin-bottom: 12px; }
        .row-item { display: flex; margin-bottom: 6px; }
        .row-item .label { width: 140px; font-weight: bold; }
        .row-item .colon { width: 15px; }
        .row-item .value { flex: 1; }
        table.table-personil { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.table-personil th, table.table-personil td { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; }
        table.table-personil th { background-color: #f2f2f2; text-align: center; }
        .ttd-box { float: right; width: 280px; margin-top: 30px; text-align: left; }
        .clear { clear: both; }
        .no-print { margin-bottom: 20px; padding: 10px; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 6px; text-align: center; }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="no-print">
        <button onclick="window.print()" style="padding: 8px 18px; font-weight: bold; background: #1e3a8a; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
            🖨️ Cetak Surat Tugas (A4)
        </button>
    </div>

    <!-- KOP RESMI BKPSDM LUWU TIMUR -->
    <div class="kop-surat">
        <h3>PEMERINTAH KABUPATEN LUWU TIMUR</h3>
        <h2>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</h2>
        <p>Jalan Soekarno Hatta No. - Puncak Indah Malili, Kode Pos 92981, Sulawesi Selatan</p>
    </div>

    <div class="judul-dokumen">
        <h1>SURAT PERINTAH TUGAS</h1>
        <p>Nomor : {{ $suratTugas->no_surat_tugas }}</p>
    </div>

    <div class="content-section">
        <div class="row-item">
            <div class="label">DASAR</div>
            <div class="colon">:</div>
            <div class="value" style="white-space: pre-line;">{{ $suratTugas->dasar }}</div>
        </div>
    </div>

    <div style="text-align: center; font-weight: bold; margin: 14px 0 10px; letter-spacing: 2px;">
        MEMERINTAHKAN :
    </div>

    <div class="content-section">
        <div class="row-item">
            <div class="label">Kepada</div>
            <div class="colon">:</div>
            <div class="value">
                @if($suratTugas->personil->count() > 0)
                    <table class="table-personil">
                        <thead>
                            <tr>
                                <th style="width: 30px;">No</th>
                                <th>Nama</th>
                                <th>Pangkat / Gol</th>
                                <th>Jabatan</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($suratTugas->personil as $i => $p)
                                <tr>
                                    <td style="text-align: center;">{{ $i + 1 }}</td>
                                    <td>
                                        <strong>{{ $p->nama }}</strong><br>
                                        <small>NIP. {{ $p->nip ?: '-' }}</small>
                                    </td>
                                    <td>{{ $p->pangkat ?: '-' }}</td>
                                    <td>{{ $p->jabatan ?: '-' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <p>(Personil tercantum dalam draf fisik penugasan)</p>
                @endif
            </div>
        </div>

        <div class="row-item" style="margin-top: 14px;">
            <div class="label">Untuk</div>
            <div class="colon">:</div>
            <div class="value">
                <ol style="margin-left: 20px; padding-left: 0;">
                    <li>{{ $suratTugas->maksud_tugas }} di <strong>{{ $suratTugas->tempat_tujuan }}</strong>.</li>
                    <li>Waktu pelaksanaan tugas selama <strong>{{ $suratTugas->lama_hari }} hari</strong>, terhitung tanggal 
                        {{ $suratTugas->tgl_berangkat ? \App\Services\NomorSuratService::formatIndoDate($suratTugas->tgl_berangkat) : '-' }} s.d. 
                        {{ $suratTugas->tgl_kembali ? \App\Services\NomorSuratService::formatIndoDate($suratTugas->tgl_kembali) : '-' }}.</li>
                    <li>Melaporkan hasil pelaksanaan tugas kepada Pejabat yang menugaskan.</li>
                </ol>
            </div>
        </div>

        <div class="row-item">
            <div class="label">Pembebanan</div>
            <div class="colon">:</div>
            <div class="value">{{ $suratTugas->pembebanan_anggaran }}</div>
        </div>
    </div>

    <!-- Tanda Tangan PARHA ARIEF, S.AP -->
    <div class="ttd-box">
        <div>Dikeluarkan di : Malili</div>
        <div>Pada tanggal : {{ $suratTugas->tgl_berangkat ? \App\Services\NomorSuratService::formatIndoDate($suratTugas->tgl_berangkat) : \App\Services\NomorSuratService::formatIndoDate(date('Y-m-d')) }}</div>
        <div style="margin-top: 6px; font-weight: bold;">
            {{ strtoupper($suratTugas->jabatan_penandatangan) }}
        </div>
        <div style="height: 65px;"></div>
        <div>
            <strong style="text-decoration: underline;">{{ $suratTugas->pejabat_penandatangan }}</strong><br>
            <span>Pembina (IV/a)</span><br>
            <span>NIP. 19840114 200312 2 001</span>
        </div>
    </div>
    <div class="clear"></div>
</body>
</html>

