import {
  boolean,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "../users/schema.ts";
import { relations } from "drizzle-orm/relations";

export const accountTable = pgTable("accounts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => userTable.id)
    .notNull(),
  name: varchar("name").notNull(),
  amount: integer("amount").default(0).notNull(),
  description: varchar("description"),
  is_hidden: boolean("is_hidden").notNull().default(false),
});

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.user_id],
    references: [userTable.id],
  }),
}));
