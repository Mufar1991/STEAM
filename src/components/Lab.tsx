import { forwardRef, useEffect, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  FlaskConical,
  Lightbulb,
  Lock,
  Plus,
  Printer,
  Trash2,
  Wrench,
  Zap,
} from 'lucide-react';
import type { ExperimentRow, Project, Role } from '@/lib/types';
import { useWorksheets } from '@/hooks/useWorksheets';
import { useAuth } from '@/hooks/useAuth';

interface LabProps {
  role: Role;
  selectedProject: Project | null;
  onClearProject: () => void;
}

function emptyRow(): ExperimentRow {
  return { id: crypto.randomUUID(), step: '', observation: '', measurement: '', note: '' };
}

const inputCls = 'w-full rounded-xl border border-white/10 bg-slate-800/40 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 backdrop-blur-md placeholder-slate-400';
const cardCls = 'rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10';

export function Lab({ role: _role, selectedProject, onClearProject }: LabProps) {
  const { user } = useAuth();
  const { save } = useWorksheets(user?.id);
  const reportRef = useRef<HTMLDivElement>(null);

  const [studentName, setStudentName] = useState('');
  const [projectTitle, setProjectTitle] = useState(selectedProject?.title ?? '');
  const [hypothesis, setHypothesis] = useState('');
  const [rows, setRows] = useState<ExperimentRow[]>([emptyRow()]);
  const [engineering, setEngineering] = useState('');
  const [reflection, setReflection] = useState('');
  const [p5Reflection, setP5Reflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && !studentName) {
      setStudentName(user.email.split('@')[0]);
    }
  }, [user, studentName]);

  useEffect(() => {
    if (selectedProject) setProjectTitle(selectedProject.title);
  }, [selectedProject]);

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));
  const updateRow = (id: string, field: keyof ExperimentRow, value: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const calculateFlowRate = (measurement: string): string => {
    const parts = measurement.split('/').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] !== 0) {
      return (parts[0] / parts[1]).toFixed(2);
    }
    return '';
  };

  const loadDemoData = () => {
    setStudentName('Kelompok Demostrasi');
    setProjectTitle(selectedProject?.title ?? 'Proyek Demo Presisi Juri');
    setHypothesis('Jika variabel suhu ditingkatkan, maka laju reaksi akan meningkat karena energi kinetik partikel bertambah.');
    setRows([
      { id: crypto.randomUUID(), step: 'Persiapkan alat dan bahan sesuai standar laboratorium', observation: 'Semua alat teruji dan siap digunakan', measurement: '100/5', note: 'Volume/Waktu = 20.00 mL/detik' },
      { id: crypto.randomUUID(), step: 'Lakukan percobaan dengan variabel kontrol', observation: 'Hasil konsisten di semua pengulangan', measurement: '200/10', note: 'Volume/Waktu = 20.00 mL/detik' },
      { id: crypto.randomUUID(), step: 'Analisis data dan simpan dokumentasi', observation: 'Data valid dan reproducible', measurement: '150/7.5', note: 'Volume/Waktu = 20.00 mL/detik' },
    ]);
    setEngineering('Desain sistem kontrol suhu otomatis dengan sensor Arduino danaktuator Peltier. Prototipe telah diuji dengan 3 iterasi dan menunjukkan peningkatan efisiensi 25%.');
    setReflection('Saya telah memahami hubungan antara variabel kontrol dan hasil eksperimen. Kekuatan saya dalam perencanaan eksperimen, area pengembangan: analisis statistik lebih lanjut.');
    setP5Reflection('Dimensi Bernalar Kritis berkembang melalui analisis data sistematis. Dimensi Kreatif muncul dalam desain solusi rekayasa inovatif. Dimensi Gotong Royong terlihat dalam pembagian tugas kelompok yang efektif.');
    setMessage('Data demo presisi berhasil dimuat.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = async () => {
    if (!studentName || !projectTitle || !hypothesis || !engineering) {
      setMessage('Lengkapi identitas, hipotesis, dan solusi rekayasa sebelum mencetak.');
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        student_name: studentName,
        project_title: projectTitle,
        hypothesis,
        experiment_data: rows,
        engineering_solution: engineering,
      };
      if (user) {
        await save(payload);
      }
      await printReport();
      setMessage('Laporan berhasil diunduh dan disimpan.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Gagal memproses laporan.');
    } finally {
      setSaving(false);
    }
  };

  const printReport = async () => {
    const node = reportRef.current;
    if (!node) return;
    const html2pdf = (await import('html2pdf.js')).default;
    await html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `Laporan_${projectTitle || 'STEM'}.pdf`,
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(node)
      .save();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">STEM Lab & Lembar Kerja Digital</h2>
        </div>
        {_role === 'guru' && (
          <div className="role-guru-only flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300 border border-amber-500/20">
            <Lock className="h-4 w-4" />
            Mode guru: lembar kerja hanya dapat diisi oleh siswa.
          </div>
        )}
      </div>

      <div className="role-guru-only flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-3 text-xs text-amber-300 border border-amber-500/20">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <span>Beralih ke mode siswa untuk mengisi lembar kerja.</span>
        </div>
      </div>

      {_role === 'siswa' && (
        <>
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-300">
              {selectedProject ? `Proyek: ${selectedProject.title}` : 'Pilih proyek dari Katalog untuk memulai'}
            </div>
            {selectedProject && (
              <button type="button" onClick={onClearProject} className="text-xs font-semibold text-rose-400 underline">
                Ganti Proyek
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={loadDemoData}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition hover:scale-[1.02] active:scale-95"
          >
            <Zap className="h-4 w-4" />
            Demo Mode (Presisi Juri)
          </button>

          <div className={`${cardCls} space-y-4 p-5`}>
            <div className="grid gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">Identitas Siswa / Kelompok</label>
                <input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Nama siswa / kelompok"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">Judul Proyek</label>
                <input
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Judul proyek STEM"
                  className={inputCls}
                />
              </div>
            </div>

            <div className={`rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3`}>
              <div className="mb-2 flex items-center gap-2 text-rose-300">
                <Lightbulb className="h-4 w-4" />
                <h3 className="text-xs font-bold">Formulasi Hipotesis (Science)</h3>
              </div>
              <textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                placeholder="Jika ... maka ... karena ..."
                rows={3}
                className={inputCls}
              />
            </div>

            <div className={`rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3`}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300">
                  <FlaskConical className="h-4 w-4" />
                  <h3 className="text-xs font-bold">Catatan Eksperimen (Math & Tech)</h3>
                </div>
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-xl transition hover:scale-105 active:scale-95"
                >
                  <Plus className="h-3 w-3" /> Tambah Baris
                </button>
              </div>
              <div className="space-y-2">
                {rows.map((row, idx) => (
                  <div key={row.id} className="rounded-xl bg-slate-800/40 p-2 shadow-sm backdrop-blur-2xl border border-white/5">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">Baris {idx + 1}</span>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="text-rose-400"
                          aria-label="Hapus baris"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={row.step}
                        onChange={(e) => updateRow(row.id, 'step', e.target.value)}
                        placeholder="Langkah"
                        className={inputCls}
                      />
                      <input
                        value={row.measurement}
                        onChange={(e) => updateRow(row.id, 'measurement', e.target.value)}
                        placeholder="Volume/Waktu (misal: 100/5)"
                        className={inputCls}
                      />
                      <input
                        value={row.observation}
                        onChange={(e) => updateRow(row.id, 'observation', e.target.value)}
                        placeholder="Hasil pengamatan"
                        className={`${inputCls} col-span-2`}
                      />
                      <input
                        value={row.note}
                        onChange={(e) => updateRow(row.id, 'note', e.target.value)}
                        placeholder="Catatan tambahan"
                        className={`${inputCls} col-span-2`}
                      />
                    </div>
                    {row.measurement && calculateFlowRate(row.measurement) && (
                      <div className="mt-2 rounded-lg bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/20">
                        Laju Aliran: {calculateFlowRate(row.measurement)} mL/detik
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3`}>
              <div className="mb-2 flex items-center gap-2 text-emerald-300">
                <Wrench className="h-4 w-4" />
                <h3 className="text-xs font-bold">Solusi Rekayasa (Engineering)</h3>
              </div>
              <textarea
                value={engineering}
                onChange={(e) => setEngineering(e.target.value)}
                placeholder="Jelaskan solusi rekayasa yang dirancang..."
                rows={3}
                className={inputCls}
              />
            </div>

            <div className={`${cardCls} p-3`}>
              <div className="mb-2 flex items-center gap-2 text-slate-300">
                <BookOpen className="h-4 w-4" />
                <h3 className="text-xs font-bold">Refleksi Mandiri (Self-Assessment)</h3>
              </div>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Apa yang sudah saya pelajari? Apa yang ingin saya tingkatkan?"
                rows={3}
                className={inputCls}
              />
            </div>

            <div className={`${cardCls} p-3`}>
              <div className="mb-2 flex items-center gap-2 text-rose-300">
                <Award className="h-4 w-4" />
                <h3 className="text-xs font-bold">Refleksi Profil Pelajar Pancasila (P5)</h3>
              </div>
              <textarea
                value={p5Reflection}
                onChange={(e) => setP5Reflection(e.target.value)}
                placeholder="Dimensi mana yang berkembang (Bernalar Kritis, Kreatif, Gotong Royong)? Bagaimana buktinya?"
                rows={3}
                className={inputCls}
              />
            </div>

            {message && (
              <p className="rounded-xl bg-slate-800/40 px-3 py-2 text-xs text-slate-300 border border-white/10">{message}</p>
            )}

            <button
              type="button"
              onClick={handleExport}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition hover:scale-[1.02] active:scale-95 disabled:opacity-60 border border-white/10"
            >
              <Printer className="h-4 w-4" />
              {saving ? 'Memproses...' : 'Cetak / Unduh PDF'}
            </button>
          </div>
        </>
      )}

      <div className="hidden">
        <ReportDocument
          ref={reportRef}
          studentName={studentName}
          projectTitle={projectTitle}
          hypothesis={hypothesis}
          rows={rows}
          engineering={engineering}
          reflection={reflection}
          p5Reflection={p5Reflection}
        />
      </div>
    </div>
  );
}

interface ReportProps {
  studentName: string;
  projectTitle: string;
  hypothesis: string;
  rows: ExperimentRow[];
  engineering: string;
  reflection: string;
  p5Reflection: string;
}

const ReportDocument = forwardRef<HTMLDivElement, ReportProps>(function ReportDocument(
  { studentName, projectTitle, hypothesis, rows, engineering, reflection, p5Reflection },
  ref,
) {
  return (
    <div ref={ref} className="bg-white p-6 text-black" style={{ width: '794px' }}>
      <div className="flex items-center gap-4 border-b-4 border-slate-800 pb-4">
        <img src="/logos_steam.png" alt="KOP STEM" className="h-20 w-20 object-contain" />
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold uppercase">Laporan Praktikum STEM</h1>
          <p className="text-sm">STEM EduHub GTK 2026 — Karya Inovasi Pembelajaran</p>
          <p className="text-xs italic">Lomba Apresiasi GTK 2026 — Layanan Pendidikan Berbasis STEM/STEAM</p>
        </div>
        <div className="h-20 w-20" />
      </div>

      <table className="mt-4 w-full text-sm" style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
        <tbody>
          <tr>
            <td className="w-1/3 py-1 font-semibold">Nama / Kelompok</td>
            <td className="py-1">: {studentName || '-'}</td>
          </tr>
          <tr>
            <td className="py-1 font-semibold">Judul Proyek</td>
            <td className="py-1">: {projectTitle || '-'}</td>
          </tr>
          <tr>
            <td className="py-1 font-semibold">Tanggal</td>
            <td className="py-1">: {new Date().toLocaleDateString('id-ID')}</td>
          </tr>
        </tbody>
      </table>

      <section className="mt-4">
        <h2 className="mb-1 text-sm font-bold uppercase">A. Hipotesis</h2>
        <p className="text-sm">{hypothesis || '-'}</p>
      </section>

      <section className="mt-4">
        <h2 className="mb-1 text-sm font-bold uppercase">B. Catatan Eksperimen</h2>
        <table className="w-full border-collapse text-xs" style={{ tableLayout: 'fixed', wordWrap: 'break-word' }}>
          <thead>
            <tr className="bg-slate-200">
              <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '6%' }}>No</th>
              <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '24%' }}>Langkah</th>
              <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '22%' }}>Pengukuran</th>
              <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '24%' }}>Hasil Pengamatan</th>
              <th className="border border-slate-400 px-2 py-1 text-left" style={{ width: '24%' }}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id}>
                <td className="border border-slate-400 px-2 py-1">{idx + 1}</td>
                <td className="border border-slate-400 px-2 py-1">{row.step || '-'}</td>
                <td className="border border-slate-400 px-2 py-1">{row.measurement || '-'}</td>
                <td className="border border-slate-400 px-2 py-1">{row.observation || '-'}</td>
                <td className="border border-slate-400 px-2 py-1">{row.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-4">
        <h2 className="mb-1 text-sm font-bold uppercase">C. Solusi Rekayasa</h2>
        <p className="text-sm">{engineering || '-'}</p>
      </section>

      <section className="mt-4">
        <h2 className="mb-1 text-sm font-bold uppercase">D. Refleksi Siswa</h2>
        <p className="text-sm">{reflection || '-'}</p>
      </section>

      <section className="mt-4">
        <h2 className="mb-1 text-sm font-bold uppercase">E. Refleksi Profil Pelajar Pancasila</h2>
        <p className="text-sm">{p5Reflection || '-'}</p>
      </section>

      <div className="mt-10 flex justify-around text-sm">
        <div className="text-center">
          <p>Mengetahui,</p>
          <p className="font-semibold">Guru Pembimbing</p>
          <div className="my-8" />
          <p className="border-t border-black pt-1">____________________</p>
        </div>
        <div className="text-center">
          <p>Siswa,</p>
          <p className="font-semibold">{studentName || '-'}</p>
          <div className="my-8" />
          <p className="border-t border-black pt-1">____________________</p>
        </div>
      </div>
    </div>
  );
});