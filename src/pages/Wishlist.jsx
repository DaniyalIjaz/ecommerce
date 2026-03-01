import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { products, wishlist, toggleWishlist, currency, addToCart, setAuthModalOpen, user } =
    useContext(ShopContext);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (product) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const sizes = product.sizes || [];
    if (sizes.length > 0) {
      addToCart(product.id, sizes[0], product);
    } else {
      addToCart(product.id, 'One Size', product);
    }
  };

  return (
    <div className="py-10 border-t border-cream-200">
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Your Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40">
          <Heart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-600 mb-2">Your wishlist is empty</p>
          <Link
            to="/collection"
            className="inline-block px-6 py-3 rounded-xl bg-stone-900 text-cream-100 font-medium hover:bg-stone-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product, i) => {
            const img = Array.isArray(product.images) ? product.images[0] : product.image?.[0];
            const effectivePrice =
              product.discount_price &&
              new Date() >= new Date(product.discount_start || 0) &&
              new Date() <= new Date(product.discount_end || '2099')
                ? product.discount_price
                : product.price;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <Link to={`/product/${product.id}`} className="block aspect-square bg-cream-100 relative">
                  {img ? (
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      No image
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart className="w-5 h-5 fill-terracotta-500 text-terracotta-500" />
                  </button>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <p className="font-medium text-stone-900 truncate hover:text-terracotta-600">
                      {product.name}
                    </p>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-semibold text-terracotta-600">
                      {currency}
                      {effectivePrice}
                      {product.discount_price && effectivePrice !== product.price && (
                        <span className="ml-2 text-sm text-stone-400 line-through">
                          {currency}
                          {product.price}
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 text-cream-100 text-sm font-medium hover:bg-stone-800"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
