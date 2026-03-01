



import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../src/lib/supabase'; // Import your supabase client
import {
  createHomeBanner,
  listAllHomeBanners,
  deleteHomeBanner,
} from '../services/supabase/home';
import {
  listAllSiteBanners,
  getSiteSetting,
  updateSiteSetting,
} from '../services/supabase/site';
import { listAllVendors } from '../services/supabase/profiles';
import { fetchProducts } from '../services/supabase/products';
import { fetchAllOrders, updateOrderStatus } from '../services/supabase/orders';
import { fetchAllSupportQueries, replyToSupportQuery } from '../services/supabase/support';
import { toast } from 'react-toastify';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  Loader2,
  Trash2,
  DollarSign,
  TrendingUp,
  Send,
  Plus,
  Upload,
  Eye,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Data State
  const [banners, setBanners] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [queries, setQueries] = useState([]);
  const [navbarBanner, setNavbarBanner] = useState({ enabled: false, text: '', link: '' });
  
  // Carousel Form State
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    cta_label: '',
    cta_link: '',
    badge: '',
    highlight: ''
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [b, v, prods, ords, q, nb] = await Promise.all([
        listAllHomeBanners(),
        listAllVendors(),
        fetchProducts({ includeAllStatus: true }),
        fetchAllOrders(),
        fetchAllSupportQueries(),
        getSiteSetting('navbar_banner'),
      ]);

      setBanners(b || []);
      setVendors(v || []);
      setProducts(Array.isArray(prods) ? prods : []);
      setOrders(ords || []);
      setQueries(q || []);
      setNavbarBanner(nb || { enabled: false, text: '', link: '' });
    } catch (e) {
      console.error(e);
      toast.error('Failed to sync administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Image Upload Logic ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `carousel/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('banners').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // --- Actions ---
  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error('Please select an image');
    
    setUploading(true);
    try {
      const publicUrl = await uploadImage(selectedFile);
      
      await createHomeBanner({ 
        ...bannerForm, 
        image_url: publicUrl,
        is_active: true 
      });

      setBannerForm({ title: '', subtitle: '', cta_label: '', cta_link: '', badge: '', highlight: '' });
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success('New slide added to carousel');
      loadAllData();
    } catch (e) {
      toast.error('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Remove this slide from the carousel?')) return;
    try {
      await deleteHomeBanner(id);
      loadAllData();
      toast.success('Slide removed');
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      loadAllData();
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleReplyQuery = async (queryId, reply) => {
    if (!reply?.trim()) return;
    try {
      await replyToSupportQuery(queryId, reply);
      toast.success('Reply dispatched');
      loadAllData();
    } catch (e) {
      toast.error('Failed to send reply');
    }
  };

  // const saveNavbarSettings = async () => {
  //   try {
  //     await updateSiteSetting('navbar_banner', navbarBanner);
  //     toast.success('Announcement bar updated');
  //   } catch (e) {
  //     toast.error('Failed to save settings');
  //   }
  // };

  const saveNavbarSettings = async () => {
  try {
    // This calls updateSiteSetting from your site.js
    await updateSiteSetting('navbar_banner', navbarBanner); 
    toast.success('Announcement bar updated');
  } catch (e) {
    console.error(e); // Check the console to see the real error!
    toast.error('Failed to save settings');
  }
};




  // Stats
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'carousel', label: 'Home Carousel', icon: ImageIcon },
    { id: 'announcement', label: 'Announcement', icon: Settings },
    { id: 'support', label: 'Support', icon: MessageSquare },
  ];

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fbfbf9]">
      <Loader2 className="w-10 h-10 animate-spin text-stone-900 mb-4" />
      <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Initializing Terminal...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 font-sans selection:bg-stone-900 selection:text-white">
      {/* Sidebar / Navigation */}
      <div className="max-w-[1600px] mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-10">
            <div className="mb-10 px-2">
              <h1 className="text-2xl font-black tracking-tighter uppercase">Nexus <span className="text-stone-400">Admin</span></h1>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mt-1">Management Portal</p>
            </div>
            
            <nav className="space-y-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeTab === t.id
                      ? 'bg-stone-900 text-white shadow-lg shadow-stone-200'
                      : 'text-stone-400 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <header>
                  <h2 className="text-3xl font-black tracking-tight">System Overview</h2>
                  <p className="text-stone-500 text-sm font-medium">Real-time platform performance and metrics.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard label="Gross Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-50 text-emerald-600" />
                  <StatsCard label="Total Sales" value={orders.length} icon={ShoppingCart} color="bg-blue-50 text-blue-600" />
                  <StatsCard label="Active Vendors" value={vendors.length} icon={Users} color="bg-purple-50 text-purple-600" />
                  <StatsCard label="Catalog Items" value={products.length} icon={Package} color="bg-orange-50 text-orange-600" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="font-black text-stone-900 uppercase tracking-widest text-[11px]">Stream: Recent Orders</h3>
                      <button className="text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-widest flex items-center gap-1">
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="flex items-center justify-between p-5 bg-stone-50 rounded-[1.5rem] hover:bg-stone-100/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-stone-100 shadow-sm">
                              <ShoppingCart className="w-4 h-4 text-stone-400" />
                            </div>
                            <div>
                              <p className="font-black text-stone-900 text-xs tracking-tight">ORD-{o.id.slice(0, 5).toUpperCase()}</p>
                              <p className="text-[10px] font-bold text-stone-400 uppercase">{new Date(o.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-stone-900 text-sm">Rs. {o.total}</p>
                            <span className="text-[9px] font-black uppercase text-emerald-500 tracking-tighter">{o.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-stone-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                      <h3 className="font-black text-stone-400 uppercase tracking-widest text-[11px] mb-8">Operational Status</h3>
                      <div className="space-y-8">
                        <div>
                          <p className="text-3xl font-black">{pendingOrders}</p>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.15em] mt-1">Pending Shipping</p>
                        </div>
                        <div>
                          <p className="text-3xl font-black">{queries.filter(q => q.status === 'open').length}</p>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.15em] mt-1">Support Tickets</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-12 relative z-10">
                      <button className="w-full py-4 bg-white/10 hover:bg-white/20 transition-colors rounded-2xl text-[10px] font-black uppercase tracking-widest">Generate Report</button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase">Global Stream</h2>
                    <p className="text-stone-400 text-xs font-bold mt-1 uppercase tracking-widest">Order Fulfillment Center</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] border-b border-stone-100">
                        <th className="pb-6 px-4">Identifier</th>
                        <th className="pb-6 px-4">Source Email</th>
                        <th className="pb-6 px-4">Fulfillment</th>
                        <th className="pb-6 px-4">Settlement</th>
                        <th className="pb-6 px-4 text-right">Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {orders.map((o) => (
                        <tr key={o.id} className="text-sm hover:bg-stone-50/50 transition-colors group">
                          <td className="py-6 px-4 font-black text-stone-900">#{o.id.slice(0, 8)}</td>
                          <td className="py-6 px-4 text-stone-500 font-medium">{o.guest_email || 'Verified User'}</td>
                          <td className="py-6 px-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-6 px-4 font-black text-stone-900">Rs. {o.total}</td>
                          <td className="py-6 px-4 text-right">
                            <select 
                              value={o.status} 
                              onChange={(e) => handleOrderStatus(o.id, e.target.value)}
                              className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 ring-stone-900/5"
                            >
                              <option value="pending">Hold</option>
                              <option value="confirmed">Confirm</option>
                              <option value="shipped">Ship</option>
                              <option value="delivered">Deliver</option>
                              <option value="cancelled">Void</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'carousel' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Form */}
                  <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm">
                    <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">New Slide</h2>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-8">Add visual impact to homepage</p>
                    
                    <form onSubmit={handleCreateBanner} className="space-y-5">
                      {/* Image Upload Area */}
                      <div 
                        onClick={() => fileInputRef.current.click()}
                        className="group relative h-48 w-full border-2 border-dashed border-stone-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-stone-900 transition-all overflow-hidden"
                      >
                        {previewUrl ? (
                          <>
                            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="text-white w-6 h-6" />
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-stone-300 group-hover:text-stone-900 transition-colors mb-2" />
                            <p className="text-[10px] font-black text-stone-400 group-hover:text-stone-900 uppercase tracking-[0.2em]">Select 16:9 Image</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileSelect} 
                          className="hidden" 
                          accept="image/*"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Headline" value={bannerForm.title} onChange={v => setBannerForm({...bannerForm, title: v})} placeholder="e.g. Summer Drop" />
                        <Input label="Highlight Word" value={bannerForm.highlight} onChange={v => setBannerForm({...bannerForm, highlight: v})} placeholder="e.g. 2024" />
                      </div>
                      <Input label="Subtitle" value={bannerForm.subtitle} onChange={v => setBannerForm({...bannerForm, subtitle: v})} placeholder="Brief description..." />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Button Text" value={bannerForm.cta_label} onChange={v => setBannerForm({...bannerForm, cta_label: v})} placeholder="Shop Now" />
                        <Input label="Button Link" value={bannerForm.cta_link} onChange={v => setBannerForm({...bannerForm, cta_link: v})} placeholder="/collection" />
                      </div>

                      <button 
                        disabled={uploading}
                        type="submit" 
                        className="w-full py-5 bg-stone-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-50 transition-all shadow-xl"
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Commit to Carousel
                      </button>
                    </form>
                  </div>

                  {/* Preview Section */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em]">Live Preview</h3>
                    <div className="bg-stone-900 aspect-[16/9] rounded-[2.5rem] overflow-hidden relative flex items-center px-12 text-white">
                      {previewUrl || bannerForm.title ? (
                         <>
                          {previewUrl && <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />}
                          <div className="relative z-10 space-y-4">
                             <div className="space-y-1">
                                <h4 className="text-4xl font-black leading-none">{bannerForm.title} <span className="text-stone-400">{bannerForm.highlight}</span></h4>
                                <p className="text-sm opacity-80 max-w-xs">{bannerForm.subtitle || 'Your subtitle will appear here'}</p>
                             </div>
                             <div className="inline-block px-6 py-3 border border-white text-[10px] font-black uppercase tracking-widest">
                                {bannerForm.cta_label || 'Action Label'}
                             </div>
                          </div>
                         </>
                      ) : (
                        <div className="w-full text-center text-stone-600 font-bold uppercase tracking-widest text-[10px]">
                          Enter data to see preview
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-white p-6 rounded-[2rem] border border-stone-100">
                       <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Active Slides ({banners.length})</h3>
                       <div className="space-y-3">
                          {banners.map(b => (
                            <div key={b.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl group">
                               <div className="flex items-center gap-3">
                                  <img src={b.image_url} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                  <p className="text-xs font-black text-stone-900">{b.title}</p>
                               </div>
                               <button 
                                onClick={() => handleDeleteBanner(b.id)}
                                className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'announcement' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-10">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm">
                  <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">Announcement Bar</h2>
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-10">Top-of-site global messaging</p>
                  
                  <div className="space-y-8">
                    {/* Visual Preview */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Live Visual</label>
                      <div className={`w-full py-3 px-6 transition-all rounded-xl flex items-center justify-center gap-4 ${navbarBanner.enabled ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-400 opacity-50'}`}>
                         <p className="text-[11px] font-bold tracking-wide italic">
                            {navbarBanner.text || 'Write an announcement message...'}
                         </p>
                         {navbarBanner.link && <ExternalLink className="w-3 h-3 opacity-50" />}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-stone-50 rounded-[2rem]">
                      <div>
                        <p className="text-sm font-black uppercase tracking-tight">Display Messaging</p>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Toggle visibility on frontend</p>
                      </div>
                      <button 
                        onClick={() => setNavbarBanner({...navbarBanner, enabled: !navbarBanner.enabled})}
                        className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${navbarBanner.enabled ? 'bg-stone-900 shadow-inner' : 'bg-stone-200'}`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${navbarBanner.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Message" 
                        value={navbarBanner.text} 
                        onChange={v => setNavbarBanner({...navbarBanner, text: v})} 
                        placeholder="e.g. Free delivery on orders above Rs. 2000" 
                      />
                      <Input 
                        label="Click Action (Link)" 
                        value={navbarBanner.link} 
                        onChange={v => setNavbarBanner({...navbarBanner, link: v})} 
                        placeholder="e.g. /shop" 
                      />
                    </div>

                    <button 
                      onClick={saveNavbarSettings}
                      className="w-full py-5 bg-stone-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-stone-800 transition-all"
                    >
                      Update Site Banner
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Rest of the Tabs (Vendors, Products, Support) updated with same UI aesthetic */}
            {activeTab === 'vendors' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-2xl font-black tracking-tighter uppercase">Vendor Directory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {vendors.map(v => (
                     <div key={v.id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col justify-between items-start">
                        <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center font-black text-stone-300 text-xs mb-6 border border-stone-100 uppercase">
                          {v.shop_name?.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-black text-stone-900 text-lg leading-tight mb-1">{v.shop_name}</h4>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{v.location || 'Remote'}</p>
                        </div>
                        <div className="mt-8 flex items-center justify-between w-full">
                           <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-[0.1em] ${v.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                             {v.status}
                           </span>
                           <button className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">Manage</button>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm">
                 <h2 className="text-2xl font-black tracking-tighter uppercase mb-10">Master Inventory</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map(p => (
                      <div key={p.id} className="group cursor-pointer">
                        <div className="aspect-[3/4] rounded-[1.5rem] bg-stone-100 overflow-hidden mb-4 relative">
                          <img src={p.images?.[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt="" />
                          <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[8px] font-black uppercase">Rs.{p.price}</div>
                        </div>
                        <h5 className="font-black text-[11px] text-stone-900 uppercase tracking-tight truncate">{p.name}</h5>
                        <p className="text-[9px] font-bold text-stone-400 uppercase mt-0.5 tracking-widest">{p.category || 'General'}</p>
                      </div>
                    ))}
                 </div>
               </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
                 <h2 className="text-2xl font-black tracking-tighter uppercase mb-10">Support Inbox</h2>
                 {queries.length === 0 ? (
                   <div className="bg-white rounded-[3rem] py-32 flex flex-col items-center justify-center border border-stone-100">
                      <div className="w-16 h-16 bg-stone-50 rounded-3xl flex items-center justify-center mb-6">
                        <MessageSquare className="w-6 h-6 text-stone-200" />
                      </div>
                      <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.25em]">No active communications</p>
                   </div>
                 ) : (
                   queries.map(q => (
                     <div key={q.id} className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex gap-4 items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <div>
                               <h4 className="font-black text-stone-900 uppercase tracking-tight text-lg">{q.subject}</h4>
                               <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">{q.guest_email} • {new Date(q.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${q.status === 'open' ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'}`}>
                            {q.status}
                          </span>
                        </div>
                        
                        <div className="p-6 bg-stone-50 rounded-2xl mb-8 border-l-4 border-stone-200">
                          <p className="text-stone-700 text-sm font-medium leading-relaxed italic">"{q.message}"</p>
                        </div>

                        {q.admin_reply ? (
                          <div className="bg-stone-900 text-white p-6 rounded-2xl">
                             <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Platform Response</p>
                             <p className="text-sm font-medium opacity-90">{q.admin_reply}</p>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                             <input 
                               id={`reply-${q.id}`}
                               placeholder="Draft response..." 
                               className="flex-1 bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-2 ring-stone-900/5"
                             />
                             <button 
                               onClick={() => {
                                 const val = document.getElementById(`reply-${q.id}`).value;
                                 handleReplyQuery(q.id, val);
                               }}
                               className="bg-stone-900 text-white px-8 rounded-2xl hover:bg-stone-800 transition-colors"
                             >
                               <Send className="w-4 h-4" />
                             </button>
                          </div>
                        )}
                     </div>
                   ))
                 )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Reusable Sub-components ---

const StatsCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${color} shadow-sm`}><Icon className="w-5 h-5" /></div>
      <TrendingUp className="w-4 h-4 text-stone-200 group-hover:text-stone-900 transition-colors" />
    </div>
    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em] mb-1">{label}</p>
    <h3 className="text-2xl font-black text-stone-900 tracking-tight">{value}</h3>
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-5 py-4 bg-stone-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:border-stone-900/10 focus:bg-white transition-all"
    />
  </div>
);

export default AdminDashboard;