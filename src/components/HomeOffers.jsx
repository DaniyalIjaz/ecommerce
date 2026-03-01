import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomeOffers = ({ offers }) => {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-stone-900">Current offers</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer, idx) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-cream-50 border border-cream-200 rounded-2xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-stone-900">{offer.title}</h3>
              {offer.badge_label && (
                <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-terracotta-500/10 text-terracotta-600">
                  {offer.badge_label}
                </span>
              )}
            </div>
            {offer.description && (
              <p className="text-xs text-stone-600">{offer.description}</p>
            )}
            {offer.cta_link && (
              <div className="pt-1">
                <Link
                  to={offer.cta_link}
                  className="inline-flex text-xs font-medium text-terracotta-600 hover:text-terracotta-700"
                >
                  {offer.cta_label || 'Shop offer'}
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HomeOffers;

