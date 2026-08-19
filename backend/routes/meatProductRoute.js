import express from "express";

import {
  createMeatProduct,
  getAvailableMeatProducts,
  updatePackagingStatus,
  updateProcessingStatus,
} from "../controllers/meatProductController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();
router.get(
  "/available",
  isAuthenticated,
  authorizeRoles("super_shop"),
  getAvailableMeatProducts,
);
// Slaughterhouse → Create Meat Product
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  createMeatProduct,
);
router.patch(
  "/:id/processing",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  updateProcessingStatus,
);
router.patch(
  "/:id/packaging",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  updatePackagingStatus,
);

export default router;
