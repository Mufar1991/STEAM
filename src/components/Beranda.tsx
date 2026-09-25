import { Award, BarChart3, BookOpen, Flame, Plus, Sparkles } from 'lucide-react';
import type { Role } from '@/lib/types';
import { BADGES } from '@/lib/data';

interface BerandaProps {
  role: Role;
  userName?: string;
  onStartProject: () => void;
  onCreateModule: () => void;
}

const ICONS: Record<string, typeof Award> = {
  Brain: Award,
  Lightbulb: Sparkles,
  Users: BookOpen,
};

export function Beranda({ role, userName, onStartProject, onCreateModule }: BerandaProps) {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-700 p-5 text-white shadow-lg dark:from-slate-800 dark:to-slate-950">
        <div className="flex items-center gap-3">
          <img src="/logos_steam.png" alt="Logo STEM" className="h-14 w-14 rounded-2xl object-cover" />
          <div>
            <p className="text-xs uppercase tracking-widest text-rose-300">Karya Inovasi GTK 2026</p>
            <h2 className="text-lg font-bold leading-tight">Layanan Pendidikan Berbasis STEM/STEAM</h2>
            <p className="mt-1 text-xs text-slate-300">
              {role === 'guru'
                ? `Selamat datang, Bapak/Ibu ${userName ?? 'Guru'} — mode inovator aktif.`
                : `Halo, ${userName ?? 'Siswa'} — siap berpetualang sains hari ini?`}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Science', color: 'bg-rose-500' },
            { label: 'Tech', color: 'bg-amber-500' },
            { label: 'Engineering', color: 'bg-emerald-500' },
            { label: 'Math', color: 'bg-yellow-400' },
          ].map((p) => (
            <div key={p.label} className={`rounded-xl ${p.color} px-1 py-2 text-[10px] font-bold text-white shadow`}>
              {p.label}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-5 w-5 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Capaian Pembelajaran STEM</h3>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Peserta didik mampu menerapkan pendekatan STEM/STEAM untuk menyelesaikan tantangan kontekstual,
          mengembangkan dimensi Profil Pelajar Pancasila, serta menumbuhkan keterampilan abad 21.
        </p>
        <button
          type="button"
          onClick={onStartProject}
          className="role-siswa-only mt-4 w-full rounded-2xl bg-rose-500 py-2.5 text-sm font-bold text-white shadow transition active:scale-95"
        >
          Mulai Petualangan STEM
        </button>
        <button
          type="button"
          onClick={onCreateModule}
          className="role-guru-only mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Buat Modul Proyek Baru
        </button>
      </section>

      <section className="role-siswa-only rounded-3xl bg-white p-5 shadow dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="mb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Lencana Profil Pelajar Pancasila</h3>
        </div>
        <div className="grid gap-3">
          {BADGES.map((badge) => {
            const Icon = ICONS[badge.icon] ?? Award;
            return (
              <div key={badge.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 p-3 dark:border-slate-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{badge.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="role-guru-only rounded-3xl bg-white p-5 shadow dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Statistik Ringkasan Kelas</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-rose-50 p-3 text-center dark:bg-rose-950/40">
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">6</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Modul Proyek</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 text-center dark:bg-amber-950/40">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">4</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Pilar STEM</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-center dark:bg-emerald-950/40">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">3</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Tingkat Kesiapan</p>
          </div>
        </div>
      </section>
    </div>
  );
}
