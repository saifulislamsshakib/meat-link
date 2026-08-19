import express from "express";
import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get(
  "/farmer-test",
  isAuthenticated,
  authorizeRoles("farmer"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Farmer access granted",
      user: req.user,
    });
  },
);

export default router;
