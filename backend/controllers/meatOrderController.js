import { MeatOrder } from "../models/meatOrderModel.js";
import { MeatProduct } from "../models/meatProductModel.js";

export const createMeatOrder = async (req, res) => {
  try {
    const {
      meatProductId,
      quantity,
      deliveryAddress,
      deliveryCity,
      deliveryZipCode,
      notes,
    } = req.body;

    // Check required fields
    if (!meatProductId || !quantity || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: "Meat product, quantity and delivery address are required",
      });
    }

    // Check quantity
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Find available packaged meat product
    const meatProduct = await MeatProduct.findOne({
      _id: meatProductId,
      processingStatus: "processed",
      packagingStatus: "packaged",
    });

    if (!meatProduct) {
      return res.status(404).json({
        success: false,
        message: "Available packaged meat product not found",
      });
    }

    // Check available quantity
    if (quantity > meatProduct.quantity) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity is greater than available quantity",
      });
    }

    // Calculate total price
    const totalPrice = quantity * meatProduct.pricePerKg;

    // Create order
    const order = await MeatOrder.create({
      superShop: req.user._id,
      meatProduct: meatProduct._id,
      quantity,
      pricePerKg: meatProduct.pricePerKg,
      totalPrice,
      deliveryAddress,
      deliveryCity: deliveryCity || "",
      deliveryZipCode: deliveryZipCode || "",
      notes: notes || "",
    });

    return res.status(201).json({
      success: true,
      message: "Meat order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyMeatOrders = async (req, res) => {
  try {
    const orders = await MeatOrder.find({
      superShop: req.user._id,
    })
      .populate(
        "meatProduct",
        "productName meatType pricePerKg quantity processingStatus packagingStatus",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getSlaughterhouseOrders = async (req, res) => {
  try {
    const orders = await MeatOrder.find()
      .populate("superShop", "firstName lastName email phoneNo")
      .populate({
        path: "meatProduct",
        select:
          "productName meatType quantity pricePerKg processingStatus packagingStatus slaughterhouse",
        match: {
          slaughterhouse: req.user._id,
        },
      })
      .sort({ createdAt: -1 });

    const filteredOrders = orders.filter((order) => order.meatProduct !== null);

    return res.status(200).json({
      success: true,
      count: filteredOrders.length,
      orders: filteredOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateMeatOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await MeatOrder.findById(id).populate(
      "meatProduct",
      "slaughterhouse productName",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Meat order not found",
      });
    }

    // Only the slaughterhouse that owns the meat product
    // can update this order
    if (
      order.meatProduct.slaughterhouse.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this order",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Meat order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
