import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { AdminAuth } from "@/lib/models/AdminAuth";

/** How long an emailed reset link stays valid. */
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
/** Minimum length for a new admin password. */
export const MIN_PASSWORD_LENGTH = 8;

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const normalise = (email: string) => email.trim().toLowerCase();

/**
 * The password hash set via the reset flow, or null to fall back to ADMIN_PASSWORD.
 * Requires MONGODB_URI; callers guard with isDbConfigured().
 */
export async function getStoredPasswordHash(email: string): Promise<string | null> {
  await connectDB();
  const doc = await AdminAuth.findOne({ email: normalise(email) }, { passwordHash: 1 }).lean();
  return doc?.passwordHash ?? null;
}

/** Hash and store a new admin password, clearing any pending reset token. */
export async function setPassword(email: string, password: string): Promise<void> {
  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);
  await AdminAuth.updateOne(
    { email: normalise(email) },
    { $set: { passwordHash, resetTokenHash: null, resetExpires: null } },
    { upsert: true },
  );
}

/**
 * Create a reset token for the admin, store only its hash + expiry, and return the raw
 * token to put in the emailed link.
 */
export async function createResetToken(email: string): Promise<string> {
  await connectDB();
  const token = randomBytes(32).toString("base64url");
  await AdminAuth.updateOne(
    { email: normalise(email) },
    { $set: { resetTokenHash: sha256(token), resetExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS) } },
    { upsert: true },
  );
  return token;
}

/**
 * True when `token` matches the admin's pending, unexpired reset token.
 * Does not consume it — setPassword() clears the token on success.
 */
export async function isResetTokenValid(email: string, token: string): Promise<boolean> {
  if (!token) return false;
  await connectDB();
  const doc = await AdminAuth.findOne({ email: normalise(email) }, { resetTokenHash: 1, resetExpires: 1 }).lean();
  if (!doc?.resetTokenHash || !doc.resetExpires) return false;
  if (doc.resetExpires.getTime() < Date.now()) return false;
  const a = Buffer.from(sha256(token), "hex");
  const b = Buffer.from(doc.resetTokenHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
