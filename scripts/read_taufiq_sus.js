const fs = require('fs');
const path = require('path');

const text = fs.readFileSync(path.join(__dirname, '..', 'taufiq_extracted_paragraphs.txt'), 'utf8');
const paras = text.split('\n\n');

console.log('=== METODOLOGI SUS TAUFIQ (P-670 s/d P-715) ===');
for (let i = 670; i <= 715 && i < paras.length; i++) {
  console.log(`[P-${i}] ${paras[i]}`);
}

console.log('\n=== HASIL SUS TAUFIQ DI BAB IV (P-2210 s/d P-2280) ===');
for (let i = 2210; i <= 2280 && i < paras.length; i++) {
  console.log(`[P-${i}] ${paras[i]}`);
}
