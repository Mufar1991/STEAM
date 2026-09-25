/*
# Create STEM assessment grades

1. New Tables
- `stem_grades` stores guru assessment scores for student worksheets.
- `id` unique grade identifier.
- `worksheet_id` references the assessed worksheet.
- `grader_id` the guru who assigned the grade (defaults to authenticated user).
- `science_score`, `technology_score`, `engineering_score`, `mathematics_score` per-criterion scores (0-4).
- `final_score` computed average of the four scores.
- `feedback` optional narrative feedback.
- `created_at` timestamp.

2. Security
- Row Level Security enabled.
- Authenticated users can read all grades (guru needs to see class grades; siswa needs to see own).
- Only authenticated users can insert/update/delete grades (guru role).
- No existing tables modified.

3. Important Notes
- Grades are linked to worksheets via foreign key with cascade delete.
- This table is intentionally read-accessible to all authenticated users so both guru and siswa roles can view grades.
*/

CREATE TABLE IF NOT EXISTS public.stem_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worksheet_id uuid NOT NULL REFERENCES public.stem_worksheets(id) ON DELETE CASCADE,
  grader_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  science_score integer NOT NULL DEFAULT 0 CHECK (science_score >= 0 AND science_score <= 4),
  technology_score integer NOT NULL DEFAULT 0 CHECK (technology_score >= 0 AND technology_score <= 4),
  engineering_score integer NOT NULL DEFAULT 0 CHECK (engineering_score >= 0 AND engineering_score <= 4),
  mathematics_score integer NOT NULL DEFAULT 0 CHECK (mathematics_score >= 0 AND mathematics_score <= 4),
  final_score numeric NOT NULL DEFAULT 0,
  feedback text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stem_grades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read STEM grades" ON public.stem_grades;
CREATE POLICY "Authenticated can read STEM grades"
  ON public.stem_grades FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can create STEM grades" ON public.stem_grades;
CREATE POLICY "Authenticated can create STEM grades"
  ON public.stem_grades FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update STEM grades" ON public.stem_grades;
CREATE POLICY "Authenticated can update STEM grades"
  ON public.stem_grades FOR UPDATE
  TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete STEM grades" ON public.stem_grades;
CREATE POLICY "Authenticated can delete STEM grades"
  ON public.stem_grades FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS stem_grades_worksheet_id_idx
  ON public.stem_grades (worksheet_id);
