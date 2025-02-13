import { organization, member } from '@/database/schema';
import { protectedProcedure } from '@/trpc/trpc';
import { eq } from 'drizzle-orm';

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
};
