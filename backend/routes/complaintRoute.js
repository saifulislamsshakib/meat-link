import express from "express";

import {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/complaintController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// User → Submit Complaint
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("farmer", "slaughterhouse", "super_shop", "driver"),
  createComplaint,
);

// Admin → View All Complaints
router.get("/", isAuthenticated, authorizeRoles("admin"), getAllComplaints);
router.patch(
  "/:id/status",
  isAuthenticated,
  authorizeRoles("admin"),
  updateComplaintStatus,
);

export default router;
