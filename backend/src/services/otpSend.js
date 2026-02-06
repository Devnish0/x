import resend from "../config/resend.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendOtpEmail = asyncHandler(async ({ email, otpHash }) => {
  const data = await resend.emails.send({
    from: "no-reply@nishank.dev",
    to: email,
    subject: "Your OTP Code",
    text: `Here is your OTP code: ${otpHash}`,
  });
  return data;
});

export { sendOtpEmail };
