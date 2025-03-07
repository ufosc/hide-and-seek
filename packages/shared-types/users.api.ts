import z from "zod";

// Zod schema for CREATING a new user (input validation)
export const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  auth_id: z.string().optional(), // Add auth_id as optional
});

export type CreateUser = z.infer<typeof CreateUserSchema>;

// Zod schema for AFTER CREATING the Game object (includes id, timestamps etc.)
export const UserSchema = CreateUserSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
  auth_id: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UsersSchema = z.array(UserSchema);

export type Users = z.infer<typeof UsersSchema>;
