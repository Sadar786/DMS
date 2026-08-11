import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as customerService from "../services/customer.service.js";

// Create Customer
export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(
    req.body,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Customer created successfully.",
      customer
    )
  );
});

// Get All Customers
export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await customerService.getCustomers(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Customers fetched successfully.",
      customers
    )
  );
});

// Get Customer By ID
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Customer fetched successfully.",
      customer
    )
  );
});

// Update Customer
export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(
    req.params.id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Customer updated successfully.",
      customer
    )
  );
});

// Update Customer Status
export const updateCustomerStatus = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomerStatus(
    req.params.id,
    req.body.isActive
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Customer status updated successfully.",
      customer
    )
  );
});

// Soft Delete Customer
export const deleteCustomer = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Customer deleted successfully."
    )
  );
});