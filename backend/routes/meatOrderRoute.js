import express from "express";

import {
  createMeatOrder,
  getMyMeatOrders,
  getSlaughterhouseOrders,
  updateMeatOrderStatus,
} from "../controllers/meatOrderController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Super Shop → Place Meat Order
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("super_shop"),
  createMeatOrder,
);
router.get(
  "/my-orders",
  isAuthenticated,
  authorizeRoles("super_shop"),
  getMyMeatOrders,
);
router.get(
  "/slaughterhouse-orders",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  getSlaughterhouseOrders,
);
router.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  updateMeatOrderStatus,
);

export default router;
