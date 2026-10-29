// =====================================================================
// EXPORT BAB III PROPOSAL REVISI TO WORD-COMPATIBLE HTML
// Peneliti: Yusri Mahendra (NIM: IK2311011) - Universitas Mega Buana Palopo
// =====================================================================

const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'DOKUMEN_PROPOSAL_BAB_III_REVISI_LENGKAP.md');
const outHtmlPath = path.join(__dirname, '..', 'PROPOSAL_BAB_III_REVISI_SIAP_WORD.html');

console.log('[+] Membaca file Markdown Bab III Proposal...');
const mdContent = fs.readFileSync(mdPath, 'utf8');

let htmlBody = '';
const lines = mdContent.split(/\r?\n/);
let inTable = false;
let tableRows = [];
let inList = false;
let listType = '';

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Skip mermaid code blocks
  if (line.startsWith('```mermaid')) {
    while (i < lines.length && !lines[i].startsWith('```')) {
      i++;
    }
    continue;
  }
  if (line.startsWith('```text')) {
    let codeContent = '';
    i++;
    while (i < lines.length && !lines[i].startsWith('```')) {
      codeContent += lines[i] + '\n';
      i++;
    }
    htmlBody += `<div style="background:#f1f5f9; border:1px solid #cbd5e1; border-left:4px solid #1e3a8a; padding:10px 14px; font-family:'Courier New', monospace; font-size:10.5pt; margin:12px 0; white-space:pre-wrap; line-height:1.4;">${codeContent}</div>\n`;
    continue;
  }
  if (line.startsWith('```')) {
    continue;
  }

  // Handle tables
  if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
    if (!inTable) {
      inTable = true;
      tableRows = [];
    }
    // Check if separator line
    if (line.includes('---')) {
      continue;
    }
    const cells = line.split('|').slice(1, -1).map(c => c.trim());
    tableRows.push(cells);
    continue;
  } else if (inTable) {
    inTable = false;
    if (tableRows.length > 0) {
      htmlBody += '<table class="academic-table">\n';
      const header = tableRows[0];
      htmlBody += '<thead><tr>';
      header.forEach(h => {
        let cleanH = h.replace(/\*\*(.*?)\*\*/g, '$1');
        htmlBody += `<th>${cleanH}</th>`;
      });
      htmlBody += '</tr></thead>\n<tbody>\n';
      for (let r = 1; r < tableRows.length; r++) {
        htmlBody += '<tr>';
        tableRows[r].forEach((c, idx) => {
          let formattedCell = c
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9; padding:1px 4px; border-radius:3px; font-family:Consolas, monospace; font-size:9.5pt;">$1</code>');
          htmlBody += `<td>${formattedCell}</td>`;
        });
        htmlBody += '</tr>\n';
      }
      htmlBody += '</tbody></table>\n';
    }
  }

  // Headings
  if (line.startsWith('# ')) {
    htmlBody += `<h1 class="chapter-title">${line.substring(2).trim()}</h1>\n`;
    continue;
  }
  if (line.startsWith('## ')) {
    htmlBody += `<h2 class="sub-chapter-title">${line.substring(3).trim()}</h2>\n`;
    continue;
  }
  if (line.startsWith('### ')) {
    htmlBody += `<h3 class="section-title">${line.substring(4).trim()}</h3>\n`;
    continue;
  }
  if (line.startsWith('#### ')) {
    htmlBody += `<h4 class="sub-section-title">${line.substring(5).trim()}</h4>\n`;
    continue;
  }

  // Horizontal Rule
  if (line.trim() === '---') {
    htmlBody += '<hr class="section-divider" />\n';
    continue;
  }

  // Lists
  if (line.trim().match(/^(\d+)\.\s+(.*)/)) {
    const match = line.trim().match(/^(\d+)\.\s+(.*)/);
    let itemText = match[2]
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9; padding:1px 4px; border-radius:3px; font-family:Consolas, monospace; font-size:10pt;">$1</code>');
    htmlBody += `<p class="list-item-num"><span class="list-num">${match[1]}.</span> ${itemText}</p>\n`;
    continue;
  }

  if (line.trim().startsWith('- ')) {
    let itemText = line.trim().substring(2)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9; padding:1px 4px; border-radius:3px; font-family:Consolas, monospace; font-size:10pt;">$1</code>');
    htmlBody += `<p class="list-item-bullet"><span class="bullet">•</span> ${itemText}</p>\n`;
    continue;
  }

  // Normal Paragraph
  if (line.trim().length > 0) {
    let pText = line.trim()
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9; padding:1px 4px; border-radius:3px; font-family:Consolas, monospace; font-size:10pt;">$1</code>');
    htmlBody += `<p class="academic-p">${pText}</p>\n`;
  }
}

// Final HTML template
const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>PROPOSAL SKRIPSI BAB III METODOLOGI PENELITIAN - YUSRI MAHENDRA</title>
<style>
  @page {
    size: A4;
    /* Format Resmi Panduan Skripsi FIKOM UMB Palopo 2023 (Halaman 20 Subbab 4.6): */
    /* Tepi Atas: 3.0 cm, Tepi Kiri: 3.5 cm, Tepi Bawah: 2.5 cm, Tepi Kanan: 2.5 cm */
    margin: 3.0cm 2.5cm 2.5cm 3.5cm;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #111827;
    background: #ffffff;
    margin: 0 auto;
    padding: 1.5cm;
    max-width: 21cm;
  }
  .chapter-title {
    font-size: 14pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin-top: 24pt;
    margin-bottom: 12pt;
  }
  .sub-chapter-title {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 18pt;
    margin-bottom: 6pt;
    text-align: left;
  }
  .section-title {
    font-size: 12pt;
    font-weight: bold;
    margin-top: 12pt;
    margin-bottom: 4pt;
  }
  .sub-section-title {
    font-size: 12pt;
    font-weight: bold;
    font-style: italic;
    margin-top: 8pt;
    margin-bottom: 4pt;
  }
  .academic-p {
    text-align: justify;
    text-indent: 1cm;
    margin-top: 0;
    margin-bottom: 6pt;
  }
  .list-item-num, .list-item-bullet {
    text-align: justify;
    margin-left: 1cm;
    margin-top: 0;
    margin-bottom: 4pt;
    padding-left: 0.5cm;
    text-indent: -0.5cm;
  }
  .list-num, .bullet {
    font-weight: bold;
    display: inline-block;
    width: 0.5cm;
  }
  hr.section-divider {
    border: none;
    border-top: 1px solid #94a3b8;
    margin: 18pt 0;
  }
  table.academic-table {
    width: 100%;
    border-collapse: collapse;
    margin: 14pt 0;
    font-size: 10.5pt;
    line-height: 1.35;
  }
  table.academic-table th {
    background: #f1f5f9;
    border-top: 2px solid #0f172a;
    border-bottom: 1.5px solid #0f172a;
    border-left: 1px solid #cbd5e1;
    border-right: 1px solid #cbd5e1;
    padding: 6pt 8pt;
    font-weight: bold;
    text-align: center;
  }
  table.academic-table td {
    border: 1px solid #cbd5e1;
    padding: 5pt 7pt;
    vertical-align: top;
  }
  table.academic-table tr:last-child td {
    border-bottom: 2px solid #0f172a;
  }
</style>
</head>
<body>
${htmlBody}
</body>
</html>`;

fs.writeFileSync(outHtmlPath, fullHtml, 'utf8');
console.log(`[✓] Berhasil mengonversi Bab III Proposal ke: ${outHtmlPath}`);
