import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const userProfile = asyncHandler(async (req, res) => {
  // Populate posts when fetching user profile
  const user = await userModel.findById(req.user._id).populate({
    path: "posts",
    options: { sort: { createdAt: -1 } },
    populate: { path: "user", select: "name username isAdmin" },
  });
  const {
    _id,
    name,
    username,
    email,
    createdAt,
    followers,
    following,
    posts,
    isAdmin,
    bio,
    location,
  } = user;
  const userProfile = {
    id: _id,
    name,
    username,
    email,
    createdAt,
    followers,
    following,
    posts,
    isAdmin,
    bio,
    location,
  };
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: userProfile },
        "profile Fetched Successfully"
      )
    );
});
const editUserProfile = asyncHandler(async (req, res) => {
  const { name, username, bio, location } = req.body;
  const id = req.user._id;
  const editedUser = await userModel
    .findByIdAndUpdate(
      id,
      {
        $set: { name, username, bio, location },
      },
      { new: true, runValidators: true }
    )
    .select("name username bio location");
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: editedUser }, "edit data sent succesfully")
    );
});

export { userProfile, editUserProfile };
