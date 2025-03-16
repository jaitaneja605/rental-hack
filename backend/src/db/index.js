import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("Connected to DB:", connectionInstance.connection.host);
  } catch (error) {
    console.log("Error while connecting to DB:", error);
  }
};

export default connectDB;