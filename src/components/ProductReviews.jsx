import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { createProductReview, fetchProductReviews, uploadReviewImages } from '../services/supabase/reviews';

const StarRow = ({ value, onChange, disabled = false }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, idx) => {
        const star = idx + 1;
        const active = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-cream-100'
            }`}
            aria-label={`${star} stars`}
          >
            <span className={`text-xl ${active ? 'text-amber-400' : 'text-stone-300'}`}>★</span>
          </button>
        );
      })}
    </div>
  );
};

const ProductReviews = ({ productId }) => {
  const { user, profile, setAuthModalOpen } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const summary = useMemo(() => {
    if (!reviews.length) return { count: 0, avg: 0 };
    const total = reviews.reduce((s, r) => s + (r.rating || 0), 0);
    return { count: reviews.length, avg: total / reviews.length };
  }, [reviews]);

  const load = async () => {
    setLoading(true);
    const data = await fetchProductReviews(productId);
    setReviews(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (!productId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!comment.trim()) {
      setError('Please write your review.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      let imageUrls = [];
      if (files.length > 0) {
        imageUrls = await uploadReviewImages({
          productId,
          userId: user.id,
          files,
        });
      }
      await createProductReview({
        productId,
        userId: user.id,
        rating,
        comment: comment.trim(),
        imageUrls,
      });
      setComment('');
      setFiles([]);
      setRating(5);
      await load();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">Reviews</p>
          <p className="text-xs text-stone-500 mt-1">
            {summary.count === 0 ? 'No reviews yet.' : `${summary.avg.toFixed(1)} / 5 • ${summary.count} reviews`}
          </p>
        </div>
        {profile?.full_name && (
          <p className="text-xs text-stone-500">
            Signed in as <span className="font-medium text-stone-700">{profile.full_name}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-cream-50 border border-cream-200 rounded-2xl p-4 sm:p-5">
        <p className="text-sm font-semibold text-stone-900 mb-2">Write a review</p>
        <StarRow value={rating} onChange={setRating} disabled={submitting} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience..."
          className="mt-3 w-full px-3 py-2 rounded-xl border border-cream-300 bg-white outline-none focus:ring-2 focus:ring-terracotta-100 focus:border-terracotta-400 text-sm resize-none"
        />
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <label className="text-xs text-stone-600">
            <span className="font-medium">Add photos</span>{' '}
            <span className="text-stone-400">(optional)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="block mt-2 text-xs"
              onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 4))}
              disabled={submitting}
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-full bg-stone-900 text-cream-100 text-xs font-semibold tracking-wide disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit review'}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="mt-3 text-xs text-red-600"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {loading ? (
        <div className="py-6 text-center text-sm text-stone-500">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="py-6 text-center text-sm text-stone-500">Be the first to review this product.</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const name = r.profiles?.full_name || 'Buyer';
            const avatar = r.profiles?.avatar_url;
            const imgs = Array.isArray(r.image_urls) ? r.image_urls : [];
            return (
              <div key={r.id} className="bg-white border border-cream-200 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {avatar ? (
                      <img src={avatar} alt={name} className="w-9 h-9 rounded-full object-cover border border-cream-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-cream-200 flex items-center justify-center text-xs font-semibold text-stone-700">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">{name}</p>
                      <p className="text-xs text-stone-500">
                        {new Date(r.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i + 1 <= (r.rating || 0) ? 'text-amber-400' : 'text-stone-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-stone-700 mt-3 whitespace-pre-wrap">{r.comment}</p>

                {imgs.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {imgs.slice(0, 4).map((url) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer" className="block">
                        <img src={url} alt="" className="w-full h-20 sm:h-24 object-cover rounded-xl border border-cream-200" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

