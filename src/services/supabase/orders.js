import { supabase } from '../../lib/supabase';

export async function createOrder(orderData) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.userId || null,
      guest_email: orderData.guestEmail || null,
      status: 'pending',
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      delivery_address: orderData.deliveryAddress,
    })
    .select()
    .single();

  if (error) throw error;

  if (orderData.items?.length) {
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      size: item.size,
      quantity: item.quantity,
      price_at_order: item.price,
      vendor_id: item.vendorId || null,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) throw itemsError;
  }

  return order;
}

export async function fetchUserOrders(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchOrderById(orderId, userId = null) {
  if (!supabase) throw new Error('Supabase not configured');
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();
  if (error) throw error;
  return data;
}

export async function fetchAllOrders() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchOrdersForVendor(vendorId) {
  if (!supabase || !vendorId) return [];
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('order_id')
    .eq('vendor_id', vendorId);
  if (itemsError || !items?.length) return [];
  const orderIds = [...new Set(items.map((i) => i.order_id))];
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .in('id', orderIds)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(orderId, status) {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (error) throw error;
  if (status === 'delivered') {
    const { data: order } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();
    if (order?.order_items?.length) {
      for (const item of order.order_items) {
        const { data: prod } = await supabase.from('products').select('stock, sold_count').eq('id', item.product_id).single();
        const qty = item.quantity || 0;
        const newStock = Math.max(0, (prod?.stock || 0) - qty);
        await supabase.from('products').update({
          stock: newStock,
          sold_count: (prod?.sold_count || 0) + qty,
          status: newStock <= 0 ? 'sold_out' : 'active',
        }).eq('id', item.product_id);
      }
    }
  }
}
