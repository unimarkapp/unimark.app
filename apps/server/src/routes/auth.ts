import { z } from "zod";
import { authedProcedure, t } from "../trpc.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { lucia } from "../auth/index.js";
import { TRPCError } from "@trpc/server";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";

export const authRouter = t.router({
  login: t.procedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const profile = await db.query.users.findFirst({
        where: eq(users.email, input.email),
        columns: {
          password: false,
        },
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const session = await lucia.createSession(profile.id, {});

      const cookies = lucia.createSessionCookie(session.id);

      ctx.res.setHeader("Set-Cookie", cookies.serialize());

      return { success: true };
    }),
  register: t.procedure
    .input(
      z.object({
        email: z
          .string()
          .min(1, "Email is required.")
          .email("Please enter a valid email."),
        password: z.string().min(8, "Password must be at least 8 characters."),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const hashedPassword = await new Argon2id().hash(input.password);
        const userId = generateId(15);

        const [user] = await db
          .insert(users)
          .values({ id: userId, ...input, password: hashedPassword })
          .returning();

        const session = await lucia.createSession(user.id, {});

        const cookies = lucia.createSessionCookie(session.id);

        ctx.res.setHeader("Set-Cookie", cookies.serialize());

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something goes wrong. Please try again later.",
        });
      }
    }),
  confirm: authedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.code !== "1234") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid code" });
      }

      await db
        .update(users)
        .set({ isEmailVerified: true })
        .where(eq(users.id, ctx.user.id));

      return { success: true };
    }),
  logout: t.procedure.mutation(async ({ ctx }) => {
    const cookies = lucia.createBlankSessionCookie();

    ctx.res.setHeader("Set-Cookie", cookies.serialize());

    return { success: true };
  }),
});
