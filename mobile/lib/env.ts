import * as z from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  EXPO_PUBLIC_SECRET_MESSAGE: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error);
}

export const env = parsedEnv.data!;
