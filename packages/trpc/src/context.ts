import { type inferAsyncReturnType } from "@trpc/server";
import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "@repo/schema";

interface ContextOptions {
  db: PostgresJsDatabase<typeof schema>;
}

/**
 * Creates context for tRPC procedures
 */
export function createTRPCContext({ db }: ContextOptions = {}) {
  return { db };
}

export type Context = inferAsyncReturnType<typeof createTRPCContext>;
