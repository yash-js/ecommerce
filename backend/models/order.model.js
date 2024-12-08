import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const autoIncrement = mongooseSequence(mongoose);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    lineItems: [
      {
        name: { type: String },
        description: { type: String },
        amount: { type: Number },
        quantity: { type: Number },
        currency: { type: String },
        image: { type: String },
      },
    ],
    orderId: {
      type: Number,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Delivered", "Shipped", "Cancelled"],
      default: "Pending",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",  // Reference to Address model
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,  // Store Razorpay payment method dynamically (Card/UPI, etc.)
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentId: {
      type: String,
    },
    deliverTrackingNumber: {
      type: String,
    },
    razorpayOrderId: {
      type: String,  // Razorpay order ID
    },
    razorpayPaymentId: {
      type: String,  // Razorpay payment ID
    },
    razorpaySignature: {
      type: String,  // Razorpay payment signature
    },
    sessionMetadata: {
      type: Object,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    discount: {
      type: Number,
      default: 0,
    },
    isCouponApplied: {
      type: Boolean,
      default: false,
    },
    invoice: {
      type: String,
    },
    isInvoiceGenerated: {
      type: Boolean,
      default: false,
    },
    deliveredDate: {
      type: Date,
    },
    shippedDate: {
      type: Date,
    },
    cancelledDate: {
      type: Date,
    },
    cancelledBy: {
      type: String,
    },
    cancelledReason: {
      type: String,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isShipped: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
    isDeliveredByCourier: {
      type: Boolean,
      default: false,
    },
    isDeliveredBySelf: {
      type: Boolean,
      default: false,
    },
    isCancelledByCourier: {
      type: Boolean,
      default: false,
    },
    isCancelledBySelf: {
      type: Boolean,
      default: false,   
    },
    isReturnedByCourier: {
      type: Boolean,
      default: false,
    },
    isReturnedBySelf: {
      type: Boolean,
      default: false,
    },
    isRefundedByCourier: {
      type: Boolean,
      default: false,
    },
    isRefundedBySelf: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(autoIncrement, { inc_field: "orderId" });

const Order = mongoose.model("Order", orderSchema);

export default Order;
