import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { accountTable } from "./schema.ts";

export const createAccountSchema = createInsertSchema(accountTable).strict();
export const updateAccountSchema = createUpdateSchema(accountTable).strict();
