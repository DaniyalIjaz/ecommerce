import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const RequireRole = ({ role: requiredRole, children }) => {
  const { user, role } = useContext(ShopContext);

  if (!user) {
    return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'vendor' && !['vendor', 'admin'].includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;

