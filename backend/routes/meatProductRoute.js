import express from "express";

import {
  archiveMeatProduct,
  createMeatProduct,
  getAvailableMeatProducts,
  getMyMeatProducts,
  publishMeatProduct,
  unpublishMeatProduct,
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

router.get(
  "/my-products",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  getMyMeatProducts,
);

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

router.patch(
  "/:id/publish",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  publishMeatProduct,
);

router.patch(
  "/:id/unpublish",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  unpublishMeatProduct,
);

router.patch(
  "/:id/archive",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  archiveMeatProduct,
);

export default router;
