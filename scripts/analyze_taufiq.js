const fs = require('fs');
const path = require('path');

const xmlPath = path.join(__dirname, '..', 'temp_taufiq_extract', 'word', 'document.xml');
console.log('[+] Membaca document.xml Taufiq...');
const xml = fs.readFileSync(xmlPath, 'utf8');

// Extract all paragraphs
const paragraphs = [];
const pRe = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;
let m;
while ((m = pRe.exec(xml)) !== null) {
  const pContent = m[1];
  const tRe = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
  let text = '';
  let tm;
  while ((tm = tRe.exec(pContent)) !== null) {
    text += tm[1];
  }
  if (text.trim().length > 0) {
    paragraphs.push(text.trim());
  }
}

console.log('Total paragraf teks Taufiq:', paragraphs.length);

// Save to text file for easy inspection
fs.writeFileSync(path.join(__dirname, '..', 'taufiq_extracted_paragraphs.txt'), paragraphs.join('\n\n'), 'utf8');
console.log('[✓] Tersimpan ke taufiq_extracted_paragraphs.txt');

// Find headings and key sections
console.log('\n=== Struktur Bab & Bagian Penting Skripsi Taufiq: ===');
paragraphs.forEach((p, idx) => {
  if (p.match(/^BAB\s+[IVX]+/i) || p.match(/^\d\.\d\s+/i) || p.match(/kuesioner|black\s*box|testing|pengujian|usability|uat|skala\s*likert/i)) {
    if (p.length < 150) {
      console.log(`[P-${idx}] ${p}`);
    }
  }
});
