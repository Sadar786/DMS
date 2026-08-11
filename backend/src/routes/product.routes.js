import express from "express";

import * as productController from "../controllers/product.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import validateObjectId from "../middleware/validateObjectId.middleware.js";

import {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
} from "../validations/product.validation.js";

const router = express.Router();

// Create Product
router.post(
  "/",
  protect,
  validate(createProductSchema),
  productController.createProduct
);

// Get All Products
router.get(
  "/",
  protect,
  productController.getProducts
);

// Get Product By ID
router.get(
  "/:id",
  protect,
  validateObjectId(),
  productController.getProductById
);

// Update Product
router.put(
  "/:id",
  protect,
  validateObjectId(),
  validate(updateProductSchema),
  productController.updateProduct
);

// Update Product Status
router.patch(
  "/:id/status",
  protect,
  validateObjectId(),
  validate(updateProductStatusSchema),
  productController.updateProductStatus
);

// Soft Delete Product
router.delete(
  "/:id",
  protect,
  validateObjectId(),
  productController.deleteProduct
);

export default router;