import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as productService from "../services/product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(
    req.body,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Product created successfully.",
      product
    )
  );
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Products fetched successfully.",
      products
    )
  );
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product fetched successfully.",
      product
    )
  );
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product updated successfully.",
      product
    )
  );
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const product = await productService.updateProductStatus(
    req.params.id,
    req.body.isActive
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product status updated successfully.",
      product
    )
  );
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product deleted successfully."
    )
  );
});
