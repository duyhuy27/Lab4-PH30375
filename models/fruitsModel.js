import mongoose, { Schema } from "mongoose";

const fruitsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    des: {
      type: String,
      required: true,
    },
    id_distributor: {
      type: Schema.Types.ObjectId,
      ref: "distributors",
    },
  },
  { timestamps: true }
);

export default mongoose.model("fruits", fruitsSchema);
