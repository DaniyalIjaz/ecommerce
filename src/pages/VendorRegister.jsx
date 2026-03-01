





// import React, { useState, useRef } from 'react';
// import { supabase } from '../lib/supabase';
// import { toast, Toaster } from 'react-hot-toast';
// import { 
//   Camera, Plus, X, Store, User, 
//   MapPin, Briefcase, ChevronRight, UploadCloud, Check 
// } from 'lucide-react';

// const CATEGORY_LIST = [
//   "Clothing & Apparel", "Handmade Crafts", "Jewelry & Accessories", 
//   "Home & Living", "Beauty & Care", "Organic Grocery", 
//   "Footwear", "Art & Paintings", "Furniture", "Electronics"
// ];

// const VendorRegister = () => {
//   const [form, setForm] = useState({
//     full_name: '', email: '', password: '', phone: '', 
//     address: '', shop_name: '', shop_slug: '', bio: '', 
//     location: '', cnic: ''
//   });

//   const [logoFile, setLogoFile] = useState(null);
//   const [logoPreview, setLogoPreview] = useState(null);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [customCategory, setCustomCategory] = useState('');
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//     if (name === 'shop_name') {
//       const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
//       setForm(prev => ({ ...prev, shop_slug: slug }));
//     }
//   };

//   const toggleCategory = (cat) => {
//     setSelectedCategories(prev => 
//       prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
//     );
//   };

//   const handleAddCustom = (e) => {
//     if ((e.key === 'Enter' || e.type === 'click') && customCategory.trim()) {
//       e.preventDefault();
//       const val = customCategory.trim();
//       if (!selectedCategories.includes(val)) {
//         setSelectedCategories([...selectedCategories, val]);
//         setCustomCategory('');
//         toast.success("Added specialty");
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (selectedCategories.length === 0) return toast.error("Please select a specialty");
    
//     setLoading(true);
//     const loadToast = toast.loading('Registering your shop...');

//     try {
//       // 1. SIGN UP
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: form.email,
//         password: form.password,
//         options: {
//           data: {
//             full_name: form.full_name,
//             phone: form.phone,
//             address: form.address,
//             shop_name: form.shop_name,
//             shop_slug: form.shop_slug,
//             bio: form.bio,
//             location: form.location,
//             cnic: form.cnic
//           }
//         }
//       });

//       if (authError) {
//         if (authError.message.includes("rate limit")) {
//           throw new Error("Email server busy. Please wait 10 minutes or try a different email.");
//         }
//         throw authError;
//       }

//       const user = authData.user;

//       // 2. LOGO UPLOAD
//       if (logoFile && user) {
//         const fileExt = logoFile.name.split('.').pop();
//         const filePath = `logos/${user.id}-${Date.now()}.${fileExt}`;
        
//         const { error: uploadError } = await supabase.storage
//           .from('vendor-assets')
//           .upload(filePath, logoFile, {
//             contentType: logoFile.type, // Ensures browser knows it's an image
//             upsert: true
//           });

//         if (!uploadError) {
//           const { data } = supabase.storage.from('vendor-assets').getPublicUrl(filePath);
//           // Save the URL to vendor_profiles
//           await supabase.from('vendor_profiles').update({ shop_logo_url: data.publicUrl }).eq('id', user.id);
//         }
//       }

//       toast.success('Registration Complete!', { id: loadToast });
      
//       // Clear Form
//       setForm({ full_name: '', email: '', password: '', phone: '', address: '', shop_name: '', shop_slug: '', bio: '', location: '', cnic: '' });
//       setLogoPreview(null);
//       setSelectedCategories([]);

//     } catch (err) {
//       toast.error(err.message || "Failed to register", { id: loadToast });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 text-[#4A3F35]">
//       <Toaster position="top-center" />
      
//       <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-[#E8E2D9] shadow-2xl overflow-hidden">
        
//         <div className="bg-[#C25135] p-10 text-white relative">
//           <h1 className="text-4xl font-bold tracking-tight">Vendor Registration</h1>
//           <p className="text-[#FADCD3] mt-2 text-lg italic">Join our artisan community.</p>
//           <Store className="absolute right-8 bottom-8 text-white/10 w-32 h-32" />
//         </div>

//         <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          
//           {/* Logo Upload */}
//           <div className="flex flex-col items-center">
//             <div 
//               onClick={() => fileInputRef.current.click()}
//               className="group relative w-32 h-32 rounded-full border-4 border-[#FDFBF7] shadow-lg flex items-center justify-center cursor-pointer hover:border-[#C25135] transition-all bg-[#FAF8F5] overflow-hidden"
//             >
//               {logoPreview ? (
//                 <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
//               ) : (
//                 <div className="text-center">
//                   <Camera className="mx-auto text-[#D1C7BD] mb-1" />
//                   <span className="text-[10px] font-bold uppercase text-[#A89E94]">Shop Logo</span>
//                 </div>
//               )}
//             </div>
//             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
//                const file = e.target.files[0];
//                if (file) {
//                  setLogoFile(file);
//                  setLogoPreview(URL.createObjectURL(file));
//                }
//             }} />
//           </div>

//           <div className="grid md:grid-cols-2 gap-10">
//             <div className="space-y-6">
//               <Header icon={<User size={16}/>} title="Owner Info" />
//               <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} required />
//               <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
//               <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
//               <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
//             </div>

//             <div className="space-y-6">
//               <Header icon={<Store size={16}/>} title="Shop Info" />
//               <Input label="Shop Name" name="shop_name" value={form.shop_name} onChange={handleChange} required />
//               <Input label="Location" name="location" value={form.location} onChange={handleChange} required />
//               <Input label="CNIC / ID" name="cnic" value={form.cnic} onChange={handleChange} />
//               <div className="space-y-1">
//                 <label className="text-[11px] font-bold text-[#8C8176] uppercase ml-1">Bio</label>
//                 <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] h-28 resize-none text-sm outline-none focus:border-[#C25135]" />
//               </div>
//             </div>
//           </div>

//           {/* Specialties Section */}
//           <div className="space-y-6 bg-[#FAF8F5] p-8 rounded-[2rem] border border-[#E8E2D9]">
//             <Header icon={<Briefcase size={16}/>} title="What do you sell?" />
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//               {CATEGORY_LIST.map(cat => (
//                 <button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${selectedCategories.includes(cat) ? 'bg-[#C25135] text-white border-[#C25135]' : 'bg-white text-[#6B5F52] border-[#D1C7BD] hover:border-[#C25135]'}`}>
//                   {cat} {selectedCategories.includes(cat) && <Check size={14} />}
//                 </button>
//               ))}
//             </div>

//             <div className="pt-4 border-t border-[#E8E2D9]">
//               <label className="text-[11px] font-bold text-[#8C8176] uppercase block mb-2">Other specialty</label>
//               <div className="flex gap-2">
//                 <input value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} onKeyDown={handleAddCustom} placeholder="Type specialty..." className="flex-1 px-5 py-3 rounded-xl border border-[#D1C7BD] text-sm outline-none focus:border-[#C25135]" />
//                 <button type="button" onClick={handleAddCustom} className="bg-[#4A3F35] text-white px-6 rounded-xl font-bold">Add</button>
//               </div>
//             </div>

//             {selectedCategories.length > 0 && (
//               <div className="flex flex-wrap gap-2 pt-4">
//                 {selectedCategories.map(cat => (
//                   <span key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#C25135] text-[10px] font-black rounded-lg border border-[#E8E2D9] shadow-sm">
//                     {cat.toUpperCase()} <X size={12} className="cursor-pointer" onClick={() => toggleCategory(cat)} />
//                   </span>
//                 ))}
//               </div>
//             )}
//           </div>

//           <button type="submit" disabled={loading} className="w-full bg-[#C25135] text-white py-6 rounded-2xl font-bold text-lg hover:bg-[#A6412A] shadow-xl shadow-[#C25135]/20 disabled:opacity-50">
//             {loading ? 'Processing...' : 'Complete Registration'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Simple UI Helpers
// const Header = ({ icon, title }) => (
//   <div className="flex items-center gap-2 border-b border-[#F0EBE5] pb-2">
//     <span className="text-[#C25135]">{icon}</span>
//     <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8176]">{title}</h2>
//   </div>
// );

// const Input = ({ label, ...props }) => (
//   <div className="space-y-1.5">
//     <label className="text-[11px] font-bold text-[#8C8176] uppercase ml-1 tracking-wider">{label}</label>
//     <input {...props} className="w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D9] focus:border-[#C25135] outline-none text-sm transition-all" />
//   </div>
// );

// export default VendorRegister;  










import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Camera, Plus, X, Store, User, 
  MapPin, Briefcase, ChevronRight, UploadCloud, Check 
} from 'lucide-react';

const CATEGORY_LIST = [
  "Clothing & Apparel", "Handmade Crafts", "Jewelry & Accessories", 
  "Home & Living", "Beauty & Care", "Organic Grocery", 
  "Footwear", "Art & Paintings", "Furniture", "Electronics"
];

const VendorRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', phone: '', 
    address: '', shop_name: '', shop_slug: '', bio: '', 
    location: '', cnic: ''
  });

  const [errors, setErrors] = useState({}); // Track validation errors
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // --- Validation Logic ---
  const validateForm = () => {
    let newErrors = {};

    // Full Name
    if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
    else if (form.full_name.length < 3) newErrors.full_name = "Name is too short";

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email format";

    // Password
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    // Phone (Simple numeric check)
    const phoneRegex = /^[0-9+]{10,15}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = "Invalid phone number (10-15 digits)";
    }

    // Shop Name
    if (!form.shop_name.trim()) newErrors.shop_name = "Shop name is required";

    // Bio
    if (!form.bio.trim()) newErrors.bio = "Please write a short bio";
    else if (form.bio.length < 20) newErrors.bio = "Bio should be at least 20 characters";

    // Location
    if (!form.location.trim()) newErrors.location = "Shop location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    if (name === 'shop_name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setForm(prev => ({ ...prev, shop_slug: slug }));
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAddCustom = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && customCategory.trim()) {
      e.preventDefault();
      const val = customCategory.trim();
      if (!selectedCategories.includes(val)) {
        setSelectedCategories([...selectedCategories, val]);
        setCustomCategory('');
        toast.success("Added specialty");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Run Validations
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one specialty");
      return;
    }

    setLoading(true);
    const loadToast = toast.loading('Registering your shop...');

    try {
      // 2. SIGN UP
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.full_name,
            phone: form.phone,
            address: form.address,
            shop_name: form.shop_name,
            shop_slug: form.shop_slug,
            bio: form.bio,
            location: form.location,
            cnic: form.cnic
          }
        }
      });

      if (authError) {
        const msg = authError.message || '';
        if (msg.toLowerCase().includes('rate limit') || (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('limit'))) {
          throw new Error('Email service is busy. Please wait a few minutes before trying again.');
        }
        throw authError;
      }
      const user = authData.user;

      // 3. Create profile & vendor_profiles
      await supabase.from('profiles').upsert({
        id: user.id,
        role: 'vendor',
        full_name: form.full_name,
      });
      await supabase.from('vendor_profiles').upsert({
        id: user.id,
        shop_name: form.shop_name,
        shop_slug: form.shop_slug,
        bio: form.bio,
        location: form.location,
        cnic: form.cnic,
        status: 'pending',
      });

      // 4. LOGO UPLOAD
      if (logoFile && user) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `logos/${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('vendor-assets')
          .upload(filePath, logoFile, {
            contentType: logoFile.type,
            upsert: true
          });

        if (!uploadError) {
          const { data } = supabase.storage.from('vendor-assets').getPublicUrl(filePath);
          await supabase.from('vendor_profiles').update({ shop_logo_url: data.publicUrl }).eq('id', user.id);
        }
      }

      toast.success('Registration Complete!', { id: loadToast });
      
      // Clear Form
      setForm({ full_name: '', email: '', password: '', phone: '', address: '', shop_name: '', shop_slug: '', bio: '', location: '', cnic: '' });
      setLogoPreview(null);
      setSelectedCategories([]);
      setErrors({});

      navigate('/vendor/dashboard');
    } catch (err) {
      toast.error(err.message || "Failed to register", { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 text-[#4A3F35]">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-[#E8E2D9] shadow-2xl overflow-hidden">
        
        <div className="bg-[#C25135] p-10 text-white relative">
          <h1 className="text-4xl font-bold tracking-tight">Vendor Registration</h1>
          <p className="text-[#FADCD3] mt-2 text-lg italic">Join our artisan community.</p>
          <Store className="absolute right-8 bottom-8 text-white/10 w-32 h-32" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12" noValidate>
          
          {/* Logo Upload */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current.click()}
              className={`group relative w-32 h-32 rounded-full border-4 ${errors.logo ? 'border-red-400' : 'border-[#FDFBF7]'} shadow-lg flex items-center justify-center cursor-pointer hover:border-[#C25135] transition-all bg-[#FAF8F5] overflow-hidden`}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto text-[#D1C7BD] mb-1" />
                  <span className="text-[10px] font-bold uppercase text-[#A89E94]">Shop Logo</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
               const file = e.target.files[0];
               if (file) {
                 if (file.size > 2 * 1024 * 1024) return toast.error("File size must be less than 2MB");
                 setLogoFile(file);
                 setLogoPreview(URL.createObjectURL(file));
               }
            }} />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <Header icon={<User size={16}/>} title="Owner Info" />
              <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} error={errors.full_name} required />
              <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} required />
              <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} required />
              <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            </div>

            <div className="space-y-6">
              <Header icon={<Store size={16}/>} title="Shop Info" />
              <Input label="Shop Name" name="shop_name" value={form.shop_name} onChange={handleChange} error={errors.shop_name} required />
              <Input label="Location" name="location" value={form.location} onChange={handleChange} error={errors.location} required />
              <Input label="CNIC / ID" name="cnic" value={form.cnic} onChange={handleChange} />
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#8C8176] uppercase ml-1">Bio</label>
                <textarea 
                  name="bio" 
                  value={form.bio} 
                  onChange={handleChange} 
                  className={`w-full p-4 rounded-2xl bg-[#FAF8F5] border ${errors.bio ? 'border-red-400' : 'border-[#E8E2D9]'} h-28 resize-none text-sm outline-none focus:border-[#C25135] transition-all`}
                  placeholder="Tell customers about your craftsmanship..."
                />
                {errors.bio && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.bio}</p>}
              </div>
            </div>
          </div>

          {/* Specialties Section */}
          <div className="space-y-6 bg-[#FAF8F5] p-8 rounded-[2rem] border border-[#E8E2D9]">
            <Header icon={<Briefcase size={16}/>} title="What do you sell?" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORY_LIST.map(cat => (
                <button key={cat} type="button" onClick={() => toggleCategory(cat)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold transition-all border ${selectedCategories.includes(cat) ? 'bg-[#C25135] text-white border-[#C25135]' : 'bg-white text-[#6B5F52] border-[#D1C7BD] hover:border-[#C25135]'}`}>
                  {cat} {selectedCategories.includes(cat) && <Check size={14} />}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E2D9]">
              <label className="text-[11px] font-bold text-[#8C8176] uppercase block mb-2">Other specialty</label>
              <div className="flex gap-2">
                <input value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} onKeyDown={handleAddCustom} placeholder="Type specialty..." className="flex-1 px-5 py-3 rounded-xl border border-[#D1C7BD] text-sm outline-none focus:border-[#C25135]" />
                <button type="button" onClick={handleAddCustom} className="bg-[#4A3F35] text-white px-6 rounded-xl font-bold">Add</button>
              </div>
            </div>

            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {selectedCategories.map(cat => (
                  <span key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#C25135] text-[10px] font-black rounded-lg border border-[#E8E2D9] shadow-sm">
                    {cat.toUpperCase()} <X size={12} className="cursor-pointer" onClick={() => toggleCategory(cat)} />
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#C25135] text-white py-6 rounded-2xl font-bold text-lg hover:bg-[#A6412A] shadow-xl shadow-[#C25135]/20 disabled:opacity-50 transition-all active:scale-[0.98]">
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

// UI Helpers
const Header = ({ icon, title }) => (
  <div className="flex items-center gap-2 border-b border-[#F0EBE5] pb-2">
    <span className="text-[#C25135]">{icon}</span>
    <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8176]">{title}</h2>
  </div>
);

const Input = ({ label, error, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-[#8C8176] uppercase ml-1 tracking-wider">{label}</label>
    <input 
      {...props} 
      className={`w-full px-4 py-3.5 rounded-xl bg-[#FAF8F5] border ${error ? 'border-red-400' : 'border-[#E8E2D9]'} focus:border-[#C25135] outline-none text-sm transition-all shadow-sm`} 
    />
    {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
  </div>
);

export default VendorRegister;