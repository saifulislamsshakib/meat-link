import { Invoice } from "../models/invoiceModel.js";
import { MeatOrder } from "../models/meatOrderModel.js";

export const createInvoice = async (req, res) => {
  try {
    const { orderId, deliveryCharge = 0 } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (deliveryCharge < 0) {
      return res.status(400).json({
        success: false,
        message: "Delivery charge cannot be negative",
      });
    }

    const order = await MeatOrder.findById(orderId).populate(
      "meatProduct",
      "slaughterhouse productName meatType",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Meat order not found",
      });
    }

    // Only the slaughterhouse that owns this product
    // can generate the invoice
    if (
      order.meatProduct.slaughterhouse.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to generate this invoice",
      });
    }

    // Check if invoice already exists
    const existingInvoice = await Invoice.findOne({
      order: order._id,
    });

    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: "Invoice already exists for this order",
      });
    }

    const subtotal = order.totalPrice;
    const totalAmount = subtotal + deliveryCharge;

    const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      order: order._id,
      superShop: order.superShop,
      slaughterhouse: order.meatProduct.slaughterhouse,
      subtotal,
      deliveryCharge,
      totalAmount,
      status: "issued",
    });

    return res.status(201).json({
      success: true,
      message: "Invoice generated successfully",
      invoice,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      superShop: req.user._id,
    })
      .populate(
        "order",
        "quantity pricePerKg totalPrice status deliveryAddress deliveryCity deliveryZipCode",
      )
      .populate("slaughterhouse", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
