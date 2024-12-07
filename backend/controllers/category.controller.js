import Category from "../models/category.model.js";
import cloudinary from "../lib/cloudinary.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    let imageUrl = "";
    if (!image) return res.status(400).json({ error: "Image is required" });
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "category",
      });
      imageUrl = cloudinaryResponse.secure_url;
    }

    const category = new Category({ name, imageUrl });
    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: "Error creating category" });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    if (!name && !image && isActive == undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let imageUrl = category.imageUrl;
    if (image) {
      if (imageUrl) {
        // Remove image from Cloudinary if needed
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.uploader.destroy(`category/${publicId}`);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "category",
      });
      imageUrl = cloudinaryResponse.secure_url;
    }

    if (isActive != undefined) category.isActive = isActive;

    category.name = name; // Update name
    category.imageUrl = imageUrl; // Update image URL
    await category.save();

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Remove image from Cloudinary if needed
    const imageUrl = category.imageUrl;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID
    await cloudinary.uploader.destroy(`category/${publicId}`);

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};
