import { createInsertSchema } from "drizzle-zod";
import { transactionsTable } from "./schema.ts";
import { z } from "zod";
import { categoryTypes } from "../../types/enums.ts";

export const createTransactionSchema =
  createInsertSchema(transactionsTable).strict();

export const updateTransactionSchema = z
  .object({
    account_id: z.number().optional(),
    category_id: z.number().optional(),
    subcategory_id: z.number().optional(),
    type: z.enum(categoryTypes).optional(),
    amount: z.number().optional(),
    notes: z.string().nullable().optional(),
    transaction_at: z.coerce.date().optional(),
    prev_amount: z.number().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.amount !== undefined) {
      if (data.type === undefined) {
        ctx.addIssue({
          path: ["type"],
          code: z.ZodIssueCode.custom,
          message: "`type` is required when `amount` is provided.",
        });
      }

      if (data.prev_amount === undefined) {
        ctx.addIssue({
          path: ["prev_amount"],
          code: z.ZodIssueCode.custom,
          message: "`prev_amount` is required when `amount` is provided.",
        });
      }

      if (data.account_id === undefined) {
        ctx.addIssue({
          path: ["account_id"],
          code: z.ZodIssueCode.custom,
          message: "`account_id` is required when `amount` is provided.",
        });
      }
    }
  });
