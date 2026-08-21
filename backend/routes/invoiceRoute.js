import express from "express";

import {
  createInvoice,
  getMyInvoices,
} from "../controllers/invoiceController.js";

import {
  isAuthenticated,
  authorizeRoles,
} from "../middleware/isAuthenticated.js";

const router = express.Router();

// Slaughterhouse → Generate Invoice
router.post(
  "/",
  isAuthenticated,
  authorizeRoles("slaughterhouse"),
  createInvoice,
);
router.get(
  "/my-invoices",
  isAuthenticated,
  authorizeRoles("super_shop"),
  getMyInvoices,
);

export default router;
