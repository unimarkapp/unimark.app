import { authedProcedure, t } from "../trpc.js";

export const profileRouter = t.router({
  get: authedProcedure.query(async ({ ctx: { user } }) => {
    await new Promise((resolve) => setTimeout(resolve, 350));

    return user;
  }),
});
