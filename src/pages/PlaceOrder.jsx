// import React, { useContext, useState } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import { supabase } from '../lib/supabase';
// import CartTotal from '../components/CartTotal';
// import { motion } from 'framer-motion';
// import { toast } from 'sonner'; // Using sonner for consistent UI
// import { 
//   ShieldCheck, Truck, CreditCard, 
//   ChevronRight, MapPin, Phone, Mail, User,
//   Zap, PackageCheck
// } from 'lucide-react';

// const PlaceOrder = () => {
//   const [method, setMethod] = useState('cod');
//   const [loading, setLoading] = useState(false);
//   const { 
//     navigate, 
//     cartItems, 
//     products, 
//     getCartAmount, 
//     delivery_fee, 
//     user, 
//     setCartItems 
//   } = useContext(ShopContext);

//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: user?.email || '',
//     street: '',
//     city: '',
//     state: '',
//     zipcode: '',
//     country: 'Pakistan',
//     phone: '',
//   });

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const processOrder = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     const subtotal = getCartAmount();
//     if (subtotal <= 0) {
//       toast.error("Your manifest is empty");
//       return;
//     }

//     setLoading(true);

//     try {
//       const total = subtotal + delivery_fee;
//       const deliveryAddress = { ...form };

//       // 1. Insert into Orders Table
//       const { data: orderData, error: orderError } = await supabase
//         .from('orders')
//         .insert({
//           user_id: user?.id || null, // Allow guest checkout if your schema allows
//           guest_email: user ? null : form.email,
//           subtotal: subtotal,
//           delivery_fee: delivery_fee,
//           total: total,
//           payment_method: method,
//           delivery_address: deliveryAddress,
//           status: 'pending'
//         })
//         .select()
//         .single();

//       if (orderError) throw orderError;

//       // 2. Prepare Order Items
//       const orderItemsToInsert = [];

//       for (const productId in cartItems) {
//         for (const size in cartItems[productId]) {
//           const quantity = cartItems[productId][size];
//           if (quantity > 0) {
//             const product = products.find(p => p.id === productId);
//             if (product) {
//               // LOGIC: Use discount_price if it exists
//               const activePrice = (product.discount_price && product.discount_price < product.price) 
//                                   ? product.discount_price 
//                                   : product.price;

//               orderItemsToInsert.push({
//                 order_id: orderData.id,
//                 product_id: product.id,
//                 product_name: product.name,
//                 product_image: product.images?.[0] || product.image,
//                 size: size,
//                 quantity: quantity,
//                 price_at_order: activePrice,
//                 vendor_id: product.vendor_id
//               });
//             }
//           }
//         }
//       }

//       // 3. Insert into Order_Items Table
//       const { error: itemsError } = await supabase
//         .from('order_items')
//         .insert(orderItemsToInsert);

//       if (itemsError) throw itemsError;

//       // 4. Success Actions
//       toast.success("TRANSACTION AUTHENTICATED", {
//         description: "Your order has been logged in the vault.",
//         icon: <PackageCheck className="text-emerald-500" />
//       });
      
//       setCartItems({}); // Clear Cart
//       navigate('/orders');

//     } catch (err) {
//       console.error(err);
//       toast.error("TRANSACTION FAILED", {
//         description: err.message || "Could not synchronize with the vault."
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-[#fbfbf9] min-h-screen pt-24 pb-20 px-4 md:px-10">
//       <div className="max-w-[1400px] mx-auto">
        
//         {/* PROGRESS HEADER */}
//         <header className="mb-12">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
//             <p className="text-sm font-black text-stone-400 uppercase tracking-[0.3em]">Checkout Protocol</p>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-stone-900">
//             Delivery <span className="text-stone-300">Authorization</span>
//           </h1>
//         </header>

//         <form onSubmit={processOrder} className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          
//           {/* LEFT: DELIVERY FORM */}
//           <div className="lg:col-span-7 space-y-10">
//             <section className="space-y-6">
//               <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
//                 <User size={20} className="text-stone-900" />
//                 <h2 className="text-sm font-black uppercase tracking-widest text-stone-900">Identity Details</h2>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" />
//                 <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Doe" />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input label="Email Node" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="identity@vault.com" icon={<Mail size={16}/>} />
//                 <Input label="Phone Contact" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+92 ..." icon={<Phone size={16}/>} />
//               </div>
//             </section>

//             <section className="space-y-6">
//               <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
//                 <MapPin size={20} className="text-stone-900" />
//                 <h2 className="text-sm font-black uppercase tracking-widest text-stone-900">Logistics Destination</h2>
//               </div>
              
//               <Input label="Street Address" name="street" value={form.street} onChange={handleChange} required placeholder="House #, Street name, Area" />
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <Input label="City" name="city" value={form.city} onChange={handleChange} required placeholder="Karachi" />
//                 <Input label="State / Province" name="state" value={form.state} onChange={handleChange} placeholder="Sindh" />
//                 <Input label="Zipcode" name="zipcode" value={form.zipcode} onChange={handleChange} placeholder="75500" />
//               </div>
//               <Input label="Country" name="country" value={form.country} onChange={handleChange} required />
//             </section>
//           </div>

//           {/* RIGHT: SUMMARY & PAYMENT */}
//           <aside className="lg:col-span-5 space-y-8">
            
//             {/* PAYMENT SELECTION */}
//             <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm">
//               <div className="flex items-center gap-3 mb-8">
//                 <CreditCard size={20} className="text-stone-900" />
//                 <h2 className="text-sm font-black uppercase tracking-widest text-stone-900">Payment Channel</h2>
//               </div>

//               <div className="space-y-3">
//                 <PaymentOption 
//                   id="cod" 
//                   label="Cash on Delivery" 
//                   description="Settle balance upon hardware arrival"
//                   active={method === 'cod'} 
//                   onClick={() => setMethod('cod')} 
//                 />
//                 <PaymentOption 
//                   id="stripe" 
//                   label="Digital Terminal (Stripe)" 
//                   description="Encrypted instant authorization"
//                   active={method === 'stripe'} 
//                   onClick={() => setMethod('stripe')} 
//                   disabled
//                 />
//               </div>
//             </div>

//             {/* FINAL SUMMARY */}
//             <div className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
//               <div className="relative z-10">
//                 <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
//                   <ShieldCheck size={24} className="text-emerald-500" />
//                   <h2 className="text-sm font-black uppercase tracking-[0.3em]">Order Finalization</h2>
//                 </div>

//                 <CartTotal />

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-white text-stone-950 py-6 rounded-2xl text-sm font-black uppercase tracking-[0.2em] mt-10 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
//                 >
//                   {loading ? 'Synchronizing...' : 'Authorize Transaction'}
//                   {!loading && <ChevronRight size={18} />}
//                 </motion.button>

//                 <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-stone-500 uppercase tracking-widest">
//                   <Zap size={14} className="text-emerald-500" />
//                   Instant SSL Verification Active
//                 </div>
//               </div>
//               {/* Background Decoration */}
//               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
//             </div>
//           </aside>

//         </form>
//       </div>
//     </div>
//   );
// };

// /** SUB-COMPONENTS **/

// const Input = ({ label, icon, ...props }) => (
//   <div className="space-y-2">
//     <label className="text-sm font-black uppercase tracking-widest text-stone-400 ml-1">
//       {label} {props.required && <span className="text-emerald-500">*</span>}
//     </label>
//     <div className="relative group">
//       {icon && (
//         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors">
//           {icon}
//         </div>
//       )}
//       <input 
//         {...props}
//         className={`w-full bg-white border border-stone-100 rounded-2xl py-4 ${icon ? 'pl-12' : 'px-6'} pr-6 text-sm font-bold text-stone-900 placeholder:text-stone-200 outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-900/5 transition-all shadow-sm`}
//       />
//     </div>
//   </div>
// );

// const PaymentOption = ({ id, label, description, active, onClick, disabled }) => (
//   <div 
//     onClick={() => !disabled && onClick()}
//     className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
//       active 
//       ? 'border-stone-900 bg-stone-50' 
//       : 'border-stone-50 hover:border-stone-200 bg-white'
//     } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//   >
//     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
//       active ? 'border-stone-900 bg-stone-900' : 'border-stone-200'
//     }`}>
//       {active && <div className="w-2 h-2 rounded-full bg-white" />}
//     </div>
//     <div className="flex-1">
//       <p className="text-sm font-black uppercase tracking-tight text-stone-900">{label}</p>
//       <p className="text-sm font-bold text-stone-400 lowercase italic">{description}</p>
//     </div>
//     {disabled && (
//       <span className="text-[10px] font-black uppercase bg-stone-100 px-2 py-1 rounded">Offline</span>
//     )}
//   </div>
// );

// export default PlaceOrder;





import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import { motion } from 'framer-motion';
import { toast } from 'sonner'; 
import { 
  ShieldCheck, CreditCard, ChevronRight, 
  MapPin, Phone, Mail, User, Zap, PackageCheck
} from 'lucide-react';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const { 
    navigate, 
    getCartCount, 
    user, 
    placeOrder 
  } = useContext(ShopContext);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'Pakistan',
    phone: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (getCartCount() === 0) {
      toast.error("Your manifest is empty");
      return;
    }

    setLoading(true);

    try {
      // Pass the data to the Context's placeOrder function
      // This handles all Supabase insertions and cart clearing
      await placeOrder({
        email: form.email,
        paymentMethod: method,
        deliveryAddress: { ...form },
      });

      toast.success("TRANSACTION AUTHENTICATED", {
        description: "Your order has been logged in the vault.",
        icon: <PackageCheck className="text-emerald-500" />
      });
      
      navigate('/orders');

    } catch (err) {
      console.error(err);
      toast.error("TRANSACTION FAILED", {
        description: err.message || "Could not synchronize with the vault."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fbfbf9] min-h-screen pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-black text-stone-400 uppercase tracking-[0.3em]">Checkout Protocol</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-stone-900 leading-none">
            Delivery <span className="text-stone-300">Authorization</span>
          </h1>
        </header>

        <form onSubmit={handleSubmitOrder} className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          
          {/* LEFT: DELIVERY FORM */}
          <div className="lg:col-span-7 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <User size={20} className="text-stone-900" />
                <h2 className="text-sm font-black uppercase tracking-widest text-stone-900">Identity Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" />
                <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Doe" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Email Node" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="identity@vault.com" icon={<Mail size={16}/>} />
                <Input label="Phone Contact" name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+92 ..." icon={<Phone size={16}/>} />
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <MapPin size={20} className="text-stone-900" />
                <h2 className="text-sm font-black uppercase tracking-widest text-stone-900">Logistics Destination</h2>
              </div>
              
              <Input label="Street Address" name="street" value={form.street} onChange={handleChange} required placeholder="House #, Street name, Area" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input label="City" name="city" value={form.city} onChange={handleChange} required placeholder="Karachi" />
                <Input label="State / Province" name="state" value={form.state} onChange={handleChange} placeholder="Sindh" />
                <Input label="Zipcode" name="zipcode" value={form.zipcode} onChange={handleChange} placeholder="75500" />
              </div>
              <Input label="Country" name="country" value={form.country} onChange={handleChange} required />
            </section>
          </div>

          {/* RIGHT: SUMMARY & PAYMENT */}
          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-stone-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <CreditCard size={20} className="text-stone-900" />
                <h2 className="text-sm font-black uppercase tracking-widest text-stone-900">Payment Channel</h2>
              </div>

              <div className="space-y-3">
                <PaymentOption 
                  id="cod" 
                  label="Cash on Delivery" 
                  description="Settle balance upon hardware arrival"
                  active={method === 'cod'} 
                  onClick={() => setMethod('cod')} 
                />
                <PaymentOption 
                  id="stripe" 
                  label="Digital Terminal (Stripe)" 
                  description="Encrypted instant authorization"
                  active={method === 'stripe'} 
                  onClick={() => setMethod('stripe')} 
                  disabled
                />
              </div>
            </div>

            <div className="bg-stone-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                  <ShieldCheck size={24} className="text-emerald-500" />
                  <h2 className="text-sm font-black uppercase tracking-[0.3em]">Order Finalization</h2>
                </div>

                <CartTotal />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-stone-950 py-6 rounded-2xl text-sm font-black uppercase tracking-[0.2em] mt-10 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  {loading ? 'Synchronizing...' : 'Authorize Transaction'}
                  {!loading && <ChevronRight size={18} />}
                </motion.button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-stone-500 uppercase tracking-widest">
                  <Zap size={14} className="text-emerald-500" />
                  Instant SSL Verification Active
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

// Sub-components with 14px+ font size
const Input = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-black uppercase tracking-widest text-stone-400 ml-1">
      {label} {props.required && <span className="text-emerald-500">*</span>}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors">
          {icon}
        </div>
      )}
      <input 
        {...props}
        className={`w-full bg-white border border-stone-100 rounded-2xl py-4 ${icon ? 'pl-12' : 'px-6'} pr-6 text-sm font-bold text-stone-900 placeholder:text-stone-200 outline-none focus:border-stone-900 focus:ring-4 focus:ring-stone-900/5 transition-all shadow-sm`}
      />
    </div>
  </div>
);

const PaymentOption = ({ id, label, description, active, onClick, disabled }) => (
  <div 
    onClick={() => !disabled && onClick()}
    className={`group relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
      active 
      ? 'border-stone-900 bg-stone-50' 
      : 'border-stone-50 hover:border-stone-200 bg-white'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
      active ? 'border-stone-900 bg-stone-900' : 'border-stone-200'
    }`}>
      {active && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
    <div className="flex-1">
      <p className="text-sm font-black uppercase tracking-tight text-stone-900">{label}</p>
      <p className="text-sm font-bold text-stone-400 lowercase italic">{description}</p>
    </div>
  </div>
);

export default PlaceOrder;