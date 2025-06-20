import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { categoryTable } from "./schema.ts";

export const createCategorySchema = createInsertSchema(categoryTable).strict();
export const updateCategorySchema = createUpdateSchema(categoryTable).strict();
