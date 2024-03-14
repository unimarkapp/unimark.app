import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    user: "postgres",
    host: "localhost",
    database: "bookmark",
    password: "postgres",
  },
} satisfies Config;
