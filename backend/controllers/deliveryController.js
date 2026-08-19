import { Delivery } from "../models/deliveryModel.js";
import { MeatOrder } from "../models/meatOrderModel.js";
import { User } from "../models/userModel.js";

export const assignDriver = async (req, res) => {
  try {
    const { orderId, driverId, pickupLocation, notes } = req.body;

    // Check required fields
    if (!orderId || !driverId || !pickupLocation) {
      return res.status(400).json({
        success: false,
        message: "Order ID, driver ID and pickup location are required",
      });
    }

    // Find order
    const order = await MeatOrder.findById(orderId).populate(
      "meatProduct",
      "slaughterhouse productName",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Meat order not found",
      });
    }

    // Check if this order belongs to logged-in slaughterhouse
    if (
      order.meatProduct.slaughterhouse.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to assign a driver for this order",
      });
    }

    // Order must be shipped
    if (order.status !== "shipped") {
      return res.status(400).json({
        success: false,
        message: "Only shipped orders can be assigned to a driver",
      });
    }

    // Find driver
    const driver = await User.findOne({
      _id: driverId,
      role: "driver",
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Check if delivery already exists
    const existingDelivery = await Delivery.findOne({
      order: order._id,
    });

    if (existingDelivery) {
      return res.status(400).json({
        success: false,
        message: "A delivery has already been assigned for this order",
      });
    }

    // Create delivery
    const delivery = await Delivery.create({
      order: order._id,
      driver: driver._id,
      pickupLocation,
      deliveryAddress: order.deliveryAddress,
      deliveryCity: order.deliveryCity,
      deliveryZipCode: order.deliveryZipCode,
      notes: notes || "",
      status: "assigned",
    });

    return res.status(201).json({
      success: true,
      message: "Driver assigned successfully",
      delivery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      driver: req.user._id,
    })
      .populate({
        path: "order",
        select:
          "quantity pricePerKg totalPrice status deliveryAddress deliveryCity deliveryZipCode notes",
        populate: {
          path: "meatProduct",
          select: "productName meatType",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: deliveries.length,
      deliveries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const acceptDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      _id: id,
      driver: req.user._id,
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    if (delivery.status !== "assigned") {
      return res.status(400).json({
        success: false,
        message: "Only assigned deliveries can be accepted",
      });
    }

    delivery.status = "accepted";
    delivery.acceptedAt = new Date();

    await delivery.save();

    return res.status(200).json({
      success: true,
      message: "Delivery accepted successfully",
      delivery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const pickupDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      _id: id,
      driver: req.user._id,
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    if (delivery.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted deliveries can be picked up",
      });
    }

    delivery.status = "picked_up";
    delivery.pickedUpAt = new Date();

    await delivery.save();

    return res.status(200).json({
      success: true,
      message: "Delivery picked up successfully",
      delivery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const startDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      _id: id,
      driver: req.user._id,
    });

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    if (delivery.status !== "picked_up") {
      return res.status(400).json({
        success: false,
        message: "Only picked up deliveries can start transit",
      });
    }

    delivery.status = "in_transit";

    await delivery.save();

    return res.status(200).json({
      success: true,
      message: "Delivery is now in transit",
      delivery,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const completeDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findOne({
      _id: id,
      driver: req.user._id,
    }).populate("order");

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: "Delivery not found",
      });
    }

    if (delivery.status !== "in_transit") {
      return res.status(400).json({
        success: false,
        message: "Only in-transit deliveries can be completed",
      });
    }

    // Complete delivery
    delivery.status = "delivered";
    delivery.deliveredAt = new Date();

    await delivery.save();

    // Update related meat order
    const order = delivery.order;

    if (order) {
      order.status = "delivered";
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: "Delivery completed successfully",
      delivery,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
