import { z } from "zod";

import { PAYMENT_METHOD } from "../constants/payment.js";

export const createPaymentSchema = z.object({
  sale: z
    .string()
    .trim()
    .min(1, "Sale is required"),

  amount: z.coerce
    .number()
    .positive("Amount must be greater than zero"),

  paymentMethod: z.enum(
    Object.values(PAYMENT_METHOD)
  ),

  paymentDate: z.coerce
    .date()
    .optional(),

  remarks: z
    .string()
    .trim()
    .max(300, "Remarks cannot exceed 300 characters")
    .optional(),
});