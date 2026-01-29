import mongoose from "mongoose";
const otpSchema = mongoose.Schema({
  email: String,
  otpHash: String,
  otpExpires: Number,
  otpAttempts: Number,
  signupData: {
    name: String,
    username: String,
    email: String,
    password: String,
    bio: String,
    location: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Auto-delete after 10 minutes
  },
});

export const otpModel = mongoose.model("OTP", otpSchema);
