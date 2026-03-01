import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const ProductItem = ({ id, image, name, price, product }) => {
  const { currency, toggleWishlist, isInWishlist } = useContext(ShopContext);
  const p = product || { id, images: image, name, price };
  const img = Array.isArray(p.images) ? p.images[0] : p.image?.[0] || image;
  const effectivePrice =
    p.discount_price &&
    new Date() >= new Date(p.discount_start || 0) &&
    new Date() <= new Date(p.discount_end || '2099')
      ? p.discount_price
      : p.price || price;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist?.(p.id);
  };

  return (
    <Link to={`/product/${p.id}`} className="group block text-stone-800">
      <motion.div
        whileHover={{ y: -4 }}
        className="relative overflow-hidden rounded-xl bg-cream-200"
      >
        <img
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
          src={img}
          alt={p.name || name}
        />
        {toggleWishlist && (
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
          >
            <Heart
              className={`w-4 h-4 ${isInWishlist?.(p.id) ? 'fill-terracotta-500 text-terracotta-500' : 'text-stone-400'}`}
            />
          </button>
        )}
        {effectivePrice !== (p.price || price) && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-terracotta-500 text-white text-xs font-medium">
            Sale
          </span>
        )}
      </motion.div>
      <p className="pt-3 pb-1 text-sm font-medium text-stone-800 line-clamp-2 group-hover:text-terracotta-600 transition-colors">
        {p.name || name}
      </p>
      <p className="text-stone-600 font-semibold">
        {currency}{effectivePrice}
        {effectivePrice !== (p.price || price) && (
          <span className="ml-2 text-sm text-stone-400 line-through">
            {currency}{p.price || price}
          </span>
        )}
      </p>
    </Link>
  );
};

export default ProductItem;
