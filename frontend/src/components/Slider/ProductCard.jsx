import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';


export const ProductCard = ({ product, onAddToCart, user }) => {
  const handleAddToCart = async () => {
    if (!user) {
      return toast.error("You must be logged in to add to cart", {
        id: "login",
      });
    }
    await onAddToCart(product);
  };

  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
        <div className="overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {product.name}
          </h3>
          <p className="text-[#febe03] font-medium mb-4">
            ${product.price.toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#febe03] hover:bg-[#fcbf44] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 
            flex items-center justify-center shadow-md"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};