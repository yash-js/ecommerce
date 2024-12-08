import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Category from "../models/category.model.js";
import mongoose from "mongoose";
export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [];

    // Match stage for search and category filter
    const matchStage = {};

    if (req.query.search) {
      matchStage.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { "category.name": { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.category) {
      matchStage["category"] = new mongoose.Types.ObjectId(req.query.category);
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Lookup stage to populate category
    pipeline.push({
      $lookup: {
        from: "categories", // Ensure this matches your category collection name
        localField: "category", // 'category' field should be ObjectId in the Product schema
        foreignField: "_id", // Reference the '_id' field in the categories collection
        as: "category", // Populating 'category' field
      },
    });

    // Unwind stage to flatten the category array into an object
    pipeline.push({
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true, // This ensures products without categories are included
      },
    });

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
        metadata: [{ $count: "total" }], // Count total products
        products: [
          { $skip: skip }, // Skip products for pagination
          { $limit: limit }, // Limit the number of products to the 'limit' value
        ],
      },
    });

    // Execute the aggregation pipeline
    const result = await Product.aggregate(pipeline);
    const { metadata, products } = result[0];

    const totalProducts = metadata[0]?.total || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    // Send response with products, pagination data
    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ error: "No featured products found" });
    }

    await redis.set("featuredProducts", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSliderProducts = async (req, res) => {
  try {
    let sliderProducts = await redis.get("sliderProducts");
    if (sliderProducts) {
      return res.json(JSON.parse(sliderProducts));
    }

    sliderProducts = await Product.find({ isFeatured: true }).lean();

    if (!sliderProducts) {
      return res.status(404).json({ error: "No slider products found" });
    }

    await redis.set("sliderProducts", JSON.stringify(sliderProducts));

    res.json(sliderProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || "",
      category,
    });
    await product.populate("category");
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.image) {
      const imageId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${imageId}`);
        console.log("Image deleted  from cloudinary");
      } catch (error) {
        console.log("error deleting from cloudinary");
      }
      await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const product = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          image: 1,
          category: 1,
          price: 1,
        },
      },
    ]);

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.category);

    if (!category) return res.status(404).json({ error: "Category not found" });

    const products = await Product.find({ category: req.params.category });
    res.json({ products, category: category?.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updateFeaturedProductsCache();

    res.json(updatedProduct);
  } catch (error) {
    console.log("YASH", error);

    // Send a single error response
    res.status(500).json({ error: error.message });
  }
};
export const toggleShowOnSlider = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.showOnSlider = !product.showOnSlider;
    const updatedProduct = await product.save();
    await updateSliderProductsCache();

    res.json(updatedProduct);
  } catch (error) {
    console.log("YASH", error);

    // Send a single error response
    res.status(500).json({ error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache");
  }
}

async function updateSliderProductsCache() {
  try {
    const featuredProducts = await Product.find({ showOnSlider: true }).lean();
    await redis.set("sliderProducts", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache");
  }
}
