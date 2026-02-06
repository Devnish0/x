import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import { asynchandler } from "./utils/asynchandler.js";
import { ApiError } from "./utils/apiError.js";
import { ApiResponse } from "./utils/apiResponse.js";
import userModel from "./models/userModel.js";
import { otpModel } from "./models/otpModel.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API);
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import postModel from "./models/postModel.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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

// auth routes

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
app.post(
  "/api/comment",
  protectedroute,
  asynchandler((req, res) => {
    console.log("lol");
    res.status(201).json(new ApiResponse(201, "comment route hit"));
  })
);
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) throw new ApiError(401, "invalid credentials");

  const iscorrect = await user.isPasswordCorrect(password); // this is the mongoose middleware
  if (!iscorrect) throw new ApiError(401, "invalid credentials");

  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60, data: email },
    process.env.JWT_SECRET
  );

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: true, // set true when on HTTPS
      sameSite: "none", // use "none" + secure:true if cross-site HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ success: true });
});
const generateOTP = (length = 6) => {
  const max = 10 ** length;
  const n = Math.floor(Math.random() * max);
  return n.toString().padStart(length, "0");
};
app.post(
  "/api/signup",
  asynchandler(async (req, res) => {
    const { name, username, email, password, bio, location } = req.body;

    // checking for empty field
    if (!name || !username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }
    // checking for already existing user
    const alreadycreated = await userModel.findOne({ email });
    if (alreadycreated) {
      throw new ApiError(400, "User already exists");
    }
    // generating otp and sending email
    const otpHash = generateOTP();
    const data = await resend.emails.send({
      from: "no-reply@nishank.dev",
      to: email,
      subject: "Your OTP Code",
      text: `Here is your OTP code: ${otpHash}`,
    });

    const otpdata = await otpModel.create({
      email,
      otpHash,
      otpExpires: Date.now() + 300000,
      otpAttempts: 0,
      signupData: {
        name,
        username,
        email,
        password,
        bio,
        location,
        pfp: null,
      },
    });
    res.status(201).json(new ApiResponse(201, true, "Otp sent to email"));
  })
);
app.post(
  "/api/verify",
  asynchandler(async (req, res) => {
    const { otp } = req.body;

    const record = await otpModel.findOne({}).sort({ _id: -1 }).limit(1);
    if (!record) {
      throw new ApiError(400, "no otp record found");
    }
    if (record.otpExpires < Date.now()) {
      throw new ApiError(400, "otp expired");
    }
    if (record.otpAttempts >= 3) {
      throw new ApiError(400, "otp attempts exceeded");
    }
    const isValid = await record.isOtpCorrect(otp);
    // bcrypt.compare(otp, record.otpHash);
    if (!isValid) {
      record.otpAttempts += 1;
      await record.save();
      throw new ApiError(400, "incorrect OTP");
    }
    const { name, username, email, password, bio, location } =
      record.signupData;
    // if everything goes right create the user
    const createdUser = await userModel.create({
      name,
      username,
      email,
      password,
      bio,
      location,
    });
    // assigning a jwt token
    const token = jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: email },
      process.env.JWT_SECRET
    );
    // setting the token in cookie
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // set true when on HTTPS
        sameSite: "none", // use "none" + secure:true if cross-site HTTPS
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json(new ApiResponse(201, true, "User created successfully"));
  })
);
// logout route
app.get(
  "/api/logout",
  protectedroute,
  asynchandler(async (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json(new ApiResponse(201, true, "Logged out successfully"));
  })
);

app.get(
  "/api/profile",
  protectedroute,
  asynchandler(async (req, res) => {
    // Populate posts when fetching user profile
    const user = await userModel.findById(req.user._id).populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
      populate: { path: "user", select: "name username isAdmin" },
    });
    const {
      _id,
      name,
      username,
      email,
      createdAt,
      followers,
      following,
      posts,
      isAdmin,
      bio,
      location,
    } = user;
    const userProfile = {
      id: _id,
      name,
      username,
      email,
      createdAt,
      followers,
      following,
      posts,
      isAdmin,
      bio,
      location,
    };
    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: userProfile },
          "profile Fetched Successfully"
        )
      );
  })
);
app.get(
  "/api/post/:id",
  protectedroute,
  asynchandler(async (req, res) => {
    const { id } = req.params;
    const post = await postModel
      .findOne({ _id: id })
      .populate("user", "username name isAdmin");
    res
      .status(201)
      .json(new ApiResponse(201, { post }, "Post fetched successfully"));
  })
);

app.post(
  "/api/create",
  protectedroute,
  asynchandler(async (req, res) => {
    const userId = req.user._id;
    const data = req.body.text;
    const post = await postModel.create({ user: userId, data });
    await userModel.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } },
      { new: true }
    );
    res
      .status(201)
      .json(new ApiResponse(201, { posts }, "post created successfully"));
  })
);
app.get(
  "/api/index",
  protectedroute,
  asynchandler(async (req, res) => {
    const posts = await postModel
      .find()
      .populate("user", "username name isAdmin")
      .sort({ createdAt: -1 });
    res.status(200).json(
      // new ApiResponse(200, true, { posts }, "Posts fetched successfully")
      new ApiResponse(200, { posts }, "Posts fetched successfully")
    );
  })
);
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
app.get("/api/edit", protectedroute, (req, res) => {
  const { name, username, bio, location } = req.user;
  return res.status(200).json({ name, username, bio, location });
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

app.delete("/api/deletepost/:id", protectedroute, async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params object

    // Check if post exists and user owns it
    const post = await postModel.findById(id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Verify user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Delete post
    await postModel.findByIdAndDelete(id);

    // Remove post ID from user's posts array
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { posts: id } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default app;
