import { ProcurementRequest } from "../models/procurementRequestModel.js";
import { Livestock } from "../models/livestockModel.js";
import { User } from "../models/userModel.js";
import { createNotification } from "./notificationController.js";
import { Delivery } from "../models/deliveryModel.js";
export const createProcurementRequest = async (req, res) => {
  try {
    const { farmerId, livestockId, requestedQuantity, message } = req.body;

    // Check required fields
    if (!farmerId || !livestockId || !requestedQuantity) {
      return res.status(400).json({
        success: false,
        message: "Farmer, livestock and requested quantity are required",
      });
    }

    // Check farmer
    const farmer = await User.findOne({
      _id: farmerId,
      role: "farmer",
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    // Check livestock
    const livestock = await Livestock.findOne({
      _id: livestockId,
      farmer: farmerId,
    });

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: "Livestock not found for this farmer",
      });
    }

    // Check requested quantity
    if (requestedQuantity > livestock.availableQuantity) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity is greater than available quantity",
      });
    }

    const totalPrice = requestedQuantity * livestock.pricePerAnimal;

    const procurementRequest = await ProcurementRequest.create({
      slaughterhouse: req.user._id,
      farmer: farmerId,
      livestock: livestockId,
      requestedQuantity,
      pricePerAnimal: livestock.pricePerAnimal,
      totalPrice,
      message: message || "",
    });
    await createNotification({
      recipient: farmerId,
      sender: req.user._id,
      type: "procurement",
      title: "New Procurement Request",
      message: `A slaughterhouse requested ${requestedQuantity} ${livestock.animalType}.`,
      relatedId: procurementRequest._id,
    });

    return res.status(201).json({
      success: true,
      message: "Procurement request sent successfully",
      procurementRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMyProcurementRequests = async (req, res) => {
  try {
    const requests = await ProcurementRequest.find({
      farmer: req.user._id,
    })
      .populate(
        "slaughterhouse",
        "firstName lastName email address city zipCode phoneNo",
      )
      .populate(
        "livestock",
        "animalType breed quantity availableQuantity pricePerAnimal location",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const acceptProcurementRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ProcurementRequest.findOne({
      _id: id,
      farmer: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Procurement request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    const livestock = await Livestock.findOne({
      _id: request.livestock,
      farmer: req.user._id,
    });

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: "Livestock not found",
      });
    }

    if (request.requestedQuantity > livestock.availableQuantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough livestock available",
      });
    }

    livestock.availableQuantity -= request.requestedQuantity;

    if (livestock.availableQuantity === 0) {
      livestock.availabilityStatus = "unavailable";
    } else if (livestock.availableQuantity < livestock.quantity) {
      livestock.availabilityStatus = "partially_available";
    } else {
      livestock.availabilityStatus = "available";
    }

    request.status = "accepted";

    await livestock.save();
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Procurement request accepted successfully",
      request,
      livestock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const rejectProcurementRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ProcurementRequest.findOne({
      _id: id,
      farmer: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Procurement request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed",
      });
    }

    request.status = "rejected";

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Procurement request rejected successfully",
      request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getMySentProcurementRequests = async (req, res) => {
  try {
    const requests = await ProcurementRequest.find({
      slaughterhouse: req.user._id,
    })
      .populate("farmer", "firstName lastName email phoneNo")
      .populate(
        "livestock",
        "animalType breed quantity availableQuantity pricePerAnimal location",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignDriverToProcurement = async (req, res) => {
  try {
    const { procurementRequestId, driverId, notes } = req.body;

    if (!procurementRequestId || !driverId) {
      return res.status(400).json({
        success: false,
        message: "Procurement request ID and driver ID are required",
      });
    }

    // Find procurement request
    const request = await ProcurementRequest.findById(procurementRequestId)
      .populate(
        "slaughterhouse",
        "firstName lastName email address city zipCode phoneNo",
      )
      .populate(
        "livestock",
        "animalType breed quantity availableQuantity pricePerAnimal location",
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Procurement request not found",
      });
    }

    // Only the farmer who owns this request can assign a driver
    if (request.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to assign a driver",
      });
    }

    // Request must be accepted first
    if (request.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Only accepted procurement requests can be assigned for delivery",
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

    // Check existing delivery
    const existingDelivery = await Delivery.findOne({
      procurementRequest: request._id,
    });

    if (existingDelivery) {
      return res.status(400).json({
        success: false,
        message:
          "A delivery has already been assigned for this procurement request",
      });
    }

    // Make sure required destination information exists
    if (!request.slaughterhouse?.address) {
      return res.status(400).json({
        success: false,
        message: "Slaughterhouse address is not available",
      });
    }

    if (!request.livestock?.location) {
      return res.status(400).json({
        success: false,
        message: "Livestock pickup location is not available",
      });
    }

    // Create delivery
    const delivery = await Delivery.create({
      procurementRequest: request._id,

      driver: driver._id,

      // Farmer's livestock location
      pickupLocation: request.livestock.location,

      // Slaughterhouse address
      deliveryAddress: request.slaughterhouse.address,
      deliveryCity: request.slaughterhouse.city || "",
      deliveryZipCode: request.slaughterhouse.zipCode || "",

      deliveryType: "livestock_to_slaughterhouse",

      notes: notes || "",

      status: "assigned",
    });

    // Notify driver
    await createNotification({
      recipient: driver._id,
      sender: req.user._id,
      type: "delivery",
      title: "New Livestock Delivery Assigned",
      message: `A new livestock delivery has been assigned to you for ${request.livestock.animalType}.`,
      relatedId: delivery._id,
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
