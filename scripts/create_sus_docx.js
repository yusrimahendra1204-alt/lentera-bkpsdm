// =====================================================================
// GENERATE KUESIONER SUS (SYSTEM USABILITY SCALE) SESUAI ACUAN SKRIPSI TAUFIQ
// Peneliti: Yusri Mahendra (NIM: IK2311011) - Universitas Mega Buana Palopo
// =====================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceDir = path.join(__dirname, '..');
const outHtmlPath = path.join(workspaceDir, 'KUESIONER_SUS_PERSURATAN_BKPSDM_SIAP_PRINT.html');
const outDocxPath = path.join(workspaceDir, 'KUESIONER_SUS_PERSURATAN_BKPSDM.docx');
const baseDocx = path.join(workspaceDir, 'PROPOSAL YUSRI MAHENDRA (4).docx');
const tempDir = path.join(workspaceDir, 'temp_sus_docx');

// 1. BUAT FILE HTML SIAP PRINT (A4 PORTRAIT)
const susHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Kuesioner SUS - Sistem Informasi Persuratan BKPSDM Luwu Timur</title>
<style>
  @page {
    size: A4 portrait;
    margin: 3.0cm 2.5cm 2.5cm 3.5cm; /* Format FIKOM UMB Palopo 2023 */
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11.5pt;
    line-height: 1.35;
    color: #111827;
    background: #ffffff;
    max-width: 21cm;
    margin: 0 auto;
    padding: 1.5cm;
  }
  .kop-surat {
    text-align: center;
    border-bottom: 3px double #000000;
    padding-bottom: 8pt;
    margin-bottom: 12pt;
  }
  .kop-surat h3 {
    margin: 0;
    font-size: 12pt;
    font-weight: normal;
    text-transform: uppercase;
  }
  .kop-surat h2 {
    margin: 2pt 0;
    font-size: 14pt;
    font-weight: bold;
    text-transform: uppercase;
  }
  .kop-surat p {
    margin: 0;
    font-size: 9.5pt;
    font-style: italic;
    color: #374151;
  }
  .doc-title {
    text-align: center;
    margin-bottom: 12pt;
  }
  .doc-title h4 {
    margin: 0;
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: underline;
  }
  .doc-title p {
    margin: 3pt 0 0;
    font-size: 10.5pt;
    font-weight: bold;
    color: #1e3a8a;
  }
  .info-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #1e3a8a;
    padding: 8pt 10pt;
    font-size: 10pt;
    margin-bottom: 10pt;
    text-align: justify;
  }
  .identity-table {
    width: 100%;
    margin-bottom: 10pt;
    font-size: 10.5pt;
  }
  .identity-table td {
    padding: 2pt 4pt;
    vertical-align: top;
  }
  .guide-box {
    background: #f1f5f9;
    padding: 6pt 10pt;
    font-size: 10pt;
    border-radius: 4px;
    margin-bottom: 10pt;
    border: 1px solid #cbd5e1;
  }
  table.sus-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12pt;
    font-size: 10pt;
  }
  table.sus-table th, table.sus-table td {
    border: 1px solid #000000;
    padding: 5.5pt 4pt;
    vertical-align: middle;
  }
  table.sus-table th {
    background: #f1f5f9;
    font-weight: bold;
    text-align: center;
  }
  table.sus-table td.center {
    text-align: center;
  }
  .feedback-box {
    margin-bottom: 12pt;
  }
  .feedback-box p {
    margin: 0 0 3pt;
    font-weight: bold;
    font-size: 10pt;
  }
  .feedback-lines {
    border: 1px solid #94a3b8;
    height: 45pt;
    background: #fafafa;
    border-radius: 4px;
  }
  .signature-table {
    width: 100%;
    font-size: 10.5pt;
    margin-top: 10pt;
  }
  .signature-table td {
    vertical-align: top;
  }
  @media print {
    body { padding: 0; }
    .no-print { display: none; }
  }
</style>
</head>
<body>

<div class="no-print" style="margin-bottom: 15px; background: #e0f2fe; border: 1px solid #0284c7; padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
  <span style="font-size: 11pt; color: #0369a1; font-weight: bold;">
    📄 Kuesioner System Usability Scale (SUS) Standar UMB Palopo (Acuan Skripsi Taufiq)
  </span>
  <button onclick="window.print()" style="background: #0284c7; color: #ffffff; border: none; padding: 6pt 12pt; border-radius: 4px; font-weight: bold; cursor: pointer;">
    🖨️ Cetak Kuesioner (Print)
  </button>
</div>

<!-- KOP RESMI UNIVERSITAS MEGA BUANA PALOPO -->
<div class="kop-surat">
  <h3>FAKULTAS ILMU KOMPUTER</h3>
  <h2>UNIVERSITAS MEGA BUANA PALOPO</h2>
  <p>Jl. Veteran No. 25, Tompotikka, Kec. Wara, Kota Palopo, Sulawesi Selatan 91921 | Website: umbpalopo.ac.id</p>
</div>

<!-- JUDUL FORMULIR -->
<div class="doc-title">
  <h4>KUESIONER PENGUJIAN USABILITY (SYSTEM USABILITY SCALE / SUS)</h4>
  <p>SISTEM INFORMASI PERSURATAN BERBASIS WEB PADA BKPSDM KABUPATEN LUWU TIMUR</p>
</div>

<!-- PENGANTAR -->
<div class="info-box">
  <strong>Yth. Bapak / Ibu Pegawai BKPSDM Kabupaten Luwu Timur</strong><br>
  Dalam rangka penyusunan Skripsi pada Program Studi Sarjana Informatika, Fakultas Ilmu Komputer, Universitas Mega Buana Palopo oleh:<br>
  <strong>Nama :</strong> Yusri Mahendra &nbsp;|&nbsp; <strong>NIM :</strong> IK2311011 &nbsp;|&nbsp; <strong>Pembimbing :</strong> Ir. JUSTAM, S.Kom., M.Kom. &amp; NUR JAMILA, S.Kom., M.Kom.<br>
  Bersama ini kami memohon kesediaan Bapak/Ibu untuk mencoba dan memberikan penilaian objektif mengenai kemudahan dan kenyamanan penggunaan <strong>Sistem Informasi Persuratan Berbasis Web</strong> yang telah diimplementasikan di kantor BKPSDM Kabupaten Luwu Timur menggunakan kuesioner baku <em>System Usability Scale (SUS)</em>. Data ini digunakan untuk kepentingan akademik dan penyempurnaan sistem. Terima kasih.
</div>

<!-- IDENTITAS RESPONDEN -->
<table class="identity-table">
  <tr>
    <td style="width: 170pt;"><strong>Nama / Inisial Responden</strong></td>
    <td style="width: 10pt;">:</td>
    <td>....................................................................................................</td>
  </tr>
  <tr>
    <td><strong>NIP (Opsional)</strong></td>
    <td>:</td>
    <td>....................................................................................................</td>
  </tr>
  <tr>
    <td><strong>Peran / Jabatan Kedinasan</strong></td>
    <td>:</td>
    <td>
      [ &nbsp; ] Kepala Badan / Sekretaris &nbsp;&nbsp;&nbsp; [ &nbsp; ] Kepala Bidang &nbsp;&nbsp;&nbsp; [ &nbsp; ] Kepala Subbagian<br>
      [ &nbsp; ] Staf Agendaris Umum &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] Staf Analis / Pelaksana Bidang
    </td>
  </tr>
  <tr>
    <td><strong>Bidang / Unit Kerja</strong></td>
    <td>:</td>
    <td>....................................................................................................</td>
  </tr>
  <tr>
    <td><strong>Tanggal Pengujian</strong></td>
    <td>:</td>
    <td>............................................................ 2026</td>
  </tr>
</table>

<!-- PETUNJUK -->
<div class="guide-box">
  <strong>Petunjuk Pengisian:</strong><br>
  Berikan tanda centang (✓) pada salah satu kolom pilihan jawaban (Skala Likert 1–5):<br>
  <strong>1</strong> = Sangat Tidak Setuju (STS) &nbsp;|&nbsp; 
  <strong>2</strong> = Tidak Setuju (TS) &nbsp;|&nbsp; 
  <strong>3</strong> = Ragu-Ragu / Netral (N) &nbsp;|&nbsp; 
  <strong>4</strong> = Setuju (S) &nbsp;|&nbsp; 
  <strong>5</strong> = Sangat Setuju (SS)
</div>

<!-- TABEL 10 PERNYATAAN SUS BAKU (BAHASA INDONESIA RESMI) -->
<table class="sus-table">
  <thead>
    <tr>
      <th style="width: 25pt;">No</th>
      <th>Pernyataan Kuesioner System Usability Scale (SUS)</th>
      <th style="width: 38pt;">STS<br>(1)</th>
      <th style="width: 38pt;">TS<br>(2)</th>
      <th style="width: 38pt;">N<br>(3)</th>
      <th style="width: 38pt;">S<br>(4)</th>
      <th style="width: 38pt;">SS<br>(5)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="center">1</td>
      <td>Saya berpikir akan sering menggunakan sistem informasi persuratan ini dalam pekerjaan sehari-hari di kantor.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">2</td>
      <td>Saya merasa sistem informasi persuratan ini terlalu rumit, padahal dapat dibuat lebih sederhana.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">3</td>
      <td>Saya merasa sistem informasi persuratan ini mudah untuk digunakan.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">4</td>
      <td>Saya merasa membutuhkan bantuan dari tenaga teknis komputer untuk dapat mengoperasikan sistem ini.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">5</td>
      <td>Saya merasa fungsi-fungsi dalam sistem ini terintegrasi dengan baik (seperti pencatatan cepat surat masuk, auto-suggest kode Perbup 69/2023, buku kendali disposisi manual, dan penomoran resmi SPT).</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">6</td>
      <td>Saya merasa ada terlalu banyak hal yang tidak konsisten pada sistem ini.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">7</td>
      <td>Saya merasa kebanyakan rekan pegawai kantor akan cepat belajar untuk mengoperasikan sistem persuratan ini.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">8</td>
      <td>Saya merasa sistem informasi persuratan ini sangat janggal atau membingungkan saat digunakan.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">9</td>
      <td>Saya merasa sangat percaya diri saat menggunakan sistem informasi persuratan ini.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
    <tr>
      <td class="center">10</td>
      <td>Saya perlu mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan sistem informasi persuratan ini dengan lancar.</td>
      <td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td><td class="center"></td>
    </tr>
  </tbody>
</table>

<!-- MASUKAN TAMBAHAN -->
<div class="feedback-box">
  <p>Kritik, Saran, dan Masukan Tambahan untuk Penyempurnaan Sistem:</p>
  <div class="feedback-lines"></div>
</div>

<!-- TANDA TANGAN -->
<table class="signature-table">
  <tr>
    <td style="width: 55%;"></td>
    <td style="text-align: center; width: 45%;">
      Malili, .................................................... 2026<br>
      Responden Pegawai Penguji,<br><br><br><br><br>
      (............................................................)<br>
      <span style="font-size: 9.5pt; color: #4b5563;">NIP. .....................................................</span>
    </td>
  </tr>
</table>

</body>
</html>
`;

fs.writeFileSync(outHtmlPath, susHtml, 'utf8');
console.log(`[✓] Berhasil membuat HTML SUS: ${outHtmlPath}`);

// 2. BUAT FILE WORD DOCX DENGAN TEMPLATE
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

console.log('[+] Mengekstrak template Word untuk SUS...');
const extractPs = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory("${baseDocx.replace(/\\/g, '\\\\')}", "${tempDir.replace(/\\/g, '\\\\')}")
`;
fs.writeFileSync(path.join(__dirname, 'extract_sus.ps1'), extractPs, 'utf8');
execSync(`powershell -ExecutionPolicy Bypass -File "${path.join(__dirname, 'extract_sus.ps1')}"`);

function cell(text, width = '1000', align = 'left', bold = false, italic = false, bg = null, span = 1) {
  let rPr = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/><w:szCs w:val="21"/>';
  if (bold) rPr += '<w:b/><w:bCs/>';
  if (italic) rPr += '<w:i/><w:iCs/>';
  rPr += '</w:rPr>';

  let pPr = `<w:pPr><w:jc w:val="${align}"/><w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>`;
  let tcPr = `<w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>`;
  if (span > 1) tcPr += `<w:gridSpan w:val="${span}"/>`;
  if (bg) tcPr += `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>`;
  tcPr += '<w:tcMar><w:top w:w="80" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar></w:tcPr>';

  return `<w:tc>${tcPr}<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${text}</w:t></w:r></w:p></w:tc>`;
}

const susItems = [
  { num: '1', text: 'Saya berpikir akan sering menggunakan sistem informasi persuratan ini dalam pekerjaan sehari-hari di kantor.' },
  { num: '2', text: 'Saya merasa sistem informasi persuratan ini terlalu rumit, padahal dapat dibuat lebih sederhana.' },
  { num: '3', text: 'Saya merasa sistem informasi persuratan ini mudah untuk digunakan.' },
  { num: '4', text: 'Saya merasa membutuhkan bantuan dari tenaga teknis komputer untuk dapat mengoperasikan sistem ini.' },
  { num: '5', text: 'Saya merasa fungsi-fungsi dalam sistem ini terintegrasi dengan baik (seperti pencatatan cepat surat masuk, auto-suggest kode Perbup 69/2023, buku kendali disposisi manual, dan penomoran resmi SPT).' },
  { num: '6', text: 'Saya merasa ada terlalu banyak hal yang tidak konsisten pada sistem ini.' },
  { num: '7', text: 'Saya merasa kebanyakan rekan pegawai kantor akan cepat belajar untuk mengoperasikan sistem persuratan ini.' },
  { num: '8', text: 'Saya merasa sistem informasi persuratan ini sangat janggal atau membingungkan saat digunakan.' },
  { num: '9', text: 'Saya merasa sangat percaya diri saat menggunakan sistem informasi persuratan ini.' },
  { num: '10', text: 'Saya perlu mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan sistem informasi persuratan ini dengan lancar.' }
];

let susTableRows = `
<w:tr>
  ${cell('No', '500', 'center', true, false, 'F1F5F9')}
  ${cell('Pernyataan Kuesioner System Usability Scale (SUS)', '5500', 'center', true, false, 'F1F5F9')}
  ${cell('STS (1)', '700', 'center', true, false, 'F1F5F9')}
  ${cell('TS (2)', '700', 'center', true, false, 'F1F5F9')}
  ${cell('N (3)', '700', 'center', true, false, 'F1F5F9')}
  ${cell('S (4)', '700', 'center', true, false, 'F1F5F9')}
  ${cell('SS (5)', '700', 'center', true, false, 'F1F5F9')}
</w:tr>
`;

susItems.forEach(item => {
  susTableRows += `
  <w:tr>
    ${cell(item.num, '500', 'center')}
    ${cell(item.text, '5500', 'left')}
    ${cell('', '700', 'center')}
    ${cell('', '700', 'center')}
    ${cell('', '700', 'center')}
    ${cell('', '700', 'center')}
    ${cell('', '700', 'center')}
  </w:tr>
  `;
});

const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>

  <!-- KOP SURAT UMB PALOPO -->
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>FAKULTAS ILMU KOMPUTER</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr><w:t>UNIVERSITAS MEGA BUANA PALOPO</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="0" w:after="140" w:line="240" w:lineRule="auto"/>
      <w:pBdr><w:bottom w:val="double" w:sz="18" w:space="4" w:color="000000"/></w:pBdr>
    </w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="4B5563"/></w:rPr><w:t>Jl. Veteran No. 25, Tompotikka, Kec. Wara, Kota Palopo, Sulawesi Selatan 91921 | Website: umbpalopo.ac.id</w:t></w:r>
  </w:p>

  <!-- JUDUL DOKUMEN -->
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="80" w:after="30" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:u w:val="single"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>KUESIONER PENGUJIAN USABILITY (SUS)</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="160" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/><w:color w:val="1E3A8A"/></w:rPr><w:t>SISTEM INFORMASI PERSURATAN BERBASIS WEB PADA BKPSDM KAB. LUWU TIMUR</w:t></w:r>
  </w:p>

  <!-- PENGANTAR -->
  <w:p>
    <w:pPr><w:jc w:val="both"/><w:spacing w:before="40" w:after="60" w:line="260" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t xml:space="preserve">Yth. Bapak/Ibu Pegawai BKPSDM Kabupaten Luwu Timur. Dalam rangka penyusunan Skripsi pada Program Studi Sarjana Informatika Fakultas Ilmu Komputer Universitas Mega Buana Palopo oleh mahasiswa: </w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t>Yusri Mahendra (NIM: IK2311011)</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t xml:space="preserve"> (Pembimbing: Ir. JUSTAM, S.Kom., M.Kom. dan NUR JAMILA, S.Kom., M.Kom.), bersama ini kami memohon kesediaan Bapak/Ibu untuk memberikan evaluasi objektif kemudahan penggunaan Sistem Informasi Persuratan Berbasis Web melalui kuesioner baku System Usability Scale (SUS). Data digunakan untuk kepentingan ilmiah. Terima kasih.</w:t></w:r>
  </w:p>

  <!-- IDENTITAS RESPONDEN -->
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9500" w:type="dxa"/>
      <w:tblBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders>
    </w:tblPr>
    <w:tr>
      ${cell('Nama / Inisial Responden', '2600', 'left', true)}
      ${cell(':', '200', 'center')}
      ${cell('...................................................................................................', '6700', 'left')}
    </w:tr>
    <w:tr>
      ${cell('NIP (Opsional)', '2600', 'left', true)}
      ${cell(':', '200', 'center')}
      ${cell('...................................................................................................', '6700', 'left')}
    </w:tr>
    <w:tr>
      ${cell('Peran / Jabatan', '2600', 'left', true)}
      ${cell(':', '200', 'center')}
      ${cell('[  ] Kepala Badan / Sekretaris    [  ] Kepala Bidang    [  ] Kasubag\n[  ] Staf Agendaris Umum        [  ] Staf Analis / Pelaksana Bidang', '6700', 'left')}
    </w:tr>
    <w:tr>
      ${cell('Bidang / Unit Kerja', '2600', 'left', true)}
      ${cell(':', '200', 'center')}
      ${cell('...................................................................................................', '6700', 'left')}
    </w:tr>
    <w:tr>
      ${cell('Tanggal Pengujian', '2600', 'left', true)}
      ${cell(':', '200', 'center')}
      ${cell('...................................................... 2026', '6700', 'left')}
    </w:tr>
  </w:tbl>

  <!-- PETUNJUK PENGISIAN -->
  <w:p>
    <w:pPr><w:jc w:val="both"/><w:spacing w:before="100" w:after="60" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t>Petunjuk Pengisian:</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t xml:space="preserve"> Berikan tanda centang (✓) pada kolom pilihan jawaban: 1 = Sangat Tidak Setuju (STS); 2 = Tidak Setuju (TS); 3 = Netral (N); 4 = Setuju (S); 5 = Sangat Setuju (SS).</w:t></w:r>
  </w:p>

  <!-- TABEL PERNYATAAN SUS -->
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9500" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>
      </w:tblBorders>
    </w:tblPr>
    ${susTableRows}
  </w:tbl>

  <!-- KRITIK & SARAN -->
  <w:p>
    <w:pPr><w:spacing w:before="100" w:after="30" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t>Kritik, Saran, dan Masukan Perbaikan Sistem:</w:t></w:r>
  </w:p>
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9500" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
        <w:left w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
        <w:right w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/>
      </w:tblBorders>
    </w:tblPr>
    <w:tr>
      <w:tc>
        <w:tcPr><w:tcW w:w="9500" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="FAFAFA"/></w:tcPr>
        <w:p><w:pPr><w:spacing w:before="300" w:after="300"/></w:pPr><w:r><w:t></w:t></w:r></w:p>
      </w:tc>
    </w:tr>
  </w:tbl>

  <!-- TANDA TANGAN -->
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9500" w:type="dxa"/>
      <w:tblBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders>
    </w:tblPr>
    <w:tr>
      ${cell('', '5000', 'left')}
      ${cell('Malili, .................................................... 2026\nResponden Pegawai Penguji,\n\n\n\n\n(............................................................)\nNIP. .....................................................', '4500', 'center')}
    </w:tr>
  </w:tbl>

  <w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <!-- Margin FIKOM UMB Palopo: Atas 3.0cm, Kanan 2.5cm, Bawah 2.5cm, Kiri 3.5cm -->
    <w:pgMar w:top="1701" w:right="1417" w:bottom="1417" w:left="1984" w:header="708" w:footer="708" w:gutter="0"/>
  </w:sectPr>

</w:body>
</w:document>`;

fs.writeFileSync(path.join(tempDir, 'word', 'document.xml'), docXml, 'utf8');
console.log('[✓] File document.xml kuesioner SUS berhasil ditulis.');

// Repack to KUESIONER_SUS_PERSURATAN_BKPSDM.docx
const repackPs = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceDir = "${tempDir.replace(/\\/g, '\\\\')}"
$zipPath = "${outDocxPath.replace(/\\/g, '\\\\')}"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $zipPath)
Write-Host "SUKSES: File kuesioner SUS docx berhasil dibuat di: $zipPath"
`;
fs.writeFileSync(path.join(__dirname, 'repack_sus.ps1'), repackPs, 'utf8');
execSync(`powershell -ExecutionPolicy Bypass -File "${path.join(__dirname, 'repack_sus.ps1')}"`, { stdio: 'inherit' });

// Clean up tempDir
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('[✓] Temp directory dibersihkan.');
console.log('[✓] SELESAI!');
