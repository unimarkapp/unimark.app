import { organization, member, user } from '@/database/schema';
import { protectedProcedure } from '@/trpc/trpc';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const worksapceRouter = {
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: organization.id,
        name: organization.name,
        default: organization.default,
        role: member.role,
      })
      .from(member)
      .innerJoin(organization, eq(member.organizationId, organization.id))
      .where(eq(member.userId, ctx.session.user.id));
  }),
  members: protectedProcedure
    .input(z.object({ organizationId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          memberId: member.id,
          userId: user.id,
          createdAt: member.createdAt,
          role: member.role,
          name: user.name,
        })
        .from(member)
        .innerJoin(user, eq(member.userId, user.id))
        .where(eq(member.organizationId, input.organizationId));
    }),
};
