import "@std/dotenv/load";
import { drizzle } from "drizzle-orm/node-postgres";
import env from "../env.ts";
import { userTable, userRelations } from "../features/users/schema.ts";
import {
  categoryRelations,
  categoryTable,
} from "../features/category/schema.ts";
import {
  subcategoryRelations,
  subcategoryTable,
} from "../features/subcategory/schema.ts";

export const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case",
  schema: {
    userTable,
    userRelations,
    categoryTable,
    categoryRelations,
    subcategoryTable,
    subcategoryRelations,
  },
});
