// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { assets } from '../assets/frontend_assets/assets';

// function Hero() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-cream-50 border border-cream-200"
//     >
//       <div className="w-full sm:w-1/2 flex items-center justify-center py-14 sm:py-20 px-8">
//         <div className="text-stone-800">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="w-10 h-0.5 bg-terracotta-500" />
//             <p className="font-medium text-xs tracking-widest text-stone-500">BESTSELLERS</p>
//           </div>
//           <h1 className="prata-regular text-4xl sm:text-5xl lg:text-6xl leading-tight text-stone-900">
//             Latest Arrivals
//           </h1>
//           <Link
//             to="/collection"
//             className="inline-flex items-center gap-2 mt-6 group"
//           >
//             <span className="font-semibold text-sm tracking-wide group-hover:text-terracotta-500 transition-colors">
//               SHOP NOW
//             </span>
//             <span className="w-8 h-px bg-stone-400 group-hover:bg-terracotta-500 transition-colors" />
//           </Link>
//         </div>
//       </div>
//       <div className="w-full sm:w-1/2 overflow-hidden">
//         <motion.img
//           initial={{ scale: 1.05 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.7 }}
//           className="w-full h-72 sm:h-auto object-cover"
//           src={assets.hero_img}
//           alt="Hero"
//         />
//       </div>
//     </motion.div>
//   );
// }

// export default Hero;






import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { assets } from '../assets/frontend_assets/assets';

function Hero({ data }) {
  // Use fallback if Admin hasn't set data yet
  const title = data?.title || "Latest Arrivals";
  const subtitle = data?.subtitle || "BESTSELLERS";
  const image = data?.image_url || assets.hero_img;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row rounded-3xl overflow-hidden bg-white border border-stone-100 shadow-sm"
    >
      <div className="w-full sm:w-1/2 flex items-center justify-center py-14 sm:py-20 px-8">
        <div className="text-stone-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-10 h-0.5 bg-stone-900" />
            <p className="font-black text-[10px] tracking-widest text-stone-400 uppercase">{subtitle}</p>
          </div>
          <h1 className="prata-regular text-4xl sm:text-5xl lg:text-7xl leading-tight text-stone-900">
            {title}
          </h1>
          <Link to="/collection" className="inline-flex items-center gap-4 mt-8 group">
            <span className="font-black text-xs tracking-[0.2em] group-hover:translate-x-2 transition-transform">SHOP NOW</span>
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center">→</div>
          </Link>
        </div>
      </div>
      <div className="w-full sm:w-1/2 overflow-hidden bg-stone-50">
        <img className="w-full h-full object-cover" src={image} alt="Home Hero" />
      </div>
    </motion.div>
  );
}

export default Hero;