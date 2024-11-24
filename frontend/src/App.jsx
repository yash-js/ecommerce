import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import { useUserStore } from "./store/useUserStore";
import Category from "./pages/CategoryPage";
import Cart from "./pages/CartPage";
import { useCartStore } from "./store/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccess";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

const App = () => {
  const { user, checkingAuth, checkAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    if (checkAuth) checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) getCartItems();
  }, [user, getCartItems]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" replace /> : <Signup />}
          />
          <Route
            path="/cart"
            element={!user ? <Navigate to="/login" replace /> : <Cart />}
          />
          <Route
            path="/purchase-success"
            element={!user ? <Navigate to="/login" replace /> : <PurchaseSuccessPage />}
          />
          <Route
            path="/purchase-cancelled"
            element={!user ? <Navigate to="/login" replace /> : <PurchaseCancelPage />}
          />
          <Route path="/category/:category" element={<Category />} />
          <Route
            path="/dashboard"
            element={
              user?.role !== "admin" ? (
                <Navigate to="/" replace />
              ) : (
                <Dashboard />
              )
            }
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
