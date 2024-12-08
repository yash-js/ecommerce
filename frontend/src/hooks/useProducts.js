import { useState, useEffect } from 'react';
import { useProductStore } from '../store/useProductStore';

const ITEMS_PER_PAGE = 10;

export const useProducts = () => {
  const { fetchAllProducts, loading, products, pagination } = useProductStore();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'name-asc',
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    fetchAllProducts(filters);
    
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when explicitly changing page)
      page: newFilters.page || 1,
    }));
  };

  return {
    products,
    loading,
    filters,
    updateFilters,
    pagination,
  };
};