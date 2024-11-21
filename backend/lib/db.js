import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB CONNECTED!");
  } catch (error) {
    console.error("Failed to connect DB");
    process.exit(1);
  }
};
