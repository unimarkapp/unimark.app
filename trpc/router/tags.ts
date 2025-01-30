import { z } from 'zod';
import { protectedProcedure } from '@/trpc/trpc';
import { db } from '@/database';
import { and, desc, eq, sql } from 'drizzle-orm';
import { bookmarkTag, tag } from '@/database/schema';

const tagNameSchema = z.string().min(2, 'Tag name must be at least 2 characters');

export const tagsRouter = {
  list: protectedProcedure.input(z.object({ query: z.string().optional() }).optional()).query(
    async ({
      ctx: {
        session: { user },
      },
    }) => {
      const list = await db
        .select({
          id: tag.id,
          name: tag.name,
          count: sql<number>`count(${bookmarkTag.bookmarkId})`,
        })
        .from(tag)
        .where(eq(tag.ownerId, user.id))
        .leftJoin(bookmarkTag, and(eq(bookmarkTag.tagId, tag.id)))
        .groupBy(tag.id)
        .orderBy(desc(sql`count`));

      return list;
    },
  ),
  create: protectedProcedure.input(tagNameSchema).mutation(
    async ({
      ctx: {
        session: { user },
      },
      input,
    }) => {
      const [createdTag] = await db
        .insert(tag)
        .values({ name: input, ownerId: user.id })
        .returning({ id: tag.id, name: tag.name });

      return createdTag;
    },
  ),
  createAndTag: protectedProcedure
    .input(
      z.object({
        name: tagNameSchema,
        bookmarkId: z.string(),
      }),
    )
    .mutation(
      async ({
        ctx: {
          session: { user },
        },
        input,
      }) => {
        const [createdTag] = await db
          .insert(tag)
          .values({ name: input.name, ownerId: user.id })
          .returning({ id: tag.id, name: tag.name });

        await db.insert(bookmarkTag).values({ tagId: createdTag.id, bookmarkId: input.bookmarkId });

        return tag;
      },
    ),
  delete: protectedProcedure.input(z.string()).mutation(
    async ({
      ctx: {
        session: { user },
      },
      input,
    }) => {
      await db.delete(bookmarkTag).where(eq(bookmarkTag.tagId, input));
      await db.delete(tag).where(and(eq(tag.id, input), eq(tag.ownerId, user.id)));
    },
  ),
};
