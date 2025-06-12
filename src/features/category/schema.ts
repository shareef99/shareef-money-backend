import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { userTable } from "../users/schema.ts";
import { categoryTypes } from "../../types/enums.ts";
import { relations } from "drizzle-orm/relations";
import { subcategoryTable } from "../subcategory/schema.ts";

export const categoryTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  name: varchar("name").notNull(),
  type: varchar("type", { enum: categoryTypes }).default("expense").notNull(),
});

export const categoryRelations = relations(categoryTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [categoryTable.user_id],
    references: [userTable.id],
  }),
  subcategories: many(subcategoryTable),
}));
