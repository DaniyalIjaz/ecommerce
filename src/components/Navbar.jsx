// import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
// import { assets } from '../assets/frontend_assets/assets';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { ShopContext } from '../context/ShopContext';
// import { supabase } from '../lib/supabase';
// import { motion, AnimatePresence, useScroll } from 'framer-motion';
// import NavbarBanner from './NavbarBanner';
// import { 
//   Heart, ShoppingBag, LayoutDashboard, Store, 
//   ChevronDown, Search, Menu, X, 
//   Command, Fingerprint, ArrowRight,
//   ShieldCheck, Activity, LogOut, Settings, Hash, TrendingUp
// } from 'lucide-react';
// import { toast } from 'sonner';

// const Navbar = () => {
//   const [visible, setVisible] = useState(false);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showCategoryMenu, setShowCategoryMenu] = useState(false);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [isScrolled, setIsScrolled] = useState(false);
  
//   const searchInputRef = useRef(null);
//   const {
//     search,
//     setSearch,
//     setShowSearch,
//     getCartCount,
//     getWishlistCount,
//     user,
//     profile,
//     role,
//     setAuthModalOpen,
//   } = useContext(ShopContext);
  
//   const navigate = useNavigate();
//   const { scrollY } = useScroll();

//   // Fetch Categories
//   useEffect(() => {
//     const getCategories = async () => {
//       const { data, error } = await supabase
//         .from('categories')
//         .select('*')
//         .eq('is_active', true)
//         .order('sort_order', { ascending: true });
//       if (!error && data) setCategories(data.filter(cat => !cat.parent_id));
//     };
//     getCategories();
//   }, []);

//   // Handle Scroll effect
//   useEffect(() => {
//     const unsub = scrollY.on("change", (latest) => setIsScrolled(latest > 60));
//     return () => unsub();
//   }, [scrollY]);

//   // Command + K Shortcut
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
//         e.preventDefault();
//         setIsSearchOpen(true);
//       }
//       if (e.key === 'Escape') setIsSearchOpen(false);
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   // Focus search input when overlay opens
//   useEffect(() => {
//     if (isSearchOpen && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isSearchOpen]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     toast.success('SESSION TERMINATED', {
//       style: { background: '#000', color: '#fff', border: '1px solid #333' }
//     });
//     setShowUserMenu(false);
//     navigate('/');
//   };

//   const handleSearchSubmit = (e) => {
//     e?.preventDefault();
//     if (search.trim()) {
//       setShowSearch(true);
//       setIsSearchOpen(false);
//       navigate('/collection');
//     }
//   };

//   const navLinkClass = ({ isActive }) =>
//     `relative text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 transition-all duration-300 flex items-center gap-2 ${
//       isActive ? 'text-stone-950' : 'text-stone-400 hover:text-stone-950'
//     }`;

//   return (
//     <header className="sticky top-0 z-[100] transition-all duration-500">
//       <NavbarBanner />
      
//       <nav className={`px-4 md:px-10 transition-all duration-700 ${
//         isScrolled 
//         ? 'bg-white/80 backdrop-blur-2xl py-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-b border-black/10' 
//         : 'bg-[#fbfbf9] py-6 border-b border-transparent'
//       }`}>
//         <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-8">
          
//           {/* BRAND IDENTITY */}
//           <Link to="/" className="relative group flex-shrink-0 flex items-center gap-3">
//             <div className="relative">
//                 <img src={assets.logo} alt="Logo" className="w-28 md:w-36 transition-all duration-500 group-hover:scale-105" />
//                 <motion.div 
//                     animate={{ opacity: [0.4, 1, 0.4] }} 
//                     transition={{ repeat: Infinity, duration: 2 }}
//                     className="absolute -right-2 -top-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
//                 />
//             </div>
//           </Link>

//           {/* CENTRAL TERMINAL NAVIGATION */}
//           <div className="hidden lg:flex items-center bg-stone-200/30 p-1.5 rounded-full border border-black/5 shadow-inner">
//             <NavLink to="/" className={navLinkClass}>
//                 {({isActive}) => (
//                     <>
//                         {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-black/5" />}
//                         Home
//                     </>
//                 )}
//             </NavLink>
//             <NavLink to="/collection" className={navLinkClass}>
//                 {({isActive}) => (
//                     <>
//                         {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-black/5" />}
//                         Vault
//                     </>
//                 )}
//             </NavLink>

//             {/* DYNAMIC CATEGORY MEGA-MENU */}
//             <div 
//               className="relative"
//               onMouseEnter={() => setShowCategoryMenu(true)}
//               onMouseLeave={() => setShowCategoryMenu(false)}
//             >
//               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 text-stone-400 hover:text-stone-950 transition-all group">
//                 Index <ChevronDown size={10} className={`${showCategoryMenu ? 'rotate-180' : ''} transition-transform duration-300`} />
//               </button>
              
//               <AnimatePresence>
//                 {showCategoryMenu && (
//                   <motion.div 
//                     initial={{ opacity: 0, y: 15, scale: 0.98 }} 
//                     animate={{ opacity: 1, y: 0, scale: 1 }} 
//                     exit={{ opacity: 0, y: 15, scale: 0.98 }}
//                     className="absolute left-0 mt-4 w-[520px] z-[110]"
//                   >
//                     <div className="bg-white border border-black/10 rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-6 backdrop-blur-2xl overflow-hidden relative">
//                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-900 to-transparent opacity-10" />
                      
//                       <div className="grid grid-cols-2 gap-3 relative z-10">
//                         <div className="col-span-2 mb-4 px-2 flex justify-between items-center">
//                            <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
//                              <Fingerprint size={14} className="text-stone-900"/> System Directory
//                            </p>
//                            <div className="h-[1px] flex-1 mx-4 bg-stone-100" />
//                         </div>
//                         {categories.map((cat) => (
//                           <Link 
//                             key={cat.id} 
//                             to={`/collection?category=${cat.slug}`} 
//                             className="group/item flex items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-stone-950 text-stone-950 hover:text-white transition-all duration-300 border border-black/5 hover:border-black shadow-sm"
//                           >
//                             <span className="text-[11px] font-bold uppercase tracking-tighter">{cat.name}</span>
//                             <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <NavLink to="/support" className={navLinkClass}>
//                 {({isActive}) => (
//                     <>
//                         {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-black/5" />}
//                         Support
//                     </>
//                 )}
//             </NavLink>
//           </div>

//           {/* ACTION CLUSTER */}
//           <div className="flex items-center gap-5 flex-1 justify-end">
            
//             {/* NEW PROFESSIONAL SEARCH TRIGGER */}
//             <motion.button 
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => setIsSearchOpen(true)}
//               className="hidden md:flex items-center gap-4 bg-stone-100/50 border border-black/[0.06] hover:border-stone-900/20 hover:bg-stone-100 px-4 py-2.5 rounded-xl transition-all min-w-[200px]"
//             >
//               <Search size={16} className="text-stone-400" />
//               <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex-1 text-left">Search Vault...</span>
//               <div className="flex items-center gap-1 bg-white border border-black/10 px-1.5 py-0.5 rounded text-[9px] font-black text-stone-400 shadow-sm">
//                 <Command size={10} /> K
//               </div>
//             </motion.button>

//             {/* ICON TOOLS */}
//             <div className="flex items-center gap-3">
//               <NavToolIcon 
//                 icon={Heart} 
//                 count={getWishlistCount()} 
//                 onClick={() => user ? navigate('/wishlist') : setAuthModalOpen(true)} 
//               />
//               <NavToolIcon 
//                 icon={ShoppingBag} 
//                 count={getCartCount()} 
//                 onClick={() => navigate('/cart')} 
//               />
//             </div>

//             {/* USER TERMINAL */}
//             <div className="relative" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
//               {user ? (
//                 <div className="relative">
//                   <motion.div 
//                       whileHover={{ scale: 1.02 }}
//                       className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-xl bg-stone-950 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-white/10"
//                   >
//                     <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 ring-2 ring-emerald-500/20">
//                       {user.user_metadata?.avatar_url ? (
//                         <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="" />
//                       ) : (
//                         <div className="w-full h-full bg-stone-800 flex items-center justify-center text-[10px] font-black text-emerald-400">
//                           {user.email.charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                     </div>
//                     <div className="hidden sm:block text-left">
//                         <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500 leading-none mb-1">Active</p>
//                         <p className="text-[9px] font-bold uppercase tracking-widest">{profile?.role || 'User'}</p>
//                     </div>
//                   </motion.div>

//                   <AnimatePresence>
//                     {showUserMenu && (
//                       <motion.div 
//                         initial={{ opacity: 0, y: 12, scale: 0.95 }} 
//                         animate={{ opacity: 1, y: 0, scale: 1 }} 
//                         exit={{ opacity: 0, y: 12, scale: 0.95 }}
//                         className="absolute right-0 top-full pt-4 z-[120]"
//                       >
//                         <div className="bg-white border border-black/10 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] min-w-[280px] p-2 overflow-hidden">
//                           <div className="px-6 py-6 border-b border-stone-100 bg-stone-50 rounded-t-[1.2rem] mb-2">
//                             <div className="flex items-center gap-3 mb-3">
//                               <ShieldCheck size={16} className="text-emerald-600" />
//                               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-400">Identity Verified</span>
//                             </div>
//                             <h4 className="text-xs font-black uppercase truncate tracking-widest text-stone-950">
//                               {profile?.full_name || user.email.split('@')[0]}
//                             </h4>
//                             <p className="text-[9px] text-stone-500 mt-1 lowercase truncate opacity-70">{user.email}</p>
//                           </div>

//                           <div className="space-y-1 p-1">
//                             {role === 'admin' && <UserTermLink icon={LayoutDashboard} label="Admin Control" to="/admin/dashboard" />}
//                             {(role === 'vendor' || role === 'admin') && <UserTermLink icon={Store} label="Merchant Node" to="/vendor/dashboard" />}
//                             <UserTermLink icon={Fingerprint} label="Order History" to="/orders" />
//                             <UserTermLink icon={Settings} label="Access Settings" to="/profile" />
                            
//                             <button 
//                               onClick={handleLogout}
//                               className="w-full mt-2 flex items-center gap-4 px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
//                             >
//                               <LogOut size={14} />
//                               Terminate Session
//                             </button>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ) : (
//                 <motion.button 
//                   whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setAuthModalOpen(true)}
//                   className="bg-stone-950 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10"
//                 >
//                   Sync Identity
//                 </motion.button>
//               )}
//             </div>

//             <button onClick={() => setVisible(true)} className="lg:hidden p-3 bg-stone-100 rounded-xl text-stone-950 border border-black/5">
//               <Menu size={20} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* FULL-SCREEN SEARCH OVERLAY (The "Command Palette") */}
//       <AnimatePresence>
//         {isSearchOpen && (
//           <motion.div 
//             initial={{ opacity: 0 }} 
//             animate={{ opacity: 1 }} 
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[300] bg-white/60 backdrop-blur-xl flex items-start justify-center pt-[10vh] px-4"
//             onClick={() => setIsSearchOpen(false)}
//           >
//             <motion.div 
//               initial={{ y: -20, scale: 0.95 }}
//               animate={{ y: 0, scale: 1 }}
//               exit={{ y: -20, scale: 0.95 }}
//               onClick={(e) => e.stopPropagation()}
//               className="w-full max-w-2xl bg-white border border-black/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] rounded-[2.5rem] overflow-hidden"
//             >
//               <form onSubmit={handleSearchSubmit} className="relative flex items-center p-6 border-b border-stone-100">
//                 <Search size={24} className="text-stone-950 ml-4" />
//                 <input 
//                   ref={searchInputRef}
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="WHAT ARE YOU LOOKING FOR?"
//                   className="w-full bg-transparent px-6 py-4 text-xl font-black uppercase tracking-tighter outline-none placeholder:text-stone-300 text-stone-950"
//                 />
//                 <button 
//                   type="button" 
//                   onClick={() => setIsSearchOpen(false)}
//                   className="p-3 hover:bg-stone-100 rounded-full transition-colors text-stone-400"
//                 >
//                   <X size={20} />
//                 </button>
//               </form>
              
//               <div className="p-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   {/* SEARCH SUGGESTIONS */}
//                   <div>
//                     <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
//                       <TrendingUp size={14} /> Popular Queries
//                     </h5>
//                     <div className="space-y-2">
//                       {['New Arrivals', 'Limited Edition', 'Tactical Gear', 'Vault Archives'].map((tag) => (
//                         <button 
//                           key={tag}
//                           onClick={() => { setSearch(tag); handleSearchSubmit(); }}
//                           className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-950 hover:text-white transition-all text-xs font-bold text-stone-600 flex items-center justify-between group"
//                         >
//                           {tag}
//                           <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* QUICK LINKS */}
//                   <div>
//                     <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
//                       <Hash size={14} /> Top Categories
//                     </h5>
//                     <div className="flex flex-wrap gap-2">
//                       {categories.slice(0, 6).map((cat) => (
//                         <Link 
//                           key={cat.id} 
//                           to={`/collection?category=${cat.slug}`}
//                           onClick={() => setIsSearchOpen(false)}
//                           className="px-4 py-2 bg-stone-50 border border-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-stone-950 hover:bg-stone-950 hover:text-white transition-all"
//                         >
//                           {cat.name}
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-stone-50 p-4 border-t border-stone-100 flex justify-center items-center gap-6">
//                  <div className="flex items-center gap-2 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
//                     <span className="bg-white border border-black/10 px-1.5 py-0.5 rounded shadow-sm">ESC</span> to close
//                  </div>
//                  <div className="flex items-center gap-2 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
//                     <span className="bg-white border border-black/10 px-1.5 py-0.5 rounded shadow-sm">ENTER</span> to search
//                  </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* MOBILE INTERFACE */}
//       <AnimatePresence>
//         {visible && (
//           <motion.div 
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="fixed inset-0 z-[200] bg-stone-950/40 backdrop-blur-md lg:hidden"
//             onClick={() => setVisible(false)}
//           >
//             <motion.div 
//               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
//               transition={{ type: "spring", damping: 30, stiffness: 300 }}
//               className="absolute right-0 h-full w-[85%] bg-[#fbfbf9] shadow-2xl p-8 flex flex-col border-l border-black/5"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-12">
//                  <img src={assets.logo} alt="" className="w-28" />
//                  <button onClick={() => setVisible(false)} className="p-3 bg-white shadow-md border border-black/5 rounded-full"><X size={20}/></button>
//               </div>
//               <div className="flex flex-col gap-2">
//                  <MobileTermLink to="/" label="Home" onClick={() => setVisible(false)} />
//                  <MobileTermLink to="/collection" label="The Vault" onClick={() => setVisible(false)} />
//                  <MobileTermLink to="/about" label="Legacy" onClick={() => setVisible(false)} />
//                  <MobileTermLink to="/support" label="Terminal Support" onClick={() => setVisible(false)} />
//               </div>
              
//               <div className="mt-auto p-8 bg-stone-950 rounded-[2.5rem] text-white overflow-hidden relative group">
//                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                     <Activity size={80} />
//                  </div>
//                  <Fingerprint size={32} className="mb-4 text-emerald-500" />
//                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">System Version</p>
//                  <p className="text-lg font-black italic tracking-tighter">v1.0.9-STABLE</p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// };

// // --- SUB-COMPONENTS ---

// const NavToolIcon = ({ icon: Icon, count, onClick }) => (
//   <motion.button 
//     whileHover={{ y: -2, scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//     onClick={onClick} 
//     className="relative p-3.5 rounded-xl bg-white border border-black/[0.08] text-stone-400 hover:text-stone-950 hover:shadow-md transition-all group"
//   >
//     <Icon size={18} strokeWidth={2.2} className="group-hover:rotate-3 transition-transform" />
//     {count > 0 && (
//       <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-stone-950 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
//         {count}
//       </span>
//     )}
//   </motion.button>
// );

// const UserTermLink = ({ icon: Icon, label, to }) => (
//   <Link to={to} className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-950 hover:bg-stone-50 transition-all group">
//     <Icon size={14} className="group-hover:text-stone-950 transition-colors" />
//     {label}
//   </Link>
// );

// const MobileTermLink = ({ to, label, onClick }) => (
//   <NavLink to={to} onClick={onClick} className="group flex items-center justify-between py-5 border-b border-black/[0.05]">
//     <span className="text-3xl font-black italic uppercase tracking-tighter text-stone-300 group-hover:text-stone-950 transition-all">{label}</span>
//     <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-emerald-500" />
//   </NavLink>
// );

// export default Navbar;






import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import NavbarBanner from './NavbarBanner';
import { User } from "lucide-react";
import {
  Heart, ShoppingBag, LayoutDashboard, Store,
  ChevronDown, Search, Menu, X,
  Command, Fingerprint, ArrowRight,
  ShieldCheck, Activity, LogOut, Settings, Hash, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchInputRef = useRef(null);
  const {
    search,
    setSearch,
    setShowSearch,
    getCartCount,
    getWishlistCount,
    user,
    profile,
    role,
    setAuthModalOpen,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const { scrollY } = useScroll();

  // Fetch Categories
  useEffect(() => {
    const getCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (!error && data) setCategories(data.filter(cat => !cat.parent_id));
    };
    getCategories();
  }, []);

  // Handle Scroll effect
  useEffect(() => {
    const unsub = scrollY.on("change", (latest) => setIsScrolled(latest > 60));
    return () => unsub();
  }, [scrollY]);

  // Command + K Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('SESSION TERMINATED', {
      style: { background: '#000', color: '#fff', border: '1px solid #333' }
    });
    setShowUserMenu(false);
    navigate('/');
  };

  // Sync with Collection Search
  const triggerGlobalSearch = () => {
    setShowSearch(true);
    navigate('/collection');
    setIsSearchOpen(false);
    setVisible(false);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (search.trim()) {
      triggerGlobalSearch();
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 transition-all duration-300 flex items-center gap-2 ${isActive ? 'text-stone-950' : 'text-stone-400 hover:text-stone-950'}`;

  return (
    <header className="sticky top-0 z-[100] transition-all duration-500">
      <NavbarBanner />

      <nav className={`px-4 md:px-10 transition-all duration-700 ${
        isScrolled 
        ? 'bg-white/80 backdrop-blur-2xl py-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-b border-black/10' 
        : 'bg-[#fbfbf9] py-6 border-b border-transparent'
      }`}>
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-8">

          {/* BRAND IDENTITY */}
          <Link to="/" className="relative group flex-shrink-0 flex items-center gap-3">
            <div className="relative">
              <img src={assets.logo} alt="Logo" className="w-28 md:w-36 transition-all duration-500 group-hover:scale-105" />
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -right-2 -top-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
              />
            </div>
          </Link>

          {/* CENTRAL TERMINAL NAVIGATION */}
          <div className="hidden lg:flex items-center bg-stone-200/30 p-1.5 rounded-full border border-black/5 shadow-inner">
            <NavLink to="/" className={navLinkClass}>
              {({isActive}) => (
                <>
                  {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-black/5" />}
                  Home
                </>
              )}
            </NavLink>
            <NavLink to="/collection" className={navLinkClass}>
              {({isActive}) => (
                <>
                  {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-black/5" />}
                  Products
                </>
              )}
            </NavLink>

            {/* DYNAMIC CATEGORY MEGA-MENU */}
            <div 
              className="relative"
              onMouseEnter={() => setShowCategoryMenu(true)}
              onMouseLeave={() => setShowCategoryMenu(false)}
            >
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2.5 text-stone-400 hover:text-stone-950 transition-all group">
                Categories <ChevronDown size={10} className={`${showCategoryMenu ? 'rotate-180' : ''} transition-transform duration-300`} />
              </button>
              
              <AnimatePresence>
                {showCategoryMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.98 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    className="absolute left-0 mt-4 w-[520px] z-[110]"
                  >
                    <div className="bg-white border border-black/10 rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] p-6 backdrop-blur-2xl overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-stone-900 to-transparent opacity-10" />
                      
                      <div className="grid grid-cols-2 gap-3 relative z-10">
                        <div className="col-span-2 mb-4 px-2 flex justify-between items-center">
                           <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                             <Fingerprint size={14} className="text-stone-900"/> System Directory
                           </p>
                           <div className="h-[1px] flex-1 mx-4 bg-stone-100" />
                        </div>
                        {categories.map((cat) => (
                          <Link 
                            key={cat.id} 
                            to={`/collection?category=${cat.slug}`} 
                            className="group/item flex items-center justify-between p-4 rounded-2xl bg-stone-50 hover:bg-stone-950 text-stone-950 hover:text-white transition-all duration-300 border border-black/5 hover:border-black shadow-sm"
                          >
                            <span className="text-[11px] font-bold uppercase tracking-tighter">{cat.name}</span>
                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/support" className={navLinkClass}>
              {({isActive}) => (
                <>
                  {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white shadow-sm rounded-full -z-10 border border-black/5" />}
                  Help & Support
                </>
              )}
            </NavLink>
          </div>

          {/* ACTION CLUSTER */}
          <div className="flex items-center gap-5 flex-1 justify-end">
            
            {/* SEARCH TRIGGER (CMD+K) */}
            {/* <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSearchOpen(true)}
              className="hidden xl:flex items-center gap-4 bg-stone-100/50 border border-black/[0.06] hover:border-stone-900/20 hover:bg-stone-100 px-4 py-2.5 rounded-xl transition-all min-w-[200px]"
            >
              <Search size={16} className="text-stone-400" />
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex-1 text-left">Search Vault...</span>
              <div className="flex items-center gap-1 bg-white border border-black/10 px-1.5 py-0.5 rounded text-[9px] font-black text-stone-400 shadow-sm">
                <Command size={10} /> K
              </div>
            </motion.button> */}

            {/* ICON TOOLS */}
            <div className="flex items-center gap-3">
              {/* SYNCED SEARCH ICON - Works like the Collection search icon */}
              <NavToolIcon 
                icon={Search} 
                onClick={triggerGlobalSearch} 
                className="hidden md:flex" // Always visible on mobile/desktop
              />
              <NavToolIcon 
                icon={Heart} 
                count={getWishlistCount()} 
                onClick={() => user ? navigate('/wishlist') : setAuthModalOpen(true)} 
              />
              <NavToolIcon 
                icon={ShoppingBag} 
                count={getCartCount()} 
                onClick={() => navigate('/cart')} 
              />
            </div>

            {/* USER TERMINAL */}
            <div className="relative" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
              {user ? (
                <div className="relative">
                  <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-xl bg-stone-950 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 ring-2 ring-emerald-500/20">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full bg-stone-800 flex items-center justify-center text-[10px] font-black text-emerald-400">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500 leading-none mb-1">Active</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest">{profile?.role || 'User'}</p>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 12, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        className="absolute right-0 top-full pt-4 z-[120]"
                      >
                        <div className="bg-white border border-black/10 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] min-w-[280px] p-2 overflow-hidden">
                          <div className="px-6 py-6 border-b border-stone-100 bg-stone-50 rounded-t-[1.2rem] mb-2">
                            <div className="flex items-center gap-3 mb-3">
                              <ShieldCheck size={16} className="text-emerald-600" />
                              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-stone-400">Identity Verified</span>
                            </div>
                            <h4 className="text-xs font-black uppercase truncate tracking-widest text-stone-950">
                              {profile?.full_name || user.email.split('@')[0]}
                            </h4>
                            <p className="text-[9px] text-stone-500 mt-1 lowercase truncate opacity-70">{user.email}</p>
                          </div>

                          <div className="space-y-1 p-1">
                            {role === 'admin' && <UserTermLink icon={LayoutDashboard} label="Admin Control" to="/admin/dashboard" />}
                            {(role === 'vendor' || role === 'admin') && <UserTermLink icon={Store} label="Vendor dashboard" to="/vendor/dashboard" />}
                            <UserTermLink icon={Fingerprint} label="Order History" to="/orders" />
                            <UserTermLink icon={Settings} label="Access Settings" to="/profile" />
                            
                            <button 
                              onClick={handleLogout}
                              className="w-full mt-2 flex items-center gap-4 px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                            >
                              <LogOut size={14} />
                             Logout
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-stone-950 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10"
                >
                  <User size={20} />
                </motion.button>
              )}
            </div>

            <button onClick={() => setVisible(true)} className="lg:hidden p-3 bg-stone-100 rounded-xl text-stone-950 border border-black/5">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* FULL-SCREEN SEARCH OVERLAY (The "Command Palette") */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-white/60 backdrop-blur-xl flex items-start justify-center pt-[10vh] px-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white border border-black/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] rounded-[2.5rem] overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center p-6 border-b border-stone-100">
                <Search size={24} className="text-stone-950 ml-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="WHAT ARE YOU LOOKING FOR?"
                  className="w-full bg-transparent px-6 py-4 text-xl font-black uppercase tracking-tighter outline-none placeholder:text-stone-300 text-stone-950"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 hover:bg-stone-100 rounded-full transition-colors text-stone-400"
                >
                  <X size={20} />
                </button>
              </form>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* SEARCH SUGGESTIONS */}
                  <div>
                    <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <TrendingUp size={14} /> Popular Queries
                    </h5>
                    <div className="space-y-2">
                      {['New Arrivals', 'Limited Edition', 'Tactical Gear', 'Vault Archives'].map((tag) => (
                        <button 
                          key={tag}
                          onClick={() => { setSearch(tag); triggerGlobalSearch(); }}
                          className="w-full text-left px-4 py-3 rounded-xl hover:bg-stone-950 hover:text-white transition-all text-xs font-bold text-stone-600 flex items-center justify-between group"
                        >
                          {tag}
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QUICK LINKS */}
                  <div>
                    <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <Hash size={14} /> Top Categories
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 6).map((cat) => (
                        <Link 
                          key={cat.id} 
                          to={`/collection?category=${cat.slug}`}
                          onClick={() => {setIsSearchOpen(false); setShowSearch(true);}}
                          className="px-4 py-2 bg-stone-50 border border-black/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-stone-950 hover:bg-stone-950 hover:text-white transition-all"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 p-4 border-t border-stone-100 flex justify-center items-center gap-6">
                 <div className="flex items-center gap-2 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    <span className="bg-white border border-black/10 px-1.5 py-0.5 rounded shadow-sm">ESC</span> to close
                 </div>
                 <div className="flex items-center gap-2 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    <span className="bg-white border border-black/10 px-1.5 py-0.5 rounded shadow-sm">ENTER</span> to search
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE INTERFACE */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-stone-950/40 backdrop-blur-md lg:hidden"
            onClick={() => setVisible(false)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute right-0 h-full w-[85%] bg-[#fbfbf9] shadow-2xl p-8 flex flex-col border-l border-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <img src={assets.logo} alt="" className="w-28" />
                <button onClick={() => setVisible(false)} className="p-3 bg-white shadow-md border border-black/5 rounded-full"><X size={20}/></button>
              </div>
              <div className="flex flex-col gap-2">
                <MobileTermLink to="/" label="Home" onClick={() => setVisible(false)} />
                <MobileTermLink to="/collection" label="Products" onClick={() => setVisible(false)} />
                <MobileTermLink to="/about" label="Categories" onClick={() => setVisible(false)} />
                <MobileTermLink to="/support" label="Help & Support" onClick={() => setVisible(false)} />
                <button 
                  onClick={triggerGlobalSearch}
                  className="group flex items-center justify-between py-5 border-b border-black/[0.05] text-left"
                >
                  <span className="text-3xl font-black italic uppercase tracking-tighter text-stone-300 group-hover:text-stone-950 transition-all">Search</span>
                  <Search className="text-emerald-500" />
                </button>
              </div>

              <div className="mt-auto p-8 bg-stone-950 rounded-[2.5rem] text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Activity size={80} />
                </div>
                <Fingerprint size={32} className="mb-4 text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">System Version</p>
                <p className="text-lg font-black italic tracking-tighter">v1.0.9-STABLE</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// --- SUB-COMPONENTS ---

const NavToolIcon = ({ icon: Icon, count, onClick, className = "" }) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative p-3.5 rounded-xl bg-white border border-black/[0.08] text-stone-400 hover:text-stone-950 hover:shadow-md transition-all group ${className}`}
  >
    <Icon size={18} strokeWidth={2.2} className="group-hover:rotate-3 transition-transform" />
    {count > 0 && (
      <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-stone-950 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
        {count}
      </span>
    )}
  </motion.button>
);

const UserTermLink = ({ icon: Icon, label, to }) => (
  <Link to={to} className="flex items-center gap-4 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-stone-950 hover:bg-stone-50 transition-all group">
    <Icon size={14} className="group-hover:text-stone-950 transition-colors" />
    {label}
  </Link>
);

const MobileTermLink = ({ to, label, onClick }) => (
  <NavLink to={to} onClick={onClick} className="group flex items-center justify-between py-5 border-b border-black/[0.05]">
    <span className="text-3xl font-black italic uppercase tracking-tighter text-stone-300 group-hover:text-stone-950 transition-all">{label}</span>
    <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-emerald-500" />
  </NavLink>
);

export default Navbar;