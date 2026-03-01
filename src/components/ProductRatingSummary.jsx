import React, { useEffect, useState } from 'react';
import { fetchProductReviews } from '../services/supabase/reviews';

const ProductRatingSummary = ({ productId }) => {
  const [summary, setSummary] = useState({ count: 0, avg: 0 });

  useEffect(() => {
    if (!productId) return;
    fetchProductReviews(productId).then((reviews) => {
      const arr = Array.isArray(reviews) ? reviews : [];
      const total = arr.reduce((s, r) => s + (r.rating || 0), 0);
      setSummary({
        count: arr.length,
        avg: arr.length ? total / arr.length : 0,
      });
    });
  }, [productId]);

  if (summary.count === 0) return <span className="text-stone-400 text-sm">No reviews yet</span>;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= Math.round(summary.avg) ? 'text-amber-400' : 'text-stone-300'
          }`}
        >
          ★
        </span>
      ))}
      <span className="pl-2 text-sm text-stone-600">
        {summary.avg.toFixed(1)} ({summary.count} reviews)
      </span>
    </div>
  );
};

export default ProductRatingSummary;
