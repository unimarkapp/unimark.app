import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  countDistinct,
  getTableColumns,
  sql,
} from "drizzle-orm";
import { db } from "../db/index.js";
import { bookmarks, bookmarksTags, tags } from "../db/schema.js";
import { authedProcedure, t } from "../trpc.js";
import { parser } from "../services/parser.js";
import { z } from "zod";

const bookmarkInputSchema = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string().optional(),
  cover: z.string().optional(),
  favicon: z.string().optional(),
});

export const bookmarksRouter = t.router({
  list: authedProcedure
    .input(
      z.object({
        query: z.string().optional(),
        tags: z.array(z.string()).optional(),
        deleted: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(25),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx: { user }, input }) => {
      const list = await db
        .select({
          ...getTableColumns(bookmarks),
          tags: sql<
            { id: string; name: string }[]
          >`array_agg(json_build_object('id', ${tags.id}, 'name', ${tags.name}))`,
        })
        .from(bookmarks)
        .leftJoin(bookmarksTags, eq(bookmarks.id, bookmarksTags.bookmarkId))
        .leftJoin(tags, eq(bookmarksTags.tagId, tags.id))
        .where(
          inArray(
            bookmarks.id,
            db
              .select({
                id: bookmarks.id,
              })
              .from(bookmarks)
              .leftJoin(
                bookmarksTags,
                eq(bookmarks.id, bookmarksTags.bookmarkId)
              )
              .leftJoin(tags, eq(bookmarksTags.tagId, tags.id))
              .where(
                and(
                  eq(bookmarks.ownerId, user.id),
                  input.query
                    ? ilike(bookmarks.title, `%${input.query}%`)
                    : undefined,
                  input.tags?.length
                    ? inArray(tags.name, input.tags)
                    : undefined,
                  input.cursor ? lt(bookmarks.cursor, input.cursor) : undefined,
                  input.deleted
                    ? isNotNull(bookmarks.deletedAt)
                    : isNull(bookmarks.deletedAt)
                )
              )
              .groupBy(bookmarks.id)
              .having(
                input.tags?.length
                  ? eq(countDistinct(tags.name), input.tags.length)
                  : undefined
              )
          )
        )
        .limit(input.limit)
        .orderBy(desc(bookmarks.cursor))
        .groupBy(bookmarks.id);

      return {
        bookmarks: list.map((bookmark) => ({
          ...bookmark,
          tags: bookmark.tags.filter((tag) => tag.id && tag.name),
        })),
        nextCursor: list.length ? list[list.length - 1].cursor : null,
      };
    }),
  create: authedProcedure
    .input(bookmarkInputSchema)
    .mutation(async ({ ctx: { user }, input }) => {
      const [bookmark] = await db
        .insert(bookmarks)
        .values({ ...input, ownerId: user.id })
        .returning();

      return bookmark;
    }),
  import: authedProcedure
    .input(z.array(z.object({ url: z.string() })))
    .mutation(async ({ ctx: { user }, input }) => {
      const importedBookmarks = await Promise.all(
        input.map(async (bookmarkData) => {
          const parsedBookmarkData = await parser(bookmarkData.url);
          return { ...bookmarkData, ...parsedBookmarkData, ownerId: user.id };
        })
      );

      await db.insert(bookmarks).values(importedBookmarks).returning();
    }),
  update: authedProcedure
    .input(bookmarkInputSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [bookmark] = await db
        .update(bookmarks)
        .set(input)
        .where(eq(bookmarks.id, input.id))
        .returning();

      return bookmark;
    }),
  parse: authedProcedure
    .input(z.object({ url: z.string() }))
    .mutation(async ({ input }) => {
      const data = await parser(input.url);

      return data;
    }),
  tag: authedProcedure
    .input(z.object({ bookmarkId: z.string(), tagId: z.string() }))
    .mutation(async ({ input }) => {
      const data = await db
        .insert(bookmarksTags)
        .values({ bookmarkId: input.bookmarkId, tagId: input.tagId });

      return data;
    }),
  untag: authedProcedure
    .input(z.object({ bookmarkId: z.string(), tagId: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(bookmarksTags)
        .where(
          and(
            eq(bookmarksTags.bookmarkId, input.bookmarkId),
            eq(bookmarksTags.tagId, input.tagId)
          )
        );
    }),
  restore: authedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx: { user }, input }) => {
      await db
        .update(bookmarks)
        .set({ deletedAt: null })
        .where(
          and(inArray(bookmarks.id, input), eq(bookmarks.ownerId, user.id))
        );
    }),
  moveToTrash: authedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { user }, input }) => {
      await db
        .update(bookmarks)
        .set({ deletedAt: new Date() })
        .where(and(eq(bookmarks.id, input), eq(bookmarks.ownerId, user.id)));
    }),
  deleteForever: authedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx: { user }, input }) => {
      await db
        .delete(bookmarks)
        .where(
          and(inArray(bookmarks.id, input), eq(bookmarks.ownerId, user.id))
        );
    }),
  emptyTrash: authedProcedure.mutation(async ({ ctx: { user } }) => {
    await db
      .delete(bookmarks)
      .where(
        and(isNotNull(bookmarks.deletedAt), eq(bookmarks.ownerId, user.id))
      );
  }),
});
