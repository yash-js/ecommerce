import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

const AuthRoute = ({ children }) => {
  const { user } = useUserStore();
  const isAdmin = user?.role === 'admin';

  if (user) {
    return <Navigate to={isAdmin ? '/dashboard' : '/'} replace />;
  }

  return children;
};

export default AuthRoute;