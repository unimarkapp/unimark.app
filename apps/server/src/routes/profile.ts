import { authedProcedure, t } from "../trpc.js";

export const profileRouter = t.router({
  get: authedProcedure.query(async ({ ctx: { user } }) => {
    return user;
  }),
});
