import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "../users/schema.ts";
import { accountTable } from "../account/schema.ts";
import { categoryTable } from "../category/schema.ts";
import { subcategoryTable } from "../subcategory/schema.ts";
import { relations } from "drizzle-orm/relations";
import { categoryTypes } from "../../types/enums.ts";

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  account_id: integer("account_id")
    .references(() => accountTable.id)
    .notNull(),
  category_id: integer("category_id")
    .references(() => categoryTable.id)
    .notNull(),
  subcategory_id: integer("subcategory_id")
    .references(() => subcategoryTable.id)
    .notNull(),
  type: varchar("type", { enum: categoryTypes }).notNull(),
  amount: integer("amount").notNull(),
  notes: text("notes"),
  transaction_at: timestamp("transaction_at").notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const transactionsRelations = relations(
  transactionsTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [transactionsTable.user_id],
      references: [userTable.id],
    }),
    account: one(accountTable, {
      fields: [transactionsTable.account_id],
      references: [accountTable.id],
    }),
    category: one(categoryTable, {
      fields: [transactionsTable.category_id],
      references: [categoryTable.id],
    }),
    subcategory: one(subcategoryTable, {
      fields: [transactionsTable.subcategory_id],
      references: [subcategoryTable.id],
    }),
  })
);
