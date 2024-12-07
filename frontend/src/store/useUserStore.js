import { create } from "zustand";

import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }
    try {
      const response = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      if (!response.data?.user) return toast.error("Something went wrong");

      set({ user: response.data?.user, loading: false });
      toast.success("Account created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      set({ user: response?.data?.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },

  logout: async () => {
    await axios.post("/auth/logout");
    set({ user: null });
  },
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if the error is due to an unauthorized (401) request
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Wait for the current refresh process to complete if there's one in progress
      if (refreshPromise) {
        await refreshPromise;
        return axios(originalRequest); // Retry the original request
      }

      try {
        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise; // Wait for the refresh token to be issued
        refreshPromise = null; // Clear the refresh promise after it resolves

        return axios(originalRequest); // Retry the original request after refreshing the token
      } catch (refreshError) {
        // If the refresh fails, log the user out
        useUserStore().getState().logout();
        return Promise.reject(refreshError); // Reject the original request
      }
    }

    return Promise.reject(error); // For non-401 errors or any other failures
  }
);
