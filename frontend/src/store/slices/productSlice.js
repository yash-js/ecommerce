import { toast } from 'react-hot-toast';
import axios from '../../lib/axios';

export const createProductSlice = (set) => ({
  products: [],
  categories: [],
  loading: false,
  currentCategory: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  },

  setProducts: (products) => set({ products }),

  createProduct: async (product) => {
    set({ loading: true });
    try {
      const response = await axios.post("/products", product);
      set((state) => ({
        products: [...state.products, {...response.data?.product}],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  },

  fetchAllProducts: async (filters) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.category) queryParams.append('category', filters.category);
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());

      const url = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await axios.get(url);
      
      set({ 
        products: response.data.products,
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalProducts: response.data.totalProducts,
        },
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  },

  fetchProductByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ 
        products: response.data?.products, 
        loading: false, 
        currentCategory: response?.data?.category 
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  },

  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/featured/${id}`);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
      toast.success("Product updated successfully", { id: "product" });
    } catch (error) {
      set({ loading: false });
    }
  },

  toggleShowProductOnSlider: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/slider/${id}`);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id
            ? { ...product, showOnSlider: response.data.showOnSlider }
            : product
        ),
        loading: false,
      }));
      toast.success("Product updated successfully", { id: "product" });
    } catch (error) {
      set({ loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching featured products:", error);
    }
  },
});