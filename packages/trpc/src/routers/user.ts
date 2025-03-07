import { eq } from "drizzle-orm";
import { publicProcedure, router } from "../trpc.ts";
import { z } from "zod";
import { users } from "@repo/schema";
import { CreateUserSchema, UserSchema } from "@repo/shared-types/users.api.ts";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .insert(users)
          .values({
            name: input.name,
            email: input.email,
            auth_id: input.auth_id || "",
          })
          .returning();

        if (!result || result.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create user",
          });
        }

        return result[0];
      } catch (error) {
        console.error("Error creating user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }
    }),

  // Updated procedures with better names and implementations
  getByAuthId: publicProcedure
    .input(z.object({ authId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .select()
          .from(users)
          .where(eq(users.auth_id, input.authId));

        if (!result || result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return result[0];
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
        });
      }
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;

        // Only include fields that are provided
        const updateFields = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(updateFields).length === 0) {
          return { success: false, message: "No fields to update" };
        }

        const result = await ctx.db
          .update(users)
          .set(updateFields)
          .where(eq(users.id, id))
          .returning();

        if (!result || result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return { success: true, user: result[0] };
      } catch (error) {
        console.error("Error updating user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user",
        });
      }
    }),
});
