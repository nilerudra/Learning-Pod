import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
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
