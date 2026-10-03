import express from "express";

import {
  createRating,
  getAllRatings,
  getSlaughterhouseRatings,
} from "../controllers/ratingController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Super Shop → Submit Rating
router.post("/", isAuthenticated, authorizeRoles("super_shop"), createRating);

// Slaughterhouse → View Own Ratings
router.get(
  "/slaughterhouse",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  getSlaughterhouseRatings,
);

// Admin → View All Ratings
router.get("/all", isAuthenticated, authorizeRoles("admin"), getAllRatings);

export default router;
