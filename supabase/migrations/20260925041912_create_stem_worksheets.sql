/*
# Create STEM worksheet submissions

1. New Tables
- `stem_worksheets` stores each student's practical STEM report.
- `id` is the unique report identifier.
- `user_id` links the report to the signed-in Supabase user.
- `student_name` stores the student or group identity.
- `project_title` stores the selected project title.
- `hypothesis` stores the science hypothesis.
- `experiment_data` stores interactive experiment observations as JSON.
- `engineering_solution` stores the engineering design solution.
- `created_at` records when the report was submitted.

2. Security
- Row Level Security is enabled.
- Signed-in users can only view, create, update, or delete their own reports.
- The owner is assigned from the authenticated session by default.

3. Important Notes
- The table is intentionally private to each authenticated user.
- No existing tables or user data are modified.
*/

CREATE TABLE IF NOT EXISTS public.stem_worksheets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  project_title text NOT NULL,
  hypothesis text NOT NULL,
  experiment_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  engineering_solution text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stem_worksheets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own STEM worksheets" ON public.stem_worksheets;
CREATE POLICY "Users can view own STEM worksheets"
  ON public.stem_worksheets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own STEM worksheets" ON public.stem_worksheets;
CREATE POLICY "Users can create own STEM worksheets"
  ON public.stem_worksheets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own STEM worksheets" ON public.stem_worksheets;
CREATE POLICY "Users can update own STEM worksheets"
  ON public.stem_worksheets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own STEM worksheets" ON public.stem_worksheets;
CREATE POLICY "Users can delete own STEM worksheets"
  ON public.stem_worksheets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS stem_worksheets_user_id_created_at_idx
  ON public.stem_worksheets (user_id, created_at DESC);