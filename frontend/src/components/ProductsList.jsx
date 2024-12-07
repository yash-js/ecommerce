import React, { useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { motion } from "framer-motion";
import { Star, Trash } from "lucide-react";
import Modal from "./Modal";
import ProductCreateForm from "./CreateProductForm";

const ProductsList = () => {
  const { products, deleteProduct, toggleFeaturedProduct, loading } =
    useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productData, setProductData] = useState(null);

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product);
    setProductData(
      product
        ? {
            name: product.name,
            image: product.image,
            isActive: product.isActive,
          }
        : { name: "", image: null, product: null }
    );
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductData({ name: "", image: null });
    setCurrentProduct(null);
  };
  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.8 }}
    >
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-[#4d3900]">Products</h1>
        <button
          className="flex justify-center py-2 px-4 border border-transparent rounded-md 
            shadow-sm text-sm font-medium text-white bg-[#febe03] hover:bg-[#febe03] 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#febe03] disabled:opacity-50"
          onClick={() => handleOpenModal()}
          disabled={loading}
        >
          Add Products
        </button>
      </div>
      <table className="min-w-full bg- divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Category
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Featured
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#fffefb] divide-y divide-gray-200">
          {products?.map((product) => (
            <tr key={product._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-[#4d3900]">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#4d3900]">
                  ${product?.price ? product.price.toFixed(2) : 0}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-[#4d3900]">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  disabled={loading}
                  onClick={() => toggleFeaturedProduct(product?._id)}
                  className={`p-1 ${
                    product.isFeatured ? "text-[#febe03]" : "text-[#d1d5db]"
                  } hover:text-[#febe03] transition-colors duration-200`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      product.isFeatured ? "fill-[#febe03]" : "fill-none"
                    }`}
                  />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  disabled={loading}
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    {isModalOpen &&  <Modal  onClose={handleCloseModal}>
        <ProductCreateForm onCancel={handleCloseModal}/>
      </Modal>}
    </motion.div>
  );
};

export default ProductsList;
