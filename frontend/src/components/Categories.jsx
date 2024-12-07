import React, { useState } from "react";
import { useProductStore } from "../store/useProductStore";
import { motion } from "framer-motion";
import { Trash, Edit } from "lucide-react";
import Modal from "./Modal"; // Import a reusable modal component
import toast from "react-hot-toast";
import AlertPrompt from "./AlertPrompt";

const Categories = () => {
  const {
    categories,
    createCategory,
    deleteCategory,
    loading,
    updateCategory,
  } = useProductStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({ name: "", image: null });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertCallback, setAlertCallback] = useState(() => () => {});

  const handleOpenModal = (category = null) => {
    setCurrentCategory(category);
    setCategoryData(
      category
        ? {
            name: category.name,
            image: category.image,
            isActive: category.isActive,
          }
        : { name: "", image: null, category: null }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryData({ name: "", image: null });
    setCurrentCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const showAlert = (message, onConfirm) => {
    setAlertCallback(() => () => onConfirm());
    setIsAlertOpen(true);
  };

  const handleSubmit = async () => {
    showAlert(
      currentCategory
        ? "Are you sure you want to edit this category?"
        : "Are you sure you want to add this category?",
      async () => {
        try {
          if (currentCategory._id) {
            await updateCategory({...categoryData, id: currentCategory._id});
            toast.success("Category updated successfully");
          } else {
            await createCategory(categoryData);
          }
          handleCloseModal();
        } catch (error) {
          toast.error(error.message || "Something went wrong");
        }
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCategoryData((prev) => ({
          ...prev,
          image: reader.result, // Set Base64 string
        }));
      };

      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  const handleDelete = (id) => {
    showAlert("Are you sure you want to delete this category?", async () => {
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully");
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };

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
          disabled={loading}
        >
          Add Category
        </button>
      </div>
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
                  {category.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={category.imageUrl}
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
                  disabled={loading}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  className="text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(category._id)}
                  disabled={loading}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-[#4d3900] mb-4">
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
                <label className="block text-[#4d3900]">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#febe03] text-white rounded-lg hover:bg-[#febe03]"
                onClick={handleSubmit}
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isAlertOpen && (
        <AlertPrompt
          message="Are you sure you want to proceed?"
          onConfirm={() => {
            setIsAlertOpen(false);
            alertCallback();
          }}
          onCancel={() => setIsAlertOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default Categories;
