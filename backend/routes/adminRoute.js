import express from "express";

import {
  approveUser,
  getAllDeliveries,
  getAllOrders,
  getAllUsers,
  getDashboardAnalytics,
  getReports,
  rejectUser,
} from "../controllers/adminController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Admin → View all users
router.get("/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.patch(
  "/users/:id/approve",
  isAuthenticated,
  authorizeRoles("admin"),
  approveUser,
);
router.patch(
  "/users/:id/reject",
  isAuthenticated,
  authorizeRoles("admin"),
  rejectUser,
);
router.get("/orders", isAuthenticated, authorizeRoles("admin"), getAllOrders);
router.get(
  "/deliveries",
  isAuthenticated,
  authorizeRoles("admin"),
  getAllDeliveries,
);
router.get(
  "/dashboard",
  isAuthenticated,
  authorizeRoles("admin"),
  getDashboardAnalytics,
);
router.get("/reports", isAuthenticated, authorizeRoles("admin"), getReports);
export default router;
