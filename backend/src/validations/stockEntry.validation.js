import { z } from "zod";

const stockItemSchema = z.object({
  product: z
    .string()
    .trim()
    .min(1, "Product is required"),

  quantity: z.coerce
    .number()
    .min(1, "Quantity must be greater than 0"),

  costPrice: z.coerce
    .number()
    .min(0, "Cost price cannot be negative"),
});

export const createStockEntrySchema = z.object({
  entryDate: z.coerce
    .date()
    .optional(),

  supplier: z
    .string()
    .trim()
    .max(100, "Supplier name cannot exceed 100 characters")
    .optional(),

  remarks: z
    .string()
    .trim()
    .max(300, "Remarks cannot exceed 300 characters")
    .optional(),

  items: z
    .array(stockItemSchema)
    .min(1, "At least one product is required")
    .superRefine((items, ctx) => {
      const productIds = new Set();

      items.forEach((item, index) => {
        if (productIds.has(item.product)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate product found: ${item.product} which is not allowed.`,
            path: [index, "product"],
          });
        }

        productIds.add(item.product);
      });
    }),
});