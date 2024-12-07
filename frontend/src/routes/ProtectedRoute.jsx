import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useUserStore();
  const isAdmin = user?.role === 'admin';

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;