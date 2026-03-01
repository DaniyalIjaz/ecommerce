import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginPanel from '../components/LoginPanel';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="w-[90%] sm:max-w-md m-auto">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-8 h-8 text-terracotta-500" />
          <h1 className="text-xl font-semibold text-stone-900">Admin Login</h1>
        </div>
        <p className="text-sm text-stone-600 mb-4">
          Admins can only sign in from this page. Use your admin credentials.
        </p>
        <LoginPanel onSuccess={handleSuccess} isAdminLogin />
      </div>
    </motion.div>
  );
};

export default AdminLogin;
