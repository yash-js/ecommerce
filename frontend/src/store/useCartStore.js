import { create } from "zustand";
import axios from "../lib/axios";

import toast from "react-hot-toast";
import { updateQuantity } from "../../../backend/controllers/cart.controller";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const response = await axios.get("/cart");
      set({ cart: response.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      console.log(error);
    }
  },

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },
  addToCart: async (product) => {
    try {
      const res = await axios.post("/cart", { productId: product._id });
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      toast.success("Product added to cart", { id: "cart" });

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.error || "An error occurred");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();

    const subTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    let total = subTotal;

    if (coupon) {
      const discount = subTotal * (coupon.discount / 100);
      total = subTotal - discount;
    }

    set({ subTotal, total });
  },

  removeFromCart: async (productId) => {
    await axios.delete(`/cart`, { data: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotals();
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    await axios.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
  },

  clearCart: async () => {
    await axios.delete("/cart");
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    get().calculateTotals();
  },
}));
