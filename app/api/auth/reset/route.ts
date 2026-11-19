import { z } from "zod";
import { isResetTokenValid, setPassword, MIN_PASSWORD_LENGTH } from "@/lib/auth/password";

const resetSchema = z.object({
  token: z.string().trim().min(1, "Reset token is missing.").max(500),
  password: z.string().min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`).max(200),
});

/**
 * POST /api/auth/reset  { token, password }
 * Verifies the emailed token and stores the new password (bcrypt) in MongoDB.
 */
export async function POST(request: Request) {
  if (!process.env.MONGODB_URI) {
    return Response.json({ error: "Password reset is not available on this server." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 422 });

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) return Response.json({ error: "Admin login is not configured on the server." }, { status: 500 });

  try {
    const { token, password } = parsed.data;
    if (!(await isResetTokenValid(adminEmail, token))) {
      return Response.json({ error: "This reset link is invalid or has expired. Request a new one." }, { status: 400 });
    }
    await setPassword(adminEmail, password); // also clears the token so the link can't be reused
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[admin] password reset failed:", err);
    return Response.json({ error: "Could not reset the password. Please try again." }, { status: 500 });
  }
}
