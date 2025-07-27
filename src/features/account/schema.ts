import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "../users/schema.ts";
import { relations } from "drizzle-orm/relations";
import { transactionsTable } from "../transactions/schema.ts";

export const accountTable = pgTable("accounts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  name: varchar("name").notNull(),
  amount: integer("amount").default(0).notNull(),
  description: varchar("description"),
  is_hidden: boolean("is_hidden").notNull().default(false),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const accountRelations = relations(accountTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [accountTable.user_id],
    references: [userTable.id],
  }),
  transactions: many(transactionsTable),
}));
