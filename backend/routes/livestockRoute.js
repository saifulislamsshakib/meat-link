import express from "express";

import {
  addLivestock,
  getMyLivestock,
  getLivestockById,
  updateLivestock,
  deleteLivestock,
  updateLivestockAvailability,
  getAvailableLivestock,
} from "../controllers/livestockController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/", isAuthenticated, authorizeRoles("farmer"), addLivestock);

router.get("/", isAuthenticated, authorizeRoles("farmer"), getMyLivestock);

router.get(
  "/available",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  getAvailableLivestock,
);

router.get("/:id", isAuthenticated, authorizeRoles("farmer"), getLivestockById);

router.put("/:id", isAuthenticated, authorizeRoles("farmer"), updateLivestock);

router.patch(
  "/:id/availability",
  isAuthenticated,
  authorizeRoles("farmer"),
  updateLivestockAvailability,
);

router.delete(
  "/:id",
  isAuthenticated,
  authorizeRoles("farmer"),
  deleteLivestock,
);

export default router;
