import { MeatProduct } from "../models/meatProductModel.js";
import { ProcurementRequest } from "../models/procurementRequestModel.js";
import { Livestock } from "../models/livestockModel.js";

export const createMeatProduct = async (req, res) => {
  try {
    const {
      procurementRequestId,
      productName,
      meatType,
      quantity,
      pricePerKg,
      description,
    } = req.body;

    // Check required fields
    if (
      !procurementRequestId ||
      !productName ||
      !meatType ||
      !quantity ||
      pricePerKg === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are needed",
      });
    }

    // Find accepted procurement request
    const procurementRequest = await ProcurementRequest.findOne({
      _id: procurementRequestId,
      slaughterhouse: req.user._id,
    });

    if (!procurementRequest) {
      return res.status(404).json({
        success: false,
        message: "Procurement request not found",
      });
    }

    // Only accepted requests can be processed
    if (procurementRequest.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted procurement requests can be processed",
      });
    }

    // Check if a meat product was already created
    const existingProduct = await MeatProduct.findOne({
      procurementRequest: procurementRequestId,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Meat product already created for this procurement request",
      });
    }

    // Find source livestock
    const livestock = await Livestock.findOne({
      _id: procurementRequest.livestock,
      farmer: procurementRequest.farmer,
    });

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: "Source livestock not found",
      });
    }

    const meatProduct = await MeatProduct.create({
      slaughterhouse: req.user._id,
      procurementRequest: procurementRequest._id,
      sourceLivestock: livestock._id,
      productName,
      meatType,
      quantity,
      pricePerKg,
      description: description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Meat product created successfully",
      meatProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// export const updateProcessingStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { processingStatus } = req.body;

//     const allowedStatuses = ["pending", "processing", "processed"];

//     if (!allowedStatuses.includes(processingStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid processing status",
//       });
//     }

//     const meatProduct = await MeatProduct.findOne({
//       _id: id,
//       slaughterhouse: req.user._id,
//     });

//     if (!meatProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Meat product not found",
//       });
//     }

//     meatProduct.processingStatus = processingStatus;

//     await meatProduct.save();

//     return res.status(200).json({
//       success: true,
//       message: "Processing status updated successfully",
//       meatProduct,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const updateProcessingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { processingStatus } = req.body;

    console.log("Processing Status Body:", req.body);
    console.log("Received Status:", processingStatus);

    const allowedStatuses = ["pending", "processing", "processed"];

    if (!allowedStatuses.includes(processingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid processing status",
      });
    }

    const meatProduct = await MeatProduct.findOne({
      _id: id,
      slaughterhouse: req.user._id,
    });

    if (!meatProduct) {
      return res.status(404).json({
        success: false,
        message: "Meat product not found",
      });
    }

    meatProduct.processingStatus = processingStatus;

    await meatProduct.save();

    return res.status(200).json({
      success: true,
      message: "Processing status updated successfully",
      meatProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updatePackagingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { packagingStatus } = req.body;

    console.log("Packaging Status Body:", req.body);
    console.log("Received Packaging Status:", packagingStatus);

    if (!["pending", "packaged"].includes(packagingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid packaging status",
      });
    }

    const meatProduct = await MeatProduct.findOne({
      _id: id,
      slaughterhouse: req.user._id,
    });

    if (!meatProduct) {
      return res.status(404).json({
        success: false,
        message: "Meat product not found",
      });
    }

    // Product must be processed before packaging
    if (
      packagingStatus === "packaged" &&
      meatProduct.processingStatus !== "processed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Meat product must be processed before packaging",
      });
    }

    meatProduct.packagingStatus = packagingStatus;

    await meatProduct.save();

    return res.status(200).json({
      success: true,
      message: "Packaging status updated successfully",
      meatProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAvailableMeatProducts = async (req, res) => {
  try {
    const products = await MeatProduct.find({
      processingStatus: "processed",
      packagingStatus: "packaged",
    })
      .populate("slaughterhouse", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
