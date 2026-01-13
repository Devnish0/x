import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import postModel from "./models/postModel.js";
const app = express();

app.use((req, res, next) => {
  console.log(req.method);
  next();
});
let origin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND
    : "http://localhost:5173";

const corsOptions = {
  // origin: origin,

  credentials: true,
};
app.set("trust proxy", 1);

app.use(cors(corsOptions));

// Logging middleware
// app.use((req, res, next) => {
//   console.log(
//     `[${new Date().toLocaleTimeString()}] ${req.method} ${req.path} ${
//       req.headers.origin
//     } `
//   );
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

// auth routes
//

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
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(401).json({ success: false });

  const iscorrect = await bcrypt.compare(password, user.password);
  if (!iscorrect) return res.status(401).json({ success: false });

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
app.post("/api/signup", async (req, res) => {
  const { name, username, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    name,
    username,
    email,
    password: hashed,
  });

  const token = jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: email },
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

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
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
      { new: true }
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
    res.status(200).json({ success: true, posts }); // Fixed typo: sucess → success
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
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
