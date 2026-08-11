import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Customer name must be at least 3 characters")
    .max(100, "Customer name cannot exceed 100 characters"),

  shopName: z
    .string()
    .trim()
    .min(2, "Shop name is required")
    .max(100, "Shop name cannot exceed 100 characters"),

  phone: z
    .string()
    .trim()
    .min(11, "Phone number is required")
    .max(20, "Phone number cannot exceed 20 characters"),

  address: z
    .string()
    .trim()
    .min(3, "Address is required")
    .max(250, "Address cannot exceed 250 characters"),

  openingBalance: z.coerce
    .number()
    .min(0, "Opening balance cannot be negative")
    .default(0),

  creditLimit: z.coerce
    .number()
    .min(0, "Credit limit cannot be negative")
    .default(0),

  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),

  isActive: z.boolean().optional(),
});

export const updateCustomerSchema =
  createCustomerSchema.partial();

export const updateCustomerStatusSchema = z.object({
  isActive: z.boolean({
    required_error: "Status is required",
  }),
});