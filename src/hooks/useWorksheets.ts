import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Worksheet } from '@/lib/types';

export function useWorksheets(userId: string | undefined) {
  const [items, setItems] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('stem_worksheets')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setItems(data as Worksheet[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const save = useCallback(
    async (payload: Omit<Worksheet, 'id' | 'user_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('stem_worksheets')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      await fetchItems();
      return data as Worksheet;
    },
    [fetchItems],
  );

  const remove = useCallback(
    async (id: string) => {
      await supabase.from('stem_worksheets').delete().eq('id', id);
      await fetchItems();
    },
    [fetchItems],
  );

  return { items, loading, save, remove, refetch: fetchItems };
}
