import z from "zod";

// Zod schema for CREATING a new game (input validation)
export const CreateGameSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100, "Title must be between 3 and 100 characters"),
  description: z.string().max(500).nullish(), // Optional description
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
