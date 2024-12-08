import { create } from 'zustand';
import { createProductSlice } from './slices/productSlice';
import { createCategorySlice } from './slices/categorySlice';


export const useProductStore = create((...args) => ({
  ...createProductSlice(...args),
  ...createCategorySlice(...args),
}));