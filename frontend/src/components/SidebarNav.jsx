import React from 'react';

const SidebarNav = ({ tabs, activeTab, setActiveTab, onTabClick }) => {
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabClick?.();
  };

  return (
    <nav className="flex-1 overflow-y-auto p-4">
      <div className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all outline-none
                ${
                  activeTab === tab.id
                    ? 'bg-[#febe03] text-white'
                    : 'hover:bg-yellow-50 hover:text-yellow-900'
                }`}
            >
              <Icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNav;