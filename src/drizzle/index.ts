import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import config from "@/config";
import * as schema from "@/drizzle/schema";

const pool = new Pool({
  connectionString: config.env.DATABASE_URL,
});

const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
});

export default db;
