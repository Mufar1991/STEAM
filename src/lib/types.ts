export type Role = 'siswa' | 'guru';

export type Readiness = 'Awal' | 'Berkembang' | 'Mahir';

export type Pillar = 'Science' | 'Technology' | 'Engineering' | 'Mathematics';

export interface Project {
  id: string;
  title: string;
  pillar: Pillar;
  readiness: Readiness;
  duration: string;
  curriculum: string;
  description: string;
  image: string;
}

export interface ExperimentRow {
  id: string;
  step: string;
  observation: string;
  measurement: string;
  note: string;
}

export interface Worksheet {
  id: string;
  user_id: string;
  student_name: string;
  project_title: string;
  hypothesis: string;
  experiment_data: ExperimentRow[];
  engineering_solution: string;
  created_at: string;
}

export interface StemGrade {
  id: string;
  worksheet_id: string;
  grader_id: string;
  science_score: number;
  technology_score: number;
  engineering_score: number;
  mathematics_score: number;
  final_score: number;
  feedback: string;
  created_at: string;
}

export type TabKey = 'beranda' | 'katalog' | 'lab' | 'portofolio' | 'profil';
