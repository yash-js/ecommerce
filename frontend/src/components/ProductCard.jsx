import { ShoppingCart } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = async () => {
    if (!user)
      return toast.error("You must be logged in to add to cart", {
        id: "login",
      });

    await addToCart(product);
  };

  return (
    <div className="flex w-full bg-white relative flex-col overflow-hidden rounded-lg border border-yellow-200 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="object-cover w-full"
          src={product.image}
          alt="product image"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-[#4d3900]">
          {product.name}
        </h5>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-[#febe03]">
              ${product.price}
            </span>
          </p>
        </div>
        <button
          className="flex items-center justify-center rounded-lg bg-[#febe03] px-5 py-2.5 text-center text-sm font-medium text-[#fff] hover:bg-[#fbe203] focus:outline-none focus:ring-4 focus:ring-[#febe03]"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
