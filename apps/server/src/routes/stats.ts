import { authedProcedure, t } from "../trpc.js";
import { db } from "../db/index.js";
import { bookmarks } from "../db/schema.js";
import { count, eq, and, isNotNull, isNull } from "drizzle-orm";

export const statsRouter = t.router({
  all: authedProcedure.query(async ({ ctx: { user } }) => {
    const [bookmarksData] = await db
      .select({ count: count(bookmarks) })
      .from(bookmarks)
      .where(and(eq(bookmarks.ownerId, user.id), isNull(bookmarks.deletedAt)));

    const [deletedData] = await db
      .select({ count: count(bookmarks) })
      .from(bookmarks)
      .where(
        and(eq(bookmarks.ownerId, user.id), isNotNull(bookmarks.deletedAt))
      );

    return {
      bookmarks: bookmarksData.count,
      deleted: deletedData.count,
    };
  }),
});
