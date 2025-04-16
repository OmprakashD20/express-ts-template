import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";

import * as schema from "@/drizzle/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

type TSchema = ExtractTablesWithRelations<typeof schema>;
type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferResultType<
  TableName extends keyof TSchema,
  QBConfig extends QueryConfig<TableName> = Record<string, unknown>
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;
