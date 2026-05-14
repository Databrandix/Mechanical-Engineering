import { PrismaClient } from '@prisma/client';

// Strip `emailVerified` from any write to the `user` table.
// Schema deliberately omits the column; Better Auth's core would
// otherwise auto-inject `emailVerified: false` on every user create
// (defaultValue in node_modules/@better-auth/core/dist/db/get-tables.mjs:148).
// Prisma Client Extensions' `query` hook intercepts before Postgres.
// Docs: https://www.prisma.io/docs/orm/prisma-client/client-extensions/query
function stripEmailVerified<T>(data: T): T {
  if (data && typeof data === 'object' && 'emailVerified' in data) {
    const { emailVerified: _ignored, ...rest } = data as Record<string, unknown>;
    return rest as T;
  }
  return data;
}

const basePrismaClient = () =>
  new PrismaClient().$extends({
    name: 'strip-email-verified',
    query: {
      user: {
        async create({ args, query }) {
          args.data = stripEmailVerified(args.data);
          return query(args);
        },
        async update({ args, query }) {
          args.data = stripEmailVerified(args.data);
          return query(args);
        },
        async updateMany({ args, query }) {
          args.data = stripEmailVerified(args.data);
          return query(args);
        },
        async upsert({ args, query }) {
          args.create = stripEmailVerified(args.create);
          args.update = stripEmailVerified(args.update);
          return query(args);
        },
      },
    },
  });

type ExtendedPrismaClient = ReturnType<typeof basePrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: ExtendedPrismaClient;
};

export const prisma: ExtendedPrismaClient =
  globalForPrisma.prisma ?? basePrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
