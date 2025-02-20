import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: "./env" });

export default defineConfig({
  schema: "./src/game.ts",
  out: "./drizzle", // Migrations will be generated in packages/schema/drizzle
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config);
