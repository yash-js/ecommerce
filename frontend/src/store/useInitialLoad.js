import { useEffect } from 'react';
import { useUserStore } from './useUserStore';
import { useCartStore } from './useCartStore';
import { useProductStore } from './useProductStore';

export const useInitialLoad = () => {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const  {fetchAllCategories} = useProductStore();

  useEffect(() => {
    if (checkAuth) checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) getCartItems();
    fetchAllCategories()
  }, [user, getCartItems,fetchAllCategories]);

  return { checkingAuth };
};