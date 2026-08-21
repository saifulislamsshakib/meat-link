import { Complaint } from "../models/complaintModel.js";
import { MeatOrder } from "../models/meatOrderModel.js";

export const createComplaint = async (req, res) => {
  try {
    const { subject, message, relatedOrder } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    // If an order ID is provided, verify that the order exists
    if (relatedOrder) {
      const order = await MeatOrder.findById(relatedOrder);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Related order not found",
        });
      }
    }

    const complaint = await Complaint.create({
      complainant: req.user._id,
      subject,
      message,
      relatedOrder: relatedOrder || null,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("complainant", "firstName lastName email role")
      .populate(
        "relatedOrder",
        "quantity pricePerKg totalPrice status deliveryAddress",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const allowedStatuses = ["pending", "in_progress", "resolved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = status;

    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse;
    }

    if (status === "resolved" || status === "rejected") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
