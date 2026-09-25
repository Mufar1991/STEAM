import type { ExperimentRow, Role, Worksheet } from '@/lib/types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface AIContext {
  role: Role;
  projectTitle?: string;
  hypothesis?: string;
  experimentRows?: ExperimentRow[];
  engineering?: string;
}

const QUICK_PROMPTS_SISWA = [
  'Bantu saya buat kalimat hipotesis proyek ini',
  'Mengapa hasil percobaan saya gagal?',
  'Apa hubungan Sains dan Matematika di proyek ini?',
  'Beri ide desain rekayasa untuk proyek ini',
];

const QUICK_PROMPTS_GURU = [
  'Bantu saya menyusun modul proyek STEM baru',
  'Bagaimana cara membedakan siswa Berkembang dan Mahir?',
  'Apa saja kesalahan umum siswa saat eksperimen?',
  'Beri saran diferensiasi untuk siswa tingkat Awal',
];

export function getQuickPrompts(role: Role): string[] {
  return role === 'guru' ? QUICK_PROMPTS_GURU : QUICK_PROMPTS_SISWA;
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function analyzeHypothesisRequest(ctx: AIContext): string {
  const title = ctx.projectTitle ?? 'proyek ini';
  return [
    `Mari kita susun hipotesis untuk "${title}" bersama-sama! `,
    `Hipotesis yang baik biasanya berpola: "Jika [aksi/variabel], maka [hasil yang diharapkan], karena [alasan ilmiah]."`,
    ``,
    `Coba pikirkan:`,
    `1. Apa yang akan kamu ubah atau lakukan dalam eksperimen?`,
    `2. Apa yang kamu perkirakan akan terjadi?`,
    `3. Mengapa kamu berpikir begitu — ada konsep sains apa di baliknya?`,
    ``,
    `Tulis draf awalmu, dan aku akan bantu memperbaikinya!`,
  ].join('\n');
}

function analyzeFailureRequest(ctx: AIContext): string {
  const rows = ctx.experimentRows ?? [];
  const hasData = rows.some((r) => r.observation || r.measurement);
  if (!hasData) {
    return [
      `Hasil percobaan yang "gagal" sebenarnya adalah data berharga dalam sains! `,
      `Tapi aku belum melihat data eksperimenmu di lembar kerja. `,
      `Coba catat dulu: apa langkah yang kamu lakukan, dan apa yang sebenarnya terjadi?`,
      ``,
      `Pertanyaan pemantik:`,
      `- Apakah alat yang kamu gunakan sudah sesuai?`,
      `- Apakah ada langkah yang terlewat?`,
      `- Apakah kondisi lingkungan (suhu, cahaya, air) mempengaruhi hasil?`,
    ].join('\n');
  }
  return [
    `Menarik! Hasil yang tidak sesuai harapan justru membuka pertanyaan baru. `,
    `Mari kita analisis bersama:`,
    ``,
    `1. Apakah pengukuranmu sudah konsisten? Coba bandingkan data antar baris.`,
    `2. Apakah ada variabel yang tidak kamu kontrol (suhu, kelembapan, waktu)?`,
    `3. Apakah hipotesismu terlalu spesifik atau terlalu luas?`,
    ``,
    `Pertanyaan pemantik: "Apa yang akan berubah jika aku mengulang dengan kondisi yang lebih terkontrol?"`,
  ].join('\n');
}

function analyzeRelationRequest(): string {
  return [
    `Pertanyaan yang sangat penting! Sains dan Matematika saling terkait erat dalam proyek STEM:`,
    ``,
    `- **Sains** memberi pertanyaan: "Mengapa fenomena ini terjadi?"`,
    `- **Matematika** memberi alat: "Bagaimana kita mengukur, menghitung, dan membuktikannya?"`,
    ``,
    `Contoh di proyek ini:`,
    `1. Kamu mengamati fenomena (Sains)`,
    `2. Kamu mencatat pengukuran — panjang, suhu, waktu (Matematika)`,
    `3. Kamu menganalisis pola dari angka-angka itu (Matematika)`,
    `4. Kamu menyimpulkan apakah hipotesis terbukti (Sains + Matematika)`,
    ``,
    `Pertanyaan untukmu: pengukuran apa yang paling penting di proyek ini?`,
  ].join('\n');
}

function analyzeEngineeringRequest(ctx: AIContext): string {
  const title = ctx.projectTitle ?? 'proyek ini';
  return [
    `Bagus, mari berpikir seperti seorang insinyur untuk "${title}"! `,
    `Proses Desain Rekayasa (Engineering Design Process) punya langkah:`,
    ``,
    `1. **Identifikasi masalah** — apa yang perlu diselesaikan?`,
    `2. **Jelajahi solusi** — ada berapa cara berbeda?`,
    `3. **Rancang prototipe** — pilih satu, buat sederhana`,
    `4. **Uji & evaluasi** — apakah berhasil? Apa yang gagal?`,
    `5. **Perbaiki & iterasi** — tingkatkan berdasarkan hasil uji`,
    ``,
    `Pertanyaan pemantik:`,
    `- Apa kendala utama yang harus diatasi?`,
    `- Bahan apa yang tersedia di sekitarmu?`,
    `- Bagaimana cara mengukur keberhasilan desainmu?`,
  ].join('\n');
}

function analyzeGuruModuleRequest(): string {
  return [
    `Senang membantu menyusun modul! Kerangka modul proyek STEM yang baik:`,
    ``,
    `1. **Judul & Pilar** — pilih pilar dominan (S/T/E/M) dan integrasi sekunder`,
    `2. **Essential Question** — pertanyaan kunci yang memantik rasa ingin tahu`,
    `3. **Capaian** — konsep sains, keterampilan matematika, aspek rekayasa`,
    `4. **Skenario** — konteks dunia nyata yang relevan untuk siswa`,
    `5. **Diferensiasi** — sediakan versi Awal, Berkembang, Mahir`,
    `6. **Asesmen** — rubrik 4 kriteria S-T-E-M + refleksi P5`,
    ``,
    `Mau aku bantu mengembangkan salah satu bagian?`,
  ].join('\n');
}

function analyzeGuruDifferentiationRequest(): string {
  return [
    `Perbedaan tingkat kesiapan siswa:`,
    ``,
    `- **Awal**: butuh scaffolding tinggi — contoh konkret, langkah terstruktur, template pengisian`,
    `- **Berkembang**: mulai mandiri — beri pertanyaan terbuka, dorong eksplorasi`,
    `- **Mahir**: tantangan ekstensi — minta iterasi desain, analisis data lebih dalam, presentasi`,
    ``,
    `Saran: di satu kelas, beri proyek yang sama dengan tingkat kompleksitas berbeda. `,
    `Misal: semua membuat filter air, tapi siswa Mahir diminta menguji 3 bahan filter berbeda.`,
  ].join('\n');
}

function analyzeGuruCommonMistakesRequest(): string {
  return [
    `Kesalahan umum siswa saat eksperimen STEM:`,
    ``,
    `1. **Hipotesis terlalu umum** — "air akan jernih" bukan hipotesis, "air akan jernih karena pasiran menyaring partikel besar" baru hipotesis`,
    `2. **Pengukuran tidak konsisten** — menggunakan alat berbeda atau tidak mengulang`,
    `3. **Langkah tidak terurut** — melompat tahap sehingga hasil tidak reproducible`,
    `4. **Kesimpulan tidak didukung data** — menyimpulkan tanpa merujuk angka pengukuran`,
    `5. **Rekayasa tanpa iterasi** — menyerah setelah prototipe pertama gagal`,
    ``,
    `Saran: gunakan rubrik 4-kriteria untuk mengidentifikasi area yang perlu perbaikan tiap siswa.`,
  ].join('\n');
}

function analyzeGuruEarlyLevelRequest(): string {
  return [
    `Untuk siswa tingkat Awal, strategi diferensiasi:`,
    ``,
    `- Beri template hipotesis: "Jika ..., maka ..., karena ..."`,
    `- Sediakan tabel pengamatan dengan kolom sudah ditentukan`,
    `- Batasi jumlah variabel (hanya 1 yang berubah)`,
    `- Beri contoh pengukuran yang sudah jadi sebagai model`,
    `- Fokus pada proses, bukan hasil — apresiasi upaya, bukan keberhasilan`,
    ``,
    `Pertanyaan: proyek mana yang sedang kamu diferensiasi? Aku bisa bantu menyesuaikan.`,
  ].join('\n');
}

function defaultSocraticResponse(ctx: AIContext): string {
  const title = ctx.projectTitle;
  const intros = [
    `Pertanyaan menarik! Mari kita berpikir bersama.`,
    `Aku senang kamu bertanya! Coba kita uraikan.`,
    `Bagus, itu hal penting untuk dipikirkan.`,
  ];
  const lines = [pick(intros), ``];
  if (title) {
    lines.push(`Karena kamu sedang mengerjakan "${title}", coba hubungkan pertanyaanmu dengan:`,
      `- Apa tujuan utama proyek ini?`,
      `- Bagian mana yang membuatmu bingung?`,
      `- Apa yang sudah kamu coba sejauh ini?`);
  } else {
    lines.push(`Coba ceritakan lebih detail:`,
      `- Proyek apa yang sedang kamu kerjakan?`,
      `- Bagian mana yang ingin kamu pahami?`);
  }
  lines.push(``, `Aku di sini untuk membantumu berpikir, bukan memberi jawaban langsung!`);
  return lines.join('\n');
}

function defaultGuruResponse(): string {
  return [
    `Halo, Bapak/Ibu! Aku adalah asisten pedagogis STEM. `,
    `Aku bisa membantu dengan:`,
    `- Menyusun modul proyek baru`,
    `- Strategi diferensiasi pembelajaran`,
    `- Analisis rubrik penilaian`,
    `- Umpan balik untuk siswa`,
    ``,
    `Coba pilih pertanyaan cepat di bawah, atau ketik pertanyaanmu sendiri!`,
  ].join('\n');
}

export async function getAIResponse(message: string, ctx: AIContext): Promise<string> {
  await delay(600 + Math.random() * 800);
  const lower = message.toLowerCase();
  if (ctx.role === 'guru') {
    if (lower.includes('modul') || lower.includes('proyek baru')) return analyzeGuruModuleRequest();
    if (lower.includes('berkembang') || lower.includes('mahir') || lower.includes('beda')) return analyzeGuruDifferentiationRequest();
    if (lower.includes('salah') || lower.includes('kesalahan') || lower.includes('umum')) return analyzeGuruCommonMistakesRequest();
    if (lower.includes('awal') || lower.includes('diferensiasi')) return analyzeGuruEarlyLevelRequest();
    return defaultGuruResponse();
  }
  if (lower.includes('hipotesis')) return analyzeHypothesisRequest(ctx);
  if (lower.includes('gagal') || lower.includes('hasil') || lower.includes('percobaan')) return analyzeFailureRequest(ctx);
  if (lower.includes('hubungan') || lower.includes('sains') && lower.includes('matematika')) return analyzeRelationRequest();
  if (lower.includes('rekayasa') || lower.includes('desain') || lower.includes('engineering')) return analyzeEngineeringRequest(ctx);
  return defaultSocraticResponse(ctx);
}

export async function generateAIFeedback(worksheet: Worksheet): Promise<string> {
  await delay(800 + Math.random() * 600);
  const rows = worksheet.experiment_data ?? [];
  const hasData = rows.some((r) => r.observation || r.measurement);
  const hasHypothesis = worksheet.hypothesis && worksheet.hypothesis.trim().length > 10;
  const hasEngineering = worksheet.engineering_solution && worksheet.engineering_solution.trim().length > 10;
  const dataCount = rows.filter((r) => r.observation || r.measurement).length;

  const parts: string[] = [];

  parts.push(`Analisis otomatis untuk ${worksheet.student_name} — "${worksheet.project_title}":`);
  parts.push('');

  if (hasHypothesis) {
    parts.push('HIPOTESIS: Hipotesis telah dirumuskan. Periksa apakah pola "jika-maka-karena" sudah konsisten dan dapat diuji secara empiris.');
  } else {
    parts.push('HIPOTESIS: Hipotesis belum lengkap. Dorong siswa menyusun ulang dengan pola "Jika [aksi], maka [hasil], karena [alasan ilmiah]".');
  }

  if (dataCount >= 3) {
    parts.push(`DATA EKSPERIMEN: ${dataCount} baris pengamatan tercatat. Cukup untuk analisis dasar. Sarankan siswa membuat grafik sederhana untuk melihat pola.`);
  } else if (hasData) {
    parts.push(`DATA EKSPERIMEN: Hanya ${dataCount} baris terisi. Penting untuk menambah pengulangan agar data lebih valid dan reliabel.`);
  } else {
    parts.push('DATA EKSPERIMEN: Belum ada catatan pengamatan. Siswa perlu melengkapi tabel eksperimen sebelum dapat dinilai secara otentik.');
  }

  if (hasEngineering) {
    parts.push('REKAYASA: Solusi rekayasa telah dijelaskan. Pertanyaan tindak lanjut: apakah siswa sudah melakukan iterasi atau uji ulang setelah evaluasi pertama?');
  } else {
    parts.push('REKAYASA: Solusi rekayasa belum dijelaskan. Dorong siswa mendokumentasikan proses desain (identifikasi masalah, prototipe, uji, perbaikan).');
  }

  parts.push('');
  parts.push('SARAN ASESMEN FORMATIF:');
  if (dataCount >= 3 && hasHypothesis && hasEngineering) {
    parts.push('Karya menunjukkan pemahaman terpadu STEM. Beri tantangan ekstensi: minta siswa membandingkan dua variabel atau menambah iterasi desain.');
  } else if (hasHypothesis || hasEngineering) {
    parts.push('Karya menunjukkan pemahaman sebagian. Fokus perbaikan: lengkapi komponen yang masih kosong, dan dorong keterhubungan antar pilar S-T-E-M.');
  } else {
    parts.push('Karya perlu pendampingan lebih intensif. Mulai dari hipotesis dan pengumpulan data dasar sebelum melanjut ke rekayasa.');
  }

  return parts.join('\n');
}
