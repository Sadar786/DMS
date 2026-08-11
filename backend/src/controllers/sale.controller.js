import asyncHandler from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import * as saleService from "../services/sale.service.js";

export const create = asyncHandler(async (req, res) => {

    const sale = await saleService.createSale(
        req.body,
        req.user._id
    );

    return res.status(201).json(
        new ApiResponse(
            201,
            "Sale created successfully.",
            sale
        )
    );

});

export const getAll = asyncHandler(async (req, res) => {

    const sales = await saleService.getAllSales(
        req.query,
        req.user._id
    );
    
    return res.status(200).json(
        new ApiResponse(
            200,
            "Sales retrieved successfully.",
            sales
        )
    );

});

