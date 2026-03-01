import { supabase } from '../../lib/supabase';

export async function fetchNavbarBanner() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('site_banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch navbar banner', error);
    return null;
  }
  return data;
}

export async function fetchSiteSettings() {
  if (!supabase) return {};
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['navbar_banner', 'global_discount']);
  if (error) {
    console.error('Failed to fetch site settings', error);
    return {};
  }
  const settings = {};
  (data || []).forEach((r) => { settings[r.key] = r.value || {}; });
  return settings;
}

export async function getSiteSetting(key) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) return null;
  return data?.value || null;
}

export async function updateSiteSetting(key, value) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
}

export async function listAllSiteBanners() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('site_banners')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Failed to list site banners', error);
    return [];
  }
  return data || [];
}

export async function createSiteBanner(banner) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('site_banners').insert(banner);
  if (error) throw error;
}

export async function updateSiteBanner(id, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('site_banners')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteSiteBanner(id) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('site_banners').delete().eq('id', id);
  if (error) throw error;
}
