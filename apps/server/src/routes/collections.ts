import { eq, sql, getTableColumns, count, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { authedProcedure, t } from "../trpc.js";
import { bookmarks, collections } from "../db/schema.js";
import { z } from "zod";

export const collectionsRouter = t.router({
  list: authedProcedure.query(async ({ ctx: { user } }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const list = await db
      .select({
        ...getTableColumns(collections),
        bookmarksCount: sql<number>`count(${bookmarks.id})`,
      })
      .from(collections)
      .leftJoin(bookmarks, eq(bookmarks.collectionId, collections.id))
      .groupBy(collections.id);

    return list;
  }),
  create: authedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx: { user }, input }) => {
      const [collection] = await db
        .insert(collections)
        .values({ ...input, ownerId: user.id })
        .returning();

      return collection;
    }),
});
