import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
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
});

export { registerUser };
