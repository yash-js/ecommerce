import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Category =  mongoose.model("Category", CategorySchema);
export default Category