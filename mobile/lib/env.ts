import * as z from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  EXPO_PUBLIC_SECRET_MESSAGE: z.string(),
});

console.log(process.env);
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error);
  throw new Error("Invalid environment variables");
}

export const env: z.infer<typeof envSchema> = parsedEnv.data as z.infer<typeof envSchema>;
