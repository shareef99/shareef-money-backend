import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { subcategoryTable } from "./schema.ts";

export const createSubcategorySchema =
  createInsertSchema(subcategoryTable).strict();

export const updateSubcategorySchema =
  createUpdateSchema(subcategoryTable).strict();
