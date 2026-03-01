import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/frontend_assets/assets';

const OurPolicy = () => {
  const items = [
    { icon: assets.exchange_icon, title: 'Easy Exchange', desc: 'Hassle-free exchange policy' },
    { icon: assets.quality_icon, title: '7 Days Return', desc: 'Free return within 7 days' },
    { icon: assets.support_img, title: '24/7 Support', desc: 'We\'re here when you need us' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-8 text-center py-20">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-2xl bg-cream-50 border border-cream-200 hover:shadow-card transition-shadow"
        >
          <img src={item.icon} className="w-12 mx-auto mb-4 opacity-80" alt="" />
          <p className="font-semibold text-stone-900">{item.title}</p>
          <p className="text-stone-500 text-sm mt-1">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default OurPolicy;
