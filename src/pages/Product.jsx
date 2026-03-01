import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { Heart } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';
import ProductReviews from '../components/ProductReviews';
import ProductRatingSummary from '../components/ProductRatingSummary';

const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart, fetchProductById, toggleWishlist, isInWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('description');

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetchProductById(productId)
      .then((data) => {
        setProductData(data);
        const imgs = data.images || data.image;
        setImage(Array.isArray(imgs) && imgs[0] ? imgs[0] : imgs);
      })
      .catch(() => setProductData(null))
      .finally(() => setLoading(false));
  }, [productId, fetchProductById]);

  const handleAddToCart = () => {
    addToCart(productData.id, size, productData);
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-10 h-10 border-2 border-cream-300 border-t-terracotta-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="py-16 text-center">
        <p className="text-stone-600">Product not found</p>
      </div>
    );
  }

  const images = productData.images || productData.image || [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="border-t border-cream-200 pt-10"
      >
        <div className="flex gap-12 flex-col sm:flex-row">
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full gap-2">
              {images.map((img, index) => {
                const src = typeof img === 'string' ? img : (img?.default || img);
                return (
                  <img
                    key={index}
                    onClick={() => setImage(src)}
                    src={src}
                    alt=""
                    className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-lg border-2 transition-all ${
                      src === image ? 'border-terracotta-500' : 'border-cream-300 hover:border-stone-400'
                    }`}
                  />
                );
              })}
            </div>
            <div className="w-full sm:w-[80%]">
              <motion.img
                key={image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-auto rounded-lg"
                src={image}
                alt=""
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
              {toggleWishlist && (
                <button
                  onClick={() => toggleWishlist(productData.id)}
                  className="p-2 rounded-full hover:bg-cream-100 transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${isInWishlist?.(productData.id) ? 'fill-terracotta-500 text-terracotta-500' : 'text-stone-400'}`}
                  />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ProductRatingSummary productId={productData.id} />
            </div>
            <div className="mt-5 flex items-center gap-3">
              <p className="text-3xl font-medium">
                {currency}
                {productData.discount_price &&
                new Date() >= new Date(productData.discount_start || 0) &&
                new Date() <= new Date(productData.discount_end || '2099')
                  ? productData.discount_price
                  : productData.price}
              </p>
              {productData.discount_price &&
                new Date() >= new Date(productData.discount_start || 0) &&
                new Date() <= new Date(productData.discount_end || '2099') && (
                  <span className="text-lg text-stone-400 line-through">
                    {currency}{productData.price}
                  </span>
                )}
            </div>
            <p className="mt-5 text-stone-600 md:w-4/5">{productData.description}</p>
            <div className="flex flex-col gap-4 my-8">
              <p>Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {(productData.sizes || []).map((s, index) => (
                  <button
                    key={index}
                    onClick={() => setSize(s)}
                    className={`border py-2 px-4 rounded-lg transition-all ${
                      s === size ? 'border-terracotta-500 bg-terracotta-500 text-white' : 'bg-cream-200 border-cream-300 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="bg-stone-900 text-cream-100 px-8 py-3 text-sm rounded-xl font-medium hover:bg-stone-800 transition-colors"
            >
              ADD TO CART
            </motion.button>
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm text-stone-500 mt-5 flex flex-col gap-1">
              <p>100% Original Product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab('description')}
              className={`border border-cream-200 px-5 py-3 text-sm rounded-t-xl transition-colors ${
                tab === 'description' ? 'bg-cream-50 text-stone-900 font-semibold' : 'bg-white text-stone-500 hover:bg-cream-50'
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setTab('reviews')}
              className={`border border-cream-200 px-5 py-3 text-sm rounded-t-xl transition-colors ${
                tab === 'reviews' ? 'bg-cream-50 text-stone-900 font-semibold' : 'bg-white text-stone-500 hover:bg-cream-50'
              }`}
            >
              Reviews
            </button>
          </div>
          <div className="border border-cream-200 border-t-0 px-6 py-6 rounded-b-xl bg-white">
            <AnimatePresence mode="wait">
              {tab === 'description' ? (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="text-sm text-stone-600"
                >
                  <p>{productData.description}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                >
                  <ProductReviews productId={productData.id} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <RelatedProducts
          categoryId={productData.category_id}
          subcategoryId={productData.subcategory_id}
          excludeId={productData.id}
        />
      </motion.div>
    </>
  );
};

export default Product;
