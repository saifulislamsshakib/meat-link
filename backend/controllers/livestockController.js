import { Livestock } from "../models/livestockModel.js";

export const addLivestock = async (req, res) => {
  try {
    const {
      animalType,
      breed,
      quantity,
      availableQuantity,
      pricePerAnimal,
      location,
      description,
    } = req.body;

    // Check required fields
    if (
      !animalType ||
      !breed ||
      !quantity ||
      availableQuantity === undefined ||
      pricePerAnimal === undefined ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are needed",
      });
    }

    // Available quantity cannot be greater than total quantity
    if (availableQuantity > quantity) {
      return res.status(400).json({
        success: false,
        message: "Available quantity cannot be greater than total quantity",
      });
    }

    const livestock = await Livestock.create({
      farmer: req.user._id,
      animalType,
      breed,
      quantity,
      availableQuantity,
      pricePerAnimal,
      location,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Livestock added successfully",
      livestock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.find({
      farmer: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: livestock.length,
      livestock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLivestockById = async (req, res) => {
  try {
    const { id } = req.params;

    const livestock = await Livestock.findOne({
      _id: id,
      farmer: req.user._id,
    });

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: "Livestock not found",
      });
    }

    return res.status(200).json({
      success: true,
      livestock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLivestock = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      animalType,
      breed,
      quantity,
      availableQuantity,
      pricePerAnimal,
      location,
      description,
      availabilityStatus,
    } = req.body;

    const livestock = await Livestock.findOne({
      _id: id,
      farmer: req.user._id,
    });

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: "Livestock not found",
      });
    }

    if (quantity !== undefined && quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    if (availableQuantity !== undefined && availableQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Available quantity cannot be negative",
      });
    }

    const newQuantity = quantity !== undefined ? quantity : livestock.quantity;

    const newAvailableQuantity =
      availableQuantity !== undefined
        ? availableQuantity
        : livestock.availableQuantity;

    if (newAvailableQuantity > newQuantity) {
      return res.status(400).json({
        success: false,
        message: "Available quantity cannot be greater than total quantity",
      });
    }

    if (animalType !== undefined) livestock.animalType = animalType;
    if (breed !== undefined) livestock.breed = breed;
    if (quantity !== undefined) livestock.quantity = quantity;
    if (availableQuantity !== undefined) {
      livestock.availableQuantity = availableQuantity;
    }
    if (pricePerAnimal !== undefined) {
      livestock.pricePerAnimal = pricePerAnimal;
    }
    if (location !== undefined) livestock.location = location;
    if (description !== undefined) livestock.description = description;
    if (availabilityStatus !== undefined) {
      livestock.availabilityStatus = availabilityStatus;
    }

    await livestock.save();

    return res.status(200).json({
      success: true,
      message: "Livestock updated successfully",
      livestock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLivestock = async (req, res) => {
  try {
    const { id } = req.params;

    const livestock = await Livestock.findOne({
      _id: id,
      farmer: req.user._id,
    });

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: "Livestock not found",
      });
    }

    await Livestock.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Livestock deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLivestockAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availableQuantity } = req.body;

    if (availableQuantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Available quantity is required",
      });
    }

    if (availableQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Available quantity cannot be negative",
      });
    }

    const livestock = await Livestock.findOne({
      _id: id,
      farmer: req.user._id,
    });

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: "Livestock not found",
      });
    }

    if (availableQuantity > livestock.quantity) {
      return res.status(400).json({
        success: false,
        message: "Available quantity cannot be greater than total quantity",
      });
    }

    livestock.availableQuantity = availableQuantity;

    if (availableQuantity === 0) {
      livestock.availabilityStatus = "unavailable";
    } else if (availableQuantity < livestock.quantity) {
      livestock.availabilityStatus = "partially_available";
    } else {
      livestock.availabilityStatus = "available";
    }

    await livestock.save();

    return res.status(200).json({
      success: true,
      message: "Livestock availability updated successfully",
      livestock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAvailableLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.find({
      availableQuantity: { $gt: 0 },
    })
      .populate("farmer", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: livestock.length,
      livestock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
