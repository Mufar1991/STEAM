import { Home, Layers, FlaskConical, FolderHeart, UserCircle } from 'lucide-react';
import type { TabKey } from '@/lib/types';

interface NavbarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: 'beranda', label: 'Beranda', icon: Home },
  { key: 'katalog', label: 'Katalog', icon: Layers },
  { key: 'lab', label: 'STEM Lab', icon: FlaskConical },
  { key: 'portofolio', label: 'Portofolio', icon: FolderHeart },
  { key: 'profil', label: 'Profil', icon: UserCircle },
];

export function Navbar({ active, onChange }: NavbarProps) {
  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3">
      <div className="flex w-full max-w-md items-center justify-between rounded-3xl border border-white/15 bg-slate-900/60 px-2 py-2 shadow-2xl shadow-purple-500/10 backdrop-blur-2xl">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold transition ${
                isActive
                  ? 'bg-rose-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
