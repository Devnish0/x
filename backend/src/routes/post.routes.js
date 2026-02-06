import postModel from "../models/postModel";
import { asyncHandler } from "../utils/asyncHandler";

const postCreate = asyncHandler(async (req, res) => {
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
    .json(new ApiResponse(201, { posts }, "post created successfully"));
});

export {};
