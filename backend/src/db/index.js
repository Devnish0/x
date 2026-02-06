import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { DB_NAME } from "../../constants.js";

const DBURL =
  process.env.NODE_ENV === "production"
    ? process.env.DBURL
    : `mongodb://127.0.0.1:27017/${DB_NAME}`;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(DBURL);
    console.log(
      `MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Error in connecting to a database");
    process.exit(1);
  }
};

export { connectDB };
