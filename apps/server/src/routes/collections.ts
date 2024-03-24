import { eq, sql, getTableColumns, desc, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { authedProcedure, t } from "../trpc.js";
import { bookmarks, collections } from "../db/schema.js";
import { z } from "zod";

export const collectionsRouter = t.router({
  list: authedProcedure.query(async ({ ctx: { user } }) => {
    const list = await db
      .select({
        ...getTableColumns(collections),
        bookmarksCount: sql<number>`count(${bookmarks.id})`,
      })
      .from(collections)
      .where(eq(collections.ownerId, user.id))
      .leftJoin(bookmarks, eq(bookmarks.collectionId, collections.id))
      .groupBy(collections.id)
      .orderBy(desc(sql`count`));

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
  rename: authedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx: { user }, input }) => {
      const [collection] = await db
        .update(collections)
        .set({ name: input.name })
        .where(
          and(eq(collections.id, input.id), eq(collections.ownerId, user.id))
        )
        .returning();

      return collection;
    }),
  delete: authedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { user }, input }) => {
      await db
        .delete(collections)
        .where(
          and(eq(collections.id, input), eq(collections.ownerId, user.id))
        );

      return input;
    }),
});
