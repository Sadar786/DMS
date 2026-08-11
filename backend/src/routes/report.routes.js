import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
    getSalesReport,
    getStockReport,
    getLowStockReport,
    getPaymentReport,
    getCustomerLedger,
    getInventoryReport,
    getBusinessAnalytics,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/analytics", protect, getBusinessAnalytics);

router.get("/sales", protect, getSalesReport);

router.get("/stock", protect, getStockReport);

router.get("/low-stock", protect, getLowStockReport);

router.get("/payments", protect, getPaymentReport);

router.get("/customer/:id", protect, getCustomerLedger);

router.get("/inventory", protect, getInventoryReport);

export default router;
