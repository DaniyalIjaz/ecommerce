import React, { useEffect, useState, useMemo, useContext, forwardRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Zap, ShieldCheck, Truck, RotateCcw, 
  ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart, Check, Plus,
  Sparkles, Command, Fingerprint, Layers, Search, SlidersHorizontal, MousePointer2,
  ArrowUpRight, Play, LayoutGrid, Grid2X2, Grid3X3, ChevronDown, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Updated to sonner

import { ShopContext } from '../context/ShopContext';
import { listAllHomeBanners } from '../services/supabase/home';
import { getSiteSetting } from '../services/supabase/site';
import { fetchCategoryTree } from '../services/supabase/categories';

const Home = () => {
  const navigate = useNavigate();
  const { products, addToCart, wishlist, toggleWishlist, loading: contextLoading } = useContext(ShopContext);

  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [announcement, setAnnouncement] = useState({ enabled: false, text: '', link: '' });
  const [loading, setLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [gridCols, setGridCols] = useState(6);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [hoveredTrack, setHoveredTrack] = useState(null); 

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [b, a, c] = await Promise.all([
          listAllHomeBanners(),
          getSiteSetting('navbar_banner'),
          fetchCategoryTree()
        ]);
        setBanners(b || []);
        setAnnouncement(a || { enabled: false });
        setCategories(c || []);
      } catch (e) {
        console.error("Nexus Sync Error", e);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (categoryFilters.length > 0) result = result.filter(p => categoryFilters.includes(p.category_id));
    
    switch (sortType) {
      case 'low-high': result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price)); break;
      case 'high-low': result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price)); break;
      case 'newest': result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
      default: break;
    }
    return result;
  }, [products, categoryFilters, sortType]);

  const toggleCategory = (id) => {
    setCategoryFilters(prev => prev.includes(id) ? prev.filter(i => i !== id) : [id]);
  };

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => setCurrentSlide(prev => (prev === banners.length - 1 ? 0 : prev + 1)), 8000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (loading || contextLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fbfbf9]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-12 h-12 border-t-2 border-stone-900 rounded-full mb-6" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">Booting Nexus Ecosystem</p>
    </div>
  );

  return (
    <div className="bg-[#fbfbf9] min-h-screen font-sans selection:bg-stone-900 selection:text-white overflow-x-hidden pb-20">
      
      <AnimatePresence>
        {announcement?.enabled && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="bg-stone-900 text-white py-3 overflow-hidden border-b border-white/5 relative z-[10]">
            <motion.div animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="flex gap-20 items-center whitespace-nowrap">
              {[...Array(15)].map((_, i) => (
                <Link key={i} to={announcement.link || '#'} className="text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-4">
                   {announcement.text} 
                </Link>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative h-[85vh] md:h-[95vh] w-full overflow-hidden bg-stone-950">
        <AnimatePresence mode="wait">
          {banners.length > 0 && (
            <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0">
              <motion.div style={{ scale: heroScale }} className="absolute inset-0">
                <img src={banners[currentSlide].image_url} className="w-full h-full object-cover brightness-[0.7]" alt="" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
              </motion.div>
              <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center px-6 md:px-12 z-20 text-white">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <span className="inline-block px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl text-[9px] font-black uppercase tracking-[0.5em] mb-8">{banners[currentSlide].badge || 'Curated Release'}</span>
                  <h1 className="text-6xl md:text-[10rem] font-black leading-[0.8] uppercase italic tracking-tighter mb-6">{banners[currentSlide].title} <br/> <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white' }}>{banners[currentSlide].highlight}</span></h1>
                  <p className="text-sm md:text-xl text-stone-300 max-w-lg mb-12">{banners[currentSlide].subtitle}</p>
                  <Link to="/collection" className="bg-white text-stone-900 px-14 py-7 rounded-3xl text-[10px] font-black uppercase inline-flex items-center gap-5 hover:bg-stone-200 transition-all shadow-2xl">{banners[currentSlide].cta_label} <ArrowRight size={18} /></Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section className=" overflow-hidden py-40 bg-white relative z-40 rounded-t-[5rem] -mt-16 border-b border-stone-50">
        <div className="max-w-[1900px] mx-auto px-6 mb-24 text-center">
           <span className="text-[16px] font-black text-terracotta-500 uppercase tracking-[0.6em] block mb-4 italic">Live Inventory Node Stream</span>
           <h2 className="text-7xl md:text-[9rem] font-black italic tracking-tighter uppercase text-stone-900 leading-none">The <span className="text-stone-200">Wardrobe.</span></h2>
           <div className="flex items-center justify-center gap-2 mt-6 text-stone-300 font-black text-[14px] uppercase tracking-widest">Grab the best</div>
        </div>

        <div className="relative group" onMouseEnter={() => setHoveredTrack(1)} onMouseLeave={() => setHoveredTrack(null)}>
          <motion.div 
            animate={{ x: hoveredTrack === 1 ? undefined : [0, -2500] }} 
            transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
            className="flex gap-6 whitespace-nowrap px-6"
          >
            {[...products, ...products, ...products].slice(0, 15).map((item, idx) => (
              <InfinityCard 
                key={idx} item={item} 
                onCart={() => { addToCart(item.id, 'Standard'); toast.success('Product Added Successfully'); }}
                onWish={() => toggleWishlist(item.id)}
                isWished={wishlist.includes(item.id)}
                onNav={() => navigate(`/product/${item.id}`)}
              />
            ))}
          </motion.div>
        </div>
        <div className="mt-20 text-center">
          <Link 
            to="/collection" 
            className="inline-flex items-center gap-6 px-16 py-7 bg-stone-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 hover:bg-stone-800 transition-all shadow-3xl group"
          >
            Explore All Products
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Identity & Bento Sections */}
      <section className="py-40 px-6 bg-stone-900 text-white overflow-hidden rounded-[5rem] mx-2 md:mx-6 shadow-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-24 items-center">
           <div className="flex-1 space-y-12">
              <span className="text-stone-500 font-black uppercase tracking-[0.4em] text-[10px]">Reference Identity 0.1</span>
              <h2 className="text-5xl md:text-[8rem] font-black italic tracking-tighter uppercase leading-[0.8] text-stone-700">The <br/> New <br/> Standard.</h2>
              <p className="text-stone-400 text-xl font-medium leading-relaxed max-w-sm">"Objects of desire, curated for the modern minimalist."</p>
              <button className="flex items-center gap-4 group">
                 <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-stone-900 transition-all duration-500"><Play size={18} fill="currentColor" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Process Archive</span>
              </button>
           </div>
           <div className="flex-1 relative">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 group shadow-3xl relative">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[2s]" alt="" />
              </div>
           </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[650px]">
            <div className="md:col-span-2 md:row-span-2 bg-stone-100 rounded-[4rem] overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-110 brightness-90 group-hover:brightness-100 group-hover:grayscale-0" alt="" />
                <div className="absolute bottom-12 left-12"><h3 className="text-white text-5xl font-black italic uppercase tracking-tighter">Verified <br/> <span className="text-stone-400">Demand.</span></h3></div>
            </div>
            <div className="md:col-span-2 bg-stone-900 rounded-[4rem] p-16 flex flex-col justify-center text-white relative overflow-hidden group">
               <Fingerprint size={120} className="absolute right-[-20px] top-[-20px] text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
               <p className="text-stone-500 font-black uppercase tracking-[0.5em] text-[10px] mb-4 italic">Curation Protocol</p>
               <h3 className="text-3xl font-black italic uppercase tracking-tighter">Every reference in <br/> Nexus is vetted.</h3>
            </div>
            <div className="bg-emerald-50 rounded-[4rem] p-10 flex flex-col justify-between group cursor-pointer hover:bg-emerald-900 hover:text-white transition-all shadow-sm">
               <ShieldCheck size={32} className="text-emerald-200 group-hover:text-white transition-colors" />
               <h4 className="text-[12px] font-black uppercase tracking-widest italic">Encrypted Settlements</h4>
            </div>
            <div className="bg-stone-100 rounded-[4rem] p-10 flex flex-col justify-between group cursor-pointer hover:bg-stone-900 hover:text-white transition-all shadow-sm">
               <Plus size={32} className="text-stone-400 group-hover:text-white transition-colors" />
               <h4 className="text-[12px] font-black uppercase tracking-widest italic">Multi-Node Logistics</h4>
            </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center py-20 border-t border-stone-100">
           <BadgeItem icon={Truck} title="Express Transit" desc="Global delivery in 48h" />
           <BadgeItem icon={ShieldCheck} title="Verified Pay" desc="Secure SSL settlements" />
           <BadgeItem icon={RotateCcw} title="Void Policy" desc="7-day easy exchange" />
           <BadgeItem icon={Zap} title="Support Hub" desc="Immediate concierge help" />
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const InfinityCard = forwardRef(({ item, onNav, onCart, onWish, isWished }, ref) => {
  const [isAdded, setIsAdded] = useState(false);
  const discount = item.discount_price && item.price ? Math.round(((item.price - item.discount_price) / item.price) * 100) : 0;

  const handleCart = (e) => {
    e.stopPropagation();
    onCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div ref={ref} className="min-w-[320px] md:min-w-[380px] bg-white border border-stone-100 rounded-[3rem] p-4 group cursor-pointer hover:shadow-2xl transition-all duration-700" onClick={onNav}>
      <div className="relative aspect-square rounded-[2.5rem] bg-stone-50 overflow-hidden mb-6">
        <img src={item.images?.[0]} className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" alt="" />
        {discount > 0 && <div className="absolute top-5 left-5 bg-red-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl z-20">-{discount}%</div>}
        <button onClick={(e) => { e.stopPropagation(); onWish(); }} className={`absolute top-5 right-5 p-3.5 rounded-2xl backdrop-blur-xl transition-all z-20 ${isWished ? 'bg-stone-900 text-white shadow-stone-900/40' : 'bg-white/80 text-stone-900 hover:bg-stone-900 hover:text-white'}`}>
          <Heart size={16} className={isWished ? 'fill-current' : ''} />
        </button>
        <div className="absolute bottom-5 inset-x-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
           <button onClick={handleCart} className={`w-full py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all ${isAdded ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white'}`}>
              {isAdded ? <Check size={18}/> : <ShoppingBag size={18}/>}
              {isAdded ? 'Product Added' : 'Add to cart'}
           </button>
        </div>
      </div>
      <div className="px-3 flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h3 className="text-[13px] font-black text-stone-900 uppercase italic truncate max-w-[180px]">{item.name}</h3>
          <div className="flex items-center gap-2">
            {discount > 0 ? (
               <>
                 <span className="text-[28px] font-black text-stone-900 italic tracking-tighter">Rs.{item.discount_price.toLocaleString()}</span>
                 <span className="text-[18px] font-bold text-stone-400 line-through tracking-tight">Rs.{item.price.toLocaleString()}</span>
               </>
            ) : (
              <span className="text-[28px] font-black text-stone-900 italic tracking-tighter">Rs.{item.price.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const BadgeItem = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center group cursor-default">
    <div className="w-20 h-20 bg-stone-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-all duration-700">
      <Icon size={28} strokeWidth={1.2} />
    </div>
    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-900 mb-2 italic">{title}</h4>
    <p className="text-xs text-stone-400 font-medium">{desc}</p>
  </div>
);

export default Home;