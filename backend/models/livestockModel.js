import mongoose from "mongoose";

const livestockSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    animalType: {
      type: String,
      enum: ["cattle", "goat", "sheep", "buffalo"],
      required: true,
    },

    breed: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerAnimal: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "partially_available", "unavailable"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

export const Livestock = mongoose.model("Livestock", livestockSchema);
