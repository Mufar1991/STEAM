import { Download, GraduationCap, Lightbulb, LightbulbOff, User2 } from 'lucide-react';
import type { Role } from '@/lib/types';
import type { Theme } from '@/hooks/useTheme';

interface HeaderProps {
  role: Role;
  onRoleChange: (role: Role) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onInstallPWA?: () => void;
  showInstallPWA?: boolean;
}

export function Header({ role, onRoleChange, theme, onToggleTheme, onInstallPWA, showInstallPWA }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-2xl bg-slate-900/60 border-b border-white/10 shadow-2xl shadow-indigo-500/10 text-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/logos_steam.png"
            alt="Logo STEM EduHub"
            className="h-10 w-10 rounded-xl object-cover shadow-md ring-2 ring-white/20"
          />
          <div className="leading-tight">
            <h1 className="text-sm font-bold tracking-tight sm:text-base">STEM EduHub GTK 2026</h1>
            <p className="text-[10px] text-slate-300 sm:text-xs">Karya Inovasi Pembelajaran Lomba Apresiasi GTK</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Ganti tema"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-amber-300 backdrop-blur-md transition hover:bg-white/20"
          >
            {theme === 'dark' ? <Lightbulb className="h-4 w-4" /> : <LightbulbOff className="h-4 w-4" />}
          </button>

          {showInstallPWA && onInstallPWA && (
            <button
              type="button"
              onClick={onInstallPWA}
              aria-label="Install aplikasi"
              className="no-print flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 backdrop-blur-md border border-emerald-500/30 transition hover:bg-emerald-500/30"
              title="Install Aplikasi STEM"
            >
              <Download className="h-4 w-4" />
            </button>
          )}

          <div className="flex items-center gap-2 rounded-full bg-white/10 p-1 backdrop-blur-md border border-white/10">
            <button
              type="button"
              onClick={() => onRoleChange('siswa')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                role === 'siswa' ? 'bg-white text-slate-800 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              <User2 className="h-3.5 w-3.5" />
              Siswa
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('guru')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                role === 'guru' ? 'bg-white text-slate-800 shadow' : 'text-slate-200 hover:text-white'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Guru
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
