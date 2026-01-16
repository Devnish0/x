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

let origin =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND
    : "http://localhost:5173";

const corsOptions = {
  origin: origin,

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
  const { name, username, email, password, bio, location } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    name,
    username,
    email,
    password: hashed,
    bio,
    location,
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
  console.log(post);
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
app.get("/api/edit", protectedroute, (req, res) => {
  const { name, username, bio, location } = req.user;
  return res.status(200).json({ name, username, bio, location });
});
app.post("/api/edit", protectedroute, async (req, res) => {
  try {
    const { name, username, bio, location } = req.body;
    const id = req.user._id;
    const editedUser = await userModel
      .findOneAndUpdate(
        id,
        {
          $set: { name, username, bio, location },
        },
        { new: true, runValidators: true }
      )
      .select("name username bio location");

    return res.status(201).json({ success: "ok" });

    // return res.status(200).json({ name, username, bio, location });
  } catch (error) {
    console.log(error);
  }
});
app.delete("/api/deletepost/:id", protectedroute, async (req, res) => {
  try {
    const { id } = req.params; // Extract id from params object
    console.log("route hit");

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
