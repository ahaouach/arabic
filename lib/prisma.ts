import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton.
 *
 * In development, Next.js hot-reloads modules on every change, which would
 * create a new PrismaClient instance on each reload and exhaust the database
 * connection pool. We attach the client to the Node.js global object so it
 * survives hot-reloads in development only.
 *
 * In production there is no hot-reload, so a module-level singleton is fine.
 */

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
