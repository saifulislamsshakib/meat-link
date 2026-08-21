import mongoose from "mongoose";

const meatProductSchema = new mongoose.Schema(
  {
    slaughterhouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    procurementRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProcurementRequest",
      required: true,
    },

    sourceLivestock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livestock",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    meatType: {
      type: String,
      enum: ["beef", "mutton", "buffalo", "goat", "other"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
    },

    processingStatus: {
      type: String,
      enum: ["pending", "processing", "processed"],
      default: "pending",
    },

    packagingStatus: {
      type: String,
      enum: ["pending", "packaged"],
      default: "pending",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const MeatProduct = mongoose.model("MeatProduct", meatProductSchema);
