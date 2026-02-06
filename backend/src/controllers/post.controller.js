import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const createPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const data = req.body.text;
  const post = await postModel.create({ user: userId, data });
  await userModel.findByIdAndUpdate(
    userId,
    { $push: { posts: post._id } },
    { new: true }
  );
  res
    .status(201)
    .json(new ApiResponse(201, { post }, "post created successfully"));
});

const specificPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await postModel
    .findOne({ _id: id })
    .populate("user", "username name isAdmin");
  res
    .status(201)
    .json(new ApiResponse(201, { post }, "Post fetched successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract id from params object

  // Check if post exists and user owns it
  const post = await postModel.findById(id);
  if (!post) {
    throw new ApiError(400, "Post not found");
  }

  // Verify user owns the post
  if (post.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized ");
  }

  // Delete post
  await postModel.findByIdAndDelete(id);

  // Remove post ID from user's posts array
  await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { posts: id } },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "Post deleted succesfully"));
});

export { createPost, specificPost, deletePost };
