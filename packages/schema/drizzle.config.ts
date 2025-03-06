import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
console.log("Loaded ENV:", process.env.EXPO_PUBLIC_SUPABASE_URL);

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle", // Migrations will be generated in packages/schema/drizzle
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config);
