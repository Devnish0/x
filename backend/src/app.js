import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import postRouter from "./routes/post.routes.js";
import feedRouter from "./routes/feed.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import protectedroute from "./middlewares/authMiddleware.js";

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

app.use("/api/auth", authRouter);
app.use("/api/post", protectedroute, postRouter);
app.use("/api/feed", protectedroute, feedRouter);
app.use("/api/user", protectedroute, userRouter);
// app.use("/api/comment", protectedroute, commentRouter);

export default app;
