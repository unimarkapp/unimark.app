import { protectedProcedure } from '@/trpc/trpc';

export const profileRouter = {
  get: protectedProcedure.query(
    async ({
      ctx: {
        session: { user },
      },
    }) => {
      return user;
    },
  ),
};
