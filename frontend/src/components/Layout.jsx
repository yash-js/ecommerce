import React from 'react';
import Navbar from './Navbar';
import { useUserStore } from '../store/useUserStore';
import { Footer } from './footer/Footer';

const Layout = ({ children }) => {
  const { user } = useUserStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#fef4d7] text-[#4d3900] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(254,190,3,0.3)_0%,rgba(253,147,1,0.2)_45%,rgba(128,78,1,0.1)_100%)]" />
        </div>
      </div>
      <div className={`relative z-50 ${isAdmin ? "" : "pt-10"}`}>
        <Navbar />
        {children}
        <Footer/>
      </div>
    </div>
  );
};

export default Layout;