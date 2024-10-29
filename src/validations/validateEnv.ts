import "dotenv/config";

import { Static, Type } from "@sinclair/typebox";

import ValidatorFactory from "@/validations";

const EnvSchema = Type.Object({
  PORT: Type.Number(),
  NODE_ENV: Type.Union([
    Type.Literal("development"),
    Type.Literal("production"),
    Type.Literal("staging"),
  ]),
  DB_URL: Type.String(),
});

type EnvSchemaType = Static<typeof EnvSchema>;

export default function validateEnv(): EnvSchemaType {
  const env: EnvSchemaType = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 8000,
    NODE_ENV: process.env.NODE_ENV as EnvSchemaType["NODE_ENV"],
    DB_URL: process.env.DB_URL!,
  };

  const { validate } = ValidatorFactory<EnvSchemaType>(EnvSchema);

  const data = validate(env);

  return data;
}
