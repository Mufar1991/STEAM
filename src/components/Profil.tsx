import { useState } from 'react';
import { LogIn, LogOut, Mail, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Profil() {
  const { user, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Profil Pengguna</h2>
        </div>
        <div className="rounded-3xl bg-white p-5 text-center shadow dark:bg-slate-900 dark:border dark:border-slate-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-white dark:bg-slate-700">
            <UserCircle className="h-8 w-8" />
          </div>
          <p className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">{user.email}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pengguna terverifikasi</p>
          <button
            type="button"
            onClick={signOut}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-2.5 text-sm font-bold text-white transition active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <UserCircle className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Autentikasi Pengguna</h2>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="mb-4 flex rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
              mode === 'login' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
              mode === 'register' ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-slate-800 dark:border-slate-700 dark:focus-within:border-slate-400">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@sekolah.id"
                required
                className="w-full bg-transparent py-2 text-sm text-slate-800 outline-none dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-400"
            />
          </div>
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 py-3 text-sm font-bold text-white transition active:scale-95 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
          >
            <LogIn className="h-4 w-4" />
            {busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}
