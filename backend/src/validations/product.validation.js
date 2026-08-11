import { z } from "zod";

export const createProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(50, "SKU cannot exceed 50 characters"),

  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category cannot exceed 50 characters"),

  brand: z
    .string()
    .trim()
    .min(1, "Brand is required")
    .max(50, "Brand cannot exceed 50 characters"),

  costPrice: z.coerce
    .number({
      invalid_type_error: "Cost price must be a number",
    })
    .min(0, "Cost price cannot be negative"),

  defaultSellingPrice: z.coerce
    .number({
      invalid_type_error: "Default selling price must be a number",
    })
    .min(0, "Default selling price cannot be negative"),

  minimumStock: z.coerce
    .number({
      invalid_type_error: "Minimum stock must be a number",
    })
    .min(0, "Minimum stock cannot be negative")
    .default(10),

  unit: z.enum(
    ["Bottle", "Can", "Pack", "Carton", "Case"],
    {
      error: "Invalid unit",
    }
  ),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  isActive: z.boolean().optional(),
});

export const updateProductSchema =
  createProductSchema.partial();

export const updateProductStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "Status is required",
  }),
});