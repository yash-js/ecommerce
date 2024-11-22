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
      set({ user: response.data?.user, loading: false });
      toast.success("Account created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Something went wrong");
    }
  },
  login: async ({  email, password }) => {
    set({ loading: true });
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });
      set({ user: response.data, loading: false });
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

  logout:async () => {
    await axios.post("/auth/logout");
    set({ user: null });
  },
}));


// TODO: Axios interceptors for refreshing token