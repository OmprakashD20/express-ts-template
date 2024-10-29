import "dotenv/config";

import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

const EnvSchema = Type.Object({
  PORT: Type.Number(),
  NODE_ENV: Type.Union([
    Type.Literal("development"),
    Type.Literal("production"),
    Type.Literal("staging"),
  ]),
  DATABASE_URL: Type.String({ format: "uri" }),
});

type EnvSchemaType = Static<typeof EnvSchema>;

export default function validateEnv(): EnvSchemaType {
  const env: EnvSchemaType = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 8000,
    NODE_ENV: process.env.NODE_ENV as EnvSchemaType["NODE_ENV"],
    DATABASE_URL: process.env.DATABASE_URL!,
  };

  const validator = TypeCompiler.Compile(EnvSchema);

  const isValid = validator.Check(env);

  if (!isValid) {
    const missingKeys = Object.keys(env).filter(
      (key) => env[key as keyof EnvSchemaType] === undefined
    );

    if (missingKeys.length === 1) {
      throw new Error(`Missing Env Variable: ${missingKeys[0]}`);
    } else if (missingKeys.length > 1) {
      throw new Error(`Missing Env Variables: ${missingKeys.join(", ")}`);
    }
  }

  return env;
}
