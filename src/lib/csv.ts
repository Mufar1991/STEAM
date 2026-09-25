import type { StemGrade, Worksheet } from '@/lib/types';

export function exportGradesCSV(items: Worksheet[], grades: Record<string, StemGrade>) {
  const header = [
    'Nama Siswa',
    'Judul Proyek',
    'Science',
    'Technology',
    'Engineering',
    'Mathematics',
    'Nilai Akhir',
    'Catatan',
    'Tanggal',
  ];
  const rows = items.map((item) => {
    const grade = grades[item.id];
    return [
      item.student_name,
      item.project_title,
      grade ? String(grade.science_score) : '',
      grade ? String(grade.technology_score) : '',
      grade ? String(grade.engineering_score) : '',
      grade ? String(grade.mathematics_score) : '',
      grade ? grade.final_score.toFixed(2) : '',
      grade ? `"${grade.feedback.replace(/"/g, '""')}"` : '',
      new Date(item.created_at).toLocaleDateString('id-ID'),
    ];
  });
  const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Nilai_STEM_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
