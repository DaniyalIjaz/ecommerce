import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCategoryTree } from '../services/supabase/categories';

const Categories = () => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryTree()
      .then(setTree)
      .catch(() => setTree([]))
      .finally(() => setLoading(false));
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-10 h-10 border-2 border-cream-300 border-t-terracotta-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-10 border-t">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-medium text-stone-900">Shop by Category</h1>
        <p className="text-stone-600 mt-2">Browse our wide range of products</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
      >
        {tree.map((cat) => (
          <motion.div key={cat.id} variants={item}>
            <Link
              to={`/collection/${cat.slug}`}
              className="group block bg-cream-50 rounded-3xl border border-cream-200 overflow-hidden hover:shadow-2xl hover:border-cream-300 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-cream-200 to-cream-100 flex items-center justify-center overflow-hidden relative">
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <span className="text-4xl md:text-5xl text-gray-400 group-hover:scale-110 transition-transform duration-500">
                    {cat.name.charAt(0)}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 group-hover:text-terracotta-600 transition-colors">{cat.name}</h3>
                {cat.children?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {cat.children.slice(0, 3).map((child) => (
                      <span
                        key={child.id}
                        className="text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-cream-100 border border-cream-200 text-stone-500"
                      >
                        {child.name}
                      </span>
                    ))}
                    {cat.children.length > 3 && (
                      <span className="text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-cream-100 border border-cream-200 text-stone-500">
                        +{cat.children.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Categories;
