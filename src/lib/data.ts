import type { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'water-filter',
    title: 'Penjernih Air Sederhana',
    pillar: 'Science',
    readiness: 'Awal',
    duration: '2 x 45 menit',
    curriculum: 'IPAS Kelas 5 — Zat dan Perubahannya',
    description:
      'Merancang filter air dari bahan alami untuk memisahkan campuran dan menjernihkan air kotor.',
    image:
      'https://images.pexels.com/photos/327007/pexels-photo-327007.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'solar-oven',
    title: 'Oven Tenaga Surya Mini',
    pillar: 'Technology',
    readiness: 'Berkembang',
    duration: '3 x 45 menit',
    curriculum: 'IPAS Kelas 6 — Energi dan Sumbernya',
    description:
      'Memanfaatkan panas matahari untuk memasak menggunakan oven kartun berlapis aluminium foil.',
    image:
      'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'bridge-truss',
    title: 'Jembatan Rangka Truss',
    pillar: 'Engineering',
    readiness: 'Mahir',
    duration: '4 x 45 menit',
    curriculum: 'Matematika Kelas 6 — Geometri dan Pengukuran',
    description:
      'Merancang dan menguji kekuatan jembatan rangka dari lidi dengan beban terkontrol.',
    image:
      'https://images.pexels.com/photos/2078126/pexels-photo-2078126.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'rain-gauge',
    title: 'Alat Ukur Curah Hujan',
    pillar: 'Mathematics',
    readiness: 'Berkembang',
    duration: '2 x 45 menit',
    curriculum: 'Matematika Kelas 4 — Pengukuran dan Data',
    description:
      'Membuat rain gauge sederhana, mencatat curah hujan harian, dan menyajikan datanya.',
    image:
      'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'wind-turbine',
    title: 'Kincir Angin Pembangkit Listrik',
    pillar: 'Engineering',
    readiness: 'Mahir',
    duration: '5 x 45 menit',
    curriculum: 'IPAS Kelas 6 — Energi Terbarukan',
    description:
      'Merakit kincir angina mini yang menggerakkan dinamo untuk menyalakan LED kecil.',
    image:
      'https://images.pexels.com/photos/955378/pexels-photo-955378.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'plant-growth',
    title: 'Pengaruh Cahaya terhadap Tumbuhan',
    pillar: 'Science',
    readiness: 'Awal',
    duration: '7 hari pengamatan',
    curriculum: 'IPAS Kelas 4 — Makhluk Hidup dan Lingkungan',
    description:
      'Mengamati pertumbuhan tanaman di tempat terang dan gelap, mencatat perbedaannya.',
    image:
      'https://images.pexels.com/photos/4503267/pexels-photo-4503267.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const PILLAR_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  Science: { bg: 'bg-rose-500', text: 'text-rose-600', ring: 'ring-rose-200' },
  Technology: { bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-200' },
  Engineering: { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-200' },
  Mathematics: { bg: 'bg-yellow-400', text: 'text-yellow-700', ring: 'ring-yellow-200' },
};

export const BADGES = [
  {
    id: 'critical',
    label: 'Bernalar Kritis',
    description: 'Menganalisis hipotesis dan data eksperimen secara sistematis.',
    icon: 'Brain',
  },
  {
    id: 'creative',
    label: 'Kreatif',
    description: 'Merancang solusi rekayasa yang orisinal dan kontekstual.',
    icon: 'Lightbulb',
  },
  {
    id: 'collaborative',
    label: 'Gotong Royong',
    description: 'Berkontribusi dalam kelompok dan berbagi hasil temuan.',
    icon: 'Users',
  },
];

export const RUBRIC = [
  {
    pillar: 'Science',
    criteria: 'Pemahaman konsep dan ketepatan hipotesis',
    levels: [
      'Belum menyebutkan hipotesis',
      'Hipotesis terbatas, konsep kurang tepat',
      'Hipotesis tepat, konsep cukup dijelaskan',
      'Hipotesis tepat dan konsep dijelaskan dengan bukti',
    ],
  },
  {
    pillar: 'Technology',
    criteria: 'Penggunaan alat dan pencatatan data digital',
    levels: [
      'Tidak menggunakan alat bantu',
      'Alat terbatas, data kurang rapi',
      'Alat tepat, data tercatat rapi',
      'Alat tepat, data digital dan terverifikasi',
    ],
  },
  {
    pillar: 'Engineering',
    criteria: 'Proses desain dan solusi rekayasa',
    levels: [
      'Belum ada solusi rekayasa',
      'Solusi sederhana, kurang efektif',
      'Solusi efektif, proses desain jelas',
      'Solusi inovatif dan efektif dengan iterasi',
    ],
  },
  {
    pillar: 'Mathematics',
    criteria: 'Ketepatan pengukuran dan analisis data',
    levels: [
      'Pengukuran tidak konsisten',
      'Pengukuran terbatas, analisis minim',
      'Pengukuran konsisten, analisis dasar',
      'Pengukuran akurat, analisis lengkap dan sistematis',
    ],
  },
];
