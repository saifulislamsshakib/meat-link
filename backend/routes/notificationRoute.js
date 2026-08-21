import express from "express";

import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getMyNotifications);
router.patch("/:id/read", isAuthenticated, markNotificationAsRead);

export default router;
