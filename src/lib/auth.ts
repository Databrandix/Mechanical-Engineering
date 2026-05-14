import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { APIError } from 'better-auth/api';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

const BCRYPT_ROUNDS = 12;

export const auth = betterAuth({
  // `prisma` is the Prisma Client Extension–extended client (see ./db.ts).
  // Its TS type is slightly wider than the bare PrismaClient that
  // prismaAdapter's signature expects; runtime behavior is identical.
  database: prismaAdapter(
    prisma as unknown as Parameters<typeof prismaAdapter>[0],
    { provider: 'postgresql' },
  ),

  // Email + password only. Every other auth surface is OFF.
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    disableSignUp: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    // bcryptjs per spec. Verified placement: create-context.mjs:179-180
    password: {
      hash: async (password: string) => bcrypt.hash(password, BCRYPT_ROUNDS),
      verify: async ({ hash, password }: { hash: string; password: string }) =>
        bcrypt.compare(password, hash),
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  // Block sign-in for inactive users; update lastLoginAt after success.
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { isActive: true },
          });
          if (!user?.isActive) {
            throw new APIError('FORBIDDEN', {
              message: 'Account is inactive. Contact a super-admin.',
            });
          }
        },
        after: async (session) => {
          await prisma.user.update({
            where: { id: session.userId },
            data: { lastLoginAt: new Date() },
          });
        },
      },
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});

export type AuthSession = typeof auth.$Infer.Session;
