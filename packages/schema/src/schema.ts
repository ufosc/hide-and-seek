import { pgTable, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// Drizzle table definition for 'games'
export const games = pgTable("games", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  description: text("description"),
});
