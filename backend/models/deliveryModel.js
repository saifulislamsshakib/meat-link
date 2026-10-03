import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    // Slaughterhouse -> Buyer
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MeatOrder",
      default: null,
    },

    // Farmer -> Slaughterhouse
    procurementRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProcurementRequest",
      default: null,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pickupLocation: {
      type: String,
      required: true,
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

    deliveryType: {
      type: String,
      enum: ["meat_to_buyer", "livestock_to_slaughterhouse"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "assigned",
        "accepted",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      default: "assigned",
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    pickedUpAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
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

// One delivery per MeatOrder
deliverySchema.index(
  { order: 1 },
  {
    unique: true,
    partialFilterExpression: {
      order: { $type: "objectId" },
    },
  },
);

// One delivery per ProcurementRequest
deliverySchema.index(
  { procurementRequest: 1 },
  {
    unique: true,
    partialFilterExpression: {
      procurementRequest: { $type: "objectId" },
    },
  },
);

export const Delivery = mongoose.model("Delivery", deliverySchema);
