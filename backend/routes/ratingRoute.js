import express from "express";

import { createRating } from "../controllers/ratingController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Super Shop → Submit Rating
router.post("/", isAuthenticated, authorizeRoles("super_shop"), createRating);

export default router;
