import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

mongoose.connect(process.env.DBURL);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
      default: "bio not given",
    },
    location: String,
    DateOfBirth: Date,
    isAdmin: { type: Boolean, default: false },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }], // fix ref
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
