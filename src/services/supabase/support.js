import { supabase } from '../../lib/supabase';

export async function createSupportQuery({ userId, guestEmail, subject, message }) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('support_queries').insert({
    user_id: userId || null,
    guest_email: guestEmail || null,
    subject,
    message,
    status: 'open',
  });
  if (error) throw error;
}

export async function fetchUserSupportQueries(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from('support_queries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function fetchAllSupportQueries() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('support_queries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function replyToSupportQuery(queryId, adminReply) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('support_queries')
    .update({
      admin_reply: adminReply,
      status: 'replied',
      replied_at: new Date().toISOString(),
    })
    .eq('id', queryId);
  if (error) throw error;
}
