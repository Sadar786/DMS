import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as stockEntryService from "../services/stockEntry.service.js";

// Create Stock Entry
export const createStockEntry = asyncHandler(async (req, res) => {
  const stockEntry = await stockEntryService.createStockEntry(
    req.body,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Stock entry created successfully.",
      stockEntry
    )
  );
});

// get stock 
export const getStockEntries = asyncHandler(async (req, res) => {
  const stockEntries = await stockEntryService.getStockEntries(req.query);
  return res.status(200).json(
    new ApiResponse(
      200,
      "Stock entries retrieved successfully.",
      stockEntries
    )
  );
});


// Get Stock Entry by ID
export const getStockEntryById = asyncHandler(async (req, res) => {
  const stockEntry = await stockEntryService.getStockEntryById(
    req.params.id
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      "Stock entry retrieved successfully.",
      stockEntry
    )
  );
});
