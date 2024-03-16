import { z } from "zod";
import { authedProcedure, t } from "../trpc.js";
import { db } from "../db/index.js";
import { and, eq } from "drizzle-orm";
import { bookmarksTags, tags } from "../db/schema.js";

const tagNameSchema = z
  .string()
  .min(2, "Tag name must be at least 2 characters");

export const tagsRouter = t.router({
  list: authedProcedure
    .input(z.object({ query: z.string().optional() }).optional())
    .query(async ({ ctx: { user } }) => {
      const list = await db.query.tags.findMany({
        where: eq(tags.ownerId, user.id),
        columns: { id: true, name: true },
      });

      return list;
    }),
  create: authedProcedure
    .input(tagNameSchema)
    .mutation(async ({ ctx: { user }, input }) => {
      const [tag] = await db
        .insert(tags)
        .values({ name: input, ownerId: user.id })
        .returning({ id: tags.id, name: tags.name });

      return tag;
    }),
  createAndTag: authedProcedure
    .input(
      z.object({
        name: tagNameSchema,
        bookmarkId: z.string(),
      })
    )
    .mutation(async ({ ctx: { user }, input }) => {
      const [tag] = await db
        .insert(tags)
        .values({ name: input.name, ownerId: user.id })
        .returning({ id: tags.id, name: tags.name });

      await db
        .insert(bookmarksTags)
        .values({ tagId: tag.id, bookmarkId: input.bookmarkId });

      return tag;
    }),
  delete: authedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { user }, input }) => {
      await db.delete(bookmarksTags).where(eq(bookmarksTags.tagId, input));
      await db
        .delete(tags)
        .where(and(eq(tags.id, input), eq(tags.ownerId, user.id)));
    }),
});
