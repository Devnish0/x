import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createComment = asyncHandler(async (req, res) => {
  console.log("lol");
  res.status(201).json(new ApiResponse(201, "comment route hit"));
})

export{createComment}