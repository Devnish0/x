import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    bio: {
      type: String,
      default: "bio not given",
    },
    location: String,
    isAdmin: { type: Boolean, default: false },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    pfp: String,
  },
  { timestamps: true }
);
// learning about making custom methods for mongoose models, will be useful for password hashing and verification
// starting with automatically hashing the password before saving the user document, using bcryptjs for hashing
//  find the docs on the mongoose middlewares
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // this will always run whenever anything changes in the usermodel to deal with this we have to
  // add a check to only make it run when the password field changes
  this.password = await bcrypt.hash(this.password, 10);
});

// making my own middleware to check the isPasswordCorrect

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export default mongoose.model("user", userSchema);
