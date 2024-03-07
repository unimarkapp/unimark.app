import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sessions, users } from "./schema.js";

const pool = new pg.Pool({
  database: "bookmark",
  host: "localhost",
  user: "postgres",
  password: "postgres",
});

export const db = drizzle(pool, { schema: { sessions, users } });
