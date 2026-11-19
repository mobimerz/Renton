import { z } from "zod";
import { sendMail } from "@/lib/mail";
import { createResetToken, RESET_TOKEN_TTL_MS } from "@/lib/auth/password";

const forgotSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").max(200),
});

const FAIL_DELAY_MS = 500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Absolute origin of this request (works behind Vercel's proxy). */
function requestOrigin(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

/**
 * POST /api/auth/forgot  { email }
 * If the email is the admin and MongoDB is configured, emails a reset link.
 * Always answers the same way so the response never reveals whether an account exists.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 422 });

  const email = parsed.data.email.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  // Only act for the real admin address with a database to store the token; otherwise fall
  // through to the generic response. Never let an internal failure leak account existence.
  if (adminEmail && email === adminEmail && process.env.MONGODB_URI) {
    try {
      const token = await createResetToken(adminEmail);
      const link = `${requestOrigin(request)}/admin/reset/?token=${encodeURIComponent(token)}`;
      const minutes = Math.round(RESET_TOKEN_TTL_MS / 60000);
      await sendMail({
        to: adminEmail,
        subject: "Reset your Renton Admin password",
        text:
          `Someone requested a password reset for Renton Admin.\n\n` +
          `Open this link to set a new password (valid for ${minutes} minutes):\n${link}\n\n` +
          `If you didn't request this, you can ignore this email — your password stays the same.`,
        html:
          `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;color:#1e293b;line-height:1.6">` +
          `<h2 style="margin:0 0 12px;color:#0f172a">Reset your password</h2>` +
          `<p style="margin:0 0 16px">Someone requested a password reset for <strong>Renton Admin</strong>.</p>` +
          `<p style="margin:0 0 20px"><a href="${link}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Set a new password</a></p>` +
          `<p style="margin:0 0 8px;color:#64748b;font-size:13px">This link is valid for ${minutes} minutes. If the button doesn't work, copy this URL into your browser:</p>` +
          `<p style="margin:0 0 20px;word-break:break-all;font-size:13px"><a href="${link}" style="color:#1d4ed8">${link}</a></p>` +
          `<p style="margin:0;color:#64748b;font-size:13px">If you didn't request this, ignore this email — your password stays the same.</p>` +
          `</div>`,
      });
    } catch (err) {
      console.error("[admin] password reset email failed:", err);
    }
  } else {
    await sleep(FAIL_DELAY_MS); // keep the timing similar whether or not we sent an email
  }

  return Response.json({ ok: true });
}
