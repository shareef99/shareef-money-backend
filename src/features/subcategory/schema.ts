import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { categoryTable } from "../category/schema.ts";
import { relations } from "drizzle-orm/relations";

export const subcategoryTable = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id")
    .references(() => categoryTable.id)
    .notNull(),
  name: varchar("name").notNull(),
});

export const subcategoryRelations = relations(subcategoryTable, ({ one }) => ({
  category: one(categoryTable, {
    fields: [subcategoryTable.category_id],
    references: [categoryTable.id],
  }),
}));
