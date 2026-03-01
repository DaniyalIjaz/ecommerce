// import React, { useContext, useState, useEffect, useMemo, forwardRef } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   LayoutGrid, ChevronDown, Search, ShoppingBag, Zap, 
//   SlidersHorizontal, Heart, Plus, Check, ArrowRight,
//   Fingerprint, X
// } from 'lucide-react';
// import { fetchCategoryTree } from '../services/supabase/categories';
// import { toast } from 'sonner';

// const Collection = () => {
//   const { 
//     products, search, setSearch, showSearch, setShowSearch, 
//     loading, addToCart, wishlist, toggleWishlist 
//   } = useContext(ShopContext);
  
//   const navigate = useNavigate();
  
//   // UI States
//   const [showFilter, setShowFilter] = useState(false);
//   const [gridCols, setGridCols] = useState(6); 
//   const [categoryTree, setCategoryTree] = useState([]);
//   const [isSortOpen, setIsSortOpen] = useState(false);
  
//   // Filter States
//   const [categoryFilters, setCategoryFilters] = useState([]);
//   const [sortType, setSortType] = useState('relevant');

//   useEffect(() => {
//     fetchCategoryTree().then(setCategoryTree).catch(() => setCategoryTree([]));
//   }, []);

//   // Filter & Sort Logic
//   const filteredProducts = useMemo(() => {
//     let result = [...products];
    
//     if (showSearch && search) {
//       result = result.filter(p => 
//         p.name?.toLowerCase().includes(search.toLowerCase()) ||
//         p.category_name?.toLowerCase().includes(search.toLowerCase())
//       );
//     }
    
//     if (categoryFilters.length > 0) {
//       result = result.filter(p => categoryFilters.includes(p.category_id));
//     }
    
//     switch (sortType) {
//       case 'low-high': 
//         result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price)); 
//         break;
//       case 'high-low': 
//         result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price)); 
//         break;
//       case 'newest': 
//         result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
//         break;
//       default: break;
//     }
//     return result;
//   }, [products, search, showSearch, categoryFilters, sortType]);

//   const toggleCategory = (id) => {
//     setCategoryFilters(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
//   };

//   const getGridClass = () => {
//     switch(gridCols) {
//       case 2: return 'grid-cols-2 gap-8';
//       case 3: return 'grid-cols-2 md:grid-cols-3 gap-6';
//       case 4: return 'grid-cols-3 md:grid-cols-4 gap-4';
//       case 6: return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3';
//       default: return 'grid-cols-1 max-w-2xl mx-auto space-y-8';
//     }
//   };

//   return (
//     <div className="bg-[#fbfbf9] min-h-screen pt-20 pb-20 px-4 md:px-10 selection:bg-stone-900 selection:text-white">
      
//       {/* 1. Centered Black Search Module */}
//       <AnimatePresence>
//         {showSearch && (
//           <div className="fixed inset-x-0 top-36 z-[40] flex justify-center px-4 pointer-events-none">
//             <motion.div 
//               initial={{ y: -100, opacity: 0, scale: 0.9 }}
//               animate={{ y: 0, opacity: 1, scale: 1 }}
//               exit={{ y: -100, opacity: 0, scale: 0.9 }}
//               className="w-full max-w-[500px] bg-black rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] p-2 pointer-events-auto flex items-center gap-3 border border-stone-800"
//             >
//               <div className="pl-5 text-white opacity-70">
//                 <Search size={18} />
//               </div>
//               <input 
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="QUERY VAULT..."
//                 className="flex-1 bg-transparent border-none outline-none text-white text-[11px] font-black tracking-[0.2em] uppercase py-3 placeholder:text-stone-600"
//                 autoFocus
//               />
//               <button 
//                 onClick={() => {setSearch(''); setShowSearch(false);}}
//                 className="bg-stone-800 text-white p-3 rounded-2xl hover:bg-red-500 transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* 2. Header Section */}
//       <header className="max-w-[1800px] mx-auto mb-16 flex flex-col lg:flex-row justify-between items-end gap-10">
//         <div className="space-y-2">
//           <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em] mb-4 italic underline underline-offset-8 decoration-stone-100">Production Node Index</p>
//           <h1 className="text-6xl md:text-[7rem] font-black italic tracking-tighter uppercase text-stone-900 leading-[0.8] mb-4">
//             The <span className="text-stone-200">Vault</span>
//           </h1>
//           <div className="flex items-center gap-4">
//             <div className="w-12 h-[1.5px] bg-stone-100" />
//             <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">
//               {search ? `Found ${filteredProducts.length} results for "${search}"` : `Reference: ${filteredProducts.length} Objects Synced`}
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
//           {/* Compact Search Trigger */}
//           {!showSearch && (
//             <button 
//               onClick={() => setShowSearch(true)}
//               className="bg-white border border-stone-100 p-4 rounded-2xl shadow-xl hover:bg-stone-900 hover:text-white transition-all group"
//             >
//               <Search size={18} className="group-hover:scale-110 transition-transform" />
//             </button>
//           )}

//           {/* Grid Switcher */}
//           <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-stone-100 shadow-xl">
//             {[2, 3, 4, 6].map(num => (
//               <button
//                 key={num}
//                 onClick={() => setGridCols(num)}
//                 className={`p-3.5 rounded-xl transition-all ${gridCols === num ? 'bg-stone-900 text-white shadow-2xl scale-110' : 'text-stone-300 hover:text-stone-900'}`}
//               >
//                 {num === 6 ? <Zap size={16} /> : <LayoutGrid size={16} />}
//               </button>
//             ))}
//           </div>

//           {/* Sort Menu */}
//           <div className="relative">
//             <button 
//               onClick={() => setIsSortOpen(!isSortOpen)}
//               className="bg-white border border-stone-100 rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-12 hover:border-stone-900 transition-all"
//             >
//               Sequence: {sortType.replace('-', ' ')}
//               <ChevronDown size={14} className={`transition-transform duration-500 ${isSortOpen ? 'rotate-180' : ''}`} />
//             </button>
//             <AnimatePresence>
//               {isSortOpen && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
//                   className="absolute right-0 top-full mt-3 w-64 bg-white rounded-3xl shadow-3xl border border-stone-100 p-2 z-[150] overflow-hidden"
//                 >
//                   {['relevant', 'newest', 'low-high', 'high-low'].map((type) => (
//                     <button
//                       key={type}
//                       onClick={() => { setSortType(type); setIsSortOpen(false); }}
//                       className={`w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors ${sortType === type ? 'bg-stone-50 text-stone-900' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
//                     >
//                       {type.replace('-', ' ')}
//                     </button>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-16">
        
//         {/* Sidebar */}
//         <aside className="lg:w-72 flex-shrink-0">
//           <div className="sticky top-28 space-y-12">
            
//             <button 
//               onClick={() => setShowFilter(!showFilter)}
//               className="lg:hidden w-full flex items-center justify-between p-6 bg-white border border-stone-100 rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-sm"
//             >
//               <span className="flex items-center gap-3"><SlidersHorizontal size={14} /> Refine Index</span>
//               <ChevronDown size={14} className={showFilter ? 'rotate-180' : ''} />
//             </button>

//             <div className={`${showFilter ? 'block' : 'hidden'} lg:block space-y-12 px-2`}>
//               <section>
//                 <div className="flex items-center gap-3 mb-8">
//                   <div className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse" />
//                   <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.4em]">Categorization</h4>
//                 </div>
//                 <div className="flex flex-col gap-1.5">
//                   <CategoryBtn active={categoryFilters.length === 0} onClick={() => setCategoryFilters([])} label="Show All categories" />
//                   {categoryTree.filter(c => !c.parent_id).map((cat) => (
//                     <CategoryBtn 
//                       key={cat.id} 
//                       active={categoryFilters.includes(cat.id)} 
//                       onClick={() => toggleCategory(cat.id)} 
//                       label={cat.name} 
//                     />
//                   ))}
//                 </div>
//               </section>

//               <div className="p-10 bg-stone-900 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
//                 <div className="relative z-10">
//                    <Fingerprint size={24} className="mb-6 text-stone-600 group-hover:text-stone-200 transition-colors" />
//                    <h5 className="text-[11px] font-black uppercase mb-3 tracking-widest italic leading-tight">Board Membership <br/> Early Enrollment</h5>
//                    <button className="text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/20 pb-1 group-hover:border-white transition-all">Join Circle</button>
//                 </div>
//                 <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Product Grid */}
//         <main className="flex-1">
//           {loading ? (
//             <div className="py-40 flex flex-col items-center justify-center">
//               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-12 h-12 border-2 border-stone-100 border-t-stone-900 rounded-full mb-6" />
//               <p className="text-[9px] font-black uppercase tracking-[0.5em] text-stone-300 italic">Syncing Reference Vault...</p>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="py-40 text-center bg-white rounded-[4rem] border border-stone-50 shadow-inner flex flex-col items-center">
//                <Search size={32} className="text-stone-100 mb-6" />
//                <h3 className="text-2xl font-black italic uppercase text-stone-900 mb-2">Reference Void.</h3>
//                <button 
//                 onClick={() => {setCategoryFilters([]); setSearch('');}} 
//                 className="text-[10px] font-black uppercase underline tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-colors"
//                >
//                  Clear Search & Filters
//                </button>
//             </div>
//           ) : (
//             <motion.div layout className={`grid ${getGridClass()} transition-all duration-700 pb-20`}>
//               <AnimatePresence mode="popLayout">
//                 {filteredProducts.map((item, index) => (
//                   <CompactVanguardCard 
//                     key={item.id} 
//                     item={item} 
//                     index={index} 
//                     gridCols={gridCols}
//                     navigate={() => navigate(`/product/${item.id}`)}
//                     onAddToCart={() => { addToCart(item.id, 'Standard'); toast.success('Product Added Successfully'); }}
//                     onWishlist={() => toggleWishlist(item.id)}
//                     isInWishlist={wishlist?.includes(item.id)}
//                   />
//                 ))}
//               </AnimatePresence>
//             </motion.div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// const CompactVanguardCard = forwardRef(({ item, index, gridCols, navigate, onAddToCart, onWishlist, isInWishlist }, ref) => {
//   const [isAdded, setIsAdded] = useState(false);
//   const discount = item.discount_price && item.price ? Math.round(((item.price - item.discount_price) / item.price) * 100) : 0;

//   const handleAcquire = (e) => {
//     e.stopPropagation(); 
//     onAddToCart();
//     setIsAdded(true);
//     setTimeout(() => setIsAdded(false), 2000);
//   };

//   const handleWishlistClick = (e) => {
//     e.stopPropagation();
//     onWishlist();
//   };

//   return (
//     <motion.div
//       ref={ref}
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       transition={{ delay: index * 0.015 }}
//       className="group cursor-pointer"
//       onClick={navigate}
//     >
//       <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.8rem] bg-stone-50 overflow-hidden mb-5 border border-transparent group-hover:border-stone-100 group-hover:shadow-3xl transition-all duration-[1s]">
//         <img 
//           src={item.images?.[0] || item.image} 
//           className="w-full h-full object-cover transition-all duration-[1.2s] group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0" 
//           alt={item.name} 
//         />
        
//         {discount > 0 && (
//           <div className="absolute top-5 left-5 bg-red-600 text-white px-3 py-1.5 rounded-2xl text-[12px] font-black uppercase shadow-2xl z-20 ">
//             -{discount}%
//           </div>
//         )}

//         <div className="absolute top-5 right-5 z-20">
//           <button 
//             onClick={handleWishlistClick}
//             className={`p-3.5 rounded-2xl backdrop-blur-xl transition-all shadow-xl ${isInWishlist ? 'bg-stone-900 text-white shadow-stone-900/50' : 'bg-white/80 text-stone-900 hover:bg-stone-900 hover:text-white'}`}
//           >
//             <Heart size={14} className={isInWishlist ? 'fill-current' : ''} />
//           </button>
//         </div>

//         <div className="absolute bottom-5 inset-x-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
//             <button 
//               onClick={handleAcquire} 
//               className={`w-full py-5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all ${isAdded ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white'}`}
//             >
//               {isAdded ? <Check size={18}/> : <ShoppingBag size={18}/>}
//               {isAdded ? 'Product Added' : 'Add to cart'}
//             </button>
//         </div>

//         {item.bestseller && (
//           <span className="absolute top-6 left-6 bg-white text-stone-900 px-4 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-sm">Bestseller</span>
//         )}
//       </div>

//       <div className="px-3 space-y-1.5">
//         <div className="flex justify-between items-start gap-4">
//           <h3 className="text-[10px] md:text-[13px] font-black text-stone-900 uppercase tracking-tight truncate flex-1 group-hover:text-stone-400 transition-colors italic">
//             {item.name}
//           </h3>
//           <div className="flex flex-col items-end shrink-0">
//             {discount > 0 ? (
//                <>
//                  <p className="text-[18px] font-black text-stone-900 italic leading-none">Rs.{item.discount_price.toLocaleString()}</p>
//                  <p className="text-[14px] font-bold text-stone-500 line-through tracking-tight mt-1 opacity-60">Rs.{item.price.toLocaleString()}</p>
//                </>
//             ) : (
//               <p className="text-[18px] font-black text-stone-900 italic leading-none">Rs.{item.price.toLocaleString()}</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// });

// const CategoryBtn = ({ active, onClick, label }) => (
//   <button
//     onClick={onClick}
//     className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group flex items-center justify-between ${active ? 'bg-stone-900 text-white shadow-2xl scale-105' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
//   >
//     {label}
//     <div className={`w-1.5 h-1.5 rounded-full transition-all ${active ? 'bg-white scale-125' : 'bg-transparent group-hover:bg-stone-200'}`} />
//   </button>
// );

// export default Collection;












import React, { useContext, useState, useEffect, useMemo, forwardRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, ChevronDown, Search, ShoppingBag, Zap, 
  SlidersHorizontal, Heart, Plus, Check, ArrowRight,
  Fingerprint, X
} from 'lucide-react';
import { fetchCategoryTree } from '../services/supabase/categories';
import { toast } from 'sonner';

const Collection = () => {
  const { 
    products, search, setSearch, showSearch, setShowSearch, 
    loading, addToCart, wishlist, toggleWishlist 
  } = useContext(ShopContext);
  
  const navigate = useNavigate();
  
  // UI States
  const [showFilter, setShowFilter] = useState(false);
  const [gridCols, setGridCols] = useState(4); 
  const [categoryTree, setCategoryTree] = useState([]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // Filter States
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  useEffect(() => {
    fetchCategoryTree().then(setCategoryTree).catch(() => setCategoryTree([]));
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (showSearch && search) {
      result = result.filter(p => 
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (categoryFilters.length > 0) {
      result = result.filter(p => categoryFilters.includes(p.category_id));
    }
    
    switch (sortType) {
      case 'low-high': 
        result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price)); 
        break;
      case 'high-low': 
        result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price)); 
        break;
      case 'newest': 
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
        break;
      default: break;
    }
    return result;
  }, [products, search, showSearch, categoryFilters, sortType]);

  const toggleCategory = (id) => {
    setCategoryFilters(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Improved Responsive Grid Logic
  const getGridClass = () => {
    switch(gridCols) {
      case 2: return 'grid-cols-2 gap-4 md:gap-8';
      case 3: return 'grid-cols-2 md:grid-cols-3 gap-4 md:gap-6';
      case 4: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4';
      case 6: return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3';
      default: return 'grid-cols-1 max-w-2xl mx-auto space-y-8';
    }
  };

  return (
    <div className="bg-[#fbfbf9] min-h-screen pt-16 md:pt-24 pb-20 px-4 md:px-10 selection:bg-stone-900 selection:text-white">
      
      {/* 1. Centered Black Search Module - Responsive position */}
      <AnimatePresence>
        {showSearch && (
          <div className="fixed inset-x-0 top-32 md:top-36 z-[100] flex justify-center px-4 pointer-events-none">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-[500px] bg-black rounded-full md:rounded-[2rem] shadow-2xl p-1.5 md:p-2 pointer-events-auto flex items-center gap-2 md:gap-3 border border-stone-800"
            >
              <div className="pl-4 md:pl-5 text-white opacity-70">
                <Search size={16} />
              </div>
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="QUERY VAULT..."
                className="flex-1 bg-transparent border-none outline-none text-white text-[10px] md:text-[11px] font-black tracking-[0.1em] md:tracking-[0.2em] uppercase py-2 md:py-3 placeholder:text-stone-600"
                autoFocus
              />
              <button 
                onClick={() => {setSearch(''); setShowSearch(false);}}
                className="bg-stone-800 text-white p-2.5 md:p-3 rounded-full md:rounded-2xl hover:bg-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Header Section */}
      <header className="max-w-[1800px] mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4 md:space-y-6">
          <p className="text-[8px] md:text-[10px] font-black text-stone-300 uppercase tracking-[0.3em] md:tracking-[0.5em] italic underline underline-offset-8 decoration-stone-200/50">
            Production Node Index
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-[7rem] font-black italic tracking-tighter uppercase text-stone-900 leading-[0.9] md:leading-[0.8]">
            The <span className="text-stone-200">Vault</span>
          </h1>
          <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
            <div className="w-8 md:w-12 h-[1px] md:h-[1.5px] bg-stone-200" />
            <p className="text-[9px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest italic truncate">
              {search ? (
                <span>FOUND <span className="text-stone-900">{filteredProducts.length}</span> RESULTS FOR "{search}"</span>
              ) : (
                <>REFERENCE: <span className="text-stone-900">{filteredProducts.length}</span> OBJECTS SYNCED</>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Toggle */}
          {!showSearch && (
            <button 
              onClick={() => setShowSearch(true)}
              className="bg-white border border-stone-100 p-3.5 md:p-4 rounded-xl md:rounded-2xl shadow-lg hover:bg-stone-900 hover:text-white transition-all group"
            >
              <Search size={18} />
            </button>
          )}

          {/* Grid Switcher - Hidden on mobile if you want, or reduced options */}
          <div className="flex bg-white p-1 md:p-1.5 rounded-xl md:rounded-[1.5rem] border border-stone-100 shadow-lg">
            {[2, 3, 4, 6].map(num => (
              <button
                key={num}
                onClick={() => setGridCols(num)}
                className={`p-2.5 md:p-3.5 rounded-lg md:rounded-xl transition-all ${gridCols === num ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-300 hover:text-stone-900'}`}
              >
                {num === 6 ? <Zap size={14} className="md:w-4 md:h-4" /> : <LayoutGrid size={14} className="md:w-4 md:h-4" />}
              </button>
            ))}
          </div>

          {/* Sort Menu - Fluid width on mobile */}
          <div className="relative flex-1 md:flex-none">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full bg-white border border-stone-100 rounded-xl md:rounded-2xl px-4 md:px-8 py-3.5 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-between gap-4 md:gap-12 hover:border-stone-900 transition-all"
            >
              <span className="truncate">Sequence: {sortType.replace('-', ' ')}</span>
              <ChevronDown size={14} className={`transition-transform duration-500 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-full md:w-64 bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-stone-100 p-1.5 z-[150] overflow-hidden"
                >
                  {['relevant', 'newest', 'low-high', 'high-low'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setSortType(type); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${sortType === type ? 'bg-stone-50 text-stone-900' : 'text-stone-400 hover:bg-stone-50 hover:text-stone-900'}`}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-8 md:gap-16">
        
        {/* Sidebar / Filter Drawer */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="lg:sticky lg:top-28 space-y-6 md:space-y-12">
            
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden w-full flex items-center justify-between p-4 md:p-6 bg-white border border-stone-100 rounded-2xl md:rounded-[2rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-md"
            >
              <span className="flex items-center gap-3"><SlidersHorizontal size={14} /> Refine Index</span>
              <div className={`transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}>
                <ChevronDown size={14} />
              </div>
            </button>

            <AnimatePresence>
              {(showFilter || window.innerWidth >= 1024) && (
                <motion.div 
                  initial={window.innerWidth < 1024 ? { height: 0, opacity: 0 } : {}}
                  animate={window.innerWidth < 1024 ? { height: 'auto', opacity: 1 } : {}}
                  exit={window.innerWidth < 1024 ? { height: 0, opacity: 0 } : {}}
                  className="space-y-8 md:space-y-12 px-1 overflow-hidden lg:overflow-visible"
                >
                  <section>
                    <div className="flex items-center gap-3 mb-6 md:mb-8">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse" />
                      <h4 className="text-[9px] md:text-[10px] font-black text-stone-900 uppercase tracking-[0.3em] md:tracking-[0.4em]">Categorization</h4>
                    </div>
                    <div className="flex flex-col gap-1.5 md:gap-2">
                      <CategoryBtn active={categoryFilters.length === 0} onClick={() => setCategoryFilters([])} label="SHOW ALL" />
                      {categoryTree.filter(c => !c.parent_id).map((cat) => (
                        <CategoryBtn 
                          key={cat.id} 
                          active={categoryFilters.includes(cat.id)} 
                          onClick={() => toggleCategory(cat.id)} 
                          label={cat.name} 
                        />
                      ))}
                    </div>
                  </section>

                  {/* Desktop Only Promo Card */}
                  <div className="hidden lg:block p-10 bg-stone-900 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                       <Fingerprint size={24} className="mb-6 text-stone-600 group-hover:text-stone-200 transition-colors" />
                       <h5 className="text-[11px] font-black uppercase mb-3 tracking-widest italic leading-tight">Board Membership <br/> Early Enrollment</h5>
                       <button className="text-[9px] font-black uppercase tracking-[0.2em] border-b border-white/20 pb-1 group-hover:border-white transition-all">Join Circle</button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="py-20 md:py-40 flex flex-col items-center justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 md:w-12 md:h-12 border-2 border-stone-100 border-t-stone-900 rounded-full mb-6" />
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] text-stone-300 italic">SYNCING REFERENCE...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 md:py-40 text-center bg-white rounded-[2rem] md:rounded-[4rem] border border-stone-50 shadow-inner flex flex-col items-center px-6">
               <Search size={32} className="text-stone-100 mb-6" />
               <h3 className="text-xl md:text-2xl font-black italic uppercase text-stone-900 mb-2">Reference Void.</h3>
               <button 
                onClick={() => {setCategoryFilters([]); setSearch('');}} 
                className="text-[9px] md:text-[10px] font-black uppercase underline tracking-[0.2em] md:tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-colors"
               >
                 RESET SYSTEM PARAMETERS
               </button>
            </div>
          ) : (
            <motion.div layout className={`grid ${getGridClass()} transition-all duration-700 pb-20`}>
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((item, index) => (
                  <CompactVanguardCard 
                    key={item.id} 
                    item={item} 
                    index={index} 
                    navigate={() => navigate(`/product/${item.id}`)}
                    onAddToCart={() => { addToCart(item.id, 'Standard'); toast.success('Added to Archive'); }}
                    onWishlist={() => toggleWishlist(item.id)}
                    isInWishlist={wishlist?.includes(item.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

// COMPACT VANGUARD CARD
const CompactVanguardCard = forwardRef(({ item, index, navigate, onAddToCart, onWishlist, isInWishlist }, ref) => {
  const [isAdded, setIsAdded] = useState(false);
  const discount = item.discount_price && item.price ? Math.round(((item.price - item.discount_price) / item.price) * 100) : 0;

  const handleAcquire = (e) => {
    e.stopPropagation(); 
    onAddToCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onWishlist();
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.01 }}
      className="group cursor-pointer"
      onClick={navigate}
    >
      <div className="relative aspect-[4/5] rounded-[1.8rem] md:rounded-[2.8rem] bg-stone-50 overflow-hidden mb-3 md:mb-5 border border-black/5 group-hover:shadow-2xl transition-all duration-500">
        <img 
          src={item.images?.[0] || item.image} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 grayscale-[0.1] group-hover:grayscale-0" 
          alt={item.name} 
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 md:top-5 md:left-5 bg-red-600 text-white px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-2xl text-[9px] md:text-[12px] font-black uppercase z-20 shadow-xl">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 md:top-5 md:right-5 z-20">
          <button 
            onClick={handleWishlistClick}
            className={`p-2.5 md:p-3.5 rounded-xl md:rounded-2xl backdrop-blur-md transition-all shadow-lg ${isInWishlist ? 'bg-stone-900 text-white' : 'bg-white/80 text-stone-900'}`}
          >
            <Heart size={14} className={isInWishlist ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Mobile Quick Add (Floating) / Desktop Quick Add (Hover) */}
        <div className="absolute bottom-3 inset-x-3 md:bottom-5 md:inset-x-5 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 z-20">
            <button 
              onClick={handleAcquire} 
              className={`w-full py-3.5 md:py-5 rounded-xl md:rounded-[1.2rem] text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 shadow-2xl transition-all ${isAdded ? 'bg-emerald-500 text-white' : 'bg-stone-950 text-white'}`}
            >
              {isAdded ? <Check size={16}/> : <ShoppingBag size={16}/>}
              <span>{isAdded ? 'ADDED' : 'ACQUIRE'}</span>
            </button>
        </div>
      </div>

      <div className="px-1 md:px-3 space-y-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] md:text-[13px] font-black text-stone-900 uppercase tracking-tight truncate italic">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            {discount > 0 ? (
               <div className="flex items-center gap-2">
                 <p className="text-[14px] md:text-[18px] font-black text-stone-900 italic">Rs.{item.discount_price.toLocaleString()}</p>
                 <p className="text-[10px] md:text-[14px] font-bold text-stone-400 line-through">Rs.{item.price.toLocaleString()}</p>
               </div>
            ) : (
              <p className="text-[14px] md:text-[18px] font-black text-stone-900 italic">Rs.{item.price.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// CATEGORY BUTTON COMPONENT
const CategoryBtn = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${active ? 'bg-stone-950 text-white shadow-xl translate-x-1' : 'text-stone-400 hover:bg-white hover:text-stone-950'}`}
  >
    <span className="truncate">{label}</span>
    <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-all ${active ? 'bg-emerald-500 scale-125' : 'bg-stone-200'}`} />
  </button>
);

export default Collection;