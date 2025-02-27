import { NextFunction, Request, Response } from "express";
import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

import * as schema from "@/drizzle/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferResultType<
  TableName extends keyof TSchema,
  QBConfig extends QueryConfig<TableName> = {}
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export interface AppConfig {
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
}

export interface ValidatorFactoryReturn<T> {
  validator: (req: Request, res: Response, next: NextFunction) => void;
}

export interface AsyncHandlerReturn<T> {
  statusCode: number;
  data?: T;
}
