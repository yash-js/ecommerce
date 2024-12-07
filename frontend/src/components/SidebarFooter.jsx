import React from 'react';
import { LogOut } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

const SidebarFooter = () => {
  const { logout } = useUserStore();

  return (
    <div className="p-4 border-t">
      <button
        onClick={logout}
        className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all outline-none hover:bg-yellow-50 hover:text-yellow-900"
      >
        <LogOut className="mr-2 h-5 w-5" />
        Logout
      </button>
    </div>
  );
};

export default SidebarFooter;