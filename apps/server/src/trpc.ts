import { TRPCError, initTRPC } from "@trpc/server";
import type { AuthContext } from "./contexts/create-context.js";

export const t = initTRPC.context<AuthContext>().create();

const middleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const authedProcedure = t.procedure.use(middleware);
