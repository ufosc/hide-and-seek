import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { appRouter, createTRPCContext } from "@repo/trpc";

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import "jsr:@std/dotenv/load";

// Serve the tRPC API
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    // Initialize database connection
    const connectionString = Deno.env.get("DATABASE_URL");
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable not found");
    }
    
    const client = postgres(connectionString, { prepare: false });
    const db = drizzle({ client });
    
    // Handle the tRPC request
    return await fetchRequestHandler({
      endpoint: "/trpc",
      req,
      router: appRouter,
      createContext: async () => createTRPCContext({ db }),
      onError: ({ path, error }) => {
        console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
      },
    });
  } catch (error) {
    console.error("tRPC request handler error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
