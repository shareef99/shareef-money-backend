import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { categoryTable } from "../category/schema.ts";
import { relations } from "drizzle-orm/relations";
import { transactionsTable } from "../transactions/schema.ts";

export const subcategoryTable = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  category_id: integer("category_id")
    .references(() => categoryTable.id)
    .notNull(),
  name: varchar("name").notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const subcategoryRelations = relations(
  subcategoryTable,
  ({ one, many }) => ({
    category: one(categoryTable, {
      fields: [subcategoryTable.category_id],
      references: [categoryTable.id],
    }),
    transactions: many(transactionsTable),
  })
);
