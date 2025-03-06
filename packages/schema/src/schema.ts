import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// Drizzle table definition for 'games'
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  description: text("description"),
});
