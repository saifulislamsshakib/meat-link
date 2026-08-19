import { ProcurementRequest } from "../models/procurementRequestModel.js";
import { Livestock } from "../models/livestockModel.js";
import { User } from "../models/userModel.js";

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
      .populate("slaughterhouse", "firstName lastName email")
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
