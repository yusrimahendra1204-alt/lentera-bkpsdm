<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Lembar Disposisi - {{ $disposisi->suratMasuk->no_agenda ?? 'BKPSDM' }}</title>
    <style>
        @page { size: A4 portrait; margin: 15mm 20mm 15mm 20mm; }
        * { box-sizing: border-box; font-family: 'Arial', sans-serif; }
        body { font-size: 11pt; color: #000; background: #fff; line-height: 1.3; }
        .kop-box { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
        .kop-box h3 { margin: 0; font-size: 13pt; font-weight: bold; }
        .kop-box h2 { margin: 2px 0; font-size: 14pt; font-weight: bold; }
        .kop-box p { margin: 0; font-size: 9pt; }
        .title-disposisi { text-align: center; font-size: 14pt; font-weight: bold; text-decoration: underline; margin: 14px 0 10px; }
        table.border-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        table.border-table td, table.border-table th { border: 1px solid #000; padding: 6px 8px; font-size: 10.5pt; vertical-align: top; }
        .check-box-item { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; font-size: 10.5pt; }
        .square { width: 14px; height: 14px; border: 1.5px solid #000; display: inline-flex; align-items: center; justify-content: center; font-size: 10pt; font-weight: bold; }
        .ttd-container { float: right; width: 270px; margin-top: 20px; text-align: left; }
        .clear { clear: both; }
        .no-print { margin-bottom: 15px; text-align: center; }
        @media print { .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="no-print">
        <button onclick="window.print()" style="padding: 8px 18px; font-weight: bold; background: #1e3a8a; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
            🖨️ Cetak Lembar Disposisi (A4)
        </button>
    </div>

    <!-- KOP DISPOSISI RESMI -->
    <div class="kop-box">
        <h3>PEMERINTAH KABUPATEN LUWU TIMUR</h3>
        <h2>BADAN KEPEGAWAIAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA</h2>
        <p>Jalan Soekarno Hatta - Puncak Indah Malili, Kode Pos 92981, Sulawesi Selatan</p>
    </div>

    <div class="title-disposisi">LEMBAR DISPOSISI</div>

    <table class="border-table">
        <tr>
            <td style="width: 50%;">
                <strong>Surat Dari :</strong><br>
                {{ $disposisi->suratMasuk->instansi_pengirim ?? '-' }}
            </td>
            <td style="width: 50%;">
                <strong>Diterima Tanggal :</strong> {{ $disposisi->suratMasuk && $disposisi->suratMasuk->tgl_diterima ? $disposisi->suratMasuk->tgl_diterima->format('d/m/Y') : '-' }}<br>
                <strong>No. Agenda :</strong> <strong style="font-size: 11pt;">{{ $disposisi->suratMasuk->no_agenda ?? '-' }}</strong>
            </td>
        </tr>
        <tr>
            <td>
                <strong>Tanggal Surat :</strong> {{ $disposisi->suratMasuk && $disposisi->suratMasuk->tgl_surat ? $disposisi->suratMasuk->tgl_surat->format('d/m/Y') : '-' }}<br>
                <strong>No. Surat :</strong> {{ $disposisi->suratMasuk->no_surat_pengirim ?? '-' }}
            </td>
            <td>
                <strong>Sifat :</strong><br>
                <div style="display: flex; gap: 15px; margin-top: 4px;">
                    <span class="check-box-item"><span class="square">{{ $disposisi->sifat === 'Biasa' ? '✓' : '' }}</span> Biasa</span>
                    <span class="check-box-item"><span class="square">{{ $disposisi->sifat === 'Segera' ? '✓' : '' }}</span> Segera</span>
                    <span class="check-box-item"><span class="square">{{ $disposisi->sifat === 'Sangat Segera' ? '✓' : '' }}</span> Sangat Segera</span>
                </div>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <strong>Hal / Perihal :</strong><br>
                {{ $disposisi->suratMasuk->perihal ?? '-' }}
            </td>
        </tr>
    </table>

    <table class="border-table">
        <tr>
            <!-- 6 TUJUAN RESMI BKPSDM LUWU TIMUR -->
            <td style="width: 50%;">
                <strong style="text-decoration: underline;">Diteruskan kepada saudara :</strong>
                <div style="margin-top: 8px;">
                    @foreach($tujuanResmi as $t)
                        @php
                            $isTarget = str_contains($disposisi->tujuan_nama, $t) || str_contains($t, $disposisi->tujuan_nama);
                        @endphp
                        <div class="check-box-item">
                            <span class="square">{{ $isTarget ? '✓' : '' }}</span>
                            @if($isTarget)
                                <strong>{{ $t }}</strong>
                            @else
                                <span>{{ $t }}</span>
                            @endif
                        </div>
                    @endforeach
                </div>
            </td>

            <!-- PETUNJUK / INSTRUKSI & CATATAN -->
            <td style="width: 50%;">
                <strong style="text-decoration: underline;">Petunjuk / Instruksi :</strong>
                <div style="margin-top: 8px;">
                    @foreach($instruksiResmi as $ins)
                        @php
                            $isSelected = !empty($disposisi->instruksi) && in_array($ins, $disposisi->instruksi);
                        @endphp
                        <div class="check-box-item">
                            <span class="square">{{ $isSelected ? '✓' : '' }}</span>
                            <span>{{ $ins }}</span>
                        </div>
                    @endforeach
                </div>
                <div style="margin-top: 12px; border-top: 1px dashed #666; padding-top: 6px;">
                    <strong>Catatan Kepala Badan:</strong>
                    <div style="font-style: italic; margin-top: 4px; min-height: 40px;">
                        "{{ $disposisi->catatan ?: '-' }}"
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- TANDA TANGAN KEPALA BKPSDM -->
    <div class="ttd-container">
        <div>Malili, {{ $disposisi->created_at ? \App\Services\NomorSuratService::formatIndoDate($disposisi->created_at) : \App\Services\NomorSuratService::formatIndoDate(date('Y-m-d')) }}</div>
        <div style="font-weight: bold; margin-top: 4px;">
            KEPALA BKPSDM KAB. LUWU TIMUR
        </div>
        <div style="height: 60px;"></div>
        <div>
            <strong style="text-decoration: underline;">PARHA ARIEF, S.AP</strong><br>
            <span>Pembina (IV/a)</span><br>
            <span>NIP. 19840114 200312 2 001</span>
        </div>
    </div>
    <div class="clear"></div>
</body>
</html>

