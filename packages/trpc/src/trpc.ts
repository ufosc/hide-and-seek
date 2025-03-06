// Setup TRPC Stuff, you probably don't need to touch or understand this
import { initTRPC } from "@trpc/server";
import type { Context } from "./context.ts";

/**
 * Initialize tRPC with our context
 * You should initialize tRPC exactly once per application
 */
const t = initTRPC.context<Context>().create();

// Export tRPC router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const mergeRouters = t.mergeRouters;
