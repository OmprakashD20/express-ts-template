import { NextFunction, Request, Response } from "express";
import * as z from "zod";

import { NotificationPreferenceEnumSchema } from "@/constants/enums";
import type { InferResultType } from "@/types/drizzle";

// Utilities
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Enums
export type NotificationPreference = z.infer<typeof NotificationPreferenceEnumSchema>;

// Tables
export type User = InferResultType<"User">;
export type Session = InferResultType<"Session">;

// Configs
export type AppConfig = {
  env: {
    PORT: number;
    NODE_ENV: string;
    DATABASE_URL: string;
    PROD_ORIGINS: string[];
  };
  logs: {
    datePattern: string;
    maxSize: string;
    maxFiles?: string;
    zippedArchive: boolean;
  };
};

// Return Types
export type ValidatorFactoryReturn<T> = {
  validator: (req: Request, res: Response, next: NextFunction) => void;
};

export type AsyncHandlerReturn<T> = {
  statusCode: number;
  data?: T;
};

export type ValidateSessionReturn =
  | { session: Session; user: User }
  | { session: null; user: null };

export { InferResultType } from "./drizzle";
