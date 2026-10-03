import { Rating } from "../models/ratingModel.js";
import { MeatOrder } from "../models/meatOrderModel.js";

// Super Shop → Submit Rating
export const createRating = async (req, res) => {
  try {
    const { orderId, rating, feedback } = req.body;

    if (!orderId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Order ID and rating are required",
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const order = await MeatOrder.findById(orderId).populate({
      path: "meatProduct",
      select: "slaughterhouse productName",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.meatProduct) {
      return res.status(404).json({
        success: false,
        message: "Related meat product not found",
      });
    }

    // Only the Super Shop that placed this order can rate it
    if (order.superShop.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to rate this order",
      });
    }

    // Only delivered orders can be rated
    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be rated",
      });
    }

    // Prevent duplicate rating
    const existingRating = await Rating.findOne({
      order: order._id,
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "This order has already been rated",
      });
    }

    const newRating = await Rating.create({
      superShop: req.user._id,
      order: order._id,
      slaughterhouse: order.meatProduct.slaughterhouse,
      rating: Number(rating),
      feedback: feedback || "",
    });

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully",
      rating: newRating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Slaughterhouse → View Own Ratings
export const getSlaughterhouseRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({
      slaughterhouse: req.user._id,
    })
      .populate("superShop", "firstName lastName email")
      .populate("order", "quantity pricePerKg totalPrice status createdAt")
      .sort({ createdAt: -1 });

    const totalRatings = ratings.length;

    const totalScore = ratings.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0,
    );

    const averageRating =
      totalRatings > 0 ? Number((totalScore / totalRatings).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      count: totalRatings,
      averageRating,
      ratings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin → View All Ratings
export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("superShop", "firstName lastName email")
      .populate("slaughterhouse", "firstName lastName email")
      .populate("order", "quantity pricePerKg totalPrice status createdAt")
      .sort({ createdAt: -1 });

    const totalRatings = ratings.length;

    const totalScore = ratings.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0,
    );

    const averageRating =
      totalRatings > 0 ? Number((totalScore / totalRatings).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      count: totalRatings,
      averageRating,
      ratings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createRating,
  getSlaughterhouseRatings,
  getAllRatings,
};
