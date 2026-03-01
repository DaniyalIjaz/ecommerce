import { supabase } from '../../lib/supabase';

export async function fetchCategories(parentId = null) {
  if (!supabase) return [];
  let query = supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (parentId === null) {
    query = query.is('parent_id', null);
  } else {
    query = query.eq('parent_id', parentId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchCategoryBySlug(slug) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchCategoryById(id) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchCategoryTree() {
  if (!supabase) return [];
  const { data: topCategories, error } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;

  const tree = await Promise.all(
    (topCategories || []).map(async (cat) => {
      const { data: children } = await supabase
        .from('categories')
        .select('*')
        .eq('parent_id', cat.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      return { ...cat, children: children || [] };
    })
  );
  return tree;
}

/** Fetch only categories that have at least one active product (for frontend) */
export async function fetchCategoryTreeWithProducts() {
  if (!supabase) return [];
  const { data: catIds } = await supabase
    .from('products')
    .select('category_id, subcategory_id')
    .eq('status', 'active');
  const ids = new Set();
  (catIds || []).forEach((p) => {
    if (p.category_id) ids.add(p.category_id);
    if (p.subcategory_id) ids.add(p.subcategory_id);
  });
  if (ids.size === 0) return fetchCategoryTree(); // Fallback when no products
  const { data: cats, error } = await supabase
    .from('categories')
    .select('*')
    .in('id', [...ids])
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) return [];
  const byParent = {};
  cats.forEach((c) => {
    const pid = c.parent_id || 'root';
    if (!byParent[pid]) byParent[pid] = [];
    byParent[pid].push(c);
  });
  const root = (byParent['root'] || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  return root.map((cat) => ({
    ...cat,
    children: (byParent[cat.id] || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
  }));
}

export async function listAllCategories() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}
