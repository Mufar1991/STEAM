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
          <UserCircle className="h-5 w-5 text-slate-300" />
          <h2 className="text-base font-bold text-white">Profil Pengguna</h2>
        </div>
        <div className="rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-white">
            <UserCircle className="h-8 w-8" />
          </div>
          <p className="mt-3 text-sm font-bold text-white">{user.email}</p>
          <p className="text-xs text-slate-300">Pengguna terverifikasi</p>
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
        <UserCircle className="h-5 w-5 text-slate-300" />
        <h2 className="text-base font-bold text-white">Autentikasi Pengguna</h2>
      </div>

      <div className="rounded-3xl backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-2xl shadow-indigo-500/10 p-5">
        <div className="mb-4 flex rounded-full bg-slate-800/40 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
              mode === 'login' ? 'bg-white text-slate-800 shadow-lg' : 'text-slate-300 hover:text-white'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full py-2 text-xs font-bold transition ${
              mode === 'register' ? 'bg-white text-slate-800 shadow-lg' : 'text-slate-300 hover:text-white'
            }`}
          >
            Daftar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/40 px-3 focus-within:border-pink-500 backdrop-blur-md">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@sekolah.id"
                required
                className="w-full bg-transparent py-2 text-sm text-white outline-none placeholder-slate-400"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
              className="w-full rounded-xl border border-white/10 bg-slate-800/40 px-3 py-2 text-sm text-white outline-none focus:border-pink-500 backdrop-blur-md placeholder-slate-400"
            />
          </div>
          {error && <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-300 border border-rose-500/20">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 py-3 text-sm font-bold text-white transition active:scale-95 disabled:opacity-60 border border-white/10"
          >
            <LogIn className="h-4 w-4" />
            {busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}
