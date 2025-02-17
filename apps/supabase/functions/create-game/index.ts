import {
  games,
  CreateGameSchema,
  CreateGameInput,
  Game,
  GameSchema,
} from "@repo/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import "jsr:@supabase/functions-js/edge-runtime.d.ts"; // Supabase Edge Runtime types
import "jsr:@std/dotenv/load";

Deno.serve(async (req) => {
  const connectionString = Deno.env.get("DATABASE_URL")!;

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({ client });

  try {
    const requestBody = await req.json();

    // 1. Validate the request body against CreateGameSchema
    let parsedInput: CreateGameInput;
    try {
      parsedInput = CreateGameSchema.parse(requestBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(JSON.stringify({ errors: error.errors }), {
          status: 400, // Bad Request
          headers: { "Content-Type": "application/json" },
        });
      }
      throw error; // Re-throw other errors
    }

    // 2. Insert into the 'games' table using Drizzle, using 'games' (table definition)
    const newGameResult = await db
      .insert(games) // Use 'games' here (Drizzle table)
      .values({
        title: parsedInput.title,
        description: parsedInput.description,
        metadata: parsedInput.metadata, // Assuming metadata is handled correctly
      })
      .returning();

    const newGame = newGameResult[0];

    // This ensures what was created IS a Game
    const validatedGame: Game = GameSchema.parse(newGame);

    return new Response(JSON.stringify(validatedGame), {
      headers: { "Content-Type": "application/json" },
      status: 201, // Created
    });
  } catch (error) {
    console.error("Error creating game:", error);
    return new Response(JSON.stringify({ error: "Failed to create game" }), {
      status: 500, // Internal Server Error
      headers: { "Content-Type": "application/json" },
    });
  }
});
