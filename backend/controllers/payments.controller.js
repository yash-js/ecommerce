import Razorpay from "razorpay";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay checkout session
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode, address, phone } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products" });
    }

    if (!address || !phone) {
      return res.status(400).json({ error: "Address and phone are required" });
    }

    let totalAmount = 0;

    // Calculate total amount in INR and prepare line items
    const lineItems = products.map((product) => {
      const amount = product.price || 0;
      totalAmount += amount * product.quantity;

      return {
        name: product.name,
        description: product.description || "",
        amount: amount,
        quantity: product.quantity,
        currency: "INR",
        image: product.image,
      };
    });

    console.log("Total Amount before coupon:", totalAmount);

    // Check and apply coupon if provided
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        discount = (totalAmount * coupon.discountPercentage) / 100;
        totalAmount -= discount;
      }
    }

    console.log("Total Amount after coupon:", totalAmount);

    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    // Create a Razorpay order session
    const session = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise for Razorpay
      currency: "INR",
      receipt: "order_receipt_" + new Date().getTime(),
      notes: {
        userId: req.user._id,
        couponCode: couponCode || "",
        address,
        phone,
        products: JSON.stringify(products),
        lineItems: JSON.stringify(lineItems),
      },
    });

    res.json({
      id: session.id,
      amount: totalAmount,
      sessionMetadata: session.notes,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// Handle successful checkout
export const checkoutSuccess = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      sessionMetadata,
    } = req.body;

    console.log("razorpayOrderId:", razorpayOrderId);

    // Verify payment signature
    const isValid = verifyPayment({
      order_id: razorpayOrderId,
      payment_id: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // Fetch payment details from Razorpay using the razorpayPaymentId
    const paymentDetails = await razorpay.payments.fetch(razorpayPaymentId);

    if (!paymentDetails || paymentDetails.status !== "captured") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    // Fetch order details from Razorpay
    const orderDetails = await razorpay.orders.fetch(razorpayOrderId);

    // Parse session metadata
    const { userId, products, lineItems, address, phone } = JSON.parse(
      JSON.stringify(sessionMetadata)
    );

    const totalAmountInINR = orderDetails.amount / 100; // Convert paise to INR

    // Extract payment method from Razorpay payment details
    const paymentMethod = paymentDetails.method;  // Example: 'card', 'upi', etc.

    // Create the order in the database
    const order = await Order.create({
      user: userId,
      products: JSON.parse(products).map((p) => ({
        product: p._id,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount: totalAmountInINR,
      razorpayOrderId,
      razorpayPaymentId,
      lineItems: JSON.parse(lineItems),
      address,
      phone,
      paymentMethod,  // Store the payment method from Razorpay
      paymentStatus: "Paid",
    });

    res.json({
      success: true,
      message: "Payment successful, order placed successfully.",
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Error during checkout success:", error);
    res.status(500).json({ error: "Payment verification failed. Please try again." });
  }
};


// Verify payment signature
const verifyPayment = (paymentDetails) => {
  const { order_id, payment_id, signature } = paymentDetails;

  const body = order_id + "|" + payment_id;
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return generatedSignature === signature;
};
