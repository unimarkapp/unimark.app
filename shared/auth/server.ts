import { betterAuth, generateId } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/database';
import {
  user,
  account,
  session,
  verification,
  member,
  organization,
  invitation,
} from '@/database/schema';
import { sendInvitationEmail, sendVerificationEmail } from '@/shared/lib/resend';
import { nextCookies } from 'better-auth/next-js';
import { organization as orgs } from 'better-auth/plugins';
import { and, eq } from 'drizzle-orm';

export const auth = betterAuth({
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      account,
      session,
      verification,
      member,
      organization,
      invitation,
    },
  }),
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const [org] = await db
            .select({
              id: organization.id,
            })
            .from(member)
            .innerJoin(organization, eq(member.organizationId, organization.id))
            .where(and(eq(member.userId, session.userId), eq(organization.default, true)));
          return {
            data: {
              ...session,
              activeOrganizationId: org.id,
            },
          };
        },
      },
    },
    user: {
      create: {
        after: async (user) => {
          const [org] = await db
            .insert(organization)
            .values({
              id: generateId(),
              name: 'Personal',
              slug: 'personall',
              default: true,
              createdAt: new Date(),
            })
            .returning();
          await db.insert(member).values({
            id: generateId(),
            organizationId: org.id,
            role: 'owner',
            userId: user.id,
            createdAt: new Date(),
          });
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [
    nextCookies(),
    orgs({
      sendInvitationEmail: (data) => {
        const url = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;
        return sendInvitationEmail({ ...data, url });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
