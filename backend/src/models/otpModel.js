import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema({
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

// Pre-save hook: hash password and OTP
otpSchema.pre("save", async function () {
  if (this.isModified("signupData.password")) {
    this.signupData.password = await bcrypt.hash(this.signupData.password, 10);
  }

  if (this.isModified("otpHash")) {
    this.otpHash = await bcrypt.hash(this.otpHash, 10);
  }
});

// Compare plain OTP with hashed OTP
otpSchema.methods.isOtpCorrect = async function (otp) {
  return await bcrypt.compare(otp, this.otpHash);
};

export const otpModel = mongoose.model("OTP", otpSchema);
