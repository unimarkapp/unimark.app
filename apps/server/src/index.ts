import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { getCookie } from "hono/cookie";
import { db } from "./db";
import { lucia } from "./lucia";
import { eq } from "drizzle-orm";
import { users } from "./schema";
import type { Session, User } from "lucia";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

app.use(
  "/*",
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.post("/api/v1/login", async (c) => {
  const payload = await c.req.json();

  const profile = await db.query.users.findFirst({
    where: eq(users.email, payload.email),
    columns: {
      password: false,
    },
  });

  if (!profile) {
    return c.json({ error: "User not found" }, { status: 404 });
  }

  const session = await lucia.createSession(profile.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  c.header("Set-Cookie", sessionCookie.serialize(), {
    append: true,
  });

  return c.json({ profile });
});

app.use("*", async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  c.set("user", user);
  c.set("session", session);
  return next();
});

app.get("/api/v1/profile", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const user = c.get("user");

  if (!user) {
    return c.json({ message: "Must be logged in" }, { status: 401 });
  }

  return c.json({ profile: user });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
