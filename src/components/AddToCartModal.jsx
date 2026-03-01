import React from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';

const AddToCartModal = ({ isOpen, onClose, product, onContinueShopping, onViewCart }) => {
  if (!product) return null;

  const image = Array.isArray(product.images) && product.images[0] ? product.images[0] : product.image?.[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Added to Cart!" size="sm">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-24 h-24 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0"
        >
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>
        <p className="text-center text-stone-700 font-medium">{product.name}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onContinueShopping}
            className="flex-1 py-2.5 px-4 border border-cream-300 rounded-xl text-sm font-medium text-stone-700 hover:bg-cream-200 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={onViewCart}
            className="flex-1 py-2.5 px-4 bg-stone-900 text-cream-100 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            View Cart
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddToCartModal;
