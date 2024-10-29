import "dotenv/config";

import validateEnv from "@/validations/validateEnv";

import { AppConfig } from "@/types";

const env = validateEnv();

const config: AppConfig = {
  env,
};

export default config;
