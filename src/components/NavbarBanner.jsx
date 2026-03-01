import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSiteSetting } from '../services/supabase/site';

const NavbarBanner = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSetting('navbar_banner').then(setSettings).catch(() => setSettings(null));
  }, []);

  const showBanner = settings?.enabled && settings?.text;

  if (!showBanner) return null;

  const text = settings.text || '';
  const link = settings.link || '/';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <Link
          to={link}
          className="block py-2 px-4 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity bg-black"
        >
          {text}
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};

export default NavbarBanner;
