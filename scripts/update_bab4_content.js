// =====================================================================
// UPDATE BAB IV SCRIPT (READ FROM EXTERNAL TXT)
// =====================================================================

const fs = require('fs');
const path = require('path');

const targetMdPath = path.join(__dirname, '..', 'DOKUMEN_SKRIPSI_BAB_IV_LENGKAP.md');
const part2Path = path.join(__dirname, 'bab4_part2.txt');

const mdContent = fs.readFileSync(targetMdPath, 'utf8');
const part2Content = fs.readFileSync(part2Path, 'utf8');

const targetHeader = '### 4.2.3 Hasil Pengujian Usability (System Usability Scale / SUS)';
const splitIndex = mdContent.indexOf(targetHeader);

if (splitIndex === -1) {
  console.error('[-] Error: Header 4.2.3 tidak ditemukan di file!');
  process.exit(1);
}

const beforePart = mdContent.substring(0, splitIndex);
const finalContent = beforePart + part2Content;

fs.writeFileSync(targetMdPath, finalContent, 'utf8');
console.log('[✓] Berhasil memperbarui Bab IV Markdown!');
