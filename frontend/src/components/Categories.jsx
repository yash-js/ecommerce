import React, { useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { motion } from "framer-motion";
import { Trash, Edit, Upload, Loader } from "lucide-react";
import Modal from "./Modal";
import toast from "react-hot-toast";
import AlertPrompt from "./AlertPrompt";
import ImageUpload from "./ImageUpload";
import { ToggleButton } from "./ToggleButton";
import SearchBar from "./ProductList/SearchBar";
import Pagination from "./ProductList/Pagination";

const Filter = ({ status, onStatusChange, sortBy, onSortChange }) => {
  return (
    <div className="flex gap-4">
      <select
        placeholder="Select Status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#febe03] focus:border-transparent"
      >
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#febe03] focus:border-transparent"
      >
        <option value="">All</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
};

const Categories = () => {
  const {
    categories,
    createCategory,
    deleteCategory,
    loading,
    updateCategory,
    fetchAllCategories,
    categoryPagination,
  } = useProductStore();

  const [filters, setFilters] = useState({
    search: "",
    sortBy: "name-asc",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({
    name: "",
    image: null,
    isActive: true,
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertCallback, setAlertCallback] = useState(() => () => {});
  const [isSubmitting, setIsSubmitting] = useState(false); // New flag for preventing multiple submissions

  const handleOpenModal = (category = null) => {
    setCurrentCategory(category);
    setCategoryData(
      category
        ? {
            name: category.name,
            image: category.image,
            isActive: category.isActive,
          }
        : { name: "", image: null, category: null, isActive: true }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAlertOpen(false);
    setIsModalOpen(false);
    setCategoryData({ name: "", image: null });
    setCurrentCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const showAlert = (message, onConfirm) => {
    setAlertCallback(() => () => onConfirm());
    setIsAlertOpen(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true); // Set submitting flag to true

    showAlert(
      currentCategory
        ? "Are you sure you want to edit this category?"
        : "Are you sure you want to add this category?",
      async () => {
        try {
          if (currentCategory?._id) {
            if (currentCategory.image === categoryData.image)
              delete categoryData.image;
            await updateCategory({ ...categoryData, id: currentCategory._id });
          } else {
            await createCategory(categoryData);
          }
          handleCloseModal();
        } catch (error) {
          toast.error(error.message || "Something went wrong");
        } finally {
          setIsSubmitting(false); // Reset the submitting flag
        }
      }
    );
  };

  const handleDelete = (id) => {
    showAlert("Are you sure you want to delete this category?", async () => {
      try {
        await deleteCategory(id);
        handleCloseModal();
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };

  const handleToggle = (id) => {
    setCategoryData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  const isNoCategories = categories.length === 0;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchAllCategories(filters);
    }, 300);
    return () => clearTimeout(timeOut);
  }, [filters]);

  return (
    <motion.div
      className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-[#4d3900]">Categories</h1>
        <button
          className="flex justify-center py-2 px-4 border border-transparent rounded-md 
            shadow-sm text-sm font-medium text-white bg-[#febe03] hover:bg-[#febe03] 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#febe03] disabled:opacity-50"
          onClick={() => handleOpenModal()}
          disabled={loading || isSubmitting}
        >
          Add Category
        </button>
      </div>
      <div className="flex flex-col mx-auto w-[95%] md:flex-row gap-4 mb-3">
        <div className="flex-1">
          <SearchBar
            searchTerm={filters.search || ""}
            onSearchChange={(value) =>
              setFilters((prev) => ({ ...prev, search: value, page: 1 }))
            }
            placeholder={"Search Category..."}
          />
        </div>
        <Filter
          status={filters.status || ""}
          onStatusChange={(status) => setFilters((prev) => ({ ...prev, status }))}
          sortBy={filters.sortBy || "name-asc"}
          onSortChange={(sortBy) => setFilters((prev) => ({ ...prev, sortBy }))}
        />
      </div>
      {isNoCategories ? (
        <div className="text-center text-red-500 font-bold py-4">
          No categories found. Please add categories to the list.
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#4d3900] uppercase tracking-wider"
              >
                Is Active?
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
            {categories?.map((category) => (
              <tr key={category._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#4d3900]">
                    {category.name ? category?.name?.length > 15 ? category?.name?.slice(0, 15) + "..." : category?.name : "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-10 w-10 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#4d3900]">
                    {category.isActive ? "Active" : "Inactive"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className="text-[#febe03] hover:text-[#febe03] mx-2"
                    onClick={() => handleOpenModal(category)}
                    disabled={loading || isSubmitting}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(category._id)}
                    disabled={loading || isSubmitting}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-[#4d3900] mb-4 ">
              {currentCategory ? "Edit Category" : "Add Category"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[#4d3900]">Name</label>
                <input
                  type="text"
                  name="name"
                  value={categoryData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <ToggleButton
                  isActive={categoryData.isActive}
                  onChange={handleToggle}
                  label="Is Active?"
                />
              </div>
              <ImageUpload
                value={categoryData.image}
                onChange={(newImage) =>
                  setCategoryData({ ...categoryData, image: newImage })
                }
                label="Image"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 mr-2"
                onClick={handleCloseModal}
                disabled={loading || isSubmitting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#febe03] text-white rounded-lg hover:bg-[#febe03] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  isSubmitting ||
                  !categoryData.name ||
                  !categoryData.image
                }
              >
                {loading ? (
                  <Loader className="animate-spin duration-1000" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isAlertOpen && (
        <AlertPrompt
          loading={loading}
          message="Are you sure you want to proceed?"
          onConfirm={() => {
            alertCallback();
          }}
          onCancel={() => setIsAlertOpen(false)}
        />
      )}
      <div className="p-4">
        {categoryPagination?.totalCategoryPages >= 1 && (
          <Pagination
            currentPage={categoryPagination.currentPage}
            totalPages={categoryPagination.totalCategoryPages}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        )}
      </div>
    </motion.div>
  );
};

export default Categories;
