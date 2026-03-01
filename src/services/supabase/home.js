import { supabase } from '../../lib/supabase'; // Ensure this path is correct for your project

/**
 * HOME BANNERS (Carousel Slides)
 */

// Fetch only active banners for the public Homepage
export async function fetchHomeBanners() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('home_banners')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false }); // Show newest first
  
  if (error) {
    console.error('Failed to fetch home banners', error);
    return [];
  }
  return data || [];
}

// List ALL banners for the Admin Dashboard
export async function listAllHomeBanners() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('home_banners')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Failed to list home banners', error);
    return [];
  }
  return data || [];
}

// Create a new slide (Used by Admin Dashboard)
export async function createHomeBanner(banner) {
  if (!supabase) throw new Error('Supabase not configured');
  
  // banner object expected: { title, subtitle, image_url, cta_label, cta_link, highlight, badge, is_active }
  const { data, error } = await supabase
    .from('home_banners')
    .insert([banner])
    .select();

  if (error) throw error;
  return data;
}

// Delete a slide
export async function deleteHomeBanner(id) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('home_banners')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}

// Update a slide
export async function updateHomeBanner(id, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('home_banners')
    .update(updates)
    .eq('id', id);
    
  if (error) throw error;
}


/**
 * HOME OFFERS (Keeping your existing logic)
 */

export async function fetchHomeOffers() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('home_offers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch home offers', error);
    return [];
  }
  return data || [];
}

export async function listAllHomeOffers() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('home_offers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to list home offers', error);
    return [];
  }
  return data || [];
}

export async function createHomeOffer(offer) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('home_offers').insert([offer]);
  if (error) throw error;
}

export async function deleteHomeOffer(id) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('home_offers').delete().eq('id', id);
  if (error) throw error;
}