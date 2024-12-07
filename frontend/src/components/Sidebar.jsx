import React from 'react';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ tabs, activeTab, setActiveTab, isSidebarOpen, onTabClick }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-[280px] bg-white shadow-xl shadow-blue-gray-900/5 transition-transform duration-300 ease-in-out z-50 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0`}
    >
      <SidebarHeader />
      <SidebarNav 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onTabClick={onTabClick}
      />
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;