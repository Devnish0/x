import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiResponse } from "./utils/apiResponse.js";
import postRouter from "./routes/post.routes.js";
import userModel from "./models/userModel.js";
import postModel from "./models/postModel.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import feedRouter from "./routes/feed.routes.js";
import jwt from "jsonwebtoken";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://intiger.nishank.dev"]
    : ["http://localhost:5173"];
const corsOptions = {
  origin: function (requestOrigin, callback) {
    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.set("trust proxy", 1);
// setting up the middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

const protectedroute = async (req, res, next) => {
  const jwtToken = req.cookies.token;
  if (!jwtToken)
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });

  try {
    const data = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const user = await userModel
      .findOne({ email: data.data })
      .populate("posts"); // Populate posts here too

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

app.use("/api/auth", authRouter);
app.use("/api/post", protectedroute, postRouter);
app.use("/api/feed", protectedroute, feedRouter);
app.use("/api/user", protectedroute, userRouter);
// app.use("/api/comment", protectedroute, commentRouter);

// multer starts from here
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + ext);
  },
});
const upload = multer({
  storage,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // uploading the file to the cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // now the file has been uploaded successfully
    // delete the file from the local temp folder

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

app.post(
  "/api/edit",
  upload.single("avatar"),
  protectedroute,
  async (req, res) => {
    try {
      const { name, username, bio, location } = req.body;
      const id = req.user._id;
      let avatarUrl;
      if (req.file) {
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        if (cloudinaryResponse) {
          avatarUrl = cloudinaryResponse.secure_url;
        }
      }
      const editedUser = await userModel
        .findOneAndUpdate(
          id,
          {
            $set: { name, username, bio, location, pfp: avatarUrl },
          },
          { new: true, runValidators: true }
        )
        .select("name username bio location");

      return res.status(200).json({ name, username, bio, location });
    } catch (error) {
      console.log(error);
    }
  }
);

export default app;
