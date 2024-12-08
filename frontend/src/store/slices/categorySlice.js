import { toast } from "react-hot-toast";
import axios from "../../lib/axios";

export const createCategorySlice = (set) => ({
  loading: false,
  setCategories: (categories) => set({ categories }),
  categoryPagination: {
    currentPage: 1,
    totalCategoryPages: 1,
    totalCategories: 0,
  },
  fetchAllCategories: async (filters) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams();

      if (filters?.search) queryParams.append("search", filters.search);
      if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters?.page) queryParams.append("page", filters.page.toString());
      if (filters?.limit) queryParams.append("limit", filters.limit.toString());
      if (filters?.status) queryParams.append("status", filters.status);
      const url = `/categories?${queryParams.toString()}`;
      const response = await axios.get(url);

      set({
        categories: response.data?.categories || [],
        loading: false,
        categoryPagination: {
          currentPage: response.data?.currentPage || 1,
          totalCategoryPages: response.data?.totalPages || 1,
          totalCategories: response.data?.total || 0,
        },
      });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  },

  createCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.post("/categories", category);
      set((state) => ({
        categories: [...state.categories, response?.data?.category],
        loading: false,
      }));
      toast.success("Category created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  },

  updateCategory: async (payload) => {
    set({ loading: true });
    try {
      const response = await axios.put(`/categories/${payload?.id}`, payload);
      set((state) => ({
        categories: [
          ...state.categories.filter(
            (category) => category._id !== payload?.id
          ),
          response?.data?.category,
        ],
        loading: false,
      }));
      toast.success("Category updated successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((category) => category._id !== id),
        loading: false,
      }));
      toast.success("Category deleted successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  },
});
