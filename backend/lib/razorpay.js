import Razorpay from "razorpay";

// Initialize Razorpay with your Razorpay API keys
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
