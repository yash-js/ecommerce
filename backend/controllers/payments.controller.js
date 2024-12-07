import Razorpay from "razorpay";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products" });
    }

    let totalAmount = 0;

    // Calculate total amount in paise and build line items
    const lineItems = products.map((product) => {
      const amount = Math.round((product.price || 0) * 100);  // Razorpay needs amount in paise
      totalAmount += amount * product.quantity;

      return {
        name: product.name,
        description: product.description || '',
        amount: amount,
        quantity: product.quantity,
        currency: "INR",
        image: product.image,
      };
    });

    console.log('Total Amount before coupon:', totalAmount);

    // Check and apply coupon if provided
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }

    console.log('Total Amount after coupon:', totalAmount);

    // Ensure totalAmount is a valid number
    if (isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ error: "Invalid total amount" });
    }

    // Create Razorpay order session
    const session = await razorpay.orders.create({
      amount: totalAmount,  // Amount in paise
      currency: "INR",
      receipt: "order_receipt_" + new Date().getTime(),
      notes: {
        userId: req.user._id,
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
        lineItems: JSON.stringify(lineItems),  // Save line items for future reference
      },
    });

    // Send session data to frontend including metadata
    res.json({
      id: session.id,
      amount: totalAmount / 100,  // Amount in INR
      sessionMetadata: session.notes,  // Passing metadata to frontend
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};


export const checkoutSuccess = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, sessionMetadata } = req.body;

    console.log("razorpayOrderId:", razorpayOrderId);

    // Verify the payment signature
    const isValid = verifyPayment({
      order_id: razorpayOrderId,
      payment_id: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (isValid) {
      // Add a delay to ensure Razorpay updates the order
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay

      // Fetch order details from Razorpay using the order ID
      try {
        const orderDetails = await razorpay.orders.fetch(razorpayOrderId);
        console.log("Fetched Order Details:", orderDetails);

        // If in test mode, mock the success (for testing purposes)
        if (process.env.RAZORPAY_ENV === "test" && orderDetails.status === "attempted") {
          orderDetails.status = "captured";  // Mock successful payment status
          orderDetails.amount_paid = 55341; // Mock amount paid (in paise)
        }

        if (!orderDetails || !orderDetails.amount_paid || orderDetails.status !== "captured") {
          return res.status(400).json({ error: "Payment not successful" });
        }

        // Retrieve the products and line items from session metadata
        const products = JSON.parse(sessionMetadata.products);
        const lineItems = JSON.parse(sessionMetadata.lineItems);

        // Convert amount_paid to INR
        const totalAmountInPaise = orderDetails.amount_paid;
        const totalAmountInINR = totalAmountInPaise / 100; // Convert paise to INR

        // Check if totalAmountInINR is valid
        if (isNaN(totalAmountInINR) || totalAmountInINR <= 0) {
          return res.status(400).json({ error: "Invalid total amount" });
        }

        // Create the order in the database
        const order = await Order.create({
          user: sessionMetadata.userId,
          products: products.map((p) => ({
            product: p.id,
            quantity: p.quantity,
            price: p.price,
          })),
          totalAmount: totalAmountInINR,  // Save total amount in INR
          razorpayOrderId,
          razorpayPaymentId,
          lineItems: lineItems,  // Save lineItems to the database
        });

        res.json({
          success: true,
          message: "Payment successful, Order placed successfully.",
          orderId: order.orderId,
        });
      } catch (error) {
        console.error("Error fetching Razorpay order:", error);
        return res.status(400).json({ error: "Invalid order details" });
      }
    } else {
      res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error during checkout success:", error);
    res.status(500).json({ error: "Payment verification failed. Please try again." });
  }
};



// Function to verify payment signature
const verifyPayment = (paymentDetails) => {
  const { order_id, payment_id, signature } = paymentDetails;

  // Your Razorpay key secret
  const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

  const body = order_id + "|" + payment_id;
  const generatedSignature = crypto
    .createHmac('sha256', razorpaySecret)
    .update(body)
    .digest('hex');

  return generatedSignature === signature;
};

// Function to create a new coupon if totalAmount > 20000
const createNewCoupon = async (userId) => {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = await Coupon.create({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    userId,
  });

  return newCoupon;
};
