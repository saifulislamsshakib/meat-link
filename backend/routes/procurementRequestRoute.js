import express from "express";

import {
  acceptProcurementRequest,
  createProcurementRequest,
  getMyProcurementRequests,
  getMySentProcurementRequests,
  rejectProcurementRequest,
} from "../controllers/procurementRequestController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Slaughterhouse → Send livestock procurement request to Farmer
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  createProcurementRequest,
);
router.get(
  "/my-requests",
  isAuthenticated,
  authorizeRoles("farmer"),
  getMyProcurementRequests,
);
router.patch(
  "/:id/accept",
  isAuthenticated,
  authorizeRoles("farmer"),
  acceptProcurementRequest,
);
router.patch(
  "/:id/reject",
  isAuthenticated,
  authorizeRoles("farmer"),
  rejectProcurementRequest,
);
router.get(
  "/my-sent-requests",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  getMySentProcurementRequests,
);
export default router;
