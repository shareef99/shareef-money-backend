import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { weekDays } from "../../types/enums.ts";
import { relations } from "drizzle-orm/relations";
import { categoryTable } from "../category/schema.ts";
import { accountTable } from "../account/schema.ts";

export const userTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  mobile: varchar("mobile"),
  currency: varchar("currency").default("INR").notNull(),
  month_start_date: integer("month_start_date").default(1).notNull(),
  week_start_day: varchar("week_start_day", { enum: weekDays })
    .default("monday")
    .notNull(),
  refer_code: varchar("refer_code").notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  categories: many(categoryTable),
  accounts: many(accountTable),
}));
