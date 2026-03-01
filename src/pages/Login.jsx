import { useNavigate } from 'react-router-dom';
import LoginPanel from '../components/LoginPanel';
import { motion } from 'framer-motion';
import React from 'react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="w-[90%] sm:max-w-md m-auto">
        <LoginPanel onSuccess={() => navigate('/')} />
      </div>
    </motion.div>
  );
};

export default Login;
