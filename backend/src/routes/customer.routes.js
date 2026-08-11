import express from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
} from "../controllers/constumer.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createCustomerSchema,
  updateCustomerSchema,
  updateCustomerStatusSchema,
} from "../validations/customer.validation.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  validate(createCustomerSchema),
  createCustomer
);

router.get(
  "/",
  getCustomers
);

router.get(
  "/:id",
  getCustomerById
);

router.put(
  "/:id",
  validate(updateCustomerSchema),
  updateCustomer
);

router.patch(
  "/:id/status",
  validate(updateCustomerStatusSchema),
  updateCustomerStatus
);

router.delete(
  "/:id",
  deleteCustomer
);

export default router;