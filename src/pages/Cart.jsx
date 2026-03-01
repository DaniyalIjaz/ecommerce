import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Plus, Minus, ShoppingBag, 
  ArrowRight, ShieldCheck, Zap, AlertCircle 
} from 'lucide-react';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    if (products.length > 0) {
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="bg-[#fbfbf9] min-h-screen pt-24 pb-20 px-4 md:px-10 selection:bg-stone-900 selection:text-white">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
            <p className="text-sm font-black text-stone-400 uppercase tracking-[0.3em]">Vault Manifest</p>
          </div>
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-stone-900 leading-none">
            Selected <span className="text-stone-300">Objects</span>
          </h1>
        </header>

        {cartData.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-stone-100 shadow-sm"
          >
            <ShoppingBag size={48} className="text-stone-200 mb-6" />
            <h3 className="text-xl font-black uppercase text-stone-900 mb-4">Your Vault is Empty</h3>
            <button 
              onClick={() => navigate('/collection')}
              className="text-sm font-black uppercase underline tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
            >
              Return to Index
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
            
            {/* ITEMS LIST */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode='popLayout'>
                {cartData.map((item, index) => {
                  const productData = products.find((p) => p.id === item._id || p._id === item._id);
                  if (!productData) return null;

                  // PRICING LOGIC: Check for discount_price in schema
                  const hasDiscount = productData.discount_price && productData.discount_price < productData.price;
                  const activePrice = hasDiscount ? productData.discount_price : productData.price;
                  const img = Array.isArray(productData.images) ? productData.images[0] : productData.image?.[0];

                  return (
                    <motion.div
                      key={`${item._id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white border border-stone-100 rounded-[2rem] p-5 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 group shadow-sm hover:shadow-md transition-all duration-500"
                    >
                      {/* IMAGE CONTAINER */}
                      <div className="w-full md:w-32 aspect-square rounded-2xl overflow-hidden bg-stone-50 flex-shrink-0 border border-stone-50">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={img} alt="" />
                      </div>

                      {/* PRODUCT DATA */}
                      <div className="flex-1 w-full space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-base md:text-lg font-black uppercase italic text-stone-900 leading-tight">
                              {productData.name}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Size:</span>
                                <span className="text-sm font-black text-stone-900 bg-stone-100 px-3 py-1 rounded-md">{item.size}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => updateQuantity(item._id, item.size, 0)}
                            className="p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          {/* PRICE NODE */}
                          <div className="flex flex-col">
                             <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black text-stone-900 italic">
                                  {currency}{activePrice.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                  <span className="text-sm font-bold text-stone-300 line-through">
                                    {currency}{productData.price.toLocaleString()}
                                  </span>
                                )}
                             </div>
                             {hasDiscount && (
                               <p className="text-sm font-bold text-emerald-500 mt-1 uppercase tracking-tighter flex items-center gap-1">
                                 <Zap size={14} fill="currentColor"/> Special Price Active
                               </p>
                             )}
                          </div>

                          {/* QUANTITY PICKER */}
                          <div className="flex items-center bg-stone-50 border border-stone-100 rounded-xl p-1 w-fit">
                            <button 
                              onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg text-stone-400 hover:text-stone-900 transition-all"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="w-12 text-center text-sm font-black text-stone-900">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg text-stone-400 hover:text-stone-900 transition-all"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* SUMMARY SIDEBAR */}
            <aside className="lg:col-span-5">
              <div className="sticky top-32 space-y-6">
                
                <div className="bg-black rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <ShieldCheck size={24} className="text-emerald-400" />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em]">Transaction Summary</h2>
                      </div>
                      
                      <div className="space-y-2 mb-8">
                         {/* We use a modified CartTotal here or ensure your CartTotal uses text-sm min */}
                         <CartTotal /> 
                      </div>

                      <div className="space-y-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate('/place-order')}
                          className="w-full bg-white text-stone-950 py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
                        >
                          Place Order
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        
                        <div className="flex items-center justify-center gap-2 text-sm font-bold text-white opacity-90 uppercase tracking-widest">
                           <AlertCircle size={16} />
                           Final Taxes at Checkout
                        </div>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                </div>

                <div className="p-8 bg-white border border-stone-100 rounded-[2rem] flex items-center gap-4">
                   <Zap size={24} className="text-stone-200" />
                   <p className="text-sm font-bold text-stone-400 leading-relaxed uppercase tracking-tight">
                     Objects in the Vault are <span className="text-stone-900">not reserved</span> until payment confirmation is received.
                   </p>
                </div>
              </div>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;