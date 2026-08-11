import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import * as saleController from "../controllers/sale.controller.js";

import {
    createSaleSchema,
} from "../validations/sale.validation.js";

const router = express.Router();

router.post("/", protect, validate(createSaleSchema), saleController.create);
router.get("/", protect, saleController.getAll);

export default router;