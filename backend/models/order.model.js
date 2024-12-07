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
    stripeSessionId: {
      type: String,
      unique: true,
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
  },

  {
    timestamps: true,
  }
);

orderSchema.plugin(autoIncrement, { inc_field: "orderId" });

const Order = mongoose.model("Order", orderSchema);

export default Order;
