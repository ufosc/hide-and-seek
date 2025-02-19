import * as z from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  EXPO_PUBLIC_SUPABASE_API_URL: z.string(),
});

// Temporary dummy values for testing
const dummyEnv = {
  EXPO_PUBLIC_SUPABASE_URL: "https://dummy.supabase.co",
  EXPO_PUBLIC_SUPABASE_ANON_KEY: "dummy-anon-key",
  EXPO_PUBLIC_SUPABASE_API_URL: "https://dummy-api.supabase.co",
};

const parsedEnv = envSchema.safeParse(dummyEnv);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error);
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
