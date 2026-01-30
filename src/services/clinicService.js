import { supabase } from './supabase';

export async function getClinicById(id) {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateClinic(id, updates) {
  const { data, error } = await supabase
    .from('clinics')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Subscribe to realtime updates for a specific clinic row.
// Returns the subscription object which can be removed with supabase.removeSubscription(sub)
export function subscribeToClinic(id, onChange) {
  // Use Supabase v2 realtime (postgres_changes) via channel
  const channel = supabase
    .channel(`public:clinics:id=${id}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'clinics', filter: `id=eq.${id}` }, (payload) => {
      if (!payload) return;
      // payload.eventType can be 'INSERT' | 'UPDATE' | 'DELETE'
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        onChange(payload.new);
      }
    })
    .subscribe();

  return channel;
}
