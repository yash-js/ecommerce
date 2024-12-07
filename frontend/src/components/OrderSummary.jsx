import React from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

const stripePromise = loadStripe(
  "pk_test_51QNRC8SIiFYM5l9GhrtAeQbuf0FVPfXifuo6y8Shy07gQeDb3ZFHVihpnMSk0EgoQP9fwO8L0syeP2ooJCB37frA000Pu5xGwr"
);

const OrderSummary = () => {
  const { total, subTotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subTotal - total;
  const formattedSubtotal = subTotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const response = await axios.post("/payments/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });

    const session = response.data.id;
    const result = await stripe.redirectToCheckout({ sessionId: session });

    if (result.error) {
      console.log(result.error.message);
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-[#4d3900] bg-white p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-[#febe03]">Order summary</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-[#4d3900]">
              Original price
            </dt>
            <dd className="text-base font-medium text-[#4d3900]">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-[#4d3900]">Savings</dt>
              <dd className="text-base font-medium text-[#febe03]">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-[#4d3900]">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-[#febe03]">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-[#4d3900] pt-2">
            <dt className="text-base font-bold text-[#4d3900]">Total</dt>
            <dd className="text-base font-bold text-[#febe03]">
              ${formattedTotal}
            </dd>
          </dl>
        </div>
        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-[#febe03] px-5 py-2.5 text-sm font-medium text-[#4d3900] hover:bg-[#ffd440] focus:outline-none focus:ring-4 focus:ring-[#febe03]/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-[#4d3900]/70">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#febe03] underline hover:text-[#ffd440] hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;