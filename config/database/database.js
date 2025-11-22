import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectUrl = process.env.MONGODB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(connectUrl);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Connection Failed: " + error);
  }
};
