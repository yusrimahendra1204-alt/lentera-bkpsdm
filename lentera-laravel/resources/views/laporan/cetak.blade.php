<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Buku Agenda - {{ strtoupper($tipe) }}</title>
    <style>
        @page { size: A4 landscape; margin: 15mm; }
        * { box-sizing: border-box; font-family: 'Arial', sans-serif; }
        body { font-size: 9.5pt; color: #000; background: #fff; }
        .kop { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
        .kop h2 { margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold; }
        .kop h3 { margin: 2px 0; font-size: 11pt; text-transform: uppercase; }
        .kop p { margin: 0; font-size: 8.5pt; }
        .title { text-align: center; font-size: 12pt; font-weight: bold; margin: 12px 0 6px; text-transform: uppercase; }
        .periode { text-align: center; font-size: 9pt; margin-bottom: 14px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 5px 6px; }
        th { background: #f2f2f2; text-align: center; font-weight: bold; font-size: 9pt; }
        .no-print { margin-bottom: 15px; text-align: center; }
        @media print { .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="no-print">
        <button onclick="window.print()" style="padding: 6px 16px; font-weight: bold; background: #1e3a8a; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
            🖨️ Cetak Buku Agenda (Landscape A4)
        </button>
    </div>

    <div class="kop">
        <h2>PEMERINTAH KABUPATEN LUWU TIMUR</h2>
        <h3>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</h3>
        <p>Jalan Soekarno Hatta - Puncak Indah Malili, Kode Pos 92981, Sulawesi Selatan</p>
    </div>

    <div class="title">
        BUKU AGENDA {{ $tipe === 'masuk' ? 'SURAT MASUK' : ($tipe === 'keluar' ? 'SURAT KELUAR' : 'SURAT PERINTAH TUGAS') }}
    </div>
    <div class="periode">
        Periode: {{ date('d/m/Y', strtotime($tglAwal)) }} s.d. {{ date('d/m/Y', strtotime($tglAkhir)) }}
    </div>

    @if($tipe === 'masuk')
        <table>
            <thead>
                <tr>
                    <th style="width: 30px;">No</th>
                    <th style="width: 90px;">No. Agenda</th>
                    <th style="width: 140px;">No. Surat Pengirim</th>
                    <th style="width: 150px;">Instansi Pengirim</th>
                    <th style="width: 70px;">Kode</th>
                    <th>Perihal Surat</th>
                    <th style="width: 75px;">Tgl Surat</th>
                    <th style="width: 75px;">Tgl Terima</th>
                    <th style="width: 60px;">Sifat</th>
                    <th style="width: 90px;">Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $idx => $r)
                    <tr>
                        <td style="text-align: center;">{{ $idx + 1 }}</td>
                        <td>{{ $r->no_agenda }}</td>
                        <td>{{ $r->no_surat_pengirim }}</td>
                        <td>{{ $r->instansi_pengirim }}</td>
                        <td style="text-align: center;">{{ $r->kode_internal }}</td>
                        <td>{{ $r->perihal }}</td>
                        <td style="text-align: center;">{{ $r->tgl_surat ? $r->tgl_surat->format('d/m/Y') : '' }}</td>
                        <td style="text-align: center;">{{ $r->tgl_diterima ? $r->tgl_diterima->format('d/m/Y') : '' }}</td>
                        <td style="text-align: center;">{{ $r->sifat_surat }}</td>
                        <td style="text-align: center;">{{ $r->status_disposisi }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @elseif($tipe === 'keluar')
        <table>
            <thead>
                <tr>
                    <th style="width: 30px;">No</th>
                    <th style="width: 90px;">No. Agenda</th>
                    <th style="width: 170px;">Nomor Resmi Surat Keluar</th>
                    <th style="width: 140px;">Bidang Pembuat</th>
                    <th style="width: 140px;">Tujuan Surat</th>
                    <th>Perihal Surat</th>
                    <th style="width: 75px;">Tgl Surat</th>
                    <th style="width: 60px;">Sifat</th>
                    <th style="width: 120px;">Penandatangan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $idx => $r)
                    <tr>
                        <td style="text-align: center;">{{ $idx + 1 }}</td>
                        <td>{{ $r->no_agenda }}</td>
                        <td><strong>{{ $r->no_surat_keluar }}</strong></td>
                        <td>{{ $r->bidang_pembuat }}</td>
                        <td>{{ $r->tujuan_surat }}</td>
                        <td>{{ $r->perihal }}</td>
                        <td style="text-align: center;">{{ $r->tgl_surat ? $r->tgl_surat->format('d/m/Y') : '' }}</td>
                        <td style="text-align: center;">{{ $r->sifat_surat }}</td>
                        <td>{{ $r->penandatangan }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <table>
            <thead>
                <tr>
                    <th style="width: 30px;">No</th>
                    <th style="width: 170px;">Nomor SPT</th>
                    <th style="width: 140px;">Bidang Pengusul</th>
                    <th>Maksud Tugas Kedinasan</th>
                    <th style="width: 130px;">Tujuan</th>
                    <th style="width: 80px;">Tgl Berangkat</th>
                    <th style="width: 80px;">Tgl Kembali</th>
                    <th style="width: 50px;">Lama</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data as $idx => $r)
                    <tr>
                        <td style="text-align: center;">{{ $idx + 1 }}</td>
                        <td><strong>{{ $r->no_surat_tugas }}</strong></td>
                        <td>{{ $r->bidang_pengusul }}</td>
                        <td>{{ $r->maksud_tugas }}</td>
                        <td>{{ $r->tempat_tujuan }}</td>
                        <td style="text-align: center;">{{ $r->tgl_berangkat ? $r->tgl_berangkat->format('d/m/Y') : '' }}</td>
                        <td style="text-align: center;">{{ $r->tgl_kembali ? $r->tgl_kembali->format('d/m/Y') : '' }}</td>
                        <td style="text-align: center;">{{ $r->lama_hari }} hari</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</body>
</html>
