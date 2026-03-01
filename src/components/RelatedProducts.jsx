import React, { useState, useEffect } from 'react';
import { fetchRelatedProducts } from '../services/supabase/products';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ categoryId, subcategoryId, excludeId }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!categoryId && !subcategoryId) return;
    fetchRelatedProducts(categoryId, subcategoryId, excludeId, 5)
      .then(setRelated)
      .catch(() => setRelated([]));
  }, [categoryId, subcategoryId, excludeId]);

  if (related.length === 0) return null;

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.images || item.image}
            product={item}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
