import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };
  const handleAddToCart = async () => {
    if (!user)
      return toast.error("You must be logged in to add to cart", {
        id: "login",
      });

    await addToCart(product);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl sm:text-5xl font-bold text-[#febe03] mb-6">
          Featured Products
        </h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="px-2 flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
              }}
            >
              {featuredProducts?.map((product) => (
                <div
                  key={product._id}
                  className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2"
                >
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
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-[#febe03] hover:bg-[#fcbf44] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 
												flex items-center justify-center shadow-md"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-8 transform -translate-y-1/2 p-3 rounded-full shadow-md transition-colors duration-300 ${
              isStartDisabled
                ? "bg-[#fcd34d] text-gray-500 cursor-not-allowed" // Lighter yellow for disabled state
                : "bg-[#febe03] hover:bg-[#fcbf44] text-white"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-3 rounded-full shadow-md transition-colors duration-300 ${
              isEndDisabled
                ? "bg-[#fcd34d] text-gray-500 cursor-not-allowed" // Lighter yellow for disabled state
                : "bg-[#febe03] hover:bg-[#fcbf44] text-white"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
