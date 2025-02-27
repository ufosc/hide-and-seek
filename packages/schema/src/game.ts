// packages/schema/src/games.ts (or schema.ts)
import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod";

// Drizzle table definition for 'games'
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schema for CREATING a new game (input validation)
export const CreateGameSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100, "Title must be between 3 and 100 characters"),
  description: z.string().max(500).nullish(), // Optional description
  metadata: z.record(z.any()).nullish(), // Allow any JSON-like structure for metadata (optional)
});

export type CreateGameInput = z.infer<typeof CreateGameSchema>; // Input type for creating a game

// Zod schema for AFTER CREATING the Game object (includes id, timestamps etc.)
export const GameSchema = CreateGameSchema.extend({
  // Extends CreateGameSchema
  id: z.number().int().positive(),
  createdAt: z.date(),
});

export const GamesSchema = z.array(GameSchema);

export type Games = z.infer<typeof GamesSchema>;

export type Game = z.infer<typeof GameSchema>; // Type for a Game object
