import mongoose from "mongoose";

const meatOrderSchema = new mongoose.Schema(
  {
    superShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    meatProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeatProduct",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricePerKg: {
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
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    deliveryAddress: {
      type: String,
      required: true,
    },

    deliveryCity: {
      type: String,
      default: "",
    },

    deliveryZipCode: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const MeatOrder = mongoose.model("MeatOrder", meatOrderSchema);
