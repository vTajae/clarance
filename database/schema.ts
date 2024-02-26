import { sql } from "drizzle-orm";
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["1", "2", "3"]);

export const user = pgTable("user", {
  id: serial("id").primaryKey(), // PostgreSQL uses SERIAL for auto-increment primary keys
  username: text("username").notNull().unique(), // Ensuring the username (previously email) is unique
  password: text("password").notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("createdAt", {
    precision: 6,
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    precision: 6,
    withTimezone: true,
  }).defaultNow(),
});
