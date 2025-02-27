import { games, GamesSchema } from "@repo/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import "jsr:@supabase/functions-js/edge-runtime.d.ts"; // Supabase Edge Runtime types
import "jsr:@std/dotenv/load";

// This function returns a list of
Deno.serve(async (req) => {
  const connectionString = Deno.env.get("DATABASE_URL")!;

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({ client });

  try {
    const gamesResult = await db.select().from(games);

    const validatedGamesResult = GamesSchema.parse(gamesResult);

    return new Response(JSON.stringify(validatedGamesResult), {
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
