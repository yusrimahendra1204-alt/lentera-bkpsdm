// =====================================================================
// PATCH PROPOSAL DOCX XML AND REPACK TO NEW DOCX
// Peneliti: Yusri Mahendra (NIM: IK2311011) - Universitas Mega Buana Palopo
// =====================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const xmlPath = path.join(__dirname, '..', 'temp_docx_extract', 'word', 'document.xml');
console.log('[+] Membaca temp_docx_extract/word/document.xml...');
let xml = fs.readFileSync(xmlPath, 'utf8');

console.log('[+] Menerapkan penyesuaian pada naskah proposal...');

// 1. Batasan Masalah: PHP/Laravel -> JavaScript Modern & Perbup 69/2023
const oldTech = 'PHP/Laravel, MySQL, HTML, CSS, dan JavaScript.';
const newTech = 'Full-stack JavaScript Modern (Node.js runtime, HTML, CSS, Vanilla JS) dengan sinkronisasi basis data relasional MySQL, serta berpedoman pada Peraturan Bupati Luwu Timur Nomor 69 Tahun 2023.';
if (xml.includes(oldTech)) {
  xml = xml.replace(oldTech, newTech);
  console.log('[✓] Batasan masalah teknologi diperbarui.');
}

// 2. Kebutuhan Perangkat Lunak: PHP -> Full-stack JavaScript
const oldPhp = '<w:t>PHP</w:t>';
const newJs = '<w:t>Full-Stack JavaScript (Node.js)</w:t>';
// Ganti PHP pada tabel perangkat lunak di Bab III
if (xml.includes(oldPhp)) {
  xml = xml.replace(oldPhp, newJs);
  console.log('[✓] Spesifikasi bahasa pemrograman diperbarui ke JavaScript (Node.js).');
}

// 3. Surat Masuk: Hapus asumsi "beserta lampiran surat"
// Di XML pos 3836395: <w:t>lampiran</w:t>
xml = xml.replace('<w:t>lampiran</w:t>', '<w:t>kode klasifikasi Perbup 69/2023</w:t>');
console.log('[✓] Form surat masuk diselaraskan (tanpa lampiran berkas).');

fs.writeFileSync(xmlPath, xml, 'utf8');
console.log('[✓] File document.xml berhasil disimpan.');

// Repack zip using powershell
const repackPs = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceDir = "${path.join(__dirname, '..', 'temp_docx_extract').replace(/\\/g, '\\\\')}"
$zipPath = "${path.join(__dirname, '..', 'PROPOSAL YUSRI MAHENDRA_REVISI_TERBARU.docx').replace(/\\/g, '\\\\')}"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $zipPath)
Write-Host "[✓] File docx berhasil dikemas ulang ke: $zipPath"
`;

fs.writeFileSync(path.join(__dirname, 'repack.ps1'), repackPs, 'utf8');
try {
  execSync(`powershell -ExecutionPolicy Bypass -File "${path.join(__dirname, 'repack.ps1')}"`, { stdio: 'inherit' });
  console.log('[✓] Selesai! Dokumen revisi terbaru berhasil dibuat.');
} catch (err) {
  console.error('[-] Gagal mengemas zip:', err.message);
}
