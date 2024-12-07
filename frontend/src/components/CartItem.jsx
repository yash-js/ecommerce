import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  
  return (
    <div className="rounded-lg border border-[#4d3900] p-4 shadow-sm bg-white md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1 min-w-[200px] max-w-[200px]">
          <img 
            className="h-20 md:h-32 rounded object-cover" 
            src={item.image}
            alt={item.name}
          />
        </div>
        <label className="sr-only">Choose quantity:</label>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
                         border-[#4d3900] bg-white hover:bg-[#fef4d7] focus:outline-none focus:ring-2
                          focus:ring-[#febe03]"
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
            >
              <Minus className="text-[#4d3900]" />
            </button>
            <p className="text-[#4d3900]">{item.quantity}</p>
            <button
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
                         border-[#4d3900] bg-white hover:bg-[#fef4d7] focus:outline-none 
                    focus:ring-2 focus:ring-[#febe03]"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
            >
              <Plus className="text-[#4d3900]" />
            </button>
          </div>

          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-[#febe03]">
              ${item.price}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <p className="text-base font-medium text-[#4d3900] hover:text-[#febe03] hover:underline">
            {item.name}
          </p>
          <p className="text-sm text-[#4d3900]/70">{item.description}</p>

          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center text-sm font-medium text-yellow-600
                         hover:text-[#febe03] hover:underline"
              onClick={() => removeFromCart(item._id)}
            >
              <Trash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;