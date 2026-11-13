// =====================================================================
// GENERATE KUESIONER UAT DOCX (RAPI & STANDAR AKADEMIK A4)
// Peneliti: Yusri Mahendra (NIM: IK2311011) - Universitas Mega Buana Palopo
// =====================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceDir = path.join(__dirname, '..');
const tempDir = path.join(workspaceDir, 'temp_kuesioner_docx');
const baseDocx = path.join(workspaceDir, 'PROPOSAL YUSRI MAHENDRA (4).docx');
const outDocx = path.join(workspaceDir, 'KUESIONER_UAT_PERSURATAN_BKPSDM.docx');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

console.log('[+] Mengekstrak template docx...');
const extractPs = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory("${baseDocx.replace(/\\/g, '\\\\')}", "${tempDir.replace(/\\/g, '\\\\')}")
`;
fs.writeFileSync(path.join(__dirname, 'extract_kuesioner.ps1'), extractPs, 'utf8');
execSync(`powershell -ExecutionPolicy Bypass -File "${path.join(__dirname, 'extract_kuesioner.ps1')}"`);

console.log('[+] Membangun dokumen WordprocessingML untuk Kuesioner UAT...');

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Single paragraph cell
function cell(text, width = '1000', align = 'left', bold = false, italic = false, bg = null, span = 1, fontSize = '20') {
  let rPr = `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/>`;
  if (bold) rPr += '<w:b/><w:bCs/>';
  if (italic) rPr += '<w:i/><w:iCs/>';
  rPr += '</w:rPr>';

  let pPr = `<w:pPr><w:jc w:val="${align}"/><w:spacing w:before="40" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>`;
  
  let tcPr = `<w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>`;
  if (span > 1) tcPr += `<w:gridSpan w:val="${span}"/>`;
  if (bg) tcPr += `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>`;
  tcPr += '<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar></w:tcPr>';

  return `<w:tc>${tcPr}<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p></w:tc>`;
}

// Multi-paragraph cell for lines
function multiParagraphCell(paragraphs, width = '1000', align = 'left', bold = false, italic = false, bg = null, span = 1, fontSize = '20') {
  let tcPr = `<w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>`;
  if (span > 1) tcPr += `<w:gridSpan w:val="${span}"/>`;
  if (bg) tcPr += `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>`;
  tcPr += '<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tcMar></w:tcPr>';

  let pXml = paragraphs.map(pText => {
    let rPr = `<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${fontSize}"/><w:szCs w:val="${fontSize}"/>`;
    if (bold) rPr += '<w:b/><w:bCs/>';
    if (italic) rPr += '<w:i/><w:iCs/>';
    rPr += '</w:rPr>';
    let pPr = `<w:pPr><w:jc w:val="${align}"/><w:spacing w:before="30" w:after="30" w:line="240" w:lineRule="auto"/></w:pPr>`;
    return `<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${escapeXml(pText)}</w:t></w:r></w:p>`;
  }).join('');

  return `<w:tc>${tcPr}${pXml}</w:tc>`;
}

// Table questions data
const questions = [
  { cat: 'A. Dimensi Tampilan Antarmuka & Kemudahan Penggunaan (Usability & Learnability)' },
  { num: '1', text: 'Tampilan antarmuka (user interface) sistem informasi persuratan modern, bersih, dan mudah dipahami oleh pegawai.' },
  { num: '2', text: 'Tata letak menu, tombol aksi, dan tabel data tersusun secara ergonomis serta sesuai dengan wewenang hak akses masing-masing pegawai (Role-Based Access Control).' },
  { cat: 'B. Dimensi Kesesuaian Fungsionalitas & Alur Kerja Kedinasan (Functional Suitability)' },
  { num: '3', text: 'Fitur pencatatan cepat surat masuk mempermudah agendaris dalam meregistrasi surat dinas tanpa membebani staf dengan pemindaian berkas fisik tebal.' },
  { num: '4', text: 'Mesin rekomendasi pintar (smart auto-suggest) sangat cepat dan akurat dalam merekomendasikan kode klasifikasi arsip daerah sesuai Perbup Luwu Timur No. 69/2023.' },
  { num: '5', text: 'Fitur Buku Kendali Disposisi Digital efektif membantu merekam dan memantau riwayat instruksi tulisan tangan serta paraf basah pimpinan secara transparan dan real-time.' },
  { num: '6', text: 'Fitur kartu kendali penyandingan nomor (pairing) surat keluar balasan dengan nomor surat masuk pengirim menjamin keteraturan riwayat arsip dinas.' },
  { num: '7', text: 'Sistem penomoran resmi Surat Perintah Tugas (SPT) terpusat (kode 800.1.11.1) efektif mencegah terjadinya penomoran ganda atau nomor loncat antar-bidang.' },
  { num: '8', text: 'Tombol "Salin No" (clipboard) pada modul agenda SPT sangat praktis untuk menempelkan nomor resmi langsung ke dokumen fisik Word penugasan bidang.' },
  { cat: 'C. Dimensi Efisiensi Waktu & Penerimaan Umum (Efficiency & General Acceptance)' },
  { num: '9', text: 'Penerapan sistem persuratan web ini mampu mempercepat alur penomoran dan meningkatkan tertib administrasi persuratan pada BKPSDM Kabupaten Luwu Timur.' },
  { num: '10', text: 'Secara keseluruhan, Sistem Informasi Persuratan Berbasis Web ini Sangat Layak diterapkan dalam operasional kedinasan sehari-hari di BKPSDM Kabupaten Luwu Timur.' }
];

let tableRowsXml = `
<w:tr>
  ${cell('No', '450', 'center', true, false, 'E2E8F0', 1, '19')}
  ${cell('Pernyataan Kuesioner Evaluasi Sistem Persuratan BKPSDM', '5750', 'center', true, false, 'E2E8F0', 1, '19')}
  ${cell('STS\n(1)', '560', 'center', true, false, 'E2E8F0', 1, '18')}
  ${cell('TS\n(2)', '560', 'center', true, false, 'E2E8F0', 1, '18')}
  ${cell('KS\n(3)', '560', 'center', true, false, 'E2E8F0', 1, '18')}
  ${cell('S\n(4)', '560', 'center', true, false, 'E2E8F0', 1, '18')}
  ${cell('SS\n(5)', '560', 'center', true, false, 'E2E8F0', 1, '18')}
</w:tr>
`;

questions.forEach(q => {
  if (q.cat) {
    tableRowsXml += `
    <w:tr>
      ${cell(q.cat, '9000', 'left', true, true, 'F1F5F9', 7, '19')}
    </w:tr>
    `;
  } else {
    tableRowsXml += `
    <w:tr>
      ${cell(q.num, '450', 'center', false, false, null, 1, '19')}
      ${cell(q.text, '5750', 'left', false, false, null, 1, '19')}
      ${cell('☐', '560', 'center', false, false, null, 1, '20')}
      ${cell('☐', '560', 'center', false, false, null, 1, '20')}
      ${cell('☐', '560', 'center', false, false, null, 1, '20')}
      ${cell('☐', '560', 'center', false, false, null, 1, '20')}
      ${cell('☐', '560', 'center', false, false, null, 1, '20')}
    </w:tr>
    `;
  }
});

const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<w:body>

  <!-- KOP SURAT UNIVERSITAS MEGA BUANA PALOPO -->
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr><w:t>UNIVERSITAS MEGA BUANA PALOPO</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr><w:t>FAKULTAS ILMU KOMPUTER</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t>PROGRAM STUDI SARJANA INFORMATIKA</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="0" w:after="140" w:line="240" w:lineRule="auto"/>
      <w:pBdr><w:bottom w:val="double" w:sz="18" w:space="4" w:color="000000"/></w:pBdr>
    </w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="17"/><w:szCs w:val="17"/><w:color w:val="333333"/></w:rPr><w:t>Jl. Veteran No. 25, Tompotikka, Kec. Wara, Kota Palopo, Sulawesi Selatan 91921 | Website: umbpalopo.ac.id</w:t></w:r>
  </w:p>

  <!-- JUDUL DOKUMEN -->
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="80" w:after="30" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:u w:val="single"/><w:sz w:val="23"/><w:szCs w:val="23"/></w:rPr><w:t>KUESIONER PENGUJIAN PENERIMAAN PENGGUNA (UAT)</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="160" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="21"/><w:szCs w:val="21"/><w:color w:val="111827"/></w:rPr><w:t>SISTEM INFORMASI PERSURATAN BERBASIS WEB PADA BKPSDM KABUPATEN LUWU TIMUR</w:t></w:r>
  </w:p>

  <!-- PENGANTAR (KOTAK RAPI) -->
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9000" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:left w:val="single" w:sz="18" w:space="0" w:color="1E3A8A"/>
        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
      </w:tblBorders>
    </w:tblPr>
    <w:tr>
      ${multiParagraphCell([
        'Yth. Bapak / Ibu Pegawai BKPSDM Kabupaten Luwu Timur',
        'Dalam rangka penyusunan Skripsi pada Program Studi Sarjana Informatika, Fakultas Ilmu Komputer, Universitas Mega Buana Palopo oleh mahasiswa: Yusri Mahendra (NIM: IK2311011) | Pembimbing: 1. Ir. JUSTAM, S.Kom., M.Kom.  2. NUR JAMILA, S.Kom., M.Kom.',
        'Bersama ini kami memohon kesediaan Bapak/Ibu untuk mencoba dan memberikan penilaian secara objektif terhadap Sistem Informasi Persuratan Berbasis Web yang telah dikembangkan di kantor BKPSDM Kabupaten Luwu Timur. Data dan masukan semata-mata digunakan untuk kepentingan ilmiah penyusunan skripsi. Atas bantuan dan kesediaan Bapak/Ibu, diucapkan terima kasih.'
      ], '9000', 'both', false, false, 'F8FAFC', 1, '19')}
    </w:tr>
  </w:tbl>

  <!-- IDENTITAS RESPONDEN -->
  <w:p><w:pPr><w:spacing w:before="100" w:after="40"/></w:pPr></w:p>
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9000" w:type="dxa"/>
      <w:tblBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders>
    </w:tblPr>
    <w:tr>
      ${cell('Nama / Inisial Responden', '2500', 'left', true, false, null, 1, '20')}
      ${cell(':', '180', 'center', false, false, null, 1, '20')}
      ${cell('.............................................................................................................', '6320', 'left', false, false, null, 1, '20')}
    </w:tr>
    <w:tr>
      ${cell('NIP (Opsional)', '2500', 'left', true, false, null, 1, '20')}
      ${cell(':', '180', 'center', false, false, null, 1, '20')}
      ${cell('.............................................................................................................', '6320', 'left', false, false, null, 1, '20')}
    </w:tr>
    <w:tr>
      ${cell('Jabatan Kedinasan', '2500', 'left', true, false, null, 1, '20')}
      ${cell(':', '180', 'center', false, false, null, 1, '20')}
      ${multiParagraphCell([
        '☐ Kepala BKPSDM        ☐ Sekretaris Badan        ☐ Kepala Bidang Teknis',
        '☐ Kepala Subbagian       ☐ Staf Agendaris Umum   ☐ Staf Analis / Pelaksana'
      ], '6320', 'left', false, false, null, 1, '19')}
    </w:tr>
    <w:tr>
      ${cell('Bidang / Unit Kerja', '2500', 'left', true, false, null, 1, '20')}
      ${cell(':', '180', 'center', false, false, null, 1, '20')}
      ${cell('.............................................................................................................', '6320', 'left', false, false, null, 1, '20')}
    </w:tr>
    <w:tr>
      ${cell('Hari, Tanggal Pengujian', '2500', 'left', true, false, null, 1, '20')}
      ${cell(':', '180', 'center', false, false, null, 1, '20')}
      ${cell('................................................................................................... 2026', '6320', 'left', false, false, null, 1, '20')}
    </w:tr>
  </w:tbl>

  <!-- PETUNJUK PENGISIAN -->
  <w:p><w:pPr><w:spacing w:before="80" w:after="40"/></w:pPr></w:p>
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9000" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:left w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
      </w:tblBorders>
    </w:tblPr>
    <w:tr>
      ${multiParagraphCell([
        'Petunjuk Pengisian:',
        'Berikan tanda centang (✓) pada salah satu kolom pilihan jawaban yang paling sesuai dengan penilaian Bapak/Ibu: STS = Sangat Tidak Setuju (1) | TS = Tidak Setuju (2) | KS = Kurang Setuju (3) | S = Setuju (4) | SS = Sangat Setuju (5)'
      ], '9000', 'left', false, false, 'F1F5F9', 1, '18')}
    </w:tr>
  </w:tbl>

  <!-- TABEL PERNYATAAN UAT -->
  <w:p><w:pPr><w:spacing w:before="80" w:after="30"/></w:pPr></w:p>
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9000" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/>
      </w:tblBorders>
    </w:tblPr>
    ${tableRowsXml}
  </w:tbl>

  <!-- KRITIK & SARAN -->
  <w:p>
    <w:pPr><w:spacing w:before="100" w:after="30" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t>Kritik, Saran, dan Masukan Tambahan untuk Penyempurnaan Sistem:</w:t></w:r>
  </w:p>
  <w:p><w:pPr><w:spacing w:before="20" w:after="20"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="4B5563"/></w:rPr><w:t>....................................................................................................................................................................................................................</w:t></w:r></w:p>
  <w:p><w:pPr><w:spacing w:before="20" w:after="20"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="4B5563"/></w:rPr><w:t>....................................................................................................................................................................................................................</w:t></w:r></w:p>
  <w:p><w:pPr><w:spacing w:before="20" w:after="40"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="4B5563"/></w:rPr><w:t>....................................................................................................................................................................................................................</w:t></w:r></w:p>

  <!-- TANDA TANGAN -->
  <w:p><w:pPr><w:spacing w:before="80" w:after="20"/></w:pPr></w:p>
  <w:tbl>
    <w:tblPr>
      <w:tblW w:w="9000" w:type="dxa"/>
      <w:tblBorders><w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/><w:insideH w:val="none"/><w:insideV w:val="none"/></w:tblBorders>
    </w:tblPr>
    <w:tr>
      ${cell('', '4800', 'left')}
      ${multiParagraphCell([
        'Malili, .................................................... 2026',
        'Responden Penguji Sistem,',
        '',
        '',
        '',
        '( ............................................................ )',
        'NIP. .....................................................'
      ], '4200', 'center', false, false, null, 1, '20')}
    </w:tr>
  </w:tbl>

  <w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/>
  </w:sectPr>

</w:body>
</w:document>`;

fs.writeFileSync(path.join(tempDir, 'word', 'document.xml'), docXml, 'utf8');
console.log('[✓] File document.xml kuesioner berhasil ditulis.');

// Repack to KUESIONER_UAT_PERSURATAN_BKPSDM.docx
const repackPs = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceDir = "${tempDir.replace(/\\/g, '\\\\')}"
$zipPath = "${outDocx.replace(/\\/g, '\\\\')}"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $zipPath)
Write-Host "SUKSES: File kuesioner docx berhasil dibuat di: $zipPath"
`;
fs.writeFileSync(path.join(__dirname, 'repack_kuesioner.ps1'), repackPs, 'utf8');
execSync(`powershell -ExecutionPolicy Bypass -File "${path.join(__dirname, 'repack_kuesioner.ps1')}"`, { stdio: 'inherit' });

// Clean up tempDir
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('[✓] Temp directory dibersihkan.');
console.log('[✓] SELESAI!');
