import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePic: { type: String, default: "" }, //cloudinary img url
    profilePicPublicId: { type: String, default: "" }, //cloudinary public id for image deletation.
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["farmer", "slaughterhouse", "super_shop", "driver", "admin"],
      default: "super_shop",
    },
    token: { type: String, default: null },
    isVarified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: String },
    city: { type: String },
    zipCode: { type: String },
    phoneNo: { type: String },
  },
  { timestamps: true },
);
export const User = mongoose.model("User", userSchema);
