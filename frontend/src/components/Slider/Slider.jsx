import { SliderContext } from './SliderContext';
import { SliderControls } from './SliderControls';
import { ProductCard } from './ProductCard';
import { useSliderLogic } from './useSliderLogic';
import { useCartStore } from '../../store/useCartStore';

export const Slider = ({ products, user }) => {
  const sliderLogic = useSliderLogic(products.length);
  const { addToCart } = useCartStore();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl sm:text-5xl font-bold text-[#febe03] mb-6">
          Featured Products
        </h2>

        <SliderContext.Provider value={sliderLogic}>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="px-2 flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${
                    sliderLogic.currentIndex * (100 / sliderLogic.itemsPerPage)
                  }%)`,
                }}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={addToCart}
                    user={user}
                  />
                ))}
              </div>
            </div>
            <SliderControls />
          </div>
        </SliderContext.Provider>
      </div>
    </div>
  );
};