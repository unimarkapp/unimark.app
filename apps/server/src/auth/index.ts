import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "../db/index.js";
import { users, sessions } from "../db/schema.js";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

const isProd = process.env.NODE_ENV === "production";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      domain: isProd ? process.env.DOMAIN : "localhost",
      secure: isProd,
    },
  },
  getUserAttributes(attributes) {
    return {
      email: attributes.email,
      isEmailVerified: attributes.isEmailVerified,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">;
  }
}

export interface DatabaseUser {
  id: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
}
