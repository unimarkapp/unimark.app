import { protectedProcedure } from '@/trpc/trpc';
import { db } from '@/database';
import { bookmark } from '@/database/schema';
import { count, eq, and, isNotNull, isNull } from 'drizzle-orm';

export const statsRouter = {
  all: protectedProcedure.query(
    async ({
      ctx: {
        session: { user },
      },
    }) => {
      const [bookmarksData] = await db
        .select({ count: count(bookmark) })
        .from(bookmark)
        .where(and(eq(bookmark.ownerId, user.id), isNull(bookmark.deletedAt)));

      const [deletedData] = await db
        .select({ count: count(bookmark) })
        .from(bookmark)
        .where(and(eq(bookmark.ownerId, user.id), isNotNull(bookmark.deletedAt)));

      return {
        bookmarks: bookmarksData.count,
        deleted: deletedData.count,
      };
    },
  ),
};
