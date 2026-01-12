import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const DBURL = process.env.DBURL;

// Validate environment variables
if (!DBURL) {
  console.error("❌ Error: DBURL is not defined in .env file");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

// Handle unhandled errors
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});
