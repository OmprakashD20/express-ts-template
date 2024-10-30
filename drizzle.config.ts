import { defineConfig } from "drizzle-kit";

import config from "@/config";

export default defineConfig({
  out: "./src/drizzle/migrations/",
  schema: "./src/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
