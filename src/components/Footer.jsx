import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUpRight,
  Globe
} from 'lucide-react';
import { assets } from '../assets/frontend_assets/assets';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerMapping = {
    navigation: [
      { name: 'The Catalog', link: '/collection' },
      { name: 'Categories', link: '/categories' },
      { name: 'Our Story', link: '/about' },
      { name: 'Latest Drops', link: '/collection' },
    ],
    partners: [
      { name: 'Register Business', link: '/vendor/register' },
      { name: 'Vendor Dashboard', link: '/vendor/dashboard' },
      { name: 'Affiliate Program', link: '/affiliate' },
      { name: 'Admin Terminal', link: '/login' },
    ],
    support: [
      { name: 'Help Center', link: '/support' },
      { name: 'Track Order', link: '/orders' },
      { name: 'Return Policy', link: '/policy' },
      { name: 'Contact Us', link: '/contact' },
    ]
  };

  return (
    <footer className="relative bg-stone-900 text-white pt-24 pb-12 overflow-hidden rounded-t-[3rem] md:rounded-t-[5rem]">
      
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Brand & Back to Top */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-10">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <img src={assets.logo} className="w-32 brightness-0 invert opacity-90 mb-6" alt="Nexus Logo" />
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.9]">
                Architecting the <br/> <span className="text-stone-500">Modern Marketplace.</span>
              </h2>
            </motion.div>
            <p className="text-stone-400 text-sm font-medium leading-relaxed max-w-sm">
              Nexus is more than a store. It is a curated ecosystem of independent vendors and conscious consumers. 
              Quality verified, ethically sourced, and globally delivered.
            </p>
          </div>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="group flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-full border border-stone-700 flex items-center justify-center group-hover:bg-white group-hover:text-stone-900 transition-all duration-500">
              <ArrowUp className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 group-hover:text-white transition-colors">Top</span>
          </motion.button>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 mb-24">
          
          {/* Navigation */}
          <FooterColumn title="Nexus Index" links={footerMapping.navigation} />
          
          {/* Partners */}
          <FooterColumn title="Merchant Hub" links={footerMapping.partners} />
          
          {/* Support */}
          <FooterColumn title="Customer Care" links={footerMapping.support} />

          {/* Location / Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-8">Global Office</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="p-3 rounded-xl bg-stone-800 text-stone-400 group-hover:text-terracotta-500 transition-colors">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight">72 Fashion Avenue</p>
                  <p className="text-xs text-stone-500 font-medium">NY, United States</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="p-3 rounded-xl bg-stone-800 text-stone-400 group-hover:text-terracotta-500 transition-colors">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight">Worldwide Shipping</p>
                  <p className="text-xs text-stone-500 font-medium">Available in 40+ countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Socials & Legal */}
        <div className="pt-12 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <SocialCircle Icon={Instagram} />
            <SocialCircle Icon={Twitter} />
            <SocialCircle Icon={Linkedin} />
            <SocialCircle Icon={Mail} />
          </div>

          {/* Copyright & Policy */}
          <div className="flex flex-col md:items-end text-center md:text-right">
            <div className="flex gap-6 mb-2">
              <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors">Terms</Link>
              <Link to="/cookies" className="text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors">Cookies</Link>
            </div>
            <p className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} NEXUS CORE TERMINAL. ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <div className="px-3 py-1 border border-stone-700 rounded text-[9px] font-black">VISA</div>
             <div className="px-3 py-1 border border-stone-700 rounded text-[9px] font-black">STRIPE</div>
             <div className="px-3 py-1 border border-stone-700 rounded text-[9px] font-black">APPLE PAY</div>
          </div>
        </div>

      </div>
    </footer>
  );
};

// --- Sub-Components ---

const FooterColumn = ({ title, links }) => (
  <div className="space-y-8">
    <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em]">{title}</h4>
    <ul className="flex flex-col gap-4">
      {links.map((item, idx) => (
        <li key={idx}>
          <Link 
            to={item.link} 
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-stone-300 hover:text-white transition-colors"
          >
            <span className="relative overflow-hidden pb-1">
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-terracotta-500 translate-x-[-105%] group-hover:translate-x-0 transition-transform duration-500" />
            </span>
            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const SocialCircle = ({ Icon }) => (
  <motion.a 
    href="#"
    whileHover={{ y: -5, backgroundColor: '#C45C3E', borderColor: '#C45C3E' }}
    className="w-12 h-12 rounded-full border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white transition-all duration-300"
  >
    <Icon size={18} />
  </motion.a>
);

export default Footer;