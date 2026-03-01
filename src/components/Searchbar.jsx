import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Searchbar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    useEffect(() => {
      setVisible(location.pathname.includes('collection') || location.pathname.includes('categories'));
    }, [location]);

    const trimmed = useMemo(() => (search || '').trim(), [search]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!trimmed) return;
      setShowSearch(true);
      navigate('/collection');
    };
    

  return (
    <AnimatePresence>
      {showSearch && visible && (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative mx-auto mt-4 sm:mt-6 w-[min(100vw-1.5rem,46rem)]"
          >
            <div className="bg-cream-50 border border-cream-200 rounded-2xl shadow-2xl overflow-hidden">
              <form onSubmit={handleSubmit} className="p-4 sm:p-5">
                <div className="flex items-center gap-3 bg-white border border-cream-300 rounded-full px-4 py-2.5 focus-within:border-terracotta-400 focus-within:ring-2 focus-within:ring-terracotta-100 transition-all">
                  <img className="w-4 opacity-70" src={assets.search_icon} alt="" />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none bg-transparent text-sm text-stone-800 placeholder-stone-400"
                    type="text"
                    placeholder="Search products, categories..."
                  />
                  {trimmed && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="p-2 rounded-full hover:bg-cream-100 transition-colors"
                    aria-label="Close"
                  >
                    <img className="w-3.5" src={assets.cross_icon} alt="Close" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-stone-500">
                    Press Enter to search
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!trimmed}
                    className="px-4 py-2 rounded-full bg-stone-900 text-cream-100 text-xs font-semibold tracking-wide disabled:opacity-40"
                  >
                    Search
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Searchbar
