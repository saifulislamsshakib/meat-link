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

    // Livestock must actually be delivered to slaughterhouse
    if (procurementRequest.status !== "completed") {
      return res.status(400).json({
        success: false,
        message:
          "Only completed procurement requests can be processed into meat products",
      });
    }

    const existingProduct = await MeatProduct.findOne({
      procurementRequest: procurementRequestId,
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Meat product already created for this procurement request",
      });
    }

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
      productName: productName.trim(),
      meatType,
      quantity: Number(quantity),
      pricePerKg: Number(pricePerKg),
      description: description?.trim() || "",
      processingStatus: "pending",
      packagingStatus: "pending",
      isPublished: false,
    });

    return res.status(201).json({
      success: true,
      message: "Meat product created successfully",
      meatProduct,
    });
  } catch (error) {
    console.error("Create meat product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProcessingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { processingStatus } = req.body;

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

    // If product goes back from processed, it cannot remain packaged/published
    if (processingStatus !== "processed") {
      meatProduct.packagingStatus = "pending";
      meatProduct.isPublished = false;
    }

    await meatProduct.save();

    return res.status(200).json({
      success: true,
      message: "Processing status updated successfully",
      meatProduct,
    });
  } catch (error) {
    console.error("Update processing status error:", error);

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

    // If package is removed, product should not stay published
    if (packagingStatus !== "packaged") {
      meatProduct.isPublished = false;
    }

    await meatProduct.save();

    return res.status(200).json({
      success: true,
      message: "Packaging status updated successfully",
      meatProduct,
    });
  } catch (error) {
    console.error("Update packaging status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const publishMeatProduct = async (req, res) => {
  try {
    const { id } = req.params;

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

    if (meatProduct.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Meat product is already published",
      });
    }

    if (meatProduct.processingStatus !== "processed") {
      return res.status(400).json({
        success: false,
        message: "Meat product must be processed before publishing",
      });
    }

    if (meatProduct.packagingStatus !== "packaged") {
      return res.status(400).json({
        success: false,
        message: "Meat product must be packaged before publishing",
      });
    }

    if (Number(meatProduct.quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product quantity must be greater than 0",
      });
    }

    meatProduct.isPublished = true;

    await meatProduct.save();

    return res.status(200).json({
      success: true,
      message: "Meat product published to Super Shops successfully",
      meatProduct,
    });
  } catch (error) {
    console.error("Publish meat product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unpublishMeatProduct = async (req, res) => {
  try {
    const { id } = req.params;

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

    if (!meatProduct.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Meat product is already unpublished",
      });
    }

    meatProduct.isPublished = false;

    await meatProduct.save();

    return res.status(200).json({
      success: true,
      message: "Meat product unpublished successfully",
      meatProduct,
    });
  } catch (error) {
    console.error("Unpublish meat product error:", error);

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
      isPublished: true,
      isArchived: false,
      quantity: { $gt: 0 },
    })
      .populate("slaughterhouse", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get available meat products error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyMeatProducts = async (req, res) => {
  try {
    const products = await MeatProduct.find({
      slaughterhouse: req.user._id,
    })
      .populate(
        "procurementRequest",
        "requestedQuantity pricePerAnimal totalPrice status",
      )
      .populate(
        "sourceLivestock",
        "animalType breed quantity availableQuantity",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get my meat products error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const archiveMeatProduct = async (req, res) => {
  try {
    const { id } = req.params;

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

    if (meatProduct.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Meat product is already archived",
      });
    }

    if (
      meatProduct.processingStatus !== "processed" ||
      meatProduct.packagingStatus !== "packaged"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only processed and packaged products can be archived",
      });
    }

    if (meatProduct.quantity > 0) {
      return res.status(400).json({
        success: false,
        message: "Product can only be archived when available quantity is 0",
      });
    }

    meatProduct.isArchived = true;
    meatProduct.isPublished = false;

    await meatProduct.save();

    return res.status(200).json({
      success: true,
      message: "Meat product archived successfully",
      meatProduct,
    });
  } catch (error) {
    console.error("Archive meat product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
