import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import { generateInvoice } from "../controllers/invoice.controller.js";

const router = express.Router();

router.get(
    "/:saleId",
    protect,
    generateInvoice
);

export default router;