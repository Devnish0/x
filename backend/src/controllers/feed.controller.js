import { asyncHandler } from "../utils/asyncHandler.js";
import postModel from "../models/postModel.js";
import { ApiResponse } from "../utils/apiResponse.js";

const feedController = asyncHandler(async (req, res) => {
  const posts = await postModel
    .find()
    .populate("user", "username name isAdmin")
    .sort({ createdAt: -1 });
  res.status(200).json(
    // new ApiResponse(200, true, { posts }, "Posts fetched successfully")
    new ApiResponse(200, { posts }, "Posts fetched successfully")
  );
});

export { feedController };
