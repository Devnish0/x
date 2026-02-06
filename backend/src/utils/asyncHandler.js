// this is a higher order function
// means takes a function inside a function
// this just means

// const asyncHandler = () => {
// () => {};
// };

// ? why do we need async handler in the first place???
// ? to avoid writing try catch block everytime
// ? and implimenting a project wise try catch error block

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.log("ERROR", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: "from AS: " + error.message,
    });
  }
};

export { asyncHandler };
