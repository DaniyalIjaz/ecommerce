import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Categories from './pages/Categories';
import CategoryProducts from './pages/CategoryProducts';
import About from './pages/About';
import Contact from './pages/Contact';
import Support from './pages/Support';
import OAuthCallback from './pages/OAuthCallback';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import VendorRegister from './pages/VendorRegister';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminVendors from './pages/AdminVendors';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Searchbar from './components/Searchbar';
import AddToCartModal from './components/AddToCartModal';
import RequireRole from './components/RequireRole';
import AuthModal from './components/AuthModal';
import ScrollToTop from './components/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import { useContext } from 'react';
import { ShopContext } from './context/ShopContext';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'sonner';

const AppContent = () => {
  const { addToCartModal, closeAddToCartModal, navigate } = useContext(ShopContext);

  return (
    <>


<Toaster 
  theme="dark" 
  toastOptions={{
    style: { 
      background: '#000000', 
      color: '#ffffff', 
      border: '1px solid #27272a',
      fontFamily: 'inherit',
      textTransform: 'uppercase',
      fontSize: '10px',
      letterSpacing: '0.1em'
    },
  }} 
/>
      <Navbar />
      {/* <Searchbar /> */}
      <AuthModal />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/collection/:slug" element={<CategoryProducts />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route
          path="/vendor/dashboard"
          element={
            <RequireRole role="vendor">
              <VendorDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RequireRole role="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin/vendors"
          element={
            <RequireRole role="admin">
              <AdminVendors />
            </RequireRole>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />
      <ScrollToTop />

      <AddToCartModal
        isOpen={addToCartModal?.open}
        onClose={closeAddToCartModal}
        product={addToCartModal?.product}
        onContinueShopping={closeAddToCartModal}
        onViewCart={() => {
          closeAddToCartModal();
          navigate('/cart');
        }}
      />
    </>
  );
};

const App = () => {
  return (
    <div className=" min-h-screen bg-gradient-to-b from-cream-50 to-cream-100">
      <AppContent />
    </div>
  );
};

export default App;
