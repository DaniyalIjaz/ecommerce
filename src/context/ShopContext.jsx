// import { createContext, useEffect, useState, useCallback } from 'react';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabase';
// import { fetchProducts, fetchProductById } from '../services/supabase/products';
// import { createOrder } from '../services/supabase/orders';
// import { fetchCurrentProfile, fetchVendorProfile } from '../services/supabase/profiles';

// export const ShopContext = createContext();

// const CART_STORAGE_KEY = 'ecommerce_cart';
// const WISHLIST_STORAGE_KEY = 'ecommerce_wishlist';

// const ShopContextProvider = (props) => {
//   const currency = 'Rs. ';
//   const delivery_fee = 10;
//   const [search, setSearch] = useState('');
//   const [showSearch, setShowSearch] = useState(false);
//   const [wishlist, setWishlist] = useState(() => {
//     try {
//       const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });
//   const [cartItems, setCartItems] = useState(() => {
//     try {
//       const saved = localStorage.getItem(CART_STORAGE_KEY);
//       return saved ? JSON.parse(saved) : {};
//     } catch {
//       return {};
//     }
//   });
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const [addToCartModal, setAddToCartModal] = useState({ open: false, product: null });
//   const [profile, setProfile] = useState(null);
//   const [vendorProfile, setVendorProfile] = useState(null);
//   const [authModalOpen, setAuthModalOpen] = useState(false);
//   const navigate = useNavigate();

//   const loadProfiles = useCallback(
//     async (authUser) => {
//       if (!authUser) {
//         setProfile(null);
//         setVendorProfile(null);
//         return;
//       }
//       try {
//         let p = await fetchCurrentProfile();

//         // Ensure a profile row exists (best-effort)
//         if (!p && supabase) {
//           const fullName =
//             authUser.user_metadata?.full_name ||
//             authUser.user_metadata?.name ||
//             '';
//           try {
//             await supabase.from('profiles').upsert({
//               id: authUser.id,
//               role: 'buyer',
//               full_name: fullName,
//             });
//           } catch (e) {
//             console.error('Failed to upsert profile', e);
//           }
//           p = await fetchCurrentProfile();
//         }

//         // Auto-assign admin role for specific emails (requested)
//         const adminEmails = ['daniyalijaz922@gmail.com'];
//         if (adminEmails.includes(authUser.email) && supabase) {
//           try {
//             await supabase.from('profiles').upsert({
//               id: authUser.id,
//               role: 'admin',
//               full_name: p?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
//             });
//             p = await fetchCurrentProfile();
//           } catch (e) {
//             console.error('Failed to assign admin role', e);
//           }
//         }

//         setProfile(p);
//         if (p?.role === 'vendor' || p?.role === 'admin') {
//           const vp = await fetchVendorProfile(authUser.id);
//           setVendorProfile(vp);
//         } else {
//           setVendorProfile(null);
//         }
//       } catch (err) {
//         console.error('Failed to load profiles', err);
//         setVendorProfile(null);
//       }
//     },
//     []
//   );

//   // Auth state
//   useEffect(() => {
//     if (!supabase) return;
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       const authUser = session?.user ?? null;
//       setUser(authUser);
//       loadProfiles(authUser);
//     });
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       const authUser = session?.user ?? null;
//       setUser(authUser);
//       loadProfiles(authUser);
//     });
//     return () => subscription?.unsubscribe();
//   }, [loadProfiles]);

//   // Fetch products
//   useEffect(() => {
//     async function load() {
//       try {
//         const data = await fetchProducts();
//         setProducts(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error('Failed to fetch products:', err);
//         toast.error('Failed to load products');
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     }
//     load();
//   }, []);

//   // Persist cart to localStorage
//   useEffect(() => {
//     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Persist wishlist to localStorage
//   useEffect(() => {
//     localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
//   }, [wishlist]);

//   const toggleWishlist = useCallback((productId) => {
//     setWishlist((prev) =>
//       prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
//     );
//   }, []);

//   const isInWishlist = useCallback(
//     (productId) => wishlist.includes(productId),
//     [wishlist]
//   );

//   const getWishlistCount = useCallback(() => wishlist.length, [wishlist]);

//   const addToCart = useCallback((itemId, size, product = null) => {
//     if (!size) {
//       toast.error('Please Select Product Size');
//       return;
//     }
//     let cartData = structuredClone(cartItems);
//     if (cartData[itemId]) {
//       if (cartData[itemId][size]) {
//         cartData[itemId][size] += 1;
//       } else {
//         cartData[itemId][size] = 1;
//       }
//     } else {
//       cartData[itemId] = {};
//       cartData[itemId][size] = 1;
//     }
//     setCartItems(cartData);
//     toast.success('Added to cart!');
//     if (product) {
//       setAddToCartModal({ open: true, product });
//     }
//   }, [cartItems]);

//   const closeAddToCartModal = useCallback(() => {
//     setAddToCartModal({ open: false, product: null });
//   }, []);

//   const getCartCount = useCallback(() => {
//     let totalCount = 0;
//     for (const items in cartItems) {
//       for (const item in cartItems[items]) {
//         try {
//           if (cartItems[items][item] > 0) {
//             totalCount += cartItems[items][item];
//           }
//         } catch (_) {}
//       }
//     }
//     return totalCount;
//   }, [cartItems]);

//   const updateQuantity = useCallback((itemId, size, quantity) => {
//     let cartData = structuredClone(cartItems);
//     if (!cartData[itemId]) return;
//     cartData[itemId][size] = quantity;
//     if (quantity <= 0) {
//       delete cartData[itemId][size];
//       if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
//     }
//     setCartItems(cartData);
//   }, [cartItems]);

//   const removeFromCart = useCallback((itemId, size) => {
//     updateQuantity(itemId, size, 0);
//   }, [updateQuantity]);

//   const getCartAmount = useCallback(() => {
//     let totalAmount = 0;
//     for (const items in cartItems) {
//       const itemInfo = products.find((p) => p.id === items || p._id === items);
//       if (!itemInfo) continue;
//       const effectivePrice =
//         itemInfo.discount_price &&
//         new Date() >= new Date(itemInfo.discount_start || 0) &&
//         new Date() <= new Date(itemInfo.discount_end || '2099')
//           ? itemInfo.discount_price
//           : itemInfo.price || 0;
//       for (const item in cartItems[items]) {
//         try {
//           if (cartItems[items][item] > 0) {
//             totalAmount += effectivePrice * cartItems[items][item];
//           }
//         } catch (_) {}
//       }
//     }
//     return totalAmount;
//   }, [cartItems, products]);

//   const placeOrder = useCallback(async (orderData) => {
//     if (!supabase) throw new Error('Supabase not configured. Please add your credentials.');
//     const cartData = [];
//     for (const itemId in cartItems) {
//       for (const size in cartItems[itemId]) {
//         if (cartItems[itemId][size] > 0) {
//           const product = products.find((p) => p.id === itemId || p._id === itemId);
//           if (product) {
//             const effectivePrice = product.discount_price && new Date() >= new Date(product.discount_start || 0) && new Date() <= new Date(product.discount_end || '2099') ? product.discount_price : product.price;
//             cartData.push({
//               productId: product.id,
//               productName: product.name,
//               productImage: Array.isArray(product.images) ? product.images[0] : product.image?.[0],
//               size,
//               quantity: cartItems[itemId][size],
//               price: effectivePrice,
//               vendorId: product.vendor_id || null,
//             });
//           }
//         }
//       }
//     }
//     const subtotal = getCartAmount();
//     const total = subtotal + delivery_fee;
//     await createOrder({
//       userId: user?.id || null,
//       guestEmail: orderData.email || null,
//       subtotal,
//       deliveryFee: delivery_fee,
//       total,
//       paymentMethod: orderData.paymentMethod || 'cod',
//       deliveryAddress: orderData.deliveryAddress,
//       items: cartData,
//     });
//     setCartItems({});
//     localStorage.removeItem(CART_STORAGE_KEY);
//   }, [cartItems, products, user, getCartAmount]);

//   const value = {
//     products,
//     categories,
//     setCategories,
//     loading,
//     currency,
//     delivery_fee,
//     search,
//     setSearch,
//     showSearch,
//     setShowSearch,
//     cartItems,
//     addToCart,
//     getCartCount,
//     updateQuantity,
//     removeFromCart,
//     getCartAmount,
//     wishlist,
//     toggleWishlist,
//     isInWishlist,
//     getWishlistCount,
//     navigate,
//     user,
//     profile,
//     vendorProfile,
//     role: profile?.role || 'buyer',
//     placeOrder,
//     addToCartModal,
//     closeAddToCartModal,
//     fetchProductById,
//     authModalOpen,
//     setAuthModalOpen,
//   };

//   return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
// };

// export default ShopContextProvider;






import { createContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { fetchProducts, fetchProductById } from '../services/supabase/products';
import { createOrder } from '../services/supabase/orders';
import { fetchCurrentProfile, fetchVendorProfile } from '../services/supabase/profiles';

export const ShopContext = createContext();

const CART_STORAGE_KEY = 'ecommerce_cart';
const WISHLIST_STORAGE_KEY = 'ecommerce_wishlist';

const ShopContextProvider = (props) => {
  const currency = 'Rs. ';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [addToCartModal, setAddToCartModal] = useState({ open: false, product: null });
  const [profile, setProfile] = useState(null);
  const [vendorProfile, setVendorProfile] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  const loadProfiles = useCallback(
    async (authUser) => {
      if (!authUser) {
        setProfile(null);
        setVendorProfile(null);
        return;
      }
      try {
        let p = await fetchCurrentProfile();

        if (!p && supabase) {
          const fullName =
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            '';
          try {
            await supabase.from('profiles').upsert({
              id: authUser.id,
              role: 'buyer',
              full_name: fullName,
            });
          } catch (e) {
            console.error('Failed to upsert profile', e);
          }
          p = await fetchCurrentProfile();
        }

        const adminEmails = ['daniyalijaz922@gmail.com'];
        if (adminEmails.includes(authUser.email) && supabase) {
          try {
            await supabase.from('profiles').upsert({
              id: authUser.id,
              role: 'admin',
              full_name: p?.full_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
            });
            p = await fetchCurrentProfile();
          } catch (e) {
            console.error('Failed to assign admin role', e);
          }
        }

        setProfile(p);
        if (p?.role === 'vendor' || p?.role === 'admin') {
          const vp = await fetchVendorProfile(authUser.id);
          setVendorProfile(vp);
        } else {
          setVendorProfile(null);
        }
      } catch (err) {
        console.error('Failed to load profiles', err);
        setVendorProfile(null);
      }
    },
    []
  );

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      loadProfiles(authUser);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      loadProfiles(authUser);
    });
    return () => subscription?.unsubscribe();
  }, [loadProfiles]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.includes(productId),
    [wishlist]
  );

  const getWishlistCount = useCallback(() => wishlist.length, [wishlist]);

  const addToCart = useCallback((itemId, size, product = null) => {
    if (!size) {
      toast.error('Please Select Product Size');
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    toast.success('Added to cart!');
    if (product) {
      setAddToCartModal({ open: true, product });
    }
  }, [cartItems]);

  const closeAddToCartModal = useCallback(() => {
    setAddToCartModal({ open: false, product: null });
  }, []);

  const getCartCount = useCallback(() => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (_) {}
      }
    }
    return totalCount;
  }, [cartItems]);

  const updateQuantity = useCallback((itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) return;
    cartData[itemId][size] = quantity;
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
    }
    setCartItems(cartData);
  }, [cartItems]);

  const removeFromCart = useCallback((itemId, size) => {
    updateQuantity(itemId, size, 0);
  }, [updateQuantity]);

  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find((p) => p.id === items || p._id === items);
      if (!itemInfo) continue;
      const effectivePrice =
        itemInfo.discount_price &&
        new Date() >= new Date(itemInfo.discount_start || 0) &&
        new Date() <= new Date(itemInfo.discount_end || '2099')
          ? itemInfo.discount_price
          : itemInfo.price || 0;
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += effectivePrice * cartItems[items][item];
          }
        } catch (_) {}
      }
    }
    return totalAmount;
  }, [cartItems, products]);

  const placeOrder = useCallback(async (orderData) => {
    if (!supabase) throw new Error('Supabase not configured.');
    const cartData = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          const product = products.find((p) => p.id === itemId || p._id === itemId);
          if (product) {
            const effectivePrice = product.discount_price && 
              new Date() >= new Date(product.discount_start || 0) && 
              new Date() <= new Date(product.discount_end || '2099') 
              ? product.discount_price 
              : product.price;

            cartData.push({
              product_id: product.id,
              product_name: product.name,
              product_image: Array.isArray(product.images) ? product.images[0] : product.image?.[0],
              size,
              quantity: cartItems[itemId][size],
              price_at_order: effectivePrice,
              vendor_id: product.vendor_id || null,
            });
          }
        }
      }
    }
    const subtotal = getCartAmount();
    const total = subtotal + delivery_fee;
    
    // Call the service with formatted keys to match your PlaceOrder logic/Supabase
    await createOrder({
      userId: user?.id || null,
      guestEmail: orderData.email || null,
      subtotal,
      deliveryFee: delivery_fee,
      total,
      paymentMethod: orderData.paymentMethod || 'cod',
      deliveryAddress: orderData.deliveryAddress,
      items: cartData,
    });

    setCartItems({});
    localStorage.removeItem(CART_STORAGE_KEY);
  }, [cartItems, products, user, getCartAmount, delivery_fee]);

  const value = {
    products,
    categories,
    setCategories,
    loading,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems, // <--- FIXED: Exporting this now
    addToCart,
    getCartCount,
    updateQuantity,
    removeFromCart,
    getCartAmount,
    wishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    navigate,
    user,
    profile,
    vendorProfile,
    role: profile?.role || 'buyer',
    placeOrder,
    addToCartModal,
    closeAddToCartModal,
    fetchProductById,
    authModalOpen,
    setAuthModalOpen,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;