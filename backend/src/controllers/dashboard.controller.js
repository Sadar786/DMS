import asyncHandler from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import { getDashboardData } from "../services/dashboard.service.js";

export const getDashboard = asyncHandler(async (req, res) => {

    const dashboard = await getDashboardData();

    res.status(200).json(
        new ApiResponse(
            200,
            "Dashboard data fetched successfully.",
            dashboard
        )
    );

});