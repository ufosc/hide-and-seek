import { pgTable, integer, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// Drizzle table definition for 'games'
export const games = pgTable("games", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  description: text("description"),
  status: text("status").notNull().default("waiting"), // Added status: waiting, started, completed (enum is defined in shared-types/games.api.ts for now)
  creator_id: text("creator_id").notNull(), // Reference to auth_id in users table
});

// Add users table definition
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  auth_id: text("auth_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Table for game participants
export const gameParticipants = pgTable("game_participants", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  game_id: integer("game_id")
    .notNull()
    .references(() => games.id), // Reference to games.id
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id), // Reference to users.id
  joined_at: timestamp("joined_at").defaultNow(),
  role: text("role").notNull().default("seeker"), // seeker or hider (defined in shared-types/games.api.ts for now)
});
