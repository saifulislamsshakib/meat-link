import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    superShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeatOrder",
      required: true,
      unique: true,
    },

    slaughterhouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    feedback: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Rating = mongoose.model("Rating", ratingSchema);
