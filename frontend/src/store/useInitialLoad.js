import { useEffect } from 'react';
import { useUserStore } from './useUserStore';
import { useCartStore } from './useCartStore';

export const useInitialLoad = () => {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    if (checkAuth) checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) getCartItems();
  }, [user, getCartItems]);

  return { checkingAuth };
};