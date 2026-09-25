import { useMemo, useRef, useState } from 'react';
import {
  Award,
  BarChart3,
  CheckCircle2,
  FileDown,
  FileText,
  FolderHeart,
  GraduationCap,
  Save,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import type { Worksheet } from '@/lib/types';
import { useWorksheets } from '@/hooks/useWorksheets';
import { useGrades } from '@/hooks/useGrades';
import { useAuth } from '@/hooks/useAuth';
import { RUBRIC } from '@/lib/data';
import { generateAIFeedback } from '@/lib/ai';



interface GradingModalProps {
  worksheet: Worksheet;
  onClose: () => void;
  onSave: (scores: { science: number; technology: number; engineering: number; mathematics: number; feedback: string }) => Promise<void>;
}

function GradingModal({ worksheet, onClose, onSave }: GradingModalProps) {
  const [scores, setScores] = useState({ science: 0, technology: 0, engineering: 0, mathematics: 0 });
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalScore = useMemo(
    () => (scores.science + scores.technology + scores.engineering + scores.mathematics) / 4,
    [scores],
  );

  const handleGenerateFeedback = async () => {
    setGenerating(true);
    setError(null);
    try {
      const draft = await generateAIFeedback(worksheet);
      setFeedback(draft);
    } catch {
      setError('Gagal membuat umpan balik AI.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave({
        science: scores.science,
        technology: scores.technology,
        engineering: scores.engineering,
        mathematics: scores.mathematics,
        feedback,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan nilai.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Rubrik Penilaian STEM</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-slate-800/40 p-3 border border-white/10">
          <p className="text-xs font-bold text-white">{worksheet.project_title}</p>
          <p className="text-[11px] text-slate-300">{worksheet.student_name}</p>
        </div>

        <div className="space-y-4">
          {RUBRIC.map((r) => {
            const key = r.pillar.toLowerCase() as keyof typeof scores;
            return (
              <div key={r.pillar} className="rounded-2xl border border-white/10 bg-slate-800/40 p-3 backdrop-blur-2xl">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-bold text-white">{r.pillar}</p>
                  <span className="text-[10px] font-bold text-emerald-400">Skor: {scores[key]}/4</span>
                </div>
                <p className="mb-2 text-[11px] text-slate-300">{r.criteria}</p>
                <div className="space-y-1">
                  {r.levels.map((level, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setScores((prev) => ({ ...prev, [key]: idx }))}
                      className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] transition ${
                        scores[key] === idx ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/40 text-slate-300 border border-white/5 hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="mt-0.5 font-bold">{idx + 1}.</span>
                      <span>{level}</span>
                      {scores[key] === idx && <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">Catatan / Umpan Balik</label>
            <button
              type="button"
              onClick={handleGenerateFeedback}
              disabled={generating}
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-2.5 py-1 text-[10px] font-bold text-white transition active:scale-95 disabled:opacity-60"
            >
              <Zap className="h-3 w-3" />
              {generating ? 'Menulis...' : 'Generate Feedback'}
            </button>
          </div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tulis umpan balik formatif, atau klik Generate AI Feedback untuk draf otomatis..."
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-slate-800/40 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 backdrop-blur-md placeholder-slate-400"
          />
        </div>

        <div className="mt-3 rounded-2xl bg-emerald-500/10 p-3 text-center border border-emerald-500/20">
          <p className="text-[11px] text-slate-400">Nilai Akhir</p>
          <p className="text-2xl font-bold text-emerald-400">{finalScore.toFixed(2)}</p>
        </div>

        {error && <p className="mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-300 border border-rose-500/20">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white transition active:scale-95 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Menyimpan...' : 'Simpan Nilai'}
        </button>
      </div>
    </div>
  );
}

interface CertificateModalProps {
  worksheet: Worksheet;
  finalScore: number;
  onClose: () => void;
}

function CertificateModal({ worksheet, finalScore, onClose }: CertificateModalProps) {
  const isPassed = finalScore >= 3;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-t-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Sertifikat Kelulusan</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border-4 border-amber-400 bg-gradient-to-br from-amber-400/20 to-rose-500/20 p-5 text-center backdrop-blur-xl">
          <img src="/logos_steam.png" alt="Logo STEM" className="mx-auto h-16 w-16 rounded-2xl object-cover" />
          <p className="mt-3 text-[10px] uppercase tracking-widest text-slate-300">Sertifikat Digital</p>
          <p className="text-lg font-bold text-white">STEM EduHub GTK 2026</p>
          <p className="mt-2 text-xs text-slate-300">Diberikan kepada</p>
          <p className="text-base font-bold text-white">{worksheet.student_name}</p>
          <p className="mt-1 text-xs text-slate-300">
            atas penyelesaian proyek <strong>{worksheet.project_title}</strong>
          </p>
          <div className="mt-3 inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
            Nilai Akhir: {finalScore.toFixed(2)} / 4.00
          </div>
          <p className="mt-3 text-[10px] text-slate-400">
            {isPassed ? 'LULUS dengan predikat ' + (finalScore >= 3.5 ? 'Mahir' : 'Berkembang') : 'Belum Lulus — perlu perbaikan'}
          </p>
          <p className="mt-2 text-[10px] text-slate-400">{new Date().toLocaleDateString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
}

export function Portofolio(): JSX.Element {
  const { user } = useAuth();
  const { items, loading, remove } = useWorksheets(user?.id);
  const { grades, saveGrade } = useGrades();
  const [gradingTarget, setGradingTarget] = useState<Worksheet | null>(null);
  const [certTarget, setCertTarget] = useState<Worksheet | null>(null);
  const classReportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const stats = useMemo(() => {
    const total = items.length;
    const graded = items.filter((i) => grades[i.id]).length;
    const avg =
      graded > 0
        ? items.reduce((sum, i) => sum + (grades[i.id]?.final_score ?? 0), 0) / graded
        : 0;
    return { total, graded, avg };
  }, [items, grades]);

  const printClassReport = async () => {
    const node = classReportRef.current;
    if (!node) return;
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `Rekap_Kelas_STEM_${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(node)
        .save();
    } finally {
      setExporting(false);
    }
  };

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FolderHeart className="h-5 w-5 text-slate-300" />
          <h2 className="text-base font-bold text-white">Manajemen Asesmen GTK</h2>
        </div>

        <section className="role-guru-only rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5">
          <div className="mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-slate-300" />
            <h3 className="text-sm font-bold text-white">Statistik Ringkasan Kelas</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-rose-500/10 p-3 text-center backdrop-blur-2xl border border-white/10">
              <p className="text-2xl font-bold text-rose-400">{stats.total}</p>
              <p className="text-[10px] text-slate-400">Total Karya</p>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-3 text-center backdrop-blur-2xl border border-white/10">
              <p className="text-2xl font-bold text-amber-400">{stats.graded}</p>
              <p className="text-[10px] text-slate-400">Sudah Dinilai</p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-center backdrop-blur-2xl border border-white/10">
              <p className="text-2xl font-bold text-emerald-400">{stats.avg.toFixed(2)}</p>
              <p className="text-[10px] text-slate-400">Rata-rata</p>
            </div>
          </div>
        </section>

        <section className="role-guru-only rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Rubrik Penilaian STEM (4 Kriteria)</h3>
            <button
              type="button"
              onClick={printClassReport}
              disabled={items.length === 0 || exporting}
              className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-[10px] font-bold text-white transition active:scale-95 disabled:opacity-50 border border-white/10"
            >
              <FileDown className="h-3 w-3" />
              {exporting ? 'Mencetak...' : 'Rekap Laporan Kelas (PDF)'}
            </button>
          </div>
          <div className="space-y-3">
            {RUBRIC.map((r) => (
              <div key={r.pillar} className="rounded-2xl border border-white/10 bg-slate-800/40 p-3 backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">{r.pillar}</p>
                  <span className="text-[10px] text-slate-400">4 level</span>
                </div>
                <p className="mb-2 text-[11px] text-slate-300">{r.criteria}</p>
                <ol className="list-decimal space-y-1 pl-4 text-[11px] text-slate-300">
                  {r.levels.map((level, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{idx + 1}.</span> {level}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="role-guru-only rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5">
          <h3 className="mb-3 text-sm font-bold text-white">Pengumpulan Siswa</h3>
          {loading ? (
            <p className="text-xs text-slate-400">Memuat data...</p>
          ) : items.length === 0 ? (
            <p className="text-xs text-slate-400">Belum ada pengumpulan lembar kerja.</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const grade = grades[item.id];
                return (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-800/40 p-3 backdrop-blur-2xl">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-white">{item.project_title}</p>
                        <p className="text-[11px] text-slate-300">{item.student_name}</p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {new Date(item.created_at).toLocaleString('id-ID')}
                        </p>
                        {grade && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                              Nilai: {grade.final_score.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setGradingTarget(item)}
                        className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white transition active:scale-95"
                      >
                        <GraduationCap className="h-3 w-3" />
                        {grade ? 'Ubah Nilai' : 'Nilai Proyek'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {gradingTarget && (
          <GradingModal
            worksheet={gradingTarget}
            onClose={() => setGradingTarget(null)}
            onSave={async (s) => {
              const finalScore = (s.science + s.technology + s.engineering + s.mathematics) / 4;
              await saveGrade({
                worksheet_id: gradingTarget.id,
                science_score: s.science,
                technology_score: s.technology,
                engineering_score: s.engineering,
                mathematics_score: s.mathematics,
                feedback: s.feedback,
                final_score: finalScore,
              });
            }}
          />
        )}

        <div className="hidden">
          <div ref={classReportRef} className="bg-white p-6 text-black" style={{ width: '794px' }}>
            <div className="flex items-center gap-4 border-b-4 border-slate-800 pb-4">
              <img src="/logos_steam.png" alt="KOP STEM" className="h-20 w-20 object-contain" />
              <div className="flex-1 text-center">
                <h1 className="text-lg font-bold uppercase">Rekap Laporan Kelas STEM</h1>
                <p className="text-sm">STEM EduHub GTK 2026 — Karya Inovasi Pembelajaran</p>
                <p className="text-xs italic">Lomba Apresiasi GTK 2026</p>
              </div>
              <div className="h-20 w-20" />
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-3">
              <p className="text-xs font-bold text-slate-700">Statistik Ringkasan</p>
              <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white p-2 shadow-sm">
                  <p className="text-lg font-bold text-rose-600">{stats.total}</p>
                  <p className="text-[10px] text-slate-500">Total Karya</p>
                </div>
                <div className="rounded-xl bg-white p-2 shadow-sm">
                  <p className="text-lg font-bold text-amber-600">{stats.graded}</p>
                  <p className="text-[10px] text-slate-500">Sudah Dinilai</p>
                </div>
                <div className="rounded-xl bg-white p-2 shadow-sm">
                  <p className="text-lg font-bold text-emerald-600">{stats.avg.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">Rata-rata</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="mb-2 text-sm font-bold uppercase">Rubrik Penilaian STEM (4 Kriteria)</h2>
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="border border-slate-400 px-2 py-1 text-left">Pilar</th>
                    <th className="border border-slate-400 px-2 py-1 text-left">Kriteria</th>
                    <th className="border border-slate-400 px-2 py-1 text-left">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {RUBRIC.map((r) =>
                    r.levels.map((level, idx) => (
                      <tr key={`${r.pillar}-${idx}`}>
                        {idx === 0 && (
                          <td className="border border-slate-400 px-2 py-1 font-semibold" rowSpan={r.levels.length}>{r.pillar}</td>
                        )}
                        <td className="border border-slate-400 px-2 py-1 text-[10px]">{r.criteria}</td>
                        <td className="border border-slate-400 px-2 py-1 text-[10px]">{idx + 1}. {level}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h2 className="mb-2 text-sm font-bold uppercase">Daftar Pengumpulan Siswa</h2>
              <table className="w-full border-collapse text-xs" style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
                <thead>
                  <tr className="bg-slate-200">
                    <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '6%' }}>No</th>
                    <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '24%' }}>Nama / Kelompok</th>
                    <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '24%' }}>Judul Proyek</th>
                    <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '22%' }}>Nilai Akhir</th>
                    <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '24%' }}>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => {
                    const grade = grades[item.id];
                    return (
                      <tr key={item.id}>
                        <td className="border border-slate-400 px-2 py-1">{idx + 1}</td>
                        <td className="border border-slate-400 px-2 py-1">{item.student_name}</td>
                        <td className="border border-slate-400 px-2 py-1">{item.project_title}</td>
                        <td className="border border-slate-400 px-2 py-1">{grade ? grade.final_score.toFixed(2) : '-'}</td>
                        <td className="border border-slate-400 px-2 py-1">{grade ? grade.feedback : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-10 flex justify-around text-sm">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p className="font-semibold">Guru Pembimbing</p>
                <div className="my-8" />
                <p className="border-t border-black pt-1">____________________</p>
              </div>
              <div className="text-center">
                <p>Kepala Sekolah,</p>
                <p className="font-semibold">STEM EduHub</p>
                <div className="my-8" />
                <p className="border-t border-black pt-1">____________________</p>
              </div>
            </div>
          </div>
        </div>
      </div>

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-amber-400" />
        <h2 className="text-base font-bold text-white">Portofolio Siswa</h2>
      </div>

      <section className="role-siswa-only rounded-3xl bg-gradient-to-br from-amber-400 to-rose-500 p-5 text-white shadow-lg">
        <p className="text-xs uppercase tracking-widest">Sertifikat Digital</p>
        <p className="mt-1 text-lg font-bold">STEM EduHub 2026</p>
        <p className="text-xs text-white/90">
          Diberikan kepada peserta yang menyelesaikan proyek STEM dengan kriteria Mahir.
        </p>
      </section>

      <section className="role-siswa-only">
        <h3 className="mb-2 text-sm font-bold text-white">Karya Saya</h3>
        {loading ? (
          <p className="rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5 text-xs text-slate-300">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5 text-center text-xs text-slate-300">
            Belum ada karya. Mulai proyek di STEM Lab dan unduh laporan untuk menyimpan.
          </p>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => {
              const grade = grades[item.id];
              return (
                <div key={item.id} className="rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-white">{item.project_title}</p>
                      <p className="text-[11px] text-slate-300">{item.student_name}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {new Date(item.created_at).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="text-rose-400"
                      aria-label="Hapus karya"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {grade && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        Nilai: {grade.final_score.toFixed(2)}
                      </span>
                      {grade.feedback && (
                        <span className="text-[10px] text-slate-400">{grade.feedback}</span>
                      )}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-500/30">
                      Science
                    </span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                      Tech
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                      Engineering
                    </span>
                    <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-semibold text-yellow-300 border border-yellow-500/30">
                      Math
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCertTarget(item)}
                    disabled={!grade}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-amber-500 py-2 text-xs font-bold text-white transition active:scale-95 disabled:opacity-50"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {grade ? 'Lihat Sertifikat' : 'Belum Dinilai'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {certTarget && grades[certTarget.id] && (
        <CertificateModal
          worksheet={certTarget}
          finalScore={grades[certTarget.id].final_score}
          onClose={() => setCertTarget(null)}
        />
      )}
    </div>
  );
}
