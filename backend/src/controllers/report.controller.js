import ApiResponse from "../utils/ApiResponse.js";

import {
    getSalesReportService,
    getStockReportService,
    getLowStockReportService,
    getPaymentReportService,
    getCustomerLedgerService,
    getInventoryReportService,
    getBusinessAnalyticsService,
} from "../services/report.service.js";

export const getBusinessAnalytics = async (req, res, next) => {
    try {
        const data = await getBusinessAnalyticsService(req.query);

        res
            .status(200)
            .json(new ApiResponse(200, "Business analytics fetched successfully.", data));

    } catch (error) {
        next(error);
    }
};

export const getSalesReport = async (req, res, next) => {
    try {
        const data = await getSalesReportService(req.query);

        res
            .status(200)
            .json(new ApiResponse(200, "Sales report fetched successfully.", data));

    } catch (error) {
        next(error);
    }
};

export const getStockReport = async (req, res, next) => {
    try {
        const data = await getStockReportService();

        res
            .status(200)
            .json(new ApiResponse(200, "Stock report fetched successfully.", data));

    } catch (error) {
        next(error);
    }
};

export const getLowStockReport = async (req, res, next) => {
    try {
        const data = await getLowStockReportService();

        res
            .status(200)
            .json(new ApiResponse(200, "Low stock report fetched successfully.", data));

    } catch (error) {
        next(error);
    }
};

export const getPaymentReport = async (req, res, next) => {
    try {
        const data = await getPaymentReportService(req.query);

        res
            .status(200)
            .json(new ApiResponse(200, "Payment report fetched successfully.", data));

    } catch (error) {
        next(error);
    }
};

export const getCustomerLedger = async (req, res, next) => {
    try {
        const data = await getCustomerLedgerService(req.params.id, req.query);

        res
            .status(200)
            .json(new ApiResponse(200, "Customer ledger fetched successfully.", data));

    } catch (error) {
        next(error);
    }
};

export const getInventoryReport = async (req, res, next) => {
    try {
        const data = await getInventoryReportService(req.query);

        res
            .status(200)
            .json(new ApiResponse(200, "Inventory report fetched successfully.", data));

    } catch (error) {
        next(error);
    }
};
