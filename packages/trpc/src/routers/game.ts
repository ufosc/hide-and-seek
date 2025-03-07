import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc.ts";
import {
  CreateGameSchema,
  GameSchema,
  GamesSchema,
  JoinGameSchema,
  GameParticipantsSchema,
  UpdateGameStatusSchema,
  GameParticipantSchema,
} from "@repo/shared-types/games.api.ts";
import { games, gameParticipants, users } from "@repo/schema";
import z from "zod";
import { eq, and } from "drizzle-orm";

/**
 * tRPC router for game operations
 */
export const gameRouter = router({
  create: publicProcedure
    .input(CreateGameSchema)
    .output(GameSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Database connection not available",
        });
      }

      try {
        // Insert the new game into the database
        const [insertedGame] = await ctx.db
          .insert(games)
          .values({
            title: input.title,
            description: input.description,
            creator_id: input.creator_id,
            status: "waiting",
          })
          .returning();

        // Find the user associated with the creator_id
        const userResult = await ctx.db
          .select()
          .from(users)
          .where(eq(users.auth_id, input.creator_id));

        if (userResult.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Creator user not found",
          });
        }

        // Add the creator as the first participant
        await ctx.db.insert(gameParticipants).values({
          game_id: insertedGame.id,
          user_id: userResult[0].id,
          role: "seeker", // Default role for creator, can be changed
        });

        // Return the created game
        return insertedGame;
      } catch (error) {
        console.error("Error creating game:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create game",
        });
      }
    }),

  list: publicProcedure.output(GamesSchema).query(async ({ ctx }) => {
    if (!ctx.db) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Database connection not available",
      });
    }

    try {
      // Fetch all games from the database
      const gamesList = await ctx.db.select().from(games);
      return gamesList;
    } catch (error) {
      console.error("Error fetching games:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch games",
      });
    }
  }),

  // Get games created by a specific user
  getByCreator: publicProcedure
    .input(z.object({ creator_id: z.string() }))
    .output(GamesSchema)
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .select()
          .from(games)
          .where(eq(games.creator_id, input.creator_id));
        return result;
      } catch (error) {
        console.error("Error fetching games by creator:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch games by creator",
        });
      }
    }),

  // Get a specific game by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .output(GameSchema)
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .select()
          .from(games)
          .where(eq(games.id, input.id));

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Game not found",
          });
        }

        return result[0];
      } catch (error) {
        console.error("Error fetching game:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch game",
        });
      }
    }),

  // Join a game as a participant
  join: publicProcedure
    .input(JoinGameSchema)
    .output(GameParticipantSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if the game exists and is in 'waiting' status
        const gameResult = await ctx.db
          .select()
          .from(games)
          .where(eq(games.id, input.game_id));

        if (gameResult.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Game not found",
          });
        }

        if (gameResult[0].status !== "waiting") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot join a game that has already started",
          });
        }

        // Check if user is already a participant
        const existingParticipant = await ctx.db
          .select()
          .from(gameParticipants)
          .where(
            and(
              eq(gameParticipants.game_id, input.game_id),
              eq(gameParticipants.user_id, input.user_id)
            )
          );

        if (existingParticipant.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User is already a participant in this game",
          });
        }

        // Add user as participant
        const [participant] = await ctx.db
          .insert(gameParticipants)
          .values({
            game_id: input.game_id,
            user_id: input.user_id,
            role: input.role || "seeker", // Default role
          })
          .returning();

        return participant;
      } catch (error) {
        console.error("Error joining game:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join game",
        });
      }
    }),

  // Get all participants for a game
  getParticipants: publicProcedure
    .input(z.object({ game_id: z.number() }))
    .output(GameParticipantsSchema)
    .query(async ({ ctx, input }) => {
      try {
        // Use drizzle's join syntax for type-safe querying instead of raw SQL
        const joinedResults = await ctx.db
          .select({
            id: gameParticipants.id,
            game_id: gameParticipants.game_id,
            user_id: gameParticipants.user_id,
            joined_at: gameParticipants.joined_at,
            role: gameParticipants.role,
            userName: users.name,
            userEmail: users.email,
          })
          .from(gameParticipants)
          .innerJoin(users, eq(gameParticipants.user_id, users.id))
          .where(eq(gameParticipants.game_id, input.game_id))
          .orderBy(gameParticipants.joined_at);

        // Transform the results to match our schema
        return joinedResults.map((result) => ({
          id: result.id,
          game_id: result.game_id,
          user_id: result.user_id,
          joined_at: result.joined_at,
          role: result.role,
          user: {
            name: result.userName,
            email: result.userEmail,
          },
        }));
      } catch (error) {
        console.error("Error fetching game participants:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch game participants",
        });
      }
    }),

  // Update game status (e.g., start the game)
  updateStatus: publicProcedure
    .input(UpdateGameStatusSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { game_id, status } = input;

        // Verify the game exists
        const gameResult = await ctx.db
          .select()
          .from(games)
          .where(eq(games.id, game_id));

        if (gameResult.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Game not found",
          });
        }

        // Update the game status
        const [updatedGame] = await ctx.db
          .update(games)
          .set({ status })
          .where(eq(games.id, game_id))
          .returning();

        return { success: true, game: updatedGame };
      } catch (error) {
        console.error("Error updating game status:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update game status",
        });
      }
    }),

  // Delete a game (only the creator can delete)
  delete: publicProcedure
    .input(
      z.object({
        game_id: z.number().int().positive(),
        creator_id: z.string(), // Auth ID of the user trying to delete the game
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First verify the game exists and the user is the creator
        const gameResult = await ctx.db
          .select()
          .from(games)
          .where(eq(games.id, input.game_id));

        if (gameResult.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Game not found",
          });
        }

        const game = gameResult[0];

        // Check if requester is the creator
        if (game.creator_id !== input.creator_id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the game creator can delete the game",
          });
        }

        // Delete all participants first (to avoid foreign key constraints)
        await ctx.db
          .delete(gameParticipants)
          .where(eq(gameParticipants.game_id, input.game_id));

        // Then delete the game
        const deleted = await ctx.db
          .delete(games)
          .where(eq(games.id, input.game_id))
          .returning();

        return {
          success: true,
          message: "Game deleted successfully",
          deletedGame: deleted[0],
        };
      } catch (error) {
        console.error("Error deleting game:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete game",
        });
      }
    }),
});
