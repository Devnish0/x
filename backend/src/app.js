import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
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
import path from "path";

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
app.post("/api/comment", protectedroute, (req, res) => {
  console.log("lol");
  res.status(201).json({ success: true });
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(401).json({ success: false });

  const iscorrect = await bcrypt.compare(password, user.password);
  if (!iscorrect) return res.status(401).json({ success: false });

  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60, data: email },
    process.env.JWT_SECRET,
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
const generateOTP = () => {
  return Math.floor(Math.random() * 9000).toString();
};
app.post("/api/signup", async (req, res) => {
  const { name, username, email, password, bio, location } = req.body;

  const alreadycreated = await userModel.findOne({ email });
  if (alreadycreated) {
    return res
      .status(401)
      .json({ message: "Email already available please log in" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPasswd = await bcrypt.hash(password, salt);
  try {
    const otp = generateOTP();
    const data = await resend.emails.send({
      from: "no-reply@nishank.dev",
      to: email,
      subject: "Your OTP Code",
      text: `Here is your OTP code: ${otp}`,
    });
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const otpdata = await otpModel.create({
      email,
      otpHash: hashedOTP,
      otpExpires: Date.now() + 300000,
      otpAttempts: 0,
      signupData: {
        name,
        username,
        email,
        password: hashedPasswd,
        bio,
        location,
        pfp: null,
      },
    });
  } catch (error) {
    console.log(error);
  }
  res.status(201).json({ message: "okay" });
});
app.post("/api/verify", async (req, res) => {
  const { otp } = req.body;

  const record = await otpModel.findOne({}).sort({ _id: -1 }).limit(1);
  // console.log("record:", record);
  if (!record) {
    return res.status(400).json({ message: "invalid OTP" });
  }
  if (record.otpExpires < Date.now()) {
    return res.status(400).json({ message: "otp expired" });
  }
  if (record.otpAttemptes >= 3) {
    return res.status(400).json({ message: "enough otp for today" });
  }
  const isValid = await bcrypt.compare(otp, record.otpHash);
  if (!isValid) {
    record.otpAttempts += 1;
    await record.save();
    return res.status(400).json({ message: "invalid OTP" });
  }
  const { name, username, email, password, bio, location } = record.signupData;
  const createdUser = userModel.create({
    name,
    username,
    email,
    password,
    bio,
    location,
  });

  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: email },
    process.env.JWT_SECRET,
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
// logout route
app.get("/api/logout", protectedroute, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(201).json({ success: true });
});

app.get("/api/profile", protectedroute, async (req, res) => {
  try {
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
    res.json({
      success: true,
      user: {
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
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: error.message });
  }
});
app.get("/api/post/:id", protectedroute, async (req, res) => {
  const { id } = req.params;
  const post = await postModel
    .findOne({ _id: id })
    .populate("user", "username name isAdmin");
  res.status(201).json(post);
});
app.post("/api/post", protectedroute, async (req, res) => {});

// Fix pushing post ID
app.post("/api/create", protectedroute, async (req, res) => {
  const userId = req.user._id;
  const data = req.body.text;
  try {
    const post = await postModel.create({ user: userId, data });
    await userModel.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } },
      { new: true },
    );
    res.status(201).json({ success: true, post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});
app.get("/api/index", protectedroute, async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("user", "username name isAdmin")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
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
          { new: true, runValidators: true },
        )
        .select("name username bio location");

      return res.status(200).json({ name, username, bio, location });
    } catch (error) {
      console.log(error);
    }
  },
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
      { new: true },
    );

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default app;
