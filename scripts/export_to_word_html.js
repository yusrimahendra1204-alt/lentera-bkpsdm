// =====================================================================
// EXPORT BAB IV TO WORD-COMPATIBLE HTML WITH BASE64 EMBEDDED IMAGES
// Peneliti: Yusri Mahendra (NIM: IK2311011) - Universitas Mega Buana Palopo
// =====================================================================

const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'DOKUMEN_SKRIPSI_BAB_IV_LENGKAP.md');
const outHtmlPath = path.join(__dirname, '..', 'BAB_IV_SKRIPSI_SIAP_WORD.html');

console.log('[+] Membaca file Markdown Bab IV...');
const mdContent = fs.readFileSync(mdPath, 'utf8');

// Function to convert local image to base64 data URI
function getBase64Image(filePath) {
  try {
    const cleanPath = filePath.trim();
    if (fs.existsSync(cleanPath)) {
      const ext = path.extname(cleanPath).toLowerCase();
      let mimeType = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
      if (ext === '.webp') mimeType = 'image/webp';
      const fileBuf = fs.readFileSync(cleanPath);
      return `data:${mimeType};base64,${fileBuf.toString('base64')}`;
    }
  } catch (err) {
    console.error(`[-] Gagal membaca gambar ${filePath}:`, err.message);
  }
  return filePath;
}

// Simple robust markdown parser to academic HTML
let htmlBody = '';
const lines = mdContent.split(/\r?\n/);
let inTable = false;
let tableRows = [];
let inList = false;
let listType = '';
let imgCounter = 1;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Skip mermaid code blocks
  if (line.startsWith('```mermaid')) {
    while (i < lines.length && !lines[i].startsWith('```')) {
      i++;
    }
    // skip closing ```
    if (i < lines.length && lines[i].startsWith('```')) {
      // do nothing
    }
    continue;
  }
  if (line.startsWith('```')) {
    continue;
  }

  // Handle tables
  if (line.trim().startsWith('|')) {
    if (!inTable) {
      inTable = true;
      tableRows = [];
    }
    // ignore separator line | :--- | :--- |
    if (line.includes('---')) {
      continue;
    }
    tableRows.push(line);
    continue;
  } else if (inTable) {
    // flush table
    inTable = false;
    htmlBody += renderTable(tableRows);
    tableRows = [];
  }

  // Handle lists
  const olMatch = line.match(/^(\d+)\.\s+(.*)/);
  const ulMatch = line.match(/^[-*]\s+(.*)/);

  if (olMatch) {
    if (!inList || listType !== 'ol') {
      if (inList) htmlBody += `</${listType}>\n`;
      inList = true;
      listType = 'ol';
      htmlBody += `<ol style="margin-top: 4px; margin-bottom: 8px; padding-left: 24px;">\n`;
    }
    htmlBody += `  <li style="margin-bottom: 4px; text-align: justify;">${formatInline(olMatch[2])}</li>\n`;
    continue;
  } else if (ulMatch) {
    if (!inList || listType !== 'ul') {
      if (inList) htmlBody += `</${listType}>\n`;
      inList = true;
      listType = 'ul';
      htmlBody += `<ul style="margin-top: 4px; margin-bottom: 8px; padding-left: 24px;">\n`;
    }
    htmlBody += `  <li style="margin-bottom: 4px; text-align: justify;">${formatInline(ulMatch[1])}</li>\n`;
    continue;
  } else if (inList && line.trim() === '') {
    inList = false;
    htmlBody += `</${listType}>\n`;
    continue;
  }

  // Handle Images: ![caption](path)
  const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
  if (imgMatch) {
    const caption = imgMatch[1];
    const rawPath = imgMatch[2];
    const b64 = getBase64Image(rawPath);
    htmlBody += `
      <div style="text-align: center; margin: 18px 0;">
        <img src="${b64}" style="max-width: 95%; height: auto; border: 1px solid #777; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);" alt="${caption}" />
        <p style="font-size: 11pt; font-style: italic; margin-top: 6px; color: #222;"><strong>Gambar 4.${imgCounter++}.</strong> ${caption}</p>
      </div>\n`;
    continue;
  }

  // Handle Headings
  if (line.startsWith('# ')) {
    htmlBody += `<h1 style="text-align: center; font-size: 14pt; font-weight: bold; margin-top: 24px; margin-bottom: 6px; text-transform: uppercase;">${formatInline(line.replace('# ', ''))}</h1>\n`;
    continue;
  }
  if (line.startsWith('## ')) {
    htmlBody += `<h2 style="text-align: center; font-size: 14pt; font-weight: bold; margin-top: 0px; margin-bottom: 24px; text-transform: uppercase;">${formatInline(line.replace('## ', ''))}</h2>\n`;
    continue;
  }
  if (line.startsWith('### ')) {
    htmlBody += `<h3 style="font-size: 12pt; font-weight: bold; margin-top: 18px; margin-bottom: 6px;">${formatInline(line.replace('### ', ''))}</h3>\n`;
    continue;
  }
  if (line.startsWith('#### ')) {
    htmlBody += `<h4 style="font-size: 12pt; font-weight: bold; margin-top: 12px; margin-bottom: 4px;">${formatInline(line.replace('#### ', ''))}</h4>\n`;
    continue;
  }

  // Handle horizontal rules
  if (line.trim() === '---') {
    htmlBody += `<hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />\n`;
    continue;
  }

  // Regular paragraph
  if (line.trim() !== '') {
    htmlBody += `<p style="text-indent: 1.25cm; text-align: justify; margin-top: 0; margin-bottom: 10px; line-height: 1.5;">${formatInline(line)}</p>\n`;
  }
}

// Flush table if open at end
if (inTable && tableRows.length > 0) {
  htmlBody += renderTable(tableRows);
}
if (inList) {
  htmlBody += `</${listType}>\n`;
}

function renderTable(rows) {
  if (rows.length === 0) return '';
  let out = `\n<table style="width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 10.5pt; font-family: 'Times New Roman', serif;">\n`;
  
  rows.forEach((row, idx) => {
    const cells = row.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
    out += '  <tr>\n';
    cells.forEach(cell => {
      if (idx === 0) {
        out += `    <th style="border: 1px solid #333; padding: 6px 8px; background-color: #f0f0f0; text-align: center; font-weight: bold;">${formatInline(cell)}</th>\n`;
      } else {
        const isCentered = cell === 'VALID' || cell === 'INVALID' || /^\d+$/.test(cell);
        const align = isCentered ? 'center' : 'left';
        const boldValid = cell === 'VALID' ? '<strong style="color: #006600;">VALID</strong>' : formatInline(cell);
        out += `    <td style="border: 1px solid #333; padding: 5px 8px; text-align: ${align}; vertical-align: top;">${boldValid}</td>\n`;
      }
    });
    out += '  </tr>\n';
  });

  out += '</table>\n';
  return out;
}

function formatInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background: #f4f4f4; padding: 1px 4px; border: 1px solid #ddd; border-radius: 3px; font-family: Consolas, monospace; font-size: 10pt;">$1</code>');
}

// Complete HTML Template with Academic Thesis Formatting
const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>BAB IV - HASIL DAN PEMBAHASAN - YUSRI MAHENDRA</title>
  <style>
    @page {
      size: A4;
      /* Format Resmi Panduan Skripsi FIKOM UMB Palopo 2023 (Subbab 4.6): Atas 3.0cm, Kanan 2.5cm, Bawah 2.5cm, Kiri 3.5cm */
      margin: 3.0cm 2.5cm 2.5cm 3.5cm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
      max-width: 210mm;
      margin: 0 auto;
      padding: 30px;
    }
    p {
      text-align: justify;
      text-justify: inter-ideograph;
    }
    table {
      page-break-inside: avoid;
    }
    img {
      page-break-inside: avoid;
    }
    @media print {
      body {
        padding: 0;
        margin: 0;
      }
    }
  </style>
</head>
<body>
${htmlBody}
</body>
</html>`;

fs.writeFileSync(outHtmlPath, fullHtml, 'utf8');
console.log(`[✓] Berhasil mengonversi naskah Bab IV ke: ${outHtmlPath}`);
console.log(`[✓] Ukuran file HTML mandiri: ${(fs.statSync(outHtmlPath).size / 1024).toFixed(1)} KB (dengan seluruh gambar base64 tertanam).`);
