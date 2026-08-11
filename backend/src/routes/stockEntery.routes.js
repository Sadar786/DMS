import express from "express";

import {
  createStockEntry,
  getStockEntries,
  getStockEntryById,
} from "../controllers/stockEntry.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createStockEntrySchema,
} from "../validations/stockEntry.validation.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  validate(createStockEntrySchema),
  createStockEntry
);

router.get(
  "/",
  getStockEntries
);

router.get(
  "/:id",
  getStockEntryById
);

export default router;