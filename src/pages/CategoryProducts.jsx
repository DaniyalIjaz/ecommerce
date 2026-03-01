import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCategoryBySlug } from '../services/supabase/categories';
import { fetchProducts } from '../services/supabase/products';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';

const CategoryProducts = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('relevant');
  const [subFilter, setSubFilter] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchCategoryBySlug(slug)
      .then(async (cat) => {
        setCategory(cat);
        // Fetch subcategories if parent
        const { supabase } = await import('../lib/supabase');
        const { data } = await supabase.from('categories').select('*').eq('parent_id', cat.id);
        setSubcategories(data || []);
        return cat;
      })
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!category) return;
    const categoryIds = [category.id, ...subcategories.map((c) => c.id)];
    fetchProducts({ categoryIds })
      .then((data) => {
        let sorted = [...data];
        if (subFilter) {
          sorted = sorted.filter((p) => p.subcategory_id === subFilter || p.category_id === subFilter);
        }
        switch (sortType) {
          case 'low-high':
            sorted.sort((a, b) => a.price - b.price);
            break;
          case 'high-low':
            sorted.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          default:
            break;
        }
        setProducts(sorted);
      })
      .catch(() => setProducts([]));
  }, [category, subcategories, sortType, subFilter]);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-10 h-10 border-2 border-cream-300 border-t-terracotta-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-16 text-center">
        <p className="text-stone-600">Category not found</p>
      </div>
    );
  }

  return (
    <div className="py-10 border-t">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-6 sm:gap-10"
      >
        {/* Filters */}
        {subcategories.length > 0 && (
          <div className="min-w-64">
            <p className="text-sm font-medium text-gray-700 mb-3">Subcategories</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSubFilter(null)}
                className={`px-3 py-1.5 rounded-full text-sm ${!subFilter ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSubFilter(sub.id)}
                  className={`px-3 py-1.5 rounded-full text-sm ${subFilter === sub.id ? 'bg-stone-900 text-cream-100' : 'bg-cream-200 text-stone-700 hover:bg-cream-300'}`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <Title text1={category.name.toUpperCase()} text2={`(${products.length})`} />
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border border-cream-300 rounded-xl px-3 py-2 text-sm bg-cream-50"
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="newest">Sort by: Newest</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6"
          >
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <ProductItem
                  id={p.id}
                  image={p.images || p.image}
                  name={p.name}
                  price={p.price}
                  product={p}
                />
              </motion.div>
            ))}
          </motion.div>
          {products.length === 0 && (
            <p className="text-center text-stone-500 py-12">No products found in this category.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryProducts;
