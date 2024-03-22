import { authedProcedure, t } from "../trpc.js";
import { db } from "../db/index.js";
import { bookmarks } from "../db/schema.js";
import { count, eq } from "drizzle-orm";

export const statsRouter = t.router({
  all: authedProcedure.query(async ({ ctx: { user } }) => {
    const [bookmarksData] = await db
      .select({ count: count(bookmarks) })
      .from(bookmarks)
      .where(eq(bookmarks.ownerId, user.id));

    return {
      bookmarks: bookmarksData.count,
    };
  }),
});
