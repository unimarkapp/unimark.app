import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/database';
import { user, account, session, verification } from '@/database/schema';
import { sendVerificationEmail } from '@/shared/lib/resend';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user,
      account,
      session,
      verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail,
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
