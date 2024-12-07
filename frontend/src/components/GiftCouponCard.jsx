import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";

const GiftCouponCard = () => {
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } =
    useCartStore();
  const [userInputCode, setUserInputCode] = useState("");

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    await getMyCoupon();
    setUserInputCode("");
  };

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) {
      setUserInputCode(coupon.code);
    }
  }, [coupon]);

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-[#4d3900] bg-white p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        {!isCouponApplied && (
          <>
            <div>
              <label
                htmlFor="voucher"
                className="mb-2 block text-sm font-medium text-[#4d3900]"
              >
                Do you have a voucher or gift card?
              </label>
              <input
                type="text"
                id="voucher"
                className="block w-full rounded-lg border border-[#4d3900] bg-white 
                p-2.5 text-sm text-[#4d3900] placeholder-[#4d3900]/50 
                focus:border-[#febe03] focus:ring-[#febe03]"
                placeholder="Enter code here"
                value={userInputCode}
                onChange={(e) => setUserInputCode(e.target.value)}
                required
                disabled={isCouponApplied}
              />
            </div>

            <motion.button
              type="button"
              className="flex w-full items-center justify-center rounded-lg bg-[#febe03] 
              px-5 py-2.5 text-sm font-medium text-[#4d3900] hover:bg-[#ffd440] 
              focus:outline-none focus:ring-4 focus:ring-[#febe03]/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApplyCoupon}
              disabled={isCouponApplied}
            >
              Apply Code
            </motion.button>
          </>
        )}
      </div>
      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-[#4d3900]">Applied Coupon</h3>
          <p className="mt-2 text-sm text-[#4d3900]/70">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>

          <motion.button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 
            focus:outline-none focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {coupon && !isCouponApplied && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-[#4d3900]">
            Your Available Coupon:
          </h3>
          <p
            onClick={() => {
              if (coupon) {
                setUserInputCode(coupon.code);
                handleApplyCoupon();
              }
            }}
            className={`mt-2 text-sm text-[#4d3900]/70 ${
              coupon ? "cursor-pointer hover:text-[#4d3900]" : ""
            }`}
          >
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;