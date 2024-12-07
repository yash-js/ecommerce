import React, { useEffect, useState } from "react";
import {
  BarChart,
  ChartBarStacked,
  Logs,
  ShoppingBasket,
} from "lucide-react";
import AnalyticsTab from "../components/AnalyticsTab";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../store/useProductStore";
import Categories from "../components/Categories";
import Orders from "../components/Orders";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import DashboardHeader from "../components/DashboardHeader";
import MobileOverlay from "../components/MobileOverlay";

const tabs = [
  { id: "analytics", label: "Analytics", icon: BarChart },
  { id: "categories", label: "Categories", icon: ChartBarStacked },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "manageOrders", label: "Manage Orders", icon: Logs },
];

const Dashboard = () => {
  const { fetchAllProducts, fetchAllCategories } = useProductStore();
  const [activeTab, setActiveTab] = useState("analytics");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchAllCategories();
    fetchAllProducts();
  }, [fetchAllCategories, fetchAllProducts]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "products":
        return <ProductsList />;
      case "analytics":
        return <AnalyticsTab />;
      case "categories":
        return <Categories />;
      case "manageOrders":
        return <Orders />;
      default:
        return <AnalyticsTab />;
    }
  };

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  return (
    <div className="min-h-screen bg-[#fef4d7]">
      <MobileHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <MobileOverlay isVisible={isSidebarOpen} onClick={toggleSidebar} />
      
      <Sidebar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        onTabClick={handleTabClick}
      />

      <main className="min-h-screen transition-all duration-300 bg-[#fef4d7] lg:pl-[280px] pt-16 lg:pt-0">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader activeTabLabel={activeTabLabel} />
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;