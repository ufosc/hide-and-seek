import { pgTable, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// Drizzle table definition for 'games'
export const games = pgTable("games", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  description: text("description"),
});

// Add users table definition
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  auth_id: text("auth_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
