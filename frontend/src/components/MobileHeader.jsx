import React from 'react';
import { Menu, X } from 'lucide-react';

const MobileHeader = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white z-40 px-4 flex items-center shadow-sm">
      <button
        className="p-2 hover:bg-gray-100 rounded-lg"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-[#4d3900]" />
        ) : (
          <Menu className="h-6 w-6 text-[#4d3900]" />
        )}
      </button>
      <h1 className="ml-4 text-xl font-semibold text-[#febe03]">YellowWallDog</h1>
    </header>
  );
};

export default MobileHeader;