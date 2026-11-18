import "server-only";
import mongoose from "mongoose";

/**
 * One Mongoose connection per server instance.
 * On Vercel every warm serverless function reuses the cached connection instead of
 * opening a new one per request; in dev it survives hot reloads via globalThis.
 */
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongoose = globalThis as unknown as { __mongoose?: Cache };
const cache: Cache = (globalForMongoose.__mongoose ??= { conn: null, promise: null });

/** True while `next build` prerenders pages. */
export const isBuildPhase = () => process.env.NEXT_PHASE === "phase-production-build";

/**
 * During `next build` a database outage must not fail the deploy: callers fall back to the
 * built-in content and the page refreshes from MongoDB on its next revalidation.
 * At runtime errors are re-thrown, so ISR keeps serving the previous good page.
 */
export async function withBuildFallback<T>(run: () => Promise<T>, fallback: () => T, label: string): Promise<T> {
  try {
    return await run();
  } catch (err) {
    if (!isBuildPhase()) throw err;
    console.warn(`[db] ${label}: database unreachable during build, using built-in content (${(err as Error).message.slice(0, 120)})`);
    return fallback();
  }
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing environment variable MONGODB_URI");

  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 20_000,
  });

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null; // let the next request retry
    throw err;
  }
  return cache.conn;
}
