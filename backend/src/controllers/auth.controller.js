import dotenv from "dotenv";
dotenv.config();
import userModel from "../models/userModel.js";
import { sendOtpEmail } from "../services/otpSend.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { otpModel } from "../models/otpModel.js";
import jwt from "jsonwebtoken";

const loginController = async (req, res) => {
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
    .json(new ApiResponse(201, "cookies set succesfully"));
};

const signUpController = asyncHandler(async (req, res) => {
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
  // sending OTP
  sendOtpEmail({ email, otpHash });

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
});

const verifyController = asyncHandler(async (req, res) => {
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
  const { name, username, email, password, bio, location } = record.signupData;
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
});

const logOutController = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(201).json(new ApiResponse(201, true, "Logged out successfully"));
});

export {
  loginController,
  signUpController,
  verifyController,
  logOutController,
};
