import "dotenv/config";

import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.number(),
  NODE_ENV: z.enum(["development", "production", "staging"]),
  DATABASE_URL: z.string().url(),
});

type EnvSchemaType = z.infer<typeof EnvSchema>;

export default function validateEnv(): EnvSchemaType {
  const env: EnvSchemaType = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 8000,
    NODE_ENV: process.env.NODE_ENV as EnvSchemaType["NODE_ENV"],
    DATABASE_URL: process.env.DATABASE_URL!,
  };

  const result = EnvSchema.safeParse(env);

  if (!result.success) {
    const missingKeys = result.error.errors
      .filter(
        (err) => err.code === "invalid_type" && err.received === "undefined"
      )
      .map((err) => err.path.join("."));

    const errorMessage =
      missingKeys.length === 1
        ? `Missing Env Variable: ${missingKeys[0]}`
        : `Missing Env Variables: ${missingKeys.join(", ")}`;

    throw new Error(errorMessage);
  }

  return env;
}
