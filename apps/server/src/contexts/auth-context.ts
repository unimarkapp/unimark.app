import { parseCookies } from "oslo/cookie";
import { lucia } from "../auth/index.js";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";

export async function authContext({ req, res }: CreateHTTPContextOptions) {
  if (!req.headers.cookie) {
    return { user: null, session: null };
  }

  const cookies = parseCookies(req.headers.cookie);

  const sessionId = cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    return { user: null, session: null };
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    res.setHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
  }

  if (!session) {
    res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }

  return { session, user };
}
