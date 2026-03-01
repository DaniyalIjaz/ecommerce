// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Link } from 'react-router-dom';

// const HomeCarousel = ({ banners }) => {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     if (!banners?.length) return;
//     const id = setInterval(() => {
//       setIndex((prev) => (prev + 1) % banners.length);
//     }, 6000);
//     return () => clearInterval(id);
//   }, [banners]);

//   if (!banners || banners.length === 0) return null;

//   const current = banners[index];

//   return (
//     <div className="mt-4 mb-10">
//       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-terracotta-500 via-terracotta-400 to-amber-300 text-white">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={current.id}
//             initial={{ opacity: 0, x: 40 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -40 }}
//             transition={{ duration: 0.45, ease: 'easeOut' }}
//             className="grid md:grid-cols-2 gap-6 md:gap-10 p-6 sm:p-10 items-center"
//           >
//             <div className="space-y-3 sm:space-y-4">
//               <p className="text-xs uppercase tracking-[0.25em] opacity-80">
//                 {current.badge || 'Just for you'}
//               </p>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
//                 {current.title}
//               </h2>
//               {current.subtitle && (
//                 <p className="text-sm sm:text-base opacity-90 max-w-md">
//                   {current.subtitle}
//                 </p>
//               )}
//               <div className="flex flex-wrap items-center gap-3 pt-2">
//                 {current.cta_link && (
//                   <Link
//                     to={current.cta_link}
//                     className="inline-flex items-center px-4 py-2.5 rounded-full bg-stone-900 text-sm font-medium hover:bg-stone-800 transition-colors"
//                   >
//                     {current.cta_label || 'Shop now'}
//                   </Link>
//                 )}
//                 {typeof current.highlight === 'string' && current.highlight && (
//                   <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-white/10 border border-white/25">
//                     {current.highlight}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="relative aspect-[4/3] md:aspect-[16/9] bg-white/10 rounded-2xl overflow-hidden">
//               {current.image_url ? (
//                 <img
//                   src={current.image_url}
//                   alt={current.title}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-4xl font-semibold opacity-30">
//                   {current.title?.charAt(0)}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </AnimatePresence>
//         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
//           {banners.map((b, i) => (
//             <button
//               key={b.id}
//               onClick={() => setIndex(i)}
//               className={`h-1.5 rounded-full transition-all ${
//                 i === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeCarousel;






import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomeCarousel = ({ banners }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!banners?.length) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % banners.length), 6000);
    return () => clearInterval(id);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const current = banners[index];

  return (
    <div className="mt-4 mb-10 h-[400px] md:h-[500px]">
      <div className="h-full relative overflow-hidden rounded-[3rem] bg-stone-900 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <img src={current.image_url} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center px-10 md:px-20">
               <div className="max-w-xl space-y-4">
                  <motion.p initial={{ y: 20 }} animate={{ y: 0 }} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">
                     {current.subtitle}
                  </motion.p>
                  <motion.h2 initial={{ y: 20 }} animate={{ y: 0 }} className="text-4xl md:text-6xl font-black leading-none uppercase tracking-tighter">
                    {current.title}
                  </motion.h2>
                  <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="pt-4">
                    <Link to={current.cta_link || '/collection'} className="inline-block bg-white text-stone-900 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">
                      {current.cta_label || 'Explore'}
                    </Link>
                  </motion.div>
               </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-10 right-10 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-10 bg-white' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCarousel;