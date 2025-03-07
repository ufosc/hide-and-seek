import z from "zod";
import { LatLng } from "react-native-maps";

// Game status enum
export const GameStatusEnum = z.enum(["waiting", "started", "completed"]);
export type GameStatus = z.infer<typeof GameStatusEnum>;

// Participant role enum
export const ParticipantRoleEnum = z.enum(["seeker", "hider"]);
export type ParticipantRole = z.infer<typeof ParticipantRoleEnum>;

// Define LatLng schema for validation
const LatLngSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

// Create a boundary schema - array of points with minimum 3 points
const BoundarySchema = z
  .array(LatLngSchema)
  .min(3, "Boundary must have at least 3 points");

// Zod schema for CREATING a new game (input validation)
export const CreateGameSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(100, "Title must be between 3 and 100 characters"),
  description: z.string().max(500).nullish(), // Optional description
  creator_id: z.string(), // Auth ID of the user creating the game
  boundary: BoundarySchema, // Required game boundary
});

export type CreateGameInput = z.infer<typeof CreateGameSchema>;

// Zod schema for AFTER CREATING the Game object (includes id, timestamps etc.)
export const GameSchema = CreateGameSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  status: GameStatusEnum,
});

export const GamesSchema = z.array(GameSchema);
export type Game = z.infer<typeof GameSchema>;
export type Games = z.infer<typeof GamesSchema>;

// Schema for joining a game
export const JoinGameSchema = z.object({
  game_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  role: ParticipantRoleEnum.optional(),
});

export type JoinGameInput = z.infer<typeof JoinGameSchema>;

// Schema for a game participant
export const GameParticipantSchema = z.object({
  id: z.number().int().positive(),
  game_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  joined_at: z.date(),
  role: ParticipantRoleEnum,
  // Include user information for display
  user: z
    .object({
      name: z.string(),
      email: z.string().email(),
    })
    .optional(),
});

export type GameParticipant = z.infer<typeof GameParticipantSchema>;
export const GameParticipantsSchema = z.array(GameParticipantSchema);
export type GameParticipants = z.infer<typeof GameParticipantsSchema>;

// Schema for starting a game
export const UpdateGameStatusSchema = z.object({
  game_id: z.number().int().positive(),
  status: GameStatusEnum,
});

export type UpdateGameStatusInput = z.infer<typeof UpdateGameStatusSchema>;
