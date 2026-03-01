import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { fetchUserOrders } from '../services/supabase/orders';
import { motion } from 'framer-motion';

const Orders = () => {
  const { currency, user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserOrders(user.id)
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user?.id]);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t border-cream-200 pt-16"
    >
      <div className="text-2xl mb-6">
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {!user ? (
        <p className="text-stone-600 py-8">Please log in to view your orders.</p>
      ) : loading ? (
        <div className="py-16 flex justify-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-stone-600">
          <p className="text-lg">No orders yet.</p>
          <p className="text-sm mt-2">Your orders will appear here after you place them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-cream-200 rounded-xl overflow-hidden bg-cream-50"
            >
              <div className="bg-cream-100 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
                <span className="font-medium">Order #{order.id?.slice(0, 8)}</span>
                <span className="text-sm text-gray-600">{formatDate(order.created_at)}</span>
                <span className="text-sm font-medium">{currency}{order.total}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="p-4 divide-y divide-cream-200">
                {(order.order_items || []).map((item) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0">
                    <img
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                      src={item.product_image}
                      alt={item.product_name}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-stone-600 mt-1">
                        {currency}{item.price_at_order} × {item.quantity} | Size: {item.size}
                      </p>
                    </div>
                    <p className="font-medium">{currency}{(item.price_at_order * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Orders;
