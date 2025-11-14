import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
 
  try {
    await mongoose
      .connect(process.env.MONGO_URI, {})
      .then(() => console.log("MongoDB Connected"))
      .catch((err) => console.error("MongoDB Connection Error:", err));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
