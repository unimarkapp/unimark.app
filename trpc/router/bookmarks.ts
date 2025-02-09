import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  countDistinct,
  getTableColumns,
  sql,
  or,
  lt,
} from 'drizzle-orm';
import { db } from '@/database';
import { bookmark, bookmarkTag, tag } from '@/database/schema';
import { protectedProcedure } from '@/trpc/trpc';
import { z } from 'zod';
import { parser } from '@/shared/lib/parser';

const bookmarkInputSchema = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string().optional(),
  cover: z.string().optional(),
  favicon: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const bookmarksRouter = {
  list: protectedProcedure
    .input(
      z.object({
        query: z.string().nullable(),
        tags: z.array(z.string()).nullable(),
        deleted: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(25),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      }),
    )
    .query(
      async ({
        ctx: {
          session: { user },
        },
        input,
      }) => {
        const list = await db
          .select({
            ...getTableColumns(bookmark),
            tags: sql<
              { id: string; name: string }[]
            >`array_agg(json_build_object('id', ${tag.id}, 'name', ${tag.name}))`,
          })
          .from(bookmark)
          .leftJoin(bookmarkTag, eq(bookmark.id, bookmarkTag.bookmarkId))
          .leftJoin(tag, eq(bookmarkTag.tagId, tag.id))
          .where(
            inArray(
              bookmark.id,
              db
                .select({
                  id: bookmark.id,
                })
                .from(bookmark)
                .leftJoin(bookmarkTag, eq(bookmark.id, bookmarkTag.bookmarkId))
                .leftJoin(tag, eq(bookmarkTag.tagId, tag.id))
                .where(
                  and(
                    eq(bookmark.ownerId, user.id),
                    input.query ? ilike(bookmark.title, `%${input.query}%`) : undefined,
                    input.tags?.length ? inArray(tag.name, input.tags) : undefined,
                    input.cursor
                      ? or(
                          lt(bookmark.createdAt, input.cursor.createdAt),
                          and(
                            eq(bookmark.createdAt, input.cursor.createdAt),
                            lt(bookmark.id, input.cursor.id),
                          ),
                        )
                      : undefined,
                    input.deleted ? isNotNull(bookmark.deletedAt) : isNull(bookmark.deletedAt),
                  ),
                )
                .groupBy(bookmark.id)
                .having(
                  input.tags?.length ? eq(countDistinct(tag.name), input.tags.length) : undefined,
                ),
            ),
          )
          .limit(input.limit + 1)
          .orderBy(desc(bookmark.createdAt), desc(bookmark.id))
          .groupBy(bookmark.id);

        let nextCursor = null;
        if (list.length > input.limit) {
          nextCursor = {
            id: list[list.length - 2].id,
            createdAt: list[list.length - 2].createdAt,
          };
          list.pop();
        }

        return {
          bookmarks: list.map((bookmark) => ({
            ...bookmark,
            tags: bookmark.tags.filter((tag) => tag.id && tag.name),
          })),
          nextCursor,
        };
      },
    ),
  create: protectedProcedure.input(bookmarkInputSchema).mutation(
    async ({
      ctx: {
        session: { user },
      },
      input,
    }) => {
      const { tags: tagsToAttach } = input;

      const [createdBookmark] = await db
        .insert(bookmark)
        .values({ ...input, ownerId: user.id })
        .returning();

      if (tagsToAttach?.length) {
        const createdTags = await db
          .insert(tag)
          .values(tagsToAttach.map((name) => ({ name, ownerId: user.id })))
          .onConflictDoNothing()
          .returning();

        const createdTagNames = new Set(createdTags.map((tag) => tag.name));

        const existingTags = await db
          .select()
          .from(tag)
          .where(
            and(
              eq(tag.ownerId, user.id),
              inArray(
                tag.name,
                tagsToAttach.filter((t) => !createdTagNames.has(t)),
              ),
            ),
          );

        const allTags = [...createdTags, ...existingTags];

        if (allTags.length) {
          await db.insert(bookmarkTag).values(
            allTags.map((tag) => ({
              bookmarkId: createdBookmark.id,
              tagId: tag.id,
            })),
          );
        }
      }

      return createdBookmark;
    },
  ),
  import: protectedProcedure.input(z.array(z.object({ url: z.string() }))).mutation(
    async ({
      ctx: {
        session: { user },
      },
      input,
    }) => {
      const importedBookmarks = await Promise.all(
        input.map(async (bookmarkData) => {
          const parsedBookmarkData = await parser(bookmarkData.url);
          return { ...bookmarkData, ...parsedBookmarkData, ownerId: user.id };
        }),
      );

      await db.insert(bookmark).values(importedBookmarks).returning();
    },
  ),
  update: protectedProcedure
    .input(bookmarkInputSchema.extend({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [updatedBookmark] = await db
        .update(bookmark)
        .set(input)
        .where(eq(bookmark.id, input.id))
        .returning();

      return updatedBookmark;
    }),
  parse: protectedProcedure.input(z.object({ url: z.string() })).mutation(async ({ input }) => {
    const data = await parser(input.url);
    return data;
  }),
  tag: protectedProcedure
    .input(z.object({ bookmarkId: z.string(), tagId: z.string() }))
    .mutation(async ({ input }) => {
      const data = await db
        .insert(bookmarkTag)
        .values({ bookmarkId: input.bookmarkId, tagId: input.tagId });

      return data;
    }),
  untag: protectedProcedure
    .input(z.object({ bookmarkId: z.string(), tagId: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(bookmarkTag)
        .where(
          and(eq(bookmarkTag.bookmarkId, input.bookmarkId), eq(bookmarkTag.tagId, input.tagId)),
        );
    }),
  restore: protectedProcedure.input(z.array(z.string())).mutation(
    async ({
      ctx: {
        session: { user },
      },
      input,
    }) => {
      await db
        .update(bookmark)
        .set({ deletedAt: null })
        .where(and(inArray(bookmark.id, input), eq(bookmark.ownerId, user.id)));
    },
  ),
  moveToTrash: protectedProcedure.input(z.string()).mutation(
    async ({
      ctx: {
        session: { user },
      },
      input,
    }) => {
      await db
        .update(bookmark)
        .set({ deletedAt: new Date() })
        .where(and(eq(bookmark.id, input), eq(bookmark.ownerId, user.id)));
    },
  ),
  deleteForever: protectedProcedure.input(z.array(z.string())).mutation(
    async ({
      ctx: {
        session: { user },
      },
      input,
    }) => {
      await db
        .delete(bookmark)
        .where(and(inArray(bookmark.id, input), eq(bookmark.ownerId, user.id)));
    },
  ),
  emptyTrash: protectedProcedure.mutation(
    async ({
      ctx: {
        session: { user },
      },
    }) => {
      await db
        .delete(bookmark)
        .where(and(isNotNull(bookmark.deletedAt), eq(bookmark.ownerId, user.id)));
    },
  ),
};
