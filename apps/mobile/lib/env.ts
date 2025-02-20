import * as z from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  EXPO_PUBLIC_SUPABASE_API_URL: z.string(),
});

console.log(process.env);
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error);
}

export const env = parsedEnv.data!;
