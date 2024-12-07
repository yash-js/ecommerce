import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Login from '../pages/LoginPage';
import Signup from '../pages/SignupPage';
import Dashboard from '../pages/Dashboard';
import Category from '../pages/CategoryPage';
import Cart from '../pages/CartPage';
import PurchaseSuccessPage from '../pages/PurchaseSuccess';
import PurchaseCancelPage from '../pages/PurchaseCancelPage';
import ProtectedRoute from './ProtectedRoute';
import AuthRoute from './AuthRoute';
import { useUserStore } from '../store/useUserStore';

const AppRoutes = () => {
  const { user } = useUserStore();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      <Route path="/" element={isAdmin ? <Dashboard /> : <HomePage />} />
      
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />
      
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/purchase-success"
        element={
          <ProtectedRoute>
            <PurchaseSuccessPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/purchase-cancelled"
        element={
          <ProtectedRoute>
            <PurchaseCancelPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="/category/:category" element={<Category />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;