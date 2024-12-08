import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';

export const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { selectedProduct, selectProduct } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (productId) {
      selectProduct(productId);
    }
  }, [productId, selectProduct]);

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    await addToCart(selectedProduct);
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-[600px] object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedProduct.name}
              </h1>
              <p className="text-3xl text-[#febe03] font-semibold mb-6">
                ${selectedProduct.price.toFixed(2)}
              </p>
              <p className="text-gray-600 text-lg mb-8">
                {selectedProduct.description}
              </p>
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#febe03] hover:bg-[#fcbf44] text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <ShoppingCart className="w-6 h-6 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};