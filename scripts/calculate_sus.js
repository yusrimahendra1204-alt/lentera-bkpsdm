const fs = require('fs');

const respondents = [
  { no: 1, id: "Resp-01", inisial: "PA", nama: "PARHA ARIEF, S.AP", jabatan: "Kepala BKPSDM", unit: "Pimpinan", raw: [4, 2, 4, 1, 5, 2, 4, 2, 4, 2] }, // sumConv: 32 -> 80.0
  { no: 2, id: "Resp-02", inisial: "AH", nama: "AHYAR HAERUDDIN, SE, M. Tr.AP", jabatan: "Sekretaris BKPSDM", unit: "Pimpinan", raw: [4, 1, 4, 2, 4, 1, 4, 2, 4, 1] }, // sumConv: 33 -> 82.5
  { no: 3, id: "Resp-03", inisial: "SP", nama: "SILPA P, SH, MM", jabatan: "Kabid Pengembangan Sumber Daya Aparatur", unit: "Pejabat Struktural", raw: [5, 1, 4, 2, 4, 2, 4, 2, 4, 2] }, // sumConv: 32 -> 80.0
  { no: 4, id: "Resp-04", inisial: "BA", nama: "BADARUDDIN ABDILLAH, S.AN, M.M", jabatan: "Kabid Mutasi, Kepangkatan & Karir", unit: "Pejabat Struktural", raw: [4, 2, 5, 2, 4, 2, 4, 1, 4, 2] }, // sumConv: 32 -> 80.0
  { no: 5, id: "Resp-05", inisial: "AB", nama: "ABDI, S.STP", jabatan: "Kabid Pengadaan, Kinerja & Info", unit: "Pejabat Struktural", raw: [5, 2, 4, 2, 5, 2, 4, 1, 5, 2] }, // sumConv: 34 -> 85.0
  { no: 6, id: "Resp-06", inisial: "NS", nama: "NURAZISAH SYAHRIR, S.Tr.IP, M.M", jabatan: "Kasubag Umum & Kepegawaian", unit: "Pejabat Pengawas", raw: [5, 1, 5, 2, 5, 1, 4, 2, 4, 2] }, // sumConv: 35 -> 87.5
  { no: 7, id: "Resp-07", inisial: "AG", nama: "ARIF GUNAWAN, S.AN, M.M", jabatan: "Kasubag Perencanaan & Keuangan", unit: "Pejabat Pengawas", raw: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2] }, // sumConv: 30 -> 75.0
  { no: 8, id: "Resp-08", inisial: "SB", nama: "SUBHAN", jabatan: "Pengadministrasi Perkantoran (Agendaris 1)", unit: "Agendaris / Operator", raw: [5, 1, 5, 2, 5, 1, 4, 2, 4, 2] }, // sumConv: 35 -> 87.5
  { no: 9, id: "Resp-09", inisial: "MS", nama: "MAISARAH", jabatan: "Pengadministrasi Perkantoran (Agendaris 2)", unit: "Agendaris / Operator", raw: [5, 2, 5, 2, 5, 2, 4, 1, 4, 2] }, // sumConv: 34 -> 85.0
  { no: 10, id: "Resp-10", inisial: "SH", nama: "SULHAM, S.T", jabatan: "Pranata Komputer Ahli Pertama", unit: "Pelaksana Teknis", raw: [5, 1, 4, 2, 5, 1, 4, 2, 4, 2] }, // sumConv: 34 -> 85.0
  { no: 11, id: "Resp-11", inisial: "PN", nama: "PUTRA NURAN SAKTI HIDAYATULLAH, S.Kom", jabatan: "Penata Kelola TI", unit: "Pelaksana Teknis", raw: [5, 2, 4, 1, 5, 2, 4, 2, 4, 2] }, // sumConv: 33 -> 82.5
  { no: 12, id: "Resp-12", inisial: "AS", nama: "ASMAWATI, S.AP, M.M", jabatan: "Analis SDM Aparatur Ahli Muda", unit: "Pelaksana Teknis", raw: [4, 2, 4, 2, 4, 2, 4, 2, 4, 3] }, // sumConv: 29 -> 72.5
  { no: 13, id: "Resp-13", inisial: "AT", nama: "ASMAWATI T, S.AP", jabatan: "Analis SDM Aparatur Ahli Muda", unit: "Pelaksana Teknis", raw: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2] }, // sumConv: 30 -> 75.0
  { no: 14, id: "Resp-14", inisial: "HR", nama: "HASRULLAH, S.M", jabatan: "Analis SDM Aparatur Ahli Pertama", unit: "Pelaksana Teknis", raw: [4, 2, 5, 2, 4, 2, 4, 1, 4, 2] }, // sumConv: 32 -> 80.0
  { no: 15, id: "Resp-15", inisial: "EV", nama: "ELVI, S.M", jabatan: "Analis SDM Aparatur Ahli Muda", unit: "Pelaksana Teknis", raw: [4, 2, 4, 2, 4, 2, 4, 2, 4, 2] }, // sumConv: 30 -> 75.0
  { no: 16, id: "Resp-16", inisial: "SN", nama: "SITTI NURDIANA, S.AN", jabatan: "Penelaah Teknis Kebijakan", unit: "Pelaksana Teknis", raw: [4, 2, 4, 2, 4, 1, 4, 2, 4, 1] }, // sumConv: 32 -> 80.0
  { no: 17, id: "Resp-17", inisial: "AT", nama: "AKBAR TANJUNG, S.M, MM", jabatan: "Penelaah Teknis Kebijakan", unit: "Pelaksana Teknis", raw: [5, 2, 4, 2, 4, 2, 4, 2, 4, 1] }, // sumConv: 32 -> 80.0
  { no: 18, id: "Resp-18", inisial: "RP", nama: "RAHMAT PANCA RAMADHAN, S.Tr.IP", jabatan: "Penelaah Teknis Kebijakan", unit: "Pelaksana Teknis", raw: [4, 2, 4, 1, 4, 2, 4, 1, 4, 2] }, // sumConv: 32 -> 80.0
  { no: 19, id: "Resp-19", inisial: "AM", nama: "ANDI ARTIKA MELATI, S.Pd", jabatan: "Arsiparis Ahli Pertama", unit: "Pelaksana Teknis", raw: [5, 1, 4, 2, 5, 2, 4, 1, 4, 2] }, // sumConv: 34 -> 85.0
  { no: 20, id: "Resp-20", inisial: "FL", nama: "FITRYA LIA RISMAWATI, S.Pd", jabatan: "Arsiparis Ahli Pertama", unit: "Pelaksana Teknis", raw: [4, 2, 4, 2, 4, 1, 4, 1, 4, 2] }  // sumConv: 32 -> 80.0
];

let curSumConv = 0;
let highest = 0;
let lowest = 100;
let qRawTotals = Array(10).fill(0);
let qConvTotals = Array(10).fill(0);

respondents.forEach(r => {
  const converted = r.raw.map((val, idx) => {
    qRawTotals[idx] += val;
    let c = (idx % 2 === 0) ? (val - 1) : (5 - val);
    qConvTotals[idx] += c;
    return c;
  });
  const sumC = converted.reduce((a, b) => a + b, 0);
  r.sumConv = sumC;
  r.converted = converted;
  r.score = sumC * 2.5;
  curSumConv += sumC;
  if (r.score > highest) highest = r.score;
  if (r.score < lowest) lowest = r.score;
});

const totalScore = curSumConv * 2.5;
const avgScore = totalScore / respondents.length;

console.log("=== HASIL PERHITUNGAN AKHIR LENGKAP ===");
console.log("Total SumConv:", curSumConv);
console.log("Total Skor Kumulatif:", totalScore.toFixed(1));
console.log("Rata-rata Skor SUS:", avgScore.toFixed(3), "-> Dibulatkan:", avgScore.toFixed(2));
console.log("Skor Tertinggi:", highest.toFixed(1));
console.log("Skor Terendah:", lowest.toFixed(1));
console.log("Rentang Skor:", (highest - lowest).toFixed(1));

console.log("\n=== RATA-RATA PER BUTIR PERTANYAAN (Q1 - Q10) ===");
qRawTotals.forEach((tot, idx) => {
  const avgRaw = tot / respondents.length;
  const avgC = qConvTotals[idx] / respondents.length;
  console.log(`Q${idx+1}: Nilai Asli = ${avgRaw.toFixed(2)}, Nilai Konversi = ${avgC.toFixed(2)}`);
});

console.log("\n=== TABEL MATRIKS RAW DAN CONVERTED PER RESPONDEN ===");
respondents.forEach(r => {
  console.log(`${r.no} | ${r.id} | ${r.inisial} | ${r.nama} | ${r.jabatan} | ${r.raw.join(' ')} | ${r.sumConv} | ${r.score.toFixed(1)}`);
});
