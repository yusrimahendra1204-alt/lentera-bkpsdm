// =====================================================================
// GENERATE KUESIONER UAT DOCX
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

// Helper to create Word table cell
function cell(text, width = '1000', align = 'left', bold = false, italic = false, bg = null, span = 1) {
  let rPr = '<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="22"/><w:szCs w:val="22"/>';
  if (bold) rPr += '<w:b/><w:bCs/>';
  if (italic) rPr += '<w:i/><w:iCs/>';
  rPr += '</w:rPr>';

  let pPr = `<w:pPr><w:jc w:val="${align}"/><w:spacing w:before="60" w:after="60" w:line="240" w:lineRule="auto"/></w:pPr>`;
  
  let tcPr = `<w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>`;
  if (span > 1) tcPr += `<w:gridSpan w:val="${span}"/>`;
  if (bg) tcPr += `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>`;
  tcPr += '<w:tcMar><w:top w:w="80" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar></w:tcPr>';

  return `<w:tc>${tcPr}<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${text}</w:t></w:r></w:p></w:tc>`;
}

// Table questions data
const questions = [
  { cat: 'A. Dimensi Tampilan Antarmuka & Kemudahan Penggunaan (Usability & Learnability)' },
  { num: '1', text: 'Tampilan antarmuka (user interface) sistem informasi persuratan modern, bersih, dan mudah dipahami oleh pegawai.' },
  { num: '2', text: 'Tata letak menu, tombol aksi, dan tabel data tersusun secara ergonomis serta sesuai dengan wewenang hak akses masing-masing pegawai.' },
  { cat: 'B. Dimensi Kesesuaian Fungsionalitas & Alur Kerja (Functional Suitability)' },
  { num: '3', text: 'Fitur pencatatan cepat surat masuk mempermudah agendaris dalam meregistrasi surat dinas tanpa membebani staf dengan pemindaian berkas fisik tebal.' },
  { num: '4', text: 'Mesin rekomendasi pintar (smart auto-suggest) sangat cepat dan akurat dalam merekomendasikan kode klasifikasi arsip daerah sesuai Perbup Luwu Timur No. 69/2023.' },
  { num: '5', text: 'Fitur Buku Kendali Disposisi Digital efektif membantu merekam dan memantau riwayat instruksi tulisan tangan serta paraf pimpinan secara transparan dan real-time.' },
  { num: '6', text: 'Fitur kartu kendali penyandingan nomor (pairing) surat keluar balasan dengan nomor surat masuk pengirim menjamin keteraturan riwayat arsip dinas.' },
  { num: '7', text: 'Sistem penomoran resmi Surat Perintah Tugas (SPT) terpusat (kode 800.1.11.1) efektif mencegah terjadinya penomoran ganda atau nomor loncat antar-bidang.' },
  { num: '8', text: 'Tombol "Salin No" (clipboard) pada modul agenda SPT sangat praktis untuk menempelkan nomor resmi langsung ke dokumen fisik Word penugasan bidang.' },
  { cat: 'C. Dimensi Efisiensi Waktu & Kelayakan Penerapan (Efficiency & General Acceptance)' },
  { num: '9', text: 'Penerapan sistem persuratan web ini mampu mempercepat alur penomoran dan meningkatkan tertib administrasi persuratan pada BKPSDM Kabupaten Luwu Timur.' },
  { num: '10', text: 'Secara keseluruhan, Sistem Informasi Persuratan Berbasis Web ini Sangat Layak diterapkan dalam operasional kedinasan sehari-hari di BKPSDM Kabupaten Luwu Timur.' }
];

let tableRowsXml = `
<w:tr>
  ${cell('No', '500', 'center', true, false, 'F1F5F9')}
  ${cell('Pernyataan Kuesioner Evaluasi Sistem Persuratan BKPSDM', '5500', 'center', true, false, 'F1F5F9')}
  ${cell('STS (1)', '700', 'center', true, false, 'F1F5F9')}
  ${cell('TS (2)', '700', 'center', true, false, 'F1F5F9')}
  ${cell('KS (3)', '700', 'center', true, false, 'F1F5F9')}
  ${cell('S (4)', '700', 'center', true, false, 'F1F5F9')}
  ${cell('SS (5)', '700', 'center', true, false, 'F1F5F9')}
</w:tr>
`;

questions.forEach(q => {
  if (q.cat) {
    tableRowsXml += `
    <w:tr>
      ${cell(q.cat, '9500', 'left', true, true, 'E2E8F0', 7)}
    </w:tr>
    `;
  } else {
    tableRowsXml += `
    <w:tr>
      ${cell(q.num, '500', 'center')}
      ${cell(q.text, '5500', 'left')}
      ${cell('', '700', 'center')}
      ${cell('', '700', 'center')}
      ${cell('', '700', 'center')}
      ${cell('', '700', 'center')}
      ${cell('', '700', 'center')}
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
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>FAKULTAS ILMU KOMPUTER</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr><w:t>UNIVERSITAS MEGA BUANA PALOPO</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:before="0" w:after="160" w:line="240" w:lineRule="auto"/>
      <w:pBdr><w:bottom w:val="double" w:sz="18" w:space="4" w:color="000000"/></w:pBdr>
    </w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="4B5563"/></w:rPr><w:t>Jl. Veteran No. 25, Tompotikka, Kec. Wara, Kota Palopo, Sulawesi Selatan 91921 | Website: umbpalopo.ac.id</w:t></w:r>
  </w:p>

  <!-- JUDUL DOKUMEN -->
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="120" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:u w:val="single"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr><w:t>KUESIONER PENGUJIAN PENERIMAAN PENGGUNA (UAT)</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="200" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="22"/><w:szCs w:val="22"/><w:color w:val="1E3A8A"/></w:rPr><w:t>SISTEM INFORMASI PERSURATAN BERBASIS WEB PADA BKPSDM KAB. LUWU TIMUR</w:t></w:r>
  </w:p>

  <!-- PENGANTAR -->
  <w:p>
    <w:pPr><w:jc w:val="both"/><w:spacing w:before="60" w:after="80" w:line="280" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t xml:space="preserve">Yth. Bapak/Ibu Pegawai BKPSDM Kabupaten Luwu Timur. Dalam rangka penyusunan Skripsi pada Program Studi Sarjana Informatika Fakultas Ilmu Komputer Universitas Mega Buana Palopo oleh mahasiswa: </w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t>Yusri Mahendra (NIM: IK2311011)</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t xml:space="preserve"> (Pembimbing: Ir. JUSTAM, S.Kom., M.Kom. dan NUR JAMILA, S.Kom., M.Kom.), bersama ini kami memohon kesediaan Bapak/Ibu untuk memberikan evaluasi objektif terhadap Sistem Informasi Persuratan Berbasis Web yang telah dikembangkan di kantor BKPSDM Luwu Timur. Masukan Bapak/Ibu digunakan demi kesempurnaan sistem dan laporan skripsi. Terima kasih.</w:t></w:r>
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
      ${cell('Jabatan / Peran', '2600', 'left', true)}
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
    <w:pPr><w:jc w:val="both"/><w:spacing w:before="120" w:after="80" w:line="240" w:lineRule="auto"/></w:pPr>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:bCs/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t>Petunjuk Pengisian:</w:t></w:r>
    <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr><w:t xml:space="preserve"> Berikan tanda centang (✓) pada kolom pilihan jawaban yang paling sesuai: STS (1) = Sangat Tidak Setuju; TS (2) = Tidak Setuju; KS (3) = Kurang Setuju; S (4) = Setuju; SS (5) = Sangat Setuju.</w:t></w:r>
  </w:p>

  <!-- TABEL PERNYATAAN UAT -->
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
    ${tableRowsXml}
  </w:tbl>

  <!-- KRITIK & SARAN -->
  <w:p>
    <w:pPr><w:spacing w:before="140" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>
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
        <w:p><w:pPr><w:spacing w:before="360" w:after="360"/></w:pPr><w:r><w:t></w:t></w:r></w:p>
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
      ${cell('Malili, .................................................... 2026\nResponden Penguji Sistem,\n\n\n\n\n(............................................................)\nNIP. .....................................................', '4500', 'center')}
    </w:tr>
  </w:tbl>

  <w:sectPr>
    <w:pgSz w:w="11906" w:h="16838"/>
    <w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/>
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
