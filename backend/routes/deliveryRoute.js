import express from "express";

import {
  acceptDelivery,
  assignDriver,
  completeDelivery,
  getMyDeliveries,
  pickupDelivery,
  startDelivery,
} from "../controllers/deliveryController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Slaughterhouse → Assign Driver
router.post(
  "/assign",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  assignDriver,
);
router.get(
  "/my-deliveries",
  isAuthenticated,
  authorizeRoles("driver"),
  getMyDeliveries,
);
router.patch(
  "/:id/accept",
  isAuthenticated,
  authorizeRoles("driver"),
  acceptDelivery,
);
router.patch(
  "/:id/pickup",
  isAuthenticated,
  authorizeRoles("driver"),
  pickupDelivery,
);
router.patch(
  "/:id/start",
  isAuthenticated,
  authorizeRoles("driver"),
  startDelivery,
);
router.patch(
  "/:id/complete",
  isAuthenticated,
  authorizeRoles("driver"),
  completeDelivery,
);

export default router;
