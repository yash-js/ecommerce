import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  categories: [],
  loading: false,

  // Products Logic
  setProducts: (products) => set({ products }),
  createProduct: async (product) => {
    set({ loading: true });
    try {
      const response = await axios.post("/products", product);
      set((prevState) => ({
        products: [...prevState.products, response.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data?.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  fetchProductByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `/products/category/${category}`
      );
      set({ products: response.data?.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
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
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },

  // Categories Logic
  setCategories: (categories) => set({ categories }),
  fetchAllCategories: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/categories");
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  createCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.post("/categories", category);
      set((prevState) => ({
        categories: [...prevState.categories, response?.data?.category],
        loading: false,
      }));
      toast.success("Category created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  updateCategory: async (payload) => {
    set({ loading: true });
    try {
      const response = await axios.put("/categories/"+payload?.id, payload);
      console.log('====================================');
      console.log(response);
      console.log('====================================');
      set((prevState) => ({
        categories: [...prevState.filter((category) => category._id !== payload?.id), response?.data?.category],
        loading: false,
      }));
      toast.success("Category created successfully");
    } catch (error) {

      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/categories/${id}`);
      set((prevState) => ({
        categories: prevState.categories.filter(
          (category) => category._id !== id
        ),
        loading: false,
      }));
      toast.success("Category deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
}));
