import "dotenv/config";

import validateEnv from "@/validations/validateEnv";

import { AppConfig } from "@/types";

const env = validateEnv();

const config: AppConfig = {
  env,
  logs: {
    datePattern: "DD-MM-YYYY",
    maxSize: "20m",
    zippedArchive: true,
  },
};

export default config;
