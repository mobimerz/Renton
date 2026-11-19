import "server-only";
import { timingSafeEqual, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, type Session } from "./session";

export * from "./session";

const isDbConfigured = () => Boolean(process.env.MONGODB_URI);

/**
 * Single admin account identified by ADMIN_EMAIL. The password is either:
 *   - one set through the "forgot password" flow (a bcrypt hash stored in MongoDB), which
 *     takes precedence, or
 *   - ADMIN_PASSWORD env var: a bcrypt hash ("$2a$/$2b$/$2y$…", recommended — make one with
 *     `node scripts/hash-password.mjs`) or, if not a hash, the plain password (compared in
 *     constant time).
 */
export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error("ADMIN_EMAIL must be set");

  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());

  // A password set via /admin/forgot (stored in MongoDB) overrides ADMIN_PASSWORD.
  const storedHash = isDbConfigured() ? await (await import("./password")).getStoredPasswordHash(adminEmail) : null;

  let passwordOk: boolean;
  if (storedHash) {
    passwordOk = await bcrypt.compare(password, storedHash);
  } else {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) throw new Error("ADMIN_PASSWORD must be set (or reset the password via /admin/forgot)");
    passwordOk = /^\$2[aby]\$\d{2}\$/.test(adminPassword)
      ? await bcrypt.compare(password, adminPassword)
      : safeEqual(password, adminPassword);
  }
  return emailOk && passwordOk;
}

/** Constant-time string compare (hashing first makes the lengths equal). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** The current admin session from the request cookie, or null. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * For admin route handlers (second layer behind proxy.ts):
 *   const unauthorized = await requireAdmin(); if (unauthorized) return unauthorized;
 */
export async function requireAdmin(): Promise<Response | null> {
  return (await getSession()) ? null : Response.json({ error: "Unauthorized" }, { status: 401 });
}
