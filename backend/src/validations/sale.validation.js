import { z } from "zod";

/**
 * Single Sale Item
 */
const saleItemSchema = z.object({
  product: z
    .string()
    .trim()
    .min(1, "Product is required"),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be greater than zero"),

  sellingPrice: z.coerce
    .number()
    .min(0, "Selling price cannot be negative"),
});

/**
 * Create Sale
 */
export const createSaleSchema = z.object({
  customer: z
    .string()
    .trim()
    .min(1, "Customer is required"),

  saleDate: z.coerce
    .date()
    .optional(),

  discount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .default(0),

  tax: z.coerce
    .number()
    .min(0, "Tax cannot be negative")
    .default(0),

  paidAmount: z.coerce
    .number()
    .min(0, "Paid amount cannot be negative")
    .default(0),

  paymentMethod: z
    .enum(["Cash", "Bank", "Online", "Cheque"])
    .default("Cash"),

  remarks: z
    .string()
    .trim()
    .max(300, "Remarks cannot exceed 300 characters")
    .optional(),

  items: z
    .array(saleItemSchema)
    .min(1, "At least one product is required")
    .superRefine((items, ctx) => {
      const products = new Set();

      items.forEach((item, index) => {
        if (products.has(item.product)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Duplicate product is not allowed.",
            path: [index, "product"],
          });
        }

        products.add(item.product);
      });
    }),
});

/**
 * Update Sale
 */
export const updateSaleSchema =
  createSaleSchema.partial();