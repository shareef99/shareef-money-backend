import { z } from "zod";
import { createUpdateSchema } from "drizzle-zod";
import { userTable } from "./schema.ts";

export const loginSchema = z.object({ access_token: z.string() }).strict();

export const updateUserSchema = createUpdateSchema(userTable);
