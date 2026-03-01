import { supabase } from '../../lib/supabase';

export async function fetchProductReviews(productId) {
  if (!supabase || !productId) return [];
  const { data, error } = await supabase
    .from('product_reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch reviews', error);
    return [];
  }
  return data || [];
}

export async function createProductReview({ productId, userId, rating, comment, imageUrls = [] }) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('product_reviews').insert({
    product_id: productId,
    user_id: userId,
    rating,
    comment,
    image_urls: imageUrls,
  });
  if (error) throw error;
}

export async function uploadReviewImages({ productId, userId, files }) {
  if (!supabase) throw new Error('Supabase not configured');
  const bucket = supabase.storage.from('review-images');

  const uploaded = [];
  for (const file of files) {
    const safeName = `${Date.now()}-${file.name}`.replace(/\s+/g, '-');
    const path = `${productId}/${userId}/${safeName}`;
    const { error: uploadError } = await bucket.upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (uploadError) throw uploadError;
    const { data } = bucket.getPublicUrl(path);
    if (data?.publicUrl) uploaded.push(data.publicUrl);
  }
  return uploaded;
}

