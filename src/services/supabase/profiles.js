import { supabase } from '../../lib/supabase';

export async function fetchCurrentProfile() {
  if (!supabase) return null;
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();
  if (sessionError || !user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Failed to fetch profile', error);
    return null;
  }
  return data;
}

export async function fetchVendorProfile(userId) {
  if (!supabase || !userId) return null;
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Failed to fetch vendor profile', error);
    }
    return null;
  }
  return data;
}

export async function listVendorsByStatus(status = 'pending') {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to list vendors', error);
    return [];
  }
  return data || [];
}

export async function updateVendorStatus(vendorId, status) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('vendor_profiles')
    .update({ status })
    .eq('id', vendorId);
  if (error) throw error;
  if (status === 'approved') {
    await supabase.from('profiles').update({ role: 'vendor' }).eq('id', vendorId);
  }
}

export async function listAllVendors() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('vendor_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

