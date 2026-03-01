import React, { useEffect, useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';
import {
  Package, TrendingUp, AlertCircle, Plus, Image as ImageIcon,
  Loader2, CheckCircle2, Tags, Edit3, Trash2, X, BarChart3, 
  DollarSign, Archive, ArrowUpRight, Camera, Search,
  LayoutGrid, List, ChevronRight, Filter, Percent, Info
} from 'lucide-react';

const VendorDashboard = () => {
  const { user, vendorProfile } = useContext(ShopContext);
  
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // UI States
  const [viewMode, setViewMode] = useState('grid'); 
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    selectedCategories: [], 
    customCategories: [],   
    newCategoryName: '',    
    sizes: '',
    stock: 100,
    discount_percent: '', 
    discount_price: '',
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // --- 1. DATA FETCHING (SUPABASE SYNC) ---
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch Products
      const { data: prodRes } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch Orders specifically containing this vendor's items (Schema Sync)
      const { data: orderItemsRes } = await supabase
        .from('order_items')
        .select('*, orders(*)')
        .eq('vendor_id', user.id);

      // Fetch Categories
      const { data: catRes } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      setProducts(prodRes || []);
      setVendorOrders(orderItemsRes || []);
      setCategories(catRes || []);
    } catch (e) {
      console.error("Supabase Sync Error:", e);
      toast.error('Database Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  // --- 2. SEARCH & PERFORMANCE LOGIC ---
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const performance = useMemo(() => {
    const revenue = vendorOrders.reduce((acc, item) => acc + (item.price_at_order * item.quantity), 0);
    const lowStock = products.filter(p => p.stock < 10).length;
    const totalSold = products.reduce((acc, p) => acc + (p.sold_count || 0), 0);
    return { revenue, lowStock, totalSold, liveCount: products.length };
  }, [products, vendorOrders]);

  // --- 3. FORM HANDLERS ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updatedForm = { ...prev, [name]: value };
      if (name === 'discount_percent' || name === 'price') {
        const p = parseFloat(name === 'price' ? value : updatedForm.price);
        const pct = parseFloat(name === 'discount_percent' ? value : updatedForm.discount_percent);
        if (p > 0 && pct > 0) {
          updatedForm.discount_price = Math.round(p - (p * (pct / 100)));
        } else {
          updatedForm.discount_price = ''; 
        }
      }
      return updatedForm;
    });
  };

  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = form.newCategoryName.trim();
      if (val && !form.customCategories.includes(val)) {
        setForm(prev => ({
          ...prev,
          customCategories: [...prev.customCategories, val],
          newCategoryName: ''
        }));
      }
    }
  };

  const toggleCategory = (catId) => {
    setForm(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(catId)
        ? prev.selectedCategories.filter(id => id !== catId)
        : [...prev.selectedCategories, catId]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    if (files.length === 0) return;
    setImageFiles(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  // --- 4. SUBMISSION LOGIC (COMPULSORY IMAGES) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    // VALIDATION
    if (imagePreviews.length === 0) {
      toast.error("At least one product image is compulsory!");
      return;
    }
    if (form.selectedCategories.length === 0 && form.customCategories.length === 0) {
      toast.error("Please select or add a category");
      return;
    }

    setSubmitting(true);
    try {
      let finalCategoryIds = [...form.selectedCategories];

      // Create new categories if typed
      if (form.customCategories.length > 0) {
        for (const catName of form.customCategories) {
          const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const { data: existing } = await supabase.from('categories').select('id').eq('slug', slug).single();
          if (existing) {
            if (!finalCategoryIds.includes(existing.id)) finalCategoryIds.push(existing.id);
          } else {
            const { data: newCat } = await supabase.from('categories').insert([{ name: catName, slug }]).select().single();
            if (newCat) finalCategoryIds.push(newCat.id);
          }
        }
      }

      // Upload Images to bucket: 'vendor-assets'
      let imageUrls = editingProduct ? editingProduct.images : [];
      if (imageFiles.length > 0) {
        const uploaded = [];
        for (const file of imageFiles) {
          const path = `products/${user.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from('vendor-assets').upload(path, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('vendor-assets').getPublicUrl(path);
          uploaded.push(data.publicUrl);
        }
        imageUrls = uploaded;
      }

      const productPayload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category_id: finalCategoryIds[0], // Schema Sync: primary category
        images: imageUrls, // Schema Sync: ARRAY
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()) : [], // Schema Sync: ARRAY
        stock: parseInt(form.stock),
        discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
        vendor_id: user.id,
        status: 'active'
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productPayload).eq('id', editingProduct.id);
        if (error) throw error;
        toast.success('Inventory Updated');
      } else {
        const { error } = await supabase.from('products').insert([productPayload]);
        if (error) throw error;
        toast.success('Product is Live');
      }

      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (p) => {
    const percent = p.discount_price ? Math.round(((p.price - p.discount_price) / p.price) * 100) : '';
    setEditingProduct(p);
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      selectedCategories: [p.category_id], customCategories: [], newCategoryName: '',
      sizes: p.sizes?.join(', ') || '', stock: p.stock,
      discount_percent: percent, discount_price: p.discount_price || '',
    });
    setImagePreviews(p.images || []);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', selectedCategories: [], customCategories: [], newCategoryName: '', sizes: '', stock: 100, discount_percent: '', discount_price: '' });
    setEditingProduct(null); setImageFiles([]); setImagePreviews([]); setShowAddForm(false);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-stone-900 w-12 h-12" /></div>;

  return (
    <div className="py-8 bg-[#fbfbf9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* --- PERFORMANCE ANALYTICS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Revenue', val: `Rs. ${performance.revenue.toLocaleString()}`, icon: DollarSign, bg: 'bg-emerald-50 text-emerald-600' },
            { label: 'Live Store', val: performance.liveCount, icon: Package, bg: 'bg-stone-900 text-white' },
            { label: 'Items Sold', val: performance.totalSold, icon: TrendingUp, bg: 'bg-blue-50 text-blue-600' },
            { label: 'Low Stock', val: performance.lowStock, icon: AlertCircle, bg: 'bg-red-50 text-red-600' }
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-stone-100 flex items-center gap-4">
               <div className={`p-3 rounded-2xl ${s.bg}`}><s.icon className="w-5 h-5" /></div>
               <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-xl font-black text-stone-900">{s.val}</h3>
               </div>
            </div>
          ))}
        </div>

        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-black text-stone-900 tracking-tight">{vendorProfile?.shop_name || 'My Shop'}</h1>
            <p className="text-stone-500 font-medium tracking-wide">Syncing with Supabase Production Table</p>
          </div>
          <div className="flex bg-stone-100 p-1.5 rounded-2xl gap-2 shadow-inner">
            {['products', 'orders'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-stone-900 shadow-md' : 'text-stone-400 hover:text-stone-600'}`}>{t}</button>
            ))}
          </div>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* --- SEARCH & VIEW SWITCHER --- */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-stone-100 shadow-sm">
               <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input type="text" placeholder="Search my inventory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-xl outline-none border-0 text-sm font-bold" />
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex bg-stone-50 p-1 rounded-xl border border-stone-100">
                     <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}><LayoutGrid className="w-4 h-4" /></button>
                     <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}><List className="w-4 h-4" /></button>
                  </div>
                  <button onClick={() => { resetForm(); setShowAddForm(true); }} className="bg-stone-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-black tracking-widest shadow-xl"><Plus className="w-4 h-4" /> NEW LISTING</button>
               </div>
            </div>

            {/* --- PRODUCT GRID --- */}
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                  {filteredProducts.map((p) => {
                    const discount = p.discount_price ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;
                    return (
                      <motion.div layout key={p.id} className="group bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                        <div className="aspect-[4/5] bg-stone-50 relative overflow-hidden">
                          {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" /> : <div className="h-full flex items-center justify-center text-stone-200"><ImageIcon className="w-16 h-16" /></div>}
                          
                          {/* DISCOUNT BANNER */}
                          {discount > 0 && (
                            <div className="absolute top-5 right-5 bg-terracotta-500 text-white p-3 rounded-2xl shadow-xl flex flex-col items-center border-2 border-white/20">
                               <Percent className="w-3 h-3" />
                               <span className="text-xs font-black">{discount}% OFF</span>
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-5 group-hover:translate-y-0">
                             <button onClick={() => openEdit(p)} className="p-4 bg-white rounded-2xl shadow-xl text-stone-900 hover:bg-stone-900 hover:text-white transition-all"><Edit3 className="w-5 h-5" /></button>
                             <button onClick={async () => { if(confirm('Delete?')) { await supabase.from('products').delete().eq('id', p.id); loadData(); }}} className="p-4 bg-white rounded-2xl shadow-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </div>
                        <div className="p-8">
                           <h3 className="font-bold text-stone-900 text-xl truncate mb-1">{p.name}</h3>
                           <div className="flex items-center gap-3">
                              <p className="text-2xl font-black text-stone-900">Rs. {p.discount_price || p.price}</p>
                              {p.discount_price && <p className="text-sm text-stone-400 line-through">Rs. {p.price}</p>}
                           </div>
                           <div className="mt-4 pt-4 border-t border-stone-50 flex justify-between items-center">
                              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{categories.find(c => c.id === p.category_id)?.name || 'Uncategorized'}</span>
                              <div className={`px-2 py-1 rounded text-[10px] font-black ${p.stock < 10 ? 'text-red-500 bg-red-50' : 'text-stone-400 bg-stone-50'}`}>STOCK: {p.stock}</div>
                           </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm overflow-hidden">
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="bg-stone-50 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                               <th className="px-8 py-6">Product</th>
                               <th className="px-8 py-6">Price Details</th>
                               <th className="px-8 py-6">Stock</th>
                               <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-stone-50">
                            {filteredProducts.map(p => {
                               const disc = p.discount_price ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;
                               return (
                                <tr key={p.id} className="hover:bg-stone-50/50">
                                   <td className="px-8 py-4 flex items-center gap-4">
                                      <img src={p.images?.[0]} className="w-12 h-12 rounded-xl object-cover" />
                                      <span className="font-bold text-stone-900">{p.name}</span>
                                   </td>
                                   <td className="px-8 py-4">
                                      <div className="flex items-center gap-2">
                                         <span className="font-black text-stone-900">Rs. {p.discount_price || p.price}</span>
                                         {disc > 0 && <span className="text-[9px] font-black bg-terracotta-50 text-terracotta-600 px-2 py-0.5 rounded">-{disc}%</span>}
                                      </div>
                                   </td>
                                   <td className="px-8 py-4 font-black text-stone-500">{p.stock} units</td>
                                   <td className="px-8 py-4 text-right">
                                      <div className="flex justify-end gap-2">
                                         <button onClick={() => openEdit(p)} className="p-2 text-stone-400 hover:text-stone-900"><Edit3 className="w-4 h-4" /></button>
                                         <button onClick={async () => { if(confirm('Delete?')) { await supabase.from('products').delete().eq('id', p.id); loadData(); }}} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                      </div>
                                   </td>
                                </tr>
                               )
                            })}
                         </tbody>
                      </table>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- ADD/EDIT MODAL --- */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl relative">
                    <button onClick={resetForm} className="absolute top-8 right-8 p-3 hover:bg-stone-100 rounded-full z-10"><X /></button>
                    <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar">
                      <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">{editingProduct ? 'Edit Listing' : 'New Listing Specs'}</h2>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Product Name *</label>
                              <input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. Premium Cotton Kurta" className="w-full px-6 py-4 bg-stone-50 border-0 rounded-2xl font-bold outline-none" required />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Base Price (PKR) *</label>
                                 <input name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="Rs. 0" className="w-full px-6 py-4 bg-stone-50 rounded-2xl font-bold outline-none" required />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-terracotta-500 uppercase tracking-widest">Discount %</label>
                                 <input name="discount_percent" type="number" value={form.discount_percent} onChange={handleFormChange} placeholder="e.g. 20" className="w-full px-6 py-4 bg-terracotta-50/20 border-2 border-terracotta-100 rounded-2xl font-black text-terracotta-600 outline-none" />
                              </div>
                           </div>

                           {form.discount_price && (
                             <div className="bg-stone-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-xl">
                                <div><p className="text-[10px] font-black opacity-60">Listing Price</p><p className="text-2xl font-black italic">Rs. {form.discount_price}</p></div>
                                <div className="bg-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black">-{form.discount_percent}%</div>
                             </div>
                           )}

                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Category Logic *</label>
                              <div className="flex flex-wrap gap-2 mb-3">
                                 {form.customCategories.map(cat => (
                                    <span key={cat} className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2">
                                       {cat} <X className="w-3 h-3 cursor-pointer" onClick={() => setForm(prev => ({...prev, customCategories: prev.customCategories.filter(c => c !== cat)}))} />
                                    </span>
                                 ))}
                              </div>
                              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                 {categories.map(cat => (
                                   <div key={cat.id} onClick={() => toggleCategory(cat.id)} className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all ${form.selectedCategories.includes(cat.id) ? 'bg-stone-900 text-white' : 'hover:bg-stone-200 text-stone-600'}`}>
                                      <span className="text-xs font-bold">{cat.name}</span>
                                      {form.selectedCategories.includes(cat.id) && <CheckCircle2 className="w-3 h-3" />}
                                   </div>
                                 ))}
                              </div>
                              <input name="newCategoryName" value={form.newCategoryName} onChange={handleFormChange} onKeyDown={handleCategoryKeyDown} placeholder="Type new & hit ENTER" className="w-full px-6 py-4 bg-emerald-50/20 border-2 border-dashed border-emerald-100 rounded-2xl outline-none italic text-sm mt-2" />
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Stock Units</label>
                                 <input name="stock" type="number" value={form.stock} onChange={handleFormChange} className="w-full px-6 py-4 bg-stone-50 rounded-2xl font-bold outline-none" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Sizes (S, M, L...)</label>
                                 <input name="sizes" value={form.sizes} onChange={handleFormChange} placeholder="e.g. S, M, L" className="w-full px-6 py-4 bg-stone-50 rounded-2xl font-bold outline-none" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Media (Compulsory) *</label>
                              <div className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center gap-2 hover:border-stone-400 cursor-pointer bg-stone-50/50 ${imagePreviews.length === 0 ? 'border-red-200 bg-red-50/10' : 'border-stone-100'}`}>
                                 <Camera className={`w-8 h-8 ${imagePreviews.length === 0 ? 'text-red-300' : 'text-stone-300'}`} />
                                 <p className="text-[10px] font-black text-stone-400 uppercase">Click to add at least 1 image</p>
                                 <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                              </div>
                              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                 {imagePreviews.map((src, i) => <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md flex-shrink-0"><img src={src} className="w-full h-full object-cover" /></div>)}
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Description</label>
                              <textarea name="description" value={form.description} onChange={handleFormChange} rows={3} placeholder="Describe the item..." className="w-full px-6 py-4 bg-stone-50 rounded-2xl font-medium outline-none resize-none" />
                           </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6 border-t border-stone-100">
                        <button type="button" onClick={resetForm} className="flex-1 py-5 text-stone-400 font-black uppercase tracking-widest">Discard</button>
                        <button type="submit" disabled={submitting || imagePreviews.length === 0} className={`flex-[2] py-5 text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-all ${imagePreviews.length === 0 ? 'bg-stone-300 cursor-not-allowed' : 'bg-stone-900 active:scale-95'}`}>
                           {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 /> {editingProduct ? 'UPDATE SYNC' : 'PUBLISH LIVE'}</>}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm">
             <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">Live Sales Stream</h2>
                <div className="p-4 bg-stone-900 rounded-2xl text-white font-black text-[10px] tracking-widest uppercase">Supabase Connected</div>
             </div>
             <div className="space-y-4">
                {vendorOrders.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center"><Archive className="w-12 h-12 text-stone-100 mb-4" /><p className="text-stone-300 font-black uppercase tracking-widest">Waiting for first sale...</p></div>
                ) : (
                  vendorOrders.map(item => (
                    <div key={item.id} className="bg-stone-50/50 p-6 rounded-[2rem] flex flex-col lg:flex-row justify-between items-center border border-stone-50 gap-6">
                       <div className="flex items-center gap-6">
                          <img src={item.product_image} className="w-14 h-14 bg-white rounded-2xl object-cover shadow-inner" />
                          <div>
                             <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Order ID: {item.orders?.id?.slice(0, 8)}</p>
                             <p className="font-bold text-stone-800">{item.product_name} <span className="text-stone-400 font-medium text-xs">x{item.quantity}</span></p>
                          </div>
                       </div>
                       <div className="flex items-center gap-10">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-stone-300 uppercase mb-1">Total Earned</p>
                             <p className="text-xl font-black text-stone-900">Rs. {item.price_at_order * item.quantity}</p>
                          </div>
                          <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase ${item.orders?.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{item.orders?.status}</div>
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VendorDashboard;