import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StemGrade } from '@/lib/types';

export function useGrades() {
  const [grades, setGrades] = useState<Record<string, StemGrade>>({});
  const [loading, setLoading] = useState(true);

  const fetchGrades = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('stem_grades').select('*');
    if (!error && data) {
      const map: Record<string, StemGrade> = {};
      for (const g of data as StemGrade[]) {
        map[g.worksheet_id] = g;
      }
      setGrades(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const saveGrade = useCallback(
    async (payload: Omit<StemGrade, 'id' | 'grader_id' | 'created_at'>) => {
      const finalScore =
        (payload.science_score +
          payload.technology_score +
          payload.engineering_score +
          payload.mathematics_score) /
        4;
      const body = { ...payload, final_score: finalScore };
      const { data: existing } = await supabase
        .from('stem_grades')
        .select('id')
        .eq('worksheet_id', payload.worksheet_id)
        .maybeSingle();
      if (existing) {
        const { data, error } = await supabase
          .from('stem_grades')
          .update(body)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        await fetchGrades();
        return data as StemGrade;
      }
      const { data, error } = await supabase
        .from('stem_grades')
        .insert(body)
        .select()
        .single();
      if (error) throw error;
      await fetchGrades();
      return data as StemGrade;
    },
    [fetchGrades],
  );

  return { grades, loading, saveGrade, refetch: fetchGrades };
}
