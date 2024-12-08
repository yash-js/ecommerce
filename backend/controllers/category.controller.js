import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
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

    const category = new Category({ name, image: imageUrl });
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [];

    // Match stage for search and category filter
    const matchStage = {};

    if (req.query.search) {
      matchStage.$or = [{ name: { $regex: req.query.search, $options: "i" } }];
    }
    if (req.query.status) {
      matchStage.isActive = req.query.status == "active" ? true : req.query.status == "inactive" ? false : '';
    }
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Sort stage if provided in query params
    if (req.query.sortBy) {
      const [field, order] = req.query.sortBy.split("-");
      pipeline.push({
        $sort: {
          [field]: order === "asc" ? 1 : -1,
        },
      });
    }

  
    // Pagination facet
    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }], // Count total categories
        products: [
          { $skip: skip }, // Skip products for pagination
          { $limit: limit }, // Limit the number of products to the 'limit' value
        ],
      },
    });

    // Execute the aggregation pipeline
    const result = await Category.aggregate(pipeline);

    const categories = result[0]?.products || [];
    const total = result[0]?.metadata[0]?.total || 0;

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({ categories, total, totalPages, currentPage: page });
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

    let imageUrl = category.image;
    if (image) {
      if (imageUrl) {
        // Remove image from Cloudinary if needed
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID
        await cloudinary.uploader.destroy(`category/${publicId}`);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "category",
      });
      image = cloudinaryResponse.secure_url;
    }

    if (isActive != undefined) category.isActive = isActive;

    category.name = name; // Update name
    category.image = imageUrl; // Update image URL
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
    const products = await Product.find({ category: id });
    if (products.length > 0) {
      return res
        .status(400)
        .json({ error: "Remove products from this category first" });
    }
    // Remove image from Cloudinary if needed
    const imageUrl = category.image;
    const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract public ID
    await cloudinary.uploader.destroy(`category/${publicId}`);

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};
