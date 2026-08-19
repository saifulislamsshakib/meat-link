// import express from "express";

// import {
//   addLivestock,
//   getLivestockById,
//   getMyLivestock,
//   updateLivestock,
// } from "../controllers/livestockController.js";

// import {
//   isAuthenticated,
//   authorizeRoles,
// } from "../middleware/isAuthenticated.js";

// const router = express.Router();

// router.post("/", isAuthenticated, authorizeRoles("farmer"), addLivestock);
// router.get("/", isAuthenticated, authorizeRoles("farmer"), getMyLivestock);
// router.get("/:id", isAuthenticated, authorizeRoles("farmer"), getLivestockById);
// router.put("/:id", isAuthenticated, authorizeRoles("farmer"), updateLivestock);

// export default router;

import express from "express";

import {
  addLivestock,
  getMyLivestock,
  getLivestockById,
  updateLivestock,
  deleteLivestock,
  updateLivestockAvailability,
} from "../controllers/livestockController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Add Livestock
router.post("/", isAuthenticated, authorizeRoles("farmer"), addLivestock);

// Get My Livestock
router.get("/", isAuthenticated, authorizeRoles("farmer"), getMyLivestock);

// Get Single Livestock
router.get("/:id", isAuthenticated, authorizeRoles("farmer"), getLivestockById);

// Update Livestock
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
