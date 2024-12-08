import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';
import { ProductHeader } from './ProductHeader';


export const ProductSlider = () => {
  const navigate = useNavigate();
  const { products, setProducts } = useProductStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    // Sample data - in a real app, this would come from an API
    const sampleProducts = [
      {
        _id: '1',
        name: 'Premium Headphones',
        price: 199.99,
        description: 'High-quality wireless headphones with noise cancellation.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
      },
      {
        _id: '2',
        name: 'Smart Watch',
        price: 299.99,
        description: 'Advanced smartwatch with health monitoring features.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
      },
      {
        _id: '3',
        name: 'Wireless Speaker',
        price: 149.99,
        description: 'Portable speaker with premium sound quality.',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&q=80',
      },
      {
        _id: '4',
        name: 'Camera Lens',
        price: 599.99,
        description: 'Professional grade camera lens for stunning photography.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80',
      },
    ];
    
    setProducts(sampleProducts);
  }, [setProducts]);

  useEffect(() => {
    let interval
    
    if (!isHovered && products.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isHovered, products.length]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!products.length) return null;

  return (
    <>
      <ProductHeader />
      <div 
        className="relative h-screen bg-[#1a1a1a] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0">
          {products.map((product, index) => (
            <div
              key={product._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Background blur */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px)',
                  opacity: 0.3,
                }}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a1a]/50 to-[#1a1a1a]" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center px-4 pt-20">
                <div className="w-full max-w-6xl mx-auto text-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[50vh] w-auto mx-auto object-contain cursor-pointer transform transition-transform duration-300 hover:scale-105"
                    onClick={() => handleProductClick(product._id)}
                  />
                  
                  <div className="mt-8 text-center text-white">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                      {product.name}
                    </h2>
                    <p className="text-xl md:text-2xl text-[#febe03]">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots navigation */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#febe03] w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};