import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    createAt: {
      type: String,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
