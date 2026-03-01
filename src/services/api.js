import { supabase } from '../lib/supabase';

// --- ADMIN SERVICES ---
export const adminData = {
  async fetchAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateOrderStatus(orderId, status) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
  },

  async fetchVendors() {
    const { data, error } = await supabase
      .from('vendor_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateVendorStatus(vendorId, status) {
    const { error } = await supabase
      .from('vendor_profiles')
      .update({ status })
      .eq('id', vendorId);
    if (error) throw error;
  },

  async fetchAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, vendor_profiles(shop_name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateProductStatus(productId, status) {
    const { error } = await supabase
      .from('products')
      .update({ status })
      .eq('id', productId);
    if (error) throw error;
  },

  async fetchQueries() {
    const { data, error } = await supabase
      .from('support_queries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async replyToQuery(id, reply) {
    const { error } = await supabase
      .from('support_queries')
      .update({ admin_reply: reply, status: 'replied', replied_at: new Date() })
      .eq('id', id);
    if (error) throw error;
  }
};

// --- SETTINGS SERVICES ---
export const siteSettings = {
  async get(key) {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .single();
    return data?.value;
  },

  async update(key, value) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value, updated_at: new Date() });
    if (error) throw error;
  }
};

// --- PUBLIC SERVICES ---
export const publicData = {
  async getActiveProducts() {
    const { data } = await supabase
      .from('products')
      .select('*, vendor_profiles(shop_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    return data || [];
  },

  async getCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    return data || [];
  }
};