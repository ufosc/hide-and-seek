import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc.ts";
import {
  CreateGameSchema,
  GameSchema,
  GamesSchema,
} from "@repo/shared-types/games.api.ts";
import { games } from "@repo/schema";

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
            creatorId: input.creatorId,
            bounds: input.bounds,
          })
          .returning();
          
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

  list: publicProcedure
    .output(GamesSchema)
    .query(async ({ ctx }) => {
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
});
