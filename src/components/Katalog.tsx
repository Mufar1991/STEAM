import { useMemo, useState } from 'react';
import { Clock, Filter, GraduationCap, Play } from 'lucide-react';
import { PROJECTS, PILLAR_COLORS } from '@/lib/data';
import type { Pillar, Project, Readiness, Role } from '@/lib/types';

interface KatalogProps {
  role: Role;
  onStart: (project: Project) => void;
  onGrade: (project: Project) => void;
}

const PILLARS: (Pillar | 'Semua')[] = ['Semua', 'Science', 'Technology', 'Engineering', 'Mathematics'];
const READINESS: (Readiness | 'Semua')[] = ['Semua', 'Awal', 'Berkembang', 'Mahir'];

export function Katalog({ role, onStart, onGrade }: KatalogProps) {
  const [pillar, setPillar] = useState<Pillar | 'Semua'>('Semua');
  const [readiness, setReadiness] = useState<Readiness | 'Semua'>('Semua');

  const filtered = useMemo(
    () =>
      PROJECTS.filter(
        (p) =>
          (pillar === 'Semua' || p.pillar === pillar) &&
          (readiness === 'Semua' || p.readiness === readiness),
      ),
    [pillar, readiness],
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Katalog Proyek Diferensiasi</h2>
      </div>

      <div className="space-y-3 rounded-3xl bg-white p-4 shadow dark:bg-slate-900 dark:border dark:border-slate-800">
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Pilar STEM</p>
          <div className="flex flex-wrap gap-2">
            {PILLARS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPillar(p)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  pillar === p
                    ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Tingkat Kesiapan</p>
          <div className="flex flex-wrap gap-2">
            {READINESS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReadiness(r)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  readiness === r
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((project) => {
          const color = PILLAR_COLORS[project.pillar];
          return (
            <article key={project.id} className="overflow-hidden rounded-3xl bg-white shadow dark:bg-slate-900 dark:border dark:border-slate-800">
              <div className="relative h-36">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                <span
                  className={`absolute left-3 top-3 rounded-full ${color.bg} px-2.5 py-1 text-[10px] font-bold text-white shadow`}
                >
                  {project.pillar}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow dark:bg-slate-800/90 dark:text-slate-200">
                  {project.readiness}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{project.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{project.description}</p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {project.duration}
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{project.curriculum}</p>
                <button
                  type="button"
                  onClick={() => onStart(project)}
                  className="role-siswa-only mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-slate-800 py-2.5 text-xs font-bold text-white transition active:scale-95 dark:bg-slate-100 dark:text-slate-900"
                >
                  <Play className="h-3.5 w-3.5" />
                  Mulai Proyek
                </button>
                <button
                  type="button"
                  onClick={() => onGrade(project)}
                  className="role-guru-only mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition active:scale-95"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  Nilai Proyek
                </button>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <p className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow dark:bg-slate-900 dark:text-slate-400 dark:border dark:border-slate-800">
            Tidak ada proyek untuk filter ini.
          </p>
        )}
      </div>
    </div>
  );
}
