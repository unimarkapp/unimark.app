import { z } from "zod";
import { authedProcedure, t } from "../trpc.js";
import { db } from "../db/index.js";
import { bookmarks, bookmarksTags, tags, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { lucia } from "../auth/index.js";
import { TRPCError } from "@trpc/server";
import { Argon2id } from "oslo/password";
import { generateId } from "lucia";

export const authRouter = t.router({
  login: t.procedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input: { email, password }, ctx }) => {
      const profile = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!profile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials.",
        });
      }

      const isPasswordMatched = await new Argon2id().verify(
        profile.password,
        password
      );

      if (!isPasswordMatched) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid credentials.",
        });
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
        const hashedPassword = await new Argon2id().hash(input.password);
        const userId = generateId(15);

        const [user] = await db
          .insert(users)
          // TODO: Remove isEmailVerified when email verification is implemented
          .values({
            id: userId,
            ...input,
            password: hashedPassword,
            isEmailVerified: true,
          })
          .returning();

        // Add default tag
        const [tag] = await db
          .insert(tags)
          .values({ name: "website", ownerId: user.id })
          .returning();

        // Add default bookmark
        const [bookmark] = await db
          .insert(bookmarks)
          .values({
            title: "Unimark",
            url: "https://unimark.app",
            ownerId: user.id,
            cover: "https://unimark.app/og-image.png",
            favicon: "https://unimark.app/favicon.svg",
            description:
              "Unimark makes it easy to manage all of your bookmarks. Use our cloud or as a self-hosted and own your data.",
          })
          .returning();

        // Assign default tag to default bookmark
        await db.insert(bookmarksTags).values({
          bookmarkId: bookmark.id,
          tagId: tag.id,
        });

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
      // TODO: Implement email verification
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
    if (ctx.session) {
      await lucia.invalidateSession(ctx.session.id);
    }

    const cookies = lucia.createBlankSessionCookie();

    ctx.res.setHeader("Set-Cookie", cookies.serialize());

    return { success: true };
  }),
});
