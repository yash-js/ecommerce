import { Monitor, Pencil, Star } from "lucide-react";
import React, { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { useProductStore } from "../../store/useProductStore";
import ProductCreateForm from "../CreateProductForm";
import Modal from "../Modal";
import Filters from "./Filters";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";

const ProductsList = () => {
  const {
    deleteProduct,
    toggleFeaturedProduct,
    toggleShowProductOnSlider,
    loading,
    categories,
  } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productData, setProductData] = useState(null);

  const { products, filters, updateFilters, pagination } = useProducts();

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

  // Check if products are empty and show error message
  const isNoProducts = products.length === 0;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#4d3900]">Products</h1>
          <button
            className="flex justify-center py-2 px-4 border border-transparent rounded-md 
              shadow-sm text-sm font-medium text-white bg-[#febe03] hover:bg-[#febe03] 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#febe03] disabled:opacity-50"
            onClick={() => handleOpenModal()}
            disabled={loading}
          >
            Add Productss
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              searchTerm={filters.search || ""}
              onSearchChange={(value) => updateFilters({ search: value })}
              placeholder={"Search products..."}
            />
          </div>
          <Filters
            categories={categories}
            selectedCategory={filters.category || ""}
            onCategoryChange={(category) => updateFilters({ category })}
            sortBy={filters.sortBy || "name-asc"}
            onSortChange={(sortBy) => updateFilters({ sortBy })}
          />
        </div>

        {/* Show error message if no products are available */}
        {isNoProducts ? (
          <div className="text-center text-red-500 font-bold py-4">
            No products found. Please add products to the list.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider">
                    Show On Slider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#fffefb] divide-y divide-gray-200">
                {products.map((product) => (
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
                            {product.name
                              ? product?.name.length > 20
                                ? `${product.name.substring(0, 20)}...`
                                : product.name
                              : "N/A"}
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
                      <div className="text-sm text-[#4d3900]">
                        {product.category?.name ? product?.category?.name?.length > 20 ? `${product.category.name.substring(0, 20)}...` : product.category.name : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        disabled={loading}
                        onClick={() => toggleFeaturedProduct(product?._id)}
                        className={`p-1 ${
                          product.isFeatured
                            ? "text-[#febe03]"
                            : "text-[#d1d5db]"
                        }`}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            product.isFeatured ? "fill-[#febe03]" : "fill-none"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        disabled={loading}
                        onClick={() => toggleShowProductOnSlider(product?._id)}
                        className={`p-1 ${
                          product.showOnSlider
                            ? "text-[#febe03]"
                            : "text-[#d1d5db]"
                        }`}
                      >
                        <Monitor
                          className={`h-5 w-5 ${
                            product.showOnSlider
                              ? "fill-[#febe03]"
                              : "fill-none"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        disabled={loading}
                        onClick={() => deleteProduct(product._id)}
                        className="text-yellow-400 hover:text-red-300"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination?.totalPages >= 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => updateFilters({ page })}
          />
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <ProductCreateForm onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default ProductsList;
