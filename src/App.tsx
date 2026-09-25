import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Navbar } from '@/components/Navbar';
import { Beranda } from '@/components/Beranda';
import { Katalog } from '@/components/Katalog';
import { Lab } from '@/components/Lab';
import { Portofolio } from '@/components/Portofolio';
import { Profil } from '@/components/Profil';
import { AIWidget } from '@/components/AIWidget';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import type { AIContext } from '@/lib/ai';
import type { Project, Role, TabKey } from '@/lib/types';

function App() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [role, setRole] = useState<Role>('siswa');
  const [tab, setTab] = useState<TabKey>('beranda');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    document.body.setAttribute('data-role', role);
  }, [role]);

  const handleStartProject = (project: Project) => {
    setSelectedProject(project);
    setTab('lab');
  };

  const handleGradeProject = (project: Project) => {
    setSelectedProject(project);
    setTab('portofolio');
  };

  const aiContext: AIContext = {
    role,
    projectTitle: selectedProject?.title,
    experimentRows: [],
    hypothesis: '',
    engineering: '',
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header role={role} onRoleChange={setRole} theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-3xl px-4 py-5">
        {tab === 'beranda' && (
          <Beranda
            role={role}
            userName={user?.email}
            onStartProject={() => setTab('katalog')}
            onCreateModule={() => setTab('katalog')}
          />
        )}
        {tab === 'katalog' && (
          <Katalog role={role} onStart={handleStartProject} onGrade={handleGradeProject} />
        )}
        {tab === 'lab' && (
          <Lab
            role={role}
            selectedProject={selectedProject}
            onClearProject={() => setSelectedProject(null)}
          />
        )}
        {tab === 'portofolio' && <Portofolio role={role} />}
        {tab === 'profil' && <Profil />}
      </main>

      <Navbar active={tab} onChange={setTab} />

      <AIWidget context={aiContext} />
    </div>
  );
}

export default App;
