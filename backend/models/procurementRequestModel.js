import mongoose from "mongoose";

const procurementRequestSchema = new mongoose.Schema(
  {
    slaughterhouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    livestock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livestock",
      required: true,
    },

    requestedQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerAnimal: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },

    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const ProcurementRequest = mongoose.model(
  "ProcurementRequest",
  procurementRequestSchema,
);
