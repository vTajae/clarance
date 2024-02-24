import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const user = sqliteTable('user', {
  id: integer('id').primaryKey({ autoIncrement: true }), // SQLite uses INTEGER for auto-increment primary keys
  username: text('username').notNull().unique(), // Assuming email should be unique
  password: text('password').notNull(),
  role: text('role', { enum: ["1", "2", "3"] }),
  createdAt: integer('createdAt').notNull(), // Using integer for Unix timestamp
  updatedAt: integer('updatedAt').notNull(), 
});


