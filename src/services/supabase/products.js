import { supabase } from '../../lib/supabase';

export async function fetchProducts(options = {}) {
  if (!supabase) return [];
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // Frontend: only show active products. Vendor/admin dashboards need all statuses.
  if (!options.vendorId && !options.includeAllStatus) {
    query = query.eq('status', 'active');
  }

  if (options.categoryIds?.length) {
    const ids = options.categoryIds;
    query = query.or(`category_id.in.(${ids.join(',')}),subcategory_id.in.(${ids.join(',')})`);
  } else if (options.categoryId) {
    query = query.or(`category_id.eq.${options.categoryId},subcategory_id.eq.${options.categoryId}`);
  }
  if (options.bestseller) {
    query = query.eq('bestseller', true);
  }
  if (options.vendorId) {
    query = query.eq('vendor_id', options.vendorId);
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.search) {
    query = query.ilike('name', `%${options.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createProduct(product) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, updates) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function updateProductStatus(id, status) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('products')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function fetchProductById(id) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchRelatedProducts(categoryId, subcategoryId, excludeId, limit = 5) {
  if (!supabase) return [];
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .neq('id', excludeId)
    .limit(limit);

  if (subcategoryId) {
    query = query.eq('subcategory_id', subcategoryId);
  } else if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
