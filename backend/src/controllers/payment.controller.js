import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createPayment,
} from "../services/payment.service.js";

export const create = asyncHandler(
    async (req, res) => {

        const payment = await createPayment(
            req.body,
            req.user._id
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                "Payment created successfully.",
                payment
            )
        );
    }
);