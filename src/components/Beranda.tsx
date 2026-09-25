import { useEffect, useRef, useState, useCallback } from 'react';
import { Award, BarChart3, BookOpen, Flame, Pencil, Plus, X, Zap } from 'lucide-react';
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
  Lightbulb: Zap,
  Users: BookOpen,
};

const HERO_THEMES = {
  'Futuristic Neon Teal': 'from-teal-600 via-cyan-500 to-blue-600',
  'Cosmic Violet': 'from-violet-600 via-purple-500 to-indigo-700',
  'Emerald Energy': 'from-emerald-600 via-teal-500 to-cyan-600',
  'Sunset Amber': 'from-amber-500 via-orange-500 to-rose-600',
} as const;

type HeroTheme = keyof typeof HERO_THEMES;

interface HeroSettings {
  title: string;
  subtitle: string;
  theme: HeroTheme;
  bgImage: string;
}

const DEFAULT_SETTINGS: HeroSettings = {
  title: 'Layanan Pendidikan Berbasis STEM/STEAM',
  subtitle: 'Karya Inovasi GTK 2026',
  theme: 'Futuristic Neon Teal',
  bgImage: '',
};

function getHeroSettings(): HeroSettings {
  try {
    const stored = localStorage.getItem('stem-eduhub-hero-settings');
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

export function Beranda({ role, userName, onStartProject, onCreateModule }: BerandaProps) {
  const [settings, setSettings] = useState<HeroSettings>(getHeroSettings);
  const [showModal, setShowModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('stem-eduhub-hero-settings', JSON.stringify(settings));
  }, [settings]);

  const gradientClass = HERO_THEMES[settings.theme] || HERO_THEMES['Futuristic Neon Teal'];

  const updateHeroContent = useCallback(() => {
    if (heroRef.current) {
      if (settings.bgImage) {
        heroRef.current.style.background = `url(${settings.bgImage}) center/cover no-repeat`;
      } else {
        heroRef.current.style.background = '';
        heroRef.current.className = `relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} p-5 text-white shadow-2xl shadow-indigo-500/10 transition-all duration-500`;
      }
    }
  }, [settings.bgImage, gradientClass]);

  useEffect(() => {
    updateHeroContent();
  }, [updateHeroContent]);

  return (
    <div className="space-y-5">
      <section
        ref={heroRef}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} p-5 text-white shadow-2xl shadow-indigo-500/10 transition-all duration-500`}
        style={settings.bgImage ? { backgroundImage: `url(${settings.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <img src="/logos_steam.png" alt="Logo STEM" className="h-14 w-14 rounded-2xl object-cover shadow-lg ring-2 ring-white/30" />
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-white/80">{settings.subtitle}</p>
            <h2 className="text-lg font-bold leading-tight drop-shadow-md">{settings.title}</h2>
            <p className="mt-1 text-xs text-white/80">
              {role === 'guru'
                ? `Selamat datang, Bapak/Ibu ${userName ?? 'Guru'} — mode inovator aktif.`
                : `Halo, ${userName ?? 'Siswa'} — siap berpetualang sains hari ini?`}
            </p>
          </div>
          {role === 'guru' && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10 transition hover:bg-white/30 active:scale-95"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit Tampilan Hero
            </button>
          )}
        </div>

        <div className="relative mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Science', color: 'bg-rose-500' },
            { label: 'Tech', color: 'bg-amber-500' },
            { label: 'Engineering', color: 'bg-emerald-500' },
            { label: 'Math', color: 'bg-yellow-400' },
          ].map((p) => (
            <div key={p.label} className={`rounded-xl ${p.color} px-1 py-2 text-[10px] font-bold text-white shadow backdrop-blur-sm transition hover:scale-105`}>
              {p.label}
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-slate-900/40 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-white" />
                <h3 className="text-sm font-bold text-white">Edit Tampilan Hero</h3>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">Judul Utama</label>
                <input
                  value={settings.title}
                  onChange={(e) => setSettings((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/40 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 backdrop-blur-md placeholder-slate-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">Sub-judul</label>
                <input
                  value={settings.subtitle}
                  onChange={(e) => setSettings((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/40 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 backdrop-blur-md placeholder-slate-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">Tema Warna Latar</label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings((prev) => ({ ...prev, theme: e.target.value as HeroTheme }))}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/40 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 backdrop-blur-md"
                >
                  {Object.keys(HERO_THEMES).map((theme) => (
                    <option key={theme} value={theme} className="bg-slate-800 text-white">{theme}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">URL Gambar Latar Kustom (opsional)</label>
                <input
                  value={settings.bgImage}
                  onChange={(e) => setSettings((prev) => ({ ...prev, bgImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/40 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 backdrop-blur-md placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mt-4 w-full rounded-2xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition hover:bg-indigo-700 active:scale-95"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      )}

      <section className="role-siswa-only rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5 transition hover:scale-[1.01]">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-5 w-5 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Capaian Pembelajaran STEM</h3>
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          Peserta didik mampu menerapkan pendekatan STEM/STEAM untuk menyelesaikan tantangan kontekstual,
          mengembangkan dimensi Profil Pelajar Pancasila, serta menumbuhkan keterampilan abad 21.
        </p>
        <button
          type="button"
          onClick={onStartProject}
          className="role-siswa-only mt-4 w-full rounded-2xl bg-rose-500 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition hover:scale-[1.02] active:scale-95"
        >
          Mulai Petualangan STEM
        </button>
        <button
          type="button"
          onClick={onCreateModule}
          className="role-guru-only mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition hover:scale-[1.02] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Buat Modul Proyek Baru
        </button>
      </section>

      <section className="role-siswa-only rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5 transition hover:scale-[1.01]">
        <div className="mb-3 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Lencana Profil Pelajar Pancasila</h3>
        </div>
        <div className="grid gap-3">
          {BADGES.map((badge) => {
            const Icon = ICONS[badge.icon] ?? Award;
            return (
              <div key={badge.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-800/40 p-3 backdrop-blur-2xl transition hover:scale-[1.01]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white shadow-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{badge.label}</p>
                  <p className="text-xs text-slate-300">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="role-guru-only rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5 transition hover:scale-[1.01]">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-slate-300" />
          <h3 className="text-sm font-bold text-white">Statistik Ringkasan Kelas</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-rose-500/10 p-3 text-center backdrop-blur-2xl border border-white/10">
            <p className="text-2xl font-bold text-rose-400">6</p>
            <p className="text-[10px] text-slate-400">Modul Proyek</p>
          </div>
          <div className="rounded-2xl bg-amber-500/10 p-3 text-center backdrop-blur-2xl border border-white/10">
            <p className="text-2xl font-bold text-amber-400">4</p>
            <p className="text-[10px] text-slate-400">Pilar STEM</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-center backdrop-blur-2xl border border-white/10">
            <p className="text-2xl font-bold text-emerald-400">3</p>
            <p className="text-[10px] text-slate-400">Tingkat Kesiapan</p>
          </div>
        </div>
      </section>
    </div>
  );
}