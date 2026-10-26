import { PrismaClient } from "@prisma/client";
import path from "path";

// Adopt Vercel Postgres environment variables if standard DATABASE_URL is not provided
if (!process.env.DATABASE_URL) {
  const vercelDb =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.PRISMA_DATABASE_URL;
  if (vercelDb) {
    process.env.DATABASE_URL = vercelDb;
  }
}

// If using local SQLite on Vercel or serverless, ensure path resolves to bundled dev.db
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:")) {
  const sqliteFile = path.join(process.cwd(), "prisma", "dev.db");
  process.env.DATABASE_URL = `file:${sqliteFile}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
